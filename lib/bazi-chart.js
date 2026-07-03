import { LunarUtil, Solar } from 'lunar-javascript'
import { defaultBirthPlaceCoordinates, defaultBirthPlaceSelection } from './birth-place-options.js'

export { baZiChartSource } from './chart-engine-sources.js'

export const defaultBaZiInput = {
  year: 1995,
  month: 6,
  day: 15,
  hour: 10,
  minute: 30,
  gender: '男',
  birthProvinceCode: defaultBirthPlaceSelection.provinceCode,
  birthCityCode: defaultBirthPlaceSelection.cityCode,
  birthAreaCode: defaultBirthPlaceSelection.areaCode,
  birthPlace: defaultBirthPlaceSelection.value,
  birthLongitude: defaultBirthPlaceCoordinates.longitude,
  birthLatitude: defaultBirthPlaceCoordinates.latitude,
  timeMode: 'trueSolar',
  yunSect: 2,
  sect: 2
}

export const baZiExampleInputs = [
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
      birthProvinceCode: '230000',
      birthCityCode: '231100',
      birthAreaCode: '231182',
      birthPlace: '黑龙江省 黑河市 五大连池市',
      birthLongitude: 126.2,
      birthLatitude: 48.52,
      timeMode: 'trueSolar',
      yunSect: 2,
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
      birthProvinceCode: '340000',
      birthCityCode: '341000',
      birthAreaCode: '341022',
      birthPlace: '安徽省 黄山市 休宁县',
      birthLongitude: 118.19,
      birthLatitude: 29.79,
      timeMode: 'trueSolar',
      yunSect: 2,
      sect: 2
    }
  }
]

export const baZiGenderOptions = [
  {
    value: '男',
    label: '男',
    description: '用于大运顺逆'
  },
  {
    value: '女',
    label: '女',
    description: '用于大运顺逆'
  }
]

export const baZiSectOptions = [
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

export const baZiYunSectOptions = [
  {
    value: 2,
    label: '精确分钟',
    description: '按分钟折算起运'
  },
  {
    value: 1,
    label: '时辰折算',
    description: '按时辰折算起运'
  }
]

const STANDARD_MERIDIAN = 120

const GAN_ELEMENT = {
  甲: '木',
  乙: '木',
  丙: '火',
  丁: '火',
  戊: '土',
  己: '土',
  庚: '金',
  辛: '金',
  壬: '水',
  癸: '水'
}

const ZHI_ELEMENT = {
  子: '水',
  丑: '土',
  寅: '木',
  卯: '木',
  辰: '土',
  巳: '火',
  午: '火',
  未: '土',
  申: '金',
  酉: '金',
  戌: '土',
  亥: '水'
}

const ZHI_SEQUENCE = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

const ZHI_GROUP_STARS = {
  申子辰: {
    驿马: '寅',
    桃花: '酉',
    华盖: '辰',
    将星: '子',
    劫煞: '巳',
    亡神: '亥',
    灾煞: '午'
  },
  寅午戌: {
    驿马: '申',
    桃花: '卯',
    华盖: '戌',
    将星: '午',
    劫煞: '亥',
    亡神: '巳',
    灾煞: '子'
  },
  巳酉丑: {
    驿马: '亥',
    桃花: '午',
    华盖: '丑',
    将星: '酉',
    劫煞: '寅',
    亡神: '申',
    灾煞: '卯'
  },
  亥卯未: {
    驿马: '巳',
    桃花: '子',
    华盖: '未',
    将星: '卯',
    劫煞: '申',
    亡神: '寅',
    灾煞: '酉'
  }
}

const DAY_GAN_BRANCH_STARS = {
  天乙贵人: {
    甲: ['丑', '未'],
    戊: ['丑', '未'],
    庚: ['丑', '未'],
    乙: ['子', '申'],
    己: ['子', '申'],
    丙: ['亥', '酉'],
    丁: ['亥', '酉'],
    壬: ['卯', '巳'],
    癸: ['卯', '巳'],
    辛: ['寅', '午']
  },
  文昌贵人: {
    甲: ['巳'],
    乙: ['午'],
    丙: ['申'],
    丁: ['酉'],
    戊: ['申'],
    己: ['酉'],
    庚: ['亥'],
    辛: ['子'],
    壬: ['寅'],
    癸: ['卯']
  },
  太极贵人: {
    甲: ['子', '午'],
    乙: ['子', '午'],
    丙: ['卯', '酉'],
    丁: ['卯', '酉'],
    戊: ['辰', '戌', '丑', '未'],
    己: ['辰', '戌', '丑', '未'],
    庚: ['寅', '亥'],
    辛: ['寅', '亥'],
    壬: ['巳', '申'],
    癸: ['巳', '申']
  },
  福星贵人: {
    甲: ['寅', '子'],
    丙: ['寅', '子'],
    乙: ['丑', '卯'],
    癸: ['丑', '卯'],
    戊: ['申'],
    己: ['未'],
    丁: ['亥'],
    庚: ['午'],
    辛: ['巳'],
    壬: ['辰']
  },
  禄神: {
    甲: ['寅'],
    乙: ['卯'],
    丙: ['巳'],
    丁: ['午'],
    戊: ['巳'],
    己: ['午'],
    庚: ['申'],
    辛: ['酉'],
    壬: ['亥'],
    癸: ['子']
  },
  羊刃: {
    甲: ['卯'],
    乙: ['寅'],
    丙: ['午'],
    丁: ['巳'],
    戊: ['午'],
    己: ['巳'],
    庚: ['酉'],
    辛: ['申'],
    壬: ['子'],
    癸: ['亥']
  },
  金舆: {
    甲: ['辰'],
    乙: ['巳'],
    丙: ['未'],
    丁: ['申'],
    戊: ['未'],
    己: ['申'],
    庚: ['戌'],
    辛: ['亥'],
    壬: ['丑'],
    癸: ['寅']
  }
}

const TIAN_CHU_BRANCH_BY_GAN = {
  甲: ['巳'],
  乙: ['午'],
  丙: ['巳'],
  丁: ['午'],
  戊: ['申'],
  己: ['酉'],
  庚: ['亥'],
  辛: ['子'],
  壬: ['寅'],
  癸: ['卯']
}

const FEI_REN_BRANCH_BY_DAY_GAN = {
  甲: ['酉'],
  乙: ['申'],
  丙: ['子'],
  丁: ['亥'],
  戊: ['子'],
  己: ['亥'],
  庚: ['卯'],
  辛: ['寅'],
  壬: ['午'],
  癸: ['巳']
}

const DE_XIU_GAN_BY_MONTH_ZHI = {
  寅: ['丙', '丁', '戊', '癸'],
  午: ['丙', '丁', '戊', '癸'],
  戌: ['丙', '丁', '戊', '癸'],
  申: ['壬', '癸', '戊', '己', '丙', '辛', '甲'],
  子: ['壬', '癸', '戊', '己', '丙', '辛', '甲'],
  辰: ['壬', '癸', '戊', '己', '丙', '辛', '甲'],
  巳: ['庚', '辛', '乙'],
  酉: ['庚', '辛', '乙'],
  丑: ['庚', '辛', '乙'],
  亥: ['甲', '乙', '丁', '壬'],
  卯: ['甲', '乙', '丁', '壬'],
  未: ['甲', '乙', '丁', '壬']
}

const YANG_YEAR_YUAN_CHEN_BY_ZHI = {
  子: '未',
  丑: '申',
  寅: '酉',
  卯: '戌',
  辰: '亥',
  巳: '子',
  午: '丑',
  未: '寅',
  申: '卯',
  酉: '辰',
  戌: '巳',
  亥: '午'
}

const YIN_YEAR_YUAN_CHEN_BY_ZHI = {
  子: '巳',
  丑: '午',
  寅: '未',
  卯: '申',
  辰: '酉',
  巳: '戌',
  午: '亥',
  未: '子',
  申: '丑',
  酉: '寅',
  戌: '卯',
  亥: '辰'
}

const GOU_JIAO_BRANCHES_BY_YEAR_ZHI = {
  子: ['卯', '酉'],
  丑: ['辰', '戌'],
  寅: ['巳', '亥'],
  卯: ['午', '子'],
  辰: ['未', '丑'],
  巳: ['申', '寅'],
  午: ['酉', '卯'],
  未: ['戌', '辰'],
  申: ['亥', '巳'],
  酉: ['子', '午'],
  戌: ['丑', '未'],
  亥: ['寅', '申']
}

const GU_CHEN_BRANCH_BY_YEAR_ZHI = {
  亥: '寅',
  子: '寅',
  丑: '寅',
  寅: '巳',
  卯: '巳',
  辰: '巳',
  巳: '申',
  午: '申',
  未: '申',
  申: '亥',
  酉: '亥',
  戌: '亥'
}

const BLOOD_BLADE_BRANCH_BY_MONTH_ZHI = {
  子: '午',
  丑: '子',
  寅: '丑',
  卯: '未',
  辰: '寅',
  巳: '申',
  午: '卯',
  未: '酉',
  申: '辰',
  酉: '戌',
  戌: '巳',
  亥: '亥'
}

const LIU_XIA_BRANCH_BY_DAY_GAN = {
  甲: '酉',
  乙: '戌',
  丙: '未',
  丁: '申',
  戊: '巳',
  己: '午',
  庚: '辰',
  辛: '卯',
  壬: '亥',
  癸: '寅'
}

const GUO_YIN_BRANCH_BY_GAN = {
  甲: '戌',
  乙: '亥',
  丙: '丑',
  丁: '寅',
  戊: '丑',
  己: '寅',
  庚: '辰',
  辛: '巳',
  壬: '未',
  癸: '申'
}

const HONG_YAN_BRANCH_BY_DAY_GAN = {
  甲: '午',
  乙: '午',
  丙: '寅',
  丁: '未',
  戊: '辰',
  己: '辰',
  庚: '戌',
  辛: '酉',
  壬: '子',
  癸: '申'
}

const HONG_LUAN_BRANCH_BY_YEAR_ZHI = {
  子: '卯',
  丑: '寅',
  寅: '丑',
  卯: '子',
  辰: '亥',
  巳: '戌',
  午: '酉',
  未: '申',
  申: '未',
  酉: '午',
  戌: '巳',
  亥: '辰'
}

const TIAN_XI_BRANCH_BY_YEAR_ZHI = {
  子: '酉',
  丑: '申',
  寅: '未',
  卯: '午',
  辰: '巳',
  巳: '辰',
  午: '卯',
  未: '寅',
  申: '丑',
  酉: '子',
  戌: '亥',
  亥: '戌'
}

const GUA_SU_BRANCH_BY_YEAR_ZHI = {
  亥: '戌',
  子: '戌',
  丑: '戌',
  寅: '丑',
  卯: '丑',
  辰: '丑',
  巳: '辰',
  午: '辰',
  未: '辰',
  申: '未',
  酉: '未',
  戌: '未'
}

const TIAN_DE_TARGET_BY_MONTH_ZHI = {
  寅: '丁',
  卯: '申',
  辰: '壬',
  巳: '辛',
  午: '亥',
  未: '甲',
  申: '癸',
  酉: '寅',
  戌: '丙',
  亥: '乙',
  子: '巳',
  丑: '庚'
}

const YUE_DE_TARGET_BY_MONTH_ZHI = {
  寅: '丙',
  午: '丙',
  戌: '丙',
  申: '壬',
  子: '壬',
  辰: '壬',
  亥: '甲',
  卯: '甲',
  未: '甲',
  巳: '庚',
  酉: '庚',
  丑: '庚'
}

const TIAN_YI_TARGET_BY_MONTH_ZHI = {
  寅: '丑',
  卯: '寅',
  辰: '卯',
  巳: '辰',
  午: '巳',
  未: '午',
  申: '未',
  酉: '申',
  戌: '酉',
  亥: '戌',
  子: '亥',
  丑: '子'
}

const SHI_LING_DAYS = new Set(['甲辰', '乙亥', '丙辰', '丁酉', '戊午', '庚戌', '庚寅', '辛亥', '壬寅', '癸未'])
const SHI_E_DA_BAI_DAYS = new Set(['甲辰', '乙巳', '丙申', '丁亥', '戊戌', '己丑', '庚辰', '辛巳', '壬申', '癸亥'])
const JIU_CHOU_DAYS = new Set(['丁酉', '戊子', '戊午', '己卯', '己酉', '辛卯', '辛酉', '壬子', '壬午'])
const LIU_XIU_DAYS = new Set(['丙午', '丁未', '戊子', '戊午', '己丑', '己未'])
const GU_LUAN_DAYS = new Set(['甲寅', '乙巳', '丙午', '丁巳', '戊午', '戊申', '辛亥', '壬子'])
const YIN_YANG_CHA_CUO_DAYS = new Set(['丙子', '丙午', '丁丑', '丁未', '戊寅', '戊申', '辛卯', '辛酉', '壬辰', '壬戌', '癸巳', '癸亥'])
const KUI_GANG_DAYS = new Set(['戊戌', '庚辰', '庚戌', '壬辰'])
const JIN_SHEN_DAYS = new Set(['乙丑', '己巳', '癸酉'])
const BA_ZHUAN_DAYS = new Set(['甲寅', '乙卯', '丁未', '戊戌', '己未', '庚申', '辛酉', '癸丑'])
const TIAN_SHE_DAY_BY_SEASON = {
  spring: '戊寅',
  summer: '甲午',
  autumn: '戊申',
  winter: '甲子'
}
const SI_FEI_DAYS_BY_SEASON = {
  spring: ['庚申', '辛酉'],
  summer: ['壬子', '癸亥'],
  autumn: ['甲寅', '乙卯'],
  winter: ['丙午', '丁巳']
}
const TIAN_ZHUAN_DAY_BY_SEASON = {
  spring: '乙卯',
  summer: '丙午',
  autumn: '辛酉',
  winter: '壬子'
}
const DI_ZHUAN_DAY_BY_SEASON = {
  spring: '辛卯',
  summer: '戊午',
  autumn: '癸酉',
  winter: '丙子'
}
const XUE_TANG_BRANCH_BY_NAYIN_ELEMENT = {
  金: '巳',
  木: '亥',
  水: '申',
  土: '申',
  火: '寅'
}
const CI_GUAN_BRANCH_BY_NAYIN_ELEMENT = {
  金: '申',
  木: '寅',
  水: '亥',
  土: '亥',
  火: '巳'
}
const SHEN_SHA_ORDER = [
  '十恶大败',
  '十灵日',
  '九丑日',
  '六秀日',
  '八专',
  '孤鸾煞',
  '阴阳差错',
  '魁罡',
  '金神',
  '天赦日',
  '四废',
  '天转',
  '地转日',
  '学堂',
  '词馆',
  '国印贵人',
  '三奇贵人',
  '文昌贵人',
  '天厨贵人',
  '福星贵人',
  '天乙贵人',
  '太极贵人',
  '德秀贵人',
  '金舆',
  '红鸾',
  '天喜',
  '元辰',
  '禄神',
  '羊刃',
  '勾绞煞',
  '红艳煞',
  '亡神',
  '孤辰',
  '寡宿',
  '劫煞',
  '灾煞',
  '天医',
  '天德合',
  '月德合',
  '天罗',
  '地网',
  '空亡',
  '飞刃',
  '将星',
  '驿马',
  '血刃',
  '流霞',
  '桃花',
  '华盖',
  '丧门',
  '吊客',
  '披麻',
  '童子煞',
  '天德贵人',
  '月德贵人'
]
const SHEN_SHA_ORDER_MAP = Object.fromEntries(SHEN_SHA_ORDER.map((name, index) => [name, index]))
const YANG_GAN = new Set(['甲', '丙', '戊', '庚', '壬'])
const GAN_HE = {
  甲: '己',
  己: '甲',
  乙: '庚',
  庚: '乙',
  丙: '辛',
  辛: '丙',
  丁: '壬',
  壬: '丁',
  戊: '癸',
  癸: '戊'
}
const ZHI_HE = {
  子: '丑',
  丑: '子',
  寅: '亥',
  亥: '寅',
  卯: '戌',
  戌: '卯',
  辰: '酉',
  酉: '辰',
  巳: '申',
  申: '巳',
  午: '未',
  未: '午'
}

const toNumber = (value, fallback = 0) => {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const daysInMonth = (year, month) => new Date(year, month, 0).getDate()
const uniq = items => [...new Set(items.filter(Boolean))]
const normalizeGender = value => String(value) === '女' ? '女' : '男'
const normalizeTimeMode = value => value === 'trueSolar' ? 'trueSolar' : 'standard'
const normalizeBirthPlace = value => String(value || '').trim().slice(0, 80)
const getZhiGroup = zhi => Object.keys(ZHI_GROUP_STARS).find(group => group.includes(zhi))
const matchesPillarTarget = (pillar, target) => pillar.gan === target || pillar.zhi === target || pillar.ganZhi === target
const sortShenSha = stars => uniq(stars).sort((a, b) => {
  const orderA = SHEN_SHA_ORDER_MAP[a] ?? 999
  const orderB = SHEN_SHA_ORDER_MAP[b] ?? 999
  return orderA - orderB || a.localeCompare(b, 'zh-Hans-CN')
})
const safeCall = (fn, fallback = '') => {
  try {
    return fn()
  } catch {
    return fallback
  }
}

const getShiShenGan = (dayGan, gan) => gan ? LunarUtil.SHI_SHEN[dayGan + gan] || '' : ''

const getSeasonByMonthZhi = monthZhi => {
  if (['寅', '卯', '辰'].includes(monthZhi)) return 'spring'
  if (['巳', '午', '未'].includes(monthZhi)) return 'summer'
  if (['申', '酉', '戌'].includes(monthZhi)) return 'autumn'
  if (['亥', '子', '丑'].includes(monthZhi)) return 'winter'
  return ''
}

const getYuanChenTarget = (yearGan, yearZhi, gender) => {
  const sameDirection = (YANG_GAN.has(yearGan) && gender === '男') || (!YANG_GAN.has(yearGan) && gender === '女')
  return sameDirection ? YANG_YEAR_YUAN_CHEN_BY_ZHI[yearZhi] : YIN_YEAR_YUAN_CHEN_BY_ZHI[yearZhi]
}

const getHeTarget = target => GAN_HE[target] || ZHI_HE[target] || ''

const getNaYinElement = naYin => String(naYin || '').slice(-1)

const getZhiByOffset = (zhi, offset) => {
  const index = ZHI_SEQUENCE.indexOf(zhi)
  if (index < 0) return ''
  return ZHI_SEQUENCE[(index + offset + ZHI_SEQUENCE.length) % ZHI_SEQUENCE.length]
}

const getSanQiKeys = pillars => {
  const groups = ['甲戊庚', '乙丙丁', '壬癸辛']
  const triples = [
    pillars.slice(0, 3),
    pillars.slice(1, 4)
  ]
  const keys = new Set()

  for (const triple of triples) {
    if (triple.length < 3) continue
    if (!groups.includes(triple.map(pillar => pillar.gan).join(''))) continue
    for (const pillar of triple) keys.add(pillar.key)
  }

  return keys
}

const matchesLuoWangPair = (baseZhi, pillarZhi, pair) => pair.includes(baseZhi) && pair.includes(pillarZhi) && baseZhi !== pillarZhi

const getLuoWangStars = (pillar, context) => {
  const stars = []
  const { dayZhi, yearNaYinElement, yearZhi } = context

  if (pillar.key !== 'year') {
    if (matchesLuoWangPair(yearZhi, pillar.zhi, ['戌', '亥'])) stars.push('天罗')
    if (matchesLuoWangPair(yearZhi, pillar.zhi, ['辰', '巳'])) stars.push('地网')
  }

  if (pillar.key !== 'day') {
    if (matchesLuoWangPair(dayZhi, pillar.zhi, ['戌', '亥'])) stars.push('天罗')
    if (matchesLuoWangPair(dayZhi, pillar.zhi, ['辰', '巳'])) stars.push('地网')
  }

  if (pillar.key === 'day') {
    if (yearNaYinElement === '火' && ['戌', '亥'].includes(pillar.zhi)) stars.push('天罗')
    if (['水', '土'].includes(yearNaYinElement) && ['辰', '巳'].includes(pillar.zhi)) stars.push('地网')
  }

  return stars
}

const hasTongZiSha = (pillar, context) => {
  if (!['day', 'time'].includes(pillar.key)) return false

  const { monthZhi, yearNaYinElement } = context
  const season = getSeasonByMonthZhi(monthZhi)

  return (
    (['spring', 'autumn'].includes(season) && ['寅', '子'].includes(pillar.zhi)) ||
    (['summer', 'winter'].includes(season) && ['卯', '未', '辰'].includes(pillar.zhi)) ||
    (['金', '木'].includes(yearNaYinElement) && ['午', '卯'].includes(pillar.zhi)) ||
    (['水', '火'].includes(yearNaYinElement) && ['酉', '戌'].includes(pillar.zhi)) ||
    (yearNaYinElement === '土' && ['辰', '巳'].includes(pillar.zhi))
  )
}

const getDiShi = (dayGan, zhi) => {
  const zhiIndex = LunarUtil.ZHI.indexOf(zhi) - 1
  const ganIndex = LunarUtil.GAN.indexOf(dayGan) - 1
  const offset = LunarUtil.CHANG_SHENG_OFFSET[dayGan]

  if (zhiIndex < 0 || ganIndex < 0 || offset === undefined) return ''

  let index = offset + (ganIndex % 2 === 0 ? zhiIndex : -zhiIndex)
  while (index >= 12) index -= 12
  while (index < 0) index += 12
  return LunarUtil.CHANG_SHENG[index]
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

export function normalizeBirthInput(input = {}) {
  const merged = { ...defaultBaZiInput, ...input }
  const year = clamp(Math.trunc(toNumber(merged.year, defaultBaZiInput.year)), 1900, 2100)
  const month = clamp(Math.trunc(toNumber(merged.month, defaultBaZiInput.month)), 1, 12)
  const day = clamp(Math.trunc(toNumber(merged.day, defaultBaZiInput.day)), 1, daysInMonth(year, month))
  const hour = clamp(Math.trunc(toNumber(merged.hour, defaultBaZiInput.hour)), 0, 23)
  const minute = clamp(Math.trunc(toNumber(merged.minute, defaultBaZiInput.minute)), 0, 59)
  const gender = normalizeGender(merged.gender)
  const birthProvinceCode = String(merged.birthProvinceCode || defaultBaZiInput.birthProvinceCode)
  const birthCityCode = String(merged.birthCityCode || defaultBaZiInput.birthCityCode)
  const birthAreaCode = String(merged.birthAreaCode || defaultBaZiInput.birthAreaCode)
  const birthPlace = normalizeBirthPlace(merged.birthPlace)
  const birthLongitude = Math.round(clamp(toNumber(merged.birthLongitude, defaultBaZiInput.birthLongitude), -180, 180) * 100) / 100
  const birthLatitude = Math.round(clamp(toNumber(merged.birthLatitude, defaultBaZiInput.birthLatitude), -90, 90) * 100) / 100
  const timeMode = normalizeTimeMode(merged.timeMode)
  const yunSect = Number(merged.yunSect) === 1 ? 1 : 2
  const sect = Number(merged.sect) === 1 ? 1 : 2

  return { year, month, day, hour, minute, gender, birthProvinceCode, birthCityCode, birthAreaCode, birthPlace, birthLongitude, birthLatitude, timeMode, yunSect, sect }
}

const getPillar = (eightChar, key, label) => {
  const cap = key[0].toUpperCase() + key.slice(1)
  const gan = eightChar[`get${cap}Gan`]()
  const zhi = eightChar[`get${cap}Zhi`]()

  return {
    key,
    label,
    ganZhi: eightChar[`get${cap}`](),
    gan,
    zhi,
    ganElement: GAN_ELEMENT[gan],
    zhiElement: ZHI_ELEMENT[zhi],
    wuXing: eightChar[`get${cap}WuXing`](),
    naYin: eightChar[`get${cap}NaYin`](),
    shiShenGan: eightChar[`get${cap}ShiShenGan`](),
    shiShenZhi: eightChar[`get${cap}ShiShenZhi`](),
    hideGan: eightChar[`get${cap}HideGan`](),
    diShi: eightChar[`get${cap}DiShi`](),
    selfDiShi: getDiShi(gan, zhi),
    xun: eightChar[`get${cap}Xun`](),
    xunKong: eightChar[`get${cap}XunKong`]()
  }
}

const buildShenSha = (pillar, context) => {
  const stars = []
  const {
    dayGan,
    dayGanZhi,
    monthZhi,
    yearGan,
    yearNaYinElement,
    yearZhi,
    dayXunKong,
    yearXunKong,
    gender,
    sanQiKeys
  } = context
  const season = getSeasonByMonthZhi(monthZhi)

  for (const [star, map] of Object.entries(DAY_GAN_BRANCH_STARS)) {
    if (map[dayGan]?.includes(pillar.zhi)) stars.push(star)
  }

  for (const star of ['天乙贵人', '文昌贵人', '太极贵人', '福星贵人']) {
    if (DAY_GAN_BRANCH_STARS[star][yearGan]?.includes(pillar.zhi)) stars.push(star)
  }

  for (const gan of [dayGan, yearGan]) {
    if (TIAN_CHU_BRANCH_BY_GAN[gan]?.includes(pillar.zhi)) stars.push('天厨贵人')
    if (GUO_YIN_BRANCH_BY_GAN[gan] === pillar.zhi) stars.push('国印贵人')
  }

  if (sanQiKeys.has(pillar.key)) stars.push('三奇贵人')
  if (FEI_REN_BRANCH_BY_DAY_GAN[dayGan]?.includes(pillar.zhi)) stars.push('飞刃')
  if (LIU_XIA_BRANCH_BY_DAY_GAN[dayGan] === pillar.zhi) stars.push('流霞')
  if (HONG_YAN_BRANCH_BY_DAY_GAN[dayGan] === pillar.zhi) stars.push('红艳煞')
  if (DE_XIU_GAN_BY_MONTH_ZHI[monthZhi]?.includes(pillar.gan)) stars.push('德秀贵人')
  if (getYuanChenTarget(yearGan, yearZhi, gender) === pillar.zhi) stars.push('元辰')
  if (GOU_JIAO_BRANCHES_BY_YEAR_ZHI[yearZhi]?.includes(pillar.zhi)) stars.push('勾绞煞')
  if (GU_CHEN_BRANCH_BY_YEAR_ZHI[yearZhi] === pillar.zhi) stars.push('孤辰')
  if (GUA_SU_BRANCH_BY_YEAR_ZHI[yearZhi] === pillar.zhi) stars.push('寡宿')
  if (BLOOD_BLADE_BRANCH_BY_MONTH_ZHI[monthZhi] === pillar.zhi) stars.push('血刃')
  if (HONG_LUAN_BRANCH_BY_YEAR_ZHI[yearZhi] === pillar.zhi) stars.push('红鸾')
  if (TIAN_XI_BRANCH_BY_YEAR_ZHI[yearZhi] === pillar.zhi) stars.push('天喜')
  if (XUE_TANG_BRANCH_BY_NAYIN_ELEMENT[yearNaYinElement] === pillar.zhi && pillar.key !== 'year') stars.push('学堂')
  if (CI_GUAN_BRANCH_BY_NAYIN_ELEMENT[yearNaYinElement] === pillar.zhi && pillar.key !== 'year') stars.push('词馆')
  if (getZhiByOffset(yearZhi, 2) === pillar.zhi && pillar.key !== 'year') stars.push('丧门')
  if (getZhiByOffset(yearZhi, -2) === pillar.zhi && pillar.key !== 'year') stars.push('吊客')
  if (getZhiByOffset(yearZhi, -3) === pillar.zhi && pillar.key !== 'year') stars.push('披麻')
  if (hasTongZiSha(pillar, context)) stars.push('童子煞')

  const group = getZhiGroup(yearZhi)
  if (group && pillar.key !== 'year') {
    for (const [star, targetZhi] of Object.entries(ZHI_GROUP_STARS[group])) {
      if (targetZhi === pillar.zhi) stars.push(star)
    }
  }

  const dayGroup = getZhiGroup(context.dayZhi)
  if (dayGroup && pillar.key !== 'day') {
    for (const star of ['驿马', '劫煞']) {
      if (ZHI_GROUP_STARS[dayGroup][star] === pillar.zhi) stars.push(star)
    }
  }

  if (matchesPillarTarget(pillar, TIAN_DE_TARGET_BY_MONTH_ZHI[monthZhi])) stars.push('天德贵人')
  if (matchesPillarTarget(pillar, getHeTarget(TIAN_DE_TARGET_BY_MONTH_ZHI[monthZhi]))) stars.push('天德合')
  if (matchesPillarTarget(pillar, YUE_DE_TARGET_BY_MONTH_ZHI[monthZhi])) stars.push('月德贵人')
  if (matchesPillarTarget(pillar, getHeTarget(YUE_DE_TARGET_BY_MONTH_ZHI[monthZhi]))) stars.push('月德合')
  if (matchesPillarTarget(pillar, TIAN_YI_TARGET_BY_MONTH_ZHI[monthZhi])) stars.push('天医')
  for (const star of getLuoWangStars(pillar, context)) stars.push(star)
  if (dayXunKong.includes(pillar.zhi) || yearXunKong.includes(pillar.zhi)) stars.push('空亡')
  if (pillar.key === 'day') {
    if (SHI_E_DA_BAI_DAYS.has(dayGanZhi)) stars.push('十恶大败')
    if (SHI_LING_DAYS.has(dayGanZhi)) stars.push('十灵日')
    if (JIU_CHOU_DAYS.has(dayGanZhi)) stars.push('九丑日')
    if (LIU_XIU_DAYS.has(dayGanZhi)) stars.push('六秀日')
    if (BA_ZHUAN_DAYS.has(dayGanZhi)) stars.push('八专')
    if (GU_LUAN_DAYS.has(dayGanZhi)) stars.push('孤鸾煞')
    if (YIN_YANG_CHA_CUO_DAYS.has(dayGanZhi)) stars.push('阴阳差错')
    if (KUI_GANG_DAYS.has(dayGanZhi)) stars.push('魁罡')
    if (JIN_SHEN_DAYS.has(dayGanZhi)) stars.push('金神')
    if (TIAN_SHE_DAY_BY_SEASON[season] === dayGanZhi) stars.push('天赦日')
    if (SI_FEI_DAYS_BY_SEASON[season]?.includes(dayGanZhi)) stars.push('四废')
    if (TIAN_ZHUAN_DAY_BY_SEASON[season] === dayGanZhi) stars.push('天转')
    if (DI_ZHUAN_DAY_BY_SEASON[season] === dayGanZhi) stars.push('地转日')
  }
  if (pillar.key === 'time' && JIN_SHEN_DAYS.has(pillar.ganZhi)) {
    stars.push('金神')
  }

  return sortShenSha(stars)
}

const countVisibleElements = pillars => {
  const base = ['木', '火', '土', '金', '水'].map(element => ({ element, count: 0 }))
  const map = Object.fromEntries(base.map(item => [item.element, item]))

  for (const pillar of pillars) {
    map[GAN_ELEMENT[pillar.gan]].count += 1
    map[ZHI_ELEMENT[pillar.zhi]].count += 1
  }

  return base
}

const buildGanZhiDetail = (ganZhi, dayGan) => {
  const gan = ganZhi?.[0] || ''
  const zhi = ganZhi?.[1] || ''
  const hideGan = zhi ? LunarUtil.ZHI_HIDE_GAN[zhi] || [] : []

  return {
    gan,
    zhi,
    ganElement: GAN_ELEMENT[gan] || '',
    zhiElement: ZHI_ELEMENT[zhi] || '',
    shiShenGan: getShiShenGan(dayGan, gan),
    hideGan,
    shiShenZhi: hideGan.map(item => getShiShenGan(dayGan, item)).filter(Boolean),
    diShi: getDiShi(dayGan, zhi),
    naYin: ganZhi ? LunarUtil.NAYIN[ganZhi] || '' : ''
  }
}

const buildLiuNian = (rawItems, dayGan, currentYear) => rawItems.map(item => {
  const ganZhi = item.getGanZhi()

  return {
    year: item.getYear(),
    age: item.getAge(),
    index: item.getIndex(),
    ganZhi,
    xunKong: safeCall(() => item.getXunKong()),
    active: item.getYear() === currentYear,
    ...buildGanZhiDetail(ganZhi, dayGan)
  }
})

const buildDaYun = (eightChar, normalized, currentYear) => {
  const genderNumber = normalized.gender === '女' ? 0 : 1
  const yun = eightChar.getYun(genderNumber, normalized.yunSect)
  const daYun = yun.getDaYun().map(item => {
    const ganZhi = item.getGanZhi()
    const startYear = item.getStartYear()
    const endYear = item.getEndYear()

    return {
      index: item.getIndex(),
      label: ganZhi || '小运',
      ganZhi,
      startYear,
      endYear,
      startAge: item.getStartAge(),
      endAge: item.getEndAge(),
      xunKong: ganZhi ? safeCall(() => item.getXunKong()) : '',
      active: currentYear >= startYear && currentYear <= endYear,
      ...buildGanZhiDetail(ganZhi, eightChar.getDayGan()),
      liuNian: buildLiuNian(item.getLiuNian(), eightChar.getDayGan(), currentYear)
    }
  })
  const currentDaYun = daYun.find(item => item.active) || daYun.find(item => item.index > 0) || daYun[0]
  const startSolar = safeCall(() => yun.getStartSolar()?.toYmd(), '')
  const startParts = [
    `${yun.getStartYear()}年`,
    `${yun.getStartMonth()}月`,
    `${yun.getStartDay()}日`,
    yun.getStartHour() ? `${yun.getStartHour()}时` : ''
  ].filter(Boolean).join('')

  return {
    yunStart: {
      years: yun.getStartYear(),
      months: yun.getStartMonth(),
      days: yun.getStartDay(),
      hours: yun.getStartHour(),
      forward: yun.isForward(),
      solarText: startSolar,
      text: `出生后${startParts}起运`
    },
    daYun,
    currentDaYun,
    liuNian: currentDaYun?.liuNian || []
  }
}

export function calculateBaZiChart(input = {}) {
  const normalized = normalizeBirthInput(input)
  const currentYear = clamp(Math.trunc(toNumber(input.currentYear, new Date().getFullYear())), 1900, 2200)
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
  const lunar = solar.getLunar()
  const displayLunar = normalized.sect === 1 && solar.getHour() === 23
    ? solar.next(1).getLunar()
    : lunar
  const eightChar = lunar.getEightChar()
  eightChar.setSect(normalized.sect)

  const pillars = [
    getPillar(eightChar, 'year', '年柱'),
    getPillar(eightChar, 'month', '月柱'),
    getPillar(eightChar, 'day', '日柱'),
    getPillar(eightChar, 'time', '时柱')
  ]
  const shenShaContext = {
    dayGan: eightChar.getDayGan(),
    dayZhi: eightChar.getDayZhi(),
    dayGanZhi: eightChar.getDay(),
    yearGan: eightChar.getYearGan(),
    yearNaYinElement: getNaYinElement(eightChar.getYearNaYin()),
    yearZhi: eightChar.getYearZhi(),
    monthZhi: eightChar.getMonthZhi(),
    dayXunKong: eightChar.getDayXunKong(),
    yearXunKong: eightChar.getYearXunKong(),
    gender: normalized.gender,
    sanQiKeys: getSanQiKeys(pillars)
  }
  const enrichedPillars = pillars.map(pillar => ({
    ...pillar,
    shenSha: buildShenSha(pillar, shenShaContext)
  }))
  const luck = buildDaYun(eightChar, normalized, currentYear)

  return {
    input: normalized,
    currentYear,
    solarText: inputSolar.toYmdHms(),
    solarFullText: inputSolar.toFullString(),
    chartSolarText: solar.toYmdHms(),
    chartSolarFullText: solar.toFullString(),
    timeAdjustment: {
      mode: normalized.timeMode,
      offsetMinutes: solarAdjustment.offsetMinutes,
      longitudeOffsetMinutes: solarAdjustment.longitudeOffsetMinutes,
      equationOfTimeMinutes: solarAdjustment.equationOfTimeMinutes,
      standardMeridian: STANDARD_MERIDIAN
    },
    lunarText: displayLunar.toString(),
    lunarFullText: displayLunar.toFullString(),
    eightCharText: eightChar.toString(),
    dayMaster: eightChar.getDayGan(),
    mingGong: eightChar.getMingGong(),
    mingGongNaYin: eightChar.getMingGongNaYin(),
    shenGong: eightChar.getShenGong(),
    shenGongNaYin: eightChar.getShenGongNaYin(),
    taiYuan: eightChar.getTaiYuan(),
    taiYuanNaYin: eightChar.getTaiYuanNaYin(),
    taiXi: eightChar.getTaiXi(),
    taiXiNaYin: eightChar.getTaiXiNaYin(),
    pillars: enrichedPillars,
    elementCounts: countVisibleElements(enrichedPillars),
    ...luck,
    notes: [
      '输入口径：默认按公历/阳历日期和真太阳时排盘，按出生地经度修正排盘用时间。',
      '出生地：下拉选择后自动带出经纬度；排盘修正只使用经度，纬度用于记录和导出。',
      '真太阳时：按经度相对东经 120 度的差值和均时差修正排盘时间。',
      '子时口径：23 点附近可能因流派换日规则不同而变化，可在左侧切换。',
      '起运口径：默认按分钟精确折算；如需对照按时辰折算的排盘，可在左侧切换。',
      '性别字段只用于大运顺逆和起运序列。',
      '神煞口径：按公开神煞大全和常见排盘软件规则输出字段集合，不输出吉凶断语。',
      '输出范围：只展示排盘字段。'
    ]
  }
}
