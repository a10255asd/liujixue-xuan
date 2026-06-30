import { Analytics } from '@vercel/analytics/next'
import { XuanFooter, XuanHeader } from '@/components/xuan-shell'
import { site } from '@/lib/site'
import './globals.css'

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
    type: 'website'
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1
}

export default function RootLayout({ children }) {
  return (
    <html lang='zh-CN'>
      <body>
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
