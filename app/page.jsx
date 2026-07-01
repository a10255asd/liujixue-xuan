import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Blocks, CheckCircle2, CircleDot, Clock3 } from '@/components/icons'
import { XuanToolSuiteGrid } from '@/components/xuan-tool-suite-grid'
import { featureBlocks, knowledgeCards, scenarioCards, site, xuanComingTools, xuanTools } from '@/lib/site'

const dailyHexagram = {
  time: '今日灵感',
  title: '先排盘，再分析',
  text: '不要把结论写在工具里。先把字段排准、口径写清、文本导出，后面的判断才有基础。'
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
            <h1>排盘工作台</h1>
            <p>
              <span>八字、紫微、六爻、梅花、奇门六壬工具站。</span>
              <span>先排准字段，再导出文本和图片。</span>
            </p>
            <div className='xuan-hero-actions'>
              <Link className='button primary' href='/tools/bazi'>
                八字排盘
                <ArrowRight size={16} />
              </Link>
              <Link className='button' href='/tools/liuyao'>六爻排盘</Link>
              <Link className='button' href='/tools/calendar'>黄历节气</Link>
              <a className='button' href={site.mainSite}>回主站</a>
            </div>
          </div>

          <div className='xuan-hero-console'>
            <div className='xuan-console-head'>
              <span>Chart Console</span>
              <strong>Field Mode</strong>
            </div>
            <div className='xuan-console-main'>
              <div className='xuan-console-orbit' aria-hidden='true'>
                <b>玄</b>
                <i />
                <i />
                <i />
              </div>
              <div className='xuan-console-copy'>
                <span><Clock3 size={16} /> {dailyHexagram.time}</span>
                <h2>{dailyHexagram.title}</h2>
                <p>{dailyHexagram.text}</p>
              </div>
              <div className='xuan-console-lines' aria-hidden='true'>
                <i />
                <i className='broken' />
                <i />
                <i className='broken' />
                <i />
                <i />
              </div>
            </div>
            <div className='xuan-console-strip'>
              {xuanTools.map(tool => (
                <Link href={tool.href} key={tool.href}>
                  <span>{tool.title}</span>
                  <ArrowUpRight size={14} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className='xuan-section xuan-suite-section'>
        <div className='xuan-container'>
          <div className='xuan-section-head'>
            <div>
              <span className='xuan-kicker'>Use Cases</span>
              <h2>先选场景，再进工具</h2>
            </div>
            <p>把出生盘、问事、日课和基础资料拆成四条路径，用户不需要先理解每个术语，也能找到入口。</p>
          </div>
          <XuanToolSuiteGrid actionLabel='进入这组工具' />
        </div>
      </section>

      <section className='xuan-section' id='tools'>
        <div className='xuan-container'>
          <div className='xuan-section-head'>
            <div>
              <span className='xuan-kicker'>Tools</span>
              <h2>玄学工具箱</h2>
            </div>
            <p>对标成熟玄学工具站的功能结构，先把出生盘、问事、奇门六壬、黄历择日、资料和记录做成稳定入口。</p>
          </div>
          <div className='xuan-tool-grid'>
            {xuanTools.map((tool, index) => (
              <Link className='xuan-tool-card' href={tool.href} key={tool.href}>
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
                  开始排盘
                  <ArrowRight size={15} />
                </strong>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className='xuan-section compact'>
        <div className='xuan-container'>
          <div className='xuan-scenario-grid'>
            {scenarioCards.map(item => (
              <article className='xuan-scenario-card' key={item.title}>
                <span>{item.title}</span>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className='xuan-section compact'>
        <div className='xuan-container'>
          <div className='xuan-feature-grid'>
            {featureBlocks.map(item => (
              <article className='xuan-feature-card' key={item.title}>
                <CheckCircle2 size={18} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className='xuan-section' id='knowledge'>
        <div className='xuan-container'>
          <div className='xuan-section-head'>
            <div>
              <span className='xuan-kicker'>Knowledge</span>
              <h2>排盘口径说明</h2>
            </div>
            <p>新站先把工具边界说清楚，后续如果做 AI 解析，也要基于明确口径和可复现字段。</p>
          </div>
          <div className='xuan-knowledge-grid'>
            {knowledgeCards.map(item => (
              <article className='xuan-knowledge-card' key={item.title}>
                <CircleDot size={18} />
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
              <span className='xuan-kicker'>Roadmap</span>
              <h2>后续功能矩阵</h2>
            </div>
            <p>这些先作为站内规划露出，后续按优先级逐步做成可用工具，不让主站工具页越来越杂。</p>
          </div>
          <div className='xuan-coming-grid'>
            {xuanComingTools.map(item => (
              <article className='xuan-coming-card' key={item.title}>
                <span>{item.status}</span>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className='xuan-section compact'>
        <div className='xuan-container'>
          <div className='xuan-upgrade-panel'>
            <div>
              <span className='xuan-kicker'>Next</span>
              <h2>下一步做成可长期使用的命理工具箱</h2>
              <p>先稳定排盘、导出、历史记录和收藏，再逐步加入合盘和带边界的 AI 解读。</p>
            </div>
            <a className='button primary' href={site.mainSite}>
              从主站进入
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
