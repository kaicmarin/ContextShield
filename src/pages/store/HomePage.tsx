import { Link } from 'react-router-dom'
import { ArrowRight, CreditCard, RefreshCcw, ShieldCheck, Truck } from 'lucide-react'
import type { Product } from '../../types/domain'
import { categories, discountPercent, getProductById, products, productsByCategory, productsBySeller } from '../../mocks/products'
import { sellers, sellerTierLabel } from '../../mocks/sellers'
import { ProductArt } from '../../components/store/ProductArt'
import { ProductCard, Rating, SellerAvatar, StoreSection } from '../../components/store/StoreParts'
import { formatBRL, installmentText } from '../../utils/format'

// a constante/variável pick e atribui a ela o resultado da expressão desta linha.
const pick = (ids: string[]) => ids.map((id) => getProductById(id)).filter((p): p is Product => !!p)
export function HomePage() {
  const [hero] = pick(['prod-001'])
  // Declara a constante/variável deals e atribui a ela o resultado da expressão desta linha.
  const deals = [...products].filter((p) => discountPercent(p) >= 12).sort((a, b) => discountPercent(b) - discountPercent(a)).slice(0, 4)
  // Declara a constante/variável best e atribui a ela o resultado da expressão desta linha.
  const best = [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 8)
  // Declara a constante/variável setup e atribui a ela o resultado da expressão desta linha.
  const setup = pick(['prod-004', 'prod-009', 'prod-010'])
  // Declara a constante/variável featuredSellers e atribui a ela o resultado da expressão desta linha.
  const featuredSellers = sellers.filter((s) => s.tier !== 'novo').slice(0, 4)

  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <div>
      {hero && (
        
        <section className="mx-auto max-w-stage px-4 pt-8 lg:px-8 lg:pt-12">
          
          <div className="grid items-center gap-8 overflow-hidden rounded-[28px] bg-nexa-sand lg:grid-cols-[1.05fr_1fr]">
            
            <div className="px-6 pb-2 pt-10 sm:px-10 lg:py-16 lg:pl-14">
              
              <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-nexa-clay">Novo · Linha Orion</p>
              
              <h1 className="mt-4 font-display text-[40px] font-semibold leading-[1.02] tracking-[-0.035em] sm:text-[52px]">
                Leve para o trabalho.
                
                <br />
                Esqueça o carregador.
              
              </h1>
              
              <p className="mt-5 max-w-md text-[16px] leading-relaxed text-ink-800/80">{hero.name}: tela 2.8K, 1,28 kg e até 16 horas longe da tomada.</p>
              
              <div className="mt-7 flex flex-wrap items-center gap-3">
                
                <Link to={`/store/product/${hero.id}`} className="inline-flex h-12 items-center gap-2 rounded-full bg-nexa-char px-6 text-[15px] font-medium text-white hover:bg-black">
                  Conhecer o Orion X <ArrowRight className="h-4 w-4" aria-hidden />
                
                </Link>
                
                <span className="text-[14px] text-ink-800/80">
                  
                  <span className="tabular font-semibold text-nexa-char">{formatBRL(hero.price)}</span> · {installmentText(hero.price, hero.installments)}
                
                </span>
              
              </div>
            
            </div>
            
            <div className="px-6 pb-8 lg:px-0 lg:pb-0 lg:pr-10">
              
              <ProductArt product={hero} size="lg" bare className="mx-auto max-w-[520px]" />
            
            </div>
          
          </div>
        
        </section>
      )}

      
      <StoreSection title="Explore por categoria" className="pt-14" action={<Link to="/store/catalog" className="text-[13px] text-muted hover:text-nexa-char">Ver tudo</Link>}>
        
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {categories.map((c) => {
            const p = productsByCategory(c.slug)[0]
            return (
              
              <li key={c.slug}>
                
                <Link to={`/store/category/${c.slug}`} className="group block">
                  {p && <ProductArt product={p} size="sm" className="transition-transform duration-300 group-hover:scale-[1.03]" />}
                  
                  <p className="mt-2.5 truncate text-center text-[13px] font-medium">{c.name}</p>
                
                </Link>
              
              </li>
            )
          })}
        
        </ul>
      
      </StoreSection>

      
      <StoreSection title="Ofertas da semana" className="pt-16" action={<Link to="/store/catalog?sort=discount" className="text-[13px] text-muted hover:text-nexa-char">Ver ofertas</Link>}>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
          {deals.map((p) => (
            
            <ProductCard key={p.id} product={p} />
          ))}
        
        </div>
      
      </StoreSection>

      
      <section className="mx-auto max-w-stage px-4 pt-16 lg:px-8">
        
        <div className="grid gap-8 rounded-[24px] bg-nexa-sand/80 px-6 py-10 sm:px-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          
          <div>
            
            <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-nexa-clay">Monte seu setup</p>
            
            <h2 className="mt-3 font-display text-[28px] font-semibold leading-tight tracking-[-0.02em]">Monitor, teclado e mouse que conversam entre si.</h2>
            
            <p className="mt-3 text-[14px] text-muted">Um único cabo USB-C carrega o notebook e liga o resto da mesa.</p>
            
            <Link to="/store/category/informatica" className="mt-6 inline-flex items-center gap-2 text-[14px] font-medium underline-offset-4 hover:underline">
              Ver informática <ArrowRight className="h-4 w-4" aria-hidden />
            
            </Link>
          
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {setup.map((p) => (
              
              <Link key={p.id} to={`/store/product/${p.id}`} className="group">
                
                <ProductArt product={p} className="transition-transform group-hover:scale-[1.02]" />
                
                <p className="mt-2 truncate text-[13px] font-medium">{p.name}</p>
                
                <p className="tabular text-[12px] text-muted">{formatBRL(p.price)}</p>
              
              </Link>
            ))}
          
          </div>
        
        </div>
      
      </section>

      
      <StoreSection title="Mais vendidos" className="pt-16">
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
          {best.map((p) => (
            
            <ProductCard key={p.id} product={p} />
          ))}
        
        </div>
      
      </StoreSection>

      
      <StoreSection title="Lojas na NEXA" className="pt-16">
        
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {featuredSellers.map((s) => (
            
            <li key={s.id}>
              
              <Link to={`/store/seller/${s.id}`} className="flex h-full items-start gap-3 rounded-2xl border border-nexa-stone bg-white p-4 transition-colors hover:border-nexa-char">
                
                <SellerAvatar seller={s} size={42} />
                
                <span className="min-w-0">
                  
                  <span className="block truncate text-[15px] font-medium">{s.name}</span>
                  
                  <span className="block text-[12px] text-muted">{sellerTierLabel[s.tier]} · {productsBySeller(s.id).length} produtos</span>
                  
                  <Rating value={s.rating} className="mt-1" />
                
                </span>
              
              </Link>
            
            </li>
          ))}
        
        </ul>
      
      </StoreSection>

      
      <section className="mx-auto max-w-stage px-4 pt-16 lg:px-8">
        
        <ul className="grid gap-6 border-y border-nexa-stone py-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Truck, t: 'Entrega rápida', d: 'Capitais em até 3 dias úteis' },
            { icon: RefreshCcw, t: 'Troca simples', d: '7 dias para devolver sem custo' },
            { icon: CreditCard, t: 'Até 10x sem juros', d: `Em ${products.filter((p) => p.installments >= 10).length} produtos` },
            { icon: ShieldCheck, t: 'Pagamento só no checkout', d: 'A NEXA nunca cobra por telefone ou mensagem' },
          ].map((s) => (
            
            <li key={s.t} className="flex items-start gap-3">
              
              <s.icon className="mt-0.5 h-5 w-5 shrink-0 text-nexa-clay" aria-hidden />
              
              <div>
                
                <p className="text-[14px] font-medium">{s.t}</p>
                
                <p className="text-[13px] text-muted">{s.d}</p>
              
              </div>
            
            </li>
          ))}
        
        </ul>
      
      </section>
    
    </div>
  )
}
