import { recordToolEvent } from './liujixue-api.js'

const visitorStorageKey = 'liujixue_xuan_visitor_id'
const sessionStorageKey = 'liujixue_xuan_session_id'

export function buildChartDownloadEvent({ payload = {}, location = '', browser = getBrowser() } = {}) {
  const toolCode = normalizeToolCode(payload.toolCode || location || 'chart')

  return {
    eventType: 'chart_image_download',
    toolCode,
    sourceSite: 'xuan',
    sourcePath: normalizeSourcePath(browser?.location?.pathname),
    visitorId: getBrowserId(browser?.localStorage, visitorStorageKey, 'visitor'),
    metadata: {
      title: limitText(payload.title || toolCode, 80),
      location: limitText(location || toolCode, 80),
      imageKind: limitText(payload.imageKind || 'standard', 40),
      badgeCount: Array.isArray(payload.badges) ? payload.badges.length : 0,
      sectionCount: Array.isArray(payload.sections) ? payload.sections.length : 0,
      hasFooter: Boolean(payload.footer),
      pageTitle: limitText(browser?.document?.title || '', 120),
      sessionId: getBrowserId(browser?.sessionStorage, sessionStorageKey, 'session')
    }
  }
}

export function recordChartDownloadEvent(options) {
  return recordToolEvent(buildChartDownloadEvent(options))
}

function getBrowser() {
  return typeof window === 'undefined' ? null : window
}

function getBrowserId(storage, key, prefix) {
  const nextId = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

  if (!storage) return nextId

  try {
    const existing = storage.getItem(key)
    if (existing) return existing
    storage.setItem(key, nextId)
  } catch {
    return nextId
  }

  return nextId
}

function normalizeToolCode(value) {
  const normalized = String(value || '').trim().slice(0, 80)
  return normalized || 'chart'
}

function normalizeSourcePath(value) {
  const normalized = String(value || '').trim()
  return normalized.slice(0, 255)
}

function limitText(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength)
}
