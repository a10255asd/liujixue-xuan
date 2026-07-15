import { LazyLiuYaoChartCalculator } from '@/components/lazy-tool-components'
import { ToolPageFrame } from '@/components/xuan-shell'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: '六爻纳甲排盘',
  description: '手动指定六爻，输出本卦、变卦、六亲、世应、六神、纳甲、旬空、伏神飞神和动变关系。',
  path: '/tools/liuyao'
})

export default function LiuYaoPage() {
  return (
    <ToolPageFrame
      title='六爻纳甲排盘'
      description={'手动指定六个爻位。\n输出本卦、变卦、六亲、世应和动变关系。'}>
      <LazyLiuYaoChartCalculator />
    </ToolPageFrame>
  )
}
