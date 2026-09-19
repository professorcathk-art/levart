import { Suspense } from 'react'
import { AuthForm } from '@/components/auth/auth-form'

export default function SignupPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-[#FFF8F3] via-[#FFE8E0] to-[#FFD4C4] px-4 py-12">
      <Suspense fallback={<div className="text-gray-500">Loading…</div>}>
        <AuthForm mode="signup" />
      </Suspense>
    </main>
  )
}
