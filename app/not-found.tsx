import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-xl flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-bold text-[#FF9A76]">Page not found</h1>
      <p className="mt-3 text-gray-600">That trip or page does not exist, or the share link was revoked.</p>
      <Link
        href="/plan"
        className="mt-6 rounded-full bg-gradient-to-r from-[#FF9A76] to-[#FFB86C] px-6 py-3 font-semibold text-white"
      >
        Start a new plan
      </Link>
    </main>
  )
}
