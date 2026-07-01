import { StructuredTool } from '@/components/structured-tool'
import { ToolPageFrame } from '@/components/xuan-shell'

export const metadata = {
  title: '姓名五格五行',
  description: '按用户输入的康熙笔画输出姓名五格、五行和三才字段。'
}

export default function NamePage() {
  return (
    <ToolPageFrame
      title='姓名五格五行'
      description={'输入姓名和逐字康熙笔画。\n输出五格、五行和三才字段，不做打分。'}>
      <StructuredTool slug='name' />
    </ToolPageFrame>
  )
}
