import { StructuredTool } from '@/components/structured-tool'
import { ToolPageFrame } from '@/components/xuan-shell'

export const metadata = {
  title: '大六壬起课速览',
  description: '按事项和占时输出大六壬起课基础字段、月将、占时、日辰、旬空和课传速览。'
}

export default function DaliurenPage() {
  return (
    <ToolPageFrame
      title='大六壬起课速览'
      description={'输入事项和占时。\n输出月将、日辰、占时、旬空和课传速览字段。'}>
      <StructuredTool slug='daliuren' />
    </ToolPageFrame>
  )
}
