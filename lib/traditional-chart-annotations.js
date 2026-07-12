export const chartAnnotationSource = {
  name: 'Jixue Lab 排盘字段说明',
  version: '1.0.0',
  scope: '术语解释和结构规则命中',
  boundary: '只根据当前排盘字段做知识标注，不输出吉凶、建议或人生判断'
}

const baZiPublicSource = '排盘口径：公历/阳历出生时间，默认按真太阳时、页面选择的子时换日规则和起运算法排盘'
const ziWeiPublicSource = '排盘口径：公历/阳历出生时间，默认按出生地真太阳时、页面选择的子时换日规则、性别和闰月处理方式排盘'

export const baziTermExplanations = [
  {
    term: '日主',
    summary: '日柱天干。八字排盘中常用它作为四柱字段的中心参照。',
    source: '子平八字通用术语；当前字段来自本页排盘结果。'
  },
  {
    term: '十神',
    summary: '以日主为参照，把其他天干或藏干与日主的生克关系转换成名称。',
    source: '子平八字通用术语；当前字段来自本页排盘结果。'
  },
  {
    term: '藏干',
    summary: '地支内部对应的天干列表。页面只展示当前排盘返回的藏干字段。',
    source: '子平八字通用术语；当前字段来自四柱地支藏干结果。'
  },
  {
    term: '纳音',
    summary: '干支组合对应的纳音名称。页面按四柱和命身宫字段原样展示。',
    source: '传统干支纳音体系；当前字段来自本页排盘结果。'
  },
  {
    term: '神煞',
    summary: '按日干、日支、年支、月支等字段推得的常用神煞名称集合，只作为排盘字段展示。',
    source: '子平八字常用神煞规则；当前字段来自本页排盘结果。'
  },
  {
    term: '大运/流年',
    summary: '大运为出生后按性别和干支阴阳顺逆推得的十年运段；流年展示当前大运内的年份干支。',
    source: '当前排盘结果的大运和流年字段。'
  },
  {
    term: '命宫/身宫',
    summary: '根据出生信息推得的辅助宫位字段。页面只展示名称和纳音。',
    source: '八字排盘扩展字段；当前字段来自本页排盘结果。'
  },
  {
    term: '显性五行',
    summary: '只统计四柱天干和地支共 8 个显性位置的五行，不折算藏干。',
    source: '本站结构统计规则；输入为四柱天干和地支。'
  }
]

export const ziweiTermExplanations = [
  {
    term: '命宫',
    summary: '紫微斗数本命盘十二宫之一。页面展示其所在天干地支和宫位字段。',
    source: '紫微斗数通用术语；当前字段来自本页排盘结果。'
  },
  {
    term: '身宫',
    summary: '紫微斗数本命盘中的身宫标记。页面展示身宫落在哪一个宫位。',
    source: '紫微斗数通用术语；当前字段来自本页排盘结果。'
  },
  {
    term: '五行局',
    summary: '本命盘概要字段之一。页面按当前排盘结果展示。',
    source: '紫微斗数通用术语；当前字段来自本页排盘结果。'
  },
  {
    term: '十二宫',
    summary: '本命盘的十二个宫位。页面按当前排盘顺序展示每宫天干地支和星曜。',
    source: '紫微斗数通用术语；当前字段来自本页排盘结果。'
  },
  {
    term: '主星',
    summary: '每个宫位中的主要星曜字段。页面只展示星曜名称、亮度和四化标记。',
    source: '紫微斗数通用术语；当前字段来自本页排盘结果。'
  },
  {
    term: '大限',
    summary: '宫位上的年龄区间字段。页面按当前排盘返回的大限范围展示。',
    source: '紫微斗数通用术语；当前字段来自本页排盘结果。'
  }
]

const joinNames = items => items.map(item => item.element || item).join('、')

const getPillar = (chart, key) => chart.pillars.find(pillar => pillar.key === key)

export function buildBaZiRuleHits(chart) {
  const dayPillar = getPillar(chart, 'day')
  const monthPillar = getPillar(chart, 'month')
  const maxCount = Math.max(...chart.elementCounts.map(item => item.count))
  const minCount = Math.min(...chart.elementCounts.map(item => item.count))
  const maxElements = chart.elementCounts.filter(item => item.count === maxCount)
  const minElements = chart.elementCounts.filter(item => item.count === minCount)
  const sectLabel = chart.input.sect === 1 ? '晚子时算次日' : '晚子时算当日'
  const ziHourNote = chart.input.hour === 23
    ? '当前出生小时为 23 点，日柱可能受所选子时换日口径影响。'
    : `当前出生小时为 ${chart.input.hour} 点，页面仍记录所选子时换日口径。`

  return [
    {
      title: '日主字段定位',
      badge: '字段',
      hit: `日柱为 ${dayPillar.ganZhi}，日主取日柱天干 ${chart.dayMaster}。`,
      source: '字段来源：本页四柱排盘结果。',
      details: [`日柱：${dayPillar.ganZhi}`, `日干：${dayPillar.gan}`]
    },
    {
      title: '月令字段定位',
      badge: '字段',
      hit: `月柱为 ${monthPillar.ganZhi}，月令取月柱地支 ${monthPillar.zhi}。`,
      source: '字段来源：本页四柱排盘结果。',
      details: [`月柱：${monthPillar.ganZhi}`, `月支：${monthPillar.zhi}`]
    },
    {
      title: '显性五行分布',
      badge: '统计',
      hit: `四柱天干地支共 8 个显性位置；当前最多为 ${joinNames(maxElements)}，最少为 ${joinNames(minElements)}。`,
      source: '规则来源：本站结构统计规则，只统计四柱天干和地支。',
      details: chart.elementCounts.map(item => `${item.element}：${item.count}`)
    },
    {
      title: '子时换日口径',
      badge: '口径',
      hit: `当前采用「${sectLabel}」。${ziHourNote}`,
      source: '规则来源：页面输入项；排盘结果按当前选项计算。',
      details: [`小时：${chart.input.hour}`, `口径：${sectLabel}`]
    }
  ]
}

export function buildZiWeiRuleHits(chart) {
  const palacesWithMajorStars = chart.palaces.filter(palace => palace.majorStars.length > 0)

  return [
    {
      title: '命宫定位',
      badge: '字段',
      hit: `命宫位于 ${chart.mingPalace?.heavenlyStem || ''}${chart.mingPalace?.earthlyBranch || ''}，宫位名称为 ${chart.mingPalace?.name || '未取'}。`,
      source: '字段来源：本页紫微斗数本命盘结果。',
      details: [
        `命宫：${chart.mingPalace?.name || '未取'}`,
        `地支：${chart.earthlyBranchOfSoulPalace}`
      ]
    },
    {
      title: '身宫定位',
      badge: '字段',
      hit: `身宫标记在 ${chart.bodyPalace?.name || '未取'}，地支为 ${chart.earthlyBranchOfBodyPalace}。`,
      source: '字段来源：本页紫微斗数本命盘结果。',
      details: [
        `身宫：${chart.bodyPalace?.name || '未取'}`,
        `地支：${chart.earthlyBranchOfBodyPalace}`
      ]
    },
    {
      title: '五行局字段',
      badge: '字段',
      hit: `当前本命盘五行局为 ${chart.fiveElementsClass}。`,
      source: '字段来源：本页紫微斗数本命盘结果。',
      details: [`五行局：${chart.fiveElementsClass}`]
    },
    {
      title: '主星落宫列表',
      badge: '列表',
      hit: `十二宫中有 ${palacesWithMajorStars.length} 个宫位返回主星字段。`,
      source: '字段来源：本页十二宫星曜结果。',
      details: chart.palaces.map(palace => `${palace.name}：${palace.majorStars.join('、') || '空宫'}`)
    }
  ]
}

const formatInputDateTime = input => `${input.year}-${String(input.month).padStart(2, '0')}-${String(input.day).padStart(2, '0')} ${String(input.hour).padStart(2, '0')}:${String(input.minute).padStart(2, '0')}`
const formatDetails = details => details.map(detail => `    - ${detail}`).join('\n')
const formatRuleHits = rules => rules.map(rule => [
  `- ${rule.title}：${rule.hit}`,
  `  ${rule.source}`,
  formatDetails(rule.details)
].join('\n')).join('\n')
const formatFilenameDateTime = input => `${input.year}${String(input.month).padStart(2, '0')}${String(input.day).padStart(2, '0')}-${String(input.hour).padStart(2, '0')}${String(input.minute).padStart(2, '0')}`
const row = (label, value) => ({ label, value })
const valueList = items => items?.length ? items.join('、') : '无'
const getBaZiSectLabel = input => input.sect === 1 ? '晚子时算次日' : '晚子时算当日'
const getBaZiYunSectLabel = input => input.yunSect === 1 ? '时辰折算起运' : '精确分钟起运'
const getBaZiTimeModeLabel = input => input.timeMode === 'trueSolar' ? '真太阳时' : '标准时间'
const getZiWeiSectLabel = input => input.sect === 1 ? '晚子时算次日' : '晚子时算当日'
const getZiWeiTimeModeLabel = input => input.timeMode === 'trueSolar' ? '真太阳时' : '标准时间'
const getZiWeiFixLeapLabel = input => input.fixLeap ? '修正闰月' : '不修正闰月'
const formatBirthPlace = input => `${input.birthPlace || '未填写'} / 经度 ${input.birthLongitude}° / 纬度 ${input.birthLatitude}°`
const formatTimeAdjustment = chart => chart.input.timeMode === 'trueSolar'
  ? `真太阳时修正 ${chart.timeAdjustment.offsetMinutes > 0 ? '+' : ''}${chart.timeAdjustment.offsetMinutes} 分钟`
  : '标准时间，不修正'
const fineRow = (label, values) => ({ label, values })
const formatPillarDetail = pillar => [
  `${pillar.label} ${pillar.ganZhi}`,
  `主星 ${pillar.key === 'day' ? '日元' : pillar.shiShenGan}`,
  `藏干 ${valueList(pillar.hideGan)}`,
  `副星 ${valueList(pillar.shiShenZhi)}`,
  `神煞 ${valueList(pillar.shenSha)}`,
  `纳音 ${pillar.naYin}`
].join('；')
const formatLuckRange = item => `${item.startYear}-${item.endYear}（${item.startAge}-${item.endAge}岁）`
const formatLuckText = item => [
  `${formatLuckRange(item)} ${item.label}`,
  item.shiShenGan ? `天干十神 ${item.shiShenGan}` : '',
  item.xunKong ? `空亡 ${item.xunKong}` : '',
  item.naYin ? `纳音 ${item.naYin}` : ''
].filter(Boolean).join('；')
const formatLiuNianText = item => [
  `${item.year}（${item.age}岁） ${item.ganZhi}`,
  item.shiShenGan ? `天干十神 ${item.shiShenGan}` : '',
  item.xunKong ? `空亡 ${item.xunKong}` : '',
  item.naYin ? `纳音 ${item.naYin}` : ''
].filter(Boolean).join('；')
const formatZiWeiStars = stars => stars?.length ? stars.join('、') : '无'
const formatZiWeiDecadal = palace => palace.decadal?.range?.join('-') || '未取'
const formatZiWeiPalaceDetail = palace => [
  `${palace.heavenlyStem}${palace.earthlyBranch}`,
  `主星 ${palace.majorStars.join('、') || '空宫'}`,
  `辅星 ${formatZiWeiStars(palace.minorStars)}`,
  palace.adjectiveStars?.length ? `杂曜 ${formatZiWeiStars(palace.adjectiveStars)}` : '',
  `长生 ${palace.changsheng12 || '-'}`,
  `博士 ${palace.boshi12 || '-'}`,
  `岁前 ${palace.suiqian12 || '-'}`,
  `将前 ${palace.jiangqian12 || '-'}`,
  `大限 ${formatZiWeiDecadal(palace)}岁`
].filter(Boolean).join('；')

export function buildBaZiExportPayload(chart) {
  const sectLabel = getBaZiSectLabel(chart.input)
  const yunSectLabel = getBaZiYunSectLabel(chart.input)
  const timeModeLabel = getBaZiTimeModeLabel(chart.input)
  const elementLine = chart.elementCounts.map(item => `${item.element}${item.count}`).join('、')
  const fineTable = {
    columns: chart.pillars.map(pillar => pillar.label),
    rows: [
      fineRow('主星', chart.pillars.map(pillar => pillar.key === 'day' ? '日元' : pillar.shiShenGan)),
      fineRow('天干', chart.pillars.map(pillar => pillar.gan)),
      fineRow('地支', chart.pillars.map(pillar => pillar.zhi)),
      fineRow('藏干', chart.pillars.map(pillar => valueList(pillar.hideGan))),
      fineRow('副星', chart.pillars.map(pillar => valueList(pillar.shiShenZhi))),
      fineRow('星运', chart.pillars.map(pillar => pillar.diShi)),
      fineRow('自坐', chart.pillars.map(pillar => pillar.selfDiShi)),
      fineRow('空亡', chart.pillars.map(pillar => pillar.xunKong)),
      fineRow('纳音', chart.pillars.map(pillar => pillar.naYin)),
      fineRow('神煞', chart.pillars.map(pillar => valueList(pillar.shenSha)))
    ]
  }

  return {
    toolCode: 'bazi',
    imageKind: 'baziFine',
    title: '八字专业细盘',
    subtitle: `${formatInputDateTime(chart.input)} 公历/阳历 · ${chart.input.gender}${chart.input.birthPlace ? ` · ${chart.input.birthPlace}` : ''}`,
    filename: `bazi-chart-${formatFilenameDateTime(chart.input)}.png`,
    textFilename: `bazi-chart-${formatFilenameDateTime(chart.input)}.txt`,
    badges: [
      `四柱 ${chart.eightCharText}`,
      `日主 ${chart.dayMaster}`,
      timeModeLabel,
      sectLabel,
      yunSectLabel
    ],
    sections: [
      {
        title: '核心字段',
        rows: [
          row('四柱', chart.eightCharText),
          row('输入时间', chart.solarText),
          row('排盘时间', chart.chartSolarText),
          row('农历', chart.lunarText),
          row('出生地', formatBirthPlace(chart.input)),
          row('时间修正', formatTimeAdjustment(chart)),
          row('日主', chart.dayMaster),
          row('命宫', `${chart.mingGong} ${chart.mingGongNaYin}`),
          row('身宫', `${chart.shenGong} ${chart.shenGongNaYin}`),
          row('胎元', `${chart.taiYuan} ${chart.taiYuanNaYin}`),
          row('胎息', `${chart.taiXi} ${chart.taiXiNaYin}`),
          row('起运', `${chart.yunStart.text}${chart.yunStart.solarText ? `；交运 ${chart.yunStart.solarText}` : ''}`),
          row('起运口径', yunSectLabel),
          row('显性五行', elementLine)
        ]
      },
      {
        title: '专业细盘',
        rows: chart.pillars.map(pillar => row(pillar.label, formatPillarDetail(pillar)))
      },
      {
        title: '大运',
        rows: chart.daYun.map(item => row(item.label, formatLuckText(item)))
      },
      {
        title: '流年',
        rows: chart.liuNian.map(item => row(String(item.year), formatLiuNianText(item)))
      }
    ],
    fineTable,
    daYun: chart.daYun,
    liuNian: chart.liuNian,
    currentDaYun: chart.currentDaYun,
    yunStart: chart.yunStart,
    birthPlaceText: formatBirthPlace(chart.input),
    chartSolarText: chart.chartSolarText,
    timeAdjustmentText: formatTimeAdjustment(chart),
    footer: `${baZiPublicSource}；只输出排盘字段，不输出吉凶、建议或人生判断。`
  }
}

export function buildZiWeiExportPayload(chart) {
  const timeModeLabel = getZiWeiTimeModeLabel(chart.input)
  const sectLabel = getZiWeiSectLabel(chart.input)
  const fixLeapLabel = getZiWeiFixLeapLabel(chart.input)
  const palaceRows = chart.palaces.map(palace => row(
    `${palace.name}${palace.isMingPalace ? ' / 命宫' : ''}${palace.isBodyPalace ? ' / 身宫' : ''}`,
    formatZiWeiPalaceDetail(palace)
  ))

  return {
    toolCode: 'ziwei',
    imageKind: 'ziweiFine',
    title: '紫微斗数专业盘',
    subtitle: `${formatInputDateTime(chart.input)} 公历/阳历 · ${chart.input.gender}${chart.input.birthPlace ? ` · ${chart.input.birthPlace}` : ''}`,
    filename: `ziwei-chart-${formatFilenameDateTime(chart.input)}.png`,
    textFilename: `ziwei-chart-${formatFilenameDateTime(chart.input)}.txt`,
    badges: [
      `五行局 ${chart.fiveElementsClass}`,
      `命宫 ${chart.mingPalace?.heavenlyStem || ''}${chart.mingPalace?.earthlyBranch || ''}`,
      `身宫 ${chart.bodyPalace?.name || '未取'}`,
      timeModeLabel,
      sectLabel,
      fixLeapLabel
    ],
    sections: [
      {
        title: '核心字段',
        rows: [
          row('输入时间', chart.solarText),
          row('排盘时间', chart.chartSolarText),
          row('农历', chart.lunarDate),
          row('四柱', chart.chineseDate),
          row('时辰', `${chart.time} ${chart.timeRange}`),
          row('出生地', formatBirthPlace(chart.input)),
          row('时间修正', formatTimeAdjustment(chart)),
          row('子时口径', sectLabel),
          row('闰月处理', fixLeapLabel),
          row('五行局', chart.fiveElementsClass),
          row('命宫', `${chart.mingPalace?.heavenlyStem || ''}${chart.mingPalace?.earthlyBranch || ''}`),
          row('身宫', chart.bodyPalace?.name || '未取'),
          row('命主/身主', `${chart.soul} / ${chart.body}`)
        ]
      },
      {
        title: '十二宫专业字段',
        rows: palaceRows
      }
    ],
    palaces: chart.palaces,
    birthPlaceText: formatBirthPlace(chart.input),
    chartSolarText: chart.chartSolarText,
    timeAdjustmentText: formatTimeAdjustment(chart),
    footer: `${ziWeiPublicSource}；只输出排盘字段，不输出吉凶、建议或人生判断。`
  }
}

export function buildBaZiCopyText(chart) {
  const sectLabel = getBaZiSectLabel(chart.input)
  const yunSectLabel = getBaZiYunSectLabel(chart.input)
  const timeModeLabel = getBaZiTimeModeLabel(chart.input)
  const pillarLines = chart.pillars.map(pillar => [
    `- ${pillar.label} ${pillar.ganZhi}`,
    `  天干：${pillar.gan}；地支：${pillar.zhi}；五行：${pillar.wuXing}；纳音：${pillar.naYin}`,
    `  十神：${pillar.key === 'day' ? '日元' : pillar.shiShenGan}；藏干：${valueList(pillar.hideGan)}；地支十神：${valueList(pillar.shiShenZhi)}`,
    `  星运：${pillar.diShi}；自坐：${pillar.selfDiShi}；空亡：${pillar.xunKong}；神煞：${valueList(pillar.shenSha)}`
  ].join('\n')).join('\n')
  const elementLine = chart.elementCounts.map(item => `${item.element}${item.count}`).join('、')
  const daYunLines = chart.daYun.map(item => `- ${formatLuckText(item)}`).join('\n')
  const liuNianTitle = chart.currentDaYun
    ? `流年（当前大运：${chart.currentDaYun.label} ${formatLuckRange(chart.currentDaYun)}）`
    : '流年'
  const liuNianLines = chart.liuNian.map(item => `- ${formatLiuNianText(item)}`).join('\n')

  return [
    '八字专业细盘',
    '',
    `输入：${formatInputDateTime(chart.input)}（公历/阳历），性别：${chart.input.gender}`,
    `出生地：${formatBirthPlace(chart.input)}`,
    `时间口径：${timeModeLabel}；${formatTimeAdjustment(chart)}`,
    `排盘用时间：${chart.chartSolarText}`,
    `农历：${chart.lunarText}`,
    `子时口径：${sectLabel}`,
    `起运口径：${yunSectLabel}`,
    `四柱：${chart.eightCharText}`,
    `日主：${chart.dayMaster}`,
    `命宫：${chart.mingGong} ${chart.mingGongNaYin}`,
    `身宫：${chart.shenGong} ${chart.shenGongNaYin}`,
    `胎元：${chart.taiYuan} ${chart.taiYuanNaYin}`,
    `胎息：${chart.taiXi} ${chart.taiXiNaYin}`,
    `起运：${chart.yunStart.text}${chart.yunStart.solarText ? `；交运：${chart.yunStart.solarText}` : ''}`,
    `显性五行：${elementLine}`,
    '',
    '专业细盘',
    pillarLines,
    '',
    '大运',
    daYunLines,
    '',
    liuNianTitle,
    liuNianLines,
    '',
    '来源与边界',
    `- ${baZiPublicSource}`,
    '- 只输出排盘字段，不输出吉凶、建议或人生判断。'
  ].join('\n')
}

export function buildZiWeiCopyText(chart) {
  const timeModeLabel = getZiWeiTimeModeLabel(chart.input)
  const sectLabel = getZiWeiSectLabel(chart.input)
  const fixLeapLabel = getZiWeiFixLeapLabel(chart.input)
  const palaceLines = chart.palaces.map(palace => [
    `- ${palace.name}（${palace.heavenlyStem}${palace.earthlyBranch}${palace.isMingPalace ? '，命宫' : ''}${palace.isBodyPalace ? '，身宫' : ''}）`,
    `  主星：${palace.majorStars.join('、') || '空宫'}`,
    `  辅星：${palace.minorStars.join('、') || '无'}`,
    `  杂曜：${palace.adjectiveStars.join('、') || '无'}`,
    `  长生：${palace.changsheng12 || '-'}；博士：${palace.boshi12 || '-'}；岁前：${palace.suiqian12 || '-'}；将前：${palace.jiangqian12 || '-'}`,
    `  大限：${formatZiWeiDecadal(palace)} 岁`
  ].join('\n')).join('\n')

  return [
    '紫微斗数专业盘',
    '',
    `输入：${formatInputDateTime(chart.input)}（公历/阳历），性别：${chart.input.gender}`,
    `出生地：${formatBirthPlace(chart.input)}`,
    `时间口径：${timeModeLabel}；${formatTimeAdjustment(chart)}`,
    `排盘用时间：${chart.chartSolarText}`,
    `子时口径：${sectLabel}`,
    `闰月处理：${fixLeapLabel}`,
    `农历：${chart.lunarDate}`,
    `四柱：${chart.chineseDate}`,
    `时辰：${chart.time} ${chart.timeRange}`,
    `五行局：${chart.fiveElementsClass}`,
    `命宫：${chart.mingPalace?.heavenlyStem || ''}${chart.mingPalace?.earthlyBranch || ''}`,
    `身宫：${chart.bodyPalace?.name || '未取'}`,
    `命主：${chart.soul}`,
    `身主：${chart.body}`,
    '',
    '十二宫专业字段',
    palaceLines,
    '',
    '来源与边界',
    `- ${ziWeiPublicSource}`,
    '- 只输出排盘字段，不输出吉凶、建议或人生判断。'
  ].join('\n')
}
