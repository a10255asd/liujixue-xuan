const MARK_BY_HREF = {
  '/tools/bazi': 'pillars',
  '/tools/ziwei': 'grid4',
  '/tools/liuyao': 'lines6',
  '/tools/meihua': 'plum',
  '/tools/qimen': 'grid9',
  '/tools/daliuren': 'three'
}

function MarkPaths({ kind }) {
  switch (kind) {
    case 'pillars':
      // 四柱
      return [4, 9.3, 14.6, 20].map(x => <line key={x} x1={x} x2={x} y1={3} y2={21} />)
    case 'grid4':
      // 紫微十二宫
      return [
        <rect height={19} key='f' width={19} x={2.5} y={2.5} />,
        ...[7.25, 12, 16.75].flatMap(v => [
          <line key={`v${v}`} x1={v} x2={v} y1={2.5} y2={21.5} />,
          <line key={`h${v}`} x1={2.5} x2={21.5} y1={v} y2={v} />
        ])
      ]
    case 'lines6':
      // 六爻，四爻为阴
      return [3.5, 6.9, 10.3, 13.7, 17.1, 20.5].map((y, index) =>
        index === 3 ? (
          <g key={y}>
            <line x1={3} x2={10} y1={y} y2={y} />
            <line x1={14} x2={21} y1={y} y2={y} />
          </g>
        ) : (
          <line key={y} x1={3} x2={21} y1={y} y2={y} />
        )
      )
    case 'plum':
      // 梅花五瓣
      return Array.from({ length: 5 }).map((_, index) => {
        const angle = (index / 5) * Math.PI * 2 - Math.PI / 2
        return <circle cx={12 + 6.2 * Math.cos(angle)} cy={12 + 6.2 * Math.sin(angle)} key={index} r={1.5} />
      })
    case 'grid9':
      // 奇门九宫
      return [
        <rect height={19} key='f' width={19} x={2.5} y={2.5} />,
        ...[8.8, 15.2].flatMap(v => [
          <line key={`v${v}`} x1={v} x2={v} y1={2.5} y2={21.5} />,
          <line key={`h${v}`} x1={2.5} x2={21.5} y1={v} y2={v} />
        ])
      ]
    case 'three':
      // 大六壬三传
      return [
        <line key='a' x1={3} x2={13} y1={6} y2={6} />,
        <line key='b' x1={3} x2={17} y1={12} y2={12} />,
        <line key='c' x1={3} x2={21} y1={18} y2={18} />
      ]
    default:
      return [<line key='a' x1={4} x2={20} y1={8} y2={8} />, <line key='b' x1={4} x2={20} y1={16} y2={16} />]
  }
}

export function ToolMark({ href, size = 26 }) {
  const kind = MARK_BY_HREF[href] ?? 'default'
  return (
    <svg
      aria-hidden='true'
      className='tool-mark'
      fill='none'
      height={size}
      stroke='currentColor'
      strokeLinecap='square'
      strokeWidth={1.4}
      viewBox='0 0 24 24'
      width={size}>
      <MarkPaths kind={kind} />
    </svg>
  )
}
