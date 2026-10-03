import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Bell, CreditCard, Home, LifeBuoy, ListChecks, MonitorSmartphone, ScanSearch, ShieldCheck } from 'lucide-react'
import { AureonLogo, ProtectedBy } from '../components/brand/Brand'
import { useDemo } from '../context/DemoContext'
import { cardFor, customers } from '../mocks/people'
import { useViewerData } from '../components/security/SecurityParts'
import { cx } from '../utils/format'

// a constante/variável nav e atribui a ela o resultado da expressão desta linha.
const nav = [
  { to: '/security', label: 'Início', icon: Home, end: true },
  { to: '/security/cards', label: 'Cartões', icon: CreditCard },
  { to: '/security/transactions', label: 'Compras', icon: ListChecks },
  { to: '/security/alerts', label: 'Alertas', icon: Bell },
  { to: '/security/devices', label: 'Dispositivos', icon: MonitorSmartphone },
  { to: '/security/protection', label: 'Proteção', icon: ShieldCheck },
  { to: '/security/check', label: 'Antes de pagar', icon: ScanSearch },
  { to: '/security/report', label: 'Fui vítima', icon: LifeBuoy },
]

// a constante/variável mobileNav e atribui a ela o resultado da expressão desta linha.
const mobileNav = [nav[0], nav[2], nav[3], nav[6], nav[7]]

// a função AccountSwitch. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function AccountSwitch({ dark }: { dark?: boolean }) {
  const { viewer, setViewer } = useDemo()
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <label className={cx('block text-[11px]', dark ? 'text-white/45' : 'text-subtle')}>
      
      <span className="sr-only">Conta em uso na demonstração</span>
      <select
        value={viewer.id}
        onChange={(e) => setViewer(e.target.value)}
        className={cx(
          'w-full cursor-pointer rounded-md border bg-transparent px-2 py-1 text-[12px] focus:outline-none focus-visible:ring-2',
          dark ? 'border-white/15 text-white/80 focus-visible:ring-white/40 [&>option]:text-ink-900' : 'border-line text-ink-800 focus-visible:ring-aureon-deep/40',
        )}
      >
        {customers.map((c) => (
          
          <option key={c.id} value={c.id}>
            {c.name}
          
          </option>
        ))}
      
      </select>
    
    </label>
  )
}

export function SecurityLayout() {
  const { pathname } = useLocation()
  const { viewer, pending, alerts } = useViewerData()
  const card = cardFor(viewer.id)
  const unread = alerts.filter((a) => a.pending).length

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  const badgeFor = (to: string) => (to === '/security/transactions' ? pending.length : to === '/security/alerts' ? unread : 0)

  return (
    
    <div className="min-h-screen bg-aureon-mist text-ink-900">
      
      <div className="mx-auto flex max-w-[1180px]">
        
        <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col bg-aureon-deep px-4 py-7 text-white lg:flex">
          
          <Link to="/security" className="px-2">
            
            <AureonLogo light />
          
          </Link>
          
          <div className="mt-8 px-2">
            
            <p className="text-[12px] text-white/50">Conta</p>
            
            <p className="mt-1 truncate font-display text-[18px] font-semibold">{viewer.name}</p>
            
            <p className="mt-0.5 text-[13px] text-aureon-brass">{card?.product ?? 'Aureon'}</p>
            
            <div className="mt-3">
              
              <AccountSwitch dark />
            
            </div>
          
          </div>
          
          <nav className="mt-7 flex-1 space-y-0.5" aria-label="Aureon">
            {nav.map((item) => {
              const n = badgeFor(item.to)
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => cx('flex items-center gap-3 rounded-md px-3 py-2.5 text-[14px] transition-colors', isActive ? 'bg-white/10 text-white' : 'text-white/65 hover:bg-white/5 hover:text-white')}
                >
                  
                  <item.icon className="h-4 w-4" aria-hidden />
                  
                  <span className="flex-1">{item.label}</span>
                  {n > 0 && (
                    
                    <span className="rounded-full bg-warn px-1.5 text-[11px] font-semibold text-white">
                      {n}
                      
                      <span className="sr-only"> pendente{n > 1 ? 's' : ''}</span>
                    
                    </span>
                  )}
                
                </NavLink>
              )
            })}
          
          </nav>
          
          <div className="border-t border-white/10 px-2 pt-4">
            
            <ProtectedBy tone="light" />
          
          </div>
        
        </aside>

        
        <div className="min-w-0 flex-1">
          
          <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-line bg-paper/95 px-4 py-3 backdrop-blur lg:hidden">
            
            <Link to="/security">
              
              <AureonLogo />
            
            </Link>
            
            <div className="w-40">
              
              <AccountSwitch />
            
            </div>
          
          </header>
          
          <main className="mx-auto w-full max-w-[760px] animate-fade px-4 pb-28 pt-6 sm:px-6 lg:pb-16 lg:pt-10">
            
            <Outlet />
          
          </main>
        
        </div>
      
      </div>

      
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 backdrop-blur lg:hidden" aria-label="Aureon (navegação móvel)">
        
        <ul className="mx-auto grid max-w-md grid-cols-5">
          {mobileNav.map((item) => {
            const n = badgeFor(item.to)
            return (
              
              <li key={item.to}>
                
                <NavLink to={item.to} end={item.end} className={({ isActive }) => cx('relative flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium', isActive ? 'text-aureon-deep' : 'text-subtle')}>
                  
                  <item.icon className="h-5 w-5" aria-hidden />
                  {item.label}
                  {n > 0 && <span className="absolute right-[26%] top-1.5 h-2 w-2 rounded-full bg-warn" aria-label={`${n} pendente`} />}
                
                </NavLink>
              
              </li>
            )
          })}
        
        </ul>
      
      </nav>
    
    </div>
  )
}
