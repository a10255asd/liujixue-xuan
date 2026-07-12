'use client'

import { Download } from '@/components/icons'
import { downloadChartImage } from '@/lib/chart-image-export'
import { recordToolEvent } from '@/lib/liujixue-api'
import { track } from '@vercel/analytics'
import { useState } from 'react'

function getVisitorId() {
  if (typeof window === 'undefined') return ''
  const storageKey = 'liujixue_xuan_visitor_id'
  const nextId = `visitor-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

  try {
    const existing = window.localStorage.getItem(storageKey)
    if (existing) return existing
    window.localStorage.setItem(storageKey, nextId)
  } catch (error) {
    return nextId
  }

  return nextId
}

function ChartImageButton({ imageDownloader = downloadChartImage, imageLabel = '下载排盘图片', location, payload }) {
  const [downloaded, setDownloaded] = useState(false)
  const [failed, setFailed] = useState(false)

  const downloadImage = async () => {
    setFailed(false)
    const ok = await imageDownloader(payload)

    if (!ok) {
      setFailed(true)
      return
    }

    track('chart_image_download', {
      chart: payload.title,
      location
    })
    recordToolEvent({
      eventType: 'chart_image_download',
      toolCode: payload.toolCode || location || 'chart',
      sourceSite: 'xuan',
      sourcePath: typeof window === 'undefined' ? '' : window.location.pathname,
      visitorId: getVisitorId(),
      metadata: {
        title: payload.title,
        subtitle: payload.subtitle,
        location,
        filename: payload.filename || ''
      }
    }).catch(() => {})
    setDownloaded(true)
    window.setTimeout(() => setDownloaded(false), 1800)
  }

  return (
    <button className='button chart-export-action-button' type='button' onClick={downloadImage}>
      <Download size={16} />
      {failed ? '下载失败' : downloaded ? '图片已下载' : imageLabel}
    </button>
  )
}

export function ChartExportActions({
  imageDownloader,
  imageLabel,
  location,
  payload
}) {
  return (
    <div className='chart-export-actions'>
      <ChartImageButton imageDownloader={imageDownloader} imageLabel={imageLabel} location={location} payload={payload} />
    </div>
  )
}

export function ChartExportPanel({ location, payload }) {
  return (
    <section className='chart-export-card'>
      <div className='chart-export-head'>
        <div>
          <span className='chart-kicker'>Chart Export</span>
          <h2>{payload.title}</h2>
          <p>{payload.subtitle}</p>
        </div>
        <ChartExportActions location={location} payload={payload} />
      </div>

      {payload.badges?.length > 0 && (
        <div className='chart-export-badges'>
          {payload.badges.map(badge => <span key={badge}>{badge}</span>)}
        </div>
      )}

      <div className='chart-export-section-list'>
        {payload.sections.map(section => (
          <section className='chart-export-section' key={section.title}>
            <h3>{section.title}</h3>
            <dl>
              {section.rows.map(row => (
                <div className='chart-export-row' key={`${section.title}-${row.label}`}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      {payload.footer && <p className='chart-export-footer'>{payload.footer}</p>}
    </section>
  )
}
