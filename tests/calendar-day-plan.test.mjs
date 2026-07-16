import assert from 'node:assert/strict'
import test from 'node:test'
import { buildCalendarDayPlan, calendarPurposeOptions } from '../lib/calendar-day-plan.js'

const calendarFixture = {
  yi: '开市、交易、立券、纳财、祈福',
  ji: '破土、安葬',
  chong: '冲鼠',
  sha: '煞北'
}

test('calendar day plan scores purpose matches and exposes next steps', () => {
  const plan = buildCalendarDayPlan(calendarFixture, 'launch')

  assert.equal(plan.profile.label, '上线发布')
  assert.equal(plan.level, '适合推进')
  assert.ok(plan.preferMatches.includes('开市'))
  assert.ok(plan.preferMatches.includes('交易'))
  assert.ok(plan.cautionMatches.includes('破土'))
  assert.ok(plan.nextSteps.some(step => step.href === '/tools/shichen'))
  assert.ok(plan.nextSteps.some(step => step.href === '/tools/date-selection'))
  assert.match(plan.rows.find(row => row.label === '冲煞复核').value, /冲鼠/)
})

test('calendar day plan falls back to general profile', () => {
  const plan = buildCalendarDayPlan({
    yi: '祭祀、会亲友',
    ji: '诸事不宜',
    chong: '冲龙',
    sha: '煞南'
  }, 'unknown')

  assert.equal(plan.profile.label, '综合筛选')
  assert.ok(calendarPurposeOptions.some(option => option.value === 'general'))
  assert.match(plan.rows.find(row => row.label === '通用避开项').value, /诸事不宜/)
})
