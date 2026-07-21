'use client'

import { ChartExportActions } from '@/components/chart-export-panel'
import { RefreshCcw } from '@/components/icons'
import { buildDailyHexagramReview, dailyHexagramFocusOptions } from '@/lib/daily-hexagram-review'
import Link from 'next/link'
import { useMemo, useState } from 'react'

const trigramOrder = ['乾', '兑', '离', '震', '巽', '坎', '艮', '坤']

const trigrams = {
  乾: { name: '乾', image: '天', element: '金', lines: [1, 1, 1] },
  兑: { name: '兑', image: '泽', element: '金', lines: [1, 1, 0] },
  离: { name: '离', image: '火', element: '火', lines: [1, 0, 1] },
  震: { name: '震', image: '雷', element: '木', lines: [1, 0, 0] },
  巽: { name: '巽', image: '风', element: '木', lines: [0, 1, 1] },
  坎: { name: '坎', image: '水', element: '水', lines: [0, 1, 0] },
  艮: { name: '艮', image: '山', element: '土', lines: [0, 0, 1] },
  坤: { name: '坤', image: '地', element: '土', lines: [0, 0, 0] }
}

const hexagramNames = {
  乾: { 乾: '乾为天', 兑: '天泽履', 离: '天火同人', 震: '天雷无妄', 巽: '天风姤', 坎: '天水讼', 艮: '天山遁', 坤: '天地否' },
  兑: { 乾: '泽天夬', 兑: '兑为泽', 离: '泽火革', 震: '泽雷随', 巽: '泽风大过', 坎: '泽水困', 艮: '泽山咸', 坤: '泽地萃' },
  离: { 乾: '火天大有', 兑: '火泽睽', 离: '离为火', 震: '火雷噬嗑', 巽: '火风鼎', 坎: '火水未济', 艮: '火山旅', 坤: '火地晋' },
  震: { 乾: '雷天大壮', 兑: '雷泽归妹', 离: '雷火丰', 震: '震为雷', 巽: '雷风恒', 坎: '雷水解', 艮: '雷山小过', 坤: '雷地豫' },
  巽: { 乾: '风天小畜', 兑: '风泽中孚', 离: '风火家人', 震: '风雷益', 巽: '巽为风', 坎: '风水涣', 艮: '风山渐', 坤: '风地观' },
  坎: { 乾: '水天需', 兑: '水泽节', 离: '水火既济', 震: '水雷屯', 巽: '水风井', 坎: '坎为水', 艮: '水山蹇', 坤: '水地比' },
  艮: { 乾: '山天大畜', 兑: '山泽损', 离: '山火贲', 震: '山雷颐', 巽: '山风蛊', 坎: '山水蒙', 艮: '艮为山', 坤: '山地剥' },
  坤: { 乾: '地天泰', 兑: '地泽临', 离: '地火明夷', 震: '地雷复', 巽: '地风升', 坎: '地水师', 艮: '地山谦', 坤: '坤为地' }
}

const lineNames = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻']

const todayDate = () => {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const currentTime = () => {
  const date = new Date()
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

const hashText = value => {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24)
  }
  return Math.abs(hash >>> 0)
}

const findTrigramByLines = lines => trigramOrder.find(name => (
  trigrams[name].lines.every((line, index) => line === lines[index])
))

const buildHexagram = ({ date, time, topic }) => {
  const seed = hashText(`${date}|${time}|${topic}`)
  const upperName = trigramOrder[seed % 8]
  const lowerName = trigramOrder[Math.floor(seed / 8) % 8]
  const movingLine = (Math.floor(seed / 64) % 6) + 1
  const upper = trigrams[upperName]
  const lower = trigrams[lowerName]
  const changedLowerLines = [...lower.lines]
  const changedUpperLines = [...upper.lines]

  if (movingLine <= 3) {
    changedLowerLines[movingLine - 1] = changedLowerLines[movingLine - 1] ? 0 : 1
  } else {
    changedUpperLines[movingLine - 4] = changedUpperLines[movingLine - 4] ? 0 : 1
  }

  const changedUpperName = findTrigramByLines(changedUpperLines)
  const changedLowerName = findTrigramByLines(changedLowerLines)
  const changedUpper = trigrams[changedUpperName]
  const changedLower = trigrams[changedLowerName]

  return {
    topic: topic || '未填写事项',
    date,
    time,
    upper,
    lower,
    changedUpper,
    changedLower,
    movingLine,
    lineName: lineNames[movingLine - 1],
    name: hexagramNames[upper.name][lower.name],
    changedName: hexagramNames[changedUpper.name][changedLower.name],
    lines: [...upper.lines.map((line, index) => ({ bit: line, position: index + 4 })).reverse(), ...lower.lines.map((line, index) => ({ bit: line, position: index + 1 })).reverse()]
  }
}

const buildImagePayload = (chart, review) => ({
  toolCode: 'daily-hexagram',
  title: '每日一卦记录',
  subtitle: `${chart.topic} · ${chart.date} ${chart.time}`,
  badges: [review.profile.label, chart.name, `变卦 ${chart.changedName}`, chart.lineName],
  filename: `daily-hexagram-${chart.date}.png`,
  sections: [
    {
      title: '起卦信息',
      rows: [
        { label: '事项', value: chart.topic },
        { label: '时间', value: `${chart.date} ${chart.time}` }
      ]
    },
    {
      title: '卦象字段',
      rows: [
        { label: '本卦', value: `${chart.name}（${chart.upper.name}上${chart.lower.name}下）` },
        { label: '变卦', value: `${chart.changedName}（${chart.changedUpper.name}上${chart.changedLower.name}下）` },
        { label: '动爻', value: lineNames[chart.movingLine - 1] },
        { label: '上卦', value: `${chart.upper.name} / ${chart.upper.image} / 五行${chart.upper.element}` },
        { label: '下卦', value: `${chart.lower.name} / ${chart.lower.image} / 五行${chart.lower.element}` }
      ]
    },
    {
      title: '复盘清单',
      rows: review.rows
    }
  ]
})

function HexagramLines({ chart }) {
  return (
    <div className='daily-hexagram-lines' aria-label={`${chart.name} 爻象`}>
      {chart.lines.map(line => (
        <div className={`daily-hexagram-line ${line.bit ? 'yang' : 'yin'} ${line.position === chart.movingLine ? 'moving' : ''}`} key={line.position}>
          <span>{lineNames[line.position - 1]}</span>
          <i />
          {!line.bit && <i />}
          {line.position === chart.movingLine && <em>动</em>}
        </div>
      ))}
    </div>
  )
}

export function DailyHexagramTool() {
  const [form, setForm] = useState({
    date: todayDate(),
    time: currentTime(),
    topic: '今天适合推进什么？',
    focus: 'action'
  })
  const chart = useMemo(() => buildHexagram(form), [form])
  const review = useMemo(() => buildDailyHexagramReview(chart, form.focus), [chart, form.focus])
  const imagePayload = useMemo(() => buildImagePayload(chart, review), [chart, review])

  const updateForm = (key, value) => {
    setForm(current => ({ ...current, [key]: value }))
  }

  return (
    <div className='xuan-tool-layout'>
      <section className='form-panel chart-card'>
        <div className='chart-card-head'>
          <div>
            <span className='chart-kicker'>Daily Hexagram</span>
            <h2>起卦信息</h2>
          </div>
          <button
            className='chart-icon-button'
            type='button'
            onClick={() => {
              setForm({ date: todayDate(), time: currentTime(), topic: form.topic, focus: form.focus })
            }}>
            <RefreshCcw size={18} />
          </button>
        </div>
        <div className='chart-form-grid'>
          <div className='chart-field'>
            <label htmlFor='daily-date'>日期</label>
            <input id='daily-date' type='date' value={form.date} onChange={event => updateForm('date', event.target.value)} />
          </div>
          <div className='chart-field'>
            <label htmlFor='daily-time'>时间</label>
            <input id='daily-time' type='time' value={form.time} onChange={event => updateForm('time', event.target.value)} />
          </div>
          <div className='chart-field wide'>
            <label htmlFor='daily-topic'>事项</label>
            <input
              id='daily-topic'
              className='chart-text-input'
              maxLength={80}
              value={form.topic}
              onChange={event => updateForm('topic', event.target.value)}
            />
          </div>
          <div className='chart-field'>
            <label htmlFor='daily-focus'>关注方向</label>
            <select id='daily-focus' value={form.focus} onChange={event => updateForm('focus', event.target.value)}>
              {dailyHexagramFocusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className='daily-action-row'>
          <ChartExportActions imageLabel='下载排盘图片' payload={imagePayload} />
        </div>
      </section>

      <section className='chart-section-card daily-hexagram-card'>
        <div className='chart-section-head'>
          <div>
            <span className='chart-kicker'>Result</span>
            <h2>{chart.name}</h2>
          </div>
          <span className='chart-source'>变卦：{chart.changedName}</span>
        </div>
        <div className='daily-result-grid'>
          <div className='daily-result-main'>
            <HexagramLines chart={chart} />
          </div>
          <div className='daily-result-details'>
            <div><span>事项</span><strong>{chart.topic}</strong></div>
            <div><span>起卦时间</span><strong>{chart.date} {chart.time}</strong></div>
            <div><span>本卦</span><strong>{chart.name} / {chart.upper.name}上{chart.lower.name}下</strong></div>
            <div><span>变卦</span><strong>{chart.changedName} / {chart.changedUpper.name}上{chart.changedLower.name}下</strong></div>
            <div><span>动爻</span><strong>{chart.lineName}</strong></div>
          </div>
        </div>
        <section className='daily-review-panel'>
          <div className='daily-review-head'>
            <div>
              <span>问事记录</span>
              <h3>{review.profile.label}</h3>
            </div>
            <em>复盘清单</em>
          </div>
          <div className='daily-review-grid'>
            {review.rows.map(row => (
              <div className='daily-review-item' key={row.label}>
                <span>{row.label}</span>
                <strong>{row.value}</strong>
              </div>
            ))}
          </div>
          <div className='daily-next-step-list'>
            {review.nextSteps.map(step => (
              <Link href={step.href} key={step.href}>
                <strong>{step.label}</strong>
                <span>{step.text}</span>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </div>
  )
}
