import { CalendarTool } from '@/components/calendar-tool'
import { ToolPageFrame } from '@/components/xuan-shell'

export const metadata = {
  title: '黄历节气',
  description: '查询公历、农历、四柱、宜忌、冲煞、旬空、星宿、纳音、彭祖和上下节气。'
}

export default function CalendarPage() {
  return (
    <ToolPageFrame
      title='黄历节气'
      description={'选择日期和时间。\n输出黄历、四柱和节气字段。'}>
      <CalendarTool />
    </ToolPageFrame>
  )
}
