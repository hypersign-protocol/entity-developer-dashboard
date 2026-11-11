import { expect } from 'chai'
import { formatMinor, formatBps, formatCount } from '@/utils/billingFormat'

// Amounts from docs/adr/api-contract.md §1.3 and the shared quote fixtures (§3.3)
describe('billingFormat', () => {
  it('formats minor units with 2 decimals in the currency locale', () => {
    expect(formatMinor(172431, 'INR')).to.equal('₹1,724.31')
    expect(formatMinor(13597, 'USD')).to.equal('$135.97')
    expect(formatMinor(4720000, 'INR')).to.equal('₹47,200.00')
    expect(formatMinor(0, 'USD')).to.equal('$0.00')
  })

  it('formats basis points as percentages', () => {
    expect(formatBps(4650, 'USD')).to.equal('46.5%')
    expect(formatBps(2500, 'INR')).to.equal('25%')
    expect(formatBps(800, 'INR')).to.equal('8%')
  })

  it('groups credit counts by locale', () => {
    expect(formatCount(134910, 'USD')).to.equal('134,910')
    expect(formatCount(1234567, 'INR')).to.equal('12,34,567')
  })
})
