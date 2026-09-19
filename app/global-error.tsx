'use client'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FFF8F3] text-[#1A1A1A]">
        <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-4 text-center">
          <h1 className="text-3xl font-bold text-[#FF9A76]">Something went wrong</h1>
          <p className="mt-3 text-gray-600">The page failed to load. Please try again.</p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 rounded-full bg-gradient-to-r from-[#FF9A76] to-[#FFB86C] px-6 py-3 font-semibold text-white"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  )
}
