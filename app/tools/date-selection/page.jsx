import { LazyStructuredTool } from '@/components/lazy-tool-components'
import { ToolPageFrame } from '@/components/xuan-shell'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: '择日速览',
  description: '按事项类型和日期范围输出候选日期、宜忌命中、冲煞和基础择日字段。',
  path: '/tools/date-selection'
})

export default function DateSelectionPage() {
  return (
    <ToolPageFrame
      title='择日速览'
      description={'输入事项类型、起始日期和天数。\n先给出候选日期，再展开每日干支、宜忌和冲煞字段。'}>
      <LazyStructuredTool slug='dateSelection' />
    </ToolPageFrame>
  )
}
