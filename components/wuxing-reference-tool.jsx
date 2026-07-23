'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

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

const reviewProfiles = {
  chart: {
    label: '排盘字段复核',
    defaultQuery: '甲 子 木',
    method: '先把盘面里的天干、地支和五行拆开核对，再回到八字、六爻或奇门盘面看组合。',
    caution: '不把单个五行直接当作喜忌结论，必须结合完整盘面和问题场景。',
    next: [
      ['八字专业细盘', '/tools/bazi'],
      ['六爻纳甲排盘', '/tools/liuyao'],
      ['奇门遁甲速盘', '/tools/qimen']
    ]
  },
  name: {
    label: '姓名方案复核',
    defaultQuery: '木 火 土',
    method: '把姓名五格得出的五行放到这里核对生克、方位和季节，再回到姓名方案看读音字义。',
    caution: '姓名方案不能只看五行补缺，还要同步核对笔画、字义、谐音、出处和避讳。',
    next: [
      ['姓名方案复核', '/tools/name'],
      ['八字专业细盘', '/tools/bazi'],
      ['出生校时工作台', '/tools/birth-time']
    ]
  },
  timing: {
    label: '择日时辰复核',
    defaultQuery: '辰 巳 午',
    method: '先核对日期或时辰对应的地支五行、季节和藏干，再看黄历、择日或时辰候选。',
    caution: '时辰五行只做资料层复核，不替代冲煞、宜忌、事项类型和人工判断。',
    next: [
      ['十二时辰速查', '/tools/shichen'],
      ['黄历节气', '/tools/calendar'],
      ['择日速览', '/tools/date-selection']
    ]
  },
  archive: {
    label: '资料留档',
    defaultQuery: '甲 乙 寅 卯',
    method: '把要复查的干支、五行和来源写在同一张表里，后续排盘时可直接引用。',
    caution: '资料留档只保存字段来源和基础关系，不输出吉凶、强弱或结果保证。',
    next: [
      ['古籍书楼', '/classics'],
      ['知识图解', '/knowledge'],
      ['六十四卦速查', '/tools/hexagrams']
    ]
  }
}

const elementNotes = {
  木: '木：方位东方、季节春；可核对甲乙、寅卯和藏干里的甲乙。',
  火: '火：方位南方、季节夏；可核对丙丁、巳午和藏干里的丙丁。',
  土: '土：方位中央、季节长夏/四季末；可核对戊己、辰戌丑未。',
  金: '金：方位西方、季节秋；可核对庚辛、申酉和藏干里的庚辛。',
  水: '水：方位北方、季节冬；可核对壬癸、亥子和藏干里的壬癸。'
}

const elementClassMap = {
  木: 'wood',
  火: 'fire',
  土: 'earth',
  金: 'metal',
  水: 'water'
}

const stemMap = Object.fromEntries(stems.map(item => [item.name, item]))
const branchMap = Object.fromEntries(branches.map(item => [item.name, item]))
const elementSet = new Set(Object.keys(elementClassMap))
const knownChars = new Set([...Object.keys(stemMap), ...Object.keys(branchMap), ...elementSet])

const parseReviewTokens = value => {
  const chunks = String(value || '').split(/[,，、\s]+/).filter(Boolean)
  const chars = chunks.flatMap(chunk => Array.from(chunk).filter(char => knownChars.has(char)))
  return [...new Set(chars)]
}

const describeReviewToken = token => {
  if (stemMap[token]) {
    const item = stemMap[token]
    return {
      token,
      kind: '天干',
      element: item.element,
      detail: `${item.yinYang}${item.element} / ${item.direction}`,
      note: `先核对${item.name}的阴阳、五行和方位，再回到原盘看相邻干支组合。`
    }
  }

  if (branchMap[token]) {
    const item = branchMap[token]
    return {
      token,
      kind: '地支',
      element: item.element,
      detail: `${item.yinYang}${item.element} / 藏干 ${item.hidden} / ${item.season}`,
      note: `先看${item.name}支本气和藏干，再结合时令、生肖和冲合关系复核。`
    }
  }

  return {
    token,
    kind: '五行',
    element: token,
    detail: elementNotes[token],
    note: '先作为资料标签保存，再结合完整盘面确认是否需要进一步分析。'
  }
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
  const [profileKey, setProfileKey] = useState('chart')
  const profile = reviewProfiles[profileKey] || reviewProfiles.chart
  const [query, setQuery] = useState(profile.defaultQuery)
  const reviewItems = useMemo(() => parseReviewTokens(query).map(describeReviewToken), [query])

  function selectProfile(nextKey) {
    const nextProfile = reviewProfiles[nextKey] || reviewProfiles.chart
    setProfileKey(nextKey)
    setQuery(nextProfile.defaultQuery)
  }

  return (
    <div className='wuxing-reference-layout'>
      <section className='chart-section-card wuxing-reference-card wuxing-review-panel'>
        <div className='chart-section-head'>
          <div>
            <span className='chart-kicker'>Review</span>
            <h2>五行字段复核</h2>
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

        <label className='wuxing-query-row'>
          <span>待复核字段</span>
          <input
            aria-label='待复核字段'
            className='wuxing-query-input'
            onChange={event => setQuery(event.target.value)}
            placeholder='输入天干、地支或五行，例如：甲 子 木'
            value={query}
          />
        </label>

        <div className='wuxing-review-grid'>
          <article className='wuxing-review-item'>
            <span>复核用途</span>
            <strong>{profile.label}</strong>
            <p>{profile.method}</p>
          </article>
          <article className='wuxing-review-item'>
            <span>输出边界</span>
            <strong>资料层</strong>
            <p>{profile.caution}</p>
          </article>
        </div>

        <div className='wuxing-review-results' aria-live='polite'>
          {reviewItems.length ? reviewItems.map(item => (
            <article className='wuxing-review-result' key={item.token}>
              <div>
                <span>{item.kind}</span>
                <strong>{item.token}</strong>
              </div>
              <ElementBadge value={item.element} />
              <p>{item.detail}</p>
              <em>{item.note}</em>
            </article>
          )) : (
            <article className='wuxing-review-result'>
              <div>
                <span>待补充</span>
                <strong>未识别字段</strong>
              </div>
              <p>请输入天干、地支或五行字，例如甲、子、木。</p>
              <em>页面只会整理基础字段，不输出吉凶、喜忌或确定性判断。</em>
            </article>
          )}
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
