export const IDS = {
  // clientes
  ana: 'CUST-001',
  carlos: 'CUST-002',
  mariana: 'CUST-003',
  rafael: 'CUST-004',
  beatriz: 'CUST-005',
  diego: 'CUST-006',
  helena: 'CUST-007',
  pedro: 'CUST-008',
  joana: 'CUST-009',

  // estabelecimentos (visão do emissor)
  nexa: 'MER-001',
  lumen: 'MER-002',
  alto: 'MER-003',
  vertice: 'MER-004',

  // vendedores do marketplace NEXA
  sellerNexa: 'SEL-001',
  sellerOnda: 'SEL-002',
  sellerCasa: 'SEL-003',
  sellerFerramenta: 'SEL-004',
  sellerNorte: 'SEL-005',
  sellerGames: 'SEL-006',
  sellerConecta: 'SEL-007',
  sellerPrime: 'SEL-008',

  // endereços usados na história
  addrAnaHome: 'ADDR-ANA-HOME',
  addrAnaWork: 'ADDR-ANA-WORK',
  addrPickupPedraLisa: 'ADDR-PICKUP-880',
  addrPickupRioClaro: 'ADDR-PICKUP-2110',

  // dispositivos usados na história
  devAnaMac: 'DEV-ANA-MBA',
  devAnaPhone: 'DEV-ANA-IPH',
  devAnaNew: 'DEV-ANA-W11',

  // incidentes semeados
  incJoana: 'CS-2026-001247',
  incRafael: 'CS-2026-001261',
  incPedro: 'CS-2026-001270',
} as const
export const TX_SEQ_BASELINE = 183
export const INCIDENT_SEQ_BASELINE = 1283
export function txIdFor(seq: number): string {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return `TX-2026-${String(seq).padStart(6, '0')}`
}
export function incidentIdFor(seq: number): string {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return `CS-2026-${String(seq).padStart(6, '0')}`
}
export function orderIdFor(seq: number): string {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return `NX-${48000 + seq}`
}
export function correlationIdFor(seq: number): string {
  // Declara a constante/variável h e atribui a ela o resultado da expressão desta linha.
  const h = Math.imul(seq ^ 0x5bd1e995, 0x9e3779b1) >>> 0
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return `CTX-2026-${(h >>> 8).toString(16).toUpperCase().padStart(6, '0').slice(-6)}`
}
export function seqOf(txId: string): number {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return Number(txId.slice(-6))
}
