export const dailyHexagramFocusProfiles = {
  decision: {
    label: '决策取向',
    prompt: '把问题拆成选项、阻力和可验证的小行动。'
  },
  action: {
    label: '行动取向',
    prompt: '记录今天要推进的动作、卡点和复盘时间。'
  },
  relation: {
    label: '关系取向',
    prompt: '记录相关人物、沟通事实和待确认的信息。'
  },
  stability: {
    label: '稳定取向',
    prompt: '记录需要维持、暂停或观察的事项。'
  },
  journal: {
    label: '复盘日志',
    prompt: '先留档，不急着判断，等事件回传后再对照。'
  }
}

export const dailyHexagramFocusOptions = Object.entries(dailyHexagramFocusProfiles).map(([value, profile]) => ({
  value,
  label: profile.label
}))

export const buildDailyHexagramReview = (chart, focus = 'action') => {
  const profile = dailyHexagramFocusProfiles[focus] || dailyHexagramFocusProfiles.action
  const movingLine = chart.lineName || ''

  return {
    profile,
    rows: [
      { label: '记录口径', value: `${profile.label} / ${profile.prompt}` },
      { label: '本卦观察', value: `${chart.name}：先记录当前问题结构，不直接下结论。` },
      { label: '变卦观察', value: `${chart.changedName}：作为后续复盘对照，不作为确定结果。` },
      { label: '动爻复核', value: `${movingLine || '未标记动爻'}：记录触发变化的位置，后续与事实回传核对。` },
      { label: '复盘问题', value: '今天实际发生了什么？哪个条件变化了？原问题是否需要重写？' },
      { label: '输出边界', value: '只输出问事记录、卦象字段和复盘清单，不输出吉凶、应期或确定性判断。' }
    ],
    nextSteps: [
      { label: '六爻纳甲排盘', href: '/tools/liuyao', text: '需要完整世应、六亲、六神时继续排六爻。' },
      { label: '梅花易数排盘', href: '/tools/meihua', text: '需要体用、互卦和取数推导时继续排梅花。' },
      { label: '塔罗抽牌', href: '/tools/tarot', text: '需要做问题拆解和牌阵记录时再补充塔罗。' }
    ]
  }
}
