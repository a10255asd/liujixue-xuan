import assert from 'node:assert/strict'
import test from 'node:test'
import { buildDailyHexagramReview, dailyHexagramFocusOptions } from '../lib/daily-hexagram-review.js'

test('daily hexagram review builds practical checklist without judgement copy', () => {
  const review = buildDailyHexagramReview({
    name: '风火家人',
    changedName: '风山渐',
    lineName: '三爻'
  }, 'decision')

  assert.equal(review.profile.label, '决策取向')
  assert.ok(dailyHexagramFocusOptions.some(option => option.value === 'action'))
  assert.ok(review.rows.some(row => row.label === '本卦观察'))
  assert.ok(review.rows.some(row => row.label === '输出边界' && row.value.includes('不输出吉凶')))
  assert.ok(review.nextSteps.some(step => step.href === '/tools/liuyao'))
  assert.ok(review.nextSteps.some(step => step.href === '/tools/meihua'))
  assert.doesNotMatch(review.rows.map(row => row.value).join('\n'), /一定|必然|应期为/)
})
