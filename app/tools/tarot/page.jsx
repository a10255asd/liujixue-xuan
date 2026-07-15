import { LazyStructuredTool } from '@/components/lazy-tool-components'
import { ToolPageFrame } from '@/components/xuan-shell'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: '塔罗抽牌',
  description: '按问题、牌阵和抽牌种子输出塔罗牌阵字段、正逆位和关键词。',
  path: '/tools/tarot'
})

export default function TarotPage() {
  return (
    <ToolPageFrame
      title='塔罗抽牌'
      description={'支持单张牌、三张牌、关系对照和二选一牌阵。\n只输出抽牌字段、牌阵位置、正逆位和关键词。'}>
      <LazyStructuredTool slug='tarot' />
    </ToolPageFrame>
  )
}
