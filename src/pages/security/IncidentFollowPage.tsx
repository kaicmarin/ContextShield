import { useParams } from 'react-router-dom'
import { useDemo } from '../../context/DemoContext'
import { IDS } from '../../mocks/ids'
import { incidentChannelLabel, incidentTypeLabel } from '../../mocks/incidents'
import { Trace, type TraceItem } from '../../components/ui/Trace'
import { Breadcrumbs } from '../../components/ui/Navigation'
import { ErrorState } from '../../components/ui/Feedback'
import { KeyValue } from '../../components/ui/Surface'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { formatBRL, formatDateTime, formatTime } from '../../utils/format'
import { getMerchant } from '../../mocks/merchants'
export function IncidentFollowPage() {
  const { id = '' } = useParams()
  const { getIncident, getTx, transactions, viewer } = useDemo()
  // Declara a constante/variável incident e atribui a ela o resultado da expressão desta linha.
  const incident = getIncident(id)

  // Verifica a condição antes de executar o bloco seguinte.
  if (!incident || incident.customerId !== viewer.id) {
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return (
      <ErrorState
        title="Relato não encontrado"
        description="Confira o número do protocolo."
        action={
          
          <Button variant="secondary" to="/security/report">
            Fui vítima
          
          </Button>
        }
      />
    )
  }

  const closed = incident.status === 'CLOSED'
  const tx = getTx(incident.txId)
  const items: TraceItem[] = [
    { id: 'reg', time: formatTime(incident.createdAt, false), title: 'Relato registrado', detail: `Protocolo ${incident.id}`, state: 'done', tone: 'ok' },
    { id: 'read', time: formatTime(incident.createdAt, false), title: 'Informações organizadas', detail: 'Os dados do contato e da entrega foram separados para análise.', state: 'done', tone: 'ok' },
    { id: 'team', title: 'Caso com a equipe de segurança', detail: 'Uma analista está acompanhando o seu caso.', state: closed ? 'done' : 'current', tone: 'info' },
  ]
  const related = transactions.find((t) => t.customerId === IDS.mariana && t.scenario === 'related')
  if (related) {
    items.push({
      id: 'help',
      time: formatTime(related.createdAt, false),
      title: 'Seu relato ajudou outra pessoa',
      detail: 'Uma compra parecida foi interrompida antes do pagamento, com base nas informações que você enviou.',
      state: 'done',
      tone: 'trace',
    })
  }
  items.push({ id: 'answer', title: 'Resposta final', detail: 'Você recebe o resultado da análise por aqui.', state: closed ? 'done' : 'pending' })

  return (
    
    <div className="space-y-6">
      
      <Breadcrumbs items={[{ label: 'Fui vítima', to: '/security/report' }, { label: incident.id }]} />
      
      <header className="flex flex-wrap items-end justify-between gap-3">
        
        <div>
          
          <p className="font-mono text-[13px] text-muted">{incident.id}</p>
          
          <h1 className="font-display text-[26px] font-semibold tracking-[-0.02em]">Acompanhamento do relato</h1>
        
        </div>
        
        <Badge tone={closed ? 'neutral' : 'warn'}>{closed ? 'Encerrado' : 'Em análise'}</Badge>
      
      </header>

      
      <section className="border-y border-line py-6" aria-label="Andamento">
        
        <Trace items={items} />
      
      </section>

      
      <section aria-label="Resumo">
        <KeyValue
          columns={2}
          items={[
            { label: 'O que aconteceu', value: incidentTypeLabel[incident.type] },
            { label: 'Compra', value: tx ? `${getMerchant(tx.merchantId)?.name} · ${formatBRL(tx.amount)}` : 'Sem compra vinculada' },
            { label: 'Registrado em', value: formatDateTime(incident.createdAt) },
            { label: 'Canal do contato', value: incidentChannelLabel[incident.channel] },
          ]}
        />
        
        <p className="mt-5 border-t border-line pt-4 text-[14px] leading-relaxed text-ink-800/85">“{incident.description}”</p>
      
      </section>

      
      <div className="rounded-2xl bg-aureon-deep p-5 text-[14px] text-white/80">
        
        <p className="font-medium text-white">Enquanto isso</p>
        
        <p className="mt-1">Não responda à pessoa que entrou em contato. Se receber novas mensagens, você pode conferi-las em “Antes de pagar”.</p>
        
        <Button size="sm" variant="inverse" className="mt-3" to="/security/check">
          Verificar uma mensagem
        
        </Button>
      
      </div>
    
    </div>
  )
}
