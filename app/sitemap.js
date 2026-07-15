import { site, xuanCoreHrefs, xuanTools } from '../lib/site.js'

const staticRoutes = ['', '/tools', '/llms.txt']
const lastModified = new Date('2026-07-16T00:00:00+08:00')

function changeFrequencyFor(route) {
  if (route === '' || route === '/tools') return 'weekly'
  return 'monthly'
}

function priorityFor(route) {
  if (route === '') return 1
  if (route === '/tools') return 0.9
  if (xuanCoreHrefs.includes(route)) return 0.85
  if (route === '/classics' || route === '/knowledge') return 0.75
  if (route === '/llms.txt') return 0.4
  return 0.7
}

export default function sitemap() {
  return [...new Set([...staticRoutes, ...xuanTools.map(tool => tool.href)])].map(route => ({
    url: `${site.domain}${route}`,
    lastModified,
    changeFrequency: changeFrequencyFor(route),
    priority: priorityFor(route)
  }))
}
