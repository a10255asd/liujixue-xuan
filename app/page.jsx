import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Blocks, CheckCircle2 } from '@/components/icons'
import { site, xuanCoreTools, xuanPrimaryWorkflows, xuanSecondaryTools, xuanTools } from '@/lib/site'

const qualityRules = [
  {
    title: '核心优先',
    text: '首页只推出生排盘、问事起卦、记录接力三条主流程，弱工具不再抢注意力。'
  },
  {
    title: '结果可复核',
    text: '核心工具必须能导出字段、图片或提示词，方便保存、复查和交给其他 AI 接手。'
  },
  {
    title: '不写假结论',
    text: '站内只做排盘、材料整理和口径记录，不直接输出吉凶、应期或确定性判断。'
  }
]

const toolsByHref = new Map(xuanTools.map(tool => [tool.href, tool]))

function WorkflowCard({ workflow, index }) {
  const supportingTools = workflow.supportingHrefs.map(href => toolsByHref.get(href)).filter(Boolean)

  return (
    <article className='xuan-primary-workflow-card'>
      <div className='xuan-primary-workflow-head'>
        <span>{workflow.eyebrow}</span>
        <em>{String(index + 1).padStart(2, '0')}</em>
      </div>
      <h3>{workflow.title}</h3>
      <p>{workflow.summary}</p>
      <div className='xuan-workflow-checkpoints'>
        {workflow.checkpoints.map(item => <span key={item}>{item}</span>)}
      </div>
      <div className='xuan-workflow-supporting'>
        {supportingTools.map(tool => (
          <Link href={tool.href} key={tool.href}>
            {tool.title}
            <ArrowUpRight size={13} />
          </Link>
        ))}
      </div>
      <Link className='xuan-suite-primary' href={workflow.href}>
        {workflow.action}
        <ArrowRight size={15} />
      </Link>
    </article>
  )
}

function ToolCard({ tool, index, label = '打开工具' }) {
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
        {label}
        <ArrowRight size={15} />
      </strong>
    </Link>
  )
}

export default function HomePage() {
  return (
    <>
      <section className='xuan-hero'>
        <div className='xuan-hero-scene' aria-hidden='true'>
          <span>甲</span>
          <span>乙</span>
          <span>丙</span>
          <span>丁</span>
          <span>戊</span>
          <span>己</span>
        </div>
        <div className='xuan-container xuan-hero-inner'>
          <div className='xuan-hero-copy'>
            <span className='xuan-kicker'><Blocks size={16} /> 鸡血玄策</span>
            <h1>先把核心排盘做扎实</h1>
            <p>
              <span>不再堆工具。先打磨八字、紫微、六爻、记录和 AI 接力。</span>
              <span>其他工具收进实验区，作为材料补充，不抢主流程。</span>
            </p>
            <div className='xuan-hero-actions'>
              <Link className='button primary' href='/tools/bazi'>
                八字排盘
                <ArrowRight size={16} />
              </Link>
              <Link className='button' href='/tools/liuyao'>六爻排盘</Link>
              <Link className='button' href='/tools/records'>记录接力</Link>
              <a className='button' href={site.mainSite}>回主站</a>
            </div>
          </div>

          <div className='xuan-hero-console'>
            <div className='xuan-console-head'>
              <span>Focus Mode</span>
              <strong>Quality First</strong>
            </div>
            <div className='xuan-console-main'>
              <div className='xuan-console-orbit' aria-hidden='true'>
                <b>玄</b>
                <i />
                <i />
                <i />
              </div>
              <div className='xuan-console-copy'>
                <span>当前策略</span>
                <h2>核心工具优先</h2>
                <p>首页只露出主流程，工具页再提供完整入口。先让真正会用的人能顺畅完成一次排盘、保存和接力。</p>
              </div>
              <div className='xuan-hero-focus-list'>
                <div>
                  <span>核心工具</span>
                  <strong>{xuanCoreTools.length}</strong>
                </div>
                <div>
                  <span>实验/资料</span>
                  <strong>{xuanSecondaryTools.length}</strong>
                </div>
                <div>
                  <span>主流程</span>
                  <strong>{xuanPrimaryWorkflows.length}</strong>
                </div>
              </div>
            </div>
            <div className='xuan-console-strip'>
              {xuanCoreTools.map(tool => (
                <Link href={tool.href} key={tool.href}>
                  <span>{tool.title}</span>
                  <ArrowUpRight size={14} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className='xuan-section'>
        <div className='xuan-container'>
          <div className='xuan-section-head'>
            <div>
              <span className='xuan-kicker'>Primary Workflows</span>
              <h2>只保留三条主路径</h2>
            </div>
            <p>用户进来不需要先理解二十多个术语，先按真实任务走：出生排盘、问事起卦、记录接力。</p>
          </div>
          <div className='xuan-primary-workflow-grid'>
            {xuanPrimaryWorkflows.map((workflow, index) => <WorkflowCard index={index} key={workflow.title} workflow={workflow} />)}
          </div>
        </div>
      </section>

      <section className='xuan-section compact'>
        <div className='xuan-container'>
          <div className='xuan-section-head'>
            <div>
              <span className='xuan-kicker'>Core Tools</span>
              <h2>核心工具先打磨</h2>
            </div>
            <p>这些是站点主产品：排盘、对照、保存、AI 接力和合参。后续优化优先围绕它们展开。</p>
          </div>
          <div className='xuan-tool-grid xuan-core-tool-grid'>
            {xuanCoreTools.map((tool, index) => <ToolCard index={index} key={tool.href} tool={tool} />)}
          </div>
        </div>
      </section>

      <section className='xuan-section compact'>
        <div className='xuan-container'>
          <div className='xuan-quality-grid'>
            {qualityRules.map(item => (
              <article className='xuan-quality-card' key={item.title}>
                <CheckCircle2 size={18} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className='xuan-section compact'>
        <div className='xuan-container'>
          <div className='xuan-section-head'>
            <div>
              <span className='xuan-kicker'>Lab</span>
              <h2>实验工具先收起来</h2>
            </div>
            <p>这些功能仍然保留，但不再作为首页重点。它们只作为资料、辅助或后续打磨候选。</p>
          </div>
          <div className='xuan-secondary-tool-list'>
            {xuanSecondaryTools.map(tool => (
              <Link className='xuan-secondary-tool-link' href={tool.href} key={tool.href}>
                <span>{tool.title}</span>
                <em>{tool.tags.slice(0, 2).join(' / ')}</em>
                <ArrowUpRight size={14} />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
