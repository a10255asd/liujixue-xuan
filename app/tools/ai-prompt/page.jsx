import { StructuredTool } from '@/components/structured-tool'
import { ToolPageFrame } from '@/components/xuan-shell'

export const metadata = {
  title: 'AI 解析提示词',
  description: '把排盘字段、问题背景、边界要求和输出格式整理成可复制的 AI 解析提示词。'
}

export default function AiPromptPage() {
  return (
    <ToolPageFrame
      title='AI 解析提示词'
      description={'粘贴排盘字段和问题背景。\n生成带边界的 AI 接力提示词，不在站内直接输出结论。'}>
      <StructuredTool slug='aiPrompt' />
    </ToolPageFrame>
  )
}
