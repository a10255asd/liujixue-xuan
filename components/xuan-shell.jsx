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
          <Link href='/#tools'>工具</Link>
          <Link href='/#knowledge'>知识</Link>
          <a href={site.mainSite}>主站</a>
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
  return (
    <>
      <section className='xuan-tool-hero'>
        <div className='xuan-container'>
          <span className='xuan-kicker'>Tool / Chart</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </section>
      <section className='section'>
        <div className='container'>
          {children}
        </div>
      </section>
    </>
  )
}
