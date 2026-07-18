const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']

// 先天八卦：乾兑离震巽坎艮坤，爻线自下而上，1 为阳爻、0 为阴爻
const TRIGRAM_LINES = [
  [1, 1, 1],
  [1, 1, 0],
  [1, 0, 1],
  [1, 0, 0],
  [0, 1, 1],
  [0, 1, 0],
  [0, 0, 1],
  [0, 0, 0]
]

const CENTER = 300
const GOLD = 'rgba(228, 203, 150, 0.52)'
const GOLD_SOFT = 'rgba(228, 203, 150, 0.3)'
const GOLD_FAINT = 'rgba(228, 203, 150, 0.14)'
const GOLD_LINE = 'rgba(228, 203, 150, 0.78)'
const BRASS = 'rgba(201, 155, 90, 0.85)'

function point(radius, angle) {
  return {
    x: CENTER + radius * Math.sin(angle),
    y: CENTER - radius * Math.cos(angle)
  }
}

function RingCharacters({ characters, fill, radius, size }) {
  return characters.map((character, index) => {
    const angle = (index / characters.length) * Math.PI * 2
    const { x, y } = point(radius, angle)
    return (
      <text
        dominantBaseline='central'
        fill={fill}
        fontSize={size}
        key={character}
        textAnchor='middle'
        x={x.toFixed(2)}
        y={y.toFixed(2)}>
        {character}
      </text>
    )
  })
}

function DegreeTicks() {
  return Array.from({ length: 60 }).map((_, index) => {
    const angle = (index / 60) * Math.PI * 2
    const major = index % 5 === 0
    const inner = point(major ? 268 : 274, angle)
    const outer = point(284, angle)
    return (
      <line
        key={index}
        stroke={major ? GOLD_SOFT : GOLD_FAINT}
        strokeWidth={major ? 1.4 : 0.8}
        x1={inner.x.toFixed(2)}
        x2={outer.x.toFixed(2)}
        y1={inner.y.toFixed(2)}
        y2={outer.y.toFixed(2)}
      />
    )
  })
}

function TrigramRing() {
  return TRIGRAM_LINES.map((lines, index) => (
    <g key={index} transform={`rotate(${index * 45} ${CENTER} ${CENTER})`}>
      {lines.map((solid, lineIndex) => {
        // 初爻（下爻）靠近盘心，上爻朝外
        const radius = 104 + (2 - lineIndex) * 14
        const y = CENTER - radius
        return solid ? (
          <rect fill={GOLD_LINE} height={5.5} key={lineIndex} width={36} x={CENTER - 18} y={y - 2.75} />
        ) : (
          <g key={lineIndex}>
            <rect fill={GOLD_LINE} height={5.5} width={15} x={CENTER - 18} y={y - 2.75} />
            <rect fill={GOLD_LINE} height={5.5} width={15} x={CENTER + 3} y={y - 2.75} />
          </g>
        )
      })}
    </g>
  ))
}

function TaijiCenter() {
  return (
    <g>
      <circle cx={CENTER} cy={CENTER} fill='none' r={84} stroke={GOLD_SOFT} strokeWidth={1} />
      <path
        d={`M${CENTER} ${CENTER - 84} A84 84 0 0 1 ${CENTER} ${CENTER + 84} A42 42 0 0 1 ${CENTER} ${CENTER} A42 42 0 0 0 ${CENTER} ${CENTER - 84} Z`}
        fill={BRASS}
      />
      <circle cx={CENTER} cy={CENTER - 42} fill='#12100b' r={8} />
      <circle cx={CENTER} cy={CENTER + 42} fill={BRASS} r={8} />
    </g>
  )
}

export function XuanCompass() {
  return (
    <div aria-hidden='true' className='xuan-compass'>
      <svg role='presentation' viewBox='0 0 600 600'>
        <circle cx={CENTER} cy={CENTER} fill='none' r={292} stroke={GOLD_SOFT} strokeWidth={1} />
        <circle cx={CENTER} cy={CENTER} fill='none' r={222} stroke={GOLD_FAINT} strokeWidth={1} />
        <circle cx={CENTER} cy={CENTER} fill='none' r={168} stroke={GOLD_FAINT} strokeWidth={1} />

        <g className='xuan-compass-ring-outer' style={{ transformOrigin: '300px 300px' }}>
          <DegreeTicks />
          <RingCharacters characters={EARTHLY_BRANCHES} fill={GOLD} radius={248} size={26} />
        </g>

        <g className='xuan-compass-ring-mid' style={{ transformOrigin: '300px 300px' }}>
          <RingCharacters characters={HEAVENLY_STEMS} fill={GOLD_SOFT} radius={194} size={22} />
        </g>

        <g className='xuan-compass-ring-trigram' style={{ transformOrigin: '300px 300px' }}>
          <TrigramRing />
        </g>

        <TaijiCenter />
      </svg>
    </div>
  )
}
