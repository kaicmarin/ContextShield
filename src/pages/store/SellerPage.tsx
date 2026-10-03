import { useParams } from 'react-router-dom'
import { BadgeCheck, Clock, FileCheck2, MapPin, PackageCheck } from 'lucide-react'
import { productsBySeller } from '../../mocks/products'
import { getSeller, sellerTierLabel } from '../../mocks/sellers'
import { categories } from '../../mocks/products'
import { ProductCard, Rating, SellerAvatar } from '../../components/store/StoreParts'
import { Breadcrumbs } from '../../components/ui/Navigation'
import { ErrorState } from '../../components/ui/Feedback'
import { Button } from '../../components/ui/Button'
import { formatDate } from '../../utils/format'
export function SellerPage() {
  const { id = '' } = useParams()
  // Declara a constante/variável seller e atribui a ela o resultado da expressão desta linha.
  const seller = getSeller(id)
  // Verifica a condição antes de executar o bloco seguinte.
  if (!seller) {
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return (
      
      <div className="mx-auto max-w-stage px-4 py-16 lg:px-8">
        
        <ErrorState title="Loja não encontrada" action={<Button variant="store" to="/store">Voltar para a NEXA</Button>} />
      
      </div>
    )
  }
  const list = productsBySeller(seller.id)
  const cats = seller.categories.map((c) => categories.find((x) => x.slug === c)?.name).filter(Boolean).join(' · ')
  const metrics = [
    { label: 'Vendas', value: seller.sales.toLocaleString('pt-BR') },
    { label: 'Entregas no prazo', value: `${seller.onTimeRate}%` },
    { label: 'Cancelamentos', value: `${seller.cancellationRate.toLocaleString('pt-BR')}%` },
    { label: 'Reclamações', value: `${seller.claimsRate.toLocaleString('pt-BR')}%` },
  ]

  return (
    
    <div className="mx-auto max-w-stage px-4 pt-6 lg:px-8">
      
      <Breadcrumbs items={[{ label: 'NEXA', to: '/store' }, { label: 'Lojas' }, { label: seller.name }]} />
      
      <header className="rounded-[24px] border border-nexa-stone bg-white p-6 sm:p-8">
        
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          
          <div className="flex items-start gap-4">
            
            <SellerAvatar seller={seller} size={64} />
            
            <div>
              
              <h1 className="flex items-center gap-2 font-display text-[28px] font-semibold tracking-[-0.02em]">
                {seller.name}
                {(seller.tier === 'oficial' || seller.tier === 'platinum') && <BadgeCheck className="h-5 w-5" aria-label="Loja verificada" />}
              
              </h1>
              
              <p className="text-[14px] text-muted">{seller.tagline}</p>
              
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-muted">
                
                <span className="rounded-full bg-nexa-sand px-2.5 py-0.5 font-medium text-nexa-char">{sellerTierLabel[seller.tier]}</span>
                
                <Rating value={seller.rating} count={seller.reviewCount} />
                
                <span className="flex items-center gap-1">
                  
                  <MapPin className="h-3.5 w-3.5" aria-hidden /> {seller.city}
                
                </span>
              
              </div>
            
            </div>
          
          </div>
          
          <dl className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-4">
            {metrics.map((m) => (
              
              <div key={m.label}>
                
                <dt className="text-[12px] text-muted">{m.label}</dt>
                
                <dd className="tabular text-[18px] font-semibold">{m.value}</dd>
              
              </div>
            ))}
          
          </dl>
        
        </div>
        
        <div className="mt-6 grid gap-4 border-t border-nexa-stone pt-5 text-[13px] text-muted sm:grid-cols-3">
          
          <p className="flex items-start gap-2">
            
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-nexa-char" aria-hidden /> Responde em {seller.responseTime}
          
          </p>
          
          <p className="flex items-start gap-2">
            
            <PackageCheck className="mt-0.5 h-4 w-4 shrink-0 text-nexa-char" aria-hidden /> Vende na NEXA desde {formatDate(seller.since)}
          
          </p>
          
          <p className="flex items-start gap-2">
            
            <FileCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-nexa-char" aria-hidden />
            {seller.verifiedDocs ? `Documentos verificados · CNPJ ${seller.cnpj}` : `CNPJ ${seller.cnpj} · verificação de documentos em andamento`}
          
          </p>
        
        </div>
        
        <p className="mt-4 max-w-3xl text-[14px] leading-relaxed text-ink-800/85">{seller.about}</p>
        {cats && <p className="mt-2 text-[13px] text-muted">Categorias: {cats}</p>}
      
      </header>

      
      <section className="mt-10" aria-labelledby="seller-products">
        
        <h2 id="seller-products" className="font-display text-[20px] font-semibold">
          Produtos da loja ({list.length})
        
        </h2>
        
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {list.map((p) => (
            
            <ProductCard key={p.id} product={p} />
          ))}
        
        </div>
      
      </section>
    
    </div>
  )
}
