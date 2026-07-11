'use client'

import { RefreshCcw } from '@/components/icons'
import { TermExplanationPanel } from '@/components/chart-annotation-panels'
import { ChartExportActions } from '@/components/chart-export-panel'
import { calculateZiWeiChart, defaultZiWeiInput, ziWeiExampleInputs, ziWeiGenderOptions, ziWeiSectOptions } from '@/lib/ziwei-chart'
import {
  getAreaOptions,
  getBirthPlaceSelection,
  getCityOptions,
  getDefaultSelectionForProvince,
  getProvinceOptions
} from '@/lib/birth-place-options'
import { downloadZiWeiFineChartImage } from '@/lib/chart-image-export'
import {
  buildZiWeiExportPayload,
  ziweiTermExplanations
} from '@/lib/traditional-chart-annotations'
import { useEffect, useMemo, useRef, useState } from 'react'

const numberFields = [
  { key: 'year', label: '出生年份', min: 1900, max: 2100, step: 1, suffix: '年', wide: true, maxLength: 4 },
  { key: 'month', label: '月份', min: 1, max: 12, step: 1, suffix: '月', maxLength: 2 },
  { key: 'day', label: '日期', min: 1, max: 31, step: 1, suffix: '日', maxLength: 2 },
  { key: 'hour', label: '小时', min: 0, max: 23, step: 1, suffix: '时', maxLength: 2 },
  { key: 'minute', label: '分钟', min: 0, max: 59, step: 1, suffix: '分', maxLength: 2 }
]

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const sanitizeNumberDraft = value => String(value).replace(/\D/g, '')
const palaceGridPositions = {
  巳: { gridColumn: '1', gridRow: '1' },
  午: { gridColumn: '2', gridRow: '1' },
  未: { gridColumn: '3', gridRow: '1' },
  申: { gridColumn: '4', gridRow: '1' },
  辰: { gridColumn: '1', gridRow: '2' },
  酉: { gridColumn: '4', gridRow: '2' },
  卯: { gridColumn: '1', gridRow: '3' },
  戌: { gridColumn: '4', gridRow: '3' },
  寅: { gridColumn: '1', gridRow: '4' },
  丑: { gridColumn: '2', gridRow: '4' },
  子: { gridColumn: '3', gridRow: '4' },
  亥: { gridColumn: '4', gridRow: '4' }
}

const normalizeNumberValue = (field, value) => {
  if (value === '') return ''
  const number = Math.trunc(Number(value))
  if (!Number.isFinite(number)) return ''
  return clamp(number, field.min, field.max)
}

const getChartValue = (form, field) => {
  const value = form[field.key]
  if (value === '') return defaultZiWeiInput[field.key]
  if (field.key === 'year' && String(value).length < 4) return defaultZiWeiInput.year
  return value
}

const normalizeFormForChart = form => ({
  ...form,
  ...Object.fromEntries(
    numberFields.map(field => [field.key, getChartValue(form, field)])
  )
})

const formatSignedMinutes = value => `${value > 0 ? '+' : ''}${value} 分钟`

function NumberField({ field, value, onChange, onCommit }) {
  return (
    <div className={`chart-field ${field.wide ? 'wide' : ''}`}>
      <label htmlFor={`ziwei-${field.key}`}>{field.label}</label>
      <div className='chart-number-control'>
        <input
          id={`ziwei-${field.key}`}
          type='text'
          inputMode='numeric'
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
            className={`chart-segment-button ${value === option.value ? 'active' : ''}`}
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

function ZiWeiExamplePicker({ examples, onApply }) {
  return (
    <div className='chart-example-panel'>
      <div className='chart-example-head'>
        <span>快速试盘</span>
        <strong>先用样例看完整命盘</strong>
      </div>
      <div className='chart-example-list'>
        {examples.map(example => (
          <button
            className='chart-example-button'
            key={example.id}
            type='button'
            onClick={() => onApply(example)}>
            <strong>{example.label}</strong>
            <span>{example.description}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function ZiWeiInputAudit({ result }) {
  const rows = [
    {
      label: '输入',
      value: `${result.solarText} · ${result.input.gender}`
    },
    {
      label: '出生地',
      value: result.input.birthPlace || '未选择'
    },
    {
      label: '排盘',
      value: `${result.chartSolarText} · 真太阳时 ${formatSignedMinutes(result.timeAdjustment.offsetMinutes)}`
    },
    {
      label: '命盘',
      value: `${result.fiveElementsClass} · ${result.time} · 命主 ${result.soul}`
    }
  ]

  return (
    <div className='chart-input-audit'>
      <div className='chart-input-audit-head'>
        <span>核对</span>
        <strong>导出前先看这几项</strong>
      </div>
      <dl>
        {rows.map(row => (
          <div key={row.label}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
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

function PalaceFineCell({ palace }) {
  const decadal = palace.decadal?.range?.join('-') || '未取'

  return (
    <article
      className={`ziwei-fine-palace ${palace.isMingPalace ? 'is-ming' : ''} ${palace.isBodyPalace ? 'is-body' : ''}`}
      style={palaceGridPositions[palace.earthlyBranch] || undefined}>
      <div className='ziwei-fine-palace-head'>
        <span>{palace.heavenlyStem}{palace.earthlyBranch}</span>
        <strong>{palace.name}</strong>
        <div>
          {palace.isMingPalace && <em>命</em>}
          {palace.isBodyPalace && <em>身</em>}
        </div>
      </div>
      <div className='ziwei-fine-main-stars'>
        {(palace.majorStars.length > 0 ? palace.majorStars : ['空宫']).map(star => (
          <strong className={palace.majorStars.length > 0 ? '' : 'muted'} key={star}>{star}</strong>
        ))}
      </div>
      <div className='ziwei-fine-star-lines'>
        <span>辅：{palace.minorStars.join('、') || '无'}</span>
        {palace.adjectiveStars.length > 0 && <span>杂：{palace.adjectiveStars.join('、')}</span>}
      </div>
      <dl className='ziwei-fine-palace-meta'>
        <DetailRow label='长生' value={palace.changsheng12} />
        <DetailRow label='博士' value={palace.boshi12} />
        <DetailRow label='岁前' value={palace.suiqian12} />
        <DetailRow label='将前' value={palace.jiangqian12} />
        <DetailRow label='大限' value={`${decadal}岁`} />
      </dl>
    </article>
  )
}

function ZiWeiFineChart({ exportPayload, result }) {
  return (
    <section className='chart-section-card ziwei-fine-chart-card'>
      <div className='chart-section-head'>
        <div>
          <span className='chart-kicker'>Natal Chart</span>
          <h2>专业命盘</h2>
        </div>
        <div className='ziwei-fine-actions'>
          <span className='chart-source'>十二宫 / 星曜 / 大限 / 真太阳时</span>
          <ChartExportActions
            imageDownloader={downloadZiWeiFineChartImage}
            imageLabel='下载专业命盘'
            location='ziwei-fine-chart'
            payload={exportPayload}
          />
        </div>
      </div>

      <div className='ziwei-fine-chart-wrap'>
        <div className='ziwei-fine-chart-grid'>
          {result.palaces.map(palace => <PalaceFineCell key={`${palace.index}-${palace.name}`} palace={palace} />)}
          <div className='ziwei-fine-center'>
            <span className='chart-kicker'>Core</span>
            <h3>{result.fiveElementsClass}</h3>
            <dl className='chart-detail-list compact'>
              <DetailRow label='输入' value={result.solarText} />
              <DetailRow label='排盘' value={result.chartSolarText} />
              <DetailRow label='农历' value={result.lunarDate} />
              <DetailRow label='四柱' value={result.chineseDate} />
              <DetailRow label='命主' value={result.soul} />
              <DetailRow label='身主' value={result.body} />
              <DetailRow label='出生地' value={result.input.birthPlace || '未填写'} />
              <DetailRow
                label='修正'
                value={`真太阳时 ${result.timeAdjustment.offsetMinutes > 0 ? '+' : ''}${result.timeAdjustment.offsetMinutes} 分钟`}
              />
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}

function ZiWeiWorkflowCard({ result }) {
  const mingPosition = `${result.mingPalace?.heavenlyStem || ''}${result.mingPalace?.earthlyBranch || ''}` || '未取'
  const bodyPosition = `${result.bodyPalace?.heavenlyStem || ''}${result.bodyPalace?.earthlyBranch || ''}` || '未取'
  const checkpoints = [
    {
      label: '核对输入',
      value: `${result.input.birthPlace || '未选择'} · ${result.solarText}`
    },
    {
      label: '确认命盘',
      value: `${result.fiveElementsClass} · 命宫 ${mingPosition} · 身宫 ${bodyPosition}`
    },
    {
      label: '下载结果',
      value: '核对无误后下载专业命盘图片'
    }
  ]

  return (
    <section className='chart-section-card chart-workflow-card'>
      <div className='chart-section-head'>
        <div>
          <span className='chart-kicker'>Workflow</span>
          <h2>排盘核对</h2>
        </div>
        <span className='chart-source'>核对 / 下载</span>
      </div>
      <div className='chart-workflow-steps'>
        {checkpoints.map((item, index) => (
          <article key={item.label}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{item.label}</strong>
            <p>{item.value}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export function ZiWeiChartCalculator() {
  const [form, setForm] = useState(defaultZiWeiInput)
  const resolvedPlaceRef = useRef(defaultZiWeiInput.birthPlace)
  const [locationState, setLocationState] = useState({
    status: 'success',
    message: `真太阳时排盘 · 经度 ${defaultZiWeiInput.birthLongitude}° / 纬度 ${defaultZiWeiInput.birthLatitude}°`
  })
  const provinceOptions = useMemo(() => getProvinceOptions(), [])
  const cityOptions = useMemo(() => getCityOptions(form.birthProvinceCode), [form.birthProvinceCode])
  const areaOptions = useMemo(() => getAreaOptions(form.birthProvinceCode, form.birthCityCode), [form.birthProvinceCode, form.birthCityCode])
  const chartInput = useMemo(() => normalizeFormForChart(form), [form])
  const result = useMemo(() => calculateZiWeiChart(chartInput), [chartInput])
  const exportPayload = useMemo(() => buildZiWeiExportPayload(result), [result])

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

  const setResolvedForm = nextInput => {
    const nextForm = {
      ...defaultZiWeiInput,
      ...nextInput,
      timeMode: nextInput.timeMode || 'trueSolar'
    }

    resolvedPlaceRef.current = nextForm.birthPlace
    setLocationState({
      status: 'success',
      message: `真太阳时排盘 · 经度 ${nextForm.birthLongitude}° / 纬度 ${nextForm.birthLatitude}°`
    })
    setForm(nextForm)
  }

  const resetForm = () => {
    setResolvedForm(defaultZiWeiInput)
  }

  const applyExample = example => {
    setResolvedForm(example.input)
  }

  return (
    <div className='chart-tool ziwei-chart-tool'>
      <aside className='chart-side-panel'>
        <div className='chart-panel-head'>
          <div>
            <span className='chart-kicker'>Zi Wei Chart</span>
            <h2>出生信息</h2>
          </div>
          <button className='chart-reset-button' type='button' onClick={resetForm} aria-label='恢复默认参数'>
            <RefreshCcw size={16} />
          </button>
        </div>

        <ZiWeiExamplePicker examples={ziWeiExampleInputs} onApply={applyExample} />

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

          <ZiWeiInputAudit result={result} />

          <SegmentedControl
            label='性别'
            value={form.gender}
            options={ziWeiGenderOptions}
            onChange={value => setValue('gender', value)}
          />

          <SegmentedControl
            label='子时换日口径'
            value={form.sect}
            options={ziWeiSectOptions}
            onChange={value => setValue('sect', value)}
          />

          <div className='chart-field wide'>
            <label htmlFor='ziwei-fix-leap'>闰月处理</label>
            <select
              id='ziwei-fix-leap'
              value={form.fixLeap ? 'true' : 'false'}
              onChange={event => setValue('fixLeap', event.target.value === 'true')}>
              <option value='true'>修正闰月</option>
              <option value='false'>不修正闰月</option>
            </select>
          </div>
        </div>
      </aside>

      <section className='chart-result-panel'>
        <div className='ziwei-summary-card'>
          <div className='ziwei-summary-main'>
            <span className='chart-kicker'>本命盘</span>
            <strong>{result.fiveElementsClass}</strong>
            <p>{result.lunarDate} · {result.time} {result.timeRange}</p>
          </div>
          <div className='chart-summary-grid'>
            <SummaryItem label='四柱' value={result.chineseDate} />
            <SummaryItem label='命宫' value={`${result.mingPalace?.heavenlyStem || ''}${result.mingPalace?.earthlyBranch || ''}`} />
            <SummaryItem label='身宫' value={result.bodyPalace?.name || '未取'} />
            <SummaryItem label='排盘口径' value='真太阳时' />
          </div>
        </div>

        <section className='chart-section-card'>
          <div className='chart-section-head'>
            <div>
              <span className='chart-kicker'>Overview</span>
              <h2>命盘概要</h2>
            </div>
            <span className='chart-source'>本命盘字段</span>
          </div>
          <dl className='chart-detail-list compact'>
            <DetailRow label='输入时间' value={result.solarText} />
            <DetailRow label='排盘时间' value={result.chartSolarText} />
            <DetailRow label='农历' value={result.lunarDate} />
            <DetailRow label='生肖' value={result.zodiac} />
            <DetailRow label='星座' value={result.sign} />
            <DetailRow label='命主' value={result.soul} />
            <DetailRow label='身主' value={result.body} />
            <DetailRow
              label='出生地'
              value={`${result.input.birthPlace || '未填写'} / 经度 ${result.input.birthLongitude}° / 纬度 ${result.input.birthLatitude}°`}
            />
            <DetailRow
              label='时间修正'
              value={`真太阳时 ${result.timeAdjustment.offsetMinutes > 0 ? '+' : ''}${result.timeAdjustment.offsetMinutes} 分钟`}
            />
            <DetailRow label='命宫地支' value={result.earthlyBranchOfSoulPalace} />
            <DetailRow label='身宫地支' value={result.earthlyBranchOfBodyPalace} />
          </dl>
        </section>

        <ZiWeiWorkflowCard result={result} />

        <ZiWeiFineChart exportPayload={exportPayload} result={result} />

        <TermExplanationPanel terms={ziweiTermExplanations} />
      </section>
    </div>
  )
}
