export const recordsKey = 'jixue-xuan-tool-records'
export const favoritesKey = 'jixue-xuan-favorite-tools'
export const handoffKey = 'jixue-xuan-tool-handoff'

const canUseStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage)

export const readMemory = (key, fallback) => {
  if (!canUseStorage()) return fallback

  try {
    return JSON.parse(window.localStorage.getItem(key) || JSON.stringify(fallback))
  } catch {
    return fallback
  }
}

export const writeMemory = (key, value) => {
  if (!canUseStorage()) return
  window.localStorage.setItem(key, JSON.stringify(value))
}

export const removeMemory = key => {
  if (!canUseStorage()) return
  window.localStorage.removeItem(key)
}

export const createMemoryRecord = ({ href, text, title, tool }) => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  tool,
  href,
  title,
  text,
  createdAt: new Date().toISOString()
})

export const saveMemoryRecord = input => {
  const records = readMemory(recordsKey, [])
  const record = createMemoryRecord(input)
  const next = [record, ...records].slice(0, 120)
  writeMemory(recordsKey, next)
  return record
}

export const mergeMemoryRecords = (current, incoming) => {
  const byId = new Map()

  for (const record of [...incoming, ...current]) {
    if (!record?.id || !record?.text) continue
    byId.set(record.id, {
      id: String(record.id),
      tool: String(record.tool || '未知工具'),
      href: String(record.href || '/tools'),
      title: String(record.title || record.tool || '未命名记录'),
      text: String(record.text),
      createdAt: String(record.createdAt || new Date().toISOString())
    })
  }

  return [...byId.values()]
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .slice(0, 200)
}

export const mergeMemoryFavorites = (current, incoming) => {
  const byHref = new Map()

  for (const item of [...incoming, ...current]) {
    if (!item?.href) continue
    byHref.set(item.href, {
      title: String(item.title || item.href),
      href: String(item.href),
      addedAt: String(item.addedAt || new Date().toISOString())
    })
  }

  return [...byHref.values()]
}

export const createToolHandoff = ({ record, slot, targetHref, targetSlug }) => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  targetHref,
  targetSlug,
  slot,
  sourceId: String(record?.id || ''),
  sourceTool: String(record?.tool || '未知工具'),
  sourceHref: String(record?.href || '/tools'),
  sourceTitle: String(record?.title || record?.tool || '未命名记录'),
  text: String(record?.text || ''),
  createdAt: new Date().toISOString()
})

const compactRecordLines = value => String(value || '')
  .split(/\r?\n/)
  .map(line => line.trim())
  .filter(Boolean)

const boundaryLinePattern = /^(来源与边界|说明：|输出要求|请严格遵守：|排盘口径：|-?\s*(只输出|不输出|不做|如果字段|字段不足|明确区分|以辅助理解|后续分析))/

const keyFieldPattern = /^(输入|出生地|时间口径|排盘用时间|农历|四柱|日主|命宫|身宫|胎元|胎息|起运|事项|时间|起卦方式|起卦推导|干支|旬空|月建\/日辰|辅助神煞|本卦|变卦|世应|动爻|公历|宜|忌|节气|牌阵|抽牌|主题|关注方向|姓名|结果|五行局|命主|身主)：/

export const getMemoryRecordPreview = (record, options = {}) => {
  const maxLines = Math.max(1, Number(options.maxLines) || 5)
  const lines = compactRecordLines(record?.text)
  const contentLines = lines.filter(line => !boundaryLinePattern.test(line))
  const keyLines = contentLines.filter(line => keyFieldPattern.test(line))
  const previewLines = [...new Set([...keyLines, ...contentLines])].slice(0, maxLines)

  return {
    lines: previewLines,
    totalLines: lines.length,
    hiddenLines: Math.max(0, lines.length - previewLines.length)
  }
}

export const getMemoryRecordWorkflow = record => {
  const text = `${record?.tool || ''} ${record?.title || ''} ${record?.text || ''}`

  if (/八字|紫微|四柱|出生地|命宫|身宫|五行局|校时|寻时|姓名/.test(text)) {
    return {
      category: 'birth',
      categoryLabel: '出生盘',
      title: '优先做合参或合盘',
      summary: '这类记录适合先进入合参；需要两个人对照时，再填入合盘 A / B。',
      primaryAction: 'synthesis'
    }
  }

  if (/六爻|梅花|奇门|六壬|每日一卦|本卦|变卦|世应|动爻|三传|四课/.test(text)) {
    return {
      category: 'question',
      categoryLabel: '问事盘',
      title: '优先补问题背景',
      summary: '问事记录更依赖事项背景，建议送去 AI 生成核验清单，或放入合参与其他材料对照。',
      primaryAction: 'aiPrompt'
    }
  }

  if (/塔罗|牌阵|抽牌|逆位|正位/.test(text)) {
    return {
      category: 'tarot',
      categoryLabel: '塔罗',
      title: '优先进入合参',
      summary: '塔罗记录适合作为补充材料，和问事盘、背景说明一起整理。',
      primaryAction: 'synthesis'
    }
  }

  if (/黄历|择日|节气|宜：|忌：|日课|冲煞|星宿/.test(text)) {
    return {
      category: 'calendar',
      categoryLabel: '日课',
      title: '优先对齐时间口径',
      summary: '日课记录适合作为时间字段补充，建议进入合参后和事项、问事盘一起看。',
      primaryAction: 'synthesis'
    }
  }

  if (/梦境|梦境记录|梦/.test(text)) {
    return {
      category: 'dream',
      categoryLabel: '梦境',
      title: '优先做材料整理',
      summary: '梦境记录适合先送去 AI 做素材归类，再决定是否和其他记录合参。',
      primaryAction: 'aiPrompt'
    }
  }

  return {
    category: 'other',
    categoryLabel: '记录',
    title: '优先送去 AI 整理',
    summary: '先把字段整理成摘要、缺失项和待核验点，再决定是否进入合参或合盘。',
    primaryAction: 'aiPrompt'
  }
}
