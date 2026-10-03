import type { DeclaredOrigin, IncidentChannel, IncidentType, ScenarioId, VerificationAnswers } from '../types/domain'
import { IDS } from './ids'
export interface ScenarioDef {
  id: ScenarioId
  code: string
  title: string
  summary: string
  customerId: string
  deviceId: string
  addressId: string
  
  providedAddress?: boolean
  cart: { productId: string; quantity: number }[]
  declaredOrigin: DeclaredOrigin
  
  canonicalAt: string
  
  answers: VerificationAnswers
  
  expected: string
  
  outside?: { channel: string; sender: string; messages: { at: string; text: string }[] }
  incidentTemplate?: {
    type: IncidentType
    channel: IncidentChannel
    contactHandle?: string
    contactLink?: string
    destinationText?: string
    description: string
    occurredAt: string
  }
}
export const scenarios: ScenarioDef[] = [
  {
    id: 'normal',
    code: 'A',
    title: 'Compra habitual',
    summary: 'Ana compra um mouse no notebook de sempre, com entrega em casa.',
    customerId: IDS.ana,
    deviceId: IDS.devAnaMac,
    addressId: IDS.addrAnaHome,
    cart: [{ productId: 'prod-010', quantity: 1 }],
    declaredOrigin: 'self',
    canonicalAt: '2026-09-28T12:10:30',
    answers: { origin: 'self', contact: 'no', address: 'mine' },
    expected: 'Aprovada: compra habitual em dispositivo e endereço conhecidos.',
  },
  {
    id: 'attention',
    code: 'B',
    title: 'Compra com atenção',
    summary: 'Ana compra uma câmera acima do seu gasto habitual, para o endereço do trabalho usado pela primeira vez.',
    customerId: IDS.ana,
    deviceId: IDS.devAnaPhone,
    addressId: IDS.addrAnaWork,
    cart: [{ productId: 'prod-014', quantity: 1 }],
    declaredOrigin: 'ad',
    canonicalAt: '2026-09-28T13:05:12',
    answers: { origin: 'self', contact: 'no', address: 'mine' },
    expected: 'Aprovada com alerta: a compra segue e a Aureon envia um aviso para ela confirmar.',
  },
  {
    id: 'hard',
    code: 'H',
    title: 'Parece legítima, mas não é',
    summary: 'Beatriz compra um console de vendedor conhecido, no celular dela, para a casa dela — orientada por telefone.',
    customerId: IDS.beatriz,
    deviceId: 'DEV-BEA-S23',
    addressId: 'ADDR-BEA-HOME',
    cart: [{ productId: 'prod-005', quantity: 1 }],
    declaredOrigin: 'guided',
    canonicalAt: '2026-09-28T13:40:05',
    answers: { origin: 'asked', contact: 'phone', address: 'mine' },
    expected: 'Tecnicamente tudo parece normal. Só o contexto revela a indução e leva à intervenção.',
    outside: {
      channel: 'Ligação telefônica',
      sender: '“Setor de prêmios” de uma operadora',
      messages: [
        { at: '13:31', text: 'Parabéns, a senhora foi sorteada. Para liberar o prêmio precisamos de uma compra de ativação.' },
        { at: '13:34', text: 'Compre o Console Vertex na NEXA, na loja Estação Games. O valor volta na próxima fatura.' },
        { at: '13:37', text: 'Não desligue. Fique na linha que eu acompanho a senhora até o fim.' },
      ],
    },
  },
  {
    id: 'induction',
    code: 'I',
    title: 'Possível indução',
    summary: 'Ana recebe mensagens de uma falsa central e é orientada a comprar um notebook para um ponto de retirada.',
    customerId: IDS.ana,
    deviceId: IDS.devAnaNew,
    addressId: IDS.addrPickupPedraLisa,
    providedAddress: true,
    cart: [{ productId: 'prod-001', quantity: 1 }],
    declaredOrigin: 'link',
    canonicalAt: '2026-09-28T14:31:02',
    answers: { origin: 'asked', contact: 'message', address: 'given' },
    expected: 'Contexto solicitado, respostas confirmam orientação de terceiro, intervenção. Ana interrompe a compra e depois registra o caso.',
    outside: {
      channel: 'Aplicativo de mensagens',
      sender: '“Central de Segurança”',
      messages: [
        { at: '14:18', text: 'Olá, Ana. Identificamos uma operação suspeita no seu cartão final 4417.' },
        { at: '14:19', text: 'Para cancelar, faça o procedimento de segurança em aureon-protecao.example' },
        { at: '14:22', text: 'Abra a NEXA e compre o notebook indicado. O valor é estornado em seguida.' },
        { at: '14:23', text: 'Use o endereço Rua Pedra Lisa, 880 — loja 3. É o nosso ponto de retirada.' },
        { at: '14:24', text: 'Se aparecer alguma pergunta de segurança, responda que ninguém está ajudando você.' },
      ],
    },
    incidentTemplate: {
      type: 'impersonation',
      channel: 'whatsapp',
      contactHandle: '(11) 90000-2184',
      contactLink: 'aureon-protecao.example',
      destinationText: 'Rua Pedra Lisa, 880 — loja 3',
      description:
        'Recebi mensagens de uma “Central de Segurança” dizendo que meu cartão tinha uma operação suspeita. Pediram para eu comprar um notebook na NEXA e entregar na Rua Pedra Lisa, 880 para cancelar a operação. O número era (11) 90000-2184 e o site aureon-protecao.example.',
      occurredAt: '2026-09-28T14:18:00',
    },
  },
  {
    id: 'related',
    code: 'C/D',
    title: 'Nova compra relacionada',
    summary: 'Mariana, outra cliente, é orientada a comprar um smartphone para o mesmo ponto de retirada.',
    customerId: IDS.mariana,
    deviceId: 'DEV-MAR-IPH',
    addressId: IDS.addrPickupPedraLisa,
    providedAddress: true,
    cart: [{ productId: 'prod-024', quantity: 1 }],
    declaredOrigin: 'guided',
    canonicalAt: '2026-09-28T17:06:15',
    answers: { origin: 'asked', contact: 'phone', address: 'given' },
    expected:
      'Antes do relato da Ana: contexto solicitado e intervenção. Depois do relato: o destino já está ligado a um incidente e a compra é bloqueada sem depender das respostas.',
    outside: {
      channel: 'Ligação telefônica',
      sender: '“Central de Segurança”',
      messages: [
        { at: '16:58', text: 'Senhora Mariana, detectamos uma clonagem no seu cartão final 7731.' },
        { at: '17:01', text: 'Para bloquear, faça uma compra de segurança do Smartphone Nova Pro na NEXA.' },
        { at: '17:03', text: 'Entregue na Rua Pedra Lisa, 880 — loja 3, nosso setor de perícia.' },
      ],
    },
  },
  {
    id: 'fragile',
    code: 'E',
    title: 'Aprovada, porém frágil',
    summary: 'Carlos compra um console no celular de sempre. A aprovação depende quase toda de uma única fonte: o dispositivo.',
    customerId: IDS.carlos,
    deviceId: 'DEV-CAR-PIX',
    addressId: 'ADDR-CAR-HOME',
    cart: [{ productId: 'prod-005', quantity: 1 }],
    declaredOrigin: 'self',
    canonicalAt: '2026-09-28T16:20:40',
    answers: { origin: 'self', contact: 'no', address: 'mine' },
    expected: 'Aprovada. O certificado de fragilidade mostra que, se a identificação do dispositivo estiver errada, a decisão muda.',
  },
]

// a constante/variável map e atribui a ela o resultado da expressão desta linha.
const map = new Map(scenarios.map((s) => [s.id, s]))
export const getScenario = (id: ScenarioId) => map.get(id) as ScenarioDef
export const scenarioList = scenarios.map((s) => s.id)
export const declaredOriginOptions: { id: DeclaredOrigin; label: string; hint: string }[] = [
  { id: 'self', label: 'Encontrei por conta própria', hint: 'Pesquisei ou já conhecia o produto.' },
  { id: 'ad', label: 'Vi um anúncio ou promoção', hint: 'Em rede social, e-mail ou site.' },
  { id: 'link', label: 'Recebi um link por mensagem', hint: 'SMS, e-mail ou aplicativo de mensagens.' },
  { id: 'guided', label: 'Alguém me indicou esta compra', hint: 'Por telefone, mensagem ou pessoalmente.' },
]
