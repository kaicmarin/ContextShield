import { useState, type ReactNode } from 'react'
import { Globe, Lock, ShoppingCart, Smartphone } from 'lucide-react'
import { useDemo } from '../../context/DemoContext'
import { useToast } from '../../context/ToastContext'
import { availableLimit, currentStatement, txMerchantLabel } from '../../services/present'
import { CardVisual, SecTitle, useViewerData } from '../../components/security/SecurityParts'
import { KeyValue } from '../../components/ui/Surface'
import { EmptyState } from '../../components/ui/Feedback'
import { cx, formatBRL, formatShortDate } from '../../utils/format'

// a função Toggle. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function Toggle({ checked, onChange, label, description, icon }: { checked: boolean; onChange: (v: boolean) => void; label: string; description: string; icon: ReactNode }) {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <div className="flex items-center gap-3 px-4 py-4">
      
      <span className="text-muted">{icon}</span>
      
      <div className="min-w-0 flex-1">
        
        <p className="text-[14px] font-medium">{label}</p>
        
        <p className="text-[12px] text-muted">{description}</p>
      
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cx('relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aureon-deep/40 focus-visible:ring-offset-2', checked ? 'bg-aureon-deep' : 'bg-line-strong')}
      >
        
        <span className={cx('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform', checked ? 'translate-x-[22px]' : 'translate-x-0.5')} />
      
      </button>
    
    </div>
  )
}

export function CardsPage() {
  const { transactions, now } = useDemo()
  const { card } = useViewerData()
  const { pushToast } = useToast()
  const [prefs, setPrefs] = useState({ online: true, intl: false, contactless: true, locked: false })

  if (!card) return <EmptyState title="Nenhum cartão nesta conta" description="Quando houver um cartão Aureon, ele aparece aqui." />

  const set = (key: keyof typeof prefs, label: string) => (v: boolean) => {
    setPrefs((p) => ({ ...p, [key]: v }))
    pushToast({ tone: 'info', title: label, body: v ? 'Ativado.' : 'Desativado.' })
  }
  const statement = currentStatement(card, transactions, now)
  const used = card.limit - availableLimit(card, transactions)

  return (
    
    <div>
      
      <SecTitle title="Cartões" description="Limite, fatura e permissões de uso." />
      
      <div className="grid gap-6 rounded-2xl border border-line bg-paper p-5 sm:grid-cols-[minmax(0,320px)_1fr]">
        
        <CardVisual card={card} className={prefs.locked ? 'opacity-50 grayscale' : undefined} />
        
        <div>
          <KeyValue
            items={[
              { label: 'Produto', value: `${card.product} · ${card.kind}` },
              { label: 'Situação', value: prefs.locked ? 'Bloqueado temporariamente' : card.status },
              { label: 'Limite total', value: <span className="tabular">{formatBRL(card.limit)}</span> },
              { label: 'Disponível', value: <span className="tabular">{formatBRL(card.limit - used)}</span> },
            ]}
          />
          
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-aureon-mist" role="img" aria-label={`${Math.round((used / card.limit) * 100)}% do limite utilizado`}>
            
            <div className="h-full rounded-full bg-aureon-deep" style={{ width: `${Math.min(100, (used / card.limit) * 100)}%` }} />
          
          </div>
          
          <p className="mt-1.5 text-[12px] text-muted">
            
            <span className="tabular">{formatBRL(used)}</span> utilizados
          
          </p>
        
        </div>
      
      </div>

      
      <section className="mt-6 rounded-2xl border border-line bg-paper" aria-labelledby="statement">
        
        <div className="flex items-end justify-between gap-3 border-b border-line px-4 py-4">
          
          <h2 id="statement" className="text-[15px] font-semibold">
            Fatura atual
          
          </h2>
          
          <p className="tabular font-display text-[20px] font-semibold">{formatBRL(statement.total)}</p>
        
        </div>
        {statement.items.length === 0 ? (
          
          <p className="px-4 py-5 text-[14px] text-muted">Nenhuma compra neste mês.</p>
        ) : (
          
          <ul className="divide-y divide-line">
            {statement.items.map((t) => (
              
              <li key={t.id} className="flex items-center justify-between gap-3 px-4 py-3 text-[14px]">
                
                <span className="min-w-0 truncate">
                  
                  <span className="text-muted">{formatShortDate(t.createdAt)}</span> · {txMerchantLabel(t)}
                
                </span>
                
                <span className="tabular shrink-0">
                  {formatBRL(t.amount)}
                  {t.installments > 1 && <span className="ml-1 text-[12px] text-muted">em {t.installments}x</span>}
                
                </span>
              
              </li>
            ))}
          
          </ul>
        )}
      
      </section>

      
      <section className="mt-6 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper" aria-label="Permissões do cartão">
        
        <Toggle checked={prefs.online} onChange={set('online', 'Compras online')} label="Compras online" description="Lojas virtuais e aplicativos" icon={<ShoppingCart className="h-5 w-5" />} />
        
        <Toggle checked={prefs.intl} onChange={set('intl', 'Compras internacionais')} label="Compras internacionais" description="Sites e lojas fora do Brasil" icon={<Globe className="h-5 w-5" />} />
        
        <Toggle checked={prefs.contactless} onChange={set('contactless', 'Pagamento por aproximação')} label="Pagamento por aproximação" description="Maquininhas com aproximação" icon={<Smartphone className="h-5 w-5" />} />
        
        <Toggle checked={prefs.locked} onChange={set('locked', 'Bloqueio temporário')} label="Bloqueio temporário" description="Pausa todas as compras até você reativar" icon={<Lock className="h-5 w-5" />} />
      
      </section>
    
    </div>
  )
}
