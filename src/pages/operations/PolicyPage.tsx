import { useDemo } from '../../context/DemoContext'
import { BANDS, ENGINE_VERSION, flagSpecs, policyRules, providerSpecs, decisionMeta } from '../../services/riskModel'
import type { FlagId, ProviderId, ProviderStatus } from '../../types/domain'
import { Badge } from '../../components/ui/Badge'
import { PageHeader } from '../../components/ui/Surface'
import { Table, Td, Th, THead, Tr } from '../../components/ui/Table'
export function PolicyPage() {
  const { domain, setFlag, setProvider } = useDemo()
  const { flags, providers } = domain.config

  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <div>
      <PageHeader
        eyebrow="Policy engine"
        title="Regras, faixas e provedores"
        description={`Motor ${ENGINE_VERSION}. A política decide; nenhum modelo de IA aprova, bloqueia ou altera este conjunto. As alterações abaixo valem só nesta sessão de demonstração.`}
      />

      
      <section className="mb-10">
        
        <h2 className="font-display text-[18px] font-semibold">Faixas de risco</h2>
        
        <p className="mt-1 text-[13px] text-muted">Quatro faixas, quatro destinos. A janela temporal não é o mecanismo central.</p>
        
        <div className="mt-4 grid gap-px overflow-hidden border-y border-line bg-line sm:grid-cols-4">
          {BANDS.map((b) => (
            
            <div key={b.band} className="bg-paper px-4 py-5">
              
              <p className="font-mono text-[12px] text-muted">
                {b.min}–{b.max}
              
              </p>
              
              <p className="mt-1 font-display text-[20px] font-semibold">{b.label}</p>
              
              <p className="mt-1 text-[13px] text-muted">{b.decision}</p>
            
            </div>
          ))}
        
        </div>
      
      </section>

      
      <section className="mb-10">
        
        <h2 className="font-display text-[18px] font-semibold">Regras (primeira que casa, de cima para baixo)</h2>
        
        <Table minWidth={880} className="mt-4">
          
          <THead>
            
            <Th>ID</Th>
            
            <Th>Nome</Th>
            
            <Th>Condição</Th>
            
            <Th>Resultado</Th>
          
          </THead>
          
          <tbody>
            {policyRules.map((r) => (
              
              <Tr key={r.id}>
                
                <Td className="font-mono">{r.id}</Td>
                
                <Td>{r.name}</Td>
                
                <Td className="max-w-[420px] whitespace-normal text-muted">{r.condition}</Td>
                
                <Td>{decisionMeta[r.outcome].label}</Td>
              
              </Tr>
            ))}
          
          </tbody>
        
        </Table>
      
      </section>

      
      <section className="mb-10">
        
        <h2 className="font-display text-[18px] font-semibold">Feature flags</h2>
        
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {flagSpecs.map((f) => (
            
            <li key={f.id} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
              
              <div>
                
                <p className="text-[14px] font-medium">{f.label}</p>
                
                <p className="text-[13px] text-muted">{f.description}</p>
              
              </div>
              <button
                type="button"
                onClick={() => setFlag(f.id as FlagId, !flags[f.id])}
                className="self-start rounded-md border border-line-strong px-3 py-1.5 text-[13px] hover:bg-canvas sm:self-auto"
                aria-pressed={flags[f.id]}
              >
                {flags[f.id] ? 'Ligada' : 'Desligada'}
              
              </button>
            
            </li>
          ))}
        
        </ul>
      
      </section>

      
      <section>
        
        <h2 className="font-display text-[18px] font-semibold">Provedores (saúde simulada)</h2>
        
        <p className="mt-1 text-[13px] text-muted">
          Indisponibilidade aqui é um interruptor de demonstração. Não há integração real com telemetria, cadastro de vendedores ou perfil de gasto.
        
        </p>
        
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {providerSpecs.map((p) => {
            const status: ProviderStatus = providers[p.id]
            return (
              
              <li key={p.id} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
                
                <div>
                  
                  <p className="flex items-center gap-2 text-[14px] font-medium">
                    {p.label}
                    
                    <Badge tone={status === 'up' ? 'ok' : 'warn'} size="sm">
                      {status === 'up' ? 'disponível' : 'indisponível'}
                    
                    </Badge>
                  
                  </p>
                  
                  <p className="text-[13px] text-muted">Fallback: {p.fallback}</p>
                
                </div>
                <button
                  type="button"
                  onClick={() => setProvider(p.id as ProviderId, status === 'up' ? 'down' : 'up')}
                  className="self-start rounded-md border border-line-strong px-3 py-1.5 text-[13px] hover:bg-canvas sm:self-auto"
                >
                  {status === 'up' ? 'Simular queda' : 'Restaurar'}
                
                </button>
              
              </li>
            )
          })}
        
        </ul>
      
      </section>
    
    </div>
  )
}
