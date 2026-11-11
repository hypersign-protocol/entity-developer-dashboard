import { expect } from 'chai'
import {
  ONBOARDING_STEPS,
  buildTimeline,
  hasFailedStep,
  retryErrorMessage,
  shouldShowCheckStatus,
  shouldShowRetry
} from '@/utils/onboardingProgress'

const KYB = 'Know Your Business (KYB)'
const success = (step, time) => ({ step, status: 'SUCCESS', time })
const failed = (step, time) => ({ step, status: 'FAILED', time, failureReason: 'internal: socket hang up' })
const row = (record, key) => buildTimeline(record).find(item => item.key === key)
const successesUpTo = (lastKey) => {
  const last = ONBOARDING_STEPS.findIndex(step => step.key === lastKey)
  return ONBOARDING_STEPS.slice(0, last + 1).map(step => success(step.key))
}

// Test cases from the onboarding progress and retry backend contract (§8)
describe('onboardingProgress', () => {
  it('shows 10 steps without KYB and 12 with it, and never CREDIT_KYC_SERVICE', () => {
    expect(buildTimeline({ interestedService: [] })).to.have.length(10)
    const withKyb = buildTimeline({ interestedService: [KYB] })
    expect(withKyb).to.have.length(12)
    expect(withKyb.map(item => item.key)).to.not.include('CREDIT_KYC_SERVICE')
  })

  it('ignores CREDIT_KYC_SERVICE logs on older records', () => {
    const record = { onboardingStatus: 'APPROVED', logs: [failed('CREDIT_KYC_SERVICE')] }
    expect(hasFailedStep(record)).to.equal(false)
    expect(shouldShowRetry(record)).to.equal(false)
  })

  it('marks a failed blocking step as Failed without exposing failureReason', () => {
    const record = { onboardingStatus: 'FAILED', processingActive: false, logs: [failed('CREATE_DID')] }
    const item = row(record, 'CREATE_DID')
    expect(item.state).to.equal('failed')
    expect(item.statusLabel).to.equal('Failed')
    expect(item.failureMessage).to.not.include('socket')
    expect(shouldShowRetry(record)).to.equal(true)
  })

  it('keeps a failed optional step visible as a warning on an APPROVED record', () => {
    const logs = [...ONBOARDING_STEPS.map(step => success(step.key)).filter(log => log.step !== 'REGISTER_DID'), failed('REGISTER_DID')]
    const record = { onboardingStatus: 'APPROVED', logs }
    const item = row(record, 'REGISTER_DID')
    expect(item.state).to.equal('warning')
    expect(item.statusLabel).to.equal('Needs attention')
    expect(shouldShowRetry(record)).to.equal(true)
    expect(shouldShowCheckStatus(record)).to.equal(true)
  })

  it('does not force an APPROVED record to complete or hide steps with no log', () => {
    const record = { onboardingStatus: 'APPROVED', logs: successesUpTo('CREATE_TEAM_ROLE') }
    const timeline = buildTimeline(record)
    expect(timeline).to.have.length(10)
    expect(timeline.filter(item => item.state === 'complete')).to.have.length(2)
    expect(timeline[2].state).to.equal('pending')
  })

  it('shows only the first unfinished step as In progress while a run is active', () => {
    const record = { onboardingStatus: 'PROCESSING', processingActive: true, logs: successesUpTo('CREATE_TEAM_ROLE') }
    const timeline = buildTimeline(record)
    expect(timeline.filter(item => item.state === 'active').map(item => item.key)).to.deep.equal(['CREATE_SSI_SERVICE'])
    expect(timeline[3].statusLabel).to.equal('Not started')
    expect(shouldShowRetry(record)).to.equal(false)
  })

  it('offers Retry on an interrupted run', () => {
    const record = { onboardingStatus: 'PROCESSING', processingActive: false, logs: successesUpTo('CREATE_TEAM_ROLE') }
    expect(shouldShowRetry(record)).to.equal(true)
    expect(buildTimeline(record).some(item => item.state === 'active')).to.equal(false)
  })

  it('does not offer Retry on a non-approved record when processingActive is missing', () => {
    expect(shouldShowRetry({ onboardingStatus: 'FAILED', logs: [failed('CREATE_DID')] })).to.equal(false)
  })

  it('clears a failure once a retry succeeds, using the newest log per step', () => {
    const logs = [failed('REGISTER_DID', '2026-11-01T10:00:00Z'), success('REGISTER_DID', '2026-11-01T11:00:00Z')]
    const record = { onboardingStatus: 'APPROVED', logs }
    expect(row(record, 'REGISTER_DID').state).to.equal('complete')
    expect(shouldShowRetry(record)).to.equal(false)
    expect(shouldShowCheckStatus(record)).to.equal(false)
  })

  it('still shows Check status while processing', () => {
    expect(shouldShowCheckStatus({ onboardingStatus: 'PROCESSING', processingActive: true })).to.equal(true)
  })

  it('maps retry errors to the contract messages', () => {
    expect(retryErrorMessage({ status: 500 })).to.equal('')
    expect(retryErrorMessage({ status: 409 })).to.equal('Setup is still running. Check status shortly.')
    expect(retryErrorMessage({ status: 429 })).to.equal('Please wait a minute and try again.')
    expect(retryErrorMessage(new TypeError('Failed to fetch'))).to.include('may still be running')
  })
})
