'use client'

import { RefreshCcw } from '@/components/icons'
import { ChartExportActions } from '@/components/chart-export-panel'
import {
  buildLiuYaoCopyText,
  buildLiuYaoExportPayload,
  calculateLiuYaoChart,
  defaultLiuYaoInput,
  liuYaoLineStateOptions
} from '@/lib/liuyao-chart'
import { useMemo, useState } from 'react'

const numberFields = [
  { key: 'year', label: '起卦年份', min: 1900, max: 2100, suffix: '年', maxLength: 4, wide: true },
  { key: 'month', label: '月份', min: 1, max: 12, suffix: '月', maxLength: 2 },
  { key: 'day', label: '日期', min: 1, max: 31, suffix: '日', maxLength: 2 },
  { key: 'hour', label: '小时', min: 0, max: 23, suffix: '时', maxLength: 2 },
  { key: 'minute', label: '分钟', min: 0, max: 59, suffix: '分', maxLength: 2 }
]

const lineInputLabels = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻']
const elementClassMap = {
  木: 'wood',
  火: 'fire',
  土: 'earth',
  金: 'metal',
  水: 'water'
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const sanitizeNumberDraft = value => String(value).replace(/\D/g, '')

const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate()

const normalizeNumberValue = (field, value, form) => {
  if (value === '') return ''
  const number = Math.trunc(Number(value))
  if (!Number.isFinite(number)) return ''
  if (field.key === 'day') {
    const year = Number(form.year) || defaultLiuYaoInput.year
    const month = Number(form.month) || defaultLiuYaoInput.month
    return clamp(number, 1, getDaysInMonth(year, month))
  }
  return clamp(number, field.min, field.max)
}

const getChartValue = (form, field) => {
  const value = form[field.key]
  if (value === '') return defaultLiuYaoInput[field.key]
  if (field.key === 'year' && String(value).length < 4) return defaultLiuYaoInput.year
  return value
}

const normalizeFormForChart = form => ({
  ...form,
  ...Object.fromEntries(numberFields.map(field => [field.key, getChartValue(form, field)]))
})

function NumberField({ field, form, onChange, onCommit }) {
  return (
    <div className={`chart-field ${field.wide ? 'wide' : ''}`}>
      <label htmlFor={`liuyao-${field.key}`}>{field.label}</label>
      <div className='chart-number-control'>
        <input
          id={`liuyao-${field.key}`}
          type='text'
          inputMode='numeric'
          maxLength={field.maxLength}
          autoComplete='off'
          value={form[field.key]}
          onChange={event => onChange(field, event.target.value)}
          onBlur={event => onCommit(field, event.target.value)}
        />
        <span>{field.suffix}</span>
      </div>
    </div>
  )
}

function QuestionField({ value, onChange }) {
  return (
    <div className='chart-field wide'>
      <label htmlFor='liuyao-question'>事项</label>
      <input
        id='liuyao-question'
        className='chart-text-input'
        maxLength={80}
        value={value}
        onChange={event => onChange(event.target.value)}
      />
    </div>
  )
}

function LineStateField({ index, value, onChange }) {
  return (
    <div className='liuyao-line-input-row'>
      <span>{lineInputLabels[index]}</span>
      <div className='liuyao-line-state-options'>
        {liuYaoLineStateOptions.map(option => (
          <button
            className={`liuyao-line-state-button ${value === option.value ? 'active' : ''}`}
            key={option.value}
            type='button'
            onClick={() => onChange(index, option.value)}>
            <strong>{option.label}</strong>
            <em>{option.description}</em>
          </button>
        ))}
      </div>
    </div>
  )
}

function DetailRow({ label, value }) {
  return (
    <div className='chart-detail-row'>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

function SummaryItem({ label, value }) {
  return (
    <div className='chart-summary-item'>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function ElementText({ element, value }) {
  return <strong className={`bazi-element-symbol ${elementClassMap[element] || ''}`}>{value}</strong>
}

function LineMark({ bit }) {
  return (
    <span className={`liuyao-line-mark ${bit ? 'yang' : 'yin'}`} aria-label={bit ? '阳爻' : '阴爻'}>
      <i />
      {!bit && <i />}
    </span>
  )
}

function LineText({ line }) {
  return (
    <span className='liuyao-line-text'>
      <strong>{line.shortRelative}</strong>
      <ElementText element={line.element} value={`${line.zhi}${line.element}`} />
      <em>{line.gan}</em>
    </span>
  )
}

function ChangedLineText({ line }) {
  return (
    <span className='liuyao-line-text'>
      <strong>{line.changed.shortRelative}</strong>
      <ElementText element={line.changed.element} value={`${line.changed.zhi}${line.changed.element}`} />
      <em>{line.changed.gan}</em>
    </span>
  )
}

function TagList({ items }) {
  if (!items?.length) return <span className='muted-text'>-</span>
  return (
    <div className='liuyao-tag-list'>
      {items.map(item => <span key={item}>{item}</span>)}
    </div>
  )
}

function HiddenSpirit({ line }) {
  if (!line.hiddenSpirit) return <span className='muted-text'>-</span>

  return (
    <div className='liuyao-hidden-spirit'>
      <span>伏神：{line.hiddenSpirit.shortRelative}{line.hiddenSpirit.zhi}{line.hiddenSpirit.element}{line.hiddenSpirit.gan}</span>
      <span>飞神：{line.flyingSpirit.text}</span>
    </div>
  )
}

function LiuYaoChartTable({ chart, copyText, exportPayload }) {
  return (
    <section className='chart-section-card liuyao-chart-card'>
      <div className='chart-section-head'>
        <div>
          <span className='chart-kicker'>Liu Yao Chart</span>
          <h2>六爻排盘</h2>
        </div>
        <div className='bazi-fine-actions'>
          <span className='chart-source'>纳甲 / 六亲 / 世应 / 六神</span>
          <ChartExportActions
            copyLabel='复制排盘文本'
            copiedLabel='已复制排盘'
            copyText={copyText}
            imageLabel='下载排盘图片'
            location='liuyao-chart'
            payload={exportPayload}
            templateTitle='六爻排盘 AI 解析包'
            textLabel='下载排盘文本'
          />
        </div>
      </div>

      <div className='liuyao-chart-table-wrap'>
        <table className='liuyao-chart-table'>
          <thead>
            <tr>
              <th>爻位</th>
              <th>六神</th>
              <th>本卦</th>
              <th>爻象</th>
              <th>动变</th>
              <th>变卦</th>
              <th>世应</th>
              <th>伏神 / 飞神</th>
              <th>关系标记</th>
            </tr>
          </thead>
          <tbody>
            {[...chart.lines].reverse().map(line => (
              <tr className={line.moving ? 'moving' : ''} key={line.position}>
                <th scope='row'>{line.label}</th>
                <td>{line.sixGod}</td>
                <td><LineText line={line} /></td>
                <td><LineMark bit={line.bit} /></td>
                <td>{line.moving ? line.movingMarker : '-'}</td>
                <td>
                  <div className='liuyao-changed-line'>
                    <LineMark bit={line.changed.bit} />
                    <ChangedLineText line={line} />
                  </div>
                </td>
                <td>{line.role || '-'}</td>
                <td><HiddenSpirit line={line} /></td>
                <td><TagList items={line.relations} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export function LiuYaoChartCalculator() {
  const [form, setForm] = useState(defaultLiuYaoInput)
  const chartInput = useMemo(() => normalizeFormForChart(form), [form])
  const chart = useMemo(() => calculateLiuYaoChart(chartInput), [chartInput])
  const copyText = useMemo(() => buildLiuYaoCopyText(chart), [chart])
  const exportPayload = useMemo(() => buildLiuYaoExportPayload(chart), [chart])

  const setNumberDraft = (field, value) => {
    setForm(current => ({
      ...current,
      [field.key]: sanitizeNumberDraft(value).slice(0, field.maxLength)
    }))
  }

  const commitNumberValue = (field, value) => {
    setForm(current => ({
      ...current,
      [field.key]: normalizeNumberValue(field, value, current)
    }))
  }

  const setLineState = (index, value) => {
    setForm(current => ({
      ...current,
      lines: current.lines.map((item, itemIndex) => itemIndex === index ? value : item)
    }))
  }

  return (
    <div className='chart-tool liuyao-chart-tool'>
      <aside className='chart-side-panel'>
        <div className='chart-panel-head'>
          <div>
            <span className='chart-kicker'>Liu Yao</span>
            <h2>起卦信息</h2>
          </div>
          <button className='chart-reset-button' type='button' onClick={() => setForm(defaultLiuYaoInput)} aria-label='恢复默认排盘'>
            <RefreshCcw size={16} />
          </button>
        </div>

        <div className='chart-form-grid'>
          <QuestionField
            value={form.question}
            onChange={value => setForm(current => ({ ...current, question: value }))}
          />

          {numberFields.map(field => (
            <NumberField
              field={field}
              form={form}
              key={field.key}
              onChange={setNumberDraft}
              onCommit={commitNumberValue}
            />
          ))}

          <div className='chart-field wide'>
            <label>爻位</label>
            <div className='liuyao-line-input-list'>
              {[5, 4, 3, 2, 1, 0].map(index => (
                <LineStateField
                  index={index}
                  key={index}
                  value={form.lines[index]}
                  onChange={setLineState}
                />
              ))}
            </div>
          </div>
        </div>
      </aside>

      <section className='chart-result-panel'>
        <div className='bazi-summary-card liuyao-summary-card'>
          <div className='bazi-summary-main'>
            <span className='chart-kicker'>本卦 / 变卦</span>
            <strong>{chart.hexagram.name} → {chart.changedHexagram.name}</strong>
            <p>{chart.input.question}</p>
          </div>
          <div className='chart-summary-grid'>
            <SummaryItem label='卦宫' value={`${chart.hexagram.palace}宫${chart.hexagram.palaceElement}`} />
            <SummaryItem label='世应' value={`世${chart.hexagram.world} / 应${chart.hexagram.response}`} />
            <SummaryItem label='动爻' value={chart.movingLines.length ? chart.movingLines.map(item => `${item}爻`).join('、') : '无'} />
          </div>
        </div>

        <section className='chart-section-card'>
          <div className='chart-section-head'>
            <div>
              <span className='chart-kicker'>Calendar</span>
              <h2>起卦历法</h2>
            </div>
            <span className='chart-source'>月建 / 日辰 / 旬空</span>
          </div>
          <dl className='chart-detail-list compact'>
            <DetailRow label='起卦时间' value={`${chart.dateText}（${chart.lunarText}）`} />
            <DetailRow label='起卦方式' value={chart.input.method} />
            <DetailRow label='节气' value={chart.jieQiText} />
            <DetailRow label='干支' value={`${chart.yearGanZhi}年 ${chart.monthGanZhi}月 ${chart.dayGanZhi}日 ${chart.timeGanZhi}时`} />
            <DetailRow label='月建 / 日辰' value={`${chart.monthZhi}月 / ${chart.dayZhi}日`} />
            <DetailRow label='旬空' value={`年${chart.xunKong.year} / 月${chart.xunKong.month} / 日${chart.xunKong.day} / 时${chart.xunKong.time}`} />
            <DetailRow label='辅助神煞' value={chart.auxiliaryStars.join('，') || '-'} />
          </dl>
        </section>

        <LiuYaoChartTable chart={chart} copyText={copyText} exportPayload={exportPayload} />

        <section className='chart-section-card liuyao-note-card'>
          <div className='chart-section-head'>
            <div>
              <span className='chart-kicker'>Boundary</span>
              <h2>输出边界</h2>
            </div>
          </div>
          <div className='check-list compact'>
            {chart.notes.map(note => (
              <div className='check-item' key={note}>
                <span>{note}</span>
              </div>
            ))}
          </div>
        </section>
      </section>
    </div>
  )
}
