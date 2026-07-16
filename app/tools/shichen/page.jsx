import { LazyShichenReferenceTool } from '@/components/lazy-tool-components'
import { ToolPageFrame } from '@/components/xuan-shell'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: '十二时辰速查',
  description: '按事项类型筛选日内时辰候选，并速查十二时辰的现代时间段、五行、生肖和昼夜分段。',
  path: '/tools/shichen'
})

export default function ShichenPage() {
  return (
    <ToolPageFrame
      title='十二时辰速查'
      description={'输入日期和事项类型，先筛日内候选时辰。\n再展开五行、生肖、别名和昼夜分段。'}>
      <LazyShichenReferenceTool />
    </ToolPageFrame>
  )
}
