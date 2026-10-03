import type { DeclaredOrigin, IncidentChannel, IncidentType, ProviderId, VerificationAnswers } from '../types/domain'
import { IDS } from './ids'
export interface SeedPurchase {
  seq: number
  at: string
  customerId: string
  merchantId: string
  deviceId: string
  addressId: string
  items?: { productId: string; quantity: number }[]
  description?: string
  amount?: number
  declaredOrigin?: DeclaredOrigin
  answers?: VerificationAnswers
  providersDown?: ProviderId[]
}
export interface SeedReport {
  seq: number
  at: string
  customerId: string
  txSeq: number
  type: IncidentType
  channel: IncidentChannel
  contactHandle?: string
  contactLink?: string
  destinationText?: string
  description: string
  occurredAt: string
  assignedAt?: string
  closedAt?: string
  closeNote?: string
}
export const seedPurchases: SeedPurchase[] = [
  { seq: 131, at: '2026-09-14T16:22:05', customerId: IDS.joana, merchantId: IDS.vertice, deviceId: 'DEV-JOA-IPAD', addressId: 'ADDR-JOA-HOME', description: 'Conjunto de panelas e utensílios', amount: 1240 },
  { seq: 136, at: '2026-09-16T10:08:44', customerId: IDS.carlos, merchantId: IDS.lumen, deviceId: 'DEV-CAR-PIX', addressId: 'ADDR-CAR-HOME', description: 'Impressora multifuncional', amount: 1299 },
  { seq: 142, at: '2026-09-18T19:40:12', customerId: IDS.mariana, merchantId: IDS.vertice, deviceId: 'DEV-MAR-IPH', addressId: 'ADDR-MAR-HOME', description: 'Luminárias e tapete', amount: 890 },
  { seq: 147, at: '2026-09-19T20:05:31', customerId: IDS.beatriz, merchantId: IDS.lumen, deviceId: 'DEV-BEA-S23', addressId: 'ADDR-BEA-HOME', description: 'Notebook para estudos', amount: 3180 },
  { seq: 149, at: '2026-09-20T12:31:09', customerId: IDS.beatriz, merchantId: IDS.nexa, deviceId: 'DEV-BEA-S23', addressId: 'ADDR-BEA-HOME', items: [{ productId: 'prod-012', quantity: 1 }], declaredOrigin: 'self' },
  { seq: 152, at: '2026-09-21T19:48:26', customerId: IDS.rafael, merchantId: IDS.alto, deviceId: 'DEV-RAF-MOTO', addressId: 'ADDR-RAF-HOME', description: 'Vale-presente digital', amount: 389 },
  { seq: 158, at: '2026-09-22T18:15:40', customerId: IDS.ana, merchantId: IDS.lumen, deviceId: IDS.devAnaMac, addressId: IDS.addrAnaHome, description: 'Fone e suporte para notebook', amount: 1120 },
  { seq: 164, at: '2026-09-24T13:02:18', customerId: IDS.ana, merchantId: IDS.vertice, deviceId: IDS.devAnaPhone, addressId: IDS.addrAnaHome, description: 'Jogo de cama', amount: 312 },
  {
    seq: 168,
    at: '2026-09-24T21:08:03',
    customerId: IDS.pedro,
    merchantId: IDS.nexa,
    deviceId: 'DEV-PED-IPH',
    addressId: IDS.addrPickupRioClaro,
    items: [{ productId: 'prod-026', quantity: 1 }],
    declaredOrigin: 'link',
    answers: { origin: 'self', contact: 'no', address: 'mine' },
  },
  { seq: 170, at: '2026-09-25T15:44:52', customerId: IDS.mariana, merchantId: IDS.nexa, deviceId: 'DEV-MAR-IPH', addressId: 'ADDR-MAR-HOME', items: [{ productId: 'prod-017', quantity: 1 }], declaredOrigin: 'self' },
  { seq: 171, at: '2026-09-26T09:12:37', customerId: IDS.ana, merchantId: IDS.alto, deviceId: IDS.devAnaPhone, addressId: IDS.addrAnaHome, description: 'Livros', amount: 86.4 },
  { seq: 175, at: '2026-09-27T18:50:15', customerId: IDS.diego, merchantId: IDS.vertice, deviceId: 'DEV-DIE-XPS', addressId: 'ADDR-DIE-HOME', description: 'Sofá retrátil', amount: 2349 },
  { seq: 176, at: '2026-09-28T08:12:22', customerId: IDS.carlos, merchantId: IDS.nexa, deviceId: 'DEV-CAR-PIX', addressId: 'ADDR-CAR-HOME', items: [{ productId: 'prod-009', quantity: 1 }], declaredOrigin: 'self' },
  { seq: 179, at: '2026-09-28T09:44:08', customerId: IDS.beatriz, merchantId: IDS.lumen, deviceId: 'DEV-BEA-S23', addressId: 'ADDR-BEA-HOME', description: 'Cafeteira e moedor', amount: 612 },
  { seq: 182, at: '2026-09-28T10:58:41', customerId: IDS.helena, merchantId: IDS.alto, deviceId: 'DEV-HEL-A54', addressId: 'ADDR-HEL-HOME', description: 'Livros', amount: 158, providersDown: ['device'] },
  { seq: 183, at: '2026-09-28T11:47:20', customerId: IDS.ana, merchantId: IDS.nexa, deviceId: IDS.devAnaMac, addressId: IDS.addrAnaHome, items: [{ productId: 'prod-003', quantity: 1 }], declaredOrigin: 'self' },
]
export const seedReports: SeedReport[] = [
  {
    seq: 1247,
    at: '2026-09-15T09:30:14',
    customerId: IDS.joana,
    txSeq: 131,
    type: 'unrecognized',
    channel: 'none',
    description: 'Não reconheci a compra na fatura. Depois descobri que foi meu filho usando o cartão salvo no tablet.',
    occurredAt: '2026-09-14T16:22:00',
    assignedAt: '2026-09-15T10:40:00',
    closedAt: '2026-09-15T11:03:00',
    closeNote: 'Compra familiar confirmada pela cliente. Sem relação com golpe.',
  },
  {
    seq: 1261,
    at: '2026-09-21T21:10:48',
    customerId: IDS.rafael,
    txSeq: 152,
    type: 'impersonation',
    channel: 'phone',
    contactHandle: '(11) 90000-2184',
    description:
      'Recebi uma ligação de alguém dizendo ser da central de segurança do cartão. A pessoa pediu que eu comprasse um vale-presente para “validar o cancelamento” de uma compra suspeita e me passasse o código.',
    occurredAt: '2026-09-21T19:35:00',
    assignedAt: '2026-09-22T08:40:00',
  },
  {
    seq: 1270,
    at: '2026-09-25T10:05:22',
    customerId: IDS.pedro,
    txSeq: 168,
    type: 'link',
    channel: 'sms',
    contactLink: 'aureon-protecao.example/validar',
    destinationText: 'Av. Rio Claro Novo, 2110 — box 14',
    description:
      'Recebi um SMS dizendo que meu cartão seria bloqueado. O link abriu uma página parecida com a do banco, que mandou comprar um tablet na NEXA como “compra de validação”, com retirada em um ponto indicado. A página dizia para responder que a compra era minha.',
    occurredAt: '2026-09-24T20:52:00',
    assignedAt: '2026-09-25T10:30:00',
  },
]
