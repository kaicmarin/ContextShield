import { Link, useSearchParams } from 'react-router-dom'
import { useDemo } from '../../context/DemoContext'
import { eventCatalog } from '../../mocks/eventCatalog'
import { EmptyState } from '../../components/ui/Feedback'
import { Input, Select } from '../../components/ui/Form'
import { IdTag } from '../../components/ui/IdTag'
import { PageHeader } from '../../components/ui/Surface'
import { Table, Td, Th, THead, Tr } from '../../components/ui/Table'
import { formatShortDate, formatTime } from '../../utils/format'
import type { DomainEventName } from '../../types/domain'
export function AuditPage() {
  const { domain } = useDemo()
  // Declara a constante/variável audit e atribui a ela o resultado da expressão desta linha.
  const audit = domain.events
  const [params, setParams] = useSearchParams()
  // Declara a constante/variável event e atribui a ela o resultado da expressão desta linha.
  const event = (params.get('event') ?? '') as DomainEventName | ''
  // Declara a constante/variável actor e atribui a ela o resultado da expressão desta linha.
  const actor = params.get('actor') ?? ''
  // Declara a constante/variável q e atribui a ela o resultado da expressão desta linha.
  const q = params.get('q') ?? ''
  // Declara a constante/variável names e atribui a ela o resultado da expressão desta linha.
  const names = eventCatalog.map((e) => e.name)
  // Declara a constante/variável actors e atribui a ela o resultado da expressão desta linha.
  const actors = Array.from(new Set(audit.map((a) => a.actor))).sort()

  // Declara a constante/variável set e atribui a ela o resultado da expressão desta linha.
  const set = (key: string, value: string) => {
    // Declara a constante/variável next e atribui a ela o resultado da expressão desta linha.
    const next = new URLSearchParams(params)
    // Verifica a condição antes de executar o bloco seguinte.
    if (value) next.set(key, value)
    // Caso a condição anterior não seja atendida, executa o caminho alternativo.
    else next.delete(key)
    // Atualiza o estado associado ao setter desta variável; o React agenda uma nova renderização quando necessário.
    setParams(next, { replace: true })
  }

  // Declara a constante/variável rows e atribui a ela o resultado da expressão desta linha.
  const rows = audit.filter((a) => {
    // Verifica a condição antes de executar o bloco seguinte.
    if (event && a.name !== event) return false
    // Verifica a condição antes de executar o bloco seguinte.
    if (actor && a.actor !== actor) return false
    // Verifica a condição antes de executar o bloco seguinte.
    if (q) {
      // Declara a constante/variável hay e atribui a ela o resultado da expressão desta linha.
      const hay = `${a.correlationId} ${a.txId ?? ''} ${a.incidentId ?? ''} ${a.action}`.toLowerCase()
      // Verifica a condição antes de executar o bloco seguinte.
      if (!hay.includes(q.toLowerCase())) return false
    }
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return true
  })

  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <div>
      <PageHeader
        eyebrow="Operations"
        title="Audit"
        description="Registro append-only de eventos, decisões e ações. Cada linha carrega o correlation ID da jornada."
      />
      
      <div className="mb-4 flex flex-wrap gap-2">
        
        <Input value={q} onChange={(e) => set('q', e.target.value)} placeholder="Correlation ID, transação ou incidente" aria-label="Buscar" className="max-w-xs" />
        
        <Select aria-label="Evento" value={event} onChange={(e) => set('event', e.target.value)} className="w-auto">
          
          <option value="">Todos os eventos</option>
          {names.map((n) => (
            
            <option key={n} value={n}>
              {n}
            
            </option>
          ))}
        
        </Select>
        
        <Select aria-label="Ator" value={actor} onChange={(e) => set('actor', e.target.value)} className="w-auto">
          
          <option value="">Todos os atores</option>
          {actors.map((n) => (
            
            <option key={n} value={n}>
              {n}
            
            </option>
          ))}
        
        </Select>
      
      </div>
      {rows.length === 0 ? (
        
        <EmptyState title="Nenhum evento" description="Ajuste os filtros ou execute um fluxo na loja." />
      ) : (
        
        <Table minWidth={1080}>
          
          <THead>
            
            <Th>Quando</Th>
            
            <Th>Evento</Th>
            
            <Th>Serviço</Th>
            
            <Th>Ação</Th>
            
            <Th>Resultado</Th>
            
            <Th>Correlation ID</Th>
            
            <Th>Transação</Th>
          
          </THead>
          
          <tbody>
            {[...rows].reverse().map((a) => (
              
              <Tr key={a.id}>
                
                <Td className="whitespace-nowrap font-mono text-[12px]">
                  {formatShortDate(a.at)} {formatTime(a.at)}
                
                </Td>
                
                <Td className="font-medium">{a.name}</Td>
                
                <Td className="text-[12px]">{a.service}</Td>
                
                <Td className="max-w-[240px] whitespace-normal text-[12px]">{a.action}</Td>
                
                <Td className="text-[12px]">{a.result}</Td>
                
                <Td>{a.correlationId ? <IdTag value={a.correlationId} tone="trace" to={`/operations/timeline?c=${a.correlationId}`} /> : '—'}</Td>
                
                <Td>
                  {a.txId ? (
                    
                    <Link to={`/operations/transactions/${a.txId}`} className="id-tag hover:underline">
                      {a.txId}
                    
                    </Link>
                  ) : (
                    '—'
                  )}
                
                </Td>
              
              </Tr>
            ))}
          
          </tbody>
        
        </Table>
      )}
      
      <p className="mt-3 text-[12px] text-muted">
        {rows.length} de {audit.length} eventos · registro local da demonstração, sem fila de mensageria
      
      </p>
    
    </div>
  )
}
