import { Link } from 'react-router-dom'
import { ShoppingBag, Trash2 } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { FREE_SHIPPING_FROM, deliveryLabel } from '../../mocks/products'
import { ProductArt } from '../../components/store/ProductArt'
import { QuantityStepper, SellerLine, SummaryLines } from '../../components/store/StoreParts'
import { ProtectedBy } from '../../components/brand/Brand'
import { EmptyState } from '../../components/ui/Feedback'
import { Button } from '../../components/ui/Button'
import { Breadcrumbs } from '../../components/ui/Navigation'
import { formatBRL } from '../../utils/format'
export function CartPage() {
  const { lines, itemCount, subtotal, shipping, total, setQuantity, removeItem } = useCart()

  // Verifica a condição antes de executar o bloco seguinte.
  if (lines.length === 0) {
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return (
      
      <div className="mx-auto max-w-stage px-4 py-16 lg:px-8">
        <EmptyState
          icon={<ShoppingBag className="h-5 w-5" aria-hidden />}
          title="Seu carrinho está vazio"
          description="Quando você adicionar produtos, eles aparecem aqui."
          action={
            
            <Button variant="store" to="/store/catalog">
              Explorar produtos
            
            </Button>
          }
        />
      
      </div>
    )
  }

  const missing = FREE_SHIPPING_FROM - subtotal

  return (
    
    <div className="mx-auto max-w-stage px-4 pt-6 lg:px-8">
      
      <Breadcrumbs items={[{ label: 'NEXA', to: '/store' }, { label: 'Carrinho' }]} />
      
      <h1 className="font-display text-[30px] font-semibold tracking-[-0.025em]">Carrinho</h1>

      
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        
        <section aria-label="Itens do carrinho">
          {missing > 0 && (
            
            <p className="mb-4 rounded-xl bg-nexa-sand px-4 py-3 text-[13px]">
              Faltam <span className="tabular font-semibold">{formatBRL(missing)}</span> para frete grátis.
            
            </p>
          )}
          
          <ul className="divide-y divide-nexa-stone border-y border-nexa-stone">
            {lines.map(({ product, quantity }) => (
              
              <li key={product.id} className="flex gap-4 py-5">
                
                <Link to={`/store/product/${product.id}`} className="w-24 shrink-0 sm:w-28" tabIndex={-1} aria-hidden="true">
                  
                  <ProductArt product={product} size="sm" />
                
                </Link>
                
                <div className="flex min-w-0 flex-1 flex-col">
                  
                  <div className="flex items-start justify-between gap-3">
                    
                    <div className="min-w-0">
                      
                      <Link to={`/store/product/${product.id}`} className="font-medium hover:underline">
                        {product.name}
                      
                      </Link>
                      
                      <SellerLine sellerId={product.sellerId} className="mt-0.5" />
                      
                      <p className="mt-0.5 text-[13px] text-ok-ink">{deliveryLabel(product.deliveryDays)}</p>
                    
                    </div>
                    
                    <p className="tabular shrink-0 font-semibold">{formatBRL(product.price * quantity)}</p>
                  
                  </div>
                  
                  <div className="mt-auto flex items-center justify-between pt-3">
                    
                    <QuantityStepper value={quantity} onChange={(v) => setQuantity(product.id, v)} max={product.stock} label={`Quantidade de ${product.name}`} />
                    
                    <button type="button" onClick={() => removeItem(product.id)} className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[13px] text-muted hover:bg-nexa-sand hover:text-nexa-char">
                      
                      <Trash2 className="h-4 w-4" aria-hidden /> Remover
                    
                    </button>
                  
                  </div>
                
                </div>
              
              </li>
            ))}
          
          </ul>
          
          <Link to="/store/catalog" className="mt-5 inline-block text-[14px] underline-offset-4 hover:underline">
            ← Continuar comprando
          
          </Link>
        
        </section>

        
        <aside className="h-fit rounded-2xl border border-nexa-stone bg-white p-6 lg:sticky lg:top-40" aria-label="Resumo">
          
          <h2 className="font-display text-[18px] font-semibold">Resumo</h2>
          
          <div className="mt-5">
            
            <SummaryLines subtotal={subtotal} shipping={shipping} total={total} itemCount={itemCount} />
          
          </div>
          
          <Button variant="store" size="lg" fullWidth className="mt-6" to="/store/checkout/delivery">
            Ir para o checkout
          
          </Button>
          
          <ProtectedBy className="mt-4 justify-center" />
        
        </aside>
      
      </div>
    
    </div>
  )
}
