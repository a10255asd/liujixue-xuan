import { LazyHexagramReferenceTool } from '@/components/lazy-tool-components'
import { ToolPageFrame } from '@/components/xuan-shell'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: '六十四卦速查',
  description: '按上卦、下卦速查六十四卦名称、卦象组合、八卦五行和基础归类。',
  path: '/tools/hexagrams'
})

export default function HexagramsPage() {
  return (
    <ToolPageFrame
      title='六十四卦速查'
      description={'查询上卦和下卦组合。\n输出卦名、卦象和八卦基础字段。'}>
      <LazyHexagramReferenceTool />
    </ToolPageFrame>
  )
}
