import assert from 'node:assert/strict'
import test from 'node:test'
import { buildNamePlanRecordRows } from '../lib/name-plan-record.js'

test('name plan record preserves source candidate notes and boundary', () => {
  const rows = buildNamePlanRecordRows({
    profile: {
      label: '新生儿命名',
      review: '先核对出生信息、姓氏字数和逐字康熙笔画，再把候选名放入同一表格横向比较。',
      action: '保留 3-5 个候选名，逐一补齐读音、字义、出处和家族避讳。'
    },
    fullName: '刘鸡血',
    surname: '刘',
    givenName: '鸡血',
    sourceNote: '姓氏来自家族用字，笔画按康熙字典口径人工填写。',
    namingGoal: '希望名字好读、好写，含义积极。',
    meaningPreference: '偏向明亮、行动感。',
    candidateNotes: '备选刘既明，需补重名检索和家人反馈。',
    avoidNotes: '避开同音误解和难输入字。',
    padded: [15, 18, 6],
    grids: [
      ['天格', 16],
      ['人格', 33],
      ['地格', 24],
      ['外格', 7],
      ['总格', 39]
    ],
    tianElement: '土',
    renElement: '火',
    diElement: '火',
    missingStrokeCount: 0
  })
  const text = rows.map(row => `${row.label}：${row.value}`).join('\n')

  assert.equal(rows.find(row => row.label === '来源/口径').value, '姓氏来自家族用字，笔画按康熙字典口径人工填写。')
  assert.match(rows.find(row => row.label === '姓名方案').value, /刘鸡血/)
  assert.match(rows.find(row => row.label === '五格摘要').value, /人格33画/)
  assert.match(rows.find(row => row.label === '三才字段').value, /土 \/ 火 \/ 火/)
  assert.match(rows.find(row => row.label === '候选对比').value, /刘既明/)
  assert.match(rows.find(row => row.label === '输出边界').value, /不输出姓名打分、吉凶定论或结果保证/)
  assert.doesNotMatch(text, /一定|必然|好运|坏运/)
})

test('name plan record falls back for empty input', () => {
  const rows = buildNamePlanRecordRows()

  assert.equal(rows.find(row => row.label === '姓名方案').value, '未填写姓名')
  assert.equal(rows.find(row => row.label === '来源/口径').value, '未填写来源或笔画口径。')
  assert.equal(rows.find(row => row.label === '笔画序列').value, '未填写逐字笔画')
  assert.equal(rows.find(row => row.label === '五格摘要').value, '未计算五格')
  assert.equal(rows.find(row => row.label === '三才字段').value, '未计算三才')
})
