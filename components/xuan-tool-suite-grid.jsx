import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from '@/components/icons'
import { xuanTools, xuanToolSuites } from '@/lib/site'

const toolsByHref = new Map(xuanTools.map(tool => [tool.href, tool]))

export function XuanToolSuiteGrid({ actionLabel = '进入工具组' }) {
  return (
    <div className='xuan-suite-grid'>
      {xuanToolSuites.map((suite, index) => {
        const primaryTool = toolsByHref.get(suite.primaryHref)
        const suiteTools = suite.toolHrefs.map(href => toolsByHref.get(href)).filter(Boolean)

        return (
          <article className='xuan-suite-card' key={suite.title}>
            <div className='xuan-suite-card-head'>
              <span>{suite.eyebrow}</span>
              <em>{String(index + 1).padStart(2, '0')}</em>
            </div>
            <h3>{suite.title}</h3>
            <p>{suite.summary}</p>
            <div className='xuan-suite-steps' aria-label={`${suite.title}流程`}>
              {suite.steps.map(step => <span key={step}>{step}</span>)}
            </div>
            <div className='xuan-suite-links'>
              {suiteTools.map(tool => (
                <Link href={tool.href} key={tool.href}>
                  {tool.title}
                  <ArrowUpRight size={13} />
                </Link>
              ))}
            </div>
            {primaryTool ? (
              <Link className='xuan-suite-primary' href={primaryTool.href}>
                {actionLabel}
                <ArrowRight size={15} />
              </Link>
            ) : null}
          </article>
        )
      })}
    </div>
  )
}
