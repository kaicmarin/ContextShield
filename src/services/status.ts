import type { Decision, Transaction, TxStatus } from '../types/domain'
export const transitions: Record<TxStatus, TxStatus[]> = {
  RECEIVED: ['ANALYZING', 'CANCELLED'],
  ANALYZING: ['APPROVED', 'APPROVED_WITH_ALERT', 'CONTEXT_REQUIRED', 'INTERVENTION', 'BLOCKED'],
  CONTEXT_REQUIRED: ['APPROVED', 'APPROVED_WITH_ALERT', 'INTERVENTION', 'BLOCKED', 'CANCELLED'],
  INTERVENTION: ['APPROVED_WITH_ALERT', 'CANCELLED', 'BLOCKED'],
  APPROVED: ['INCIDENT_RECORDED'],
  APPROVED_WITH_ALERT: ['INCIDENT_RECORDED'],
  BLOCKED: [],
  CANCELLED: [],
  INCIDENT_RECORDED: [],
}
export const TERMINAL: TxStatus[] = ['BLOCKED', 'CANCELLED', 'INCIDENT_RECORDED']
export const AWAITING_CUSTOMER: TxStatus[] = ['CONTEXT_REQUIRED', 'INTERVENTION']
export const AUTHORIZED: TxStatus[] = ['APPROVED', 'APPROVED_WITH_ALERT', 'INCIDENT_RECORDED']
export const isTerminal = (s: TxStatus) => TERMINAL.includes(s)
export const isAwaitingCustomer = (s: TxStatus) => AWAITING_CUSTOMER.includes(s)
export function decisionToStatus(d: Decision): TxStatus {
  // Inicia uma seleção de fluxo baseada no valor da expressão.
  switch (d) {
    // Define um caso possível para o switch.
    case 'APPROVE':
      // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
      return 'APPROVED'
    // Define um caso possível para o switch.
    case 'APPROVE_WITH_ALERT':
      // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
      return 'APPROVED_WITH_ALERT'
    // Define um caso possível para o switch.
    case 'REQUEST_CONTEXT':
      // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
      return 'CONTEXT_REQUIRED'
    // Define um caso possível para o switch.
    case 'INTERVENE':
      // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
      return 'INTERVENTION'
    // Define um caso possível para o switch.
    case 'BLOCK':
      // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
      return 'BLOCKED'
  }
}
export type TransitionCheck = { ok: true } | { ok: false; reason: string }
export function checkTransition(tx: Pick<Transaction, 'status' | 'verification' | 'assessments'>, to: TxStatus): TransitionCheck {
  // Declara a constante/variável from e atribui a ela o resultado da expressão desta linha.
  const from = tx.status
  // Verifica a condição antes de executar o bloco seguinte.
  if (from === to) return { ok: false, reason: `Já está em ${to} (evento repetido)` }
  // Verifica a condição antes de executar o bloco seguinte.
  if (!transitions[from].includes(to)) {
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return { ok: false, reason: isTerminal(from) ? `${from} é final; ${to} não pode reabrir a transação` : `Transição ${from} → ${to} não existe` }
  }
  // Verifica a condição antes de executar o bloco seguinte.
  if (from === 'CONTEXT_REQUIRED' && (to === 'APPROVED' || to === 'APPROVED_WITH_ALERT')) {
    // Verifica a condição antes de executar o bloco seguinte.
    if (!tx.verification) return { ok: false, reason: 'Aprovação após contexto exige verificação concluída' }
    // Declara a constante/variável last e atribui a ela o resultado da expressão desta linha.
    const last = tx.assessments[tx.assessments.length - 1]
    // Verifica a condição antes de executar o bloco seguinte.
    if (!last || last.stage !== 'recalculated') return { ok: false, reason: 'Aprovação após contexto exige risco recalculado' }
    // Verifica a condição antes de executar o bloco seguinte.
    if (to === 'APPROVED' && last.band !== 'LOW') return { ok: false, reason: 'Aprovação direta exige risco recalculado baixo' }
  }
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return { ok: true }
}
export function checkoutPathFor(tx: Pick<Transaction, 'id' | 'status'>): string {
  // Declara a constante/variável q e atribui a ela o resultado da expressão desta linha.
  const q = `?tx=${tx.id}`
  // Inicia uma seleção de fluxo baseada no valor da expressão.
  switch (tx.status) {
    // Define um caso possível para o switch.
    case 'RECEIVED':
    // Define um caso possível para o switch.
    case 'ANALYZING':
      // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
      return `/store/checkout/analysis${q}`
    // Define um caso possível para o switch.
    case 'CONTEXT_REQUIRED':
      // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
      return `/store/checkout/verification${q}`
    // Define um caso possível para o switch.
    case 'INTERVENTION':
      // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
      return `/store/checkout/attention${q}`
    // Define um caso possível para o switch.
    case 'APPROVED':
    // Define um caso possível para o switch.
    case 'APPROVED_WITH_ALERT':
    // Define um caso possível para o switch.
    case 'INCIDENT_RECORDED':
      // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
      return `/store/checkout/approved${q}`
    // Define um caso possível para o switch.
    case 'BLOCKED':
      // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
      return `/store/checkout/interrupted${q}&reason=blocked`
    // Define um caso possível para o switch.
    case 'CANCELLED':
      // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
      return `/store/checkout/interrupted${q}&reason=customer`
  }
}
