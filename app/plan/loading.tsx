'use client'

import { ThinkingCat } from '@/components/companion/thinking-cat'

export default function PlanLoading() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center bg-[#FFF8F3] text-gray-500">
      <ThinkingCat />
    </div>
  )
}
