import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDemo } from '../../context/DemoContext'
import { getCustomer } from '../../mocks/people'
import { getMerchant } from '../../mocks/merchants'
import { latestAssessment, txMerchantLabel } from '../../services/present'
import { txStatusMeta } from '../../services/labels'
import type { RiskLevel, TxStatus } from '../../types/domain'
import { RiskBadge, StatusBadge } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/Feedback'
import { Input, Select } from '../../components/ui/Form'
import { IdTag } from '../../components/ui/IdTag'
import { Table, Td, Th, THead, Tr } from '../../components/ui/Table'
import { formatBRL, formatDateTime } from '../../utils/format'

// a constante/variável statuses e atribui a ela o resultado da expressão desta linha.
const statuses = Object.keys(txStatusMeta) as TxStatus[]
// a constante/variável levels e atribui a ela o resultado da expressão desta linha.
const levels: RiskLevel[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'INCONCLUSIVE']
export function OpsTransactionsPage() {
  const { transactions } = useDemo()
  const [params, setParams] = useSearchParams()
  // Declara a constante/variável status e atribui a ela o resultado da expressão desta linha.
  const status = params.get('status') ?? ''
  // Declara a constante/variável level e atribui a ela o resultado da expressão desta linha.
  const level = params.get('level') ?? ''
  // Declara a constante/variável q e atribui a ela o resultado da expressão desta linha.
  const q = params.get('q') ?? ''

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

  // Guarda em rows um valor memorizado para evitar recalcular a expressão quando as dependências não mudarem.
  const rows = useMemo(
    () =>
      transactions
        .map((t) => ({ tx: t, a: latestAssessment(t), customer: getCustomer(t.customerId), merchant: getMerchant(t.merchantId) }))
        .filter(({ tx, a, customer }) => {
          // Verifica a condição antes de executar o bloco seguinte.
          if (status && tx.status !== status) return false
          // Verifica a condição antes de executar o bloco seguinte.
          if (level && a?.level !== level) return false
          // Verifica a condição antes de executar o bloco seguinte.
          if (q) {
            // Declara a constante/variável hay e atribui a ela o resultado da expressão desta linha.
            const hay = `${tx.id} ${tx.correlationId} ${tx.orderId} ${customer?.name ?? ''} ${txMerchantLabel(tx)}`.toLowerCase()
            // Verifica a condição antes de executar o bloco seguinte.
            if (!hay.includes(q.toLowerCase())) return false
          }
          // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
          return true
        }),
    [transactions, status, level, q],
  )

  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <div>
      
      
      <div className="mb-4 flex flex-wrap gap-2">
        
        <Input value={q} onChange={(e) => set('q', e.target.value)} placeholder="ID, cliente, correlation ID" aria-label="Buscar" className="max-w-xs" />
        
        <Select aria-label="Status" value={status} onChange={(e) => set('status', e.target.value)} className="w-auto">
          
          <option value="">Todos os status</option>
          {statuses.map((s) => (
            
            <option key={s} value={s}>
              {txStatusMeta[s].label}
            
            </option>
          ))}
        
        </Select>
        
        <Select aria-label="Nível" value={level} onChange={(e) => set('level', e.target.value)} className="w-auto">
          
          <option value="">Todos os níveis</option>
          {levels.map((l) => (
            
            <option key={l} value={l}>
              {l}
            
            </option>
          ))}
        
        </Select>
      
      </div>
      {rows.length === 0 ? (
        
        <EmptyState title="Nenhuma transação" />
      ) : (
        
        <Table minWidth={1080}>
          
          <THead>
            
            <Th>ID</Th>
            
            <Th>Quando</Th>
            
            <Th>Cliente</Th>
            
            <Th>Estabelecimento</Th>
            
            <Th className="text-right">Valor</Th>
            
            <Th>Decisão</Th>
            
            <Th>Status</Th>
            
            <Th>Correlation ID</Th>
          
          </THead>
          
          <tbody>
            {rows.map(({ tx, a, customer }) => (
              
              <Tr key={tx.id} to={`/operations/transactions/${tx.id}`}>
                
                <Td className="font-mono text-[12px]">{tx.id}</Td>
                
                <Td className="whitespace-nowrap text-[12px]">{formatDateTime(tx.createdAt)}</Td>
                
                <Td>{customer?.name}</Td>
                
                <Td>{txMerchantLabel(tx)}</Td>
                
                <Td className="tabular text-right">{formatBRL(tx.amount)}</Td>
                
                <Td>{a ? <RiskBadge level={a.level} score={a.score} compact /> : '—'}</Td>
                
                <Td>
                  
                  <StatusBadge status={tx.status} size="sm" />
                
                </Td>
                
                <Td>
                  
                  <IdTag value={tx.correlationId} tone="trace" />
                
                </Td>
              
              </Tr>
            ))}
          
          </tbody>
        
        </Table>
      )}
    
    </div>
  )
}
