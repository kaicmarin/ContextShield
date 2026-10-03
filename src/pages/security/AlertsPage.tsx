import { BellOff } from 'lucide-react'
import { AlertRow, SecTitle, useViewerData } from '../../components/security/SecurityParts'
import { EmptyState } from '../../components/ui/Feedback'
export function AlertsPage() {
  const { alerts } = useViewerData()
  // Declara a constante/variável pending e atribui a ela o resultado da expressão desta linha.
  const pending = alerts.filter((a) => a.pending)
  // Declara a constante/variável rest e atribui a ela o resultado da expressão desta linha.
  const rest = alerts.filter((a) => !a.pending)

  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <div>
      
      <SecTitle title="Alertas" description="Avisos de segurança sobre o seu cartão." />
      {alerts.length === 0 && <EmptyState icon={<BellOff className="h-5 w-5" aria-hidden />} title="Nenhum alerta" description="Quando algo precisar da sua atenção, aparece aqui." />}
      {pending.length > 0 && (
        
        <section aria-labelledby="al-pending" className="mb-6">
          
          <h2 id="al-pending" className="mb-2 text-[13px] font-semibold text-warn-ink">
            Precisam de você
          
          </h2>
          
          <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-warn/30 bg-paper">
            {pending.map((a) => (
              
              <AlertRow key={a.id} alert={a} />
            ))}
          
          </ul>
        
        </section>
      )}
      {rest.length > 0 && (
        
        <section aria-labelledby="al-rest">
          
          <h2 id="al-rest" className="mb-2 text-[13px] font-semibold text-muted">
            Recentes
          
          </h2>
          
          <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper">
            {rest.map((a) => (
              
              <AlertRow key={a.id} alert={a} />
            ))}
          
          </ul>
        
        </section>
      )}
    
    </div>
  )
}
