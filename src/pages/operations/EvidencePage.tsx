import { Link, useSearchParams } from 'react-router-dom'
import { useDemo } from '../../context/DemoContext'
import { getCustomer } from '../../mocks/people'
import { latestAssessment } from '../../services/present'
import { sourceSpec } from '../../services/riskModel'
import { signalMeta } from '../../services/labels'
import { Badge, SignalGlyph } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/Feedback'
import { Select } from '../../components/ui/Form'
import { IdTag } from '../../components/ui/IdTag'
import { PageHeader } from '../../components/ui/Surface'
import { Table, Td, Th, THead, Tr } from '../../components/ui/Table'
import { cx } from '../../utils/format'
export function EvidencePage() {
  const { transactions, getTx } = useDemo()
  const [params, setParams] = useSearchParams()
  // Declara a constante/variável options e atribui a ela o resultado da expressão desta linha.
  const options = transactions.filter((t) => t.assessments.length > 0)
  // Declara a constante/variável txId e atribui a ela o resultado da expressão desta linha.
  const txId = params.get('tx')
  // Declara a constante/variável tx e atribui a ela o resultado da expressão desta linha.
  const tx = (txId ? getTx(txId) : undefined) ?? options[0]
  // Declara a constante/variável a e atribui a ela o resultado da expressão desta linha.
  const a = tx ? latestAssessment(tx) : undefined

  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <div>
      <PageHeader
        eyebrow="Operations"
        title="Evidence"
        description="Cada sinal usado na análise, com origem, confiança, peso e se foi descontado por depender de outra evidência."
        actions={
          
          <Select aria-label="Transação" value={tx?.id ?? ''} onChange={(e) => setParams({ tx: e.target.value }, { replace: true })} className="w-auto min-w-[280px]">
            {options.map((t) => (
              
              <option key={t.id} value={t.id}>
                {t.id} · {getCustomer(t.customerId)?.firstName}
              
              </option>
            ))}
          
          </Select>
        }
        meta={
          tx && (
            <>
              
              <IdTag value={tx.id} to={`/operations/transactions/${tx.id}`} />
              
              <IdTag value={tx.correlationId} tone="trace" to={`/operations/timeline?c=${tx.correlationId}`} />
              
              <ButtonLink id={tx.id} />
            </>
          )
        }
      />

      {!a || a.signals.length === 0 ? (
        
        <EmptyState title="Sem evidências detalhadas" description="Esta transação ainda não passou pelo motor, ou não há sinais registrados." />
      ) : (
        <>
          
          <div className="mb-4 flex flex-wrap gap-2">
            {(['ok', 'attention', 'risk'] as const).map((s) => (
              
              <span key={s} className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-[12px]">
                
                <SignalGlyph state={s} />
                {signalMeta[s].label}
                
                <span className="tabular font-mono text-ink-900">{a.signals.filter((e) => e.state === s).length}</span>
              
              </span>
            ))}
            
            <Link to={`/operations/independence/${tx?.id}`} className="ml-auto text-[13px] text-muted hover:text-ink-900">
              Independência das fontes →
            
            </Link>
          
          </div>
          
          <Table minWidth={1100}>
            
            <THead>
              
              <Th>Sinal</Th>
              
              <Th>Observado</Th>
              
              <Th>Origem</Th>
              
              <Th className="text-right">Confiança</Th>
              
              <Th className="text-right">Pontos</Th>
              
              <Th>Estado</Th>
            
            </THead>
            
            <tbody>
              {a.signals.map((e) => (
                
                <Tr key={e.id} to={e.entityId ? `/operations/intelligence/${e.entityId}` : undefined}>
                  
                  <Td>
                    
                    <p className="font-medium">{e.label}</p>
                    
                    <p className="font-mono text-[11px] text-subtle">{e.id}{e.discounted ? ' · descontado' : ''}{e.dependsOn ? ` · depende de ${e.dependsOn}` : ''}</p>
                  
                  </Td>
                  
                  <Td className="max-w-[320px] whitespace-normal text-[12px]">{e.detail}</Td>
                  
                  <Td className="text-[12px]">{sourceSpec(e.source).label}</Td>
                  
                  <Td className="tabular text-right font-mono text-[12px]">{e.confidence}%</Td>
                  
                  <Td className="tabular text-right font-mono text-[12px]">{e.points > 0 ? `+${e.points}` : e.points}</Td>
                  
                  <Td>
                    
                    <Badge tone={signalMeta[e.state].tone} size="sm" icon={<SignalGlyph state={e.state} />}>
                      {signalMeta[e.state].label}
                    
                    </Badge>
                  
                  </Td>
                
                </Tr>
              ))}
            
            </tbody>
          
          </Table>
          
          <p className={cx('mt-3 text-[12px] text-muted')}>Regra aplicada: {a.ruleId} — {a.ruleText}</p>
        </>
      )}
    
    </div>
  )
}

function ButtonLink({ id }: { id: string }) {
  return (
    
    <Link to={`/operations/fragility/${id}`} className="text-[13px] text-muted hover:text-ink-900">
      Certificado de fragilidade
    
    </Link>
  )
}
