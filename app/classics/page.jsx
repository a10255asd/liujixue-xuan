import Link from 'next/link'
import { ArrowRight, BookOpenText } from '@/components/icons'

export const metadata = {
  title: '古籍书楼',
  description: '整理八字、紫微、六爻、易经、奇门和择日相关古籍索引，作为工具口径的资料入口。'
}

const classicGroups = [
  {
    title: '四柱八字',
    books: ['滴天髓', '三命通会', '渊海子平', '子平真诠'],
    text: '用于整理十神、格局、神煞、旺衰和大运流年的术语索引。'
  },
  {
    title: '易经卜筮',
    books: ['周易', '增删卜易', '卜筮正宗', '火珠林'],
    text: '用于六十四卦、六爻纳甲、世应、六亲、伏神飞神等字段核对。'
  },
  {
    title: '紫微斗数',
    books: ['紫微斗数全书', '紫微斗数全集', '十八飞星策天紫微斗数'],
    text: '用于宫位、主星、辅星、四化和大限字段的资料归档。'
  },
  {
    title: '奇门六壬',
    books: ['奇门遁甲统宗', '烟波钓叟歌', '大六壬指南', '六壬大全'],
    text: '用于后续完善奇门、六壬工具的排盘口径和术语索引。'
  }
]

export default function ClassicsPage() {
  return (
    <>
      <section className='xuan-tool-hero'>
        <div className='xuan-container xuan-tool-hero-inner'>
          <div>
            <span className='xuan-kicker'><BookOpenText size={16} /> Classics</span>
            <h1>古籍书楼</h1>
            <p><span>先做术语索引和口径来源。</span><span>后续再逐步补原文摘录、译注和工具字段关联。</span></p>
          </div>
          <div className='xuan-tool-panel'>
            <div className='xuan-tool-panel-head'>
              <span>Knowledge</span>
              <em>已上线</em>
            </div>
            <strong>资料入口</strong>
            <p>把古籍、术语和工具字段分开管理，避免排盘工具里塞满解释文本。</p>
            <div className='xuan-tool-related'>
              <span>相关入口</span>
              <Link href='/knowledge'>知识图解</Link>
              <Link href='/tools/hexagrams'>六十四卦</Link>
              <Link href='/tools/wuxing'>干支五行</Link>
            </div>
          </div>
        </div>
      </section>
      <section className='xuan-section compact'>
        <div className='xuan-container'>
          <div className='classic-grid'>
            {classicGroups.map(group => (
              <article className='classic-card' key={group.title}>
                <span>{group.title}</span>
                <h2>{group.books.join(' / ')}</h2>
                <p>{group.text}</p>
              </article>
            ))}
          </div>
          <div className='xuan-upgrade-panel classics-next-panel'>
            <div>
              <span className='xuan-kicker'>Next</span>
              <h2>下一步把古籍和工具字段互相链接</h2>
              <p>比如八字神煞、六爻伏神、紫微宫位、奇门九宫，都可以从工具结果跳到对应资料卡。</p>
            </div>
            <Link className='button primary' href='/tools'>
              返回工具箱
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
