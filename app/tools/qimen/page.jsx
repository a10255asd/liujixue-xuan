import { LazyStructuredTool } from '@/components/lazy-tool-components'
import { ToolPageFrame } from '@/components/xuan-shell'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: '奇门遁甲速盘',
  description: '按时间输出奇门拆补法起局、节气三元、阴阳遁局、值符值使、天盘地盘、八门九星八神和九宫综合盘。',
  path: '/tools/qimen'
})

export default function QimenPage() {
  return (
    <ToolPageFrame
      title='奇门遁甲速盘'
      description={'输入事项和起局时间。\n输出节气三元、阴阳遁局、值符值使、天盘地盘、八门九星八神和九宫综合盘。'}>
      <LazyStructuredTool slug='qimen' />
    </ToolPageFrame>
  )
}
