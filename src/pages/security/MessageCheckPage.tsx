import { useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Info } from 'lucide-react'
import { useDemo } from '../../context/DemoContext'
import { getScenario } from '../../mocks/scenarios'
import { analyzeMessage } from '../../services/check'
import { trafficMeta } from '../../services/labels'
import { SecTitle } from '../../components/security/SecurityParts'
import { TrafficPanel } from '../../components/security/TrafficResult'
import { Button } from '../../components/ui/Button'
import { Field, Textarea } from '../../components/ui/Form'
import { Badge } from '../../components/ui/Badge'

// a constante/variável joined e atribui a ela o resultado da expressão desta linha.
const joined = (id: 'induction' | 'hard') =>
  getScenario(id)
    .outside?.messages.map((m) => m.text)
    .join(' ') ?? ''

// a constante/variável examples e atribui a ela o resultado da expressão desta linha.
const examples = [
  { label: 'Falsa central', text: joined('induction') },
  { label: 'Falso prêmio', text: joined('hard') },
  { label: 'Aviso de entrega', text: 'Oi! Seu pedido NX-48207 saiu para entrega e chega amanhã. Acompanhe pelo app da NEXA.' },
]

// a constante/variável kindQuery e atribui a ela o resultado da expressão desta linha.
const kindQuery = { phone: 'phone', domain: 'link', destination: 'destination' } as const
// a constante/variável kindLabel e atribui a ela o resultado da expressão desta linha.
const kindLabel = { phone: 'Telefone', domain: 'Site', destination: 'Endereço' } as const
export function MessageCheckPage() {
  const { intel } = useDemo()
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState('')
  // Guarda em finding um valor memorizado para evitar recalcular a expressão quando as dependências não mudarem.
  const finding = useMemo(() => analyzeMessage(submitted, intel), [submitted, intel])

  // Declara a constante/variável submit e atribui a ela o resultado da expressão desta linha.
  const submit = (e: FormEvent) => {
    e.preventDefault()
    // Atualiza o estado associado ao setter desta variável; o React agenda uma nova renderização quando necessário.
    setSubmitted(text)
  }

  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <div>
      
      <SecTitle title="Recebi uma mensagem" description="Cole o texto de uma mensagem, e-mail ou SMS. Mostramos os sinais que costumam aparecer em golpes." />

      
      <form onSubmit={submit} className="space-y-4 rounded-2xl border border-line bg-paper p-5">
        
        <Field label="Texto da mensagem" htmlFor="msg" hint="O texto é conferido só nesta tela e não é guardado.">
          
          <Textarea id="msg" value={text} onChange={(e) => setText(e.target.value)} placeholder="Cole aqui a mensagem que você recebeu" />
        
        </Field>
        
        <div className="flex flex-wrap items-center gap-2">
          
          <Button type="submit" disabled={!text.trim()}>
            Verificar mensagem
          
          </Button>
          
          <span className="ml-1 text-[12px] text-subtle">Exemplos:</span>
          {examples.map((ex) => (
            <button
              key={ex.label}
              type="button"
              onClick={() => {
                setText(ex.text)
                setSubmitted(ex.text)
              }}
              className="rounded-full border border-line px-2.5 py-1 text-[12px] text-muted hover:border-line-strong hover:text-ink-900"
            >
              {ex.label}
            
            </button>
          ))}
        
        </div>
      
      </form>

      
      <div className="mt-6">
        {finding ? (
          <TrafficPanel
            level={finding.level}
            title={finding.level === 'RED' ? 'Esta mensagem tem sinais fortes de golpe' : finding.level === 'YELLOW' ? 'Esta mensagem pede cuidado' : trafficMeta.GREEN.label}
            summary={finding.types.length > 0 ? `Parece com: ${finding.types.map((t) => t.label.toLowerCase()).join(', ')}.` : undefined}
          >
            {finding.cues.length > 0 && (
              
              <ul className="mt-4 space-y-2.5">
                {finding.cues.map((c) => (
                  
                  <li key={c.label} className="rounded-xl bg-white/70 p-3 text-[14px]">
                    
                    <p className="font-medium text-ink-900">{c.label}</p>
                    
                    <p className="mt-0.5 text-[13px] text-muted">{c.explain}</p>
                  
                  </li>
                ))}
              
              </ul>
            )}
            {finding.entities.length > 0 && (
              
              <div className="mt-4">
                
                <p className="text-[13px] font-medium text-ink-900">Encontrados no texto</p>
                
                <ul className="mt-2 space-y-1.5">
                  {finding.entities.map((e) => (
                    
                    <li key={e.kind + e.value} className="flex flex-wrap items-center gap-2 text-[14px]">
                      
                      <span className="text-muted">{kindLabel[e.kind]}:</span>
                      
                      <Link to={`/security/check?kind=${kindQuery[e.kind]}&q=${encodeURIComponent(e.value)}`} className="font-medium text-signal-ink hover:underline">
                        {e.value}
                      
                      </Link>
                      {e.reported > 0 && (
                        
                        <Badge tone="risk" size="sm">
                          em {e.reported} {e.reported === 1 ? 'relato' : 'relatos'}
                        
                        </Badge>
                      )}
                    
                    </li>
                  ))}
                
                </ul>
              
              </div>
            )}
            
            <ul className="mt-4 space-y-1 border-t border-black/5 pt-3 text-[14px] text-ink-900">
              {finding.guidance.map((g) => (
                
                <li key={g}>{g}</li>
              ))}
            
            </ul>
          
          </TrafficPanel>
        ) : (
          
          <div className="flex items-start gap-3 rounded-2xl border border-dashed border-line-strong p-5 text-[14px] text-muted">
            
            <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
            A verificação usa regras e expressões conhecidas de golpes e cruza telefones, sites e endereços com relatos de clientes. Não usa inteligência artificial e não decide nada por você.
          
          </div>
        )}
      
      </div>
    
    </div>
  )
}
