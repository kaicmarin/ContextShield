import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { useDemo } from '../../context/DemoContext'
import { getCustomer } from '../../mocks/people'
import { computeMetrics } from '../../services/metrics'
import { latestAssessment } from '../../services/present'
import { decisionTone } from '../../services/labels'
import { decisionMeta } from '../../services/riskModel'
import { IncidentStatusBadge, RiskBadge, StatusBadge } from '../../components/ui/Badge'
import { IdTag } from '../../components/ui/IdTag'
import { PageHeader } from '../../components/ui/Surface'
import { formatBRL, formatTime } from '../../utils/format'
import type { Decision } from '../../types/domain'

// a constante/variável decisions e atribui a ela o resultado da expressão desta linha.
const decisions: Decision[] = ['APPROVE', 'APPROVE_WITH_ALERT', 'REQUEST_CONTEXT', 'INTERVENE', 'BLOCK']
export function OverviewPage() {
  const { domain, intel, transactions, incidents } = useDemo()
  // Declara a constante/variável m e atribui a ela o resultado da expressão desta linha.
  const m = computeMetrics(domain, intel)
  // Declara a constante/variável queue e atribui a ela o resultado da expressão desta linha.
  const queue = transactions.filter((t) => ['CONTEXT_REQUIRED', 'INTERVENTION', 'BLOCKED'].includes(t.status) || latestAssessment(t)?.decision !== 'APPROVE').slice(0, 8)
  // Declara a constante/variável open e atribui a ela o resultado da expressão desta linha.
  const open = incidents.filter((i) => i.status !== 'CLOSED')

  // Declara a constante/variável kpis e atribui a ela o resultado da expressão desta linha.
  const kpis = [
    { label: 'Transações analisadas', value: m.total, sub: 'Universo desta demonstração — sem volume inventado' },
    { label: 'Aguardando o cliente', value: m.pendingCustomer, sub: 'Verificação contextual em aberto' },
    { label: 'Valor protegido', value: formatBRL(m.protectedAmount), sub: `${m.protectedCount} compras interrompidas ou bloqueadas` },
    { label: 'Incidentes abertos', value: m.openIncidents, sub: `${m.incidentsTotal} relatos no ambiente` },
  ]

  // Declara a constante/variável maxD e atribui a ela o resultado da expressão desta linha.
  const maxD = Math.max(1, ...decisions.map((d) => m.byDecision[d]))

  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <div>
      <PageHeader
        eyebrow="Operations"
        title="Overview"
        description="Números derivados das transações e incidentes desta demonstração."
      />

      
      <section className="grid gap-px overflow-hidden border-y border-line bg-line sm:grid-cols-2 xl:grid-cols-4" aria-label="Indicadores">
        {kpis.map((k) => (
          
          <div key={k.label} className="bg-paper px-5 py-6">
            
            <p className="text-[13px] text-muted">{k.label}</p>
            
            <p className="tabular mt-2 font-display text-[36px] font-semibold tracking-tight">{k.value}</p>
            
            <p className="mt-1 text-[13px] leading-snug text-subtle">{k.sub}</p>
          
          </div>
        ))}
      
      </section>

      
      <div className="mt-10 grid gap-10 xl:grid-cols-[1.5fr_1fr]">
        
        <section>
          
          <div className="mb-4 flex items-end justify-between gap-3">
            
            <div>
              
              <h2 className="font-display text-[20px] font-semibold">Fila de atenção</h2>
              
              <p className="text-[13px] text-muted">Verificação, intervenção ou relação com casos</p>
            
            </div>
            
            <Link to="/operations/transactions" className="text-[13px] text-muted hover:text-ink-900">
              Ver todas
            
            </Link>
          
          </div>
          
          <ul className="divide-y divide-line border-y border-line">
            {queue.map((t) => {
              const a = latestAssessment(t)
              return (
                
                <li key={t.id}>
                  
                  <Link to={`/operations/transactions/${t.id}`} className="grid grid-cols-[1fr_auto] items-center gap-3 py-3.5 hover:bg-canvas/80 sm:grid-cols-[168px_1fr_auto_auto]">
                    
                    <span className="id-tag text-ink-800">{t.id}</span>
                    
                    <span className="min-w-0 truncate text-[14px]">
                      {getCustomer(t.customerId)?.name} · <span className="tabular">{formatBRL(t.amount)}</span>
                    
                    </span>
                    
                    <span className="hidden sm:block">{a && <RiskBadge level={a.level} score={a.score} compact />}</span>
                    
                    <StatusBadge status={t.status} size="sm" />
                  
                  </Link>
                
                </li>
              )
            })}
            {open.slice(0, 3).map((i) => (
              
              <li key={i.id}>
                
                <Link to={`/operations/incidents/${i.id}`} className="flex flex-wrap items-center gap-3 py-3.5 hover:bg-canvas/80">
                  
                  <span className="id-tag">{i.id}</span>
                  
                  <span className="text-[14px]">Incidente · {getCustomer(i.customerId)?.name}</span>
                  
                  <span className="ml-auto">
                    
                    <IncidentStatusBadge status={i.status} />
                  
                  </span>
                
                </Link>
              
              </li>
            ))}
          
          </ul>
        
        </section>

        
        <section>
          
          <h2 className="font-display text-[20px] font-semibold">Decisões</h2>
          
          <p className="mt-1 text-[13px] text-muted">Distribuição das {m.total} transações analisadas</p>
          
          <ul className="mt-4 space-y-2">
            {decisions.map((d) => (
              
              <li key={d} className="grid grid-cols-[1fr_auto] items-center gap-3 text-[13px]">
                
                <span className="flex items-center gap-2">
                  
                  <span className="w-28 text-muted">{decisionMeta[d].label}</span>
                  
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                    
                    <span className={`block h-full bg-current ${decisionTone[d] === 'ok' ? 'text-ok' : decisionTone[d] === 'warn' ? 'text-warn' : decisionTone[d] === 'info' ? 'text-signal' : 'text-risk'}`} style={{ width: `${(m.byDecision[d] / maxD) * 100}%` }} />
                  
                  </span>
                
                </span>
                
                <span className="tabular w-6 text-right">{m.byDecision[d]}</span>
              
              </li>
            ))}
          
          </ul>
          
          <p className="mt-4 text-[12px] text-subtle">
            Robustez: {m.robustness.ROBUST} robustas · {m.robustness.FRAGILE} {m.robustness.FRAGILE === 1 ? 'frágil' : 'frágeis'} · {m.robustness.DEGRADED} {m.robustness.DEGRADED === 1 ? 'degradada' : 'degradadas'}.
          
          </p>
        
        </section>
      
      </div>

      
      <section className="mt-10">
        
        <div className="mb-3 flex items-end justify-between">
          
          <h2 className="font-display text-[20px] font-semibold">Atividade recente</h2>
          
          <Link to="/operations/audit" className="inline-flex items-center gap-1 text-[13px] text-muted hover:text-ink-900">
            Audit <ArrowUpRight className="h-3.5 w-3.5" />
          
          </Link>
        
        </div>
        
        <ul className="divide-y divide-line border-y border-line">
          {domain.events.slice(-8).reverse().map((e) => (
            
            <li key={e.id} className="flex flex-wrap items-center gap-3 py-2.5 text-[13px]">
              
              <span className="tabular w-[72px] font-mono text-[12px] text-muted">{formatTime(e.at)}</span>
              
              <span className="font-medium">{e.name}</span>
              
              <span className="text-muted">{e.service} · {e.result}</span>
              {e.correlationId && <IdTag value={e.correlationId} tone="trace" to={`/operations/timeline?c=${e.correlationId}`} />}
            
            </li>
          ))}
        
        </ul>
      
      </section>
    
    </div>
  )
}
