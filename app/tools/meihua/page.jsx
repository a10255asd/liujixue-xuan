import { LazyStructuredTool } from '@/components/lazy-tool-components'
import { ToolPageFrame } from '@/components/xuan-shell'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: '梅花易数排盘',
  description: '按三数或时间起卦输出本卦、变卦、互卦、动爻、体用和取数推导。',
  path: '/tools/meihua'
})

export default function MeihuaPage() {
  return (
    <ToolPageFrame
      title='梅花易数排盘'
      description={'支持三数起卦和时间起卦。\n输出本卦、变卦、互卦、动爻和体用字段。'}>
      <LazyStructuredTool slug='meihua' />
    </ToolPageFrame>
  )
}
