'use client'

import { ChartExportActions } from '@/components/chart-export-panel'
import { RefreshCcw } from '@/components/icons'
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

const buildImagePayload = calendar => ({
  title: '黄历节气',
  subtitle: `${calendar.solar} · ${calendar.lunar}`,
  badges: [
    `${calendar.ganZhi.year}年`,
    `${calendar.ganZhi.month}月`,
    `${calendar.ganZhi.day}日`,
    `${calendar.ganZhi.time}时`
  ],
  filename: `calendar-${calendar.solar.slice(0, 10)}.png`,
  sections: [
    {
      title: '日期信息',
      rows: [
        { label: '公历', value: calendar.solar },
        { label: '农历', value: calendar.lunar },
        { label: '四柱', value: `${calendar.ganZhi.year}年 ${calendar.ganZhi.month}月 ${calendar.ganZhi.day}日 ${calendar.ganZhi.time}时` },
        { label: '纳音', value: `${calendar.nayin.year} / ${calendar.nayin.month} / ${calendar.nayin.day} / ${calendar.nayin.time}` }
      ]
    },
    {
      title: '黄历字段',
      rows: [
        { label: '宜', value: calendar.yi },
        { label: '忌', value: calendar.ji },
        { label: '冲煞', value: `${calendar.chong} / ${calendar.sha}` },
        { label: '旬空', value: `${calendar.xun} / ${calendar.xunKong}` },
        { label: '星宿', value: calendar.xiu },
        { label: '生肖', value: calendar.animal },
        { label: '彭祖', value: calendar.pengZu },
        { label: '方位', value: `喜神${calendar.positions.xi} / 福神${calendar.positions.fu} / 财神${calendar.positions.cai}` },
        { label: '上一节气', value: calendar.jieQi.previous },
        { label: '下一节气', value: calendar.jieQi.next }
      ]
    }
  ]
})

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
  const calendar = useMemo(() => buildCalendar(form), [form])
  const imagePayload = useMemo(() => buildImagePayload(calendar), [calendar])

  const updateForm = (key, value) => {
    setForm(current => ({ ...current, [key]: value }))
  }

  const resetNow = () => {
    setForm({ date: todayDate(), time: currentTime() })
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
          <ChartExportActions imageLabel='下载排盘图片' payload={imagePayload} />
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
