import { LazyStructuredTool } from '@/components/lazy-tool-components'
import { ToolPageFrame } from '@/components/xuan-shell'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: '塔罗问题记录',
  description: '按问题、背景、关注方向和牌阵输出塔罗抽牌字段、问题拆解、复盘清单和下一步入口。',
  path: '/tools/tarot'
})

export default function TarotPage() {
  return (
    <ToolPageFrame
      title='塔罗问题记录'
      description={'输入问题、背景和关注方向。\n输出抽牌字段、问题拆解、复盘清单和下一步入口。'}>
      <LazyStructuredTool slug='tarot' />
    </ToolPageFrame>
  )
}
