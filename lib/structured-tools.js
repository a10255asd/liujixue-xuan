import { Solar } from 'lunar-javascript'
import { buildTianJiangMap, computeFullPan, DIZHI_ORDER, GAN_JI_GONG } from 'daliuren-lib/dist/src/index.js'
import { chartToObject, generateChartByDatetime } from 'qimen-dunjia'

const gan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
const zhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
const elements = {
  甲: '木',
  乙: '木',
  丙: '火',
  丁: '火',
  戊: '土',
  己: '土',
  庚: '金',
  辛: '金',
  壬: '水',
  癸: '水',
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

const trigramOrder = ['乾', '兑', '离', '震', '巽', '坎', '艮', '坤']
const trigrams = {
  乾: { name: '乾', image: '天', element: '金', lines: [1, 1, 1] },
  兑: { name: '兑', image: '泽', element: '金', lines: [1, 1, 0] },
  离: { name: '离', image: '火', element: '火', lines: [1, 0, 1] },
  震: { name: '震', image: '雷', element: '木', lines: [1, 0, 0] },
  巽: { name: '巽', image: '风', element: '木', lines: [0, 1, 1] },
  坎: { name: '坎', image: '水', element: '水', lines: [0, 1, 0] },
  艮: { name: '艮', image: '山', element: '土', lines: [0, 0, 1] },
  坤: { name: '坤', image: '地', element: '土', lines: [0, 0, 0] }
}

const hexagramNames = {
  乾: { 乾: '乾为天', 兑: '天泽履', 离: '天火同人', 震: '天雷无妄', 巽: '天风姤', 坎: '天水讼', 艮: '天山遁', 坤: '天地否' },
  兑: { 乾: '泽天夬', 兑: '兑为泽', 离: '泽火革', 震: '泽雷随', 巽: '泽风大过', 坎: '泽水困', 艮: '泽山咸', 坤: '泽地萃' },
  离: { 乾: '火天大有', 兑: '火泽睽', 离: '离为火', 震: '火雷噬嗑', 巽: '火风鼎', 坎: '火水未济', 艮: '火山旅', 坤: '火地晋' },
  震: { 乾: '雷天大壮', 兑: '雷泽归妹', 离: '雷火丰', 震: '震为雷', 巽: '雷风恒', 坎: '雷水解', 艮: '雷山小过', 坤: '雷地豫' },
  巽: { 乾: '风天小畜', 兑: '风泽中孚', 离: '风火家人', 震: '风雷益', 巽: '巽为风', 坎: '风水涣', 艮: '风山渐', 坤: '风地观' },
  坎: { 乾: '水天需', 兑: '水泽节', 离: '水火既济', 震: '水雷屯', 巽: '水风井', 坎: '坎为水', 艮: '水山蹇', 坤: '水地比' },
  艮: { 乾: '山天大畜', 兑: '山泽损', 离: '山火贲', 震: '山雷颐', 巽: '山风蛊', 坎: '山水蒙', 艮: '艮为山', 坤: '山地剥' },
  坤: { 乾: '地天泰', 兑: '地泽临', 离: '地火明夷', 震: '地雷复', 巽: '地风升', 坎: '地水师', 艮: '地山谦', 坤: '坤为地' }
}

const zhiNumber = Object.fromEntries(zhi.map((item, index) => [item, index + 1]))
const lineNames = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻']
const palaces = ['坎', '坤', '震', '巽', '中', '乾', '兑', '艮', '离']

const toInt = (value, fallback = 0) => {
  const number = Number.parseInt(value, 10)
  return Number.isFinite(number) ? number : fallback
}

const pad = value => String(value).padStart(2, '0')
const mod = (number, divisor) => ((number % divisor) + divisor) % divisor
const oneBasedMod = (number, divisor) => {
  const value = Math.abs(Math.trunc(number)) % divisor
  return value === 0 ? divisor : value
}

const splitDate = value => {
  const [year, month, day] = String(value || '').split('-').map(part => toInt(part, 1))
  return { year: year || 2026, month: month || 1, day: day || 1 }
}

const splitTime = value => {
  const [hour, minute] = String(value || '').split(':').map(part => toInt(part, 0))
  return { hour: hour || 0, minute: minute || 0 }
}

const createSolar = (date, time = '00:00') => {
  const { year, month, day } = splitDate(date)
  const { hour, minute } = splitTime(time)
  return Solar.fromYmdHms(year, month, day, hour, minute, 0)
}

const callValue = (source, methodName, fallback = '-') => {
  if (typeof source?.[methodName] !== 'function') return fallback
  const value = source[methodName]()
  if (Array.isArray(value)) return value.length ? value.join('、') : fallback
  return value || fallback
}

const getEightChar = lunar => {
  const eightChar = lunar.getEightChar()
  return {
    year: `${eightChar.getYearGan()}${eightChar.getYearZhi()}`,
    month: `${eightChar.getMonthGan()}${eightChar.getMonthZhi()}`,
    day: `${eightChar.getDayGan()}${eightChar.getDayZhi()}`,
    time: `${eightChar.getTimeGan()}${eightChar.getTimeZhi()}`,
    yearGan: eightChar.getYearGan(),
    yearZhi: eightChar.getYearZhi(),
    monthGan: eightChar.getMonthGan(),
    monthZhi: eightChar.getMonthZhi(),
    dayGan: eightChar.getDayGan(),
    dayZhi: eightChar.getDayZhi(),
    timeGan: eightChar.getTimeGan(),
    timeZhi: eightChar.getTimeZhi()
  }
}

const getCalendarFields = (date, time = '00:00') => {
  const solar = createSolar(date, time)
  const lunar = solar.getLunar()
  const eightChar = getEightChar(lunar)
  const prevJieQi = lunar.getPrevJieQi?.()
  const nextJieQi = lunar.getNextJieQi?.()

  return {
    solar,
    lunar,
    eightChar,
    solarText: solar.toYmdHms(),
    lunarText: lunar.toString(),
    yi: callValue(lunar, 'getDayYi'),
    ji: callValue(lunar, 'getDayJi'),
    chong: callValue(lunar, 'getChongDesc'),
    sha: callValue(lunar, 'getSha'),
    xun: callValue(lunar, 'getDayXun'),
    xunKong: callValue(lunar, 'getDayXunKong'),
    animal: callValue(lunar, 'getAnimal'),
    pengZu: `${callValue(lunar, 'getPengZuGan')}；${callValue(lunar, 'getPengZuZhi')}`,
    positions: `喜神${callValue(lunar, 'getDayPositionXiDesc')} / 福神${callValue(lunar, 'getDayPositionFuDesc')} / 财神${callValue(lunar, 'getDayPositionCaiDesc')}`,
    jieQi: {
      previous: prevJieQi ? `${prevJieQi.getName()} ${prevJieQi.getSolar().toYmdHms()}` : '-',
      next: nextJieQi ? `${nextJieQi.getName()} ${nextJieQi.getSolar().toYmdHms()}` : '-'
    }
  }
}

const getTrigramByNumber = number => trigrams[trigramOrder[oneBasedMod(number, 8) - 1]]
const findTrigramByLines = lines => trigrams[trigramOrder.find(name => trigrams[name].lines.every((line, index) => line === lines[index]))]
const getHexagramName = (upper, lower) => hexagramNames[upper.name][lower.name]

const buildHexagram = (upper, lower, movingLine) => {
  const lowerLines = [...lower.lines]
  const upperLines = [...upper.lines]
  if (movingLine <= 3) {
    lowerLines[movingLine - 1] = lowerLines[movingLine - 1] ? 0 : 1
  } else {
    upperLines[movingLine - 4] = upperLines[movingLine - 4] ? 0 : 1
  }

  const changedUpper = findTrigramByLines(upperLines)
  const changedLower = findTrigramByLines(lowerLines)
  const allLines = [...lower.lines, ...upper.lines]
  const mutualLower = findTrigramByLines(allLines.slice(1, 4))
  const mutualUpper = findTrigramByLines(allLines.slice(2, 5))
  const body = movingLine <= 3 ? upper : lower
  const use = movingLine <= 3 ? lower : upper

  return {
    name: getHexagramName(upper, lower),
    changedName: getHexagramName(changedUpper, changedLower),
    mutualName: getHexagramName(mutualUpper, mutualLower),
    upper,
    lower,
    changedUpper,
    changedLower,
    mutualUpper,
    mutualLower,
    movingLine,
    body,
    use,
    lines: allLines
  }
}

const buildRows = rows => rows.map(([label, value]) => ({ label, value: String(value ?? '-') }))
const result = ({ title, subtitle, badges = [], copyText, sections, summary }) => ({ title, subtitle, badges, copyText, sections, summary })

const formatResultText = output => [
  output.title,
  output.subtitle,
  output.badges?.length ? `标签：${output.badges.join(' / ')}` : '',
  ...output.sections.flatMap(section => [
    '',
    `【${section.title}】`,
    ...section.rows.map(row => `${row.label}：${row.value}`)
  ])
].filter(Boolean).join('\n')

const getStrokeElement = number => {
  const tail = mod(number, 10)
  if (tail === 1 || tail === 2) return '木'
  if (tail === 3 || tail === 4) return '火'
  if (tail === 5 || tail === 6) return '土'
  if (tail === 7 || tail === 8) return '金'
  return '水'
}

const parseStrokeList = value => String(value || '').split(/[,，\s]+/).map(item => toInt(item, 0)).filter(Boolean)

const calculateMeihua = input => {
  const fields = getCalendarFields(input.date, input.time)
  const method = input.method || 'numbers'
  let upperSeed
  let lowerSeed
  let movingSeed

  if (method === 'time') {
    upperSeed = (zhiNumber[fields.eightChar.yearZhi] || 1) + Math.abs(fields.lunar.getMonth()) + fields.lunar.getDay()
    lowerSeed = upperSeed + (zhiNumber[fields.eightChar.timeZhi] || 1)
    movingSeed = lowerSeed
  } else {
    upperSeed = toInt(input.upperNumber, 1)
    lowerSeed = toInt(input.lowerNumber, 8)
    movingSeed = toInt(input.movingNumber, 6)
  }

  const upper = getTrigramByNumber(upperSeed)
  const lower = getTrigramByNumber(lowerSeed)
  const chart = buildHexagram(upper, lower, oneBasedMod(movingSeed, 6))

  return result({
    title: '梅花易数排盘',
    subtitle: `${input.topic || '未填写事项'} · ${fields.solarText}`,
    badges: [`本卦 ${chart.name}`, `变卦 ${chart.changedName}`, `${lineNames[chart.movingLine - 1]}动`],
    summary: `${chart.name} → ${chart.changedName}`,
    sections: [
      {
        title: '起卦信息',
        rows: buildRows([
          ['事项', input.topic || '未填写事项'],
          ['起卦方式', method === 'time' ? '时间起卦' : '三数起卦'],
          ['公历', fields.solarText],
          ['农历', fields.lunarText],
          ['四柱', `${fields.eightChar.year} ${fields.eightChar.month} ${fields.eightChar.day} ${fields.eightChar.time}`]
        ])
      },
      {
        title: '卦盘字段',
        rows: buildRows([
          ['本卦', `${chart.name}（${chart.upper.name}上${chart.lower.name}下）`],
          ['变卦', `${chart.changedName}（${chart.changedUpper.name}上${chart.changedLower.name}下）`],
          ['互卦', `${chart.mutualName}（${chart.mutualUpper.name}上${chart.mutualLower.name}下）`],
          ['动爻', lineNames[chart.movingLine - 1]],
          ['体卦', `${chart.body.name} / ${chart.body.image} / 五行${chart.body.element}`],
          ['用卦', `${chart.use.name} / ${chart.use.image} / 五行${chart.use.element}`]
        ])
      },
      {
        title: '取数推导',
        rows: buildRows([
          ['上卦数', `${upperSeed} → ${upper.name}`],
          ['下卦数', `${lowerSeed} → ${lower.name}`],
          ['动爻数', `${movingSeed} → ${lineNames[chart.movingLine - 1]}`]
        ])
      }
    ]
  })
}

const calculateName = input => {
  const fullName = String(input.fullName || '刘鸡血').trim()
  const surnameLength = Math.max(1, Math.min(toInt(input.surnameLength, 1), Math.max(fullName.length - 1, 1)))
  const chars = Array.from(fullName)
  const surname = chars.slice(0, surnameLength).join('')
  const givenName = chars.slice(surnameLength).join('') || chars.slice(-1).join('')
  const strokes = parseStrokeList(input.strokes)
  const padded = chars.map((_, index) => strokes[index] || 1)
  const surnameStrokes = padded.slice(0, surnameLength)
  const givenStrokes = padded.slice(surnameLength)
  const total = padded.reduce((sum, item) => sum + item, 0)
  const tian = surnameStrokes.length === 1 ? surnameStrokes[0] + 1 : surnameStrokes.reduce((sum, item) => sum + item, 0)
  const ren = surnameStrokes[surnameStrokes.length - 1] + (givenStrokes[0] || 1)
  const di = givenStrokes.length <= 1 ? (givenStrokes[0] || 1) + 1 : givenStrokes.reduce((sum, item) => sum + item, 0)
  const wai = total - ren + (surnameStrokes.length === 1 ? 1 : surnameStrokes[0])
  const grids = [
    ['天格', tian],
    ['人格', ren],
    ['地格', di],
    ['外格', wai],
    ['总格', total]
  ]

  return result({
    title: '姓名五格五行',
    subtitle: `${fullName} · 笔画 ${padded.join('-')}`,
    badges: grids.map(([name, number]) => `${name}${number}${getStrokeElement(number)}`),
    summary: `${fullName} / ${grids.map(([name, number]) => `${name}${number}`).join(' ')}`,
    sections: [
      {
        title: '姓名字段',
        rows: buildRows([
          ['姓名', fullName],
          ['姓氏', `${surname}（${surnameStrokes.join('+')}画）`],
          ['名字', `${givenName}（${givenStrokes.join('+') || '-'}画）`],
          ['笔画序列', padded.join(' / ')]
        ])
      },
      {
        title: '五格字段',
        rows: buildRows(grids.map(([name, number]) => [name, `${number}画 / 五行${getStrokeElement(number)}`]))
      },
      {
        title: '三才字段',
        rows: buildRows([
          ['三才', `${getStrokeElement(tian)} / ${getStrokeElement(ren)} / ${getStrokeElement(di)}`],
          ['五格五行', grids.map(([name, number]) => `${name}${getStrokeElement(number)}`).join('，')],
          ['口径', '笔画由用户输入，工具只做五格和五行字段换算']
        ])
      }
    ]
  })
}

const tarotMajorCards = [
  ['愚者', '开始 / 自由 / 冒险'],
  ['魔术师', '行动 / 技能 / 资源'],
  ['女祭司', '直觉 / 隐含信息 / 静观'],
  ['女皇', '滋养 / 创造 / 成长'],
  ['皇帝', '秩序 / 边界 / 责任'],
  ['教皇', '传统 / 学习 / 规则'],
  ['恋人', '选择 / 关系 / 价值观'],
  ['战车', '推进 / 意志 / 控制'],
  ['力量', '耐心 / 勇气 / 柔韧'],
  ['隐士', '内省 / 独处 / 寻找'],
  ['命运之轮', '周期 / 转折 / 变化'],
  ['正义', '平衡 / 契约 / 判断'],
  ['倒吊人', '暂停 / 换位 / 等待'],
  ['死神', '结束 / 转化 / 清理'],
  ['节制', '调和 / 协作 / 适度'],
  ['恶魔', '束缚 / 欲望 / 依赖'],
  ['高塔', '突变 / 拆解 / 觉醒'],
  ['星星', '希望 / 修复 / 愿景'],
  ['月亮', '不安 / 潜意识 / 迷雾'],
  ['太阳', '清晰 / 活力 / 展开'],
  ['审判', '召唤 / 复盘 / 更新'],
  ['世界', '完成 / 整合 / 里程碑']
]

const tarotSuitKeywords = {
  权杖: '行动 / 热情 / 创造',
  圣杯: '情绪 / 关系 / 感受',
  宝剑: '思考 / 沟通 / 决策',
  星币: '现实 / 资源 / 稳定'
}

const tarotRanks = [
  ['王牌', '起点'],
  ['二', '选择'],
  ['三', '协作'],
  ['四', '结构'],
  ['五', '冲突'],
  ['六', '调整'],
  ['七', '评估'],
  ['八', '推进'],
  ['九', '积累'],
  ['十', '完成'],
  ['侍从', '学习'],
  ['骑士', '行动'],
  ['王后', '承载'],
  ['国王', '掌控']
]

const tarotDeck = [
  ...tarotMajorCards.map(([name, keywords], index) => ({
    name,
    arcana: '大阿尔卡那',
    code: String(index).padStart(2, '0'),
    keywords
  })),
  ...Object.entries(tarotSuitKeywords).flatMap(([suit, suitKeywords]) => tarotRanks.map(([rank, rankKeyword], index) => ({
    name: `${suit}${rank}`,
    arcana: '小阿尔卡那',
    code: `${suit.slice(0, 1)}${index + 1}`,
    keywords: `${suitKeywords} / ${rankKeyword}`
  })))
]

const tarotSpreadLabels = {
  single: '单张牌',
  three: '三张牌',
  relation: '关系对照',
  choice: '二选一'
}

const tarotSpreadPositions = {
  single: ['核心提示'],
  three: ['过去线索', '当前状态', '后续趋势'],
  relation: ['自己', '对方', '关系现状', '隐藏因素', '可关注点'],
  choice: ['选择 A 状态', '选择 A 后续', '选择 B 状态', '选择 B 后续', '关键差异']
}

const hashSeed = value => {
  let hash = 2166136261
  for (const char of String(value || '')) {
    hash ^= char.codePointAt(0)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

const seededRandom = seed => {
  let state = seed || 1
  return () => {
    state = Math.imul(state ^ (state >>> 15), 1 | state)
    state ^= state + Math.imul(state ^ (state >>> 7), 61 | state)
    return ((state ^ (state >>> 14)) >>> 0) / 4294967296
  }
}

const drawTarotCards = (seedText, count) => {
  const random = seededRandom(hashSeed(seedText))
  const deck = [...tarotDeck]

  for (let index = deck.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[deck[index], deck[swapIndex]] = [deck[swapIndex], deck[index]]
  }

  return deck.slice(0, count).map((card, index) => ({
    ...card,
    orientation: random() >= 0.5 ? '正位' : '逆位',
    order: index + 1
  }))
}

const calculateTarot = input => {
  const spread = input.spread || 'three'
  const spreadName = tarotSpreadLabels[spread] || tarotSpreadLabels.three
  const positions = tarotSpreadPositions[spread] || tarotSpreadPositions.three
  const question = String(input.question || '当前问题').trim() || '当前问题'
  const seed = String(input.seed || question).trim() || question
  const date = input.date || '2026-07-02'
  const time = input.time || '09:00'
  const drawnCards = drawTarotCards(`${question}|${spread}|${date}|${time}|${seed}`, positions.length)
  const cardRows = positions.map((position, index) => {
    const card = drawnCards[index]
    return [
      position,
      `${card.name}（${card.orientation} / ${card.arcana} / ${card.keywords}）`
    ]
  })

  return result({
    title: '塔罗抽牌',
    subtitle: `${question} · ${spreadName}`,
    badges: [`${spreadName}`, `${positions.length}张牌`, '78张牌库'],
    summary: `${spreadName} / ${drawnCards.map(card => `${card.name}${card.orientation}`).join('、')}`,
    sections: [
      {
        title: '抽牌信息',
        rows: buildRows([
          ['问题', question],
          ['牌阵', spreadName],
          ['时间', `${date} ${time}`],
          ['种子', seed]
        ])
      },
      {
        title: '牌阵结果',
        rows: buildRows(cardRows)
      },
      {
        title: '牌库口径',
        rows: buildRows([
          ['牌库', '莱德韦特通用 78 张：22 张大阿尔卡那 + 56 张小阿尔卡那'],
          ['正逆位', '按确定性洗牌结果输出正位或逆位字段'],
          ['输出范围', '只输出抽牌字段、位置和关键词，不输出吉凶、应期或确定性判断']
        ])
      }
    ]
  })
}

const calculateDailyFortune = input => {
  const fields = getCalendarFields(input.date, input.time)
  const zodiac = input.zodiac || '未选择'
  const dayElement = elements[fields.eightChar.dayGan]

  return result({
    title: '每日运势速览',
    subtitle: `${fields.solarText} · ${fields.lunarText}`,
    badges: [`日柱 ${fields.eightChar.day}`, `日元五行 ${dayElement}`, `冲 ${fields.chong}`],
    summary: `${fields.eightChar.day}日 · 宜 ${fields.yi}`,
    sections: [
      {
        title: '今日字段',
        rows: buildRows([
          ['公历', fields.solarText],
          ['农历', fields.lunarText],
          ['四柱', `${fields.eightChar.year} ${fields.eightChar.month} ${fields.eightChar.day} ${fields.eightChar.time}`],
          ['日元五行', dayElement],
          ['生肖', zodiac],
          ['冲煞', `${fields.chong} / ${fields.sha}`]
        ])
      },
      {
        title: '黄历字段',
        rows: buildRows([
          ['宜', fields.yi],
          ['忌', fields.ji],
          ['旬空', `${fields.xun} / ${fields.xunKong}`],
          ['方位', fields.positions],
          ['彭祖', fields.pengZu]
        ])
      }
    ]
  })
}

const traditionalChars = {
  陰: '阴',
  陽: '阳',
  門: '门',
  開: '开',
  驚: '惊',
  傷: '伤',
  騰: '腾',
  滕: '腾',
  沖: '冲',
  衝: '冲',
  輔: '辅',
  虛: '虚',
  後: '后',
  綠: '绿',
  貪: '贪',
  祿: '禄',
  貞: '贞',
  離: '离',
  兌: '兑',
  陳: '陈',
  東: '东',
  軍: '军',
  黃: '黄',
  宮: '宫'
}

const normalizeText = value => String(value ?? '-').replace(/[陰陽門開驚傷騰滕沖衝輔虛後綠貪祿貞離兌陳東軍黃宮]/g, char => traditionalChars[char] || char)

const qimenDatetime = (date, time) => {
  const { year, month, day } = splitDate(date)
  const { hour } = splitTime(time)
  return `${year}${pad(month)}${pad(day)}${pad(hour)}`
}

const qimenValue = (chart, key, fallback = '-') => normalizeText(chart[key] || fallback)

const qimenListValue = value => {
  if (Array.isArray(value)) return value.length ? value.map(item => normalizeText(item || '-')).join(' / ') : '-'
  return normalizeText(value || '-')
}

const buildQimenPalaceCells = chart => {
  const directions = chart['方位'] || palaces

  return directions.map((direction, index) => ({
    title: `${normalizeText(direction)}宫`,
    items: [
      { label: '天盘', value: qimenListValue(chart['天盤']?.[index]) },
      { label: '地盘', value: qimenListValue(chart['地盤']?.[index]) },
      { label: '八门', value: qimenListValue(chart['天門']?.[index]) },
      { label: '九星', value: qimenListValue(chart['九星']?.[index]) },
      { label: '八神', value: qimenListValue(chart['八神']?.[index]) },
      { label: '九宫', value: qimenListValue(chart['九宮']?.[index]) }
    ]
  }))
}

const calculateQimen = input => {
  const fields = getCalendarFields(input.date, input.time)
  const chart = chartToObject(generateChartByDatetime(qimenDatetime(input.date, input.time)))
  const dun = `${qimenValue(chart, '陰陽')}遁`
  const ju = qimenValue(chart, '局數')
  const palaceCells = buildQimenPalaceCells(chart)
  const palaceRows = palaceCells.map(cell => [
    cell.title,
    cell.items.map(item => `${item.label}${item.value}`).join(' / ')
  ])

  return result({
    title: '奇门遁甲拆补法排盘',
    subtitle: `${fields.solarText} · ${fields.eightChar.year} ${fields.eightChar.month} ${fields.eightChar.day} ${fields.eightChar.time}`,
    badges: [dun, `${ju}局`, `${qimenValue(chart, '節氣')} ${qimenValue(chart, '三元')}`, `值符 ${qimenValue(chart, '值符')}`, `值使 ${qimenValue(chart, '值使')}`],
    summary: `${dun}${ju}局 · ${qimenValue(chart, '值符')} ${qimenValue(chart, '值使')}`,
    sections: [
      {
        title: '起局字段',
        rows: buildRows([
          ['事项', input.topic || '未填写事项'],
          ['公历', fields.solarText],
          ['农历', fields.lunarText],
          ['四柱', `${qimenValue(chart, '年柱')} ${qimenValue(chart, '月柱')} ${qimenValue(chart, '日柱')} ${qimenValue(chart, '時柱')}`],
          ['起局时间', `${qimenDatetime(input.date, input.time)}（按小时起局）`],
          ['节气三元', `${qimenValue(chart, '節氣')} / ${qimenValue(chart, '三元')} / 节后${qimenValue(chart, '節後天數')}天`],
          ['遁局', `${dun}${ju}局`],
          ['旬首符首', `${qimenValue(chart, '旬首')} / ${qimenValue(chart, '符首')}`],
          ['旬空孤虚', `年 ${qimenListValue(chart['年孤虛'])}；月 ${qimenListValue(chart['月孤虛'])}；日 ${qimenListValue(chart['日孤虛'])}；时 ${qimenListValue(chart['時孤虛'])}`]
        ])
      },
      {
        title: '值符值使',
        rows: buildRows([
          ['时干', qimenValue(chart, '時干')],
          ['值符', `${qimenValue(chart, '值符')} 落${qimenValue(chart, '值符落宮')}宫`],
          ['值使', `${qimenValue(chart, '值使')} 落${qimenValue(chart, '值使落宮')}宫`],
          ['飞步', qimenValue(chart, '飛步')],
          ['天禽寄宫', qimenValue(chart, '天禽寄宮')]
        ])
      },
      {
        title: '九宫综合盘',
        layout: 'palace-grid',
        gridClass: 'qimen-grid',
        cells: palaceCells,
        rows: buildRows(palaceRows)
      },
      {
        title: '分层盘面',
        rows: buildRows([
          ['方位', qimenListValue(chart['方位'])],
          ['地盘', qimenListValue(chart['地盤'])],
          ['天盘', qimenListValue(chart['天盤'])],
          ['八门', qimenListValue(chart['天門'])],
          ['九星', qimenListValue(chart['九星'])],
          ['八神', qimenListValue(chart['八神'])]
        ])
      }
    ]
  })
}

const liurenJiangNames = {
  子: '神后',
  丑: '大吉',
  寅: '功曹',
  卯: '太冲',
  辰: '天罡',
  巳: '太乙',
  午: '胜光',
  未: '小吉',
  申: '传送',
  酉: '从魁',
  戌: '河魁',
  亥: '登明'
}

const liurenTianJiangNames = {
  贵: '贵人',
  蛇: '螣蛇',
  朱: '朱雀',
  合: '六合',
  勾: '勾陈',
  龙: '青龙',
  空: '天空',
  虎: '白虎',
  常: '太常',
  玄: '玄武',
  阴: '太阴',
  后: '天后'
}

const liurenQiToYueJiang = {
  雨水: '亥',
  春分: '戌',
  谷雨: '酉',
  小满: '申',
  夏至: '未',
  大暑: '午',
  处暑: '巳',
  秋分: '辰',
  霜降: '卯',
  小雪: '寅',
  冬至: '丑',
  大寒: '子'
}

const getMonthGeneral = lunar => {
  const prevQi = lunar.getPrevQi()
  const qiName = prevQi.getName()
  const zhiName = liurenQiToYueJiang[qiName] || '亥'
  return {
    qiName,
    qiTime: prevQi.getSolar().toYmdHms(),
    zhi: zhiName,
    name: liurenJiangNames[zhiName]
  }
}

const liurenHeavenGeneral = (jiangMap, symbol) => {
  const palace = DIZHI_ORDER.includes(symbol) ? symbol : GAN_JI_GONG[symbol]
  return liurenTianJiangNames[jiangMap[palace]] || jiangMap[palace] || '-'
}

const buildLiurenPlateCells = (plate, jiangMap) => DIZHI_ORDER.map(palace => ({
  title: `${palace}宫`,
  items: [
    { label: '天盘', value: `${plate.tianpan[palace]} ${liurenJiangNames[plate.tianpan[palace]]}` },
    { label: '地盘', value: palace },
    { label: '天将', value: liurenTianJiangNames[jiangMap[palace]] || jiangMap[palace] || '-' }
  ]
}))

const buildLiurenSiKeCells = (siKePairs, jiangMap) => siKePairs.map((pair, index) => ({
  title: `${['一', '二', '三', '四'][index]}课`,
  items: [
    { label: '上神', value: pair.up },
    { label: '下神', value: pair.down },
    { label: '上将', value: liurenHeavenGeneral(jiangMap, pair.up) },
    { label: '关系', value: `${pair.up}临${pair.down}` }
  ]
}))

const buildLiurenSanZhuanCells = (sanZhuan, jiangMap) => sanZhuan.map((symbol, index) => {
  const palace = DIZHI_ORDER.includes(symbol) ? symbol : GAN_JI_GONG[symbol]
  return {
    title: `${['初', '中', '末'][index]}传`,
    items: [
      { label: '传神', value: symbol },
      { label: '地支', value: palace },
      { label: '月将', value: liurenJiangNames[palace] || '-' },
      { label: '天将', value: liurenHeavenGeneral(jiangMap, symbol) }
    ]
  }
})

const calculateDaliuren = input => {
  const fields = getCalendarFields(input.date, input.time)
  const monthGeneral = getMonthGeneral(fields.lunar)
  const pan = computeFullPan({
    dayGanzhi: fields.eightChar.day,
    shiZhi: fields.eightChar.timeZhi,
    yueJiang: monthGeneral.zhi
  })
  const plate = {
    tianpan: Object.fromEntries(DIZHI_ORDER.map((palace, index) => {
      const start = DIZHI_ORDER.indexOf(fields.eightChar.timeZhi)
      const monthIndex = DIZHI_ORDER.indexOf(monthGeneral.zhi)
      return [palace, DIZHI_ORDER[mod(monthIndex + index - start, 12)]]
    }))
  }
  const jiangMap = buildTianJiangMap({ dayGan: fields.eightChar.dayGan, shiZhi: fields.eightChar.timeZhi })
  const plateCells = buildLiurenPlateCells(plate, jiangMap)
  const siKeCells = buildLiurenSiKeCells(pan.siKePairs, jiangMap)
  const sanZhuanCells = buildLiurenSanZhuanCells(pan.siKeSanZhuan.sanZhuan, jiangMap)
  const tianJiangRows = DIZHI_ORDER.map(palace => [palace, `${liurenTianJiangNames[jiangMap[palace]] || jiangMap[palace]} · 天盘${plate.tianpan[palace]}`])

  return result({
    title: '大六壬四课三传',
    subtitle: `${fields.solarText} · 日辰 ${fields.eightChar.day} · 占时 ${fields.eightChar.time}`,
    badges: [`月将 ${monthGeneral.zhi}${monthGeneral.name}`, `课型 ${pan.siKeSanZhuan.kind}`, `旬空 ${fields.xunKong}`],
    summary: `${fields.eightChar.day}日 ${fields.eightChar.time}时 · ${monthGeneral.zhi}${monthGeneral.name} · ${pan.siKeSanZhuan.kind}`,
    sections: [
      {
        title: '起课字段',
        rows: buildRows([
          ['事项', input.topic || '未填写事项'],
          ['公历', fields.solarText],
          ['农历', fields.lunarText],
          ['四柱', `${fields.eightChar.year} ${fields.eightChar.month} ${fields.eightChar.day} ${fields.eightChar.time}`],
          ['月将', `${monthGeneral.zhi}${monthGeneral.name}（上一中气：${monthGeneral.qiName} ${monthGeneral.qiTime}）`],
          ['占时', fields.eightChar.time],
          ['日辰', fields.eightChar.day],
          ['旬空', fields.xunKong]
        ])
      },
      {
        title: '天地盘十二宫',
        layout: 'palace-grid',
        gridClass: 'liuren-grid',
        cells: plateCells,
        rows: buildRows(plateCells.map(cell => [
          cell.title,
          cell.items.map(item => `${item.label}${item.value}`).join(' / ')
        ]))
      },
      {
        title: '四课',
        layout: 'palace-grid',
        gridClass: 'liuren-sike-grid',
        cells: siKeCells,
        rows: buildRows(siKeCells.map(cell => [
          cell.title,
          cell.items.map(item => `${item.label}${item.value}`).join(' / ')
        ]))
      },
      {
        title: '三传',
        layout: 'palace-grid',
        gridClass: 'liuren-sike-grid',
        cells: sanZhuanCells,
        rows: buildRows(sanZhuanCells.map(cell => [
          cell.title,
          cell.items.map(item => `${item.label}${item.value}`).join(' / ')
        ]))
      },
      {
        title: '课传说明',
        rows: buildRows([
          ['课型', pan.siKeSanZhuan.kind],
          ['三传字段', `初传${pan.siKeSanZhuan.sanZhuan[0]} / 中传${pan.siKeSanZhuan.sanZhuan[1]} / 末传${pan.siKeSanZhuan.sanZhuan[2]}`],
          ['取传说明', pan.siKeSanZhuan.note || '-'],
          ['干上', pan.ganShang],
          ['天将排布', tianJiangRows.map(([palace, value]) => `${palace}${value}`).join(' / ')]
        ])
      }
    ]
  })
}

const calculateBirthTime = input => {
  const { year, month, day } = splitDate(input.date)
  const { hour } = splitTime(input.time)
  const rows = [-2, -1, 0, 1, 2].map(offset => {
    const probe = new Date(year, month - 1, day, hour + offset * 2, 0, 0)
    const probeDate = `${probe.getFullYear()}-${pad(probe.getMonth() + 1)}-${pad(probe.getDate())}`
    const probeTime = `${pad(probe.getHours())}:00`
    const fields = getCalendarFields(probeDate, probeTime)
    return [`${probeDate} ${probeTime}`, `${fields.eightChar.year} ${fields.eightChar.month} ${fields.eightChar.day} ${fields.eightChar.time}`]
  })

  return result({
    title: '出生校时对照',
    subtitle: `${input.date} ${input.time} 附近时辰对照`,
    badges: ['前后五档', '四柱对照', '供人工核验'],
    summary: `${input.date} ${input.time} 校时对照`,
    sections: [
      {
        title: '输入信息',
        rows: buildRows([
          ['出生日期', input.date],
          ['参考时间', input.time],
          ['出生地', input.birthPlace || '未填写']
        ])
      },
      {
        title: '时辰候选',
        rows: buildRows(rows)
      }
    ]
  })
}

const calculateFindTime = input => {
  const rows = Array.from({ length: 12 }, (_, index) => {
    const hour = mod(23 + index * 2, 24)
    const fields = getCalendarFields(input.date, `${pad(hour)}:00`)
    return [`${zhi[index]}时 ${pad(hour)}:00`, `${fields.eightChar.year} ${fields.eightChar.month} ${fields.eightChar.day} ${fields.eightChar.time}`]
  })

  return result({
    title: '寻时定盘表',
    subtitle: `${input.date} 十二时辰四柱对照`,
    badges: ['十二时辰', '四柱速查', '定盘辅助'],
    summary: `${input.date} 十二时辰对照`,
    sections: [
      {
        title: '日期字段',
        rows: buildRows([
          ['日期', input.date],
          ['用途', input.topic || '出生时辰候选对照']
        ])
      },
      {
        title: '十二时辰',
        rows: buildRows(rows)
      }
    ]
  })
}

const addDays = (date, amount) => {
  const { year, month, day } = splitDate(date)
  const instance = new Date(year, month - 1, day)
  instance.setDate(instance.getDate() + amount)
  return `${instance.getFullYear()}-${pad(instance.getMonth() + 1)}-${pad(instance.getDate())}`
}

const calculateDateSelection = input => {
  const days = Math.max(1, Math.min(toInt(input.days, 7), 30))
  const rows = Array.from({ length: days }, (_, index) => {
    const date = addDays(input.startDate, index)
    const fields = getCalendarFields(date, input.time || '09:00')
    return [
      date,
      `${fields.eightChar.day}日 / 宜：${fields.yi} / 忌：${fields.ji} / 冲：${fields.chong}`
    ]
  })
  const startFields = getCalendarFields(input.startDate, input.time || '09:00')

  return result({
    title: '择日速览',
    subtitle: `${input.startDate} 起 ${days} 天 · ${input.topic || '未填写事项'}`,
    badges: [`${days}天`, `起始日 ${startFields.eightChar.day}`, `冲 ${startFields.chong}`],
    summary: `${input.startDate} 起 ${days} 天择日速览`,
    sections: [
      {
        title: '筛选信息',
        rows: buildRows([
          ['事项', input.topic || '未填写事项'],
          ['起始日期', input.startDate],
          ['查询天数', `${days}天`],
          ['参考时间', input.time || '09:00']
        ])
      },
      {
        title: '日期清单',
        rows: buildRows(rows)
      }
    ]
  })
}

const promptToolLabels = {
  bazi: '八字专业细盘',
  ziwei: '紫微斗数命盘',
  liuyao: '六爻纳甲排盘',
  meihua: '梅花易数排盘',
  qimen: '奇门遁甲拆补法排盘',
  daliuren: '大六壬四课三传',
  tarot: '塔罗抽牌',
  calendar: '黄历择日字段',
  other: '其他结构化排盘'
}

const promptModeLabels = {
  structure: '结构化分析',
  verify: '字段核验',
  questions: '补充提问清单',
  brief: '简版解读提纲'
}

const promptOutputLabels = {
  table: '表格 + 要点',
  markdown: 'Markdown 分段',
  checklist: '核验清单',
  json: 'JSON 字段'
}

const promptOptions = labels => Object.entries(labels).map(([value, label]) => ({ value, label }))

const cleanPromptInput = (value, fallback) => {
  const text = String(value || '').trim()
  return text || fallback
}

const buildAnalysisPrompt = input => {
  const toolName = promptToolLabels[input.chartType] || promptToolLabels.other
  const modeName = promptModeLabels[input.mode] || promptModeLabels.structure
  const outputName = promptOutputLabels[input.outputFormat] || promptOutputLabels.table
  const question = cleanPromptInput(input.question, '请根据排盘字段做结构化梳理。')
  const context = cleanPromptInput(input.context, '无额外背景。')
  const chartText = cleanPromptInput(input.chartText, '请在这里粘贴完整排盘字段。')

  return [
    `你将基于一份「${toolName}」排盘字段，完成「${modeName}」。`,
    '',
    '请严格遵守：',
    '1. 只基于我提供的排盘字段和背景信息整理，不要编造未提供的出生信息、起卦方式、地点、时间口径或流派规则。',
    '2. 不输出恐吓式、绝对化、宿命论表达，不给医疗、法律、投资和人生重大决策建议。',
    '3. 如果字段不足或口径可能导致差异，先列出不确定点，再说明需要补充哪些信息。',
    '4. 明确区分「排盘字段复述」「结构化观察」「推测性解释」，不要把推测说成确定结论。',
    '5. 以辅助理解和继续提问为目标，不做吉凶断语、应期承诺或结果保证。',
    '',
    `具体问题：${question}`,
    `背景补充：${context}`,
    '',
    '排盘字段：',
    chartText,
    '',
    `输出格式：${outputName}`,
    '输出要求：',
    '- 先整理关键字段，不遗漏四柱/宫位/卦象/动变/时间口径等核心信息。',
    '- 再列出可以继续追问或需要人工核对的点。',
    '- 最后给出一份适合继续交给其他 AI 或人工老师接手的摘要。'
  ].join('\n')
}

const calculateAiPrompt = input => {
  const toolName = promptToolLabels[input.chartType] || promptToolLabels.other
  const modeName = promptModeLabels[input.mode] || promptModeLabels.structure
  const outputName = promptOutputLabels[input.outputFormat] || promptOutputLabels.table
  const question = cleanPromptInput(input.question, '请根据排盘字段做结构化梳理。')
  const context = cleanPromptInput(input.context, '无额外背景。')
  const chartText = cleanPromptInput(input.chartText, '请在这里粘贴完整排盘字段。')
  const prompt = buildAnalysisPrompt({ ...input, question, context, chartText })

  return result({
    title: 'AI 解析提示词',
    subtitle: `${toolName} · ${modeName}`,
    badges: [toolName, modeName, outputName],
    copyText: prompt,
    summary: `${toolName} AI 接力提示词`,
    sections: [
      {
        title: '提示词参数',
        rows: buildRows([
          ['排盘类型', toolName],
          ['解析目标', modeName],
          ['输出格式', outputName],
          ['具体问题', question],
          ['背景补充', context]
        ])
      },
      {
        title: '边界要求',
        rows: buildRows([
          ['不做事项', '不输出恐吓式、绝对化、宿命论表达；不做医疗、法律、投资和人生重大决策建议。'],
          ['不足处理', '字段不足时先列不确定点和待补充信息，不编造口径和资料。'],
          ['输出边界', '区分排盘字段、结构化观察和推测性解释，不做吉凶断语或结果保证。']
        ])
      },
      {
        title: '可复制提示词',
        rows: buildRows([
          ['Prompt', prompt]
        ])
      }
    ]
  })
}

const sourceLabel = handoff => `${handoff.sourceTool || '记录'} / ${handoff.sourceTitle || '未命名记录'}`

const inferPromptChartType = value => {
  const text = String(value || '')
  if (text.includes('八字')) return 'bazi'
  if (text.includes('紫微')) return 'ziwei'
  if (text.includes('六爻')) return 'liuyao'
  if (text.includes('梅花')) return 'meihua'
  if (text.includes('奇门')) return 'qimen'
  if (text.includes('六壬')) return 'daliuren'
  if (text.includes('黄历') || text.includes('择日') || text.includes('运势')) return 'calendar'
  return 'other'
}

const applyAiPromptHandoff = (form, handoff) => ({
  ...form,
  chartType: inferPromptChartType(handoff.sourceTool),
  mode: form.mode || 'structure',
  question: '请根据这份保存记录做结构化梳理。',
  context: `来自记录中心：${sourceLabel(handoff)}`,
  chartText: handoff.text || form.chartText
})

const compatibilityChartLabels = {
  bazi: '八字合盘字段',
  ziwei: '紫微合盘字段',
  mixed: '混合排盘字段',
  other: '其他字段对照'
}

const compatibilityFocusLabels = {
  relation: '关系结构',
  cooperation: '合作协同',
  family: '亲友相处',
  verify: '字段核验'
}

const compactTextLines = value => String(value || '')
  .split(/\r?\n/)
  .map(line => line.trim())
  .filter(Boolean)

const previewText = (value, fallback = '未粘贴字段') => {
  const lines = compactTextLines(value)
  if (!lines.length) return fallback
  const preview = lines.slice(0, 8).join('\n')
  return lines.length > 8 ? `${preview}\n... 共 ${lines.length} 行` : preview
}

const buildCompatibilityPrompt = input => {
  const chartType = compatibilityChartLabels[input.chartType] || compatibilityChartLabels.other
  const focus = compatibilityFocusLabels[input.focus] || compatibilityFocusLabels.relation
  const personA = cleanPromptInput(input.personA, '对象 A')
  const personB = cleanPromptInput(input.personB, '对象 B')
  const relation = cleanPromptInput(input.relation, '未说明关系')
  const question = cleanPromptInput(input.question, '请对两份排盘字段做结构化对照。')
  const context = cleanPromptInput(input.context, '无额外背景。')
  const chartA = cleanPromptInput(input.chartA, '请在这里粘贴对象 A 的完整排盘字段。')
  const chartB = cleanPromptInput(input.chartB, '请在这里粘贴对象 B 的完整排盘字段。')

  return [
    `你将基于两份「${chartType}」做「${focus}」对照。`,
    '',
    '请严格遵守：',
    '1. 只做排盘字段并排、结构梳理和待核对点整理，不输出关系好坏、婚恋成败、克谁、应期或结果保证。',
    '2. 不输出恐吓式、绝对化、宿命论表达，不给医疗、法律、投资和人生重大决策建议。',
    '3. 不要编造未提供的出生信息、时间口径、地点、流派规则、宫位或四柱字段。',
    '4. 字段不足时先列出不确定点和需要补充的信息，再继续做保守对照。',
    '5. 明确区分「字段复述」「并排观察」「推测性解释」，不要把推测说成确定结论。',
    '',
    `对象 A：${personA}`,
    `对象 B：${personB}`,
    `关系说明：${relation}`,
    `关注方向：${focus}`,
    `具体问题：${question}`,
    `背景补充：${context}`,
    '',
    `${personA} 排盘字段：`,
    chartA,
    '',
    `${personB} 排盘字段：`,
    chartB,
    '',
    '输出要求：',
    '- 先列出两份资料的核心字段，说明字段是否完整。',
    '- 再按同类字段做并排对照，例如四柱/十神/五行/宫位/主星/大限等。',
    '- 只用“可核对点”“可能关注点”“需要补充”这类表述，不做关系结论。',
    '- 最后给出一份适合继续交给其他 AI 或人工老师接手的摘要。'
  ].join('\n')
}

const calculateCompatibility = input => {
  const chartType = compatibilityChartLabels[input.chartType] || compatibilityChartLabels.other
  const focus = compatibilityFocusLabels[input.focus] || compatibilityFocusLabels.relation
  const personA = cleanPromptInput(input.personA, '对象 A')
  const personB = cleanPromptInput(input.personB, '对象 B')
  const relation = cleanPromptInput(input.relation, '未说明关系')
  const question = cleanPromptInput(input.question, '请对两份排盘字段做结构化对照。')
  const context = cleanPromptInput(input.context, '无额外背景。')
  const chartALines = compactTextLines(input.chartA)
  const chartBLines = compactTextLines(input.chartB)
  const missing = [
    chartALines.length ? '' : `${personA} 排盘字段`,
    chartBLines.length ? '' : `${personB} 排盘字段`
  ].filter(Boolean)
  const prompt = buildCompatibilityPrompt({
    ...input,
    personA,
    personB,
    relation,
    question,
    context
  })

  return result({
    title: '合盘对照',
    subtitle: `${chartType} · ${personA} / ${personB}`,
    badges: [chartType, focus, relation],
    copyText: prompt,
    summary: `${personA} / ${personB} 合盘对照材料`,
    sections: [
      {
        title: '对照设置',
        rows: buildRows([
          ['排盘类型', chartType],
          ['关注方向', focus],
          ['对象 A', personA],
          ['对象 B', personB],
          ['关系说明', relation],
          ['具体问题', question],
          ['背景补充', context]
        ])
      },
      {
        title: '字段完整度',
        rows: buildRows([
          [`${personA} 字段`, chartALines.length ? `${chartALines.length} 行` : '未粘贴'],
          [`${personB} 字段`, chartBLines.length ? `${chartBLines.length} 行` : '未粘贴'],
          ['待补充', missing.length ? missing.join('、') : '两份字段都已粘贴，仍建议人工核对出生时间和排盘口径。']
        ])
      },
      {
        title: '字段并排摘要',
        rows: buildRows([
          [personA, previewText(input.chartA)],
          [personB, previewText(input.chartB)]
        ])
      },
      {
        title: 'AI 接力提示词',
        rows: buildRows([
          ['Prompt', prompt]
        ])
      }
    ]
  })
}

const synthesisFocusLabels = {
  overview: '综合结构',
  relation: '关系/合作',
  decision: '决策参考',
  timing: '时间节奏',
  verify: '字段核验'
}

const synthesisSlotLabels = {
  birthChart: '出生盘字段',
  questionChart: '问事盘字段',
  tarotText: '塔罗字段',
  calendarText: '日课/择日字段',
  notes: '补充材料'
}

const inferSynthesisSlot = value => {
  const text = String(value || '')
  if (/八字|紫微|出生|校时|寻时|姓名/.test(text)) return 'birthChart'
  if (/塔罗/.test(text)) return 'tarotText'
  if (/黄历|择日|运势|日课|节气|时辰/.test(text)) return 'calendarText'
  if (/六爻|梅花|每日一卦|奇门|六壬/.test(text)) return 'questionChart'
  return 'notes'
}

const buildSynthesisPrompt = input => {
  const focus = synthesisFocusLabels[input.focus] || synthesisFocusLabels.overview
  const topic = cleanPromptInput(input.topic, '未填写主题')
  const question = cleanPromptInput(input.question, '请综合这些材料做结构化梳理。')
  const context = cleanPromptInput(input.context, '无额外背景。')
  const birthChart = cleanPromptInput(input.birthChart, '未提供出生盘字段。')
  const questionChart = cleanPromptInput(input.questionChart, '未提供问事盘字段。')
  const tarotText = cleanPromptInput(input.tarotText, '未提供塔罗字段。')
  const calendarText = cleanPromptInput(input.calendarText, '未提供日课/择日字段。')
  const notes = cleanPromptInput(input.notes, '无补充材料。')

  return [
    `你将基于多份玄学工具字段，完成「${focus}」合参整理。`,
    '',
    '请严格遵守：',
    '1. 只基于我提供的字段和背景整理，不要编造出生时间、起卦方式、地点、牌阵、流派规则或未提供材料。',
    '2. 不输出恐吓式、绝对化、宿命论表达，不给医疗、法律、投资和人生重大决策建议。',
    '3. 字段之间如果口径不同或互相矛盾，先列出冲突和待核对点，不要强行合并成确定结论。',
    '4. 明确区分「字段复述」「交叉观察」「推测性解释」「待补充信息」。',
    '5. 以辅助理解和继续提问为目标，不做吉凶断语、应期承诺或结果保证。',
    '',
    `主题：${topic}`,
    `关注方向：${focus}`,
    `具体问题：${question}`,
    `背景补充：${context}`,
    '',
    '出生盘字段：',
    birthChart,
    '',
    '问事盘字段：',
    questionChart,
    '',
    '塔罗字段：',
    tarotText,
    '',
    '日课/择日字段：',
    calendarText,
    '',
    '补充材料：',
    notes,
    '',
    '输出要求：',
    '- 先列材料清单和完整度，指出缺失字段。',
    '- 再按工具来源分别复述关键字段，避免混淆不同体系。',
    '- 然后列出可以交叉观察的主题，不把观察写成确定结论。',
    '- 最后输出一份适合继续交给其他 AI 或人工老师接手的摘要。'
  ].join('\n')
}

const calculateSynthesis = input => {
  const focus = synthesisFocusLabels[input.focus] || synthesisFocusLabels.overview
  const topic = cleanPromptInput(input.topic, '未填写主题')
  const question = cleanPromptInput(input.question, '请综合这些材料做结构化梳理。')
  const context = cleanPromptInput(input.context, '无额外背景。')
  const lineCounts = Object.entries(synthesisSlotLabels).map(([key, label]) => [
    label,
    compactTextLines(input[key]).length
  ])
  const presentCount = lineCounts.filter(([, count]) => count > 0).length
  const prompt = buildSynthesisPrompt({
    ...input,
    topic,
    question,
    context
  })

  return result({
    title: '综合合参工作台',
    subtitle: `${topic} · ${focus}`,
    badges: [focus, `${presentCount}/5 类材料`, 'AI 接力'],
    copyText: prompt,
    summary: `${topic} 综合合参材料`,
    sections: [
      {
        title: '合参设置',
        rows: buildRows([
          ['主题', topic],
          ['关注方向', focus],
          ['具体问题', question],
          ['背景补充', context]
        ])
      },
      {
        title: '材料完整度',
        rows: buildRows([
          ...lineCounts.map(([label, count]) => [label, count ? `${count} 行` : '未填写']),
          ['待补充', lineCounts.filter(([, count]) => count === 0).map(([label]) => label).join('、') || '五类材料均已填写，仍建议人工核对口径。']
        ])
      },
      {
        title: '材料摘要',
        rows: buildRows(Object.entries(synthesisSlotLabels).map(([key, label]) => [
          label,
          previewText(input[key], '未填写')
        ]))
      },
      {
        title: 'AI 接力提示词',
        rows: buildRows([
          ['Prompt', prompt]
        ])
      }
    ]
  })
}

const inferCompatibilityChartType = value => {
  const text = String(value || '')
  if (text.includes('八字')) return 'bazi'
  if (text.includes('紫微')) return 'ziwei'
  return 'mixed'
}

const applyCompatibilityHandoff = (form, handoff) => {
  const slot = handoff.slot === 'chartB' ? 'chartB' : 'chartA'
  const personKey = slot === 'chartB' ? 'personB' : 'personA'
  const sourceName = handoff.sourceTitle || handoff.sourceTool || form[personKey]

  return {
    ...form,
    chartType: inferCompatibilityChartType(handoff.sourceTool),
    [personKey]: sourceName,
    [slot]: handoff.text || form[slot],
    context: `来自记录中心：${sourceLabel(handoff)}`
  }
}

const applyCompatibilityRecordSlot = (form, record, slot) => applyCompatibilityHandoff(form, {
  slot: slot?.key,
  sourceTool: record?.tool,
  sourceTitle: record?.title,
  text: record?.text
})

const applySynthesisHandoff = (form, handoff) => {
  const slot = synthesisSlotLabels[handoff.slot] ? handoff.slot : inferSynthesisSlot(`${handoff.sourceTool || ''} ${handoff.sourceTitle || ''}`)

  return {
    ...form,
    [slot]: handoff.text || form[slot],
    context: `来自记录中心：${sourceLabel(handoff)}`
  }
}

const applySynthesisRecordSlot = (form, record, slot) => applySynthesisHandoff(form, {
  slot: slot?.key,
  sourceTool: record?.tool,
  sourceTitle: record?.title,
  text: record?.text
})

const aiPromptHandoffTargets = [
  {
    label: '送去 AI',
    slot: 'chartText',
    targetHref: '/tools/ai-prompt',
    targetSlug: 'aiPrompt'
  }
]

const synthesisHandoffTarget = {
  label: '合参',
  slot: 'auto',
  targetHref: '/tools/synthesis',
  targetSlug: 'synthesis'
}

const aiAndSynthesisHandoffTargets = [...aiPromptHandoffTargets, synthesisHandoffTarget]

export const structuredTools = {
  meihua: {
    title: '梅花易数排盘',
    href: '/tools/meihua',
    kicker: 'Meihua',
    defaultInput: { topic: '今天适合推进什么？', method: 'numbers', date: '__today', time: '__now', upperNumber: '1', lowerNumber: '8', movingNumber: '6' },
    fields: [
      { key: 'topic', label: '事项', type: 'text' },
      { key: 'method', label: '起卦方式', type: 'select', options: [{ value: 'numbers', label: '三数起卦' }, { value: 'time', label: '时间起卦' }] },
      { key: 'date', label: '日期', type: 'date' },
      { key: 'time', label: '时间', type: 'time' },
      { key: 'upperNumber', label: '上卦数', type: 'number', showWhen: { key: 'method', value: 'numbers' } },
      { key: 'lowerNumber', label: '下卦数', type: 'number', showWhen: { key: 'method', value: 'numbers' } },
      { key: 'movingNumber', label: '动爻数', type: 'number', showWhen: { key: 'method', value: 'numbers' } }
    ],
    calculate: calculateMeihua,
    handoffTargets: aiAndSynthesisHandoffTargets
  },
  name: {
    title: '姓名五格五行',
    href: '/tools/name',
    kicker: 'Name Fields',
    defaultInput: { fullName: '刘鸡血', surnameLength: '1', strokes: '15 18 6' },
    fields: [
      { key: 'fullName', label: '姓名', type: 'text' },
      { key: 'surnameLength', label: '姓氏字数', type: 'select', options: [{ value: '1', label: '单姓' }, { value: '2', label: '复姓' }] },
      { key: 'strokes', label: '逐字康熙笔画', type: 'text' }
    ],
    calculate: calculateName,
    handoffTargets: aiAndSynthesisHandoffTargets
  },
  tarot: {
    title: '塔罗抽牌',
    href: '/tools/tarot',
    kicker: 'Tarot',
    defaultInput: { question: '这件事现在最该关注什么？', spread: 'three', date: '__today', time: '__now', seed: 'jixue' },
    fields: [
      { key: 'question', label: '问题', type: 'textarea' },
      { key: 'spread', label: '牌阵', type: 'select', options: promptOptions(tarotSpreadLabels) },
      { key: 'date', label: '日期', type: 'date' },
      { key: 'time', label: '时间', type: 'time' },
      { key: 'seed', label: '抽牌种子', type: 'text' }
    ],
    calculate: calculateTarot,
    handoffTargets: aiAndSynthesisHandoffTargets
  },
  dailyFortune: {
    title: '每日运势速览',
    href: '/tools/daily-fortune',
    kicker: 'Daily',
    defaultInput: { date: '__today', time: '__now', zodiac: '未选择' },
    fields: [
      { key: 'date', label: '日期', type: 'date' },
      { key: 'time', label: '时间', type: 'time' },
      { key: 'zodiac', label: '个人生肖', type: 'select', options: ['未选择', '鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'].map(value => ({ value, label: value })) }
    ],
    calculate: calculateDailyFortune,
    handoffTargets: aiAndSynthesisHandoffTargets
  },
  qimen: {
    title: '奇门遁甲拆补法排盘',
    href: '/tools/qimen',
    kicker: 'Qimen',
    defaultInput: { topic: '当前事项', date: '__today', time: '__now' },
    fields: [
      { key: 'topic', label: '事项', type: 'text' },
      { key: 'date', label: '日期', type: 'date' },
      { key: 'time', label: '时间（按小时起局）', type: 'time' }
    ],
    calculate: calculateQimen,
    handoffTargets: aiAndSynthesisHandoffTargets
  },
  daliuren: {
    title: '大六壬四课三传',
    href: '/tools/daliuren',
    kicker: 'Liu Ren',
    defaultInput: { topic: '当前事项', date: '__today', time: '__now' },
    fields: [
      { key: 'topic', label: '事项', type: 'text' },
      { key: 'date', label: '日期', type: 'date' },
      { key: 'time', label: '时间', type: 'time' }
    ],
    calculate: calculateDaliuren,
    handoffTargets: aiAndSynthesisHandoffTargets
  },
  birthTime: {
    title: '出生校时对照',
    href: '/tools/birth-time',
    kicker: 'Birth Time',
    defaultInput: { date: '1996-07-19', time: '23:30', birthPlace: '黑龙江省 黑河市 五大连池市' },
    fields: [
      { key: 'date', label: '出生日期', type: 'date' },
      { key: 'time', label: '参考时间', type: 'time' },
      { key: 'birthPlace', label: '出生地', type: 'text' }
    ],
    calculate: calculateBirthTime,
    handoffTargets: aiAndSynthesisHandoffTargets
  },
  findTime: {
    title: '寻时定盘表',
    href: '/tools/find-time',
    kicker: 'Find Time',
    defaultInput: { date: '1996-07-19', topic: '出生时辰候选' },
    fields: [
      { key: 'date', label: '日期', type: 'date' },
      { key: 'topic', label: '用途', type: 'text' }
    ],
    calculate: calculateFindTime,
    handoffTargets: aiAndSynthesisHandoffTargets
  },
  dateSelection: {
    title: '择日速览',
    href: '/tools/date-selection',
    kicker: 'Date Selection',
    defaultInput: { topic: '上线发布', startDate: '__today', days: '7', time: '09:00' },
    fields: [
      { key: 'topic', label: '事项', type: 'text' },
      { key: 'startDate', label: '起始日期', type: 'date' },
      { key: 'days', label: '天数', type: 'number' },
      { key: 'time', label: '参考时间', type: 'time' }
    ],
    calculate: calculateDateSelection,
    handoffTargets: aiAndSynthesisHandoffTargets
  },
  synthesis: {
    title: '综合合参工作台',
    href: '/tools/synthesis',
    kicker: 'Synthesis',
    copyLabel: '复制合参提示词',
    defaultInput: {
      topic: '当前事项综合合参',
      focus: 'overview',
      question: '请把这些材料整理成一份可继续分析的结构化摘要。',
      context: '',
      birthChart: '',
      questionChart: '',
      tarotText: '',
      calendarText: '',
      notes: ''
    },
    fields: [
      { key: 'topic', label: '主题', type: 'text' },
      { key: 'focus', label: '关注方向', type: 'select', options: promptOptions(synthesisFocusLabels) },
      { key: 'question', label: '具体问题', type: 'textarea' },
      { key: 'context', label: '背景补充', type: 'textarea' },
      { key: 'birthChart', label: '出生盘字段', type: 'textarea' },
      { key: 'questionChart', label: '问事盘字段', type: 'textarea' },
      { key: 'tarotText', label: '塔罗字段', type: 'textarea' },
      { key: 'calendarText', label: '日课/择日字段', type: 'textarea' },
      { key: 'notes', label: '补充材料', type: 'textarea' }
    ],
    recordSlots: [
      { key: 'birthChart', label: '填出生盘', indicatorLabel: '出生盘' },
      { key: 'questionChart', label: '填问事盘', indicatorLabel: '问事盘' },
      { key: 'tarotText', label: '填塔罗', indicatorLabel: '塔罗' },
      { key: 'calendarText', label: '填日课', indicatorLabel: '日课' },
      { key: 'notes', label: '填补充', indicatorLabel: '补充材料' }
    ],
    calculate: calculateSynthesis,
    applyHandoff: applySynthesisHandoff,
    applyRecordSlot: applySynthesisRecordSlot
  },
  aiPrompt: {
    title: 'AI 解析提示词',
    href: '/tools/ai-prompt',
    kicker: 'AI Prompt',
    copyLabel: '复制提示词',
    defaultInput: {
      chartType: 'bazi',
      mode: 'structure',
      outputFormat: 'table',
      question: '我想从这份排盘里了解哪些结构值得关注？',
      context: '',
      chartText: ''
    },
    fields: [
      { key: 'chartType', label: '排盘类型', type: 'select', options: promptOptions(promptToolLabels) },
      { key: 'mode', label: '解析目标', type: 'select', options: promptOptions(promptModeLabels) },
      { key: 'outputFormat', label: '输出格式', type: 'select', options: promptOptions(promptOutputLabels) },
      { key: 'question', label: '具体问题', type: 'textarea' },
      { key: 'context', label: '背景补充', type: 'textarea' },
      { key: 'chartText', label: '排盘字段', type: 'textarea' }
    ],
    calculate: calculateAiPrompt,
    applyHandoff: applyAiPromptHandoff
  },
  compatibility: {
    title: '合盘对照',
    href: '/tools/compatibility',
    kicker: 'Compatibility',
    copyLabel: '复制对照提示词',
    defaultInput: {
      chartType: 'bazi',
      focus: 'relation',
      personA: '对象 A',
      personB: '对象 B',
      relation: '亲密关系',
      question: '请对两份排盘字段做结构化对照。',
      context: '',
      chartA: '',
      chartB: ''
    },
    fields: [
      { key: 'chartType', label: '排盘类型', type: 'select', options: promptOptions(compatibilityChartLabels) },
      { key: 'focus', label: '关注方向', type: 'select', options: promptOptions(compatibilityFocusLabels) },
      { key: 'personA', label: '对象 A', type: 'text' },
      { key: 'personB', label: '对象 B', type: 'text' },
      { key: 'relation', label: '关系说明', type: 'text' },
      { key: 'question', label: '具体问题', type: 'textarea' },
      { key: 'context', label: '背景补充', type: 'textarea' },
      { key: 'chartA', label: '对象 A 排盘字段', type: 'textarea' },
      { key: 'chartB', label: '对象 B 排盘字段', type: 'textarea' }
    ],
    recordSlots: [
      { key: 'chartA', label: '填入 A' },
      { key: 'chartB', label: '填入 B' }
    ],
    calculate: calculateCompatibility,
    applyHandoff: applyCompatibilityHandoff,
    applyRecordSlot: applyCompatibilityRecordSlot
  }
}

export const getStructuredTool = slug => structuredTools[slug]
export const formatStructuredResultText = formatResultText
