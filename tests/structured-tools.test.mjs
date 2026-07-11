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
    'dream',
    'findTime',
    'meihua',
    'name',
    'qimen',
    'tarot'
  ].sort())

  for (const slug of slugs) {
    const tool = structuredTools[slug]
    assert.ok(tool.title)
    assert.ok(tool.href)
    assert.ok(tool.fields.length > 0)
    assert.equal(typeof tool.calculate, 'function')
  }
})

test('structured tools do not expose cross-tool handoff targets', () => {
  for (const tool of Object.values(structuredTools)) {
    assert.equal(tool.handoffTargets, undefined)
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

test('tarot tool draws deterministic spread fields from a 78-card deck', () => {
  const input = {
    question: '这件事现在最该关注什么？',
    spread: 'three',
    date: '2026-07-03',
    time: '20:30',
    seed: 'jixue'
  }
  const first = structuredTools.tarot.calculate(input)
  const second = structuredTools.tarot.calculate(input)
  const text = formatStructuredResultText(first)
  const spreadRows = first.sections.find(section => section.title === '牌阵结果').rows

  assert.equal(first.title, '塔罗抽牌')
  assert.deepEqual(first.badges, ['三张牌', '3张牌', '78张牌库'])
  assert.equal(spreadRows.length, 3)
  assert.deepEqual(first.sections, second.sections)
  assert.match(text, /牌库：莱德韦特通用 78 张/)
  assert.match(text, /正位|逆位/)
  assert.doesNotMatch(text, /一定|必然/)
})

test('dream tool exports journal fields without omen judgement', () => {
  const output = structuredTools.dream.calculate({
    title: '反复出现的走廊',
    date: '2026-07-04',
    wakeTime: '06:40',
    focus: 'emotion',
    mood: '紧张但清醒',
    intensity: '4',
    scene: '一条很长的走廊，灯光很暗',
    people: '一个熟悉但想不起名字的人',
    symbols: '走廊 灯 门',
    realContext: '最近在犹豫是否换项目方向',
    dreamText: '我一直往前走，看到很多门，但没有打开。'
  })
  const text = formatStructuredResultText(output)

  assert.equal(output.title, '梦境记录整理')
  assert.ok(output.badges.includes('情绪线索'))
  assert.match(text, /不输出吉凶、预兆、应期或结果判断/)
  assert.match(text, /梦境全文/)
  assert.match(text, /反复意象：走廊 \/ 灯 \/ 门/)
  assert.doesNotMatch(text, /一定|必然/)
})
