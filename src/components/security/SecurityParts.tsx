import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import type { Card, Transaction } from '../../types/domain'
import { useDemo } from '../../context/DemoContext'
import { addressLine, cardFor, getAddress, getCard } from '../../mocks/people'
import { clientAlerts, type ClientAlert } from '../../services/clientAlerts'
import { txMerchantLabel, txTitle } from '../../services/present'
import { isAwaitingCustomer } from '../../services/status'
import { toneClasses } from '../../services/labels'
import { StatusBadge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { ErrorState } from '../ui/Feedback'
import { cx, formatBRL, formatDateTime, formatShortDate } from '../../utils/format'
export function useViewerData() {
  const { viewer, transactions, incidents } = useDemo()
  // Declara a constante/variável card e atribui a ela o resultado da expressão desta linha.
  const card = cardFor(viewer.id)
  // Declara a constante/variável mine e atribui a ela o resultado da expressão desta linha.
  const mine = transactions.filter((t) => t.customerId === viewer.id)
  // Declara a constante/variável pending e atribui a ela o resultado da expressão desta linha.
  const pending = mine.filter((t) => isAwaitingCustomer(t.status))
  // Declara a constante/variável alerts e atribui a ela o resultado da expressão desta linha.
  const alerts = clientAlerts(viewer.id, transactions, incidents)
  // Declara a constante/variável myIncidents e atribui a ela o resultado da expressão desta linha.
  const myIncidents = incidents.filter((i) => i.customerId === viewer.id)
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return { viewer, card, mine, pending, alerts, myIncidents }
}
export function CardVisual({ card, className }: { card: Card; className?: string }) {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <div className={cx('relative aspect-[1.586] w-full max-w-[360px] overflow-hidden rounded-2xl bg-aureon-deep p-5 text-white shadow-pop', className)}>
      
      <svg className="absolute inset-0 h-full w-full opacity-[0.16]" viewBox="0 0 360 227" preserveAspectRatio="none" aria-hidden>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          
          <path key={i} d={`M${-40 + i * 34} 240 C ${80 + i * 30} ${140 - i * 10}, ${200 + i * 20} ${120 - i * 14}, ${400} ${20 + i * 18}`} stroke="#E9DCC4" strokeWidth="1" fill="none" />
        ))}
      
      </svg>
      
      <div className="relative flex h-full flex-col justify-between">
        
        <div className="flex items-start justify-between">
          
          <span className="font-display text-[15px] font-semibold tracking-[-0.01em]">Aureon</span>
          
          <span className="text-[11px] uppercase tracking-[0.18em] text-aureon-brass">{card.product.replace('Aureon ', '')}</span>
        
        </div>
        
        <div className="h-7 w-10 rounded-md bg-gradient-to-br from-[#D9C59E] to-[#A88A5A]" aria-hidden />
        
        <div>
          
          <p className="font-mono text-[16px] tracking-[0.2em]">•••• •••• •••• {card.last4}</p>
          
          <div className="mt-2 flex items-end justify-between text-[11px] text-white/70">
            
            <span className="uppercase tracking-wider">{card.holder}</span>
            
            <span>{card.expiry}</span>
          
          </div>
        
        </div>
      
      </div>
      
      <span className="sr-only">
        Cartão {card.product} final {card.last4}
      
      </span>
    
    </div>
  )
}

export function PurchaseRow({ tx }: { tx: Transaction }) {
  const label = txMerchantLabel(tx)
  const stopped = tx.status === 'CANCELLED' || tx.status === 'BLOCKED'
  return (
    
    <li>
      
      <Link to={`/security/transactions/${tx.id}`} className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-aureon-mist/60">
        
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-aureon-mist text-[12px] font-semibold text-aureon-deep" aria-hidden>
          {label.slice(0, 1)}
        
        </span>
        
        <div className="min-w-0 flex-1">
          
          <p className="truncate text-[14px] font-medium">{label}</p>
          
          <p className="truncate text-[12px] text-muted">
            {txTitle(tx)} · {formatShortDate(tx.createdAt)}
          
          </p>
        
        </div>
        
        <div className="flex flex-col items-end gap-1">
          
          <span className={cx('tabular text-[14px] font-medium', stopped && 'text-subtle line-through')}>{formatBRL(tx.amount)}</span>
          {tx.status !== 'APPROVED' && <StatusBadge status={tx.status} audience="client" size="sm" />}
        
        </div>
        
        <ChevronRight className="h-4 w-4 shrink-0 text-subtle" aria-hidden />
      
      </Link>
    
    </li>
  )
}

export function AlertRow({ alert }: { alert: ClientAlert }) {
  const t = toneClasses[alert.tone]
  return (
    
    <li>
      
      <Link to={alert.to} className="flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-aureon-mist/60">
        
        <span className={cx('mt-1.5 h-2 w-2 shrink-0 rounded-full', t.dot)} aria-hidden />
        
        <div className="min-w-0 flex-1">
          
          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
            
            <p className="text-[14px] font-medium">{alert.title}</p>
            
            <span className="shrink-0 text-[12px] text-subtle">{formatDateTime(alert.at)}</span>
          
          </div>
          
          <p className="mt-0.5 text-[13px] leading-snug text-muted">{alert.body}</p>
          
          <span className={cx('mt-1.5 inline-block text-[13px] font-medium', t.text)}>{alert.cta} →</span>
        
        </div>
      
      </Link>
    
    </li>
  )
}

export function SecTitle({ title, description, action }: { title: string; description?: ReactNode; action?: ReactNode }) {
  return (
    
    <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
      
      <div>
        
        <h1 className="font-display text-[26px] font-semibold tracking-[-0.02em]">{title}</h1>
        {description && <p className="mt-1 text-[14px] text-muted">{description}</p>}
      
      </div>
      {action}
    
    </header>
  )
}

export function PurchaseSummary({ tx }: { tx: Transaction }) {
  const card = getCard(tx.cardId)
  const address = getAddress(tx.addressId)
  return (
    
    <div className="rounded-xl bg-aureon-mist p-4 text-[14px]">
      
      <div className="flex items-baseline justify-between gap-3">
        
        <span className="font-medium">{txMerchantLabel(tx)}</span>
        
        <span className="tabular font-semibold">{formatBRL(tx.amount)}</span>
      
      </div>
      
      <p className="mt-0.5 text-[13px] text-muted">
        {txTitle(tx)} · cartão •••• {card?.last4} · {formatDateTime(tx.createdAt)}
      
      </p>
      {address && <p className="mt-0.5 text-[13px] text-muted">Entrega: {addressLine(address)}</p>}
    
    </div>
  )
}

export function NotThisAccount({ title = 'Compra não encontrada' }: { title?: string }) {
  return (
    <ErrorState
      title={title}
      description="Ela não pertence a esta conta ou o endereço está incorreto."
      action={
        
        <Button variant="secondary" to="/security/transactions">
          Ver minhas compras
        
        </Button>
      }
    />
  )
}

export function protectionSummary(tx: Transaction): string {
  switch (tx.status) {
    case 'RECEIVED':
    case 'ANALYZING':
      return 'A compra está sendo conferida.'
    case 'CONTEXT_REQUIRED':
      return 'Antes de concluir, precisamos confirmar alguns detalhes com você. Nada foi cobrado.'
    case 'APPROVED':
      return tx.verification ? 'Pedimos uma confirmação rápida e, com as suas respostas, a compra foi aprovada.' : 'A compra foi conferida automaticamente e aprovada.'
    case 'APPROVED_WITH_ALERT':
      return tx.interventionChoice === 'continued'
        ? 'Pausamos a compra e você decidiu continuar. Ela foi aprovada, e seguimos à disposição se algo parecer errado.'
        : 'A compra foi aprovada, mas alguns detalhes são diferentes do seu costume. Confira se foi você.'
    case 'INTERVENTION':
      return 'Pausamos a compra porque ela tem características que aparecem quando alguém orienta outra pessoa a comprar. Ela só continua com a sua decisão.'
    case 'CANCELLED':
      return 'A compra foi interrompida antes do pagamento. Nenhum valor foi cobrado.'
    case 'BLOCKED':
      return 'Interrompemos a compra por precaução, antes do pagamento. Nenhum valor foi cobrado.'
    case 'INCIDENT_RECORDED':
      return 'Você registrou um relato sobre esta compra. A equipe de segurança está acompanhando o caso.'
  }
}
