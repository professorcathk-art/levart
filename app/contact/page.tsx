import { FeedbackForm } from '@/components/feedback/feedback-form'

export default function ContactPage({
  searchParams,
}: {
  searchParams: { type?: string }
}) {
  const type = searchParams.type === 'bug' ? 'bug' : 'contact'

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-3xl font-bold text-[#E07A5F]">
        {type === 'bug' ? '回報問題 / Bug report' : '聯絡我們 / Contact'}
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        {type === 'bug'
          ? 'Tell us what broke. A page link and what you expected helps.'
          : 'Questions, press, or a hello — we read every note.'}
      </p>
      <div className="mt-6">
        <FeedbackForm type={type} />
      </div>
    </main>
  )
}
