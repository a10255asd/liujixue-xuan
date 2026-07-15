import { LazyWuxingReferenceTool } from '@/components/lazy-tool-components'
import { ToolPageFrame } from '@/components/xuan-shell'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: '干支五行速查',
  description: '速查十天干、十二地支、阴阳、五行、藏干、生克关系和季节对应。',
  path: '/tools/wuxing'
})

export default function WuxingPage() {
  return (
    <ToolPageFrame
      title='干支五行速查'
      description={'查询天干地支基础字段。\n包含阴阳、五行、藏干和生克关系。'}>
      <LazyWuxingReferenceTool />
    </ToolPageFrame>
  )
}
