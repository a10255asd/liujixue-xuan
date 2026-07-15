import { LazyStructuredTool } from '@/components/lazy-tool-components'
import { ToolPageFrame } from '@/components/xuan-shell'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: '出生校时对照',
  description: '围绕参考出生时间输出前后时辰四柱候选，辅助人工校时。',
  path: '/tools/birth-time'
})

export default function BirthTimePage() {
  return (
    <ToolPageFrame
      title='出生校时对照'
      description={'输入参考出生时间。\n输出前后几个时辰的四柱候选，方便校时对照。'}>
      <LazyStructuredTool slug='birthTime' />
    </ToolPageFrame>
  )
}
