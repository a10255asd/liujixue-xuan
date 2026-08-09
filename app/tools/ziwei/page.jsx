import { LazyZiWeiChartCalculator } from '@/components/lazy-tool-components'
import { ToolPageFrame } from '@/components/xuan-shell'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: '紫微命盘档案',
  description: '按出生时间、性别、出生地和真太阳时保存十二宫、资料来源、校时线索和复核清单。',
  path: '/tools/ziwei'
})

export default function ZiWeiPage() {
  return (
    <ToolPageFrame
      title='紫微命盘档案'
      description={'输入出生时间、性别、出生地和资料来源。\n输出十二宫星曜、命身宫、大限、复核清单并下载留档。'}>
      <LazyZiWeiChartCalculator />
    </ToolPageFrame>
  )
}
