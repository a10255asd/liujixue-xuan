import assert from 'node:assert/strict'
import test from 'node:test'
import { createToolHandoff, mergeMemoryFavorites, mergeMemoryRecords } from '../lib/local-memory.js'

test('local memory records merge by id, keep local duplicate, and sort newest first', () => {
  const current = [
    { id: 'old', tool: '八字', href: '/tools/bazi', title: '旧记录', text: '旧文本', createdAt: '2026-07-01T00:00:00.000Z' }
  ]
  const incoming = [
    { id: 'new', tool: '梅花', href: '/tools/meihua', title: '新记录', text: '新文本', createdAt: '2026-07-02T00:00:00.000Z' },
    { id: 'old', tool: '八字', href: '/tools/bazi', title: '覆盖记录', text: '覆盖文本', createdAt: '2026-07-03T00:00:00.000Z' }
  ]

  const merged = mergeMemoryRecords(current, incoming)

  assert.equal(merged.length, 2)
  assert.equal(merged[0].id, 'new')
  assert.equal(merged[1].id, 'old')
  assert.equal(merged[1].title, '旧记录')
})

test('local memory favorites merge by href', () => {
  const merged = mergeMemoryFavorites(
    [{ title: '八字', href: '/tools/bazi', addedAt: '2026-07-01T00:00:00.000Z' }],
    [
      { title: '八字新名', href: '/tools/bazi', addedAt: '2026-07-02T00:00:00.000Z' },
      { title: '六爻', href: '/tools/liuyao', addedAt: '2026-07-02T00:00:00.000Z' }
    ]
  )

  assert.equal(merged.length, 2)
  assert.equal(merged.find(item => item.href === '/tools/bazi').title, '八字')
  assert.equal(merged.find(item => item.href === '/tools/liuyao').title, '六爻')
})

test('tool handoff preserves target slot and source record text', () => {
  const handoff = createToolHandoff({
    targetHref: '/tools/compatibility',
    targetSlug: 'compatibility',
    slot: 'chartB',
    record: {
      id: 'record-1',
      tool: '八字专业细盘',
      href: '/tools/bazi',
      title: '甲方八字',
      text: '四柱：甲子 乙丑 丙寅 丁卯'
    }
  })

  assert.equal(handoff.targetHref, '/tools/compatibility')
  assert.equal(handoff.targetSlug, 'compatibility')
  assert.equal(handoff.slot, 'chartB')
  assert.equal(handoff.sourceTool, '八字专业细盘')
  assert.equal(handoff.sourceTitle, '甲方八字')
  assert.equal(handoff.text, '四柱：甲子 乙丑 丙寅 丁卯')
})
