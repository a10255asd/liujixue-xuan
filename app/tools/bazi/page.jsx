import { LazyBaZiChartCalculator } from '@/components/lazy-tool-components'
import { ToolPageFrame } from '@/components/xuan-shell'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: '八字专业细盘',
  description: '按公历、出生地和真太阳时输出四柱、十神、神煞、大运、流年和专业细盘。',
  path: '/tools/bazi'
})

export default function BaZiPage() {
  return (
    <ToolPageFrame
      title='八字专业细盘'
      description={'输入出生时间和出生地。\n按真太阳时输出四柱、神煞、大运、流年并下载图片。'}>
      <LazyBaZiChartCalculator />
    </ToolPageFrame>
  )
}
