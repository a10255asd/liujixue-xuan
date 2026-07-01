import { StructuredTool } from '@/components/structured-tool'
import { ToolPageFrame } from '@/components/xuan-shell'

export const metadata = {
  title: '出生校时对照',
  description: '围绕参考出生时间输出前后时辰四柱候选，辅助人工校时。'
}

export default function BirthTimePage() {
  return (
    <ToolPageFrame
      title='出生校时对照'
      description={'输入参考出生时间。\n输出前后几个时辰的四柱候选，方便校时对照。'}>
      <StructuredTool slug='birthTime' />
    </ToolPageFrame>
  )
}
