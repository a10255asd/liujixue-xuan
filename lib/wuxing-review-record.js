const cleanRecordText = (value, fallback) => {
  const text = String(value || '').trim()

  return text || fallback
}

const summarizeElements = reviewItems => {
  const counts = reviewItems.reduce((result, item) => ({
    ...result,
    [item.element]: (result[item.element] || 0) + 1
  }), {})
  const summary = Object.entries(counts)
    .map(([element, count]) => `${element}${count}`)
    .join('、')

  return summary || '暂无已识别五行'
}

export const buildWuxingRecordRows = ({ profile, query, reviewItems = [], sourceNote } = {}) => {
  const recordProfile = profile || { label: '资料留档', method: '先整理字段来源，再核对基础关系。', caution: '只做资料层复核。' }
  const recordQuery = cleanRecordText(query, '未填写待复核字段')
  const recordSource = cleanRecordText(sourceNote, '未填写资料来源。')
  const recognizedText = reviewItems.length
    ? reviewItems.map(item => `${item.token}（${item.kind}/${item.element}）`).join('、')
    : '暂无已识别字段'

  return [
    { label: '复核场景', value: recordProfile.label },
    { label: '待复核字段', value: recordQuery },
    { label: '资料来源', value: recordSource },
    { label: '识别结果', value: recognizedText },
    { label: '五行分布', value: summarizeElements(reviewItems) },
    { label: '复核顺序', value: recordProfile.method },
    { label: '今日小动作', value: '把识别出的天干、地支、五行逐项回填到原始排盘、姓名或择日记录里。' },
    { label: '后续复盘', value: '记录字段来源、引用页面、人工改动原因和下次需要重新核对的材料。' },
    { label: '输出边界', value: `${recordProfile.caution} 不输出吉凶、喜忌、强弱定论或结果保证。` }
  ]
}
