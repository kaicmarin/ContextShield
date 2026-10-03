import { useSearchParams } from 'react-router-dom'
import { useDemo } from '../../context/DemoContext'
import { getCustomer } from '../../mocks/people'
import type { EventLane } from '../../types/domain'
import { EmptyState } from '../../components/ui/Feedback'
import { Select } from '../../components/ui/Form'
import { IdTag } from '../../components/ui/IdTag'
import { PageHeader } from '../../components/ui/Surface'
import { formatDate, formatTime, plural } from '../../utils/format'

// a constante/variável lanes e atribui a ela o resultado da expressão desta linha.
export function TimelinePage() {
  const { domain, transactions, incidents } = useDemo()
  const lanes: EventLane[] = ['Checkout', 'Cliente', 'Intelligence', 'Operations']
  const [params, setParams] = useSearchParams()
  // Declara a constante/variável correlationOptions e atribui a ela o resultado da expressão desta linha.
  const correlationOptions = [
    ...transactions.filter((t) => t.correlationId).map((t) => ({ id: t.correlationId, who: getCustomer(t.customerId)?.firstName ?? t.customerId })),
    ...incidents.filter((i) => i.correlationId && !transactions.some((t) => t.correlationId === i.correlationId)).map((i) => ({ id: i.correlationId as string, who: `${getCustomer(i.customerId)?.firstName} · incidente` })),
  ]
  // Declara a constante/variável c e atribui a ela o resultado da expressão desta linha.
  const c = params.get('c') ?? correlationOptions[0]?.id ?? ''
  // Declara a constante/variável events e atribui a ela o resultado da expressão desta linha.
  const events = domain.events.filter((e) => e.correlationId === c).sort((a, b) => (a.at < b.at ? -1 : a.at > b.at ? 1 : 0))
  // Declara a constante/variável tx e atribui a ela o resultado da expressão desta linha.
  const tx = transactions.find((t) => t.correlationId === c)
  // Declara a constante/variável orphan e atribui a ela o resultado da expressão desta linha.
  const orphan = incidents.find((i) => i.correlationId === c)

  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <div>
      <PageHeader
        eyebrow="Operations"
        title="Timeline"
        description="Eventos ligados a um mesmo correlation ID, do checkout à inteligência."
        actions={
          
          <Select aria-label="Correlation ID" value={c} onChange={(e) => setParams({ c: e.target.value }, { replace: true })} className="w-auto min-w-[300px] font-mono text-[12px]">
            {!correlationOptions.some((o) => o.id === c) && <option value={c}>{c}</option>}
            {correlationOptions.map((o) => (
              
              <option key={o.id} value={o.id}>
                {o.id} · {o.who}
              
              </option>
            ))}
          
          </Select>
        }
        meta={
          events.length > 0 && (
            <>
              
              <IdTag value={c} tone="trace" copy />
              {tx && <IdTag value={tx.id} to={`/operations/transactions/${tx.id}`} />}
              {orphan && <IdTag value={orphan.id} to={`/operations/incidents/${orphan.id}`} />}
              
              <span className="text-[12px] text-muted">{plural(events.length, 'evento', 'eventos')} · {formatDate(events[0]?.at)}</span>
            </>
          )
        }
      />

      {events.length === 0 ? (
        
        <EmptyState title="Correlation ID não encontrado" description="Escolha outro ID na lista acima." />
      ) : (
        
        <div className="overflow-x-auto scrollbar-thin">
          
          <div className="min-w-[1040px]">
            
            <div className="grid grid-cols-[92px_repeat(5,minmax(0,1fr))] border-y border-line">
              
              <span className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-subtle">Hora</span>
              {lanes.map((l) => (
                
                <span key={l} className="border-l border-line px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-subtle">
                  {l}
                
                </span>
              ))}
            
            </div>
            {events.map((e) => (
              
              <div key={e.id} className="grid grid-cols-[92px_repeat(5,minmax(0,1fr))] border-b border-line text-[13px]">
                
                <span className="tabular px-3 py-3 font-mono text-[12px] text-muted">{formatTime(e.at)}</span>
                {lanes.map((l) => (
                  
                  <div key={l} className="border-l border-line px-3 py-3">
                    {e.lane === l && (
                      
                      <div>
                        
                        <p className="font-medium">{e.name}</p>
                        
                        <p className="mt-0.5 text-[12px] text-muted">{e.action} · {e.result}</p>
                        
                        <p className="mt-0.5 text-[11px] text-subtle">{e.service} · {e.actor}</p>
                      
                      </div>
                    )}
                  
                  </div>
                ))}
              
              </div>
            ))}
          
          </div>
        
        </div>
      )}
    
    </div>
  )
}
