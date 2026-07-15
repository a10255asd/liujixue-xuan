'use client'

import dynamic from 'next/dynamic'

function ToolLoading() {
  return (
    <div className='chart-tool-loading' role='status'>
      <span>加载工具</span>
      <strong>正在准备排盘工作台...</strong>
    </div>
  )
}

const BaZiTool = dynamic(
  () => import('@/components/bazi-chart-calculator').then(module => module.BaZiChartCalculator),
  { loading: ToolLoading }
)

const ZiWeiTool = dynamic(
  () => import('@/components/ziwei-chart-calculator').then(module => module.ZiWeiChartCalculator),
  { loading: ToolLoading }
)

const LiuYaoTool = dynamic(
  () => import('@/components/liuyao-chart-calculator').then(module => module.LiuYaoChartCalculator),
  { loading: ToolLoading }
)

const CalendarToolComponent = dynamic(
  () => import('@/components/calendar-tool').then(module => module.CalendarTool),
  { loading: ToolLoading }
)

const DailyHexagramToolComponent = dynamic(
  () => import('@/components/daily-hexagram-tool').then(module => module.DailyHexagramTool),
  { loading: ToolLoading }
)

const HexagramReferenceToolComponent = dynamic(
  () => import('@/components/hexagram-reference-tool').then(module => module.HexagramReferenceTool),
  { loading: ToolLoading }
)

const ShichenReferenceToolComponent = dynamic(
  () => import('@/components/shichen-reference-tool').then(module => module.ShichenReferenceTool),
  { loading: ToolLoading }
)

const WuxingReferenceToolComponent = dynamic(
  () => import('@/components/wuxing-reference-tool').then(module => module.WuxingReferenceTool),
  { loading: ToolLoading }
)

const StructuredToolComponent = dynamic(
  () => import('@/components/structured-tool').then(module => module.StructuredTool),
  { loading: ToolLoading }
)

export function LazyBaZiChartCalculator() {
  return <BaZiTool />
}

export function LazyZiWeiChartCalculator() {
  return <ZiWeiTool />
}

export function LazyLiuYaoChartCalculator() {
  return <LiuYaoTool />
}

export function LazyCalendarTool() {
  return <CalendarToolComponent />
}

export function LazyDailyHexagramTool() {
  return <DailyHexagramToolComponent />
}

export function LazyHexagramReferenceTool() {
  return <HexagramReferenceToolComponent />
}

export function LazyShichenReferenceTool() {
  return <ShichenReferenceToolComponent />
}

export function LazyWuxingReferenceTool() {
  return <WuxingReferenceToolComponent />
}

export function LazyStructuredTool({ slug }) {
  return <StructuredToolComponent slug={slug} />
}
