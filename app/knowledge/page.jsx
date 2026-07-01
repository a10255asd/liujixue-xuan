import Link from 'next/link'
import { ArrowRight, CircleDot } from '@/components/icons'

export const metadata = {
  title: '知识图解',
  description: '用图解结构整理八字、紫微、六爻、梅花、奇门、六壬和择日工具的字段关系。'
}

const knowledgeMaps = [
  {
    title: '出生盘链路',
    steps: ['出生时间', '出生地', '真太阳时', '八字/紫微', '导出字段'],
    text: '用于解释为什么出生地、子时口径和起运口径会影响结果。'
  },
  {
    title: '问事起卦链路',
    steps: ['事项', '时间/数字', '本卦', '动爻', '变卦'],
    text: '用于区分六爻、梅花和每日一卦各自的输入口径。'
  },
  {
    title: '择日链路',
    steps: ['日期范围', '节气', '干支', '宜忌', '冲煞'],
    text: '用于把黄历节气、择日速览和时辰速查串起来。'
  },
  {
    title: 'AI 接力链路',
    steps: ['排盘', '复制字段', '保存记录', '补充背景', '交给 AI'],
    text: '用于把工具结果变成可复用的解析材料，而不是截图丢失上下文。'
  }
]

export default function KnowledgePage() {
  return (
    <>
      <section className='xuan-tool-hero'>
        <div className='xuan-container xuan-tool-hero-inner'>
          <div>
            <span className='xuan-kicker'><CircleDot size={16} /> Knowledge</span>
            <h1>知识图解</h1>
            <p><span>把复杂术数拆成输入、排盘、字段、导出四层。</span><span>用户先看懂流程，再进入工具。</span></p>
          </div>
          <div className='xuan-tool-panel'>
            <div className='xuan-tool-panel-head'>
              <span>Maps</span>
              <em>已上线</em>
            </div>
            <strong>流程图谱</strong>
            <p>当前先做结构图，后续可补每个术语的详细说明和例盘。</p>
            <div className='xuan-tool-related'>
              <span>相关入口</span>
              <Link href='/classics'>古籍书楼</Link>
              <Link href='/tools/records'>收藏记录</Link>
              <Link href='/tools'>工具箱</Link>
            </div>
          </div>
        </div>
      </section>
      <section className='xuan-section compact'>
        <div className='xuan-container'>
          <div className='knowledge-map-grid'>
            {knowledgeMaps.map(map => (
              <article className='knowledge-map-card' key={map.title}>
                <h2>{map.title}</h2>
                <div>
                  {map.steps.map(step => <span key={step}>{step}</span>)}
                </div>
                <p>{map.text}</p>
              </article>
            ))}
          </div>
          <div className='xuan-upgrade-panel classics-next-panel'>
            <div>
              <span className='xuan-kicker'>Tool Flow</span>
              <h2>从图解直接进入工具</h2>
              <p>新用户先理解入口，老用户直接打开工具和记录页继续使用。</p>
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
