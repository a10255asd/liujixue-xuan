import { LazyStructuredTool } from '@/components/lazy-tool-components'
import { ToolPageFrame } from '@/components/xuan-shell'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: '每日行动记录',
  description: '按事项类型、现实限制和执行窗口输出每日行动记录，包含宜忌命中、生肖冲日、复盘清单和下一步入口。',
  path: '/tools/daily-fortune'
})

export default function DailyFortunePage() {
  return (
    <ToolPageFrame
      title='每日行动记录'
      description={'输入日期、事项类型、现实限制、执行窗口和个人生肖。\n输出今日行动记录、宜忌命中、日课字段、复盘清单和下一步入口。'}>
      <LazyStructuredTool slug='dailyFortune' />
    </ToolPageFrame>
  )
}
