import assert from 'node:assert/strict'
import test from 'node:test'
import { buildWuxingRecordRows } from '../lib/wuxing-review-record.js'

test('wuxing review record preserves source notes and boundary', () => {
  const rows = buildWuxingRecordRows({
    profile: {
      label: '择日时辰复核',
      method: '先核对地支五行、季节和藏干，再回到候选记录。',
      caution: '只做资料层复核。'
    },
    query: '甲 子 木',
    sourceNote: '来自黄历日课记录和时辰候选记录。',
    reviewItems: [
      { token: '甲', kind: '天干', element: '木' },
      { token: '子', kind: '地支', element: '水' },
      { token: '木', kind: '五行', element: '木' }
    ]
  })
  const text = rows.map(row => `${row.label}：${row.value}`).join('\n')

  assert.equal(rows.find(row => row.label === '资料来源').value, '来自黄历日课记录和时辰候选记录。')
  assert.match(rows.find(row => row.label === '识别结果').value, /甲（天干\/木）/)
  assert.match(rows.find(row => row.label === '五行分布').value, /木2/)
  assert.match(rows.find(row => row.label === '复核顺序').value, /地支五行/)
  assert.match(rows.find(row => row.label === '输出边界').value, /不输出吉凶、喜忌、强弱定论或结果保证/)
  assert.doesNotMatch(text, /一定|必然|好运|坏运/)
})

test('wuxing review record falls back for empty input', () => {
  const rows = buildWuxingRecordRows()

  assert.equal(rows.find(row => row.label === '待复核字段').value, '未填写待复核字段')
  assert.equal(rows.find(row => row.label === '识别结果').value, '暂无已识别字段')
  assert.equal(rows.find(row => row.label === '五行分布').value, '暂无已识别五行')
})
