import type { ReactNode } from 'react'
import { eventCatalog } from '../../mocks/eventCatalog'
import { ENGINE_VERSION } from '../../services/riskModel'
import { Badge } from '../../components/ui/Badge'
import { PageHeader } from '../../components/ui/Surface'
import { Table, Td, Th, THead, Tr } from '../../components/ui/Table'

// a função Layer. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function Layer({ title, note, children }: { title: string; note: string; children: ReactNode }) {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <section className="border-y border-line py-6">
      
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        
        <h3 className="font-display text-[16px] font-semibold">{title}</h3>
        
        <p className="text-[12px] text-muted">{note}</p>
      
      </div>
      {children}
    
    </section>
  )
}

function Node({ name, role, mode }: { name: string; role: string; mode: 'now' | 'planned' }) {
  return (
    
    <div className="min-w-0">
      
      <p className="font-display text-[15px] font-semibold">{name}</p>
      
      <p className="mt-0.5 text-[12px] leading-snug text-muted">{role}</p>
      
      <div className="mt-2">
        
        <Badge tone={mode === 'now' ? 'trace' : 'neutral'} size="sm">
          {mode === 'now' ? 'No protótipo' : 'Próxima etapa'}
        
        </Badge>
      
      </div>
    
    </div>
  )
}

export function ArchitecturePage() {
  return (
    
    <div>
      <PageHeader
        eyebrow="Architecture"
        title="Arquitetura planejada"
        description="React fala com um gateway; o gateway roteia para serviços; eventos assíncronos e PostgreSQL entram na implementação posterior. O que você navega hoje é o frontend com estado local."
      />

      
      <Layer title="Clientes" note="Implementado neste protótipo">
        
        <div className="grid gap-6 sm:grid-cols-3">
          
          <Node name="NEXA" role="Marketplace: catálogo, carrinho, checkout." mode="now" />
          
          <Node name="Aureon" role="App do cartão: transações, verificação, Fui vítima." mode="now" />
          
          <Node name="Operations" role="Investigação, evidências, inteligência, audit." mode="now" />
        
        </div>
      
      </Layer>

      
      <div className="py-3 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">HTTPS · correlation ID no header</div>

      
      <Layer title="API Gateway" note="Próxima etapa — Java / Spring">
        
        <div className="grid gap-6 sm:grid-cols-3">
          
          <Node name="Entrada única" role="Roteamento para Account, Protection, Intelligence, Incident, Audit." mode="planned" />
          
          <Node name="Identidade" role="JWT, refresh, autorização inicial. Não existe token real neste protótipo." mode="planned" />
          
          <Node name="Correlation ID" role="Gerado na borda e propagado em HTTP e eventos. Hoje o ID nasce no checkout local." mode="now" />
        
        </div>
      
      </Layer>

      
      <div className="py-3 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">REST síncrono · eventos assíncronos</div>

      
      <Layer title="Serviços" note="Lógica simulada no navegador · serviços reais na próxima etapa">
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          
          <Node name="Account" role="Cliente, cartão, dispositivo, pedidos." mode="now" />
          
          <Node name="Protection" role={`Risco ${ENGINE_VERSION}, política, intervenção.`} mode="now" />
          
          <Node name="Intelligence" role="Entidades e padrões derivados dos relatos." mode="now" />
          
          <Node name="Incident" role="Protocolo, caso, histórico, resolução." mode="now" />
          
          <Node name="Audit" role="Trilha append-only dos eventos do catálogo." mode="now" />
        
        </div>
      
      </Layer>

      
      <div className="py-3 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">persistência · fila</div>

      
      <Layer title="Infraestrutura" note="Nada disto está no ar neste checkpoint">
        
        <div className="grid gap-6 sm:grid-cols-3">
          
          <Node name="PostgreSQL" role="Um banco físico, schemas account / protection / intelligence / incident / audit." mode="planned" />
          
          <Node name="RabbitMQ" role="Quando o consumidor não precisa da resposta na mesma requisição (padrão, campanha, audit)." mode="planned" />
          
          <Node name="Emissor / bandeira" role="Autorização de pagamento. Aureon é fictício; não há Visa, Mastercard ou banco real." mode="planned" />
        
        </div>
      
      </Layer>

      
      <section className="mt-10">
        
        <h2 className="font-display text-[18px] font-semibold">Catálogo de eventos</h2>
        
        <p className="mt-1 text-[13px] text-muted">A timeline e o audit só exibem nomes deste catálogo. Routing keys são o contrato previsto para a fila — não há broker rodando.</p>
        
        <Table minWidth={880} className="mt-4">
          
          <THead>
            
            <Th>Evento</Th>
            
            <Th>Produtor</Th>
            
            <Th>Consumidores</Th>
            
            <Th>Routing key</Th>
          
          </THead>
          
          <tbody>
            {eventCatalog.map((e) => (
              
              <Tr key={e.name}>
                
                <Td className="font-mono text-[12px]">{e.name}</Td>
                
                <Td className="text-[12px]">{e.producer}</Td>
                
                <Td className="max-w-[280px] whitespace-normal text-[12px] text-muted">{e.consumers.join(', ') || '—'}</Td>
                
                <Td className="font-mono text-[12px] text-muted">{e.routingKey}</Td>
              
              </Tr>
            ))}
          
          </tbody>
        
        </Table>
      
      </section>

      
      <section className="mt-10 grid gap-8 lg:grid-cols-2">
        
        <div>
          
          <h2 className="font-display text-[18px] font-semibold">O que este protótipo faz</h2>
          
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[14px] text-ink-800">
            
            <li>Navegação completa da loja ao Operations, com estado no navegador.</li>
            
            <li>Motor de regras com pesos documentados, não números aleatórios.</li>
            
            <li>Intelligence recalculada a partir dos incidentes existentes.</li>
            
            <li>Correlation ID único por transação, visível nas telas internas.</li>
          
          </ul>
        
        </div>
        
        <div>
          
          <h2 className="font-display text-[18px] font-semibold">O que não está implementado</h2>
          
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[14px] text-ink-800">
            
            <li>Spring Boot, JWT, Docker, RabbitMQ, PostgreSQL em execução.</li>
            
            <li>Autorização bancária, bandeira de cartão, CVV, dados reais.</li>
            
            <li>IA como autoridade de decisão.</li>
            
            <li>OpenTelemetry, Prometheus, Grafana ou Loki em produção.</li>
          
          </ul>
        
        </div>
      
      </section>
    
    </div>
  )
}
