import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useDemo } from '../context/DemoContext'
import { IDS, txIdFor } from '../mocks/ids'
import { cx } from '../utils/format'
import { systemStages } from './systemStages'
export function SystemLayout() {
  const { pathname } = useLocation()
  const [params, setParams] = useSearchParams()
  const { transactions } = useDemo()
  // Declara a constante/variável slug e atribui a ela o resultado da expressão desta linha.
  const slug = pathname.split('/')[2] ?? 'received'
  // Declara a constante/variável index e atribui a ela o resultado da expressão desta linha.
  const index = Math.max(0, systemStages.findIndex((s) => s.slug === slug))
  // Declara a constante/variável prev e atribui a ela o resultado da expressão desta linha.
  const prev = systemStages[index - 1]
  // Declara a constante/variável next e atribui a ela o resultado da expressão desta linha.
  const next = systemStages[index + 1]

  // Declara a constante/variável anaInduction e atribui a ela o resultado da expressão desta linha.
  const anaInduction = transactions.find((t) => t.customerId === IDS.ana && t.scenario === 'induction')
  // Declara a constante/variável mariana e atribui a ela o resultado da expressão desta linha.
  const mariana = transactions.find((t) => t.customerId === IDS.mariana && t.scenario === 'related')
  // Declara a constante/variável habitual e atribui a ela o resultado da expressão desta linha.
  const habitual = transactions.find((t) => t.customerId === IDS.ana && t.scenario === 'normal') ?? transactions.find((t) => t.id === txIdFor(183))
  // Declara a constante/variável txOptions e atribui a ela o resultado da expressão desta linha.
  const txOptions = [
    { id: anaInduction?.id ?? habitual?.id, label: 'Ana' },
    { id: mariana?.id, label: 'Mariana' },
    { id: habitual?.id, label: 'Compra habitual' },
  ].filter((o): o is { id: string; label: string } => Boolean(o.id))

  // Declara a constante/variável defaultId e atribui a ela o resultado da expressão desta linha.
  const defaultId = txOptions[0]?.id
  // Declara a constante/variável tx e atribui a ela o resultado da expressão desta linha.
  const tx = params.get('tx') ?? defaultId
  // Declara a constante/variável during e atribui a ela o resultado da expressão desta linha.
  const during = index <= 4
  // Declara a constante/variável qs e atribui a ela o resultado da expressão desta linha.
  const qs = during && tx && tx !== defaultId ? `?tx=${tx}` : ''

  // Executa o hook useEffect, conectando esta parte do componente ao mecanismo correspondente do React.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <div className="grid-faint-dark min-h-screen bg-ink-950 text-white">
      
      <header className="border-b border-white/10">
        
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-4 px-4 py-4 lg:px-8">
          
          <Link to="/" className="rounded-md">
            
          
          </Link>
          
          <div className="flex items-center gap-2 text-[12px]">
            {during && txOptions.length > 0 && (
              
              <div className="flex rounded-lg border border-white/10 p-0.5" role="group" aria-label="Transação exibida">
                {txOptions.map((o) => (
                  <button
                    key={`${o.label}-${o.id}`}
                    type="button"
                    onClick={() => setParams(o.id === defaultId ? {} : { tx: o.id })}
                    aria-pressed={tx === o.id}
                    className={cx('rounded-md px-2.5 py-1 transition-colors', tx === o.id ? 'bg-white text-ink-900' : 'text-white/60 hover:text-white')}
                  >
                    {o.label}
                  
                  </button>
                ))}
              
              </div>
            )}
            
            <Link to="/operations" className="rounded-lg border border-white/10 px-3 py-1.5 text-white/70 hover:border-white/30 hover:text-white">
              Operations
            
            </Link>
          
          </div>
        
        </div>
        
        <nav className="mx-auto max-w-[1320px] px-4 lg:px-8" aria-label="Estágios do motor">
          
          <ol className="scrollbar-thin -mb-px flex gap-1 overflow-x-auto">
            {systemStages.map((s, i) => (
              
              <li key={s.slug} className="flex items-center">
                {i === 5 && <span className="mx-2 h-4 w-px bg-white/15" aria-hidden />}
                <NavLink
                  to={`/system/${s.slug}${i <= 4 ? qs : ''}`}
                  className={({ isActive }) =>
                    cx(
                      'flex items-center gap-2 whitespace-nowrap border-b-2 px-2.5 py-3 text-[12px] transition-colors',
                      isActive ? 'border-trace text-white' : 'border-transparent text-white/45 hover:text-white/80',
                    )
                  }
                >
                  
                  <span className="font-mono text-[11px] text-white/35">{s.n}</span>
                  {s.label}
                
                </NavLink>
              
              </li>
            ))}
          
          </ol>
        
        </nav>
      
      </header>

      
      <main className="mx-auto max-w-[1320px] animate-fade px-4 py-8 lg:px-8 lg:py-12">
        
        <Outlet />
      
      </main>

      
      <footer className="mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-4 pb-20 lg:px-8">
        {prev ? (
          
          <Link to={`/system/${prev.slug}${index - 1 <= 4 ? qs : ''}`} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] text-white/60 hover:bg-white/5 hover:text-white">
            
            <ArrowLeft className="h-4 w-4" aria-hidden /> {prev.label}
          
          </Link>
        ) : (
          
          <span />
        )}
        {next && (
          
          <Link to={`/system/${next.slug}${index + 1 <= 4 ? qs : ''}`} className="inline-flex items-center gap-2 rounded-lg bg-white/[0.06] px-3 py-2 text-[13px] text-white hover:bg-white/10">
            {next.label} <ArrowRight className="h-4 w-4" aria-hidden />
          
          </Link>
        )}
      
      </footer>
    
    </div>
  )
}
