import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { BadgeCheck, Check, ChevronRight, PackageCheck, RefreshCcw } from 'lucide-react'
import { discountPercent, getCategory, getProductById, products, productsByCategory, reviewsFor, stockLabel } from '../../mocks/products'
import { getSeller, sellerTierLabel } from '../../mocks/sellers'
import { homeAddressFor } from '../../mocks/people'
import { useCart } from '../../context/CartContext'
import { useDemo } from '../../context/DemoContext'
import { ProductArt } from '../../components/store/ProductArt'
import { DeliveryLine, ProductCard, QuantityStepper, Rating, SellerAvatar } from '../../components/store/StoreParts'
import { Breadcrumbs } from '../../components/ui/Navigation'
import { ErrorState } from '../../components/ui/Feedback'
import { Button } from '../../components/ui/Button'
import { cx, formatBRL, installmentText } from '../../utils/format'
export function ProductPage() {
  const { id = '' } = useParams()
  // Declara a constante/variável product e atribui a ela o resultado da expressão desta linha.
  const product = getProductById(id)
  const { addItem } = useCart()
  const { shopper } = useDemo()
  // Declara a constante/variável navigate e atribui a ela o resultado da expressão desta linha.
  const navigate = useNavigate()
  const [qty, setQty] = useState(1)
  const [view, setView] = useState(0)

  // Verifica a condição antes de executar o bloco seguinte.
  if (!product) {
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return (
      
      <div className="mx-auto max-w-stage px-4 py-16 lg:px-8">
        <ErrorState
          title="Produto não encontrado"
          description="Este item pode ter saído do catálogo."
          action={
            
            <Button variant="store" to="/store/catalog">
              Voltar ao catálogo
            
            </Button>
          }
        />
      
      </div>
    )
  }

  const category = getCategory(product.categorySlug)
  const seller = getSeller(product.sellerId)
  const related = [...productsByCategory(product.categorySlug), ...products].filter((p, i, arr) => p.id !== product.id && arr.findIndex((x) => x.id === p.id) === i).slice(0, 4)
  const poses = [0, 1, 2] as const
  const stock = stockLabel(product)
  const off = discountPercent(product)
  const reviews = reviewsFor(product)
  const city = homeAddressFor(shopper.id)?.city

  return (
    
    <div className="mx-auto max-w-stage px-4 pt-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: 'NEXA', to: '/store' },
          { label: category?.name ?? 'Produtos', to: `/store/category/${product.categorySlug}` },
          { label: product.name },
        ]}
      />

      
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        
        <div>
          
          <ProductArt product={product} size="lg" pose={poses[view]} />
          
          <div className="mt-3 grid grid-cols-3 gap-3" role="group" aria-label="Ângulos do produto">
            {poses.map((pose, i) => (
              
              <button key={pose} type="button" onClick={() => setView(i)} aria-label={`Ângulo ${i + 1}`} aria-pressed={view === i} className={cx('overflow-hidden rounded-xl border-2 transition-colors', view === i ? 'border-nexa-char' : 'border-transparent hover:border-nexa-stone')}>
                
                <ProductArt product={product} size="sm" pose={pose} />
              
              </button>
            ))}
          
          </div>
        
        </div>

        
        <div>
          
          <p className="text-[13px] text-muted">
            {category?.name} · <span className="font-mono text-[12px]">SKU {product.sku}</span>
          
          </p>
          
          <h1 className="mt-1 font-display text-[32px] font-semibold leading-tight tracking-[-0.025em] sm:text-[34px]">{product.name}</h1>
          
          <p className="text-[15px] text-muted">{product.line}</p>
          
          <Rating value={product.rating} count={product.reviewCount} className="mt-2" />

          
          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            
            <span className="tabular text-[30px] font-semibold tracking-tight">{formatBRL(product.price)}</span>
            {product.oldPrice && <span className="tabular text-[15px] text-subtle line-through">{formatBRL(product.oldPrice)}</span>}
            {off > 0 && <span className="rounded-full bg-ok-soft px-2 py-0.5 text-[12px] font-medium text-ok-ink">{off}% off</span>}
          
          </div>
          
          <p className="text-[14px] text-muted">{installmentText(product.price, product.installments)} no cartão</p>

          
          <p className="mt-6 text-[15px] leading-relaxed text-ink-800/85">{product.description}</p>
          
          <ul className="mt-5 flex flex-wrap gap-2">
            {product.highlights.map((h) => (
              
              <li key={h} className="flex items-center gap-1.5 rounded-full border border-nexa-stone bg-white px-3 py-1.5 text-[13px]">
                
                <Check className="h-3.5 w-3.5 text-nexa-clay" aria-hidden /> {h}
              
              </li>
            ))}
          
          </ul>

          
          <div className="mt-8 rounded-2xl border border-nexa-stone bg-white p-5">
            
            <div className="flex flex-wrap items-center justify-between gap-3">
              
              <p className={cx('flex items-center gap-2 text-[13px]', stock.tone === 'ok' ? 'text-ok-ink' : stock.tone === 'warn' ? 'text-warn-ink' : 'text-risk-ink')}>
                
                <span className={cx('h-2 w-2 rounded-full', stock.tone === 'ok' ? 'bg-ok' : stock.tone === 'warn' ? 'bg-warn' : 'bg-risk')} aria-hidden />
                {stock.text}
              
              </p>
              
              <QuantityStepper value={qty} onChange={setQty} max={Math.max(1, product.stock)} label="Quantidade" />
            
            </div>
            
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              
              <Button variant="store" size="lg" disabled={product.stock <= 0} onClick={() => addItem(product.id, qty)}>
                Adicionar ao carrinho
              
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="border-nexa-char"
                disabled={product.stock <= 0}
                onClick={() => {
                  addItem(product.id, qty)
                  navigate('/store/cart')
                }}
              >
                Comprar agora
              
              </Button>
            
            </div>
            
            <div className="mt-5 space-y-2 border-t border-nexa-stone pt-4">
              
              <DeliveryLine days={product.deliveryDays} city={city} />
              
              <p className="flex items-center gap-2 text-[13px] text-muted">
                
                <RefreshCcw className="h-4 w-4 text-nexa-char" aria-hidden /> Troca grátis em até 7 dias
              
              </p>
              
              <p className="flex items-center gap-2 text-[13px] text-muted">
                
                <PackageCheck className="h-4 w-4 text-nexa-char" aria-hidden /> Entregue pela NEXA
              
              </p>
            
            </div>
          
          </div>

          {seller && (
            
            <Link to={`/store/seller/${seller.id}`} className="mt-4 flex items-center gap-3 rounded-2xl border border-nexa-stone bg-white p-4 transition-colors hover:border-nexa-char">
              
              <SellerAvatar seller={seller} size={40} />
              
              <span className="min-w-0 flex-1">
                
                <span className="flex items-center gap-1 text-[12px] text-muted">
                  Vendido por
                  {(seller.tier === 'oficial' || seller.tier === 'platinum') && <BadgeCheck className="h-3.5 w-3.5 text-nexa-char" aria-hidden />}
                
                </span>
                
                <span className="block truncate text-[15px] font-medium">{seller.name}</span>
                
                <span className="block text-[12px] text-muted">
                  {sellerTierLabel[seller.tier]} · {seller.sales.toLocaleString('pt-BR')} vendas · entrega no prazo em {seller.onTimeRate}%
                
                </span>
              
              </span>
              
              <ChevronRight className="h-4 w-4 text-muted" aria-hidden />
            
            </Link>
          )}
        
        </div>
      
      </div>

      
      <section className="mt-16 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14" aria-labelledby="specs">
        
        <div>
          
          <h2 id="specs" className="font-display text-[20px] font-semibold">
            Ficha técnica
          
          </h2>
          
          <dl className="mt-4 divide-y divide-nexa-stone border-y border-nexa-stone">
            {product.specs.map((s) => (
              
              <div key={s.label} className="grid grid-cols-[140px_1fr] gap-4 py-3 text-[14px] sm:grid-cols-[180px_1fr]">
                
                <dt className="text-muted">{s.label}</dt>
                
                <dd>{s.value}</dd>
              
              </div>
            ))}
          
          </dl>
        
        </div>
        
        <div>
          
          <h2 className="font-display text-[20px] font-semibold">Avaliações</h2>
          
          <div className="mt-4 rounded-2xl border border-nexa-stone bg-white p-5">
            
            <div className="flex items-center gap-4">
              
              <span className="tabular font-display text-[40px] font-semibold">{product.rating.toFixed(1).replace('.', ',')}</span>
              
              <div>
                
                <Rating value={product.rating} />
                
                <p className="text-[13px] text-muted">{product.reviewCount.toLocaleString('pt-BR')} avaliações de compras</p>
              
              </div>
            
            </div>
            
            <ul className="mt-4 divide-y divide-nexa-stone border-t border-nexa-stone">
              {reviews.map((r) => (
                
                <li key={r.name} className="py-4">
                  
                  <div className="flex items-center justify-between gap-3">
                    
                    <Rating value={r.rating} />
                    
                    <span className="text-[12px] text-subtle">{r.when}</span>
                  
                  </div>
                  
                  <p className="mt-1.5 text-[14px] font-medium">{r.title}</p>
                  
                  <p className="mt-0.5 text-[14px] leading-relaxed text-ink-800/85">{r.body}</p>
                  
                  <p className="mt-1 text-[12px] text-muted">{r.name} · compra verificada</p>
                
                </li>
              ))}
            
            </ul>
          
          </div>
        
        </div>
      
      </section>

      
      <section className="mt-16" aria-labelledby="related">
        
        <h2 id="related" className="font-display text-[20px] font-semibold">
          Você também pode gostar
        
        </h2>
        
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
          {related.map((p) => (
            
            <ProductCard key={p.id} product={p} />
          ))}
        
        </div>
      
      </section>
    
    </div>
  )
}
