import { LazyStructuredTool } from '@/components/lazy-tool-components'
import { ToolPageFrame } from '@/components/xuan-shell'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: '寻时定盘工作台',
  description: '按日期输出十二时辰四柱全表、重点候选、日柱变化和下一步排盘入口，辅助出生时辰排查。',
  path: '/tools/find-time'
})

export default function FindTimePage() {
  return (
    <ToolPageFrame
      title='寻时定盘工作台'
      description={'输入日期、用途和关注时段。\n输出重点候选、十二时辰全表和下一步排盘入口。'}>
      <LazyStructuredTool slug='findTime' />
    </ToolPageFrame>
  )
}
