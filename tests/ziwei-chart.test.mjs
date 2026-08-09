import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { calculateZiWeiChart, ziWeiChartSource, ziWeiExampleInputs } from '../lib/ziwei-chart.js'
import {
  buildZiWeiCopyText,
  buildZiWeiExportPayload,
  buildZiWeiReviewRows
} from '../lib/traditional-chart-annotations.js'

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

test('ziwei chart returns astrolabe basics and twelve palaces', () => {
  const result = calculateZiWeiChart({
    year: 1995,
    month: 6,
    day: 15,
    hour: 10,
    minute: 30,
    gender: '男'
  })

  assert.equal(result.time, '巳时')
  assert.equal(result.timeRange, '09:00~11:00')
  assert.equal(result.chineseDate, '乙亥 壬午 丁丑 乙巳')
  assert.equal(result.solarText, '1995-06-15 10:30:00')
  assert.equal(result.chartSolarText, '1995-06-15 10:15:00')
  assert.equal(result.timeAdjustment.offsetMinutes, -15)
  assert.equal(result.input.birthPlace, '北京市 北京市 海淀区')
  assert.equal(result.input.archivePurposeLabel, '命盘档案')
  assert.ok(result.input.focusNotes.includes('命宫'))
  assert.equal(result.fiveElementsClass, '火六局')
  assert.equal(result.palaces.length, 12)
  assert.equal(result.mingPalace.name, '命宫')
  assert.equal(result.bodyPalace.name, '夫妻')
  assert.ok(result.palaces.some(palace => palace.majorStars.length > 0))
})

test('ziwei natal archive export includes source focus and review boundary', () => {
  const result = calculateZiWeiChart({
    year: 1996,
    month: 7,
    day: 19,
    hour: 23,
    minute: 30,
    gender: '男',
    archivePurpose: 'calibration',
    birthSource: '出生证明复印件',
    calibrationNotes: '晚子时边界，需要对照相邻时辰。',
    focusNotes: '先比较命宫、身宫、五行局和主星落宫。'
  })
  const payload = buildZiWeiExportPayload(result)
  const copyText = buildZiWeiCopyText(result)
  const reviewRows = buildZiWeiReviewRows(result)

  assert.equal(result.input.archivePurposeLabel, '校时复核')
  assert.equal(payload.title, '紫微命盘档案')
  assert.ok(payload.badges.includes('校时复核'))
  assert.ok(payload.sections.some(section => section.title === '复核清单'))
  assert.ok(reviewRows.some(row => row.label === '复核重点' && row.value.includes('命宫')))
  assert.match(copyText, /紫微命盘档案/)
  assert.match(copyText, /信息来源：出生证明复印件/)
  assert.match(copyText, /不输出吉凶/)
  assert.doesNotMatch(copyText, /一定|必然/)
})

test('ziwei chart records true solar time before late zi indexing', () => {
  const result = calculateZiWeiChart({
    year: 1995,
    month: 6,
    day: 15,
    hour: 23,
    minute: 10,
    gender: '女'
  })

  assert.equal(result.timeIndex, 11)
  assert.equal(result.time, '亥时')
  assert.equal(result.chartSolarText, '1995-06-15 22:55:00')
  assert.equal(result.input.gender, '女')
})

test('ziwei chart supports standard late zi same-day and next-day sects', () => {
  const sameDay = calculateZiWeiChart({
    year: 1995,
    month: 6,
    day: 15,
    hour: 23,
    minute: 10,
    gender: '女',
    timeMode: 'standard',
    sect: 2
  })
  const nextDay = calculateZiWeiChart({
    year: 1995,
    month: 6,
    day: 15,
    hour: 23,
    minute: 10,
    gender: '女',
    timeMode: 'standard',
    sect: 1
  })

  assert.equal(sameDay.timeIndex, 12)
  assert.equal(sameDay.time, '晚子时')
  assert.equal(sameDay.solarDate, '1995-6-15')
  assert.equal(nextDay.timeIndex, 0)
  assert.equal(nextDay.time, '早子时')
  assert.equal(nextDay.solarDate, '1995-6-16')
  assert.equal(nextDay.lateZiNextDay, true)
  assert.equal(sameDay.input.gender, '女')
})

test('ziwei chart source version matches dependency declaration', () => {
  const result = calculateZiWeiChart()

  assert.equal(pkg.dependencies[ziWeiChartSource.engine], `^${ziWeiChartSource.version}`)
  assert.ok(!result.notes.join('\n').includes(ziWeiChartSource.engine))
  assert.equal(ziWeiChartSource.outputScope, '只输出排盘字段')
})

test('ziwei example inputs produce reusable chart baselines', () => {
  assert.equal(ziWeiExampleInputs.length, 2)

  const results = ziWeiExampleInputs.map(example => calculateZiWeiChart(example.input))

  assert.deepEqual(results.map(result => result.chineseDate), [
    '丙子 乙未 戊午 壬子',
    '戊寅 丁巳 壬申 丙午'
  ])
  assert.deepEqual(results.map(result => result.chartSolarText), [
    '1996-07-19 23:48:48',
    '1998-05-25 11:56:00'
  ])
  assert.deepEqual(results.map(result => result.fiveElementsClass), [
    '金四局',
    '水二局'
  ])
  assert.deepEqual(results.map(result => result.time), [
    '早子时',
    '午时'
  ])

  for (const result of results) {
    assert.equal(result.input.timeMode, 'trueSolar')
    assert.equal(result.palaces.length, 12)
    assert.ok(result.input.birthPlace)
    assert.ok(result.mingPalace)
    assert.ok(result.bodyPalace)
    assert.ok(result.palaces.some(palace => palace.majorStars.length > 0))
  }
})
