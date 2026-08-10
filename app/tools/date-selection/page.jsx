import { LazyStructuredTool } from '@/components/lazy-tool-components'
import { ToolPageFrame } from '@/components/xuan-shell'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: '择日候选记录',
  description: '按事项类型、限制条件和日期范围输出候选日期、宜忌命中、冲煞、复核清单和下一步入口。',
  path: '/tools/date-selection'
})

export default function DateSelectionPage() {
  return (
    <ToolPageFrame
      title='择日候选记录'
      description={'输入事项类型、限制条件、起始日期和天数。\n先给出候选日期，再保存宜忌、冲煞、复核清单和下一步入口。'}>
      <LazyStructuredTool slug='dateSelection' />
    </ToolPageFrame>
  )
}
