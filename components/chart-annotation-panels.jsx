export function TermExplanationPanel({ terms }) {
  return (
    <section className='chart-section-card chart-annotation-section'>
      <div className='chart-section-head'>
        <div>
          <span className='chart-kicker'>Knowledge</span>
          <h2>术语解释</h2>
        </div>
      </div>
      <div className='term-explanation-grid'>
        {terms.map(term => (
          <article className='term-explanation-card' key={term.term}>
            <h3>{term.term}</h3>
            <p>{term.summary}</p>
            <span>{term.source}</span>
          </article>
        ))}
      </div>
    </section>
  )
}

export function RuleHitPanel({ rules, source }) {
  return (
    <section className='chart-section-card chart-annotation-section'>
      <div className='chart-section-head'>
        <div>
          <span className='chart-kicker'>Rules</span>
          <h2>规则命中</h2>
        </div>
        <span className='chart-source'>{source.version}</span>
      </div>
      <div className='rule-hit-grid'>
        {rules.map(rule => (
          <article className='rule-hit-card' key={rule.title}>
            <div className='rule-hit-head'>
              <span>{rule.badge}</span>
              <h3>{rule.title}</h3>
            </div>
            <p>{rule.hit}</p>
            <div className='rule-detail-tags'>
              {rule.details.map(detail => <span key={detail}>{detail}</span>)}
            </div>
            <small>{rule.source}</small>
          </article>
        ))}
      </div>
      <div className='chart-footnotes'>
        <p>{source.name} {source.version}：{source.scope}。</p>
        <p>{source.boundary}。</p>
      </div>
    </section>
  )
}
