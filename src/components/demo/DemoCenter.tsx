import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ChevronDown, FastForward, MessageSquareText, Play, RotateCcw, SlidersHorizontal } from 'lucide-react'
import { useDemo } from '../../context/DemoContext'
import { useCart } from '../../context/CartContext'
import { scenarios } from '../../mocks/scenarios'
import { getProductById } from '../../mocks/products'
import { getCustomer } from '../../mocks/people'
import { IDS } from '../../mocks/ids'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { ChoiceCard } from '../ui/Form'
import { Alert } from '../ui/Feedback'
import { CycleTracker } from '../shield/CycleTracker'
import { formatBRL } from '../../utils/format'

// a constante/variável shortcuts e atribui a ela o resultado da expressão desta linha.
const shortcuts = [
  { label: 'Visão geral', to: '/' },
  { label: 'Loja NEXA', to: '/store' },
  { label: 'App Aureon', to: '/security' },
  { label: 'Fui vítima', to: '/security/report' },
  { label: 'Operations', to: '/operations' },
  { label: 'Intelligence', to: '/operations/intelligence' },
  { label: 'Fragilidade', to: '/operations/fragility' },
  { label: 'Chaos Lab', to: '/operations/chaos' },
  { label: 'Arquitetura', to: '/operations/architecture' },
  { label: 'Motor', to: '/system/received' },
]
export function DemoCenter() {
  const [open, setOpen] = useState(false)
  const [showMessages, setShowMessages] = useState(false)
  const { scenario, setScenario, incidents, loadStory, reset } = useDemo()
  const { replaceWith, clear } = useCart()
  // Declara a constante/variável navigate e atribui a ela o resultado da expressão desta linha.
  const navigate = useNavigate()
  // Declara a constante/variável location e atribui a ela o resultado da expressão desta linha.
  const location = useLocation()
  // Declara a constante/variável onSystem e atribui a ela o resultado da expressão desta linha.
  const onSystem = location.pathname.startsWith('/system') || location.pathname.startsWith('/operations')
  // Declara a constante/variável aboveTabBar e atribui a ela o resultado da expressão desta linha.
  const aboveTabBar = location.pathname.startsWith('/security')
  // Declara a constante/variável anaIncident e atribui a ela o resultado da expressão desta linha.
  const anaIncident = incidents.some((i) => i.customerId === IDS.ana && i.closedAs !== 'not-scam')

  // Declara a constante/variável start e atribui a ela o resultado da expressão desta linha.
  const start = () => {
    // Declara a constante/variável productId e atribui a ela o resultado da expressão desta linha.
    const productId = scenario.cart[0]?.productId
    // Verifica a condição antes de executar o bloco seguinte.
    if (productId) replaceWith(productId)
    // Atualiza o estado associado ao setter desta variável; o React agenda uma nova renderização quando necessário.
    setOpen(false)
    // Executa a chamada desta função/event handler, passando os argumentos definidos nesta linha.
    navigate(productId ? `/store/product/${productId}` : '/store')
  }

  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          'fixed right-4 z-[70] inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[12px] font-medium shadow-lift transition-colors ' +
          (aboveTabBar ? 'bottom-20 lg:bottom-4 ' : 'bottom-4 ') +
          (onSystem ? 'border-white/10 bg-ink-800 text-white/85 hover:bg-ink-700' : 'border-line bg-paper text-ink-800 hover:border-line-strong')
        }
        aria-haspopup="dialog"
      >
        
        <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
        Demo Center
      
      </button>

      
      <Modal open={open} onClose={() => setOpen(false)} title="Demo Center" side>
        
        <p className="-mt-1 text-[13px] text-muted">Atalhos para apresentar os fluxos. Dados fictícios, sem banco nem cartão reais.</p>

        
        <section className="mt-6" aria-labelledby="dc-scen">
          
          <h3 id="dc-scen" className="eyebrow mb-3">
            Cenário de compra
          
          </h3>
          
          <div className="space-y-2">
            {scenarios.map((sc) => {
              const product = getProductById(sc.cart[0]?.productId ?? '')
              return (
                <ChoiceCard
                  key={sc.id}
                  name="scenario"
                  value={sc.id}
                  checked={scenario.id === sc.id}
                  onChange={(v) => setScenario(v as typeof sc.id)}
                  title={sc.title}
                  description={`${getCustomer(sc.customerId)?.firstName} · ${product?.name} · ${formatBRL(product?.price ?? 0)}`}
                />
              )
            })}
          
          </div>
          
          <p className="mt-2 text-[12px] text-muted">{scenario.summary}</p>
          {scenario.id === 'related' && !anaIncident && (
            
            <Alert tone="warn" className="mt-3" title="A relação ainda não existe">
              Registre antes o relato da Ana em “Fui vítima”. Sem ele, a compra da Mariana passa só pela verificação comum.
            
            </Alert>
          )}
          
          <div className="mt-3 flex gap-2">
            
            <Button icon={<Play className="h-4 w-4" />} onClick={start} fullWidth>
              Iniciar na loja
            
            </Button>
          
          </div>
        
        </section>

        
        <section className="mt-8" aria-labelledby="dc-cycle">
          
          <h3 id="dc-cycle" className="eyebrow mb-2">
            Ciclo Ana → Intelligence → Mariana
          
          </h3>
          
          <div onClick={() => setOpen(false)}>
            
            <CycleTracker />
          
          </div>
        
        </section>

        {scenario.outside && (
          
          <section className="mt-8" aria-labelledby="dc-ext">
            <button
              type="button"
              onClick={() => setShowMessages((v) => !v)}
              className="flex w-full items-center justify-between rounded-lg border border-line px-3 py-2.5 text-left hover:bg-canvas"
              aria-expanded={showMessages}
              id="dc-ext"
            >
              
              <span className="flex items-center gap-2 text-[13px] font-medium text-ink-900">
                
                <MessageSquareText className="h-4 w-4 text-muted" aria-hidden />
                Contexto externo do cenário
              
              </span>
              
              <ChevronDown className={'h-4 w-4 text-muted transition-transform ' + (showMessages ? 'rotate-180' : '')} aria-hidden />
            
            </button>
            {showMessages && (
              
              <div className="mt-2 rounded-xl bg-[#EEF0EC] p-3">
                
                <p className="mb-2 text-[11px] text-muted">
                  {scenario.outside.sender} · {scenario.outside.channel}
                
                </p>
                
                <ul className="space-y-1.5">
                  {scenario.outside.messages.map((m) => (
                    
                    <li key={m.at + m.text} className="max-w-[88%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-[13px] leading-snug text-ink-900 shadow-sm">
                      {m.text}
                      
                      <span className="ml-2 font-mono text-[10px] text-subtle">{m.at}</span>
                    
                    </li>
                  ))}
                
                </ul>
                
              
              </div>
            )}
          
          </section>
        )}

        
        <section className="mt-8" aria-labelledby="dc-short">
          
          <h3 id="dc-short" className="eyebrow mb-2">
            Ir para
          
          </h3>
          
          <div className="grid grid-cols-2 gap-1.5">
            {shortcuts.map((s) => (
              
              <Link key={s.to} to={s.to} onClick={() => setOpen(false)} className="rounded-lg border border-line px-3 py-2 text-[13px] text-ink-800 hover:border-line-strong hover:bg-canvas">
                {s.label}
              
              </Link>
            ))}
          
          </div>
        
        </section>

        
        <section className="mt-8 border-t border-line pt-5">
          
          <div className="flex flex-col gap-2 sm:flex-row">
            
            <Button variant="secondary" icon={<FastForward className="h-4 w-4" />} onClick={loadStory} fullWidth>
              Carregar história completa
            
            </Button>
            <Button
              variant="ghost"
              icon={<RotateCcw className="h-4 w-4" />}
              onClick={() => {
                reset()
                clear()
              }}
              fullWidth
            >
              Reiniciar
            
            </Button>
          
          </div>
        
        </section>
      
      </Modal>
    </>
  )
}
