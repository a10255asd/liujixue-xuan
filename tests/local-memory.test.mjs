import assert from 'node:assert/strict'
import test from 'node:test'
import { mergeMemoryFavorites, mergeMemoryRecords } from '../lib/local-memory.js'

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
