import { WuxingReferenceTool } from '@/components/wuxing-reference-tool'
import { ToolPageFrame } from '@/components/xuan-shell'

export const metadata = {
  title: '干支五行速查',
  description: '速查十天干、十二地支、阴阳、五行、藏干、生克关系和季节对应。'
}

export default function WuxingPage() {
  return (
    <ToolPageFrame
      title='干支五行速查'
      description={'查询天干地支基础字段。\n包含阴阳、五行、藏干和生克关系。'}>
      <WuxingReferenceTool />
    </ToolPageFrame>
  )
}
