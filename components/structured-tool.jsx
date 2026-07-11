'use client'

import { ChartExportActions } from '@/components/chart-export-panel'
import { RefreshCcw } from '@/components/icons'
import { getStructuredTool } from '@/lib/structured-tools'
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

const sectionRowsForImage = section => {
  if (Array.isArray(section.rows)) return section.rows
  if (!Array.isArray(section.cells)) return []

  return section.cells.map(cell => ({
    label: cell.title,
    value: cell.items.map(item => `${item.label}：${item.value}`).join(' / ')
  }))
}

const imageFilenameFromTool = tool => {
  const slug = tool.href.split('/').filter(Boolean).pop() || 'chart'
  return `${slug}-chart.png`
}

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

export function StructuredTool({ slug }) {
  const tool = getStructuredTool(slug)
  const defaultInput = tool.defaultInput
  const [form, setForm] = useState(() => hydrateDefaults(defaultInput))
  const output = useMemo(() => tool.calculate(form), [form, tool])
  const imagePayload = useMemo(() => ({
    title: output.title,
    subtitle: output.subtitle,
    badges: output.badges,
    filename: imageFilenameFromTool(tool),
    sections: output.sections.map(section => ({
      title: section.title,
      rows: sectionRowsForImage(section)
    }))
  }), [output, tool])

  useEffect(() => {
    const dynamicDefaults = hydrateDefaults(defaultInput, true)

    setForm(dynamicDefaults)
  }, [defaultInput, tool])

  const updateForm = (key, value) => {
    setForm(current => ({ ...current, [key]: value }))
  }

  const reset = () => {
    setForm(hydrateDefaults(defaultInput, true))
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
          <ChartExportActions imageLabel='下载排盘图片' payload={imagePayload} />
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
