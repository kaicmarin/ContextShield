import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import { useDemo } from '../../context/DemoContext'
import { IDS } from '../../mocks/ids'
import { cx } from '../../utils/format'
export interface StoryStep {
  id: string
  who: string
  title: string
  to: string
  done: boolean
}
export function useStorySteps(): StoryStep[] {
  const { transactions, incidents, intel } = useDemo()
  // Declara a constante/variável ana e atribui a ela o resultado da expressão desta linha.
  const ana = transactions.find((t) => t.customerId === IDS.ana && t.scenario === 'induction')
  // Declara a constante/variável anaDecided e atribui a ela o resultado da expressão desta linha.
  const anaDecided = Boolean(ana && ana.status !== 'RECEIVED' && ana.status !== 'ANALYZING')
  // Declara a constante/variável report e atribui a ela o resultado da expressão desta linha.
  const report = incidents.find((i) => i.customerId === IDS.ana && i.closedAs !== 'not-scam')
  // Declara a constante/variável related e atribui a ela o resultado da expressão desta linha.
  const related = Boolean(report && (intel.incidentEntities.get(report.id) ?? []).some((e) => intel.entity(e)?.kind === 'destination'))
  // Declara a constante/variável mariana e atribui a ela o resultado da expressão desta linha.
  const mariana = transactions.find((t) => t.customerId === IDS.mariana && t.scenario === 'related')
  // Declara a constante/variável marianaDecided e atribui a ela o resultado da expressão desta linha.
  const marianaDecided = Boolean(mariana && mariana.status !== 'RECEIVED' && mariana.status !== 'ANALYZING')
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return [
    { id: 'ana', who: 'Ana', title: 'Compra orientada é pausada', to: ana ? `/operations/transactions/${ana.id}` : '/demo', done: anaDecided },
    { id: 'report', who: 'Ana', title: 'Relata em “Fui vítima”', to: report ? `/operations/incidents/${report.id}` : '/security/report', done: Boolean(report) },
    { id: 'intel', who: 'Intelligence', title: 'Destino e contato relacionados', to: '/operations/intelligence', done: related },
    { id: 'mariana', who: 'Mariana', title: 'Nova compra para o mesmo destino', to: mariana ? `/operations/transactions/${mariana.id}` : '/demo', done: marianaDecided },
  ]
}
export function CycleTracker({ variant = 'list', dark }: { variant?: 'list' | 'rail'; dark?: boolean }) {
  // Declara a constante/variável steps e atribui a ela o resultado da expressão desta linha.
  const steps = useStorySteps()
  // Declara a constante/variável next e atribui a ela o resultado da expressão desta linha.
  const next = steps.find((s) => !s.done)

  // Verifica a condição antes de executar o bloco seguinte.
  if (variant === 'rail') {
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return (
      
      <ol className="scrollbar-thin flex items-stretch overflow-x-auto" aria-label="Progresso da história">
        {steps.map((s, i) => (
          
          <li key={s.id} className="flex min-w-[160px] flex-1 items-stretch">
            <Link
              to={s.to}
              className={cx(
                'group flex flex-1 flex-col rounded-lg border px-3 py-2.5 transition-colors',
                s.done
                  ? dark
                    ? 'border-trace/40 bg-trace/10'
                    : 'border-trace/30 bg-trace-soft'
                  : next?.id === s.id
                    ? dark
                      ? 'border-white/40 bg-white/5'
                      : 'border-ink-900 bg-paper'
                    : dark
                      ? 'border-white/10'
                      : 'border-line bg-paper',
              )}
            >
              
              <span className={cx('flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.1em]', dark ? 'text-white/50' : 'text-subtle')}>
                {s.done ? <Check className="h-3 w-3 text-trace" strokeWidth={3} aria-hidden /> : <span className="tabular">{i + 1}</span>}
                {s.who}
              
              </span>
              
              <span className={cx('mt-1 text-[13px] font-medium leading-snug group-hover:underline', dark ? 'text-white' : 'text-ink-900')}>{s.title}</span>
              
              <span className="sr-only">{s.done ? '(concluído)' : '(pendente)'}</span>
            
            </Link>
            {i < steps.length - 1 && (
              
              <span className="flex w-5 shrink-0 items-center justify-center" aria-hidden>
                
                <ArrowRight className={cx('h-3.5 w-3.5', dark ? 'text-white/30' : 'text-subtle')} />
              
              </span>
            )}
          
          </li>
        ))}
      
      </ol>
    )
  }

  return (
    
    <ol className="space-y-1" aria-label="Progresso da história">
      {steps.map((s, i) => (
        
        <li key={s.id}>
          
          <Link to={s.to} className={cx('group flex items-center gap-3 rounded-lg px-2 py-1.5', dark ? 'hover:bg-white/5' : 'hover:bg-canvas')}>
            <span
              className={cx(
                'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold',
                s.done ? 'bg-trace text-white' : next?.id === s.id ? (dark ? 'border-2 border-white text-white' : 'border-2 border-ink-900 text-ink-900') : dark ? 'border border-white/25 text-white/50' : 'border border-line-strong text-subtle',
              )}
              aria-hidden
            >
              {s.done ? <Check className="h-3 w-3" strokeWidth={3} /> : i + 1}
            
            </span>
            
            <span className="min-w-0 flex-1">
              
              <span className={cx('block text-[11px]', dark ? 'text-white/45' : 'text-subtle')}>{s.who}</span>
              
              <span className={cx('block text-[13px] leading-tight group-hover:underline', s.done ? (dark ? 'text-white' : 'text-ink-900') : dark ? 'text-white/65' : 'text-muted')}>{s.title}</span>
            
            </span>
            
            <span className="sr-only">{s.done ? 'concluído' : 'pendente'}</span>
          
          </Link>
        
        </li>
      ))}
    
    </ol>
  )
}
