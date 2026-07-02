'use client'

import Link from 'next/link'
import { CheckCircle2, Copy, Download, Star, Trash2 } from '@/components/icons'
import { copyText } from '@/lib/copy-text'
import {
  favoritesKey,
  mergeMemoryFavorites,
  mergeMemoryRecords,
  readMemory,
  recordsKey,
  writeMemory
} from '@/lib/local-memory'
import { xuanTools } from '@/lib/site'
import { useEffect, useMemo, useRef, useState } from 'react'

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
  const [query, setQuery] = useState('')
  const [toolFilter, setToolFilter] = useState('all')
  const [favoriteOnly, setFavoriteOnly] = useState(false)
  const [importStatus, setImportStatus] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    setRecords(readMemory(recordsKey, []))
    setFavorites(readMemory(favoritesKey, []))
  }, [])

  const favoriteHrefs = useMemo(() => new Set(favorites.map(item => item.href)), [favorites])
  const favoriteTools = useMemo(() => xuanTools.filter(tool => favoriteHrefs.has(tool.href)), [favoriteHrefs])
  const recordTools = useMemo(() => [...new Set(records.map(record => record.tool).filter(Boolean))], [records])
  const filteredRecords = useMemo(() => {
    const keyword = query.trim().toLowerCase()

    return records.filter(record => {
      const matchesTool = toolFilter === 'all' || record.tool === toolFilter
      const matchesFavorite = !favoriteOnly || favoriteHrefs.has(record.href)
      const text = `${record.tool} ${record.title} ${record.text}`.toLowerCase()
      const matchesQuery = !keyword || text.includes(keyword)
      return matchesTool && matchesFavorite && matchesQuery
    })
  }, [favoriteHrefs, favoriteOnly, query, records, toolFilter])

  const toggleFavorite = tool => {
    const exists = favoriteHrefs.has(tool.href)
    const next = exists
      ? favorites.filter(item => item.href !== tool.href)
      : [{ title: tool.title, href: tool.href, addedAt: new Date().toISOString() }, ...favorites]
    setFavorites(next)
    writeMemory(favoritesKey, next)
  }

  const removeRecord = id => {
    const next = records.filter(record => record.id !== id)
    setRecords(next)
    writeMemory(recordsKey, next)
  }

  const copyRecord = async record => {
    const ok = await copyText(record.text)
    if (!ok) return
    setCopiedId(record.id)
    window.setTimeout(() => setCopiedId(''), 1800)
  }

  const exportMemory = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      records,
      favorites
    }
    const url = `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(payload, null, 2))}`
    const link = document.createElement('a')
    link.href = url
    link.download = `jixue-xuan-records-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const importMemory = async event => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const payload = JSON.parse(await file.text())
      const importedRecords = Array.isArray(payload) ? payload : payload.records
      const importedFavorites = Array.isArray(payload?.favorites) ? payload.favorites : []
      const nextRecords = mergeMemoryRecords(records, Array.isArray(importedRecords) ? importedRecords : [])
      const nextFavorites = mergeMemoryFavorites(favorites, importedFavorites)

      setRecords(nextRecords)
      setFavorites(nextFavorites)
      writeMemory(recordsKey, nextRecords)
      writeMemory(favoritesKey, nextFavorites)
      setImportStatus(`已导入 ${nextRecords.length} 条记录 / ${nextFavorites.length} 个收藏`)
    } catch {
      setImportStatus('导入失败，请检查 JSON 文件')
    } finally {
      event.target.value = ''
      window.setTimeout(() => setImportStatus(''), 2400)
    }
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
        {favoriteTools.length ? (
          <div className='memory-favorite-strip'>
            {favoriteTools.map(tool => (
              <Link href={tool.href} key={tool.href}>{tool.title}</Link>
            ))}
          </div>
        ) : null}
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
        <div className='memory-filter-bar'>
          <div className='chart-field'>
            <label htmlFor='record-search'>搜索记录</label>
            <input
              className='chart-text-input'
              id='record-search'
              placeholder='搜索工具、标题或字段'
              value={query}
              onChange={event => setQuery(event.target.value)}
            />
          </div>
          <div className='chart-field'>
            <label htmlFor='record-tool-filter'>工具筛选</label>
            <select id='record-tool-filter' value={toolFilter} onChange={event => setToolFilter(event.target.value)}>
              <option value='all'>全部工具</option>
              {recordTools.map(tool => <option key={tool} value={tool}>{tool}</option>)}
            </select>
          </div>
          <button className={favoriteOnly ? 'active' : ''} type='button' onClick={() => setFavoriteOnly(current => !current)}>
            <Star size={15} />
            {favoriteOnly ? '已筛收藏' : '只看收藏'}
          </button>
          <button type='button' onClick={exportMemory}>
            <Download size={15} />
            导出 JSON
          </button>
          <button type='button' onClick={() => fileInputRef.current?.click()}>
            <Copy size={15} />
            导入 JSON
          </button>
          <input ref={fileInputRef} accept='application/json' hidden type='file' onChange={importMemory} />
        </div>
        {importStatus ? <div className='memory-import-status'>{importStatus}</div> : null}
        {filteredRecords.length ? (
          <div className='memory-record-list'>
            {filteredRecords.map(record => (
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
            <h3>{records.length ? '没有匹配记录' : '还没有保存记录'}</h3>
            <p>{records.length ? '换个关键词、工具筛选或关闭只看收藏再试。' : '打开梅花、姓名、择日、奇门、八字、紫微或六爻，点击保存记录后会出现在这里。'}</p>
          </div>
        )}
      </section>
    </div>
  )
}
