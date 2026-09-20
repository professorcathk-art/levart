import type { MetadataRoute } from 'next'

const PATHS = ['/', '/plan', '/community', '/contact', '/about', '/privacy', '/terms', '/cookies']

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://catpawtrip.com').replace(/\/$/, '')

  return PATHS.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : 0.6,
  }))
}
