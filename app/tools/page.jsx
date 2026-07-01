import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Blocks, CircleDot } from '@/components/icons'
import { XuanToolSuiteGrid } from '@/components/xuan-tool-suite-grid'
import { scenarioCards, site, xuanComingTools, xuanTools } from '@/lib/site'

export const metadata = {
  title: '玄学工具箱',
  description: '鸡血玄策的工具总览，包含八字、紫微斗数、六爻、梅花、奇门六壬、黄历择日、姓名五格、资料和记录。'
}

export default function ToolsIndexPage() {
  return (
    <>
      <section className='xuan-tool-index-hero'>
        <div className='xuan-container xuan-tool-index-inner'>
          <div>
            <span className='xuan-kicker'><Blocks size={16} /> Tools</span>
            <h1>玄学工具箱</h1>
            <p>把排盘、起卦、日课、择日、资料和记录拆成独立入口。先输出字段，再交给 AI 或人工继续分析。</p>
          </div>
          <div className='xuan-tool-index-panel'>
            <span>Online</span>
            <strong>{xuanTools.length}</strong>
            <em>已上线工具</em>
          </div>
        </div>
      </section>

      <section className='xuan-section xuan-suite-section'>
        <div className='xuan-container'>
          <div className='xuan-section-head'>
            <div>
              <span className='xuan-kicker'>Use Cases</span>
              <h2>按用途进入</h2>
            </div>
            <p>如果不知道该打开哪个工具，先按用途选一组：出生盘、问事、高阶术数、日课时间、姓名五行或资料记录。</p>
          </div>
          <XuanToolSuiteGrid actionLabel='打开主工具' />
        </div>
      </section>

      <section className='xuan-section'>
        <div className='xuan-container'>
          <div className='xuan-section-head'>
            <div>
              <span className='xuan-kicker'>Available</span>
              <h2>已上线</h2>
            </div>
            <p>每个工具都保持字段输出边界，不直接输出吉凶、应期或人生判断。</p>
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
                  打开工具
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

      <section className='xuan-section'>
        <div className='xuan-container'>
          <div className='xuan-section-head'>
            <div>
              <span className='xuan-kicker'>Queued</span>
              <h2>后续功能</h2>
            </div>
            <p>这些方向先放进工具池，后续按真实使用反馈和准确性验证逐步上线。</p>
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
              <span className='xuan-kicker'><CircleDot size={15} /> Main Site</span>
              <h2>主站负责展示，玄学站负责工具</h2>
              <p>主站继续承载项目、服务和博客入口，玄学相关工具集中放在这里迭代。</p>
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
