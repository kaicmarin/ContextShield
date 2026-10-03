import type { Decision, EvidenceSource, FlagId, ProviderId, RiskBand, SignalId } from '../types/domain'
export const ENGINE_VERSION = 'regras-v1.4'
export const BASE_SCORE = 22
export const BANDS: { band: RiskBand; min: number; max: number; label: string; decision: string }[] = [
  { band: 'LOW', min: 0, max: 29, label: 'Baixo', decision: 'Aprovar' },
  { band: 'MEDIUM', min: 30, max: 54, label: 'Médio', decision: 'Aprovar com alerta' },
  { band: 'HIGH', min: 55, max: 79, label: 'Alto', decision: 'Pedir contexto e intervir' },
  { band: 'CRITICAL', min: 80, max: 100, label: 'Muito alto', decision: 'Bloquear' },
]
export function bandFor(score: number): RiskBand {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (BANDS.find((b) => score >= b.min && score <= b.max) ?? BANDS[BANDS.length - 1]).band
}

export const MIN_CONFIDENCE = 40

export interface SourceSpec {
  id: EvidenceSource
  label: string
  provider: string
  provenance: string
  providerId?: ProviderId
}

export const sources: SourceSpec[] = [
  { id: 'history', label: 'Histórico do cliente', provider: 'Perfil de gasto do emissor', provenance: 'Dados do emissor (simulados): ticket médio, tempo de relacionamento, frequência.', providerId: 'history' },
  { id: 'device', label: 'Telemetria do dispositivo', provider: 'SDK de dispositivo no checkout', provenance: 'Um único SDK produz identificação, sessão e localização aproximada.', providerId: 'device' },
  { id: 'checkout', label: 'Dados do checkout', provider: 'Pedido enviado pela loja', provenance: 'Endereço, itens e valor informados no pedido.' },
  { id: 'merchant', label: 'Cadastro do vendedor', provider: 'Registro de estabelecimentos e vendedores', provenance: 'Tempo de atividade, reputação e reclamações.', providerId: 'merchant' },
  { id: 'customer', label: 'Contexto declarado', provider: 'Respostas do próprio cliente', provenance: 'Autodeclarado: pode ser omitido ou orientado por terceiros.' },
  { id: 'intelligence', label: 'Intelligence', provider: 'Relatos e relações entre casos', provenance: 'Entidades extraídas de incidentes confirmados.', providerId: 'intelligence' },
]

export const sourceSpec = (id: EvidenceSource) => sources.find((s) => s.id === id) as SourceSpec

export interface SignalSpec {
  id: SignalId
  source: EvidenceSource
  label: string
  client?: string
  weight: string
  confidence: number
  dependsOn?: SignalId[]
  rationale: string
}

export const signalCatalog: SignalSpec[] = [
  { id: 'AMOUNT_WITHIN_HABIT', source: 'history', label: 'Valor compatível com o hábito', weight: '−2', confidence: 85, rationale: 'Até 1,5× o ticket médio dos últimos 90 dias.' },
  { id: 'AMOUNT_ABOVE_HABIT', source: 'history', label: 'Valor acima do hábito', client: 'O valor está bem acima do que você costuma gastar', weight: '+5 / +10 / +14', confidence: 85, rationale: '1,5–2,5× → +5; 2,5–4× → +10; acima de 4× → +14.' },
  { id: 'HISTORY_SPARSE', source: 'history', label: 'Histórico insuficiente', weight: '+3', confidence: 50, rationale: 'Menos de 3 compras em 90 dias: o hábito não está bem definido. Reduz a confiança.' },
  { id: 'LONG_TENURE', source: 'history', label: 'Relacionamento longo', weight: '−1', confidence: 90, rationale: 'Cliente há mais de 3 anos.' },
  { id: 'UNUSUAL_HOUR', source: 'history', label: 'Horário atípico', client: 'A compra acontece em um horário incomum para você', weight: '+5', confidence: 70, rationale: 'Entre 23h e 6h.' },
  { id: 'KNOWN_DEVICE', source: 'device', label: 'Dispositivo conhecido', weight: '−4', confidence: 80, rationale: 'Dispositivo marcado como confiável pelo cliente.' },
  { id: 'SESSION_CONSISTENT', source: 'device', label: 'Sessão consistente', weight: '−2', confidence: 70, rationale: 'Navegação e tempo de sessão compatíveis com o uso habitual.' },
  { id: 'LOCATION_CONSISTENT', source: 'device', label: 'Localização compatível', weight: '−1', confidence: 60, rationale: 'Localização aproximada na cidade do cliente.' },
  { id: 'NEW_DEVICE', source: 'device', label: 'Dispositivo novo', client: 'A compra está sendo feita em um dispositivo que você nunca usou', weight: '+8', confidence: 80, rationale: 'Primeiro uso deste dispositivo pelo cliente.' },
  { id: 'SESSION_ANOMALY', source: 'device', label: 'Sessão curta com dados colados', weight: '+4 (½ se dispositivo novo)', confidence: 60, dependsOn: ['NEW_DEVICE'], rationale: 'Mesma telemetria do dispositivo novo: conta pela metade quando os dois aparecem.' },
  { id: 'HABITUAL_DESTINATION', source: 'checkout', label: 'Destino habitual', weight: '−3', confidence: 90, rationale: 'Endereço do cliente já usado antes ou residencial.' },
  { id: 'NEW_DESTINATION_OWN', source: 'checkout', label: 'Primeira entrega em endereço do cliente', client: 'É a primeira entrega neste endereço', weight: '+8', confidence: 85, rationale: 'Endereço cadastrado pelo cliente, mas nunca usado em compras.' },
  { id: 'NEW_DESTINATION_THIRD', source: 'checkout', label: 'Destino fora do cadastro do cliente', client: 'O endereço de entrega não está entre os seus endereços', weight: '+8', confidence: 90, rationale: 'Endereço sem vínculo com o cliente.' },
  { id: 'PICKUP_POINT', source: 'checkout', label: 'Ponto de retirada', weight: '+3', confidence: 90, rationale: 'Retirada em ponto comercial, sem vínculo com o cliente.' },
  { id: 'ESTABLISHED_SELLER', source: 'merchant', label: 'Vendedor estabelecido', weight: '−2', confidence: 85, rationale: 'Mais de 2 anos de atividade e boa reputação.' },
  { id: 'RECENT_SELLER', source: 'merchant', label: 'Vendedor recente', client: 'O vendedor começou a vender há poucos dias', weight: '+6', confidence: 85, rationale: 'Menos de 60 dias de atividade.' },
  { id: 'SELLER_HIGH_CLAIMS', source: 'merchant', label: 'Reclamações acima da média', weight: '+5', confidence: 75, rationale: 'Taxa de reclamações acima de 3%.' },
  { id: 'ORIGIN_SELF', source: 'customer', label: 'Origem declarada: própria', weight: '−1', confidence: 55, rationale: 'Autodeclarado. Peso baixo porque pode ser orientado.' },
  { id: 'ORIGIN_AD', source: 'customer', label: 'Origem declarada: anúncio', weight: '+2', confidence: 55, rationale: 'Anúncios de terceiros podem levar a ofertas enganosas.' },
  { id: 'ORIGIN_LINK', source: 'customer', label: 'Origem declarada: link recebido', client: 'A compra começou por um link que você recebeu', weight: '+5', confidence: 60, rationale: 'Links recebidos são o início comum de roteiros de indução.' },
  { id: 'ORIGIN_GUIDED', source: 'customer', label: 'Origem declarada: indicação de terceiro', client: 'Outra pessoa indicou esta compra', weight: '+7', confidence: 60, rationale: 'Ajuda de terceiros não é fraude, mas pede contexto.' },
  { id: 'VER_ASKED', source: 'customer', label: 'Verificação: alguém pediu a compra', client: 'Você contou que alguém pediu esta compra', weight: '+12 (½ se já declarado)', confidence: 70, dependsOn: ['ORIGIN_GUIDED'], rationale: 'Mesma informação da origem declarada, quando ela já indicava terceiro.' },
  { id: 'VER_CONTACT', source: 'customer', label: 'Verificação: contato prévio', client: 'Alguém entrou em contato com você antes da compra', weight: '+6 (½ se já declarado)', confidence: 70, dependsOn: ['ORIGIN_LINK', 'ORIGIN_GUIDED'], rationale: 'Confirma a origem declarada; não é evidência nova quando ela já existe.' },
  { id: 'VER_ADDRESS_GIVEN', source: 'customer', label: 'Verificação: endereço passado por terceiro', client: 'O endereço foi passado por outra pessoa', weight: '+8 (½ com destino fora do cadastro)', confidence: 75, dependsOn: ['NEW_DESTINATION_THIRD'], rationale: 'Mesmo fato do destino fora do cadastro, visto pelo cliente.' },
  { id: 'VER_CLEAR', source: 'customer', label: 'Verificação sem sinais', weight: '−8', confidence: 45, rationale: 'Autodeclarado e sujeito a orientação: confiança baixa.' },
  { id: 'EVIDENCE_DIVERGENCE', source: 'customer', label: 'Resposta diverge dos dados da compra', weight: '+6', confidence: 80, rationale: 'Cliente reconhece um endereço que não é dele e é ponto de retirada.' },
  { id: 'DESTINATION_IN_INCIDENT', source: 'intelligence', label: 'Destino citado em relato de outro cliente', client: 'Este endereço de entrega aparece em relatos recentes de outras pessoas', weight: '+28', confidence: 85, rationale: 'Endereço específico, confirmado em incidente de outro cliente.' },
  { id: 'SELLER_IN_INCIDENT', source: 'intelligence', label: 'Vendedor presente em relato de outro cliente', weight: '+10', confidence: 70, rationale: 'Relação moderada: o vendedor pode ter sido usado sem saber.' },
]

export const signalSpec = (id: SignalId) => signalCatalog.find((s) => s.id === id) as SignalSpec

export interface PolicyRule {
  id: string
  name: string
  condition: string
  outcome: Decision
  flag?: FlagId
}

export const policyRules: PolicyRule[] = [
  { id: 'R1', name: 'Risco muito alto', condition: 'Score ≥ 80', outcome: 'BLOCK' },
  { id: 'R2', name: 'Orientação confirmada', condition: 'Verificação indica que alguém pediu a compra e houve contato prévio', outcome: 'INTERVENE', flag: 'guidance-floor' },
  { id: 'R3', name: 'Confiança insuficiente', condition: 'Confiança < 40 — pede contexto se score ≥ 30; após contexto, intervém se score ≥ 55', outcome: 'REQUEST_CONTEXT' },
  { id: 'R4', name: 'Risco alto após contexto', condition: 'Score 55–79 depois da verificação', outcome: 'INTERVENE' },
  { id: 'R5', name: 'Risco alto sem contexto', condition: 'Score 55–79 na primeira leitura', outcome: 'REQUEST_CONTEXT' },
  { id: 'R6', name: 'Orientação declarada', condition: 'Cliente declarou link recebido ou indicação de terceiro', outcome: 'REQUEST_CONTEXT', flag: 'context-on-declared-guidance' },
  { id: 'R7', name: 'Risco médio', condition: 'Score 30–54', outcome: 'APPROVE_WITH_ALERT' },
  { id: 'R8', name: 'Risco baixo', condition: 'Score < 30', outcome: 'APPROVE' },
]

export const ruleById = (id: string) => policyRules.find((r) => r.id === id) as PolicyRule

export const flagSpecs: { id: FlagId; label: string; description: string }[] = [
  { id: 'intelligence-matching', label: 'Relações da Intelligence na decisão', description: 'Destinos e vendedores citados em relatos de outros clientes entram como sinais.' },
  { id: 'dependency-discount', label: 'Desconto de evidências dependentes', description: 'Sinais que repetem o mesmo fato contam pela metade.' },
  { id: 'context-on-declared-guidance', label: 'Contexto para orientação declarada (R6)', description: 'Quando o cliente declara link recebido ou indicação, a verificação é solicitada.' },
  { id: 'guidance-floor', label: 'Intervenção mínima com orientação confirmada (R2)', description: 'Se a verificação confirma pedido de terceiro com contato prévio, a compra é pausada mesmo com score baixo.' },
]

export const providerSpecs: { id: ProviderId; label: string; fallback: string }[] = [
  { id: 'history', label: 'Perfil de gasto (emissor)', fallback: 'Sinais de valor e relacionamento deixam de existir; confiança cai.' },
  { id: 'device', label: 'Telemetria de dispositivo', fallback: 'Sem identificação de dispositivo; confiança cai.' },
  { id: 'merchant', label: 'Cadastro de vendedores', fallback: 'Sem reputação do vendedor.' },
  { id: 'intelligence', label: 'Intelligence', fallback: 'Relações com relatos não são consultadas.' },
]

export const decisionMeta: Record<Decision, { label: string; client: string; order: number }> = {
  APPROVE: { label: 'Aprovar', client: 'Compra aprovada', order: 0 },
  APPROVE_WITH_ALERT: { label: 'Aprovar com alerta', client: 'Compra aprovada com aviso', order: 1 },
  REQUEST_CONTEXT: { label: 'Pedir contexto', client: 'Confirmação necessária', order: 2 },
  INTERVENE: { label: 'Intervir', client: 'Compra pausada', order: 3 },
  BLOCK: { label: 'Bloquear', client: 'Compra interrompida', order: 4 },
}

export const isProtective = (d: Decision) => decisionMeta[d].order >= 2
