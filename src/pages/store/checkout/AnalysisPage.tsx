import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Loader2 } from 'lucide-react'
import { useDemo } from '../../../context/DemoContext'
import { useFlowTx } from '../../../hooks/useFlowTx'
import { getCard } from '../../../mocks/people'
import { checkoutPathFor } from '../../../services/status'
import { NoActivePurchase } from '../../../components/store/CheckoutShell'
import { ProtectedBy } from '../../../components/brand/Brand'
import { cx, formatBRL } from '../../../utils/format'

// a constante/variável phases e atribui a ela o resultado da expressão desta linha.
const phases = ['Enviando ao emissor do cartão', 'Conferindo os detalhes da compra', 'Aguardando autorização']
export function AnalysisPage() {
  // Declara a constante/variável tx e atribui a ela o resultado da expressão desta linha.
  const tx = useFlowTx()
  const { runAnalysis } = useDemo()
  // Declara a constante/variável navigate e atribui a ela o resultado da expressão desta linha.
  const navigate = useNavigate()
  const [phase, setPhase] = useState(0)
  // Declara a constante/variável pending e atribui a ela o resultado da expressão desta linha.
  const pending = tx && (tx.status === 'RECEIVED' || tx.status === 'ANALYZING')

  // Executa o hook useEffect, conectando esta parte do componente ao mecanismo correspondente do React.
  useEffect(() => {
    // Verifica a condição antes de executar o bloco seguinte.
    if (!tx) return
    // Verifica a condição antes de executar o bloco seguinte.
    if (!pending) {
      // Executa a chamada desta função/event handler, passando os argumentos definidos nesta linha.
      navigate(checkoutPathFor(tx), { replace: true })
      return
    }
    // Declara a constante/variável timers e atribui a ela o resultado da expressão desta linha.
    const timers = [window.setTimeout(() => setPhase(1), 550), window.setTimeout(() => setPhase(2), 1100), window.setTimeout(() => runAnalysis(tx.id), 1650)]
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return () => timers.forEach(window.clearTimeout)
  }, [tx?.id, pending])

  if (!tx) return <NoActivePurchase />
  const card = getCard(tx.cardId)

  return (
    
    <div className="mx-auto max-w-md px-4 py-16">
      
      <div className="rounded-3xl border border-nexa-stone bg-white p-8 text-center" role="status" aria-live="polite">
        
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-nexa-char" aria-hidden />
        
        <h1 className="mt-5 font-display text-[22px] font-semibold tracking-[-0.01em]">Processando pagamento</h1>
        
        <p className="tabular mt-1 text-[15px] text-muted">
          {formatBRL(tx.amount)}
          {card ? ` · cartão •••• ${card.last4}` : ''}
        
        </p>
        
        <ol className="mx-auto mt-7 max-w-[280px] space-y-2.5 text-left text-[14px]">
          {phases.map((label, i) => (
            
            <li key={label} className={cx('flex items-center gap-2.5 transition-colors', i <= phase ? 'text-nexa-char' : 'text-subtle')}>
              
              <span className={cx('flex h-5 w-5 shrink-0 items-center justify-center rounded-full', i < phase ? 'bg-nexa-char text-white' : i === phase ? 'border-2 border-nexa-char' : 'border border-nexa-stone')} aria-hidden>
                {i < phase && <Check className="h-3 w-3" strokeWidth={3} />}
              
              </span>
              {label}
            
            </li>
          ))}
        
        </ol>
        
        <p className="mt-7 text-[12px] text-muted">Nenhum valor é cobrado antes da autorização. Não feche esta página.</p>
      
      </div>
      
      <ProtectedBy className="mt-5 justify-center" />
    
    </div>
  )
}
