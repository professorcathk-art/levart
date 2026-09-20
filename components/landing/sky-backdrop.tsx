export function SkyBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#E7F3F1_0%,#FAF6F0_58%)]" />
      <div className="absolute left-1/2 top-[-8rem] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(224,122,95,0.16)_0%,transparent_68%)] blur-2xl" />
      <svg
        className="absolute left-1/2 top-6 h-[30rem] w-[30rem] -translate-x-1/2 opacity-[0.11]"
        viewBox="0 0 400 400"
      >
        <circle cx="200" cy="200" r="168" fill="none" stroke="#2B2D42" strokeWidth="1.2" />
        <circle cx="200" cy="200" r="118" fill="none" stroke="#2B2D42" strokeWidth="1" />
        <circle cx="200" cy="200" r="68" fill="none" stroke="#2B2D42" strokeWidth="1" />
        <ellipse cx="200" cy="200" rx="168" ry="58" fill="none" stroke="#2B2D42" strokeWidth="1" />
        <ellipse cx="200" cy="200" rx="40" ry="168" fill="none" stroke="#2B2D42" strokeWidth="1" />
        <path
          d="M48 228 C 110 150, 190 150, 250 188 S 330 250, 352 214"
          fill="none"
          stroke="#E07A5F"
          strokeWidth="2.4"
          strokeDasharray="7 9"
        />
        <circle cx="86" cy="196" r="5" fill="#E07A5F" />
        <circle cx="248" cy="188" r="5" fill="#7ECCC4" />
        <circle cx="338" cy="228" r="5" fill="#2B2D42" />
      </svg>
      <div className="absolute bottom-16 left-[10%] h-28 w-28 rounded-full bg-[#E07A5F]/10 blur-2xl" />
      <div className="absolute right-[14%] top-24 h-20 w-20 rounded-full bg-[#7ECCC4]/20 blur-xl" />
      <svg className="absolute bottom-8 left-8 opacity-[0.06]" width="88" height="88" viewBox="0 0 100 100">
        <ellipse cx="50" cy="68" rx="22" ry="16" fill="#E07A5F" />
        <ellipse cx="28" cy="42" rx="12" ry="10" fill="#E07A5F" />
        <ellipse cx="50" cy="32" rx="12" ry="10" fill="#E07A5F" />
        <ellipse cx="72" cy="42" rx="12" ry="10" fill="#E07A5F" />
      </svg>
    </div>
  )
}
