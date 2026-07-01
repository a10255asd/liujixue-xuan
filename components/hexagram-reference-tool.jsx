const trigrams = [
  { name: '乾', image: '天', symbol: '☰', element: '金', lines: '111' },
  { name: '兑', image: '泽', symbol: '☱', element: '金', lines: '110' },
  { name: '离', image: '火', symbol: '☲', element: '火', lines: '101' },
  { name: '震', image: '雷', symbol: '☳', element: '木', lines: '100' },
  { name: '巽', image: '风', symbol: '☴', element: '木', lines: '011' },
  { name: '坎', image: '水', symbol: '☵', element: '水', lines: '010' },
  { name: '艮', image: '山', symbol: '☶', element: '土', lines: '001' },
  { name: '坤', image: '地', symbol: '☷', element: '土', lines: '000' }
]

const hexagramMatrix = {
  乾: { 乾: '乾为天', 兑: '天泽履', 离: '天火同人', 震: '天雷无妄', 巽: '天风姤', 坎: '天水讼', 艮: '天山遁', 坤: '天地否' },
  兑: { 乾: '泽天夬', 兑: '兑为泽', 离: '泽火革', 震: '泽雷随', 巽: '泽风大过', 坎: '泽水困', 艮: '泽山咸', 坤: '泽地萃' },
  离: { 乾: '火天大有', 兑: '火泽睽', 离: '离为火', 震: '火雷噬嗑', 巽: '火风鼎', 坎: '火水未济', 艮: '火山旅', 坤: '火地晋' },
  震: { 乾: '雷天大壮', 兑: '雷泽归妹', 离: '雷火丰', 震: '震为雷', 巽: '雷风恒', 坎: '雷水解', 艮: '雷山小过', 坤: '雷地豫' },
  巽: { 乾: '风天小畜', 兑: '风泽中孚', 离: '风火家人', 震: '风雷益', 巽: '巽为风', 坎: '风水涣', 艮: '风山渐', 坤: '风地观' },
  坎: { 乾: '水天需', 兑: '水泽节', 离: '水火既济', 震: '水雷屯', 巽: '水风井', 坎: '坎为水', 艮: '水山蹇', 坤: '水地比' },
  艮: { 乾: '山天大畜', 兑: '山泽损', 离: '山火贲', 震: '山雷颐', 巽: '山风蛊', 坎: '山水蒙', 艮: '艮为山', 坤: '山地剥' },
  坤: { 乾: '地天泰', 兑: '地泽临', 离: '地火明夷', 震: '地雷复', 巽: '地风升', 坎: '地水师', 艮: '地山谦', 坤: '坤为地' }
}

const elementClassMap = {
  木: 'wood',
  火: 'fire',
  土: 'earth',
  金: 'metal',
  水: 'water'
}

function ElementBadge({ value }) {
  return <span className={`wuxing-element ${elementClassMap[value] || ''}`}>{value}</span>
}

export function HexagramReferenceTool() {
  return (
    <div className='wuxing-reference-layout'>
      <section className='chart-section-card wuxing-reference-card'>
        <div className='chart-section-head'>
          <div>
            <span className='chart-kicker'>Matrix</span>
            <h2>六十四卦矩阵</h2>
          </div>
          <span className='chart-source'>上卦在左侧，下卦在表头</span>
        </div>
        <div className='wuxing-table-wrap hexagram-table-wrap'>
          <table className='wuxing-table hexagram-table'>
            <thead>
              <tr>
                <th>上卦 / 下卦</th>
                {trigrams.map(lower => (
                  <th key={lower.name}>{lower.symbol} {lower.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trigrams.map(upper => (
                <tr key={upper.name}>
                  <th>{upper.symbol} {upper.name}</th>
                  {trigrams.map(lower => (
                    <td key={`${upper.name}-${lower.name}`}>
                      <strong>{hexagramMatrix[upper.name][lower.name]}</strong>
                      <span>{upper.image}上{lower.image}下</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className='chart-section-card wuxing-reference-card'>
        <div className='chart-section-head'>
          <div>
            <span className='chart-kicker'>Eight Trigrams</span>
            <h2>八卦基础字段</h2>
          </div>
        </div>
        <div className='trigram-card-grid'>
          {trigrams.map(item => (
            <article className='trigram-card' key={item.name}>
              <span>{item.symbol}</span>
              <h3>{item.name}为{item.image}</h3>
              <p>三爻：{item.lines}</p>
              <div>
                <ElementBadge value={item.element} />
                <em>{item.image}</em>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
