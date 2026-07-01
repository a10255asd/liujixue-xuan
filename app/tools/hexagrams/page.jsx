import { HexagramReferenceTool } from '@/components/hexagram-reference-tool'
import { ToolPageFrame } from '@/components/xuan-shell'

export const metadata = {
  title: '六十四卦速查',
  description: '按上卦、下卦速查六十四卦名称、卦象组合、八卦五行和基础归类。'
}

export default function HexagramsPage() {
  return (
    <ToolPageFrame
      title='六十四卦速查'
      description={'查询上卦和下卦组合。\n输出卦名、卦象和八卦基础字段。'}>
      <HexagramReferenceTool />
    </ToolPageFrame>
  )
}
