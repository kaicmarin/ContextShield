import type { ReactNode } from 'react'
import { BadgeCheck, OctagonAlert, TriangleAlert } from 'lucide-react'
import { trafficMeta, type Traffic } from '../../services/labels'
import { cx } from '../../utils/format'

// a constante/variável style e atribui a ela o resultado da expressão desta linha.
const style: Record<Traffic, { box: string; icon: ReactNode; lamp: string }> = {
  GREEN: { box: 'border-ok/30 bg-ok-soft', icon: <BadgeCheck className="h-5 w-5 text-ok" aria-hidden />, lamp: 'bg-ok' },
  YELLOW: { box: 'border-warn/30 bg-warn-soft', icon: <TriangleAlert className="h-5 w-5 text-warn" aria-hidden />, lamp: 'bg-warn' },
  RED: { box: 'border-risk/30 bg-risk-soft', icon: <OctagonAlert className="h-5 w-5 text-risk" aria-hidden />, lamp: 'bg-risk' },
}
export function TrafficLight({ level }: { level: Traffic }) {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-2.5 py-1 text-[12px] font-semibold text-ink-900">
      
      <span className="flex gap-1" aria-hidden>
        {(['GREEN', 'YELLOW', 'RED'] as const).map((l) => (
          
          <span key={l} className={cx('h-2 w-2 rounded-full', l === level ? style[l].lamp : 'bg-ink-900/10')} />
        ))}
      
      </span>
      {trafficMeta[level].label}
    
    </span>
  )
}

export function TrafficPanel({ level, title, summary, children }: { level: Traffic; title: string; summary?: string; children?: ReactNode }) {
  const s = style[level]
  return (
    
    <section className={cx('animate-rise rounded-2xl border p-5', s.box)} aria-live="polite">
      
      <TrafficLight level={level} />
      
      <div className="mt-3 flex items-start gap-3">
        {s.icon}
        
        <div className="min-w-0 flex-1">
          
          <h2 className="font-display text-[18px] font-semibold text-ink-900">{title}</h2>
          {summary && <p className="mt-1 text-[14px] leading-relaxed text-ink-800/85">{summary}</p>}
        
        </div>
      
      </div>
      {children}
    
    </section>
  )
}
