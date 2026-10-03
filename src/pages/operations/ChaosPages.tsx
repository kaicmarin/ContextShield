import { Link, useParams } from 'react-router-dom'
import { useMemo } from 'react'
import { useDemo } from '../../context/DemoContext'
import { chaosScenarios, type ChaosVerdict } from '../../services/chaos'
import { chaosVerdictMeta } from '../../services/labels'
import { decisionMeta } from '../../services/riskModel'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { ErrorState } from '../../components/ui/Feedback'
import { PageHeader } from '../../components/ui/Surface'
import { Trace } from '../../components/ui/Trace'
export function ChaosLabPage() {
  const { domain } = useDemo()
  // Guarda em results um valor memorizado para evitar recalcular a expressão quando as dependências não mudarem.
  const results = useMemo(() => chaosScenarios.map((s) => ({ s, r: s.run(domain.config) })), [domain.config])

  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <div>
      <PageHeader
        eyebrow="Research"
        title="Decision Chaos Lab"
        description="Em vez de esconder os pontos de fuga, esta área procura encontrá-los antes. A “verdade” (golpe ou compra legítima) existe só aqui — o motor nunca a recebe."
      />
      
      <p className="mb-6 max-w-2xl text-[14px] text-muted">
        Cada cenário reexecuta o mesmo motor do checkout, com uma perturbação. UNSAFE SURVIVOR significa: o golpe atravessou as barreiras. Isso é mostrado, não escondido.
      
      </p>
      
      <ul className="divide-y divide-line border-y border-line">
        {results.map(({ s, r }) => (
          
          <li key={s.id}>
            
            <Link to={`/operations/chaos/${s.id}`} className="grid gap-2 py-4 hover:bg-canvas/80 sm:grid-cols-[72px_1fr_auto] sm:items-center">
              
              <span className="font-mono text-[12px] text-muted">{String(s.n).padStart(2, '0')}</span>
              
              <span>
                
                <span className="block text-[15px] font-medium">{s.title}</span>
                
                <span className="block text-[13px] text-muted">{s.perturbation}</span>
              
              </span>
              
              <Badge tone={chaosVerdictMeta[r.verdict].tone}>{chaosVerdictMeta[r.verdict].label}</Badge>
            
            </Link>
          
          </li>
        ))}
      
      </ul>
    
    </div>
  )
}

export function ChaosScenarioPage() {
  const { id = '' } = useParams()
  const { domain } = useDemo()
  const spec = chaosScenarios.find((s) => s.id === id)
  const result = useMemo(() => spec?.run(domain.config), [spec, domain.config])

  if (!spec || !result) {
    return <ErrorState title="Cenário não encontrado" action={<Button variant="secondary" to="/operations/chaos">Chaos Lab</Button>} />
  }

  const meta = chaosVerdictMeta[result.verdict as ChaosVerdict]

  return (
    
    <div>
      
      <p className="mb-4 text-[13px] text-muted">
        
        <Link to="/operations/chaos" className="hover:underline">Chaos Lab</Link> · cenário {spec.n}
      
      </p>
      <PageHeader
        eyebrow={spec.kind === 'evento' ? 'Perturbação de evento' : 'Perturbação de evidência'}
        title={spec.title}
        description={spec.perturbation}
        meta={<Badge tone={meta.tone}>{meta.label}</Badge>}
      />
      
      <p className="max-w-2xl text-[15px] leading-relaxed">{result.explanation}</p>
      {result.mitigation && <p className="mt-3 max-w-2xl text-[14px] text-muted">Mitigação: {result.mitigation}</p>}
      {result.counterfactual && <p className="mt-2 max-w-2xl text-[14px] text-muted">{result.counterfactual}</p>}

      
      <dl className="mt-8 grid gap-4 sm:grid-cols-3">
        
        <div>
          
          <dt className="text-[12px] text-subtle">Verdade (só no lab)</dt>
          
          <dd className="text-[15px] font-medium">{spec.truth === 'golpe' ? 'Golpe' : 'Compra legítima'}</dd>
        
        </div>
        
        <div>
          
          <dt className="text-[12px] text-subtle">Status final</dt>
          
          <dd className="text-[15px] font-medium">{result.finalStatus}</dd>
        
        </div>
        
        <div>
          
          <dt className="text-[12px] text-subtle">Decisão</dt>
          
          <dd className="text-[15px] font-medium">{result.finalDecision ? decisionMeta[result.finalDecision].label : '—'}</dd>
        
        </div>
      
      </dl>

      
      <h2 className="mt-10 font-display text-[18px] font-semibold">Passos</h2>
      
      <div className="mt-3">
        <Trace
          items={result.steps.map((s, i) => ({
            id: `${spec.id}-${i}`,
            title: s.label,
            detail: s.detail,
            tone: s.tone === 'ok' ? 'ok' : s.tone === 'warn' ? 'warn' : s.tone === 'risk' ? 'risk' : 'info',
          }))}
        />
      
      </div>
    
    </div>
  )
}
