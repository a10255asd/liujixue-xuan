import assert from 'node:assert/strict'
import test from 'node:test'
import robots from '../app/robots.js'
import sitemap from '../app/sitemap.js'
import {
  absoluteUrl,
  buildBreadcrumbJsonLd,
  buildItemListJsonLd,
  buildPageMetadata,
  buildSiteJsonLd,
  buildToolJsonLd
} from '../lib/seo.js'

test('xuan metadata includes canonical open graph and twitter image', () => {
  const metadata = buildPageMetadata({
    title: '八字专业细盘',
    description: '按公历、出生地和真太阳时输出四柱。',
    path: '/tools/bazi'
  })

  assert.equal(metadata.alternates.canonical, 'https://xuan.liujixue.cn/tools/bazi')
  assert.equal(metadata.openGraph.url, 'https://xuan.liujixue.cn/tools/bazi')
  assert.equal(metadata.openGraph.images[0].url, 'https://xuan.liujixue.cn/opengraph-image')
  assert.equal(metadata.twitter.card, 'summary_large_image')
  assert.deepEqual(metadata.twitter.images, ['https://xuan.liujixue.cn/opengraph-image'])
  assert.equal(metadata.keywords, undefined)
})

test('xuan json ld helpers expose site tool and breadcrumb data', () => {
  const siteJsonLd = buildSiteJsonLd()
  const toolJsonLd = buildToolJsonLd({
    title: '六爻纳甲排盘',
    description: '输出本卦、变卦和六亲字段。',
    path: '/tools/liuyao'
  })
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: '鸡血玄策', path: '/' },
    { name: '六爻纳甲排盘', path: '/tools/liuyao' }
  ])

  assert.equal(absoluteUrl('/tools/liuyao'), 'https://xuan.liujixue.cn/tools/liuyao')
  assert.equal(siteJsonLd[0]['@type'], 'WebSite')
  assert.equal(toolJsonLd['@type'], 'WebApplication')
  assert.equal(toolJsonLd.url, 'https://xuan.liujixue.cn/tools/liuyao')
  assert.equal(breadcrumbs.itemListElement.at(-1).item, 'https://xuan.liujixue.cn/tools/liuyao')
})

test('xuan robots keeps public pages open and hides API endpoints', () => {
  const config = robots()

  assert.equal(config.sitemap, 'https://xuan.liujixue.cn/sitemap.xml')
  assert.equal(config.rules.allow, '/')
  assert.deepEqual(config.rules.disallow, ['/api/'])
})

test('xuan item list json ld exposes ordered tool catalogue entries', () => {
  const jsonLd = buildItemListJsonLd({
    name: '玄学工具箱',
    description: '工具目录。',
    path: '/tools',
    items: [
      {
        title: '八字专业细盘',
        summary: '输出四柱。',
        href: '/tools/bazi'
      }
    ]
  })

  assert.equal(jsonLd['@type'], 'ItemList')
  assert.equal(jsonLd.url, 'https://xuan.liujixue.cn/tools')
  assert.equal(jsonLd.numberOfItems, 1)
  assert.equal(jsonLd.itemListElement[0].position, 1)
  assert.equal(jsonLd.itemListElement[0].url, 'https://xuan.liujixue.cn/tools/bazi')
})

test('xuan sitemap exposes unique routes with priority hints', () => {
  const entries = sitemap()
  const urls = entries.map(entry => entry.url)
  const home = entries.find(entry => entry.url === 'https://xuan.liujixue.cn')
  const tools = entries.find(entry => entry.url === 'https://xuan.liujixue.cn/tools')
  const bazi = entries.find(entry => entry.url === 'https://xuan.liujixue.cn/tools/bazi')
  const classics = entries.find(entry => entry.url === 'https://xuan.liujixue.cn/classics')
  const llms = entries.find(entry => entry.url === 'https://xuan.liujixue.cn/llms.txt')

  assert.equal(new Set(urls).size, urls.length)
  assert.ok(entries.every(entry => entry.lastModified.toISOString() === new Date('2026-07-16T00:00:00+08:00').toISOString()))
  assert.equal(home?.priority, 1)
  assert.equal(tools?.priority, 0.9)
  assert.equal(bazi?.priority, 0.85)
  assert.equal(classics?.priority, 0.75)
  assert.equal(llms?.priority, 0.4)
  assert.equal(home?.changeFrequency, 'weekly')
})
