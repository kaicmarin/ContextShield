import { useParams, useSearchParams } from 'react-router-dom'
import { useDemo } from '../../context/DemoContext'
import { getCustomer } from '../../mocks/people'
import { latestAssessment } from '../../services/present'
import { sources } from '../../services/riskModel'
import { EmptyState } from '../../components/ui/Feedback'
import { Select } from '../../components/ui/Form'
import { IdTag } from '../../components/ui/IdTag'
import { PageHeader } from '../../components/ui/Surface'
import { Button } from '../../components/ui/Button'
export function IndependencePage() {
  const { id } = useParams()
  const [params, setParams] = useSearchParams()
  const { transactions, getTx } = useDemo()
  // Declara a constante/variável txId e atribui a ela o resultado da expressão desta linha.
  const txId = id ?? params.get('tx') ?? transactions.find((t) => t.assessments.length > 0)?.id
  // Declara a constante/variável tx e atribui a ela o resultado da expressão desta linha.
  const tx = getTx(txId)
  // Declara a constante/variável a e atribui a ela o resultado da expressão desta linha.
  const a = tx ? latestAssessment(tx) : undefined
  // Declara a constante/variável options e atribui a ela o resultado da expressão desta linha.
  const options = transactions.filter((t) => t.assessments.length > 0)
  // Declara a constante/variável groups e atribui a ela o resultado da expressão desta linha.
  const groups = sources.map((s) => ({
    ...s,
    signals: a?.signals.filter((x) => x.source === s.id) ?? [],
  })).filter((g) => g.signals.length > 0)

  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <div>
      <PageHeader
        eyebrow="Evidence independence"
        title="Independência das fontes"
        description="Cinco sinais podem nascer da mesma origem. O que importa para a robustez é quantas fontes independentes sustentam a decisão — não a quantidade de linhas."
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

      {!a ? (
        
        <EmptyState title="Sem avaliação" />
      ) : (
        <>
          
          <p className="mb-8 text-[15px] text-muted">
            {groups.length} fonte{groups.length === 1 ? '' : 's'} independente{groups.length === 1 ? '' : 's'} · {a.signals.length} sinais · desconto de dependência {a.signals.some((s) => s.discounted) ? 'aplicado' : 'não necessário nesta leitura'}
          
          </p>
          
          <div className="grid gap-8 lg:grid-cols-2">
            {groups.map((g) => (
              
              <section key={g.id} className="border-t border-line pt-4">
                
                <p className="text-[12px] text-subtle">{g.provider}</p>
                
                <h2 className="mt-1 font-display text-[18px] font-semibold">{g.label}</h2>
                
                <p className="mt-1 text-[13px] text-muted">{g.provenance}</p>
                
                <ul className="mt-4 divide-y divide-line border-y border-line">
                  {g.signals.map((s) => (
                    
                    <li key={s.id} className="flex items-start justify-between gap-3 py-2.5">
                      
                      <div>
                        
                        <p className="text-[14px] font-medium">{s.label}</p>
                        
                        <p className="text-[12px] text-muted">{s.detail}</p>
                      
                      </div>
                      
                      <span className="tabular font-mono text-[13px]">{s.points > 0 ? `+${s.points}` : s.points}</span>
                    
                    </li>
                  ))}
                
                </ul>
              
              </section>
            ))}
          
          </div>
          
          <div className="mt-8">
            
            <Button size="sm" variant="secondary" to={`/operations/fragility/${tx?.id}`}>
              Ver certificado de fragilidade
            
            </Button>
          
          </div>
        </>
      )}
    
    </div>
  )
}
