import { Solar } from 'lunar-javascript'

const GAN_ELEMENTS = {
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

const ZHI_ELEMENTS = {
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

const GENERATES = {
  木: '火',
  火: '土',
  土: '金',
  金: '水',
  水: '木'
}

const CONTROLS = {
  木: '土',
  土: '水',
  水: '火',
  火: '金',
  金: '木'
}

const ZHI_SEQUENCE = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

const TRIGRAMS = [
  { name: '乾', nature: '天', symbol: '☰', element: '金', bits: [1, 1, 1], naJia: ['甲子', '甲寅', '甲辰', '壬午', '壬申', '壬戌'] },
  { name: '兑', nature: '泽', symbol: '☱', element: '金', bits: [1, 1, 0], naJia: ['丁巳', '丁卯', '丁丑', '丁亥', '丁酉', '丁未'] },
  { name: '离', nature: '火', symbol: '☲', element: '火', bits: [1, 0, 1], naJia: ['己卯', '己丑', '己亥', '己酉', '己未', '己巳'] },
  { name: '震', nature: '雷', symbol: '☳', element: '木', bits: [1, 0, 0], naJia: ['庚子', '庚寅', '庚辰', '庚午', '庚申', '庚戌'] },
  { name: '巽', nature: '风', symbol: '☴', element: '木', bits: [0, 1, 1], naJia: ['辛丑', '辛亥', '辛酉', '辛未', '辛巳', '辛卯'] },
  { name: '坎', nature: '水', symbol: '☵', element: '水', bits: [0, 1, 0], naJia: ['戊寅', '戊辰', '戊午', '戊申', '戊戌', '戊子'] },
  { name: '艮', nature: '山', symbol: '☶', element: '土', bits: [0, 0, 1], naJia: ['丙辰', '丙午', '丙申', '丙戌', '丙子', '丙寅'] },
  { name: '坤', nature: '地', symbol: '☷', element: '土', bits: [0, 0, 0], naJia: ['乙未', '乙巳', '乙卯', '癸丑', '癸亥', '癸酉'] }
]

const TRIGRAM_BY_BITS = Object.fromEntries(TRIGRAMS.map(trigram => [trigram.bits.join(''), trigram]))
const TRIGRAM_BY_NAME = Object.fromEntries(TRIGRAMS.map(trigram => [trigram.name, trigram]))

const PALACE_SEQUENCES = [
  {
    palace: '乾',
    element: '金',
    items: [
      ['乾为天', '乾', '乾', '本宫'],
      ['天风姤', '乾', '巽', '一世'],
      ['天山遁', '乾', '艮', '二世'],
      ['天地否', '乾', '坤', '三世'],
      ['风地观', '巽', '坤', '四世'],
      ['山地剥', '艮', '坤', '五世'],
      ['火地晋', '离', '坤', '游魂'],
      ['火天大有', '离', '乾', '归魂']
    ]
  },
  {
    palace: '坎',
    element: '水',
    items: [
      ['坎为水', '坎', '坎', '本宫'],
      ['水泽节', '坎', '兑', '一世'],
      ['水雷屯', '坎', '震', '二世'],
      ['水火既济', '坎', '离', '三世'],
      ['泽火革', '兑', '离', '四世'],
      ['雷火丰', '震', '离', '五世'],
      ['地火明夷', '坤', '离', '游魂'],
      ['地水师', '坤', '坎', '归魂']
    ]
  },
  {
    palace: '艮',
    element: '土',
    items: [
      ['艮为山', '艮', '艮', '本宫'],
      ['山火贲', '艮', '离', '一世'],
      ['山天大畜', '艮', '乾', '二世'],
      ['山泽损', '艮', '兑', '三世'],
      ['火泽睽', '离', '兑', '四世'],
      ['天泽履', '乾', '兑', '五世'],
      ['风泽中孚', '巽', '兑', '游魂'],
      ['风山渐', '巽', '艮', '归魂']
    ]
  },
  {
    palace: '震',
    element: '木',
    items: [
      ['震为雷', '震', '震', '本宫'],
      ['雷地豫', '震', '坤', '一世'],
      ['雷水解', '震', '坎', '二世'],
      ['雷风恒', '震', '巽', '三世'],
      ['地风升', '坤', '巽', '四世'],
      ['水风井', '坎', '巽', '五世'],
      ['泽风大过', '兑', '巽', '游魂'],
      ['泽雷随', '兑', '震', '归魂']
    ]
  },
  {
    palace: '巽',
    element: '木',
    items: [
      ['巽为风', '巽', '巽', '本宫'],
      ['风天小畜', '巽', '乾', '一世'],
      ['风火家人', '巽', '离', '二世'],
      ['风雷益', '巽', '震', '三世'],
      ['天雷无妄', '乾', '震', '四世'],
      ['火雷噬嗑', '离', '震', '五世'],
      ['山雷颐', '艮', '震', '游魂'],
      ['山风蛊', '艮', '巽', '归魂']
    ]
  },
  {
    palace: '离',
    element: '火',
    items: [
      ['离为火', '离', '离', '本宫'],
      ['火山旅', '离', '艮', '一世'],
      ['火风鼎', '离', '巽', '二世'],
      ['火水未济', '离', '坎', '三世'],
      ['山水蒙', '艮', '坎', '四世'],
      ['风水涣', '巽', '坎', '五世'],
      ['天水讼', '乾', '坎', '游魂'],
      ['天火同人', '乾', '离', '归魂']
    ]
  },
  {
    palace: '坤',
    element: '土',
    items: [
      ['坤为地', '坤', '坤', '本宫'],
      ['地雷复', '坤', '震', '一世'],
      ['地泽临', '坤', '兑', '二世'],
      ['地天泰', '坤', '乾', '三世'],
      ['雷天大壮', '震', '乾', '四世'],
      ['泽天夬', '兑', '乾', '五世'],
      ['水天需', '坎', '乾', '游魂'],
      ['水地比', '坎', '坤', '归魂']
    ]
  },
  {
    palace: '兑',
    element: '金',
    items: [
      ['兑为泽', '兑', '兑', '本宫'],
      ['泽水困', '兑', '坎', '一世'],
      ['泽地萃', '兑', '坤', '二世'],
      ['泽山咸', '兑', '艮', '三世'],
      ['水山蹇', '坎', '艮', '四世'],
      ['地山谦', '坤', '艮', '五世'],
      ['雷山小过', '震', '艮', '游魂'],
      ['雷泽归妹', '震', '兑', '归魂']
    ]
  }
]

const POSITION_BY_SEQUENCE = [
  { world: 6, response: 3 },
  { world: 1, response: 4 },
  { world: 2, response: 5 },
  { world: 3, response: 6 },
  { world: 4, response: 1 },
  { world: 5, response: 2 },
  { world: 4, response: 1 },
  { world: 3, response: 6 }
]

const HEXAGRAM_BY_TRIGRAMS = Object.fromEntries(
  PALACE_SEQUENCES.flatMap(sequence => sequence.items.map((item, index) => {
    const [name, upperName, lowerName, kind] = item
    const upper = TRIGRAM_BY_NAME[upperName]
    const lower = TRIGRAM_BY_NAME[lowerName]
    return [
      `${upperName}|${lowerName}`,
      {
        name,
        kind,
        index,
        palace: sequence.palace,
        palaceElement: sequence.element,
        upper,
        lower,
        ...POSITION_BY_SEQUENCE[index]
      }
    ]
  }))
)

const LINE_STATE_CONFIG = {
  youngYang: { value: 'youngYang', label: '少阳', symbol: '—', lineType: '阳爻', bit: 1, moving: false, marker: '' },
  youngYin: { value: 'youngYin', label: '少阴', symbol: '--', lineType: '阴爻', bit: 0, moving: false, marker: '' },
  oldYang: { value: 'oldYang', label: '老阳', symbol: 'O', lineType: '阳动', bit: 1, moving: true, marker: 'O→', changesTo: 0 },
  oldYin: { value: 'oldYin', label: '老阴', symbol: 'X', lineType: '阴动', bit: 0, moving: true, marker: 'X→', changesTo: 1 }
}

export const liuYaoLineStateOptions = [
  { value: 'youngYang', label: '少阳', description: '阳爻' },
  { value: 'youngYin', label: '少阴', description: '阴爻' },
  { value: 'oldYang', label: '老阳', description: '阳动变阴' },
  { value: 'oldYin', label: '老阴', description: '阴动变阳' }
]

export const liuYaoMethodOptions = [
  { value: 'manual', label: '手动指定', description: '逐爻选择阴阳动静' },
  { value: 'numbers', label: '三数起卦', description: '上卦数 / 下卦数 / 动爻数' },
  { value: 'time', label: '时间起卦', description: '按农历年月日时取卦' }
]

const METHOD_ALIASES = {
  manual: 'manual',
  手动指定: 'manual',
  numbers: 'numbers',
  三数起卦: 'numbers',
  time: 'time',
  时间起卦: 'time'
}

const METHOD_LABELS = Object.fromEntries(liuYaoMethodOptions.map(option => [option.value, option.label]))

const XIAN_TIAN_TRIGRAM_BY_NUMBER = {
  1: '乾',
  2: '兑',
  3: '离',
  4: '震',
  5: '巽',
  6: '坎',
  7: '艮',
  8: '坤'
}

export const defaultLiuYaoInput = {
  question: '和前任的感情？',
  year: 2026,
  month: 5,
  day: 14,
  hour: 22,
  minute: 3,
  method: 'manual',
  numbers: [1, 8, 6],
  lines: ['youngYang', 'oldYin', 'youngYin', 'oldYang', 'youngYang', 'youngYin']
}

export const liuYaoExampleInputs = [
  {
    id: 'manual-relationship',
    label: '手动指定样例',
    description: '感情事项 · 泽雷随变水泽节',
    input: {
      ...defaultLiuYaoInput,
      method: 'manual'
    }
  },
  {
    id: 'numbers-launch',
    label: '三数起卦样例',
    description: '1 / 8 / 6 · 天地否变泽地萃',
    input: {
      ...defaultLiuYaoInput,
      question: '产品上线是否顺利？',
      method: 'numbers',
      numbers: [1, 8, 6]
    }
  },
  {
    id: 'time-progress',
    label: '时间起卦样例',
    description: '按当前日期时辰字段推盘',
    input: {
      ...defaultLiuYaoInput,
      question: '今天适不适合推进？',
      method: 'time'
    }
  }
]

const LIU_SHEN_SEQUENCE = ['青龙', '朱雀', '勾陈', '腾蛇', '白虎', '玄武']
const LIU_SHEN_START_BY_GAN = {
  甲: '青龙',
  乙: '青龙',
  丙: '朱雀',
  丁: '朱雀',
  戊: '勾陈',
  己: '腾蛇',
  庚: '白虎',
  辛: '白虎',
  壬: '玄武',
  癸: '玄武'
}

const LIU_QIN_SHORT = {
  父母: '父',
  兄弟: '兄',
  官鬼: '官',
  妻财: '财',
  子孙: '孙'
}

const LIU_HE = new Set(['子丑', '寅亥', '卯戌', '辰酉', '巳申', '午未'])
const LIU_CHONG = new Set(['子午', '丑未', '寅申', '卯酉', '辰戌', '巳亥'])
const LIU_HAI = new Set(['子未', '丑午', '寅巳', '卯辰', '申亥', '酉戌'])
const SAN_XING_GROUPS = [
  new Set(['寅', '巳', '申']),
  new Set(['丑', '未', '戌'])
]
const SELF_XING = new Set(['辰', '午', '酉', '亥'])
const TOMB_BRANCH_BY_ELEMENT = {
  木: '未',
  火: '戌',
  土: '辰',
  金: '丑',
  水: '辰'
}
const JUE_BRANCH_BY_ELEMENT = {
  木: '申',
  火: '亥',
  土: '巳',
  金: '寅',
  水: '巳'
}
const JIN_SHEN_PAIRS = new Set(['亥子', '寅卯', '巳午', '申酉', '丑辰', '辰未', '未戌', '戌丑'])
const TUI_SHEN_PAIRS = new Set(['子亥', '卯寅', '午巳', '酉申', '辰丑', '未辰', '戌未', '丑戌'])
const DAY_LU_BY_GAN = {
  甲: '寅',
  乙: '卯',
  丙: '巳',
  丁: '午',
  戊: '巳',
  己: '午',
  庚: '申',
  辛: '酉',
  壬: '亥',
  癸: '子'
}
const GROUP_STARS = {
  申子辰: { 驿马: '寅', 桃花: '酉' },
  寅午戌: { 驿马: '申', 桃花: '卯' },
  巳酉丑: { 驿马: '亥', 桃花: '午' },
  亥卯未: { 驿马: '巳', 桃花: '子' }
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const toNumber = (value, fallback) => {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}
const pad = value => String(value).padStart(2, '0')
const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate()

const normalizeLines = lines => {
  const source = Array.isArray(lines) ? lines : defaultLiuYaoInput.lines
  return Array.from({ length: 6 }, (_, index) => {
    const value = source[index]
    return LINE_STATE_CONFIG[value] ? value : defaultLiuYaoInput.lines[index]
  })
}

const normalizeNumbers = numbers => {
  const source = Array.isArray(numbers) ? numbers : defaultLiuYaoInput.numbers
  return Array.from({ length: 3 }, (_, index) => {
    const fallback = defaultLiuYaoInput.numbers[index]
    return clamp(Math.trunc(toNumber(source[index], fallback)), 1, 999999)
  })
}

export function normalizeLiuYaoInput(input = {}) {
  const merged = { ...defaultLiuYaoInput, ...input }
  const year = clamp(Math.trunc(toNumber(merged.year, defaultLiuYaoInput.year)), 1900, 2100)
  const month = clamp(Math.trunc(toNumber(merged.month, defaultLiuYaoInput.month)), 1, 12)
  const day = clamp(Math.trunc(toNumber(merged.day, defaultLiuYaoInput.day)), 1, getDaysInMonth(year, month))
  const hour = clamp(Math.trunc(toNumber(merged.hour, defaultLiuYaoInput.hour)), 0, 23)
  const minute = clamp(Math.trunc(toNumber(merged.minute, defaultLiuYaoInput.minute)), 0, 59)
  const question = String(merged.question || '').trim().slice(0, 80) || defaultLiuYaoInput.question
  const methodKey = METHOD_ALIASES[String(merged.method || defaultLiuYaoInput.method).trim()] || defaultLiuYaoInput.method
  const lines = normalizeLines(merged.lines)
  const numbers = normalizeNumbers(merged.numbers)

  return { question, year, month, day, hour, minute, method: methodKey, methodLabel: METHOD_LABELS[methodKey], numbers, lines }
}

const getTrigramByBits = bits => TRIGRAM_BY_BITS[bits.join('')]

const getHexagramByBits = bits => {
  const lower = getTrigramByBits(bits.slice(0, 3))
  const upper = getTrigramByBits(bits.slice(3, 6))
  return HEXAGRAM_BY_TRIGRAMS[`${upper.name}|${lower.name}`] || {
    name: `${upper.nature}${lower.nature}`,
    kind: '未知',
    index: -1,
    palace: upper.name,
    palaceElement: upper.element,
    upper,
    lower,
    world: 3,
    response: 6
  }
}

const getNumberRemainder = (number, modulo) => {
  const remainder = Math.abs(Math.trunc(number)) % modulo
  return remainder === 0 ? modulo : remainder
}

const getTrigramByNumber = number => {
  const index = getNumberRemainder(number, 8)
  const name = XIAN_TIAN_TRIGRAM_BY_NUMBER[index]
  return { index, name, trigram: TRIGRAM_BY_NAME[name] }
}

const getLineStatesFromTrigrams = (upperTrigram, lowerTrigram, movingLine) => {
  const bits = [...lowerTrigram.bits, ...upperTrigram.bits]
  return bits.map((bit, index) => {
    const isMoving = index + 1 === movingLine
    if (!isMoving) return bit ? 'youngYang' : 'youngYin'
    return bit ? 'oldYang' : 'oldYin'
  })
}

const buildNumberMethod = numbers => {
  const [upperNumber, lowerNumber, movingNumber] = numbers
  const upper = getTrigramByNumber(upperNumber)
  const lower = getTrigramByNumber(lowerNumber)
  const movingLine = getNumberRemainder(movingNumber, 6)

  return {
    lineStates: getLineStatesFromTrigrams(upper.trigram, lower.trigram, movingLine),
    detail: {
      method: 'numbers',
      label: METHOD_LABELS.numbers,
      upperNumber,
      lowerNumber,
      movingNumber,
      upperIndex: upper.index,
      lowerIndex: lower.index,
      movingLine,
      upperTrigram: upper.name,
      lowerTrigram: lower.name,
      summary: `${upperNumber}取${upper.name}为上卦，${lowerNumber}取${lower.name}为下卦，${movingNumber}取${movingLine}爻动`
    }
  }
}

const buildTimeMethod = (lunar, eightChar) => {
  const yearBranch = eightChar.getYearZhi()
  const timeBranch = eightChar.getTimeZhi()
  const yearBranchNumber = ZHI_SEQUENCE.indexOf(yearBranch) + 1
  const timeBranchNumber = ZHI_SEQUENCE.indexOf(timeBranch) + 1
  const lunarMonth = Math.abs(lunar.getMonth())
  const lunarDay = lunar.getDay()
  const upperSeed = yearBranchNumber + lunarMonth + lunarDay
  const lowerSeed = upperSeed + timeBranchNumber
  const upper = getTrigramByNumber(upperSeed)
  const lower = getTrigramByNumber(lowerSeed)
  const movingLine = getNumberRemainder(lowerSeed, 6)

  return {
    lineStates: getLineStatesFromTrigrams(upper.trigram, lower.trigram, movingLine),
    detail: {
      method: 'time',
      label: METHOD_LABELS.time,
      yearBranch,
      yearBranchNumber,
      lunarMonth,
      lunarDay,
      timeBranch,
      timeBranchNumber,
      upperSeed,
      lowerSeed,
      movingLine,
      upperTrigram: upper.name,
      lowerTrigram: lower.name,
      summary: `年支${yearBranch}${yearBranchNumber} + 农历${lunarMonth}月${lunarDay}日取${upper.name}，再加${timeBranch}时${timeBranchNumber}取${lower.name}，${movingLine}爻动`
    }
  }
}

const buildManualMethod = lineStates => ({
  lineStates,
  detail: {
    method: 'manual',
    label: METHOD_LABELS.manual,
    summary: '按页面所选六爻阴阳动静排盘'
  }
})

const buildMethodLineStates = (normalized, lunar, eightChar) => {
  if (normalized.method === 'numbers') return buildNumberMethod(normalized.numbers)
  if (normalized.method === 'time') return buildTimeMethod(lunar, eightChar)
  return buildManualMethod(normalized.lines)
}

const getSixRelative = (palaceElement, lineElement) => {
  if (palaceElement === lineElement) return '兄弟'
  if (GENERATES[lineElement] === palaceElement) return '父母'
  if (GENERATES[palaceElement] === lineElement) return '子孙'
  if (CONTROLS[lineElement] === palaceElement) return '官鬼'
  if (CONTROLS[palaceElement] === lineElement) return '妻财'
  return ''
}

const getLineStemBranch = (hexagram, position) => {
  const trigram = position <= 3 ? hexagram.lower : hexagram.upper
  const naJia = trigram.naJia[position - 1]
  const gan = naJia[0]
  const zhi = naJia[1]
  const element = ZHI_ELEMENTS[zhi]

  return { gan, zhi, element, ganZhi: naJia }
}

const getSixGods = dayGan => {
  const start = LIU_SHEN_START_BY_GAN[dayGan] || '青龙'
  const startIndex = LIU_SHEN_SEQUENCE.indexOf(start)
  return Array.from({ length: 6 }, (_, index) => LIU_SHEN_SEQUENCE[(startIndex + index) % LIU_SHEN_SEQUENCE.length])
}

const pairKey = (a, b) => [a, b].sort((left, right) => ZHI_SEQUENCE.indexOf(left) - ZHI_SEQUENCE.indexOf(right)).join('')
const isHe = (a, b) => LIU_HE.has(pairKey(a, b))
const isChong = (a, b) => LIU_CHONG.has(pairKey(a, b))
const isHai = (a, b) => LIU_HAI.has(pairKey(a, b))
const isXing = (a, b) => a === b ? SELF_XING.has(a) : SAN_XING_GROUPS.some(group => group.has(a) && group.has(b))

const getElementRelation = (sourceElement, targetElement, sourceLabel) => {
  if (sourceElement === targetElement) return `临${sourceLabel}`
  if (GENERATES[targetElement] === sourceElement) return `${sourceLabel}生`
  if (GENERATES[sourceElement] === targetElement) return `生${sourceLabel}`
  if (CONTROLS[targetElement] === sourceElement) return `${sourceLabel}克`
  if (CONTROLS[sourceElement] === targetElement) return `克${sourceLabel}`
  return ''
}

const getBranchRelationTags = (branch, targetBranch, targetLabel) => {
  const tags = []
  if (isHe(branch, targetBranch)) tags.push(`${targetLabel}合`)
  if (isChong(branch, targetBranch)) tags.push(`${targetLabel}冲`)
  if (isXing(branch, targetBranch)) tags.push(`${targetLabel}刑`)
  if (isHai(branch, targetBranch)) tags.push(`${targetLabel}害`)
  return tags
}

const getTombJueTags = (lineElement, targetBranch, targetLabel) => [
  TOMB_BRANCH_BY_ELEMENT[lineElement] === targetBranch ? `${targetLabel}墓` : '',
  JUE_BRANCH_BY_ELEMENT[lineElement] === targetBranch ? `${targetLabel}绝` : ''
].filter(Boolean)

const unique = items => [...new Set(items.filter(Boolean))]

const buildMovingTags = (line, changedLine) => {
  if (!line.moving || !changedLine) return []
  const tags = ['动爻']
  const source = line.zhi
  const target = changedLine.zhi
  const sourceElement = line.element
  const targetElement = changedLine.element

  if (isHe(source, target)) tags.push('化合')
  if (isChong(source, target)) tags.push('化冲')
  if (JIN_SHEN_PAIRS.has(`${source}${target}`)) tags.push('进神')
  if (TUI_SHEN_PAIRS.has(`${source}${target}`)) tags.push('退神')
  if (GENERATES[targetElement] === sourceElement) tags.push('回头生')
  if (CONTROLS[targetElement] === sourceElement) tags.push('回头克')
  if (GENERATES[sourceElement] === targetElement) tags.push('化泄')
  if (CONTROLS[sourceElement] === targetElement) tags.push('化克')

  return tags
}

const buildLineRelations = (line, context, changedLine) => {
  const tags = [
    ...getBranchRelationTags(line.zhi, context.monthZhi, '月'),
    ...getBranchRelationTags(line.zhi, context.dayZhi, '日'),
    getElementRelation(line.element, ZHI_ELEMENTS[context.monthZhi], '月'),
    getElementRelation(line.element, ZHI_ELEMENTS[context.dayZhi], '日'),
    ...getTombJueTags(line.element, context.monthZhi, '月'),
    ...getTombJueTags(line.element, context.dayZhi, '日'),
    context.dayXunKong.includes(line.zhi) ? '旬空' : '',
    !line.moving && isChong(line.zhi, context.dayZhi) && !context.dayXunKong.includes(line.zhi) ? '暗动' : '',
    ...buildMovingTags(line, changedLine)
  ]

  return unique(tags)
}

const getZhiGroup = zhi => Object.keys(GROUP_STARS).find(group => group.includes(zhi))

const getDayAuxiliaryStars = (dayGan, dayZhi) => {
  const group = getZhiGroup(dayZhi)
  const stars = []
  if (group) {
    stars.push(`驿马-${GROUP_STARS[group].驿马}`)
    stars.push(`桃花-${GROUP_STARS[group].桃花}`)
  }
  if (DAY_LU_BY_GAN[dayGan]) stars.push(`日禄-${DAY_LU_BY_GAN[dayGan]}`)
  return stars
}

const buildPurePalaceLines = hexagram => {
  const palaceTrigram = TRIGRAM_BY_NAME[hexagram.palace]
  const pureHexagram = HEXAGRAM_BY_TRIGRAMS[`${palaceTrigram.name}|${palaceTrigram.name}`]

  return Array.from({ length: 6 }, (_, index) => {
    const stemBranch = getLineStemBranch(pureHexagram, index + 1)
    const sixRelative = getSixRelative(hexagram.palaceElement, stemBranch.element)
    return {
      position: index + 1,
      ...stemBranch,
      sixRelative,
      shortRelative: LIU_QIN_SHORT[sixRelative] || sixRelative
    }
  })
}

const attachHiddenSpirits = (lines, hexagram) => {
  const visibleRelatives = new Set(lines.map(line => line.sixRelative))
  const missingRelatives = ['父母', '兄弟', '官鬼', '妻财', '子孙'].filter(item => !visibleRelatives.has(item))
  if (missingRelatives.length === 0) return lines

  const pureLines = buildPurePalaceLines(hexagram)
  const hiddenByPosition = new Map()

  for (const relative of missingRelatives) {
    const pureLine = pureLines.find(item => item.sixRelative === relative)
    if (!pureLine || hiddenByPosition.has(pureLine.position)) continue
    hiddenByPosition.set(pureLine.position, pureLine)
  }

  return lines.map(line => {
    const hidden = hiddenByPosition.get(line.position)
    if (!hidden) return line
    return {
      ...line,
      hiddenSpirit: hidden,
      flyingSpirit: {
        sixRelative: line.sixRelative,
        shortRelative: line.shortRelative,
        gan: line.gan,
        zhi: line.zhi,
        element: line.element,
        text: `${line.shortRelative}${line.zhi}${line.element}${line.gan}`
      }
    }
  })
}

const buildLines = ({ changedHexagram, context, hexagram, lineStates, sixGods }) => {
  const baseLines = lineStates.map((state, index) => {
    const config = LINE_STATE_CONFIG[state]
    const position = index + 1
    const stemBranch = getLineStemBranch(hexagram, position)
    const changedStemBranch = getLineStemBranch(changedHexagram, position)
    const sixRelative = getSixRelative(hexagram.palaceElement, stemBranch.element)
    const changedSixRelative = getSixRelative(hexagram.palaceElement, changedStemBranch.element)
    const role = position === hexagram.world ? '世' : position === hexagram.response ? '应' : ''

    return {
      position,
      label: ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'][index],
      state,
      bit: config.bit,
      lineType: config.lineType,
      moving: config.moving,
      movingMarker: config.marker,
      role,
      sixGod: sixGods[index],
      ...stemBranch,
      sixRelative,
      shortRelative: LIU_QIN_SHORT[sixRelative] || sixRelative,
      changed: {
        ...changedStemBranch,
        bit: config.moving ? config.changesTo : config.bit,
        sixRelative: changedSixRelative,
        shortRelative: LIU_QIN_SHORT[changedSixRelative] || changedSixRelative,
        lineType: config.moving ? (config.changesTo ? '阳爻' : '阴爻') : config.lineType
      }
    }
  })
  const withHidden = attachHiddenSpirits(baseLines, hexagram)

  return withHidden.map(line => ({
    ...line,
    relations: buildLineRelations(line, context, line.changed)
  }))
}

export function calculateLiuYaoChart(input = {}) {
  const normalized = normalizeLiuYaoInput(input)
  const solar = Solar.fromYmdHms(normalized.year, normalized.month, normalized.day, normalized.hour, normalized.minute, 0)
  const lunar = solar.getLunar()
  const eightChar = lunar.getEightChar()
  const methodResult = buildMethodLineStates(normalized, lunar, eightChar)
  const lineStates = methodResult.lineStates
  const effectiveInput = { ...normalized, lines: lineStates }
  const baseBits = lineStates.map(state => LINE_STATE_CONFIG[state].bit)
  const changedBits = lineStates.map(state => {
    const config = LINE_STATE_CONFIG[state]
    return config.moving ? config.changesTo : config.bit
  })
  const hexagram = getHexagramByBits(baseBits)
  const changedHexagram = getHexagramByBits(changedBits)
  const dayGan = eightChar.getDayGan()
  const dayZhi = eightChar.getDayZhi()
  const context = {
    monthZhi: eightChar.getMonthZhi(),
    dayZhi,
    dayXunKong: eightChar.getDayXunKong()
  }
  const lines = buildLines({
    changedHexagram,
    context,
    hexagram,
    lineStates,
    sixGods: getSixGods(dayGan)
  })
  const prevJieQi = lunar.getPrevJieQi()
  const nextJieQi = lunar.getNextJieQi()

  return {
    input: effectiveInput,
    methodDetail: methodResult.detail,
    solarText: solar.toYmdHms(),
    dateText: `${normalized.year}-${pad(normalized.month)}-${pad(normalized.day)} ${pad(normalized.hour)}:${pad(normalized.minute)}`,
    lunarText: lunar.toString(),
    lunarFullText: lunar.toFullString(),
    yearGanZhi: eightChar.getYear(),
    monthGanZhi: eightChar.getMonth(),
    dayGanZhi: eightChar.getDay(),
    timeGanZhi: eightChar.getTime(),
    monthZhi: context.monthZhi,
    dayZhi,
    dayGan,
    xunKong: {
      year: eightChar.getYearXunKong(),
      month: eightChar.getMonthXunKong(),
      day: eightChar.getDayXunKong(),
      time: eightChar.getTimeXunKong()
    },
    jieQiText: `${prevJieQi.getName()} ${prevJieQi.getSolar().toYmdHms()} ~ ${nextJieQi.getName()} ${nextJieQi.getSolar().toYmdHms()}`,
    auxiliaryStars: getDayAuxiliaryStars(dayGan, dayZhi),
    hexagram,
    changedHexagram,
    movingLines: lines.filter(line => line.moving).map(line => line.position),
    lines,
    notes: [
      '六爻工具只输出排盘字段，不输出吉凶断语。',
      '六亲按本卦卦宫五行定亲，变爻六亲仍按本卦卦宫五行标注。',
      '伏神按本宫首卦补缺失六亲，飞神为同位可见本爻。',
      '合冲刑害、生克、墓绝、旬空、暗动、进退神为机械规则标记，实际断卦仍需结合用神和流派。'
    ]
  }
}

const formatLineText = line => {
  const base = `${line.sixGod} ${line.shortRelative}${line.zhi}${line.element}${line.gan}`
  const role = line.role ? ` ${line.role}` : ''
  const moving = line.moving ? ` ${line.movingMarker} ${line.changed.shortRelative}${line.changed.zhi}${line.changed.element}${line.changed.gan}` : ''
  const hidden = line.hiddenSpirit ? ` 伏神:${line.hiddenSpirit.shortRelative}${line.hiddenSpirit.zhi}${line.hiddenSpirit.element}${line.hiddenSpirit.gan}` : ''
  const relations = line.relations.length ? ` [${line.relations.join(' / ')}]` : ''
  return `${base}${role}${moving}${hidden}${relations}`
}

const formatMethodDetail = detail => detail?.summary || '-'

export function buildLiuYaoCopyText(chart) {
  const lines = [
    '六爻排盘',
    `事项：${chart.input.question}`,
    `时间：${chart.dateText}（${chart.lunarText}）`,
    `起卦方式：${chart.input.methodLabel}`,
    `起卦推导：${formatMethodDetail(chart.methodDetail)}`,
    `节气：${chart.jieQiText}`,
    `干支：${chart.yearGanZhi}年 ${chart.monthGanZhi}月 ${chart.dayGanZhi}日 ${chart.timeGanZhi}时`,
    `旬空：年${chart.xunKong.year} 月${chart.xunKong.month} 日${chart.xunKong.day} 时${chart.xunKong.time}`,
    `月建/日辰：${chart.monthZhi}月 / ${chart.dayZhi}日`,
    `辅助神煞：${chart.auxiliaryStars.join('，') || '-'}`,
    `本卦：${chart.hexagram.name}（${chart.hexagram.kind}，${chart.hexagram.palace}宫${chart.hexagram.palaceElement}）`,
    `变卦：${chart.changedHexagram.name}`,
    `世应：世爻${chart.hexagram.world}，应爻${chart.hexagram.response}`,
    `动爻：${chart.movingLines.length ? chart.movingLines.map(item => `${item}爻`).join('、') : '无'}`,
    '',
    '六爻（自上而下）：',
    ...[...chart.lines].reverse().map(formatLineText),
    '',
    '说明：只输出排盘字段，不输出吉凶断语；后续分析需另行指定用神、场景和流派口径。'
  ]

  return lines.join('\n')
}

export function buildLiuYaoExportPayload(chart) {
  return {
    imageKind: 'generic',
    title: '六爻专业排盘',
    subtitle: `${chart.dateText} · ${chart.input.question}`,
    filename: `liuyao-chart-${chart.dateText.replace(/\D/g, '').slice(0, 12)}.png`,
    textFilename: `liuyao-chart-${chart.dateText.replace(/\D/g, '').slice(0, 12)}.txt`,
    badges: [
      `本卦 ${chart.hexagram.name}`,
      `变卦 ${chart.changedHexagram.name}`,
      `${chart.hexagram.palace}宫${chart.hexagram.palaceElement}`,
      `世${chart.hexagram.world} 应${chart.hexagram.response}`
    ],
    sections: [
      {
        title: '基础信息',
        rows: [
          { label: '事项', value: chart.input.question },
          { label: '起卦时间', value: `${chart.dateText}（${chart.lunarText}）` },
          { label: '起卦方式', value: chart.input.methodLabel },
          { label: '起卦推导', value: formatMethodDetail(chart.methodDetail) },
          { label: '节气', value: chart.jieQiText },
          { label: '干支', value: `${chart.yearGanZhi}年 ${chart.monthGanZhi}月 ${chart.dayGanZhi}日 ${chart.timeGanZhi}时` },
          { label: '旬空', value: `年${chart.xunKong.year} / 月${chart.xunKong.month} / 日${chart.xunKong.day} / 时${chart.xunKong.time}` },
          { label: '神煞', value: chart.auxiliaryStars.join('，') || '-' }
        ]
      },
      {
        title: '卦象',
        rows: [
          { label: '本卦', value: `${chart.hexagram.name}（${chart.hexagram.kind}，${chart.hexagram.palace}宫${chart.hexagram.palaceElement}）` },
          { label: '变卦', value: chart.changedHexagram.name },
          { label: '世应', value: `世爻${chart.hexagram.world} / 应爻${chart.hexagram.response}` },
          { label: '动爻', value: chart.movingLines.length ? chart.movingLines.map(item => `${item}爻`).join('、') : '无' }
        ]
      },
      {
        title: '六爻排盘',
        rows: [...chart.lines].reverse().map(line => ({
          label: line.label,
          value: formatLineText(line)
        }))
      }
    ],
    footer: '排盘口径：纳甲、六亲、世应、六神、伏神飞神和关系标记均为字段输出，不输出吉凶断语。'
  }
}
