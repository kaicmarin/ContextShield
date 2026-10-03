import type {
  Address,
  Assessment,
  AssessmentStage,
  Customer,
  Decision,
  DeclaredOrigin,
  Device,
  EngineConfig,
  EvidenceSource,
  Merchant,
  ProviderId,
  Relation,
  RiskBand,
  RiskLevel,
  Seller,
  Signal,
  SignalId,
  SignalState,
  VerificationAnswers,
} from '../types/domain'
import { BASE_SCORE, ENGINE_VERSION, MIN_CONFIDENCE, bandFor, ruleById, signalSpec } from './riskModel'
import { formatBRL, formatDate } from '../utils/format'
export interface EngineInput {
  at: string
  stage: AssessmentStage
  customer: Customer
  device: Device
  address: Address
  addressUsedBefore: boolean
  merchant: Merchant
  sellers: Seller[]
  amount: number
  declaredOrigin?: DeclaredOrigin
  answers?: VerificationAnswers
  relations: Relation[]
  config: EngineConfig
  
  unavailable?: ProviderId[]
}

// a constante/variável DAY e atribui a ela o resultado da expressão desta linha.
const DAY = 86_400_000
// a constante/variável daysBetween e atribui a ela o resultado da expressão desta linha.
const daysBetween = (from: string, to: string) => (new Date(to).getTime() - new Date(from).getTime()) / DAY
// a constante/variável ratioText e atribui a ela o resultado da expressão desta linha.
const ratioText = (r: number) => `${r.toFixed(1).replace('.', ',')}×`

// a função stateFor. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function stateFor(points: number): SignalState {
  // Verifica a condição antes de executar o bloco seguinte.
  if (points <= 0) return 'ok'
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return points >= 8 ? 'risk' : 'attention'
}
export function makeSignal(id: SignalId, points: number, detail: string, extra?: Partial<Signal>): Signal {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return sig(id, points, detail, extra)
}

// a função sig. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function sig(id: SignalId, points: number, detail: string, extra?: Partial<Signal>): Signal {
  // Declara a constante/variável spec e atribui a ela o resultado da expressão desta linha.
  const spec = signalSpec(id)
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return {
    id,
    source: spec.source,
    label: spec.label,
    clientLabel: spec.client,
    detail,
    basePoints: points,
    points,
    state: stateFor(points),
    confidence: spec.confidence,
    ...extra,
  }
}
export function downProviders(input: Pick<EngineInput, 'config' | 'unavailable'>): Set<ProviderId> {
  // Declara a constante/variável down e atribui a ela o resultado da expressão desta linha.
  const down = new Set<ProviderId>(input.unavailable ?? [])
  // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
  for (const [id, status] of Object.entries(input.config.providers) as [ProviderId, string][]) if (status === 'down') down.add(id)
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return down
}
export function collectSignals(input: EngineInput): Signal[] {
  // Declara a constante/variável out e atribui a ela o resultado da expressão desta linha.
  const out: Signal[] = []
  // Declara a constante/variável down e atribui a ela o resultado da expressão desta linha.
  const down = downProviders(input)
  const { customer, device, address, merchant, sellers, amount, at } = input

  // Verifica a condição antes de executar o bloco seguinte.
  if (!down.has('history')) {
    // Declara a constante/variável avg e atribui a ela o resultado da expressão desta linha.
    const avg = customer.spend.avgTicket90d
    // Declara a constante/variável ratio e atribui a ela o resultado da expressão desta linha.
    const ratio = amount / avg
    // Verifica a condição antes de executar o bloco seguinte.
    if (customer.spend.purchases90d < 3) out.push(sig('HISTORY_SPARSE', 3, `${customer.spend.purchases90d} compras nos últimos 90 dias`))
    // Verifica a condição antes de executar o bloco seguinte.
    if (ratio <= 1.5) out.push(sig('AMOUNT_WITHIN_HABIT', -2, `${formatBRL(amount)} · ticket médio ${formatBRL(avg)} (${ratioText(ratio)})`))
    // Caso a condição anterior não seja atendida, executa o caminho alternativo.
    else out.push(sig('AMOUNT_ABOVE_HABIT', ratio > 4 ? 14 : ratio > 2.5 ? 10 : 5, `${formatBRL(amount)} · ${ratioText(ratio)} o ticket médio de ${formatBRL(avg)}`))
    // Verifica a condição antes de executar o bloco seguinte.
    if (daysBetween(customer.since, at) > 3 * 365) out.push(sig('LONG_TENURE', -1, `Cliente desde ${formatDate(customer.since)}`))
    // Declara a constante/variável hour e atribui a ela o resultado da expressão desta linha.
    const hour = new Date(at).getHours()
    // Verifica a condição antes de executar o bloco seguinte.
    if (hour >= 23 || hour < 6) out.push(sig('UNUSUAL_HOUR', 5, `Compra às ${String(hour).padStart(2, '0')}h`))
  }

  // Verifica a condição antes de executar o bloco seguinte.
  if (!down.has('device')) {
    // Verifica a condição antes de executar o bloco seguinte.
    if (device.trusted) {
      out.push(sig('KNOWN_DEVICE', -4, `${device.name} · ${device.detail}, em uso desde ${formatDate(device.firstSeen)}`))
      out.push(sig('SESSION_CONSISTENT', -2, 'Sessão iniciada pelo próprio cliente, navegação habitual'))
      // Verifica a condição antes de executar o bloco seguinte.
      if (device.location.startsWith(customer.city)) out.push(sig('LOCATION_CONSISTENT', -1, `Localização aproximada: ${device.location}`))
    // Caso a condição anterior não seja atendida, executa o caminho alternativo.
    } else {
      out.push(sig('NEW_DEVICE', 8, `${device.name} · ${device.detail}, visto pela primeira vez em ${formatDate(device.firstSeen)}`))
      out.push(sig('SESSION_ANOMALY', 4, 'Sessão de poucos minutos; endereço colado no formulário'))
    }
  }

  // Declara a constante/variável owned e atribui a ela o resultado da expressão desta linha.
  const owned = address.customerIds.includes(customer.id)
  // Verifica a condição antes de executar o bloco seguinte.
  if (owned && (input.addressUsedBefore || address.kind === 'home')) out.push(sig('HABITUAL_DESTINATION', -3, `${address.label}: ${address.line1}`))
  // Caso a condição anterior não seja atendida, executa o caminho alternativo.
  else if (owned) out.push(sig('NEW_DESTINATION_OWN', 8, `${address.label}: ${address.line1} — nenhuma entrega anterior`))
  // Caso a condição anterior não seja atendida, executa o caminho alternativo.
  else {
    out.push(sig('NEW_DESTINATION_THIRD', 8, `${address.line1}${address.line2 ? ` — ${address.line2}` : ''} · sem vínculo com o cliente`))
    // Verifica a condição antes de executar o bloco seguinte.
    if (address.kind === 'pickup') out.push(sig('PICKUP_POINT', 3, `${address.label} em ${address.district}, ${address.city}`))
  }

  // Verifica a condição antes de executar o bloco seguinte.
  if (!down.has('merchant')) {
    // Verifica a condição antes de executar o bloco seguinte.
    if (merchant.marketplace && sellers.length > 0) {
      // Declara a constante/variável recent e atribui a ela o resultado da expressão desta linha.
      const recent = sellers.filter((s) => daysBetween(s.since, at) < 60)
      // Declara a constante/variável claims e atribui a ela o resultado da expressão desta linha.
      const claims = sellers.filter((s) => s.claimsRate >= 3)
      // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
      for (const s of recent) out.push(sig('RECENT_SELLER', 6, `${s.name} vende na NEXA há ${Math.max(1, Math.round(daysBetween(s.since, at)))} dias · ${s.sales} vendas`))
      // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
      for (const s of claims) out.push(sig('SELLER_HIGH_CLAIMS', 5, `${s.name}: ${String(s.claimsRate).replace('.', ',')}% de reclamações`))
      // Declara a constante/variável established e atribui a ela o resultado da expressão desta linha.
      const established = sellers.every((s) => daysBetween(s.since, at) > 2 * 365 && s.rating >= 4.5 && s.tier !== 'novo')
      // Verifica a condição antes de executar o bloco seguinte.
      if (recent.length === 0 && claims.length === 0 && established) {
        out.push(sig('ESTABLISHED_SELLER', -2, sellers.map((s) => `${s.name} · desde ${new Date(s.since).getFullYear()} · nota ${String(s.rating).replace('.', ',')}`).join('; ')))
      }
    // Caso a condição anterior não seja atendida, executa o caminho alternativo.
    } else if (merchant.verified && daysBetween(merchant.since, at) > 2 * 365) {
      out.push(sig('ESTABLISHED_SELLER', -2, `${merchant.name} · estabelecimento ativo desde ${new Date(merchant.since).getFullYear()}`))
    }
  }

  // Declara a constante/variável origin e atribui a ela o resultado da expressão desta linha.
  const origin = input.declaredOrigin
  // Verifica a condição antes de executar o bloco seguinte.
  if (origin === 'self') out.push(sig('ORIGIN_SELF', -1, '“Encontrei por conta própria”'))
  // Verifica a condição antes de executar o bloco seguinte.
  if (origin === 'ad') out.push(sig('ORIGIN_AD', 2, '“Vi um anúncio ou promoção”'))
  // Verifica a condição antes de executar o bloco seguinte.
  if (origin === 'link') out.push(sig('ORIGIN_LINK', 5, '“Recebi um link por mensagem”'))
  // Verifica a condição antes de executar o bloco seguinte.
  if (origin === 'guided') out.push(sig('ORIGIN_GUIDED', 7, '“Alguém me indicou esta compra”'))

  // Declara a constante/variável ans e atribui a ela o resultado da expressão desta linha.
  const ans = input.answers
  // Verifica a condição antes de executar o bloco seguinte.
  if (input.stage === 'recalculated' && ans) {
    // Verifica a condição antes de executar o bloco seguinte.
    if (ans.origin === 'asked') out.push(sig('VER_ASKED', 12, '“Não, alguém me pediu”'))
    // Verifica a condição antes de executar o bloco seguinte.
    if (ans.contact !== 'no') out.push(sig('VER_CONTACT', 6, ans.contact === 'phone' ? '“Sim, por telefone”' : '“Sim, por mensagem”'))
    // Verifica a condição antes de executar o bloco seguinte.
    if (ans.address === 'given') out.push(sig('VER_ADDRESS_GIVEN', 8, '“Me passaram este endereço”'))
    // Verifica a condição antes de executar o bloco seguinte.
    if (ans.origin === 'self' && ans.contact === 'no' && ans.address === 'mine') out.push(sig('VER_CLEAR', -8, 'Nenhuma resposta indica orientação de terceiro'))
    // Verifica a condição antes de executar o bloco seguinte.
    if (ans.address === 'mine' && !owned && address.kind === 'pickup') {
      out.push(sig('EVIDENCE_DIVERGENCE', 6, 'Cliente diz reconhecer o endereço, mas ele não está no cadastro e é um ponto de retirada'))
    }
  }

  // Verifica a condição antes de executar o bloco seguinte.
  if (!down.has('intelligence') && input.config.flags['intelligence-matching']) {
    // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
    for (const r of input.relations) {
      // Verifica a condição antes de executar o bloco seguinte.
      if (r.kind === 'destination') {
        out.push(sig('DESTINATION_IN_INCIDENT', 28, r.reason, { entityId: r.entityId, incidentIds: r.incidentIds }))
      }
      // Verifica a condição antes de executar o bloco seguinte.
      if (r.kind === 'seller' && r.association !== 'não indicativa' && r.crossCustomer) {
        out.push(sig('SELLER_IN_INCIDENT', 10, r.reason, { entityId: r.entityId, incidentIds: r.incidentIds }))
      }
    }
  }
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return out
}
export interface Scored {
  signals: Signal[]
  score: number
  band: RiskBand
  level: RiskLevel
  confidence: number
  degraded: EvidenceSource[]
}
export function scoreSignals(raw: Signal[], opts: { discount: boolean; degraded: EvidenceSource[]; verified: boolean }): Scored {
  // Declara a constante/variável present e atribui a ela o resultado da expressão desta linha.
  const present = new Set(raw.map((s) => s.id))
  // Declara a constante/variável signals e atribui a ela o resultado da expressão desta linha.
  const signals = raw.map((s) => {
    // Declara a constante/variável dep e atribui a ela o resultado da expressão desta linha.
    const dep = signalSpec(s.id).dependsOn?.find((d) => present.has(d))
    // Verifica a condição antes de executar o bloco seguinte.
    if (!dep || !opts.discount) return { ...s, points: s.basePoints, discounted: false, dependsOn: dep }
    // Declara a constante/variável half e atribui a ela o resultado da expressão desta linha.
    const half = Math.round(s.basePoints / 2)
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return { ...s, points: half, discounted: true, dependsOn: dep, state: stateFor(half) }
  })
  // Declara a constante/variável total e atribui a ela o resultado da expressão desta linha.
  const total = BASE_SCORE + signals.reduce((sum, s) => sum + s.points, 0)
  // Declara a constante/variável score e atribui a ela o resultado da expressão desta linha.
  const score = Math.max(0, Math.min(100, Math.round(total)))
  // Declara a constante/variável band e atribui a ela o resultado da expressão desta linha.
  const band = bandFor(score)

  // Declara a constante/variável net e atribui a ela o resultado da expressão desta linha.
  const net = new Map<EvidenceSource, number>()
  // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
  for (const s of signals) net.set(s.source, (net.get(s.source) ?? 0) + s.points)
  // Declara a constante/variável values e atribui a ela o resultado da expressão desta linha.
  const values = [...net.values()]
  // Declara a constante/variável conflict e atribui a ela o resultado da expressão desta linha.
  const conflict = values.some((v) => v >= 10) && values.some((v) => v <= -6)
  // Declara a constante/variável confidence e atribui a ela o resultado da expressão desta linha.
  let confidence = 30 + 9 * net.size
  // Verifica a condição antes de executar o bloco seguinte.
  if (opts.verified) confidence += 10
  // Verifica a condição antes de executar o bloco seguinte.
  if (conflict) confidence -= 10
  confidence -= 12 * opts.degraded.length
  // Verifica a condição antes de executar o bloco seguinte.
  if (present.has('HISTORY_SPARSE')) confidence -= 8
  confidence = Math.max(15, Math.min(95, confidence))
  // Declara a constante/variável level e atribui a ela o resultado da expressão desta linha.
  const level: RiskLevel = confidence < MIN_CONFIDENCE ? 'INCONCLUSIVE' : band
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return { signals, score, band, level, confidence, degraded: opts.degraded }
}
export interface PolicyOutcome {
  decision: Decision
  ruleId: string
  ruleText: string
}

// a função outcome. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function outcome(ruleId: string, decision: Decision, why: string): PolicyOutcome {
  // Declara a constante/variável r e atribui a ela o resultado da expressão desta linha.
  const r = ruleById(ruleId)
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return { decision, ruleId, ruleText: `${r.id} · ${r.name}: ${why}` }
}
export function decide(s: Scored, stage: AssessmentStage, config: EngineConfig): PolicyOutcome {
  // Declara a constante/variável has e atribui a ela o resultado da expressão desta linha.
  const has = (id: SignalId) => s.signals.some((x) => x.id === id)
  // Verifica a condição antes de executar o bloco seguinte.
  if (s.score >= 80) return outcome('R1', 'BLOCK', `score ${s.score} na faixa muito alta`)
  // Verifica a condição antes de executar o bloco seguinte.
  if (stage === 'recalculated' && config.flags['guidance-floor'] && has('VER_ASKED') && has('VER_CONTACT')) {
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return outcome('R2', 'INTERVENE', 'a verificação indica pedido de terceiro com contato prévio')
  }
  // Verifica a condição antes de executar o bloco seguinte.
  if (s.level === 'INCONCLUSIVE') {
    // Verifica a condição antes de executar o bloco seguinte.
    if (stage === 'initial') return s.score >= 30 ? outcome('R3', 'REQUEST_CONTEXT', `confiança ${s.confidence}; score ${s.score}`) : outcome('R3', 'APPROVE', `confiança ${s.confidence}, mas score baixo (${s.score}): aprovar e monitorar`)
    // Verifica a condição antes de executar o bloco seguinte.
    if (s.score >= 55) return outcome('R3', 'INTERVENE', `confiança ${s.confidence} mesmo após contexto; score ${s.score}`)
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return outcome('R3', s.score >= 30 ? 'APPROVE_WITH_ALERT' : 'APPROVE', `confiança ${s.confidence} após contexto; score ${s.score}`)
  }
  // Verifica a condição antes de executar o bloco seguinte.
  if (s.band === 'HIGH') {
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return stage === 'recalculated' ? outcome('R4', 'INTERVENE', `score ${s.score} depois da verificação`) : outcome('R5', 'REQUEST_CONTEXT', `score ${s.score} sem contexto do cliente`)
  }
  // Verifica a condição antes de executar o bloco seguinte.
  if (stage === 'initial' && config.flags['context-on-declared-guidance'] && (has('ORIGIN_LINK') || has('ORIGIN_GUIDED'))) {
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return outcome('R6', 'REQUEST_CONTEXT', 'cliente declarou que a compra começou por link ou indicação')
  }
  // Verifica a condição antes de executar o bloco seguinte.
  if (s.band === 'MEDIUM') return outcome('R7', 'APPROVE_WITH_ALERT', `score ${s.score}`)
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return outcome('R8', 'APPROVE', `score ${s.score}`)
}
export function degradedSources(input: Pick<EngineInput, 'config' | 'unavailable'>): EvidenceSource[] {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return [...downProviders(input)] as EvidenceSource[]
}
export function assess(input: EngineInput): Assessment {
  // Declara a constante/variável t0 e atribui a ela o resultado da expressão desta linha.
  const t0 = typeof performance !== 'undefined' ? performance.now() : 0
  // Declara a constante/variável degraded e atribui a ela o resultado da expressão desta linha.
  const degraded = degradedSources(input)
  // Declara a constante/variável scored e atribui a ela o resultado da expressão desta linha.
  const scored = scoreSignals(collectSignals(input), {
    discount: input.config.flags['dependency-discount'],
    degraded,
    verified: input.stage === 'recalculated' && !!input.answers,
  })
  // Declara a constante/variável policy e atribui a ela o resultado da expressão desta linha.
  const policy = decide(scored, input.stage, input.config)
  // Declara a constante/variável t1 e atribui a ela o resultado da expressão desta linha.
  const t1 = typeof performance !== 'undefined' ? performance.now() : 0
  // Declara a constante/variável intelOn e atribui a ela o resultado da expressão desta linha.
  const intelOn = !degraded.includes('intelligence') && input.config.flags['intelligence-matching']
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return {
    stage: input.stage,
    at: input.at,
    score: scored.score,
    band: scored.band,
    level: scored.level,
    confidence: scored.confidence,
    decision: policy.decision,
    ruleId: policy.ruleId,
    ruleText: policy.ruleText,
    signals: scored.signals,
    relations: intelOn ? input.relations : [],
    degraded,
    durationMs: Math.max(0.01, Math.round((t1 - t0) * 100) / 100),
    engine: ENGINE_VERSION,
  }
}
export function clientSignals(a: Assessment | undefined, max = 4): Signal[] {
  // Verifica a condição antes de executar o bloco seguinte.
  if (!a) return []
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return a.signals
    .filter((s) => s.clientLabel && s.points > 0)
    .sort((x, y) => y.points - x.points)
    .slice(0, max)
}
