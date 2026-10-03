import type { Address, Card, Customer, Device } from '../types/domain'
import { IDS } from './ids'
export const customers: Customer[] = [
  { id: IDS.ana, name: 'Ana Martins', firstName: 'Ana', initials: 'AM', email: 'ana.martins@correio.example', phoneMask: '(11) 9••••-4102', city: 'São Paulo', since: '2021-03-14', segment: 'Platinum', spend: { avgTicket90d: 490, purchases90d: 11 } },
  { id: IDS.carlos, name: 'Carlos Menezes', firstName: 'Carlos', initials: 'CM', email: 'carlos.menezes@correio.example', phoneMask: '(19) 9••••-2217', city: 'Campinas', since: '2019-08-02', segment: 'Gold', spend: { avgTicket90d: 920, purchases90d: 9 } },
  { id: IDS.mariana, name: 'Mariana Rocha', firstName: 'Mariana', initials: 'MR', email: 'mariana.rocha@correio.example', phoneMask: '(11) 9••••-7730', city: 'São Paulo', since: '2022-06-20', segment: 'Platinum', spend: { avgTicket90d: 1170, purchases90d: 7 } },
  { id: IDS.rafael, name: 'Rafael Nunes', firstName: 'Rafael', initials: 'RN', email: 'rafael.nunes@correio.example', phoneMask: '(11) 9••••-5561', city: 'Guarulhos', since: '2020-11-05', segment: 'Essencial', spend: { avgTicket90d: 250, purchases90d: 14 } },
  { id: IDS.beatriz, name: 'Beatriz Lima', firstName: 'Beatriz', initials: 'BL', email: 'beatriz.lima@correio.example', phoneMask: '(11) 9••••-8840', city: 'São Paulo', since: '2023-02-11', segment: 'Platinum', spend: { avgTicket90d: 1410, purchases90d: 6 } },
  { id: IDS.diego, name: 'Diego Faria', firstName: 'Diego', initials: 'DF', email: 'diego.faria@correio.example', phoneMask: '(13) 9••••-3391', city: 'Santos', since: '2018-04-30', segment: 'Gold', spend: { avgTicket90d: 1100, purchases90d: 8 } },
  { id: IDS.helena, name: 'Helena Prado', firstName: 'Helena', initials: 'HP', email: 'helena.prado@correio.example', phoneMask: '(15) 9••••-0926', city: 'Sorocaba', since: '2024-04-09', segment: 'Essencial', spend: { avgTicket90d: 140, purchases90d: 2 } },
  { id: IDS.pedro, name: 'Pedro Alves', firstName: 'Pedro', initials: 'PA', email: 'pedro.alves@correio.example', phoneMask: '(11) 9••••-6612', city: 'Osasco', since: '2021-10-18', segment: 'Gold', spend: { avgTicket90d: 780, purchases90d: 5 } },
  { id: IDS.joana, name: 'Joana Ribeiro', firstName: 'Joana', initials: 'JR', email: 'joana.ribeiro@correio.example', phoneMask: '(11) 9••••-1453', city: 'São Paulo', since: '2017-01-23', segment: 'Platinum', spend: { avgTicket90d: 900, purchases90d: 10 } },
]
export const cards: Card[] = [
  { id: 'CARD-SIM-4417', customerId: IDS.ana, last4: '4417', holder: 'ANA MARTINS', product: 'Aureon Platinum', kind: 'Crédito', expiry: '08/31', limit: 18000, available: 14860, status: 'Ativo' },
  { id: 'CARD-SIM-2290', customerId: IDS.carlos, last4: '2290', holder: 'CARLOS MENEZES', product: 'Aureon Gold', kind: 'Crédito', expiry: '03/30', limit: 9000, available: 6420, status: 'Ativo' },
  { id: 'CARD-SIM-7731', customerId: IDS.mariana, last4: '7731', holder: 'MARIANA ROCHA', product: 'Aureon Platinum', kind: 'Crédito', expiry: '11/29', limit: 15000, available: 11980, status: 'Ativo' },
  { id: 'CARD-SIM-5102', customerId: IDS.rafael, last4: '5102', holder: 'RAFAEL NUNES', product: 'Aureon Essencial', kind: 'Crédito', expiry: '06/29', limit: 4000, available: 2870, status: 'Ativo' },
  { id: 'CARD-SIM-8846', customerId: IDS.beatriz, last4: '8846', holder: 'BEATRIZ LIMA', product: 'Aureon Platinum', kind: 'Crédito', expiry: '01/32', limit: 20000, available: 15310, status: 'Ativo' },
  { id: 'CARD-SIM-3368', customerId: IDS.diego, last4: '3368', holder: 'DIEGO FARIA', product: 'Aureon Gold', kind: 'Crédito', expiry: '09/30', limit: 12000, available: 8930, status: 'Ativo' },
  { id: 'CARD-SIM-9024', customerId: IDS.helena, last4: '9024', holder: 'HELENA PRADO', product: 'Aureon Essencial', kind: 'Crédito', expiry: '04/31', limit: 3000, available: 2710, status: 'Ativo' },
  { id: 'CARD-SIM-6615', customerId: IDS.pedro, last4: '6615', holder: 'PEDRO ALVES', product: 'Aureon Gold', kind: 'Crédito', expiry: '12/29', limit: 8000, available: 5080, status: 'Ativo' },
  { id: 'CARD-SIM-1459', customerId: IDS.joana, last4: '1459', holder: 'JOANA RIBEIRO', product: 'Aureon Platinum', kind: 'Crédito', expiry: '07/30', limit: 16000, available: 13240, status: 'Ativo' },
]
export const devices: Device[] = [
  { id: IDS.devAnaMac, customerId: IDS.ana, name: 'MacBook Air', detail: 'macOS · Safari', kind: 'laptop', location: 'São Paulo', firstSeen: '2024-02-10T20:14:00', lastSeen: '2026-09-28T11:46:10', trusted: true },
  { id: IDS.devAnaPhone, customerId: IDS.ana, name: 'iPhone 14', detail: 'iOS · App Aureon', kind: 'phone', location: 'São Paulo', firstSeen: '2023-05-02T09:30:00', lastSeen: '2026-09-28T09:05:00', trusted: true },
  { id: IDS.devAnaNew, customerId: IDS.ana, name: 'Computador Windows', detail: 'Windows 11 · Chrome', kind: 'desktop', location: 'São Paulo (rede diferente da habitual)', firstSeen: '2026-09-28T14:29:48', lastSeen: '2026-09-28T14:31:02', trusted: false },
  { id: 'DEV-CAR-PIX', customerId: IDS.carlos, name: 'Pixel 8', detail: 'Android · Chrome', kind: 'phone', location: 'Campinas', firstSeen: '2024-01-18T19:02:00', lastSeen: '2026-09-28T08:11:40', trusted: true },
  { id: 'DEV-MAR-IPH', customerId: IDS.mariana, name: 'iPhone 13', detail: 'iOS · Safari', kind: 'phone', location: 'São Paulo', firstSeen: '2022-07-03T12:40:00', lastSeen: '2026-09-25T15:43:00', trusted: true },
  { id: 'DEV-RAF-MOTO', customerId: IDS.rafael, name: 'Moto G84', detail: 'Android · Chrome', kind: 'phone', location: 'Guarulhos', firstSeen: '2024-06-11T08:20:00', lastSeen: '2026-09-21T19:47:00', trusted: true },
  { id: 'DEV-BEA-S23', customerId: IDS.beatriz, name: 'Galaxy S23', detail: 'Android · Samsung Internet', kind: 'phone', location: 'São Paulo', firstSeen: '2023-03-01T10:00:00', lastSeen: '2026-09-28T09:43:00', trusted: true },
  { id: 'DEV-DIE-XPS', customerId: IDS.diego, name: 'Notebook Dell', detail: 'Windows 11 · Edge', kind: 'laptop', location: 'Santos', firstSeen: '2026-09-27T18:31:00', lastSeen: '2026-09-27T18:50:00', trusted: false },
  { id: 'DEV-DIE-IPH', customerId: IDS.diego, name: 'iPhone 15', detail: 'iOS · App Aureon', kind: 'phone', location: 'Santos', firstSeen: '2023-11-20T07:45:00', lastSeen: '2026-09-27T12:10:00', trusted: true },
  { id: 'DEV-HEL-A54', customerId: IDS.helena, name: 'Galaxy A54', detail: 'Android · Chrome', kind: 'phone', location: 'Sorocaba', firstSeen: '2024-04-09T18:00:00', lastSeen: '2026-09-28T10:57:00', trusted: true },
  { id: 'DEV-PED-IPH', customerId: IDS.pedro, name: 'iPhone 12', detail: 'iOS · Safari', kind: 'phone', location: 'Osasco', firstSeen: '2022-01-15T21:10:00', lastSeen: '2026-09-24T21:07:00', trusted: true },
  { id: 'DEV-JOA-IPAD', customerId: IDS.joana, name: 'iPad Air', detail: 'iPadOS · Safari', kind: 'tablet', location: 'São Paulo', firstSeen: '2023-08-08T16:30:00', lastSeen: '2026-09-14T16:21:00', trusted: true },
]
export const addresses: Address[] = [
  { id: IDS.addrAnaHome, customerIds: [IDS.ana], label: 'Casa', line1: 'Rua das Acácias Brancas, 212', line2: 'apto 52', district: 'Jardim Aurora', city: 'São Paulo', zip: '04012-212', kind: 'home' },
  { id: IDS.addrAnaWork, customerIds: [IDS.ana], label: 'Trabalho', line1: 'Av. Horizonte Azul, 1500', line2: '9º andar', district: 'Vila Médici', city: 'São Paulo', zip: '01315-150', kind: 'work' },
  { id: IDS.addrPickupPedraLisa, customerIds: [], label: 'Ponto de retirada', line1: 'Rua Pedra Lisa, 880', line2: 'loja 3', district: 'Vila Serena', city: 'São Paulo', zip: '03318-880', kind: 'pickup' },
  { id: IDS.addrPickupRioClaro, customerIds: [], label: 'Ponto de retirada', line1: 'Av. Rio Claro Novo, 2110', line2: 'box 14', district: 'Parque Industrial', city: 'Osasco', zip: '06226-210', kind: 'pickup' },
  { id: 'ADDR-CAR-HOME', customerIds: [IDS.carlos], label: 'Casa', line1: 'Rua Monte Verde Alto, 318', district: 'Jardim das Oliveiras', city: 'Campinas', zip: '13044-318', kind: 'home' },
  { id: 'ADDR-MAR-HOME', customerIds: [IDS.mariana], label: 'Casa', line1: 'Rua Vale do Sol, 45', line2: 'casa 2', district: 'Jardim Primavera', city: 'São Paulo', zip: '02241-045', kind: 'home' },
  { id: 'ADDR-RAF-HOME', customerIds: [IDS.rafael], label: 'Casa', line1: 'Rua Serra Dourada, 77', district: 'Vila Rosa Clara', city: 'Guarulhos', zip: '07133-077', kind: 'home' },
  { id: 'ADDR-BEA-HOME', customerIds: [IDS.beatriz], label: 'Casa', line1: 'Rua Lago Azul, 940', line2: 'apto 131', district: 'Jardim Esmeralda', city: 'São Paulo', zip: '05588-940', kind: 'home' },
  { id: 'ADDR-DIE-HOME', customerIds: [IDS.diego], label: 'Casa', line1: 'Av. Maré Mansa, 1020', district: 'Ponta Clara', city: 'Santos', zip: '11065-020', kind: 'home' },
  { id: 'ADDR-HEL-HOME', customerIds: [IDS.helena], label: 'Casa', line1: 'Rua dos Girassóis Altos, 56', district: 'Vila Campestre', city: 'Sorocaba', zip: '18047-056', kind: 'home' },
  { id: 'ADDR-PED-HOME', customerIds: [IDS.pedro], label: 'Casa', line1: 'Rua Barão do Rio Seco, 403', district: 'Centro Novo', city: 'Osasco', zip: '06018-403', kind: 'home' },
  { id: 'ADDR-JOA-HOME', customerIds: [IDS.joana], label: 'Casa', line1: 'Rua Cedro Rosa, 1188', line2: 'apto 34', district: 'Vila Amparo', city: 'São Paulo', zip: '04126-188', kind: 'home' },
]

// a constante/variável byId e atribui a ela o resultado da expressão desta linha.
const byId = <T extends { id: string }>(list: T[]) => new Map(list.map((x) => [x.id, x]))
// a constante/variável customerMap e atribui a ela o resultado da expressão desta linha.
const customerMap = byId(customers)
// a constante/variável cardMap e atribui a ela o resultado da expressão desta linha.
const cardMap = byId(cards)
// a constante/variável deviceMap e atribui a ela o resultado da expressão desta linha.
const deviceMap = byId(devices)
// a constante/variável addressMap e atribui a ela o resultado da expressão desta linha.
const addressMap = byId(addresses)
export const getCustomer = (id: string) => customerMap.get(id)
export const getCard = (id: string) => cardMap.get(id)
export const getDevice = (id: string) => deviceMap.get(id)
export const getAddress = (id: string) => addressMap.get(id)
export const cardFor = (customerId: string) => cards.find((c) => c.customerId === customerId)
export const devicesFor = (customerId: string) => devices.filter((d) => d.customerId === customerId)
export const addressesFor = (customerId: string) => addresses.filter((a) => a.customerIds.includes(customerId))
export const homeAddressFor = (customerId: string) => addresses.find((a) => a.kind === 'home' && a.customerIds.includes(customerId))
export function addressLine(a: Address): string {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return `${a.line1}${a.line2 ? ` — ${a.line2}` : ''}`
}
export function addressFull(a: Address): string {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return `${addressLine(a)} · ${a.district}, ${a.city}`
}
