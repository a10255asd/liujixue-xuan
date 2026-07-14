import assert from 'node:assert/strict'
import test from 'node:test'
import { buildChartDownloadEvent } from '../lib/tool-event-tracking.js'

test('chart download event records stable operational fields only', () => {
  const browser = createBrowser()
  const event = buildChartDownloadEvent({
    location: 'bazi-fine-chart',
    browser,
    payload: {
      toolCode: 'bazi',
      imageKind: 'baziFine',
      title: '八字专业细盘',
      subtitle: '1996-07-19 23:30 公历/阳历 · 男 · 黑龙江省 黑河市',
      filename: 'bazi-chart-19960719-2330.png',
      badges: ['四柱 丙子 乙未 戊午 壬子'],
      sections: [{ title: '核心字段', rows: [] }, { title: '专业细盘', rows: [] }],
      footer: 'Jixue Lab'
    }
  })

  assert.equal(event.eventType, 'chart_image_download')
  assert.equal(event.toolCode, 'bazi')
  assert.equal(event.sourceSite, 'xuan')
  assert.equal(event.sourcePath, '/tools/bazi')
  assert.match(event.visitorId, /^visitor-/)
  assert.equal(event.metadata.title, '八字专业细盘')
  assert.equal(event.metadata.location, 'bazi-fine-chart')
  assert.equal(event.metadata.imageKind, 'baziFine')
  assert.equal(event.metadata.badgeCount, 1)
  assert.equal(event.metadata.sectionCount, 2)
  assert.equal(event.metadata.hasFooter, true)
  assert.equal(event.metadata.pageTitle, '鸡血玄策 - 八字')
  assert.match(event.metadata.sessionId, /^session-/)
  assert.equal(Object.hasOwn(event.metadata, 'subtitle'), false)
  assert.equal(Object.hasOwn(event.metadata, 'filename'), false)
})

test('chart download event reuses visitor and session ids', () => {
  const browser = createBrowser()
  const first = buildChartDownloadEvent({ payload: { toolCode: 'ziwei', title: '紫微斗数专业盘' }, browser })
  const second = buildChartDownloadEvent({ payload: { toolCode: 'ziwei', title: '紫微斗数专业盘' }, browser })

  assert.equal(second.visitorId, first.visitorId)
  assert.equal(second.metadata.sessionId, first.metadata.sessionId)
})

test('chart download event falls back to location when payload has no tool code', () => {
  const event = buildChartDownloadEvent({
    location: 'calendar',
    browser: createBrowser('/tools/calendar'),
    payload: {
      title: '黄历节气',
      sections: []
    }
  })

  assert.equal(event.toolCode, 'calendar')
  assert.equal(event.sourcePath, '/tools/calendar')
  assert.equal(event.metadata.imageKind, 'standard')
})

function createBrowser(pathname = '/tools/bazi') {
  return {
    document: {
      title: '鸡血玄策 - 八字'
    },
    location: {
      pathname
    },
    localStorage: createStorage(),
    sessionStorage: createStorage()
  }
}

function createStorage() {
  const data = new Map()

  return {
    getItem(key) {
      return data.get(key) || null
    },
    setItem(key, value) {
      data.set(key, value)
    }
  }
}
