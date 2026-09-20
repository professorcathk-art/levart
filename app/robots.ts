import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://catpawtrip.com').replace(/\/$/, '')

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/trips', '/auth/', '/login', '/signup'],
    },
    sitemap: `${base}/sitemap.xml`,
  }
}
