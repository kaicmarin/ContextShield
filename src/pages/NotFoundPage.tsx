import { useLocation } from 'react-router-dom'
import { Button } from '../components/ui/Button'
export function NotFoundPage() {
  const { pathname } = useLocation()
  // Declara a constante/variável area e atribui a ela o resultado da expressão desta linha.
  const area = pathname.startsWith('/store')
    ? { to: '/store', label: 'Voltar para a loja' }
    : pathname.startsWith('/security')
      ? { to: '/security', label: 'Voltar ao app Aureon' }
      : pathname.startsWith('/operations')
        ? { to: '/operations', label: 'Voltar para Operations' }
        : { to: '/', label: 'Ir para o início' }

  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <div className="grid-faint flex min-h-screen flex-col items-center justify-center bg-canvas px-4 text-center">
      
      
      <p className="mt-12 font-mono text-[13px] text-subtle">404</p>
      
      <h1 className="mt-2 font-display text-[32px] font-semibold tracking-[-0.02em]">Página não encontrada</h1>
      
      <p className="mt-2 max-w-md text-[15px] text-muted">
        O endereço <span className="break-all font-mono text-[13px] text-ink-800">{pathname}</span> não existe neste ambiente.
      
      </p>
      
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        
        <Button to={area.to}>{area.label}</Button>
        {area.to !== '/' && (
          
          <Button variant="secondary" to="/">
            Início
          
          </Button>
        )}
      
      </div>
    
    </div>
  )
}
