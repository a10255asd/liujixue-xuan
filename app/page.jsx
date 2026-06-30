import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Blocks, CheckCircle2, Clock3 } from '@/components/icons'
import { featureBlocks, knowledgeCards, site, xuanTools } from '@/lib/site'

const dailyHexagram = {
  time: '今日灵感',
  title: '先排盘，再分析',
  text: '不要把结论写在工具里。先把字段排准、口径写清、文本导出，后面的判断才有基础。'
}

export default function HomePage() {
  return (
    <>
      <section className='xuan-hero'>
        <div className='xuan-container xuan-hero-inner'>
          <div className='xuan-hero-copy'>
            <span className='xuan-kicker'><Blocks size={16} /> Eastern charting lab</span>
            <h1>东方命理排盘工具站</h1>
            <p>把八字、紫微斗数和六爻从个人主站拆出来，独立做成一个轻量工具箱。第一版只做准确排盘、文本导出和字段整理，不做夸张断语。</p>
            <div className='xuan-hero-actions'>
              <Link className='button primary' href='/tools/bazi'>
                八字排盘
                <ArrowRight size={16} />
              </Link>
              <Link className='button' href='/tools/liuyao'>六爻排盘</Link>
              <a className='button' href={site.mainSite}>回主站</a>
            </div>
          </div>
          <div className='xuan-oracle-panel'>
            <div className='xuan-oracle-head'>
              <span>{dailyHexagram.time}</span>
              <Clock3 size={18} />
            </div>
            <h2>{dailyHexagram.title}</h2>
            <p>{dailyHexagram.text}</p>
            <div className='xuan-oracle-lines' aria-hidden='true'>
              <i />
              <i className='broken' />
              <i />
              <i className='broken' />
              <i />
              <i />
            </div>
          </div>
        </div>
      </section>

      <section className='xuan-section' id='tools'>
        <div className='xuan-container'>
          <div className='xuan-section-head'>
            <div>
              <span className='xuan-kicker'>Tools</span>
              <h2>排盘工具</h2>
            </div>
            <p>参考同类玄学工具站的入口结构，但工具内容和界面重新组织，保留排盘、导出和后续 AI 解析扩展空间。</p>
          </div>
          <div className='xuan-tool-grid'>
            {xuanTools.map(tool => (
              <Link className='xuan-tool-card' href={tool.href} key={tool.href}>
                <span>{tool.status}</span>
                <h3>{tool.title}</h3>
                <p>{tool.summary}</p>
                <div>
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
                <h3>{item.title}</h3>
                <p>{item.text}</p>
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
              <h2>后续可以加 AI 解读、历史记录和收藏</h2>
              <p>第一版先独立成站。后面再决定是否做登录、会员、收藏、每日一卦、合盘、问事记录和多模型解读。</p>
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
