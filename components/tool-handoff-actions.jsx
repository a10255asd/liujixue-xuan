'use client'

import { ArrowRight } from '@/components/icons'
import { createToolHandoff, handoffKey, writeMemory } from '@/lib/local-memory'
import { track } from '@vercel/analytics'

export const aiPromptTarget = {
  label: '送去 AI',
  hint: '整理字段和追问清单',
  slot: 'chartText',
  targetHref: '/tools/ai-prompt',
  targetSlug: 'aiPrompt'
}

export const synthesisTarget = {
  label: '合参',
  hint: '多份材料归并整理',
  slot: 'auto',
  targetHref: '/tools/synthesis',
  targetSlug: 'synthesis'
}

export const compatibilityTargets = [
  {
    label: '合盘 A',
    hint: '填入第一份出生盘',
    slot: 'chartA',
    targetHref: '/tools/compatibility',
    targetSlug: 'compatibility'
  },
  {
    label: '合盘 B',
    hint: '填入第二份出生盘',
    slot: 'chartB',
    targetHref: '/tools/compatibility',
    targetSlug: 'compatibility'
  }
]

export const aiAndCompatibilityTargets = [aiPromptTarget, ...compatibilityTargets, synthesisTarget]

export function ToolHandoffActions({
  buttonClassName = 'button chart-export-action-button',
  className = 'tool-handoff-actions',
  location,
  record,
  showHints = false,
  targets = [aiPromptTarget, synthesisTarget]
}) {
  const availableTargets = targets.filter(Boolean)
  if (!record?.text || !availableTargets.length) return null

  const send = target => {
    writeMemory(handoffKey, createToolHandoff({
      record,
      slot: target.slot,
      targetHref: target.targetHref,
      targetSlug: target.targetSlug
    }))
    track('xuan_direct_tool_handoff', {
      location,
      target: target.targetSlug,
      tool: record.tool
    })
    window.location.href = target.targetHref
  }

  return (
    <div className={className}>
      {availableTargets.map(target => (
        <button className={buttonClassName} key={`${target.targetSlug}-${target.slot}`} type='button' onClick={() => send(target)}>
          <ArrowRight size={16} />
          {showHints && target.hint ? (
            <span className='tool-handoff-copy'>
              <strong>{target.label}</strong>
              <em>{target.hint}</em>
            </span>
          ) : target.label}
        </button>
      ))}
    </div>
  )
}
