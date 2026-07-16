import { LazyCalendarTool } from '@/components/lazy-tool-components'
import { ToolPageFrame } from '@/components/xuan-shell'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: '黄历节气',
  description: '按事项类型查询单日黄历速览，输出宜忌命中、冲煞复核、公历农历、四柱、纳音和上下节气。',
  path: '/tools/calendar'
})

export default function CalendarPage() {
  return (
    <ToolPageFrame
      title='黄历节气'
      description={'输入日期、时间和事项类型。\n先看单日速览，再展开黄历、四柱和节气字段。'}>
      <LazyCalendarTool />
    </ToolPageFrame>
  )
}
