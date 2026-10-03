import type { Association, EntityKind, Incident, IncidentChannel, IntelEntity, Pattern, Relation, Transaction } from '../types/domain'
import { getMerchant } from '../mocks/merchants'
import { addressLine, addresses, getAddress, getCustomer } from '../mocks/people'
import { getSeller } from '../mocks/sellers'
import { seqOf } from '../mocks/ids'

// a constante/variável PHONE_RE e atribui a ela o resultado da expressão desta linha.
const PHONE_RE = /\(?\b\d{2}\)?\s?9?\d{4,5}-?\d{4}\b/g
// a constante/variável DOMAIN_RE e atribui a ela o resultado da expressão desta linha.
const DOMAIN_RE = /\b[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:example|com\.br|com|net|org|online|site|info)\b/gi
// a constante/variável OFFICIAL_DOMAINS e atribui a ela o resultado da expressão desta linha.
const OFFICIAL_DOMAINS = new Set(['nexa.example', 'aureon.example'])
// a constante/variável ACCOUNT_CUES e atribui a ela o resultado da expressão desta linha.
const ACCOUNT_CUES: { re: RegExp; id: string; value: string }[] = [
  { re: /central de seguran[çc]a/i, id: 'ENT-ACCOUNT-CENTRAL', value: 'Perfil “Central de Segurança”' },
  { re: /setor de pr[êe]mios/i, id: 'ENT-ACCOUNT-PREMIOS', value: 'Perfil “Setor de prêmios”' },
]

// a constante/variável strip e atribui a ela o resultado da expressão desta linha.
const strip = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
export function normalizePhone(raw: string): string {
  // Declara a constante/variável d e atribui a ela o resultado da expressão desta linha.
  const d = raw.replace(/\D/g, '')
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return d.startsWith('55') && d.length > 11 ? d.slice(2) : d
}
export function formatPhone(digits: string): string {
  // Verifica a condição antes de executar o bloco seguinte.
  if (digits.length === 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  // Verifica a condição antes de executar o bloco seguinte.
  if (digits.length === 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return digits
}
export function normalizeDomain(raw: string): string {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/[/?#].*$/, '')
}
export const phoneEntityId = (digits: string) => `ENT-PHONE-${digits.slice(-8)}`
export const domainEntityId = (host: string) => `ENT-DOMAIN-${host.replace(/\.example$/, '').replace(/[^a-z0-9]/g, '').toUpperCase().slice(0, 20)}`
export const destinationEntityId = (addressId: string) => `ENT-DEST-${addressId.replace(/^ADDR-/, '')}`
export const sellerEntityId = (sellerId: string) => `ENT-${sellerId}`
export const merchantEntityId = (merchantId: string) => `ENT-${merchantId}`
export function matchAddressText(text: string) {
  // Declara a constante/variável t e atribui a ela o resultado da expressão desta linha.
  const t = strip(text)
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return addresses.find((a) => t.includes(strip(a.line1)))
}

// um tipo/interface TypeScript. Esta parte serve para tipagem em desenvolvimento e não vira lógica JavaScript em runtime.
interface Mention {
  id: string
  kind: EntityKind
  value: string
  sub: string
  reason: string
}

// a função monthYear. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function monthYear(iso: string) {
  // Declara a constante/variável m e atribui a ela o resultado da expressão desta linha.
  const m = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
  // Declara a constante/variável d e atribui a ela o resultado da expressão desta linha.
  const d = new Date(iso)
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return `${m[d.getMonth()]} ${d.getFullYear()}`
}

// a função destinationMention. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function destinationMention(addressId: string, reason: string): Mention | undefined {
  // Declara a constante/variável a e atribui a ela o resultado da expressão desta linha.
  const a = getAddress(addressId)
  // Verifica a condição antes de executar o bloco seguinte.
  if (!a) return undefined
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return { id: destinationEntityId(a.id), kind: 'destination', value: addressLine(a), sub: `${a.label} · ${a.district}, ${a.city}`, reason }
}

// a função sellerMention. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function sellerMention(sellerId: string, reason: string): Mention | undefined {
  // Declara a constante/variável s e atribui a ela o resultado da expressão desta linha.
  const s = getSeller(sellerId)
  // Verifica a condição antes de executar o bloco seguinte.
  if (!s) return undefined
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return { id: sellerEntityId(s.id), kind: 'seller', value: s.name, sub: `Vendedor NEXA desde ${monthYear(s.since)}`, reason }
}
export function txSellerIds(tx: Pick<Transaction, 'items' | 'sellerId'>): string[] {
  // Declara a constante/variável ids e atribui a ela o resultado da expressão desta linha.
  const ids = new Set(tx.items.map((i) => i.sellerId))
  // Verifica a condição antes de executar o bloco seguinte.
  if (tx.sellerId) ids.add(tx.sellerId)
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return [...ids]
}
export function incidentMentions(incident: Incident, tx?: Transaction): Mention[] {
  // Declara a constante/variável out e atribui a ela o resultado da expressão desta linha.
  const out: Mention[] = []
  // Declara a constante/variável text e atribui a ela o resultado da expressão desta linha.
  const text = [incident.contactHandle, incident.contactLink, incident.destinationText, incident.description].filter(Boolean).join(' \n ')

  // Declara a constante/variável phones e atribui a ela o resultado da expressão desta linha.
  const phones = new Set<string>()
  // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
  for (const m of text.match(PHONE_RE) ?? []) {
    // Declara a constante/variável d e atribui a ela o resultado da expressão desta linha.
    const d = normalizePhone(m)
    // Verifica a condição antes de executar o bloco seguinte.
    if (d.length >= 10) phones.add(d)
  }
  // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
  for (const d of phones) {
    out.push({ id: phoneEntityId(d), kind: 'phone', value: formatPhone(d), sub: 'Telefone citado em relato', reason: `Telefone informado no relato ${incident.id}` })
  }

  // Declara a constante/variável domains e atribui a ela o resultado da expressão desta linha.
  const domains = new Set<string>()
  // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
  for (const m of text.match(DOMAIN_RE) ?? []) {
    // Declara a constante/variável host e atribui a ela o resultado da expressão desta linha.
    const host = normalizeDomain(m)
    // Verifica a condição antes de executar o bloco seguinte.
    if (!OFFICIAL_DOMAINS.has(host)) domains.add(host)
  }
  // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
  for (const host of domains) {
    out.push({ id: domainEntityId(host), kind: 'domain', value: host, sub: 'Domínio citado em relato', reason: `Link informado no relato ${incident.id}` })
  }

  // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
  for (const cue of ACCOUNT_CUES) {
    // Verifica a condição antes de executar o bloco seguinte.
    if (cue.re.test(text)) out.push({ id: cue.id, kind: 'account', value: cue.value, sub: 'Identidade usada no contato', reason: `Nome usado pelo contato no relato ${incident.id}` })
  }

  // Declara a constante/variável destIds e atribui a ela o resultado da expressão desta linha.
  const destIds = new Set<string>()
  // Verifica a condição antes de executar o bloco seguinte.
  if (tx) {
    // Declara a constante/variável a e atribui a ela o resultado da expressão desta linha.
    const a = getAddress(tx.addressId)
    // Verifica a condição antes de executar o bloco seguinte.
    if (a && !a.customerIds.includes(incident.customerId)) destIds.add(a.id)
  }
  // Verifica a condição antes de executar o bloco seguinte.
  if (incident.destinationText) {
    // Declara a constante/variável a e atribui a ela o resultado da expressão desta linha.
    const a = matchAddressText(incident.destinationText)
    // Verifica a condição antes de executar o bloco seguinte.
    if (a && !a.customerIds.includes(incident.customerId)) destIds.add(a.id)
  }
  // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
  for (const id of destIds) {
    // Declara a constante/variável m e atribui a ela o resultado da expressão desta linha.
    const m = destinationMention(id, `Destino de entrega citado no relato ${incident.id}`)
    // Verifica a condição antes de executar o bloco seguinte.
    if (m) out.push(m)
  }

  // Verifica a condição antes de executar o bloco seguinte.
  if (tx) {
    // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
    for (const sid of txSellerIds(tx)) {
      // Declara a constante/variável m e atribui a ela o resultado da expressão desta linha.
      const m = sellerMention(sid, `Vendedor da compra relatada em ${incident.id}`)
      // Verifica a condição antes de executar o bloco seguinte.
      if (m) out.push(m)
    }
    // Declara a constante/variável merchant e atribui a ela o resultado da expressão desta linha.
    const merchant = getMerchant(tx.merchantId)
    // Verifica a condição antes de executar o bloco seguinte.
    if (merchant && !merchant.marketplace) {
      out.push({ id: merchantEntityId(merchant.id), kind: 'merchant', value: merchant.name, sub: merchant.category, reason: `Estabelecimento da compra relatada em ${incident.id}` })
    }
  }
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return out
}

// a função txMentions. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function txMentions(tx: Transaction): Mention[] {
  // Declara a constante/variável out e atribui a ela o resultado da expressão desta linha.
  const out: Mention[] = []
  // Declara a constante/variável a e atribui a ela o resultado da expressão desta linha.
  const a = getAddress(tx.addressId)
  // Verifica a condição antes de executar o bloco seguinte.
  if (a && !a.customerIds.includes(tx.customerId)) {
    // Declara a constante/variável m e atribui a ela o resultado da expressão desta linha.
    const m = destinationMention(a.id, `Destino de entrega da ${tx.id}`)
    // Verifica a condição antes de executar o bloco seguinte.
    if (m) out.push(m)
  }
  // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
  for (const sid of txSellerIds(tx)) {
    // Declara a constante/variável m e atribui a ela o resultado da expressão desta linha.
    const m = sellerMention(sid, `Vendedor da ${tx.id}`)
    // Verifica a condição antes de executar o bloco seguinte.
    if (m) out.push(m)
  }
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return out
}

// a função associationFor. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function associationFor(kind: EntityKind, entityId: string, customers: number): Association {
  // Verifica a condição antes de executar o bloco seguinte.
  if (kind === 'merchant') return 'não indicativa'
  // Verifica a condição antes de executar o bloco seguinte.
  if (kind === 'seller') {
    // Declara a constante/variável s e atribui a ela o resultado da expressão desta linha.
    const s = getSeller(entityId.replace(/^ENT-/, ''))
    // Verifica a condição antes de executar o bloco seguinte.
    if (!s || s.tier === 'oficial' || s.tier === 'platinum' || s.tier === 'gold') return 'não indicativa'
  }
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return customers >= 2 ? 'forte' : 'moderada'
}

// a constante/variável isScamEntity e atribui a ela o resultado da expressão desta linha.
const isScamEntity = (e: IntelEntity) => e.kind !== 'merchant' && e.association !== 'não indicativa'
export interface IntelSnapshot {
  at?: string
  entities: IntelEntity[]
  patterns: Pattern[]
  entity: (id: string) => IntelEntity | undefined
  incidentEntities: Map<string, string[]>
  incidentCustomer: Map<string, string>
}

// a constante/variável patternIdFor e atribui a ela o resultado da expressão desta linha.
const patternIdFor = (incidentId: string) => `PAT-${String(Math.max(0, seqOf(incidentId) - 1250)).padStart(3, '0')}`

// a função components. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function components(incidentIds: string[], incidentEntities: Map<string, string[]>, scam: Set<string>): string[][] {
  // Declara a constante/variável parent e atribui a ela o resultado da expressão desta linha.
  const parent = new Map(incidentIds.map((id) => [id, id]))
  // Declara a constante/variável find e atribui a ela o resultado da expressão desta linha.
  const find = (x: string): string => {
    // Declara a constante/variável p e atribui a ela o resultado da expressão desta linha.
    const p = parent.get(x) as string
    // Verifica a condição antes de executar o bloco seguinte.
    if (p === x) return x
    // Declara a constante/variável r e atribui a ela o resultado da expressão desta linha.
    const r = find(p)
    parent.set(x, r)
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return r
  }
  // Declara a constante/variável byEntity e atribui a ela o resultado da expressão desta linha.
  const byEntity = new Map<string, string>()
  // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
  for (const inc of incidentIds) {
    // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
    for (const eid of incidentEntities.get(inc) ?? []) {
      // Verifica a condição antes de executar o bloco seguinte.
      if (!scam.has(eid)) continue
      // Declara a constante/variável other e atribui a ela o resultado da expressão desta linha.
      const other = byEntity.get(eid)
      // Verifica a condição antes de executar o bloco seguinte.
      if (other) parent.set(find(inc), find(other))
      // Caso a condição anterior não seja atendida, executa o caminho alternativo.
      else byEntity.set(eid, inc)
    }
  }
  // Declara a constante/variável groups e atribui a ela o resultado da expressão desta linha.
  const groups = new Map<string, string[]>()
  // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
  for (const inc of incidentIds) {
    // Declara a constante/variável r e atribui a ela o resultado da expressão desta linha.
    const r = find(inc)
    groups.set(r, [...(groups.get(r) ?? []), inc])
  }
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return [...groups.values()]
}

// a função patternName. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function patternName(kinds: Set<EntityKind>): { name: string; hypothesis: string } {
  // Declara a constante/variável impersonation e atribui a ela o resultado da expressão desta linha.
  const impersonation = kinds.has('phone') || kinds.has('account')
  // Declara a constante/variável link e atribui a ela o resultado da expressão desta linha.
  const link = kinds.has('domain')
  // Declara a constante/variável pickup e atribui a ela o resultado da expressão desta linha.
  const pickup = kinds.has('destination')
  // Declara a constante/variável base e atribui a ela o resultado da expressão desta linha.
  const base = impersonation ? 'Falsa central de atendimento' : link ? 'Link falso de “validação”' : pickup ? 'Entrega em ponto indicado por terceiro' : 'Relatos relacionados'
  // Declara a constante/variável name e atribui a ela o resultado da expressão desta linha.
  const name = pickup && (impersonation || link) ? `${base} com retirada em ponto indicado` : base
  // Declara a constante/variável parts e atribui a ela o resultado da expressão desta linha.
  const parts: string[] = []
  // Verifica a condição antes de executar o bloco seguinte.
  if (impersonation) parts.push('contato se passando por central do cartão')
  // Verifica a condição antes de executar o bloco seguinte.
  if (link) parts.push('link que imita o emissor')
  parts.push('compra orientada de eletrônicos')
  // Verifica a condição antes de executar o bloco seguinte.
  if (pickup) parts.push('entrega em ponto de retirada indicado pelo contato')
  // Declara a constante/variável hypothesis e atribui a ela o resultado da expressão desta linha.
  const hypothesis = parts.join(', ').replace(/^./, (c) => c.toUpperCase()) + '.'
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return { name, hypothesis }
}
export function buildIntelligence(allIncidents: Incident[], allTransactions: Transaction[], at?: string): IntelSnapshot {
  // Declara a constante/variável incidents e atribui a ela o resultado da expressão desta linha.
  const incidents = allIncidents.filter((i) => i.closedAs !== 'not-scam' && (!at || i.createdAt <= at))
  // Declara a constante/variável transactions e atribui a ela o resultado da expressão desta linha.
  const transactions = allTransactions.filter((t) => !at || t.createdAt < at)
  // Declara a constante/variável txById e atribui a ela o resultado da expressão desta linha.
  const txById = new Map(allTransactions.map((t) => [t.id, t]))
  // Declara a constante/variável map e atribui a ela o resultado da expressão desta linha.
  const map = new Map<string, IntelEntity>()
  // Declara a constante/variável incidentEntities e atribui a ela o resultado da expressão desta linha.
  const incidentEntities = new Map<string, string[]>()

  // Declara a constante/variável touch e atribui a ela o resultado da expressão desta linha.
  const touch = (m: Mention, at: string) => {
    // Declara a constante/variável e e atribui a ela o resultado da expressão desta linha.
    let e = map.get(m.id)
    // Verifica a condição antes de executar o bloco seguinte.
    if (!e) {
      e = { id: m.id, kind: m.kind, value: m.value, sub: m.sub, incidentIds: [], txIds: [], customerIds: [], association: 'fraca', firstSeen: at, lastSeen: at, links: [] }
      map.set(m.id, e)
    }
    // Verifica a condição antes de executar o bloco seguinte.
    if (at < e.firstSeen) e.firstSeen = at
    // Verifica a condição antes de executar o bloco seguinte.
    if (at > e.lastSeen) e.lastSeen = at
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return e
  }

  // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
  for (const inc of incidents) {
    // Declara a constante/variável tx e atribui a ela o resultado da expressão desta linha.
    const tx = inc.txId ? txById.get(inc.txId) : undefined
    // Declara a constante/variável ids e atribui a ela o resultado da expressão desta linha.
    const ids: string[] = []
    // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
    for (const m of incidentMentions(inc, tx)) {
      // Declara a constante/variável e e atribui a ela o resultado da expressão desta linha.
      const e = touch(m, inc.createdAt)
      // Verifica a condição antes de executar o bloco seguinte.
      if (!e.incidentIds.includes(inc.id)) e.incidentIds.push(inc.id)
      // Verifica a condição antes de executar o bloco seguinte.
      if (!e.customerIds.includes(inc.customerId)) e.customerIds.push(inc.customerId)
      e.links.push({ targetId: inc.id, reason: m.reason, at: inc.createdAt })
      // Verifica a condição antes de executar o bloco seguinte.
      if (tx && (m.kind === 'destination' || m.kind === 'seller' || m.kind === 'merchant') && !e.txIds.includes(tx.id)) {
        e.txIds.push(tx.id)
        e.links.push({ targetId: tx.id, reason: `Compra relatada em ${inc.id}`, at: tx.createdAt })
      }
      ids.push(m.id)
    }
    incidentEntities.set(inc.id, [...new Set(ids)])
  }

  // Declara a constante/variável reportedTx e atribui a ela o resultado da expressão desta linha.
  const reportedTx = new Set(incidents.map((i) => i.txId).filter(Boolean) as string[])
  // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
  for (const tx of transactions) {
    // Verifica a condição antes de executar o bloco seguinte.
    if (reportedTx.has(tx.id)) continue
    // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
    for (const m of txMentions(tx)) {
      // Declara a constante/variável e e atribui a ela o resultado da expressão desta linha.
      const e = map.get(m.id)
      // Verifica a condição antes de executar o bloco seguinte.
      if (!e || e.incidentIds.length === 0) continue
      // Verifica a condição antes de executar o bloco seguinte.
      if (!e.txIds.includes(tx.id)) {
        e.txIds.push(tx.id)
        e.links.push({ targetId: tx.id, reason: m.reason, at: tx.createdAt })
      }
      // Verifica a condição antes de executar o bloco seguinte.
      if (!e.customerIds.includes(tx.customerId)) e.customerIds.push(tx.customerId)
      // Verifica a condição antes de executar o bloco seguinte.
      if (tx.createdAt > e.lastSeen) e.lastSeen = tx.createdAt
    }
  }

  // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
  for (const e of map.values()) e.association = associationFor(e.kind, e.id, e.customerIds.length)

  // Declara a constante/variável entities e atribui a ela o resultado da expressão desta linha.
  const entities = [...map.values()]
  // Declara a constante/variável scam e atribui a ela o resultado da expressão desta linha.
  const scam = new Set(entities.filter(isScamEntity).map((e) => e.id))
  // Declara a constante/variável incidentIds e atribui a ela o resultado da expressão desta linha.
  const incidentIds = incidents.map((i) => i.id)
  // Declara a constante/variável byIncident e atribui a ela o resultado da expressão desta linha.
  const byIncident = new Map(incidents.map((i) => [i.id, i]))
  // Declara a constante/variável newest e atribui a ela o resultado da expressão desta linha.
  const newest = [...incidents].sort((a, b) => a.createdAt.localeCompare(b.createdAt)).at(-1)
  // Declara a constante/variável previous e atribui a ela o resultado da expressão desta linha.
  const previous = newest ? components(incidentIds.filter((id) => id !== newest.id), incidentEntities, scam) : []

  // Declara a constante/variável patterns e atribui a ela o resultado da expressão desta linha.
  const patterns: Pattern[] = []
  // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
  for (const group of components(incidentIds, incidentEntities, scam)) {
    // Declara a constante/variável scamIds e atribui a ela o resultado da expressão desta linha.
    const scamIds = [...new Set(group.flatMap((id) => (incidentEntities.get(id) ?? []).filter((eid) => scam.has(eid))))]
    // Verifica a condição antes de executar o bloco seguinte.
    if (scamIds.length === 0) continue
    // Declara a constante/variável sorted e atribui a ela o resultado da expressão desta linha.
    const sorted = [...group].sort((a, b) => (byIncident.get(a)?.createdAt ?? '').localeCompare(byIncident.get(b)?.createdAt ?? ''))
    // Declara a constante/variável id e atribui a ela o resultado da expressão desta linha.
    const id = patternIdFor(sorted[0])
    // Declara a constante/variável groupSet e atribui a ela o resultado da expressão desta linha.
    const groupSet = new Set(group)
    // Declara a constante/variável mergedFrom e atribui a ela o resultado da expressão desta linha.
    const mergedFrom = previous
      .filter((sub) => sub.every((x) => groupSet.has(x)))
      .map((sub) => patternIdFor([...sub].sort((a, b) => (byIncident.get(a)?.createdAt ?? '').localeCompare(byIncident.get(b)?.createdAt ?? ''))[0]))
      .filter((pid) => pid !== id)
    // Declara a constante/variável txIds e atribui a ela o resultado da expressão desta linha.
    const txIds = [...new Set(scamIds.flatMap((eid) => map.get(eid)?.txIds ?? []))]
    // Declara a constante/variável incidentTx e atribui a ela o resultado da expressão desta linha.
    const incidentTx = new Set(group.map((g) => byIncident.get(g)?.txId).filter(Boolean) as string[])
    // Declara a constante/variável attempts e atribui a ela o resultado da expressão desta linha.
    const attempts = txIds.filter((t) => !incidentTx.has(t))
    // Declara a constante/variável customerIds e atribui a ela o resultado da expressão desta linha.
    const customerIds = [...new Set([...group.map((g) => byIncident.get(g)?.customerId as string), ...attempts.map((t) => txById.get(t)?.customerId as string)])]
    // Declara a constante/variável channels e atribui a ela o resultado da expressão desta linha.
    const channels = [...new Set(group.map((g) => byIncident.get(g)?.channel as IncidentChannel))]
    // Declara a constante/variável kinds e atribui a ela o resultado da expressão desta linha.
    const kinds = new Set(scamIds.map((eid) => map.get(eid)?.kind as EntityKind))
    // Declara a constante/variável incidentCustomers e atribui a ela o resultado da expressão desta linha.
    const incidentCustomers = new Set(group.map((g) => byIncident.get(g)?.customerId)).size
    // Declara a constante/variável status e atribui a ela o resultado da expressão desta linha.
    const status = incidentCustomers >= 3 || (group.length >= 2 && attempts.length >= 1) ? 'Possível campanha' : 'Observando'
    // Declara a constante/variável dates e atribui a ela o resultado da expressão desta linha.
    const dates = [...group.map((g) => byIncident.get(g)?.createdAt as string), ...attempts.map((t) => txById.get(t)?.createdAt as string)].sort()
    patterns.push({
      id,
      ...patternName(kinds),
      status,
      incidentIds: sorted,
      txIds,
      entityIds: scamIds,
      customerIds,
      channels,
      firstSeen: dates[0],
      updatedAt: dates[dates.length - 1],
      mergedFrom,
    })
  }
  patterns.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return { at, entities, patterns, entity: (id) => map.get(id), incidentEntities, incidentCustomer: new Map(incidents.map((i) => [i.id, i.customerId])) }
}
export function relationsForTx(tx: Pick<Transaction, 'id' | 'customerId' | 'addressId' | 'items' | 'sellerId'>, intel: IntelSnapshot): Relation[] {
  // Declara a constante/variável out e atribui a ela o resultado da expressão desta linha.
  const out: Relation[] = []
  // Declara a constante/variável a e atribui a ela o resultado da expressão desta linha.
  const a = getAddress(tx.addressId)
  // Declara a constante/variável candidates e atribui a ela o resultado da expressão desta linha.
  const candidates: { id: string; kind: EntityKind }[] = []
  // Verifica a condição antes de executar o bloco seguinte.
  if (a && !a.customerIds.includes(tx.customerId)) candidates.push({ id: destinationEntityId(a.id), kind: 'destination' })
  // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
  for (const sid of txSellerIds(tx)) candidates.push({ id: sellerEntityId(sid), kind: 'seller' })

  // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
  for (const c of candidates) {
    // Declara a constante/variável e e atribui a ela o resultado da expressão desta linha.
    const e = intel.entity(c.id)
    // Verifica a condição antes de executar o bloco seguinte.
    if (!e || e.incidentIds.length === 0) continue
    // Declara a constante/variável incidentIds e atribui a ela o resultado da expressão desta linha.
    const incidentIds = e.incidentIds
    // Declara a constante/variável txIds e atribui a ela o resultado da expressão desta linha.
    const txIds = e.txIds.filter((t) => t !== tx.id)
    // Declara a constante/variável owners e atribui a ela o resultado da expressão desta linha.
    const owners = [...new Set(incidentIds.map((iid) => intel.incidentCustomer.get(iid)).filter((cid): cid is string => !!cid && cid !== tx.customerId))]
    // Declara a constante/variável crossCustomer e atribui a ela o resultado da expressão desta linha.
    const crossCustomer = owners.length > 0
    // Declara a constante/variável names e atribui a ela o resultado da expressão desta linha.
    const names = owners.map((cid) => getCustomer(cid)?.name ?? cid).join(', ')
    // Declara a constante/variável reason e atribui a ela o resultado da expressão desta linha.
    const reason =
      c.kind === 'destination'
        ? `Destino citado em ${incidentIds.join(', ')}${crossCustomer ? ` por ${names}` : ''}`
        : `Vendedor presente em ${incidentIds.join(', ')}${crossCustomer ? ` (${names})` : ''}`
    out.push({ entityId: e.id, kind: e.kind, value: e.value, incidentIds, txIds, crossCustomer, association: e.association, reason })
  }
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return out
}
export function patternForIncident(intel: IntelSnapshot, incidentId: string) {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return intel.patterns.find((p) => p.incidentIds.includes(incidentId))
}
export function patternsForTx(intel: IntelSnapshot, txId: string) {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return intel.patterns.filter((p) => p.txIds.includes(txId))
}
