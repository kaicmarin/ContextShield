import { useMemo, useState, type ReactNode } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import { categories, getCategory, products } from '../../mocks/products'
import { getSeller, sellers } from '../../mocks/sellers'
import { ProductCard } from '../../components/store/StoreParts'
import { Breadcrumbs } from '../../components/ui/Navigation'
import { EmptyState } from '../../components/ui/Feedback'
import { Button } from '../../components/ui/Button'
import { filterProducts, priceRanges, sortOptions, type SortKey } from '../../utils/catalog'
import { cx, plural } from '../../utils/format'
import { NotFoundPage } from '../NotFoundPage'

// um tipo/interface TypeScript. Esta parte serve para tipagem em desenvolvimento e não vira lógica JavaScript em runtime.
type Mode = 'catalog' | 'category' | 'search'
export function CatalogPage() {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return <CatalogView mode="catalog" />
}
export function SearchPage() {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return <CatalogView mode="search" />
}
export function CategoryPage() {
  const { slug = '' } = useParams()
  // Verifica a condição antes de executar o bloco seguinte.
  if (!getCategory(slug)) return <NotFoundPage />
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return <CatalogView mode="category" slug={slug} />
}

// a função CatalogView. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function CatalogView({ mode, slug }: { mode: Mode; slug?: string }) {
  const [params, setParams] = useSearchParams()
  const [open, setOpen] = useState(false)
  // Declara a constante/variável q e atribui a ela o resultado da expressão desta linha.
  const q = params.get('q') ?? ''
  // Declara a constante/variável category e atribui a ela o resultado da expressão desta linha.
  const category = mode === 'category' ? slug : params.get('cat') ?? undefined
  // Declara a constante/variável seller e atribui a ela o resultado da expressão desta linha.
  const seller = params.get('seller') ?? undefined
  // Declara a constante/variável price e atribui a ela o resultado da expressão desta linha.
  const price = params.get('price') ?? undefined
  // Declara a constante/variável rating e atribui a ela o resultado da expressão desta linha.
  const rating = Number(params.get('rating')) || undefined
  // Declara a constante/variável sortParam e atribui a ela o resultado da expressão desta linha.
  const sortParam = params.get('sort') as SortKey | null
  // Declara a constante/variável sort e atribui a ela o resultado da expressão desta linha.
  const sort: SortKey = sortParam && sortOptions.some((o) => o.id === sortParam) ? sortParam : 'relevance'

  // Guarda em list um valor memorizado para evitar recalcular a expressão quando as dependências não mudarem.
  const list = useMemo(() => filterProducts({ q: mode === 'search' ? q : undefined, category, seller, price, rating, sort }), [mode, q, category, seller, price, rating, sort])
  // Declara a constante/variável cat e atribui a ela o resultado da expressão desta linha.
  const cat = category ? getCategory(category) : undefined

  // Declara a constante/variável set e atribui a ela o resultado da expressão desta linha.
  const set = (key: string, value?: string) => {
    // Declara a constante/variável next e atribui a ela o resultado da expressão desta linha.
    const next = new URLSearchParams(params)
    // Verifica a condição antes de executar o bloco seguinte.
    if (value) next.set(key, value)
    // Caso a condição anterior não seja atendida, executa o caminho alternativo.
    else next.delete(key)
    // Atualiza o estado associado ao setter desta variável; o React agenda uma nova renderização quando necessário.
    setParams(next, { replace: true })
  }
  // Declara a constante/variável clearAll e atribui a ela o resultado da expressão desta linha.
  const clearAll = () => {
    // Declara a constante/variável next e atribui a ela o resultado da expressão desta linha.
    const next = new URLSearchParams()
    // Verifica a condição antes de executar o bloco seguinte.
    if (mode === 'search' && q) next.set('q', q)
    // Atualiza o estado associado ao setter desta variável; o React agenda uma nova renderização quando necessário.
    setParams(next, { replace: true })
  }

  // Declara a constante/variável chips e atribui a ela o resultado da expressão desta linha.
  const chips = [
    mode !== 'category' && cat ? { key: 'cat', label: cat.name } : undefined,
    seller ? { key: 'seller', label: getSeller(seller)?.name ?? seller } : undefined,
    price ? { key: 'price', label: priceRanges.find((r) => r.id === price)?.label ?? price } : undefined,
    rating ? { key: 'rating', label: `${rating}+ estrelas` } : undefined,
  ].filter((c): c is { key: string; label: string } => !!c)

  // Declara a constante/variável title e atribui a ela o resultado da expressão desta linha.
  const title = mode === 'search' ? (q ? `Resultados para “${q}”` : 'Busca') : mode === 'category' ? cat?.name ?? '' : 'Todos os produtos'
  // Declara a constante/variável blurb e atribui a ela o resultado da expressão desta linha.
  const blurb = mode === 'category' ? cat?.blurb : mode === 'search' ? undefined : `${products.length} produtos de ${sellers.length} lojas.`
  // Declara a constante/variável scope e atribui a ela o resultado da expressão desta linha.
  const scope = mode === 'category' ? products.filter((p) => p.categorySlug === slug) : products
  // Declara a constante/variável sellerOptions e atribui a ela o resultado da expressão desta linha.
  const sellerOptions = sellers.filter((s) => scope.some((p) => p.sellerId === s.id))

  // Declara a constante/variável filters e atribui a ela o resultado da expressão desta linha.
  const filters = (
    <div className="space-y-7 text-[14px]">
      {mode !== 'category' && (
        <FilterGroup title="Categoria">
          <Radio name="cat" label="Todas" checked={!category} onChange={() => set('cat')} />
          {categories.map((c) => (
            <Radio key={c.slug} name="cat" label={c.name} checked={category === c.slug} onChange={() => set('cat', c.slug)} />
          ))}
        </FilterGroup>
      )}
      <FilterGroup title="Preço">
        <Radio name="price" label="Qualquer preço" checked={!price} onChange={() => set('price')} />
        {priceRanges.map((r) => (
          <Radio key={r.id} name="price" label={r.label} checked={price === r.id} onChange={() => set('price', r.id)} />
        ))}
      </FilterGroup>
      <FilterGroup title="Avaliação">
        <Radio name="rating" label="Todas" checked={!rating} onChange={() => set('rating')} />
        {[4.5, 4].map((r) => (
          <Radio key={r} name="rating" label={`${r.toLocaleString('pt-BR')} estrelas ou mais`} checked={rating === r} onChange={() => set('rating', String(r))} />
        ))}
      </FilterGroup>
      <FilterGroup title="Vendedor">
        <Radio name="seller" label="Todos" checked={!seller} onChange={() => set('seller')} />
        {sellerOptions.map((s) => (
          <Radio key={s.id} name="seller" label={s.name} checked={seller === s.id} onChange={() => set('seller', s.id)} />
        ))}
      </FilterGroup>
    </div>
  )

  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <div className="mx-auto max-w-stage px-4 pt-8 lg:px-8">
      
      <Breadcrumbs items={[{ label: 'NEXA', to: '/store' }, ...(mode === 'category' ? [{ label: 'Todos os produtos', to: '/store/catalog' }] : []), { label: mode === 'search' ? 'Busca' : title }]} />
      
      <header className="flex flex-col gap-4 border-b border-nexa-stone pb-6 sm:flex-row sm:items-end sm:justify-between">
        
        <div>
          
          <h1 className="font-display text-[30px] font-semibold tracking-[-0.03em] sm:text-[36px]">{title}</h1>
          {blurb && <p className="mt-1 text-[15px] text-muted">{blurb}</p>}
        
        </div>
        
        <div className="flex items-center gap-2">
          
          <button type="button" onClick={() => setOpen((v) => !v)} className="inline-flex h-10 items-center gap-2 rounded-full border border-nexa-stone bg-white px-4 text-[13px] font-medium lg:hidden" aria-expanded={open} aria-controls="nexa-filters">
            
            <SlidersHorizontal className="h-4 w-4" aria-hidden /> Filtros{chips.length ? ` (${chips.length})` : ''}
          
          </button>
          
          <label htmlFor="nexa-sort" className="sr-only">
            Ordenar
          
          </label>
          
          <select id="nexa-sort" value={sort} onChange={(e) => set('sort', e.target.value === 'relevance' ? undefined : e.target.value)} className="h-10 rounded-full border border-nexa-stone bg-white px-4 text-[13px] font-medium focus:border-nexa-char focus:outline-none">
            {sortOptions.map((o) => (
              
              <option key={o.id} value={o.id}>
                {o.label}
              
              </option>
            ))}
          
          </select>
        
        </div>
      
      </header>

      
      <div className="mt-6 grid gap-8 lg:grid-cols-[220px_1fr]">
        
        <aside id="nexa-filters" className={cx('lg:block', open ? 'block rounded-2xl border border-nexa-stone bg-white p-5 lg:border-0 lg:bg-transparent lg:p-0' : 'hidden')} aria-label="Filtros">
          {filters}
        
        </aside>
        
        <section aria-live="polite">
          
          <div className="mb-5 flex flex-wrap items-center gap-2">
            
            <p className="mr-2 text-[13px] text-muted">{plural(list.length, 'produto', 'produtos')}</p>
            {chips.map((c) => (
              
              <button key={c.key} type="button" onClick={() => set(c.key)} className="inline-flex items-center gap-1 rounded-full bg-nexa-sand px-3 py-1 text-[12px] font-medium hover:bg-nexa-stone" aria-label={`Remover filtro ${c.label}`}>
                {c.label} <X className="h-3 w-3" aria-hidden />
              
              </button>
            ))}
            {chips.length > 1 && (
              
              <button type="button" onClick={clearAll} className="text-[12px] text-muted underline-offset-2 hover:underline">
                Limpar filtros
              
              </button>
            )}
          
          </div>
          {list.length === 0 ? (
            <EmptyState
              title="Nenhum produto encontrado"
              description={mode === 'search' ? 'Tente outra palavra ou remova algum filtro.' : 'Remova algum filtro para ver mais produtos.'}
              action={
                
                <Button variant="store" onClick={clearAll}>
                  Limpar filtros
                
                </Button>
              }
            />
          ) : (
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:gap-x-6">
              {list.map((p) => (
                
                <ProductCard key={p.id} product={p} />
              ))}
            
            </div>
          )}
        
        </section>
      
      </div>
    
    </div>
  )
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    
    <fieldset>
      
      <legend className="mb-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-muted">{title}</legend>
      
      <div className="space-y-1.5">{children}</div>
    
    </fieldset>
  )
}

function Radio({ name, label, checked, onChange }: { name: string; label: string; checked: boolean; onChange: () => void }) {
  return (
    
    <label className="flex cursor-pointer items-center gap-2.5 py-0.5 text-[14px]">
      
      <input type="radio" name={name} checked={checked} onChange={onChange} className="h-4 w-4 accent-nexa-char" />
      
      <span className={checked ? 'font-medium text-nexa-char' : 'text-ink-800'}>{label}</span>
    
    </label>
  )
}
