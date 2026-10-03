import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import type { Transaction } from '../../types/domain'
import { useDemo } from '../../context/DemoContext'
import { addressLine, getAddress, getCard, getDevice } from '../../mocks/people'
import { clientSignals } from '../../services/risk'
import { latestAssessment, txMerchantLabel, txTitle } from '../../services/present'
import { isAwaitingCustomer } from '../../services/status'
import { txStatusMeta } from '../../services/labels'
import { NotThisAccount, PurchaseRow, SecTitle, protectionSummary, useViewerData } from '../../components/security/SecurityParts'
import { SignalGlyph, StatusBadge } from '../../components/ui/Badge'
import { Breadcrumbs, Tabs } from '../../components/ui/Navigation'
import { EmptyState } from '../../components/ui/Feedback'
import { Input, Select } from '../../components/ui/Form'
import { KeyValue } from '../../components/ui/Surface'
import { Button } from '../../components/ui/Button'
import { addSeconds, formatBRL, formatDateTime, installmentText } from '../../utils/format'

// um tipo/interface TypeScript. Esta parte serve para tipagem em desenvolvimento e não vira lógica JavaScript em runtime.
type Filter = 'all' | 'pending' | 'alert' | 'stopped'
// um tipo/interface TypeScript. Esta parte serve para tipagem em desenvolvimento e não vira lógica JavaScript em runtime.
type Period = '7' | '30' | '90' | 'all'

// a constante/variável periods e atribui a ela o resultado da expressão desta linha.
const periods: { id: Period; label: string }[] = [
  { id: '7', label: 'Últimos 7 dias' },
  { id: '30', label: 'Últimos 30 dias' },
  { id: '90', label: 'Últimos 90 dias' },
  { id: 'all', label: 'Todo o histórico' },
]

// a constante/variável isStopped e atribui a ela o resultado da expressão desta linha.
const isStopped = (t: Transaction) => t.status === 'CANCELLED' || t.status === 'BLOCKED'
// a constante/variável hasAlert e atribui a ela o resultado da expressão desta linha.
const hasAlert = (t: Transaction) => t.status === 'APPROVED_WITH_ALERT' || t.status === 'INCIDENT_RECORDED'
export function SecurityTransactionsPage() {
  const { now } = useDemo()
  const { mine, card } = useViewerData()
  const [filter, setFilter] = useState<Filter>('all')
  const [period, setPeriod] = useState<Period>('90')
  const [q, setQ] = useState('')

  // Declara a constante/variável from e atribui a ela o resultado da expressão desta linha.
  const from = period === 'all' ? '' : addSeconds(now, -Number(period) * 86_400)
  // Declara a constante/variável term e atribui a ela o resultado da expressão desta linha.
  const term = q.trim().toLowerCase()
  // Declara a constante/variável inScope e atribui a ela o resultado da expressão desta linha.
  const inScope = mine.filter((t) => t.createdAt >= from && (!term || `${txMerchantLabel(t)} ${txTitle(t)}`.toLowerCase().includes(term)))
  // Declara a constante/variável list e atribui a ela o resultado da expressão desta linha.
  const list = inScope.filter((t) => (filter === 'pending' ? isAwaitingCustomer(t.status) : filter === 'alert' ? hasAlert(t) : filter === 'stopped' ? isStopped(t) : true))

  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <div>
      
      <SecTitle title="Compras" description={card ? `${card.product} •••• ${card.last4}` : undefined} />
      
      <div className="mb-4 grid gap-2 sm:grid-cols-[1fr_180px]">
        
        <label className="relative block">
          
          <span className="sr-only">Buscar por loja ou produto</span>
          
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" aria-hidden />
          
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por loja ou produto" className="pl-9" />
        
        </label>
        
        <label>
          
          <span className="sr-only">Período</span>
          
          <Select value={period} onChange={(e) => setPeriod(periods.find((p) => p.id === e.target.value)?.id ?? '90')}>
            {periods.map((p) => (
              
              <option key={p.id} value={p.id}>
                {p.label}
              
              </option>
            ))}
          
          </Select>
        
        </label>
      
      </div>
      <Tabs
        label="Filtrar compras"
        value={filter}
        onChange={setFilter}
        tabs={[
          { id: 'all', label: 'Todas', count: inScope.length },
          { id: 'pending', label: 'Aguardando você', count: inScope.filter((t) => isAwaitingCustomer(t.status)).length },
          { id: 'alert', label: 'Com aviso', count: inScope.filter(hasAlert).length },
          { id: 'stopped', label: 'Não concluídas', count: inScope.filter(isStopped).length },
        ]}
      />
      {list.length === 0 ? (
        
        <EmptyState className="mt-6" title="Nada por aqui" description="Nenhuma compra com estes filtros." />
      ) : (
        
        <ul className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper">
          {list.map((t) => (
            
            <PurchaseRow key={t.id} tx={t} />
          ))}
        
        </ul>
      )}
    
    </div>
  )
}

export function SecurityTransactionDetailPage() {
  const { id = '' } = useParams()
  const { getTx, incidents } = useDemo()
  const { viewer } = useViewerData()
  const tx = getTx(id)

  if (!tx || tx.customerId !== viewer.id) return <NotThisAccount />

  const card = getCard(tx.cardId)
  const device = getDevice(tx.deviceId)
  const address = getAddress(tx.addressId)
  const incident = incidents.find((i) => i.txId === tx.id && i.customerId === viewer.id)
  const reasons = tx.status === 'APPROVED' ? [] : clientSignals(latestAssessment(tx), 4)
  const pending = isAwaitingCustomer(tx.status)

  return (
    
    <div className="space-y-6">
      
      <Breadcrumbs items={[{ label: 'Compras', to: '/security/transactions' }, { label: txMerchantLabel(tx) }]} />

      
      <section className="rounded-2xl border border-line bg-paper p-6">
        
        <div className="flex flex-wrap items-start justify-between gap-3">
          
          <div>
            
            <p className="text-[13px] text-muted">{txMerchantLabel(tx)}</p>
            
            <p className="tabular font-display text-[32px] font-semibold tracking-tight">{formatBRL(tx.amount)}</p>
            
            <p className="text-[13px] text-muted">
              {txTitle(tx)} · {formatDateTime(tx.createdAt)}
            
            </p>
          
          </div>
          
          <StatusBadge status={tx.status} audience="client" />
        
        </div>
        {pending && (
          
          <Button className="mt-5" to={`/security/verification/${tx.id}`}>
            {tx.status === 'INTERVENTION' ? 'Ver orientação e decidir' : 'Confirmar agora'}
          
          </Button>
        )}
      
      </section>

      
      <section className="rounded-2xl border border-line bg-paper p-6" aria-labelledby="cs">
        
        <h2 id="cs" className="flex items-center gap-2 font-display text-[16px] font-semibold">
          
        
        </h2>
        
        <p className="mt-2 text-[14px] leading-relaxed text-ink-800/85">{protectionSummary(tx)}</p>
        {reasons.length > 0 && (
          
          <ul className="mt-4 space-y-2.5">
            {reasons.map((s) => (
              
              <li key={s.id} className="flex items-center gap-2.5 text-[14px]">
                
                <SignalGlyph state={s.state === 'ok' ? 'attention' : s.state} />
                {s.clientLabel}
              
              </li>
            ))}
          
          </ul>
        )}
      
      </section>

      
      <section className="rounded-2xl border border-line bg-paper p-6" aria-labelledby="hist">
        
        <h2 id="hist" className="text-[15px] font-semibold">
          Histórico
        
        </h2>
        
        <ol className="mt-4 space-y-3">
          {tx.statusLog.map((c, i) => (
            
            <li key={`${c.at}-${i}`} className="flex gap-3 text-[14px]">
              
              <span className="tabular w-[92px] shrink-0 text-[13px] text-muted">{formatDateTime(c.at)}</span>
              
              <span>
                {txStatusMeta[c.to].client}
                {c.by === 'Cliente' && <span className="text-muted"> · por você</span>}
              
              </span>
            
            </li>
          ))}
        
        </ol>
      
      </section>

      
      <section className="rounded-2xl border border-line bg-paper p-6" aria-label="Detalhes">
        <KeyValue
          columns={2}
          items={[
            { label: 'Pedido na loja', value: tx.orderId ? <span className="font-mono text-[13px]">{tx.orderId}</span> : '—' },
            { label: 'Cartão', value: card ? `${card.product} •••• ${card.last4}` : '—' },
            { label: 'Parcelamento', value: tx.installments <= 1 ? 'À vista' : installmentText(tx.amount, tx.installments) },
            { label: 'Dispositivo', value: device ? `${device.name} · ${device.detail}` : '—' },
            { label: 'Entrega', value: address ? addressLine(address) : '—' },
            { label: 'Código da compra', value: <span className="font-mono text-[13px]">{tx.id}</span> },
          ]}
        />
      
      </section>

      
      <div className="flex flex-wrap gap-2">
        {incident ? (
          
          <Button variant="secondary" to={`/security/incidents/${incident.id}`}>
            Acompanhar relato {incident.id}
          
          </Button>
        ) : (
          
          <Button variant="secondary" to={`/security/report?tx=${tx.id}`}>
            Não reconheço / fui vítima nesta compra
          
          </Button>
        )}
        
        <Link to="/security/transactions" className="inline-flex h-10 items-center px-3 text-[14px] text-muted hover:text-ink-900">
          Voltar para compras
        
        </Link>
      
      </div>
    
    </div>
  )
}
