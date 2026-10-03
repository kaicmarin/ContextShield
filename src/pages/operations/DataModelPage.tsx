import { PageHeader } from '../../components/ui/Surface'

// um tipo/interface TypeScript. Esta parte serve para tipagem em desenvolvimento e não vira lógica JavaScript em runtime.
type Rel = '1' | 'N'

// a função Box. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function Box({
  name,
  keys,
  fields,
  schema,
}: {
  name: string
  keys: string[]
  fields: string[]
  schema: string
}) {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <article className="min-w-[200px] border border-line bg-paper">
      
      <header className="border-b border-line bg-ink-950 px-3 py-2 text-white">
        
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/45">{schema}</p>
        
        <h3 className="font-display text-[15px] font-semibold">{name}</h3>
      
      </header>
      
      <ul className="divide-y divide-line text-[12px]">
        {keys.map((k) => (
          
          <li key={k} className="px-3 py-1.5 font-mono text-ink-900">
            
            <span className="mr-2 text-[10px] font-semibold uppercase tracking-wide text-subtle">PK</span>
            {k}
          
          </li>
        ))}
        {fields.map((f) => (
          
          <li key={f} className="px-3 py-1.5 font-mono text-muted">
            {f}
          
          </li>
        ))}
      
      </ul>
    
    </article>
  )
}

function Arrow({ from, to, label }: { from: Rel; to: Rel; label: string }) {
  return (
    
    <p className="flex items-center justify-center gap-2 py-2 font-mono text-[11px] text-subtle" aria-hidden>
      
      <span>{from}</span>
      
      <span className="h-px w-8 bg-line-strong" />
      
      <span>{label}</span>
      
      <span className="h-px w-8 bg-line-strong" />
      
      <span>{to}</span>
    
    </p>
  )
}

export function DataModelPage() {
  return (
    
    <div>
      <PageHeader
        eyebrow="Modelo de dados"
        title="DER e MER"
        description="Modelo conceitual e relacional previstos para o PostgreSQL único, com schemas por domínio. Neste protótipo os registros vivem no estado local do navegador — a estrutura abaixo é a base da persistência futura."
      />

      
      <section className="mb-12" aria-labelledby="mer">
        
        <h2 id="mer" className="font-display text-[20px] font-semibold">
          MER — visão conceitual
        
        </h2>
        
        <p className="mt-1 max-w-2xl text-[14px] text-muted">
          Um cliente realiza transações. Cada transação gera avaliações com sinais. Um relato de incidente cita entidades. Entidades ligam incidentes e transações. Eventos acompanham o correlation ID de ponta a ponta.
        
        </p>
        
        <div className="mt-6 overflow-x-auto">
          
          <svg viewBox="0 0 980 420" className="min-w-[720px] max-w-full" role="img" aria-label="Diagrama entidade-relacionamento conceitual">
            
            <rect x="20" y="24" width="180" height="72" fill="#0A1928" />
            
            <text x="110" y="54" textAnchor="middle" fill="#fff" className="text-[13px] font-semibold">
              Cliente
            
            </text>
            
            <text x="110" y="74" textAnchor="middle" fill="#8A95A1" className="text-[11px]">
              cartão · dispositivo
            
            </text>

            
            <rect x="280" y="24" width="200" height="72" fill="#161616" />
            
            <text x="380" y="54" textAnchor="middle" fill="#fff" className="text-[13px] font-semibold">
              Transação
            
            </text>
            
            <text x="380" y="74" textAnchor="middle" fill="#B8B2A8" className="text-[11px]">
              correlation_id · status
            
            </text>

            
            <rect x="560" y="24" width="180" height="72" fill="#0E3A2F" />
            
            <text x="650" y="54" textAnchor="middle" fill="#fff" className="text-[13px] font-semibold">
              Avaliação
            
            </text>
            
            <text x="650" y="74" textAnchor="middle" fill="#9EC9B8" className="text-[11px]">
              score · decisão · regra
            
            </text>

            
            <rect x="800" y="24" width="160" height="72" fill="#3A1A16" />
            
            <text x="880" y="54" textAnchor="middle" fill="#fff" className="text-[13px] font-semibold">
              Sinal
            
            </text>
            
            <text x="880" y="74" textAnchor="middle" fill="#E8B4A8" className="text-[11px]">
              fonte · peso
            
            </text>

            
            <rect x="280" y="176" width="200" height="72" fill="#2A1C0A" />
            
            <text x="380" y="206" textAnchor="middle" fill="#fff" className="text-[13px] font-semibold">
              Incidente
            
            </text>
            
            <text x="380" y="226" textAnchor="middle" fill="#E2C48A" className="text-[11px]">
              protocolo · canal · relato
            
            </text>

            
            <rect x="560" y="176" width="180" height="72" fill="#1A2430" />
            
            <text x="650" y="206" textAnchor="middle" fill="#fff" className="text-[13px] font-semibold">
              Entidade
            
            </text>
            
            <text x="650" y="226" textAnchor="middle" fill="#9BB0C4" className="text-[11px]">
              telefone · domínio · destino
            
            </text>

            
            <rect x="800" y="176" width="160" height="72" fill="#1A2430" />
            
            <text x="880" y="206" textAnchor="middle" fill="#fff" className="text-[13px] font-semibold">
              Padrão
            
            </text>
            
            <text x="880" y="226" textAnchor="middle" fill="#9BB0C4" className="text-[11px]">
              hipótese · status
            
            </text>

            
            <rect x="280" y="328" width="200" height="72" fill="#122018" />
            
            <text x="380" y="358" textAnchor="middle" fill="#fff" className="text-[13px] font-semibold">
              Evento
            
            </text>
            
            <text x="380" y="378" textAnchor="middle" fill="#9EC9B8" className="text-[11px]">
              catálogo único · audit
            
            </text>

            
            <rect x="20" y="176" width="180" height="72" fill="#161616" />
            
            <text x="110" y="206" textAnchor="middle" fill="#fff" className="text-[13px] font-semibold">
              Pedido NEXA
            
            </text>
            
            <text x="110" y="226" textAnchor="middle" fill="#B8B2A8" className="text-[11px]">
              itens · vendedor · entrega
            
            </text>

            {[
              [200, 60, 280, 60],
              [480, 60, 560, 60],
              [740, 60, 800, 60],
              [380, 96, 380, 176],
              [480, 212, 560, 212],
              [740, 212, 800, 212],
              [380, 248, 380, 328],
              [200, 212, 280, 212],
            ].map(([x1, y1, x2, y2], i) => (
              
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#8A95A1" strokeWidth="1.4" />
            ))}
          
          </svg>
        
        </div>
      
      </section>

      
      <section aria-labelledby="der">
        
        <h2 id="der" className="font-display text-[20px] font-semibold">
          DER — schemas previstos no PostgreSQL
        
        </h2>
        
        <p className="mt-1 max-w-2xl text-[14px] text-muted">
          Um único banco físico, schemas separados por serviço. Chaves estrangeiras atravessam schemas apenas por IDs estáveis — nunca por dados pessoais em claro.
        
        </p>

        
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          
          <div>
            
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-subtle">account</p>
            
            <div className="flex flex-wrap gap-4">
              
              <Box schema="account" name="customer" keys={['id']} fields={['name', 'email_hash', 'city', 'since']} />
              
              <Box schema="account" name="card" keys={['id']} fields={['customer_id FK', 'last4', 'product', 'status']} />
              
              <Box schema="account" name="device" keys={['id']} fields={['customer_id FK', 'trusted', 'last_seen']} />
            
            </div>
            
            <Arrow from="1" to="N" label="possui cartões e dispositivos" />
          
          </div>
          
          <div>
            
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-subtle">protection</p>
            
            <div className="flex flex-wrap gap-4">
              
              <Box schema="protection" name="transaction" keys={['id']} fields={['correlation_id', 'customer_id', 'status', 'amount']} />
              
              <Box schema="protection" name="assessment" keys={['id']} fields={['tx_id FK', 'stage', 'score', 'decision', 'rule_id']} />
              
              <Box schema="protection" name="signal" keys={['id']} fields={['assessment_id FK', 'source', 'points', 'depends_on']} />
            
            </div>
            
            <Arrow from="1" to="N" label="avaliações e sinais por transação" />
          
          </div>
          
          <div>
            
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-subtle">incident</p>
            
            <div className="flex flex-wrap gap-4">
              
              <Box schema="incident" name="incident" keys={['id']} fields={['customer_id', 'tx_id', 'type', 'channel', 'description']} />
              
              <Box schema="incident" name="incident_history" keys={['id']} fields={['incident_id FK', 'at', 'actor', 'label']} />
            
            </div>
            
            <Arrow from="1" to="N" label="histórico de caso" />
          
          </div>
          
          <div>
            
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-subtle">intelligence · audit</p>
            
            <div className="flex flex-wrap gap-4">
              
              <Box schema="intelligence" name="entity" keys={['id']} fields={['kind', 'value_normalized', 'association']} />
              
              <Box schema="intelligence" name="pattern" keys={['id']} fields={['name', 'status', 'hypothesis']} />
              
              <Box schema="audit" name="event" keys={['id']} fields={['name', 'at', 'correlation_id', 'service', 'result']} />
            
            </div>
            
            <Arrow from="N" to="N" label="entidades ligam incidentes e transações" />
          
          </div>
        
        </div>
      
      </section>
    
    </div>
  )
}
