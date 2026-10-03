import { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { Transaction, VerificationAnswers } from '../../types/domain'
import { parseAnswers, verificationQuestions } from '../../mocks/verification'
import { getAddress } from '../../mocks/people'
import { clientSignals } from '../../services/risk'
import { latestAssessment } from '../../services/present'
import { OFFICIAL_CENTRAL } from '../../services/check'
import { Button } from '../ui/Button'
import { Checkbox, ChoiceCard } from '../ui/Form'
import { Modal } from '../ui/Modal'
import { SignalGlyph } from '../ui/Badge'
import { cx } from '../../utils/format'
export function VerificationForm({ tx, onComplete, onAbandon }: { tx: Transaction; onComplete: (a: VerificationAnswers) => void; onAbandon?: () => void }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  // Declara a constante/variável q e atribui a ela o resultado da expressão desta linha.
  const q = verificationQuestions[step]
  // Declara a constante/variável selected e atribui a ela o resultado da expressão desta linha.
  const selected = answers[q.key]
  // Declara a constante/variável last e atribui a ela o resultado da expressão desta linha.
  const last = step === verificationQuestions.length - 1
  // Declara a constante/variável address e atribui a ela o resultado da expressão desta linha.
  const address = getAddress(tx.addressId)

  // Declara a constante/variável finish e atribui a ela o resultado da expressão desta linha.
  const finish = () => {
    // Declara a constante/variável parsed e atribui a ela o resultado da expressão desta linha.
    const parsed = parseAnswers(answers)
    // Verifica a condição antes de executar o bloco seguinte.
    if (parsed) onComplete(parsed)
  }

  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <div>
      
      <div className="flex items-center gap-1.5" aria-hidden>
        {verificationQuestions.map((vq, i) => (
          
          <span key={vq.key} className={cx('h-1 flex-1 rounded-full transition-colors', i <= step ? 'bg-ink-900' : 'bg-line')} />
        ))}
      
      </div>
      
      <p className="mt-4 text-[12px] text-subtle">
        Pergunta {step + 1} de {verificationQuestions.length}
      
      </p>

      
      <fieldset key={q.key} className="mt-2 animate-rise">
        
        <legend className="font-display text-[22px] font-semibold leading-snug text-ink-900">{q.prompt}</legend>
        {q.key === 'address' && address ? (
          
          <p className="mt-2 rounded-lg bg-canvas px-3 py-2 text-[14px] text-ink-800">
            {address.line1}
            {address.line2 ? ` — ${address.line2}` : ''} · {address.district}, {address.city}
          
          </p>
        ) : (
          q.help && <p className="mt-1.5 text-[14px] text-muted">{q.help}</p>
        )}
        
        <div className="mt-5 space-y-2.5">
          {q.options.map((o) => (
            
            <ChoiceCard key={o.id} name={q.key} value={o.id} checked={selected === o.id} onChange={(v) => setAnswers((a) => ({ ...a, [q.key]: v }))} title={o.label} />
          ))}
        
        </div>
      
      </fieldset>

      
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        {step === 0 && onAbandon ? (
          
          <Button variant="ghost" onClick={onAbandon}>
            Não quero continuar
          
          </Button>
        ) : (
          
          <Button variant="ghost" icon={<ArrowLeft className="h-4 w-4" />} onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            Voltar
          
          </Button>
        )}
        
        <Button disabled={!selected} iconRight={last ? undefined : <ArrowRight className="h-4 w-4" />} onClick={() => (last ? finish() : setStep((s) => s + 1))}>
          {last ? 'Enviar respostas' : 'Continuar'}
        
        </Button>
      
      </div>
    
    </div>
  )
}

export function ReasonList({ tx }: { tx: Transaction }) {
  const reasons = clientSignals(latestAssessment(tx), 4)
  if (reasons.length === 0) return null
  return (
    
    <ul className="divide-y divide-line rounded-xl border border-line">
      {reasons.map((s) => (
        
        <li key={s.id} className="flex items-start gap-3 px-4 py-3.5">
          
          <SignalGlyph state={s.state === 'ok' ? 'attention' : s.state} className="mt-0.5" />
          
          <p className="text-[14px] font-medium text-ink-900">{s.clientLabel}</p>
        
        </li>
      ))}
    
    </ul>
  )
}

export function ScamFacts() {
  return (
    
    <div className="rounded-xl bg-canvas p-4 text-[14px] leading-relaxed text-ink-800">
      
      <p className="font-medium text-ink-900">Bancos e lojas nunca pedem que você:</p>
      
      <ul className="mt-1.5 list-disc space-y-0.5 pl-5 text-muted">
        
        <li>faça uma compra para “proteger”, “testar” ou “cancelar” algo no seu cartão;</li>
        
        <li>entregue um produto em um endereço indicado por outra pessoa;</li>
        
        <li>mantenha uma ligação ou conversa aberta enquanto compra.</li>
      
      </ul>
    
    </div>
  )
}

export function CentralModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    
    <Modal open={open} onClose={onClose} title="Falar com a central do cartão" footer={<Button variant="secondary" onClick={onClose}>Fechar</Button>}>
      
      <p className="text-[14px] leading-relaxed text-ink-800">Ligue para o número impresso no verso do seu cartão ou use o app Aureon. Nunca use um número que chegou por mensagem.</p>
      
      <div className="mt-4 rounded-xl border border-line bg-canvas p-4">
        
        <p className="text-[12px] text-muted">Central Aureon · 24 horas</p>
        
        <p className="tabular mt-1 font-display text-[22px] font-semibold text-ink-900">{OFFICIAL_CENTRAL}</p>
      
      </div>
    
    </Modal>
  )
}

export function ContinueAnywayModal({ open, onClose, onConfirm }: { open: boolean; onClose: () => void; onConfirm: () => void }) {
  const [ack, setAck] = useState({ self: false, nobody: false })
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Antes de continuar"
      footer={
        <>
          
          <Button variant="ghost" onClick={onClose}>
            Voltar
          
          </Button>
          
          <Button disabled={!ack.self || !ack.nobody} onClick={onConfirm}>
            Confirmar e continuar
          
          </Button>
        </>
      }
    >
      
      <p className="text-[14px] text-muted">A decisão é sua. Para continuar, confirme que:</p>
      
      <div className="mt-4 space-y-3">
        
        <Checkbox checked={ack.self} onChange={(v) => setAck((a) => ({ ...a, self: v }))}>
          Estou fazendo esta compra por decisão própria.
        
        </Checkbox>
        
        <Checkbox checked={ack.nobody} onChange={(v) => setAck((a) => ({ ...a, nobody: v }))}>
          Ninguém está me orientando por telefone, mensagem ou link neste momento.
        
        </Checkbox>
      
      </div>
      
      <p className="mt-4 text-[12px] text-subtle">Vamos avisar pelo app Aureon. Se algo parecer errado depois, você pode registrar o caso em “Fui vítima”.</p>
    
    </Modal>
  )
}
