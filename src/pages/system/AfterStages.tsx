import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useDemo } from '../../context/DemoContext'
import { IDS } from '../../mocks/ids'
import { incidentChannelLabel, incidentTypeLabel } from '../../mocks/incidents'
import { addressLine, getAddress, getCustomer } from '../../mocks/people'
import { buildIntelligence } from '../../services/intel'
import { entityKindLabel } from '../../services/labels'
import { decisionMeta } from '../../services/riskModel'
import { latestAssessment, txTitle } from '../../services/present'
import { CompleteStoryButton, DarkPanel, EventEnvelope, LockedStage, StageHeader } from '../../components/system/StageParts'
import { RiskMeter } from '../../components/ui/RiskMeter'
import { Button } from '../../components/ui/Button'
import { Trace } from '../../components/ui/Trace'
import { formatBRL, formatTime } from '../../utils/format'

// a constante/variável highlights e atribui a ela o resultado da expressão desta linha.
const highlights = ['(11) 94000-2184', 'aureon-protecao.example', 'Rua Tuiuti, 880', 'Central de Segurança', 'NEXA']

// a função Highlighted. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function Highlighted({ text }: { text: string }) {
  // Declara a constante/variável parts e atribui a ela o resultado da expressão desta linha.
  const parts = text.split(new RegExp(`(${highlights.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g'))
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    <>
      {parts.map((p, i) =>
        highlights.includes(p) ? (
          
          <mark key={i} className="rounded bg-trace/25 px-1 text-white">
            {p}
          
          </mark>
        ) : (
          
          <span key={i}>{p}</span>
        ),
      )}
    </>
  )
}

function ReportLocked() {
  return (
    <LockedStage
      title="O relato da Ana ainda não foi registrado"
      description="Este estágio acontece quando a cliente usa “Fui vítima” no app do cartão."
      action={
        <>
          
          <Button variant="inverse" to="/security/report">
            Abrir “Fui vítima”
          
          </Button>
          
          <CompleteStoryButton />
        </>
      }
    />
  )
}

export function StageIncidentReceived() {
  const { getIncident, intel, incidents } = useDemo()
  const anaIncident = incidents.find((i) => i.customerId === IDS.ana && i.closedAs !== 'not-scam') ?? getIncident(incidents.find((i) => i.customerId === IDS.ana)?.id)
  if (!anaIncident) return <ReportLocked />
  const ids = intel.incidentEntities.get(anaIncident.id) ?? []
  const entities = ids.map((id) => intel.entity(id)).filter((e) => Boolean(e))

  return (
    
    <div>
      
      <StageHeader n={51} title="Incident received" lead="O relato da cliente vira dados estruturados. O motor extrai apenas o que ela escolheu contar — não acessa a conversa com o golpista." />
      
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        
        <DarkPanel eyebrow={`${anaIncident.id} · ${formatTime(anaIncident.createdAt)}`} title={incidentTypeLabel[anaIncident.type]}>
          
          <p className="text-[15px] leading-relaxed text-white/80">
            “<Highlighted text={anaIncident.description} />”
          
          </p>
          
          <p className="mt-4 text-[12px] text-white/45">
            Canal informado: {incidentChannelLabel[anaIncident.channel]}
            {anaIncident.contactHandle ? ` · ${anaIncident.contactHandle}` : ''}
            {anaIncident.contactLink ? ` · ${anaIncident.contactLink}` : ''}
          
          </p>
        
        </DarkPanel>
        
        <div className="space-y-4">
          <EventEnvelope
            name="IncidentConfirmed"
            fields={[
              ['incidentId', anaIncident.id],
              ['correlationId', <span className="text-trace">{anaIncident.correlationId ?? '—'}</span>],
              ['transactionId', anaIncident.txId ?? '—'],
              ['reportedBy', 'Cliente (app Aureon)'],
              ['channel', anaIncident.channel],
            ]}
          />
          
          <DarkPanel title="Elementos extraídos">
            
            <ul className="space-y-2">
              {entities.map((e) => (
                
                <li key={e!.id} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 px-3 py-2 text-[13px]">
                  
                  <span className="text-white/50">{entityKindLabel[e!.kind]}</span>
                  
                  <span className="font-mono text-white">{e!.value}</span>
                
                </li>
              ))}
            
            </ul>
          
          </DarkPanel>
        
        </div>
      
      </div>
    
    </div>
  )
}

export function StageIntelligenceUpdated() {
  const { incidents, transactions, intel } = useDemo()
  const anaIncident = incidents.find((i) => i.customerId === IDS.ana && i.closedAs !== 'not-scam')
  if (!anaIncident) return <ReportLocked />

  const before = buildIntelligence(
    incidents.filter((i) => i.id !== anaIncident.id),
    transactions,
  )
  const after = intel
  const newLinks = after.entities.flatMap((e) => e.links.filter((l) => l.targetId === anaIncident.id).map((l) => ({ entity: e, reason: l.reason })))

  return (
    
    <div>
      
      <StageHeader n={52} title="Intelligence updated" lead="Os elementos do relato se conectam a casos anteriores. O que a Ana contou passa a existir como sinal para a próxima compra." />
      
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Elementos', before: before.entities.length, after: after.entities.length },
          { label: 'Ligações deste relato', before: 0, after: newLinks.length },
          { label: 'Padrões', before: before.patterns.length, after: after.patterns.length },
        ].map((k) => (
          
          <DarkPanel key={k.label}>
            
            <p className="text-[12px] text-white/50">{k.label}</p>
            
            <p className="mt-1 flex items-baseline gap-3 font-display">
              
              <span className="tabular text-[22px] text-white/40">{k.before}</span>
              
              <ArrowRight className="h-4 w-4 text-white/30" aria-hidden />
              
              <span className="tabular text-[36px] font-semibold">{k.after}</span>
            
            </p>
          
          </DarkPanel>
        ))}
      
      </div>
      
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
        
        <DarkPanel eyebrow="PatternUpdated · RelatedCaseFound" title="Ligações deste relato">
          
          <ul className="space-y-2 text-[13px]">
            {newLinks.map((l) => (
              
              <li key={`${l.entity.id}-${l.reason}`} className="flex flex-wrap items-center gap-2 rounded-lg border border-white/10 px-3 py-2">
                
                <span className="text-white/45">{entityKindLabel[l.entity.kind]}</span>
                
                <span className="font-mono text-white">{l.entity.value}</span>
                
                <span className="ml-auto text-white/45">{l.reason}</span>
              
              </li>
            ))}
            {newLinks.length === 0 && <li className="text-white/50">Nenhuma ligação nova — o relato ainda não citou entidades reconhecíveis.</li>}
          
          </ul>
        
        </DarkPanel>
        
        <div className="space-y-4">
          {after.patterns.map((p) => (
            
            <DarkPanel key={p.id} eyebrow={`${p.id} · ${p.status}`} title={p.name}>
              
              <p className="text-[13px] text-white/65">{p.hypothesis}</p>
              
              <p className="mt-2 font-mono text-[11px] text-white/45">{p.incidentIds.join(' · ')}</p>
            
            </DarkPanel>
          ))}
          
          <DarkPanel eyebrow="PolicyUpdated" title="Ajuste revisado por pessoa">
            
            <p className="text-[13px] text-white/65">Novas entregas para destinos citados em relatos passam a elevar o risco. A mudança é aplicada pela política de matching — não por um modelo de IA.</p>
          
          </DarkPanel>
          
          <Link to="/operations/intelligence" className="inline-block text-[13px] text-trace hover:underline">
            Abrir grafo em Operations →
          
          </Link>
        
        </div>
      
      </div>
    
    </div>
  )
}

export function StageRelatedDetected() {
  const { incidents, getTx, transactions, domain } = useDemo()
  const anaIncident = incidents.find((i) => i.customerId === IDS.ana && i.closedAs !== 'not-scam')
  const tx = transactions.find((t) => t.customerId === IDS.mariana && t.scenario === 'related') ?? getTx(transactions.find((t) => t.customerId === IDS.mariana)?.id)

  if (!anaIncident || !tx) {
    return (
      <LockedStage
        title="A compra relacionada ainda não aconteceu"
        description={
          anaIncident
            ? 'Execute o cenário “Nova compra relacionada” (Mariana) na loja pelo Demo Center.'
            : 'Primeiro a Ana precisa registrar o relato; depois a Mariana faz a compra para o mesmo destino.'
        }
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

  const initial = tx.assessments[0]
  const final = latestAssessment(tx)
  const events = domain.events.filter((e) => e.txId === tx.id && ['RelatedCaseFound', 'RiskRecalculated', 'InterventionTriggered', 'TransactionCancelled', 'CampaignDetected'].includes(e.name))
  const dest = getAddress(tx.addressId)

  return (
    
    <div>
      
      <StageHeader n={53} title="Related transaction detected" lead="Depois do relato da Ana, uma nova compra usa o mesmo destino. O que ela contou protege a Mariana antes do pagamento." />

      
      <div className="grid items-stretch gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
        
        <DarkPanel eyebrow={`Relato · ${formatTime(anaIncident.createdAt, false)}`} title={anaIncident.id}>
          
          <p className="text-[13px] text-white/65">
            {getCustomer(anaIncident.customerId)?.firstName} cita o destino {anaIncident.destinationText ?? dest?.line1 ?? 'indicado no relato'}.
          
          </p>
        
        </DarkPanel>
        
        <div className="hidden items-center lg:flex" aria-hidden>
          
          <ArrowRight className="h-5 w-5 text-trace" />
        
        </div>
        
        <section className="rounded-2xl border border-risk/40 bg-risk/10 p-5">
          
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/50">Elemento compartilhado</p>
          
          <p className="font-display text-[18px] font-semibold">{dest ? addressLine(dest) : anaIncident.destinationText ?? 'Destino em comum'}</p>
          
          <p className="mt-1 text-[13px] text-white/65">Associação derivada do relato — não é prova isolada</p>
        
        </section>
        
        <div className="hidden items-center lg:flex" aria-hidden>
          
          <ArrowRight className="h-5 w-5 text-trace" />
        
        </div>
        
        <DarkPanel eyebrow={`Compra · ${formatTime(tx.createdAt, false)}`} title={tx.id}>
          
          <p className="text-[13px] text-white/65">
            {getCustomer(tx.customerId)?.name} · {formatBRL(tx.amount)} · {txTitle(tx)}
          
          </p>
        
        </DarkPanel>
      
      </div>

      {final && (
        
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
          
          <DarkPanel title="Risco">
            
            <RiskMeter dark initial={initial} final={final} />
            
            <p className="mt-5 text-[13px] text-white/60">
              {initial?.score} {initial?.level} → {final.score} {final.level} · confiança {final.confidence}% · {decisionMeta[final.decision].label}
            
            </p>
          
          </DarkPanel>
          
          <DarkPanel title="Eventos">
            
            <Trace dark items={events.map((e) => ({ id: e.id, time: formatTime(e.at), title: e.name, detail: e.result, tone: e.tone }))} />
          
          </DarkPanel>
        
        </div>
      )}

      
      <div className="mt-6 flex flex-wrap gap-2">
        
        <Button variant="inverse" to={`/operations/transactions/${tx.id}`}>
          Ver em Operations
        
        </Button>
        
        <Button variant="ghost" className="text-white/70 hover:bg-white/5" to="/operations/intelligence">
          Ver grafo atualizado
        
        </Button>
      
      </div>
    
    </div>
  )
}
