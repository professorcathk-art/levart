import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #FF9A76 0%, #FFB86C 50%, #7ECCC4 100%)',
          color: 'white',
        }}
      >
        <div style={{ width: 180, height: 160, display: 'flex', position: 'relative', marginBottom: 24 }}>
          <div style={{ position: 'absolute', left: 50, top: 88, width: 80, height: 62, background: 'white', borderRadius: 50 }} />
          <div style={{ position: 'absolute', left: 20, top: 42, width: 44, height: 36, background: 'white', borderRadius: 40 }} />
          <div style={{ position: 'absolute', left: 68, top: 22, width: 44, height: 36, background: 'white', borderRadius: 40 }} />
          <div style={{ position: 'absolute', left: 116, top: 42, width: 44, height: 36, background: 'white', borderRadius: 40 }} />
        </div>
        <div style={{ fontSize: 72, fontWeight: 800 }}>Catpawtrip</div>
        <div style={{ fontSize: 36, marginTop: 12, opacity: 0.95 }}>Chat your trip into a beautiful plan</div>
      </div>
    ),
    size
  )
}
