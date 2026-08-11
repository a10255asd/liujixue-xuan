import { Solar } from 'lunar-javascript'
import { buildTianJiangMap, computeFullPan, DIZHI_ORDER, GAN_JI_GONG } from 'daliuren-lib/dist/src/index.js'
import { chartToObject, generateChartByDatetime } from 'qimen-dunjia'
import { buildCalendarDayPlan, calendarPurposeOptions } from './calendar-day-plan.js'

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

const meihuaFocusProfiles = {
  decision: {
    label: '决策拆解',
    review: '先把事项拆成选项、条件、阻碍和可验证信息，再用体用字段辅助复盘。',
    action: '今天只推进一个能验证条件的小动作，不用卦象替代决策。',
    observe: '后续记录实际反馈、关键变量是否变化，以及是否需要重新起卦。'
  },
  relation: {
    label: '关系复盘',
    review: '先记录双方位置、沟通事实和现实边界，再把体用关系作为资料字段留存。',
    action: '先补事实清单，必要时准备一次低压力沟通。',
    observe: '后续观察对方回应、沟通节点和自身情绪变化。'
  },
  timing: {
    label: '时机复核',
    review: '先固定起卦时间、事项窗口和已知限制，再对照动爻、互卦和变卦。',
    action: '把时间窗口拆成最近一步和后续备选，不直接给应期断语。',
    observe: '后续记录事件是否进入新阶段，以及哪个时间点出现实质变化。'
  },
  action: {
    label: '行动计划',
    review: '把卦盘字段转成可执行的下一步、风险点和复盘指标。',
    action: '选一个今天能完成的动作，并给它设定可观察结果。',
    observe: '复盘动作是否完成、反馈是否清晰、是否需要换路径。'
  },
  archive: {
    label: '卦例留档',
    review: '以留档为主，保存事项、背景、起卦方式、取数和卦盘字段。',
    action: '补齐来源、背景和后续事实，方便之后横向比较卦例。',
    observe: '每次回看时只补事实回传，不倒推确定性结论。'
  }
}

const buildMeihuaReviewRows = ({ chart, context, focusProfile, method }) => buildRows([
  ['复盘方向', `${focusProfile.label}：${focusProfile.review}`],
  ['背景材料', context],
  ['体用观察', `体卦 ${chart.body.name}${chart.body.element} / 用卦 ${chart.use.name}${chart.use.element}，先作为字段关系留档。`],
  ['动爻观察', `${lineNames[chart.movingLine - 1]}动，对应本卦到变卦的变化位置。`],
  ['互卦材料', `${chart.mutualName} 用于保存中间结构，不单独推出结果。`],
  ['起卦口径', method === 'time' ? '时间起卦：由农历年月日和时支取数。' : '三数起卦：由用户输入上卦数、下卦数和动爻数。'],
  ['今日小动作', focusProfile.action],
  ['后续复盘', focusProfile.observe],
  ['输出边界', '只做梅花卦盘字段、问题材料和复盘清单，不输出吉凶、应期或结果保证。']
])

const nameUsageProfiles = {
  baby: {
    label: '新生儿命名',
    review: '先核对出生信息、姓氏字数和逐字康熙笔画，再把候选名放入同一表格横向比较。',
    action: '保留 3-5 个候选名，逐一补齐读音、字义、出处和家族避讳。'
  },
  brand: {
    label: '品牌/项目命名',
    review: '先看读音记忆点、行业语义和检索重名，再把五格字段作为旁路材料。',
    action: '补一轮商标、域名、社媒账号和同音近形检查。'
  },
  pen: {
    label: '笔名/艺名',
    review: '先确认人设、作品调性和可持续使用场景，再复核字义、读音和笔画字段。',
    action: '写一句公开自我介绍，检查名字是否顺口、好记、可长期使用。'
  },
  rename: {
    label: '改名方案',
    review: '先记录改名原因、使用成本和证件/社交影响，再比较候选方案。',
    action: '列出需要同步修改的证件、账号、合同和常用署名场景。'
  },
  archive: {
    label: '姓名档案',
    review: '以留档为主，保存姓名拆字、笔画、三才和人工复核事项。',
    action: '把来源、笔画口径和待确认项写清楚，方便之后复查。'
  }
}

const buildNameReviewRows = ({ profile, fullName, padded, missingStrokeCount, meaningPreference, avoidNotes }) => buildRows([
  ['复核方向', `${profile.label}：${profile.review}`],
  ['笔画复核', missingStrokeCount ? `有 ${missingStrokeCount} 个字未提供笔画，当前按 1 画占位；建议补齐后再比较。` : `已按 ${padded.join(' / ')} 录入逐字笔画。`],
  ['读音字形', `把「${fullName}」连续读三遍，检查谐音、拗口、异体字和常见输入法候选。`],
  ['含义偏好', meaningPreference],
  ['避讳边界', avoidNotes],
  ['今日小动作', profile.action],
  ['输出边界', '只做姓名字段、五格和人工复核清单，不输出姓名打分、吉凶定论或结果保证。']
])

const calculateMeihua = input => {
  const fields = getCalendarFields(input.date, input.time)
  const method = input.method || 'numbers'
  const focusProfile = meihuaFocusProfiles[input.focus] || meihuaFocusProfiles.decision
  const topic = cleanPromptInput(input.topic, '未填写事项')
  const context = cleanPromptInput(input.context, '未填写背景材料。')
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
    title: '梅花问事记录',
    subtitle: `${topic} · ${focusProfile.label} · ${fields.solarText}`,
    badges: [focusProfile.label, `本卦 ${chart.name}`, `变卦 ${chart.changedName}`, `${lineNames[chart.movingLine - 1]}动`],
    summary: `${chart.name} → ${chart.changedName}`,
    sections: [
      {
        title: '问事信息',
        rows: buildRows([
          ['事项', topic],
          ['关注方向', focusProfile.label],
          ['背景材料', context],
          ['起卦方式', method === 'time' ? '时间起卦' : '三数起卦'],
          ['公历', fields.solarText],
          ['农历', fields.lunarText],
          ['四柱', `${fields.eightChar.year} ${fields.eightChar.month} ${fields.eightChar.day} ${fields.eightChar.time}`],
          ['输出口径', '先保存事项、背景、取数和卦盘字段，再等待事实回传复盘。']
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
      },
      {
        title: '复盘清单',
        rows: buildMeihuaReviewRows({
          chart,
          context,
          focusProfile,
          method
        })
      },
      {
        title: '下一步入口',
        rows: buildRows([
          ['每日一卦记录', '把同一事项以时间起卦方式另存一条日常问事记录。 /tools/daily'],
          ['六十四卦复核', '核对本卦、互卦或变卦的上下卦、卦名和八卦五行。 /tools/hexagrams'],
          ['干支五行复核记录', '核对体卦、用卦、动爻相关五行资料口径。 /tools/wuxing']
        ])
      }
    ]
  })
}

const calculateName = input => {
  const profile = nameUsageProfiles[input.usage] || nameUsageProfiles.baby
  const fullName = String(input.fullName || '刘鸡血').trim()
  const surnameLength = Math.max(1, Math.min(toInt(input.surnameLength, 1), Math.max(fullName.length - 1, 1)))
  const chars = Array.from(fullName)
  const surname = chars.slice(0, surnameLength).join('')
  const givenName = chars.slice(surnameLength).join('') || chars.slice(-1).join('')
  const strokes = parseStrokeList(input.strokes)
  const padded = chars.map((_, index) => strokes[index] || 1)
  const missingStrokeCount = chars.filter((_, index) => !strokes[index]).length
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
  const namingGoal = cleanPromptInput(input.namingGoal, '未填写命名目标。')
  const meaningPreference = cleanPromptInput(input.meaningPreference, '未填写含义、出处或风格偏好。')
  const avoidNotes = cleanPromptInput(input.avoidNotes, '未填写家族避讳、谐音、重名或行业限制。')

  return result({
    title: '姓名方案复核',
    subtitle: `${fullName} · ${profile.label} · 笔画 ${padded.join('-')}`,
    badges: [profile.label, `${getStrokeElement(tian)} / ${getStrokeElement(ren)} / ${getStrokeElement(di)}`, `总格${total}${getStrokeElement(total)}`, missingStrokeCount ? `缺${missingStrokeCount}字笔画` : '笔画完整'],
    summary: `${fullName} / ${grids.map(([name, number]) => `${name}${number}`).join(' ')}`,
    sections: [
      {
        title: '方案信息',
        rows: buildRows([
          ['用途', profile.label],
          ['姓名', fullName],
          ['姓氏', `${surname}（${surnameStrokes.join('+')}画）`],
          ['名字', `${givenName}（${givenStrokes.join('+') || '-'}画）`],
          ['笔画序列', padded.join(' / ')],
          ['命名目标', namingGoal],
          ['含义偏好', meaningPreference],
          ['避讳/限制', avoidNotes]
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
      },
      {
        title: '复核清单',
        rows: buildNameReviewRows({
          profile,
          fullName,
          padded,
          missingStrokeCount,
          meaningPreference,
          avoidNotes
        })
      },
      {
        title: '下一步入口',
        rows: buildRows([
          ['干支五行复核记录', '核对天干地支、五行、藏干和生克资料口径。 /tools/wuxing'],
          ['八字出生档案', '如果有出生信息，可先排出生盘，再把姓名方案作为单独材料留档。 /tools/bazi'],
          ['出生校时工作台', '出生时间不确定时，先整理候选时辰和校时线索。 /tools/birth-time']
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

const tarotFocusProfiles = {
  decision: {
    label: '决策拆解',
    prompt: '把问题拆成选项、条件和可验证动作。'
  },
  relation: {
    label: '关系复盘',
    prompt: '先记录双方位置、沟通事实和隐藏变量。'
  },
  action: {
    label: '行动计划',
    prompt: '把牌阵转成今天可执行、可复盘的小步骤。'
  },
  emotion: {
    label: '情绪整理',
    prompt: '记录触发情绪、身体感受和现实背景。'
  },
  journal: {
    label: '抽牌日志',
    prompt: '先留档，等事实回传后再复盘。'
  }
}

const buildTarotReviewRows = ({ question, context, spreadName, focusProfile, drawnCards }) => [
  ['关注方向', `${focusProfile.label} / ${focusProfile.prompt}`],
  ['问题重写', question],
  ['背景材料', context || '未填写'],
  ['牌阵口径', `${spreadName}，共${drawnCards.length}张牌。`],
  ['关键词汇总', drawnCards.map(card => `${card.name}${card.orientation}：${card.keywords}`).join(' / ')],
  ['复盘问题', '哪些信息被确认？哪些只是情绪或猜测？下一次复盘要看什么事实？'],
  ['输出边界', '只输出抽牌字段、问题拆解和复盘清单，不输出吉凶、应期或确定性判断。']
]

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
  const context = String(input.context || '').trim()
  const focusProfile = tarotFocusProfiles[input.focus] || tarotFocusProfiles.decision
  const seed = String(input.seed || question).trim() || question
  const date = input.date || '2026-07-02'
  const time = input.time || '09:00'
  const drawnCards = drawTarotCards(`${question}|${context}|${spread}|${date}|${time}|${seed}`, positions.length)
  const cardRows = positions.map((position, index) => {
    const card = drawnCards[index]
    return [
      position,
      `${card.name}（${card.orientation} / ${card.arcana} / ${card.keywords}）`
    ]
  })

  return result({
    title: '塔罗问题记录',
    subtitle: `${question} · ${focusProfile.label} · ${spreadName}`,
    badges: [focusProfile.label, spreadName, `${positions.length}张牌`, '78张牌库'],
    summary: `${focusProfile.label} / ${spreadName} / ${drawnCards.map(card => `${card.name}${card.orientation}`).join('、')}`,
    sections: [
      {
        title: '抽牌信息',
        rows: buildRows([
          ['问题', question],
          ['关注方向', focusProfile.label],
          ['背景材料', context || '未填写'],
          ['牌阵', spreadName],
          ['时间', `${date} ${time}`],
          ['种子', seed]
        ])
      },
      {
        title: '问题拆解',
        rows: buildRows(buildTarotReviewRows({ question, context, spreadName, focusProfile, drawnCards }))
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
      },
      {
        title: '下一步入口',
        rows: buildRows([
          ['每日一卦记录', '需要把同一问题沉淀成每日问事记录时继续留档。 /tools/daily'],
          ['六爻问事记录', '需要世应、六亲、六神和动变关系时继续排六爻。 /tools/liuyao'],
          ['梅花易数排盘', '需要体用、互卦和取数推导时继续排梅花。 /tools/meihua']
        ])
      }
    ]
  })
}

const buildZodiacReview = (zodiac, fields) => {
  if (!zodiac || zodiac === '未选择') {
    return {
      level: '未选择生肖',
      text: '未选择个人生肖，仅输出公共日课字段。'
    }
  }

  const isClashing = String(fields.chong || '').includes(zodiac)

  return {
    level: isClashing ? '个人生肖冲日' : '未见直接冲日',
    text: isClashing
      ? `个人生肖冲日：${zodiac}与今日冲煞字段命中，建议把当天安排放入人工复核。`
      : `未见直接冲日：${zodiac}未命中今日冲煞字段，可继续结合事项和执行条件复核。`
  }
}

const buildDailyActionReviewRows = ({ actionWindow, constraints, dayPlan, fields, topic, zodiacReview }) => buildRows([
  ['复核方向', `${dayPlan.profile.label}：先看宜忌命中和冲煞字段，再结合今天的时间、人和现实限制决定是否执行。`],
  ['执行窗口', actionWindow],
  ['现实限制', constraints],
  ['推进判断', `${dayPlan.level}（${dayPlan.score}分）：${dayPlan.advice}`],
  ['生肖复核', zodiacReview.text],
  ['冲煞复核', `${fields.chong} / ${fields.sha}，如涉及关键人员或地点，先单独确认。`],
  ['今日小动作', `围绕「${topic}」先完成一个可在今天结束前验收的小动作，并记录执行时间。`],
  ['复盘字段', '记录实际执行时间、参与人、阻碍点、是否延期、下一次要排除的限制条件。'],
  ['输出边界', '只做每日行动记录、日课字段和复盘清单，不输出吉凶、运势断语或确定性判断。']
])

const calculateDailyFortune = input => {
  const fields = getCalendarFields(input.date, input.time)
  const zodiac = input.zodiac || '未选择'
  const dayElement = elements[fields.eightChar.dayGan]
  const topic = cleanPromptInput(input.topic, '今日安排')
  const constraints = cleanPromptInput(input.constraints, '未填写现实限制。')
  const actionWindow = cleanPromptInput(input.actionWindow, '未填写执行窗口。')
  const dayPlan = buildCalendarDayPlan({
    yi: fields.yi,
    ji: fields.ji,
    chong: fields.chong,
    sha: fields.sha
  }, input.purpose)
  const zodiacReview = buildZodiacReview(zodiac, fields)
  const nextStepRows = [
    ...dayPlan.nextSteps
      .filter(step => step.href !== '/tools/daily-fortune')
      .map(step => [step.label, `${step.text} ${step.href}`]),
    ['黄历日课记录', '核对当天节气、四柱、纳音、冲煞和宜忌原文。 /tools/calendar'],
    ['干支五行复核记录', '核对日柱、时柱、五行、藏干和生克资料口径。 /tools/wuxing']
  ]

  return result({
    title: '每日行动记录',
    subtitle: `${fields.solarText} · ${dayPlan.profile.label} · ${topic}`,
    badges: [dayPlan.level, dayPlan.profile.label, zodiacReview.level, `日柱 ${fields.eightChar.day}`],
    summary: `${topic} · ${fields.eightChar.day}日 · ${dayPlan.level} · ${zodiacReview.level}`,
    sections: [
      {
        title: '行动记录',
        rows: buildRows([
          ['事项', topic],
          ['事项类型', dayPlan.profile.label],
          ['执行窗口', actionWindow],
          ['现实限制', constraints],
          ['候选级别', `${dayPlan.level}（${dayPlan.score}分）`],
          ['处理建议', dayPlan.advice],
          ['个人生肖', zodiac],
          ['生肖复核', zodiacReview.text],
          ['宜项命中', dayPlan.preferMatches.length ? dayPlan.preferMatches.join('、') : '-'],
          ['事项在忌项', dayPlan.blockedMatches.length ? dayPlan.blockedMatches.join('、') : '-'],
          ['通用避开项', dayPlan.cautionMatches.length ? dayPlan.cautionMatches.join('、') : '-'],
          ['输出口径', '只做日课字段和复核清单，不输出吉凶、运势断语或确定性判断。']
        ])
      },
      {
        title: '执行清单',
        rows: buildRows([
          ['先做事项', `先确认「${topic}」今天必须完成的最小步骤。`],
          ['可推进行动', dayPlan.preferMatches.length ? `优先放在宜项命中后推进：${dayPlan.preferMatches.join('、')}。` : '未命中明确宜项，先做低风险准备动作。'],
          ['需避开动作', dayPlan.blockedMatches.length ? `事项在忌项中命中：${dayPlan.blockedMatches.join('、')}，建议降级或延期。` : '未见事项直接落入忌项。'],
          ['备选处理', '若现实限制无法满足，改为资料整理、沟通确认或择日候选比较。']
        ])
      },
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
      },
      {
        title: '复盘清单',
        rows: buildDailyActionReviewRows({
          actionWindow,
          constraints,
          dayPlan,
          fields,
          topic,
          zodiacReview
        })
      },
      {
        title: '下一步入口',
        rows: buildRows(nextStepRows)
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

const qimenFocusProfiles = {
  decision: {
    label: '决策拆解',
    review: '先把事项拆成选项、限制、资源和待确认信息，再把盘面字段作为复盘材料。',
    action: '今天只推进一个可验证的小动作，并写下预期反馈。',
    observe: '复盘实际反馈、关键变量是否变化，以及是否需要重新起局。'
  },
  timing: {
    label: '行动窗口',
    review: '先固定起局时间、事项窗口和外部限制，再对照值符值使、时干和九宫字段。',
    action: '把时间窗口拆成最近一步和备选窗口，不直接给确定应期。',
    observe: '后续记录事项在哪个时间点出现实质推进或暂停。'
  },
  relation: {
    label: '协作沟通',
    review: '先记录相关方、沟通事实、权限边界和可谈条件，再留存九宫字段。',
    action: '准备一条低压力确认信息，先补事实而不是推动结论。',
    observe: '后续记录对方回应、信息差是否缩小、合作条件是否变化。'
  },
  direction: {
    label: '方位资料',
    review: '用于整理九宫、方位、八门、九星、八神的资料层对照。',
    action: '先标出本次最关注的宫位或方位，再回到资料页核对基础字段。',
    observe: '只比较字段和位置变化，不把单一方位当作结果保证。'
  },
  archive: {
    label: '盘例留档',
    review: '以留档为主，保存事项、背景、起局时间、拆补法盘面和复盘口径。',
    action: '补齐来源、背景和后续事实，方便之后横向比较盘例。',
    observe: '每次回看时只补事实回传，不倒推确定性结论。'
  }
}

const buildQimenReviewRows = ({ context, profile, chart, dun, ju }) => buildRows([
  ['复盘方向', `${profile.label}：${profile.review}`],
  ['背景材料', context],
  ['盘面锚点', `${dun}${ju}局；值符 ${qimenValue(chart, '值符')} 落${qimenValue(chart, '值符落宮')}宫；值使 ${qimenValue(chart, '值使')} 落${qimenValue(chart, '值使落宮')}宫。`],
  ['时间口径', `${qimenDatetime(chart.__date, chart.__time)}（按小时起局）`],
  ['宫位复核', '先记录值符、值使、时干和事项相关宫位字段，再等待事实回传。'],
  ['今日小动作', profile.action],
  ['后续复盘', profile.observe],
  ['输出边界', '只做奇门盘面字段、事项材料和复盘清单，不输出吉凶、应期或结果保证。']
])

const calculateQimen = input => {
  const fields = getCalendarFields(input.date, input.time)
  const chart = {
    ...chartToObject(generateChartByDatetime(qimenDatetime(input.date, input.time))),
    __date: input.date,
    __time: input.time
  }
  const dun = `${qimenValue(chart, '陰陽')}遁`
  const ju = qimenValue(chart, '局數')
  const profile = qimenFocusProfiles[input.focus] || qimenFocusProfiles.decision
  const topic = cleanPromptInput(input.topic, '未填写事项')
  const context = cleanPromptInput(input.context, '未填写背景材料。')
  const palaceCells = buildQimenPalaceCells(chart)
  const palaceRows = palaceCells.map(cell => [
    cell.title,
    cell.items.map(item => `${item.label}${item.value}`).join(' / ')
  ])

  return result({
    title: '奇门问事记录',
    subtitle: `${topic} · ${profile.label} · ${fields.solarText}`,
    badges: [profile.label, dun, `${ju}局`, `${qimenValue(chart, '節氣')} ${qimenValue(chart, '三元')}`, `值符 ${qimenValue(chart, '值符')}`, `值使 ${qimenValue(chart, '值使')}`],
    summary: `${topic} · ${dun}${ju}局 · ${qimenValue(chart, '值符')} ${qimenValue(chart, '值使')}`,
    sections: [
      {
        title: '问事信息',
        rows: buildRows([
          ['事项', topic],
          ['关注方向', profile.label],
          ['背景材料', context],
          ['公历', fields.solarText],
          ['农历', fields.lunarText],
          ['四柱', `${fields.eightChar.year} ${fields.eightChar.month} ${fields.eightChar.day} ${fields.eightChar.time}`],
          ['输出口径', '先保存事项、背景、起局时间和盘面字段，再等待事实回传复盘。']
        ])
      },
      {
        title: '起局字段',
        rows: buildRows([
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
      },
      {
        title: '复盘清单',
        rows: buildQimenReviewRows({ context, profile, chart, dun, ju })
      },
      {
        title: '下一步入口',
        rows: buildRows([
          ['每日一卦记录', '把同一事项沉淀成日常问事记录，方便后续事实回传。 /tools/daily'],
          ['六爻问事记录', '需要世应、六亲、六神和动变关系时继续排六爻。 /tools/liuyao'],
          ['梅花问事记录', '需要体用、互卦和取数推导时继续排梅花。 /tools/meihua'],
          ['干支五行复核记录', '核对天干地支、五行、方位和基础资料口径。 /tools/wuxing']
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

const daliurenFocusProfiles = {
  decision: {
    label: '决策拆解',
    review: '先把事项拆成选项、条件、阻碍和待确认信息，再把四课三传作为复盘材料。',
    action: '今天只推进一个能验证条件的小动作，并记录反馈来源。',
    observe: '后续记录事项是否出现新信息、阻碍是否变化，以及是否需要重新起课。'
  },
  timing: {
    label: '时机复核',
    review: '先固定占时、事项窗口和现实限制，再对照月将、课型、三传和旬空字段。',
    action: '把时间窗口拆成最近一步和备选窗口，不直接给确定应期。',
    observe: '后续记录事项在哪个节点推进、停滞或转向。'
  },
  relation: {
    label: '关系协作',
    review: '先记录相关方、沟通事实、权限边界和可谈条件，再保存课传字段。',
    action: '补一条事实确认或低压力沟通，不让盘面替代沟通本身。',
    observe: '后续记录对方回应、信息差是否缩小、合作条件是否变化。'
  },
  evidence: {
    label: '证据整理',
    review: '适合把已知证据、来源、时间线和课传字段放在同一份记录里复查。',
    action: '补齐关键来源、日期和待验证清单，先处理可查证部分。',
    observe: '每次回看只追加事实回传，不倒推确定性结论。'
  },
  archive: {
    label: '课例留档',
    review: '以留档为主，保存事项、背景、占时、月将、四课、三传和天将排布。',
    action: '下载排盘图片，把后续事实和反馈日期写在同一条记录里。',
    observe: '后续横向比较同类课例，只比较字段和反馈，不补写断语。'
  }
}

const buildDaliurenReviewRows = ({ context, fields, monthGeneral, pan, profile, sanZhuanCells, siKeCells }) => buildRows([
  ['复盘方向', `${profile.label}：${profile.review}`],
  ['背景材料', context],
  ['课传锚点', `月将 ${monthGeneral.zhi}${monthGeneral.name}；课型 ${pan.siKeSanZhuan.kind}；旬空 ${fields.xunKong}。`],
  ['四课复核', siKeCells.map(cell => `${cell.title}${cell.items.map(item => item.value).join('/')}`).join('；')],
  ['三传复核', sanZhuanCells.map(cell => `${cell.title}${cell.items.find(item => item.label === '传神')?.value || '-'}`).join(' / ')],
  ['月将口径', `上一中气 ${monthGeneral.qiName} ${monthGeneral.qiTime}，按中气取月将。`],
  ['今日小动作', profile.action],
  ['后续复盘', profile.observe],
  ['输出边界', '只做大六壬课传字段、事项材料和复盘清单，不输出吉凶、应期或结果保证。']
])

const calculateDaliuren = input => {
  const fields = getCalendarFields(input.date, input.time)
  const monthGeneral = getMonthGeneral(fields.lunar)
  const profile = daliurenFocusProfiles[input.focus] || daliurenFocusProfiles.decision
  const topic = cleanPromptInput(input.topic, '未填写事项')
  const context = cleanPromptInput(input.context, '未填写背景材料。')
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
    title: '大六壬问事记录',
    subtitle: `${topic} · ${profile.label} · ${fields.solarText}`,
    badges: [profile.label, `月将 ${monthGeneral.zhi}${monthGeneral.name}`, `课型 ${pan.siKeSanZhuan.kind}`, `旬空 ${fields.xunKong}`],
    summary: `${topic} · ${fields.eightChar.day}日 ${fields.eightChar.time}时 · ${monthGeneral.zhi}${monthGeneral.name}`,
    sections: [
      {
        title: '问事信息',
        rows: buildRows([
          ['事项', topic],
          ['关注方向', profile.label],
          ['背景材料', context],
          ['公历', fields.solarText],
          ['农历', fields.lunarText],
          ['四柱', `${fields.eightChar.year} ${fields.eightChar.month} ${fields.eightChar.day} ${fields.eightChar.time}`],
          ['输出口径', '先保存事项、背景、占时和课传字段，再等待事实回传复盘。']
        ])
      },
      {
        title: '起课字段',
        rows: buildRows([
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
      },
      {
        title: '复盘清单',
        rows: buildDaliurenReviewRows({ context, fields, monthGeneral, pan, profile, sanZhuanCells, siKeCells })
      },
      {
        title: '下一步入口',
        rows: buildRows([
          ['每日一卦记录', '把同一事项沉淀成日常问事记录，方便后续事实回传。 /tools/daily'],
          ['六爻问事记录', '需要世应、六亲、六神和动变关系时继续排六爻。 /tools/liuyao'],
          ['奇门问事记录', '需要九宫、值符值使、八门九星八神字段时继续排奇门。 /tools/qimen'],
          ['干支五行复核记录', '核对天干地支、五行、月将和基础资料口径。 /tools/wuxing']
        ])
      }
    ]
  })
}

const birthTimeRangeProfiles = {
  exact: '记载时间较准',
  within1: '前后1小时',
  within2: '前后2小时',
  wide: '前后4小时以上'
}

const birthTimeCandidateLabel = offset => {
  if (offset === 0) return '参考时辰'
  return offset < 0 ? `前${Math.abs(offset) * 2}小时` : `后${offset * 2}小时`
}

const summarizeClue = value => {
  const text = String(value || '').trim()
  if (!text) return '未填写'
  return text.length > 80 ? `${text.slice(0, 80)}...` : text
}

const calculateBirthTime = input => {
  const { year, month, day } = splitDate(input.date)
  const { hour } = splitTime(input.time)
  const rangeLabel = birthTimeRangeProfiles[input.knownRange] || birthTimeRangeProfiles.within2
  const centerFields = getCalendarFields(input.date, input.time)
  const candidates = [-2, -1, 0, 1, 2].map(offset => {
    const probe = new Date(year, month - 1, day, hour + offset * 2, 0, 0)
    const probeDate = `${probe.getFullYear()}-${pad(probe.getMonth() + 1)}-${pad(probe.getDate())}`
    const probeTime = `${pad(probe.getHours())}:00`
    const fields = getCalendarFields(probeDate, probeTime)

    return {
      offset,
      label: birthTimeCandidateLabel(offset),
      date: probeDate,
      time: probeTime,
      fields
    }
  })
  const rows = candidates.map(candidate => [
    `${candidate.date} ${candidate.time}`,
    `${candidate.label} / 四柱 ${candidate.fields.eightChar.year} ${candidate.fields.eightChar.month} ${candidate.fields.eightChar.day} ${candidate.fields.eightChar.time}`
  ])
  const differenceRows = candidates.map(candidate => [
    `${candidate.label} ${candidate.fields.eightChar.time}`,
    [
      `日期 ${candidate.date}`,
      candidate.fields.eightChar.day === centerFields.eightChar.day
        ? `日柱同参考 ${candidate.fields.eightChar.day}`
        : `日柱变化 ${centerFields.eightChar.day}→${candidate.fields.eightChar.day}`,
      `旬空 ${candidate.fields.xunKong}`,
      `冲 ${candidate.fields.chong}`
    ].join(' / ')
  ])
  const changedDayCount = candidates.filter(candidate => candidate.fields.eightChar.day !== centerFields.eightChar.day).length
  const ziHint = hour >= 23 || hour <= 1
    ? '靠近子时，需确认晚子时、跨日和真太阳时口径。'
    : '未贴近子时，仍需结合出生地和记载来源复核。'

  return result({
    title: '出生校时工作台',
    subtitle: `${input.date} ${input.time} · ${rangeLabel} · ${input.birthPlace || '未填写出生地'}`,
    badges: [`候选${candidates.length}档`, rangeLabel, changedDayCount ? `日柱变化${changedDayCount}档` : '日柱未变', hour >= 23 || hour <= 1 ? '子时复核' : '常规复核'],
    summary: `${input.date} ${input.time} 校时对照`,
    sections: [
      {
        title: '输入信息',
        rows: buildRows([
          ['出生日期', input.date],
          ['参考时间', input.time],
          ['出生地', input.birthPlace || '未填写'],
          ['已知范围', rangeLabel],
          ['校时线索', summarizeClue(input.lifeClues)],
          ['输出口径', '列出参考时间前后候选盘面，不直接判定唯一出生时辰。']
        ])
      },
      {
        title: '校时复核',
        rows: buildRows([
          ['参考四柱', `${centerFields.eightChar.year} ${centerFields.eightChar.month} ${centerFields.eightChar.day} ${centerFields.eightChar.time}`],
          ['候选档数', `${candidates.length}档（前后各两档）`],
          ['日柱变化', changedDayCount ? `${changedDayCount}档与参考日柱不同` : '候选日柱与参考日柱一致'],
          ['子时提示', ziHint],
          ['复核方法', '先比较日柱、时柱和旬空差异，再进入八字、紫微或寻时表逐一留档。']
        ])
      },
      {
        title: '候选差异',
        rows: buildRows(differenceRows)
      },
      {
        title: '时辰候选',
        rows: buildRows(rows)
      },
      {
        title: '下一步入口',
        rows: buildRows([
          ['八字出生档案', '用候选时间逐一建档，核对四柱、十神、大运、流年和校时线索。 /tools/bazi'],
          ['紫微命盘档案', '用候选时间逐一建档，比较命身宫、十二宫、星曜和校时线索。 /tools/ziwei'],
          ['寻时定盘表', '打开整日十二时辰表，查看候选之外的完整时辰对照。 /tools/find-time']
        ])
      }
    ]
  })
}

const findTimeFocusProfiles = {
  all: { label: '整日排查', branches: zhi },
  night: { label: '夜间候选', branches: ['亥', '子', '丑', '戌'] },
  morning: { label: '晨间候选', branches: ['寅', '卯', '辰'] },
  daytime: { label: '白天候选', branches: ['巳', '午', '未', '申'] },
  evening: { label: '傍晚候选', branches: ['酉', '戌', '亥'] }
}

const findTimePeriod = branch => {
  if (['子', '丑', '亥', '戌'].includes(branch)) return '夜'
  if (['寅', '卯', '辰'].includes(branch)) return '晨'
  if (['巳', '午', '未'].includes(branch)) return '昼'
  return '夕'
}

const calculateFindTime = input => {
  const profile = findTimeFocusProfiles[input.focus] || findTimeFocusProfiles.all
  const noonFields = getCalendarFields(input.date, '12:00')
  const candidates = Array.from({ length: 12 }, (_, index) => {
    const branch = zhi[index]
    const hour = mod(23 + index * 2, 24)
    const fields = getCalendarFields(input.date, `${pad(hour)}:00`)

    return {
      branch,
      hour,
      fields,
      isFocused: profile.branches.includes(branch),
      period: findTimePeriod(branch)
    }
  })
  const rows = candidates.map(candidate => [
    `${candidate.branch}时 ${pad(candidate.hour)}:00`,
    `${candidate.isFocused ? '重点候选' : '完整对照'} / ${candidate.period} / 四柱 ${candidate.fields.eightChar.year} ${candidate.fields.eightChar.month} ${candidate.fields.eightChar.day} ${candidate.fields.eightChar.time} / 旬空 ${candidate.fields.xunKong}`
  ])
  const focusedRows = candidates
    .filter(candidate => candidate.isFocused)
    .map(candidate => [
      `${candidate.branch}时 ${pad(candidate.hour)}:00`,
      [
        `${candidate.period}段`,
        `时柱 ${candidate.fields.eightChar.time}`,
        candidate.fields.eightChar.day === noonFields.eightChar.day
          ? `日柱同午时 ${candidate.fields.eightChar.day}`
          : `日柱变化 ${noonFields.eightChar.day}→${candidate.fields.eightChar.day}`,
        `冲 ${candidate.fields.chong}`
      ].join(' / ')
    ])
  const changedDayCount = candidates.filter(candidate => candidate.fields.eightChar.day !== noonFields.eightChar.day).length

  return result({
    title: '寻时定盘工作台',
    subtitle: `${input.date} · ${profile.label} · ${input.topic || '出生时辰候选对照'}`,
    badges: ['十二时辰', profile.label, `重点${focusedRows.length}档`, changedDayCount ? `日柱变化${changedDayCount}档` : '日柱未变'],
    summary: `${input.date} 十二时辰定盘排查`,
    sections: [
      {
        title: '排查信息',
        rows: buildRows([
          ['日期', input.date],
          ['用途', input.topic || '出生时辰候选对照'],
          ['关注时段', profile.label],
          ['午时参考日柱', noonFields.eightChar.day],
          ['排查口径', '按整日十二时辰列出四柱差异，只做候选排查，不直接判定唯一时辰。']
        ])
      },
      {
        title: '重点候选',
        rows: buildRows(focusedRows)
      },
      {
        title: '十二时辰全表',
        rows: buildRows(rows)
      },
      {
        title: '下一步入口',
        rows: buildRows([
          ['出生校时工作台', '把重点候选缩小到参考时间前后几档继续比较。 /tools/birth-time'],
          ['八字出生档案', '用候选时间逐一建档，核对四柱、十神和大运流年。 /tools/bazi'],
          ['紫微命盘档案', '用候选时间逐一建档，比较命身宫和十二宫差异。 /tools/ziwei']
        ])
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

const datePurposeProfiles = {
  launch: {
    label: '上线发布',
    prefer: ['开市', '交易', '立券', '纳财', '祈福', '出行'],
    avoid: ['破土', '安葬', '行丧']
  },
  signing: {
    label: '签约谈事',
    prefer: ['交易', '立券', '纳财', '订盟', '纳采', '开市'],
    avoid: ['词讼', '安葬', '破土']
  },
  move: {
    label: '搬家入宅',
    prefer: ['入宅', '移徙', '安床', '安门', '纳财'],
    avoid: ['破土', '安葬', '行丧']
  },
  travel: {
    label: '出行办事',
    prefer: ['出行', '赴任', '会亲友', '祭祀', '祈福'],
    avoid: ['安葬', '破土', '行丧']
  },
  ceremony: {
    label: '婚嫁仪式',
    prefer: ['嫁娶', '订盟', '纳采', '会亲友', '祈福'],
    avoid: ['安葬', '破土', '行丧']
  },
  repair: {
    label: '装修动工',
    prefer: ['修造', '动土', '安门', '上梁', '开光'],
    avoid: ['嫁娶', '安葬', '行丧']
  },
  general: {
    label: '综合筛选',
    prefer: ['祭祀', '祈福', '出行', '会亲友', '纳财'],
    avoid: ['诸事不宜', '安葬', '行丧']
  }
}

const splitAlmanacItems = value => String(value || '')
  .split(/[、，,\s]+/)
  .map(item => item.trim())
  .filter(Boolean)
  .filter(item => item !== '-')

const matchedAlmanacItems = (text, keywords) => {
  const items = splitAlmanacItems(text)
  const matches = keywords.filter(keyword => items.some(item => item.includes(keyword)))

  return [...new Set(matches)]
}

const scoreDateCandidate = (fields, profile) => {
  const preferMatches = matchedAlmanacItems(fields.yi, profile.prefer)
  const avoidMatches = matchedAlmanacItems(fields.ji, profile.prefer)
  const cautionMatches = matchedAlmanacItems(`${fields.yi} ${fields.ji}`, profile.avoid)
  const score = preferMatches.length * 2 - avoidMatches.length * 2 - cautionMatches.length
  const level = score >= 3
    ? '优先候选'
    : score >= 1
      ? '可备选'
      : '需人工复核'

  return {
    score,
    level,
    preferMatches,
    avoidMatches,
    cautionMatches
  }
}

const buildDateSelectionReviewRows = ({ candidates, constraints, days, profile, topCandidates }) => {
  const levelCounts = candidates.reduce((counts, candidate) => ({
    ...counts,
    [candidate.level]: (counts[candidate.level] || 0) + 1
  }), {
    优先候选: 0,
    可备选: 0,
    需人工复核: 0
  })
  const firstCandidate = topCandidates[0]

  return buildRows([
    ['复核方向', `${profile.label}：先按事项类型缩小日期，再结合现实限制、人员档期和执行条件复核。`],
    ['限制条件', constraints],
    ['候选分布', `${days} 天内：优先候选 ${levelCounts.优先候选} 天，可备选 ${levelCounts.可备选} 天，需人工复核 ${levelCounts.需人工复核} 天。`],
    ['优先复核', firstCandidate ? `${firstCandidate.date}：${firstCandidate.level}，日柱 ${firstCandidate.fields.eightChar.day}，冲 ${firstCandidate.fields.chong}。` : '暂无候选日期'],
    ['冲煞复核', '先排除与关键人员、地点或事项明显冲突的日期，再看宜忌命中。'],
    ['今日小动作', '把前 3 个候选日期发给相关人确认现实档期，并记录被排除的原因。'],
    ['后续复盘', '回看实际执行日期、临时变更、阻碍原因和结果反馈，用于校正下一次筛选。'],
    ['输出边界', '只做择日候选、日课字段和复核清单，不输出吉凶、结果保证或确定性判断。']
  ])
}

const calculateDateSelection = input => {
  const days = Math.max(1, Math.min(toInt(input.days, 7), 30))
  const profile = datePurposeProfiles[input.purpose] || datePurposeProfiles.general
  const topic = cleanPromptInput(input.topic, '未填写事项')
  const constraints = cleanPromptInput(input.constraints, '未填写限制条件。')
  const candidates = Array.from({ length: days }, (_, index) => {
    const date = addDays(input.startDate, index)
    const fields = getCalendarFields(date, input.time || '09:00')
    const candidate = scoreDateCandidate(fields, profile)

    return { date, fields, ...candidate }
  })
  const rows = candidates.map(candidate => [
    candidate.date,
    `${candidate.level} / ${candidate.fields.eightChar.day}日 / 宜：${candidate.fields.yi} / 忌：${candidate.fields.ji} / 冲：${candidate.fields.chong}`
  ])
  const topCandidateItems = [...candidates]
    .sort((left, right) => right.score - left.score || left.date.localeCompare(right.date))
    .slice(0, 5)
  const topCandidates = topCandidateItems.map(candidate => [
    candidate.date,
    [
      `${candidate.level}（匹配${candidate.score}分）`,
      `日柱 ${candidate.fields.eightChar.day}`,
      candidate.preferMatches.length ? `宜项命中：${candidate.preferMatches.join('、')}` : '宜项命中：-',
      candidate.avoidMatches.length ? `事项在忌项：${candidate.avoidMatches.join('、')}` : '事项在忌项：-',
      candidate.cautionMatches.length ? `通用避开项：${candidate.cautionMatches.join('、')}` : '通用避开项：-',
      `冲：${candidate.fields.chong}`
    ].join(' / ')
  ])
  const levelCounts = candidates.reduce((counts, candidate) => ({
    ...counts,
    [candidate.level]: (counts[candidate.level] || 0) + 1
  }), {
    优先候选: 0,
    可备选: 0,
    需人工复核: 0
  })
  const startFields = getCalendarFields(input.startDate, input.time || '09:00')

  return result({
    title: '择日候选记录',
    subtitle: `${topic} · ${profile.label} · ${input.startDate} 起 ${days} 天`,
    badges: [`${days}天`, profile.label, `优先${levelCounts.优先候选}天`, `起始日 ${startFields.eightChar.day}`],
    summary: `${topic} · ${input.startDate} 起 ${days} 天候选`,
    sections: [
      {
        title: '筛选信息',
        rows: buildRows([
          ['事项', topic],
          ['事项类型', profile.label],
          ['限制条件', constraints],
          ['起始日期', input.startDate],
          ['查询天数', `${days}天`],
          ['参考时间', input.time || '09:00'],
          ['筛选口径', '按事项类型提取宜/忌关键词，只作为候选缩小工具，不替代人工判断。']
        ])
      },
      {
        title: '候选日期',
        rows: buildRows(topCandidates)
      },
      {
        title: '日期清单',
        rows: buildRows(rows)
      },
      {
        title: '复核清单',
        rows: buildDateSelectionReviewRows({
          candidates,
          constraints,
          days,
          profile,
          topCandidates: topCandidateItems
        })
      },
      {
        title: '下一步入口',
        rows: buildRows([
          ['黄历日课记录', '打开单日黄历详情，核对节气、冲煞、四柱、纳音和宜忌原文。 /tools/calendar'],
          ['时辰候选记录', '选定日期后继续筛当天时辰候选、执行窗口和地支五行字段。 /tools/shichen'],
          ['每日行动记录', '把最终候选日放入当天行动记录，补执行窗口、个人生肖和复盘字段。 /tools/daily-fortune'],
          ['干支五行复核记录', '核对候选日干支、五行、藏干和生克资料口径。 /tools/wuxing']
        ])
      }
    ]
  })
}

const promptOptions = labels => Object.entries(labels).map(([value, label]) => ({ value, label }))

const cleanPromptInput = (value, fallback) => {
  const text = String(value || '').trim()
  return text || fallback
}

const compactTextLines = value => String(value || '')
  .split(/\r?\n/)
  .map(line => line.trim())
  .filter(Boolean)

const previewText = (value, fallback, maxLength = 120) => {
  const text = String(value || '').trim()
  if (!text) return fallback
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text
}

const dreamFocusProfiles = {
  symbols: {
    label: '意象整理',
    review: '把反复意象按场景、人物和情绪分组，先看是否来自近期接触内容。',
    action: '给每个意象写一个现实联想，不做单一象征解释。',
    observe: '下次记录同一意象出现前一天的睡眠、压力和信息输入。'
  },
  emotion: {
    label: '情绪线索',
    review: '先把醒来情绪和梦中情绪分开，再和现实压力逐项对照。',
    action: '今天只选一个可降低情绪负荷的小动作，例如沟通、整理或休息。',
    observe: '连续三次记录情绪强度，观察是否和睡眠质量或压力源同步变化。'
  },
  relation: {
    label: '人物关系',
    review: '只记录人物、互动和现实关系背景，不把梦中角色直接等同现实立场。',
    action: '如果需要处理关系，先写事实清单，再决定是否沟通。',
    observe: '后续观察同一人物是否反复出现，以及每次出现时的情绪差异。'
  },
  decision: {
    label: '现实议题',
    review: '把梦境材料当作压力和注意力线索，拆成已知事实、担心事项和待确认信息。',
    action: '把现实议题转成一个今天能验证的小问题，不用梦境直接替你做决定。',
    observe: '下次记录梦境前后是否出现同一选择、阻碍或回避动作。'
  },
  journal: {
    label: '梦境日志',
    review: '保持原始记录优先，先留存时间、睡眠、情绪和主要画面。',
    action: '用一段话复述梦境，不急着解释。',
    observe: '每周回看一次高频场景、人物、意象和睡眠状态。'
  }
}

const dreamFocusLabels = Object.fromEntries(Object.entries(dreamFocusProfiles).map(([key, profile]) => [key, profile.label]))

const dreamSleepQualityLabels = {
  poor: '睡眠差',
  light: '浅睡/易醒',
  normal: '一般',
  deep: '睡得较沉',
  mixed: '断续但有恢复'
}

const timeToMinutes = value => {
  const { hour, minute } = splitTime(value)
  return hour * 60 + minute
}

const formatDreamSleepSpan = (bedTime, wakeTime) => {
  if (!bedTime || !wakeTime) return '未填写'
  const start = timeToMinutes(bedTime)
  const end = timeToMinutes(wakeTime)
  const diff = end >= start ? end - start : end + 1440 - start
  if (diff <= 0) return '未计算'
  const hours = Math.floor(diff / 60)
  const minutes = diff % 60
  return minutes ? `${hours}小时${minutes}分` : `${hours}小时`
}

const buildDreamReviewRows = ({ profile, focus, intensity, symbolList, sleepQuality, sleepSpan }) => buildRows([
  ['复盘方向', `${focus}：${profile.review}`],
  ['睡眠线索', `${sleepQuality} / 睡眠时长 ${sleepSpan}，先和情绪强度 ${intensity}/5 对照。`],
  ['意象清单', symbolList.length ? symbolList.join(' / ') : '未填写，可先补 1-3 个最清晰的画面。'],
  ['今日小动作', profile.action],
  ['下次观察', profile.observe],
  ['输出边界', '只做梦境日志、睡眠背景和情绪材料整理，不输出吉凶、预兆、应期或结果判断。']
])

const buildDreamRecordText = input => {
  const focus = dreamFocusLabels[input.focus] || dreamFocusProfiles.symbols.label
  const sleepQuality = dreamSleepQualityLabels[input.sleepQuality] || dreamSleepQualityLabels.normal
  const title = cleanPromptInput(input.title, '未命名梦境')
  const dreamText = cleanPromptInput(input.dreamText, '未填写梦境全文。')
  const mood = cleanPromptInput(input.mood, '未填写醒来情绪。')
  const scene = cleanPromptInput(input.scene, '未填写主要场景。')
  const people = cleanPromptInput(input.people, '未填写人物/角色。')
  const symbols = cleanPromptInput(input.symbols, '未填写反复意象。')
  const realContext = cleanPromptInput(input.realContext, '无现实背景补充。')
  const stressors = cleanPromptInput(input.stressors, '未填写近期压力或触发因素。')
  const bodySignals = cleanPromptInput(input.bodySignals, '未填写身体感受。')

  return [
    '梦境日志工作台',
    `梦境标题：${title}`,
    `日期：${input.date || '未填写'}`,
    `就寝时间：${input.bedTime || '未填写'}`,
    `醒来时间：${input.wakeTime || '未填写'}`,
    `睡眠质量：${sleepQuality}`,
    `关注方向：${focus}`,
    `醒来情绪：${mood}`,
    `近期压力/触发因素：${stressors}`,
    `身体感受：${bodySignals}`,
    `主要场景：${scene}`,
    `人物/角色：${people}`,
    `反复意象：${symbols}`,
    `现实背景：${realContext}`,
    '',
    '梦境全文：',
    dreamText,
    '',
    '整理边界：',
    '只保存事实字段、情绪、场景、人物和意象，不输出吉凶、预兆、应期或结果判断。'
  ].join('\n')
}

const calculateDream = input => {
  const profile = dreamFocusProfiles[input.focus] || dreamFocusProfiles.symbols
  const focus = profile.label
  const title = cleanPromptInput(input.title, '未命名梦境')
  const date = input.date || '2026-07-04'
  const bedTime = input.bedTime || '23:30'
  const wakeTime = input.wakeTime || '07:30'
  const intensity = Math.max(1, Math.min(toInt(input.intensity, 3), 5))
  const sleepQuality = dreamSleepQualityLabels[input.sleepQuality] || dreamSleepQualityLabels.normal
  const sleepSpan = formatDreamSleepSpan(bedTime, wakeTime)
  const dreamLines = compactTextLines(input.dreamText)
  const symbolList = String(input.symbols || '').split(/[,，、\s]+/).map(item => item.trim()).filter(Boolean)
  const recordText = buildDreamRecordText(input)

  return result({
    title: '梦境日志工作台',
    subtitle: `${title} · ${date} ${wakeTime}`,
    badges: [focus, sleepQuality, `情绪强度 ${intensity}/5`, `${dreamLines.length} 行梦境`],
    summary: `${title} 梦境记录`,
    sections: [
      {
        title: '记录信息',
        rows: buildRows([
          ['标题', title],
          ['日期', date],
          ['就寝时间', bedTime],
          ['醒来时间', wakeTime],
          ['睡眠时长', sleepSpan],
          ['睡眠质量', sleepQuality],
          ['关注方向', focus]
        ])
      },
      {
        title: '睡眠背景',
        rows: buildRows([
          ['醒来情绪', input.mood || '未填写'],
          ['情绪强度', `${intensity}/5`],
          ['近期压力/触发因素', input.stressors || '未填写'],
          ['身体感受', input.bodySignals || '未填写'],
          ['现实背景', input.realContext || '无']
        ])
      },
      {
        title: '复盘清单',
        rows: buildDreamReviewRows({
          profile,
          focus,
          intensity,
          symbolList,
          sleepQuality,
          sleepSpan
        })
      },
      {
        title: '梦境素材',
        rows: buildRows([
          ['关注方向', focus],
          ['主要场景', input.scene || '未填写'],
          ['人物/角色', input.people || '未填写'],
          ['反复意象', symbolList.length ? symbolList.join(' / ') : '未填写'],
          ['梦境全文', previewText(input.dreamText, '未填写')]
        ])
      },
      {
        title: '梦境整理文本',
        rows: buildRows([
          ['记录文本', recordText]
        ])
      },
      {
        title: '下一步入口',
        rows: buildRows([
          ['每日行动记录', '把梦境暴露出的现实压力转成今日行动记录。 /tools/daily-fortune'],
          ['塔罗问题记录', '如果需要围绕一个现实问题做开放式记录，可继续拆成问题和背景。 /tools/tarot'],
          ['每日一卦记录', '如果已经形成明确事项，可单独留一条问事起卦记录。 /tools/daily']
        ])
      }
    ]
  })
}

export const structuredTools = {
  meihua: {
    title: '梅花问事记录',
    href: '/tools/meihua',
    kicker: 'Meihua Review',
    defaultInput: {
      topic: '今天适合推进什么？',
      context: '',
      focus: 'decision',
      method: 'numbers',
      date: '__today',
      time: '__now',
      upperNumber: '1',
      lowerNumber: '8',
      movingNumber: '6'
    },
    fields: [
      { key: 'topic', label: '事项', type: 'text' },
      { key: 'context', label: '背景材料', type: 'textarea', placeholder: '可记录已知事实、限制条件、候选方案和待确认信息。' },
      { key: 'focus', label: '关注方向', type: 'select', options: promptOptions(Object.fromEntries(Object.entries(meihuaFocusProfiles).map(([key, profile]) => [key, profile.label]))) },
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
    title: '姓名方案复核',
    href: '/tools/name',
    kicker: 'Name Review',
    defaultInput: {
      fullName: '刘鸡血',
      usage: 'baby',
      surnameLength: '1',
      strokes: '15 18 6',
      namingGoal: '希望名字好读、好写，含义积极但不过度堆砌。',
      meaningPreference: '',
      avoidNotes: ''
    },
    fields: [
      { key: 'fullName', label: '姓名', type: 'text' },
      { key: 'usage', label: '用途', type: 'select', options: promptOptions(Object.fromEntries(Object.entries(nameUsageProfiles).map(([key, profile]) => [key, profile.label]))) },
      { key: 'surnameLength', label: '姓氏字数', type: 'select', options: [{ value: '1', label: '单姓' }, { value: '2', label: '复姓' }] },
      { key: 'strokes', label: '逐字康熙笔画', type: 'text' },
      { key: 'namingGoal', label: '命名目标', type: 'textarea' },
      { key: 'meaningPreference', label: '含义/出处偏好', type: 'textarea', placeholder: '可记录希望靠近或避开的字义、典故、风格。' },
      { key: 'avoidNotes', label: '避讳/限制', type: 'textarea', placeholder: '可记录家族避讳、谐音、重名、行业或商标限制。' }
    ],
    calculate: calculateName
  },
  tarot: {
    title: '塔罗问题记录',
    href: '/tools/tarot',
    kicker: 'Tarot',
    defaultInput: { question: '这件事现在最该关注什么？', context: '', focus: 'decision', spread: 'three', date: '__today', time: '__now', seed: 'jixue' },
    fields: [
      { key: 'question', label: '问题', type: 'textarea' },
      { key: 'context', label: '背景材料', type: 'textarea', placeholder: '可记录已知事实、限制条件和暂不确定的信息。' },
      {
        key: 'focus',
        label: '关注方向',
        type: 'select',
        options: promptOptions(Object.fromEntries(Object.entries(tarotFocusProfiles).map(([key, profile]) => [key, profile.label]))),
        help: '用于生成问题拆解和复盘清单，不改变抽牌随机性之外的牌库。'
      },
      { key: 'spread', label: '牌阵', type: 'select', options: promptOptions(tarotSpreadLabels) },
      { key: 'date', label: '日期', type: 'date' },
      { key: 'time', label: '时间', type: 'time' },
      { key: 'seed', label: '抽牌种子', type: 'text' }
    ],
    calculate: calculateTarot
  },
  dream: {
    title: '梦境日志工作台',
    href: '/tools/dream',
    kicker: 'Dream Journal',
    defaultInput: {
      title: '醒来后印象最深的梦',
      date: '__today',
      bedTime: '23:30',
      wakeTime: '07:30',
      sleepQuality: 'normal',
      focus: 'symbols',
      mood: '复杂、清醒后仍有画面感',
      intensity: '3',
      scene: '',
      people: '',
      symbols: '',
      realContext: '',
      stressors: '',
      bodySignals: '',
      dreamText: ''
    },
    fields: [
      { key: 'title', label: '梦境标题', type: 'text' },
      { key: 'date', label: '日期', type: 'date' },
      { key: 'bedTime', label: '就寝时间', type: 'time' },
      { key: 'wakeTime', label: '醒来时间', type: 'time' },
      { key: 'sleepQuality', label: '睡眠质量', type: 'select', options: promptOptions(dreamSleepQualityLabels) },
      { key: 'focus', label: '关注方向', type: 'select', options: promptOptions(dreamFocusLabels) },
      { key: 'mood', label: '醒来情绪', type: 'text' },
      { key: 'intensity', label: '情绪强度 1-5', type: 'number' },
      { key: 'scene', label: '主要场景', type: 'textarea' },
      { key: 'people', label: '人物/角色', type: 'textarea' },
      { key: 'symbols', label: '反复意象', type: 'textarea' },
      { key: 'realContext', label: '现实背景', type: 'textarea', placeholder: '可记录近期事件、压力、关系或未完成事项。' },
      { key: 'stressors', label: '近期压力/触发因素', type: 'textarea' },
      { key: 'bodySignals', label: '身体感受', type: 'textarea', placeholder: '例如疲惫、心悸、头痛、饥饿、饮酒、运动后等。' },
      { key: 'dreamText', label: '梦境全文', type: 'textarea' }
    ],
    calculate: calculateDream
  },
  dailyFortune: {
    title: '每日行动记录',
    href: '/tools/daily-fortune',
    kicker: 'Daily Record',
    defaultInput: {
      topic: '今日安排',
      purpose: 'launch',
      constraints: '上午有会议，下午适合集中处理，避免临时改动太多。',
      actionWindow: '14:00-17:00',
      date: '__today',
      time: '__now',
      zodiac: '未选择'
    },
    fields: [
      { key: 'topic', label: '事项', type: 'text' },
      {
        key: 'purpose',
        label: '事项类型',
        type: 'select',
        options: calendarPurposeOptions,
        help: '用于匹配今日宜忌，结果只做复核清单。'
      },
      { key: 'constraints', label: '现实限制', type: 'textarea', placeholder: '可记录会议、人员档期、预算、地点、身体状态或不可做事项。' },
      { key: 'actionWindow', label: '执行窗口', type: 'text', placeholder: '例如 09:00-11:30 或 晚上沟通前。' },
      { key: 'date', label: '日期', type: 'date' },
      { key: 'time', label: '时间', type: 'time' },
      { key: 'zodiac', label: '个人生肖', type: 'select', options: ['未选择', '鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'].map(value => ({ value, label: value })) }
    ],
    calculate: calculateDailyFortune
  },
  qimen: {
    title: '奇门问事记录',
    href: '/tools/qimen',
    kicker: 'Qimen Review',
    defaultInput: { topic: '当前事项', context: '', focus: 'decision', date: '__today', time: '__now' },
    fields: [
      { key: 'topic', label: '事项', type: 'text' },
      { key: 'context', label: '背景材料', type: 'textarea', placeholder: '可记录已知事实、限制条件、相关方和待确认信息。' },
      { key: 'focus', label: '关注方向', type: 'select', options: promptOptions(Object.fromEntries(Object.entries(qimenFocusProfiles).map(([key, profile]) => [key, profile.label]))) },
      { key: 'date', label: '日期', type: 'date' },
      { key: 'time', label: '时间（按小时起局）', type: 'time' }
    ],
    calculate: calculateQimen
  },
  daliuren: {
    title: '大六壬问事记录',
    href: '/tools/daliuren',
    kicker: 'Liu Ren Review',
    defaultInput: { topic: '当前事项', context: '', focus: 'decision', date: '__today', time: '__now' },
    fields: [
      { key: 'topic', label: '事项', type: 'text' },
      { key: 'context', label: '背景材料', type: 'textarea', placeholder: '可记录已知事实、来源、时间线、相关方和待确认信息。' },
      { key: 'focus', label: '关注方向', type: 'select', options: promptOptions(Object.fromEntries(Object.entries(daliurenFocusProfiles).map(([key, profile]) => [key, profile.label]))) },
      { key: 'date', label: '日期', type: 'date' },
      { key: 'time', label: '占时', type: 'time' }
    ],
    calculate: calculateDaliuren
  },
  birthTime: {
    title: '出生校时工作台',
    href: '/tools/birth-time',
    kicker: 'Birth Time',
    defaultInput: { date: '1996-07-19', time: '23:30', birthPlace: '黑龙江省 黑河市 五大连池市', knownRange: 'within2', lifeClues: '' },
    fields: [
      { key: 'date', label: '出生日期', type: 'date' },
      { key: 'time', label: '参考时间', type: 'time' },
      { key: 'birthPlace', label: '出生地', type: 'text' },
      {
        key: 'knownRange',
        label: '时间可信度',
        type: 'select',
        options: Object.entries(birthTimeRangeProfiles).map(([value, label]) => ({ value, label })),
        help: '用于标记出生时间来源的粗细，不会自动判定唯一时辰。'
      },
      { key: 'lifeClues', label: '校时线索', type: 'textarea', placeholder: '可记录家人说法、出生证、重大年份或待核对事项。' }
    ],
    calculate: calculateBirthTime
  },
  findTime: {
    title: '寻时定盘工作台',
    href: '/tools/find-time',
    kicker: 'Find Time',
    defaultInput: { date: '1996-07-19', topic: '出生时辰候选', focus: 'all' },
    fields: [
      { key: 'date', label: '日期', type: 'date' },
      { key: 'topic', label: '用途', type: 'text' },
      {
        key: 'focus',
        label: '关注时段',
        type: 'select',
        options: Object.entries(findTimeFocusProfiles).map(([value, profile]) => ({ value, label: profile.label })),
        help: '用于突出重点候选，全表仍会完整保留。'
      }
    ],
    calculate: calculateFindTime
  },
  dateSelection: {
    title: '择日候选记录',
    href: '/tools/date-selection',
    kicker: 'Date Review',
    defaultInput: {
      topic: '上线发布',
      purpose: 'launch',
      constraints: '避开周末，优先工作日上午，需提前一天完成准备。',
      startDate: '__today',
      days: '7',
      time: '09:00'
    },
    fields: [
      { key: 'topic', label: '事项', type: 'text' },
      {
        key: 'purpose',
        label: '事项类型',
        type: 'select',
        options: [
          { value: 'launch', label: '上线发布' },
          { value: 'signing', label: '签约谈事' },
          { value: 'move', label: '搬家入宅' },
          { value: 'travel', label: '出行办事' },
          { value: 'ceremony', label: '婚嫁仪式' },
          { value: 'repair', label: '装修动工' },
          { value: 'general', label: '综合筛选' }
        ],
        help: '用于提取对应宜忌关键词，结果只做候选缩小。'
      },
      { key: 'constraints', label: '限制条件', type: 'textarea', placeholder: '可记录人员档期、地点、准备周期、预算或不可选日期。' },
      { key: 'startDate', label: '起始日期', type: 'date' },
      { key: 'days', label: '天数', type: 'number' },
      { key: 'time', label: '参考时间', type: 'time' }
    ],
    calculate: calculateDateSelection
  }
}

export const getStructuredTool = slug => structuredTools[slug]
export const formatStructuredResultText = formatResultText
