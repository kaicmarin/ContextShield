import type { ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { useDemo } from '../../context/DemoContext'
import { IDS } from '../../mocks/ids'
import { Button } from '../ui/Button'
import { cx } from '../../utils/format'
export function StageHeader({ n, title, lead, aside }: { n: number; title: string; lead: ReactNode; aside?: ReactNode }) {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <header className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      
      <div className="max-w-2xl">
        
        <p className="font-mono text-[12px] text-trace">Estágio {n}</p>
        
        <h1 className="mt-2 font-display text-[34px] font-semibold leading-tight tracking-[-0.025em] sm:text-[40px]">{title}</h1>
        
        <p className="mt-3 text-[15px] leading-relaxed text-white/65">{lead}</p>
      
      </div>
      {aside}
    
    </header>
  )
}

export function DarkPanel({ children, className, title, eyebrow }: { children: ReactNode; className?: string; title?: ReactNode; eyebrow?: ReactNode }) {
  return (
    
    <section className={cx('rounded-2xl border border-white/10 bg-white/[0.03] p-5', className)}>
      {eyebrow && <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">{eyebrow}</p>}
      {title && <h2 className="mb-4 font-display text-[15px] font-semibold text-white">{title}</h2>}
      {children}
    
    </section>
  )
}

export function EventEnvelope({ name, fields }: { name: string; fields: [string, ReactNode][] }) {
  return (
    
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-900">
      
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        
        <span className="font-mono text-[12px] text-trace">{name}</span>
        
        <span className="text-[10px] uppercase tracking-[0.12em] text-white/35">evento simulado</span>
      
      </div>
      
      <dl className="divide-y divide-white/[0.06] font-mono text-[12px]">
        {fields.map(([k, v]) => (
          
          <div key={k} className="grid grid-cols-[150px_1fr] gap-3 px-4 py-2">
            
            <dt className="text-white/40">{k}</dt>
            
            <dd className="break-words text-white/90">{v}</dd>
          
          </div>
        ))}
      
      </dl>
    
    </div>
  )
}

export function LockedStage({ title, description, action }: { title: string; description: string; action: ReactNode }) {
  return (
    
    <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-white/20 p-10 text-center">
      
      <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-white/60">
        
        <Lock className="h-5 w-5" aria-hidden />
      
      </span>
      
      <p className="mt-4 font-display text-[18px] font-semibold">{title}</p>
      
      <p className="mt-2 text-[14px] text-white/60">{description}</p>
      
      <div className="mt-6 flex flex-wrap justify-center gap-2">{action}</div>
    
    </div>
  )
}

export function CompleteStoryButton() {
  const { loadStory } = useDemo()
  return (
    
    <Button variant="inverse" onClick={loadStory}>
      Carregar história completa
    
    </Button>
  )
}

export function useStageTx() {
  const [params] = useSearchParams()
  const { getTx, transactions } = useDemo()
  const requested = params.get('tx')
  const fallback =
    transactions.find((t) => t.customerId === IDS.ana && t.scenario === 'induction') ??
    transactions.find((t) => t.customerId === IDS.ana && t.assessments.length > 0) ??
    transactions.find((t) => t.assessments.length > 0)
  const id = requested ?? fallback?.id
  const tx =
    getTx(id) ??
    (requested
      ? transactions.find((t) => t.customerId === IDS.mariana && t.scenario === 'related' && t.id === requested)
      : fallback)
  return { id, tx, initial: tx?.assessments[0], final: tx?.assessments.at(-1) }
}

export function MissingStageTx() {
  return (
    <LockedStage
      title="Esta compra ainda não aconteceu"
      description="A compra da Mariana só existe depois que o cenário “Nova compra relacionada” é executado na loja."
      action={
        <>
          
          <CompleteStoryButton />
          
          <Button variant="ghost" className="text-white/70 hover:bg-white/5" to="/store">
            Ir para a loja
          
          </Button>
        </>
      }
    />
  )
}
