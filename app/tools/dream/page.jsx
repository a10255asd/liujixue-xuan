import { StructuredTool } from '@/components/structured-tool'
import { ToolPageFrame } from '@/components/xuan-shell'

export const metadata = {
  title: '梦境记录整理',
  description: '记录梦境全文、醒来情绪、人物场景和反复意象，整理成可保存的结构字段。'
}

export default function DreamPage() {
  return (
    <ToolPageFrame
      title='梦境记录整理'
      description={'整理梦境全文、情绪、场景、人物和反复意象。\n只做材料记录，不输出吉凶、预兆或应期判断。'}>
      <StructuredTool slug='dream' />
    </ToolPageFrame>
  )
}
