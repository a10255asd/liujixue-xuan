import { StructuredTool } from '@/components/structured-tool'
import { ToolPageFrame } from '@/components/xuan-shell'

export const metadata = {
  title: '合盘对照',
  description: '把两份八字或紫微排盘字段并排整理成可复制的 AI 接力材料。'
}

export default function CompatibilityPage() {
  return (
    <ToolPageFrame
      title='合盘对照'
      description={'粘贴两份排盘字段，整理成并排对照和 AI 接力提示。\n只输出字段材料，不在站内判断关系结果。'}>
      <StructuredTool slug='compatibility' />
    </ToolPageFrame>
  )
}
