import assert from 'node:assert/strict'
import test from 'node:test'
import {
  createToolHandoff,
  filterMemoryRecordsForTarget,
  getMemoryRecordPreview,
  getMemoryRecordSlotSuggestion,
  getMemoryRecordWorkflow,
  getMemorySaveFeedback,
  getMemoryStorageStatus,
  mergeMemoryFavorites,
  mergeMemoryRecords,
  readMemory,
  recordsKey,
  removeMemory,
  saveMemoryRecord,
  writeMemory
} from '../lib/local-memory.js'

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

test('local memory falls back to page session storage when localStorage is unavailable', () => {
  const previousWindow = globalThis.window
  globalThis.window = {}

  try {
    assert.equal(getMemoryStorageStatus().mode, 'session')
    assert.equal(writeMemory('fallback-key', [{ title: '临时记录' }]), true)
    assert.deepEqual(readMemory('fallback-key', []), [{ title: '临时记录' }])

    const record = saveMemoryRecord({
      tool: '六爻纳甲排盘',
      href: '/tools/liuyao',
      title: '问事记录',
      text: '本卦：泽雷随'
    })
    const records = readMemory(recordsKey, [])

    assert.equal(record.tool, '六爻纳甲排盘')
    assert.equal(record.storageMode, 'session')
    assert.equal(getMemorySaveFeedback(record).label, '临时保存')
    assert.match(getMemorySaveFeedback(record).description, /导出 JSON/)
    assert.equal(records.length, 1)
    assert.equal(records[0].text, '本卦：泽雷随')
    assert.equal(removeMemory(recordsKey), true)
    assert.deepEqual(readMemory(recordsKey, []), [])
  } finally {
    if (previousWindow === undefined) {
      delete globalThis.window
    } else {
      globalThis.window = previousWindow
    }
  }
})

test('local memory reports persistent browser storage when localStorage works', () => {
  const previousWindow = globalThis.window
  const store = new Map()
  globalThis.window = {
    localStorage: {
      getItem: key => store.get(key) || null,
      removeItem: key => store.delete(key),
      setItem: (key, value) => store.set(key, String(value))
    }
  }

  try {
    assert.equal(getMemoryStorageStatus().mode, 'local')

    const input = {
      tool: '八字专业细盘',
      href: '/tools/bazi',
      title: '甲方八字',
      text: '四柱：甲子 乙丑 丙寅 丁卯'
    }
    const first = saveMemoryRecord(input)
    const second = saveMemoryRecord(input)

    assert.equal(first.storageMode, 'local')
    assert.equal(second.storageMode, 'local')
    assert.equal(getMemorySaveFeedback(first).label, '已保存')
    assert.equal(getMemorySaveFeedback(second).label, '已更新')
    assert.match(getMemoryStorageStatus().description, /当前浏览器/)
  } finally {
    if (previousWindow === undefined) {
      delete globalThis.window
    } else {
      globalThis.window = previousWindow
    }
  }
})

test('saving the same record updates the existing memory card instead of duplicating it', () => {
  const previousWindow = globalThis.window
  globalThis.window = {}

  try {
    const input = {
      tool: '八字专业细盘',
      href: '/tools/bazi',
      title: '甲方八字',
      text: '四柱：甲子 乙丑 丙寅 丁卯'
    }
    const first = saveMemoryRecord(input)
    const second = saveMemoryRecord(input)
    const changed = saveMemoryRecord({ ...input, text: '四柱：戊辰 己巳 庚午 辛未' })
    const other = saveMemoryRecord({ ...input, title: '乙方八字', text: '四柱：壬申 癸酉 甲戌 乙亥' })
    const records = readMemory(recordsKey, [])

    assert.equal(first.saveMode, 'created')
    assert.equal(second.saveMode, 'updated')
    assert.equal(first.id, second.id)
    assert.equal(changed.saveMode, 'updated')
    assert.equal(changed.id, first.id)
    assert.equal(other.saveMode, 'created')
    assert.equal(records.length, 2)
    assert.equal(records[0].title, '乙方八字')
    assert.equal(records[1].text, '四柱：戊辰 己巳 庚午 辛未')
  } finally {
    if (previousWindow === undefined) {
      delete globalThis.window
    } else {
      globalThis.window = previousWindow
    }
  }
})

test('saving a record collapses older duplicate cards with the same fingerprint', () => {
  const previousWindow = globalThis.window
  globalThis.window = {}

  try {
    const duplicate = {
      tool: '八字专业细盘',
      href: '/tools/bazi',
      title: '甲方八字',
      text: '四柱：甲子 乙丑 丙寅 丁卯'
    }

    writeMemory(recordsKey, [
      { id: 'dup-1', ...duplicate, createdAt: '2026-07-01T00:00:00.000Z' },
      { id: 'other', tool: '六爻', href: '/tools/liuyao', title: '问事', text: '本卦：泽雷随', createdAt: '2026-07-02T00:00:00.000Z' },
      { id: 'dup-2', ...duplicate, createdAt: '2026-07-03T00:00:00.000Z' }
    ])

    const saved = saveMemoryRecord(duplicate)
    const records = readMemory(recordsKey, [])

    assert.equal(saved.saveMode, 'updated')
    assert.equal(saved.id, 'dup-1')
    assert.equal(records.length, 2)
    assert.equal(records.filter(record => record.title === duplicate.title).length, 1)
    assert.equal(records.find(record => record.id === 'other').text, '本卦：泽雷随')
  } finally {
    if (previousWindow === undefined) {
      delete globalThis.window
    } else {
      globalThis.window = previousWindow
    }
  }
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

test('record preview prioritizes useful chart fields over boundary notes', () => {
  const preview = getMemoryRecordPreview({
    text: [
      '八字专业细盘',
      '',
      '输入：1996-07-19 23:30（公历/阳历），性别：男',
      '出生地：黑龙江省 黑河市 五大连池市',
      '四柱：丙子 乙未 戊午 壬子',
      '日主：戊',
      '来源与边界',
      '- 只输出排盘字段，不输出吉凶、建议或人生判断。'
    ].join('\n')
  }, { maxLines: 3 })

  assert.deepEqual(preview.lines, [
    '输入：1996-07-19 23:30（公历/阳历），性别：男',
    '出生地：黑龙江省 黑河市 五大连池市',
    '四柱：丙子 乙未 戊午 壬子'
  ])
  assert.equal(preview.totalLines, 7)
  assert.equal(preview.hiddenLines, 4)
})

test('record workflow routes birth charts to synthesis and question charts to AI first', () => {
  const baziWorkflow = getMemoryRecordWorkflow({
    tool: '八字专业细盘',
    title: '甲方八字',
    text: '四柱：甲子 乙丑 丙寅 丁卯'
  })
  const liuyaoWorkflow = getMemoryRecordWorkflow({
    tool: '六爻排盘',
    title: '事项排盘',
    text: '本卦：泽雷随\n变卦：水泽节\n世应：世爻4，应爻1'
  })

  assert.equal(baziWorkflow.category, 'birth')
  assert.equal(baziWorkflow.primaryAction, 'synthesis')
  assert.equal(liuyaoWorkflow.category, 'question')
  assert.equal(liuyaoWorkflow.primaryAction, 'aiPrompt')
})

test('record slot suggestion routes saved records into the right workspace field', () => {
  const baziRecord = {
    tool: '八字专业细盘',
    title: '甲方八字',
    text: '四柱：甲子 乙丑 丙寅 丁卯'
  }
  const liuyaoRecord = {
    tool: '六爻排盘',
    title: '合作卦',
    text: '本卦：泽雷随\n动爻：二爻'
  }
  const tarotRecord = {
    tool: '塔罗抽牌',
    title: '三张牌',
    text: '牌阵：三张牌\n抽牌：星星 正位'
  }

  assert.equal(getMemoryRecordSlotSuggestion(baziRecord, 'synthesis').slot, 'birthChart')
  assert.equal(getMemoryRecordSlotSuggestion(liuyaoRecord, 'synthesis').slot, 'questionChart')
  assert.equal(getMemoryRecordSlotSuggestion(tarotRecord, 'synthesis').slot, 'tarotText')
  assert.equal(getMemoryRecordSlotSuggestion(baziRecord, 'compatibility').slot, 'chartA')
  assert.equal(getMemoryRecordSlotSuggestion(liuyaoRecord, 'compatibility'), null)
  assert.equal(getMemoryRecordSlotSuggestion(liuyaoRecord, 'aiPrompt').slot, 'chartText')
})

test('record picker filters by target recommendation, category, and query', () => {
  const records = [
    {
      id: 'bazi',
      tool: '八字专业细盘',
      href: '/tools/bazi',
      title: '甲方 1996',
      text: '四柱：丙子 乙未 戊午 壬子\n出生地：黑龙江省 黑河市'
    },
    {
      id: 'liuyao',
      tool: '六爻纳甲排盘',
      href: '/tools/liuyao',
      title: '合作问事',
      text: '本卦：泽雷随\n变卦：水泽节\n世应：四爻为世'
    },
    {
      id: 'tarot',
      tool: '塔罗抽牌',
      href: '/tools/tarot',
      title: '关系补充',
      text: '牌阵：三张牌\n抽牌：星星 正位'
    }
  ]

  const compatibilityRecommended = filterMemoryRecordsForTarget(records, {
    category: 'recommended',
    targetSlug: 'compatibility'
  })
  const questionRecords = filterMemoryRecordsForTarget(records, {
    category: 'question',
    targetSlug: 'synthesis'
  })
  const queryRecords = filterMemoryRecordsForTarget(records, {
    category: 'all',
    query: '1996',
    targetSlug: 'synthesis'
  })

  assert.deepEqual(compatibilityRecommended.map(record => record.id), ['bazi'])
  assert.deepEqual(questionRecords.map(record => record.id), ['liuyao'])
  assert.deepEqual(queryRecords.map(record => record.id), ['bazi'])
  assert.deepEqual(filterMemoryRecordsForTarget(null), [])
})
