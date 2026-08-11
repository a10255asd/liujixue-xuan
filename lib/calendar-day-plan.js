export const calendarPurposeProfiles = {
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

export const calendarPurposeOptions = Object.entries(calendarPurposeProfiles).map(([value, profile]) => ({
  value,
  label: profile.label
}))

const splitAlmanacItems = value => String(value || '')
  .split(/[、，,\s]+/)
  .map(item => item.trim())
  .filter(Boolean)
  .filter(item => item !== '-')

const matchedItems = (text, keywords) => {
  const items = splitAlmanacItems(text)
  const matches = keywords.filter(keyword => items.some(item => item.includes(keyword)))

  return [...new Set(matches)]
}

const planLevel = score => {
  if (score >= 3) return '适合推进'
  if (score >= 1) return '可做备选'
  return '需要复核'
}

const buildAdvice = ({ level, profile, preferMatches, blockedMatches, cautionMatches }) => {
  if (level === '适合推进') return `${profile.label}命中宜项较多，可继续筛当天时辰并保存字段。`
  if (blockedMatches.length) return `${profile.label}在忌项中有命中，建议换日或拉长日期范围比较。`
  if (cautionMatches.length) return '存在通用避开项，建议结合具体执行条件人工复核。'
  if (preferMatches.length) return '有少量宜项命中，可作为备选日继续核对。'
  return '未命中明确宜项，适合只做资料留档或继续比较邻近日期。'
}

export const buildCalendarDayPlan = (calendar, purpose = 'general') => {
  const profile = calendarPurposeProfiles[purpose] || calendarPurposeProfiles.general
  const preferMatches = matchedItems(calendar.yi, profile.prefer)
  const blockedMatches = matchedItems(calendar.ji, profile.prefer)
  const cautionMatches = matchedItems(`${calendar.yi} ${calendar.ji}`, profile.avoid)
  const score = preferMatches.length * 2 - blockedMatches.length * 2 - cautionMatches.length
  const level = planLevel(score)

  return {
    profile,
    score,
    level,
    preferMatches,
    blockedMatches,
    cautionMatches,
    advice: buildAdvice({ level, profile, preferMatches, blockedMatches, cautionMatches }),
    rows: [
      { label: '宜项命中', value: preferMatches.length ? preferMatches.join('、') : '-' },
      { label: '事项在忌项', value: blockedMatches.length ? blockedMatches.join('、') : '-' },
      { label: '通用避开项', value: cautionMatches.length ? cautionMatches.join('、') : '-' },
      { label: '冲煞复核', value: `${calendar.chong || '-'} / ${calendar.sha || '-'}` }
    ],
    nextSteps: [
      { label: '筛当天时辰', href: '/tools/shichen', text: '把日期固定后继续缩小时段。' },
      { label: '比较邻近日期', href: '/tools/date-selection', text: '把同一事项放进日期范围里横向比较。' },
      { label: '看每日行动记录', href: '/tools/daily-fortune', text: '补充执行窗口、日柱、方位和个人生肖复核。' }
    ]
  }
}

const cleanRecordText = (value, fallback) => {
  const text = String(value || '').trim()

  return text || fallback
}

const formatPositions = positions => {
  if (!positions || typeof positions !== 'object') return '-'

  return `喜神${positions.xi || '-'} / 福神${positions.fu || '-'} / 财神${positions.cai || '-'}`
}

export const buildCalendarReviewRows = ({ calendar, dayPlan, topic, constraints } = {}) => {
  const recordTopic = cleanRecordText(topic, '未填写事项')
  const recordConstraints = cleanRecordText(constraints, '未填写现实限制。')
  const previousJieQi = calendar?.jieQi?.previous || '-'
  const nextJieQi = calendar?.jieQi?.next || '-'

  return [
    { label: '记录事项', value: recordTopic },
    { label: '现实限制', value: recordConstraints },
    { label: '日课判断', value: `${dayPlan?.profile?.label || '综合筛选'}：${dayPlan?.level || '需要复核'}（${dayPlan?.score ?? 0}分）。${dayPlan?.advice || ''}` },
    { label: '冲煞复核', value: `${calendar?.chong || '-'} / ${calendar?.sha || '-'}，涉及关键人员生肖、地点或方向时先单独核对。` },
    { label: '节气复核', value: `上一节气：${previousJieQi}；下一节气：${nextJieQi}。` },
    { label: '方位复核', value: formatPositions(calendar?.positions) },
    { label: '今日小动作', value: `围绕「${recordTopic}」先确认必须执行、可延期和不可做的事项。` },
    { label: '后续复盘', value: '记录实际执行时间、参与人、临时变更、被排除原因和下次需要提前确认的限制。' },
    { label: '输出边界', value: '只做黄历日课记录、宜忌字段和复核清单，不输出吉凶、结果保证或确定性判断。' }
  ]
}
