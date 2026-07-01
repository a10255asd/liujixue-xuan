export const site = {
  name: 'Jixue Xuan',
  cnName: '鸡血玄策',
  domain: 'https://xuan.liujixue.cn',
  mainSite: 'https://liujixue.cn',
  description: '面向八字、紫微斗数、六爻、黄历节气、干支五行和易经基础表的东方命理工具站，只做结构化字段和可导出文本，不输出吉凶断语。'
}

export const xuanTools = [
  {
    title: '八字专业细盘',
    href: '/tools/bazi',
    status: '已上线',
    summary: '按公历、出生地和真太阳时输出四柱、十神、藏干、纳音、神煞、大运和流年。',
    tags: ['四柱', '真太阳时', '大运流年']
  },
  {
    title: '紫微斗数命盘',
    href: '/tools/ziwei',
    status: '已上线',
    summary: '输出十二宫、命身宫、五行局、主星辅星、长生博士和大限字段。',
    tags: ['十二宫', '命身宫', '星曜']
  },
  {
    title: '六爻纳甲排盘',
    href: '/tools/liuyao',
    status: '已上线',
    summary: '手动指定六爻，输出本卦变卦、六亲、世应、六神、纳甲、旬空、伏神飞神和动变关系。',
    tags: ['纳甲', '世应', '伏神飞神']
  },
  {
    title: '每日一卦',
    href: '/tools/daily',
    status: '已上线',
    summary: '按日期、时间和事项生成时间起卦记录，输出本卦、变卦、动爻、上下卦和可复制文本。',
    tags: ['时间起卦', '本卦变卦', '导出文本']
  },
  {
    title: '黄历节气',
    href: '/tools/calendar',
    status: '已上线',
    summary: '查询公历、农历、四柱、宜忌、冲煞、旬空、星宿、彭祖和上下节气。',
    tags: ['黄历', '节气', '日课字段']
  },
  {
    title: '干支五行速查',
    href: '/tools/wuxing',
    status: '已上线',
    summary: '速查十天干、十二地支、阴阳、五行、藏干、生克关系和季节对应。',
    tags: ['天干地支', '五行生克', '藏干']
  },
  {
    title: '六十四卦速查',
    href: '/tools/hexagrams',
    status: '已上线',
    summary: '按上卦、下卦速查六十四卦名称、卦象组合、八卦五行和基础归类。',
    tags: ['易经', '八卦', '卦名速查']
  },
  {
    title: '十二时辰速查',
    href: '/tools/shichen',
    status: '已上线',
    summary: '速查子丑寅卯等十二时辰的现代时间段、五行、生肖和昼夜分段。',
    tags: ['时辰', '地支', '时间换算']
  }
]

export const xuanComingTools = [
  {
    title: '姓名五行速查',
    status: '规划中',
    summary: '按字形、音律和常见五行口径整理姓名字段，先做资料记录，不输出评分。'
  },
  {
    title: '合盘对照',
    status: '规划中',
    summary: '把两个人的八字或紫微字段并排导出，方便后续交给 AI 或人工做结构分析。'
  },
  {
    title: '问事记录本',
    status: '规划中',
    summary: '记录事项、起卦时间、卦盘文本、后续反馈和复盘结果，沉淀自己的案例库。'
  },
  {
    title: 'AI 解析包',
    status: '规划中',
    summary: '把排盘字段、问题背景、限制边界和输出格式合并成可复制的 AI 解析提示。'
  }
]

export const scenarioCards = [
  {
    title: '出生盘',
    text: '八字和紫微以出生时间、出生地和口径为核心，优先保证字段可复现。'
  },
  {
    title: '问事起卦',
    text: '六爻和每日一卦先记录事项、时间、动爻和卦象，不在工具里直接断吉凶。'
  },
  {
    title: '择时查询',
    text: '黄历节气页提供日课字段，适合快速复制当天宜忌、冲煞和节气信息。'
  },
  {
    title: 'AI 接力',
    text: '导出的文本更适合交给 AI 做结构化解释，也方便换模型或换 Agent 继续处理。'
  }
]

export const featureBlocks = [
  {
    title: '工具箱结构',
    text: '八字、紫微、六爻、每日一卦、黄历节气、干支五行、六十四卦和十二时辰统一入口。'
  },
  {
    title: '导出给 AI',
    text: '八字、紫微和六爻都支持复制或下载文本，减少手动整理信息的时间。'
  },
  {
    title: '不做恐吓式断语',
    text: '新站只输出排盘字段、术语和规则标记，不输出吉凶、应期、投资、医疗或人生建议。'
  },
  {
    title: '后续可扩展会员',
    text: '后面可以增加历史记录、收藏、对盘、问事记录和多模型 AI 解读，但第一版先把字段做稳。'
  }
]

export const knowledgeCards = [
  {
    title: '排盘和断盘分开',
    text: '排盘是把时间和卦象转换成结构字段；断盘需要明确用神、事项和流派，不应该混在基础工具里。'
  },
  {
    title: '时间口径要透明',
    text: '八字和紫微对真太阳时、晚子时、闰月处理很敏感。页面会把当前采用的口径写进导出文本。'
  },
  {
    title: '六爻先确定卦象',
    text: '六爻第一版采用手动指定六爻，先保证纳甲、六亲、世应、伏神飞神和动变字段稳定。'
  }
]
