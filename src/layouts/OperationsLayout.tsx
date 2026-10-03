import { useEffect, useState, type FormEvent } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Activity,
  ArrowLeftRight,
  Boxes,
  Database,
  FileSearch,
  FlaskConical,
  FolderOpen,
  GitFork,
  History,
  LayoutGrid,
  Menu,
  ScrollText,
  Search,
  Shield,
  SlidersHorizontal,
  Workflow,
  X,
} from 'lucide-react'
import { useDemo } from '../context/DemoContext'
import { cx } from '../utils/format'

// a constante/variável groups e atribui a ela o resultado da expressão desta linha.
const groups = [
  {
    label: 'Monitoramento',
    items: [
      { to: '/operations', label: 'Overview', icon: LayoutGrid, end: true },
      { to: '/operations/transactions', label: 'Transactions', icon: ArrowLeftRight },
      { to: '/operations/incidents', label: 'Incidents', icon: FolderOpen },
    ],
  },
  {
    label: 'Investigação',
    items: [
      { to: '/operations/evidence', label: 'Evidence', icon: FileSearch },
      { to: '/operations/timeline', label: 'Timeline', icon: History },
      { to: '/operations/intelligence', label: 'Intelligence', icon: GitFork },
      { to: '/operations/fragility', label: 'Fragility', icon: Shield },
      { to: '/operations/chaos', label: 'Chaos Lab', icon: FlaskConical },
    ],
  },
  {
    label: 'Governança',
    items: [
      { to: '/operations/audit', label: 'Audit', icon: ScrollText },
      { to: '/operations/architecture', label: 'Architecture', icon: Boxes },
      { to: '/operations/model', label: 'DER / MER', icon: Database },
      { to: '/operations/policy', label: 'Policy', icon: SlidersHorizontal },
      { to: '/system/received', label: 'Motor (estágios)', icon: Workflow },
    ],
  },
]

// a função resolveSearch. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function resolveSearch(raw: string): string | null {
  // Declara a constante/variável v e atribui a ela o resultado da expressão desta linha.
  const v = raw.trim().toUpperCase()
  // Verifica a condição antes de executar o bloco seguinte.
  if (/^TX-\d{4}-\d{6}$/.test(v)) return `/operations/transactions/${v}`
  // Verifica a condição antes de executar o bloco seguinte.
  if (/^CS-\d{4}-\d{6}$/.test(v)) return `/operations/incidents/${v}`
  // Verifica a condição antes de executar o bloco seguinte.
  if (/^CTX-\d{4}-[0-9A-F]{6}$/.test(v)) return `/operations/timeline?c=${v}`
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return null
}
export function OperationsLayout() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [searchError, setSearchError] = useState(false)
  const { pathname } = useLocation()
  // Declara a constante/variável navigate e atribui a ela o resultado da expressão desta linha.
  const navigate = useNavigate()
  const { incidents } = useDemo()
  // Declara a constante/variável openIncidents e atribui a ela o resultado da expressão desta linha.
  const openIncidents = incidents.filter((i) => i.status !== 'CLOSED').length

  // Executa o hook useEffect, conectando esta parte do componente ao mecanismo correspondente do React.
  useEffect(() => {
    // Atualiza o estado associado ao setter desta variável; o React agenda uma nova renderização quando necessário.
    setOpen(false)
    window.scrollTo(0, 0)
  }, [pathname])

  // Declara a constante/variável onSearch e atribui a ela o resultado da expressão desta linha.
  const onSearch = (e: FormEvent) => {
    e.preventDefault()
    // Declara a constante/variável route e atribui a ela o resultado da expressão desta linha.
    const route = resolveSearch(q)
    // Verifica a condição antes de executar o bloco seguinte.
    if (route) {
      // Atualiza o estado associado ao setter desta variável; o React agenda uma nova renderização quando necessário.
      setSearchError(false)
      // Atualiza o estado associado ao setter desta variável; o React agenda uma nova renderização quando necessário.
      setQ('')
      // Executa a chamada desta função/event handler, passando os argumentos definidos nesta linha.
      navigate(route)
    // Caso a condição anterior não seja atendida, executa o caminho alternativo.
    } else {
      // Atualiza o estado associado ao setter desta variável; o React agenda uma nova renderização quando necessário.
      setSearchError(true)
    }
  }

  // Declara a constante/variável sidebar e atribui a ela o resultado da expressão desta linha.
  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="px-5 pb-5 pt-6">
        <Link to="/operations" className="rounded-md">
        </Link>
      </div>
      <nav className="scrollbar-thin flex-1 space-y-6 overflow-y-auto px-3 pb-6" aria-label="Operations">
        {groups.map((g) => (
          <div key={g.label}>
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">{g.label}</p>
            <ul className="space-y-0.5">
              {g.items.map((it) => (
                <li key={it.to}>
                  <NavLink
                    to={it.to}
                    end={it.end}
                    className={({ isActive }) =>
                      cx(
                        'group relative flex items-center gap-3 rounded-md px-3 py-2 text-[13px] transition-colors',
                        isActive ? 'bg-white/[0.08] text-white' : 'text-white/60 hover:bg-white/[0.04] hover:text-white',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && <span className="absolute inset-y-1.5 left-0 w-[2px] rounded-full bg-trace" aria-hidden />}
                        <it.icon className="h-4 w-4" aria-hidden />
                        <span className="flex-1">{it.label}</span>
                        {it.to === '/operations/incidents' && openIncidents > 0 && (
                          <span className="tabular rounded bg-white/10 px-1.5 text-[11px] text-white/80">{openIncidents}</span>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-white/10 px-5 py-4">
        <div className="flex items-center gap-2 text-[12px] text-white/70">
          <Activity className="h-3.5 w-3.5 text-trace" aria-hidden /> Protótipo
        </div>
        <p className="mt-1 text-[11px] leading-snug text-white/35">Dados fictícios. Sem integração com bancos ou redes de pagamento.</p>
      </div>
    </div>
  )

  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <div className="flex min-h-screen bg-canvas text-ink-900">
      
      <aside className="sticky top-0 hidden h-screen w-[232px] shrink-0 bg-ink-950 lg:block">{sidebar}</aside>

      {open && (
        
        <div className="fixed inset-0 z-50 lg:hidden">
          
          <div className="absolute inset-0 bg-ink-950/50" onClick={() => setOpen(false)} aria-hidden />
          
          <div className="absolute inset-y-0 left-0 w-[260px] animate-rise bg-ink-950">
            
            <button type="button" onClick={() => setOpen(false)} className="absolute right-3 top-5 rounded p-1.5 text-white/60 hover:text-white" aria-label="Fechar menu">
              
              <X className="h-4 w-4" />
            
            </button>
            {sidebar}
          
          </div>
        
        </div>
      )}

      
      <div className="flex min-w-0 flex-1 flex-col">
        
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-paper/95 px-4 backdrop-blur lg:px-8">
          
          <button type="button" onClick={() => setOpen(true)} className="rounded-md p-1.5 text-ink-800 hover:bg-canvas lg:hidden" aria-label="Abrir menu">
            
            <Menu className="h-5 w-5" />
          
          </button>
          
          <form onSubmit={onSearch} className="relative max-w-md flex-1" role="search">
            
            <label htmlFor="ops-search" className="sr-only">
              Buscar por ID de transação, incidente ou correlation ID
            
            </label>
            
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" aria-hidden />
            <input
              id="ops-search"
              value={q}
              onChange={(e) => {
                setQ(e.target.value)
                setSearchError(false)
              }}
              placeholder="TX-2026-000184 · CS-2026-001284 · CTX-2026-8F21A7"
              className={cx(
                'h-9 w-full rounded-lg border bg-canvas pl-9 pr-3 font-mono text-[12px] placeholder:font-sans placeholder:text-subtle focus:bg-paper focus:outline-none focus:ring-2 focus:ring-signal/20',
                searchError ? 'border-risk' : 'border-line',
              )}
              aria-invalid={searchError || undefined}
              aria-describedby={searchError ? 'ops-search-err' : undefined}
            />
            {searchError && (
              
              <p id="ops-search-err" className="absolute left-0 top-full mt-1 rounded bg-paper px-2 py-1 text-[11px] text-risk-ink shadow-panel" role="alert">
                Use um ID completo: TX-…, CS-… ou CTX-…
              
              </p>
            )}
          
          </form>
          
          <div className="ml-auto flex items-center gap-3">
            
            <span className="hidden items-center gap-1.5 rounded-full border border-trace/30 bg-trace-soft px-2.5 py-1 text-[11px] font-medium text-trace-ink md:inline-flex">
              
              <span className="h-1.5 w-1.5 animate-breathe rounded-full bg-trace" aria-hidden />
              Monitorando
            
            </span>
            
            <span className="flex items-center gap-2">
              
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-800 text-[11px] font-semibold text-white" aria-hidden>
                LM
              
              </span>
              
              <span className="hidden text-[12px] leading-tight sm:block">
                
                <span className="block font-medium text-ink-900">L. Moreira</span>
                
                <span className="text-subtle">Analista de proteção</span>
              
              </span>
            
            </span>
          
          </div>
        
        </header>
        
        <main className="mx-auto w-full max-w-ops flex-1 animate-fade px-4 py-6 lg:px-8 lg:py-8">
          
          <Outlet />
        
        </main>
      
      </div>
    
    </div>
  )
}
