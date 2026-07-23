import { LazyWuxingReferenceTool } from '@/components/lazy-tool-components'
import { ToolPageFrame } from '@/components/xuan-shell'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: '干支五行复核',
  description: '按排盘、姓名、择日或资料留档场景复核天干地支、阴阳五行、藏干、生克关系和下一步入口。',
  path: '/tools/wuxing'
})

export default function WuxingPage() {
  return (
    <ToolPageFrame
      title='干支五行复核'
      description={'输入要核对的天干、地支或五行。\n按排盘、姓名、择日或资料留档场景整理字段口径。'}>
      <LazyWuxingReferenceTool />
    </ToolPageFrame>
  )
}
