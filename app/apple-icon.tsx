import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FFF8F3',
        }}
      >
        <div style={{ width: 140, height: 140, display: 'flex', position: 'relative' }}>
          <div style={{ position: 'absolute', left: 40, top: 72, width: 60, height: 48, background: '#FF9A76', borderRadius: 40 }} />
          <div style={{ position: 'absolute', left: 18, top: 38, width: 34, height: 28, background: '#FF9A76', borderRadius: 40 }} />
          <div style={{ position: 'absolute', left: 53, top: 22, width: 34, height: 28, background: '#FF9A76', borderRadius: 40 }} />
          <div style={{ position: 'absolute', left: 88, top: 38, width: 34, height: 28, background: '#FF9A76', borderRadius: 40 }} />
        </div>
      </div>
    ),
    size
  )
}
