const cleanRecordText = (value, fallback) => {
  const text = String(value || '').trim()

  return text || fallback
}

export const buildHexagramRecordRows = ({ profile, topic, sourceNote, upper, lower, hexagramName, sameElement } = {}) => {
  const recordProfile = profile || { label: '资料留档', method: '先整理卦名和上下卦字段。', caution: '只做资料层复核。' }
  const recordTopic = cleanRecordText(topic, '未填写事项')
  const recordSource = cleanRecordText(sourceNote, '未填写原始出处。')
  const upperText = upper ? `${upper.name}为${upper.image} / ${upper.element} / 三爻${upper.lines}` : '未选择上卦'
  const lowerText = lower ? `${lower.name}为${lower.image} / ${lower.element} / 三爻${lower.lines}` : '未选择下卦'

  return [
    { label: '复核场景', value: recordProfile.label },
    { label: '事项/来源', value: recordTopic },
    { label: '原始出处', value: recordSource },
    { label: '卦名', value: hexagramName || '未识别卦名' },
    { label: '上卦', value: upperText },
    { label: '下卦', value: lowerText },
    { label: '五行关系', value: sameElement ? '上下卦同五行，先作为字段关系留档。' : '上下卦异五行，先核对上下卦各自五行再回到原盘。' },
    { label: '复核顺序', value: recordProfile.method },
    { label: '今日小动作', value: `把「${hexagramName || recordTopic}」回填到原始问事记录，标注本卦、变卦或互卦位置。` },
    { label: '后续复盘', value: '记录引用来源、动爻位置、变卦关系、人工改动原因和后续事实反馈。' },
    { label: '输出边界', value: `${recordProfile.caution} 不输出吉凶、应期、结果保证或确定性判断。` }
  ]
}
