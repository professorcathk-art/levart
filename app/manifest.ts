import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Catpawtrip 貓爪印',
    short_name: '貓爪印',
    description: 'Chat your trip into a beautiful plan, then take it with you offline.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAF6F0',
    theme_color: '#E07A5F',
    icons: [
      {
        src: '/icon.svg',
        sizes: '32x32',
        type: 'image/svg+xml',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
