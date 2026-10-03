import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Info, MessageSquareWarning } from 'lucide-react'
import { useDemo } from '../../context/DemoContext'
import { IDS } from '../../mocks/ids'
import { getSeller } from '../../mocks/sellers'
import { checkKinds, runCheck, type CheckKind } from '../../services/check'
import { SecTitle } from '../../components/security/SecurityParts'
import { TrafficPanel } from '../../components/security/TrafficResult'
import { SignalGlyph } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Field, Input } from '../../components/ui/Form'
import { cx } from '../../utils/format'

// a constante/variável examples e atribui a ela o resultado da expressão desta linha.
const examples: Record<CheckKind, string[]> = {
  link: ['aureon-protecao.example', 'nexa.example', 'ofertas-relampago.online'],
  cnpj: [getSeller(IDS.sellerConecta)?.cnpj ?? '', getSeller(IDS.sellerNexa)?.cnpj ?? '', '12.345.678/0001-00'].filter(Boolean),
  phone: ['(11) 90000-2184', '0800 000 0000', '(21) 3555-0101'],
  destination: ['Rua Pedra Lisa, 880 — loja 3', 'Av. Rio Claro Novo, 2110'],
  store: ['Conecta', 'Estação Games', 'Loja Relâmpago'],
  key: ['pagamentos@aureon-protecao.example', '(11) 90000-2184', '7d9f1c2a-4b3e-4c1d-9a8b-2f6e5d4c3b2a'],
}

// a constante/variável isKind e atribui a ela o resultado da expressão desta linha.
const isKind = (v: string | null): v is CheckKind => checkKinds.some((k) => k.id === v)
export function CheckPage() {
  const { intel, now, viewer } = useDemo()
  const [params, setParams] = useSearchParams()
  // Declara a constante/variável rawKind e atribui a ela o resultado da expressão desta linha.
  const rawKind = params.get('kind')
  // Declara a constante/variável kind e atribui a ela o resultado da expressão desta linha.
  const kind: CheckKind = isKind(rawKind) ? rawKind : 'link'
  // Declara a constante/variável submitted e atribui a ela o resultado da expressão desta linha.
  const submitted = params.get('q') ?? ''
  const [draft, setDraft] = useState(submitted)
  // Executa o hook useEffect, conectando esta parte do componente ao mecanismo correspondente do React.
  useEffect(() => setDraft(submitted), [submitted])
  // Declara a constante/variável spec e atribui a ela o resultado da expressão desta linha.
  const spec = checkKinds.find((k) => k.id === kind) ?? checkKinds[0]
  // Guarda em result um valor memorizado para evitar recalcular a expressão quando as dependências não mudarem.
  const result = useMemo(() => runCheck(kind, submitted, intel, now, viewer.id), [kind, submitted, intel, now, viewer.id])

  // Declara a constante/variável go e atribui a ela o resultado da expressão desta linha.
  const go = (k: CheckKind, q: string) => {
    // Atualiza o estado associado ao setter desta variável; o React agenda uma nova renderização quando necessário.
    setDraft(q)
    // Atualiza o estado associado ao setter desta variável; o React agenda uma nova renderização quando necessário.
    setParams(q ? { kind: k, q } : { kind: k }, { replace: true })
  }
  // Declara a constante/variável submit e atribui a ela o resultado da expressão desta linha.
  const submit = (e: FormEvent) => {
    e.preventDefault()
    go(kind, draft.trim())
  }

  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <div>
      
      <SecTitle title="Antes de pagar, confira" description="Alguém pediu que você fizesse uma compra ou um pagamento? Confira quem está do outro lado." />

      
      <div className="rounded-2xl border border-line bg-paper p-5">
        
        <div role="radiogroup" aria-label="O que você quer conferir" className="flex flex-wrap gap-2">
          {checkKinds.map((k) => (
            <button
              key={k.id}
              type="button"
              role="radio"
              aria-checked={k.id === kind}
              onClick={() => go(k.id, '')}
              className={cx('rounded-full border px-3 py-1.5 text-[13px] transition-colors', k.id === kind ? 'border-aureon-deep bg-aureon-deep text-white' : 'border-line text-ink-800 hover:border-line-strong')}
            >
              {k.label}
            
            </button>
          ))}
        
        </div>

        
        <form onSubmit={submit} className="mt-5 space-y-4">
          
          <Field label={spec.label} htmlFor="chk-input" hint={spec.hint}>
            
            <Input id="chk-input" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={spec.placeholder} autoComplete="off" inputMode={kind === 'phone' ? 'tel' : undefined} />
          
          </Field>
          
          <div className="flex flex-wrap items-center gap-2">
            
            <Button type="submit" disabled={!draft.trim()}>
              Conferir
            
            </Button>
            
            <span className="ml-1 text-[12px] text-subtle">Exemplos:</span>
            {examples[kind].map((ex) => (
              
              <button key={ex} type="button" onClick={() => go(kind, ex)} className="max-w-[240px] truncate rounded-full border border-line px-2.5 py-1 text-[12px] text-muted hover:border-line-strong hover:text-ink-900" title={ex}>
                {ex}
              
              </button>
            ))}
          
          </div>
        
        </form>
      
      </div>

      
      <div className="mt-6">
        {result ? (
          
          <TrafficPanel level={result.level} title={result.title} summary={result.summary}>
            {result.facts.length > 0 && (
              
              <dl className="mt-4 grid gap-x-6 gap-y-2 rounded-xl bg-white/70 p-4 text-[13px] sm:grid-cols-2">
                {result.facts.map((f) => (
                  
                  <div key={f.label}>
                    
                    <dt className="text-muted">{f.label}</dt>
                    
                    <dd className="font-medium text-ink-900">{f.value}</dd>
                  
                  </div>
                ))}
              
              </dl>
            )}
            {result.signals.length > 0 && (
              
              <ul className="mt-4 space-y-2">
                {result.signals.map((s) => (
                  
                  <li key={s.label} className="flex items-center gap-2.5 text-[14px]">
                    
                    <SignalGlyph state={s.state} />
                    {s.label}
                  
                  </li>
                ))}
              
              </ul>
            )}
            {result.guidance.length > 0 && (
              
              <ul className="mt-4 space-y-1 border-t border-black/5 pt-3 text-[14px] text-ink-900">
                {result.guidance.map((g) => (
                  
                  <li key={g}>{g}</li>
                ))}
              
              </ul>
            )}
            {result.level !== 'GREEN' && (
              
              <div className="mt-5">
                
                <Button size="sm" variant="secondary" to="/security/report">
                  Contar o que aconteceu
                
                </Button>
              
              </div>
            )}
          
          </TrafficPanel>
        ) : (
          
          <div className="flex items-start gap-3 rounded-2xl border border-dashed border-line-strong p-5 text-[14px] text-muted">
            
            <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
            A consulta cruza o cadastro de lojas e vendedores, os canais oficiais e os elementos citados em relatos de clientes. Ela ajuda, mas não substitui a sua atenção.
          
          </div>
        )}
      
      </div>

      
      <Link to="/security/check/message" className="mt-6 flex items-center gap-3 rounded-2xl border border-line bg-paper p-4 transition-colors hover:border-aureon-deep/40">
        
        <MessageSquareWarning className="h-5 w-5 shrink-0 text-aureon-deep" aria-hidden />
        
        <span className="min-w-0 flex-1">
          
          <span className="block text-[14px] font-medium">Recebeu uma mensagem estranha?</span>
          
          <span className="block text-[13px] text-muted">Cole o texto e veja se ele tem sinais comuns em golpes.</span>
        
        </span>
        
        <span className="text-[13px] font-medium text-signal-ink">Verificar →</span>
      
      </Link>

      
      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          ['Pressa', 'Golpes pedem que você aja “agora”.'],
          ['Sigilo', 'Pedem para não contar a ninguém, nem ao banco.'],
          ['Compra como solução', 'Nenhum banco resolve um problema pedindo uma compra.'],
        ].map(([t, d]) => (
          
          <div key={t} className="rounded-2xl border border-line bg-paper p-4">
            
            <p className="font-medium">{t}</p>
            
            <p className="mt-0.5 text-[13px] text-muted">{d}</p>
          
          </div>
        ))}
      
      </section>
    
    </div>
  )
}
