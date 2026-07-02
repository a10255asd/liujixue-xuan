import { StructuredTool } from '@/components/structured-tool'
import { ToolPageFrame } from '@/components/xuan-shell'

export const metadata = {
  title: '大六壬四课三传',
  description: '按事项和占时输出大六壬月将、日辰、占时、天地盘十二宫、四课、三传和天将排布字段。'
}

export default function DaliurenPage() {
  return (
    <ToolPageFrame
      title='大六壬四课三传'
      description={'输入事项和占时。\n输出月将、日辰、天地盘十二宫、四课、三传和天将排布字段。'}>
      <StructuredTool slug='daliuren' />
    </ToolPageFrame>
  )
}
