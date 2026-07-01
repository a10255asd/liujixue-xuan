import { Solar } from 'lunar-javascript'

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
const qimenStars = ['天蓬', '天芮', '天冲', '天辅', '天禽', '天心', '天柱', '天任', '天英']
const qimenDoors = ['休门', '死门', '伤门', '杜门', '中门', '开门', '惊门', '生门', '景门']
const qimenGods = ['值符', '腾蛇', '太阴', '六合', '白虎', '玄武', '九地', '九天', '太常']
const liurenGenerals = ['登明亥', '河魁戌', '从魁酉', '传送申', '小吉未', '胜光午', '太乙巳', '天罡辰', '太冲卯', '功曹寅', '大吉丑', '神后子']
const liurenGods = ['贵人', '腾蛇', '朱雀', '六合', '勾陈', '青龙', '天空', '白虎', '太常', '玄武', '太阴', '天后']

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
const result = ({ title, subtitle, badges = [], sections, summary }) => ({ title, subtitle, badges, sections, summary })

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

const getYinYangDun = ({ month, day }) => {
  const value = month * 100 + day
  return value >= 622 && value < 1222 ? '阴遁' : '阳遁'
}

const calculateQimen = input => {
  const fields = getCalendarFields(input.date, input.time)
  const { month, day } = splitDate(input.date)
  const dun = getYinYangDun({ month, day })
  const ju = oneBasedMod((zhiNumber[fields.eightChar.dayZhi] || 1) + (zhiNumber[fields.eightChar.timeZhi] || 1), 9)
  const offset = dun === '阳遁' ? ju - 1 : 9 - ju
  const palaceRows = palaces.map((palace, index) => {
    const cursor = mod(index + offset, 9)
    return [`${index + 1}宫 ${palace}`, `${qimenStars[cursor]} / ${qimenDoors[cursor]} / ${qimenGods[cursor]}`]
  })

  return result({
    title: '奇门遁甲速盘',
    subtitle: `${fields.solarText} · ${fields.eightChar.year} ${fields.eightChar.month} ${fields.eightChar.day} ${fields.eightChar.time}`,
    badges: [dun, `${ju}局`, `值符 ${qimenStars[offset]}`, `值使 ${qimenDoors[offset]}`],
    summary: `${dun}${ju}局 · ${qimenStars[offset]} ${qimenDoors[offset]}`,
    sections: [
      {
        title: '起局字段',
        rows: buildRows([
          ['事项', input.topic || '未填写事项'],
          ['公历', fields.solarText],
          ['农历', fields.lunarText],
          ['四柱', `${fields.eightChar.year} ${fields.eightChar.month} ${fields.eightChar.day} ${fields.eightChar.time}`],
          ['节气', `上一节气 ${fields.jieQi.previous}；下一节气 ${fields.jieQi.next}`],
          ['遁局', `${dun}${ju}局`]
        ])
      },
      {
        title: '九宫轮值',
        rows: buildRows(palaceRows)
      }
    ]
  })
}

const getMonthGeneral = lunarMonth => liurenGenerals[mod(12 - Math.abs(lunarMonth), 12)]

const calculateDaliuren = input => {
  const fields = getCalendarFields(input.date, input.time)
  const monthGeneral = getMonthGeneral(fields.lunar.getMonth())
  const dayGanIndex = gan.indexOf(fields.eightChar.dayGan)
  const dayZhiIndex = zhi.indexOf(fields.eightChar.dayZhi)
  const timeZhiIndex = zhi.indexOf(fields.eightChar.timeZhi)
  const godOffset = mod(dayGanIndex + timeZhiIndex, 12)
  const branchOffset = mod(dayZhiIndex + timeZhiIndex, 12)
  const transmissions = [0, 4, 8].map(step => zhi[mod(branchOffset + step, 12)])

  return result({
    title: '大六壬起课速览',
    subtitle: `${fields.solarText} · 日辰 ${fields.eightChar.day} · 占时 ${fields.eightChar.time}`,
    badges: [`月将 ${monthGeneral}`, `贵人 ${liurenGods[godOffset]}`, `旬空 ${fields.xunKong}`],
    summary: `${fields.eightChar.day}日 ${fields.eightChar.time}时 · ${monthGeneral}`,
    sections: [
      {
        title: '起课字段',
        rows: buildRows([
          ['事项', input.topic || '未填写事项'],
          ['公历', fields.solarText],
          ['农历', fields.lunarText],
          ['四柱', `${fields.eightChar.year} ${fields.eightChar.month} ${fields.eightChar.day} ${fields.eightChar.time}`],
          ['月将', monthGeneral],
          ['占时', fields.eightChar.time],
          ['旬空', fields.xunKong]
        ])
      },
      {
        title: '课传速览',
        rows: buildRows([
          ['贵人', liurenGods[godOffset]],
          ['十二天将排布', liurenGods.map((god, index) => `${zhi[mod(timeZhiIndex + index, 12)]}${god}`).join(' / ')],
          ['三传字段', `初传${transmissions[0]} / 中传${transmissions[1]} / 末传${transmissions[2]}`],
          ['四课索引', `${fields.eightChar.dayGan}${fields.eightChar.dayZhi}、${fields.eightChar.timeGan}${fields.eightChar.timeZhi}`]
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
    calculate: calculateMeihua
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
    calculate: calculateName
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
    calculate: calculateDailyFortune
  },
  qimen: {
    title: '奇门遁甲速盘',
    href: '/tools/qimen',
    kicker: 'Qimen',
    defaultInput: { topic: '当前事项', date: '__today', time: '__now' },
    fields: [
      { key: 'topic', label: '事项', type: 'text' },
      { key: 'date', label: '日期', type: 'date' },
      { key: 'time', label: '时间', type: 'time' }
    ],
    calculate: calculateQimen
  },
  daliuren: {
    title: '大六壬起课速览',
    href: '/tools/daliuren',
    kicker: 'Liu Ren',
    defaultInput: { topic: '当前事项', date: '__today', time: '__now' },
    fields: [
      { key: 'topic', label: '事项', type: 'text' },
      { key: 'date', label: '日期', type: 'date' },
      { key: 'time', label: '时间', type: 'time' }
    ],
    calculate: calculateDaliuren
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
    calculate: calculateBirthTime
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
    calculate: calculateFindTime
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
    calculate: calculateDateSelection
  }
}

export const getStructuredTool = slug => structuredTools[slug]
export const formatStructuredResultText = formatResultText
