import { LazyStructuredTool } from '@/components/lazy-tool-components'
import { ToolPageFrame } from '@/components/xuan-shell'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: '梦境日志工作台',
  description: '记录梦境全文、睡眠背景、醒来情绪、现实压力和反复意象，整理成可复盘的梦境日志。',
  path: '/tools/dream'
})

export default function DreamPage() {
  return (
    <ToolPageFrame
      title='梦境日志工作台'
      description={'整理梦境全文、睡眠背景、醒来情绪、现实压力和反复意象。\n只做日志记录和复盘清单，不输出吉凶、预兆或应期判断。'}>
      <LazyStructuredTool slug='dream' />
    </ToolPageFrame>
  )
}
