import { useEffect, useState, type FormEvent } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Check, Package, Search, ShoppingBag, User, X } from 'lucide-react'
import { NexaLogo, ProtectedBy } from '../components/brand/Brand'
import { ProductArt } from '../components/store/ProductArt'
import { useCart } from '../context/CartContext'
import { useDemo } from '../context/DemoContext'
import { categories } from '../mocks/products'
import { getMerchant } from '../mocks/merchants'
import { IDS } from '../mocks/ids'
import { cx, formatBRL } from '../utils/format'
export function StoreLayout() {
  const { itemCount, lastAdded, dismissLastAdded } = useCart()
  const { shopper } = useDemo()
  // Declara a constante/variável location e atribui a ela o resultado da expressão desta linha.
  const location = useLocation()
  const [params] = useSearchParams()
  // Declara a constante/variável navigate e atribui a ela o resultado da expressão desta linha.
  const navigate = useNavigate()
  const [q, setQ] = useState(params.get('q') ?? '')
  // Declara a constante/variável nexa e atribui a ela o resultado da expressão desta linha.
  const nexa = getMerchant(IDS.nexa)

  // Executa o hook useEffect, conectando esta parte do componente ao mecanismo correspondente do React.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  // Executa o hook useEffect, conectando esta parte do componente ao mecanismo correspondente do React.
  useEffect(() => {
    // Verifica a condição antes de executar o bloco seguinte.
    if (location.pathname === '/store/search') setQ(params.get('q') ?? '')
  }, [location.pathname, params])

  // Executa o hook useEffect, conectando esta parte do componente ao mecanismo correspondente do React.
  useEffect(() => {
    // Verifica a condição antes de executar o bloco seguinte.
    if (!lastAdded) return
    // Declara a constante/variável t e atribui a ela o resultado da expressão desta linha.
    const t = window.setTimeout(dismissLastAdded, 4500)
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return () => window.clearTimeout(t)
  }, [lastAdded, dismissLastAdded])

  const onSearch = (e: FormEvent) => {
    e.preventDefault()
    navigate(q.trim() ? `/store/search?q=${encodeURIComponent(q.trim())}` : '/store/catalog')
  }

  const searchBox = (id: string) => (
    
    <form onSubmit={onSearch} role="search" className="w-full">
      
      <label htmlFor={id} className="sr-only">
        Buscar produtos
      
      </label>
      
      <div className="relative">
        
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
        <input
          id={id}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar produtos, marcas e lojas"
          className="h-11 w-full rounded-full border border-nexa-stone bg-white pl-10 pr-4 text-[14px] placeholder:text-subtle focus:border-nexa-char focus:outline-none"
        />
      
      </div>
    
    </form>
  )

  return (
    
    <div className="min-h-screen bg-[#FBFAF8] text-nexa-char">
      
      <div className="bg-nexa-char text-[12px] text-white/80">
        
        <div className="mx-auto flex max-w-stage items-center justify-between gap-4 px-4 py-2 lg:px-8">
          
          <span className="truncate">Frete grátis acima de R$ 299 · Troca em até 7 dias</span>
          
          <Link to="/security/check" className="hidden shrink-0 text-white/70 hover:text-white sm:inline">
            Antes de pagar, confira
          
          </Link>
        
        </div>
      
      </div>

      
      <header className="sticky top-0 z-40 border-b border-nexa-stone bg-[#FBFAF8]">
        
        <div className="mx-auto flex max-w-stage items-center gap-4 px-4 py-3.5 lg:gap-8 lg:px-8">
          
          <Link to="/store" className="shrink-0 rounded-md">
            
            <NexaLogo />
          
          </Link>
          
          <div className="hidden max-w-xl flex-1 md:block">{searchBox('nexa-search')}</div>
          
          <nav className="ml-auto flex items-center gap-1" aria-label="Conta e carrinho">
            
            <Link to="/store/orders" className="flex items-center gap-2 rounded-full px-3 py-2 text-[13px] hover:bg-nexa-sand">
              
              <Package className="h-4 w-4" aria-hidden /> <span className="hidden sm:inline">Pedidos</span>
            
            </Link>
            
            <span className="hidden items-center gap-2 rounded-full px-3 py-2 text-[13px] lg:flex">
              
              <User className="h-4 w-4" aria-hidden /> Olá, {shopper.firstName}
            
            </span>
            
            <Link to="/store/cart" className="relative rounded-full p-2.5 hover:bg-nexa-sand" aria-label={`Carrinho, ${itemCount} ${itemCount === 1 ? 'item' : 'itens'}`}>
              
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && <span className="absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-nexa-clay px-1 text-[10px] font-semibold text-white">{itemCount}</span>}
            
            </Link>
          
          </nav>
        
        </div>
        
        <div className="px-4 pb-3 md:hidden">{searchBox('nexa-search-m')}</div>
        
        <nav className="mx-auto max-w-stage px-4 lg:px-8" aria-label="Categorias">
          
          <ul className="scrollbar-thin -mb-px flex gap-6 overflow-x-auto text-[13px]">
            
            <li>
              
              <NavLink to="/store/catalog" className={({ isActive }) => cx('block whitespace-nowrap border-b-2 py-2.5', isActive ? 'border-nexa-char font-medium' : 'border-transparent text-muted hover:text-nexa-char')}>
                Todos
              
              </NavLink>
            
            </li>
            {categories.map((c) => (
              
              <li key={c.slug}>
                
                <NavLink to={`/store/category/${c.slug}`} className={({ isActive }) => cx('block whitespace-nowrap border-b-2 py-2.5', isActive ? 'border-nexa-char font-medium' : 'border-transparent text-muted hover:text-nexa-char')}>
                  {c.name}
                
                </NavLink>
              
              </li>
            ))}
          
          </ul>
        
        </nav>
      
      </header>

      {lastAdded && (
        
        <div className="fixed right-4 top-[132px] z-50 w-[min(340px,calc(100%-2rem))] animate-rise rounded-2xl border border-nexa-stone bg-white p-3 shadow-lift" role="status">
          
          <div className="flex items-center gap-3">
            
            <ProductArt product={lastAdded} size="sm" className="w-14 shrink-0" />
            
            <div className="min-w-0 flex-1">
              
              <p className="flex items-center gap-1.5 text-[12px] font-medium text-ok-ink">
                
                <Check className="h-3.5 w-3.5" aria-hidden /> Adicionado ao carrinho
              
              </p>
              
              <p className="truncate text-[14px] font-medium">{lastAdded.name}</p>
              
              <p className="tabular text-[13px] text-muted">{formatBRL(lastAdded.price)}</p>
            
            </div>
            
            <button type="button" onClick={dismissLastAdded} className="self-start rounded-full p-1 text-muted hover:bg-nexa-sand" aria-label="Fechar">
              
              <X className="h-3.5 w-3.5" />
            
            </button>
          
          </div>
          
          <Link to="/store/cart" onClick={dismissLastAdded} className="mt-3 flex h-9 items-center justify-center rounded-lg bg-nexa-char text-[13px] font-medium text-white hover:bg-black">
            Ver carrinho
          
          </Link>
        
        </div>
      )}

      
      <main className="animate-fade">
        
        <Outlet />
      
      </main>

      
      <footer className="mt-24 border-t border-nexa-stone bg-nexa-sand/60">
        
        <div className="mx-auto grid max-w-stage gap-10 px-4 py-12 text-[13px] text-muted sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          
          <div>
            
            <NexaLogo />
            
            <p className="mt-3 max-w-xs leading-relaxed">Eletrônicos e casa de lojas selecionadas, com entrega rápida e atendimento sem pressa.</p>
          
          </div>
          
          <div>
            
            <p className="font-medium text-nexa-char">Comprar</p>
            
            <ul className="mt-3 space-y-2">
              {categories.slice(0, 5).map((c) => (
                
                <li key={c.slug}>
                  
                  <Link to={`/store/category/${c.slug}`} className="hover:text-nexa-char">
                    {c.name}
                  
                  </Link>
                
                </li>
              ))}
            
            </ul>
          
          </div>
          
          <div>
            
            <p className="font-medium text-nexa-char">Sua conta</p>
            
            <ul className="mt-3 space-y-2">
              
              <li>
                
                <Link to="/store/orders" className="hover:text-nexa-char">
                  Meus pedidos
                
                </Link>
              
              </li>
              
              <li>
                
                <Link to="/store/cart" className="hover:text-nexa-char">
                  Carrinho
                
                </Link>
              
              </li>
              
              <li>
                
                <Link to="/store/seller/SEL-001" className="hover:text-nexa-char">
                  Loja oficial NEXA
                
                </Link>
              
              </li>
            
            </ul>
          
          </div>
          
          <div>
            
            <p className="font-medium text-nexa-char">Segurança</p>
            
            <p className="mt-3 leading-relaxed">A NEXA nunca pede pagamento fora do checkout, nem por telefone ou mensagem.</p>
            
            <Link to="/security/check" className="mt-2 inline-block font-medium text-nexa-char underline-offset-2 hover:underline">
              Antes de pagar, confira
            
            </Link>
            
            <ProtectedBy className="mt-4 flex" />
          
          </div>
        
        </div>
        
        <div className="border-t border-nexa-stone">
          
          <p className="mx-auto max-w-stage px-4 py-4 text-[12px] text-subtle lg:px-8">
            {nexa?.legalName} · CNPJ {nexa?.cnpj} · {nexa?.domain}
          
          </p>
        
        </div>
      
      </footer>
    
    </div>
  )
}
