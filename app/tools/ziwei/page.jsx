import { ZiWeiChartCalculator } from '@/components/ziwei-chart-calculator'
import { ToolPageFrame } from '@/components/xuan-shell'

export const metadata = {
  title: '紫微斗数命盘',
  description: '按出生时间、性别和出生地输出紫微斗数十二宫专业盘。'
}

export default function ZiWeiPage() {
  return (
    <ToolPageFrame
      title='紫微斗数命盘'
      description={'输入出生时间、性别和出生地。\n输出十二宫星曜、大限并下载专业盘图片。'}>
      <ZiWeiChartCalculator />
    </ToolPageFrame>
  )
}
