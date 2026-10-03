import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { AlertTriangle, Phone, X } from 'lucide-react'
import { useDemo } from '../../../context/DemoContext'
import { useFlowTx } from '../../../hooks/useFlowTx'
import { checkoutPathFor } from '../../../services/status'
import { CentralModal, ContinueAnywayModal, ReasonList, ScamFacts } from '../../../components/shield/ShieldParts'
import { NoActivePurchase } from '../../../components/store/CheckoutShell'
import { Button } from '../../../components/ui/Button'
import { formatBRL } from '../../../utils/format'
export function AttentionPage() {
  // Declara a constante/variável tx e atribui a ela o resultado da expressão desta linha.
  const tx = useFlowTx()
  const { resolveIntervention } = useDemo()
  const [callOpen, setCallOpen] = useState(false)
  const [continueOpen, setContinueOpen] = useState(false)

  // Verifica a condição antes de executar o bloco seguinte.
  if (!tx) return <NoActivePurchase />
  // Verifica a condição antes de executar o bloco seguinte.
  if (tx.status !== 'INTERVENTION') return <Navigate to={checkoutPathFor(tx)} replace />

  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <div className="mx-auto max-w-[760px] px-4 py-12">
      
      <div className="overflow-hidden rounded-3xl border border-line bg-paper shadow-lift">
        
        <div className="flex items-center justify-between gap-3 border-b border-warn/25 bg-warn-soft px-6 py-5 sm:px-9">
          
          
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-2.5 py-1 text-[12px] font-medium text-warn-ink">
            
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden /> Compra pausada
          
          </span>
        
        </div>

        
        <div className="px-6 py-8 sm:px-9">
          
          <h1 className="font-display text-[28px] font-semibold leading-tight tracking-[-0.02em] text-ink-900">Encontramos alguns sinais que merecem atenção.</h1>
          
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-800/85">
            Esta compra de <span className="tabular font-medium">{formatBRL(tx.amount)}</span> tem características que costumam aparecer quando alguém orienta outra pessoa a comprar. Isso não quer dizer que exista um golpe — é um momento para conferir com calma.
          
          </p>

          
          <div className="mt-6">
            
            <ReasonList tx={tx} />
          
          </div>
          
          <div className="mt-6">
            
            <ScamFacts />
          
          </div>

          
          <div className="mt-8 grid gap-2.5 sm:grid-cols-2">
            
            <Button size="lg" icon={<X className="h-4 w-4" />} onClick={() => resolveIntervention(tx.id, 'cancel')}>
              Não continuar esta compra
            
            </Button>
            
            <Button size="lg" variant="secondary" icon={<Phone className="h-4 w-4" />} onClick={() => setCallOpen(true)}>
              Falar com a central do cartão
            
            </Button>
          
          </div>
          
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            
            <p className="text-[12px] text-subtle">Nenhum valor foi cobrado. A decisão final é sua.</p>
            
            <button type="button" onClick={() => setContinueOpen(true)} className="rounded-md px-2 py-1.5 text-[13px] text-muted underline-offset-4 hover:text-ink-900 hover:underline">
              Continuar mesmo assim
            
            </button>
          
          </div>
        
        </div>
      
      </div>

      
      <CentralModal open={callOpen} onClose={() => setCallOpen(false)} />
      <ContinueAnywayModal
        open={continueOpen}
        onClose={() => setContinueOpen(false)}
        onConfirm={() => {
          setContinueOpen(false)
          resolveIntervention(tx.id, 'continue')
        }}
      />
    
    </div>
  )
}
