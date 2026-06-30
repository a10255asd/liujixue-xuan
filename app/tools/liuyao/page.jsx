import { LiuYaoChartCalculator } from '@/components/liuyao-chart-calculator'
import { ToolPageFrame } from '@/components/xuan-shell'

export const metadata = {
  title: '六爻纳甲排盘',
  description: '手动指定六爻，输出本卦、变卦、六亲、世应、六神、纳甲、旬空、伏神飞神和动变关系。'
}

export default function LiuYaoPage() {
  return (
    <ToolPageFrame
      title='六爻纳甲排盘'
      description='手动指定六个爻位，输出本卦、变卦、六亲、世应、六神、纳甲、五行、月建日辰、旬空、伏神飞神和动变关系。'>
      <LiuYaoChartCalculator />
    </ToolPageFrame>
  )
}
