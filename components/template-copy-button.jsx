'use client'

import { CheckCircle2, Copy } from '@/components/icons'
import { copyText } from '@/lib/copy-text'
import { track } from '@vercel/analytics'
import { useState } from 'react'

export function TemplateCopyButton({
  templateTitle,
  text,
  location = 'start',
  className = 'button',
  idleLabel = '复制模板',
  copiedLabel = '已复制',
  failedLabel = '复制受限'
}) {
  const [copied, setCopied] = useState(false)
  const [failed, setFailed] = useState(false)

  const copyTemplate = async () => {
    const copiedText = await copyText(text)

    if (!copiedText) {
      setFailed(true)
      window.setTimeout(() => setFailed(false), 1800)
      return
    }

    track('requirement_template_copy', {
      template: templateTitle,
      location
    })
    setFailed(false)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <button className={className} type='button' onClick={copyTemplate}>
      {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
      {failed ? failedLabel : copied ? copiedLabel : idleLabel}
    </button>
  )
}
