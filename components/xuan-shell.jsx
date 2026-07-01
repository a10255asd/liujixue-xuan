import Link from 'next/link'
import { ArrowUpRight, Blocks } from '@/components/icons'
import { site, xuanTools } from '@/lib/site'

export function XuanHeader() {
  return (
    <header className='xuan-header'>
      <div className='xuan-container xuan-header-inner'>
        <Link className='xuan-brand' href='/'>
          <span>玄</span>
          <div>
            <strong>{site.name}</strong>
            <small>{site.cnName}</small>
          </div>
        </Link>
        <nav className='xuan-nav' aria-label='主导航'>
          <Link href='/tools'>工具</Link>
          <Link href='/tools/calendar'>黄历</Link>
          <Link href='/#knowledge'>知识</Link>
          <a href={site.mainSite}>主站</a>
          <Link className='xuan-nav-primary' href='/tools/bazi'>
            开始排盘
            <ArrowUpRight size={14} />
          </Link>
        </nav>
      </div>
    </header>
  )
}

export function XuanFooter() {
  return (
    <footer className='xuan-footer'>
      <div className='xuan-container xuan-footer-inner'>
        <div>
          <span className='xuan-kicker'><Blocks size={15} /> Field-only charting</span>
          <h2>{site.cnName}</h2>
          <p>{site.description}</p>
        </div>
        <div className='xuan-footer-links'>
          {xuanTools.map(tool => (
            <Link href={tool.href} key={tool.href}>{tool.title}</Link>
          ))}
          <a href={site.mainSite}>
            返回 Jixue Lab
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </footer>
  )
}

export function ToolPageFrame({ children, description, title }) {
  const descriptionLines = typeof description === 'string' ? description.split('\n') : [description]

  return (
    <>
      <section className='xuan-tool-hero'>
        <div className='xuan-container xuan-tool-hero-inner'>
          <div>
            <span className='xuan-kicker'>Tool / Chart</span>
            <h1>{title}</h1>
            <p>
              {descriptionLines.map((line, index) => (
                <span key={`${title}-${index}`}>{line}</span>
              ))}
            </p>
          </div>
          <div className='xuan-tool-switcher' aria-label='工具切换'>
            {xuanTools.map(tool => (
              <Link href={tool.href} key={tool.href}>
                <span>{tool.title}</span>
                <ArrowUpRight size={14} />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className='xuan-tool-workspace'>
        <div className='xuan-container'>
          {children}
        </div>
      </section>
    </>
  )
}
