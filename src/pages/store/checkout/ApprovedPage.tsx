import { useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Bell, Check } from 'lucide-react'
import { useCart } from '../../../context/CartContext'
import { useDemo } from '../../../context/DemoContext'
import { useFlowTx } from '../../../hooks/useFlowTx'
import { getCard } from '../../../mocks/people'
import { checkoutPathFor } from '../../../services/status'
import { deliveryEstimate } from '../../../services/present'
import { NoActivePurchase } from '../../../components/store/CheckoutShell'
import { ProtectedBy } from '../../../components/brand/Brand'
import { Button } from '../../../components/ui/Button'
import { formatBRL, formatDate } from '../../../utils/format'
export function ApprovedPage() {
  // Declara a constante/variável tx e atribui a ela o resultado da expressão desta linha.
  const tx = useFlowTx()
  const { clear } = useCart()
  const { setViewer } = useDemo()
  // Declara a constante/variável authorized e atribui a ela o resultado da expressão desta linha.
  const authorized = tx?.status === 'APPROVED' || tx?.status === 'APPROVED_WITH_ALERT'

  // Executa o hook useEffect, conectando esta parte do componente ao mecanismo correspondente do React.
  useEffect(() => {
    // Verifica a condição antes de executar o bloco seguinte.
    if (authorized) clear()
  }, [authorized, clear])

  // Verifica a condição antes de executar o bloco seguinte.
  if (!tx) return <NoActivePurchase />
  // Verifica a condição antes de executar o bloco seguinte.
  if (tx.status === 'INCIDENT_RECORDED') return <Navigate to={`/store/orders/${tx.orderId}`} replace />
  // Verifica a condição antes de executar o bloco seguinte.
  if (!authorized) return <Navigate to={checkoutPathFor(tx)} replace />

  // Declara a constante/variável card e atribui a ela o resultado da expressão desta linha.
  const card = getCard(tx.cardId)
  // Declara a constante/variável continued e atribui a ela o resultado da expressão desta linha.
  const continued = tx.interventionChoice === 'continued'
  // Declara a constante/variável withAlert e atribui a ela o resultado da expressão desta linha.
  const withAlert = tx.status === 'APPROVED_WITH_ALERT'
  // Declara a constante/variável lead e atribui a ela o resultado da expressão desta linha.
  const lead = continued
    ? 'Você decidiu continuar e o pagamento foi autorizado.'
    : tx.verification
      ? 'Obrigado por confirmar. O pagamento foi autorizado.'
      : 'Tudo certo com o pagamento. Seu pedido foi autorizado.'

  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <div className="mx-auto max-w-read px-4 py-16 text-center">
      
      <span className="mx-auto flex h-14 w-14 animate-rise items-center justify-center rounded-full bg-ok text-white">
        
        <Check className="h-7 w-7" strokeWidth={2.5} aria-hidden />
      
      </span>
      
      <h1 className="mt-6 font-display text-[32px] font-semibold tracking-[-0.025em]">Compra aprovada</h1>
      
      <p className="mx-auto mt-2 max-w-md text-[15px] text-muted">{lead}</p>

      
      <dl className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-px overflow-hidden rounded-2xl border border-nexa-stone bg-nexa-stone text-left">
        {[
          ['Pedido', tx.orderId ?? '—'],
          ['Valor', formatBRL(tx.amount)],
          ['Cartão', card ? `•••• ${card.last4}` : '—'],
          ['Previsão de entrega', formatDate(deliveryEstimate(tx))],
        ].map(([k, v]) => (
          
          <div key={k} className="bg-white p-4">
            
            <dt className="text-[12px] text-muted">{k}</dt>
            
            <dd className="tabular mt-0.5 text-[15px] font-medium">{v}</dd>
          
          </div>
        ))}
      
      </dl>

      {withAlert && (
        
        <div className="mx-auto mt-6 flex max-w-md items-start gap-3 rounded-2xl border border-line bg-paper p-4 text-left text-[13px] leading-relaxed text-ink-800">
          
          <Bell className="mt-0.5 h-4 w-4 shrink-0 text-warn" aria-hidden />
          
          <p>
            {continued
              ? 'Se alguém pediu que você fizesse esta compra, fale com a central do seu cartão. '
              : 'O emissor do seu cartão enviou um aviso sobre esta compra para o app. Se não reconhecer, avise por lá. '}
            <Link
              to={continued ? `/security/report?tx=${tx.id}` : `/security/transactions/${tx.id}`}
              onClick={() => setViewer(tx.customerId)}
              className="font-medium text-signal-ink underline-offset-2 hover:underline"
            >
              {continued ? 'Registrar em “Fui vítima”' : 'Abrir no app Aureon'}
            
            </Link>
          
          </p>
        
        </div>
      )}

      
      <div className="mt-8 flex flex-col justify-center gap-2 sm:flex-row">
        
        <Button variant="store" size="lg" to={`/store/order/${tx.orderId}/confirmation`}>
          Ver confirmação do pedido
        
        </Button>
        
        <Button variant="secondary" size="lg" to="/store">
          Continuar comprando
        
        </Button>
      
      </div>
      
      <ProtectedBy className="mt-8 justify-center" />
    
    </div>
  )
}
