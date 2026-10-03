import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useDemo } from '../../context/DemoContext'
import { IDS } from '../../mocks/ids'
import { incidentChannelLabel, incidentStatusLabel, incidentTypeLabel } from '../../mocks/incidents'
import { getMerchant } from '../../mocks/merchants'
import { getCustomer } from '../../mocks/people'
import { associationMeta, entityKindLabel } from '../../services/labels'
import type { Incident, IncidentStatus, IncidentType } from '../../types/domain'
import { Badge, IncidentStatusBadge, StatusBadge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { EmptyState, ErrorState } from '../../components/ui/Feedback'
import { Select } from '../../components/ui/Form'
import { IdTag } from '../../components/ui/IdTag'
import { Breadcrumbs } from '../../components/ui/Navigation'
import { KeyValue, PageHeader } from '../../components/ui/Surface'
import { Table, Td, Th, THead, Tr } from '../../components/ui/Table'
import { Trace } from '../../components/ui/Trace'
import { formatBRL, formatDateTime, formatShortDate, formatTime } from '../../utils/format'

// a constante/variável NOW e atribui a ela o resultado da expressão desta linha.
const NOW = new Date('2026-09-28T23:59:59').getTime()
// a constante/variável periods e atribui a ela o resultado da expressão desta linha.
const periods = [
  { id: '', label: 'Todo o período' },
  { id: '1', label: 'Hoje' },
  { id: '7', label: 'Últimos 7 dias' },
  { id: '30', label: 'Últimos 30 dias' },
]

// a função merchantOf. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function merchantOf(i: Incident, getTx: ReturnType<typeof useDemo>['getTx']) {
  // Declara a constante/variável tx e atribui a ela o resultado da expressão desta linha.
  const tx = getTx(i.txId)
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return tx ? getMerchant(tx.merchantId)?.name ?? '—' : '—'
}

// a função amountOf. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function amountOf(i: Incident, getTx: ReturnType<typeof useDemo>['getTx']) {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return getTx(i.txId)?.amount
}
export function OpsIncidentsPage() {
  const { incidents, getTx } = useDemo()
  const [params, setParams] = useSearchParams()
  // Declara a constante/variável status e atribui a ela o resultado da expressão desta linha.
  const status = params.get('status') ?? ''
  // Declara a constante/variável type e atribui a ela o resultado da expressão desta linha.
  const type = params.get('type') ?? ''
  // Declara a constante/variável period e atribui a ela o resultado da expressão desta linha.
  const period = params.get('period') ?? ''

  // Declara a constante/variável set e atribui a ela o resultado da expressão desta linha.
  const set = (key: string, value: string) => {
    // Declara a constante/variável next e atribui a ela o resultado da expressão desta linha.
    const next = new URLSearchParams(params)
    // Verifica a condição antes de executar o bloco seguinte.
    if (value) next.set(key, value)
    // Caso a condição anterior não seja atendida, executa o caminho alternativo.
    else next.delete(key)
    // Atualiza o estado associado ao setter desta variável; o React agenda uma nova renderização quando necessário.
    setParams(next, { replace: true })
  }

  // Declara a constante/variável rows e atribui a ela o resultado da expressão desta linha.
  const rows = incidents.filter((i) => {
    // Verifica a condição antes de executar o bloco seguinte.
    if (status && i.status !== status) return false
    // Verifica a condição antes de executar o bloco seguinte.
    if (type && i.type !== type) return false
    // Verifica a condição antes de executar o bloco seguinte.
    if (period) {
      // Declara a constante/variável days e atribui a ela o resultado da expressão desta linha.
      const days = Number(period)
      // Declara a constante/variável age e atribui a ela o resultado da expressão desta linha.
      const age = (NOW - new Date(i.createdAt).getTime()) / 86_400_000
      // Verifica a condição antes de executar o bloco seguinte.
      if (age > days) return false
    }
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return true
  })
  // Declara a constante/variável anaHas e atribui a ela o resultado da expressão desta linha.
  const anaHas = incidents.some((i) => i.customerId === IDS.ana)

  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <div>
      
      <PageHeader eyebrow="Operations" title="Incidents" description="Relatos “Fui vítima” recebidos e as relações encontradas entre eles." />
      
      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,220px))_auto]">
        
        <Select aria-label="Status" value={status} onChange={(e) => set('status', e.target.value)}>
          
          <option value="">Todos os status</option>
          {(Object.keys(incidentStatusLabel) as IncidentStatus[]).map((s) => (
            
            <option key={s} value={s}>
              {incidentStatusLabel[s]}
            
            </option>
          ))}
        
        </Select>
        
        <Select aria-label="Tipo" value={type} onChange={(e) => set('type', e.target.value)}>
          
          <option value="">Todos os tipos</option>
          {(Object.keys(incidentTypeLabel) as IncidentType[]).map((t) => (
            
            <option key={t} value={t}>
              {incidentTypeLabel[t]}
            
            </option>
          ))}
        
        </Select>
        
        <Select aria-label="Período" value={period} onChange={(e) => set('period', e.target.value)}>
          {periods.map((p) => (
            
            <option key={p.id} value={p.id}>
              {p.label}
            
            </option>
          ))}
        
        </Select>
        {(status || type || period) && (
          
          <Button variant="ghost" onClick={() => setParams({}, { replace: true })}>
            Limpar
          
          </Button>
        )}
      
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="Nenhum incidente neste filtro"
          description={anaHas ? 'Ajuste os filtros.' : 'O relato da Ana aparece aqui depois que ela usar “Fui vítima”.'}
          action={
            
            <Button variant="secondary" to="/security/report">
              Abrir “Fui vítima”
            
            </Button>
          }
        />
      ) : (
        
        <Table minWidth={1040}>
          
          <THead>
            
            <Th>ID</Th>
            
            <Th>Cliente</Th>
            
            <Th>Tipo</Th>
            
            <Th>Estabelecimento</Th>
            
            <Th className="text-right">Valor</Th>
            
            <Th>Status</Th>
            
            <Th>Registrado</Th>
          
          </THead>
          
          <tbody>
            {rows.map((i) => {
              const amount = amountOf(i, getTx)
              return (
                
                <Tr key={i.id} to={`/operations/incidents/${i.id}`} highlight={i.customerId === IDS.ana}>
                  
                  <Td>
                    
                    <Link to={`/operations/incidents/${i.id}`} className="id-tag font-medium hover:underline">
                      {i.id}
                    
                    </Link>
                  
                  </Td>
                  
                  <Td>{getCustomer(i.customerId)?.name ?? i.customerId}</Td>
                  
                  <Td className="max-w-[240px] truncate text-[12px] text-muted">{incidentTypeLabel[i.type]}</Td>
                  
                  <Td>{merchantOf(i, getTx)}</Td>
                  
                  <Td className="tabular text-right">{amount !== undefined ? formatBRL(amount) : '—'}</Td>
                  
                  <Td>
                    
                    <IncidentStatusBadge status={i.status} />
                  
                  </Td>
                  
                  <Td className="tabular text-[12px] text-muted">{formatDateTime(i.createdAt)}</Td>
                
                </Tr>
              )
            })}
          
          </tbody>
        
        </Table>
      )}
    
    </div>
  )
}

export function OpsIncidentDetailPage() {
  const { id = '' } = useParams()
  const { getIncident, incidents, getTx, intel } = useDemo()
  const incident = getIncident(id)

  if (!incident) {
    return (
      <ErrorState
        title="Incidente não encontrado"
        description={`Não há incidente ${id || 'informado'}. Se for o relato da Ana, registre-o em “Fui vítima”.`}
        action={
          <>
            
            <Button variant="secondary" to="/operations/incidents">
              Ver incidentes
            
            </Button>
            
            <Button to="/security/report">Abrir “Fui vítima”</Button>
          </>
        }
      />
    )
  }

  const tx = getTx(incident.txId)
  const entityIds = intel.incidentEntities.get(incident.id) ?? []
  const entities = entityIds.map((eid) => intel.entity(eid)).filter((e) => Boolean(e))
  const related = incidents
    .filter((o) => o.id !== incident.id)
    .map((o) => {
      const shared = (intel.incidentEntities.get(o.id) ?? []).filter((eid) => entityIds.includes(eid)).map((eid) => intel.entity(eid))
      return { other: o, shared: shared.filter((e) => Boolean(e)) }
    })
    .filter((r) => r.shared.length > 0)
  const relatedTxs = [...new Set(entities.flatMap((e) => e!.txIds))]
    .filter((txId) => txId !== incident.txId)
    .map((txId) => ({ tx: getTx(txId), via: entities.filter((e) => e!.txIds.includes(txId)) }))
    .filter((r) => r.tx)

  return (
    
    <div>
      
      <Breadcrumbs items={[{ label: 'Incidents', to: '/operations/incidents' }, { label: incident.id }]} />
      <PageHeader
        eyebrow="Incident detail"
        title={
          
          <span className="flex flex-wrap items-center gap-3">
            
            <span className="font-mono text-[24px]">{incident.id}</span>
            
            <IncidentStatusBadge status={incident.status} />
          
          </span>
        }
        description={`${getCustomer(incident.customerId)?.name ?? incident.customerId} · ${incidentTypeLabel[incident.type]}`}
        meta={incident.correlationId && <IdTag value={incident.correlationId} tone="trace" copy to={`/operations/timeline?c=${incident.correlationId}`} />}
        actions={
          <>
            {tx && (
              
              <Button size="sm" variant="secondary" to={`/operations/transactions/${tx.id}`}>
                Transação
              
              </Button>
            )}
            
            <Button size="sm" variant="secondary" to="/operations/intelligence">
              Intelligence
            
            </Button>
          </>
        }
      />

      
      <div className="grid gap-10 xl:grid-cols-[1fr_320px]">
        
        <div>
          
          <h2 className="font-display text-[18px] font-semibold">Relato do cliente</h2>
          
          <p className="mt-1 text-[13px] text-muted">Recebido pelo app Aureon em {formatDateTime(incident.createdAt)}</p>
          
          <blockquote className="mt-4 border-l-2 border-trace pl-4 text-[14px] leading-relaxed text-ink-800">{incident.description}</blockquote>
          
          <div className="mt-5">
            <KeyValue
              columns={3}
              dense
              items={[
                { label: 'Ocorrido em', value: formatDateTime(incident.occurredAt) },
                { label: 'Canal do contato', value: incidentChannelLabel[incident.channel] },
                { label: 'Estabelecimento', value: merchantOf(incident, getTx) },
                { label: 'Valor', value: amountOf(incident, getTx) !== undefined ? formatBRL(amountOf(incident, getTx) as number) : '—' },
                { label: 'Transação', value: incident.txId ? <IdTag value={incident.txId} to={tx ? `/operations/transactions/${incident.txId}` : undefined} /> : '—' },
                { label: 'Telefone / perfil', value: incident.contactHandle ?? '—' },
                { label: 'Link', value: incident.contactLink ?? '—' },
                { label: 'Destino citado', value: incident.destinationText ?? '—' },
              ]}
            />
          
          </div>

          
          <h2 className="mt-10 font-display text-[18px] font-semibold">Ocorrências relacionadas</h2>
          
          <p className="mt-1 text-[13px] text-muted">Casos que compartilham elementos com este relato. Associação não é prova.</p>
          {related.length === 0 && relatedTxs.length === 0 ? (
            
            <p className="mt-4 text-[13px] text-muted">Nenhuma relação encontrada até agora.</p>
          ) : (
            
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {related.map(({ other, shared }) => (
                
                <li key={other.id}>
                  
                  <Link to={`/operations/incidents/${other.id}`} className="flex flex-wrap items-center gap-3 py-3 hover:bg-canvas/80">
                    
                    <span className="id-tag font-medium">{other.id}</span>
                    
                    <span className="text-[13px]">
                      {getCustomer(other.customerId)?.name} · {formatShortDate(other.createdAt)}
                    
                    </span>
                    
                    <span className="ml-auto text-[12px] text-muted">via {shared.map((s) => s!.value).join(', ')}</span>
                  
                  </Link>
                
                </li>
              ))}
              {relatedTxs.map(({ tx: rtx, via }) =>
                rtx ? (
                  
                  <li key={rtx.id}>
                    
                    <Link to={`/operations/transactions/${rtx.id}`} className="flex flex-wrap items-center gap-3 py-3 hover:bg-canvas/80">
                      
                      <span className="id-tag font-medium">{rtx.id}</span>
                      
                      <StatusBadge status={rtx.status} size="sm" />
                      
                      <span className="ml-auto text-[12px] text-muted">via {via.map((e) => e!.value).join(', ')}</span>
                    
                    </Link>
                  
                  </li>
                ) : null,
              )}
            
            </ul>
          )}
        
        </div>

        
        <aside>
          
          <h2 className="font-display text-[16px] font-semibold">Elementos extraídos</h2>
          {entities.length === 0 ? (
            
            <p className="mt-3 text-[13px] text-muted">Nenhum elemento extraído.</p>
          ) : (
            
            <ul className="mt-3 divide-y divide-line border-y border-line">
              {entities.map((e) => (
                
                <li key={e!.id}>
                  
                  <Link to={`/operations/intelligence/${e!.id}`} className="flex items-center justify-between gap-3 py-2.5 hover:bg-canvas/80">
                    
                    <span className="min-w-0">
                      
                      <span className="block text-[11px] text-subtle">{entityKindLabel[e!.kind]}</span>
                      
                      <span className="block truncate text-[13px] font-medium">{e!.value}</span>
                    
                    </span>
                    
                    <Badge tone={associationMeta[e!.association].tone} size="sm">
                      {e!.association}
                    
                    </Badge>
                  
                  </Link>
                
                </li>
              ))}
            
            </ul>
          )}
          
          <h2 className="mt-8 font-display text-[16px] font-semibold">Histórico</h2>
          
          <div className="mt-3">
            <Trace
              dense
              items={incident.history.map((h, i) => ({
                id: `${incident.id}-h${i}`,
                time: formatTime(h.at, false),
                title: h.label,
                detail: `${h.actor} · ${formatShortDate(h.at)}`,
                tone: h.actor === 'Sistema' ? 'trace' : h.actor === 'Cliente' ? 'warn' : 'info',
              }))}
            />
          
          </div>
        
        </aside>
      
      </div>
    
    </div>
  )
}
