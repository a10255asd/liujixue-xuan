import assert from 'node:assert/strict'
import test from 'node:test'
import { buildHexagramRecordRows } from '../lib/hexagram-review-record.js'

const upper = { name: '兑', image: '泽', element: '金', lines: '110' }
const lower = { name: '震', image: '雷', element: '木', lines: '100' }

test('hexagram review record preserves source and boundary', () => {
  const rows = buildHexagramRecordRows({
    profile: {
      label: '六爻盘面复核',
      method: '先核对卦名、卦象和八卦五行，再看世应、六亲和动爻。',
      caution: '六爻判断需回到完整盘面。'
    },
    topic: '合同推进问题',
    sourceNote: '来自六爻问事记录本卦。',
    upper,
    lower,
    hexagramName: '泽雷随',
    sameElement: false
  })
  const text = rows.map(row => `${row.label}：${row.value}`).join('\n')

  assert.equal(rows.find(row => row.label === '原始出处').value, '来自六爻问事记录本卦。')
  assert.equal(rows.find(row => row.label === '卦名').value, '泽雷随')
  assert.match(rows.find(row => row.label === '上卦').value, /兑为泽/)
  assert.match(rows.find(row => row.label === '下卦').value, /震为雷/)
  assert.match(rows.find(row => row.label === '五行关系').value, /异五行/)
  assert.match(rows.find(row => row.label === '输出边界').value, /不输出吉凶、应期、结果保证/)
  assert.doesNotMatch(text, /一定|必然|好运|坏运/)
})

test('hexagram review record falls back for empty input', () => {
  const rows = buildHexagramRecordRows()

  assert.equal(rows.find(row => row.label === '事项/来源').value, '未填写事项')
  assert.equal(rows.find(row => row.label === '原始出处').value, '未填写原始出处。')
  assert.equal(rows.find(row => row.label === '卦名').value, '未识别卦名')
})
