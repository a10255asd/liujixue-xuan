import { ArrowUpRight, Blocks } from '@/components/icons'
import { JsonLd } from '@/components/json-ld'
import { TrackedLink } from '@/components/tracked-link'
import { XuanMobileNav } from '@/components/xuan-mobile-nav'
import { buildBreadcrumbJsonLd, buildToolJsonLd } from '@/lib/seo'
import { site, xuanCoreTools, xuanTools, xuanToolSuites } from '@/lib/site'

export function XuanHeader() {
  return (
    <header className='xuan-header'>
      <div className='xuan-container xuan-header-inner'>
        <TrackedLink
          className='xuan-brand'
          href='/'
          eventName='xuan_nav_click'
          eventProps={{ label: site.name, location: 'brand' }}>
          <span>玄</span>
          <div>
            <strong>{site.name}</strong>
            <small>{site.cnName}</small>
          </div>
        </TrackedLink>
        <nav className='xuan-nav' aria-label='主导航'>
          <TrackedLink href='/tools' eventName='xuan_nav_click' eventProps={{ label: '工具', location: 'desktop_nav' }}>工具</TrackedLink>
          <TrackedLink href='/classics' eventName='xuan_nav_click' eventProps={{ label: '古籍', location: 'desktop_nav' }}>古籍</TrackedLink>
          <TrackedLink href='/knowledge' eventName='xuan_nav_click' eventProps={{ label: '图解', location: 'desktop_nav' }}>图解</TrackedLink>
          <TrackedLink href={site.mainSite} eventName='xuan_nav_click' eventProps={{ label: '主站', location: 'desktop_nav' }}>主站</TrackedLink>
          <TrackedLink className='xuan-nav-primary' href='/tools/bazi' eventName='xuan_nav_click' eventProps={{ label: '开始排盘', location: 'desktop_nav' }}>
            开始排盘
            <ArrowUpRight size={14} />
          </TrackedLink>
        </nav>
        <XuanMobileNav />
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
            <TrackedLink
              href={tool.href}
              eventName='xuan_footer_click'
              eventProps={{ label: tool.title }}
              key={tool.href}>
              {tool.title}
            </TrackedLink>
          ))}
          <TrackedLink href='/tools' eventName='xuan_footer_click' eventProps={{ label: '全部工具' }}>全部工具</TrackedLink>
          <TrackedLink href={site.mainSite} eventName='xuan_footer_click' eventProps={{ label: '返回主站' }}>
            返回 Jixue Lab
            <ArrowUpRight size={14} />
          </TrackedLink>
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
  const currentDescription = currentTool?.summary ?? descriptionLines.join(' ')
  const breadcrumbItems = [
    { name: site.cnName, path: '/' },
    { name: '工具', path: '/tools' },
    { name: currentTool?.title ?? title, path: currentTool?.href ?? '/tools' }
  ]
  const jsonLd = currentTool
    ? [
        buildToolJsonLd({
          title: currentTool.title,
          description: currentDescription,
          path: currentTool.href
        }),
        buildBreadcrumbJsonLd(breadcrumbItems)
      ]
    : buildBreadcrumbJsonLd(breadcrumbItems)

  return (
    <>
      <JsonLd data={jsonLd} />
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
            <p>{currentDescription}</p>
            {currentTool?.tags?.length ? (
              <div className='xuan-tool-panel-tags'>
                {currentTool.tags.map(tag => <span key={tag}>{tag}</span>)}
              </div>
            ) : null}
            <div className='xuan-tool-related'>
              <span>同组工具</span>
              {relatedTools.map(tool => (
                <TrackedLink
                  aria-current={tool.href === currentTool?.href ? 'page' : undefined}
                  href={tool.href}
                  eventName='xuan_related_tool_click'
                  eventProps={{ label: tool.title, location: currentTool?.href ?? title }}
                  key={tool.href}>
                  {tool.title}
                  <ArrowUpRight size={13} />
                </TrackedLink>
              ))}
              <TrackedLink href='/tools' eventName='xuan_related_tool_click' eventProps={{ label: '全部工具', location: currentTool?.href ?? title }}>
                全部工具
                <ArrowUpRight size={13} />
              </TrackedLink>
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
