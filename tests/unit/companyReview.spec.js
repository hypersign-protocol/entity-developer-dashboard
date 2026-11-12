import { expect } from 'chai'
import {
  COMPANY_REVIEW,
  companyAllowsProduction,
  companyCanBeEdited,
  companyReviewStatus,
} from '@/components/production/companyReview'

const record = (status, companyId = '665f17f9c2b4f5a6d7e8f901') => ({
  companyId,
  companyVerificationStatus: status,
})

describe('companyCanBeEdited (mirrors PATCH /customer-onboarding/:id)', () => {
  it('allows a first submission', () => {
    expect(companyCanBeEdited(null)).to.equal(true)
    expect(companyCanBeEdited({})).to.equal(true)
    expect(companyCanBeEdited(record(undefined, undefined))).to.equal(true)
  })

  it('allows a resubmission after a rejection', () => {
    expect(companyCanBeEdited(record('Rejected'))).to.equal(true)
  })

  it('locks a company under verification, under review or verified', () => {
    const locked = ['Submitted', 'InProgress', 'Completed', 'Approved']
    locked.forEach(status => {
      expect(companyCanBeEdited(record(status)), status).to.equal(false)
    })
  })

  it('locks a status it does not know, or none', () => {
    expect(companyCanBeEdited(record('SomeFutureStatus'))).to.equal(false)
    expect(companyCanBeEdited(record(undefined))).to.equal(false)
  })
})

describe('companyReviewStatus', () => {
  it('shows InProgress as under verification, not as not submitted', () => {
    expect(companyReviewStatus(record('InProgress'))).to.equal(COMPANY_REVIEW.PROCESSING)
  })

  it('keeps the go-live rule unchanged', () => {
    expect(companyAllowsProduction(record('InProgress'))).to.equal(false)
    expect(companyAllowsProduction(record('Completed'))).to.equal(true)
    expect(companyAllowsProduction(record('Approved'))).to.equal(true)
  })
})
