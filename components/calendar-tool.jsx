'use client'

import { CheckCircle2, Copy, RefreshCcw, Save } from '@/components/icons'
import { ToolHandoffActions } from '@/components/tool-handoff-actions'
import { saveMemoryRecord } from '@/lib/local-memory'
import { Solar } from 'lunar-javascript'
import { useMemo, useState } from 'react'

const todayDate = () => {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const currentTime = () => {
  const date = new Date()
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

const splitDate = value => {
  const [year, month, day] = value.split('-').map(Number)
  return { year, month, day }
}

const splitTime = value => {
  const [hour, minute] = value.split(':').map(Number)
  return { hour: hour || 0, minute: minute || 0 }
}

const callValue = (source, methodName, fallback = '-') => {
  if (typeof source?.[methodName] !== 'function') return fallback
  const value = source[methodName]()
  if (Array.isArray(value)) return value.length ? value.join('、') : fallback
  return value || fallback
}

const buildCalendar = ({ date, time }) => {
  const { year, month, day } = splitDate(date)
  const { hour, minute } = splitTime(time)
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0)
  const lunar = solar.getLunar()
  const previousJieQi = lunar.getPrevJieQi?.()
  const nextJieQi = lunar.getNextJieQi?.()

  return {
    solar: solar.toYmdHms(),
    lunar: lunar.toString(),
    ganZhi: {
      year: callValue(lunar, 'getYearInGanZhi'),
      month: callValue(lunar, 'getMonthInGanZhi'),
      day: callValue(lunar, 'getDayInGanZhi'),
      time: callValue(lunar, 'getTimeInGanZhi')
    },
    nayin: {
      year: callValue(lunar, 'getYearNaYin'),
      month: callValue(lunar, 'getMonthNaYin'),
      day: callValue(lunar, 'getDayNaYin'),
      time: callValue(lunar, 'getTimeNaYin')
    },
    yi: callValue(lunar, 'getDayYi'),
    ji: callValue(lunar, 'getDayJi'),
    chong: callValue(lunar, 'getChongDesc'),
    sha: callValue(lunar, 'getSha'),
    xun: callValue(lunar, 'getDayXun'),
    xunKong: callValue(lunar, 'getDayXunKong'),
    xiu: `${callValue(lunar, 'getXiu')} ${callValue(lunar, 'getXiuLuck')} ${callValue(lunar, 'getXiuSong')}`.trim(),
    animal: callValue(lunar, 'getAnimal'),
    pengZu: `${callValue(lunar, 'getPengZuGan')}；${callValue(lunar, 'getPengZuZhi')}`,
    positions: {
      xi: callValue(lunar, 'getDayPositionXiDesc'),
      fu: callValue(lunar, 'getDayPositionFuDesc'),
      cai: callValue(lunar, 'getDayPositionCaiDesc')
    },
    jieQi: {
      previous: previousJieQi ? `${previousJieQi.getName()} ${previousJieQi.getSolar().toYmdHms()}` : '-',
      next: nextJieQi ? `${nextJieQi.getName()} ${nextJieQi.getSolar().toYmdHms()}` : '-'
    }
  }
}

const buildCopyText = calendar => [
  '黄历节气查询',
  `公历：${calendar.solar}`,
  `农历：${calendar.lunar}`,
  `四柱：${calendar.ganZhi.year}年 ${calendar.ganZhi.month}月 ${calendar.ganZhi.day}日 ${calendar.ganZhi.time}时`,
  `纳音：${calendar.nayin.year} / ${calendar.nayin.month} / ${calendar.nayin.day} / ${calendar.nayin.time}`,
  `宜：${calendar.yi}`,
  `忌：${calendar.ji}`,
  `冲煞：${calendar.chong} / ${calendar.sha}`,
  `旬空：${calendar.xun} / ${calendar.xunKong}`,
  `星宿：${calendar.xiu}`,
  `方位：喜神${calendar.positions.xi}，福神${calendar.positions.fu}，财神${calendar.positions.cai}`,
  `节气：上一节气 ${calendar.jieQi.previous}；下一节气 ${calendar.jieQi.next}`
].join('\n')

function DetailItem({ label, value }) {
  return (
    <div className='calendar-detail-item'>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

export function CalendarTool() {
  const [form, setForm] = useState({
    date: todayDate(),
    time: currentTime()
  })
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const calendar = useMemo(() => buildCalendar(form), [form])
  const copyText = useMemo(() => buildCopyText(calendar), [calendar])

  const updateForm = (key, value) => {
    setForm(current => ({ ...current, [key]: value }))
    setCopied(false)
    setSaved(false)
  }

  const resetNow = () => {
    setForm({ date: todayDate(), time: currentTime() })
    setCopied(false)
    setSaved(false)
  }

  const copy = async () => {
    await navigator.clipboard.writeText(copyText)
    setCopied(true)
  }

  const save = () => {
    saveMemoryRecord({
      tool: '黄历节气',
      href: '/tools/calendar',
      title: `${calendar.solar} · ${calendar.ganZhi.day}日`,
      text: copyText
    })
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1800)
  }

  return (
    <div className='xuan-tool-layout'>
      <section className='form-panel chart-card'>
        <div className='chart-card-head'>
          <div>
            <span className='chart-kicker'>Almanac</span>
            <h2>查询时间</h2>
          </div>
          <button className='chart-icon-button' type='button' onClick={resetNow}>
            <RefreshCcw size={18} />
          </button>
        </div>
        <div className='chart-form-grid'>
          <div className='chart-field'>
            <label htmlFor='calendar-date'>日期</label>
            <input id='calendar-date' type='date' value={form.date} onChange={event => updateForm('date', event.target.value)} />
          </div>
          <div className='chart-field'>
            <label htmlFor='calendar-time'>时间</label>
            <input id='calendar-time' type='time' value={form.time} onChange={event => updateForm('time', event.target.value)} />
          </div>
        </div>
        <div className='daily-action-row'>
          <button className='button primary' type='button' onClick={copy}>
            {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
            {copied ? '已复制日课字段' : '复制日课字段'}
          </button>
          <button className='button' type='button' onClick={save}>
            {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
            {saved ? '已保存' : '保存记录'}
          </button>
          <ToolHandoffActions
            buttonClassName='button'
            className='direct-tool-handoff-actions'
            location='calendar-tool'
            record={{
              tool: '黄历节气',
              href: '/tools/calendar',
              title: `${calendar.solar} · ${calendar.ganZhi.day}日`,
              text: copyText
            }}
          />
        </div>
      </section>

      <section className='chart-section-card calendar-card'>
        <div className='chart-section-head'>
          <div>
            <span className='chart-kicker'>Calendar Fields</span>
            <h2>黄历节气</h2>
          </div>
          <span className='chart-source'>{calendar.ganZhi.year} {calendar.ganZhi.month} {calendar.ganZhi.day} {calendar.ganZhi.time}</span>
        </div>
        <div className='calendar-hero-line'>
          <div>
            <span>公历</span>
            <strong>{calendar.solar}</strong>
          </div>
          <div>
            <span>农历</span>
            <strong>{calendar.lunar}</strong>
          </div>
        </div>
        <div className='calendar-detail-grid'>
          <DetailItem label='宜' value={calendar.yi} />
          <DetailItem label='忌' value={calendar.ji} />
          <DetailItem label='冲煞' value={`${calendar.chong} / ${calendar.sha}`} />
          <DetailItem label='旬空' value={`${calendar.xun} / ${calendar.xunKong}`} />
          <DetailItem label='星宿' value={calendar.xiu} />
          <DetailItem label='生肖' value={calendar.animal} />
          <DetailItem label='年纳音' value={calendar.nayin.year} />
          <DetailItem label='月纳音' value={calendar.nayin.month} />
          <DetailItem label='日纳音' value={calendar.nayin.day} />
          <DetailItem label='时纳音' value={calendar.nayin.time} />
          <DetailItem label='彭祖' value={calendar.pengZu} />
          <DetailItem label='方位' value={`喜神${calendar.positions.xi} / 福神${calendar.positions.fu} / 财神${calendar.positions.cai}`} />
          <DetailItem label='上一节气' value={calendar.jieQi.previous} />
          <DetailItem label='下一节气' value={calendar.jieQi.next} />
        </div>
      </section>
    </div>
  )
}
