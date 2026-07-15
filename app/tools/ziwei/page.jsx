import { LazyZiWeiChartCalculator } from '@/components/lazy-tool-components'
import { ToolPageFrame } from '@/components/xuan-shell'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: '紫微斗数命盘',
  description: '按出生时间、性别和出生地输出紫微斗数十二宫专业盘。',
  path: '/tools/ziwei'
})

export default function ZiWeiPage() {
  return (
    <ToolPageFrame
      title='紫微斗数命盘'
      description={'输入出生时间、性别和出生地。\n输出十二宫星曜、大限并下载专业盘图片。'}>
      <LazyZiWeiChartCalculator />
    </ToolPageFrame>
  )
}
