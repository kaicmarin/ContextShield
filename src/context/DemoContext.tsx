import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type {
  Customer,
  DeclaredOrigin,
  FlagId,
  Incident,
  IncidentChannel,
  IncidentType,
  ProviderId,
  ProviderStatus,
  ScenarioId,
  Transaction,
  VerificationAnswers,
} from '../types/domain'
import { getScenario, type ScenarioDef } from '../mocks/scenarios'
import { getCustomer } from '../mocks/people'
import { IDS } from '../mocks/ids'
import {
  STATE_VERSION,
  abandonVerification as abandonOp,
  applyOnce,
  assignCase as assignOp,
  buildSeedState,
  closeCase as closeOp,
  createTransaction,
  draftFromScenario,
  fileIncident as fileOp,
  findIncident,
  findTx,
  loadStory as loadStoryOp,
  resolveIntervention as resolveOp,
  runInitialAssessment,
  setFlag as setFlagOp,
  setProvider as setProviderOp,
  submitVerification as submitOp,
  // Define um tipo/interface TypeScript. Esta parte serve para tipagem em desenvolvimento e não vira lógica JavaScript em runtime.
  type DomainState,
} from '../services/pipeline'
import { buildIntelligence, type IntelSnapshot } from '../services/intel'
import { useToast } from './ToastContext'
export interface CheckoutDraft {
  addressId: string
  declaredOrigin?: DeclaredOrigin
  installments: number
  requestId: string
}
export interface IncidentForm {
  type?: IncidentType
  txId?: string
  channel?: IncidentChannel
  contactHandle?: string
  contactLink?: string
  destinationText?: string
  description?: string
  occurredAt?: string
  consent?: boolean
}

// um tipo/interface TypeScript. Esta parte serve para tipagem em desenvolvimento e não vira lógica JavaScript em runtime.
interface Session {
  scenarioId: ScenarioId
  viewerId: string
  checkout: CheckoutDraft
  incident: IncidentForm
  activeTxId?: string
  requestSeq: number
}

// um tipo/interface TypeScript. Esta parte serve para tipagem em desenvolvimento e não vira lógica JavaScript em runtime.
interface Persisted {
  v: number
  domain: DomainState
  session: Session
}

// a constante/variável STORAGE_KEY e atribui a ela o resultado da expressão desta linha.
const STORAGE_KEY = 'contextshield-state'

// a função checkoutFor. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function checkoutFor(id: ScenarioId, seq: number): CheckoutDraft {
  // Declara a constante/variável sc e atribui a ela o resultado da expressão desta linha.
  const sc = getScenario(id)
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return { addressId: sc.addressId, declaredOrigin: undefined, installments: 10, requestId: `REQ-NX-${String(7700 + seq)}` }
}

// a função defaultSession. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function defaultSession(): Session {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return { scenarioId: 'induction', viewerId: IDS.ana, checkout: checkoutFor('induction', 1), incident: {}, requestSeq: 1 }
}

// a função load. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function load(): Persisted {
  // Declara a constante/variável fresh e atribui a ela o resultado da expressão desta linha.
  const fresh = (): Persisted => ({ v: STATE_VERSION, domain: buildSeedState(), session: defaultSession() })
  // Inicia um bloco protegido para operações que podem lançar erro.
  try {
    // Declara a constante/variável raw e atribui a ela o resultado da expressão desta linha.
    const raw = window.localStorage.getItem(STORAGE_KEY)
    // Verifica a condição antes de executar o bloco seguinte.
    if (!raw) return fresh()
    // Declara a constante/variável parsed e atribui a ela o resultado da expressão desta linha.
    const parsed = JSON.parse(raw) as Partial<Persisted>
    // Verifica a condição antes de executar o bloco seguinte.
    if (parsed.v !== STATE_VERSION || !parsed.domain || parsed.domain.version !== STATE_VERSION || !parsed.session) return fresh()
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return { v: STATE_VERSION, domain: parsed.domain, session: { ...defaultSession(), ...parsed.session } }
  } catch {
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return fresh()
  }
}

// um tipo/interface TypeScript. Esta parte serve para tipagem em desenvolvimento e não vira lógica JavaScript em runtime.
interface DemoValue {
  domain: DomainState
  now: string
  intel: IntelSnapshot
  transactions: Transaction[]
  incidents: Incident[]
  scenario: ScenarioDef
  shopper: Customer
  viewer: Customer
  checkout: CheckoutDraft
  incidentForm: IncidentForm
  activeTx: Transaction | undefined
  getTx: (id: string | undefined) => Transaction | undefined
  getTxByOrder: (orderId: string | undefined) => Transaction | undefined
  getIncident: (id: string | undefined) => Incident | undefined
  // Atualiza o estado associado ao setter desta variável; o React agenda uma nova renderização quando necessário.
  setScenario: (id: ScenarioId) => void
  // Atualiza o estado associado ao setter desta variável; o React agenda uma nova renderização quando necessário.
  setViewer: (customerId: string) => void
  // Atualiza o estado associado ao setter desta variável; o React agenda uma nova renderização quando necessário.
  setCheckout: (patch: Partial<Omit<CheckoutDraft, 'requestId'>>) => void
  placeOrder: (items: { productId: string; quantity: number }[]) => string
  runAnalysis: (txId: string) => void
  answerVerification: (txId: string, answers: VerificationAnswers) => void
  resolveIntervention: (txId: string, choice: 'cancel' | 'continue') => void
  abandonVerification: (txId: string) => void
  // Atualiza o estado associado ao setter desta variável; o React agenda uma nova renderização quando necessário.
  setIncidentForm: (patch: Partial<IncidentForm>) => void
  resetIncidentForm: (patch?: Partial<IncidentForm>) => void
  submitIncident: () => string | undefined
  assignCase: (incidentId: string) => void
  closeCase: (incidentId: string, as: 'resolved' | 'not-scam', note: string) => void
  // Atualiza o estado associado ao setter desta variável; o React agenda uma nova renderização quando necessário.
  setFlag: (flag: FlagId, value: boolean) => void
  // Atualiza o estado associado ao setter desta variável; o React agenda uma nova renderização quando necessário.
  setProvider: (provider: ProviderId, status: ProviderStatus) => void
  loadStory: () => void
  reset: () => void
}

// O contexto DemoContext, usado para compartilhar dados entre componentes sem passar props manualmente.
const DemoContext = createContext<DemoValue | null>(null)
export function DemoProvider({ children }: { children: ReactNode }) {
  // Declara a constante/variável initial e atribui a ela o resultado da expressão desta linha.
  const initial = useRef<Persisted>()
  // Verifica a condição antes de executar o bloco seguinte.
  if (!initial.current) initial.current = load()
  const [domain, setDomain] = useState<DomainState>(initial.current.domain)
  const [session, setSession] = useState<Session>(initial.current.session)
  // Declara a constante/variável domainRef e atribui a ela o resultado da expressão desta linha.
  const domainRef = useRef(domain)
  // Declara a constante/variável sessionRef e atribui a ela o resultado da expressão desta linha.
  const sessionRef = useRef(session)
  const { pushToast } = useToast()

  // Executa o hook useEffect, conectando esta parte do componente ao mecanismo correspondente do React.
  useEffect(() => {
    // Inicia um bloco protegido para operações que podem lançar erro.
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: STATE_VERSION, domain, session } satisfies Persisted))
    } catch {}
  }, [domain, session])

  
  // Guarda em commit uma função memorizada para manter a mesma referência enquanto as dependências não mudarem.
  const commit = useCallback((next: DomainState) => {
    domainRef.current = next
    // Atualiza o estado associado ao setter desta variável; o React agenda uma nova renderização quando necessário.
    setDomain(next)
  }, [])
  // Guarda em patchSession uma função memorizada para manter a mesma referência enquanto as dependências não mudarem.
  const patchSession = useCallback((fn: (s: Session) => Session) => {
    sessionRef.current = fn(sessionRef.current)
    // Atualiza o estado associado ao setter desta variável; o React agenda uma nova renderização quando necessário.
    setSession(sessionRef.current)
  }, [])

  // Guarda em intel um valor memorizado para evitar recalcular a expressão quando as dependências não mudarem.
  const intel = useMemo(() => buildIntelligence(domain.incidents, domain.transactions), [domain.incidents, domain.transactions])
  // Guarda em transactions um valor memorizado para evitar recalcular a expressão quando as dependências não mudarem.
  const transactions = useMemo(() => [...domain.transactions].sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [domain.transactions])
  // Guarda em incidents um valor memorizado para evitar recalcular a expressão quando as dependências não mudarem.
  const incidents = useMemo(() => [...domain.incidents].sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [domain.incidents])

  // Guarda em setScenario uma função memorizada para manter a mesma referência enquanto as dependências não mudarem.
  const setScenario = useCallback(
    (id: ScenarioId) => {
      patchSession((s) => ({ ...s, scenarioId: id, viewerId: getScenario(id).customerId, checkout: checkoutFor(id, s.requestSeq + 1), requestSeq: s.requestSeq + 1, activeTxId: undefined }))
    },
    [patchSession],
  )

  // Guarda em setViewer uma função memorizada para manter a mesma referência enquanto as dependências não mudarem.
  const setViewer = useCallback((customerId: string) => patchSession((s) => ({ ...s, viewerId: customerId })), [patchSession])

  // Guarda em setCheckout uma função memorizada para manter a mesma referência enquanto as dependências não mudarem.
  const setCheckout = useCallback((patch: Partial<Omit<CheckoutDraft, 'requestId'>>) => {
    patchSession((s) => ({ ...s, checkout: { ...s.checkout, ...patch } }))
  }, [patchSession])

  // Guarda em placeOrder uma função memorizada para manter a mesma referência enquanto as dependências não mudarem.
  const placeOrder = useCallback(
    (items: { productId: string; quantity: number }[]) => {
      // Declara a constante/variável s e atribui a ela o resultado da expressão desta linha.
      const s = sessionRef.current
      // Declara a constante/variável sc e atribui a ela o resultado da expressão desta linha.
      const sc = getScenario(s.scenarioId)
      // Declara a constante/variável existing e atribui a ela o resultado da expressão desta linha.
      const existing = s.activeTxId && domainRef.current.processed.includes(s.checkout.requestId) ? s.activeTxId : undefined
      // Verifica a condição antes de executar o bloco seguinte.
      if (existing) return existing
      // Declara a constante/variável txId e atribui a ela o resultado da expressão desta linha.
      let txId = ''
      // Declara a constante/variável r e atribui a ela o resultado da expressão desta linha.
      const r = applyOnce(domainRef.current, s.checkout.requestId, (st) => {
        // Declara a constante/variável created e atribui a ela o resultado da expressão desta linha.
        const created = createTransaction(
          st,
          draftFromScenario(sc.id, { items, addressId: s.checkout.addressId, declaredOrigin: s.checkout.declaredOrigin, installments: s.checkout.installments }),
          sc.canonicalAt,
        )
        txId = created.txId
        // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
        return created.s
      })
      commit(r.s)
      patchSession((x) => ({ ...x, activeTxId: txId }))
      // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
      return txId
    },
    [commit, patchSession],
  )

  // Guarda em nextRequest uma função memorizada para manter a mesma referência enquanto as dependências não mudarem.
  const nextRequest = useCallback(() => {
    patchSession((s) => ({ ...s, requestSeq: s.requestSeq + 1, checkout: { ...s.checkout, requestId: `REQ-NX-${String(7700 + s.requestSeq + 1)}` } }))
  }, [patchSession])

  // Guarda em runAnalysis uma função memorizada para manter a mesma referência enquanto as dependências não mudarem.
  const runAnalysis = useCallback(
    (txId: string) => {
      commit(runInitialAssessment(domainRef.current, txId))
      nextRequest()
    },
    [commit, nextRequest],
  )

  // Guarda em answerVerification uma função memorizada para manter a mesma referência enquanto as dependências não mudarem.
  const answerVerification = useCallback((txId: string, answers: VerificationAnswers) => commit(submitOp(domainRef.current, txId, answers)), [commit])
  // Guarda em resolveIntervention uma função memorizada para manter a mesma referência enquanto as dependências não mudarem.
  const resolveIntervention = useCallback((txId: string, choice: 'cancel' | 'continue') => commit(resolveOp(domainRef.current, txId, choice)), [commit])
  // Guarda em abandonVerification uma função memorizada para manter a mesma referência enquanto as dependências não mudarem.
  const abandonVerification = useCallback((txId: string) => commit(abandonOp(domainRef.current, txId)), [commit])

  // Guarda em setIncidentForm uma função memorizada para manter a mesma referência enquanto as dependências não mudarem.
  const setIncidentForm = useCallback((patch: Partial<IncidentForm>) => patchSession((s) => ({ ...s, incident: { ...s.incident, ...patch } })), [patchSession])
  // Guarda em resetIncidentForm uma função memorizada para manter a mesma referência enquanto as dependências não mudarem.
  const resetIncidentForm = useCallback((patch?: Partial<IncidentForm>) => patchSession((s) => ({ ...s, incident: { ...patch } })), [patchSession])

  // Guarda em submitIncident uma função memorizada para manter a mesma referência enquanto as dependências não mudarem.
  const submitIncident = useCallback(() => {
    // Declara a constante/variável s e atribui a ela o resultado da expressão desta linha.
    const s = sessionRef.current
    // Declara a constante/variável f e atribui a ela o resultado da expressão desta linha.
    const f = s.incident
    // Verifica a condição antes de executar o bloco seguinte.
    if (!f.type || !f.description?.trim() || !f.consent) return undefined
    // Declara a constante/variável r e atribui a ela o resultado da expressão desta linha.
    const r = fileOp(domainRef.current, {
      customerId: s.viewerId,
      txId: !f.txId || f.txId === 'none' ? undefined : f.txId,
      type: f.type,
      channel: f.channel ?? 'none',
      contactHandle: f.contactHandle,
      contactLink: f.contactLink,
      destinationText: f.destinationText,
      description: f.description,
      occurredAt: f.occurredAt ?? domainRef.current.clock,
      consent: true,
    })
    commit(r.s)
    patchSession((x) => ({ ...x, incident: {} }))
    pushToast({ tone: 'ok', title: 'Relato registrado', body: `Protocolo ${r.incidentId}` })
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return r.incidentId
  }, [commit, patchSession, pushToast])

  // Guarda em assignCase uma função memorizada para manter a mesma referência enquanto as dependências não mudarem.
  const assignCase = useCallback((id: string) => commit(assignOp(domainRef.current, id)), [commit])
  // Guarda em closeCase uma função memorizada para manter a mesma referência enquanto as dependências não mudarem.
  const closeCase = useCallback((id: string, as: 'resolved' | 'not-scam', note: string) => commit(closeOp(domainRef.current, id, as, note)), [commit])
  // Guarda em setFlag uma função memorizada para manter a mesma referência enquanto as dependências não mudarem.
  const setFlag = useCallback((flag: FlagId, value: boolean) => commit(setFlagOp(domainRef.current, flag, value)), [commit])
  // Guarda em setProvider uma função memorizada para manter a mesma referência enquanto as dependências não mudarem.
  const setProvider = useCallback((p: ProviderId, status: ProviderStatus) => commit(setProviderOp(domainRef.current, p, status)), [commit])

  // Guarda em loadStory uma função memorizada para manter a mesma referência enquanto as dependências não mudarem.
  const loadStory = useCallback(() => {
    commit(loadStoryOp(domainRef.current))
    pushToast({ tone: 'info', title: 'História carregada', body: 'Ana interrompeu e relatou; a compra da Mariana passou pelo motor depois do relato.' })
  }, [commit, pushToast])

  // Guarda em reset uma função memorizada para manter a mesma referência enquanto as dependências não mudarem.
  const reset = useCallback(() => {
    commit(buildSeedState())
    patchSession(() => defaultSession())
    pushToast({ tone: 'info', title: 'Demonstração reiniciada', body: 'Histórico anterior a 28 set restaurado.' })
  }, [commit, patchSession, pushToast])

  // Guarda em getTx uma função memorizada para manter a mesma referência enquanto as dependências não mudarem.
  const getTx = useCallback((id: string | undefined) => findTx(domain, id), [domain])
  // Guarda em getTxByOrder uma função memorizada para manter a mesma referência enquanto as dependências não mudarem.
  const getTxByOrder = useCallback((orderId: string | undefined) => (orderId ? domain.transactions.find((t) => t.orderId === orderId) : undefined), [domain])
  // Guarda em getIncident uma função memorizada para manter a mesma referência enquanto as dependências não mudarem.
  const getIncident = useCallback((id: string | undefined) => findIncident(domain, id), [domain])

  // Declara a constante/variável scenario e atribui a ela o resultado da expressão desta linha.
  const scenario = getScenario(session.scenarioId)
  // Declara a constante/variável shopper e atribui a ela o resultado da expressão desta linha.
  const shopper = getCustomer(scenario.customerId) as Customer
  // Declara a constante/variável viewer e atribui a ela o resultado da expressão desta linha.
  const viewer = (getCustomer(session.viewerId) ?? shopper) as Customer

  // Guarda em value um valor memorizado para evitar recalcular a expressão quando as dependências não mudarem.
  const value = useMemo<DemoValue>(
    () => ({
      domain,
      now: domain.clock,
      intel,
      transactions,
      incidents,
      scenario,
      shopper,
      viewer,
      checkout: session.checkout,
      incidentForm: session.incident,
      activeTx: findTx(domain, session.activeTxId),
      getTx,
      getTxByOrder,
      getIncident,
      setScenario,
      setViewer,
      setCheckout,
      placeOrder,
      runAnalysis,
      answerVerification,
      resolveIntervention,
      abandonVerification,
      setIncidentForm,
      resetIncidentForm,
      submitIncident,
      assignCase,
      closeCase,
      setFlag,
      setProvider,
      loadStory,
      reset,
    }),
    [domain, intel, transactions, incidents, scenario, shopper, viewer, session, getTx, getTxByOrder, getIncident, setScenario, setViewer, setCheckout, placeOrder, runAnalysis, answerVerification, resolveIntervention, abandonVerification, setIncidentForm, resetIncidentForm, submitIncident, assignCase, closeCase, setFlag, setProvider, loadStory, reset],
  )

  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}
export function useDemo(): DemoValue {
  // Declara a constante/variável ctx e atribui a ela o resultado da expressão desta linha.
  const ctx = useContext(DemoContext)
  // Verifica a condição antes de executar o bloco seguinte.
  if (!ctx) throw new Error('useDemo deve ser usado dentro de DemoProvider')
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return ctx
}
