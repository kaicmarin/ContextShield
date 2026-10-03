import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDemo } from '../../context/DemoContext'
import { getCustomer } from '../../mocks/people'
import { layoutGraph, type LaidOutNode } from '../../services/graph'
import { associationMeta, entityKindLabel } from '../../services/labels'
import { Badge, StatusBadge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Alert, ErrorState } from '../../components/ui/Feedback'
import { IdTag } from '../../components/ui/IdTag'
import { Breadcrumbs } from '../../components/ui/Navigation'
import { KeyValue, PageHeader } from '../../components/ui/Surface'
import { formatBRL, formatDateTime, plural } from '../../utils/format'
import { IDS } from '../../mocks/ids'

// a constante/variável W e atribui a ela o resultado da expressão desta linha.
const W = 188
// a constante/variável H e atribui a ela o resultado da expressão desta linha.
const H = 56

// a constante/variável nodeStyle e atribui a ela o resultado da expressão desta linha.
const nodeStyle: Record<LaidOutNode['kind'], { fill: string; stroke: string; tag: string }> = {
  incident: { fill: '#FCF2E1', stroke: '#B26F12', tag: 'INCIDENTE' },
  transaction: { fill: '#0A1928', stroke: '#0A1928', tag: 'TRANSAÇÃO' },
  phone: { fill: '#FBECE9', stroke: '#C03A28', tag: 'TELEFONE' },
  domain: { fill: '#FBECE9', stroke: '#C03A28', tag: 'DOMÍNIO' },
  account: { fill: '#FCF2E1', stroke: '#B26F12', tag: 'PERFIL' },
  destination: { fill: '#FBECE9', stroke: '#C03A28', tag: 'DESTINO' },
  seller: { fill: '#E7F4ED', stroke: '#1D8055', tag: 'VENDEDOR' },
  merchant: { fill: '#E7F4ED', stroke: '#1D8055', tag: 'ESTABELECIMENTO' },
}

// a função Graph. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function Graph() {
  const { intel, incidents } = useDemo()
  // Declara a constante/variável navigate e atribui a ela o resultado da expressão desta linha.
  const navigate = useNavigate()
  // Declara a constante/variável names e atribui a ela o resultado da expressão desta linha.
  const names = new Map(incidents.map((i) => [i.id, getCustomer(i.customerId)?.name ?? i.customerId]))
  const { nodes, edges } = layoutGraph(intel, names)
  // Declara a constante/variável byId e atribui a ela o resultado da expressão desta linha.
  const byId = new Map(nodes.map((n) => [n.id, n]))
  // Declara a constante/variável height e atribui a ela o resultado da expressão desta linha.
  const height = Math.max(420, ...nodes.map((n) => n.y + 60))
  // Declara a constante/variável width e atribui a ela o resultado da expressão desta linha.
  const width = Math.max(880, ...nodes.map((n) => n.x + 140))

  // Verifica a condição antes de executar o bloco seguinte.
  if (nodes.length === 0) {
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return <p className="py-10 text-[14px] text-muted">Ainda não há relações extraídas de relatos.</p>
  }

  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <div className="scrollbar-thin overflow-x-auto">
      
      <svg viewBox={`0 0 ${width} ${height}`} className="min-w-[720px]" role="img" aria-label={`Grafo de relações com ${nodes.length} elementos e ${edges.length} ligações`}>
        
        <text x={130} y={28} textAnchor="middle" className="fill-[#8A95A1] text-[11px] font-semibold uppercase tracking-[0.12em]">
          Casos
        
        </text>
        
        <text x={420} y={28} textAnchor="middle" className="fill-[#8A95A1] text-[11px] font-semibold uppercase tracking-[0.12em]">
          Elementos
        
        </text>
        
        <text x={720} y={28} textAnchor="middle" className="fill-[#8A95A1] text-[11px] font-semibold uppercase tracking-[0.12em]">
          Transações
        
        </text>
        {edges.map((e) => {
          const a = byId.get(e.from)
          const b = byId.get(e.to)
          if (!a || !b) return null
          const sameCol = Math.abs(a.x - b.x) < 20
          const x1 = sameCol ? a.x : a.x < b.x ? a.x + W / 2 : a.x - W / 2
          const x2 = sameCol ? b.x : a.x < b.x ? b.x - W / 2 : b.x + W / 2
          const y1 = sameCol ? a.y + H / 2 : a.y
          const y2 = sameCol ? b.y - H / 2 : b.y
          const mx = (x1 + x2) / 2
          const d = sameCol ? `M${x1} ${y1} L${x2} ${y2}` : `M${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`
          const hot = e.label === 'mesmo destino'
          return <path key={`${e.from}-${e.to}`} d={d} fill="none" stroke={hot ? '#C03A28' : '#8A95A1'} strokeWidth={hot ? 2 : 1.15} opacity={0.8} />
        })}
        {nodes.map((n) => {
          const s = nodeStyle[n.kind]
          const dark = n.kind === 'transaction'
          return (
            <g
              key={n.id}
              transform={`translate(${n.x - W / 2} ${n.y - H / 2})`}
              role="link"
              tabIndex={0}
              aria-label={`${s.tag}: ${n.label}`}
              className="cursor-pointer outline-none [&:focus-visible>rect]:stroke-[3px] [&:hover>rect]:stroke-[2px]"
              onClick={() => navigate(n.href)}
              onKeyDown={(ev) => {
                if (ev.key === 'Enter' || ev.key === ' ') {
                  ev.preventDefault()
                  navigate(n.href)
                }
              }}
            >
              
              <rect width={W} height={H} rx={2} fill={s.fill} stroke={s.stroke} strokeWidth={1.1} />
              
              <text x={12} y={18} className="text-[9px] font-semibold tracking-[0.12em]" fill={dark ? '#7FD3DE' : s.stroke}>
                {s.tag}
              
              </text>
              
              <text x={12} y={36} className="font-mono text-[12px] font-medium" fill={dark ? '#FFFFFF' : '#0A1928'}>
                {n.label.length > 24 ? `${n.label.slice(0, 23)}…` : n.label}
              
              </text>
              
              <text x={12} y={48} className="text-[10px]" fill={dark ? 'rgba(255,255,255,0.55)' : '#5F6B78'}>
                {n.sub.length > 28 ? `${n.sub.slice(0, 27)}…` : n.sub}
              
              </text>
            
            </g>
          )
        })}
      
      </svg>
    
    </div>
  )
}

export function IntelligencePage() {
  const { intel, incidents } = useDemo()
  const anaIncident = incidents.some((i) => i.customerId === IDS.ana && i.closedAs !== 'not-scam')
  const names = new Map(incidents.map((i) => [i.id, getCustomer(i.customerId)?.name ?? i.customerId]))
  const { edges } = layoutGraph(intel, names)

  return (
    
    <div>
      <PageHeader
        eyebrow="Operations"
        title="Intelligence"
        description="Elementos extraídos dos relatos e observados nas transações. Associação indica evidência compartilhada — nunca prova."
      />

      {!anaIncident && (
        
        <Alert tone="info" className="mb-8" title="Ainda não há relato da Ana" action={<Button size="sm" variant="secondary" to="/security/report">Abrir “Fui vítima”</Button>}>
          Quando o incidente for registrado, telefone, domínio e destino citados entram aqui e passam a ser consultados em novas compras.
        
        </Alert>
      )}

      
      <section className="border-y border-line py-5">
        
        <div className="mb-4">
          
          <h2 className="font-display text-[20px] font-semibold">Relações</h2>
          
          <p className="text-[13px] text-muted">
            {intel.entities.length} elementos · {edges.length} ligações · layout calculado a partir dos dados
          
          </p>
        
        </div>
        
        <Graph />
      
      </section>

      
      <section className="mt-10">
        
        <h2 className="font-display text-[20px] font-semibold">Padrões observados</h2>
        
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {intel.patterns.map((p) => (
            
            <li key={p.id}>
              
              <Link to={`/operations/intelligence/pattern/${p.id}`} className="block py-4 hover:bg-canvas/80">
                
                <div className="flex flex-wrap items-center gap-2">
                  
                  <span className="font-mono text-[12px] text-muted">{p.id}</span>
                  
                  <Badge tone={p.status === 'Possível campanha' ? 'risk' : 'warn'} size="sm">
                    {p.status}
                  
                  </Badge>
                
                </div>
                
                <p className="mt-1.5 text-[15px] font-medium">{p.name}</p>
                
                <p className="mt-0.5 text-[13px] text-muted">{p.hypothesis}</p>
              
              </Link>
            
            </li>
          ))}
          {intel.patterns.length === 0 && <li className="py-6 text-[14px] text-muted">Nenhum padrão formado ainda. Padrões nascem quando relatos compartilham elementos.</li>}
        
        </ul>
      
      </section>

      
      <section className="mt-10">
        
        <h2 className="font-display text-[20px] font-semibold">Elementos</h2>
        
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {intel.entities.map((e) => (
            
            <li key={e.id}>
              
              <Link to={`/operations/intelligence/${e.id}`} className="grid gap-2 py-3.5 hover:bg-canvas/80 sm:grid-cols-[140px_1fr_auto_auto] sm:items-center">
                
                <span className="text-[12px] text-subtle">{entityKindLabel[e.kind]}</span>
                
                <span className="text-[15px] font-medium">{e.value}</span>
                
                <span className="text-[13px] text-muted">
                  {plural(e.incidentIds.length, 'incidente', 'incidentes')} · {plural(e.txIds.length, 'transação', 'transações')}
                
                </span>
                
                <Badge tone={associationMeta[e.association].tone} size="sm">
                  {e.association}
                
                </Badge>
              
              </Link>
            
            </li>
          ))}
        
        </ul>
      
      </section>
    
    </div>
  )
}

export function RelationshipDetailPage() {
  const { entityId = '' } = useParams()
  const { intel, getIncident, getTx } = useDemo()
  const entity = intel.entity(entityId)

  if (!entity) {
    return (
      <ErrorState
        title="Elemento não disponível"
        description="Este elemento não existe ou ainda não foi extraído de nenhum relato nesta demonstração."
        action={<Button variant="secondary" to="/operations/intelligence">Voltar para Intelligence</Button>}
      />
    )
  }

  const meta = associationMeta[entity.association]
  const incs = entity.incidentIds.map((i) => getIncident(i)).filter((i): i is NonNullable<typeof i> => Boolean(i))
  const txs = entity.txIds.map((t) => getTx(t)).filter((t): t is NonNullable<typeof t> => Boolean(t))

  return (
    
    <div>
      
      <Breadcrumbs items={[{ label: 'Intelligence', to: '/operations/intelligence' }, { label: entity.value }]} />
      <PageHeader
        eyebrow={entityKindLabel[entity.kind]}
        title={entity.value}
        description={entity.sub}
        meta={
          <>
            
            <Badge tone={meta.tone}>Associação {entity.association}</Badge>
            
            <IdTag value={entity.id} />
          </>
        }
      />
      
      <div className="grid gap-10 xl:grid-cols-[1fr_320px]">
        
        <div className="space-y-8">
          
          <section>
            
            <h2 className="font-display text-[18px] font-semibold">Por que esta relação existe</h2>
            
            <ul className="mt-3 divide-y divide-line border-y border-line">
              {entity.links.map((l, i) => (
                
                <li key={`${l.targetId}-${i}`} className="py-3 text-[14px]">
                  
                  <p className="font-medium">{l.reason}</p>
                  
                  <p className="mt-0.5 font-mono text-[12px] text-muted">{l.targetId} · {formatDateTime(l.at)}</p>
                
                </li>
              ))}
            
            </ul>
            
            <p className="mt-3 text-[13px] text-muted">{meta.text}</p>
          
          </section>
          
          <section>
            
            <h2 className="font-display text-[18px] font-semibold">Incidentes</h2>
            {incs.length === 0 ? (
              
              <p className="mt-2 text-[14px] text-muted">Nenhum incidente registrado.</p>
            ) : (
              
              <ul className="mt-3 divide-y divide-line border-y border-line">
                {incs.map((i) => (
                  
                  <li key={i.id}>
                    
                    <Link to={`/operations/incidents/${i.id}`} className="flex flex-wrap items-center gap-3 py-3 hover:bg-canvas/80">
                      
                      <span className="id-tag font-medium">{i.id}</span>
                      
                      <span className="text-[14px]">{getCustomer(i.customerId)?.name}</span>
                      
                      <span className="ml-auto text-[13px] text-muted">{formatDateTime(i.createdAt)}</span>
                    
                    </Link>
                  
                  </li>
                ))}
              
              </ul>
            )}
          
          </section>
          
          <section>
            
            <h2 className="font-display text-[18px] font-semibold">Transações observadas</h2>
            {txs.length === 0 ? (
              
              <p className="mt-2 text-[14px] text-muted">Nenhuma transação associada.</p>
            ) : (
              
              <ul className="mt-3 divide-y divide-line border-y border-line">
                {txs.map((t) => (
                  
                  <li key={t.id}>
                    
                    <Link to={`/operations/transactions/${t.id}`} className="flex flex-wrap items-center gap-3 py-3 hover:bg-canvas/80">
                      
                      <span className="id-tag font-medium">{t.id}</span>
                      
                      <StatusBadge status={t.status} size="sm" />
                      
                      <span className="tabular ml-auto text-[14px]">{formatBRL(t.amount)}</span>
                    
                    </Link>
                  
                  </li>
                ))}
              
              </ul>
            )}
          
          </section>
        
        </div>
        
        <aside className="space-y-6 border-l-0 border-t border-line pt-6 xl:border-l xl:border-t-0 xl:pl-8 xl:pt-0">
          <KeyValue
            items={[
              { label: 'Tipo', value: entityKindLabel[entity.kind] },
              { label: 'Primeira ocorrência', value: formatDateTime(entity.firstSeen) },
              { label: 'Associação', value: entity.association },
            ]}
          />
          
          <Alert tone="neutral" title="Associação não é prova">
            Um elemento compartilhado entre casos eleva a atenção. A decisão continua sendo da política de proteção.
          
          </Alert>
        
        </aside>
      
      </div>
    
    </div>
  )
}

export function PatternDetailPage() {
  const { id = '' } = useParams()
  const { intel, getIncident, getTx } = useDemo()
  const pattern = intel.patterns.find((p) => p.id === id)
  if (!pattern) {
    return (
      
      <ErrorState title="Padrão não encontrado" action={<Button variant="secondary" to="/operations/intelligence">Intelligence</Button>} />
    )
  }
  return (
    
    <div>
      
      <Breadcrumbs items={[{ label: 'Intelligence', to: '/operations/intelligence' }, { label: pattern.id }]} />
      <PageHeader
        eyebrow="Padrão"
        title={pattern.name}
        description={pattern.hypothesis}
        meta={<Badge tone={pattern.status === 'Possível campanha' ? 'risk' : 'warn'}>{pattern.status}</Badge>}
      />
      
      <div className="grid gap-10 lg:grid-cols-2">
        
        <section>
          
          <h2 className="font-display text-[18px] font-semibold">Incidentes</h2>
          
          <ul className="mt-3 divide-y divide-line border-y border-line">
            {pattern.incidentIds.map((iid) => {
              const i = getIncident(iid)
              return (
                
                <li key={iid}>
                  
                  <Link to={`/operations/incidents/${iid}`} className="flex items-center justify-between py-3 text-[14px] hover:bg-canvas/80">
                    
                    <span className="id-tag">{iid}</span>
                    
                    <span>{getCustomer(i?.customerId ?? '')?.name}</span>
                  
                  </Link>
                
                </li>
              )
            })}
          
          </ul>
        
        </section>
        
        <section>
          
          <h2 className="font-display text-[18px] font-semibold">Elementos</h2>
          
          <ul className="mt-3 divide-y divide-line border-y border-line">
            {pattern.entityIds.map((eid) => {
              const e = intel.entity(eid)
              return (
                
                <li key={eid}>
                  
                  <Link to={`/operations/intelligence/${eid}`} className="flex items-center justify-between py-3 text-[14px] hover:bg-canvas/80">
                    
                    <span>{e ? entityKindLabel[e.kind] : eid}</span>
                    
                    <span className="font-medium">{e?.value}</span>
                  
                  </Link>
                
                </li>
              )
            })}
          
          </ul>
          
          <h2 className="mt-8 font-display text-[18px] font-semibold">Transações</h2>
          
          <ul className="mt-3 divide-y divide-line border-y border-line">
            {pattern.txIds.map((tid) => {
              const t = getTx(tid)
              return (
                
                <li key={tid}>
                  
                  <Link to={`/operations/transactions/${tid}`} className="flex items-center justify-between py-3 text-[14px] hover:bg-canvas/80">
                    
                    <span className="id-tag">{tid}</span>
                    {t && <StatusBadge status={t.status} size="sm" />}
                  
                  </Link>
                
                </li>
              )
            })}
          
          </ul>
        
        </section>
      
      </div>
    
    </div>
  )
}
