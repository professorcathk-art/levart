export function slugifyDestination(destination: string): string {
  const base = destination
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)

  const suffix = Math.random().toString(36).slice(2, 8)
  return `${base || 'trip'}-${suffix}`
}
