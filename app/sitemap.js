import { site, xuanTools } from '@/lib/site'

const staticRoutes = ['', '/tools']
const lastModified = new Date('2026-07-15T00:00:00+08:00')

export default function sitemap() {
  return [...staticRoutes, ...xuanTools.map(tool => tool.href)].map(route => ({
    url: `${site.domain}${route}`,
    lastModified
  }))
}
