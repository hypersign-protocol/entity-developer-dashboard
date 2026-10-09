import { expect } from 'chai'
import creditCalculatorStore from '@/store/creditCalculatorStore'

describe('creditCalculatorStore', () => {
  it('stores isolated copies of the calculator selection', () => {
    const state = { configuration: {} }
    const payload = {
      selectedFlowIds: ['india', 'india'],
      selectedServiceIds: ['aadhaar-verification'],
      serviceQuantities: { 'aadhaar-verification': 2, ignored: 5 },
      creditsPerVerification: 12
    }

    creditCalculatorStore.mutations.saveConfiguration(state, payload)
    payload.selectedFlowIds.push('global')

    expect(state.configuration.selectedFlowIds).to.deep.equal(['india'])
    expect(state.configuration.selectedServiceIds).to.deep.equal(['aadhaar-verification'])
    expect(state.configuration.serviceQuantities).to.deep.equal({ 'aadhaar-verification': 2 })
    expect(state.configuration.creditsPerVerification).to.equal(12)
    expect(state.configuration.updatedAt).to.be.a('string')
  })
})
