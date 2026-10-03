import { cx } from '../../utils/format'

type Tone = 'dark' | 'light'

export function ContextShieldMark({
  size = 32,
  className,
  tone = 'dark',
}: {
  size?: number
  className?: string
  tone?: Tone
}) {
  const outer = tone === 'light' ? '#E6EDF5' : '#0A1928'
  const inner = tone === 'light' ? '#5FC4D2' : '#0B9AAE'
  const core = tone === 'light' ? '#E6EDF5' : '#0A1928'
  const tip = tone === 'light' ? '#7EA2FF' : '#2F63F6'

  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <path d="M20 4.5H11.5A7 7 0 0 0 4.5 11.5v9a7 7 0 0 0 7 7h9a7 7 0 0 0 7-7V12" stroke={outer} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18 9.5h-4A4.5 4.5 0 0 0 9.5 14v4a4.5 4.5 0 0 0 4.5 4.5h4a4.5 4.5 0 0 0 4.5-4.5v-3.5" stroke={inner} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 16l9-9" stroke={inner} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="16" cy="16" r="2.4" fill={core} />
      <circle cx="25.6" cy="6.4" r="1.9" fill={tip} />
    </svg>
  )
}

export function ContextShieldLogo({
  className,
  tone = 'dark',
  sub,
}: {
  className?: string
  tone?: Tone
  sub?: string
}) {
  return (
    <span className={cx('inline-flex items-center gap-2.5', className)}>
      <ContextShieldMark size={32} tone={tone} />
      <span className="leading-none">
        <span className={cx('block font-display text-[16px] tracking-[-0.01em]', tone === 'light' ? 'text-white' : 'text-ink-900')}>
          <span className="font-medium">Context</span>
          <span className="font-semibold">Shield</span>
        </span>
        {sub && <span className={cx('mt-1 block text-[10px] font-medium uppercase tracking-[0.16em]', tone === 'light' ? 'text-white/50' : 'text-subtle')}>{sub}</span>}
      </span>
    </span>
  )
}

export function ProtectedBy({ tone = 'dark', className }: { tone?: Tone; className?: string }) {
  return (
    <span className={cx('inline-flex items-center gap-1.5 text-[12px]', tone === 'light' ? 'text-white/70' : 'text-muted', className)}>
      Protected by ContextShield
    </span>
  )
}

export function NexaLogo({ className, light }: { className?: string; light?: boolean }) {
  return (
    <span className={cx('inline-flex items-center gap-2', className)} aria-label="NEXA">
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
        <rect x="1" y="1" width="20" height="20" rx="5" fill={light ? '#fff' : '#161616'} />
        <path d="M6.5 15.5v-9l9 9v-9" stroke={light ? '#161616' : '#F3EFE9'} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
      <span className={cx('font-display text-[19px] font-semibold tracking-[0.14em]', light ? 'text-white' : 'text-nexa-char')}>NEXA</span>
    </span>
  )
}

export function AureonLogo({ className, light }: { className?: string; light?: boolean }) {
  return (
    <span className={cx('inline-flex items-center gap-2', className)} aria-label="Aureon">
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
        <circle cx="11" cy="11" r="10" fill={light ? '#fff' : '#0E2233'} />
        <path d="M6 16 11 5.5 16 16" stroke={light ? '#0E2233' : '#E9DCC4'} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M8.2 12.5h5.6" stroke="#A88A5A" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
      <span className={cx('font-display text-[17px] font-semibold tracking-[-0.01em]', light ? 'text-white' : 'text-aureon-deep')}>Aureon</span>
    </span>
  )
}
