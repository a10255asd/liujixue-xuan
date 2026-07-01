import { StructuredTool } from '@/components/structured-tool'
import { ToolPageFrame } from '@/components/xuan-shell'

export const metadata = {
  title: '寻时定盘表',
  description: '按日期输出十二时辰四柱对照，辅助出生时辰候选排查。'
}

export default function FindTimePage() {
  return (
    <ToolPageFrame
      title='寻时定盘表'
      description={'输入日期。\n输出十二时辰对应四柱，适合做时辰候选表。'}>
      <StructuredTool slug='findTime' />
    </ToolPageFrame>
  )
}
