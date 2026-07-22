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
    purpose: 'launch',
    startDate: '2026-07-02',
    days: '40',
    time: '09:00'
  })
  const dateRows = output.sections.find(section => section.title === '日期清单').rows
  const candidateRows = output.sections.find(section => section.title === '候选日期').rows
  const filterRows = output.sections.find(section => section.title === '筛选信息').rows

  assert.equal(dateRows.length, 30)
  assert.equal(candidateRows.length, 5)
  assert.match(output.badges.join(' / '), /上线发布/)
  assert.match(filterRows.find(row => row.label === '筛选口径').value, /候选缩小/)
  assert.equal(dateRows[0].label, '2026-07-02')
  assert.match(dateRows[0].value, /优先候选|可备选|需人工复核/)
  assert.match(dateRows[0].value, /宜：/)
  assert.match(candidateRows[0].value, /宜项命中|事项在忌项/)
})

test('daily action tool renders practical review fields without fortune claims', () => {
  const output = structuredTools.dailyFortune.calculate({
    topic: '上线发布',
    purpose: 'launch',
    date: '2026-07-02',
    time: '09:00',
    zodiac: '羊'
  })
  const actionRows = output.sections.find(section => section.title === '今日行动速览').rows
  const nextRows = output.sections.find(section => section.title === '下一步入口').rows
  const text = formatStructuredResultText(output)

  assert.equal(output.title, '每日行动速览')
  assert.match(output.badges.join(' / '), /上线发布/)
  assert.match(actionRows.find(row => row.label === '生肖复核').value, /个人生肖冲日/)
  assert.match(actionRows.find(row => row.label === '输出口径').value, /不输出吉凶、运势断语/)
  assert.ok(nextRows.some(row => row.label === '筛当天时辰'))
  assert.match(text, /宜项命中：交易/)
  assert.doesNotMatch(text, /一定|必然|好运|坏运/)
})

test('birth time workspace renders candidate differences and review boundary', () => {
  const output = structuredTools.birthTime.calculate({
    date: '1996-07-19',
    time: '23:30',
    birthPlace: '黑龙江省 黑河市 五大连池市',
    knownRange: 'within2',
    lifeClues: '家人记得大约夜里十一点半。'
  })
  const inputRows = output.sections.find(section => section.title === '输入信息').rows
  const reviewRows = output.sections.find(section => section.title === '校时复核').rows
  const differenceRows = output.sections.find(section => section.title === '候选差异').rows
  const nextRows = output.sections.find(section => section.title === '下一步入口').rows
  const text = formatStructuredResultText(output)

  assert.equal(output.title, '出生校时工作台')
  assert.match(output.badges.join(' / '), /候选5档/)
  assert.equal(differenceRows.length, 5)
  assert.match(inputRows.find(row => row.label === '输出口径').value, /不直接判定唯一出生时辰/)
  assert.match(reviewRows.find(row => row.label === '子时提示').value, /晚子时|跨日/)
  assert.ok(nextRows.some(row => row.label === '八字专业细盘'))
  assert.match(text, /日柱变化|日柱同参考/)
})

test('find time workspace highlights focused candidates and keeps full table', () => {
  const output = structuredTools.findTime.calculate({
    date: '1996-07-19',
    topic: '出生时辰候选',
    focus: 'night'
  })
  const infoRows = output.sections.find(section => section.title === '排查信息').rows
  const focusRows = output.sections.find(section => section.title === '重点候选').rows
  const fullRows = output.sections.find(section => section.title === '十二时辰全表').rows
  const nextRows = output.sections.find(section => section.title === '下一步入口').rows
  const text = formatStructuredResultText(output)

  assert.equal(output.title, '寻时定盘工作台')
  assert.match(output.badges.join(' / '), /夜间候选/)
  assert.equal(focusRows.length, 4)
  assert.equal(fullRows.length, 12)
  assert.match(infoRows.find(row => row.label === '排查口径').value, /不直接判定唯一时辰/)
  assert.ok(nextRows.some(row => row.label === '出生校时工作台'))
  assert.match(text, /重点候选/)
})

test('name tool uses manual strokes for five grids', () => {
  const output = structuredTools.name.calculate({
    fullName: '刘鸡血',
    usage: 'baby',
    surnameLength: '1',
    strokes: '15 18 6',
    namingGoal: '希望名字好读、好写，含义积极但不过度堆砌。',
    meaningPreference: '偏向明亮、行动感，不要太生僻。',
    avoidNotes: '避开同音误解和难输入字。'
  })
  const text = formatStructuredResultText(output)
  const reviewRows = output.sections.find(section => section.title === '复核清单').rows
  const nextRows = output.sections.find(section => section.title === '下一步入口').rows

  assert.equal(output.title, '姓名方案复核')
  assert.ok(output.badges.includes('新生儿命名'))
  assert.ok(output.badges.includes('笔画完整'))
  assert.match(text, /天格：16画/)
  assert.match(text, /人格：33画/)
  assert.match(text, /总格：39画/)
  assert.match(text, /方案信息/)
  assert.match(reviewRows.find(row => row.label === '输出边界').value, /不输出姓名打分、吉凶定论/)
  assert.ok(nextRows.some(row => row.label === '干支五行速查'))
  assert.doesNotMatch(text, /一定|必然/)
})

test('tarot tool draws deterministic spread fields from a 78-card deck', () => {
  const input = {
    question: '这件事现在最该关注什么？',
    context: '已有两个可选方案，但信息不完整。',
    focus: 'decision',
    spread: 'three',
    date: '2026-07-03',
    time: '20:30',
    seed: 'jixue'
  }
  const first = structuredTools.tarot.calculate(input)
  const second = structuredTools.tarot.calculate(input)
  const text = formatStructuredResultText(first)
  const spreadRows = first.sections.find(section => section.title === '牌阵结果').rows
  const reviewRows = first.sections.find(section => section.title === '问题拆解').rows
  const nextRows = first.sections.find(section => section.title === '下一步入口').rows

  assert.equal(first.title, '塔罗问题记录')
  assert.deepEqual(first.badges, ['决策拆解', '三张牌', '3张牌', '78张牌库'])
  assert.equal(spreadRows.length, 3)
  assert.deepEqual(first.sections, second.sections)
  assert.match(reviewRows.find(row => row.label === '输出边界').value, /不输出吉凶、应期/)
  assert.ok(nextRows.some(row => row.label === '每日一卦记录'))
  assert.match(text, /牌库：莱德韦特通用 78 张/)
  assert.match(text, /问题拆解/)
  assert.match(text, /正位|逆位/)
  assert.doesNotMatch(text, /一定|必然/)
})

test('dream tool exports journal fields without omen judgement', () => {
  const output = structuredTools.dream.calculate({
    title: '反复出现的走廊',
    date: '2026-07-04',
    bedTime: '23:20',
    wakeTime: '06:40',
    sleepQuality: 'light',
    focus: 'emotion',
    mood: '紧张但清醒',
    intensity: '4',
    scene: '一条很长的走廊，灯光很暗',
    people: '一个熟悉但想不起名字的人',
    symbols: '走廊 灯 门',
    realContext: '最近在犹豫是否换项目方向',
    stressors: '项目截止时间临近，沟通还没完成',
    bodySignals: '醒来时肩颈紧',
    dreamText: '我一直往前走，看到很多门，但没有打开。'
  })
  const text = formatStructuredResultText(output)
  const reviewRows = output.sections.find(section => section.title === '复盘清单').rows
  const nextRows = output.sections.find(section => section.title === '下一步入口').rows

  assert.equal(output.title, '梦境日志工作台')
  assert.ok(output.badges.includes('情绪线索'))
  assert.ok(output.badges.includes('浅睡/易醒'))
  assert.match(text, /睡眠背景/)
  assert.match(text, /睡眠时长：7小时20分/)
  assert.match(text, /不输出吉凶、预兆、应期或结果判断/)
  assert.match(reviewRows.find(row => row.label === '今日小动作').value, /小动作/)
  assert.ok(nextRows.some(row => row.label === '每日行动速览'))
  assert.match(text, /梦境全文/)
  assert.match(text, /反复意象：走廊 \/ 灯 \/ 门/)
  assert.doesNotMatch(text, /一定|必然/)
})
