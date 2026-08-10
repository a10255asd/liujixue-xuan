import { LazyShichenReferenceTool } from '@/components/lazy-tool-components'
import { ToolPageFrame } from '@/components/xuan-shell'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: '时辰候选记录',
  description: '按事项类型、执行窗口和现实限制筛选日内时辰候选，输出候选级别、冲时复核、执行复盘清单和十二时辰字段。',
  path: '/tools/shichen'
})

export default function ShichenPage() {
  return (
    <ToolPageFrame
      title='时辰候选记录'
      description={'输入日期、事项类型、执行窗口和现实限制，先筛日内候选时辰。\n再保存冲时复核、执行复盘清单、五行、生肖、别名和昼夜分段。'}>
      <LazyShichenReferenceTool />
    </ToolPageFrame>
  )
}
