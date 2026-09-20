export function SkyBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute -top-32 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,#9ED8E6_0%,#FAF6F0_68%)] opacity-80 blur-2xl" />
      <div className="absolute right-[-6rem] top-16 hidden h-80 w-56 -rotate-6 rounded-[50%] border-[14px] border-white/70 bg-[linear-gradient(180deg,#7EB6D9_0%,#F7E7D0_55%,#E07A5F_100%)] opacity-50 shadow-2xl lg:block" />
      <div className="absolute bottom-24 left-[8%] h-24 w-24 rounded-full bg-[#E07A5F]/10 blur-2xl" />
      <div className="absolute right-[18%] top-28 h-16 w-16 rounded-full bg-[#7ECCC4]/20 blur-xl" />
      <svg className="absolute bottom-10 left-6 opacity-[0.07]" width="90" height="90" viewBox="0 0 100 100">
        <ellipse cx="50" cy="68" rx="22" ry="16" fill="#E07A5F" />
        <ellipse cx="28" cy="42" rx="12" ry="10" fill="#E07A5F" />
        <ellipse cx="50" cy="32" rx="12" ry="10" fill="#E07A5F" />
        <ellipse cx="72" cy="42" rx="12" ry="10" fill="#E07A5F" />
      </svg>
    </div>
  )
}
