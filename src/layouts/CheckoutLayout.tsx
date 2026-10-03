import { useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { NexaLogo, ProtectedBy } from '../components/brand/Brand'
export function CheckoutLayout() {
  const { pathname } = useLocation()
  // Executa o hook useEffect, conectando esta parte do componente ao mecanismo correspondente do React.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <div className="min-h-screen bg-[#F7F6F3] text-nexa-char">
      
      <header className="border-b border-nexa-stone bg-white">
        
        <div className="mx-auto flex max-w-stage items-center justify-between gap-4 px-4 py-4 lg:px-8">
          
          <Link to="/store" className="rounded-md" aria-label="Voltar para a loja NEXA">
            
            <NexaLogo />
          
          </Link>
          
          <span className="flex items-center gap-1.5 text-[12px] text-muted">
            
            <Lock className="h-3.5 w-3.5" aria-hidden /> Checkout seguro
          
          </span>
        
        </div>
      
      </header>
      
      <main className="animate-fade">
        
        <Outlet />
      
      </main>
      
      <footer className="mx-auto flex max-w-stage flex-wrap items-center justify-between gap-3 px-4 pb-10 pt-16 text-[12px] text-subtle lg:px-8">
        
        <span>Pagamento autorizado pelo emissor do seu cartão.</span>
        
        <ProtectedBy />
      
      </footer>
    
    </div>
  )
}
