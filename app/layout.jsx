import { Analytics } from '@vercel/analytics/next'
import localFont from 'next/font/local'
import { JsonLd } from '@/components/json-ld'
import { XuanFooter, XuanHeader } from '@/components/xuan-shell'
import { buildSiteJsonLd, ogImagePath } from '@/lib/seo'
import { site } from '@/lib/site'
import './globals.css'

const displaySerif = localFont({
  src: './fonts/NotoSerifSC-VF.subset.woff2',
  variable: '--font-display',
  display: 'swap',
  weight: '200 900'
})

export const metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: `${site.cnName} | ${site.name}`,
    template: `%s | ${site.cnName}`
  },
  description: site.description,
  openGraph: {
    title: `${site.cnName} | ${site.name}`,
    description: site.description,
    url: site.domain,
    siteName: site.cnName,
    type: 'website',
    locale: 'zh_CN',
    images: [
      {
        url: ogImagePath,
        width: 1200,
        height: 630,
        alt: `${site.cnName} ${site.name}`
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.cnName} | ${site.name}`,
    description: site.description,
    images: [ogImagePath]
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f4efe6',
  colorScheme: 'light'
}

export default function RootLayout({ children }) {
  return (
    <html lang='zh-CN'>
      <body className={displaySerif.variable}>
        <JsonLd data={buildSiteJsonLd()} />
        <div className='xuan-shell'>
          <XuanHeader />
          <main>{children}</main>
          <XuanFooter />
        </div>
        <Analytics />
      </body>
    </html>
  )
}
