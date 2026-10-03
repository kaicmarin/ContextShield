import type { ReactNode } from 'react'
import { toneClasses, type Tone } from '../../services/labels'
import { cx } from '../../utils/format'
export interface TraceItem {
  id: string
  time?: string
  title: ReactNode
  detail?: ReactNode
  meta?: ReactNode
  tone?: Tone
  state?: 'done' | 'current' | 'pending'
}
export function Trace({ items, dense, dark }: { items: TraceItem[]; dense?: boolean; dark?: boolean }) {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <ol className="relative">
      {items.map((it, i) => {
        const tone = it.tone ?? 'neutral'
        const state = it.state ?? 'done'
        const last = i === items.length - 1
        return (
          
          <li key={it.id} className={cx('relative flex gap-4', !last && (dense ? 'pb-4' : 'pb-6'))}>
            {it.time !== undefined && (
              
              <span className={cx('tabular w-[64px] shrink-0 pt-[1px] text-right font-mono text-[12px]', dark ? 'text-white/50' : 'text-subtle')}>{it.time}</span>
            )}
            
            <span className="relative flex w-3 shrink-0 justify-center" aria-hidden>
              {!last && (
                <span
                  className={cx(
                    'absolute top-4 h-[calc(100%+0.25rem)] w-px',
                    state === 'pending' ? (dark ? 'bg-white/10' : 'bg-line') : dark ? 'bg-white/25' : 'bg-line-strong',
                  )}
                />
              )}
              <span
                className={cx(
                  'relative mt-[5px] h-3 w-3 rounded-full border-2 transition-all',
                  state === 'pending' && (dark ? 'border-white/20 bg-transparent' : 'border-line-strong bg-paper'),
                  state === 'done' && cx('border-transparent', toneClasses[tone].dot),
                  state === 'current' && cx('scale-110 border-transparent ring-4', toneClasses[tone].dot, dark ? 'ring-white/10' : 'ring-signal/15'),
                )}
              />
            
            </span>
            
            <div className={cx('min-w-0 flex-1', state === 'pending' && 'opacity-50')}>
              
              <div className={cx('text-[14px] font-medium leading-snug', dark ? 'text-white' : 'text-ink-900')}>{it.title}</div>
              {it.detail && <div className={cx('mt-0.5 text-[13px] leading-snug', dark ? 'text-white/60' : 'text-muted')}>{it.detail}</div>}
              {it.meta && <div className="mt-1.5 flex flex-wrap items-center gap-2">{it.meta}</div>}
            
            </div>
          
          </li>
        )
      })}
    
    </ol>
  )
}
