import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { BadgeCheck, Minus, Plus, Star, Truck } from 'lucide-react'
import type { Product, Seller } from '../../types/domain'
import { deliveryLabel, discountPercent } from '../../mocks/products'
import { getSeller, sellerTierLabel } from '../../mocks/sellers'
import { cx, formatBRL, installmentText } from '../../utils/format'
import { ProductArt } from './ProductArt'
export function Rating({ value, count, className }: { value: number; count?: number; className?: string }) {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <span className={cx('inline-flex items-center gap-1 text-[13px] text-muted', className)}>
      
      <span className="flex" aria-hidden>
        {[1, 2, 3, 4, 5].map((i) => (
          
          <Star key={i} className={cx('h-3.5 w-3.5', i <= Math.round(value) ? 'fill-nexa-char text-nexa-char' : 'text-line-strong')} />
        ))}
      
      </span>
      
      <span className="tabular text-ink-900">{value.toFixed(1).replace('.', ',')}</span>
      {count !== undefined && <span className="tabular">({count.toLocaleString('pt-BR')})</span>}
      
      <span className="sr-only">de 5 estrelas</span>
    
    </span>
  )
}

export function SellerAvatar({ seller, size = 36 }: { seller: Seller; size?: number }) {
  return (
    
    <span className="inline-flex shrink-0 items-center justify-center rounded-full font-display font-semibold text-white" style={{ width: size, height: size, backgroundColor: seller.color, fontSize: size * 0.36 }} aria-hidden>
      {seller.initials}
    
    </span>
  )
}

export function SellerLine({ sellerId, className }: { sellerId: string; className?: string }) {
  const s = getSeller(sellerId)
  if (!s) return null
  const verified = s.tier === 'oficial' || s.tier === 'platinum'
  return (
    
    <span className={cx('inline-flex items-center gap-1 text-[12px] text-muted', className)}>
      Vendido por <span className="font-medium text-nexa-char">{s.name}</span>
      {verified && <BadgeCheck className="h-3.5 w-3.5 text-nexa-char" aria-label={sellerTierLabel[s.tier]} />}
    
    </span>
  )
}

export function ProductCard({ product, emphasis }: { product: Product; emphasis?: boolean }) {
  const off = discountPercent(product)
  return (
    
    <article className="group relative flex flex-col">
      
      <Link to={`/store/product/${product.id}`} className="block rounded-xl focus-visible:outline-offset-4">
        
        <div className="relative overflow-hidden rounded-xl">
          
          <ProductArt product={product} className="transition-transform duration-500 group-hover:scale-[1.02]" />
          {product.tag && <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-nexa-char shadow-sm">{product.tag}</span>}
        
        </div>
        
        <div className="mt-3 px-0.5">
          
          <h3 className={cx('font-sans font-medium leading-snug text-nexa-char group-hover:underline', emphasis ? 'text-[17px]' : 'text-[15px]')}>{product.name}</h3>
          
          <p className="text-[12px] text-muted">{product.line}</p>
          
          <Rating value={product.rating} count={product.reviewCount} className="mt-1" />
          
          <div className="mt-2 flex items-baseline gap-2">
            
            <span className="tabular text-[16px] font-semibold text-nexa-char">{formatBRL(product.price)}</span>
            {product.oldPrice && <span className="tabular text-[13px] text-subtle line-through">{formatBRL(product.oldPrice)}</span>}
            {off > 0 && <span className="text-[12px] font-medium text-ok-ink">{off}% off</span>}
          
          </div>
          
          <p className="text-[12px] text-muted">{installmentText(product.price, product.installments)}</p>
          
          <p className="mt-1 text-[12px] text-ok-ink">{deliveryLabel(product.deliveryDays)}</p>
        
        </div>
      
      </Link>
      
      <SellerLine sellerId={product.sellerId} className="mt-1 px-0.5" />
    
    </article>
  )
}

export function QuantityStepper({ value, onChange, max, label }: { value: number; onChange: (v: number) => void; max: number; label: string }) {
  return (
    
    <div className="inline-flex h-10 items-center rounded-lg border border-line-strong bg-white" role="group" aria-label={label}>
      
      <button type="button" className="flex h-full w-10 items-center justify-center text-muted hover:text-nexa-char disabled:opacity-30" onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Diminuir quantidade">
        
        <Minus className="h-3.5 w-3.5" />
      
      </button>
      
      <span className="tabular w-8 text-center text-[14px] font-medium" aria-live="polite">
        {value}
      
      </span>
      
      <button type="button" className="flex h-full w-10 items-center justify-center text-muted hover:text-nexa-char disabled:opacity-30" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Aumentar quantidade">
        
        <Plus className="h-3.5 w-3.5" />
      
      </button>
    
    </div>
  )
}

export function DeliveryLine({ days, city }: { days: number; city?: string }) {
  return (
    
    <p className="flex items-center gap-2 text-[13px] text-muted">
      
      <Truck className="h-4 w-4 text-nexa-char" aria-hidden />
      
      <span>
        
        <span className="font-medium text-ok-ink">{deliveryLabel(days)}</span>
        {city ? ` para ${city}` : ''}
      
      </span>
    
    </p>
  )
}

export function SummaryLines({ subtotal, shipping, total, itemCount }: { subtotal: number; shipping: number; total: number; itemCount?: number }) {
  return (
    
    <dl className="space-y-2 text-[14px]">
      
      <div className="flex justify-between">
        
        <dt className="text-muted">Produtos{itemCount !== undefined ? ` (${itemCount})` : ''}</dt>
        
        <dd className="tabular">{formatBRL(subtotal)}</dd>
      
      </div>
      
      <div className="flex justify-between">
        
        <dt className="text-muted">Frete</dt>
        
        <dd className="tabular">{shipping === 0 ? <span className="text-ok-ink">Grátis</span> : formatBRL(shipping)}</dd>
      
      </div>
      
      <div className="flex justify-between border-t border-nexa-stone pt-3 text-[16px] font-semibold">
        
        <dt>Total</dt>
        
        <dd className="tabular">{formatBRL(total)}</dd>
      
      </div>
    
    </dl>
  )
}

export function StoreSection({ title, action, children, className }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    
    <section className={cx('mx-auto max-w-stage px-4 lg:px-8', className)}>
      
      <div className="mb-5 flex items-end justify-between gap-4">
        
        <h2 className="font-display text-[22px] font-semibold tracking-[-0.02em] text-nexa-char sm:text-[26px]">{title}</h2>
        {action}
      
      </div>
      {children}
    
    </section>
  )
}
