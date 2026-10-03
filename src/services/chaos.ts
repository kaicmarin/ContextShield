import type { Assessment, Decision, EngineConfig, ScenarioId, TxStatus } from '../types/domain'
import { IDS } from '../mocks/ids'
import { getScenario } from '../mocks/scenarios'
import { AUTHORIZED } from './status'
import { decisionMeta } from './riskModel'
import {
  applyOnce,
  attemptTransition,
  buildSeedState,
  createTransaction,
  draftFromScenario,
  fileIncident,
  findTx,
  resolveIntervention,
  runInitialAssessment,
  runScenario,
  submitVerification,
  // Define um tipo/interface TypeScript. Esta parte serve para tipagem em desenvolvimento e não vira lógica JavaScript em runtime.
  type DomainState,
} from './pipeline'
export type ChaosVerdict = 'ROBUST' | 'DEGRADED' | 'INCONCLUSIVE' | 'UNSAFE SURVIVOR'
export interface ChaosStep {
  label: string
  detail: string
  tone: 'neutral' | 'ok' | 'warn' | 'risk' | 'info'
}
export interface ChaosResult {
  verdict: ChaosVerdict
  finalStatus: TxStatus
  finalDecision?: Decision
  baselineDecision?: Decision
  assessments: Assessment[]
  steps: ChaosStep[]
  explanation: string
  mitigation?: string
  counterfactual?: string
  rejected: number
}
export interface ChaosScenario {
  id: string
  n: number
  title: string
  perturbation: string
  base: string
  truth: 'golpe' | 'legítima'
  kind: 'evidência' | 'evento'
  run: (config: EngineConfig) => ChaosResult
}

// a função withConfig. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function withConfig(s: DomainState, config: EngineConfig): DomainState {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return { ...s, config }
}

// a função afterAna. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function afterAna(config: EngineConfig): DomainState {
  // Declara a constante/variável r e atribui a ela o resultado da expressão desta linha.
  const r = runScenario(withConfig(buildSeedState(), config), 'induction', { choice: 'cancel' })
  // Declara a constante/variável tpl e atribui a ela o resultado da expressão desta linha.
  const tpl = getScenario('induction').incidentTemplate
  // Verifica a condição antes de executar o bloco seguinte.
  if (!tpl) return r.s
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return fileIncident(r.s, { customerId: IDS.ana, txId: r.txId, consent: true, ...tpl }, '2026-09-28T14:52:07').s
}

// a função stepsFor. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function stepsFor(s: DomainState, txId: string): ChaosStep[] {
  // Declara a constante/variável tx e atribui a ela o resultado da expressão desta linha.
  const tx = findTx(s, txId)
  // Verifica a condição antes de executar o bloco seguinte.
  if (!tx) return []
  // Declara a constante/variável steps e atribui a ela o resultado da expressão desta linha.
  const steps: ChaosStep[] = []
  // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
  for (const a of tx.assessments) {
    steps.push({
      label: a.stage === 'initial' ? 'Primeira leitura' : 'Recalculado com contexto',
      detail: `Score ${a.score} · ${a.level} · confiança ${a.confidence} → ${decisionMeta[a.decision].label} (${a.ruleId})`,
      tone: a.decision === 'APPROVE' ? 'ok' : a.decision === 'APPROVE_WITH_ALERT' ? 'warn' : 'risk',
    })
  }
  steps.push({ label: 'Status final', detail: tx.status, tone: AUTHORIZED.includes(tx.status) ? 'warn' : 'info' })
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return steps
}

// a função judge. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function judge(truth: 'golpe' | 'legítima', final: Assessment | undefined, status: TxStatus, baseline?: Decision, extraSteps = false): ChaosVerdict {
  // Declara a constante/variável authorized e atribui a ela o resultado da expressão desta linha.
  const authorized = AUTHORIZED.includes(status)
  // Verifica a condição antes de executar o bloco seguinte.
  if (truth === 'golpe') {
    // Verifica a condição antes de executar o bloco seguinte.
    if (authorized) return 'UNSAFE SURVIVOR'
    // Verifica a condição antes de executar o bloco seguinte.
    if (final?.level === 'INCONCLUSIVE') return 'INCONCLUSIVE'
    // Verifica a condição antes de executar o bloco seguinte.
    if (final && baseline && (decisionMeta[final.decision].order < decisionMeta[baseline].order || extraSteps)) return 'DEGRADED'
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return 'ROBUST'
  }
  // Verifica a condição antes de executar o bloco seguinte.
  if (!authorized) return 'DEGRADED'
  // Verifica a condição antes de executar o bloco seguinte.
  if (final?.level === 'INCONCLUSIVE') return 'INCONCLUSIVE'
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return 'ROBUST'
}

// a função evidenceCase. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function evidenceCase(
  config: EngineConfig,
  opts: {
    truth: 'golpe' | 'legítima'
    scenario: ScenarioId
    postAna?: boolean
    configPatch?: (c: EngineConfig) => EngineConfig
    draft?: Parameters<typeof runScenario>[2]
  },
): { result: Omit<ChaosResult, 'explanation' | 'mitigation' | 'counterfactual'>; baseline?: Decision } {
  // Declara a constante/variável start e atribui a ela o resultado da expressão desta linha.
  const start = (c: EngineConfig) => (opts.postAna ? afterAna(c) : withConfig(buildSeedState(), c))
  // Declara a constante/variável base e atribui a ela o resultado da expressão desta linha.
  const base = runScenario(start(config), opts.scenario, { choice: 'cancel' })
  // Declara a constante/variável baseTx e atribui a ela o resultado da expressão desta linha.
  const baseTx = findTx(base.s, base.txId)
  // Declara a constante/variável baseline e atribui a ela o resultado da expressão desta linha.
  const baseline = baseTx?.assessments.at(-1)?.decision

  // Declara a constante/variável cfg e atribui a ela o resultado da expressão desta linha.
  const cfg = opts.configPatch ? opts.configPatch(config) : config
  // Declara a constante/variável r e atribui a ela o resultado da expressão desta linha.
  const r = runScenario(start(cfg), opts.scenario, opts.draft)
  // Declara a constante/variável tx e atribui a ela o resultado da expressão desta linha.
  const tx = findTx(r.s, r.txId)
  // Declara a constante/variável final e atribui a ela o resultado da expressão desta linha.
  const final = tx?.assessments.at(-1)
  // Declara a constante/variável status e atribui a ela o resultado da expressão desta linha.
  const status = tx?.status ?? 'RECEIVED'
  // Declara a constante/variável extraSteps e atribui a ela o resultado da expressão desta linha.
  const extraSteps = (tx?.assessments.length ?? 0) > (baseTx?.assessments.length ?? 0)
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return {
    baseline,
    result: {
      verdict: judge(opts.truth, final, status, baseline, extraSteps),
      finalStatus: status,
      finalDecision: final?.decision,
      baselineDecision: baseline,
      assessments: tx?.assessments ?? [],
      steps: stepsFor(r.s, r.txId),
      rejected: r.s.rejections.length - start(cfg).rejections.length,
    },
  }
}
export const chaosScenarios: ChaosScenario[] = [
  {
    id: 'liar',
    n: 1,
    title: 'Cliente orientado mente',
    perturbation: 'Beatriz é orientada a declarar que a compra é dela e a responder que ninguém a contatou.',
    base: 'Compra difícil: vendedor conhecido, dispositivo conhecido, entrega em casa.',
    truth: 'golpe',
    kind: 'evidência',
    run: (config) => {
      const { result } = evidenceCase(config, { truth: 'golpe', scenario: 'hard', draft: { draft: { declaredOrigin: 'self' }, answers: { origin: 'self', contact: 'no', address: 'mine' } } })
      // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
      return {
        ...result,
        explanation: 'Quando a pessoa esconde o contexto e todos os sinais técnicos são legítimos, não sobra evidência para agir. O motor aprova — e isso não é escondido.',
        mitigation: 'Aviso pós-compra no app, relato rápido em “Fui vítima” e Intelligence: o telefone e o roteiro relatados protegem as próximas pessoas.',
      }
    },
  },
  {
    id: 'merchant',
    n: 2,
    title: 'Merchant legítimo',
    perturbation: 'A mesma compra da Mariana, mas no vendedor NEXA Oficial em vez de um vendedor recente.',
    base: 'Nova compra relacionada, depois do relato da Ana.',
    truth: 'golpe',
    kind: 'evidência',
    run: (config) => {
      const { result } = evidenceCase(config, { truth: 'golpe', scenario: 'related', postAna: true, draft: { draft: { items: [{ productId: 'prod-002', quantity: 1 }] } } })
      // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
      return {
        ...result,
        explanation: 'Sem os sinais do vendedor, o score sai da faixa de bloqueio direto. O destino citado no relato ainda sustenta a proteção, mas agora ela depende de pedir contexto.',
      }
    },
  },
  {
    id: 'amount',
    n: 3,
    title: 'Valor normal',
    perturbation: 'A falsa central pede um mouse de R$ 249,90 em vez do notebook.',
    base: 'Possível indução (Ana), antes de qualquer relato.',
    truth: 'golpe',
    kind: 'evidência',
    run: (config) => {
      const { result } = evidenceCase(config, { truth: 'golpe', scenario: 'induction', draft: { draft: { items: [{ productId: 'prod-010', quantity: 1 }] } } })
      // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
      return { ...result, explanation: 'O valor deixa de pesar, mas dispositivo novo, destino de terceiro e origem por link ainda pedem contexto; as respostas levam à intervenção.' }
    },
  },
  {
    id: 'device',
    n: 4,
    title: 'Dispositivo conhecido',
    perturbation: 'Ana faz a compra induzida no próprio notebook, e não em um computador novo.',
    base: 'Possível indução (Ana), antes de qualquer relato.',
    truth: 'golpe',
    kind: 'evidência',
    run: (config) => {
      const { result } = evidenceCase(config, { truth: 'golpe', scenario: 'induction', draft: { draft: { deviceId: IDS.devAnaMac } } })
      // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
      return { ...result, explanation: 'A telemetria favorável reduz o score, mas não esconde o destino de terceiro nem a origem declarada. A decisão não dependia do dispositivo.' }
    },
  },
  {
    id: 'ai',
    n: 5,
    title: 'IA interpreta errado',
    perturbation: 'O assistente de mensagens (planejado) classifica o roteiro da falsa central como “sem sinais”.',
    base: 'Possível indução (Ana), antes de qualquer relato.',
    truth: 'golpe',
    kind: 'evidência',
    run: (config) => {
      const { result } = evidenceCase(config, { truth: 'golpe', scenario: 'induction' })
      // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
      return {
        ...result,
        steps: [{ label: 'Assistente de mensagens', detail: 'Classificação errada: “sem sinais” (simulada)', tone: 'warn' }, ...result.steps],
        explanation: 'A IA não é entrada do motor nem da política: ela só orienta o cliente no detector de mensagens. O erro fica restrito à orientação e a decisão não muda.',
      }
    },
  },
  {
    id: 'provider',
    n: 6,
    title: 'Provedor indisponível',
    perturbation: 'A Intelligence fica fora do ar durante a compra da Mariana.',
    base: 'Nova compra relacionada, depois do relato da Ana.',
    truth: 'golpe',
    kind: 'evidência',
    run: (config) => {
      const { result } = evidenceCase(config, { truth: 'golpe', scenario: 'related', postAna: true, configPatch: (c) => ({ ...c, providers: { ...c.providers, intelligence: 'down' } }) })
      // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
      return { ...result, explanation: 'Sem a Intelligence, o bloqueio direto vira pedido de contexto. A proteção se mantém pelas respostas, com confiança menor — modo degradado, não falha silenciosa.' }
    },
  },
  {
    id: 'duplicate',
    n: 7,
    title: 'Evento duplicado',
    perturbation: 'O checkout reenvia o mesmo pedido (mesmo request ID) depois de um timeout.',
    base: 'Compra habitual (Ana).',
    truth: 'legítima',
    kind: 'evento',
    run: (config) => {
      // Declara a constante/variável s e atribui a ela o resultado da expressão desta linha.
      let s = withConfig(buildSeedState(), config)
      // Declara a constante/variável before e atribui a ela o resultado da expressão desta linha.
      const before = s.transactions.length
      // Declara a constante/variável draft e atribui a ela o resultado da expressão desta linha.
      const draft = draftFromScenario('normal')
      // Declara a constante/variável create e atribui a ela o resultado da expressão desta linha.
      const create = (st: DomainState) => {
        // Declara a constante/variável r e atribui a ela o resultado da expressão desta linha.
        const r = createTransaction(st, draft, getScenario('normal').canonicalAt)
        // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
        return runInitialAssessment(r.s, r.txId)
      }
      // Declara a constante/variável first e atribui a ela o resultado da expressão desta linha.
      const first = applyOnce(s, 'REQ-NX-7781', create)
      // Declara a constante/variável second e atribui a ela o resultado da expressão desta linha.
      const second = applyOnce(first.s, 'REQ-NX-7781', create)
      s = second.s
      // Declara a constante/variável created e atribui a ela o resultado da expressão desta linha.
      const created = s.transactions.length - before
      // Declara a constante/variável tx e atribui a ela o resultado da expressão desta linha.
      const tx = s.transactions.at(-1)
      // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
      return {
        verdict: created === 1 ? 'ROBUST' : 'UNSAFE SURVIVOR',
        finalStatus: tx?.status ?? 'RECEIVED',
        finalDecision: tx?.assessments.at(-1)?.decision,
        assessments: tx?.assessments ?? [],
        steps: [
          { label: 'Envio 1 · REQ-NX-7781', detail: `Processado → ${tx?.id}`, tone: 'ok' },
          { label: 'Envio 2 · REQ-NX-7781', detail: second.duplicate ? 'Ignorado: request ID já processado' : 'Processado de novo', tone: second.duplicate ? 'info' : 'risk' },
          { label: 'Resultado', detail: `${created} transação criada, 1 cobrança`, tone: 'ok' },
        ],
        explanation: 'A chave de idempotência impede pedido e cobrança duplicados.',
        rejected: 0,
      }
    },
  },
  {
    id: 'late',
    n: 8,
    title: 'Evento atrasado',
    perturbation: 'As respostas da verificação chegam depois que a Ana já interrompeu a compra.',
    base: 'Possível indução (Ana), cancelada pela cliente.',
    truth: 'golpe',
    kind: 'evento',
    run: (config) => {
      // Declara a constante/variável r e atribui a ela o resultado da expressão desta linha.
      const r = runScenario(withConfig(buildSeedState(), config), 'induction', { choice: 'cancel' })
      // Declara a constante/variável before e atribui a ela o resultado da expressão desta linha.
      const before = r.s.rejections.length
      // Declara a constante/variável late e atribui a ela o resultado da expressão desta linha.
      const late = submitVerification(r.s, r.txId, { origin: 'self', contact: 'no', address: 'mine' })
      // Declara a constante/variável tx e atribui a ela o resultado da expressão desta linha.
      const tx = findTx(late, r.txId)
      // Declara a constante/variável rejected e atribui a ela o resultado da expressão desta linha.
      const rejected = late.rejections.length - before
      // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
      return {
        verdict: tx?.status === 'CANCELLED' ? 'ROBUST' : 'UNSAFE SURVIVOR',
        finalStatus: tx?.status ?? 'RECEIVED',
        finalDecision: tx?.assessments.at(-1)?.decision,
        assessments: tx?.assessments ?? [],
        steps: [
          ...stepsFor(r.s, r.txId),
          { label: 'Respostas atrasadas', detail: late.rejections.at(-1)?.reason ?? '—', tone: 'info' },
        ],
        explanation: 'CANCELLED é final: nenhum evento tardio reabre a transação nem gera aprovação.',
        rejected,
      }
    },
  },
  {
    id: 'order',
    n: 9,
    title: 'Evento fora de ordem',
    perturbation: 'Uma autorização chega antes do risco recalculado, enquanto a compra ainda espera contexto.',
    base: 'Possível indução (Ana).',
    truth: 'golpe',
    kind: 'evento',
    run: (config) => {
      // Declara a constante/variável created e atribui a ela o resultado da expressão desta linha.
      const created = createTransaction(withConfig(buildSeedState(), config), draftFromScenario('induction'), getScenario('induction').canonicalAt)
      // Declara a constante/variável s e atribui a ela o resultado da expressão desta linha.
      let s = runInitialAssessment(created.s, created.txId)
      // Declara a constante/variável early e atribui a ela o resultado da expressão desta linha.
      const early = attemptTransition(s, created.txId, 'APPROVED', 'TransactionAuthorized recebido fora de ordem')
      s = early.s
      s = submitVerification(s, created.txId, getScenario('induction').answers)
      s = resolveIntervention(s, created.txId, 'cancel')
      // Declara a constante/variável tx e atribui a ela o resultado da expressão desta linha.
      const tx = findTx(s, created.txId)
      // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
      return {
        verdict: !early.ok && tx?.status === 'CANCELLED' ? 'ROBUST' : 'UNSAFE SURVIVOR',
        finalStatus: tx?.status ?? 'RECEIVED',
        finalDecision: tx?.assessments.at(-1)?.decision,
        assessments: tx?.assessments ?? [],
        steps: [
          { label: 'Primeira leitura', detail: 'CONTEXT_REQUIRED', tone: 'info' },
          { label: 'Autorização antecipada', detail: early.ok ? 'Aceita (falha)' : `Rejeitada: ${s.rejections.at(-1)?.reason ?? ''}`, tone: early.ok ? 'risk' : 'ok' },
          ...stepsFor(s, created.txId).slice(1),
        ],
        explanation: 'CONTEXT_REQUIRED só vai para APPROVED com verificação concluída e risco recalculado baixo. A autorização antecipada é descartada.',
        rejected: early.ok ? 0 : 1,
      }
    },
  },
  {
    id: 'same-origin',
    n: 10,
    title: 'Duas evidências “independentes” com a mesma origem',
    perturbation: 'Ana compra a câmera em um computador novo; o SDK do dispositivo emite “dispositivo novo” e “sessão atípica”, que são o mesmo fato.',
    base: 'Compra com atenção (Ana), legítima.',
    truth: 'legítima',
    kind: 'evidência',
    run: (config) => {
      const { result } = evidenceCase(config, { truth: 'legítima', scenario: 'attention', draft: { draft: { deviceId: IDS.devAnaNew } } })
      // Declara a constante/variável off e atribui a ela o resultado da expressão desta linha.
      const off = evidenceCase(config, { truth: 'legítima', scenario: 'attention', configPatch: (c) => ({ ...c, flags: { ...c.flags, 'dependency-discount': false } }), draft: { draft: { deviceId: IDS.devAnaNew } } }).result
      // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
      return {
        ...result,
        explanation: 'Os dois sinais vêm da mesma telemetria. Com o desconto de dependência, contam uma vez e meia — não duas — e a confiança conta a fonte uma única vez.',
        counterfactual: `Sem o desconto: score ${off.assessments[0]?.score ?? '—'} → ${off.finalDecision ? decisionMeta[off.finalDecision].label : '—'} (${off.finalStatus}).`,
      }
    },
  },
  {
    id: 'severe',
    n: 11,
    title: 'Degradação severa',
    perturbation: 'Histórico, telemetria e cadastro de vendedores ficam indisponíveis ao mesmo tempo.',
    base: 'Possível indução (Ana), antes de qualquer relato.',
    truth: 'golpe',
    kind: 'evidência',
    run: (config) => {
      const { result } = evidenceCase(config, {
        truth: 'golpe',
        scenario: 'induction',
        configPatch: (c) => ({ ...c, providers: { ...c.providers, history: 'down', device: 'down', merchant: 'down' } }),
      })
      // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
      return { ...result, explanation: 'Sem fontes independentes, a confiança fica abaixo de 40. O motor não finge certeza: marca INCONCLUSIVE e só age porque a política pede contexto nesses casos.' }
    },
  },
]
