import type { ReactNode } from 'react'
import { AlertTriangle, Check, CircleDashed, HelpCircle, Link2, Minus, OctagonX, ShieldAlert } from 'lucide-react'
import type { IncidentStatus, RiskLevel, SignalState, TxStatus } from '../../types/domain'
import { incidentStatusLabel } from '../../mocks/incidents'
import { incidentStatusTone, riskMeta, signalMeta, toneClasses, txStatusMeta, type Tone } from '../../services/labels'
import { cx } from '../../utils/format'
export function Badge({
  tone = 'neutral',
  children,
  icon,
  className,
  size = 'md',
}: {
  tone?: Tone
  children: ReactNode
  icon?: ReactNode
  className?: string
  size?: 'sm' | 'md'
}) {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-full font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-0.5 text-xs',
        toneClasses[tone].chip,
        className,
      )}
    >
      {icon}
      {children}
    
    </span>
  )
}

const statusIcon: Record<TxStatus, ReactNode> = {
  RECEIVED: <CircleDashed className="h-3 w-3" aria-hidden />,
  ANALYZING: <CircleDashed className="h-3 w-3 animate-spin [animation-duration:2.4s]" aria-hidden />,
  CONTEXT_REQUIRED: <HelpCircle className="h-3 w-3" aria-hidden />,
  APPROVED: <Check className="h-3 w-3" aria-hidden />,
  APPROVED_WITH_ALERT: <AlertTriangle className="h-3 w-3" aria-hidden />,
  INTERVENTION: <ShieldAlert className="h-3 w-3" aria-hidden />,
  BLOCKED: <OctagonX className="h-3 w-3" aria-hidden />,
  CANCELLED: <Minus className="h-3 w-3" aria-hidden />,
  INCIDENT_RECORDED: <Link2 className="h-3 w-3" aria-hidden />,
}

export function StatusBadge({ status, audience = 'ops', size }: { status: TxStatus; audience?: 'ops' | 'client'; size?: 'sm' | 'md' }) {
  const meta = txStatusMeta[status]
  return (
    
    <Badge tone={meta.tone} icon={statusIcon[status]} size={size}>
      {audience === 'client' ? meta.client : meta.label}
    
    </Badge>
  )
}

export function RiskBadge({ level, score, compact }: { level: RiskLevel; score?: number; compact?: boolean }) {
  const meta = riskMeta[level]
  const color = toneClasses[meta.tone]
  return (
    
    <span className="inline-flex items-center gap-2 whitespace-nowrap">
      
      <span className="flex items-end gap-[2px]" aria-hidden>
        {[1, 2, 3, 4].map((b) => (
          <span
            key={b}
            className={cx('w-[3px] rounded-sm', b <= meta.bars ? color.dot : 'bg-line-strong')}
            style={{ height: 4 + b * 2.5 }}
          />
        ))}
      
      </span>
      {score !== undefined && <span className="tabular font-mono text-[12px] text-ink-900">{score}</span>}
      
      <span className={cx('text-[11px] font-semibold tracking-wide', color.text)}>{compact ? meta.short : `${meta.short} · ${meta.label}`}</span>
    
    </span>
  )
}

export function IncidentStatusBadge({ status }: { status: IncidentStatus }) {
  return <Badge tone={incidentStatusTone[status]}>{incidentStatusLabel[status]}</Badge>
}

export function SignalGlyph({ state, className }: { state: SignalState; className?: string }) {
  const base = 'inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full'
  if (state === 'ok')
    return (
      
      <span className={cx(base, 'bg-ok-soft text-ok', className)} title={signalMeta.ok.label}>
        
        <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
        
        <span className="sr-only">{signalMeta.ok.label}</span>
      
      </span>
    )
  if (state === 'attention')
    return (
      
      <span className={cx(base, 'bg-warn-soft text-warn', className)} title={signalMeta.attention.label}>
        
        <span className="text-[12px] font-bold leading-none" aria-hidden>!</span>
        
        <span className="sr-only">{signalMeta.attention.label}</span>
      
      </span>
    )
  return (
    
    <span className={cx(base, 'bg-risk text-white', className)} title={signalMeta.risk.label}>
      
      <span className="text-[12px] font-bold leading-none" aria-hidden>!</span>
      
      <span className="sr-only">{signalMeta.risk.label}</span>
    
    </span>
  )
}

export function Dot({ tone, pulse }: { tone: Tone; pulse?: boolean }) {
  return <span className={cx('inline-block h-1.5 w-1.5 rounded-full', toneClasses[tone].dot, pulse && 'animate-breathe')} aria-hidden />
}
