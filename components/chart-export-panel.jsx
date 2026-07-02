'use client'

import { CheckCircle2, Download, Save } from '@/components/icons'
import { TemplateCopyButton } from '@/components/template-copy-button'
import { downloadChartImage } from '@/lib/chart-image-export'
import { saveMemoryRecord } from '@/lib/local-memory'
import { track } from '@vercel/analytics'
import { useState } from 'react'

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

function ChartTextButton({ location, payload, text, textLabel = '下载 AI 文本' }) {
  const [downloaded, setDownloaded] = useState(false)

  const downloadText = () => {
    const filename = payload.textFilename || payload.filename.replace(/\.png$/, '.txt')
    const url = `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    track('chart_text_download', {
      chart: payload.title,
      location
    })
    setDownloaded(true)
    window.setTimeout(() => setDownloaded(false), 1800)
  }

  return (
    <button className='button chart-export-action-button' type='button' onClick={downloadText}>
      <Download size={16} />
      {downloaded ? '文本已下载' : textLabel}
    </button>
  )
}

function ChartSaveButton({ location, payload, text }) {
  const [saved, setSaved] = useState(false)

  const saveRecord = () => {
    saveMemoryRecord({
      tool: payload.title,
      href: window.location.pathname,
      title: payload.subtitle || payload.title,
      text
    })

    track('chart_record_save', {
      chart: payload.title,
      location
    })
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1800)
  }

  return (
    <button className='button chart-export-action-button' type='button' onClick={saveRecord}>
      {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
      {saved ? '已保存' : '保存记录'}
    </button>
  )
}

export function ChartExportActions({
  copiedLabel = '已复制解析包',
  copyLabel = '复制 AI 解析包',
  copyText,
  failedLabel = '复制受限',
  imageDownloader,
  imageLabel,
  location,
  payload,
  templateTitle,
  textLabel
}) {
  return (
    <div className='chart-export-actions'>
      <TemplateCopyButton
        className='button chart-export-action-button'
        copiedLabel={copiedLabel}
        failedLabel={failedLabel}
        idleLabel={copyLabel}
        location={location}
        templateTitle={templateTitle}
        text={copyText}
      />
      <ChartTextButton location={location} payload={payload} text={copyText} textLabel={textLabel} />
      <ChartSaveButton location={location} payload={payload} text={copyText} />
      <ChartImageButton imageDownloader={imageDownloader} imageLabel={imageLabel} location={location} payload={payload} />
    </div>
  )
}

export function ChartExportPanel({ copyText, location, payload, templateTitle }) {
  return (
    <section className='chart-export-card'>
      <div className='chart-export-head'>
        <div>
          <span className='chart-kicker'>AI Export</span>
          <h2>{payload.title}</h2>
          <p>{payload.subtitle}</p>
        </div>
        <ChartExportActions copyText={copyText} location={location} payload={payload} templateTitle={templateTitle} />
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
