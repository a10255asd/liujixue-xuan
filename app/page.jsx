import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Blocks, CheckCircle2 } from '@/components/icons'
import {
  site,
  xuanCoreTools,
  xuanPracticalOutcomes,
  xuanPrimaryWorkflows,
  xuanSecondaryTools,
  xuanTools
} from '@/lib/site'

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
      <div className='xuan-workflow-outcome'>
        <CheckCircle2 size={15} />
        <span>{workflow.outcome}</span>
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

function OutcomeCard({ outcome, index }) {
  const outcomeTools = outcome.toolHrefs.map(href => toolsByHref.get(href)).filter(Boolean)

  return (
    <article className='xuan-outcome-card'>
      <div className='xuan-outcome-card-head'>
        <span>{String(index + 1).padStart(2, '0')}</span>
        <em>可带走</em>
      </div>
      <h3>{outcome.title}</h3>
      <p>{outcome.summary}</p>
      <div className='xuan-outcome-output-list'>
        {outcome.outputs.map(item => (
          <span key={item}>
            <CheckCircle2 size={14} />
            {item}
          </span>
        ))}
      </div>
      <div className='xuan-outcome-tool-row'>
        {outcomeTools.map(tool => <Link href={tool.href} key={tool.href}>{tool.title}</Link>)}
      </div>
      <Link className='xuan-suite-primary' href={outcome.href}>
        {outcome.action}
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
              <span>排盘记录</span>
              <span>择日工作台</span>
            </h1>
            <p>
              <span>不只把字段排出来，而是把出生档案、问事记录、择日候选和资料速查整理成可复查的材料。</span>
              <span>所有结果以结构化盘面、图片下载和口径说明为核心。</span>
            </p>
            <div className='xuan-hero-actions'>
              <Link className='button primary' href='/tools/bazi'>
                建立出生档案
                <ArrowRight size={16} />
              </Link>
              <Link className='button' href='/tools/liuyao'>问事记录</Link>
              <Link className='button' href='/tools/date-selection'>择日候选</Link>
              <Link className='button' href='/classics'>资料速查</Link>
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
                <span>任务闭环</span>
                <h2>输入、核对、导出、复盘</h2>
                <p>每条路径都先收集必要信息，再给出结构化结果和下一步入口，避免工具越堆越乱。</p>
              </div>
              <div className='xuan-hero-focus-list'>
                <div>
                  <span>实用路径</span>
                  <strong>{xuanPrimaryWorkflows.length}</strong>
                </div>
                <div>
                  <span>已上线入口</span>
                  <strong>{xuanTools.length}</strong>
                </div>
                <div>
                  <span>可带走材料</span>
                  <strong>{xuanPracticalOutcomes.length}</strong>
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
              <h2>先选要完成的事</h2>
            </div>
            <p>把工具入口压到任务路径里：出生信息、具体事项、日期候选和资料来源分别处理，避免一上来就面对一整排术语。</p>
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
              <span className='xuan-kicker'>Outputs</span>
              <h2>实际能带走什么</h2>
            </div>
            <p>把“排出来看看”变成“留下一份可复查材料”：字段、输入口径、候选清单和导出图片都围绕复用来组织。</p>
          </div>
          <div className='xuan-outcome-grid'>
            {xuanPracticalOutcomes.map((outcome, index) => <OutcomeCard index={index} key={outcome.title} outcome={outcome} />)}
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
