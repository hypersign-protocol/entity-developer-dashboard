import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import KycCreditCalculator from '@/components/credit/KycCreditCalculator.vue'

const mountCalculator = (options = {}) => shallowMount(KycCreditCalculator, {
  propsData: {
    remainingCredits: 8779,
    totalCredits: 10100
  },
  ...options
})

describe('KycCreditCalculator.vue', () => {
  it('selects the India defaults without making either service mandatory', () => {
    const wrapper = mountCalculator()

    wrapper.vm.updateSelection({
      selectedFlowIds: ['india'],
      selectedServiceIds: ['aadhaar-face-match', 'aadhaar-verification']
    })

    expect(wrapper.vm.selectedFlowIds).to.deep.equal(['india'])
    expect(wrapper.vm.selectedServiceIds).to.include.members([
      'aadhaar-face-match',
      'aadhaar-verification'
    ])
    expect(wrapper.vm.flows[0].services.every(service => !service.required)).to.equal(true)
  })

  it('selects the Global defaults but leaves Age Verification opt-in', () => {
    const wrapper = mountCalculator()

    wrapper.vm.updateSelection({
      selectedFlowIds: ['global'],
      selectedServiceIds: ['verification-session', 'passive-liveness', 'document-verification', 'consent-capture']
    })

    expect(wrapper.vm.selectedServiceIds).to.include.members([
      'verification-session',
      'passive-liveness',
      'document-verification',
      'consent-capture'
    ])
    expect(wrapper.vm.serviceCost(wrapper.vm.flows[1].services[0])).to.equal(5)
    expect(wrapper.vm.serviceCost(wrapper.vm.flows[1].services[2])).to.equal(40)
    expect(wrapper.vm.selectedServiceIds).not.to.include('age-verification')
  })

  it('selects all Business services and adds the dependent Global defaults for UBO', () => {
    const wrapper = mountCalculator()

    wrapper.vm.updateSelection({
      selectedFlowIds: ['global', 'business'],
      selectedServiceIds: [
        'verification-session',
        'passive-liveness',
        'document-verification',
        'consent-capture',
        'business-data-capture',
        'ubo-verification',
        'aml-screening'
      ],
      serviceQuantities: { 'ubo-verification': 1 }
    })

    expect(wrapper.vm.selectedFlowIds).to.include.members(['business', 'global'])
    expect(wrapper.vm.selectedServiceIds).to.include.members([
      'business-data-capture',
      'ubo-verification',
      'aml-screening',
      'verification-session',
      'passive-liveness',
      'document-verification',
      'consent-capture'
    ])
    expect(wrapper.vm.flows[2].services.find(service => service.id === 'ubo-verification').requiresFlowIds).to.include('global')
    expect(wrapper.vm.creditsPerVerification).to.equal(266)
    expect(wrapper.vm.estimatedVerifications).to.equal(33)
  })

  it('multiplies UBO and selected Global services by the UBO quantity', () => {
    const wrapper = mountCalculator()

    wrapper.vm.updateSelection({
      selectedFlowIds: ['global', 'business'],
      selectedServiceIds: [
        'verification-session',
        'passive-liveness',
        'document-verification',
        'consent-capture',
        'business-data-capture',
        'ubo-verification',
        'aml-screening'
      ],
      serviceQuantities: { 'ubo-verification': 3 }
    })

    expect(wrapper.vm.creditsPerVerification).to.equal(398)
    expect(wrapper.vm.estimatedVerifications).to.equal(22)
    expect(wrapper.vm.configurationSummary.title).to.equal('Up to 22 Business verifications')
    expect(wrapper.vm.configurationSummary.detail).to.equal('Each business verification includes 3 UBO verifications.')
  })

  it('summarizes a standalone identity flow using its selected services', () => {
    const wrapper = mountCalculator()
    wrapper.vm.updateSelection({
      selectedFlowIds: ['india'],
      selectedServiceIds: ['aadhaar-verification']
    })

    expect(wrapper.vm.configurationSummary.title).to.include('India Identity verifications')
    expect(wrapper.vm.configurationSummary.detail).to.equal('1 selected service per verification.')
  })

  it('prevents the next UBO quantity from exceeding available credits', () => {
    const wrapper = mountCalculator({
      propsData: { remainingCredits: 397, totalCredits: 10100 }
    })
    wrapper.vm.updateSelection({
      selectedFlowIds: ['global', 'business'],
      selectedServiceIds: [
        'verification-session',
        'passive-liveness',
        'document-verification',
        'consent-capture',
        'business-data-capture',
        'ubo-verification',
        'aml-screening'
      ],
      serviceQuantities: { 'ubo-verification': 2 }
    })
    const ubo = wrapper.vm.flows[2].services.find(service => service.id === 'ubo-verification')

    expect(wrapper.vm.creditsPerVerification).to.equal(332)
    expect(wrapper.vm.canIncreaseServiceQuantity(ubo, 3)).to.equal(false)
  })

  it('keeps every Business service optional', () => {
    const wrapper = mountCalculator()
    const businessServices = wrapper.vm.flows[2].services

    expect(businessServices.every(service => !service.required)).to.equal(true)
  })

  it('saves the selected configuration to the calculator store', () => {
    const commits = []
    const wrapper = mountCalculator({
      mocks: {
        $store: {
          getters: { 'creditCalculatorStore/getConfiguration': null },
          commit: (type, payload) => commits.push({ type, payload })
        }
      }
    })
    wrapper.vm.updateSelection({
      selectedFlowIds: ['india'],
      selectedServiceIds: ['aadhaar-face-match', 'aadhaar-verification']
    })

    wrapper.vm.saveConfiguration()

    expect(commits).to.have.length(1)
    expect(commits[0].type).to.equal('creditCalculatorStore/saveConfiguration')
    expect(commits[0].payload.selectedFlowIds).to.deep.equal(['india'])
    expect(commits[0].payload.selectedServiceIds).to.include.members([
      'aadhaar-face-match',
      'aadhaar-verification'
    ])
    expect(commits[0].payload.serviceQuantities).to.deep.equal({})
    expect(commits[0].payload.creditsPerVerification).to.equal(wrapper.vm.creditsPerVerification)
  })

  it('restores an empty Business selection without adding mandatory services', () => {
    const wrapper = mountCalculator({
      mocks: {
        $store: {
          getters: {
            'creditCalculatorStore/getConfiguration': {
              selectedFlowIds: ['business'],
              selectedServiceIds: []
            }
          },
          commit: () => {}
        }
      }
    })

    wrapper.vm.loadSavedConfiguration()

    expect(wrapper.vm.selectedFlowIds).to.deep.equal(['business'])
    expect(wrapper.vm.selectedServiceIds).to.deep.equal([])
  })

  it('restores Global only when the saved UBO service needs it', () => {
    const wrapper = mountCalculator({
      mocks: {
        $store: {
          getters: {
            'creditCalculatorStore/getConfiguration': {
              selectedFlowIds: ['business'],
              selectedServiceIds: ['ubo-verification'],
              serviceQuantities: { 'ubo-verification': 4 }
            }
          },
          commit: () => {}
        }
      }
    })

    wrapper.vm.loadSavedConfiguration()

    expect(wrapper.vm.selectedFlowIds).to.deep.equal(['global', 'business'])
    expect(wrapper.vm.selectedServiceIds).to.deep.equal(['ubo-verification'])
    expect(wrapper.vm.serviceQuantities).to.deep.equal({ 'ubo-verification': 4 })
  })
})
