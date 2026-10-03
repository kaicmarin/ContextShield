import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { OctagonX, ShieldCheck } from 'lucide-react'
import { useCart } from '../../../context/CartContext'
import { useDemo } from '../../../context/DemoContext'
import { useFlowTx } from '../../../hooks/useFlowTx'
import { checkoutPathFor } from '../../../services/status'
import { CentralModal } from '../../../components/shield/ShieldParts'
import { NoActivePurchase } from '../../../components/store/CheckoutShell'
import { Button } from '../../../components/ui/Button'
import { cx, formatBRL } from '../../../utils/format'
export function InterruptedPage() {
  // Declara a constante/variável tx e atribui a ela o resultado da expressão desta linha.
  const tx = useFlowTx()
  const { clear } = useCart()
  const { setViewer } = useDemo()
  // Declara a constante/variável navigate e atribui a ela o resultado da expressão desta linha.
  const navigate = useNavigate()
  const [callOpen, setCallOpen] = useState(false)
  // Declara a constante/variável stopped e atribui a ela o resultado da expressão desta linha.
  const stopped = tx?.status === 'BLOCKED' || tx?.status === 'CANCELLED'

  // Executa o hook useEffect, conectando esta parte do componente ao mecanismo correspondente do React.
  useEffect(() => {
    // Verifica a condição antes de executar o bloco seguinte.
    if (stopped) clear()
  }, [stopped, clear])

  // Verifica a condição antes de executar o bloco seguinte.
  if (!tx) return <NoActivePurchase />
  // Verifica a condição antes de executar o bloco seguinte.
  if (!stopped) return <Navigate to={checkoutPathFor(tx)} replace />

  // Declara a constante/variável preventive e atribui a ela o resultado da expressão desta linha.
  const preventive = tx.status === 'BLOCKED'
  // Declara a constante/variável goSecurity e atribui a ela o resultado da expressão desta linha.
  const goSecurity = (to: string) => {
    // Atualiza o estado associado ao setter desta variável; o React agenda uma nova renderização quando necessário.
    setViewer(tx.customerId)
    // Executa a chamada desta função/event handler, passando os argumentos definidos nesta linha.
    navigate(to)
  }

  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <div className="mx-auto max-w-[680px] px-4 py-14">
      
      
      <span className={cx('mt-8 flex h-12 w-12 items-center justify-center rounded-full', preventive ? 'bg-risk-soft text-risk' : 'bg-ok-soft text-ok')}>
        {preventive ? <OctagonX className="h-6 w-6" aria-hidden /> : <ShieldCheck className="h-6 w-6" aria-hidden />}
      
      </span>
      
      <h1 className="mt-5 font-display text-[28px] font-semibold leading-tight tracking-[-0.02em] text-ink-900">
        {preventive ? 'Interrompemos esta compra para proteger você.' : 'Compra interrompida. Você fez bem em parar.'}
      
      </h1>
      
      <p className="mt-3 text-[15px] leading-relaxed text-ink-800/85">
        {preventive
          ? 'Alguns detalhes desta compra coincidem com situações de golpe relatadas recentemente. Por precaução, o pagamento não foi autorizado e nada foi cobrado.'
          : 'O pagamento não foi realizado e nenhum valor foi cobrado. Se alguém pediu que você fizesse esta compra, encerre o contato com essa pessoa.'}
      
      </p>

      
      <dl className="mt-6 border-y border-line py-4 text-[14px]">
        
        <div className="flex justify-between gap-3">
          
          <dt className="text-muted">Pedido</dt>
          
          <dd className="font-mono text-[13px]">{tx.orderId}</dd>
        
        </div>
        
        <div className="mt-2 flex justify-between gap-3">
          
          <dt className="text-muted">Valor não cobrado</dt>
          
          <dd className="tabular font-medium">{formatBRL(tx.amount)}</dd>
        
        </div>
      
      </dl>

      
      <div className="mt-6">
        
        <p className="text-[14px] font-medium text-ink-900">O que fazer agora</p>
        
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-[14px] text-muted">
          
          <li>Não responda a mensagens ou ligações sobre esta compra.</li>
          
          <li>Se você passou dados para alguém, conte para o emissor do seu cartão.</li>
          
          <li>Conte o que aconteceu. Isso ajuda a proteger outras pessoas.</li>
        
        </ol>
      
      </div>

      
      <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        
        <Button size="lg" onClick={() => goSecurity(`/security/report?tx=${tx.id}`)}>
          Contar o que aconteceu
        
        </Button>
        {preventive ? (
          
          <Button size="lg" variant="secondary" onClick={() => setCallOpen(true)}>
            Falar com a central do cartão
          
          </Button>
        ) : (
          
          <Button size="lg" variant="secondary" onClick={() => goSecurity(`/security/transactions/${tx.id}`)}>
            Ver no app Aureon
          
          </Button>
        )}
        
        <Button size="lg" variant="ghost" to="/store">
          Voltar à loja
        
        </Button>
      
      </div>
      
      <CentralModal open={callOpen} onClose={() => setCallOpen(false)} />
    
    </div>
  )
}
