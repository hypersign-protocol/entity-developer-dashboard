import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import VerificationFlowConfigurator from '@/components/credit/VerificationFlowConfigurator.vue'

const flows = [
  {
    id: 'global',
    title: 'Global',
    description: 'Global flow',
    icon: 'mdi-earth',
    services: [
      { id: 'session', title: 'Session', description: 'Session', icon: 'mdi-cellphone', required: true },
      { id: 'document', title: 'Document', description: 'Document', icon: 'mdi-file', defaultSelected: true }
    ]
  },
  {
    id: 'business',
    title: 'Business',
    description: 'Business flow',
    icon: 'mdi-domain',
    services: [
      {
        id: 'ubo',
        title: 'UBO',
        description: 'UBO',
        icon: 'mdi-account-group',
        required: true,
        quantitySelectable: true,
        defaultQuantity: 1,
        requiresFlowIds: ['global']
      }
    ]
  }
]

const mountConfigurator = (value = { selectedFlowIds: [], selectedServiceIds: [] }) => shallowMount(
  VerificationFlowConfigurator,
  { propsData: { flows, value } }
)

describe('VerificationFlowConfigurator.vue', () => {
  it('emits defaults and dependent flows from configuration data', () => {
    const wrapper = mountConfigurator()

    wrapper.vm.selectFlow('business')

    const selection = wrapper.emitted('input')[0][0]
    expect(selection.selectedFlowIds).to.include.members(['business', 'global'])
    expect(selection.selectedServiceIds).to.include.members(['ubo', 'session', 'document'])
    expect(selection.serviceQuantities).to.deep.equal({ ubo: 1 })
  })

  it('increments a selected service quantity and does not decrement below its minimum', () => {
    const value = {
      selectedFlowIds: ['global', 'business'],
      selectedServiceIds: ['session', 'document', 'ubo'],
      serviceQuantities: { ubo: 1 }
    }
    const wrapper = mountConfigurator(value)
    const ubo = flows[1].services[0]

    wrapper.vm.changeServiceQuantity(ubo, 1)
    expect(wrapper.emitted('input')[0][0].serviceQuantities).to.deep.equal({ ubo: 2 })

    wrapper.vm.changeServiceQuantity(ubo, -1)
    expect(wrapper.emitted('input')[1][0].serviceQuantities).to.deep.equal({ ubo: 1 })
  })

  it('blocks an increment when the configured quantity limit rejects it', () => {
    const value = {
      selectedFlowIds: ['global', 'business'],
      selectedServiceIds: ['session', 'document', 'ubo'],
      serviceQuantities: { ubo: 2 }
    }
    const wrapper = shallowMount(VerificationFlowConfigurator, {
      propsData: {
        flows,
        value,
        canIncreaseServiceQuantity: (service, quantity) => service.id !== 'ubo' || quantity <= 2
      }
    })

    wrapper.vm.changeServiceQuantity(flows[1].services[0], 1)
    expect(wrapper.emitted('input')).to.equal(undefined)
  })

  it('accepts a typed quantity and caps it at the highest allowed value', () => {
    const value = {
      selectedFlowIds: ['global', 'business'],
      selectedServiceIds: ['session', 'document', 'ubo'],
      serviceQuantities: { ubo: 1 }
    }
    const wrapper = shallowMount(VerificationFlowConfigurator, {
      propsData: {
        flows,
        value,
        canIncreaseServiceQuantity: (service, quantity) => service.id !== 'ubo' || quantity <= 3
      }
    })

    wrapper.vm.setServiceQuantity(flows[1].services[0], '20')
    expect(wrapper.emitted('input')[0][0].serviceQuantities).to.deep.equal({ ubo: 3 })
  })

  it('allows optional services to toggle but rejects required services', () => {
    const wrapper = mountConfigurator({
      selectedFlowIds: ['global'],
      selectedServiceIds: ['session', 'document']
    })

    wrapper.vm.toggleService(flows[0].services[1])
    expect(wrapper.emitted('input')[0][0].selectedServiceIds).not.to.include('document')

    wrapper.vm.toggleService(flows[0].services[0])
    expect(wrapper.emitted('input')).to.have.length(1)
  })

  it('supports pricing reuse without rendering service costs', () => {
    const wrapper = shallowMount(VerificationFlowConfigurator, {
      propsData: {
        flows,
        value: { selectedFlowIds: ['global'], selectedServiceIds: ['session'] },
        showServiceCosts: false,
        flowHeading: 'Configure your plan'
      }
    })

    expect(wrapper.text()).to.include('Configure your plan')
    expect(wrapper.find('.credit-pill').exists()).to.equal(false)
  })
})
