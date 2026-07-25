import { LazyStructuredTool } from '@/components/lazy-tool-components'
import { ToolPageFrame } from '@/components/xuan-shell'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: '梅花问事记录',
  description: '按事项、背景、关注方向、三数或时间起卦生成梅花问事记录，输出卦盘字段、复盘清单和下一步入口。',
  path: '/tools/meihua'
})

export default function MeihuaPage() {
  return (
    <ToolPageFrame
      title='梅花问事记录'
      description={'记录事项背景、关注方向和起卦口径。\n输出卦盘字段、体用材料、复盘清单和下一步入口。'}>
      <LazyStructuredTool slug='meihua' />
    </ToolPageFrame>
  )
}
