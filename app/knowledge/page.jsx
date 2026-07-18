import Link from 'next/link'
import { JsonLd } from '@/components/json-ld'
import { ArrowRight } from '@/components/icons'
import { buildBreadcrumbJsonLd, buildPageMetadata } from '@/lib/seo'
import { knowledgeChains } from '@/lib/knowledge'

export const metadata = buildPageMetadata({
  title: '知识图解',
  description: '用图解结构整理八字、紫微、六爻、梅花、奇门、六壬和择日工具的字段关系，附术语详解、例盘和口径问答。',
  path: '/knowledge'
})

const breadcrumbItems = [
  { name: '鸡血玄策', path: '/' },
  { name: '知识图解', path: '/knowledge' }
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: knowledgeChains.flatMap(chain =>
    chain.qa.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a }
    }))
  )
}

function ChainSection({ chain }) {
  return (
    <section className='xuan-section compact'>
      <div className='xuan-container'>
        <div className='xuan-section-head'>
          <div>
            <span className='xuan-kicker'>链路 · {chain.stem}</span>
            <h2>{chain.title}</h2>
          </div>
          <p>{chain.text}</p>
        </div>

        <div className='knowledge-terms-grid'>
          {chain.terms.map(term => (
            <dl className='knowledge-term-card' key={term.name}>
              <dt>{term.name}</dt>
              <dd>{term.text}</dd>
            </dl>
          ))}
        </div>

        <div className='knowledge-example-panel'>
          <span className='xuan-kicker'>例盘</span>
          <h3>{chain.example.title}</h3>
          <p>{chain.example.text}</p>
        </div>

        <div className='knowledge-qa'>
          {chain.qa.map(item => (
            <dl className='knowledge-qa-item' key={item.q}>
              <dt>{item.q}</dt>
              <dd>{item.a}</dd>
            </dl>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function KnowledgePage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems)} />
      <JsonLd data={faqJsonLd} />
      <section className='xuan-tool-hero'>
        <div className='xuan-container xuan-tool-hero-inner'>
          <div>
            <span className='xuan-kicker'>图解</span>
            <h1>知识图解</h1>
            <p><span>把复杂术数拆成输入、排盘、字段、导出四层。</span><span>先看懂流程和口径，再进入工具。</span></p>
          </div>
          <div className='xuan-tool-panel'>
            <div className='xuan-tool-panel-head'>
              <span>图谱</span>
              <em>已上线</em>
            </div>
            <strong>流程图谱</strong>
            <p>四条链路各附术语详解、例盘和口径问答，只讲字段与口径，不做断语。</p>
            <div className='xuan-tool-related'>
              <span>相关入口</span>
              <Link href='/classics'>古籍书楼</Link>
              <Link href='/tools'>工具箱</Link>
            </div>
          </div>
        </div>
      </section>

      <section className='xuan-section compact'>
        <div className='xuan-container'>
          <div className='xuan-section-head'>
            <div>
              <span className='xuan-kicker'>总览</span>
              <h2>四条链路</h2>
            </div>
            <p>每张卡是一条任务链路的骨架，下面的章节逐条展开术语和口径。</p>
          </div>
          <div className='knowledge-map-grid'>
            {knowledgeChains.map(chain => (
              <article className='knowledge-map-card' key={chain.title}>
                <h2>{chain.title}</h2>
                <div>
                  {chain.steps.map(step => <span key={step}>{step}</span>)}
                </div>
                <p>{chain.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {knowledgeChains.map(chain => <ChainSection chain={chain} key={chain.id} />)}

      <section className='xuan-section compact'>
        <div className='xuan-container'>
          <div className='xuan-upgrade-panel classics-next-panel'>
            <div>
              <span className='xuan-kicker'>用法</span>
              <h2>从图解直接进入工具</h2>
              <p>新用户先理解入口和口径，老用户直接打开工具并下载排盘图片。</p>
            </div>
            <Link className='button primary' href='/tools'>
              打开工具箱
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
