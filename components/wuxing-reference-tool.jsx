const stems = [
  { name: '甲', yinYang: '阳', element: '木', direction: '东方', note: '阳木' },
  { name: '乙', yinYang: '阴', element: '木', direction: '东方', note: '阴木' },
  { name: '丙', yinYang: '阳', element: '火', direction: '南方', note: '阳火' },
  { name: '丁', yinYang: '阴', element: '火', direction: '南方', note: '阴火' },
  { name: '戊', yinYang: '阳', element: '土', direction: '中央', note: '阳土' },
  { name: '己', yinYang: '阴', element: '土', direction: '中央', note: '阴土' },
  { name: '庚', yinYang: '阳', element: '金', direction: '西方', note: '阳金' },
  { name: '辛', yinYang: '阴', element: '金', direction: '西方', note: '阴金' },
  { name: '壬', yinYang: '阳', element: '水', direction: '北方', note: '阳水' },
  { name: '癸', yinYang: '阴', element: '水', direction: '北方', note: '阴水' }
]

const branches = [
  { name: '子', yinYang: '阳', element: '水', hidden: '癸', animal: '鼠', season: '冬' },
  { name: '丑', yinYang: '阴', element: '土', hidden: '己 癸 辛', animal: '牛', season: '冬末' },
  { name: '寅', yinYang: '阳', element: '木', hidden: '甲 丙 戊', animal: '虎', season: '春初' },
  { name: '卯', yinYang: '阴', element: '木', hidden: '乙', animal: '兔', season: '春' },
  { name: '辰', yinYang: '阳', element: '土', hidden: '戊 乙 癸', animal: '龙', season: '春末' },
  { name: '巳', yinYang: '阴', element: '火', hidden: '丙 戊 庚', animal: '蛇', season: '夏初' },
  { name: '午', yinYang: '阳', element: '火', hidden: '丁 己', animal: '马', season: '夏' },
  { name: '未', yinYang: '阴', element: '土', hidden: '己 丁 乙', animal: '羊', season: '夏末' },
  { name: '申', yinYang: '阳', element: '金', hidden: '庚 壬 戊', animal: '猴', season: '秋初' },
  { name: '酉', yinYang: '阴', element: '金', hidden: '辛', animal: '鸡', season: '秋' },
  { name: '戌', yinYang: '阳', element: '土', hidden: '戊 辛 丁', animal: '狗', season: '秋末' },
  { name: '亥', yinYang: '阴', element: '水', hidden: '壬 甲', animal: '猪', season: '冬初' }
]

const relationRows = [
  { type: '相生', items: ['木生火', '火生土', '土生金', '金生水', '水生木'] },
  { type: '相克', items: ['木克土', '土克水', '水克火', '火克金', '金克木'] },
  { type: '方位', items: ['木东', '火南', '土中', '金西', '水北'] },
  { type: '季节', items: ['春木', '夏火', '长夏土', '秋金', '冬水'] }
]

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

function TableSection({ children, title }) {
  return (
    <section className='chart-section-card wuxing-reference-card'>
      <div className='chart-section-head'>
        <div>
          <span className='chart-kicker'>Reference</span>
          <h2>{title}</h2>
        </div>
      </div>
      {children}
    </section>
  )
}

export function WuxingReferenceTool() {
  return (
    <div className='wuxing-reference-layout'>
      <TableSection title='十天干'>
        <div className='wuxing-table-wrap'>
          <table className='wuxing-table'>
            <thead>
              <tr>
                <th>天干</th>
                <th>阴阳</th>
                <th>五行</th>
                <th>方位</th>
                <th>备注</th>
              </tr>
            </thead>
            <tbody>
              {stems.map(item => (
                <tr key={item.name}>
                  <th>{item.name}</th>
                  <td>{item.yinYang}</td>
                  <td><ElementBadge value={item.element} /></td>
                  <td>{item.direction}</td>
                  <td>{item.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TableSection>

      <TableSection title='十二地支'>
        <div className='wuxing-table-wrap'>
          <table className='wuxing-table'>
            <thead>
              <tr>
                <th>地支</th>
                <th>阴阳</th>
                <th>五行</th>
                <th>藏干</th>
                <th>生肖</th>
                <th>季节</th>
              </tr>
            </thead>
            <tbody>
              {branches.map(item => (
                <tr key={item.name}>
                  <th>{item.name}</th>
                  <td>{item.yinYang}</td>
                  <td><ElementBadge value={item.element} /></td>
                  <td>{item.hidden}</td>
                  <td>{item.animal}</td>
                  <td>{item.season}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TableSection>

      <TableSection title='五行关系'>
        <div className='wuxing-relation-grid'>
          {relationRows.map(row => (
            <article className='wuxing-relation-card' key={row.type}>
              <span>{row.type}</span>
              <div>
                {row.items.map(item => <strong key={item}>{item}</strong>)}
              </div>
            </article>
          ))}
        </div>
      </TableSection>
    </div>
  )
}
