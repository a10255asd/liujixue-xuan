import { LocalMemoryDashboard } from '@/components/local-memory-dashboard'
import { ToolPageFrame } from '@/components/xuan-shell'

export const metadata = {
  title: '收藏与记录',
  description: '本地保存玄学工具收藏和排盘记录，不需要登录即可使用。'
}

export default function RecordsPage() {
  return (
    <ToolPageFrame
      title='收藏与记录'
      description={'本地保存收藏工具和排盘记录。\n重要记录可以导出 JSON，方便备份、迁移和继续整理。'}>
      <LocalMemoryDashboard />
    </ToolPageFrame>
  )
}
