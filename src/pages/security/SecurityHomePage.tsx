import { Link } from 'react-router-dom'
import { AlertTriangle, ChevronRight, LifeBuoy, MessageSquareWarning, ScanSearch } from 'lucide-react'
import { useDemo } from '../../context/DemoContext'
import { availableLimit, txTitle } from '../../services/present'
import { AlertRow, CardVisual, PurchaseRow, useViewerData } from '../../components/security/SecurityParts'
import { ProtectedBy } from '../../components/brand/Brand'
import { Button } from '../../components/ui/Button'
import { formatBRL } from '../../utils/format'

// a função greeting. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function greeting(iso: string) {
  // Declara a constante/variável h e atribui a ela o resultado da expressão desta linha.
  const h = new Date(iso).getHours()
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return h < 12 ? 'Bom dia,' : h < 18 ? 'Boa tarde,' : 'Boa noite,'
}
export function SecurityHomePage() {
  const { now, transactions } = useDemo()
  const { viewer, card, mine, pending, alerts } = useViewerData()
  // Declara a constante/variável recentAlerts e atribui a ela o resultado da expressão desta linha.
  const recentAlerts = alerts.filter((a) => !a.pending).slice(0, 3)
  // Declara a constante/variável first e atribui a ela o resultado da expressão desta linha.
  const first = pending[0]

  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <div>
      
      <header className="border-b border-line pb-6">
        
        <p className="text-[14px] text-muted">{greeting(now)}</p>
        
        <h1 className="mt-1 font-display text-[34px] font-semibold tracking-[-0.03em]">{viewer.firstName}</h1>
      
      </header>

      {first && (
        
        <Link to={`/security/verification/${first.id}`} className="mt-6 flex items-center gap-4 rounded-xl bg-warn-soft px-4 py-4 transition-colors hover:bg-warn-soft/70">
          
          <AlertTriangle className="h-5 w-5 shrink-0 text-warn" aria-hidden />
          
          <div className="min-w-0 flex-1">
            
            <p className="font-medium text-ink-900">{first.status === 'INTERVENTION' ? 'Uma compra está pausada para a sua proteção' : 'Confirme uma compra'}</p>
            
            <p className="truncate text-[14px] text-warn-ink">
              {txTitle(first)} · {formatBRL(first.amount)}
            
            </p>
          
          </div>
          
          <ChevronRight className="h-5 w-5 shrink-0 text-warn-ink" aria-hidden />
        
        </Link>
      )}

      {card && (
        
        <section className="mt-8 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end" aria-label="Cartão">
          
          <div>
            
            <p className="text-[13px] text-muted">Limite disponível</p>
            
            <p className="tabular mt-1 font-display text-[40px] font-semibold tracking-tight">{formatBRL(availableLimit(card, transactions))}</p>
            
            <p className="mt-1 text-[14px] text-muted">
              de {formatBRL(card.limit)} no {card.product}
            
            </p>
            
            <div className="mt-5 flex flex-wrap gap-2">
              
              <Button size="sm" variant="secondary" to="/security/cards">
                Gerenciar cartão
              
              </Button>
              
              <Button size="sm" variant="ghost" to="/security/transactions">
                Ver compras
              
              </Button>
            
            </div>
          
          </div>
          
          <Link to="/security/cards" aria-label="Ver cartão" className="w-full max-w-[300px]">
            
            <CardVisual card={card} />
          
          </Link>
        
        </section>
      )}

      
      <nav className="mt-10 grid gap-3 sm:grid-cols-3" aria-label="Segurança">
        {[
          { to: '/security/check', icon: ScanSearch, title: 'Antes de pagar, confira', text: 'Site, telefone, CNPJ ou chave' },
          { to: '/security/check/message', icon: MessageSquareWarning, title: 'Recebi uma mensagem', text: 'Veja se ela tem sinais de golpe' },
          { to: '/security/report', icon: LifeBuoy, title: 'Fui vítima de golpe', text: 'Conte o que aconteceu' },
        ].map((a) => (
          
          <Link key={a.to} to={a.to} className="group rounded-xl border border-line bg-paper p-4 transition-colors hover:border-aureon-deep/40">
            
            <a.icon className="h-5 w-5 text-aureon-deep" aria-hidden />
            
            <p className="mt-3 text-[14px] font-semibold group-hover:underline">{a.title}</p>
            
            <p className="mt-0.5 text-[13px] text-muted">{a.text}</p>
          
          </Link>
        ))}
      
      </nav>

      
      <section className="mt-10" aria-labelledby="recent">
        
        <div className="flex items-end justify-between">
          
          <h2 id="recent" className="font-display text-[20px] font-semibold">
            Compras recentes
          
          </h2>
          
          <Link to="/security/transactions" className="text-[14px] text-muted hover:text-ink-900">
            Ver todas
          
          </Link>
        
        </div>
        {mine.length === 0 ? (
          
          <p className="mt-3 rounded-xl border border-line bg-paper px-4 py-6 text-center text-[14px] text-muted">Nenhuma compra neste cartão ainda.</p>
        ) : (
          
          <ul className="mt-3 divide-y divide-line overflow-hidden rounded-xl border border-line bg-paper">
            {mine.slice(0, 4).map((t) => (
              
              <PurchaseRow key={t.id} tx={t} />
            ))}
          
          </ul>
        )}
      
      </section>

      {recentAlerts.length > 0 && (
        
        <section className="mt-10" aria-labelledby="alerts">
          
          <div className="flex items-end justify-between">
            
            <h2 id="alerts" className="font-display text-[20px] font-semibold">
              Alertas
            
            </h2>
            
            <Link to="/security/alerts" className="text-[14px] text-muted hover:text-ink-900">
              Ver todos
            
            </Link>
          
          </div>
          
          <ul className="mt-3 divide-y divide-line overflow-hidden rounded-xl border border-line bg-paper">
            {recentAlerts.map((a) => (
              
              <AlertRow key={a.id} alert={a} />
            ))}
          
          </ul>
        
        </section>
      )}

      
      <ProtectedBy className="mt-10 flex justify-center" />
    
    </div>
  )
}
