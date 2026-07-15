'use client'

import Link from 'next/link'
import { ArrowUpRight, Menu, X } from '@/components/icons'
import { track } from '@vercel/analytics'
import { site } from '@/lib/site'
import { useState } from 'react'

const mobileNavItems = [
  { label: '工具', href: '/tools' },
  { label: '古籍', href: '/classics' },
  { label: '图解', href: '/knowledge' },
  { label: '主站', href: site.mainSite, external: true },
  { label: '开始排盘', href: '/tools/bazi', featured: true }
]

export function XuanMobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const closeAndTrack = item => {
    track('xuan_nav_click', {
      label: item.label,
      location: 'mobile_nav',
      href: item.href
    })
    setIsOpen(false)
  }

  return (
    <div className='xuan-mobile-nav-wrap'>
      <button
        className='xuan-mobile-menu-button'
        type='button'
        aria-expanded={isOpen}
        aria-label={isOpen ? '关闭导航' : '打开导航'}
        onClick={() => setIsOpen(current => !current)}>
        {isOpen ? <X size={19} /> : <Menu size={19} />}
      </button>
      <nav className={`xuan-mobile-nav ${isOpen ? 'open' : ''}`} aria-label='移动导航'>
        {mobileNavItems.map(item => {
          const content = (
            <>
              <span>{item.label}</span>
              {item.external || item.featured ? <ArrowUpRight size={14} /> : null}
            </>
          )

          if (item.external) {
            return (
              <a href={item.href} key={item.label} onClick={() => closeAndTrack(item)}>
                {content}
              </a>
            )
          }

          return (
            <Link
              className={item.featured ? 'featured' : undefined}
              href={item.href}
              key={item.label}
              onClick={() => closeAndTrack(item)}>
              {content}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
