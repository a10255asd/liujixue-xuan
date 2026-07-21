import { LazyDailyHexagramTool } from '@/components/lazy-tool-components'
import { ToolPageFrame } from '@/components/xuan-shell'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: '每日一卦记录',
  description: '按日期、时间、事项和关注方向生成时间起卦记录，输出本卦、变卦、动爻、复盘清单和下一步入口。',
  path: '/tools/daily'
})

export default function DailyHexagramPage() {
  return (
    <ToolPageFrame
      title='每日一卦记录'
      description={'输入事项、起卦时间和关注方向。\n输出卦象字段、问事复盘清单和下一步入口。'}>
      <LazyDailyHexagramTool />
    </ToolPageFrame>
  )
}
