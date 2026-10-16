import { expect } from 'chai'
import {
  EXAMPLES,
  OTHER_TYPE,
  detectIdentifierType,
  getIdentifierRule,
  identifierTypesFor,
  isSupportedCountry,
  normalizeIdentifier,
  validateIdentifier,
  validatePostalCode,
} from '@/utils/companyIdentifiers'
import {
  REGISTRATION_NUMBER_TYPES,
  TAX_ID_TYPES,
  POSTAL_CODE_PATTERNS,
} from '@/utils/kybIdentifierTypes'

// Mirrors the dashboard service's IsValidCompanyIdentifiers check for one identifier pair
function backendAccepts(types, country, code, number) {
  const mapping = types.find(item => item.code === code && (item.country === country || item.country === 'XX'))
  return Boolean(mapping) && (!mapping.regex || mapping.regex.test(number))
}

describe('companyIdentifiers', () => {
  const kinds = [['registration', REGISTRATION_NUMBER_TYPES], ['tax', TAX_ID_TYPES]]

  kinds.forEach(([kind, types]) => {
    types.filter(type => type.code !== OTHER_TYPE).forEach(type => {
      const example = EXAMPLES[`${type.country}:${type.code}`]

      it(`has a backend-valid example for ${kind} ${type.country} ${type.code}`, () => {
        expect(example, 'missing example').to.be.a('string')
        expect(type.regex.test(example)).to.equal(true)
      })

      it(`detects ${type.country} ${type.code} and the backend accepts what we send`, () => {
        const sent = normalizeIdentifier(example)
        const code = detectIdentifierType(kind, type.country, example)
        expect(code).to.equal(type.code)
        expect(backendAccepts(types, type.country, code, sent)).to.equal(true)
      })
    })
  })

  // Every example from every country, tried in every country's fields: the form must accept a
  // value exactly when the backend accepts it with the type the form would send.
  it('accepts exactly what the backend accepts, for every country and value', () => {
    const samples = [...Object.values(EXAMPLES), 'ABC', '12345', '', 'not valid!', 'de123456789', '12 345 678 901']
    const countries = [...new Set([...REGISTRATION_NUMBER_TYPES, ...TAX_ID_TYPES].map(type => type.country))]
    kinds.forEach(([kind, types]) => {
      countries.forEach(country => {
        samples.forEach(sample => {
          const sent = normalizeIdentifier(sample)
          if (!sent) return
          const formAccepts = validateIdentifier(kind, country, sample) === ''
          const code = detectIdentifierType(kind, country, sample)
          const backendOk = Boolean(code) && backendAccepts(types, country, code, sent)
          expect(formAccepts, `${kind} ${country} "${sample}"`).to.equal(backendOk)
          // Rejected only when none of the country's own patterns match
          if (!formAccepts) {
            const anyMatch = identifierTypesFor(kind, country).some(type => !type.regex || type.regex.test(sent))
            expect(anyMatch, `${kind} ${country} "${sample}"`).to.equal(false)
          }
        })
      })
    })
  })

  it('uses OTHER for countries without listed types, which the backend accepts', () => {
    expect(identifierTypesFor('tax', 'SG')).to.have.length(0)
    expect(detectIdentifierType('tax', 'SG', 'M90312345A')).to.equal(OTHER_TYPE)
    expect(backendAccepts(TAX_ID_TYPES, 'SG', OTHER_TYPE, 'M90312345A')).to.equal(true)
    expect(validateIdentifier('tax', 'SG', 'anything-goes')).to.equal('')
  })

  it('rejects a value that matches none of the country types', () => {
    expect(detectIdentifierType('tax', 'IN', '12345')).to.equal('')
    expect(validateIdentifier('tax', 'IN', '12345')).to.contain('PAN or GSTIN')
  })

  it('normalises case and spaces but keeps required separators', () => {
    expect(normalizeIdentifier(' 12 345 678 901 ')).to.equal('12345678901')
    expect(detectIdentifierType('tax', 'AU', '12 345 678 901')).to.equal('ABN')
    expect(detectIdentifierType('tax', 'PA', '1-123-456')).to.equal('RUC')
    expect(detectIdentifierType('tax', 'IN', '29abcde1234f1z5')).to.equal('GSTIN')
  })

  it('labels fields from the backend types', () => {
    expect(getIdentifierRule('registration', 'IN').label).to.equal('CIN or LLPIN')
    expect(getIdentifierRule('tax', 'US').label).to.equal('Employer Identification Number (EIN)')
    expect(getIdentifierRule('tax', 'SG').label).to.equal('Company tax ID')
  })

  it('validates postal codes with the backend patterns', () => {
    Object.keys(POSTAL_CODE_PATTERNS).forEach(country => {
      const example = EXAMPLES[`${country}:postal`]
      if (example) expect(validatePostalCode(country, example), country).to.equal('')
    })
    expect(validatePostalCode('IN', '5600')).to.not.equal('')
    expect(validatePostalCode('XX', 'anything')).to.equal('')
  })

  it('knows which countries the backend supports', () => {
    expect(isSupportedCountry('IN')).to.equal(true)
    expect(isSupportedCountry('XX')).to.equal(true)
    expect(isSupportedCountry('KE')).to.equal(false)
  })
})
