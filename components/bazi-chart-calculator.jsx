'use client'

import { RefreshCcw } from '@/components/icons'
import { TermExplanationPanel } from '@/components/chart-annotation-panels'
import { ChartExportActions } from '@/components/chart-export-panel'
import { baZiGenderOptions, baZiSectOptions, baZiYunSectOptions, calculateBaZiChart, defaultBaZiInput } from '@/lib/bazi-chart'
import {
  getAreaOptions,
  getBirthPlaceSelection,
  getCityOptions,
  getDefaultSelectionForProvince,
  getProvinceOptions
} from '@/lib/birth-place-options'
import { downloadBaZiFineChartImage } from '@/lib/chart-image-export'
import {
  buildBaZiExportPayload,
  baziTermExplanations,
  buildBaZiCopyText
} from '@/lib/traditional-chart-annotations'
import { useEffect, useMemo, useRef, useState } from 'react'

const numberFields = [
  { key: 'year', label: '出生年份', min: 1900, max: 2100, step: 1, suffix: '年', wide: true, maxLength: 4 },
  { key: 'month', label: '月份', min: 1, max: 12, step: 1, suffix: '月', maxLength: 2 },
  { key: 'day', label: '日期', min: 1, max: 31, step: 1, suffix: '日', maxLength: 2 },
  { key: 'hour', label: '小时', min: 0, max: 23, step: 1, suffix: '时', maxLength: 2 },
  { key: 'minute', label: '分钟', min: 0, max: 59, step: 1, suffix: '分', maxLength: 2 }
]

const elementClassMap = {
  木: 'wood',
  火: 'fire',
  土: 'earth',
  金: 'metal',
  水: 'water'
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const sanitizeNumberDraft = value => String(value).replace(/\D/g, '')

const normalizeNumberValue = (field, value) => {
  if (value === '') return ''
  const number = Math.trunc(Number(value))
  if (!Number.isFinite(number)) return ''
  return clamp(number, field.min, field.max)
}

const getChartValue = (form, field) => {
  const value = form[field.key]
  if (value === '') return defaultBaZiInput[field.key]
  if (field.key === 'year' && String(value).length < 4) return defaultBaZiInput.year
  return value
}

const normalizeFormForChart = form => ({
  ...form,
  ...Object.fromEntries(
    numberFields.map(field => [field.key, getChartValue(form, field)])
  )
})

function NumberField({ field, value, onChange, onCommit }) {
  return (
    <div className={`chart-field ${field.wide ? 'wide' : ''}`}>
      <label htmlFor={`bazi-${field.key}`}>{field.label}</label>
      <div className='chart-number-control'>
        <input
          id={`bazi-${field.key}`}
          type='text'
          inputMode={field.step && field.step < 1 ? 'decimal' : 'numeric'}
          maxLength={field.maxLength}
          autoComplete='off'
          value={value}
          onChange={event => onChange(field, event.target.value)}
          onBlur={event => onCommit(field, event.target.value)}
        />
        <span>{field.suffix}</span>
      </div>
    </div>
  )
}

function BirthPlaceSelect({ areaOptions, cityOptions, form, onAreaChange, onCityChange, onProvinceChange, provinceOptions }) {
  return (
    <div className='chart-field wide'>
      <label>出生地</label>
      <div className='chart-location-select-grid'>
        <select
          aria-label='选择省份'
          value={form.birthProvinceCode}
          onChange={event => onProvinceChange(event.target.value)}>
          {provinceOptions.map(option => (
            <option key={option.code} value={option.code}>{option.name}</option>
          ))}
        </select>
        <select
          aria-label='选择城市'
          value={form.birthCityCode}
          onChange={event => onCityChange(event.target.value)}>
          {cityOptions.map(option => (
            <option key={option.code} value={option.code}>{option.name}</option>
          ))}
        </select>
        <select
          aria-label='选择区县'
          value={form.birthAreaCode}
          onChange={event => onAreaChange(event.target.value)}>
          {areaOptions.map(option => (
            <option key={option.code} value={option.code}>{option.name}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

function SegmentedControl({ label, value, options, onChange }) {
  return (
    <div className='chart-field wide'>
      <label>{label}</label>
      <div className='chart-segmented-control'>
        {options.map(option => (
          <button
            className={`chart-segment-button ${String(value) === String(option.value) ? 'active' : ''}`}
            key={option.value}
            type='button'
            onClick={() => onChange(option.value)}>
            <strong>{option.label}</strong>
            <span>{option.description}</span>
          </button>
        ))}
      </div>
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

function DetailRow({ label, value }) {
  return (
    <div className='chart-detail-row'>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

function ElementSymbol({ value, element }) {
  return <strong className={`bazi-element-symbol ${elementClassMap[element] || ''}`}>{value}</strong>
}

function FineCellList({ items }) {
  const displayItems = items.length > 0 ? items : ['-']

  return (
    <div className='bazi-fine-cell-list'>
      {displayItems.map(item => <span key={item}>{item}</span>)}
    </div>
  )
}

function BaZiFineTable({ copyText, exportPayload, result }) {
  const rows = [
    {
      label: '日期',
      render: pillar => pillar.label
    },
    {
      label: '主星',
      render: pillar => pillar.key === 'day' ? '日元' : pillar.shiShenGan
    },
    {
      label: '天干',
      className: 'major',
      render: pillar => <ElementSymbol value={pillar.gan} element={pillar.ganElement} />
    },
    {
      label: '地支',
      className: 'major',
      render: pillar => <ElementSymbol value={pillar.zhi} element={pillar.zhiElement} />
    },
    {
      label: '藏干',
      render: pillar => (
        <FineCellList
          items={pillar.hideGan.map((gan, index) => `${gan}${pillar.shiShenZhi[index] || ''}`)}
        />
      )
    },
    {
      label: '副星',
      render: pillar => <FineCellList items={pillar.shiShenZhi} />
    },
    {
      label: '星运',
      render: pillar => pillar.diShi
    },
    {
      label: '自坐',
      render: pillar => pillar.selfDiShi
    },
    {
      label: '空亡',
      render: pillar => pillar.xunKong
    },
    {
      label: '纳音',
      render: pillar => pillar.naYin
    },
    {
      label: '神煞',
      render: pillar => <FineCellList items={pillar.shenSha} />
    }
  ]

  return (
    <section className='chart-section-card bazi-fine-chart-card'>
      <div className='chart-section-head'>
        <div>
          <span className='chart-kicker'>Detailed Chart</span>
          <h2>专业细盘</h2>
        </div>
        <div className='bazi-fine-actions'>
          <span className='chart-source'>四柱 / 神煞 / 大运 / 流年</span>
          <ChartExportActions
            copyLabel='复制细盘文本'
            copiedLabel='已复制细盘'
            copyText={copyText}
            imageDownloader={downloadBaZiFineChartImage}
            imageLabel='下载专业细盘'
            location='bazi-fine-chart'
            payload={exportPayload}
            templateTitle='八字专业细盘 AI 解析包'
            textLabel='下载细盘文本'
          />
        </div>
      </div>
      <div className='bazi-fine-table-wrap'>
        <table className='bazi-fine-table'>
          <tbody>
            {rows.map(row => (
              <tr className={row.className || ''} key={row.label}>
                <th scope='row'>{row.label}</th>
                {result.pillars.map(pillar => (
                  <td key={`${row.label}-${pillar.key}`}>{row.render(pillar)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <BaZiLuckPanel result={result} />
    </section>
  )
}

function LuckCard({ item }) {
  const yearText = item.endYear ? `${item.startYear}-${item.endYear}` : item.year
  const ageText = item.endAge ? `${item.startAge}-${item.endAge}岁` : `${item.age}岁`
  const mainText = item.label || item.ganZhi

  return (
    <article className={`bazi-luck-card ${item.active ? 'active' : ''}`}>
      <span>{yearText}</span>
      <strong className={elementClassMap[item.ganElement] || ''}>{mainText}</strong>
      <em>{ageText}</em>
      {item.shiShenGan && <small>{item.shiShenGan}</small>}
    </article>
  )
}

function BaZiLuckSection({ items, subtitle, title }) {
  return (
    <section className='bazi-luck-section'>
      <div className='bazi-luck-head'>
        <h3>{title}</h3>
        <span>{subtitle}</span>
      </div>
      <div className='bazi-luck-grid'>
        {items.map(item => (
          <LuckCard key={`${title}-${item.index}-${item.year || item.startYear}`} item={item} />
        ))}
      </div>
    </section>
  )
}

function BaZiLuckPanel({ result }) {
  const daYunSubtitle = result.yunStart.solarText
    ? `${result.yunStart.text} · 交运 ${result.yunStart.solarText}`
    : result.yunStart.text
  const liuNianSubtitle = result.currentDaYun
    ? `${result.currentDaYun.label} ${result.currentDaYun.startYear}-${result.currentDaYun.endYear}`
    : '当前大运内流年'

  return (
    <div className='bazi-luck-panel'>
      <BaZiLuckSection items={result.daYun} subtitle={daYunSubtitle} title='大运' />
      <BaZiLuckSection items={result.liuNian} subtitle={liuNianSubtitle} title='流年' />
    </div>
  )
}

function PillarToken({ pillar }) {
  return (
    <div className='bazi-pillar-token'>
      <span>{pillar.label}</span>
      <strong>{pillar.ganZhi}</strong>
    </div>
  )
}

function ElementMeter({ item }) {
  const percent = `${Math.round((item.count / 8) * 100)}%`

  return (
    <div className='element-meter'>
      <div className='element-meter-head'>
        <span>{item.element}</span>
        <strong>{item.count}</strong>
      </div>
      <div className='element-meter-track'>
        <span style={{ width: percent }} />
      </div>
    </div>
  )
}

export function BaZiChartCalculator() {
  const [form, setForm] = useState(defaultBaZiInput)
  const resolvedPlaceRef = useRef(defaultBaZiInput.birthPlace)
  const [locationState, setLocationState] = useState({
    status: 'success',
    message: `真太阳时排盘 · 经度 ${defaultBaZiInput.birthLongitude}° / 纬度 ${defaultBaZiInput.birthLatitude}°`
  })
  const provinceOptions = useMemo(() => getProvinceOptions(), [])
  const cityOptions = useMemo(() => getCityOptions(form.birthProvinceCode), [form.birthProvinceCode])
  const areaOptions = useMemo(() => getAreaOptions(form.birthProvinceCode, form.birthCityCode), [form.birthProvinceCode, form.birthCityCode])
  const chartInput = useMemo(() => normalizeFormForChart(form), [form])
  const result = useMemo(() => calculateBaZiChart(chartInput), [chartInput])
  const copyText = useMemo(() => buildBaZiCopyText(result), [result])
  const exportPayload = useMemo(() => buildBaZiExportPayload(result), [result])

  useEffect(() => {
    const place = String(form.birthPlace || '').trim()
    if (!place || resolvedPlaceRef.current === place) return undefined

    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setLocationState({
        status: 'loading',
        message: '正在计算出生地经纬度...'
      })

      try {
        const response = await fetch(`/api/geocode?address=${encodeURIComponent(place)}`, {
          signal: controller.signal
        })
        const data = await response.json()

        if (!response.ok) throw new Error(data?.error || '地址解析失败')

        setForm(current => {
          if (current.birthPlace !== place) return current
          return {
            ...current,
            birthLongitude: data.longitude,
            birthLatitude: data.latitude,
            timeMode: 'trueSolar'
          }
        })
        resolvedPlaceRef.current = place
        setLocationState({
          status: 'success',
          message: `真太阳时排盘 · 经度 ${data.longitude}° / 纬度 ${data.latitude}°`
        })
      } catch (error) {
        if (error.name === 'AbortError') return
        setLocationState({
          status: 'error',
          message: error.message || '地址解析失败，暂用上一次经纬度排盘'
        })
      }
    }, 250)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [form.birthPlace])

  const setNumberDraft = (field, value) => {
    setForm(current => ({
      ...current,
      [field.key]: sanitizeNumberDraft(value).slice(0, field.maxLength)
    }))
  }

  const commitNumberValue = (field, value) => {
    setForm(current => ({
      ...current,
      [field.key]: normalizeNumberValue(field, value)
    }))
  }

  const setValue = (key, value) => {
    setForm(current => ({
      ...current,
      [key]: value
    }))
  }

  const applyBirthPlaceSelection = selection => {
    if (!selection) return
    resolvedPlaceRef.current = ''
    setLocationState({
      status: 'loading',
      message: '正在计算出生地经纬度...'
    })
    setForm(current => ({
      ...current,
      birthProvinceCode: selection.provinceCode,
      birthCityCode: selection.cityCode,
      birthAreaCode: selection.areaCode,
      birthPlace: selection.value,
      timeMode: 'trueSolar'
    }))
  }

  const setBirthProvince = provinceCode => {
    applyBirthPlaceSelection(getDefaultSelectionForProvince(provinceCode))
  }

  const setBirthCity = cityCode => {
    const firstArea = getAreaOptions(form.birthProvinceCode, cityCode)[0]
    applyBirthPlaceSelection(getBirthPlaceSelection(form.birthProvinceCode, cityCode, firstArea?.code || ''))
  }

  const setBirthArea = areaCode => {
    applyBirthPlaceSelection(getBirthPlaceSelection(form.birthProvinceCode, form.birthCityCode, areaCode))
  }

  return (
    <div className='chart-tool bazi-chart-tool'>
      <aside className='chart-side-panel'>
        <div className='chart-panel-head'>
          <div>
            <span className='chart-kicker'>BaZi Chart</span>
            <h2>出生信息</h2>
          </div>
          <button className='chart-reset-button' type='button' onClick={() => setForm(defaultBaZiInput)} aria-label='恢复默认参数'>
            <RefreshCcw size={16} />
          </button>
        </div>

        <div className='chart-form-grid'>
          {numberFields.map(field => (
            <NumberField
              key={field.key}
              field={field}
              value={form[field.key]}
              onChange={setNumberDraft}
              onCommit={commitNumberValue}
            />
          ))}

          <BirthPlaceSelect
            areaOptions={areaOptions}
            cityOptions={cityOptions}
            form={form}
            provinceOptions={provinceOptions}
            onAreaChange={setBirthArea}
            onCityChange={setBirthCity}
            onProvinceChange={setBirthProvince}
          />
          <div className={`chart-location-status ${locationState.status}`}>
            {locationState.message}
          </div>

          <SegmentedControl
            label='性别'
            value={form.gender}
            options={baZiGenderOptions}
            onChange={value => setValue('gender', value)}
          />

          <SegmentedControl
            label='子时换日口径'
            value={form.sect}
            options={baZiSectOptions}
            onChange={value => setValue('sect', value)}
          />

          <SegmentedControl
            label='起运算法口径'
            value={form.yunSect}
            options={baZiYunSectOptions}
            onChange={value => setValue('yunSect', value)}
          />
        </div>
      </aside>

      <section className='chart-result-panel'>
        <div className='bazi-summary-card'>
          <div className='bazi-summary-main'>
            <span className='chart-kicker'>四柱</span>
            <strong>{result.eightCharText}</strong>
          </div>
          <div className='chart-summary-grid'>
            <SummaryItem label='日主' value={result.dayMaster} />
            <SummaryItem label='命宫' value={`${result.mingGong} ${result.mingGongNaYin}`} />
            <SummaryItem label='身宫' value={`${result.shenGong} ${result.shenGongNaYin}`} />
          </div>
        </div>

        <div className='bazi-pillar-strip'>
          {result.pillars.map(pillar => <PillarToken key={pillar.key} pillar={pillar} />)}
        </div>

        <section className='chart-section-card'>
          <div className='chart-section-head'>
            <div>
              <span className='chart-kicker'>Calendar</span>
              <h2>历法信息</h2>
            </div>
            <span className='chart-source'>公历 / 农历</span>
          </div>
          <dl className='chart-detail-list compact'>
            <DetailRow label='输入时间' value={result.solarText} />
            <DetailRow label='排盘时间' value={result.chartSolarText} />
            <DetailRow label='农历' value={result.lunarText} />
            <DetailRow
              label='出生地'
              value={`${result.input.birthPlace || '未填写'} / 经度 ${result.input.birthLongitude}° / 纬度 ${result.input.birthLatitude}°`}
            />
            <DetailRow
              label='时间修正'
              value={`真太阳时 ${result.timeAdjustment.offsetMinutes > 0 ? '+' : ''}${result.timeAdjustment.offsetMinutes} 分钟`}
            />
            <DetailRow label='胎元' value={`${result.taiYuan} ${result.taiYuanNaYin}`} />
            <DetailRow label='胎息' value={`${result.taiXi} ${result.taiXiNaYin}`} />
          </dl>
        </section>

        <BaZiFineTable copyText={copyText} exportPayload={exportPayload} result={result} />

        <section className='chart-section-card'>
          <div className='chart-section-head'>
            <div>
              <span className='chart-kicker'>Elements</span>
              <h2>显性五行计数</h2>
            </div>
          </div>
          <div className='element-meter-grid'>
            {result.elementCounts.map(item => <ElementMeter key={item.element} item={item} />)}
          </div>
        </section>

        <TermExplanationPanel terms={baziTermExplanations} />
      </section>
    </div>
  )
}
