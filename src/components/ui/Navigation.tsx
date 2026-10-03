import { Fragment, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Check, ChevronRight } from 'lucide-react'
import { cx } from '../../utils/format'
export function Breadcrumbs({ items, className }: { items: { label: string; to?: string }[]; className?: string }) {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <nav aria-label="Você está em" className={cx('mb-4 text-[13px]', className)}>
      
      <ol className="flex flex-wrap items-center gap-1 text-muted">
        {items.map((it, i) => (
          
          <Fragment key={it.label + i}>
            
            <li className="min-w-0">
              {it.to ? (
                
                <Link to={it.to} className="rounded hover:text-ink-900 hover:underline">
                  {it.label}
                
                </Link>
              ) : (
                
                <span className="text-ink-900" aria-current="page">
                  {it.label}
                
                </span>
              )}
            
            </li>
            {i < items.length - 1 && (
              
              <li aria-hidden>
                
                <ChevronRight className="h-3.5 w-3.5 text-subtle" />
              
              </li>
            )}
          
          </Fragment>
        ))}
      
      </ol>
    
    </nav>
  )
}

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  className,
  label,
}: {
  tabs: { id: T; label: ReactNode; count?: number }[]
  value: T
  onChange: (id: T) => void
  className?: string
  label: string
}) {
  return (
    
    <div role="tablist" aria-label={label} className={cx('scrollbar-thin flex gap-1 overflow-x-auto border-b border-line', className)}>
      {tabs.map((t) => {
        const active = t.id === value
        return (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(t.id)}
            className={cx(
              '-mb-px inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-[13px] font-medium transition-colors',
              active ? 'border-ink-900 text-ink-900' : 'border-transparent text-muted hover:text-ink-900',
            )}
          >
            {t.label}
            {t.count !== undefined && (
              
              <span className={cx('rounded-full px-1.5 text-[11px] tabular', active ? 'bg-ink-900 text-white' : 'bg-ink-900/[0.06] text-muted')}>
                {t.count}
              
              </span>
            )}
          
          </button>
        )
      })}
    
    </div>
  )
}

export function Stepper({
  steps,
  current,
  tone = 'default',
}: {
  steps: string[]
  current: number
  tone?: 'default' | 'store'
}) {
  const doneColor = tone === 'store' ? 'bg-nexa-char text-white' : 'bg-ink-900 text-white'
  return (
    
    <ol className="flex w-full items-center" aria-label="Etapas">
      {steps.map((s, i) => {
        const done = i < current
        const active = i === current
        return (
          
          <li key={s} className={cx('flex items-center', i < steps.length - 1 && 'flex-1')} aria-current={active ? 'step' : undefined}>
            
            <span className="flex items-center gap-2">
              <span
                className={cx(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold tabular transition-colors',
                  done && doneColor,
                  active && 'border-2 border-ink-900 bg-white text-ink-900',
                  !done && !active && 'border border-line-strong bg-white text-subtle',
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden /> : i + 1}
              
              </span>
              
              <span className={cx('hidden text-[13px] sm:inline', active ? 'font-medium text-ink-900' : 'text-muted')}>{s}</span>
            
            </span>
            {i < steps.length - 1 && <span className={cx('mx-3 h-px flex-1', done ? 'bg-ink-900' : 'bg-line-strong')} aria-hidden />}
          
          </li>
        )
      })}
    
    </ol>
  )
}
