const baseProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
  'aria-hidden': 'true'
}

function SvgIcon({ size = 20, children, ...props }) {
  return (
    <svg width={size} height={size} {...baseProps} {...props}>
      {children}
    </svg>
  )
}

export function ArrowRight(props) {
  return <SvgIcon {...props}><path d='M5 12h14' /><path d='m13 6 6 6-6 6' /></SvgIcon>
}

export function ArrowUpRight(props) {
  return <SvgIcon {...props}><path d='M7 17 17 7' /><path d='M9 7h8v8' /></SvgIcon>
}

export function Blocks(props) {
  return <SvgIcon {...props}><rect x='3' y='3' width='7' height='7' rx='1' /><rect x='14' y='3' width='7' height='7' rx='1' /><rect x='3' y='14' width='7' height='7' rx='1' /><rect x='14' y='14' width='7' height='7' rx='1' /></SvgIcon>
}

export function BookOpenText(props) {
  return <SvgIcon {...props}><path d='M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22V5.5Z' /><path d='M4 5.5A2.5 2.5 0 0 0 1.5 3H1v17h.5A2.5 2.5 0 0 1 4 22' /><path d='M8 8h8' /><path d='M8 12h7' /></SvgIcon>
}

export function Boxes(props) {
  return <SvgIcon {...props}><path d='m7.5 4.2 4.5 2.6 4.5-2.6' /><path d='M3 7l4.5 2.6L12 7l4.5 2.6L21 7' /><path d='M3 7v6l4.5 2.6V9.6' /><path d='M12 7v6l4.5 2.6V9.6' /><path d='M21 7v6l-4.5 2.6' /><path d='M7.5 15.6 12 18.2l4.5-2.6' /></SvgIcon>
}

export function CheckCircle2(props) {
  return <SvgIcon {...props}><circle cx='12' cy='12' r='9' /><path d='m8.5 12.5 2.2 2.2 4.8-5.4' /></SvgIcon>
}

export function Copy(props) {
  return <SvgIcon {...props}><rect x='8' y='8' width='11' height='11' rx='2' /><path d='M5 15H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1' /></SvgIcon>
}

export function Download(props) {
  return <SvgIcon {...props}><path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' /><path d='M7 10l5 5 5-5' /><path d='M12 15V3' /></SvgIcon>
}

export function CircleDot(props) {
  return <SvgIcon {...props}><circle cx='12' cy='12' r='9' /><circle cx='12' cy='12' r='2' fill='currentColor' stroke='none' /></SvgIcon>
}

export function Clock3(props) {
  return <SvgIcon {...props}><circle cx='12' cy='12' r='9' /><path d='M12 7v5l4 2' /></SvgIcon>
}

export function ExternalLink(props) {
  return <SvgIcon {...props}><path d='M14 4h6v6' /><path d='M10 14 20 4' /><path d='M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5' /></SvgIcon>
}

export function Github(props) {
  return <SvgIcon {...props}><path d='M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.5-.4 7-1.7 7-7.5a5.8 5.8 0 0 0-1.6-4 5.4 5.4 0 0 0-.1-4S18 2.6 15 4.1a13.4 13.4 0 0 0-6 0C6 2.6 4.7 4 4.7 4a5.4 5.4 0 0 0-.1 4A5.8 5.8 0 0 0 3 12c0 5.8 3.5 7.1 7 7.5a4.8 4.8 0 0 0-1 3.5v4' /><path d='M9 18c-4.5 2-4.5-2-6-2' /></SvgIcon>
}

export function Globe2(props) {
  return <SvgIcon {...props}><circle cx='12' cy='12' r='10' /><path d='M2 12h20' /><path d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z' /></SvgIcon>
}

export function Mail(props) {
  return <SvgIcon {...props}><rect x='3' y='5' width='18' height='14' rx='2' /><path d='m3 7 9 6 9-6' /></SvgIcon>
}

export function MessageCircle(props) {
  return <SvgIcon {...props}><path d='M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7A8.4 8.4 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.5 8.5 0 0 1 21 11.5Z' /></SvgIcon>
}

export function Menu(props) {
  return <SvgIcon {...props}><path d='M4 6h16' /><path d='M4 12h16' /><path d='M4 18h16' /></SvgIcon>
}

export function RefreshCcw(props) {
  return <SvgIcon {...props}><path d='M3 12a9 9 0 0 1 15-6.7L21 8' /><path d='M21 3v5h-5' /><path d='M21 12a9 9 0 0 1-15 6.7L3 16' /><path d='M3 21v-5h5' /></SvgIcon>
}

export function Route(props) {
  return <SvgIcon {...props}><circle cx='6' cy='19' r='3' /><circle cx='18' cy='5' r='3' /><path d='M12 19h2a4 4 0 0 0 0-8H10a4 4 0 0 1 0-8h2' /></SvgIcon>
}

export function Server(props) {
  return <SvgIcon {...props}><rect x='4' y='4' width='16' height='6' rx='2' /><rect x='4' y='14' width='16' height='6' rx='2' /><path d='M8 7h.01' /><path d='M8 17h.01' /></SvgIcon>
}

export function Smartphone(props) {
  return <SvgIcon {...props}><rect x='7' y='2' width='10' height='20' rx='2' /><path d='M11 18h2' /></SvgIcon>
}

export function Wrench(props) {
  return <SvgIcon {...props}><path d='M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2-2 2.6-2.6Z' /></SvgIcon>
}

export function X(props) {
  return <SvgIcon {...props}><path d='M18 6 6 18' /><path d='m6 6 12 12' /></SvgIcon>
}
