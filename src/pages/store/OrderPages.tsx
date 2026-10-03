import { Link, useParams } from 'react-router-dom'
import { Check, ChevronRight, Package } from 'lucide-react'
import type { Transaction } from '../../types/domain'
import { useDemo } from '../../context/DemoContext'
import { IDS } from '../../mocks/ids'
import { addressFull, getAddress, getCard, getCustomer } from '../../mocks/people'
import { getProductById } from '../../mocks/products'
import { getSeller } from '../../mocks/sellers'
import { deliveryEstimate, orderStatusMeta, txTitle } from '../../services/present'
import { ProductArt } from '../../components/store/ProductArt'
import { SellerLine, SummaryLines } from '../../components/store/StoreParts'
import { ProtectedBy } from '../../components/brand/Brand'
import { Badge } from '../../components/ui/Badge'
import { Breadcrumbs } from '../../components/ui/Navigation'
import { EmptyState, ErrorState } from '../../components/ui/Feedback'
import { Button } from '../../components/ui/Button'
import { cx, formatBRL, formatDate, formatDateTime, installmentText } from '../../utils/format'

// a função OrderNotFound. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function OrderNotFound({ orderId }: { orderId: string }) {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <div className="mx-auto max-w-stage px-4 py-16 lg:px-8">
      <ErrorState
        title="Pedido não encontrado"
        description={`Não encontramos o pedido ${orderId || 'informado'}.`}
        action={
          
          <Button variant="store" to="/store/orders">
            Ver meus pedidos
          
          </Button>
        }
      />
    
    </div>
  )
}

function ItemsList({ tx }: { tx: Transaction }) {
  return (
    
    <ul className="divide-y divide-nexa-stone">
      {tx.items.map((i) => {
        const p = getProductById(i.productId)
        if (!p) return null
        return (
          
          <li key={i.productId} className="flex items-center gap-4 py-4">
            
            <ProductArt product={p} size="sm" className="w-16 shrink-0" />
            
            <div className="min-w-0 flex-1">
              
              <Link to={`/store/product/${p.id}`} className="font-medium hover:underline">
                {p.name}
              
              </Link>
              
              <SellerLine sellerId={i.sellerId} className="mt-0.5 block" />
              
              <p className="text-[13px] text-muted">Qtd. {i.quantity}</p>
            
            </div>
            
            <p className="tabular shrink-0 text-[14px]">{formatBRL(i.unitPrice * i.quantity)}</p>
          
          </li>
        )
      })}
    
    </ul>
  )
}

function OrderFacts({ tx }: { tx: Transaction }) {
  const address = getAddress(tx.addressId)
  const card = getCard(tx.cardId)
  return (
    
    <dl className="space-y-4 rounded-2xl border border-nexa-stone bg-white p-5 text-[14px]">
      
      <div>
        
        <dt className="text-[12px] text-muted">Entrega</dt>
        
        <dd className="mt-0.5">{address ? addressFull(address) : '—'}</dd>
      
      </div>
      
      <div>
        
        <dt className="text-[12px] text-muted">Pagamento</dt>
        
        <dd className="mt-0.5">
          {card ? `${card.product} •••• ${card.last4}` : '—'}
          
          <span className="block text-[13px] text-muted">{tx.installments <= 1 ? 'À vista' : installmentText(tx.amount, tx.installments)}</span>
        
        </dd>
      
      </div>
      
      <div>
        
        <dt className="text-[12px] text-muted">Feito em</dt>
        
        <dd className="mt-0.5">{formatDateTime(tx.createdAt)}</dd>
      
      </div>
    
    </dl>
  )
}

export function OrderConfirmationPage() {
  const { orderId = '' } = useParams()
  const { getTxByOrder } = useDemo()
  const tx = getTxByOrder(orderId)
  if (!tx) return <OrderNotFound orderId={orderId} />

  const customer = getCustomer(tx.customerId)
  const meta = orderStatusMeta[tx.status]
  const paid = meta.phase === 'paid'

  return (
    
    <div className="mx-auto max-w-[860px] px-4 pt-10 lg:px-8">
      
      <div className="flex items-start gap-4">
        
        <span className={cx('flex h-11 w-11 shrink-0 items-center justify-center rounded-full', paid ? 'bg-ok text-white' : 'bg-nexa-stone text-nexa-char')}>
          {paid ? <Check className="h-5 w-5" strokeWidth={2.5} aria-hidden /> : <Package className="h-5 w-5" aria-hidden />}
        
        </span>
        
        <div>
          
          <p className="text-[13px] text-muted">Pedido {tx.orderId}</p>
          
          <h1 className="font-display text-[28px] font-semibold tracking-[-0.02em]">
            {paid ? `Obrigado, ${customer?.firstName ?? 'cliente'}! Pedido confirmado.` : meta.phase === 'pending' ? 'Pedido aguardando pagamento.' : 'Este pedido não foi concluído.'}
          
          </h1>
          
          <p className="mt-1 text-[14px] text-muted">
            {paid
              ? `Enviamos o resumo para ${customer?.email ?? 'seu e-mail'}. Previsão de entrega: ${formatDate(deliveryEstimate(tx))}.`
              : meta.phase === 'pending'
                ? 'O pagamento ainda depende de uma confirmação sua com o emissor do cartão.'
                : 'O pagamento não foi autorizado e nenhum valor foi cobrado.'}
          
          </p>
        
        </div>
      
      </div>

      
      <div className="mt-8 grid gap-6 md:grid-cols-[1fr_300px]">
        
        <section className="rounded-2xl border border-nexa-stone bg-white p-6" aria-labelledby="conf-items">
          
          <h2 id="conf-items" className="font-display text-[16px] font-semibold">
            Itens
          
          </h2>
          
          <ItemsList tx={tx} />
          
          <div className="border-t border-nexa-stone pt-4">
            
            <SummaryLines subtotal={tx.amount - tx.shipping} shipping={tx.shipping} total={tx.amount} />
          
          </div>
        
        </section>
        
        <aside className="space-y-4">
          
          <OrderFacts tx={tx} />
          
          <ProtectedBy className="px-1" />
        
        </aside>
      
      </div>

      
      <div className="mt-8 flex flex-wrap gap-2">
        
        <Button variant="store" to={`/store/orders/${tx.orderId}`}>
          Acompanhar pedido
        
        </Button>
        
        <Button variant="secondary" to="/store">
          Continuar comprando
        
        </Button>
      
      </div>
    
    </div>
  )
}

type StepState = 'done' | 'current' | 'pending' | 'stopped'

function stepsFor(tx: Transaction): { label: string; detail?: string; state: StepState }[] {
  const meta = orderStatusMeta[tx.status]
  const received = { label: 'Pedido recebido', detail: formatDateTime(tx.createdAt), state: 'done' as StepState }
  if (meta.phase === 'stopped') {
    return [received, { label: tx.status === 'BLOCKED' ? 'Pagamento não autorizado pelo emissor' : 'Compra interrompida antes do pagamento', detail: `${formatDateTime(tx.updatedAt)} · nenhum valor cobrado`, state: 'stopped' }]
  }
  if (meta.phase === 'pending') {
    return [received, { label: meta.label, state: 'current' }, { label: 'Em separação', state: 'pending' }, { label: 'Entregue', state: 'pending' }]
  }
  const approvedAt = tx.statusLog.find((c) => c.to === 'APPROVED' || c.to === 'APPROVED_WITH_ALERT')?.at ?? tx.updatedAt
  const seller = getSeller(tx.items[0]?.sellerId ?? '')
  const steps: { label: string; detail?: string; state: StepState }[] = [
    received,
    { label: 'Pagamento aprovado', detail: formatDateTime(approvedAt), state: 'done' },
    { label: 'Em separação', detail: seller ? `Por ${seller.name}` : undefined, state: 'current' },
    { label: 'Enviado', state: 'pending' },
    { label: 'Entregue', detail: `Previsão: ${formatDate(deliveryEstimate(tx))}`, state: 'pending' },
  ]
  if (tx.status === 'INCIDENT_RECORDED') {
    steps[2] = { label: 'Em contestação', detail: 'O titular do cartão abriu uma contestação. O envio fica suspenso até a análise.', state: 'stopped' }
    return steps.slice(0, 3)
  }
  return steps
}

export function OrderDetailPage() {
  const { orderId = '' } = useParams()
  const { getTxByOrder, setViewer } = useDemo()
  const tx = getTxByOrder(orderId)
  if (!tx) return <OrderNotFound orderId={orderId} />

  const meta = orderStatusMeta[tx.status]
  const steps = stepsFor(tx)

  return (
    
    <div className="mx-auto max-w-[860px] px-4 pt-6 lg:px-8">
      
      <Breadcrumbs items={[{ label: 'NEXA', to: '/store' }, { label: 'Meus pedidos', to: '/store/orders' }, { label: tx.orderId ?? '' }]} />
      
      <div className="flex flex-wrap items-end justify-between gap-3">
        
        <div>
          
          <h1 className="font-display text-[28px] font-semibold tracking-[-0.02em]">Pedido {tx.orderId}</h1>
          
          <p className="text-[14px] text-muted">Feito em {formatDate(tx.createdAt)}</p>
        
        </div>
        
        <Badge tone={meta.tone}>{meta.label}</Badge>
      
      </div>

      
      <section className="mt-8 rounded-2xl border border-nexa-stone bg-white p-6" aria-label="Andamento do pedido">
        
        <ol>
          {steps.map((s, i) => (
            
            <li key={s.label} className="relative flex gap-3 pb-6 last:pb-0">
              {i < steps.length - 1 && <span className={cx('absolute left-[9px] top-6 h-[calc(100%-18px)] w-px', s.state === 'done' ? 'bg-nexa-char' : 'bg-nexa-stone')} aria-hidden />}
              <span
                className={cx(
                  'relative mt-0.5 flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full border-2',
                  s.state === 'done' && 'border-nexa-char bg-nexa-char text-white',
                  s.state === 'current' && 'border-nexa-char bg-white',
                  s.state === 'pending' && 'border-nexa-stone bg-white',
                  s.state === 'stopped' && 'border-nexa-clay bg-nexa-clay text-white',
                )}
                aria-hidden
              >
                {s.state === 'done' && <Check className="h-3 w-3" strokeWidth={3} />}
                {s.state === 'current' && <span className="h-1.5 w-1.5 rounded-full bg-nexa-char" />}
              
              </span>
              
              <span>
                
                <span className={cx('block text-[14px]', s.state === 'pending' ? 'text-subtle' : 'font-medium')}>{s.label}</span>
                {s.detail && <span className="block text-[13px] text-muted">{s.detail}</span>}
              
              </span>
            
            </li>
          ))}
        
        </ol>
      
      </section>

      
      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_300px]">
        
        <section className="rounded-2xl border border-nexa-stone bg-white p-6" aria-label="Itens do pedido">
          
          <ItemsList tx={tx} />
          
          <div className="border-t border-nexa-stone pt-4">
            
            <SummaryLines subtotal={tx.amount - tx.shipping} shipping={tx.shipping} total={tx.amount} />
          
          </div>
        
        </section>
        
        <aside className="space-y-4">
          
          <OrderFacts tx={tx} />
          {meta.phase !== 'stopped' && (
            <Link
              to={`/security/report?tx=${tx.id}`}
              onClick={() => setViewer(tx.customerId)}
              className="block rounded-2xl border border-nexa-stone bg-white p-4 text-[13px] hover:border-nexa-char"
            >
              
              <span className="font-medium">Não reconhece este pedido?</span>
              
              <span className="mt-0.5 block text-muted">Fale com o emissor do seu cartão pelo app Aureon.</span>
            
            </Link>
          )}
        
        </aside>
      
      </div>
    
    </div>
  )
}

export function OrdersPage() {
  const { transactions, shopper } = useDemo()
  const orders = transactions.filter((t) => t.customerId === shopper.id && t.merchantId === IDS.nexa && t.orderId)

  return (
    
    <div className="mx-auto max-w-[860px] px-4 pt-6 lg:px-8">
      
      <Breadcrumbs items={[{ label: 'NEXA', to: '/store' }, { label: 'Meus pedidos' }]} />
      
      <h1 className="font-display text-[28px] font-semibold tracking-[-0.02em]">Meus pedidos</h1>
      
      <p className="mt-1 text-[14px] text-muted">{shopper.name}</p>

      {orders.length === 0 ? (
        
        <div className="mt-8">
          <EmptyState
            icon={<Package className="h-5 w-5" aria-hidden />}
            title="Nenhum pedido ainda"
            description="Seus pedidos na NEXA aparecem aqui."
            action={
              
              <Button variant="store" to="/store/catalog">
                Explorar produtos
              
              </Button>
            }
          />
        
        </div>
      ) : (
        
        <ul className="mt-8 divide-y divide-nexa-stone overflow-hidden rounded-2xl border border-nexa-stone bg-white">
          {orders.map((tx) => {
            const meta = orderStatusMeta[tx.status]
            const p = getProductById(tx.items[0]?.productId ?? '')
            return (
              
              <li key={tx.id}>
                
                <Link to={`/store/orders/${tx.orderId}`} className="flex items-center gap-4 p-4 hover:bg-nexa-sand/50 sm:p-5">
                  {p ? <ProductArt product={p} size="sm" className="w-14 shrink-0" /> : <Package className="h-6 w-6 text-muted" aria-hidden />}
                  
                  <div className="min-w-0 flex-1">
                    
                    <p className="truncate font-medium">{txTitle(tx)}</p>
                    
                    <p className="text-[13px] text-muted">
                      {tx.orderId} · {formatDate(tx.createdAt)}
                    
                    </p>
                    
                    <p className="mt-1 flex items-center gap-2 sm:hidden">
                      
                      <span className="tabular text-[13px] font-medium">{formatBRL(tx.amount)}</span>
                      
                      <Badge tone={meta.tone} size="sm">
                        {meta.label}
                      
                      </Badge>
                    
                    </p>
                  
                  </div>
                  
                  <div className="hidden text-right sm:block">
                    
                    <p className="tabular text-[14px] font-medium">{formatBRL(tx.amount)}</p>
                    
                    <Badge tone={meta.tone} size="sm" className="mt-1">
                      {meta.label}
                    
                    </Badge>
                  
                  </div>
                  
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted" aria-hidden />
                
                </Link>
              
              </li>
            )
          })}
        
        </ul>
      )}
    
    </div>
  )
}
