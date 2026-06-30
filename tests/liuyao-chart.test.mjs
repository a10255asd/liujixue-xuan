import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildLiuYaoCopyText,
  buildLiuYaoExportPayload,
  calculateLiuYaoChart,
  defaultLiuYaoInput
} from '../lib/liuyao-chart.js'

test('liu yao chart matches the manual reference hexagram', () => {
  const chart = calculateLiuYaoChart(defaultLiuYaoInput)

  assert.equal(chart.hexagram.name, '泽雷随')
  assert.equal(chart.hexagram.kind, '归魂')
  assert.equal(chart.hexagram.palace, '震')
  assert.equal(chart.hexagram.palaceElement, '木')
  assert.equal(chart.changedHexagram.name, '水泽节')
  assert.deepEqual(chart.movingLines, [2, 4])
  assert.equal(chart.hexagram.world, 3)
  assert.equal(chart.hexagram.response, 6)

  assert.equal(chart.yearGanZhi, '丙午')
  assert.equal(chart.monthGanZhi, '癸巳')
  assert.equal(chart.dayGanZhi, '戊子')
  assert.equal(chart.timeGanZhi, '癸亥')
  assert.equal(chart.xunKong.day, '午未')
  assert.ok(chart.jieQiText.includes('立夏'))
  assert.ok(chart.jieQiText.includes('小满'))
})

test('liu yao chart builds na jia six relatives six gods and hidden spirit', () => {
  const chart = calculateLiuYaoChart(defaultLiuYaoInput)
  const [first, second, third, fourth, fifth, sixth] = chart.lines

  assert.equal(first.sixGod, '勾陈')
  assert.equal(first.sixRelative, '父母')
  assert.equal(first.ganZhi, '庚子')
  assert.equal(first.element, '水')

  assert.equal(second.sixGod, '腾蛇')
  assert.equal(second.sixRelative, '兄弟')
  assert.equal(second.moving, true)
  assert.equal(second.changed.ganZhi, '丁卯')
  assert.equal(second.changed.sixRelative, '兄弟')
  assert.ok(second.relations.includes('进神'))

  assert.equal(third.role, '世')
  assert.equal(fourth.movingMarker, 'O→')
  assert.equal(fourth.changed.ganZhi, '戊申')
  assert.equal(fourth.changed.sixRelative, '官鬼')
  assert.equal(fourth.hiddenSpirit.sixRelative, '子孙')
  assert.equal(fourth.hiddenSpirit.ganZhi, '庚午')
  assert.ok(fourth.relations.includes('动爻'))

  assert.equal(fifth.sixGod, '青龙')
  assert.equal(fifth.sixRelative, '官鬼')
  assert.equal(sixth.role, '应')
  assert.equal(sixth.sixGod, '朱雀')
  assert.equal(sixth.sixRelative, '妻财')
  assert.ok(sixth.relations.includes('旬空'))
})

test('liu yao export payload contains chart fields without judgement copy', () => {
  const chart = calculateLiuYaoChart(defaultLiuYaoInput)
  const text = buildLiuYaoCopyText(chart)
  const payload = buildLiuYaoExportPayload(chart)

  assert.equal(payload.title, '六爻专业排盘')
  assert.ok(payload.badges.includes('本卦 泽雷随'))
  assert.ok(payload.sections.some(section => section.title === '六爻排盘'))
  assert.ok(text.includes('本卦：泽雷随'))
  assert.ok(text.includes('变卦：水泽节'))
  assert.ok(text.includes('伏神:孙午火庚'))
  assert.ok(!text.includes('断语：'))
  assert.ok(!text.includes('建议：'))
})
