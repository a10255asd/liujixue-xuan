import { LazyDailyHexagramTool } from '@/components/lazy-tool-components'
import { ToolPageFrame } from '@/components/xuan-shell'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: '每日一卦',
  description: '按日期、时间和事项生成时间起卦记录，输出本卦、变卦、动爻、上下卦并下载图片。',
  path: '/tools/daily'
})

export default function DailyHexagramPage() {
  return (
    <ToolPageFrame
      title='每日一卦'
      description={'输入事项和起卦时间。\n输出本卦、变卦、动爻并下载图片。'}>
      <LazyDailyHexagramTool />
    </ToolPageFrame>
  )
}
