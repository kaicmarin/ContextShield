import type { Assessment, Card, Transaction, TxStatus } from '../types/domain'
import type { Tone } from './labels'
import { TX_SEQ_BASELINE, seqOf } from '../mocks/ids'
import { getMerchant } from '../mocks/merchants'
import { getSeller } from '../mocks/sellers'
import { getProductById } from '../mocks/products'
import { addSeconds } from '../utils/format'
export const latestAssessment = (tx: Transaction | undefined): Assessment | undefined => tx?.assessments.at(-1)
export const initialAssessment = (tx: Transaction | undefined): Assessment | undefined => tx?.assessments[0]
export function txTitle(tx: Transaction): string {
  // Declara a constante/variável first e atribui a ela o resultado da expressão desta linha.
  const first = tx.items[0]
  // Verifica a condição antes de executar o bloco seguinte.
  if (!first) return tx.description ?? getMerchant(tx.merchantId)?.name ?? 'Compra'
  // Declara a constante/variável extra e atribui a ela o resultado da expressão desta linha.
  const extra = tx.items.reduce((n, i) => n + i.quantity, 0) - first.quantity
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return extra > 0 ? `${first.name} + ${extra} ${extra === 1 ? 'item' : 'itens'}` : first.name
}
export function txMerchantLabel(tx: Transaction): string {
  // Declara a constante/variável m e atribui a ela o resultado da expressão desta linha.
  const m = getMerchant(tx.merchantId)
  // Verifica a condição antes de executar o bloco seguinte.
  if (!m) return '—'
  // Declara a constante/variável seller e atribui a ela o resultado da expressão desta linha.
  const seller = tx.sellerId ? getSeller(tx.sellerId) : undefined
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return m.marketplace && seller ? `${m.name} · ${seller.name}` : m.name
}
export function statementName(tx: Transaction): string {
  // Declara a constante/variável m e atribui a ela o resultado da expressão desta linha.
  const m = getMerchant(tx.merchantId)
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (m?.marketplace ? `${m.name}*${getSeller(tx.sellerId ?? '')?.name.split(' ')[0] ?? 'PEDIDO'}` : m?.name ?? 'COMPRA').toUpperCase()
}

export function txProductKind(tx: Transaction) {
  return getProductById(tx.items[0]?.productId ?? '')?.kind
}

export type OrderPhase = 'pending' | 'paid' | 'stopped'

export const orderStatusMeta: Record<TxStatus, { label: string; tone: Tone; phase: OrderPhase }> = {
  RECEIVED: { label: 'Processando pagamento', tone: 'neutral', phase: 'pending' },
  ANALYZING: { label: 'Processando pagamento', tone: 'neutral', phase: 'pending' },
  CONTEXT_REQUIRED: { label: 'Aguardando confirmação do pagamento', tone: 'info', phase: 'pending' },
  INTERVENTION: { label: 'Pagamento pausado pelo emissor', tone: 'warn', phase: 'pending' },
  APPROVED: { label: 'Pagamento aprovado', tone: 'ok', phase: 'paid' },
  APPROVED_WITH_ALERT: { label: 'Pagamento aprovado', tone: 'ok', phase: 'paid' },
  INCIDENT_RECORDED: { label: 'Em contestação', tone: 'warn', phase: 'paid' },
  BLOCKED: { label: 'Pagamento não autorizado', tone: 'neutral', phase: 'stopped' },
  CANCELLED: { label: 'Cancelado · sem cobrança', tone: 'neutral', phase: 'stopped' },
}

const AUTHORIZED_STATUSES: TxStatus[] = ['APPROVED', 'APPROVED_WITH_ALERT', 'INCIDENT_RECORDED']

export function availableLimit(card: Card, transactions: Transaction[]): number {
  const spent = transactions
    .filter((t) => t.cardId === card.id && seqOf(t.id) > TX_SEQ_BASELINE && AUTHORIZED_STATUSES.includes(t.status))
    .reduce((sum, t) => sum + t.amount, 0)
  return Math.max(0, card.available - spent)
}

export function currentStatement(card: Card, transactions: Transaction[], now: string) {
  const month = now.slice(0, 7)
  const items = transactions.filter((t) => t.cardId === card.id && t.createdAt.startsWith(month) && AUTHORIZED_STATUSES.includes(t.status))
  return { items, total: items.reduce((sum, t) => sum + t.amount, 0) }
}

export function deliveryEstimate(tx: Transaction): string {
  const days = Math.max(1, ...tx.items.map((i) => getProductById(i.productId)?.deliveryDays ?? 3))
  let at = tx.createdAt
  let left = days
  while (left > 0) {
    at = addSeconds(at, 86_400)
    const weekday = new Date(at).getDay()
    if (weekday !== 0 && weekday !== 6) left -= 1
  }
  return at
}
