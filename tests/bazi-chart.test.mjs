import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import {
  baZiChartSource,
  baZiExampleInputs,
  calculateBaZiChart,
  defaultBaZiInput,
  normalizeBirthInput
} from '../lib/bazi-chart.js'

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

const assertIncludes = (actual, expected) => {
  for (const item of expected) assert.ok(actual.includes(item), `expected ${actual.join('、')} to include ${item}`)
}

test('bazi chart returns the four pillars and supporting fields', () => {
  const result = calculateBaZiChart({
    year: 2005,
    month: 12,
    day: 23,
    hour: 8,
    minute: 37
  })

  assert.equal(result.eightCharText, '乙酉 戊子 辛巳 壬辰')
  assert.equal(result.dayMaster, '辛')
  assert.equal(result.pillars.length, 4)
  assert.deepEqual(result.pillars.map(pillar => pillar.ganZhi), ['乙酉', '戊子', '辛巳', '壬辰'])
  assert.equal(result.pillars[0].naYin, '泉中水')
  assert.equal(result.pillars[0].ganElement, '木')
  assert.equal(result.pillars[0].zhiElement, '金')
  assert.deepEqual(result.pillars[2].hideGan, ['丙', '庚', '戊'])
  assert.ok(result.pillars.some(pillar => pillar.shenSha.length > 0))
  assert.equal(result.daYun.length, 10)
  assert.ok(result.currentDaYun)
  assert.equal(result.liuNian.length, 10)
  assert.equal(result.elementCounts.reduce((sum, item) => sum + item.count, 0), 8)
})

test('bazi chart supports late zi hour sect switch', () => {
  const sectTwo = calculateBaZiChart({
    year: 1988,
    month: 2,
    day: 15,
    hour: 23,
    minute: 30,
    sect: 2
  })
  const sectOne = calculateBaZiChart({ ...sectTwo.input, sect: 1 })

  assert.equal(sectTwo.pillars[2].ganZhi, '庚子')
  assert.equal(sectOne.pillars[2].ganZhi, '辛丑')
})

test('late zi next-day chart keeps precise yun sect independent', () => {
  const result = calculateBaZiChart({
    year: 1996,
    month: 7,
    day: 19,
    hour: 23,
    minute: 31,
    gender: '男',
    sect: 1,
    currentYear: 2026
  })

  assert.equal(result.lunarText, '一九九六年六月初五')
  assert.equal(result.eightCharText, '丙子 乙未 戊午 壬子')
  assert.equal(result.input.timeMode, 'trueSolar')
  assert.equal(result.chartSolarText, '1996-07-19 23:10:12')
  assert.equal(result.yunStart.text, '出生后6年2月13日4时起运')
  assert.equal(result.yunStart.solarText, '2002-10-03')
  assert.equal(result.currentDaYun.label, '戊戌')
})

test('bazi chart records birthplace and applies true solar time by longitude', () => {
  const result = calculateBaZiChart({
    year: 1996,
    month: 7,
    day: 19,
    hour: 23,
    minute: 31,
    gender: '男',
    birthPlace: '黑龙江 黑河',
    birthLongitude: 127.5,
    birthLatitude: 50.25,
    timeMode: 'trueSolar',
    sect: 1,
    currentYear: 2026
  })

  assert.equal(result.input.birthPlace, '黑龙江 黑河')
  assert.equal(result.input.birthLongitude, 127.5)
  assert.equal(result.input.birthLatitude, 50.25)
  assert.equal(result.solarText, '1996-07-19 23:31:00')
  assert.equal(result.chartSolarText, '1996-07-19 23:55:00')
  assert.equal(result.timeAdjustment.offsetMinutes, 24)
  assert.equal(result.timeAdjustment.longitudeOffsetMinutes, 30)
  assert.equal(result.eightCharText, '丙子 乙未 戊午 壬子')
})

test('bazi chart shen sha matches the professional fine chart baseline', () => {
  const result = calculateBaZiChart({
    year: 1996,
    month: 7,
    day: 19,
    hour: 23,
    minute: 30,
    gender: '男',
    birthPlace: '黑龙江省 黑河市 五大连池市',
    birthLongitude: 126.2,
    birthLatitude: 48.52,
    timeMode: 'trueSolar',
    sect: 1,
    currentYear: 2026
  })

  assert.equal(result.eightCharText, '丙子 乙未 戊午 壬子')
  assert.equal(result.chartSolarText, '1996-07-19 23:48:48')
  assertIncludes(result.pillars[0].shenSha, ['福星贵人', '空亡', '飞刃'])
  assertIncludes(result.pillars[1].shenSha, ['天乙贵人', '太极贵人', '德秀贵人', '金舆', '元辰'])
  assertIncludes(result.pillars[2].shenSha, ['十灵日', '九丑日', '六秀日', '孤鸾煞', '地转日', '羊刃', '灾煞', '天医'])
  assertIncludes(result.pillars[3].shenSha, ['福星贵人', '德秀贵人', '空亡', '飞刃', '将星'])
})

test('bazi chart shen sha matches the second professional reference chart', () => {
  const result = calculateBaZiChart({
    year: 1998,
    month: 5,
    day: 25,
    hour: 12,
    minute: 0,
    gender: '女',
    birthPlace: '安徽省 黄山市 休宁县',
    birthLongitude: 118.19,
    birthLatitude: 29.79,
    timeMode: 'trueSolar',
    sect: 1,
    currentYear: 2026
  })

  assert.equal(result.eightCharText, '戊寅 丁巳 壬申 丙午')
  assert.equal(result.chartSolarText, '1998-05-25 11:56:00')
  assert.deepEqual(result.pillars.map(pillar => pillar.selfDiShi), ['长生', '帝旺', '长生', '帝旺'])
  assertIncludes(result.pillars[0].shenSha, ['文昌贵人', '天厨贵人', '驿马'])
  assertIncludes(result.pillars[1].shenSha, ['天乙贵人', '太极贵人', '勾绞煞', '亡神', '孤辰', '劫煞'])
  assertIncludes(result.pillars[2].shenSha, ['十恶大败', '学堂', '文昌贵人', '天厨贵人', '福星贵人', '太极贵人', '空亡', '驿马', '血刃'])
  assertIncludes(result.pillars[3].shenSha, ['天德合', '飞刃', '将星'])
})

test('bazi chart covers the expanded Taiyi shen sha catalogue', () => {
  const cases = [
    { year: 1980, month: 1, day: 1 },
    { year: 1980, month: 1, day: 2 },
    { year: 1980, month: 1, day: 5 },
    { year: 1980, month: 1, day: 6 },
    { year: 1980, month: 1, day: 8 },
    { year: 1980, month: 1, day: 9 },
    { year: 1980, month: 1, day: 12 },
    { year: 1980, month: 1, day: 26 },
    { year: 1980, month: 2, day: 3 },
    { year: 1980, month: 2, day: 12 },
    { year: 1980, month: 3, day: 6 },
    { year: 1980, month: 4, day: 14 },
    { year: 1982, month: 3, day: 9 }
  ].map(input => calculateBaZiChart({
    ...input,
    hour: 12,
    minute: 0,
    gender: '男',
    timeMode: 'standard',
    sect: 1,
    currentYear: 2026
  }))
  const allStars = new Set(cases.flatMap(result => result.pillars.flatMap(pillar => pillar.shenSha)))

  assertIncludes([...allStars], [
    '月德合',
    '天赦日',
    '词馆',
    '国印贵人',
    '三奇贵人',
    '流霞',
    '四废',
    '天罗',
    '地网',
    '寡宿',
    '阴阳差错',
    '魁罡',
    '红鸾',
    '天喜',
    '红艳煞',
    '金神',
    '天转',
    '丧门',
    '吊客',
    '披麻',
    '八专',
    '童子煞'
  ])
})

test('birth input normalization clamps invalid ranges', () => {
  const input = normalizeBirthInput({
    year: 3000,
    month: 13,
    day: 99,
    hour: 28,
    minute: -5,
    birthLongitude: 999,
    birthLatitude: -999,
    sect: 7
  })

  assert.deepEqual(input, {
    ...defaultBaZiInput,
    year: 2100,
    month: 12,
    day: 31,
    hour: 23,
    minute: 0,
    birthLongitude: 180,
    birthLatitude: -90,
    sect: 2
  })
})

test('bazi chart source version matches dependency declaration', () => {
  const result = calculateBaZiChart()

  assert.equal(pkg.dependencies[baZiChartSource.engine], `^${baZiChartSource.version}`)
  assert.ok(!result.notes.join('\n').includes(baZiChartSource.engine))
  assert.equal(baZiChartSource.outputScope, '只输出排盘字段')
})

test('bazi example inputs produce reusable chart baselines', () => {
  assert.equal(baZiExampleInputs.length, 2)

  const results = baZiExampleInputs.map(example => calculateBaZiChart({
    ...example.input,
    currentYear: 2026
  }))

  assert.deepEqual(results.map(result => result.eightCharText), [
    '丙子 乙未 戊午 壬子',
    '戊寅 丁巳 壬申 丙午'
  ])

  for (const result of results) {
    assert.equal(result.input.timeMode, 'trueSolar')
    assert.equal(result.pillars.length, 4)
    assert.ok(result.input.birthPlace)
    assert.ok(result.chartSolarText)
    assert.ok(result.yunStart.text.startsWith('出生后'))
    assert.ok(result.pillars.some(pillar => pillar.shenSha.length > 0))
  }
})
