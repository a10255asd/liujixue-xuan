'use client'

import { CheckCircle2, Copy, RefreshCcw, Save, Star } from '@/components/icons'
import { ToolHandoffActions } from '@/components/tool-handoff-actions'
import { copyText as writeClipboard } from '@/lib/copy-text'
import { favoritesKey, getMemoryRecordPreview, getMemoryRecordSlotSuggestion, handoffKey, readMemory, recordsKey, removeMemory, saveMemoryRecord, writeMemory } from '@/lib/local-memory'
import { formatStructuredResultText, getStructuredTool } from '@/lib/structured-tools'
import { track } from '@vercel/analytics'
import { useEffect, useMemo, useState } from 'react'

const todayDate = () => {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const currentTime = () => {
  const date = new Date()
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

const hydrateDefaults = (defaults, dynamic = false) => Object.fromEntries(Object.entries(defaults).map(([key, value]) => {
  if (value === '__today') return [key, dynamic ? todayDate() : '2026-07-02']
  if (value === '__now') return [key, dynamic ? currentTime() : '09:00']
  return [key, value]
}))

function ResultSection({ section }) {
  if (section.layout === 'palace-grid') {
    return (
      <section className='structured-result-section structured-matrix-section'>
        <h3>{section.title}</h3>
        <div className={`structured-palace-grid ${section.gridClass || ''}`}>
          {section.cells.map(cell => (
            <article className='structured-palace-cell' key={cell.title}>
              <h4>{cell.title}</h4>
              <dl>
                {cell.items.map(item => (
                  <div key={`${cell.title}-${item.label}`}>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className='structured-result-section'>
      <h3>{section.title}</h3>
      <dl>
        {section.rows.map(row => (
          <div key={`${section.title}-${row.label}`}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function Field({ field, form, updateForm }) {
  if (field.showWhen && form[field.showWhen.key] !== field.showWhen.value) return null

  if (field.type === 'select') {
    return (
      <div className='chart-field'>
        <label htmlFor={field.key}>{field.label}</label>
        <select id={field.key} value={form[field.key]} onChange={event => updateForm(field.key, event.target.value)}>
          {field.options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        {field.help ? <p className='structured-field-help'>{field.help}</p> : null}
      </div>
    )
  }

  if (field.type === 'textarea') {
    return (
      <div className='chart-field wide'>
        <label htmlFor={field.key}>{field.label}</label>
        <textarea
          className='chart-text-input structured-textarea'
          id={field.key}
          placeholder={field.placeholder || ''}
          value={form[field.key]}
          onChange={event => updateForm(field.key, event.target.value)}
        />
        {field.help ? <p className='structured-field-help'>{field.help}</p> : null}
      </div>
    )
  }

  return (
    <div className='chart-field'>
      <label htmlFor={field.key}>{field.label}</label>
      <input
        className='chart-text-input'
        id={field.key}
        placeholder={field.placeholder || ''}
        type={field.type || 'text'}
        value={form[field.key]}
        onChange={event => updateForm(field.key, event.target.value)}
      />
      {field.help ? <p className='structured-field-help'>{field.help}</p> : null}
    </div>
  )
}

const previewRecordText = text => {
  const preview = getMemoryRecordPreview({ text }, { maxLines: 2 })
  return preview.lines.join(' / ') || '暂无预览'
}

function RecordSlotPanel({ records, slots, insertRecord, targetSlug }) {
  return (
    <section className='structured-record-panel'>
      <div>
        <span className='chart-kicker'>记录工作台</span>
        <h3>从记录填入</h3>
      </div>
      {records.length ? (
        <div className='structured-record-list'>
          {records.map(record => {
            const suggestion = getMemoryRecordSlotSuggestion(record, targetSlug)

            return (
              <article className='structured-record-card' key={record.id}>
                <div>
                  <span>{record.tool}</span>
                  <strong>{record.title}</strong>
                  <p>{previewRecordText(record.text)}</p>
                  {suggestion ? <em>建议填入：{suggestion.label} · {suggestion.reason}</em> : null}
                </div>
                <div className='structured-record-slot-actions'>
                  {slots.map(slot => (
                    <button
                      className={suggestion?.slot === slot.key ? 'recommended' : ''}
                      key={`${record.id}-${slot.key}`}
                      type='button'
                      onClick={() => insertRecord(record, slot)}>
                      {suggestion?.slot === slot.key ? '推荐：' : ''}{slot.label}
                    </button>
                  ))}
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <p>暂无保存记录</p>
      )}
    </section>
  )
}

const slotLabelFromTool = (tool, slots, slotKey) => {
  const configuredSlot = slots.find(slot => slot.key === slotKey)
  const field = tool.fields.find(item => item.key === slotKey)
  const label = configuredSlot?.indicatorLabel || configuredSlot?.label || field?.label || '排盘字段'
  return label
}

const buildAppliedRecordNotice = (source, slotKey, slotLabel) => ({
  id: `${slotKey || 'field'}-${source?.sourceId || source?.id || Date.now()}`,
  slot: slotKey || '',
  slotLabel,
  sourceTool: source?.sourceTool || source?.tool || '记录',
  sourceTitle: source?.sourceTitle || source?.title || '未命名记录'
})

const mergeAppliedRecordNotice = (current, next) => [
  next,
  ...current.filter(item => item.slot !== next.slot)
].slice(0, 4)

function AppliedRecordNotice({ items }) {
  if (!items.length) return null

  return (
    <section className='structured-handoff-indicator' aria-label='最近填入记录'>
      <span className='chart-kicker'>最近填入</span>
      <div className='structured-handoff-chip-list'>
        {items.map(item => (
          <div className='structured-handoff-chip' key={item.id}>
            <span>{item.slotLabel}</span>
            <strong>{item.sourceTitle}</strong>
            <em>{item.sourceTool}</em>
          </div>
        ))}
      </div>
    </section>
  )
}

export function StructuredTool({ slug }) {
  const tool = getStructuredTool(slug)
  const defaultInput = tool.defaultInput
  const [form, setForm] = useState(() => hydrateDefaults(defaultInput))
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [favorited, setFavorited] = useState(false)
  const [records, setRecords] = useState([])
  const [appliedRecords, setAppliedRecords] = useState([])
  const output = useMemo(() => tool.calculate(form), [form, tool])
  const exportText = useMemo(() => output.copyText || formatStructuredResultText(output), [output])
  const recordSlots = useMemo(() => tool.recordSlots || [], [tool])
  const recentRecords = useMemo(() => records.filter(record => record?.text).slice(0, 8), [records])

  useEffect(() => {
    const favorites = readMemory(favoritesKey, [])
    const handoff = readMemory(handoffKey, null)
    const dynamicDefaults = hydrateDefaults(defaultInput, true)
    const shouldApplyHandoff = tool.applyHandoff && handoff && (handoff.targetHref === tool.href || handoff.targetSlug === slug)

    setFavorited(favorites.some(item => item.href === tool.href))
    if (recordSlots.length) setRecords(readMemory(recordsKey, []))
    setForm(shouldApplyHandoff ? tool.applyHandoff(dynamicDefaults, handoff) : dynamicDefaults)
    setAppliedRecords(shouldApplyHandoff
      ? [buildAppliedRecordNotice(handoff, handoff.slot, slotLabelFromTool(tool, recordSlots, handoff.slot))]
      : []
    )
    if (shouldApplyHandoff) window.setTimeout(() => removeMemory(handoffKey), 0)
  }, [defaultInput, recordSlots, slug, tool])

  const updateForm = (key, value) => {
    setForm(current => ({ ...current, [key]: value }))
    setAppliedRecords(current => current.filter(item => item.slot !== key))
    setCopied(false)
    setSaved(false)
  }

  const reset = () => {
    setForm(hydrateDefaults(defaultInput, true))
    setAppliedRecords([])
    setCopied(false)
    setSaved(false)
  }

  const copy = async () => {
    const ok = await writeClipboard(exportText)
    if (!ok) return
    track('xuan_structured_tool_copy', { tool: tool.title })
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  const saveRecord = () => {
    saveMemoryRecord({
      tool: tool.title,
      href: tool.href,
      title: output.summary || output.title,
      text: exportText
    })
    track('xuan_structured_tool_save', { tool: tool.title })
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1800)
  }

  const toggleFavorite = () => {
    const favorites = readMemory(favoritesKey, [])
    const exists = favorites.some(item => item.href === tool.href)
    const next = exists
      ? favorites.filter(item => item.href !== tool.href)
      : [{ title: tool.title, href: tool.href, addedAt: new Date().toISOString() }, ...favorites]
    writeMemory(favoritesKey, next)
    setFavorited(!exists)
  }

  const insertRecord = (record, slot) => {
    if (!tool.applyRecordSlot) return
    setForm(current => tool.applyRecordSlot(current, record, slot))
    setAppliedRecords(current => mergeAppliedRecordNotice(current, buildAppliedRecordNotice(record, slot?.key, slotLabelFromTool(tool, recordSlots, slot?.key))))
    setCopied(false)
    setSaved(false)
  }

  return (
    <div className='chart-tool structured-tool'>
      <section className='chart-side-panel'>
        <div className='chart-panel-head'>
          <div>
            <span className='chart-kicker'>{tool.kicker}</span>
            <h2>输入信息</h2>
          </div>
          <button className='chart-reset-button' type='button' onClick={reset} aria-label='重置'>
            <RefreshCcw size={18} />
          </button>
        </div>
        <div className='chart-form-grid'>
          {tool.fields.map(field => (
            <Field field={field} form={form} key={field.key} updateForm={updateForm} />
          ))}
        </div>
        <div className='structured-action-grid'>
          <button className='button primary' type='button' onClick={copy}>
            {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
            {copied ? '已复制' : tool.copyLabel || '复制字段'}
          </button>
          <button className='button' type='button' onClick={saveRecord}>
            {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
            {saved ? '已保存' : '保存记录'}
          </button>
          <button className='button' type='button' onClick={toggleFavorite}>
            <Star size={16} />
            {favorited ? '已收藏' : '收藏工具'}
          </button>
          <ToolHandoffActions
            buttonClassName='button'
            className='structured-direct-handoff-actions'
            location={`${slug}-structured-tool`}
            record={{
              tool: tool.title,
              href: tool.href,
              title: output.summary || output.title,
              text: exportText
            }}
            showHints
            targets={tool.handoffTargets || []}
          />
        </div>
        <AppliedRecordNotice items={appliedRecords} />
        {recordSlots.length ? <RecordSlotPanel records={recentRecords} slots={recordSlots} insertRecord={insertRecord} targetSlug={slug} /> : null}
      </section>

      <section className='chart-result-panel'>
        <article className='structured-hero-card'>
          <span>{tool.kicker}</span>
          <h2>{output.title}</h2>
          <p>{output.subtitle}</p>
          <div>
            {output.badges.map(badge => <em key={badge}>{badge}</em>)}
          </div>
        </article>
        <div className='structured-result-grid'>
          {output.sections.map(section => <ResultSection key={section.title} section={section} />)}
        </div>
      </section>
    </div>
  )
}
