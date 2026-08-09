import { astro, util } from 'iztro'
import { Solar } from 'lunar-javascript'
import { normalizeBirthInput } from './bazi-chart.js'
import { defaultBirthPlaceCoordinates, defaultBirthPlaceSelection } from './birth-place-options.js'

export { ziWeiChartSource } from './chart-engine-sources.js'

export const ziWeiArchiveProfiles = {
  archive: {
    label: '命盘档案',
    description: '固定本命资料',
    review: '先固定出生时间、出生地、性别、闰月和子时口径，再核对命宫、身宫、五行局和十二宫字段。',
    action: '下载命盘图片和文本，把资料来源与本次口径一并留档。',
    observe: '后续只追加新证据或新口径，不把命盘字段直接写成判断。'
  },
  calibration: {
    label: '校时复核',
    description: '时间不确定',
    review: '用于候选时辰或子时边界对照，先比较命宫、身宫、五行局和主星落宫变化。',
    action: '把候选时辰分别建档，再回到出生校时或寻时定盘工具统一比较。',
    observe: '不要只靠星曜反推唯一时辰，先核对出生证、医院记录和家人说法。'
  },
  palaceStudy: {
    label: '宫位学习',
    description: '学习十二宫字段',
    review: '把十二宫、主星、辅星、四化、长生博士和大限当作字段样本逐项学习。',
    action: '先保存命盘，再围绕一个宫位或一组星曜查术语和来源。',
    observe: '学习时只比较字段关系，不把单个宫位或星曜延伸成吉凶结论。'
  },
  comparison: {
    label: '盘面比较',
    description: '多盘横向对照',
    review: '用于不同出生时间、子时口径或闰月处理方式的横向比较。',
    action: '每个方案单独导出，并在复核重点里写清差异点。',
    observe: '比较时先看字段差异，再决定是否需要补充外部资料。'
  }
}

export const ziWeiArchiveOptions = Object.entries(ziWeiArchiveProfiles).map(([value, profile]) => ({
  value,
  label: profile.label,
  description: profile.description
}))

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
  archivePurpose: 'archive',
  birthSource: '出生证明/家人记录待核对',
  calibrationNotes: '',
  focusNotes: '先核对命宫、身宫、五行局和十二宫主星。',
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
      archivePurpose: 'calibration',
      birthSource: '家人记忆：夜里十一点半左右',
      calibrationNotes: '接近晚子时边界，需比较早子时/晚子时盘面。',
      focusNotes: '重点比较命宫、身宫、五行局和主星落宫变化。',
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
      archivePurpose: 'palaceStudy',
      birthSource: '样例资料',
      calibrationNotes: '午时样例，用于核对十二宫展示。',
      focusNotes: '重点看命身宫、主星和大限字段。',
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
const normalizeArchiveText = (value, maxLength, fallback = '') => String(value || '')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, maxLength) || fallback

const normalizeZiWeiInput = input => {
  const merged = { ...defaultZiWeiInput, ...input }
  const normalizedBirth = normalizeBirthInput(merged)
  const archivePurpose = ziWeiArchiveProfiles[merged.archivePurpose] ? merged.archivePurpose : defaultZiWeiInput.archivePurpose

  return {
    ...normalizedBirth,
    gender: merged.gender === '女' ? '女' : '男',
    fixLeap: merged.fixLeap !== false,
    archivePurpose,
    archivePurposeLabel: ziWeiArchiveProfiles[archivePurpose].label,
    birthSource: normalizeArchiveText(merged.birthSource, 120, defaultZiWeiInput.birthSource),
    calibrationNotes: normalizeArchiveText(merged.calibrationNotes, 180),
    focusNotes: normalizeArchiveText(merged.focusNotes, 180, defaultZiWeiInput.focusNotes),
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
      '档案字段：用途、资料来源、校时线索和复核重点只用于留档复核，不参与命盘计算。',
      '输出范围：只展示命盘档案、本命盘字段和复核清单，不输出吉凶、建议或人生判断。'
    ]
  }
}
