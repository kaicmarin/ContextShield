import { Link, useNavigate } from 'react-router-dom'
import { CreditCard, ShieldCheck } from 'lucide-react'
import { useCart } from '../../../context/CartContext'
import { useDemo } from '../../../context/DemoContext'
import { cardFor } from '../../../mocks/people'
import { getSeller } from '../../../mocks/sellers'
import { CheckoutShell } from '../../../components/store/CheckoutShell'
import { SellerAvatar } from '../../../components/store/StoreParts'
import { ChoiceCard, Field, Select } from '../../../components/ui/Form'
import { Button } from '../../../components/ui/Button'
import { formatBRL, installmentText } from '../../../utils/format'

// a constante/variável PLANS e atribui a ela o resultado da expressão desta linha.
const PLANS = [1, 2, 3, 4, 5, 6, 8, 10, 12]

// a função SellersAside. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function SellersAside() {
  const { lines } = useCart()
  // Declara a constante/variável sellers e atribui a ela o resultado da expressão desta linha.
  const sellers = [...new Set(lines.map((l) => l.product.sellerId))].map(getSeller).filter((s) => s !== undefined)
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <div className="rounded-2xl border border-nexa-stone bg-white p-5">
      
      <p className="text-[13px] font-semibold">Quem vende</p>
      
      <ul className="mt-3 space-y-3">
        {sellers.map((s) => (
          
          <li key={s.id} className="flex items-center gap-3">
            
            <SellerAvatar seller={s} size={32} />
            
            <div className="min-w-0 text-[13px]">
              
              <p className="truncate font-medium">{s.name}</p>
              
              <p className="text-muted">
                Na NEXA desde {new Date(s.since).getFullYear()} · nota {s.rating.toLocaleString('pt-BR')}
              
              </p>
            
            </div>
          
          </li>
        ))}
      
      </ul>
      
      <p className="mt-4 border-t border-nexa-stone pt-3 text-[12px] leading-snug text-muted">
        Recebeu um link ou um telefone sobre esta compra?{' '}
        
        <Link to="/security/check" className="font-medium text-nexa-char underline-offset-2 hover:underline">
          Confira antes de pagar
        
        </Link>
        .
      
      </p>
    
    </div>
  )
}

export function PaymentPage() {
  const { shopper, checkout, setCheckout } = useDemo()
  const { lines, total } = useCart()
  const navigate = useNavigate()
  const card = cardFor(shopper.id)
  const max = Math.min(12, ...lines.map((l) => l.product.installments))
  const plans = PLANS.filter((n) => n <= Math.max(1, max))
  const installments = plans.includes(checkout.installments) ? checkout.installments : plans[plans.length - 1]

  return (
    
    <CheckoutShell step={1} title="Pagamento" aside={<SellersAside />}>
      
      <fieldset>
        
        <legend className="mb-3 text-[15px] font-semibold">Cartão</legend>
        {card ? (
          <ChoiceCard
            tone="store"
            name="card"
            value={card.id}
            checked
            onChange={() => undefined}
            icon={<CreditCard className="h-4 w-4" />}
            title={`${card.product} •••• ${card.last4}`}
            description={`${card.holder} · validade ${card.expiry}`}
            aside={<span className="text-[12px] text-muted">Salvo na conta</span>}
          />
        ) : (
          
          <p className="text-[14px] text-muted">Nenhum cartão salvo nesta conta.</p>
        )}
      
      </fieldset>

      
      <div className="max-w-sm">
        
        <Field label="Parcelamento" htmlFor="inst">
          
          <Select id="inst" value={installments} onChange={(e) => setCheckout({ installments: Number(e.target.value) })}>
            {plans.map((n) => (
              
              <option key={n} value={n}>
                {n === 1 ? `À vista · ${formatBRL(total)}` : installmentText(total, n)}
              
              </option>
            ))}
          
          </Select>
        
        </Field>
      
      </div>

      
      <p className="flex items-start gap-2 rounded-xl border border-nexa-stone bg-white px-4 py-3 text-[13px] text-muted">
        
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-nexa-char" aria-hidden />
        A NEXA nunca pede a senha do cartão nem códigos recebidos por SMS. O pagamento é autorizado pelo emissor do seu cartão.
      
      </p>

      
      <div className="flex flex-wrap justify-between gap-3 pt-2">
        
        <Button variant="ghost" to="/store/checkout/delivery">
          Voltar
        
        </Button>
        <Button
          variant="store"
          size="lg"
          disabled={!card}
          onClick={() => {
            if (installments !== checkout.installments) setCheckout({ installments })
            navigate('/store/checkout/review')
          }}
        >
          Revisar pedido
        
        </Button>
      
      </div>
    
    </CheckoutShell>
  )
}
