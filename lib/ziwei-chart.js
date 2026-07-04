import { astro, util } from 'iztro'
import { Solar } from 'lunar-javascript'
import { normalizeBirthInput } from './bazi-chart.js'
import { defaultBirthPlaceCoordinates, defaultBirthPlaceSelection } from './birth-place-options.js'

export { ziWeiChartSource } from './chart-engine-sources.js'

export const defaultZiWeiInput = {
  year: 1995,
  month: 6,
  day: 15,
  hour: 10,
  minute: 30,
  gender: '男',
  fixLeap: true,
  birthProvinceCode: defaultBirthPlaceSelection.provinceCode,
  birthCityCode: defaultBirthPlaceSelection.cityCode,
  birthAreaCode: defaultBirthPlaceSelection.areaCode,
  birthPlace: defaultBirthPlaceSelection.value,
  birthLongitude: defaultBirthPlaceCoordinates.longitude,
  birthLatitude: defaultBirthPlaceCoordinates.latitude,
  timeMode: 'trueSolar',
  sect: 2
}

export const ziWeiExampleInputs = [
  {
    id: 'late-zi-heihe',
    label: '子时边界样例',
    description: '1996-07-19 23:30 · 男 · 五大连池',
    input: {
      year: 1996,
      month: 7,
      day: 19,
      hour: 23,
      minute: 30,
      gender: '男',
      fixLeap: true,
      birthProvinceCode: '230000',
      birthCityCode: '231100',
      birthAreaCode: '231182',
      birthPlace: '黑龙江省 黑河市 五大连池市',
      birthLongitude: 126.2,
      birthLatitude: 48.52,
      timeMode: 'trueSolar',
      sect: 1
    }
  },
  {
    id: 'noon-xiuning',
    label: '午时女命样例',
    description: '1998-05-25 12:00 · 女 · 休宁',
    input: {
      year: 1998,
      month: 5,
      day: 25,
      hour: 12,
      minute: 0,
      gender: '女',
      fixLeap: true,
      birthProvinceCode: '340000',
      birthCityCode: '341000',
      birthAreaCode: '341022',
      birthPlace: '安徽省 黄山市 休宁县',
      birthLongitude: 118.19,
      birthLatitude: 29.79,
      timeMode: 'trueSolar',
      sect: 2
    }
  }
]

export const ziWeiGenderOptions = [
  { value: '男', label: '男', description: '按传统阴阳顺逆规则' },
  { value: '女', label: '女', description: '按传统阴阳顺逆规则' }
]

export const ziWeiSectOptions = [
  {
    value: 2,
    label: '晚子时算当日',
    description: '常用默认口径'
  },
  {
    value: 1,
    label: '晚子时算次日',
    description: '23 点后换日'
  }
]

const STANDARD_MERIDIAN = 120

const normalizeZiWeiInput = input => {
  const merged = { ...defaultZiWeiInput, ...input }
  const normalizedBirth = normalizeBirthInput(merged)

  return {
    ...normalizedBirth,
    gender: merged.gender === '女' ? '女' : '男',
    fixLeap: merged.fixLeap !== false,
    sect: Number(merged.sect) === 1 ? 1 : 2
  }
}

const getDayOfYear = (year, month, day) => {
  const current = Date.UTC(year, month - 1, day)
  const start = Date.UTC(year, 0, 0)
  return Math.floor((current - start) / 86400000)
}

const getEquationOfTimeMinutes = (year, month, day) => {
  const dayOfYear = getDayOfYear(year, month, day)
  const angle = (2 * Math.PI * (dayOfYear - 81)) / 364
  return 9.87 * Math.sin(2 * angle) - 7.53 * Math.cos(angle) - 1.5 * Math.sin(angle)
}

const shiftSolarByMinutes = (solar, minutes) => Solar.fromJulianDay(solar.getJulianDay() + minutes / 1440)

const buildChartSolar = (input, inputSolar) => {
  if (input.timeMode !== 'trueSolar') {
    return {
      chartSolar: inputSolar,
      offsetMinutes: 0,
      equationOfTimeMinutes: 0,
      longitudeOffsetMinutes: 0
    }
  }

  const equationOfTimeMinutes = getEquationOfTimeMinutes(input.year, input.month, input.day)
  const longitudeOffsetMinutes = (input.birthLongitude - STANDARD_MERIDIAN) * 4
  const offsetMinutes = Math.round((longitudeOffsetMinutes + equationOfTimeMinutes) * 10) / 10

  return {
    chartSolar: shiftSolarByMinutes(inputSolar, offsetMinutes),
    offsetMinutes,
    equationOfTimeMinutes: Math.round(equationOfTimeMinutes * 10) / 10,
    longitudeOffsetMinutes: Math.round(longitudeOffsetMinutes * 10) / 10
  }
}

const formatDate = solar => `${solar.getYear()}-${solar.getMonth()}-${solar.getDay()}`

const formatStar = star => [
  star.name,
  star.brightness ? `(${star.brightness})` : '',
  star.mutagen ? `化${star.mutagen}` : ''
].join('')

const mapStars = stars => (stars || []).map(formatStar)

const mapPalace = palace => ({
  index: palace.index,
  name: palace.name,
  heavenlyStem: palace.heavenlyStem,
  earthlyBranch: palace.earthlyBranch,
  isBodyPalace: palace.isBodyPalace,
  isMingPalace: palace.name === '命宫',
  isOriginalPalace: palace.isOriginalPalace,
  majorStars: mapStars(palace.majorStars),
  minorStars: mapStars(palace.minorStars),
  adjectiveStars: mapStars(palace.adjectiveStars),
  changsheng12: palace.changsheng12,
  boshi12: palace.boshi12,
  jiangqian12: palace.jiangqian12,
  suiqian12: palace.suiqian12,
  decadal: palace.decadal,
  ages: palace.ages || []
})

export function calculateZiWeiChart(input = {}) {
  const normalized = normalizeZiWeiInput(input)
  const inputSolar = Solar.fromYmdHms(
    normalized.year,
    normalized.month,
    normalized.day,
    normalized.hour,
    normalized.minute,
    0
  )
  const solarAdjustment = buildChartSolar(normalized, inputSolar)
  const solar = solarAdjustment.chartSolar
  const lateZiNextDay = normalized.sect === 1 && solar.getHour() === 23
  const chartDateSolar = lateZiNextDay ? solar.next(1) : solar
  const timeIndex = lateZiNextDay ? 0 : util.timeToIndex(solar.getHour())
  const chart = astro.bySolar(formatDate(chartDateSolar), timeIndex, normalized.gender, normalized.fixLeap, 'zh-CN')
  const palaces = chart.palaces.map(mapPalace)
  const mingPalace = palaces.find(palace => palace.name === '命宫')
  const bodyPalace = palaces.find(palace => palace.isBodyPalace)

  return {
    input: normalized,
    timeIndex,
    solarText: inputSolar.toYmdHms(),
    solarFullText: inputSolar.toFullString(),
    chartSolarText: solar.toYmdHms(),
    chartSolarFullText: solar.toFullString(),
    chartDateText: chartDateSolar.toYmd(),
    lateZiNextDay,
    timeAdjustment: {
      mode: normalized.timeMode,
      offsetMinutes: solarAdjustment.offsetMinutes,
      longitudeOffsetMinutes: solarAdjustment.longitudeOffsetMinutes,
      equationOfTimeMinutes: solarAdjustment.equationOfTimeMinutes,
      standardMeridian: STANDARD_MERIDIAN
    },
    solarDate: chart.solarDate,
    lunarDate: chart.lunarDate,
    chineseDate: chart.chineseDate,
    time: chart.time,
    timeRange: chart.timeRange,
    sign: chart.sign,
    zodiac: chart.zodiac,
    soul: chart.soul,
    body: chart.body,
    fiveElementsClass: chart.fiveElementsClass,
    earthlyBranchOfSoulPalace: chart.earthlyBranchOfSoulPalace,
    earthlyBranchOfBodyPalace: chart.earthlyBranchOfBodyPalace,
    mingPalace,
    bodyPalace,
    palaces,
    notes: [
      '输入口径：默认按公历/阳历日期和出生地真太阳时排盘。',
      '出生地：下拉选择后自动带出经纬度；排盘修正只使用经度，纬度用于记录和导出。',
      '真太阳时：按经度相对东经 120 度的差值和均时差修正排盘时间。',
      '子时口径：23 点附近可能因流派换日规则不同而变化，可在左侧切换。',
      '配置口径：按页面所选性别、闰月处理方式和子时口径输出本命盘。',
      '输出范围：只展示本命盘字段，不输出吉凶、建议或人生判断。'
    ]
  }
}
