import { Link } from 'react-router-dom'
import { useViewerData } from '../../components/security/SecurityParts'
import { Button } from '../../components/ui/Button'

// a constante/variável moments e atribui a ela o resultado da expressão desta linha.
const moments = [
  {
    id: 'antes',
    label: 'Antes',
    title: 'Confira antes de pagar',
    body: 'Verifique uma loja, um telefone ou uma mensagem antes de fazer uma compra que alguém pediu.',
    to: '/security/check',
    cta: 'Verificar agora',
  },
  {
    id: 'durante',
    label: 'Durante',
    title: 'Uma pausa quando algo não combina',
    body: 'Se a compra tiver sinais comuns em golpes — como entrega em endereço indicado por outra pessoa — perguntamos antes de concluir. A decisão continua sendo sua.',
    to: '/security/transactions',
    cta: 'Ver compras',
  },
  {
    id: 'depois',
    label: 'Depois',
    title: 'Seu relato protege outras pessoas',
    body: 'Se algo deu errado, conte o que aconteceu. As informações ajudam a reconhecer o mesmo golpe em outras compras.',
    to: '/security/report',
    cta: 'Fui vítima',
  },
]
export function ProtectionPage() {
  const { mine } = useViewerData()
  // Declara a constante/variável asked e atribui a ela o resultado da expressão desta linha.
  const asked = mine.filter((t) => t.assessments.some((a) => a.decision === 'REQUEST_CONTEXT')).length
  // Declara a constante/variável paused e atribui a ela o resultado da expressão desta linha.
  const paused = mine.filter((t) => t.statusLog.some((c) => c.to === 'INTERVENTION' || c.to === 'BLOCKED')).length

  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <div>
      

      
      <dl className="mb-6 grid grid-cols-3 divide-x divide-line overflow-hidden rounded-2xl border border-line bg-paper text-center">
        {[
          { label: 'Compras conferidas', value: mine.length },
          { label: 'Confirmações pedidas', value: asked },
          { label: 'Compras pausadas', value: paused },
        ].map((m) => (
          
          <div key={m.label} className="px-3 py-4">
            
            <dt className="text-[12px] text-muted">{m.label}</dt>
            
            <dd className="tabular mt-0.5 font-display text-[24px] font-semibold">{m.value}</dd>
          
          </div>
        ))}
      
      </dl>

      
      <section className="overflow-hidden rounded-2xl bg-aureon-deep p-6 text-white">
        
        
        <p className="mt-5 max-w-lg font-display text-[22px] font-semibold leading-snug tracking-[-0.01em]">
          Nem todo golpe parece uma compra estranha. Às vezes, é você mesmo comprando — orientado por outra pessoa.
        
        </p>
        
        <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-white/70">
        
        </p>
      
      </section>

      
      <ol className="mt-6 space-y-3">
        {moments.map((m, i) => (
          
          <li key={m.id} className="grid gap-4 rounded-2xl border border-line bg-paper p-5 sm:grid-cols-[88px_1fr_auto] sm:items-center">
            
            <div>
              
              <p className="font-mono text-[11px] text-subtle">0{i + 1}</p>
              
              <p className="font-display text-[18px] font-semibold">{m.label}</p>
            
            </div>
            
            <div>
              
              <p className="font-medium">{m.title}</p>
              
              <p className="mt-0.5 text-[14px] leading-relaxed text-muted">{m.body}</p>
            
            </div>
            
            <Button size="sm" variant="secondary" to={m.to}>
              {m.cta}
            
            </Button>
          
          </li>
        ))}
      
      </ol>

      
      <section className="mt-6 rounded-2xl border border-line bg-paper p-5 text-[14px]">
        
        
        <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
          
          <li>Não lê suas mensagens, e-mails ou ligações. O verificador só analisa o texto que você mesmo colar.</li>
          
          <li>Não pede senha, código ou dados do cartão.</li>
          
          <li>Não decide sozinho por inteligência artificial: toda decisão segue regras que podem ser explicadas.</li>
          
          <li>Não garante que todo golpe será identificado.</li>
        
        </ul>
        
        <Link to="/security/devices" className="mt-3 inline-block text-[13px] font-medium text-signal-ink hover:underline">
          Revisar dispositivos com acesso →
        
        </Link>
      
      </section>
    
    </div>
  )
}
