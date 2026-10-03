import type { DomainEventName, ServiceName } from '../types/domain'
export interface EventSpec {
  name: DomainEventName
  description: string
  producer: ServiceName
  consumers: ServiceName[]
  
  routingKey: string
}
export const eventCatalog: EventSpec[] = [
  { name: 'TransactionCreated', description: 'Compra recebida do checkout com correlation ID próprio.', producer: 'Account Service', consumers: ['Protection Service', 'Emissor (simulado)'], routingKey: 'tx.created' },
  { name: 'InitialRiskCalculated', description: 'Primeira leitura de risco com os sinais disponíveis no momento.', producer: 'Protection Service', consumers: ['Incident Service'], routingKey: 'risk.initial' },
  { name: 'ContextRequested', description: 'Política pediu contexto ao cliente antes de decidir.', producer: 'Protection Service', consumers: ['NEXA Checkout'], routingKey: 'context.requested' },
  { name: 'ContextCompleted', description: 'Cliente respondeu a verificação contextual.', producer: 'Protection Service', consumers: ['Protection Service'], routingKey: 'context.completed' },
  { name: 'RiskRecalculated', description: 'Risco recalculado com as respostas do cliente.', producer: 'Protection Service', consumers: ['Incident Service'], routingKey: 'risk.recalculated' },
  { name: 'DecisionGenerated', description: 'Decisão aplicada pela política (regra identificada).', producer: 'Protection Service', consumers: ['Emissor (simulado)', 'Incident Service'], routingKey: 'decision.generated' },
  { name: 'InterventionTriggered', description: 'Compra pausada ou bloqueada para proteger o cliente.', producer: 'Protection Service', consumers: ['NEXA Checkout', 'Incident Service'], routingKey: 'intervention.triggered' },
  { name: 'TransactionAuthorized', description: 'Autorização liberada pelo emissor (simulado).', producer: 'Emissor (simulado)', consumers: ['Account Service'], routingKey: 'tx.authorized' },
  { name: 'TransactionCancelled', description: 'Compra encerrada sem cobrança (cliente ou política).', producer: 'Account Service', consumers: ['Protection Service'], routingKey: 'tx.cancelled' },
  { name: 'IncidentConfirmed', description: 'Relato do cliente registrado com protocolo.', producer: 'Incident Service', consumers: ['Intelligence Service'], routingKey: 'incident.confirmed' },
  { name: 'PatternUpdated', description: 'Entidades do relato ligadas a um padrão (novo ou existente).', producer: 'Intelligence Service', consumers: ['Protection Service', 'Incident Service'], routingKey: 'intel.pattern.updated' },
  { name: 'CampaignDetected', description: 'Padrão passou a reunir casos suficientes para ser tratado como possível campanha.', producer: 'Intelligence Service', consumers: ['Protection Service', 'Incident Service'], routingKey: 'intel.campaign.detected' },
  { name: 'RelatedCaseFound', description: 'Transação ou relato compartilha entidade com casos conhecidos.', producer: 'Intelligence Service', consumers: ['Protection Service', 'Incident Service'], routingKey: 'intel.related.found' },
  { name: 'CaseAssigned', description: 'Analista assumiu o caso.', producer: 'Incident Service', consumers: [], routingKey: 'case.assigned' },
  { name: 'CaseClosed', description: 'Analista encerrou o caso com nota de conclusão.', producer: 'Incident Service', consumers: ['Intelligence Service'], routingKey: 'case.closed' },
  { name: 'PolicyUpdated', description: 'Regra, flag ou provedor do motor alterado.', producer: 'Protection Service', consumers: [], routingKey: 'policy.updated' },
]

// a constante/variável map e atribui a ela o resultado da expressão desta linha.
const map = new Map(eventCatalog.map((e) => [e.name, e]))
export const eventSpec = (name: DomainEventName) => map.get(name) as EventSpec
