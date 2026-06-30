export const site = {
  name: 'Jixue Xuan',
  cnName: '鸡血玄策',
  domain: 'https://xuan.liujixue.cn',
  mainSite: 'https://liujixue.cn',
  description: '面向八字、紫微斗数和六爻的东方命理排盘工具站，只做结构化排盘和可导出文本，不输出吉凶断语。'
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
  }
]

export const featureBlocks = [
  {
    title: '免费排盘',
    text: '先把盘面字段完整排出来，适合自己学习、截图保存，或继续交给 AI 做结构化分析。'
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
    text: '后面可以增加历史记录、收藏、对盘、每日一卦和多模型 AI 解读，但第一版先把排盘做稳。'
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
