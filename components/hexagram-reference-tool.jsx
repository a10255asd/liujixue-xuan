'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

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

const reviewProfiles = {
  question: {
    label: '问事起卦复核',
    defaultUpper: '兑',
    defaultLower: '震',
    method: '先确认上卦、下卦、卦名和卦象字段，再回到问事记录保留问题、时间和背景。',
    caution: '这里只复核卦象字段，不输出吉凶、应期或结果判断。',
    next: [
      ['每日一卦记录', '/tools/daily'],
      ['六爻纳甲排盘', '/tools/liuyao'],
      ['梅花易数排盘', '/tools/meihua']
    ]
  },
  liuyao: {
    label: '六爻盘面复核',
    defaultUpper: '兑',
    defaultLower: '震',
    method: '把本卦或变卦拆成上下卦，先核对卦名、卦象和八卦五行，再看世应、六亲和动爻。',
    caution: '六爻判断需回到完整盘面，不能只凭卦名或卦象下结论。',
    next: [
      ['六爻纳甲排盘', '/tools/liuyao'],
      ['干支五行复核', '/tools/wuxing'],
      ['古籍书楼', '/classics']
    ]
  },
  meihua: {
    label: '梅花体用复核',
    defaultUpper: '乾',
    defaultLower: '坤',
    method: '先核对本卦上下卦，再配合动爻、体卦、用卦和互卦逐项留档。',
    caution: '体用关系需要结合起卦方式和事项背景，不把单一五行关系当作最终判断。',
    next: [
      ['梅花易数排盘', '/tools/meihua'],
      ['每日一卦记录', '/tools/daily'],
      ['干支五行复核', '/tools/wuxing']
    ]
  },
  archive: {
    label: '资料留档',
    defaultUpper: '乾',
    defaultLower: '乾',
    method: '把卦名、上下卦、三爻、五行和来源统一保存，方便后续排盘或资料查询引用。',
    caution: '资料留档只保存字段来源，不输出吉凶、强弱或确定性结果。',
    next: [
      ['古籍书楼', '/classics'],
      ['知识图解', '/knowledge'],
      ['干支五行复核', '/tools/wuxing']
    ]
  }
}

const elementClassMap = {
  木: 'wood',
  火: 'fire',
  土: 'earth',
  金: 'metal',
  水: 'water'
}

const trigramMap = Object.fromEntries(trigrams.map(item => [item.name, item]))

function ElementBadge({ value }) {
  return <span className={`wuxing-element ${elementClassMap[value] || ''}`}>{value}</span>
}

export function HexagramReferenceTool() {
  const [profileKey, setProfileKey] = useState('question')
  const profile = reviewProfiles[profileKey] || reviewProfiles.question
  const [upperName, setUpperName] = useState(profile.defaultUpper)
  const [lowerName, setLowerName] = useState(profile.defaultLower)
  const [topic, setTopic] = useState('正在复核的问事卦象')
  const upper = trigramMap[upperName] || trigrams[0]
  const lower = trigramMap[lowerName] || trigrams[0]
  const selectedHexagram = useMemo(() => hexagramMatrix[upper.name][lower.name], [upper.name, lower.name])
  const sameElement = upper.element === lower.element

  function selectProfile(nextKey) {
    const nextProfile = reviewProfiles[nextKey] || reviewProfiles.question
    setProfileKey(nextKey)
    setUpperName(nextProfile.defaultUpper)
    setLowerName(nextProfile.defaultLower)
  }

  return (
    <div className='wuxing-reference-layout'>
      <section className='chart-section-card wuxing-reference-card wuxing-review-panel hexagram-review-panel'>
        <div className='chart-section-head'>
          <div>
            <span className='chart-kicker'>Review</span>
            <h2>卦象字段复核</h2>
          </div>
        </div>

        <div className='wuxing-mode-controls' aria-label='选择复核用途'>
          {Object.entries(reviewProfiles).map(([key, item]) => (
            <button
              aria-pressed={profileKey === key}
              className='wuxing-mode-button'
              key={key}
              onClick={() => selectProfile(key)}
              type='button'>
              {item.label}
            </button>
          ))}
        </div>

        <div className='hexagram-query-grid'>
          <label className='hexagram-select-field'>
            <span>事项/来源</span>
            <input
              aria-label='事项或来源'
              onChange={event => setTopic(event.target.value)}
              value={topic}
            />
          </label>
          <label className='hexagram-select-field'>
            <span>上卦</span>
            <select aria-label='上卦' onChange={event => setUpperName(event.target.value)} value={upperName}>
              {trigrams.map(item => (
                <option key={item.name} value={item.name}>{item.symbol} {item.name}为{item.image}</option>
              ))}
            </select>
          </label>
          <label className='hexagram-select-field'>
            <span>下卦</span>
            <select aria-label='下卦' onChange={event => setLowerName(event.target.value)} value={lowerName}>
              {trigrams.map(item => (
                <option key={item.name} value={item.name}>{item.symbol} {item.name}为{item.image}</option>
              ))}
            </select>
          </label>
        </div>

        <div className='hexagram-result-grid'>
          <article className='hexagram-result-card'>
            <span>卦名</span>
            <strong>{selectedHexagram}</strong>
            <p>{topic || '未填写事项'} · {upper.image}上{lower.image}下</p>
          </article>
          <article className='hexagram-result-card'>
            <span>上卦</span>
            <strong>{upper.symbol} {upper.name}为{upper.image}</strong>
            <p>三爻 {upper.lines} / 五行 {upper.element}</p>
            <ElementBadge value={upper.element} />
          </article>
          <article className='hexagram-result-card'>
            <span>下卦</span>
            <strong>{lower.symbol} {lower.name}为{lower.image}</strong>
            <p>三爻 {lower.lines} / 五行 {lower.element}</p>
            <ElementBadge value={lower.element} />
          </article>
        </div>

        <div className='wuxing-review-grid'>
          <article className='wuxing-review-item'>
            <span>复核口径</span>
            <strong>{profile.label}</strong>
            <p>{profile.method}</p>
          </article>
          <article className='wuxing-review-item'>
            <span>输出边界</span>
            <strong>{sameElement ? '同五行' : '异五行'}</strong>
            <p>{profile.caution}</p>
          </article>
        </div>

        <div className='wuxing-next-grid' aria-label='下一步入口'>
          {profile.next.map(([label, href]) => (
            <Link href={href} key={href}>
              <span>下一步</span>
              <strong>{label}</strong>
            </Link>
          ))}
        </div>
      </section>

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
