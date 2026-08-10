import assert from 'node:assert/strict'
import test from 'node:test'
import { buildShichenCandidates, parseShichenActionWindow, shichenPurposeOptions, shichenRows } from '../lib/shichen-candidates.js'

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

test('shichen candidate builder applies execution window constraints', () => {
  const plan = buildShichenCandidates({
    date: '2026-07-02',
    purpose: 'launch',
    actionWindow: '14:00-17:00'
  })
  const topBranches = plan.topCandidates.map(candidate => candidate.branch)

  assert.equal(plan.actionWindow.label, '14:00-17:00')
  assert.equal(plan.topCandidates[0].branch, '申')
  assert.ok(topBranches.includes('未'))
  assert.ok(topBranches.includes('申'))
  assert.ok(plan.topCandidates[0].reasonText.includes('执行窗口内'))
  assert.ok(plan.candidates.some(candidate => candidate.cautionText.includes('不在执行窗口')))
  assert.ok(plan.candidates.find(candidate => candidate.branch === '未').cautionText.includes('冲日支'))
  assert.equal(plan.levelCounts.优先时段 + plan.levelCounts.可备选 + plan.levelCounts.需复核, 12)
})

test('shichen action window parser supports text presets', () => {
  const window = parseShichenActionWindow('下午处理')

  assert.equal(window.label, '下午窗口')
  assert.deepEqual(window.segments[0], [13 * 60, 18 * 60])
  assert.equal(parseShichenActionWindow(''), null)
})
