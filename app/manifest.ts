import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Levart',
    short_name: 'Levart',
    description: 'Chat your trip into a beautiful plan, then take it with you offline.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFF8F3',
    theme_color: '#FF9A76',
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
