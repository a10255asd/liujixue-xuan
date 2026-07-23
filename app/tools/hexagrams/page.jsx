import { LazyHexagramReferenceTool } from '@/components/lazy-tool-components'
import { ToolPageFrame } from '@/components/xuan-shell'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: '六十四卦复核',
  description: '按问事、六爻、梅花或资料留档场景复核上下卦、卦名、卦象、八卦五行和下一步入口。',
  path: '/tools/hexagrams'
})

export default function HexagramsPage() {
  return (
    <ToolPageFrame
      title='六十四卦复核'
      description={'选择复核用途、上卦和下卦。\n输出卦名、卦象、八卦五行和资料边界。'}>
      <LazyHexagramReferenceTool />
    </ToolPageFrame>
  )
}
