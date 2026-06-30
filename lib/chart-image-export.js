const fonts = '-apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif'

const textColor = '#17201b'
const mutedColor = '#667069'
const ruleColor = '#e2dbce'
const accentColor = '#0d9488'
const warmColor = '#a86523'
const watermarkColor = '#8d8577'
const watermarkSpace = 112
const elementTextColors = {
  木: '#2f9e44',
  火: '#c1121f',
  土: '#8c7746',
  金: '#68707a',
  水: '#2563eb'
}
const ganElements = {
  甲: '木',
  乙: '木',
  丙: '火',
  丁: '火',
  戊: '土',
  己: '土',
  庚: '金',
  辛: '金',
  壬: '水',
  癸: '水'
}
const zhiElements = {
  子: '水',
  丑: '土',
  寅: '木',
  卯: '木',
  辰: '土',
  巳: '火',
  午: '火',
  未: '土',
  申: '金',
  酉: '金',
  戌: '土',
  亥: '水'
}

const setFont = (context, weight, size) => {
  context.font = `${weight} ${size}px ${fonts}`
}

const wrapText = (context, text, maxWidth) => {
  const source = String(text || '')
  if (!source) return ['']

  const lines = []
  let current = ''

  for (const char of Array.from(source)) {
    const next = current + char
    if (current && context.measureText(next).width > maxWidth) {
      lines.push(current)
      current = char
    } else {
      current = next
    }
  }

  if (current) lines.push(current)
  return lines
}

const flattenRows = payload => payload.sections.flatMap(section => [
  { type: 'section', text: section.title },
  ...section.rows.map(row => ({
    type: 'row',
    label: row.label,
    value: row.value
  }))
])

const measureBadges = (context, badges, maxWidth) => {
  const rows = [[]]
  let currentWidth = 0

  for (const badge of badges) {
    const width = Math.ceil(context.measureText(badge).width) + 28
    const nextWidth = currentWidth ? currentWidth + 10 + width : width

    if (currentWidth && nextWidth > maxWidth) {
      rows.push([{ text: badge, width }])
      currentWidth = width
    } else {
      rows[rows.length - 1].push({ text: badge, width })
      currentWidth = nextWidth
    }
  }

  return rows
}

const createPlan = (context, payload, maxWidth) => {
  const plan = []
  let height = 56

  setFont(context, 800, 42)
  plan.push({ type: 'title', lines: wrapText(context, payload.title, maxWidth) })
  height += plan[plan.length - 1].lines.length * 52

  setFont(context, 650, 25)
  plan.push({ type: 'subtitle', lines: wrapText(context, payload.subtitle, maxWidth) })
  height += plan[plan.length - 1].lines.length * 36 + 14

  setFont(context, 750, 22)
  const badgeRows = measureBadges(context, payload.badges || [], maxWidth)
  plan.push({ type: 'badges', rows: badgeRows })
  height += badgeRows.length * 40 + 22

  for (const item of flattenRows(payload)) {
    if (item.type === 'section') {
      plan.push(item)
      height += 48
      continue
    }

    setFont(context, 700, 24)
    const label = `${item.label}：`
    const labelWidth = Math.min(210, Math.max(104, context.measureText(label).width + 8))
    setFont(context, 650, 24)
    const lines = wrapText(context, item.value, maxWidth - labelWidth)
    plan.push({ ...item, label, labelWidth, lines })
    height += Math.max(36, lines.length * 33) + 6
  }

  if (payload.footer) {
    setFont(context, 650, 22)
    plan.push({ type: 'footer', lines: wrapText(context, payload.footer, maxWidth) })
    height += plan[plan.length - 1].lines.length * 32 + 30
  }

  return { plan, height: Math.max(760, height + 74) }
}

const drawRoundRect = (context, x, y, width, height, radius) => {
  context.beginPath()
  context.moveTo(x + radius, y)
  context.lineTo(x + width - radius, y)
  context.quadraticCurveTo(x + width, y, x + width, y + radius)
  context.lineTo(x + width, y + height - radius)
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  context.lineTo(x + radius, y + height)
  context.quadraticCurveTo(x, y + height, x, y + height - radius)
  context.lineTo(x, y + radius)
  context.quadraticCurveTo(x, y, x + radius, y)
  context.closePath()
}

const drawWatermark = (context, width, height, padding) => {
  const text = 'Jixue Lab · liujixue.cn'

  context.save()
  context.globalAlpha = 0.72
  context.strokeStyle = ruleColor
  context.lineWidth = 1
  context.beginPath()
  context.moveTo(padding, height - 86)
  context.lineTo(width - padding, height - 86)
  context.stroke()

  setFont(context, 650, 18)
  const textWidth = context.measureText(text).width
  const x = width - padding - textWidth
  const y = height - 52

  context.globalAlpha = 0.42
  context.strokeStyle = warmColor
  context.lineWidth = 3
  context.beginPath()
  context.moveTo(x - 48, y - 6)
  context.lineTo(x - 18, y - 6)
  context.stroke()

  context.globalAlpha = 0.82
  context.fillStyle = watermarkColor
  context.fillText(text, x, y)
  context.restore()
}

const drawPlan = (context, payload, plan, width, height, padding) => {
  context.fillStyle = '#fffdf8'
  context.fillRect(0, 0, width, height)

  const maxWidth = width - padding * 2
  let y = padding

  context.fillStyle = textColor
  setFont(context, 800, 42)
  for (const line of plan.find(item => item.type === 'title').lines) {
    context.fillText(line, padding, y + 42)
    y += 52
  }

  context.fillStyle = mutedColor
  setFont(context, 650, 25)
  for (const line of plan.find(item => item.type === 'subtitle').lines) {
    context.fillText(line, padding, y + 25)
    y += 36
  }

  y += 14
  const badgePlan = plan.find(item => item.type === 'badges')
  setFont(context, 750, 22)
  for (const row of badgePlan.rows) {
    let x = padding
    for (const badge of row) {
      drawRoundRect(context, x, y, badge.width, 32, 16)
      context.fillStyle = '#e7f7f3'
      context.fill()
      context.fillStyle = accentColor
      context.fillText(badge.text, x + 14, y + 23)
      x += badge.width + 10
    }
    y += 40
  }

  y += 14
  for (const item of plan.filter(entry => !['title', 'subtitle', 'badges'].includes(entry.type))) {
    if (item.type === 'section') {
      context.fillStyle = warmColor
      setFont(context, 800, 25)
      context.fillText(item.text, padding, y + 26)
      y += 40
      context.strokeStyle = ruleColor
      context.beginPath()
      context.moveTo(padding, y)
      context.lineTo(width - padding, y)
      context.stroke()
      y += 8
      continue
    }

    if (item.type === 'footer') {
      y += 14
      context.fillStyle = mutedColor
      setFont(context, 650, 22)
      for (const line of item.lines) {
        context.fillText(line, padding, y + 22)
        y += 32
      }
      continue
    }

    context.fillStyle = mutedColor
    setFont(context, 700, 24)
    context.fillText(item.label, padding, y + 26)
    context.fillStyle = textColor
    setFont(context, 650, 24)
    for (const [index, line] of item.lines.entries()) {
      context.fillText(line, padding + item.labelWidth, y + 26 + index * 33)
    }
    y += Math.max(36, item.lines.length * 33) + 6
  }

  context.strokeStyle = ruleColor
  context.lineWidth = 2
  drawRoundRect(context, 24, 24, width - 48, height - 48, 28)
  context.stroke()
  drawWatermark(context, width, height, padding)
}

const getSymbolColor = value => elementTextColors[ganElements[value] || zhiElements[value]] || textColor

const splitFineCellLines = (context, value, maxWidth) => {
  const source = String(value || '-')
  const parts = source.includes('、') ? source.split('、') : [source]
  return parts.flatMap(part => wrapText(context, part, maxWidth))
}

const measureFineTable = (context, table, width) => {
  const labelWidth = 112
  const cellWidth = (width - labelWidth) / 4
  const rows = table.rows.map((row, rowIndex) => {
    setFont(context, 700, ['天干', '地支'].includes(row.label) ? 38 : 21)
    const cells = row.values.map(value => splitFineCellLines(context, value, cellWidth - 24))
    const maxLines = Math.max(1, ...cells.map(lines => lines.length))
    const rowHeight = ['天干', '地支'].includes(row.label)
      ? 74
      : Math.max(58, maxLines * 29 + 24)

    return { ...row, cells, rowHeight, shaded: rowIndex % 2 === 0 }
  })

  return {
    cellWidth,
    labelWidth,
    rows,
    headerHeight: 52,
    height: 52 + rows.reduce((sum, row) => sum + row.rowHeight, 0)
  }
}

const drawFineTable = (context, tablePlan, table, x, y, width) => {
  const { cellWidth, labelWidth, rows, headerHeight } = tablePlan

  context.save()
  drawRoundRect(context, x, y, width, tablePlan.height, 12)
  context.clip()

  context.fillStyle = '#f7f3ea'
  context.fillRect(x, y, width, headerHeight)
  context.strokeStyle = ruleColor
  context.lineWidth = 1
  context.strokeRect(x, y, width, headerHeight)

  setFont(context, 780, 20)
  context.fillStyle = mutedColor
  context.fillText('日期', x + 28, y + 33)

  for (const [index, column] of table.columns.entries()) {
    const cellX = x + labelWidth + index * cellWidth
    context.fillStyle = mutedColor
    context.fillText(column, cellX + 26, y + 33)
    context.beginPath()
    context.moveTo(cellX, y)
    context.lineTo(cellX, y + tablePlan.height)
    context.stroke()
  }

  let rowY = y + headerHeight
  for (const row of rows) {
    context.fillStyle = row.shaded ? '#fffdf8' : '#f8f6f0'
    context.fillRect(x, rowY, width, row.rowHeight)
    context.strokeStyle = ruleColor
    context.beginPath()
    context.moveTo(x, rowY)
    context.lineTo(x + width, rowY)
    context.stroke()

    setFont(context, 780, 21)
    context.fillStyle = mutedColor
    context.fillText(row.label, x + 28, rowY + Math.min(36, row.rowHeight - 18))

    for (const [index, lines] of row.cells.entries()) {
      const cellX = x + labelWidth + index * cellWidth

      if (['天干', '地支'].includes(row.label)) {
        const value = lines[0] || '-'
        setFont(context, 900, 40)
        context.fillStyle = getSymbolColor(value)
        const textWidth = context.measureText(value).width
        context.fillText(value, cellX + (cellWidth - textWidth) / 2, rowY + 51)
        continue
      }

      setFont(context, 700, 21)
      const lineHeight = 29
      const blockHeight = lines.length * lineHeight
      const startY = rowY + Math.max(30, (row.rowHeight - blockHeight) / 2 + 20)

      for (const [lineIndex, line] of lines.entries()) {
        context.fillStyle = row.label === '神煞' ? warmColor : textColor
        const textWidth = context.measureText(line).width
        context.fillText(line, cellX + Math.max(12, (cellWidth - textWidth) / 2), startY + lineIndex * lineHeight)
      }
    }

    rowY += row.rowHeight
  }

  context.strokeStyle = ruleColor
  context.lineWidth = 2
  drawRoundRect(context, x, y, width, tablePlan.height, 12)
  context.stroke()
  context.restore()

  return y + tablePlan.height
}

const measureLuckGrid = items => {
  const columns = 5
  const rows = Math.ceil(items.length / columns)
  return {
    cardHeight: 112,
    columns,
    height: 56 + rows * 124
  }
}

const drawLuckGrid = (context, title, items, x, y, width, plan) => {
  setFont(context, 820, 28)
  context.fillStyle = textColor
  context.fillText(title, x, y + 28)

  const cardGap = 10
  const cardWidth = (width - cardGap * (plan.columns - 1)) / plan.columns
  const startY = y + 54

  for (const [index, item] of items.entries()) {
    const col = index % plan.columns
    const row = Math.floor(index / plan.columns)
    const cardX = x + col * (cardWidth + cardGap)
    const cardY = startY + row * 124

    context.fillStyle = item.active ? '#e7f7f3' : '#fffdf8'
    context.strokeStyle = item.active ? 'rgba(13, 148, 136, 0.62)' : ruleColor
    context.lineWidth = item.active ? 2 : 1
    drawRoundRect(context, cardX, cardY, cardWidth, plan.cardHeight, 10)
    context.fill()
    context.stroke()

    setFont(context, 700, 16)
    context.fillStyle = mutedColor
    const yearText = item.endYear ? `${item.startYear}-${item.endYear}` : String(item.year)
    context.fillText(yearText, cardX + 14, cardY + 24)

    setFont(context, 900, 30)
    context.fillStyle = item.active ? accentColor : getSymbolColor(item.gan)
    context.fillText(item.label || item.ganZhi, cardX + 14, cardY + 60)

    setFont(context, 700, 17)
    context.fillStyle = textColor
    const ageText = item.endAge ? `${item.startAge}-${item.endAge}岁` : `${item.age}岁`
    context.fillText(ageText, cardX + 14, cardY + 88)

    if (item.shiShenGan) {
      setFont(context, 700, 15)
      context.fillStyle = mutedColor
      context.fillText(item.shiShenGan, cardX + cardWidth - context.measureText(item.shiShenGan).width - 14, cardY + 88)
    }
  }

  return y + plan.height
}

const ziWeiGridPositions = {
  巳: [0, 0],
  午: [1, 0],
  未: [2, 0],
  申: [3, 0],
  辰: [0, 1],
  酉: [3, 1],
  卯: [0, 2],
  戌: [3, 2],
  寅: [0, 3],
  丑: [1, 3],
  子: [2, 3],
  亥: [3, 3]
}

const drawWrappedBlock = (context, lines, x, y, maxWidth, lineHeight, maxLines = 4) => {
  let lineY = y
  let used = 0

  for (const source of lines.filter(Boolean)) {
    for (const line of wrapText(context, source, maxWidth)) {
      if (used >= maxLines) return lineY
      context.fillText(line, x, lineY)
      lineY += lineHeight
      used += 1
    }
  }

  return lineY
}

const drawZiWeiPalaceCell = (context, palace, x, y, width, height) => {
  const highlighted = palace.isMingPalace || palace.isBodyPalace

  context.fillStyle = highlighted ? '#e7f7f3' : '#fffdf8'
  context.strokeStyle = highlighted ? 'rgba(13, 148, 136, 0.62)' : ruleColor
  context.lineWidth = highlighted ? 2 : 1
  drawRoundRect(context, x, y, width, height, 12)
  context.fill()
  context.stroke()

  setFont(context, 760, 16)
  context.fillStyle = mutedColor
  context.fillText(`${palace.heavenlyStem}${palace.earthlyBranch}`, x + 14, y + 26)

  setFont(context, 860, 22)
  context.fillStyle = highlighted ? accentColor : textColor
  const nameText = [
    palace.name,
    palace.isMingPalace ? '命' : '',
    palace.isBodyPalace ? '身' : ''
  ].filter(Boolean).join(' · ')
  context.fillText(nameText, x + 14, y + 56)

  setFont(context, 820, 18)
  context.fillStyle = warmColor
  drawWrappedBlock(context, [palace.majorStars?.join('、') || '空宫'], x + 14, y + 88, width - 28, 24, 2)

  setFont(context, 680, 14)
  context.fillStyle = textColor
  const minorText = palace.minorStars?.length ? `辅：${palace.minorStars.join('、')}` : '辅：无'
  const adjectiveText = palace.adjectiveStars?.length ? `杂：${palace.adjectiveStars.join('、')}` : ''
  drawWrappedBlock(context, [minorText, adjectiveText], x + 14, y + 138, width - 28, 19, 4)

  setFont(context, 700, 13)
  context.fillStyle = mutedColor
  const decadal = palace.decadal?.range?.join('-') || '未取'
  context.fillText(`大限 ${decadal}岁`, x + 14, y + height - 34)
  context.fillText(`${palace.changsheng12 || '-'} · ${palace.boshi12 || '-'}`, x + 14, y + height - 14)
}

const drawZiWeiCenterCell = (context, payload, x, y, width, height) => {
  context.fillStyle = '#f8f6f0'
  context.strokeStyle = ruleColor
  context.lineWidth = 1
  drawRoundRect(context, x, y, width, height, 12)
  context.fill()
  context.stroke()

  setFont(context, 860, 25)
  context.fillStyle = textColor
  context.fillText('紫微斗数专业盘', x + 24, y + 42)

  setFont(context, 700, 17)
  context.fillStyle = mutedColor
  const coreRows = payload.sections?.find(section => section.title === '核心字段')?.rows || []
  const rows = [
    coreRows.find(row => row.label === '输入时间')?.value,
    coreRows.find(row => row.label === '排盘时间')?.value ? `排盘 ${coreRows.find(row => row.label === '排盘时间').value}` : '',
    coreRows.find(row => row.label === '农历')?.value ? `农历 ${coreRows.find(row => row.label === '农历').value}` : '',
    coreRows.find(row => row.label === '四柱')?.value ? `四柱 ${coreRows.find(row => row.label === '四柱').value}` : '',
    coreRows.find(row => row.label === '五行局')?.value ? `五行局 ${coreRows.find(row => row.label === '五行局').value}` : '',
    coreRows.find(row => row.label === '命主/身主')?.value ? `命主/身主 ${coreRows.find(row => row.label === '命主/身主').value}` : '',
    coreRows.find(row => row.label === '出生地')?.value
  ]
  drawWrappedBlock(context, rows, x + 24, y + 76, width - 48, 26, 9)

  setFont(context, 760, 15)
  context.fillStyle = accentColor
  let badgeX = x + 24
  const badgeY = y + height - 48
  for (const badge of (payload.badges || []).slice(0, 4)) {
    const badgeWidth = Math.min(width - 48, Math.ceil(context.measureText(badge).width) + 24)
    if (badgeX + badgeWidth > x + width - 24) break
    context.fillStyle = '#e7f7f3'
    drawRoundRect(context, badgeX, badgeY, badgeWidth, 30, 15)
    context.fill()
    context.fillStyle = accentColor
    context.fillText(badge, badgeX + 12, badgeY + 21)
    badgeX += badgeWidth + 8
  }
}

const createZiWeiFinePlan = (payload, maxWidth) => {
  const gap = 8
  const cellWidth = (maxWidth - gap * 3) / 4
  const cellHeight = 218
  const chartHeight = cellHeight * 4 + gap * 3
  const footerHeight = payload.footer ? 62 : 24

  return {
    cellHeight,
    cellWidth,
    chartHeight,
    footerHeight,
    gap,
    height: Math.max(1260, 224 + chartHeight + footerHeight + watermarkSpace)
  }
}

const drawZiWeiFinePlan = (context, payload, plan, width, height, padding) => {
  context.fillStyle = '#fffdf8'
  context.fillRect(0, 0, width, height)

  const maxWidth = width - padding * 2
  let y = padding

  context.fillStyle = textColor
  setFont(context, 880, 44)
  context.fillText(payload.title, padding, y + 44)

  context.fillStyle = mutedColor
  setFont(context, 680, 24)
  for (const line of wrapText(context, payload.subtitle, maxWidth)) {
    context.fillText(line, padding, y + 84)
    y += 30
  }

  setFont(context, 760, 20)
  let badgeX = padding
  const badgeY = padding + 112
  for (const badge of payload.badges || []) {
    const badgeWidth = Math.ceil(context.measureText(badge).width) + 28
    if (badgeX + badgeWidth > width - padding) break
    context.fillStyle = '#e7f7f3'
    drawRoundRect(context, badgeX, badgeY, badgeWidth, 34, 17)
    context.fill()
    context.fillStyle = accentColor
    context.fillText(badge, badgeX + 14, badgeY + 24)
    badgeX += badgeWidth + 10
  }

  context.fillStyle = warmColor
  setFont(context, 720, 20)
  context.fillText(payload.timeAdjustmentText || '', padding, padding + 174)

  y = padding + 210
  const palaceByBranch = Object.fromEntries((payload.palaces || []).map(palace => [palace.earthlyBranch, palace]))

  for (const [branch, [column, row]] of Object.entries(ziWeiGridPositions)) {
    const palace = palaceByBranch[branch]
    if (!palace) continue
    drawZiWeiPalaceCell(
      context,
      palace,
      padding + column * (plan.cellWidth + plan.gap),
      y + row * (plan.cellHeight + plan.gap),
      plan.cellWidth,
      plan.cellHeight
    )
  }

  drawZiWeiCenterCell(
    context,
    payload,
    padding + plan.cellWidth + plan.gap,
    y + plan.cellHeight + plan.gap,
    plan.cellWidth * 2 + plan.gap,
    plan.cellHeight * 2 + plan.gap
  )

  y += plan.chartHeight + 28

  if (payload.footer) {
    context.fillStyle = mutedColor
    setFont(context, 640, 19)
    for (const line of wrapText(context, payload.footer, maxWidth)) {
      context.fillText(line, padding, y + 20)
      y += 27
    }
  }

  context.strokeStyle = ruleColor
  context.lineWidth = 2
  drawRoundRect(context, 24, 24, width - 48, height - 48, 28)
  context.stroke()
  drawWatermark(context, width, height, padding)
}

const createBaziFinePlan = (context, payload, maxWidth) => {
  const fineTablePlan = measureFineTable(context, payload.fineTable, maxWidth)
  const daYunItems = (payload.daYun || []).slice(0, 10)
  const liuNianItems = (payload.liuNian || []).slice(0, 10)
  const daYunPlan = measureLuckGrid(daYunItems)
  const liuNianPlan = measureLuckGrid(liuNianItems)
  setFont(context, 640, 20)
  const footerLines = payload.footer ? wrapText(context, payload.footer, maxWidth) : []
  const footerHeight = footerLines.length ? footerLines.length * 28 + 26 : 0
  const height = 58 + 202 + fineTablePlan.height + 34 + daYunPlan.height + 28 + liuNianPlan.height + 26 + footerHeight + watermarkSpace

  return {
    daYunItems,
    daYunPlan,
    fineTablePlan,
    footerLines,
    height: Math.max(1580, height),
    liuNianItems,
    liuNianPlan
  }
}

const drawBaziFinePlan = (context, payload, plan, width, height, padding) => {
  context.fillStyle = '#fffdf8'
  context.fillRect(0, 0, width, height)

  const maxWidth = width - padding * 2
  let y = padding

  context.fillStyle = textColor
  setFont(context, 880, 44)
  context.fillText(payload.title, padding, y + 44)

  context.fillStyle = mutedColor
  setFont(context, 680, 24)
  context.fillText(payload.subtitle, padding, y + 84)

  setFont(context, 760, 20)
  let badgeX = padding
  for (const badge of payload.badges || []) {
    const badgeWidth = Math.ceil(context.measureText(badge).width) + 28
    context.fillStyle = '#e7f7f3'
    drawRoundRect(context, badgeX, y + 112, badgeWidth, 34, 17)
    context.fill()
    context.fillStyle = accentColor
    context.fillText(badge, badgeX + 14, y + 136)
    badgeX += badgeWidth + 10
  }

  const startText = payload.yunStart?.solarText
    ? `${payload.yunStart.text} · 交运 ${payload.yunStart.solarText}`
    : payload.yunStart?.text || ''
  const placeText = [payload.birthPlaceText, payload.chartSolarText ? `排盘时间 ${payload.chartSolarText}` : '', payload.timeAdjustmentText]
    .filter(Boolean)
    .join(' · ')
  if (startText) {
    context.fillStyle = warmColor
    setFont(context, 720, 22)
    context.fillText(startText, padding, y + 170)
  }

  if (placeText) {
    context.fillStyle = mutedColor
    setFont(context, 650, 18)
    context.fillText(placeText, padding, y + 202)
  }

  y += 226
  y = drawFineTable(context, plan.fineTablePlan, payload.fineTable, padding, y, maxWidth) + 34
  y = drawLuckGrid(context, '大运', plan.daYunItems, padding, y, maxWidth, plan.daYunPlan) + 28
  y = drawLuckGrid(context, `流年${payload.currentDaYun ? ` · ${payload.currentDaYun.label}` : ''}`, plan.liuNianItems, padding, y, maxWidth, plan.liuNianPlan) + 26

  if (payload.footer) {
    context.fillStyle = mutedColor
    setFont(context, 640, 20)
    for (const line of plan.footerLines) {
      context.fillText(line, padding, y + 20)
      y += 28
    }
  }

  context.strokeStyle = ruleColor
  context.lineWidth = 2
  drawRoundRect(context, 24, 24, width - 48, height - 48, 28)
  context.stroke()
  drawWatermark(context, width, height, padding)
}

export async function downloadBaZiFineChartImage(payload) {
  if (typeof document === 'undefined') return false

  const width = 1080
  const padding = 56
  const measuringCanvas = document.createElement('canvas')
  const measuringContext = measuringCanvas.getContext('2d')
  const plan = createBaziFinePlan(measuringContext, payload, width - padding * 2)
  const scale = Math.max(2, Math.min(3, window.devicePixelRatio || 2))
  const canvas = document.createElement('canvas')
  canvas.width = width * scale
  canvas.height = plan.height * scale
  const context = canvas.getContext('2d')

  context.scale(scale, scale)
  drawBaziFinePlan(context, payload, plan, width, plan.height, padding)

  const url = canvas.toDataURL('image/png')
  const link = document.createElement('a')
  link.href = url
  link.download = payload.filename || 'bazi-fine-chart.png'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  return true
}

export async function downloadZiWeiFineChartImage(payload) {
  if (typeof document === 'undefined') return false

  const width = 1080
  const padding = 56
  const plan = createZiWeiFinePlan(payload, width - padding * 2)
  const scale = Math.max(2, Math.min(3, window.devicePixelRatio || 2))
  const canvas = document.createElement('canvas')
  canvas.width = width * scale
  canvas.height = plan.height * scale
  const context = canvas.getContext('2d')

  context.scale(scale, scale)
  drawZiWeiFinePlan(context, payload, plan, width, plan.height, padding)

  const url = canvas.toDataURL('image/png')
  const link = document.createElement('a')
  link.href = url
  link.download = payload.filename || 'ziwei-fine-chart.png'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  return true
}

export async function downloadChartImage(payload) {
  if (payload?.imageKind === 'baziFine') return downloadBaZiFineChartImage(payload)
  if (payload?.imageKind === 'ziweiFine') return downloadZiWeiFineChartImage(payload)
  if (typeof document === 'undefined') return false

  const width = 1080
  const padding = 56
  const measuringCanvas = document.createElement('canvas')
  const measuringContext = measuringCanvas.getContext('2d')
  const { plan, height } = createPlan(measuringContext, payload, width - padding * 2)
  const scale = Math.max(2, Math.min(3, window.devicePixelRatio || 2))
  const canvas = document.createElement('canvas')
  canvas.width = width * scale
  canvas.height = height * scale
  const context = canvas.getContext('2d')

  context.scale(scale, scale)
  drawPlan(context, payload, plan, width, height, padding)

  const url = canvas.toDataURL('image/png')
  const link = document.createElement('a')
  link.href = url
  link.download = payload.filename || 'chart-export.png'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  return true
}
