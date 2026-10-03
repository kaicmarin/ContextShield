import { Link } from 'react-router-dom'
import { Check, Minus, X } from 'lucide-react'
import { getCard, getCustomer, getDevice, getAddress } from '../../mocks/people'
import { getMerchant } from '../../mocks/merchants'
import { verificationQuestions, answerLabel } from '../../mocks/verification'
import { useDemo } from '../../context/DemoContext'
import { BANDS, decisionMeta, sourceSpec } from '../../services/riskModel'
import { riskMeta, toneClasses } from '../../services/labels'
import { txTitle } from '../../services/present'
import { DarkPanel, EventEnvelope, MissingStageTx, StageHeader, useStageTx } from '../../components/system/StageParts'
import { RiskMeter } from '../../components/ui/RiskMeter'
import { SignalGlyph } from '../../components/ui/Badge'
import { Trace } from '../../components/ui/Trace'
import { cx, formatBRL, formatTime } from '../../utils/format'
import type { RiskLevel, VerificationAnswers } from '../../types/domain'

// a constante/variável levelOnDark e atribui a ela o resultado da expressão desta linha.
const levelOnDark: Record<RiskLevel, string> = {
  LOW: 'text-[#6FD6A4]',
  MEDIUM: 'text-[#F2BE6B]',
  HIGH: 'text-[#FF9A86]',
  CRITICAL: 'text-[#FF7A8C]',
  INCONCLUSIVE: 'text-white/60',
}
export function StageReceived() {
  const { tx } = useStageTx()
  // Verifica a condição antes de executar o bloco seguinte.
  if (!tx) return <MissingStageTx />
  // Declara a constante/variável card e atribui a ela o resultado da expressão desta linha.
  const card = getCard(tx.cardId)
  // Declara a constante/variável device e atribui a ela o resultado da expressão desta linha.
  const device = getDevice(tx.deviceId)
  // Declara a constante/variável merchant e atribui a ela o resultado da expressão desta linha.
  const merchant = getMerchant(tx.merchantId)
  // Declara a constante/variável address e atribui a ela o resultado da expressão desta linha.
  const address = getAddress(tx.addressId)

  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <div>
      
      
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <EventEnvelope
          name="TransactionCreated"
          fields={[
            ['correlationId', <span className="text-trace">{tx.correlationId}</span>],
            ['transactionId', tx.id],
            ['orderId', tx.orderId ?? '—'],
            ['occurredAt', tx.createdAt],
            ['amount', formatBRL(tx.amount)],
            ['merchant', `${merchant?.name ?? '—'} · ${merchant?.domain ?? '—'}`],
            ['card', `•••• ${card?.last4 ?? '••••'} (token simulado)`],
            ['device', device?.detail ?? '—'],
            ['shipTo', address?.line1 ?? '—'],
            ['channel', tx.channel],
            ['declaredOrigin', tx.declaredOrigin ?? 'não informada'],
          ]}
        />
        
        <div className="space-y-4">
          
          <DarkPanel eyebrow="O motor sabe" title="Dados da compra">
            
            <ul className="space-y-2 text-[14px] text-white/80">
              {['Valor, estabelecimento e itens', 'Dispositivo e sessão do checkout', 'Endereço de entrega', 'Origem declarada, se a cliente respondeu'].map((t) => (
                
                <li key={t} className="flex items-center gap-2">
                  
                  <Check className="h-4 w-4 text-trace" aria-hidden /> {t}
                
                </li>
              ))}
            
            </ul>
          
          </DarkPanel>
          
          <DarkPanel eyebrow="O motor não recebe" title="Sem atalhos">
            
            <ul className="space-y-2 text-[14px] text-white/80">
              {['Rótulo de fraude ou golpe (fraud=true)', 'Conversas privadas da cliente', 'Número completo do cartão, CVV ou senha'].map((t) => (
                
                <li key={t} className="flex items-center gap-2">
                  
                  <X className="h-4 w-4 text-risk" aria-hidden /> {t}
                
                </li>
              ))}
            
            </ul>
          
          </DarkPanel>
        
        </div>
      
      </div>
    
    </div>
  )
}

export function StageContext() {
  const { tx, initial } = useStageTx()
  const { domain } = useDemo()
  if (!tx || !initial) return <MissingStageTx />
  const events = domain.events.filter((e) => e.txId === tx.id && ['InitialRiskCalculated', 'ContextRequested', 'ContextCompleted', 'RelatedCaseFound'].includes(e.name))
  const low = initial.confidence < 50
  const asked = tx.statusLog.some((s) => s.to === 'CONTEXT_REQUIRED') || Boolean(tx.verification)
  const relation = initial.signals.some((s) => s.id === 'DESTINATION_IN_INCIDENT' || s.id === 'SELLER_IN_INCIDENT')
  const answers = tx.verification?.answers

  return (
    
    <div>
      
      <StageHeader n={47} title="Context analysis" lead="A primeira leitura gera risco e confiança. Quando a confiança é baixa, o motor pede contexto em vez de adivinhar." />
      
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        
        <DarkPanel eyebrow="Leitura inicial" title={txTitle(tx)}>
          
          <div className="grid grid-cols-2 gap-4">
            
            <div>
              
              <p className="text-[12px] text-white/50">Risco</p>
              
              <p className="tabular font-display text-[40px] font-semibold leading-none">{initial.score}</p>
              
              <p className={cx('mt-1 text-[12px] font-semibold', levelOnDark[initial.level])}>{riskMeta[initial.level].short}</p>
            
            </div>
            
            <div>
              
              <p className="text-[12px] text-white/50">Confiança</p>
              
              <p className="tabular font-display text-[40px] font-semibold leading-none">{initial.confidence}%</p>
              
              <p className="mt-1 text-[12px] text-white/50">{low ? 'insuficiente para decidir' : 'suficiente'}</p>
            
            </div>
          
          </div>
          
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10" aria-hidden>
            
            <div className="h-full rounded-full bg-trace" style={{ width: `${initial.confidence}%` }} />
          
          </div>
          
          <p className="mt-2 text-[12px] text-white/50">Limiar para pedir contexto: 50% de confiança</p>
        
        </DarkPanel>

        
        <div className="space-y-6">
          {asked ? (
            
            <DarkPanel eyebrow="ContextRequested" title="Perguntas enviadas à cliente">
              
              <ol className="grid gap-3 md:grid-cols-3">
                {verificationQuestions.map((q, i) => {
                  const val = answers?.[q.key as keyof VerificationAnswers]
                  return (
                    
                    <li key={q.key} className="border border-white/10 bg-ink-900 p-4">
                      
                      <p className="font-mono text-[11px] text-white/40">Q{i + 1}</p>
                      
                      <p className="mt-1 text-[14px] leading-snug">{q.prompt}</p>
                      {val && <p className="mt-3 bg-white/5 px-2 py-1 text-[12px] text-trace">“{answerLabel(q.key, val)}”</p>}
                    
                    </li>
                  )
                })}
              
              </ol>
              
              <p className="mt-4 text-[12px] text-white/50">As perguntas não acusam nem bloqueiam. Respostas são voluntárias e entram como evidência declarada.</p>
            
            </DarkPanel>
          ) : (
            
            <DarkPanel eyebrow="Contexto" title={relation ? 'Relação conhecida dispensou perguntas' : 'Contexto não necessário'}>
              
              <p className="text-[14px] text-white/70">
                {relation
                  ? 'O destino da entrega já está associado a um incidente. O motor tem evidência suficiente sem perguntar à cliente.'
                  : 'A confiança da leitura inicial já é alta. A compra segue sem interromper a cliente.'}
              
              </p>
            
            </DarkPanel>
          )}
          
          <DarkPanel title="Eventos deste estágio">
            
            <Trace dark items={events.map((e) => ({ id: e.id, time: formatTime(e.at), title: e.name, detail: e.result, tone: e.tone }))} />
          
          </DarkPanel>
        
        </div>
      
      </div>
    
    </div>
  )
}

export function StageEvidence() {
  const { tx, final } = useStageTx()
  if (!tx || !final) return <MissingStageTx />

  return (
    
    <div>
      <StageHeader
        n={48}
        title="Evidence collection"
        lead="Cada sinal é registrado com origem, momento e confiança. Nada entra na decisão sem ser rastreável."
        aside={
          
          <Link to={`/operations/evidence?tx=${tx.id}`} className="rounded-lg border border-white/15 px-3 py-2 text-[13px] text-white/80 hover:border-white/40 hover:text-white">
            Ver tabela completa em Operations
          
          </Link>
        }
      />
      {final.signals.length === 0 ? (
        
        <DarkPanel>
          
          <p className="text-white/70">Transação sem evidências detalhadas nesta etapa.</p>
        
        </DarkPanel>
      ) : (
        
        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {final.signals.map((s, i) => (
            
            <li key={s.id} className="animate-rise border border-white/10 bg-white/[0.03] p-4" style={{ animationDelay: `${i * 70}ms` }}>
              
              <div className="flex items-center justify-between gap-3">
                
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45">{sourceSpec(s.source).label}</span>
                
                <SignalGlyph state={s.state} />
              
              </div>
              
              <p className="mt-2 text-[14px] font-medium leading-snug">{s.label}</p>
              
              <p className="mt-1 text-[12px] leading-snug text-white/55">{s.detail}</p>
              
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-white/10 pt-3 font-mono text-[11px] text-white/45">
                
                <span>conf. {s.confidence}%</span>
                
                <span>
                  peso {s.points > 0 ? `+${s.points}` : s.points}
                  {s.discounted ? ' · ½' : ''}
                
                </span>
              
              </div>
            
            </li>
          ))}
        
        </ul>
      )}
    
    </div>
  )
}

export function StageDecision() {
  const { tx, initial, final } = useStageTx()
  if (!tx || !final) return <MissingStageTx />
  const applied = final.level

  return (
    
    <div>
      
      <StageHeader n={49} title="Decision generated" lead="A decisão vem de uma política explícita e auditável. Modelos de IA, quando existirem, apoiam a análise — não decidem sozinhos." />
      
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        
        <DarkPanel eyebrow="Risco" title="Leitura inicial → leitura final">
          
          <RiskMeter dark initial={initial} final={final} />
          
          <p className="mt-5 text-[13px] text-white/60">
            Confiança {initial?.confidence ?? final.confidence}% → {final.confidence}% · {tx.verification ? 'contexto recebido' : 'sem pedido de contexto'} · {final.ruleId}
          
          </p>
        
        </DarkPanel>
        
        <section className={cx('border p-6', toneClasses[riskMeta[applied].tone].border, 'bg-white/[0.04]')}>
          
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">Decisão</p>
          
          <p className={cx('font-mono text-[12px] font-semibold', levelOnDark[applied])}>
            {final.score} · {applied}
          
          </p>
          
          <p className="mt-2 font-display text-[30px] font-semibold leading-tight">{decisionMeta[final.decision].label}</p>
          
          <p className="mt-2 text-[14px] text-white/70">{decisionMeta[final.decision].client}</p>
        
        </section>
      
      </div>
      
      <DarkPanel className="mt-6" title="Política de proteção">
        
        <div className="overflow-x-auto scrollbar-thin">
          
          <table className="w-full min-w-[640px] text-left text-[13px]">
            
            <thead>
              
              <tr className="text-[11px] uppercase tracking-[0.08em] text-white/40">
                
                <th className="py-2 pr-4 font-semibold">Faixa</th>
                
                <th className="py-2 pr-4 font-semibold">Score</th>
                
                <th className="py-2 pr-4 font-semibold">Ação</th>
              
              </tr>
            
            </thead>
            
            <tbody>
              {BANDS.map((p) => (
                
                <tr key={p.band} className={cx('border-t border-white/10', p.band === final.band ? 'bg-white/[0.07] text-white' : 'text-white/55')}>
                  
                  <td className="py-2.5 pr-4 font-mono font-semibold">
                    {p.band === final.band && <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-trace align-middle" aria-hidden />}
                    {p.label}
                  
                  </td>
                  
                  <td className="py-2.5 pr-4 font-mono">
                    {p.min}–{p.max}
                  
                  </td>
                  
                  <td className="py-2.5">{p.decision}</td>
                
                </tr>
              ))}
            
            </tbody>
          
          </table>
        
        </div>
      
      </DarkPanel>
    
    </div>
  )
}

export function StageIntervention() {
  const { tx, final } = useStageTx()
  const { domain } = useDemo()
  if (!tx || !final) return <MissingStageTx />
  const customer = getCustomer(tx.customerId)
  const intervened = final.decision === 'INTERVENE' || final.decision === 'BLOCK'
  const outcome = domain.events.find((e) => e.txId === tx.id && (e.name === 'TransactionCancelled' || e.name === 'TransactionAuthorized'))

  return (
    
    <div>
      
      <StageHeader n={50} title="Intervention triggered" lead="Quando a política pede intervenção, a cliente vê uma pausa clara e humana. O sistema registra tudo — a cliente não vê pontuações." />
      {!intervened ? (
        
        <DarkPanel title="Nenhuma intervenção nesta compra">
          
          <p className="text-[14px] text-white/70">
            A decisão foi “{decisionMeta[final.decision].label}”. {customer?.firstName} concluiu a compra sem interrupções.
          
          </p>
        
        </DarkPanel>
      ) : (
        
        <div className="grid gap-6 lg:grid-cols-2">
          
          <div>
            
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">O que {customer?.firstName} vê</p>
            
            <div className="rounded-[28px] border border-white/10 bg-paper p-6 text-ink-900 shadow-pop">
              
              <p className="text-[12px] font-medium text-warn-ink">{final.decision === 'BLOCK' ? 'Compra interrompida' : 'Compra pausada'}</p>
              
              <p className="mt-2 font-display text-[20px] font-semibold leading-snug">
                {final.decision === 'BLOCK' ? 'Interrompemos esta compra para proteger você.' : 'Identificamos sinais que merecem atenção.'}
              
              </p>
              
              <ul className="mt-4 space-y-2">
                {final.signals
                  .filter((s) => s.state !== 'ok' && s.clientLabel)
                  .slice(0, 4)
                  .map((s) => (
                    
                    <li key={s.id} className="flex items-center gap-2 text-[13px]">
                      
                      <SignalGlyph state={s.state} /> {s.clientLabel}
                    
                    </li>
                  ))}
              
              </ul>
              
              <div className="mt-5 grid gap-2">
                
                <span className="rounded-lg bg-ink-900 px-4 py-2.5 text-center text-[13px] font-medium text-white">{final.decision === 'BLOCK' ? 'Fui vítima de golpe' : 'Interromper compra'}</span>
                
                <span className="rounded-lg border border-line-strong px-4 py-2.5 text-center text-[13px]">{final.decision === 'BLOCK' ? 'Ver no app do cartão' : 'Falar com a central do cartão'}</span>
              
              </div>
            
            </div>
          
          </div>
          
          <div className="space-y-4">
            
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">O que o sistema registra</p>
            <EventEnvelope
              name="InterventionTriggered"
              fields={[
                ['correlationId', <span className="text-trace">{tx.correlationId}</span>],
                ['transactionId', tx.id],
                ['riskFinal', `${final.score} · ${final.level}`],
                ['confidence', `${final.confidence}%`],
                ['ruleId', final.ruleId],
                ['decidedBy', 'Política de proteção (não IA)'],
              ]}
            />
            
            <DarkPanel title="Resultado">
              
              <p className="text-[14px] text-white/75">
                {outcome ? `${formatTime(outcome.at)} · ${outcome.name} — ${outcome.result}` : 'Aguardando a decisão da cliente.'}
              
              </p>
            
            </DarkPanel>
            
            <p className="flex items-center gap-2 text-[12px] text-white/45">
              
              <Minus className="h-3.5 w-3.5" aria-hidden /> A intervenção reduz o risco; não garante que todo golpe será identificado.
            
            </p>
          
          </div>
        
        </div>
      )}
    
    </div>
  )
}
