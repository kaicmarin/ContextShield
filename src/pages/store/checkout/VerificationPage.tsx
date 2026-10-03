import { Navigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { useDemo } from '../../../context/DemoContext'
import { useFlowTx } from '../../../hooks/useFlowTx'
import { checkoutPathFor } from '../../../services/status'
import { VerificationForm } from '../../../components/shield/ShieldParts'
import { NoActivePurchase } from '../../../components/store/CheckoutShell'
import { formatBRL } from '../../../utils/format'
export function CheckoutVerificationPage() {
  // Declara a constante/variável tx e atribui a ela o resultado da expressão desta linha.
  const tx = useFlowTx()
  const { answerVerification, abandonVerification } = useDemo()

  // Verifica a condição antes de executar o bloco seguinte.
  if (!tx) return <NoActivePurchase />
  // Verifica a condição antes de executar o bloco seguinte.
  if (tx.status !== 'CONTEXT_REQUIRED') return <Navigate to={checkoutPathFor(tx)} replace />

  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <div className="mx-auto max-w-read px-4 py-12">
      
      <div className="rounded-3xl border border-line bg-paper p-6 shadow-lift sm:p-9">
        
        <div className="flex items-center justify-between gap-3 border-b border-line pb-5">
          
          
          <span className="tabular text-[13px] text-muted">{formatBRL(tx.amount)}</span>
        
        </div>
        
        <h1 className="mt-6 font-display text-[20px] font-semibold leading-snug text-ink-900">Antes de concluir, precisamos confirmar alguns detalhes desta compra.</h1>
        
        <p className="mt-1.5 text-[14px] text-muted">São 3 perguntas rápidas. Nenhum valor foi cobrado e não existe resposta errada.</p>
        
        <div className="mt-6">
          
          <VerificationForm tx={tx} onComplete={(a) => answerVerification(tx.id, a)} onAbandon={() => abandonVerification(tx.id)} />
        
        </div>
      
      </div>
      
      <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[12px] text-subtle">
        
        <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden /> Nesta etapa nunca pedimos senha, código SMS ou dados do cartão.
      
      </p>
    
    </div>
  )
}
