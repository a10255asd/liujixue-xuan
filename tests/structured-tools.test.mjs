import assert from 'node:assert/strict'
import test from 'node:test'
import { formatStructuredResultText, structuredTools } from '../lib/structured-tools.js'

test('structured tool catalogue exposes callable tools', () => {
  const slugs = Object.keys(structuredTools)

  assert.deepEqual(slugs.sort(), [
    'aiPrompt',
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

test('daliuren tool renders month general, four lessons and three transmissions', () => {
  const output = structuredTools.daliuren.calculate({
    topic: '测试事项',
    date: '2026-05-14',
    time: '22:03'
  })
  const plateSection = output.sections.find(section => section.title === '天地盘十二宫')
  const siKeSection = output.sections.find(section => section.title === '四课')
  const sanZhuanSection = output.sections.find(section => section.title === '三传')
  const text = formatStructuredResultText(output)

  assert.equal(output.title, '大六壬四课三传')
  assert.ok(output.badges.includes('月将 酉从魁'))
  assert.ok(output.badges.includes('课型 重审课'))
  assert.equal(plateSection.layout, 'palace-grid')
  assert.equal(plateSection.cells.length, 12)
  assert.equal(siKeSection.cells.length, 4)
  assert.equal(sanZhuanSection.cells.length, 3)
  assert.match(text, /月将：酉从魁/)
  assert.match(text, /一课：上神卯/)
  assert.match(text, /初传：传神丑/)
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

test('ai prompt tool exports boundary-safe prompt text', () => {
  const output = structuredTools.aiPrompt.calculate({
    chartType: 'liuyao',
    mode: 'questions',
    outputFormat: 'checklist',
    question: '这件事是否值得继续推进？',
    context: '只想做结构梳理',
    chartText: '本卦：泽雷随\n动爻：二爻'
  })
  const text = formatStructuredResultText(output)

  assert.equal(output.title, 'AI 解析提示词')
  assert.ok(output.badges.includes('六爻纳甲排盘'))
  assert.match(output.copyText, /不输出恐吓式/)
  assert.match(output.copyText, /不要编造未提供/)
  assert.match(output.copyText, /本卦：泽雷随/)
  assert.match(text, /边界要求/)
})
