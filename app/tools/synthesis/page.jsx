import { StructuredTool } from '@/components/structured-tool'
import { ToolPageFrame } from '@/components/xuan-shell'

export const metadata = {
  title: '综合合参工作台',
  description: '汇总八字、紫微、六爻、梅花、塔罗和日课字段，生成可交给 AI 接力的合参材料。'
}

export default function SynthesisPage() {
  return (
    <ToolPageFrame
      title='综合合参工作台'
      description={'把多份排盘、抽牌和日课字段整理成一份材料。\n只做字段汇总、完整度检查和 AI 接力提示词。'}>
      <StructuredTool slug='synthesis' />
    </ToolPageFrame>
  )
}
