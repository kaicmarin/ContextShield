import type { ReactNode } from 'react'
import { AlertTriangle, CheckCircle2, Info, OctagonX, SearchX } from 'lucide-react'
import { toneClasses, type Tone } from '../../services/labels'
import { cx } from '../../utils/format'

// a constante/variável alertIcon e atribui a ela o resultado da expressão desta linha.
const alertIcon: Partial<Record<Tone, ReactNode>> = {
  info: <Info className="h-4 w-4" aria-hidden />,
  ok: <CheckCircle2 className="h-4 w-4" aria-hidden />,
  warn: <AlertTriangle className="h-4 w-4" aria-hidden />,
  risk: <OctagonX className="h-4 w-4" aria-hidden />,
  trace: <Info className="h-4 w-4" aria-hidden />,
  neutral: <Info className="h-4 w-4" aria-hidden />,
}
export function Alert({
  tone = 'info',
  title,
  children,
  action,
  className,
}: {
  tone?: Tone
  title?: ReactNode
  children?: ReactNode
  action?: ReactNode
  className?: string
}) {
  // Declara a constante/variável t e atribui a ela o resultado da expressão desta linha.
  const t = toneClasses[tone]
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <div role={tone === 'risk' ? 'alert' : 'status'} className={cx('flex gap-3 rounded-xl border p-4', t.soft, t.border, className)}>
      
      <span className={cx('mt-0.5 shrink-0', t.text)}>{alertIcon[tone]}</span>
      
      <div className="min-w-0 flex-1 text-[14px]">
        {title && <p className="font-medium text-ink-900">{title}</p>}
        {children && <div className={cx('text-ink-800/90', Boolean(title) && 'mt-0.5')}>{children}</div>}
        {action && <div className="mt-3">{action}</div>}
      
      </div>
    
    </div>
  )
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode
  title: string
  description?: ReactNode
  action?: ReactNode
  className?: string
}) {
  return (
    
    <div className={cx('flex flex-col items-center rounded-xl border border-dashed border-line-strong bg-paper/60 px-6 py-12 text-center', className)}>
      
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-canvas text-muted">
        {icon ?? <SearchX className="h-5 w-5" aria-hidden />}
      
      </div>
      
      <p className="font-display text-[16px] font-semibold text-ink-900">{title}</p>
      {description && <p className="mt-1.5 max-w-sm text-[14px] text-muted">{description}</p>}
      {action && <div className="mt-5 flex flex-wrap justify-center gap-2">{action}</div>}
    
    </div>
  )
}

export function ErrorState({ title, description, action }: { title: string; description?: ReactNode; action?: ReactNode }) {
  return (
    
    <div className="flex flex-col items-center rounded-xl border border-risk/20 bg-risk-soft/50 px-6 py-12 text-center" role="alert">
      
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-risk-soft text-risk">
        
        <OctagonX className="h-5 w-5" aria-hidden />
      
      </div>
      
      <p className="font-display text-[16px] font-semibold text-ink-900">{title}</p>
      {description && <p className="mt-1.5 max-w-sm text-[14px] text-muted">{description}</p>}
      {action && <div className="mt-5 flex flex-wrap justify-center gap-2">{action}</div>}
    
    </div>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return (
    
    <span className={cx('relative block overflow-hidden rounded-md bg-ink-900/[0.06]', className)} aria-hidden>
      
      <span className="absolute inset-0 -translate-x-full animate-scan bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    
    </span>
  )
}

export function Spinner({ label = 'Carregando', className }: { label?: string; className?: string }) {
  return (
    
    <span role="status" className={cx('inline-flex items-center gap-2 text-[13px] text-muted', className)}>
      
      <span className="relative h-4 w-4" aria-hidden>
        
        <span className="absolute inset-0 rounded-full border-2 border-line" />
        
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-signal" />
      
      </span>
      
      <span className="sr-only sm:not-sr-only">{label}</span>
    
    </span>
  )
}
