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
  it('selects the India defaults and keeps Aadhaar Verification required', () => {
    const wrapper = mountCalculator()

    wrapper.vm.selectFlow('india')

    expect(wrapper.vm.selectedFlowIds).to.deep.equal(['india'])
    expect(wrapper.vm.selectedServiceIds).to.include.members([
      'aadhaar-face-match',
      'aadhaar-verification'
    ])
    expect(wrapper.vm.flows[0].services.find(service => service.id === 'aadhaar-verification').required).to.equal(true)
  })

  it('selects the Global defaults but leaves Age Verification opt-in', () => {
    const wrapper = mountCalculator()

    wrapper.vm.selectFlow('global')

    expect(wrapper.vm.selectedServiceIds).to.include.members([
      'verification-session',
      'passive-liveness',
      'document-verification',
      'consent-capture'
    ])
    expect(wrapper.vm.selectedServiceIds).not.to.include('age-verification')
  })

  it('selects all Business services and adds the required Global defaults for UBO', () => {
    const wrapper = mountCalculator()

    wrapper.vm.selectFlow('business')

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
    expect(wrapper.vm.isFlowLocked('global')).to.equal(true)
    expect(wrapper.vm.creditsPerVerification).to.equal(245)
    expect(wrapper.vm.estimatedVerifications).to.equal(35)
  })

  it('toggles optional services without changing required services', () => {
    const wrapper = mountCalculator()
    wrapper.vm.selectFlow('global')

    const documentVerification = wrapper.vm.flows[1].services.find(service => service.id === 'document-verification')
    const verificationSession = wrapper.vm.flows[1].services.find(service => service.id === 'verification-session')

    wrapper.vm.toggleService(documentVerification)
    expect(wrapper.vm.selectedServiceIds).not.to.include('document-verification')

    wrapper.vm.toggleService(documentVerification)
    expect(wrapper.vm.selectedServiceIds).to.include('document-verification')

    wrapper.vm.toggleService(verificationSession)
    expect(wrapper.vm.selectedServiceIds).to.include('verification-session')
  })

  it('keeps every Business service selected and disabled', () => {
    const wrapper = mountCalculator()
    wrapper.vm.selectFlow('business')
    const businessServices = wrapper.vm.flows[2].services

    businessServices.forEach(service => wrapper.vm.toggleService(service))

    expect(businessServices.every(service => service.required)).to.equal(true)
    expect(wrapper.vm.selectedServiceIds).to.include.members(businessServices.map(service => service.id))
    expect(wrapper.vm.isFlowLocked('global')).to.equal(true)
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
    wrapper.vm.selectFlow('india')

    wrapper.vm.saveConfiguration()

    expect(commits).to.have.length(1)
    expect(commits[0].type).to.equal('creditCalculatorStore/saveConfiguration')
    expect(commits[0].payload.selectedFlowIds).to.deep.equal(['india'])
    expect(commits[0].payload.selectedServiceIds).to.include.members([
      'aadhaar-face-match',
      'aadhaar-verification'
    ])
    expect(commits[0].payload.creditsPerVerification).to.equal(wrapper.vm.creditsPerVerification)
  })

  it('restores saved selections and repairs required dependencies', () => {
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

    expect(wrapper.vm.selectedFlowIds).to.deep.equal(['global', 'business'])
    expect(wrapper.vm.selectedServiceIds).to.include.members([
      'verification-session',
      'passive-liveness',
      'consent-capture',
      'business-data-capture',
      'ubo-verification',
      'aml-screening'
    ])
  })
})
