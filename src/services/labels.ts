import type { Association, Decision, EntityKind, IncidentStatus, RiskLevel, SignalState, TxStatus } from '../types/domain'
import type { Robustness } from './robustness'
import type { ChaosVerdict } from './chaos'
export type Tone = 'neutral' | 'info' | 'ok' | 'warn' | 'risk' | 'critical' | 'trace'
export const txStatusMeta: Record<TxStatus, { label: string; client: string; tone: Tone }> = {
  RECEIVED: { label: 'Recebida', client: 'Recebida', tone: 'neutral' },
  ANALYZING: { label: 'Analisando', client: 'Em confirmação', tone: 'info' },
  CONTEXT_REQUIRED: { label: 'Contexto solicitado', client: 'Aguardando sua confirmação', tone: 'info' },
  APPROVED: { label: 'Aprovada', client: 'Aprovada', tone: 'ok' },
  APPROVED_WITH_ALERT: { label: 'Aprovada com alerta', client: 'Aprovada com aviso', tone: 'warn' },
  INTERVENTION: { label: 'Intervenção', client: 'Compra pausada', tone: 'warn' },
  BLOCKED: { label: 'Bloqueada', client: 'Interrompida por segurança', tone: 'risk' },
  CANCELLED: { label: 'Cancelada', client: 'Não concluída', tone: 'neutral' },
  INCIDENT_RECORDED: { label: 'Incidente registrado', client: 'Relato registrado', tone: 'trace' },
}
export const riskMeta: Record<RiskLevel, { label: string; short: string; tone: Tone; bars: number }> = {
  LOW: { label: 'Baixo', short: 'BAIXO', tone: 'ok', bars: 1 },
  MEDIUM: { label: 'Médio', short: 'MÉDIO', tone: 'warn', bars: 2 },
  HIGH: { label: 'Alto', short: 'ALTO', tone: 'risk', bars: 3 },
  CRITICAL: { label: 'Muito alto', short: 'MUITO ALTO', tone: 'critical', bars: 4 },
  INCONCLUSIVE: { label: 'Inconclusivo', short: 'INCONCL.', tone: 'neutral', bars: 0 },
}
export const decisionTone: Record<Decision, Tone> = {
  APPROVE: 'ok',
  APPROVE_WITH_ALERT: 'warn',
  REQUEST_CONTEXT: 'info',
  INTERVENE: 'risk',
  BLOCK: 'critical',
}
export const incidentStatusTone: Record<IncidentStatus, Tone> = {
  RECEIVED: 'info',
  IN_REVIEW: 'warn',
  RELATED: 'trace',
  CLOSED: 'neutral',
}
export const signalMeta: Record<SignalState, { label: string; tone: Tone }> = {
  ok: { label: 'A favor', tone: 'ok' },
  attention: { label: 'Atenção', tone: 'warn' },
  risk: { label: 'Relevante', tone: 'risk' },
}
export const entityKindLabel: Record<EntityKind, string> = {
  phone: 'Telefone',
  domain: 'Domínio',
  account: 'Identidade usada',
  destination: 'Destino de entrega',
  seller: 'Vendedor',
  merchant: 'Estabelecimento',
}
export const associationMeta: Record<Association, { tone: Tone; text: string }> = {
  forte: { tone: 'risk', text: 'Aparece em relatos de clientes diferentes.' },
  moderada: { tone: 'warn', text: 'Aparece em um relato e em outra compra; pode ser coincidência.' },
  fraca: { tone: 'neutral', text: 'Sinal isolado; sozinho não sustenta relação.' },
  'não indicativa': { tone: 'ok', text: 'Presente nos casos só como contexto (loja ou vendedor estabelecido); não é origem do padrão.' },
}
export const robustnessMeta: Record<Robustness, { label: string; tone: Tone; text: string }> = {
  ROBUST: { label: 'Robusta', tone: 'ok', text: 'A decisão se mantém mesmo se uma evidência faltar, piorar ou estiver errada.' },
  DEGRADED: { label: 'Degradada', tone: 'warn', text: 'A decisão continua na mesma direção, mas enfraquece sem alguma evidência.' },
  FRAGILE: { label: 'Frágil', tone: 'risk', text: 'Uma única evidência errada ou ausente muda a natureza da decisão.' },
  INCONCLUSIVE: { label: 'Inconclusiva', tone: 'neutral', text: 'Não havia evidência independente suficiente para uma leitura confiável.' },
}
export const chaosVerdictMeta: Record<ChaosVerdict, { label: string; tone: Tone; text: string }> = {
  ROBUST: { label: 'ROBUST', tone: 'ok', text: 'O resultado correto se manteve sob a perturbação.' },
  DEGRADED: { label: 'DEGRADED', tone: 'warn', text: 'Resultado protegido, mas com menos margem, mais passos ou fricção indevida.' },
  INCONCLUSIVE: { label: 'INCONCLUSIVE', tone: 'neutral', text: 'O motor reconheceu que não tinha evidência suficiente.' },
  'UNSAFE SURVIVOR': { label: 'UNSAFE SURVIVOR', tone: 'critical', text: 'Um golpe passou. A falha é mostrada, não escondida.' },
}
export type Traffic = 'GREEN' | 'YELLOW' | 'RED'
export const trafficMeta: Record<Traffic, { label: string; tone: Tone; short: string }> = {
  GREEN: { label: 'Nenhum alerta encontrado', tone: 'ok', short: 'Sem alertas' },
  YELLOW: { label: 'Confira antes de pagar', tone: 'warn', short: 'Atenção' },
  RED: { label: 'Não pague por este caminho', tone: 'risk', short: 'Alerta' },
}
export const toneClasses: Record<Tone, { chip: string; dot: string; text: string; soft: string; border: string }> = {
  neutral: { chip: 'bg-ink-900/[0.05] text-ink-700', dot: 'bg-subtle', text: 'text-muted', soft: 'bg-canvas', border: 'border-line-strong' },
  info: { chip: 'bg-signal-soft text-signal-ink', dot: 'bg-signal', text: 'text-signal-ink', soft: 'bg-signal-soft', border: 'border-signal/30' },
  ok: { chip: 'bg-ok-soft text-ok-ink', dot: 'bg-ok', text: 'text-ok-ink', soft: 'bg-ok-soft', border: 'border-ok/30' },
  warn: { chip: 'bg-warn-soft text-warn-ink', dot: 'bg-warn', text: 'text-warn-ink', soft: 'bg-warn-soft', border: 'border-warn/30' },
  risk: { chip: 'bg-risk-soft text-risk-ink', dot: 'bg-risk', text: 'text-risk-ink', soft: 'bg-risk-soft', border: 'border-risk/30' },
  critical: { chip: 'bg-critical text-white', dot: 'bg-critical', text: 'text-critical', soft: 'bg-critical-soft', border: 'border-critical/40' },
  trace: { chip: 'bg-trace-soft text-trace-ink', dot: 'bg-trace', text: 'text-trace-ink', soft: 'bg-trace-soft', border: 'border-trace/30' },
}
