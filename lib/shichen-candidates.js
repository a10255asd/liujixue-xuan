import { Solar } from 'lunar-javascript'

export const shichenRows = [
  { branch: '子', range: '23:00-00:59', name: '夜半', element: '水', animal: '鼠', period: '夜', startHour: 23 },
  { branch: '丑', range: '01:00-02:59', name: '鸡鸣', element: '土', animal: '牛', period: '夜', startHour: 1 },
  { branch: '寅', range: '03:00-04:59', name: '平旦', element: '木', animal: '虎', period: '晨', startHour: 3 },
  { branch: '卯', range: '05:00-06:59', name: '日出', element: '木', animal: '兔', period: '晨', startHour: 5 },
  { branch: '辰', range: '07:00-08:59', name: '食时', element: '土', animal: '龙', period: '晨', startHour: 7 },
  { branch: '巳', range: '09:00-10:59', name: '隅中', element: '火', animal: '蛇', period: '昼', startHour: 9 },
  { branch: '午', range: '11:00-12:59', name: '日中', element: '火', animal: '马', period: '昼', startHour: 11 },
  { branch: '未', range: '13:00-14:59', name: '日昳', element: '土', animal: '羊', period: '昼', startHour: 13 },
  { branch: '申', range: '15:00-16:59', name: '晡时', element: '金', animal: '猴', period: '夕', startHour: 15 },
  { branch: '酉', range: '17:00-18:59', name: '日入', element: '金', animal: '鸡', period: '夕', startHour: 17 },
  { branch: '戌', range: '19:00-20:59', name: '黄昏', element: '土', animal: '狗', period: '夜', startHour: 19 },
  { branch: '亥', range: '21:00-22:59', name: '人定', element: '水', animal: '猪', period: '夜', startHour: 21 }
]

export const shichenPurposeProfiles = {
  launch: {
    label: '上线发布',
    prefer: ['辰', '巳', '午', '申', '酉'],
    avoid: ['子', '丑', '亥']
  },
  signing: {
    label: '签约谈事',
    prefer: ['巳', '午', '申', '酉'],
    avoid: ['子', '丑', '亥']
  },
  move: {
    label: '搬家入宅',
    prefer: ['辰', '巳', '午', '未'],
    avoid: ['子', '亥']
  },
  travel: {
    label: '出行办事',
    prefer: ['卯', '辰', '巳', '申'],
    avoid: ['子', '丑', '亥']
  },
  ceremony: {
    label: '婚嫁仪式',
    prefer: ['巳', '午', '未', '酉'],
    avoid: ['子', '丑', '亥']
  },
  repair: {
    label: '装修动工',
    prefer: ['辰', '巳', '午', '未', '申'],
    avoid: ['子', '亥']
  },
  general: {
    label: '综合筛选',
    prefer: ['辰', '巳', '午', '申', '酉'],
    avoid: ['子', '丑', '亥']
  }
}

export const shichenPurposeOptions = Object.entries(shichenPurposeProfiles).map(([value, profile]) => ({
  value,
  label: profile.label
}))

const branchClashMap = {
  子: '午',
  丑: '未',
  寅: '申',
  卯: '酉',
  辰: '戌',
  巳: '亥',
  午: '子',
  未: '丑',
  申: '寅',
  酉: '卯',
  戌: '辰',
  亥: '巳'
}

const splitDate = value => {
  const [year, month, day] = String(value || '').split('-').map(part => Number.parseInt(part, 10))

  return {
    year: Number.isFinite(year) ? year : 2026,
    month: Number.isFinite(month) ? month : 1,
    day: Number.isFinite(day) ? day : 1
  }
}

export const getShichenDayBranch = date => {
  const { year, month, day } = splitDate(date)
  const solar = Solar.fromYmd(year, month, day)

  return solar.getLunar().getEightChar().getDayZhi()
}

const isPracticalPeriod = period => period === '晨' || period === '昼' || period === '夕'

const parseClockMinutes = (hourValue, minuteValue = '0') => {
  const hour = Number.parseInt(hourValue, 10)
  const minute = Number.parseInt(minuteValue, 10)

  if (!Number.isFinite(hour) || hour < 0 || hour > 23 || !Number.isFinite(minute) || minute < 0 || minute > 59) return null

  return hour * 60 + minute
}

export const parseShichenActionWindow = value => {
  const raw = String(value || '').trim()

  if (!raw) return null

  const clockRange = raw.match(/(\d{1,2})(?::(\d{2}))?\s*(?:-|~|至|到)\s*(\d{1,2})(?::(\d{2}))?/)
  if (clockRange) {
    const start = parseClockMinutes(clockRange[1], clockRange[2])
    const end = parseClockMinutes(clockRange[3], clockRange[4])

    if (start !== null && end !== null && start !== end) {
      const normalizedEnd = end > start ? end : end + 24 * 60

      return {
        label: `${clockRange[1].padStart(2, '0')}:${clockRange[2] || '00'}-${clockRange[3].padStart(2, '0')}:${clockRange[4] || '00'}`,
        segments: [[start, normalizedEnd], [start + 24 * 60, normalizedEnd + 24 * 60]]
      }
    }
  }

  const presets = [
    { keywords: ['清晨', '早上', '上午'], label: '上午窗口', start: 7 * 60, end: 12 * 60 },
    { keywords: ['中午', '午间'], label: '午间窗口', start: 11 * 60, end: 13 * 60 },
    { keywords: ['下午', '午后'], label: '下午窗口', start: 13 * 60, end: 18 * 60 },
    { keywords: ['傍晚', '黄昏'], label: '傍晚窗口', start: 17 * 60, end: 21 * 60 },
    { keywords: ['晚上', '夜间'], label: '夜间窗口', start: 19 * 60, end: 23 * 60 }
  ]
  const preset = presets.find(item => item.keywords.some(keyword => raw.includes(keyword)))

  if (!preset) return null

  return {
    label: preset.label,
    segments: [[preset.start, preset.end], [preset.start + 24 * 60, preset.end + 24 * 60]]
  }
}

const rowSegments = row => {
  const start = row.startHour * 60
  const end = start + 120

  return [[start, end], [start + 24 * 60, end + 24 * 60]]
}

const segmentsOverlap = (left, right) => Math.max(left[0], right[0]) < Math.min(left[1], right[1])

const overlapsActionWindow = (row, actionWindow) => Boolean(actionWindow) && rowSegments(row)
  .some(rowSegment => actionWindow.segments.some(windowSegment => segmentsOverlap(rowSegment, windowSegment)))

const scoreShichen = (row, profile, dayBranch, actionWindow) => {
  const clashBranch = branchClashMap[dayBranch] || ''
  const preferred = profile.prefer.includes(row.branch)
  const avoided = profile.avoid.includes(row.branch)
  const practical = isPracticalPeriod(row.period)
  const clashesDay = row.branch === clashBranch
  const inActionWindow = overlapsActionWindow(row, actionWindow)
  const score = (preferred ? 2 : 0) +
    (practical ? 1 : 0) +
    (inActionWindow ? 2 : actionWindow ? -1 : 0) -
    (avoided ? 2 : 0) -
    (clashesDay ? 2 : 0)
  const level = score >= 3
    ? '优先时段'
    : score >= 1
      ? '可备选'
      : '需复核'
  const reasons = [
    preferred ? `${profile.label}偏好` : '',
    practical ? '便于执行' : '',
    inActionWindow ? '执行窗口内' : ''
  ].filter(Boolean)
  const cautions = [
    avoided ? '事项避开' : '',
    clashesDay ? `冲日支${dayBranch}` : '',
    actionWindow && !inActionWindow ? '不在执行窗口' : ''
  ].filter(Boolean)

  return {
    ...row,
    score,
    level,
    reasons,
    cautions,
    reasonText: reasons.length ? reasons.join('、') : '常规时段',
    cautionText: cautions.length ? cautions.join('、') : '-',
    windowText: actionWindow
      ? inActionWindow ? `${actionWindow.label}内` : `${actionWindow.label}外`
      : '未填写执行窗口',
    inActionWindow
  }
}

export const buildShichenCandidates = ({ date = '2026-07-02', purpose = 'general', actionWindow = '' } = {}) => {
  const profile = shichenPurposeProfiles[purpose] || shichenPurposeProfiles.general
  const parsedActionWindow = parseShichenActionWindow(actionWindow)
  const dayBranch = getShichenDayBranch(date)
  const clashBranch = branchClashMap[dayBranch] || ''
  const candidates = shichenRows.map(row => scoreShichen(row, profile, dayBranch, parsedActionWindow))
  const topCandidates = [...candidates]
    .sort((left, right) => parsedActionWindow
      ? Number(right.inActionWindow) - Number(left.inActionWindow) || right.score - left.score || left.startHour - right.startHour
      : right.score - left.score || left.startHour - right.startHour)
    .slice(0, 4)
  const levelCounts = candidates.reduce((counts, candidate) => ({
    ...counts,
    [candidate.level]: (counts[candidate.level] || 0) + 1
  }), {
    优先时段: 0,
    可备选: 0,
    需复核: 0
  })

  return {
    profile,
    actionWindow: parsedActionWindow,
    dayBranch,
    clashBranch,
    candidates,
    topCandidates,
    levelCounts
  }
}
