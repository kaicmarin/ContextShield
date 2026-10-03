import type { Assessment, Decision, EngineConfig, EvidenceSource, RiskLevel, Signal, SignalId } from '../types/domain'
import { BANDS, decisionMeta, isProtective, sourceSpec, sources } from './riskModel'
import { decide, makeSignal, scoreSignals } from './risk'
export type Robustness = 'ROBUST' | 'DEGRADED' | 'FRAGILE' | 'INCONCLUSIVE'
export interface Perturbation {
  id: string
  source: EvidenceSource
  kind: 'ausente' | 'degradada' | 'adulterada'
  label: string
  score: number
  level: RiskLevel
  confidence: number
  decision: Decision
  ruleId: string
  changed: boolean
  crossesClass: boolean
}
export interface Certificate {
  status: Robustness
  decision: Decision
  score: number
  perturbations: Perturbation[]
  sensitiveTo: EvidenceSource[]
  margin: { below?: number; above?: number }
  summary: string
}

// a constante/variável cls e atribui a ela o resultado da expressão desta linha.
const cls = (d: Decision) => (isProtective(d) ? 'proteger' : 'liberar')

// a função evaluate. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function evaluate(signals: Signal[], a: Assessment, config: EngineConfig, degraded: EvidenceSource[]) {
  // Declara a constante/variável scored e atribui a ela o resultado da expressão desta linha.
  const scored = scoreSignals(signals, { discount: config.flags['dependency-discount'], degraded, verified: a.stage === 'recalculated' })
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return { ...scored, ...decide(scored, a.stage, config) }
}

// a constante/variável FAVORABLE_DEVICE e atribui a ela o resultado da expressão desta linha.
const FAVORABLE_DEVICE: [SignalId, number, string][] = [
  ['KNOWN_DEVICE', -4, 'Dispositivo aparenta ser conhecido (identificação falsificada)'],
  ['SESSION_CONSISTENT', -2, 'Sessão aparenta ser habitual'],
  ['LOCATION_CONSISTENT', -1, 'Localização aparenta ser compatível'],
]
// a constante/variável UNFAVORABLE_DEVICE e atribui a ela o resultado da expressão desta linha.
const UNFAVORABLE_DEVICE: [SignalId, number, string][] = [
  ['NEW_DEVICE', 8, 'Dispositivo era, na verdade, desconhecido'],
  ['SESSION_ANOMALY', 4, 'Sessão atípica que não foi percebida'],
]

// a função withDevice. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function withDevice(signals: Signal[], set: [SignalId, number, string][]) {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return [...signals.filter((s) => s.source !== 'device'), ...set.map(([id, p, d]) => makeSignal(id, p, d))]
}

// a função withAnswers. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function withAnswers(signals: Signal[], lie: boolean) {
  // Declara a constante/variável rest e atribui a ela o resultado da expressão desta linha.
  const rest = signals.filter((s) => !s.id.startsWith('VER_') && s.id !== 'EVIDENCE_DIVERGENCE')
  // Declara a constante/variável third e atribui a ela o resultado da expressão desta linha.
  const third = signals.some((s) => s.id === 'NEW_DESTINATION_THIRD')
  // Declara a constante/variável pickup e atribui a ela o resultado da expressão desta linha.
  const pickup = signals.some((s) => s.id === 'PICKUP_POINT')
  // Verifica a condição antes de executar o bloco seguinte.
  if (lie) {
    // Declara a constante/variável out e atribui a ela o resultado da expressão desta linha.
    const out = [...rest, makeSignal('VER_CLEAR', -8, 'Respostas orientadas: “fui eu”, “ninguém me contatou”, “o endereço é meu”')]
    // Verifica a condição antes de executar o bloco seguinte.
    if (third && pickup) out.push(makeSignal('EVIDENCE_DIVERGENCE', 6, 'Resposta diverge do endereço de retirada'))
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return out
  }
  // Declara a constante/variável out e atribui a ela o resultado da expressão desta linha.
  const out = [...rest, makeSignal('VER_ASKED', 12, 'Respostas verdadeiras: alguém pediu a compra'), makeSignal('VER_CONTACT', 6, 'Houve contato prévio')]
  // Verifica a condição antes de executar o bloco seguinte.
  if (third) out.push(makeSignal('VER_ADDRESS_GIVEN', 8, 'Endereço passado por terceiro'))
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return out
}
export function certificate(a: Assessment, config: EngineConfig): Certificate {
  // Declara a constante/variável present e atribui a ela o resultado da expressão desta linha.
  const present = [...new Set(a.signals.map((s) => s.source))].filter((s) => s !== 'checkout')
  // Declara a constante/variável out e atribui a ela o resultado da expressão desta linha.
  const out: Perturbation[] = []
  // Declara a constante/variável push e atribui a ela o resultado da expressão desta linha.
  const push = (id: string, source: EvidenceSource, kind: Perturbation['kind'], label: string, signals: Signal[], degraded: EvidenceSource[]) => {
    // Declara a constante/variável r e atribui a ela o resultado da expressão desta linha.
    const r = evaluate(signals, a, config, degraded)
    out.push({
      id,
      source,
      kind,
      label,
      score: r.score,
      level: r.level,
      confidence: r.confidence,
      decision: r.decision,
      ruleId: r.ruleId,
      changed: r.decision !== a.decision,
      crossesClass: cls(r.decision) !== cls(a.decision),
    })
  }

  // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
  for (const src of present) {
    // Depois da verificação, "cliente sem responder" não é um estado possível; o teste relevante é a resposta falsa.
    // Verifica a condição antes de executar o bloco seguinte.
    if (src === 'customer' && a.stage === 'recalculated') continue
    // Declara a constante/variável name e atribui a ela o resultado da expressão desta linha.
    const name = sourceSpec(src).label
    // Declara a constante/variável hasProvider e atribui a ela o resultado da expressão desta linha.
    const hasProvider = !!sourceSpec(src).providerId
    push(`${src}-missing`, src, 'ausente', `${name} indisponível`, a.signals.filter((s) => s.source !== src), hasProvider ? [...new Set([...a.degraded, src])] : a.degraded)
    push(
      `${src}-weak`,
      src,
      'degradada',
      `${name} com qualidade reduzida (metade do peso)`,
      a.signals.map((s) => (s.source === src ? { ...s, basePoints: Math.round(s.basePoints / 2) } : s)),
      a.degraded,
    )
  }

  // Declara a constante/variável protective e atribui a ela o resultado da expressão desta linha.
  const protective = isProtective(a.decision)
  // Verifica a condição antes de executar o bloco seguinte.
  if (present.includes('device')) {
    // Declara a constante/variável deviceFavorable e atribui a ela o resultado da expressão desta linha.
    const deviceFavorable = a.signals.some((s) => s.id === 'KNOWN_DEVICE')
    // Verifica a condição antes de executar o bloco seguinte.
    if (protective && !deviceFavorable) push('device-spoofed', 'device', 'adulterada', 'Dispositivo falsificado para parecer conhecido', withDevice(a.signals, FAVORABLE_DEVICE), a.degraded)
    // Verifica a condição antes de executar o bloco seguinte.
    if (!protective && deviceFavorable) push('device-wrong', 'device', 'adulterada', 'Identificação do dispositivo errada (era desconhecido)', withDevice(a.signals, UNFAVORABLE_DEVICE), a.degraded)
  }
  // Verifica a condição antes de executar o bloco seguinte.
  if (a.stage === 'recalculated') {
    // Declara a constante/variável answeredRisk e atribui a ela o resultado da expressão desta linha.
    const answeredRisk = a.signals.some((s) => s.id === 'VER_ASKED' || s.id === 'VER_CONTACT' || s.id === 'VER_ADDRESS_GIVEN')
    // Verifica a condição antes de executar o bloco seguinte.
    if (protective && answeredRisk) push('customer-lie', 'customer', 'adulterada', 'Cliente orientado a mentir na verificação', withAnswers(a.signals, true), a.degraded)
    // Verifica a condição antes de executar o bloco seguinte.
    if (!protective && a.signals.some((s) => s.id === 'VER_CLEAR')) push('customer-truth', 'customer', 'adulterada', 'Respostas eram falsas (houve orientação)', withAnswers(a.signals, false), a.degraded)
  }

  // Declara a constante/variável fragile e atribui a ela o resultado da expressão desta linha.
  const fragile = out.filter((p) => p.crossesClass || (p.kind === 'adulterada' && p.changed))
  // Declara a constante/variável degradedP e atribui a ela o resultado da expressão desta linha.
  const degradedP = out.filter((p) => p.changed || p.level === 'INCONCLUSIVE')
  // Declara a constante/variável status e atribui a ela o resultado da expressão desta linha.
  let status: Robustness = 'ROBUST'
  // Verifica a condição antes de executar o bloco seguinte.
  if (a.level === 'INCONCLUSIVE') status = 'INCONCLUSIVE'
  // Caso a condição anterior não seja atendida, executa o caminho alternativo.
  else if (fragile.length > 0) status = 'FRAGILE'
  // Caso a condição anterior não seja atendida, executa o caminho alternativo.
  else if (degradedP.length > 0 || a.degraded.length > 0) status = 'DEGRADED'

  // Declara a constante/variável sensitiveTo e atribui a ela o resultado da expressão desta linha.
  const sensitiveTo = [...new Set((status === 'FRAGILE' ? fragile : degradedP).map((p) => p.source))]
  // Declara a constante/variável band e atribui a ela o resultado da expressão desta linha.
  const band = BANDS.find((b) => b.band === a.band)
  // Declara a constante/variável margin e atribui a ela o resultado da expressão desta linha.
  const margin = { below: band && band.min > 0 ? a.score - band.min + 1 : undefined, above: band && band.max < 100 ? band.max - a.score + 1 : undefined }
  // Declara a constante/variável names e atribui a ela o resultado da expressão desta linha.
  const names = sensitiveTo.map((s) => sourceSpec(s).label.toLowerCase()).join(', ')
  // Declara a constante/variável dec e atribui a ela o resultado da expressão desta linha.
  const dec = decisionMeta[a.decision].label.toLowerCase()
  // Declara a constante/variável summary e atribui a ela o resultado da expressão desta linha.
  const summary =
    status === 'ROBUST'
      ? `A decisão de ${dec} se mantém em todas as ${out.length} perturbações testadas.`
      : status === 'FRAGILE'
        ? `A decisão de ${dec} depende de ${names}: se essa evidência estiver errada ou faltar, a decisão muda de natureza.`
        : status === 'DEGRADED'
          ? a.degraded.length > 0
            ? `Decisão tomada com ${a.degraded.map((d) => sourceSpec(d).label.toLowerCase()).join(', ')} indisponível; a confiança ficou menor.`
            : `A proteção se mantém, mas enfraquece sem ${names}.`
          : `Confiança ${a.confidence}: não há evidência independente suficiente para sustentar a leitura.`
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return { status, decision: a.decision, score: a.score, perturbations: out, sensitiveTo, margin, summary }
}
export interface SourceGroup {
  source: EvidenceSource
  label: string
  provider: string
  provenance: string
  signals: Signal[]
  net: number
  shareFavorable: number
  shareAgainst: number
}
export interface IndependenceView {
  groups: SourceGroup[]
  independentSources: number
  totalSignals: number
  dependencies: { from: Signal; to: SignalId }[]
  warnings: string[]
}
export function independence(a: Assessment): IndependenceView {
  // Declara a constante/variável favorableTotal e atribui a ela o resultado da expressão desta linha.
  const favorableTotal = a.signals.filter((s) => s.points < 0).reduce((x, s) => x + Math.abs(s.points), 0)
  // Declara a constante/variável againstTotal e atribui a ela o resultado da expressão desta linha.
  const againstTotal = a.signals.filter((s) => s.points > 0).reduce((x, s) => x + s.points, 0)
  // Declara a constante/variável groups e atribui a ela o resultado da expressão desta linha.
  const groups: SourceGroup[] = sources
    .map((spec) => {
      // Declara a constante/variável signals e atribui a ela o resultado da expressão desta linha.
      const signals = a.signals.filter((s) => s.source === spec.id)
      // Declara a constante/variável fav e atribui a ela o resultado da expressão desta linha.
      const fav = signals.filter((s) => s.points < 0).reduce((x, s) => x + Math.abs(s.points), 0)
      // Declara a constante/variável ag e atribui a ela o resultado da expressão desta linha.
      const ag = signals.filter((s) => s.points > 0).reduce((x, s) => x + s.points, 0)
      // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
      return {
        source: spec.id,
        label: spec.label,
        provider: spec.provider,
        provenance: spec.provenance,
        signals,
        net: signals.reduce((x, s) => x + s.points, 0),
        shareFavorable: favorableTotal ? Math.round((fav / favorableTotal) * 100) : 0,
        shareAgainst: againstTotal ? Math.round((ag / againstTotal) * 100) : 0,
      }
    })
    .filter((g) => g.signals.length > 0)

  // Declara a constante/variável warnings e atribui a ela o resultado da expressão desta linha.
  const warnings: string[] = []
  // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
  for (const g of groups) {
    // Verifica a condição antes de executar o bloco seguinte.
    if (g.signals.length >= 3) warnings.push(`${g.signals.length} sinais vêm de ${g.label.toLowerCase()}: contam como uma única fonte na confiança.`)
    // Verifica a condição antes de executar o bloco seguinte.
    if (g.shareFavorable >= 50 && favorableTotal >= 4 && !isProtective(a.decision)) warnings.push(`${g.shareFavorable}% dos pontos a favor da aprovação vêm de ${g.label.toLowerCase()}.`)
    // Verifica a condição antes de executar o bloco seguinte.
    if (g.source === 'customer' && g.shareAgainst >= 50 && isProtective(a.decision)) warnings.push('Mais da metade dos pontos contra a compra vem do que o próprio cliente declarou.')
  }
  // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
  for (const d of a.degraded) warnings.push(`${sourceSpec(d).label} estava indisponível nesta decisão.`)
  // Declara a constante/variável dependencies e atribui a ela o resultado da expressão desta linha.
  const dependencies = a.signals.filter((s) => s.dependsOn).map((s) => ({ from: s, to: s.dependsOn as SignalId }))
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return { groups, independentSources: groups.length, totalSignals: a.signals.length, dependencies, warnings }
}
