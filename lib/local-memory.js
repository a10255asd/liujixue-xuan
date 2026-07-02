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
