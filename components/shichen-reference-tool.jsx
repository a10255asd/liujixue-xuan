const shichenRows = [
  { branch: '子', range: '23:00-00:59', name: '夜半', element: '水', animal: '鼠', period: '夜' },
  { branch: '丑', range: '01:00-02:59', name: '鸡鸣', element: '土', animal: '牛', period: '夜' },
  { branch: '寅', range: '03:00-04:59', name: '平旦', element: '木', animal: '虎', period: '晨' },
  { branch: '卯', range: '05:00-06:59', name: '日出', element: '木', animal: '兔', period: '晨' },
  { branch: '辰', range: '07:00-08:59', name: '食时', element: '土', animal: '龙', period: '晨' },
  { branch: '巳', range: '09:00-10:59', name: '隅中', element: '火', animal: '蛇', period: '昼' },
  { branch: '午', range: '11:00-12:59', name: '日中', element: '火', animal: '马', period: '昼' },
  { branch: '未', range: '13:00-14:59', name: '日昳', element: '土', animal: '羊', period: '昼' },
  { branch: '申', range: '15:00-16:59', name: '晡时', element: '金', animal: '猴', period: '夕' },
  { branch: '酉', range: '17:00-18:59', name: '日入', element: '金', animal: '鸡', period: '夕' },
  { branch: '戌', range: '19:00-20:59', name: '黄昏', element: '土', animal: '狗', period: '夜' },
  { branch: '亥', range: '21:00-22:59', name: '人定', element: '水', animal: '猪', period: '夜' }
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

export function ShichenReferenceTool() {
  return (
    <div className='wuxing-reference-layout'>
      <section className='chart-section-card wuxing-reference-card'>
        <div className='chart-section-head'>
          <div>
            <span className='chart-kicker'>Time Branches</span>
            <h2>十二时辰</h2>
          </div>
          <span className='chart-source'>按现代北京时间两小时一段展示</span>
        </div>
        <div className='shichen-card-grid'>
          {shichenRows.map(item => (
            <article className='shichen-card' key={item.branch}>
              <div>
                <span>{item.branch}时</span>
                <strong>{item.range}</strong>
              </div>
              <h3>{item.name}</h3>
              <p>{item.period} / 生肖{item.animal}</p>
              <ElementBadge value={item.element} />
            </article>
          ))}
        </div>
      </section>

      <section className='chart-section-card wuxing-reference-card'>
        <div className='chart-section-head'>
          <div>
            <span className='chart-kicker'>Table</span>
            <h2>时辰表</h2>
          </div>
        </div>
        <div className='wuxing-table-wrap'>
          <table className='wuxing-table'>
            <thead>
              <tr>
                <th>时辰</th>
                <th>现代时间</th>
                <th>别名</th>
                <th>五行</th>
                <th>生肖</th>
                <th>昼夜段</th>
              </tr>
            </thead>
            <tbody>
              {shichenRows.map(item => (
                <tr key={item.branch}>
                  <th>{item.branch}时</th>
                  <td>{item.range}</td>
                  <td>{item.name}</td>
                  <td><ElementBadge value={item.element} /></td>
                  <td>{item.animal}</td>
                  <td>{item.period}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
