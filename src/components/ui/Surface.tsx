import type { ReactNode } from 'react'
import { cx } from '../../utils/format'
export function Panel({
  children,
  className,
  padded = true,
  as: Tag = 'section',
  tone = 'paper',
}: {
  children: ReactNode
  className?: string
  padded?: boolean
  as?: 'section' | 'div' | 'article' | 'aside'
  tone?: 'paper' | 'muted' | 'dark'
}) {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    <Tag
      className={cx(
        'border',
        tone === 'paper' && 'border-line bg-paper',
        tone === 'muted' && 'border-line bg-canvas',
        tone === 'dark' && 'border-white/10 bg-ink-900 text-white',
        padded && 'p-5',
        className,
      )}
    >
      {children}
    
    </Tag>
  )
}

export function PanelHeader({
  title,
  eyebrow,
  action,
  description,
  className,
}: {
  title: ReactNode
  eyebrow?: ReactNode
  action?: ReactNode
  description?: ReactNode
  className?: string
}) {
  return (
    
    <div className={cx('mb-4 flex items-start justify-between gap-4', className)}>
      
      <div className="min-w-0">
        {eyebrow && <p className="eyebrow mb-1">{eyebrow}</p>}
        
        <h2 className="font-display text-[18px] font-semibold leading-snug text-ink-900">{title}</h2>
        {description && <p className="mt-1 text-[14px] text-muted">{description}</p>}
      
      </div>
      {action && <div className="shrink-0">{action}</div>}
    
    </div>
  )
}

export function KeyValue({
  items,
  columns = 1,
  dense,
}: {
  items: { label: string; value: ReactNode }[]
  columns?: 1 | 2 | 3
  dense?: boolean
}) {
  return (
    <dl
      className={cx(
        'grid gap-x-6',
        dense ? 'gap-y-2' : 'gap-y-3.5',
        columns === 2 && 'sm:grid-cols-2',
        columns === 3 && 'sm:grid-cols-2 lg:grid-cols-3',
      )}
    >
      {items.map((it) => (
        
        <div key={it.label} className="min-w-0">
          
          <dt className="text-[12px] text-subtle">{it.label}</dt>
          
          <dd className="mt-0.5 break-words text-[14px] text-ink-900">{it.value}</dd>
        
        </div>
      ))}
    
    </dl>
  )
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  meta,
}: {
  eyebrow?: ReactNode
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  meta?: ReactNode
}) {
  return (
    
    <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      
      <div className="min-w-0">
        {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
        
        <h1 className="font-display text-[28px] font-semibold leading-tight tracking-[-0.03em] text-ink-900 sm:text-[34px]">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-[16px] leading-relaxed text-muted">{description}</p>}
        {meta && <div className="mt-3 flex flex-wrap items-center gap-2">{meta}</div>}
      
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    
    </header>
  )
}

export function Divider({ className }: { className?: string }) {
  return <hr className={cx('border-0 border-t border-line', className)} />
}
