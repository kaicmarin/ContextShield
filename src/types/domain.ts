export type TxStatus =
  | 'RECEIVED'
  | 'ANALYZING'
  | 'CONTEXT_REQUIRED'
  | 'APPROVED'
  | 'APPROVED_WITH_ALERT'
  | 'INTERVENTION'
  | 'BLOCKED'
  | 'CANCELLED'
  | 'INCIDENT_RECORDED'
export type RiskBand = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type RiskLevel = RiskBand | 'INCONCLUSIVE'
export type Decision = 'APPROVE' | 'APPROVE_WITH_ALERT' | 'REQUEST_CONTEXT' | 'INTERVENE' | 'BLOCK'
export type ScenarioId = 'normal' | 'attention' | 'hard' | 'induction' | 'related' | 'fragile'
export type SignalState = 'ok' | 'attention' | 'risk'
export type EvidenceSource = 'history' | 'device' | 'checkout' | 'merchant' | 'customer' | 'intelligence'
export type DeclaredOrigin = 'self' | 'ad' | 'link' | 'guided'
export interface VerificationAnswers {
  origin: 'self' | 'asked'
  contact: 'no' | 'phone' | 'message'
  address: 'mine' | 'given'
}
export type SignalId =
  | 'AMOUNT_WITHIN_HABIT'
  | 'AMOUNT_ABOVE_HABIT'
  | 'HISTORY_SPARSE'
  | 'LONG_TENURE'
  | 'UNUSUAL_HOUR'
  | 'KNOWN_DEVICE'
  | 'SESSION_CONSISTENT'
  | 'LOCATION_CONSISTENT'
  | 'NEW_DEVICE'
  | 'SESSION_ANOMALY'
  | 'HABITUAL_DESTINATION'
  | 'NEW_DESTINATION_OWN'
  | 'NEW_DESTINATION_THIRD'
  | 'PICKUP_POINT'
  | 'ESTABLISHED_SELLER'
  | 'RECENT_SELLER'
  | 'SELLER_HIGH_CLAIMS'
  | 'ORIGIN_SELF'
  | 'ORIGIN_AD'
  | 'ORIGIN_LINK'
  | 'ORIGIN_GUIDED'
  | 'VER_ASKED'
  | 'VER_CONTACT'
  | 'VER_ADDRESS_GIVEN'
  | 'VER_CLEAR'
  | 'EVIDENCE_DIVERGENCE'
  | 'DESTINATION_IN_INCIDENT'
  | 'SELLER_IN_INCIDENT'
export interface Signal {
  id: SignalId
  source: EvidenceSource
  
  label: string
  
  clientLabel?: string
  
  detail: string
  basePoints: number
  
  points: number
  state: SignalState
  
  confidence: number
  dependsOn?: SignalId
  discounted?: boolean
  entityId?: string
  incidentIds?: string[]
}
export type Association = 'forte' | 'moderada' | 'fraca' | 'não indicativa'
export interface Relation {
  entityId: string
  kind: EntityKind
  value: string
  incidentIds: string[]
  txIds: string[]
  crossCustomer: boolean
  association: Association
  reason: string
}
export type AssessmentStage = 'initial' | 'recalculated'
export interface Assessment {
  stage: AssessmentStage
  at: string
  score: number
  band: RiskBand
  level: RiskLevel
  confidence: number
  decision: Decision
  ruleId: string
  ruleText: string
  signals: Signal[]
  relations: Relation[]
  
  degraded: EvidenceSource[]
  durationMs: number
  engine: string
}
export interface TxItem {
  productId: string
  name: string
  sellerId: string
  quantity: number
  unitPrice: number
}
export interface Transaction {
  id: string
  correlationId: string
  orderId?: string
  customerId: string
  merchantId: string
  sellerId?: string
  cardId: string
  deviceId: string
  addressId: string
  items: TxItem[]
  
  description?: string
  shipping: number
  amount: number
  installments: number
  createdAt: string
  updatedAt: string
  status: TxStatus
  channel: 'E-COMMERCE'
  scenario?: ScenarioId
  declaredOrigin?: DeclaredOrigin
  verification?: { answers: VerificationAnswers; at: string }
  interventionChoice?: 'cancelled' | 'continued'
  assessments: Assessment[]
  statusLog: StatusChange[]
  
  unavailable?: ProviderId[]
}
export interface StatusChange {
  at: string
  from?: TxStatus
  to: TxStatus
  by: 'Sistema' | 'Cliente' | 'Analista'
  reason: string
}
export interface Customer {
  id: string
  name: string
  firstName: string
  initials: string
  email: string
  phoneMask: string
  city: string
  since: string
  segment: string
  
  spend: { avgTicket90d: number; purchases90d: number }
}
export interface Card {
  id: string
  customerId: string
  last4: string
  holder: string
  product: string
  kind: 'Crédito'
  expiry: string
  limit: number
  available: number
  status: 'Ativo' | 'Bloqueado temporariamente'
}
export interface Device {
  id: string
  customerId: string
  name: string
  detail: string
  kind: 'laptop' | 'phone' | 'desktop' | 'tablet'
  location: string
  firstSeen: string
  lastSeen: string
  trusted: boolean
}
export interface Address {
  id: string
  customerIds: string[]
  label: string
  line1: string
  line2?: string
  district: string
  city: string
  zip: string
  kind: 'home' | 'work' | 'pickup'
}
export interface Merchant {
  id: string
  name: string
  legalName: string
  domain: string
  cnpj: string
  city: string
  category: string
  mcc: string
  since: string
  verified: boolean
  marketplace: boolean
}
export type SellerTier = 'oficial' | 'platinum' | 'gold' | 'estabelecido' | 'novo'
export interface Seller {
  id: string
  name: string
  initials: string
  color: string
  tagline: string
  about: string
  since: string
  city: string
  cnpj: string
  categories: string[]
  sales: number
  rating: number
  reviewCount: number
  tier: SellerTier
  responseTime: string
  onTimeRate: number
  cancellationRate: number
  claimsRate: number
  verifiedDocs: boolean
}
export type ProductKind =
  | 'notebook'
  | 'phone'
  | 'tablet'
  | 'headset'
  | 'earbuds'
  | 'speaker'
  | 'watch'
  | 'monitor'
  | 'keyboard'
  | 'mouse'
  | 'console'
  | 'controller'
  | 'camera'
  | 'mirrorless'
  | 'airfryer'
  | 'espresso'
  | 'robot'
  | 'chair'
  | 'lamp'
  | 'drill'
  | 'toolkit'
  | 'powerbank'
  | 'backpack'
export interface Product {
  id: string
  sku: string
  name: string
  line: string
  categorySlug: string
  kind: ProductKind
  sellerId: string
  price: number
  oldPrice?: number
  installments: number
  rating: number
  reviewCount: number
  stock: number
  deliveryDays: number
  description: string
  highlights: string[]
  specs: { label: string; value: string }[]
  
  finish: 'graphite' | 'silver' | 'sand' | 'midnight' | 'white' | 'sage' | 'clay'
  tag?: string
}
export interface Category {
  slug: string
  name: string
  blurb: string
}
export type IncidentStatus = 'RECEIVED' | 'IN_REVIEW' | 'RELATED' | 'CLOSED'
export type IncidentType = 'guided' | 'message' | 'link' | 'impersonation' | 'unrecognized' | 'other'
export type IncidentChannel = 'phone' | 'whatsapp' | 'sms' | 'email' | 'social' | 'site' | 'none'
export interface IncidentHistoryItem {
  at: string
  label: string
  actor: string
}
export interface Incident {
  id: string
  customerId: string
  txId?: string
  correlationId?: string
  type: IncidentType
  channel: IncidentChannel
  contactHandle?: string
  contactLink?: string
  destinationText?: string
  description: string
  occurredAt: string
  createdAt: string
  status: IncidentStatus
  consent: boolean
  
  closedAs?: 'resolved' | 'not-scam'
  history: IncidentHistoryItem[]
}
export type EntityKind = 'phone' | 'domain' | 'account' | 'destination' | 'seller' | 'merchant'
export interface IntelEntity {
  id: string
  kind: EntityKind
  value: string
  sub: string
  incidentIds: string[]
  txIds: string[]
  customerIds: string[]
  association: Association
  firstSeen: string
  lastSeen: string
  
  links: { targetId: string; reason: string; at: string }[]
}
export type PatternStatus = 'Observando' | 'Possível campanha'
export interface Pattern {
  id: string
  name: string
  hypothesis: string
  status: PatternStatus
  incidentIds: string[]
  txIds: string[]
  entityIds: string[]
  customerIds: string[]
  channels: IncidentChannel[]
  firstSeen: string
  updatedAt: string
  mergedFrom: string[]
}
export type EventLane = 'Checkout' | 'Cliente' | 'Intelligence' | 'Operations'
export type DomainEventName =
  | 'TransactionCreated'
  | 'InitialRiskCalculated'
  | 'ContextRequested'
  | 'ContextCompleted'
  | 'RiskRecalculated'
  | 'DecisionGenerated'
  | 'InterventionTriggered'
  | 'TransactionAuthorized'
  | 'TransactionCancelled'
  | 'IncidentConfirmed'
  | 'PatternUpdated'
  | 'CampaignDetected'
  | 'RelatedCaseFound'
  | 'CaseAssigned'
  | 'CaseClosed'
  | 'PolicyUpdated'
export type ServiceName =
  | 'NEXA Checkout'
  | 'API Gateway'
  | 'Account Service'
  | 'Protection Service'
  | 'Intelligence Service'
  | 'Incident Service'
  | 'Emissor (simulado)'
export interface DomainEvent {
  id: string
  seq: number
  name: DomainEventName
  at: string
  correlationId?: string
  txId?: string
  incidentId?: string
  service: ServiceName
  actor: 'Sistema' | 'Cliente' | 'Analista'
  actorName?: string
  action: string
  result: string
  lane: EventLane
  tone: 'neutral' | 'info' | 'ok' | 'warn' | 'risk'
}
export interface RejectedTransition {
  at: string
  txId: string
  from: TxStatus
  to: TxStatus
  reason: string
}
export type FlagId = 'intelligence-matching' | 'dependency-discount' | 'context-on-declared-guidance' | 'guidance-floor'
export type ProviderId = 'history' | 'device' | 'merchant' | 'intelligence'
export type ProviderStatus = 'up' | 'down'
export interface EngineConfig {
  flags: Record<FlagId, boolean>
  providers: Record<ProviderId, ProviderStatus>
}
