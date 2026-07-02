import assert from 'node:assert/strict'
import test from 'node:test'
import { formatStructuredResultText, structuredTools } from '../lib/structured-tools.js'

test('structured tool catalogue exposes callable tools', () => {
  const slugs = Object.keys(structuredTools)

  assert.deepEqual(slugs.sort(), [
    'birthTime',
    'dailyFortune',
    'daliuren',
    'dateSelection',
    'findTime',
    'meihua',
    'name',
    'qimen'
  ].sort())

  for (const slug of slugs) {
    const tool = structuredTools[slug]
    assert.ok(tool.title)
    assert.ok(tool.href)
    assert.ok(tool.fields.length > 0)
    assert.equal(typeof tool.calculate, 'function')
  }
})

test('meihua number method returns core hexagram fields', () => {
  const output = structuredTools.meihua.calculate({
    topic: '测试事项',
    method: 'numbers',
    date: '2026-05-14',
    time: '22:03',
    upperNumber: '1',
    lowerNumber: '8',
    movingNumber: '6'
  })

  assert.equal(output.title, '梅花易数排盘')
  assert.ok(output.badges.includes('本卦 天地否'))
  assert.ok(output.badges.includes('变卦 泽地萃'))
  assert.match(formatStructuredResultText(output), /体卦：坤/)
})

test('qimen tool uses chai-bu chart and renders palace fields', () => {
  const output = structuredTools.qimen.calculate({
    topic: '测试事项',
    date: '2026-05-14',
    time: '22:03'
  })
  const palaceSection = output.sections.find(section => section.title === '九宫综合盘')
  const text = formatStructuredResultText(output)

  assert.equal(output.title, '奇门遁甲拆补法排盘')
  assert.ok(output.badges.includes('阳遁'))
  assert.ok(output.badges.includes('1局'))
  assert.ok(output.badges.includes('立夏 中元'))
  assert.ok(output.badges.includes('值符 天心'))
  assert.equal(palaceSection.layout, 'palace-grid')
  assert.equal(palaceSection.cells.length, 9)
  assert.match(palaceSection.rows[0].value, /八神勾陈/)
  assert.match(text, /起局时间：2026051422/)
  assert.match(text, /八门：杜门/)
})

test('date selection clamps date range and formats rows', () => {
  const output = structuredTools.dateSelection.calculate({
    topic: '上线发布',
    startDate: '2026-07-02',
    days: '40',
    time: '09:00'
  })
  const dateRows = output.sections.find(section => section.title === '日期清单').rows

  assert.equal(dateRows.length, 30)
  assert.equal(dateRows[0].label, '2026-07-02')
  assert.match(dateRows[0].value, /宜：/)
})

test('name tool uses manual strokes for five grids', () => {
  const output = structuredTools.name.calculate({
    fullName: '刘鸡血',
    surnameLength: '1',
    strokes: '15 18 6'
  })
  const text = formatStructuredResultText(output)

  assert.match(text, /天格：16画/)
  assert.match(text, /人格：33画/)
  assert.match(text, /总格：39画/)
})
