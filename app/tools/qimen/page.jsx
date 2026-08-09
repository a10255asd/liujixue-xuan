import { LazyStructuredTool } from '@/components/lazy-tool-components'
import { ToolPageFrame } from '@/components/xuan-shell'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: '奇门问事记录',
  description: '按事项、背景、关注方向和起局时间输出奇门拆补法九宫盘、值符值使、复盘清单和下一步入口。',
  path: '/tools/qimen'
})

export default function QimenPage() {
  return (
    <ToolPageFrame
      title='奇门问事记录'
      description={'输入事项、背景材料和起局时间。\n输出九宫盘、值符值使、复盘清单并下载留档。'}>
      <LazyStructuredTool slug='qimen' />
    </ToolPageFrame>
  )
}
