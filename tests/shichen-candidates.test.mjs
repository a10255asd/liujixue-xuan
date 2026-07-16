import assert from 'node:assert/strict'
import test from 'node:test'
import { buildShichenCandidates, shichenPurposeOptions, shichenRows } from '../lib/shichen-candidates.js'

test('shichen candidate builder scores a full day of time branches', () => {
  const plan = buildShichenCandidates({
    date: '2026-07-02',
    purpose: 'launch'
  })

  assert.equal(shichenRows.length, 12)
  assert.equal(plan.profile.label, '上线发布')
  assert.equal(plan.candidates.length, 12)
  assert.equal(plan.topCandidates.length, 4)
  assert.ok(plan.dayBranch)
  assert.ok(plan.clashBranch)
  assert.match(plan.topCandidates[0].level, /优先时段|可备选/)
  assert.doesNotMatch(plan.topCandidates[0].cautionText, /事项避开/)
})

test('shichen candidate builder falls back to general purpose', () => {
  const plan = buildShichenCandidates({
    date: '2026-07-02',
    purpose: 'unknown'
  })

  assert.equal(plan.profile.label, '综合筛选')
  assert.ok(shichenPurposeOptions.some(option => option.value === 'general'))
  assert.ok(plan.candidates.some(candidate => candidate.branch === plan.clashBranch && candidate.cautionText.includes('冲日支')))
})
