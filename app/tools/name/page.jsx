import { LazyStructuredTool } from '@/components/lazy-tool-components'
import { ToolPageFrame } from '@/components/xuan-shell'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: '姓名方案记录',
  description: '按用途、来源口径、命名目标、候选备注、逐字康熙笔画、含义偏好和避讳限制整理姓名方案记录，输出五格三才与人工复核清单。',
  path: '/tools/name'
})

export default function NamePage() {
  return (
    <ToolPageFrame
      title='姓名方案记录'
      description={'输入姓名用途、来源口径、命名目标、逐字康熙笔画、候选备注和避讳限制。\n输出五格、三才、方案记录和人工复核清单，不做姓名打分。'}>
      <LazyStructuredTool slug='name' />
    </ToolPageFrame>
  )
}
