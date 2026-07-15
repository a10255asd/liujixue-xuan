import { site } from './site.js'

export const siteUrl = site.domain
export const ogImagePath = '/opengraph-image'

export function absoluteUrl(path = '/') {
  return new URL(path, siteUrl).toString()
}

export function buildPageMetadata({ title, description, path = '/', keywords = [] }) {
  const url = absoluteUrl(path)
  const image = absoluteUrl(ogImagePath)

  return {
    title,
    description,
    ...(keywords.length > 0 ? { keywords } : {}),
    alternates: {
      canonical: url
    },
    openGraph: {
      title: `${title} | ${site.cnName}`,
      description,
      url,
      siteName: site.cnName,
      type: 'website',
      locale: 'zh_CN',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${site.cnName} ${title}`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${site.cnName}`,
      description,
      images: [image]
    }
  }
}

export function buildSiteJsonLd() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: site.cnName,
      alternateName: site.name,
      url: siteUrl,
      description: site.description,
      inLanguage: 'zh-CN',
      publisher: {
        '@type': 'Person',
        name: '刘鸡血',
        url: site.mainSite
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: site.cnName,
      url: siteUrl,
      sameAs: [site.mainSite]
    }
  ]
}

export function buildBreadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  }
}

export function buildToolJsonLd({ title, description, path }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: title,
    description,
    url: absoluteUrl(path),
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web',
    inLanguage: 'zh-CN',
    author: {
      '@type': 'Person',
      name: '刘鸡血',
      url: site.mainSite
    }
  }
}
