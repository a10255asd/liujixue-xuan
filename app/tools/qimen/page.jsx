import { StructuredTool } from '@/components/structured-tool'
import { ToolPageFrame } from '@/components/xuan-shell'

export const metadata = {
  title: '奇门遁甲速盘',
  description: '按时间输出奇门起局字段、阴阳遁、局数、九宫轮值和基础盘面字段。'
}

export default function QimenPage() {
  return (
    <ToolPageFrame
      title='奇门遁甲速盘'
      description={'输入事项和起局时间。\n输出阴阳遁、局数、值符值使和九宫轮值字段。'}>
      <StructuredTool slug='qimen' />
    </ToolPageFrame>
  )
}
