import assert from 'node:assert/strict'
import test from 'node:test'
import { formatStructuredResultText, structuredTools } from '../lib/structured-tools.js'

test('structured tool catalogue exposes callable tools', () => {
  const slugs = Object.keys(structuredTools)

  assert.deepEqual(slugs.sort(), [
    'aiPrompt',
    'birthTime',
    'compatibility',
    'dailyFortune',
    'daliuren',
    'dateSelection',
    'findTime',
    'meihua',
    'name',
    'qimen',
    'synthesis',
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

test('structured chart tools expose direct AI handoff targets', () => {
  const directAiTools = ['birthTime', 'dailyFortune', 'daliuren', 'dateSelection', 'findTime', 'meihua', 'name', 'qimen', 'tarot']
  const targets = [
    {
      label: '送去 AI',
      slot: 'chartText',
      targetHref: '/tools/ai-prompt',
      targetSlug: 'aiPrompt'
    },
    {
      label: '合参',
      slot: 'auto',
      targetHref: '/tools/synthesis',
      targetSlug: 'synthesis'
    }
  ]

  for (const slug of directAiTools) {
    assert.deepEqual(structuredTools[slug].handoffTargets, targets)
  }

  assert.equal(structuredTools.aiPrompt.handoffTargets, undefined)
  assert.equal(structuredTools.compatibility.handoffTargets, undefined)
  assert.equal(structuredTools.synthesis.handoffTargets, undefined)
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

test('compatibility tool builds paired fields without relationship judgement', () => {
  const output = structuredTools.compatibility.calculate({
    chartType: 'bazi',
    focus: 'relation',
    personA: '甲方',
    personB: '乙方',
    relation: '亲密关系',
    question: '帮我整理两份盘的对照点。',
    context: '只需要字段材料',
    chartA: '四柱：甲子 乙丑 丙寅 丁卯\n日主：丙',
    chartB: '四柱：戊辰 己巳 庚午 辛未\n日主：庚'
  })
  const text = formatStructuredResultText(output)

  assert.equal(output.title, '合盘对照')
  assert.ok(output.badges.includes('八字合盘字段'))
  assert.match(output.copyText, /不输出关系好坏/)
  assert.match(output.copyText, /甲方 排盘字段/)
  assert.match(output.copyText, /乙方 排盘字段/)
  assert.match(text, /字段并排摘要/)
  assert.doesNotMatch(output.copyText, /一定/)
})

test('synthesis tool builds multi-source handoff prompt and auto-routes records', () => {
  const output = structuredTools.synthesis.calculate({
    topic: '合作事项',
    focus: 'decision',
    question: '请整理当前材料。',
    context: '只需要结构化摘要',
    birthChart: '八字：甲子 乙丑 丙寅 丁卯',
    questionChart: '六爻：泽雷随',
    tarotText: '塔罗：星星 正位',
    calendarText: '',
    notes: '线下沟通记录'
  })
  const text = formatStructuredResultText(output)
  const fromTarot = structuredTools.synthesis.applyHandoff(structuredTools.synthesis.defaultInput, {
    sourceTool: '塔罗抽牌',
    sourceTitle: '三张牌',
    text: '塔罗字段'
  })
  const fromCalendar = structuredTools.synthesis.applyRecordSlot(structuredTools.synthesis.defaultInput, {
    tool: '黄历节气',
    title: '日课',
    text: '黄历字段'
  }, structuredTools.synthesis.recordSlots[3])

  assert.equal(output.title, '综合合参工作台')
  assert.ok(output.badges.includes('决策参考'))
  assert.match(output.copyText, /字段之间如果口径不同或互相矛盾/)
  assert.match(text, /出生盘字段：1 行/)
  assert.match(text, /日课\/择日字段：未填写/)
  assert.equal(fromTarot.tarotText, '塔罗字段')
  assert.equal(fromCalendar.calendarText, '黄历字段')
  assert.doesNotMatch(output.copyText, /一定|必然/)
})

test('structured tools apply saved record handoff into target fields', () => {
  const aiForm = structuredTools.aiPrompt.applyHandoff(structuredTools.aiPrompt.defaultInput, {
    sourceTool: '六爻纳甲排盘',
    sourceTitle: '合作卦',
    text: '本卦：泽雷随'
  })
  const compatibilityForm = structuredTools.compatibility.applyHandoff(structuredTools.compatibility.defaultInput, {
    slot: 'chartB',
    sourceTool: '紫微斗数命盘',
    sourceTitle: '乙方命盘',
    text: '命宫：子'
  })

  assert.equal(aiForm.chartType, 'liuyao')
  assert.equal(aiForm.chartText, '本卦：泽雷随')
  assert.match(aiForm.context, /合作卦/)
  assert.equal(compatibilityForm.chartType, 'ziwei')
  assert.equal(compatibilityForm.personB, '乙方命盘')
  assert.equal(compatibilityForm.chartB, '命宫：子')
})

test('compatibility tool applies recent record into selected worksheet slot', () => {
  const output = structuredTools.compatibility.applyRecordSlot(structuredTools.compatibility.defaultInput, {
    tool: '八字专业细盘',
    title: '甲方八字记录',
    text: '四柱：甲子 乙丑 丙寅 丁卯'
  }, structuredTools.compatibility.recordSlots[0])

  assert.equal(structuredTools.compatibility.recordSlots.length, 2)
  assert.equal(output.chartType, 'bazi')
  assert.equal(output.personA, '甲方八字记录')
  assert.equal(output.chartA, '四柱：甲子 乙丑 丙寅 丁卯')
  assert.match(output.context, /甲方八字记录/)
})
