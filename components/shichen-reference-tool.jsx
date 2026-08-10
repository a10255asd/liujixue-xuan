'use client'

import { useMemo, useState } from 'react'
import { buildShichenCandidates, shichenPurposeOptions, shichenRows } from '@/lib/shichen-candidates'

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

const todayDate = () => {
  const date = new Date()

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function ShichenReferenceTool() {
  const [date, setDate] = useState(todayDate)
  const [purpose, setPurpose] = useState('launch')
  const [topic, setTopic] = useState('上线发布')
  const [actionWindow, setActionWindow] = useState('14:00-17:00')
  const [constraints, setConstraints] = useState('避开会议和夜间临时操作，保留半小时回滚窗口。')
  const shichenPlan = useMemo(() => buildShichenCandidates({ date, purpose, actionWindow }), [actionWindow, date, purpose])
  const cleanTopic = topic || '未填写事项'
  const cleanConstraints = constraints || '未填写现实限制。'
  const topCandidateText = shichenPlan.topCandidates.map(item => `${item.branch}时 ${item.range}`).join('、')
  const reviewRows = [
    ['记录事项', cleanTopic],
    ['执行窗口', shichenPlan.actionWindow?.label || actionWindow || '未填写执行窗口'],
    ['现实限制', cleanConstraints],
    ['候选分布', `优先时段 ${shichenPlan.levelCounts.优先时段} 个，可备选 ${shichenPlan.levelCounts.可备选} 个，需复核 ${shichenPlan.levelCounts.需复核} 个。`],
    ['优先复核', topCandidateText || '暂无候选时段'],
    ['冲时复核', `当日日支 ${shichenPlan.dayBranch}，冲 ${shichenPlan.clashBranch}时，涉及关键人员或地点时先单独确认。`],
    ['今日小动作', `围绕「${cleanTopic}」先确认参与人、地点、开始时间和回滚条件。`],
    ['复盘字段', '记录实际开始时间、结束时间、延误原因、临时变更和下次要排除的限制。'],
    ['输出边界', '只做日内时辰候选、执行限制和复盘清单，不输出吉凶、运势断语或确定性判断。']
  ]

  return (
    <div className='wuxing-reference-layout'>
      <section className='chart-section-card wuxing-reference-card shichen-planner-card'>
        <div className='chart-section-head'>
          <div>
            <span className='chart-kicker'>Hour Review</span>
            <h2>日内时辰候选记录</h2>
          </div>
          <span className='chart-source'>按事项类型、执行窗口、日支冲时和现实限制筛选</span>
        </div>
        <div className='shichen-planner-form'>
          <div className='chart-field'>
            <label htmlFor='shichen-topic'>事项</label>
            <input
              className='chart-text-input'
              id='shichen-topic'
              type='text'
              value={topic}
              onChange={event => setTopic(event.target.value)}
            />
          </div>
          <div className='chart-field'>
            <label htmlFor='shichen-purpose'>事项类型</label>
            <select id='shichen-purpose' value={purpose} onChange={event => setPurpose(event.target.value)}>
              {shichenPurposeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div className='chart-field'>
            <label htmlFor='shichen-date'>日期</label>
            <input
              className='chart-text-input'
              id='shichen-date'
              type='date'
              value={date}
              onChange={event => setDate(event.target.value)}
            />
          </div>
          <div className='chart-field'>
            <label htmlFor='shichen-window'>执行窗口</label>
            <input
              className='chart-text-input'
              id='shichen-window'
              type='text'
              value={actionWindow}
              onChange={event => setActionWindow(event.target.value)}
              placeholder='例如 14:00-17:00 或 下午'
            />
          </div>
          <div className='chart-field shichen-wide-field'>
            <label htmlFor='shichen-constraints'>现实限制</label>
            <textarea
              className='chart-text-input structured-textarea'
              id='shichen-constraints'
              rows={3}
              value={constraints}
              onChange={event => setConstraints(event.target.value)}
              placeholder='可记录会议、人员档期、地点、准备时间、回滚窗口或不可选时段。'
            />
          </div>
        </div>
        <div className='shichen-planner-summary'>
          <span>{cleanTopic}</span>
          <span>{shichenPlan.profile.label}</span>
          <span>{shichenPlan.actionWindow?.label || actionWindow || '未填写执行窗口'}</span>
          <span>日支 {shichenPlan.dayBranch}</span>
          <span>冲时 {shichenPlan.clashBranch}时</span>
        </div>
        <div className='shichen-candidate-grid'>
          {shichenPlan.topCandidates.map(item => (
            <article className='shichen-candidate-card' key={item.branch}>
              <div>
                <span>{item.level}</span>
                <strong>{item.branch}时</strong>
              </div>
              <h3>{item.range}</h3>
              <p>{item.name} / {item.period} / 五行{item.element}</p>
              <dl>
                <div>
                  <dt>命中</dt>
                  <dd>{item.reasonText}</dd>
                </div>
                <div>
                  <dt>执行</dt>
                  <dd>{item.windowText}</dd>
                </div>
                <div>
                  <dt>复核</dt>
                  <dd>{item.cautionText}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
        <p className='shichen-planner-note'>时辰候选只用于缩小日内时间段，仍需结合具体地点、执行条件和人工口径复核。</p>
      </section>

      <section className='chart-section-card wuxing-reference-card'>
        <div className='chart-section-head'>
          <div>
            <span className='chart-kicker'>Review</span>
            <h2>执行复盘清单</h2>
          </div>
          <span className='chart-source'>候选时段不直接断结果，只保留可复核材料</span>
        </div>
        <div className='shichen-review-grid'>
          {reviewRows.map(([label, value]) => (
            <article className='shichen-review-card' key={label}>
              <span>{label}</span>
              <p>{value}</p>
            </article>
          ))}
        </div>
      </section>

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
                <th>执行窗口</th>
                <th>候选级别</th>
              </tr>
            </thead>
            <tbody>
              {shichenPlan.candidates.map(item => (
                <tr key={item.branch}>
                  <th>{item.branch}时</th>
                  <td>{item.range}</td>
                  <td>{item.name}</td>
                  <td><ElementBadge value={item.element} /></td>
                  <td>{item.animal}</td>
                  <td>{item.period}</td>
                  <td>{item.windowText}</td>
                  <td>{item.level}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
