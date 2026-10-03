import type { ReactNode } from 'react'
import { Lock, ShoppingBag } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { ProductArt } from './ProductArt'
import { SellerLine, SummaryLines } from './StoreParts'
import { Stepper } from '../ui/Navigation'
import { EmptyState } from '../ui/Feedback'
import { Button } from '../ui/Button'
import { formatBRL } from '../../utils/format'

// a constante/variável steps e atribui a ela o resultado da expressão desta linha.
const steps = ['Entrega', 'Pagamento', 'Revisão']
export function NoActivePurchase({ title = 'Nenhuma compra em andamento', description = 'Esta etapa aparece depois que um pedido é enviado no checkout.' }: { title?: string; description?: string }) {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <div className="mx-auto max-w-stage px-4 py-16 lg:px-8">
      <EmptyState
        icon={<ShoppingBag className="h-5 w-5" aria-hidden />}
        title={title}
        description={description}
        action={
          <>
            
            <Button variant="store" to="/store">
              Ir para a loja
            
            </Button>
            
            <Button variant="secondary" to="/store/orders">
              Meus pedidos
            
            </Button>
          </>
        }
      />
    
    </div>
  )
}

export function CheckoutShell({ step, title, children, aside }: { step: number; title: string; children: ReactNode; aside?: ReactNode }) {
  const { lines, subtotal, shipping, total, itemCount } = useCart()

  if (lines.length === 0) {
    return (
      
      <div className="mx-auto max-w-stage px-4 py-16 lg:px-8">
        <EmptyState
          icon={<ShoppingBag className="h-5 w-5" aria-hidden />}
          title="Não há itens para finalizar"
          description="Adicione um produto ao carrinho para continuar."
          action={
            
            <Button variant="store" to="/store">
              Voltar para a loja
            
            </Button>
          }
        />
      
      </div>
    )
  }

  return (
    
    <div className="mx-auto max-w-stage px-4 pt-8 lg:px-8">
      
      <div className="mx-auto max-w-xl">
        
        <Stepper steps={steps} current={step} tone="store" />
      
      </div>
      
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
        
        <section aria-labelledby="co-title">
          
          <h1 id="co-title" className="font-display text-[26px] font-semibold tracking-[-0.02em]">
            {title}
          
          </h1>
          
          <div className="mt-6 space-y-6">{children}</div>
        
        </section>
        
        <aside className="h-fit space-y-4 lg:sticky lg:top-6" aria-label="Resumo do pedido">
          
          <div className="rounded-2xl border border-nexa-stone bg-white p-6">
            
            <h2 className="font-display text-[16px] font-semibold">Resumo</h2>
            
            <ul className="mt-4 space-y-3">
              {lines.map(({ product, quantity }) => (
                
                <li key={product.id} className="flex items-center gap-3">
                  
                  <ProductArt product={product} size="sm" className="w-14 shrink-0" />
                  
                  <div className="min-w-0 flex-1">
                    
                    <p className="truncate text-[14px] font-medium">{product.name}</p>
                    
                    <SellerLine sellerId={product.sellerId} />
                    
                    <p className="text-[12px] text-muted">Qtd. {quantity}</p>
                  
                  </div>
                  
                  <p className="tabular text-[14px]">{formatBRL(product.price * quantity)}</p>
                
                </li>
              ))}
            
            </ul>
            
            <div className="mt-5 border-t border-nexa-stone pt-4">
              
              <SummaryLines subtotal={subtotal} shipping={shipping} total={total} itemCount={itemCount} />
            
            </div>
          
          </div>
          {aside}
          
          <p className="flex items-center gap-2 px-1 text-[12px] text-muted">
            
            <Lock className="h-3.5 w-3.5" aria-hidden /> Pagamento só pelo checkout da NEXA. Nunca pague por fora.
          
          </p>
        
        </aside>
      
      </div>
    
    </div>
  )
}
