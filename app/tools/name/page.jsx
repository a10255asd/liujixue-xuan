import { LazyStructuredTool } from '@/components/lazy-tool-components'
import { ToolPageFrame } from '@/components/xuan-shell'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: '姓名五格五行',
  description: '按用户输入的康熙笔画输出姓名五格、五行和三才字段。',
  path: '/tools/name'
})

export default function NamePage() {
  return (
    <ToolPageFrame
      title='姓名五格五行'
      description={'输入姓名和逐字康熙笔画。\n输出五格、五行和三才字段，不做打分。'}>
      <LazyStructuredTool slug='name' />
    </ToolPageFrame>
  )
}
