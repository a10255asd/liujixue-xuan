'use client'

import { ArrowRight } from '@/components/icons'
import { createToolHandoff, handoffKey, writeMemory } from '@/lib/local-memory'
import { track } from '@vercel/analytics'

export const aiPromptTarget = {
  label: '送去 AI',
  slot: 'chartText',
  targetHref: '/tools/ai-prompt',
  targetSlug: 'aiPrompt'
}

export const compatibilityTargets = [
  {
    label: '合盘 A',
    slot: 'chartA',
    targetHref: '/tools/compatibility',
    targetSlug: 'compatibility'
  },
  {
    label: '合盘 B',
    slot: 'chartB',
    targetHref: '/tools/compatibility',
    targetSlug: 'compatibility'
  }
]

export const aiAndCompatibilityTargets = [aiPromptTarget, ...compatibilityTargets]

export function ToolHandoffActions({
  buttonClassName = 'button chart-export-action-button',
  className = 'tool-handoff-actions',
  location,
  record,
  targets = [aiPromptTarget]
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
          {target.label}
        </button>
      ))}
    </div>
  )
}
