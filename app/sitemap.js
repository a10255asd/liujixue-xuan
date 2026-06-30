import { site, xuanTools } from '@/lib/site'

const staticRoutes = ['']

export default function sitemap() {
  return [...staticRoutes, ...xuanTools.map(tool => tool.href)].map(route => ({
    url: `${site.domain}${route}`,
    lastModified: new Date()
  }))
}
