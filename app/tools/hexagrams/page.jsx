import { LazyHexagramReferenceTool } from '@/components/lazy-tool-components'
import { ToolPageFrame } from '@/components/xuan-shell'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: '六十四卦复核记录',
  description: '按问事、六爻、梅花或资料留档场景保存六十四卦复核记录，输出原始出处、上下卦、卦名、五行关系、复核清单和下一步入口。',
  path: '/tools/hexagrams'
})

export default function HexagramsPage() {
  return (
    <ToolPageFrame
      title='六十四卦复核记录'
      description={'选择复核用途、上卦、下卦和原始出处。\n保存卦名、卦象、八卦五行、复核清单和资料边界。'}>
      <LazyHexagramReferenceTool />
    </ToolPageFrame>
  )
}
