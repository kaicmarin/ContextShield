import { useEffect, type ReactNode } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { Check, Clock, HeartHandshake, Lock } from 'lucide-react'
import { useDemo } from '../../../context/DemoContext'
import { incidentChannelLabel, incidentChannels, incidentTypeHint, incidentTypeLabel, incidentTypes } from '../../../mocks/incidents'
import { getMerchant } from '../../../mocks/merchants'
import { txTitle } from '../../../services/present'
import type { IncidentChannel, IncidentType } from '../../../types/domain'
import { Alert } from '../../../components/ui/Feedback'
import { Button } from '../../../components/ui/Button'
import { Checkbox, ChoiceCard, Field, Input, Select, Textarea } from '../../../components/ui/Form'
import { Stepper } from '../../../components/ui/Navigation'
import { formatBRL, formatDateTime } from '../../../utils/format'

// a constante/variável steps e atribui a ela o resultado da expressão desta linha.
const steps = ['Tipo', 'Compra', 'Relato', 'Revisão']

// a constante/variável whenOptions e atribui a ela o resultado da expressão desta linha.
const whenOptions = [
  { value: '2026-09-28T14:18:00', label: 'Hoje, entre 14h e 15h' },
  { value: '2026-09-28T10:00:00', label: 'Hoje, mais cedo' },
  { value: '2026-09-27T12:00:00', label: 'Ontem' },
  { value: '2026-09-24T12:00:00', label: 'Nos últimos 7 dias' },
]

// a função ReportFrame. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function ReportFrame({ step, title, description, children }: { step: number; title: string; description?: string; children: ReactNode }) {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <div>
      
      <p className="mb-4 text-[13px] text-muted">
        
        <Link to="/security/report" className="hover:underline">
          Fui vítima
        
        </Link>{' '}
        · etapa {step + 1} de {steps.length}
      
      </p>
      
      <div className="mb-8">
        
        <Stepper steps={steps} current={step} />
      
      </div>
      
      <h1 className="font-display text-[24px] font-semibold leading-snug tracking-[-0.02em]">{title}</h1>
      {description && <p className="mt-1.5 text-[14px] text-muted">{description}</p>}
      
      <div className="mt-6">{children}</div>
    
    </div>
  )
}

function Nav({ back, next, disabled, nextLabel = 'Continuar' }: { back: string; next?: () => void; disabled?: boolean; nextLabel?: string }) {
  return (
    
    <div className="mt-8 flex items-center justify-between gap-3">
      
      <Button variant="ghost" to={back}>
        Voltar
      
      </Button>
      
      <Button onClick={next} disabled={disabled}>
        {nextLabel}
      
      </Button>
    
    </div>
  )
}

export function ReportIntroPage() {
  const [params] = useSearchParams()
  const { setIncidentForm, incidents, viewer } = useDemo()
  const txParam = params.get('tx')
  const existing = incidents.find((i) => i.customerId === viewer.id && i.status !== 'CLOSED')

  useEffect(() => {
    if (txParam) setIncidentForm({ txId: txParam })
  }, [txParam, setIncidentForm])

  return (
    
    <div>
      
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-aureon-deep text-white">
        
        <HeartHandshake className="h-6 w-6" aria-hidden />
      
      </span>
      
      <h1 className="mt-5 font-display text-[30px] font-semibold leading-tight tracking-[-0.02em]">Sentimos muito. Vamos ajudar você com isso.</h1>
      
      <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-ink-800/85">
        Golpes são planejados para enganar qualquer pessoa. Conte o que aconteceu para ajudarmos a registrar o caso — isso também ajuda a reconhecer o mesmo golpe em outras compras.
      
      </p>

      {existing && (
        
        <Alert tone="trace" className="mt-6" title={`Você já tem um relato em andamento: ${existing.id}`} action={<Button size="sm" variant="secondary" to={`/security/incidents/${existing.id}`}>Acompanhar relato</Button>}>
          Você pode acompanhar o andamento ou registrar um novo relato sobre outra compra.
        
        </Alert>
      )}

      
      <ul className="mt-8 space-y-3 text-[14px]">
        {[
          { icon: <Clock className="h-4 w-4" />, text: 'Leva cerca de 3 minutos. Você pode voltar a qualquer etapa.' },
          { icon: <Lock className="h-4 w-4" />, text: 'Não pedimos senha, código ou dados do cartão.' },
          { icon: <Check className="h-4 w-4" />, text: 'Você recebe um protocolo e acompanha tudo por aqui.' },
        ].map((i) => (
          
          <li key={i.text} className="flex items-center gap-3">
            
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-paper text-aureon-deep">{i.icon}</span>
            {i.text}
          
          </li>
        ))}
      
      </ul>

      
      <Alert tone="warn" className="mt-8" title="Se o golpe ainda está acontecendo">
        Encerre o contato com a pessoa agora. Se precisar, bloqueie o cartão em{' '}
        
        <Link to="/security/cards" className="font-medium underline">
          Cartões
        
        </Link>
        .
      
      </Alert>

      
      <div className="mt-8">
        
        <Button size="lg" to="/security/report/type">
          Começar relato
        
        </Button>
      
      </div>
    
    </div>
  )
}

export function ReportTypePage() {
  const { incidentForm, setIncidentForm } = useDemo()
  const navigate = useNavigate()
  return (
    
    <ReportFrame step={0} title="O que aconteceu?" description="Escolha a opção que mais se parece com a sua situação.">
      
      <div className="space-y-2.5">
        {incidentTypes.map((t) => (
          
          <ChoiceCard key={t} name="type" value={t} checked={incidentForm.type === t} onChange={(v) => setIncidentForm({ type: v as IncidentType })} title={incidentTypeLabel[t]} description={incidentTypeHint[t]} />
        ))}
      
      </div>
      
      <Nav back="/security/report" disabled={!incidentForm.type} next={() => navigate('/security/report/transaction')} />
    
    </ReportFrame>
  )
}

export function ReportTransactionPage() {
  const { incidentForm, setIncidentForm, transactions, viewer } = useDemo()
  const navigate = useNavigate()
  if (!incidentForm.type) return <Navigate to="/security/report/type" replace />
  const mine = transactions.filter((t) => t.customerId === viewer.id)

  return (
    
    <ReportFrame step={1} title="Qual compra está envolvida?" description="Mostramos as compras recentes do seu cartão, inclusive as que não foram concluídas.">
      
      <div className="space-y-2.5">
        {mine.map((t) => (
          <ChoiceCard
            key={t.id}
            name="tx"
            value={t.id}
            checked={incidentForm.txId === t.id}
            onChange={(v) => setIncidentForm({ txId: v })}
            title={`${getMerchant(t.merchantId)?.name ?? 'Compra'} · ${formatBRL(t.amount)}`}
            description={`${t.items.length > 0 ? `${txTitle(t)} · ` : ''}${formatDateTime(t.createdAt)}${t.status === 'CANCELLED' ? ' · não concluída' : ''}`}
          />
        ))}
        <ChoiceCard
          name="tx"
          value="none"
          checked={incidentForm.txId === 'none'}
          onChange={() => setIncidentForm({ txId: 'none' })}
          title="Não estou vendo a compra na lista"
          description="Você ainda pode registrar o relato. Conte o que lembrar na próxima etapa."
        />
      
      </div>
      
      <Nav back="/security/report/type" disabled={!incidentForm.txId} next={() => navigate('/security/report/description')} />
    
    </ReportFrame>
  )
}

export function ReportDescriptionPage() {
  const { incidentForm, setIncidentForm } = useDemo()
  const navigate = useNavigate()
  if (!incidentForm.type) return <Navigate to="/security/report/type" replace />
  if (!incidentForm.txId) return <Navigate to="/security/report/transaction" replace />
  const text = incidentForm.description ?? ''

  return (
    
    <ReportFrame step={2} title="Conte com suas palavras" description="Não precisa ser detalhado. Escreva o que lembrar.">
      
      <div className="space-y-5">
        
        <Field label="O que aconteceu?" htmlFor="rep-desc" hint={`${text.length}/1000 caracteres · mínimo de 20`}>
          <Textarea
            id="rep-desc"
            maxLength={1000}
            value={text}
            onChange={(e) => setIncidentForm({ description: e.target.value })}
            placeholder="Ex.: recebi uma mensagem dizendo ser do banco e me pediram para comprar um produto…"
          />
        
        </Field>
        
        <div className="grid gap-4 sm:grid-cols-2">
          
          <Field label="Quando foi?" htmlFor="rep-when">
            
            <Select id="rep-when" value={incidentForm.occurredAt ?? whenOptions[0].value} onChange={(e) => setIncidentForm({ occurredAt: e.target.value })}>
              {whenOptions.map((o) => (
                
                <option key={o.value} value={o.value}>
                  {o.label}
                
                </option>
              ))}
            
            </Select>
          
          </Field>
          
          <Field label="Como entraram em contato?" htmlFor="rep-channel">
            
            <Select id="rep-channel" value={incidentForm.channel ?? 'whatsapp'} onChange={(e) => setIncidentForm({ channel: e.target.value as IncidentChannel })}>
              {incidentChannels.map((c) => (
                
                <option key={c} value={c}>
                  {incidentChannelLabel[c]}
                
                </option>
              ))}
            
            </Select>
          
          </Field>
          
          <Field label="Telefone ou perfil que falou com você" htmlFor="rep-handle" optional>
            
            <Input id="rep-handle" value={incidentForm.contactHandle ?? ''} onChange={(e) => setIncidentForm({ contactHandle: e.target.value })} placeholder="(11) 90000-0000" />
          
          </Field>
          
          <Field label="Link ou site enviado" htmlFor="rep-link" optional>
            
            <Input id="rep-link" value={incidentForm.contactLink ?? ''} onChange={(e) => setIncidentForm({ contactLink: e.target.value })} placeholder="site.example" />
          
          </Field>
          
          <Field label="Endereço ou destino que pediram" htmlFor="rep-dest" optional>
            
            <Input id="rep-dest" value={incidentForm.destinationText ?? ''} onChange={(e) => setIncidentForm({ destinationText: e.target.value })} placeholder="Rua, número, ponto de retirada" />
          
          </Field>
        
        </div>
        <button
          type="button"
          className="text-[13px] font-medium text-signal-ink hover:underline"
          onClick={() =>
            setIncidentForm({
              description:
                'Recebi mensagens de uma “Central de Segurança” dizendo que meu cartão tinha uma operação suspeita. Pediram para eu comprar um notebook na NEXA e entregar na Rua Tuiuti, 880 para cancelar a operação.',
              contactHandle: '(11) 94000-2184',
              contactLink: 'aureon-protecao.example',
              channel: 'whatsapp',
              destinationText: 'Rua Tuiuti, 880',
              occurredAt: whenOptions[0].value,
            })
          }
        >
          Preencher com o relato da demonstração
        
        </button>
      
      </div>
      
      <Nav back="/security/report/transaction" disabled={text.trim().length < 20} next={() => navigate('/security/report/review')} />
    
    </ReportFrame>
  )
}

export function ReportReviewPage() {
  const { incidentForm, setIncidentForm, getTx, submitIncident } = useDemo()
  const navigate = useNavigate()
  if (!incidentForm.type) return <Navigate to="/security/report/type" replace />
  if (!incidentForm.txId) return <Navigate to="/security/report/transaction" replace />
  if (!incidentForm.description || incidentForm.description.trim().length < 20) return <Navigate to="/security/report/description" replace />

  const tx = incidentForm.txId === 'none' ? undefined : getTx(incidentForm.txId)
  const channel = incidentForm.channel ?? 'whatsapp'
  const rows = [
    { k: 'O que aconteceu', v: incidentTypeLabel[incidentForm.type], to: '/security/report/type' },
    { k: 'Compra', v: tx ? `${getMerchant(tx.merchantId)?.name ?? 'Compra'} · ${formatBRL(tx.amount)} · ${formatDateTime(tx.createdAt)}` : 'Não encontrada na lista', to: '/security/report/transaction' },
    { k: 'Seu relato', v: incidentForm.description, to: '/security/report/description' },
    { k: 'Contato', v: [incidentChannelLabel[channel], incidentForm.contactHandle, incidentForm.contactLink, incidentForm.destinationText].filter(Boolean).join(' · '), to: '/security/report/description' },
  ]

  return (
    
    <ReportFrame step={3} title="Revise antes de enviar">
      
      <div className="divide-y divide-line rounded-2xl border border-line bg-paper">
        {rows.map((r) => (
          
          <div key={r.k} className="flex items-start justify-between gap-4 p-4">
            
            <div className="min-w-0">
              
              <p className="text-[12px] text-muted">{r.k}</p>
              
              <p className="mt-0.5 whitespace-pre-line break-words text-[14px]">{r.v}</p>
            
            </div>
            
            <Link to={r.to} className="shrink-0 text-[13px] text-muted hover:text-ink-900 hover:underline">
              Editar
            
            </Link>
          
          </div>
        ))}
      
      </div>
      
      <div className="mt-6">
        
        <Checkbox checked={Boolean(incidentForm.consent)} onChange={(v) => setIncidentForm({ consent: v })}>
          Confirmo que as informações são verdadeiras e autorizo o uso delas para analisar meu caso e proteger outros clientes.
        
        </Checkbox>
      
      </div>
      <Nav
        back="/security/report/description"
        disabled={!incidentForm.consent}
        nextLabel="Enviar relato"
        next={() => {
          const id = submitIncident()
          if (id) navigate(`/security/report/done?id=${id}`, { replace: true })
        }}
      />
    
    </ReportFrame>
  )
}

export function ReportDonePage() {
  const [params] = useSearchParams()
  const { getIncident, incidents, viewer } = useDemo()
  const incident = getIncident(params.get('id') ?? '') ?? incidents.find((i) => i.customerId === viewer.id)

  if (!incident) return <Navigate to="/security/report" replace />

  return (
    
    <div className="rounded-2xl border border-line bg-paper p-6 sm:p-10">
      
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ok text-white">
        
        <Check className="h-6 w-6" aria-hidden />
      
      </span>
      
      <h1 className="mt-5 font-display text-[28px] font-semibold tracking-[-0.02em]">Relato registrado</h1>
      
      <p className="mt-2 max-w-md text-[15px] text-muted">Obrigado por contar. Você fez a coisa certa — isso ajuda a proteger outras pessoas.</p>

      
      <dl className="mt-6 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
        
        <div className="bg-paper p-4">
          
          <dt className="text-[12px] text-muted">Protocolo</dt>
          
          <dd className="mt-0.5 font-mono text-[14px] font-medium">{incident.id}</dd>
        
        </div>
        
        <div className="bg-paper p-4">
          
          <dt className="text-[12px] text-muted">Situação</dt>
          
          <dd className="mt-0.5 text-[14px] font-medium text-warn-ink">Em análise</dd>
        
        </div>
        
        <div className="bg-paper p-4">
          
          <dt className="text-[12px] text-muted">Registrado em</dt>
          
          <dd className="mt-0.5 text-[14px] font-medium">{formatDateTime(incident.createdAt)}</dd>
        
        </div>
      
      </dl>

      
      <div className="mt-6 text-[14px]">
        
        <p className="font-medium">Próximos passos</p>
        
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-muted">
          
          <li>Nossa equipe analisa o relato em até 2 dias úteis.</li>
          
          <li>Se precisarmos de algo, avisamos por aqui — nunca por ligação pedindo dados.</li>
          
          <li>Você acompanha cada atualização pelo protocolo.</li>
        
        </ol>
      
      </div>

      
      <div className="mt-8 flex flex-col gap-2 sm:flex-row">
        
        <Button to={`/security/incidents/${incident.id}`}>Acompanhar relato</Button>
        
        <Button variant="secondary" to="/security">
          Voltar ao início
        
        </Button>
      
      </div>
    
    </div>
  )
}
