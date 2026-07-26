import { LazyBaZiChartCalculator } from '@/components/lazy-tool-components'
import { ToolPageFrame } from '@/components/xuan-shell'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: '八字出生档案',
  description: '按公历、出生地和真太阳时保存四柱、资料来源、校时线索、复核清单、大运和流年。',
  path: '/tools/bazi'
})

export default function BaZiPage() {
  return (
    <ToolPageFrame
      title='八字出生档案'
      description={'输入出生时间、出生地和资料来源。\n按真太阳时输出四柱、校时复核、大运、流年并下载留档。'}>
      <LazyBaZiChartCalculator />
    </ToolPageFrame>
  )
}
