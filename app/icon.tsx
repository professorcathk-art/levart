import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
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
        <div
          style={{
            width: 28,
            height: 28,
            display: 'flex',
            position: 'relative',
          }}
        >
          <div style={{ position: 'absolute', left: 8, top: 14, width: 12, height: 10, background: '#FF9A76', borderRadius: 20 }} />
          <div style={{ position: 'absolute', left: 3, top: 7, width: 7, height: 6, background: '#FF9A76', borderRadius: 20 }} />
          <div style={{ position: 'absolute', left: 10, top: 4, width: 7, height: 6, background: '#FF9A76', borderRadius: 20 }} />
          <div style={{ position: 'absolute', left: 18, top: 7, width: 7, height: 6, background: '#FF9A76', borderRadius: 20 }} />
        </div>
      </div>
    ),
    size
  )
}
