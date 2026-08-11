import { LazyWuxingReferenceTool } from '@/components/lazy-tool-components'
import { ToolPageFrame } from '@/components/xuan-shell'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: '干支五行复核记录',
  description: '按排盘、姓名、择日或资料留档场景保存干支五行复核记录，输出资料来源、识别结果、五行分布、复核清单和下一步入口。',
  path: '/tools/wuxing'
})

export default function WuxingPage() {
  return (
    <ToolPageFrame
      title='干支五行复核记录'
      description={'输入要核对的天干、地支、五行和资料来源。\n按排盘、姓名、择日或资料留档场景保存字段口径、复核清单和下一步入口。'}>
      <LazyWuxingReferenceTool />
    </ToolPageFrame>
  )
}
