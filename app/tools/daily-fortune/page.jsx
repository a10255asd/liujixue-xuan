import { LazyStructuredTool } from '@/components/lazy-tool-components'
import { ToolPageFrame } from '@/components/xuan-shell'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: '每日行动速览',
  description: '按事项类型输出每日行动复核清单，包含宜忌命中、个人生肖冲日、四柱、旬空和方位字段。',
  path: '/tools/daily-fortune'
})

export default function DailyFortunePage() {
  return (
    <ToolPageFrame
      title='每日行动速览'
      description={'输入日期、事项类型和个人生肖。\n输出今日行动复核清单、宜忌命中和日课字段。'}>
      <LazyStructuredTool slug='dailyFortune' />
    </ToolPageFrame>
  )
}
