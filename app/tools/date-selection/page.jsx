import { StructuredTool } from '@/components/structured-tool'
import { ToolPageFrame } from '@/components/xuan-shell'

export const metadata = {
  title: '择日速览',
  description: '按日期范围输出每日干支、宜忌、冲煞和基础择日字段。'
}

export default function DateSelectionPage() {
  return (
    <ToolPageFrame
      title='择日速览'
      description={'输入事项、起始日期和天数。\n输出日期清单、日柱、宜忌和冲煞字段。'}>
      <StructuredTool slug='dateSelection' />
    </ToolPageFrame>
  )
}
