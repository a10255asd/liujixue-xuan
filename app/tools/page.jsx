import Link from 'next/link'
import { JsonLd } from '@/components/json-ld'
import { ArrowRight, ArrowUpRight, Blocks, CircleDot } from '@/components/icons'
import { site, xuanCoreTools, xuanPrimaryWorkflows, xuanSecondaryTools } from '@/lib/site'
import { buildBreadcrumbJsonLd, buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: '玄学工具箱',
  description: '鸡血玄策工具总览，包含八字、紫微、六爻、梅花、奇门六壬和辅助资料工具。',
  path: '/tools'
})

const breadcrumbItems = [
  { name: '鸡血玄策', path: '/' },
  { name: '工具', path: '/tools' }
]

function ToolCard({ tool, index }) {
  return (
    <Link className='xuan-tool-card' href={tool.href}>
      <div className='xuan-tool-card-top'>
        <span>{String(index + 1).padStart(2, '0')}</span>
        <em>{tool.status}</em>
      </div>
      <h3>{tool.title}</h3>
      <p>{tool.summary}</p>
      <div className='xuan-tool-tags'>
        {tool.tags.map(tag => <em key={tag}>{tag}</em>)}
      </div>
      <strong>
        打开工具
        <ArrowRight size={15} />
      </strong>
    </Link>
  )
}

export default function ToolsIndexPage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems)} />
      <section className='xuan-tool-index-hero'>
        <div className='xuan-container xuan-tool-index-inner'>
          <div>
            <span className='xuan-kicker'><Blocks size={16} /> Tools</span>
            <h1>玄学工具箱</h1>
            <p>按用途选择入口：先完成排盘和图片下载，需要时再补充日课、时辰、五行和卦象资料。</p>
          </div>
          <div className='xuan-tool-index-panel'>
            <span>Tools</span>
            <strong>{xuanCoreTools.length}</strong>
            <em>常用入口</em>
          </div>
        </div>
      </section>

      <section className='xuan-section'>
        <div className='xuan-container'>
          <div className='xuan-section-head'>
            <div>
              <span className='xuan-kicker'>Workflows</span>
              <h2>按任务进入</h2>
            </div>
            <p>如果不知道该开哪个工具，先选任务路径。每条路径都会带你完成排盘、核对和导出。</p>
          </div>
          <div className='xuan-workflow-strip'>
            {xuanPrimaryWorkflows.map(workflow => (
              <Link className='xuan-workflow-strip-item' href={workflow.href} key={workflow.title}>
                <span>{workflow.eyebrow}</span>
                <strong>{workflow.title}</strong>
                <em>{workflow.checkpoints.join(' / ')}</em>
                <ArrowRight size={15} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className='xuan-section compact'>
        <div className='xuan-container'>
          <div className='xuan-section-head'>
            <div>
              <span className='xuan-kicker'>Main Tools</span>
              <h2>常用工具</h2>
            </div>
            <p>常用入口覆盖出生排盘、问事排盘、奇门六壬和资料查询。</p>
          </div>
          <div className='xuan-tool-grid xuan-core-tool-grid'>
            {xuanCoreTools.map((tool, index) => <ToolCard index={index} key={tool.href} tool={tool} />)}
          </div>
        </div>
      </section>

      <section className='xuan-section compact'>
        <div className='xuan-container'>
          <div className='xuan-section-head'>
            <div>
              <span className='xuan-kicker'>References</span>
              <h2>辅助资料工具</h2>
            </div>
            <p>这些工具用于补充日课、时辰、五行、卦象、塔罗和其他材料，结果以图片下载为主。</p>
          </div>
          <div className='xuan-secondary-tool-list'>
            {xuanSecondaryTools.map(tool => (
              <Link className='xuan-secondary-tool-link' href={tool.href} key={tool.href}>
                <span>{tool.title}</span>
                <em>{tool.summary}</em>
                <ArrowUpRight size={14} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className='xuan-section compact'>
        <div className='xuan-container'>
          <div className='xuan-upgrade-panel'>
            <div>
              <span className='xuan-kicker'><CircleDot size={15} /> Main Site</span>
              <h2>主站负责展示，玄学站负责工具</h2>
              <p>主站展示项目和服务，玄学站提供排盘、图片下载和资料整理入口。</p>
            </div>
            <a className='button primary' href={site.mainSite}>
              返回主站
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
