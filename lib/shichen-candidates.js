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

const scoreShichen = (row, profile, dayBranch) => {
  const clashBranch = branchClashMap[dayBranch] || ''
  const preferred = profile.prefer.includes(row.branch)
  const avoided = profile.avoid.includes(row.branch)
  const practical = isPracticalPeriod(row.period)
  const clashesDay = row.branch === clashBranch
  const score = (preferred ? 2 : 0) + (practical ? 1 : 0) - (avoided ? 2 : 0) - (clashesDay ? 2 : 0)
  const level = score >= 3
    ? '优先时段'
    : score >= 1
      ? '可备选'
      : '需复核'
  const reasons = [
    preferred ? `${profile.label}偏好` : '',
    practical ? '便于执行' : ''
  ].filter(Boolean)
  const cautions = [
    avoided ? '事项避开' : '',
    clashesDay ? `冲日支${dayBranch}` : ''
  ].filter(Boolean)

  return {
    ...row,
    score,
    level,
    reasons,
    cautions,
    reasonText: reasons.length ? reasons.join('、') : '常规时段',
    cautionText: cautions.length ? cautions.join('、') : '-'
  }
}

export const buildShichenCandidates = ({ date = '2026-07-02', purpose = 'general' } = {}) => {
  const profile = shichenPurposeProfiles[purpose] || shichenPurposeProfiles.general
  const dayBranch = getShichenDayBranch(date)
  const clashBranch = branchClashMap[dayBranch] || ''
  const candidates = shichenRows.map(row => scoreShichen(row, profile, dayBranch))
  const topCandidates = [...candidates]
    .sort((left, right) => right.score - left.score || left.startHour - right.startHour)
    .slice(0, 4)

  return {
    profile,
    dayBranch,
    clashBranch,
    candidates,
    topCandidates
  }
}
