import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { DeclaredOrigin } from '../../../types/domain'
import { useCart } from '../../../context/CartContext'
import { useDemo } from '../../../context/DemoContext'
import { addressFull, cardFor, getAddress } from '../../../mocks/people'
import { declaredOriginOptions } from '../../../mocks/scenarios'
import { CheckoutShell } from '../../../components/store/CheckoutShell'
import { Button } from '../../../components/ui/Button'
import { cx, formatBRL, installmentText } from '../../../utils/format'

// um tipo/interface TypeScript. Esta parte serve para tipagem em desenvolvimento e não vira lógica JavaScript em runtime.
type OriginChoice = DeclaredOrigin | 'skip'

// a constante/variável originChoices e atribui a ela o resultado da expressão desta linha.
const originChoices: { id: OriginChoice; label: string }[] = [...declaredOriginOptions, { id: 'skip', label: 'Prefiro não responder' }]
export function ReviewPage() {
  const { lines, total } = useCart()
  const { shopper, scenario, checkout, setCheckout, placeOrder } = useDemo()
  // Declara a constante/variável navigate e atribui a ela o resultado da expressão desta linha.
  const navigate = useNavigate()
  const [origin, setOrigin] = useState<OriginChoice>(checkout.declaredOrigin ?? scenario.declaredOrigin)
  const [sending, setSending] = useState(false)
  // Declara a constante/variável card e atribui a ela o resultado da expressão desta linha.
  const card = cardFor(shopper.id)
  // Declara a constante/variável address e atribui a ela o resultado da expressão desta linha.
  const address = getAddress(checkout.addressId)

  // Declara a constante/variável confirm e atribui a ela o resultado da expressão desta linha.
  const confirm = () => {
    // Verifica a condição antes de executar o bloco seguinte.
    if (sending) return
    // Atualiza o estado associado ao setter desta variável; o React agenda uma nova renderização quando necessário.
    setSending(true)
    // Atualiza o estado associado ao setter desta variável; o React agenda uma nova renderização quando necessário.
    setCheckout({ declaredOrigin: origin === 'skip' ? undefined : origin })
    // Declara a constante/variável txId e atribui a ela o resultado da expressão desta linha.
    const txId = placeOrder(lines.map((l) => ({ productId: l.product.id, quantity: l.quantity })))
    // Executa a chamada desta função/event handler, passando os argumentos definidos nesta linha.
    navigate(`/store/checkout/analysis?tx=${txId}`, { replace: true })
  }

  // Declara a constante/variável rows e atribui a ela o resultado da expressão desta linha.
  const rows = [
    { k: 'Entrega', v: address ? addressFull(address) : 'Escolha um endereço', to: '/store/checkout/delivery' },
    { k: 'Pagamento', v: card ? `${card.product} •••• ${card.last4} · ${checkout.installments <= 1 ? 'à vista' : installmentText(total, checkout.installments)}` : '—', to: '/store/checkout/payment' },
  ]

  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <CheckoutShell step={2} title="Revise e confirme">
      
      <div className="divide-y divide-nexa-stone rounded-2xl border border-nexa-stone bg-white">
        {rows.map((row) => (
          
          <div key={row.k} className="flex items-start justify-between gap-4 p-5">
            
            <div className="min-w-0">
              
              <p className="text-[12px] text-muted">{row.k}</p>
              
              <p className="mt-0.5 text-[14px]">{row.v}</p>
            
            </div>
            
            <Link to={row.to} className="shrink-0 text-[13px] underline-offset-4 hover:underline">
              Alterar
            
            </Link>
          
          </div>
        ))}
      
      </div>

      
      <fieldset className="rounded-2xl border border-nexa-stone bg-white p-5">
        
        <legend className="sr-only">Como você chegou até esta compra?</legend>
        
        <p className="text-[15px] font-semibold">Como você chegou até esta compra?</p>
        
        <p className="mt-0.5 text-[13px] text-muted">Opcional. Não existe resposta certa.</p>
        
        <div className="mt-4 flex flex-wrap gap-2" role="radiogroup" aria-label="Como você chegou até esta compra?">
          {originChoices.map((o) => {
            const active = origin === o.id
            return (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setOrigin(o.id)}
                className={cx(
                  'rounded-full border px-3.5 py-2 text-[13px] transition-colors',
                  active ? 'border-nexa-char bg-nexa-char text-white' : 'border-nexa-stone bg-white text-nexa-char hover:border-nexa-char',
                )}
              >
                {o.label}
              
              </button>
            )
          })}
        
        </div>
      
      </fieldset>

      
      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        
        <Button variant="ghost" to="/store/checkout/payment">
          Voltar
        
        </Button>
        
        <Button variant="store" size="lg" onClick={confirm} loading={sending} disabled={!address || !card}>
          Confirmar compra · {formatBRL(total)}
        
        </Button>
      
      </div>
      
      <p className="text-[12px] text-muted">Ao confirmar, o pagamento é enviado ao emissor do seu cartão para autorização.</p>
    
    </CheckoutShell>
  )
}
