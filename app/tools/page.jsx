import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Blocks, CircleDot } from '@/components/icons'
import { site, xuanCoreTools, xuanPrimaryWorkflows, xuanSecondaryTools } from '@/lib/site'

export const metadata = {
  title: '玄学工具箱',
  description: '鸡血玄策核心工具总览，优先展示八字、紫微、六爻、记录、AI 接力和综合合参。'
}

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
      <section className='xuan-tool-index-hero'>
        <div className='xuan-container xuan-tool-index-inner'>
          <div>
            <span className='xuan-kicker'><Blocks size={16} /> Tools</span>
            <h1>核心工具优先</h1>
            <p>不再把所有功能平铺给用户。先完成排盘、保存、AI 接力和合参，再从实验区挑真正值得打磨的工具。</p>
          </div>
          <div className='xuan-tool-index-panel'>
            <span>Core</span>
            <strong>{xuanCoreTools.length}</strong>
            <em>优先打磨</em>
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
            <p>如果不知道该开哪个工具，先选任务路径。工具箱的重点是完成一次可复核的流程，而不是展示很多按钮。</p>
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
              <span className='xuan-kicker'>Core</span>
              <h2>核心工具</h2>
            </div>
            <p>这些入口承担站点主要价值，后续 UI、输入体验、导出质量和移动端体验优先围绕它们优化。</p>
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
              <span className='xuan-kicker'>Lab</span>
              <h2>实验和资料工具</h2>
            </div>
            <p>这些工具先作为辅助材料存在，不再和核心排盘入口同级展示。后续只把真实高频、有质量空间的工具提升到核心区。</p>
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
              <p>玄学站现在切到质量阶段：收缩入口、打磨主流程，再逐步决定哪些实验工具值得继续做深。</p>
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
