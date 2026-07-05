import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Blocks, CheckCircle2 } from '@/components/icons'
import { site, xuanCoreTools, xuanPrimaryWorkflows, xuanSecondaryTools, xuanTools } from '@/lib/site'

const qualityRules = [
  {
    title: '按用途进入',
    text: '从出生排盘、问事起卦、记录接力三条路径开始，更快找到合适入口。'
  },
  {
    title: '结果可带走',
    text: '排盘字段、图片和提示词都可以保存，方便复查、整理和继续提问。'
  },
  {
    title: '只做材料',
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
            <h1>排盘、记录和 AI 接力工具</h1>
            <p>
              <span>从八字、紫微、六爻开始生成可复核的排盘字段。</span>
              <span>把结果保存到记录中心，再整理成适合继续提问的 AI 提示词。</span>
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
                <h2>先选场景，再开工具</h2>
                <p>按出生排盘、问事起卦、记录接力进入。工具页保留完整入口，方便继续补充材料。</p>
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
              <h2>三条常用路径</h2>
            </div>
            <p>不用先理解所有术语，按当前要处理的事情进入：出生排盘、问事起卦、记录接力。</p>
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
              <h2>常用排盘与接力工具</h2>
            </div>
            <p>完成排盘、对照、保存、AI 提示词和多材料合参，适合一次性整理出可继续使用的材料。</p>
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
              <h2>辅助资料工具</h2>
            </div>
            <p>这些入口适合补充日课、时辰、五行、卦象、塔罗和其他材料，配合主路径一起使用。</p>
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
