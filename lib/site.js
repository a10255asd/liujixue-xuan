export const site = {
  name: 'Jixue Xuan',
  cnName: '鸡血玄策',
  domain: 'https://xuan.liujixue.cn',
  mainSite: 'https://liujixue.cn',
  description: '面向八字、紫微斗数、六爻、梅花易数、奇门六壬、黄历择日和基础资料的东方命理工具站，只做结构化字段和可导出文本，不输出吉凶断语。'
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
    title: '合盘对照',
    href: '/tools/compatibility',
    status: '已上线',
    summary: '把两份八字或紫微排盘字段并排整理，生成可复制的 AI 接力提示词，不直接判断关系结果。',
    tags: ['双人对照', 'AI 接力', '字段并排']
  },
  {
    title: '六爻纳甲排盘',
    href: '/tools/liuyao',
    status: '已上线',
    summary: '手动指定六爻，输出本卦变卦、六亲、世应、六神、纳甲、旬空、伏神飞神和动变关系。',
    tags: ['纳甲', '世应', '伏神飞神']
  },
  {
    title: '梅花易数排盘',
    href: '/tools/meihua',
    status: '已上线',
    summary: '支持三数起卦和时间起卦，输出本卦、变卦、互卦、动爻、体用和取数推导。',
    tags: ['梅花易数', '体用', '互卦']
  },
  {
    title: '塔罗抽牌',
    href: '/tools/tarot',
    status: '已上线',
    summary: '按问题、牌阵和种子输出塔罗牌阵、正逆位、牌面关键词和可复制字段。',
    tags: ['塔罗', '牌阵', '正逆位']
  },
  {
    title: '每日一卦',
    href: '/tools/daily',
    status: '已上线',
    summary: '按日期、时间和事项生成时间起卦记录，输出本卦、变卦、动爻、上下卦和可复制文本。',
    tags: ['时间起卦', '本卦变卦', '导出文本']
  },
  {
    title: '奇门遁甲速盘',
    href: '/tools/qimen',
    status: '已升级',
    summary: '接入拆补法排盘，输出节气三元、阴阳遁局、值符值使、天盘地盘、八门九星八神和九宫综合盘。',
    tags: ['拆补法', '九宫盘', '值符值使']
  },
  {
    title: '大六壬四课三传',
    href: '/tools/daliuren',
    status: '已升级',
    summary: '接入大六壬排盘库，按中气取月将，输出天地盘十二宫、四课、三传、课型和十二天将。',
    tags: ['四课三传', '月将', '十二天将']
  },
  {
    title: '黄历节气',
    href: '/tools/calendar',
    status: '已上线',
    summary: '查询公历、农历、四柱、宜忌、冲煞、旬空、星宿、彭祖和上下节气。',
    tags: ['黄历', '节气', '日课字段']
  },
  {
    title: '择日速览',
    href: '/tools/date-selection',
    status: '已上线',
    summary: '按日期范围输出每日干支、宜忌、冲煞和基础择日清单，适合快速筛选。',
    tags: ['择日', '日期范围', '宜忌冲煞']
  },
  {
    title: '每日运势速览',
    href: '/tools/daily-fortune',
    status: '已上线',
    summary: '按日期输出今日四柱、日元五行、宜忌、冲煞、旬空和方位字段。',
    tags: ['每日', '日柱', '黄历字段']
  },
  {
    title: '干支五行速查',
    href: '/tools/wuxing',
    status: '已上线',
    summary: '速查十天干、十二地支、阴阳、五行、藏干、生克关系和季节对应。',
    tags: ['天干地支', '五行生克', '藏干']
  },
  {
    title: '姓名五格五行',
    href: '/tools/name',
    status: '已上线',
    summary: '按用户输入的康熙笔画输出姓名五格、五行和三才字段，不做姓名打分。',
    tags: ['姓名', '五格', '三才']
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
  },
  {
    title: '出生校时对照',
    href: '/tools/birth-time',
    status: '已上线',
    summary: '围绕参考出生时间输出前后时辰四柱候选，辅助人工校时和时辰核对。',
    tags: ['校时', '出生时间', '四柱候选']
  },
  {
    title: '寻时定盘表',
    href: '/tools/find-time',
    status: '已上线',
    summary: '按日期输出十二时辰四柱对照，适合出生时辰候选排查。',
    tags: ['寻时', '十二时辰', '定盘']
  },
  {
    title: '收藏与记录',
    href: '/tools/records',
    status: '已上线',
    summary: '本地保存收藏工具和排盘记录，不登录也能沉淀自己的使用材料。',
    tags: ['收藏', '历史', '本地记录']
  },
  {
    title: 'AI 解析提示词',
    href: '/tools/ai-prompt',
    status: '已上线',
    summary: '把排盘字段、问题背景、边界要求和输出格式合成可复制提示词，方便交给不同 AI 接力。',
    tags: ['AI 接力', '提示词', '边界要求']
  },
  {
    title: '综合合参工作台',
    href: '/tools/synthesis',
    status: '已上线',
    summary: '汇总出生盘、问事盘、塔罗、日课和补充材料，生成多工具合参提示词。',
    tags: ['合参', '多工具', 'AI 接力']
  },
  {
    title: '古籍书楼',
    href: '/classics',
    status: '已上线',
    summary: '整理八字、紫微、易经、六爻、奇门六壬和择日资料入口。',
    tags: ['古籍', '资料', '口径来源']
  },
  {
    title: '知识图解',
    href: '/knowledge',
    status: '已上线',
    summary: '把出生盘、问事起卦、择日和 AI 接力流程做成图解入口。',
    tags: ['图解', '流程', '新手入口']
  }
]

export const xuanToolSuites = [
  {
    title: '出生盘排盘',
    eyebrow: 'Birth Chart',
    summary: '输入出生时间和出生地，优先处理真太阳时、宫位、四柱、校时、时辰候选和双人字段对照。',
    primaryHref: '/tools/bazi',
    toolHrefs: ['/tools/bazi', '/tools/ziwei', '/tools/compatibility', '/tools/birth-time', '/tools/find-time'],
    steps: ['出生信息', '校时对照', '合盘材料']
  },
  {
    title: '问事起卦',
    eyebrow: 'Question Chart',
    summary: '围绕具体事项记录卦象、动爻、世应、六亲、体用、塔罗牌阵和可复制文本。',
    primaryHref: '/tools/liuyao',
    toolHrefs: ['/tools/liuyao', '/tools/meihua', '/tools/tarot', '/tools/daily'],
    steps: ['填写事项', '起卦抽牌', '导出字段']
  },
  {
    title: '高阶术数',
    eyebrow: 'Advanced',
    summary: '奇门接入拆补法九宫盘，六壬接入四课三传和天地盘字段。',
    primaryHref: '/tools/qimen',
    toolHrefs: ['/tools/qimen', '/tools/daliuren'],
    steps: ['输入事项', '起局起课', '字段速览']
  },
  {
    title: '日课时间',
    eyebrow: 'Calendar',
    summary: '快速查询当天日课、择日清单、每日字段、节气、时辰和常用时间换算字段。',
    primaryHref: '/tools/calendar',
    toolHrefs: ['/tools/calendar', '/tools/date-selection', '/tools/daily-fortune', '/tools/shichen'],
    steps: ['选定日期', '查看日课', '筛选时间']
  },
  {
    title: '姓名五行',
    eyebrow: 'Name',
    summary: '姓名五格和干支五行分开输出，避免把资料字段和评分断语混在一起。',
    primaryHref: '/tools/name',
    toolHrefs: ['/tools/name', '/tools/wuxing'],
    steps: ['输入笔画', '五格换算', '五行核对']
  },
  {
    title: '资料记录',
    eyebrow: 'Reference',
    summary: '把六十四卦、古籍索引、知识图解、本地记录、AI 接力和综合合参集中管理，形成可继续扩展的资料层。',
    primaryHref: '/tools/records',
    toolHrefs: ['/tools/hexagrams', '/classics', '/knowledge', '/tools/records', '/tools/ai-prompt', '/tools/synthesis'],
    steps: ['查资料', '看图解', '合参接力']
  }
]

export const xuanComingTools = [
  {
    title: '服务端同步',
    status: '规划中',
    summary: '当前收藏和记录先存在本地，后续如需账号体系再同步到服务端。'
  },
  {
    title: '会员解读',
    status: '规划中',
    summary: '第三批再做，不影响当前工具矩阵和排盘字段继续扩展。'
  }
]

export const scenarioCards = [
  {
    title: '出生盘',
    text: '八字和紫微以出生时间、出生地和口径为核心，优先保证字段可复现。'
  },
  {
    title: '问事起卦',
    text: '六爻、梅花和每日一卦先记录事项、时间、动爻和卦象，不在工具里直接断吉凶。'
  },
  {
    title: '择时查询',
    text: '黄历、择日和时辰页提供日课字段，适合快速复制当天宜忌、冲煞和节气信息。'
  },
  {
    title: 'AI 接力',
    text: '导出的文本和本地记录更适合交给 AI 做结构化解释，也方便换模型或换 Agent 继续处理。'
  }
]

export const featureBlocks = [
  {
    title: '工具箱结构',
    text: '八字、紫微、六爻、梅花、奇门六壬、黄历择日、干支五行、六十四卦和十二时辰统一入口。'
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
    text: '当前先做本地历史、收藏、对盘资料和工具矩阵，会员与支付放到第三批以后。'
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
    text: '六爻支持手动、三数和时间起卦；梅花先输出体用、互卦和动爻字段。'
  }
]
