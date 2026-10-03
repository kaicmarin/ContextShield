import { Link, useParams } from 'react-router-dom'
import { useDemo } from '../../context/DemoContext'
import { getAddress, getCard, getCustomer, getDevice } from '../../mocks/people'
import { getMerchant } from '../../mocks/merchants'
import { latestAssessment, initialAssessment, txTitle } from '../../services/present'
import { certificate } from '../../services/robustness'
import { robustnessMeta, associationMeta, entityKindLabel } from '../../services/labels'
import { sourceSpec, decisionMeta } from '../../services/riskModel'
import { Badge, RiskBadge, StatusBadge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { ErrorState } from '../../components/ui/Feedback'
import { IdTag } from '../../components/ui/IdTag'
import { Breadcrumbs } from '../../components/ui/Navigation'
import { RiskMeter } from '../../components/ui/RiskMeter'
import { KeyValue, PageHeader } from '../../components/ui/Surface'
import { formatBRL, formatDateTime } from '../../utils/format'
export function OpsTransactionDetailPage() {
  const { id = '' } = useParams()
  const { getTx, incidents, domain } = useDemo()
  // Declara a constante/variável tx e atribui a ela o resultado da expressão desta linha.
  const tx = getTx(id)

  // Verifica a condição antes de executar o bloco seguinte.
  if (!tx) {
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return (
      <ErrorState
        title="Transação não encontrada"
        description={`Não há transação ${id || 'informada'} nesta demonstração.`}
        action={<Button variant="secondary" to="/operations/transactions">Ver transações</Button>}
      />
    )
  }

  const final = latestAssessment(tx)
  const initial = initialAssessment(tx)
  const customer = getCustomer(tx.customerId)
  const card = getCard(tx.cardId)
  const merchant = getMerchant(tx.merchantId)
  const device = getDevice(tx.deviceId)
  const address = getAddress(tx.addressId)
  const incident = incidents.find((i) => i.txId === tx.id)
  const cert = final ? certificate(final, domain.config) : undefined
  const related = final?.relations ?? []

  return (
    
    <div>
      
      <Breadcrumbs items={[{ label: 'Transactions', to: '/operations/transactions' }, { label: tx.id }]} />
      <PageHeader
        eyebrow="Transaction detail"
        title={
          
          <span className="flex flex-wrap items-center gap-3">
            
            <span className="font-mono text-[24px]">{tx.id}</span>
            
            <StatusBadge status={tx.status} />
          
          </span>
        }
        description={`${customer?.name ?? 'Cliente'} · ${txTitle(tx)} · ${formatBRL(tx.amount)} · ${formatDateTime(tx.createdAt)}`}
        meta={
          <>
            
            <IdTag value={tx.correlationId} tone="trace" copy />
            {tx.orderId && <IdTag value={tx.orderId} />}
          </>
        }
        actions={
          <>
            
            <Button size="sm" variant="secondary" to={`/operations/evidence?tx=${tx.id}`}>Evidence</Button>
            
            <Button size="sm" variant="secondary" to={`/operations/independence/${tx.id}`}>Independência</Button>
            
            <Button size="sm" variant="secondary" to={`/operations/fragility/${tx.id}`}>Fragilidade</Button>
            
            <Button size="sm" variant="secondary" to={`/operations/timeline?c=${tx.correlationId}`}>Timeline</Button>
          </>
        }
      />

      {final && (
        
        <section className="border-y border-line py-6">
          
          <div className="flex flex-wrap items-end justify-between gap-3">
            
            <div>
              
              <h2 className="font-display text-[18px] font-semibold">Risco e decisão</h2>
              
              <p className="text-[13px] text-muted">{final.ruleId} — {final.ruleText}</p>
            
            </div>
            
            <RiskBadge level={final.level} score={final.score} />
          
          </div>
          
          <div className="mt-4 max-w-xl">
            
            <RiskMeter initial={initial} final={final} />
          
          </div>
          
          <dl className="mt-5 grid grid-cols-2 gap-4 text-[13px] sm:grid-cols-4">
            
            <div>
              
              <dt className="text-subtle">Decisão</dt>
              
              <dd>{decisionMeta[final.decision].label}</dd>
            
            </div>
            
            <div>
              
              <dt className="text-subtle">Confiança</dt>
              
              <dd className="tabular font-mono">{final.confidence}%</dd>
            
            </div>
            
            <div>
              
              <dt className="text-subtle">Motor</dt>
              
              <dd>{final.engine}</dd>
            
            </div>
            
            <div>
              
              <dt className="text-subtle">Robustez</dt>
              
              <dd>{cert ? robustnessMeta[cert.status].label : '—'}</dd>
            
            </div>
          
          </dl>
        
        </section>
      )}

      
      <div className="mt-8 grid gap-10 xl:grid-cols-[1fr_320px]">
        
        <div className="space-y-8">
          
          <section>
            
            <h2 className="font-display text-[18px] font-semibold">Sinais</h2>
            
            <ul className="mt-3 divide-y divide-line border-y border-line">
              {(final?.signals ?? []).map((s) => (
                
                <li key={s.id} className="flex flex-wrap items-start justify-between gap-3 py-3">
                  
                  <div className="min-w-0">
                    
                    <p className="text-[14px] font-medium">{s.label}</p>
                    
                    <p className="text-[13px] text-muted">{s.detail}</p>
                    
                    <p className="mt-0.5 text-[11px] text-subtle">{sourceSpec(s.source).label}{s.discounted ? ' · descontado por dependência' : ''}</p>
                  
                  </div>
                  
                  <span className="tabular font-mono text-[13px]">{s.points > 0 ? `+${s.points}` : s.points}</span>
                
                </li>
              ))}
            
            </ul>
          
          </section>
          {related.length > 0 && (
            
            <section>
              
              <h2 className="font-display text-[18px] font-semibold">Relações com relatos</h2>
              
              <ul className="mt-3 space-y-2">
                {related.map((r) => (
                  
                  <li key={r.entityId}>
                    
                    <Link to={`/operations/intelligence/${r.entityId}`} className="flex items-center justify-between gap-3 border-y border-line py-3 hover:bg-canvas/80">
                      
                      <span>
                        
                        <span className="block text-[11px] text-subtle">{entityKindLabel[r.kind]}</span>
                        
                        <span className="text-[14px] font-medium">{r.value}</span>
                        
                        <span className="block text-[12px] text-muted">{r.reason}</span>
                      
                      </span>
                      
                      <Badge tone={associationMeta[r.association].tone} size="sm">{r.association}</Badge>
                    
                    </Link>
                  
                  </li>
                ))}
              
              </ul>
            
            </section>
          )}
        
        </div>
        
        <aside className="space-y-6 border-t border-line pt-6 xl:border-l xl:border-t-0 xl:pl-8 xl:pt-0">
          <KeyValue
            items={[
              { label: 'Cliente', value: customer?.name ?? '—' },
              { label: 'Cartão', value: card ? `${card.product} •••• ${card.last4}` : '—' },
              { label: 'Estabelecimento', value: merchant?.name ?? '—' },
              { label: 'Dispositivo', value: device?.detail ?? '—' },
              { label: 'Entrega', value: address ? `${address.line1} · ${address.city}` : '—' },
              { label: 'Incidente', value: incident ? incident.id : 'Nenhum' },
            ]}
          />
          {incident && (
            
            <Button size="sm" variant="secondary" to={`/operations/incidents/${incident.id}`}>
              Abrir incidente
            
            </Button>
          )}
        
        </aside>
      
      </div>
    
    </div>
  )
}
