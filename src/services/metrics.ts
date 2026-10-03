import type { Decision, EngineConfig, Transaction } from '../types/domain'
import type { DomainState } from './pipeline'
import type { IntelSnapshot } from './intel'
import { certificate, type Robustness } from './robustness'
import { latestAssessment } from './present'
import { AUTHORIZED } from './status'
export interface DayBucket {
  day: string
  total: number
  approve: number
  alert: number
  protect: number
}
export interface OpsMetrics {
  day: string
  total: number
  today: number
  byDecision: Record<Decision, number>
  pendingCustomer: number
  protectedAmount: number
  protectedCount: number
  authorizedRate: number
  frictionRate: number
  avgEngineMs: number
  p95EngineMs: number
  openIncidents: number
  incidentsTotal: number
  campaigns: number
  patterns: number
  degradedDecisions: number
  rejections: number
  robustness: Record<Robustness, number>
  days: DayBucket[]
  events: number
}

// a constante/variável emptyDecisions e atribui a ela o resultado da expressão desta linha.
const emptyDecisions = (): Record<Decision, number> => ({ APPROVE: 0, APPROVE_WITH_ALERT: 0, REQUEST_CONTEXT: 0, INTERVENE: 0, BLOCK: 0 })
export function robustnessFor(tx: Transaction, config: EngineConfig): Robustness | undefined {
  // Declara a constante/variável a e atribui a ela o resultado da expressão desta linha.
  const a = latestAssessment(tx)
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return a ? certificate(a, config).status : undefined
}
export function computeMetrics(s: DomainState, intel: IntelSnapshot): OpsMetrics {
  // Declara a constante/variável day e atribui a ela o resultado da expressão desta linha.
  const day = s.clock.slice(0, 10)
  // Declara a constante/variável txs e atribui a ela o resultado da expressão desta linha.
  const txs = s.transactions.filter((t) => t.assessments.length > 0)
  // Declara a constante/variável byDecision e atribui a ela o resultado da expressão desta linha.
  const byDecision = emptyDecisions()
  // Declara a constante/variável robustness e atribui a ela o resultado da expressão desta linha.
  const robustness: Record<Robustness, number> = { ROBUST: 0, DEGRADED: 0, FRAGILE: 0, INCONCLUSIVE: 0 }
  // Declara a constante/variável durations e atribui a ela o resultado da expressão desta linha.
  const durations: number[] = []
  // Declara a constante/variável protectedAmount e atribui a ela o resultado da expressão desta linha.
  let protectedAmount = 0
  // Declara a constante/variável protectedCount e atribui a ela o resultado da expressão desta linha.
  let protectedCount = 0
  // Declara a constante/variável friction e atribui a ela o resultado da expressão desta linha.
  let friction = 0
  // Declara a constante/variável degradedDecisions e atribui a ela o resultado da expressão desta linha.
  let degradedDecisions = 0

  // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
  for (const t of txs) {
    // Declara a constante/variável a e atribui a ela o resultado da expressão desta linha.
    const a = latestAssessment(t)
    // Verifica a condição antes de executar o bloco seguinte.
    if (!a) continue
    byDecision[a.decision] += 1
    robustness[certificate(a, s.config).status] += 1
    // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
    for (const x of t.assessments) durations.push(x.durationMs)
    // Verifica a condição antes de executar o bloco seguinte.
    if (t.assessments.some((x) => x.decision !== 'APPROVE')) friction += 1
    // Verifica a condição antes de executar o bloco seguinte.
    if (a.degraded.length > 0) degradedDecisions += 1
    // Verifica a condição antes de executar o bloco seguinte.
    if (t.status === 'BLOCKED' || (t.status === 'CANCELLED' && t.assessments.some((x) => x.decision === 'INTERVENE' || x.decision === 'REQUEST_CONTEXT'))) {
      protectedAmount += t.amount
      protectedCount += 1
    }
  }

  durations.sort((x, y) => x - y)
  // Declara a constante/variável avg e atribui a ela o resultado da expressão desta linha.
  const avg = durations.length ? durations.reduce((x, y) => x + y, 0) / durations.length : 0
  // Declara a constante/variável p95 e atribui a ela o resultado da expressão desta linha.
  const p95 = durations.length ? durations[Math.min(durations.length - 1, Math.floor(durations.length * 0.95))] : 0

  // Declara a constante/variável days e atribui a ela o resultado da expressão desta linha.
  const days: DayBucket[] = []
  // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
  for (let i = 6; i >= 0; i -= 1) {
    // Declara a constante/variável d e atribui a ela o resultado da expressão desta linha.
    const d = new Date(`${day}T12:00:00`)
    d.setDate(d.getDate() - i)
    // Declara a constante/variável key e atribui a ela o resultado da expressão desta linha.
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    // Declara a constante/variável list e atribui a ela o resultado da expressão desta linha.
    const list = txs.filter((t) => t.createdAt.startsWith(key))
    // Declara a constante/variável dec e atribui a ela o resultado da expressão desta linha.
    const dec = (t: Transaction) => latestAssessment(t)?.decision
    days.push({
      day: key,
      total: list.length,
      approve: list.filter((t) => dec(t) === 'APPROVE').length,
      alert: list.filter((t) => dec(t) === 'APPROVE_WITH_ALERT').length,
      protect: list.filter((t) => {
        // Declara a constante/variável d2 e atribui a ela o resultado da expressão desta linha.
        const d2 = dec(t)
        // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
        return d2 === 'REQUEST_CONTEXT' || d2 === 'INTERVENE' || d2 === 'BLOCK'
      }).length,
    })
  }

  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return {
    day,
    total: txs.length,
    today: txs.filter((t) => t.createdAt.startsWith(day)).length,
    byDecision,
    pendingCustomer: txs.filter((t) => t.status === 'CONTEXT_REQUIRED' || t.status === 'INTERVENTION').length,
    protectedAmount,
    protectedCount,
    authorizedRate: txs.length ? Math.round((txs.filter((t) => AUTHORIZED.includes(t.status) || t.status === 'INCIDENT_RECORDED').length / txs.length) * 100) : 0,
    frictionRate: txs.length ? Math.round((friction / txs.length) * 100) : 0,
    avgEngineMs: avg,
    p95EngineMs: p95,
    openIncidents: s.incidents.filter((i) => i.status !== 'CLOSED').length,
    incidentsTotal: s.incidents.length,
    campaigns: intel.patterns.filter((p) => p.status === 'Possível campanha').length,
    patterns: intel.patterns.length,
    degradedDecisions,
    rejections: s.rejections.length,
    robustness,
    days,
    events: s.events.length,
  }
}
