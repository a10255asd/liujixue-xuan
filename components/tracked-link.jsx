'use client'

import { track } from '@vercel/analytics'
import Link from 'next/link'

const isPrimitive = value => (
  value === null ||
  ['string', 'number', 'boolean'].includes(typeof value)
)

function normalizeEventProps(eventProps, href) {
  const props = {}

  for (const [key, value] of Object.entries(eventProps || {})) {
    if (value === undefined) continue
    props[key] = isPrimitive(value) ? value : String(value)
  }

  if (!props.href && typeof href === 'string') {
    props.href = href
  }

  return props
}

export function TrackedLink({
  href,
  eventName = 'xuan_link_click',
  eventProps,
  onClick,
  rel,
  children,
  ...props
}) {
  const hrefString = typeof href === 'string' ? href : ''
  const isExternal = hrefString.startsWith('http')

  const handleClick = event => {
    track(eventName, normalizeEventProps(eventProps, hrefString))
    onClick?.(event)
  }

  if (isExternal) {
    return (
      <a
        href={hrefString}
        rel={rel || 'noreferrer'}
        onClick={handleClick}
        {...props}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}
