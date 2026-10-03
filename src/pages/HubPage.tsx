import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { IDS, orderIdFor, txIdFor } from '../mocks/ids'
import { normalizePhone, phoneEntityId } from '../services/intel'
import { Button } from '../components/ui/Button'
import { cx } from '../utils/format'

// a constante/variável moments e atribui a ela o resultado da expressão desta linha.
const moments = [
  {
    label: 'Antes',
    title: 'Confira antes de pagar',
    body: 'A cliente verifica loja, telefone ou mensagem antes de fazer uma compra que alguém pediu.',
    to: '/security/check',
  },
  {
    label: 'Durante',
    title: 'Contexto antes da autorização',
    to: '/store',
  },
  {
    label: 'Depois',
    title: 'Um relato protege a próxima pessoa',
    body: '“Fui vítima” vira inteligência: os elementos do golpe passam a proteger compras relacionadas.',
    to: '/security/report',
  },
]

// a constante/variável contexts e atribui a ela o resultado da expressão desta linha.
const contexts = [
  { who: 'Cliente', title: 'Loja NEXA e app Aureon', body: 'O que a pessoa vê: checkout, verificação, alertas e relato. Sem pontuações nem regras internas.', links: [{ to: '/store', label: 'Loja NEXA' }, { to: '/security', label: 'App Aureon' }] },
  { who: 'Analista', title: 'Operations', body: 'Transações, evidências, timeline, incidentes, inteligência e auditoria — tudo ligado por correlation ID.', links: [{ to: '/operations', label: 'Abrir Operations' }] },
  { who: 'Sistema', title: 'Motor em estágios', body: 'Do recebimento da transação à detecção de uma compra relacionada, estágio por estágio.', links: [{ to: '/system/received', label: 'Ver estágios' }] },
]

// a constante/variável script e atribui a ela o resultado da expressão desta linha.
const script = [
  { n: 1, text: 'Abra o Demo Center, escolha “Possível indução” e clique em Iniciar na loja.', to: '/store' },
  { n: 2, text: 'Finalize a compra da Ana; na revisão, responda “Recebi um link por mensagem”.', to: '/store/checkout/review' },
  { n: 3, text: 'Responda à verificação como alguém orientado e interrompa a compra.', to: '/store/checkout/verification' },
  { n: 4, text: 'No app Aureon, registre o caso em “Fui vítima”.', to: '/security/report' },
  { n: 5, text: 'Em Operations, veja o incidente e as relações em Intelligence.', to: '/operations/intelligence' },
  { n: 6, text: 'Volte ao Demo Center, escolha “Nova compra relacionada” (Mariana) e repita a compra.', to: '/store' },
  { n: 7, text: 'Confira o estágio 49: a compra foi interrompida pela relação com o relato.', to: '/system/related-detected' },
]

// a constante/variável screenMap e atribui a ela o resultado da expressão desta linha.
const screenMap: { group: string; items: [string, string, string][] }[] = [
  {
    group: 'Loja NEXA',
    items: [
      ['01', 'Home', '/store'],
      ['02', 'Catálogo', '/store/catalog'],
      ['03', 'Categoria', '/store/category/informatica'],
      ['04', 'Busca', '/store/search?q=notebook'],
      ['05', 'Produto', '/store/product/prod-001'],
      ['06', 'Vendedor', `/store/seller/${IDS.sellerNexa}`],
      ['07', 'Carrinho', '/store/cart'],
      ['08', 'Checkout · Entrega', '/store/checkout/delivery'],
      ['09', 'Checkout · Pagamento', '/store/checkout/payment'],
      ['10', 'Checkout · Revisão', '/store/checkout/review'],
      ['12', 'Verificação necessária', '/store/checkout/verification'],
      ['13', 'Compra aprovada', `/store/checkout/approved?tx=${txIdFor(183)}`],
      ['14', 'Compra interrompida', '/store/checkout/interrupted'],
      ['15', 'Confirmação do pedido', `/store/order/${orderIdFor(183)}/confirmation`],
      ['16', 'Histórico de pedidos', '/store/orders'],
      ['17', 'Detalhes do pedido', `/store/orders/${orderIdFor(183)}`],
    ],
  },
  {
    group: 'App Aureon',
    items: [
      ['19', 'Home', '/security'],
      ['20', 'Cartões', '/security/cards'],
      ['21', 'Compras', '/security/transactions'],
      ['22', 'Detalhe da compra', `/security/transactions/${txIdFor(183)}`],
      ['23', 'Dispositivos', '/security/devices'],
      ['24', 'Alertas', '/security/alerts'],
      ['26', 'Antes de pagar', '/security/check'],
      ['27', 'Detector de mensagem', '/security/check/message'],
    ],
  },
  {
    group: 'Fui vítima',
    items: [
      ['28', 'Introdução', '/security/report'],
      ['29', 'Tipo', '/security/report/type'],
      ['30', 'Transação', '/security/report/transaction'],
      ['31', 'Descrição', '/security/report/description'],
      ['32', 'Revisão', '/security/report/review'],
      ['33', 'Registrado', '/security/report/done'],
      ['34', 'Acompanhamento', '/security/report'],
    ],
  },
  {
    group: 'Operations',
    items: [
      ['35', 'Overview', '/operations'],
      ['36', 'Transactions', '/operations/transactions'],
      ['37', 'Transaction detail', `/operations/transactions/${txIdFor(152)}`],
      ['38', 'Incidents', '/operations/incidents'],
      ['39', 'Incident detail', `/operations/incidents/${IDS.incRafael}`],
      ['40', 'Evidence', `/operations/evidence?tx=${txIdFor(183)}`],
      ['41', 'Timeline', '/operations/timeline'],
      ['42', 'Intelligence', '/operations/intelligence'],
      ['43', 'Relationship detail', `/operations/intelligence/${phoneEntityId(normalizePhone('(11) 90000-2184'))}`],
      ['44', 'Audit', '/operations/audit'],
      ['45', 'Architecture', '/operations/architecture'],
    ],
  },
  {
    group: 'Motor',
    items: [
      ['46', 'Transaction received', '/system/received'],
      ['47', 'Context analysis', '/system/context'],
      ['48', 'Evidence collection', '/system/evidence'],
      ['49', 'Decision generated', '/system/decision'],
      ['50', 'Intervention triggered', '/system/intervention'],
      ['51', 'Incident received', '/system/incident-received'],
      ['52', 'Intelligence updated', '/system/intelligence-updated'],
      ['53', 'Related transaction detected', '/system/related-detected'],
    ],
  },
  {
    group: 'Pesquisa e modelo',
    items: [
      ['54', 'Intelligence overview', '/operations/intelligence'],
      ['57', 'Decision Fragility', '/operations/fragility'],
      ['56', 'Evidence Independence', '/operations/independence'],
      ['58', 'Decision Chaos Lab', '/operations/chaos'],
      ['59', 'Cenário do Chaos Lab', '/operations/chaos/liar'],
      ['60', 'Policy engine', '/operations/policy'],
      ['74', 'DER / MER', '/operations/model'],
    ],
  },
]
export function HubPage() {
  const [mapOpen, setMapOpen] = useState(false)

  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <div className="min-h-screen bg-canvas text-ink-900">
      
      <header className="contour-dark relative overflow-hidden bg-ink-950 text-white">
        
        <div className="mx-auto max-w-stage px-4 pb-16 pt-8 lg:px-8 lg:pb-24">
          
          <div className="flex items-center justify-between gap-4">
            
            
            <nav className="hidden items-center gap-1 text-[13px] sm:flex" aria-label="Contextos">
              
              <Link to="/store" className="rounded-md px-3 py-1.5 text-white/70 hover:bg-white/5 hover:text-white">
                Cliente
              
              </Link>
              
              <Link to="/operations" className="rounded-md px-3 py-1.5 text-white/70 hover:bg-white/5 hover:text-white">
                Analista
              
              </Link>
              
              <Link to="/system/received" className="rounded-md px-3 py-1.5 text-white/70 hover:bg-white/5 hover:text-white">
                Sistema
              
              </Link>
            
            </nav>
          
          </div>

          
          <div className="mt-16 max-w-3xl lg:mt-24">
            
            <p className="font-mono text-[12px] text-trace">Contexto · proteção · decisão</p>
            
            <h1 className="mt-4 font-display text-[40px] font-semibold leading-[1.08] tracking-[-0.02em] sm:text-[56px]">
              Nem todo golpe parece uma compra estranha.
            
            </h1>
            
            <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-white/70">
            
            </p>
            
            <div className="mt-8 flex flex-wrap gap-3">
              
              <Button variant="inverse" size="lg" to="/store" iconRight={<ArrowRight className="h-4 w-4" />}>
                Começar pela loja
              
              </Button>
              
              <Button variant="ghost" size="lg" className="text-white hover:bg-white/10" to="/operations">
                Ver Operations
              
              </Button>
            
            </div>
          
          </div>
        
        </div>
      
      </header>

      
      <main className="mx-auto max-w-stage px-4 lg:px-8">
        
        <section className="relative z-10 -mt-8 bg-paper px-5 py-2 shadow-lift md:px-8" aria-label="Antes, durante e depois">
          {moments.map((m, i) => (
            
            <Link key={m.label} to={m.to} className="group grid gap-2 border-b border-line py-6 last:border-b-0 md:grid-cols-[120px_1fr_auto] md:items-baseline">
              
              <span className="font-display text-[20px] font-semibold">{m.label}</span>
              
              <span>
                
                <span className="block text-[16px] font-medium">{m.title}</span>
                
                <span className="mt-1 block text-[14px] leading-relaxed text-muted">{m.body}</span>
              
              </span>
              
              <span className="text-[13px] font-medium text-signal-ink group-hover:underline">Abrir</span>
              
              <span className="sr-only">etapa {i + 1}</span>
            
            </Link>
          ))}
        
        </section>

        
        <section className="mt-16" aria-labelledby="ctx">
          
          <h2 id="ctx" className="font-display text-[24px] font-semibold tracking-[-0.02em]">
            Três contextos, uma mesma jornada
          
          </h2>
          
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {contexts.map((c) => (
              
              <div key={c.who} className="flex flex-col rounded-2xl border border-line bg-paper p-6">
                
                <p className="eyebrow">{c.who}</p>
                
                <p className="mt-2 font-display text-[18px] font-semibold">{c.title}</p>
                
                <p className="mt-1 flex-1 text-[14px] leading-relaxed text-muted">{c.body}</p>
                
                <div className="mt-5 flex flex-wrap gap-2">
                  {c.links.map((l) => (
                    
                    <Button key={l.to} size="sm" variant="secondary" to={l.to}>
                      {l.label}
                    
                    </Button>
                  ))}
                
                </div>
              
              </div>
            ))}
          
          </div>
        
        </section>

        
        <section className="mt-16 grid gap-6 lg:grid-cols-[1.2fr_1fr]" aria-labelledby="script">
          
          <div className="rounded-2xl border border-line bg-paper p-6">
            
            <h2 id="script" className="font-display text-[20px] font-semibold">
              Roteiro de demonstração
            
            </h2>
            
            <ol className="mt-5 space-y-3">
              {script.map((s) => (
                
                <li key={s.n} className="flex gap-3">
                  
                  <span className="tabular flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink-900 font-mono text-[11px] text-white">{s.n}</span>
                  
                  <Link to={s.to} className="text-[14px] leading-snug text-ink-800 hover:underline">
                    {s.text}
                  
                  </Link>
                
                </li>
              ))}
            
            </ol>
          
          </div>
          
          <div className="border-t border-line pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            
            <h2 className="font-display text-[20px] font-semibold">Continuar</h2>
            
            <p className="mt-2 text-[14px] leading-relaxed text-muted">
              O progresso da história fica no Demo Center, no canto da tela. Daqui, o caminho natural é a loja.
            
            </p>
            
            <div className="mt-5">
              
              <Button to="/store">Abrir a loja NEXA</Button>
            
            </div>
          
          </div>
        
        </section>

        
        <section className="mt-16" aria-labelledby="map">
          <button
            type="button"
            onClick={() => setMapOpen((v) => !v)}
            aria-expanded={mapOpen}
            className="flex w-full items-center justify-between rounded-2xl border border-line bg-paper px-6 py-4 text-left hover:border-line-strong"
          >
            
            <span id="map" className="font-display text-[18px] font-semibold">
            Mapa de telas
            
            </span>
            
            <ChevronDown className={cx('h-5 w-5 text-muted transition-transform', mapOpen && 'rotate-180')} aria-hidden />
          
          </button>
          {mapOpen && (
            
            <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {screenMap.map((g) => (
                
                <div key={g.group} className="rounded-2xl border border-line bg-paper p-5">
                  
                  <p className="eyebrow">{g.group}</p>
                  
                  <ul className="mt-3 space-y-1">
                    {g.items.map(([n, label, to]) => (
                      
                      <li key={to}>
                        
                        <Link to={to} className="flex items-baseline gap-3 rounded-md px-2 py-1 text-[13px] hover:bg-canvas">
                          
                          <span className="tabular w-6 font-mono text-[11px] text-subtle">{n}</span>
                          {label}
                        
                        </Link>
                      
                      </li>
                    ))}
                  
                  </ul>
                
                </div>
              ))}
            
            </div>
          )}
        
        </section>

        
        <footer className="mt-16 border-t border-line py-10 text-[13px] text-muted">
          
          <p className="max-w-3xl leading-relaxed">
          
          </p>
          
          <p className="mt-2">NEXA e Aureon são marcas fictícias. Nenhum dado real de cartão é solicitado. Nenhuma detecção é perfeita.</p>
        
        </footer>
      
      </main>
    
    </div>
  )
}
