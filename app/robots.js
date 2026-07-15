import { site } from '../lib/site.js'

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/']
    },
    sitemap: `${site.domain}/sitemap.xml`
  }
}
