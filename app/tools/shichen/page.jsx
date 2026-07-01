import { ShichenReferenceTool } from '@/components/shichen-reference-tool'
import { ToolPageFrame } from '@/components/xuan-shell'

export const metadata = {
  title: '十二时辰速查',
  description: '速查子丑寅卯等十二时辰的现代时间段、五行、生肖和昼夜分段。'
}

export default function ShichenPage() {
  return (
    <ToolPageFrame
      title='十二时辰速查'
      description={'查询地支时辰和现代时间。\n输出五行、生肖、别名和昼夜分段。'}>
      <ShichenReferenceTool />
    </ToolPageFrame>
  )
}
