const cleanRecordText = (value, fallback) => {
  const text = String(value || '').trim()

  return text || fallback
}

export const buildNamePlanRecordRows = ({
  profile,
  fullName,
  surname,
  givenName,
  sourceNote,
  namingGoal,
  meaningPreference,
  avoidNotes,
  candidateNotes,
  padded = [],
  grids = [],
  tianElement,
  renElement,
  diElement,
  missingStrokeCount = 0
} = {}) => {
  const recordProfile = profile || {
    label: '姓名档案',
    review: '先保存姓名拆字、笔画、三才和人工复核事项。',
    action: '把来源、笔画口径和待确认项写清楚，方便之后复查。'
  }
  const recordName = cleanRecordText(fullName, '未填写姓名')
  const recordSurname = cleanRecordText(surname, '未填写姓氏')
  const recordGivenName = cleanRecordText(givenName, '未填写名字')
  const recordSource = cleanRecordText(sourceNote, '未填写来源或笔画口径。')
  const recordGoal = cleanRecordText(namingGoal, '未填写命名目标。')
  const recordMeaning = cleanRecordText(meaningPreference, '未填写含义、出处或风格偏好。')
  const recordAvoid = cleanRecordText(avoidNotes, '未填写家族避讳、谐音、重名或使用限制。')
  const recordCandidates = cleanRecordText(candidateNotes, '未填写候选对比备注。')
  const strokeText = padded.length ? padded.join(' / ') : '未填写逐字笔画'
  const gridText = grids.length ? grids.map(([name, number]) => `${name}${number}画`).join('，') : '未计算五格'
  const sancaiText = tianElement && renElement && diElement ? `${tianElement} / ${renElement} / ${diElement}` : '未计算三才'
  const strokeNotice = missingStrokeCount
    ? `有 ${missingStrokeCount} 个字未提供笔画，当前按 1 画占位，需补齐后再比较。`
    : '逐字笔画已填写，可进入读音、字义、重名和使用场景复核。'

  return [
    { label: '记录场景', value: recordProfile.label },
    { label: '姓名方案', value: recordName },
    { label: '姓氏/名字', value: `${recordSurname} / ${recordGivenName}` },
    { label: '来源/口径', value: recordSource },
    { label: '笔画序列', value: strokeText },
    { label: '五格摘要', value: gridText },
    { label: '三才字段', value: sancaiText },
    { label: '命名目标', value: recordGoal },
    { label: '含义偏好', value: recordMeaning },
    { label: '候选对比', value: recordCandidates },
    { label: '避讳/限制', value: recordAvoid },
    { label: '笔画复核', value: strokeNotice },
    { label: '复核顺序', value: recordProfile.review },
    { label: '今日小动作', value: recordProfile.action },
    { label: '后续复盘', value: '记录读音测试、重名检索、长辈或客户反馈、证件/商标/账号可用性和最终取舍原因。' },
    { label: '输出边界', value: '只保存姓名方案、笔画口径、五格三才和人工复核清单，不输出姓名打分、吉凶定论或结果保证。' }
  ]
}
