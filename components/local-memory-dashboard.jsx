'use client'

import Link from 'next/link'
import { CheckCircle2, Copy, Star, Trash2 } from '@/components/icons'
import { copyText } from '@/lib/copy-text'
import { xuanTools } from '@/lib/site'
import { useEffect, useMemo, useState } from 'react'

const recordsKey = 'jixue-xuan-tool-records'
const favoritesKey = 'jixue-xuan-favorite-tools'

const readJson = (key, fallback) => {
  try {
    return JSON.parse(window.localStorage.getItem(key) || JSON.stringify(fallback))
  } catch {
    return fallback
  }
}

const writeJson = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value))
}

const formatTime = value => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

export function LocalMemoryDashboard() {
  const [records, setRecords] = useState([])
  const [favorites, setFavorites] = useState([])
  const [copiedId, setCopiedId] = useState('')

  useEffect(() => {
    setRecords(readJson(recordsKey, []))
    setFavorites(readJson(favoritesKey, []))
  }, [])

  const favoriteHrefs = useMemo(() => new Set(favorites.map(item => item.href)), [favorites])

  const toggleFavorite = tool => {
    const exists = favoriteHrefs.has(tool.href)
    const next = exists
      ? favorites.filter(item => item.href !== tool.href)
      : [{ title: tool.title, href: tool.href, addedAt: new Date().toISOString() }, ...favorites]
    setFavorites(next)
    writeJson(favoritesKey, next)
  }

  const removeRecord = id => {
    const next = records.filter(record => record.id !== id)
    setRecords(next)
    writeJson(recordsKey, next)
  }

  const copyRecord = async record => {
    const ok = await copyText(record.text)
    if (!ok) return
    setCopiedId(record.id)
    window.setTimeout(() => setCopiedId(''), 1800)
  }

  return (
    <div className='memory-dashboard'>
      <section className='memory-panel'>
        <div className='memory-panel-head'>
          <div>
            <span className='chart-kicker'>Favorites</span>
            <h2>收藏工具</h2>
          </div>
          <strong>{favorites.length}</strong>
        </div>
        <div className='memory-tool-grid'>
          {xuanTools.map(tool => (
            <article className='memory-tool-card' key={tool.href}>
              <div>
                <span>{tool.status}</span>
                <h3>{tool.title}</h3>
                <p>{tool.summary}</p>
              </div>
              <div className='memory-tool-actions'>
                <button className={favoriteHrefs.has(tool.href) ? 'active' : ''} type='button' onClick={() => toggleFavorite(tool)}>
                  <Star size={15} />
                  {favoriteHrefs.has(tool.href) ? '已收藏' : '收藏'}
                </button>
                <Link href={tool.href}>打开</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className='memory-panel'>
        <div className='memory-panel-head'>
          <div>
            <span className='chart-kicker'>Records</span>
            <h2>排盘记录</h2>
          </div>
          <strong>{records.length}</strong>
        </div>
        {records.length ? (
          <div className='memory-record-list'>
            {records.map(record => (
              <article className='memory-record-card' key={record.id}>
                <div>
                  <span>{record.tool} · {formatTime(record.createdAt)}</span>
                  <h3>{record.title}</h3>
                </div>
                <div className='memory-record-actions'>
                  <button type='button' onClick={() => copyRecord(record)}>
                    {copiedId === record.id ? <CheckCircle2 size={15} /> : <Copy size={15} />}
                    {copiedId === record.id ? '已复制' : '复制'}
                  </button>
                  <Link href={record.href}>打开工具</Link>
                  <button type='button' onClick={() => removeRecord(record.id)}>
                    <Trash2 size={15} />
                    删除
                  </button>
                </div>
                <pre>{record.text}</pre>
              </article>
            ))}
          </div>
        ) : (
          <div className='memory-empty'>
            <h3>还没有保存记录</h3>
            <p>打开梅花、姓名、择日、奇门等新工具，点击保存记录后会出现在这里。</p>
          </div>
        )}
      </section>
    </div>
  )
}
