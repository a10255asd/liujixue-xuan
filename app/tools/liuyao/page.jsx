import { LazyLiuYaoChartCalculator } from '@/components/lazy-tool-components'
import { ToolPageFrame } from '@/components/xuan-shell'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: '六爻问事记录',
  description: '按问题、背景、关注方向和起卦方式生成六爻问事记录，输出本卦变卦、六亲世应、复盘清单和下一步材料。',
  path: '/tools/liuyao'
})

export default function LiuYaoPage() {
  return (
    <ToolPageFrame
      title='六爻问事记录'
      description={'记录问题背景、关注方向和起卦口径。\n输出本卦、变卦、六亲世应、动变关系和复盘清单。'}>
      <LazyLiuYaoChartCalculator />
    </ToolPageFrame>
  )
}
