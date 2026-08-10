import { LazyStructuredTool } from '@/components/lazy-tool-components'
import { ToolPageFrame } from '@/components/xuan-shell'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: '大六壬问事记录',
  description: '按事项、背景、关注方向和占时输出大六壬月将、天地盘、四课三传、复盘清单和下一步入口。',
  path: '/tools/daliuren'
})

export default function DaliurenPage() {
  return (
    <ToolPageFrame
      title='大六壬问事记录'
      description={'输入事项、背景材料和占时。\n输出月将、天地盘、四课三传、复盘清单并下载留档。'}>
      <LazyStructuredTool slug='daliuren' />
    </ToolPageFrame>
  )
}
