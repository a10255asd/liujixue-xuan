import { LazyStructuredTool } from '@/components/lazy-tool-components'
import { ToolPageFrame } from '@/components/xuan-shell'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: '出生校时工作台',
  description: '围绕参考出生时间输出前后时辰候选、日柱变化、子时复核和下一步排盘入口，辅助人工校时。',
  path: '/tools/birth-time'
})

export default function BirthTimePage() {
  return (
    <ToolPageFrame
      title='出生校时工作台'
      description={'输入参考出生时间、出生地和校时线索。\n输出候选差异、子时提示和下一步排盘入口。'}>
      <LazyStructuredTool slug='birthTime' />
    </ToolPageFrame>
  )
}
