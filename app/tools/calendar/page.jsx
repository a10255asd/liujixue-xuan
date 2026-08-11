import { LazyCalendarTool } from '@/components/lazy-tool-components'
import { ToolPageFrame } from '@/components/xuan-shell'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: '黄历日课记录',
  description: '按事项类型、现实限制、日期和时间生成黄历日课记录，输出宜忌命中、冲煞复核、复核清单、四柱、纳音和上下节气。',
  path: '/tools/calendar'
})

export default function CalendarPage() {
  return (
    <ToolPageFrame
      title='黄历日课记录'
      description={'输入日期、时间、事项类型和现实限制。\n保存单日日课记录、宜忌命中、冲煞复核、复核清单、四柱、纳音和节气字段。'}>
      <LazyCalendarTool />
    </ToolPageFrame>
  )
}
