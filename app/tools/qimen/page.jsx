import { StructuredTool } from '@/components/structured-tool'
import { ToolPageFrame } from '@/components/xuan-shell'

export const metadata = {
  title: '奇门遁甲拆补法排盘',
  description: '按时间输出奇门拆补法起局、节气三元、阴阳遁局、值符值使、天盘地盘、八门九星八神和九宫综合盘。'
}

export default function QimenPage() {
  return (
    <ToolPageFrame
      title='奇门遁甲拆补法排盘'
      description={'输入事项和起局时间。\n输出节气三元、阴阳遁局、值符值使、天盘地盘、八门九星八神和九宫综合盘。'}>
      <StructuredTool slug='qimen' />
    </ToolPageFrame>
  )
}
