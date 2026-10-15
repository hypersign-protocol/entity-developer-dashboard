import { expect } from 'chai'
import {
  joinStreet,
  normalizeDomain,
  validateCompanyName,
  validateDomain,
  validateStreet,
  validateStreetLine,
} from '@/utils/companyFieldRules'

// Backend patterns (dashboard service onboarding DTO + KYC service CreateCompanyRequestDto)
const BACKEND = {
  name: /^[A-Za-z0-9 .&'-]+$/,
  dashboardDomain: /^(?!:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
  kycDomain: /^(?!:\/\/)([a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,}$/,
  // eslint-disable-next-line no-useless-escape -- copied verbatim from the backend DTO
  street: /^(?=.*[a-zA-Z0-9])[a-zA-Z0-9\s,'\-\/#\.]+$/,
}

describe('companyFieldRules', () => {
  it('cleans pasted URLs down to the domain both backends accept', () => {
    ['https://www.Acme.com/about', 'http://acme.co.uk:8080/', 'acme.com.', 'ACME.IO?x=1'].forEach(input => {
      const domain = normalizeDomain(input)
      expect(validateDomain(input), input).to.equal('')
      expect(BACKEND.dashboardDomain.test(domain), domain).to.equal(true)
      expect(BACKEND.kycDomain.test(domain), domain).to.equal(true)
    })
    expect(normalizeDomain('https://www.Acme.com/about')).to.equal('www.acme.com')
  })

  it('rejects domains the backend rejects', () => {
    ['localhost', 'acme', 'acme .com', 'acme_corp.com', 'acme.c0m'].forEach(input => {
      expect(validateDomain(input), input).to.not.equal('')
    })
  })

  it('matches the backend company name rule', () => {
    expect(validateCompanyName("Hypermine Pvt. Ltd.")).to.equal('')
    expect(validateCompanyName("O'Brien & Sons-UK")).to.equal('')
    expect(validateCompanyName('Acme, Inc.')).to.not.equal('')
    expect(BACKEND.name.test('Acme, Inc.')).to.equal(false)
  })

  it('matches the backend street rule on the joined street', () => {
    expect(joinStreet('12 Market Road', 'Floor 3')).to.equal('12 Market Road, Floor 3')
    expect(BACKEND.street.test(joinStreet('12 Market Road', 'Floor 3'))).to.equal(true)
    expect(validateStreet('12', '')).to.not.equal('')
    expect(validateStreetLine('Flat #4/B, St. John\'s Rd.')).to.equal('')
    expect(validateStreetLine('Main St (rear)')).to.not.equal('')
  })
})
