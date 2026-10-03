import { useNavigate } from 'react-router-dom'
import { Briefcase, Home, Store } from 'lucide-react'
import type { Address } from '../../../types/domain'
import { useDemo } from '../../../context/DemoContext'
import { useCart } from '../../../context/CartContext'
import { addressesFor, getAddress } from '../../../mocks/people'
import { CheckoutShell } from '../../../components/store/CheckoutShell'
import { DeliveryLine } from '../../../components/store/StoreParts'
import { ChoiceCard } from '../../../components/ui/Form'
import { Button } from '../../../components/ui/Button'
import { formatBRL } from '../../../utils/format'

// a constante/variável kindIcon e atribui a ela o resultado da expressão desta linha.
const kindIcon = { home: Home, work: Briefcase, pickup: Store } as const
export function DeliveryPage() {
  const { shopper, scenario, checkout, setCheckout } = useDemo()
  const { lines, shipping } = useCart()
  // Declara a constante/variável navigate e atribui a ela o resultado da expressão desta linha.
  const navigate = useNavigate()

  // Declara a constante/variável saved e atribui a ela o resultado da expressão desta linha.
  const saved = addressesFor(shopper.id)
  // Declara a constante/variável provided e atribui a ela o resultado da expressão desta linha.
  const provided = scenario.providedAddress ? getAddress(scenario.addressId) : undefined
  // Declara a constante/variável options e atribui a ela o resultado da expressão desta linha.
  const options: { address: Address; isNew: boolean }[] = [
    ...saved.map((address) => ({ address, isNew: false })),
    ...(provided && !saved.some((a) => a.id === provided.id) ? [{ address: provided, isNew: true }] : []),
  ]
  // Declara a constante/variável selected e atribui a ela o resultado da expressão desta linha.
  const selected = options.some((o) => o.address.id === checkout.addressId) ? checkout.addressId : options[0]?.address.id
  // Declara a constante/variável days e atribui a ela o resultado da expressão desta linha.
  const days = Math.max(0, ...lines.map((l) => l.product.deliveryDays))
  // Declara a constante/variável city e atribui a ela o resultado da expressão desta linha.
  const city = options.find((o) => o.address.id === selected)?.address.city

  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <CheckoutShell step={0} title="Entrega">
      
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-nexa-stone bg-white p-5">
        
        <div className="min-w-0">
          
          <p className="text-[12px] text-muted">Comprando como</p>
          
          <p className="mt-0.5 font-medium">{shopper.name}</p>
          
          <p className="truncate text-[13px] text-muted">{shopper.email}</p>
        
        </div>
        
        <span className="shrink-0 rounded-full bg-nexa-sand px-3 py-1 text-[12px]">Conta NEXA</span>
      
      </div>

      
      <fieldset>
        
        <legend className="mb-3 text-[15px] font-semibold">Endereço de entrega</legend>
        
        <div className="space-y-2.5">
          {options.map(({ address: a, isNew }) => {
            const Icon = kindIcon[a.kind]
            return (
              <ChoiceCard
                key={a.id}
                tone="store"
                name="address"
                value={a.id}
                checked={selected === a.id}
                onChange={(v) => setCheckout({ addressId: v })}
                icon={<Icon className="h-4 w-4" />}
                title={
                  
                  <span className="flex flex-wrap items-center gap-2">
                    {a.label}
                    {isNew && <span className="rounded-full bg-nexa-sand px-2 py-0.5 text-[11px] font-normal">Informado neste pedido</span>}
                  
                  </span>
                }
                description={`${a.line1}${a.line2 ? ` · ${a.line2}` : ''} · ${a.district}, ${a.city} · CEP ${a.zip}`}
              />
            )
          })}
        
        </div>
      
      </fieldset>

      
      <div className="rounded-2xl border border-nexa-stone bg-white p-5">
        
        <p className="text-[15px] font-semibold">Prazo</p>
        
        <div className="mt-2 flex items-center justify-between gap-4 text-[14px]">
          
          <DeliveryLine days={days} city={city} />
          
          <span className="tabular shrink-0 font-medium">{shipping === 0 ? 'Grátis' : formatBRL(shipping)}</span>
        
        </div>
      
      </div>

      
      <div className="flex flex-wrap justify-between gap-3 pt-2">
        
        <Button variant="ghost" to="/store/cart">
          Voltar ao carrinho
        
        </Button>
        <Button
          variant="store"
          size="lg"
          disabled={!selected}
          onClick={() => {
            if (selected && selected !== checkout.addressId) setCheckout({ addressId: selected })
            navigate('/store/checkout/payment')
          }}
        >
          Continuar para pagamento
        
        </Button>
      
      </div>
    
    </CheckoutShell>
  )
}
