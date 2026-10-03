import type {
  Assessment,
  DeclaredOrigin,
  DomainEvent,
  EngineConfig,
  FlagId,
  Incident,
  IncidentChannel,
  IncidentType,
  ProviderId,
  ProviderStatus,
  RejectedTransition,
  ScenarioId,
  Transaction,
  TxItem,
  TxStatus,
  VerificationAnswers,
} from '../types/domain'
import { INCIDENT_SEQ_BASELINE, TX_SEQ_BASELINE, correlationIdFor, incidentIdFor, orderIdFor, txIdFor } from '../mocks/ids'
import { seedPurchases, seedReports } from '../mocks/history'
import { getScenario } from '../mocks/scenarios'
import { getProductById, shippingFor } from '../mocks/products'
import { getMerchant } from '../mocks/merchants'
import { getSeller } from '../mocks/sellers'
import { cardFor, getAddress, getCustomer, getDevice } from '../mocks/people'
import { incidentTypeShort } from '../mocks/incidents'
import { buildIntelligence, patternForIncident, relationsForTx, txSellerIds, type IntelSnapshot } from './intel'
import { assess, type EngineInput } from './risk'
import { AUTHORIZED, checkTransition, decisionToStatus } from './status'
import { flagSpecs, providerSpecs } from './riskModel'
import { addSeconds, formatBRL } from '../utils/format'
export const STATE_VERSION = 6
export const ANALYST = 'L. Moreira'
export interface DomainState {
  version: number
  clock: string
  txSeq: number
  incidentSeq: number
  eventSeq: number
  transactions: Transaction[]
  incidents: Incident[]
  events: DomainEvent[]
  rejections: RejectedTransition[]
  processed: string[]
  config: EngineConfig
}
export function defaultConfig(): EngineConfig {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return {
    flags: { 'intelligence-matching': true, 'dependency-discount': true, 'context-on-declared-guidance': true, 'guidance-floor': true },
    providers: { history: 'up', device: 'up', merchant: 'up', intelligence: 'up' },
  }
}

// a função emptyState. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function emptyState(): DomainState {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return {
    version: STATE_VERSION,
    clock: '2026-09-14T00:00:00',
    txSeq: 130,
    incidentSeq: 1246,
    eventSeq: 0,
    transactions: [],
    incidents: [],
    events: [],
    rejections: [],
    processed: [],
    config: defaultConfig(),
  }
}

// um tipo/interface TypeScript. Esta parte serve para tipagem em desenvolvimento e não vira lógica JavaScript em runtime.
type EventInput = Omit<DomainEvent, 'id' | 'seq'>

// a função emit. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function emit(s: DomainState, e: EventInput): DomainState {
  // Declara a constante/variável seq e atribui a ela o resultado da expressão desta linha.
  const seq = s.eventSeq + 1
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return { ...s, eventSeq: seq, events: [...s.events, { ...e, seq, id: `EVT-${String(seq).padStart(5, '0')}` }] }
}

// a função later. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function later(a: string, b: string) {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return a > b ? a : b
}

// a função tick. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function tick(s: DomainState, seconds: number, floor?: string): { s: DomainState; at: string } {
  // Declara a constante/variável at e atribui a ela o resultado da expressão desta linha.
  const at = later(addSeconds(s.clock, seconds), floor ?? '')
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return { s: { ...s, clock: at }, at }
}

// a função patchTx. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function patchTx(s: DomainState, id: string, patch: (t: Transaction) => Transaction): DomainState {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return { ...s, transactions: s.transactions.map((t) => (t.id === id ? patch(t) : t)) }
}

// a função patchIncident. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function patchIncident(s: DomainState, id: string, patch: (i: Incident) => Incident): DomainState {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return { ...s, incidents: s.incidents.map((i) => (i.id === id ? patch(i) : i)) }
}
export const findTx = (s: DomainState, id: string | undefined) => (id ? s.transactions.find((t) => t.id === id) : undefined)
export const findIncident = (s: DomainState, id: string | undefined) => (id ? s.incidents.find((i) => i.id === id) : undefined)

// a função moveStatus. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function moveStatus(s: DomainState, txId: string, to: TxStatus, at: string, by: 'Sistema' | 'Cliente' | 'Analista', reason: string): { s: DomainState; ok: boolean } {
  // Declara a constante/variável tx e atribui a ela o resultado da expressão desta linha.
  const tx = findTx(s, txId)
  // Verifica a condição antes de executar o bloco seguinte.
  if (!tx) return { s, ok: false }
  // Declara a constante/variável check e atribui a ela o resultado da expressão desta linha.
  const check = checkTransition(tx, to)
  // Verifica a condição antes de executar o bloco seguinte.
  if (!check.ok) {
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return { s: { ...s, rejections: [...s.rejections, { at, txId, from: tx.status, to, reason: check.reason }] }, ok: false }
  }
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return {
    s: patchTx(s, txId, (t) => ({ ...t, status: to, updatedAt: at, statusLog: [...t.statusLog, { at, from: t.status, to, by, reason }] })),
    ok: true,
  }
}

export function intelAt(s: DomainState, at?: string): IntelSnapshot {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return buildIntelligence(s.incidents, s.transactions, at)
}
export function engineInputFor(s: DomainState, tx: Transaction, stage: Assessment['stage'], at: string, answers?: VerificationAnswers): EngineInput {
  // Declara a constante/variável customer e atribui a ela o resultado da expressão desta linha.
  const customer = getCustomer(tx.customerId)
  // Declara a constante/variável device e atribui a ela o resultado da expressão desta linha.
  const device = getDevice(tx.deviceId)
  // Declara a constante/variável address e atribui a ela o resultado da expressão desta linha.
  const address = getAddress(tx.addressId)
  // Declara a constante/variável merchant e atribui a ela o resultado da expressão desta linha.
  const merchant = getMerchant(tx.merchantId)
  // Verifica a condição antes de executar o bloco seguinte.
  if (!customer || !device || !address || !merchant) throw new Error(`Referência inválida em ${tx.id}`)
  // Declara a constante/variável sellers e atribui a ela o resultado da expressão desta linha.
  const sellers = txSellerIds(tx)
    .map((id) => getSeller(id))
    .filter((x): x is NonNullable<typeof x> => !!x)
  // Declara a constante/variável addressUsedBefore e atribui a ela o resultado da expressão desta linha.
  const addressUsedBefore = s.transactions.some(
    (o) => o.id !== tx.id && o.customerId === tx.customerId && o.addressId === tx.addressId && o.createdAt < tx.createdAt && AUTHORIZED.includes(o.status),
  )
  // Declara a constante/variável intel e atribui a ela o resultado da expressão desta linha.
  const intel = intelAt(s, at)
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return {
    at,
    stage,
    customer,
    device,
    address,
    addressUsedBefore,
    merchant,
    sellers,
    amount: tx.amount,
    declaredOrigin: tx.declaredOrigin,
    answers,
    relations: relationsForTx(tx, intel),
    config: s.config,
    unavailable: tx.unavailable,
  }
}

// a função applyDecision. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function applyDecision(s0: DomainState, tx: Transaction, a: Assessment, at: string): DomainState {
  // Declara a constante/variável s e atribui a ela o resultado da expressão desta linha.
  let s = s0
  // Declara a constante/variável base e atribui a ela o resultado da expressão desta linha.
  const base = { correlationId: tx.correlationId, txId: tx.id, at, actor: 'Sistema' as const }
  // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
  for (const r of a.relations) {
    s = emit(s, { ...base, name: 'RelatedCaseFound', service: 'Intelligence Service', lane: 'Intelligence', action: `Relação encontrada: ${r.value}`, result: `${r.association} · ${r.incidentIds.join(', ')}`, tone: r.association === 'forte' ? 'risk' : 'warn' })
  }
  // Declara a constante/variável to e atribui a ela o resultado da expressão desta linha.
  const to = decisionToStatus(a.decision)
  // Declara a constante/variável moved e atribui a ela o resultado da expressão desta linha.
  const moved = moveStatus(s, tx.id, to, at, 'Sistema', a.ruleText)
  s = moved.s
  // Verifica a condição antes de executar o bloco seguinte.
  if (!moved.ok) return s
  // Inicia uma seleção de fluxo baseada no valor da expressão.
  switch (a.decision) {
    // Define um caso possível para o switch.
    case 'APPROVE':
    // Define um caso possível para o switch.
    case 'APPROVE_WITH_ALERT':
      // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
      return emit(s, { ...base, name: 'TransactionAuthorized', service: 'Emissor (simulado)', lane: 'Checkout', action: a.decision === 'APPROVE' ? 'Autorização liberada' : 'Autorização liberada com aviso ao cliente', result: to, tone: a.decision === 'APPROVE' ? 'ok' : 'warn' })
    // Define um caso possível para o switch.
    case 'REQUEST_CONTEXT':
      // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
      return emit(s, { ...base, name: 'ContextRequested', service: 'Protection Service', lane: 'Cliente', action: 'Verificação contextual enviada ao cliente', result: 'CONTEXT_REQUIRED', tone: 'info' })
    // Define um caso possível para o switch.
    case 'INTERVENE':
      // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
      return emit(s, { ...base, name: 'InterventionTriggered', service: 'Protection Service', lane: 'Cliente', action: 'Compra pausada com orientação ao cliente', result: 'INTERVENTION', tone: 'warn' })
    // Define um caso possível para o switch.
    case 'BLOCK': {
      // Declara a constante/variável s2 e atribui a ela o resultado da expressão desta linha.
      const s2 = emit(s, { ...base, name: 'InterventionTriggered', service: 'Protection Service', lane: 'Cliente', action: 'Compra bloqueada por risco muito alto', result: 'BLOCKED', tone: 'risk' })
      // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
      return emit(s2, { ...base, name: 'TransactionCancelled', service: 'Account Service', lane: 'Checkout', action: 'Pedido encerrado sem cobrança', result: 'Sem cobrança', tone: 'neutral' })
    }
  }
}
export function applyOnce(s: DomainState, requestId: string, run: (s: DomainState) => DomainState): { s: DomainState; duplicate: boolean } {
  // Verifica a condição antes de executar o bloco seguinte.
  if (s.processed.includes(requestId)) return { s, duplicate: true }
  // Declara a constante/variável next e atribui a ela o resultado da expressão desta linha.
  const next = run(s)
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return { s: { ...next, processed: [...next.processed, requestId].slice(-300) }, duplicate: false }
}
export function attemptTransition(s0: DomainState, txId: string, to: TxStatus, reason: string): { s: DomainState; ok: boolean } {
  const { s, at } = tick(s0, 1)
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return moveStatus(s, txId, to, at, 'Sistema', reason)
}
export interface PurchaseDraft {
  customerId: string
  deviceId: string
  addressId: string
  merchantId: string
  items?: { productId: string; quantity: number }[]
  description?: string
  amount?: number
  declaredOrigin?: DeclaredOrigin
  installments?: number
  scenario?: ScenarioId
  unavailable?: ProviderId[]
}
export function createTransaction(s0: DomainState, draft: PurchaseDraft, floor?: string): { s: DomainState; txId: string } {
  const { s: s1, at } = tick(s0, 40, floor)
  // Declara a constante/variável seq e atribui a ela o resultado da expressão desta linha.
  const seq = s1.txSeq + 1
  // Declara a constante/variável id e atribui a ela o resultado da expressão desta linha.
  const id = txIdFor(seq)
  // Declara a constante/variável items e atribui a ela o resultado da expressão desta linha.
  const items: TxItem[] = (draft.items ?? []).flatMap((i) => {
    // Declara a constante/variável p e atribui a ela o resultado da expressão desta linha.
    const p = getProductById(i.productId)
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return p ? [{ productId: p.id, name: p.name, sellerId: p.sellerId, quantity: i.quantity, unitPrice: p.price }] : []
  })
  // Declara a constante/variável subtotal e atribui a ela o resultado da expressão desta linha.
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)
  // Declara a constante/variável shipping e atribui a ela o resultado da expressão desta linha.
  const shipping = items.length > 0 ? shippingFor(subtotal) : 0
  // Declara a constante/variável amount e atribui a ela o resultado da expressão desta linha.
  const amount = items.length > 0 ? Math.round((subtotal + shipping) * 100) / 100 : draft.amount ?? 0
  // Declara a constante/variável bySeller e atribui a ela o resultado da expressão desta linha.
  const bySeller = new Map<string, number>()
  // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
  for (const i of items) bySeller.set(i.sellerId, (bySeller.get(i.sellerId) ?? 0) + i.unitPrice * i.quantity)
  // Declara a constante/variável sellerId e atribui a ela o resultado da expressão desta linha.
  const sellerId = [...bySeller.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]
  // Declara a constante/variável card e atribui a ela o resultado da expressão desta linha.
  const card = cardFor(draft.customerId)
  // Declara a constante/variável merchant e atribui a ela o resultado da expressão desta linha.
  const merchant = getMerchant(draft.merchantId)
  // Declara a constante/variável tx e atribui a ela o resultado da expressão desta linha.
  const tx: Transaction = {
    id,
    correlationId: correlationIdFor(seq),
    orderId: merchant?.marketplace ? orderIdFor(seq) : undefined,
    customerId: draft.customerId,
    merchantId: draft.merchantId,
    sellerId,
    cardId: card?.id ?? '',
    deviceId: draft.deviceId,
    addressId: draft.addressId,
    items,
    description: draft.description,
    shipping,
    amount,
    installments: draft.installments ?? 1,
    createdAt: at,
    updatedAt: at,
    status: 'RECEIVED',
    channel: 'E-COMMERCE',
    scenario: draft.scenario,
    declaredOrigin: draft.declaredOrigin,
    assessments: [],
    statusLog: [{ at, to: 'RECEIVED', by: 'Sistema', reason: 'Pedido recebido do checkout' }],
    unavailable: draft.unavailable,
  }
  // Declara a constante/variável s e atribui a ela o resultado da expressão desta linha.
  let s: DomainState = { ...s1, txSeq: seq, transactions: [...s1.transactions, tx] }
  s = emit(s, { name: 'TransactionCreated', at, correlationId: tx.correlationId, txId: id, service: 'Account Service', actor: 'Sistema', lane: 'Checkout', action: merchant?.marketplace ? `Pedido ${tx.orderId} recebido do checkout NEXA` : `Compra recebida de ${merchant?.name ?? 'estabelecimento'}`, result: formatBRL(amount), tone: 'neutral' })
  s = moveStatus(s, id, 'ANALYZING', at, 'Sistema', 'Encaminhada ao Protection Service').s
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return { s, txId: id }
}
export function runInitialAssessment(s0: DomainState, txId: string): DomainState {
  // Declara a constante/variável tx e atribui a ela o resultado da expressão desta linha.
  const tx = findTx(s0, txId)
  // Verifica a condição antes de executar o bloco seguinte.
  if (!tx || tx.status !== 'ANALYZING') return s0
  const { s: s1, at } = tick(s0, 2)
  // Declara a constante/variável a e atribui a ela o resultado da expressão desta linha.
  const a = assess(engineInputFor(s1, tx, 'initial', at))
  // Declara a constante/variável s e atribui a ela o resultado da expressão desta linha.
  let s = patchTx(s1, txId, (t) => ({ ...t, assessments: [...t.assessments, a] }))
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return applyDecision(s, findTx(s, txId) as Transaction, a, at)
}
export function submitVerification(s0: DomainState, txId: string, answers: VerificationAnswers): DomainState {
  // Declara a constante/variável tx e atribui a ela o resultado da expressão desta linha.
  const tx = findTx(s0, txId)
  // Verifica a condição antes de executar o bloco seguinte.
  if (!tx) return s0
  const { s: s1, at } = tick(s0, 52)
  // Verifica a condição antes de executar o bloco seguinte.
  if (tx.status !== 'CONTEXT_REQUIRED') {
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return { ...s1, rejections: [...s1.rejections, { at, txId, from: tx.status, to: tx.status, reason: 'Respostas recebidas depois que a transação já tinha saído de CONTEXT_REQUIRED (evento atrasado ignorado)' }] }
  }
  // Declara a constante/variável s e atribui a ela o resultado da expressão desta linha.
  let s = patchTx(s1, txId, (t) => ({ ...t, verification: { answers, at } }))
  // Declara a constante/variável flagged e atribui a ela o resultado da expressão desta linha.
  const flagged = answers.origin === 'asked' || answers.contact !== 'no' || answers.address === 'given'
  s = emit(s, { name: 'ContextCompleted', at, correlationId: tx.correlationId, txId, service: 'Protection Service', actor: 'Cliente', lane: 'Cliente', action: 'Cliente respondeu a verificação (3 perguntas)', result: flagged ? 'Indica orientação de terceiro' : 'Sem sinais de orientação', tone: flagged ? 'warn' : 'ok' })
  // Declara a constante/variável current e atribui a ela o resultado da expressão desta linha.
  const current = findTx(s, txId) as Transaction
  // Declara a constante/variável a e atribui a ela o resultado da expressão desta linha.
  const a = assess(engineInputFor(s, current, 'recalculated', at, answers))
  s = patchTx(s, txId, (t) => ({ ...t, assessments: [...t.assessments, a] }))
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return applyDecision(s, findTx(s, txId) as Transaction, a, at)
}
export function resolveIntervention(s0: DomainState, txId: string, choice: 'cancel' | 'continue'): DomainState {
  // Declara a constante/variável tx e atribui a ela o resultado da expressão desta linha.
  const tx = findTx(s0, txId)
  // Verifica a condição antes de executar o bloco seguinte.
  if (!tx) return s0
  const { s: s1, at } = tick(s0, 38)
  // Declara a constante/variável base e atribui a ela o resultado da expressão desta linha.
  const base = { at, correlationId: tx.correlationId, txId }
  // Verifica a condição antes de executar o bloco seguinte.
  if (choice === 'cancel') {
    // Declara a constante/variável moved e atribui a ela o resultado da expressão desta linha.
    const moved = moveStatus(s1, txId, 'CANCELLED', at, 'Cliente', 'Cliente interrompeu a compra')
    // Verifica a condição antes de executar o bloco seguinte.
    if (!moved.ok) return moved.s
    // Declara a constante/variável s e atribui a ela o resultado da expressão desta linha.
    const s = patchTx(moved.s, txId, (t) => ({ ...t, interventionChoice: 'cancelled' }))
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return emit(s, { ...base, name: 'TransactionCancelled', service: 'Account Service', actor: 'Cliente', lane: 'Cliente', action: 'Cliente interrompeu a compra', result: 'Sem cobrança', tone: 'ok' })
  }
  // Declara a constante/variável moved e atribui a ela o resultado da expressão desta linha.
  const moved = moveStatus(s1, txId, 'APPROVED_WITH_ALERT', at, 'Cliente', 'Cliente confirmou a compra após o alerta (confirmação reforçada)')
  // Verifica a condição antes de executar o bloco seguinte.
  if (!moved.ok) return moved.s
  // Declara a constante/variável s e atribui a ela o resultado da expressão desta linha.
  const s = patchTx(moved.s, txId, (t) => ({ ...t, interventionChoice: 'continued' }))
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return emit(s, { ...base, name: 'TransactionAuthorized', service: 'Emissor (simulado)', actor: 'Cliente', lane: 'Checkout', action: 'Cliente confirmou a compra depois do alerta', result: 'APPROVED_WITH_ALERT', tone: 'warn' })
}
export function abandonVerification(s0: DomainState, txId: string): DomainState {
  // Declara a constante/variável tx e atribui a ela o resultado da expressão desta linha.
  const tx = findTx(s0, txId)
  // Verifica a condição antes de executar o bloco seguinte.
  if (!tx) return s0
  const { s: s1, at } = tick(s0, 20)
  // Declara a constante/variável moved e atribui a ela o resultado da expressão desta linha.
  const moved = moveStatus(s1, txId, 'CANCELLED', at, 'Cliente', 'Cliente desistiu durante a verificação')
  // Verifica a condição antes de executar o bloco seguinte.
  if (!moved.ok) return moved.s
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return emit(moved.s, { at, correlationId: tx.correlationId, txId, name: 'TransactionCancelled', service: 'Account Service', actor: 'Cliente', lane: 'Cliente', action: 'Cliente desistiu durante a verificação', result: 'Sem cobrança', tone: 'ok' })
}
export interface IncidentDraft {
  customerId: string
  txId?: string
  type: IncidentType
  channel: IncidentChannel
  contactHandle?: string
  contactLink?: string
  destinationText?: string
  description: string
  occurredAt: string
  consent: boolean
}
export function fileIncident(s0: DomainState, draft: IncidentDraft, floor?: string, minutesAfter = 19): { s: DomainState; incidentId: string } {
  const { s: s1, at } = tick(s0, minutesAfter * 60, floor)
  // Declara a constante/variável seq e atribui a ela o resultado da expressão desta linha.
  const seq = s1.incidentSeq + 1
  // Declara a constante/variável id e atribui a ela o resultado da expressão desta linha.
  const id = incidentIdFor(seq)
  // Declara a constante/variável tx e atribui a ela o resultado da expressão desta linha.
  const tx = findTx(s1, draft.txId)
  // Declara a constante/variável before e atribui a ela o resultado da expressão desta linha.
  const before = intelAt(s1)
  // Declara a constante/variável incident e atribui a ela o resultado da expressão desta linha.
  const incident: Incident = {
    id,
    customerId: draft.customerId,
    txId: tx?.id,
    correlationId: tx?.correlationId,
    type: draft.type,
    channel: draft.channel,
    contactHandle: draft.contactHandle?.trim() || undefined,
    contactLink: draft.contactLink?.trim() || undefined,
    destinationText: draft.destinationText?.trim() || undefined,
    description: draft.description.trim(),
    occurredAt: draft.occurredAt,
    createdAt: at,
    status: 'RECEIVED',
    consent: draft.consent,
    history: [{ at, label: 'Relato registrado pelo cliente', actor: 'Cliente' }],
  }
  // Declara a constante/variável s e atribui a ela o resultado da expressão desta linha.
  let s: DomainState = { ...s1, incidentSeq: seq, incidents: [...s1.incidents, incident] }
  // Declara a constante/variável corr e atribui a ela o resultado da expressão desta linha.
  const corr = tx?.correlationId
  s = emit(s, { name: 'IncidentConfirmed', at, correlationId: corr, txId: tx?.id, incidentId: id, service: 'Incident Service', actor: 'Cliente', lane: 'Cliente', action: `Relato registrado: ${incidentTypeShort[draft.type]}`, result: `Protocolo ${id}`, tone: 'info' })

  // Verifica a condição antes de executar o bloco seguinte.
  if (tx && (tx.status === 'APPROVED' || tx.status === 'APPROVED_WITH_ALERT')) {
    s = moveStatus(s, tx.id, 'INCIDENT_RECORDED', at, 'Cliente', `Relato ${id} vinculado à compra`).s
  }

  // Declara a constante/variável after e atribui a ela o resultado da expressão desta linha.
  const after = intelAt(s)
  // Declara a constante/variável extracted e atribui a ela o resultado da expressão desta linha.
  const extracted = after.incidentEntities.get(id) ?? []
  s = patchIncident(s, id, (i) => ({ ...i, history: [...i.history, { at, label: extracted.length ? `${extracted.length} elementos extraídos do relato` : 'Nenhum elemento identificável no relato', actor: 'Sistema' }] }))

  // Declara a constante/variável pattern e atribui a ela o resultado da expressão desta linha.
  const pattern = patternForIncident(after, id)
  // Verifica a condição antes de executar o bloco seguinte.
  if (pattern) {
    // Declara a constante/variável prev e atribui a ela o resultado da expressão desta linha.
    const prev = before.patterns.find((p) => p.id === pattern.id)
    s = emit(s, { name: 'PatternUpdated', at, correlationId: corr, incidentId: id, service: 'Intelligence Service', actor: 'Sistema', lane: 'Intelligence', action: `${id} ligado a ${pattern.id}${pattern.mergedFrom.length ? ` (incorpora ${pattern.mergedFrom.join(', ')})` : ''}`, result: `${pattern.incidentIds.length} relatos · ${pattern.status}`, tone: 'info' })
    // Declara a constante/variável others e atribui a ela o resultado da expressão desta linha.
    const others = pattern.incidentIds.filter((x) => x !== id)
    // Verifica a condição antes de executar o bloco seguinte.
    if (others.length > 0) {
      s = patchIncident(s, id, (i) => ({ ...i, status: 'RELATED', history: [...i.history, { at, label: `Relacionado a ${others.join(', ')} (${pattern.id})`, actor: 'Sistema' }] }))
      // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
      for (const o of others) {
        // Declara a constante/variável inc e atribui a ela o resultado da expressão desta linha.
        const inc = findIncident(s, o)
        // Verifica a condição antes de executar o bloco seguinte.
        if (!inc || inc.status === 'CLOSED' || inc.status === 'RELATED') continue
        s = patchIncident(s, o, (i) => ({ ...i, status: 'RELATED', history: [...i.history, { at, label: `Relacionado ao novo relato ${id} (${pattern.id})`, actor: 'Sistema' }] }))
      }
    }
    // Verifica a condição antes de executar o bloco seguinte.
    if (pattern.status === 'Possível campanha' && prev?.status !== 'Possível campanha') {
      s = emit(s, { name: 'CampaignDetected', at, correlationId: corr, incidentId: id, service: 'Intelligence Service', actor: 'Sistema', lane: 'Intelligence', action: `${pattern.id} passa a ser tratado como possível campanha`, result: `${pattern.customerIds.length} clientes · ${pattern.incidentIds.length} relatos`, tone: 'risk' })
    }
    // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
    for (const attempt of pattern.txIds) {
      // Declara a constante/variável t e atribui a ela o resultado da expressão desta linha.
      const t = findTx(s, attempt)
      // Verifica a condição antes de executar o bloco seguinte.
      if (!t || t.id === tx?.id || t.customerId === draft.customerId) continue
      // Verifica a condição antes de executar o bloco seguinte.
      if (pattern.incidentIds.some((iid) => findIncident(s, iid)?.txId === t.id)) continue
      // Verifica a condição antes de executar o bloco seguinte.
      if (before.patterns.some((p) => p.txIds.includes(t.id))) continue
      s = emit(s, { name: 'RelatedCaseFound', at, correlationId: t.correlationId, txId: t.id, incidentId: id, service: 'Intelligence Service', actor: 'Sistema', lane: 'Intelligence', action: `Compra anterior ${t.id} compartilha elementos com ${id}`, result: 'Relação retrospectiva · sem alteração de status', tone: 'warn' })
    }
  }
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return { s, incidentId: id }
}
export function assignCase(s0: DomainState, incidentId: string, floor?: string): DomainState {
  // Declara a constante/variável inc e atribui a ela o resultado da expressão desta linha.
  const inc = findIncident(s0, incidentId)
  // Verifica a condição antes de executar o bloco seguinte.
  if (!inc || inc.status === 'CLOSED' || inc.history.some((h) => h.label.startsWith('Caso assumido'))) return s0
  const { s: s1, at } = tick(s0, 6 * 60, floor)
  // Declara a constante/variável s e atribui a ela o resultado da expressão desta linha.
  let s = patchIncident(s1, incidentId, (i) => ({ ...i, status: i.status === 'RECEIVED' ? 'IN_REVIEW' : i.status, history: [...i.history, { at, label: `Caso assumido por ${ANALYST}`, actor: ANALYST }] }))
  s = emit(s, { name: 'CaseAssigned', at, correlationId: inc.correlationId, txId: inc.txId, incidentId, service: 'Incident Service', actor: 'Analista', actorName: ANALYST, lane: 'Operations', action: 'Caso assumido para análise', result: 'IN_REVIEW', tone: 'info' })
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return s
}
export function closeCase(s0: DomainState, incidentId: string, as: 'resolved' | 'not-scam', note: string, floor?: string): DomainState {
  // Declara a constante/variável inc e atribui a ela o resultado da expressão desta linha.
  const inc = findIncident(s0, incidentId)
  // Verifica a condição antes de executar o bloco seguinte.
  if (!inc || inc.status === 'CLOSED') return s0
  const { s: s1, at } = tick(s0, 10 * 60, floor)
  // Declara a constante/variável s e atribui a ela o resultado da expressão desta linha.
  let s = patchIncident(s1, incidentId, (i) => ({ ...i, status: 'CLOSED', closedAs: as, history: [...i.history, { at, label: `Caso encerrado: ${note}`, actor: ANALYST }] }))
  s = emit(s, { name: 'CaseClosed', at, correlationId: inc.correlationId, txId: inc.txId, incidentId, service: 'Incident Service', actor: 'Analista', actorName: ANALYST, lane: 'Operations', action: as === 'not-scam' ? 'Encerrado sem relação com golpe' : 'Encerrado como golpe confirmado', result: 'CLOSED', tone: 'neutral' })
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return s
}
export function setFlag(s0: DomainState, flag: FlagId, value: boolean): DomainState {
  // Verifica a condição antes de executar o bloco seguinte.
  if (s0.config.flags[flag] === value) return s0
  const { s: s1, at } = tick(s0, 5)
  // Declara a constante/variável s e atribui a ela o resultado da expressão desta linha.
  const s = { ...s1, config: { ...s1.config, flags: { ...s1.config.flags, [flag]: value } } }
  // Declara a constante/variável label e atribui a ela o resultado da expressão desta linha.
  const label = flagSpecs.find((f) => f.id === flag)?.label ?? flag
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return emit(s, { name: 'PolicyUpdated', at, service: 'Protection Service', actor: 'Analista', actorName: ANALYST, lane: 'Operations', action: `Flag “${label}” ${value ? 'ativada' : 'desativada'}`, result: value ? 'ON' : 'OFF', tone: 'info' })
}
export function setProvider(s0: DomainState, provider: ProviderId, status: ProviderStatus): DomainState {
  // Verifica a condição antes de executar o bloco seguinte.
  if (s0.config.providers[provider] === status) return s0
  const { s: s1, at } = tick(s0, 5)
  // Declara a constante/variável s e atribui a ela o resultado da expressão desta linha.
  const s = { ...s1, config: { ...s1.config, providers: { ...s1.config.providers, [provider]: status } } }
  // Declara a constante/variável label e atribui a ela o resultado da expressão desta linha.
  const label = providerSpecs.find((p) => p.id === provider)?.label ?? provider
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return emit(s, { name: 'PolicyUpdated', at, service: 'Protection Service', actor: 'Analista', actorName: ANALYST, lane: 'Operations', action: `Provedor “${label}” ${status === 'up' ? 'disponível' : 'marcado como indisponível (modo degradado)'}`, result: status === 'up' ? 'UP' : 'DOWN', tone: status === 'up' ? 'ok' : 'warn' })
}

// a constante/variável seedCache e atribui a ela o resultado da expressão desta linha.
let seedCache: DomainState | undefined
export function buildSeedState(): DomainState {
  // Verifica a condição antes de executar o bloco seguinte.
  if (seedCache) return seedCache
  // Declara a constante/variável s e atribui a ela o resultado da expressão desta linha.
  let s = emptyState()
  // Define um tipo/interface TypeScript. Esta parte serve para tipagem em desenvolvimento e não vira lógica JavaScript em runtime.
  type Step = { at: string; run: (st: DomainState) => DomainState }
  // Declara a constante/variável steps e atribui a ela o resultado da expressão desta linha.
  const steps: Step[] = []
  // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
  for (const p of seedPurchases) {
    steps.push({
      at: p.at,
      run: (st) => {
        // Declara a constante/variável before e atribui a ela o resultado da expressão desta linha.
        const before = { ...st, txSeq: p.seq - 1, clock: addSeconds(p.at, -40) }
        const { s: created, txId } = createTransaction(before, {
          customerId: p.customerId,
          deviceId: p.deviceId,
          addressId: p.addressId,
          merchantId: p.merchantId,
          items: p.items,
          description: p.description,
          amount: p.amount,
          declaredOrigin: p.declaredOrigin,
          unavailable: p.providersDown,
        })
        // Declara a constante/variável next e atribui a ela o resultado da expressão desta linha.
        let next = runInitialAssessment(created, txId)
        // Verifica a condição antes de executar o bloco seguinte.
        if (p.answers && findTx(next, txId)?.status === 'CONTEXT_REQUIRED') next = submitVerification(next, txId, p.answers)
        // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
        return next
      },
    })
  }
  // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
  for (const r of seedReports) {
    steps.push({
      at: r.at,
      run: (st) => {
        // Declara a constante/variável before e atribui a ela o resultado da expressão desta linha.
        const before = { ...st, incidentSeq: r.seq - 1, clock: r.at }
        const { s: filed, incidentId } = fileIncident(
          before,
          {
            customerId: r.customerId,
            txId: txIdFor(r.txSeq),
            type: r.type,
            channel: r.channel,
            contactHandle: r.contactHandle,
            contactLink: r.contactLink,
            destinationText: r.destinationText,
            description: r.description,
            occurredAt: r.occurredAt,
            consent: true,
          },
          r.at,
          0,
        )
        // Declara a constante/variável next e atribui a ela o resultado da expressão desta linha.
        let next = r.assignedAt ? assignCase(filed, incidentId, r.assignedAt) : filed
        // Verifica a condição antes de executar o bloco seguinte.
        if (r.closedAt) next = closeCase(next, incidentId, 'not-scam', r.closeNote ?? 'Sem relação com golpe', r.closedAt)
        // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
        return next
      },
    })
  }
  steps.sort((a, b) => a.at.localeCompare(b.at))
  // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
  for (const step of steps) s = step.run(s)
  seedCache = { ...s, txSeq: TX_SEQ_BASELINE, incidentSeq: INCIDENT_SEQ_BASELINE, clock: later(s.clock, '2026-09-28T11:52:00'), processed: [] }
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return seedCache
}
export function draftFromScenario(id: ScenarioId, overrides?: Partial<PurchaseDraft>): PurchaseDraft {
  // Declara a constante/variável sc e atribui a ela o resultado da expressão desta linha.
  const sc = getScenario(id)
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return {
    customerId: sc.customerId,
    deviceId: sc.deviceId,
    addressId: sc.addressId,
    merchantId: 'MER-001',
    items: sc.cart,
    declaredOrigin: sc.declaredOrigin,
    installments: 10,
    scenario: id,
    ...overrides,
  }
}
export function runScenario(s0: DomainState, id: ScenarioId, opts?: { answers?: VerificationAnswers; choice?: 'cancel' | 'continue'; draft?: Partial<PurchaseDraft> }) {
  // Declara a constante/variável sc e atribui a ela o resultado da expressão desta linha.
  const sc = getScenario(id)
  const { s: created, txId } = createTransaction(s0, draftFromScenario(id, opts?.draft), sc.canonicalAt)
  // Declara a constante/variável s e atribui a ela o resultado da expressão desta linha.
  let s = runInitialAssessment(created, txId)
  // Verifica a condição antes de executar o bloco seguinte.
  if (findTx(s, txId)?.status === 'CONTEXT_REQUIRED') s = submitVerification(s, txId, opts?.answers ?? sc.answers)
  // Verifica a condição antes de executar o bloco seguinte.
  if (findTx(s, txId)?.status === 'INTERVENTION' && opts?.choice) s = resolveIntervention(s, txId, opts.choice)
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return { s, txId }
}
export function loadStory(s0: DomainState): DomainState {
  // Declara a constante/variável s e atribui a ela o resultado da expressão desta linha.
  let s = s0
  // Declara a constante/variável anaTx e atribui a ela o resultado da expressão desta linha.
  let anaTx = s.transactions.find((t) => t.scenario === 'induction')
  // Verifica a condição antes de executar o bloco seguinte.
  if (!anaTx) {
    // Declara a constante/variável r e atribui a ela o resultado da expressão desta linha.
    const r = runScenario(s, 'induction', { choice: 'cancel' })
    s = r.s
    anaTx = findTx(s, r.txId)
  // Caso a condição anterior não seja atendida, executa o caminho alternativo.
  } else {
    // Verifica a condição antes de executar o bloco seguinte.
    if (anaTx.status === 'CONTEXT_REQUIRED') s = submitVerification(s, anaTx.id, getScenario('induction').answers)
    // Verifica a condição antes de executar o bloco seguinte.
    if (findTx(s, anaTx.id)?.status === 'INTERVENTION') s = resolveIntervention(s, anaTx.id, 'cancel')
  }
  // Verifica a condição antes de executar o bloco seguinte.
  if (anaTx && !s.incidents.some((i) => i.txId === anaTx?.id)) {
    // Declara a constante/variável tpl e atribui a ela o resultado da expressão desta linha.
    const tpl = getScenario('induction').incidentTemplate
    // Verifica a condição antes de executar o bloco seguinte.
    if (tpl) {
      // Declara a constante/variável r e atribui a ela o resultado da expressão desta linha.
      const r = fileIncident(s, { customerId: anaTx.customerId, txId: anaTx.id, consent: true, ...tpl }, '2026-09-28T14:52:07')
      s = assignCase(r.s, r.incidentId)
    }
  }
  // Declara a constante/variável mariana e atribui a ela o resultado da expressão desta linha.
  const mariana = s.transactions.find((t) => t.scenario === 'related' && t.createdAt > (s.incidents.find((i) => i.txId === anaTx?.id)?.createdAt ?? ''))
  // Verifica a condição antes de executar o bloco seguinte.
  if (!mariana) s = runScenario(s, 'related', { choice: 'cancel' }).s
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return s
}
