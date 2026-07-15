import { LazyStructuredTool } from '@/components/lazy-tool-components'
import { ToolPageFrame } from '@/components/xuan-shell'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: '每日运势速览',
  description: '按日期输出今日四柱、日元五行、宜忌、冲煞、旬空和方位字段。',
  path: '/tools/daily-fortune'
})

export default function DailyFortunePage() {
  return (
    <ToolPageFrame
      title='每日运势速览'
      description={'选择日期和时间。\n输出今日四柱、宜忌、冲煞、旬空和方位字段。'}>
      <LazyStructuredTool slug='dailyFortune' />
    </ToolPageFrame>
  )
}
