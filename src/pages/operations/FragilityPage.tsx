import { useParams, useSearchParams } from 'react-router-dom'
import { useDemo } from '../../context/DemoContext'
import { getCustomer } from '../../mocks/people'
import { latestAssessment } from '../../services/present'
import { certificate } from '../../services/robustness'
import { robustnessMeta } from '../../services/labels'
import { decisionMeta, sourceSpec } from '../../services/riskModel'
import { Badge, RiskBadge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/Feedback'
import { Select } from '../../components/ui/Form'
import { IdTag } from '../../components/ui/IdTag'
import { PageHeader } from '../../components/ui/Surface'
import { Table, Td, Th, THead, Tr } from '../../components/ui/Table'
export function FragilityPage() {
  const { id } = useParams()
  const [params, setParams] = useSearchParams()
  const { transactions, getTx, domain } = useDemo()
  // Declara a constante/variável txId e atribui a ela o resultado da expressão desta linha.
  const txId = id ?? params.get('tx') ?? transactions.find((t) => t.assessments.length > 0)?.id
  // Declara a constante/variável tx e atribui a ela o resultado da expressão desta linha.
  const tx = getTx(txId)
  // Declara a constante/variável a e atribui a ela o resultado da expressão desta linha.
  const a = tx ? latestAssessment(tx) : undefined
  // Declara a constante/variável cert e atribui a ela o resultado da expressão desta linha.
  const cert = a ? certificate(a, domain.config) : undefined
  // Declara a constante/variável options e atribui a ela o resultado da expressão desta linha.
  const options = transactions.filter((t) => t.assessments.length > 0)

  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <div>
      <PageHeader
        eyebrow="Decision robustness"
        title="Certificado de fragilidade"
        description="Se algumas evidências estiverem erradas, ausentes ou degradadas, a decisão continua sendo a mesma?"
        actions={
          
          <Select aria-label="Transação" value={tx?.id ?? ''} onChange={(e) => setParams({ tx: e.target.value })} className="w-auto min-w-[260px]">
            {options.map((t) => (
              
              <option key={t.id} value={t.id}>
                {t.id} · {getCustomer(t.customerId)?.firstName}
              
              </option>
            ))}
          
          </Select>
        }
        meta={tx && <IdTag value={tx.id} to={`/operations/transactions/${tx.id}`} />}
      />

      {!cert || !a || !tx ? (
        
        <EmptyState title="Sem avaliação" description="Escolha uma transação que já tenha passado pelo motor." />
      ) : (
        <>
          
          <section className="grid gap-8 border-y border-line py-8 lg:grid-cols-[280px_1fr]">
            
            <div>
              
              <p className="text-[12px] text-muted">Decisão observada</p>
              
              <p className="mt-1 font-display text-[28px] font-semibold">{decisionMeta[a.decision].label}</p>
              
              <div className="mt-3">
                
                <RiskBadge level={a.level} score={a.score} />
              
              </div>
              
              <p className="mt-4 text-[13px] text-muted">Confiança {a.confidence}% · {a.ruleId}</p>
            
            </div>
            
            <div>
              
              <Badge tone={robustnessMeta[cert.status].tone}>{robustnessMeta[cert.status].label}</Badge>
              
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed">{cert.summary}</p>
              {cert.sensitiveTo.length > 0 && (
                
                <p className="mt-3 text-[13px] text-muted">
                  Sensível a: {cert.sensitiveTo.map((s) => sourceSpec(s).label).join(', ')}.
                
                </p>
              )}
              
              <div className="mt-4 flex flex-wrap gap-2">
                
                <Button size="sm" variant="secondary" to={`/operations/independence/${tx.id}`}>Independência das fontes</Button>
                
                <Button size="sm" variant="secondary" to={`/operations/evidence?tx=${tx.id}`}>Evidence</Button>
              
              </div>
            
            </div>
          
          </section>

          
          <h2 className="mt-8 font-display text-[18px] font-semibold">Perturbações</h2>
          
          <p className="mt-1 text-[13px] text-muted">Cada linha reaproveita o mesmo motor e a mesma política. Nada aqui é um número inventado.</p>
          
          <Table minWidth={960} className="mt-4">
            
            <THead>
              
              <Th>Teste</Th>
              
              <Th>Tipo</Th>
              
              <Th>Fonte</Th>
              
              <Th className="text-right">Score</Th>
              
              <Th>Decisão</Th>
              
              <Th>Efeito</Th>
            
            </THead>
            
            <tbody>
              {cert.perturbations.map((p) => (
                
                <Tr key={p.id}>
                  
                  <Td className="max-w-[360px] whitespace-normal">{p.label}</Td>
                  
                  <Td className="text-[12px]">{p.kind}</Td>
                  
                  <Td className="text-[12px]">{sourceSpec(p.source).label}</Td>
                  
                  <Td className="tabular text-right font-mono">{p.score}</Td>
                  
                  <Td>{decisionMeta[p.decision].label}</Td>
                  
                  <Td>
                    {p.crossesClass ? (
                      
                      <Badge tone="risk" size="sm">muda a classe</Badge>
                    ) : p.changed ? (
                      
                      <Badge tone="warn" size="sm">muda a regra</Badge>
                    ) : (
                      
                      <span className="text-[12px] text-muted">mantém</span>
                    )}
                  
                  </Td>
                
                </Tr>
              ))}
            
            </tbody>
          
          </Table>
        </>
      )}
    
    </div>
  )
}
