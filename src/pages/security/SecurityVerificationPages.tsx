import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Check, Phone, ShieldAlert, X } from 'lucide-react'
import { useDemo } from '../../context/DemoContext'
import { availableLimit } from '../../services/present'
import { isAwaitingCustomer } from '../../services/status'
import { CentralModal, ContinueAnywayModal, ReasonList, ScamFacts, VerificationForm } from '../../components/shield/ShieldParts'
import { NotThisAccount, PurchaseSummary, useViewerData } from '../../components/security/SecurityParts'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/Feedback'
import { cx, formatBRL } from '../../utils/format'

// a função useOwnTx. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function useOwnTx() {
  const { id = '' } = useParams()
  const { getTx } = useDemo()
  const { viewer } = useViewerData()
  // Declara a constante/variável tx e atribui a ela o resultado da expressão desta linha.
  const tx = getTx(id)
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return tx && tx.customerId === viewer.id ? tx : undefined
}
export function SecurityVerificationPage() {
  // Declara a constante/variável tx e atribui a ela o resultado da expressão desta linha.
  const tx = useOwnTx()
  const { answerVerification, abandonVerification, resolveIntervention } = useDemo()
  // Declara a constante/variável navigate e atribui a ela o resultado da expressão desta linha.
  const navigate = useNavigate()
  const [callOpen, setCallOpen] = useState(false)
  const [continueOpen, setContinueOpen] = useState(false)

  // Verifica a condição antes de executar o bloco seguinte.
  if (!tx) return <NotThisAccount title="Confirmação não encontrada" />
  // Declara a constante/variável done e atribui a ela o resultado da expressão desta linha.
  const done = `/security/verification/${tx.id}/done`

  // Verifica a condição antes de executar o bloco seguinte.
  if (!isAwaitingCustomer(tx.status)) {
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return (
      <EmptyState
        icon={<Check className="h-5 w-5" aria-hidden />}
        title="Nada pendente nesta compra"
        description="Esta compra não precisa de nenhuma confirmação no momento."
        action={
          
          <Button variant="secondary" to={`/security/transactions/${tx.id}`}>
            Ver detalhes da compra
          
          </Button>
        }
      />
    )
  }

  return (
    
    <div className="rounded-2xl border border-line bg-paper p-6 sm:p-8">
      
      <div className="flex items-center justify-between gap-3 border-b border-line pb-5">
        
      
      </div>
      
      <div className="mt-6">
        
        <PurchaseSummary tx={tx} />
      
      </div>

      {tx.status === 'CONTEXT_REQUIRED' ? (
        
        <div className="mt-6">
          
          <h1 className="font-display text-[20px] font-semibold leading-snug">Antes de concluir, precisamos confirmar alguns detalhes desta compra.</h1>
          
          <p className="mt-1.5 text-[14px] text-muted">São 3 perguntas rápidas. Nenhum valor foi cobrado.</p>
          
          <div className="mt-6">
            <VerificationForm
              tx={tx}
              onComplete={(a) => {
                answerVerification(tx.id, a)
                navigate(done, { replace: true })
              }}
              onAbandon={() => {
                abandonVerification(tx.id)
                navigate(done, { replace: true })
              }}
            />
          
          </div>
        
        </div>
      ) : (
        
        <div className="mt-6">
          
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-warn-soft text-warn">
            
            <ShieldAlert className="h-5 w-5" aria-hidden />
          
          </span>
          
          <h1 className="mt-4 font-display text-[22px] font-semibold leading-snug">Encontramos alguns sinais que merecem atenção.</h1>
          
          <p className="mt-2 text-[14px] leading-relaxed text-muted">A Aureon nunca pede compras para cancelar operações, liberar prêmios ou proteger o cartão. Se alguém disse isso, encerre o contato. A decisão é sua.</p>
          
          <div className="mt-5">
            
            <ReasonList tx={tx} />
          
          </div>
          
          <div className="mt-5">
            
            <ScamFacts />
          
          </div>
          
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            <Button
              size="lg"
              icon={<X className="h-4 w-4" />}
              onClick={() => {
                resolveIntervention(tx.id, 'cancel')
                navigate(done, { replace: true })
              }}
            >
              Não continuar esta compra
            
            </Button>
            
            <Button size="lg" variant="secondary" icon={<Phone className="h-4 w-4" />} onClick={() => setCallOpen(true)}>
              Falar com a central
            
            </Button>
          
          </div>
          
          <div className="mt-3 text-right">
            
            <button type="button" onClick={() => setContinueOpen(true)} className="rounded-md px-2 py-1.5 text-[13px] text-muted underline-offset-4 hover:text-ink-900 hover:underline">
              Continuar mesmo assim
            
            </button>
          
          </div>
          
          <CentralModal open={callOpen} onClose={() => setCallOpen(false)} />
          <ContinueAnywayModal
            open={continueOpen}
            onClose={() => setContinueOpen(false)}
            onConfirm={() => {
              setContinueOpen(false)
              resolveIntervention(tx.id, 'continue')
              navigate(done, { replace: true })
            }}
          />
        
        </div>
      )}
    
    </div>
  )
}

export function SecurityConfirmationPage() {
  const tx = useOwnTx()
  const { transactions } = useDemo()
  const { card } = useViewerData()
  if (!tx) return <NotThisAccount />
  if (tx.status === 'INTERVENTION') return <Navigate to={`/security/verification/${tx.id}`} replace />

  const cancelled = tx.status === 'CANCELLED' || tx.status === 'BLOCKED'
  const approved = tx.status === 'APPROVED' || tx.status === 'APPROVED_WITH_ALERT' || tx.status === 'INCIDENT_RECORDED'
  const continued = tx.interventionChoice === 'continued'

  return (
    
    <div className="rounded-2xl border border-line bg-paper p-6 text-center sm:p-10">
      
      <span className={cx('mx-auto flex h-14 w-14 items-center justify-center rounded-full', cancelled ? 'bg-aureon-deep text-white' : approved ? 'bg-ok text-white' : 'bg-warn-soft text-warn')}>
        {cancelled ? <X className="h-6 w-6" aria-hidden /> : approved ? <Check className="h-6 w-6" aria-hidden /> : <ShieldAlert className="h-6 w-6" aria-hidden />}
      
      </span>
      
      <h1 className="mt-5 font-display text-[26px] font-semibold tracking-[-0.02em]">
        {cancelled && (tx.status === 'BLOCKED' ? 'Compra interrompida por segurança' : 'Compra cancelada')}
        {approved && (continued ? 'Compra concluída por sua decisão' : 'Compra confirmada')}
        {!cancelled && !approved && 'Falta uma confirmação'}
      
      </h1>
      
      <p className="mx-auto mt-2 max-w-sm text-[14px] text-muted">
        {cancelled && `Nenhum valor foi cobrado.${card ? ` Seu limite disponível é ${formatBRL(availableLimit(card, transactions))}.` : ''}`}
        {approved && (continued ? 'Se alguém pediu esta compra, fale com a central do cartão. Você pode contar o que aconteceu a qualquer momento.' : 'Obrigado por confirmar. A compra seguiu normalmente.')}
        {!cancelled && !approved && 'Precisamos da sua decisão para concluir ou cancelar a compra.'}
      
      </p>
      
      <div className="mx-auto mt-6 max-w-sm text-left">
        
        <PurchaseSummary tx={tx} />
      
      </div>
      
      <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
        {!cancelled && !approved ? <Button to={`/security/verification/${tx.id}`}>Decidir agora</Button> : <Button to="/security">Voltar ao início</Button>}
        {(cancelled || continued) && (
          
          <Button variant="secondary" to={`/security/report?tx=${tx.id}`}>
            Contar o que aconteceu
          
          </Button>
        )}
      
      </div>
    
    </div>
  )
}
