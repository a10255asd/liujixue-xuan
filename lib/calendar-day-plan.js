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
      { label: '看每日字段', href: '/tools/daily-fortune', text: '补充日柱、方位和个人生肖字段。' }
    ]
  }
}
