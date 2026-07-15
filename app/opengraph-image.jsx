import { ImageResponse } from 'next/og'
import { site, xuanCoreTools } from '@/lib/site'

export const alt = `${site.cnName} ${site.name}`
export const size = {
  width: 1200,
  height: 630
}
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0d100d',
          color: '#fffdf6',
          padding: 64,
          fontFamily: 'Arial, sans-serif'
        }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div
              style={{
                width: 76,
                height: 76,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid rgba(226, 201, 143, 0.28)',
                borderRadius: 8,
                background: '#141814',
                color: '#e2c98f',
                fontSize: 42,
                fontWeight: 900
              }}>
              玄
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#fffdf6', fontSize: 32, fontWeight: 900 }}>{site.name}</span>
              <span style={{ color: 'rgba(255, 250, 240, 0.62)', fontSize: 22 }}>{site.cnName}</span>
            </div>
          </div>
          <div
            style={{
              border: '2px solid rgba(226, 201, 143, 0.28)',
              borderRadius: 999,
              padding: '12px 20px',
              color: '#e2c98f',
              fontSize: 22,
              fontWeight: 800
            }}>
            xuan.liujixue.cn
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <h1 style={{ width: 920, margin: 0, fontSize: 84, lineHeight: 0.98, letterSpacing: 0 }}>
            东方术数排盘工作台
          </h1>
          <p style={{ width: 900, margin: 0, color: 'rgba(255, 250, 240, 0.68)', fontSize: 30, lineHeight: 1.42 }}>
            八字、紫微、六爻、奇门六壬和资料查询，只输出结构化盘面和图片导出。
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          {xuanCoreTools.slice(0, 4).map(tool => (
            <div
              key={tool.title}
              style={{
                display: 'flex',
                border: '2px solid rgba(255, 253, 246, 0.12)',
                borderRadius: 8,
                background: 'rgba(255, 253, 246, 0.06)',
                padding: '14px 18px',
                color: '#fffdf6',
                fontSize: 22,
                fontWeight: 800
              }}>
              {tool.title}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  )
}
