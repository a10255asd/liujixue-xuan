'use client'

import { CheckCircle2, Copy, RefreshCcw, Save, Star } from '@/components/icons'
import { copyText as writeClipboard } from '@/lib/copy-text'
import { favoritesKey, readMemory, saveMemoryRecord, writeMemory } from '@/lib/local-memory'
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
          value={form[field.key]}
          onChange={event => updateForm(field.key, event.target.value)}
        />
      </div>
    )
  }

  return (
    <div className='chart-field'>
      <label htmlFor={field.key}>{field.label}</label>
      <input
        className='chart-text-input'
        id={field.key}
        type={field.type || 'text'}
        value={form[field.key]}
        onChange={event => updateForm(field.key, event.target.value)}
      />
    </div>
  )
}

export function StructuredTool({ slug }) {
  const tool = getStructuredTool(slug)
  const defaultInput = tool.defaultInput
  const [form, setForm] = useState(() => hydrateDefaults(defaultInput))
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [favorited, setFavorited] = useState(false)
  const output = useMemo(() => tool.calculate(form), [form, tool])
  const exportText = useMemo(() => formatStructuredResultText(output), [output])

  useEffect(() => {
    const favorites = readMemory(favoritesKey, [])
    setFavorited(favorites.some(item => item.href === tool.href))
    setForm(hydrateDefaults(defaultInput, true))
  }, [defaultInput, tool.href])

  const updateForm = (key, value) => {
    setForm(current => ({ ...current, [key]: value }))
    setCopied(false)
    setSaved(false)
  }

  const reset = () => {
    setForm(hydrateDefaults(defaultInput, true))
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
            {copied ? '已复制' : '复制字段'}
          </button>
          <button className='button' type='button' onClick={saveRecord}>
            {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
            {saved ? '已保存' : '保存记录'}
          </button>
          <button className='button' type='button' onClick={toggleFavorite}>
            <Star size={16} />
            {favorited ? '已收藏' : '收藏工具'}
          </button>
        </div>
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
