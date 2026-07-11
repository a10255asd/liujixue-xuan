import { DailyHexagramTool } from '@/components/daily-hexagram-tool'
import { ToolPageFrame } from '@/components/xuan-shell'

export const metadata = {
  title: '每日一卦',
  description: '按日期、时间和事项生成时间起卦记录，输出本卦、变卦、动爻、上下卦并下载图片。'
}

export default function DailyHexagramPage() {
  return (
    <ToolPageFrame
      title='每日一卦'
      description={'输入事项和起卦时间。\n输出本卦、变卦、动爻并下载图片。'}>
      <DailyHexagramTool />
    </ToolPageFrame>
  )
}
