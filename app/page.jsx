import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Blocks, CheckCircle2 } from '@/components/icons'
import { site, xuanCoreTools, xuanPrimaryWorkflows, xuanSecondaryTools, xuanTools } from '@/lib/site'

export const metadata = {
  alternates: {
    canonical: site.domain
  }
}

const qualityRules = [
  {
    title: '入口清晰',
    text: '出生盘、问事盘和资料查询分层呈现，打开页面就能进入对应工具。'
  },
  {
    title: '图片保存',
    text: '核心排盘保留图片下载，减少手动截图、裁剪和信息遗漏。'
  },
  {
    title: '字段完整',
    text: '优先打磨八字、紫微、六爻等核心盘面字段，后续工具围绕主路径补充。'
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
            <h1>
              <span>东方术数</span>
              <span>排盘工作台</span>
            </h1>
            <p>
              <span>从八字、紫微、六爻到梅花、奇门、六壬，把常用排盘入口做成一个独立工具站。</span>
              <span>结果以清晰盘面和图片下载为核心。</span>
            </p>
            <div className='xuan-hero-actions'>
              <Link className='button primary' href='/tools/bazi'>
                八字排盘
                <ArrowRight size={16} />
              </Link>
              <Link className='button' href='/tools/liuyao'>六爻排盘</Link>
              <Link className='button' href='/tools/ziwei'>紫微排盘</Link>
              <a className='button' href={site.mainSite}>回主站</a>
            </div>
          </div>

          <div className='xuan-hero-console'>
            <div className='xuan-console-head'>
              <span>Tool Desk</span>
              <strong>Ready</strong>
            </div>
            <div className='xuan-console-main'>
              <div className='xuan-console-orbit' aria-hidden='true'>
                <b>玄</b>
                <i />
                <i />
                <i />
              </div>
              <div className='xuan-console-copy'>
                <span>使用路径</span>
                <h2>出生盘、问事盘、资料层</h2>
                <p>把高频入口放在前面，资料、图解和辅助查询放到第二层，避免工具越堆越乱。</p>
              </div>
              <div className='xuan-hero-focus-list'>
                <div>
                  <span>常用工具</span>
                  <strong>{xuanCoreTools.length}</strong>
                </div>
                <div>
                  <span>资料工具</span>
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
              <span className='xuan-kicker'>Use Cases</span>
              <h2>按场景进入</h2>
            </div>
            <p>出生信息、具体事项、日期资料分别进入，页面只保留对当前场景真正有用的工具。</p>
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
              <span className='xuan-kicker'>Main Tools</span>
              <h2>核心排盘</h2>
            </div>
            <p>先把八字、紫微、六爻、梅花、奇门和六壬作为主工具打磨，其他能力围绕它们补充。</p>
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
              <span className='xuan-kicker'>References</span>
              <h2>资料与日课</h2>
            </div>
            <p>黄历、择日、五行、卦象和古籍入口放在资料层，避免干扰核心排盘。</p>
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
