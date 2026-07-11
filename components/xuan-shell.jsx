import Link from 'next/link'
import { ArrowUpRight, Blocks } from '@/components/icons'
import { site, xuanCoreTools, xuanTools, xuanToolSuites } from '@/lib/site'

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
          <Link href='/classics'>古籍</Link>
          <Link href='/knowledge'>图解</Link>
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
          {xuanCoreTools.map(tool => (
            <Link href={tool.href} key={tool.href}>{tool.title}</Link>
          ))}
          <Link href='/tools'>全部工具</Link>
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
  const currentTool = xuanTools.find(tool => tool.title === title)
  const currentSuite = currentTool
    ? xuanToolSuites.find(suite => suite.toolHrefs.includes(currentTool.href))
    : null
  const relatedTools = currentSuite
    ? currentSuite.toolHrefs.map(href => xuanTools.find(tool => tool.href === href)).filter(Boolean)
    : xuanTools.slice(0, 3)

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
          <div className='xuan-tool-panel'>
            <div className='xuan-tool-panel-head'>
              <span>{currentSuite?.eyebrow ?? 'Tool'}</span>
              <em>{currentTool?.status ?? '已上线'}</em>
            </div>
            <strong>{currentSuite?.title ?? '工具工作台'}</strong>
            <p>{currentTool?.summary ?? descriptionLines.join(' ')}</p>
            {currentTool?.tags?.length ? (
              <div className='xuan-tool-panel-tags'>
                {currentTool.tags.map(tag => <span key={tag}>{tag}</span>)}
              </div>
            ) : null}
            <div className='xuan-tool-related'>
              <span>同组工具</span>
              {relatedTools.map(tool => (
                <Link
                  aria-current={tool.href === currentTool?.href ? 'page' : undefined}
                  href={tool.href}
                  key={tool.href}>
                  {tool.title}
                  <ArrowUpRight size={13} />
                </Link>
              ))}
              <Link href='/tools'>
                全部工具
                <ArrowUpRight size={13} />
              </Link>
            </div>
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
