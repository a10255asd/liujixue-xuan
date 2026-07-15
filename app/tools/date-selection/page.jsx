import { LazyStructuredTool } from '@/components/lazy-tool-components'
import { ToolPageFrame } from '@/components/xuan-shell'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: '择日速览',
  description: '按日期范围输出每日干支、宜忌、冲煞和基础择日字段。',
  path: '/tools/date-selection'
})

export default function DateSelectionPage() {
  return (
    <ToolPageFrame
      title='择日速览'
      description={'输入事项、起始日期和天数。\n输出日期清单、日柱、宜忌和冲煞字段。'}>
      <LazyStructuredTool slug='dateSelection' />
    </ToolPageFrame>
  )
}
