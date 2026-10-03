import type { IntelEntity, Seller } from '../types/domain'
import { merchants } from '../mocks/merchants'
import { sellers, sellerTierLabel } from '../mocks/sellers'
import { addressLine, addressesFor } from '../mocks/people'
import { formatCnpj, isValidCnpj, onlyDigits } from '../utils/cnpj'
import { formatDate, plural } from '../utils/format'
import {
  destinationEntityId,
  domainEntityId,
  formatPhone,
  matchAddressText,
  normalizeDomain,
  normalizePhone,
  phoneEntityId,
  sellerEntityId,
  // Define um tipo/interface TypeScript. Esta parte serve para tipagem em desenvolvimento e não vira lógica JavaScript em runtime.
  type IntelSnapshot,
} from './intel'
import type { Traffic } from './labels'
export type CheckKind = 'link' | 'cnpj' | 'phone' | 'destination' | 'store' | 'key'
export interface CheckResult {
  kind: CheckKind
  level: Traffic
  query: string
  title: string
  summary: string
  facts: { label: string; value: string }[]
  signals: { label: string; state: 'ok' | 'attention' | 'risk' }[]
  guidance: string[]
}
export const OFFICIAL_CENTRAL = '0800 000 0000'
// a constante/variável OFFICIAL_CENTRAL_DIGITS e atribui a ela o resultado da expressão desta linha.
const OFFICIAL_CENTRAL_DIGITS = '08000000000'
export const checkKinds: { id: CheckKind; label: string; placeholder: string; hint: string }[] = [
  { id: 'link', label: 'Link ou site', placeholder: 'ex.: loja.example/oferta', hint: 'Cole o endereço que você recebeu.' },
  { id: 'cnpj', label: 'CNPJ', placeholder: '00.000.000/0000-00', hint: 'Confira se a empresa existe e com quem você está falando.' },
  { id: 'phone', label: 'Telefone', placeholder: '(11) 90000-0000', hint: 'Número que ligou ou mandou mensagem.' },
  { id: 'destination', label: 'Endereço de entrega', placeholder: 'Rua, número', hint: 'Endereço que alguém pediu para você usar.' },
  { id: 'store', label: 'Loja ou vendedor', placeholder: 'Nome da loja', hint: 'Nome de quem está vendendo.' },
  { id: 'key', label: 'Chave de pagamento', placeholder: 'E-mail, telefone, CNPJ ou chave aleatória', hint: 'Destino para onde pediram um pagamento. Nada é pago aqui.' },
]

// a constante/variável strip e atribui a ela o resultado da expressão desta linha.
const strip = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

// a constante/variável DAY e atribui a ela o resultado da expressão desta linha.
const DAY = 86_400_000
// a constante/variável daysBetween e atribui a ela o resultado da expressão desta linha.
const daysBetween = (a: string, b: string) => Math.max(0, Math.floor((new Date(b).getTime() - new Date(a).getTime()) / DAY))

// a função reportFacts. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function reportFacts(e: IntelEntity): { label: string; value: string }[] {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return [
    { label: 'Relatos de clientes', value: plural(e.incidentIds.length, 'relato', 'relatos') },
    { label: 'Primeira menção', value: formatDate(e.firstSeen) },
    { label: 'Última menção', value: formatDate(e.lastSeen) },
  ]
}

// a constante/variável BASE_GUIDANCE e atribui a ela o resultado da expressão desta linha.
const BASE_GUIDANCE = 'A Aureon nunca pede que você faça uma compra, um pagamento ou uma transferência para proteger o seu cartão.'

// a função checkLink. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function checkLink(q: string, intel: IntelSnapshot): CheckResult {
  // Declara a constante/variável host e atribui a ela o resultado da expressão desta linha.
  const host = normalizeDomain(q)
  // Declara a constante/variável official e atribui a ela o resultado da expressão desta linha.
  const official = [
    { host: 'aureon.example', owner: 'Aureon (emissor do seu cartão)', since: '2009-03-01' },
    ...merchants.map((m) => ({ host: m.domain, owner: `${m.name} · ${m.legalName}`, since: m.since })),
  ].find((o) => o.host === host)
  // Verifica a condição antes de executar o bloco seguinte.
  if (official) {
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return {
      kind: 'link',
      level: 'GREEN',
      query: host,
      title: 'Site oficial identificado',
      summary: `O endereço pertence a ${official.owner}.`,
      facts: [
        { label: 'Domínio', value: host },
        { label: 'No cadastro desde', value: formatDate(official.since) },
      ],
      signals: [
        { label: 'Domínio registrado no cadastro de lojas e do emissor', state: 'ok' },
        { label: 'Nenhum relato de cliente associado', state: 'ok' },
      ],
      guidance: ['Mesmo em um site oficial, desconfie se alguém estiver orientando a compra por telefone ou mensagem.'],
    }
  }
  // Declara a constante/variável e e atribui a ela o resultado da expressão desta linha.
  const e = intel.entity(domainEntityId(host))
  // Declara a constante/variável imitates e atribui a ela o resultado da expressão desta linha.
  const imitates = /aureon|nexa/.test(host)
  // Verifica a condição antes de executar o bloco seguinte.
  if (e && e.incidentIds.length > 0) {
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return {
      kind: 'link',
      level: 'RED',
      query: host,
      title: 'Este endereço aparece em relatos de clientes',
      summary: `${plural(e.incidentIds.length, 'cliente relatou', 'clientes relataram')} ter recebido este link junto com um pedido de pagamento ou compra.`,
      facts: [{ label: 'Domínio', value: host }, ...reportFacts(e), { label: 'Site oficial da Aureon', value: 'aureon.example' }],
      signals: [
        ...(imitates ? [{ label: 'Usa um nome parecido com o de uma marca conhecida, mas não pertence a ela', state: 'risk' as const }] : []),
        { label: 'Citado em relatos de golpe', state: 'risk' },
      ],
      guidance: [BASE_GUIDANCE, 'Não prossiga pelo link recebido; acesse o site oficial digitando o endereço diretamente.'],
    }
  }
  // Verifica a condição antes de executar o bloco seguinte.
  if (imitates) {
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return {
      kind: 'link',
      level: 'RED',
      query: host,
      title: 'Este endereço imita uma marca conhecida',
      summary: 'O nome lembra a Aureon ou a NEXA, mas o domínio não pertence a nenhuma delas.',
      facts: [
        { label: 'Domínio', value: host },
        { label: 'Sites oficiais', value: 'aureon.example · nexa.example' },
      ],
      signals: [{ label: 'Domínio diferente do oficial com nome parecido', state: 'risk' }],
      guidance: ['Digite você mesmo o endereço oficial no navegador.', BASE_GUIDANCE],
    }
  }
  // Declara a constante/variável odd e atribui a ela o resultado da expressão desta linha.
  const odd = /\.(online|site|info)$/.test(host)
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return {
    kind: 'link',
    level: 'YELLOW',
    query: host || q,
    title: 'Não encontramos este site',
    summary: 'Isso não quer dizer que ele seja perigoso — só que não há informação sobre ele no cadastro nem nos relatos.',
    facts: [{ label: 'Consultado', value: host || q }],
    signals: [
      { label: 'Sem histórico no cadastro de lojas', state: 'attention' },
      ...(odd ? [{ label: 'Terminação pouco usada por lojas estabelecidas', state: 'attention' as const }] : []),
    ],
    guidance: ['Procure o CNPJ da loja e confira aqui.', 'Desconfie de preço muito abaixo do mercado e de pressa para pagar.'],
  }
}

// a função sellerResult. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function sellerResult(kind: CheckKind, query: string, s: Seller, intel: IntelSnapshot, now: string): CheckResult {
  // Declara a constante/variável days e atribui a ela o resultado da expressão desta linha.
  const days = daysBetween(s.since, now)
  // Declara a constante/variável e e atribui a ela o resultado da expressão desta linha.
  const e = intel.entity(sellerEntityId(s.id))
  // Declara a constante/variável mentioned e atribui a ela o resultado da expressão desta linha.
  const mentioned = !!e && e.incidentIds.length > 0 && e.association !== 'não indicativa'
  // Declara a constante/variável established e atribui a ela o resultado da expressão desta linha.
  const established = s.tier === 'oficial' || s.tier === 'platinum' || s.tier === 'gold'
  // Declara a constante/variável recent e atribui a ela o resultado da expressão desta linha.
  const recent = days < 180
  // Declara a constante/variável facts e atribui a ela o resultado da expressão desta linha.
  const facts = [
    { label: 'Vendedor', value: `${s.name} · ${sellerTierLabel[s.tier]}` },
    { label: 'CNPJ', value: formatCnpj(s.cnpj) },
    { label: 'Vende na NEXA desde', value: `${formatDate(s.since)} (${plural(days, 'dia', 'dias')})` },
    { label: 'Reclamações', value: `${s.claimsRate.toLocaleString('pt-BR')}% dos pedidos` },
  ]
  // Verifica a condição antes de executar o bloco seguinte.
  if (established && !mentioned) {
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return {
      kind,
      level: 'GREEN',
      query,
      title: `${s.name} é um vendedor estabelecido`,
      summary: `Cadastro com documentos verificados e ${s.sales.toLocaleString('pt-BR')} vendas na NEXA.`,
      facts,
      signals: [
        { label: 'Documentos verificados pela NEXA', state: 'ok' },
        { label: `Nota ${s.rating.toLocaleString('pt-BR')} em ${s.reviewCount.toLocaleString('pt-BR')} avaliações`, state: 'ok' },
      ],
      guidance: ['Pague sempre pelo checkout da NEXA, nunca por fora.'],
    }
  }
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return {
    kind,
    level: 'YELLOW',
    query,
    title: mentioned ? 'Este vendedor aparece em compras relatadas por outros clientes' : recent ? 'Vendedor recente: confira antes de pagar' : 'Confira a reputação antes de pagar',
    summary: mentioned
      ? 'Isso não significa que o vendedor seja responsável; golpistas costumam escolher vendedores com entrega rápida. Se alguém indicou esta compra, pare.'
      : `${s.name} vende na NEXA há ${plural(days, 'dia', 'dias')}.`,
    facts,
    signals: [
      ...(recent ? [{ label: `Cadastro recente (${plural(days, 'dia', 'dias')})`, state: 'attention' as const }] : []),
      ...(s.claimsRate >= 3 ? [{ label: 'Taxa de reclamações acima da média', state: 'attention' as const }] : []),
      ...(mentioned && e ? [{ label: `Presente em ${plural(e.incidentIds.length, 'relato', 'relatos')} de clientes`, state: 'attention' as const }] : []),
    ],
    guidance: ['Leia as avaliações recentes e compare o preço.', 'Se alguém por telefone ou mensagem pediu esta compra, não continue.'],
  }
}

// a função checkCnpj. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function checkCnpj(q: string, intel: IntelSnapshot, now: string): CheckResult {
  // Declara a constante/variável d e atribui a ela o resultado da expressão desta linha.
  const d = onlyDigits(q)
  // Verifica a condição antes de executar o bloco seguinte.
  if (d.length !== 14 || !isValidCnpj(d)) {
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return {
      kind: 'cnpj',
      level: 'RED',
      query: q,
      title: 'Este CNPJ não é válido',
      summary: d.length !== 14 ? 'Um CNPJ tem 14 dígitos.' : 'Os dígitos verificadores não conferem: esse número não pode pertencer a uma empresa.',
      facts: [{ label: 'Consultado', value: q }],
      signals: [{ label: 'Número de CNPJ inválido', state: 'risk' }],
      guidance: ['Peça o CNPJ correto e confira de novo. Um número inválido em nota, boleto ou conversa é um sinal forte de fraude.'],
    }
  }
  // Declara a constante/variável s e atribui a ela o resultado da expressão desta linha.
  const s = sellers.find((x) => onlyDigits(x.cnpj) === d)
  // Verifica a condição antes de executar o bloco seguinte.
  if (s) return sellerResult('cnpj', formatCnpj(d), s, intel, now)
  // Declara a constante/variável m e atribui a ela o resultado da expressão desta linha.
  const m = merchants.find((x) => onlyDigits(x.cnpj) === d)
  // Verifica a condição antes de executar o bloco seguinte.
  if (m) {
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return {
      kind: 'cnpj',
      level: 'GREEN',
      query: formatCnpj(d),
      title: `${m.name} — empresa identificada`,
      summary: `${m.legalName}, ${m.category.toLowerCase()} em ${m.city}.`,
      facts: [
        { label: 'Razão social', value: m.legalName },
        { label: 'Site oficial', value: m.domain },
        { label: 'No cadastro desde', value: formatDate(m.since) },
      ],
      signals: [{ label: 'CNPJ válido e compatível com o site oficial', state: 'ok' }],
      guidance: ['Confira se o site em que você está é exatamente o oficial.'],
    }
  }
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return {
    kind: 'cnpj',
    level: 'YELLOW',
    query: formatCnpj(d),
    title: 'CNPJ válido, mas fora do cadastro de lojas',
    summary: 'O número é matematicamente válido, mas não pertence a nenhuma loja ou vendedor que conhecemos.',
    facts: [{ label: 'Consultado', value: formatCnpj(d) }],
    signals: [{ label: 'Sem cadastro na base de lojas', state: 'attention' }],
    guidance: ['Confirme se o nome da empresa no CNPJ é o mesmo da loja e do recebedor do pagamento.'],
  }
}

// a função checkPhone. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function checkPhone(q: string, intel: IntelSnapshot): CheckResult {
  // Declara a constante/variável d e atribui a ela o resultado da expressão desta linha.
  const d = normalizePhone(q)
  // Verifica a condição antes de executar o bloco seguinte.
  if (d === OFFICIAL_CENTRAL_DIGITS) {
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return {
      kind: 'phone',
      level: 'GREEN',
      query: OFFICIAL_CENTRAL,
      title: 'Central oficial da Aureon',
      summary: 'Este é o número impresso no verso do cartão.',
      facts: [{ label: 'Número', value: OFFICIAL_CENTRAL }],
      signals: [{ label: 'Número cadastrado pelo emissor', state: 'ok' }],
      guidance: ['A central oficial não liga pedindo compras, códigos ou transferências. Se isso acontecer, desligue e ligue você.'],
    }
  }
  // Declara a constante/variável e e atribui a ela o resultado da expressão desta linha.
  const e = d.length >= 10 ? intel.entity(phoneEntityId(d)) : undefined
  // Verifica a condição antes de executar o bloco seguinte.
  if (e && e.incidentIds.length > 0) {
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return {
      kind: 'phone',
      level: 'RED',
      query: formatPhone(d),
      title: 'Este número aparece em relatos de clientes',
      summary: 'Clientes relataram contato deste número se apresentando como central de atendimento.',
      facts: [{ label: 'Número', value: formatPhone(d) }, ...reportFacts(e), { label: 'Central oficial', value: OFFICIAL_CENTRAL }],
      signals: [{ label: 'Citado em relatos de golpe', state: 'risk' }],
      guidance: ['Desligue. Ligue você mesmo para o número no verso do cartão.', BASE_GUIDANCE],
    }
  }
  // Declara a constante/variável mobile e atribui a ela o resultado da expressão desta linha.
  const mobile = d.length === 11 && d[2] === '9'
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return {
    kind: 'phone',
    level: 'YELLOW',
    query: d.length >= 10 ? formatPhone(d) : q,
    title: 'Sem relatos para este número',
    summary: mobile ? 'É um número de celular. Bancos e lojas não pedem compras ou pagamentos por ligação de celular.' : 'Não há relatos associados a ele.',
    facts: [{ label: 'Consultado', value: d.length >= 10 ? formatPhone(d) : q }],
    signals: [{ label: 'Sem histórico disponível', state: 'attention' }],
    guidance: ['Se a ligação pede pressa, sigilo ou pagamento, desligue e procure o canal oficial.'],
  }
}

// a função checkDestination. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function checkDestination(q: string, intel: IntelSnapshot, viewerId: string): CheckResult {
  // Declara a constante/variável a e atribui a ela o resultado da expressão desta linha.
  const a = matchAddressText(q)
  // Verifica a condição antes de executar o bloco seguinte.
  if (!a) {
    // Declara a constante/variável pickupLike e atribui a ela o resultado da expressão desta linha.
    const pickupLike = /retirada|loja|box|sala|galp[aã]o/i.test(q)
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return {
      kind: 'destination',
      level: 'YELLOW',
      query: q,
      title: 'Não encontramos este endereço',
      summary: pickupLike ? 'Parece um ponto comercial ou de retirada. Confirme se foi você quem escolheu este endereço.' : 'Não há informação sobre este endereço nos relatos.',
      facts: [{ label: 'Consultado', value: q }],
      signals: [{ label: 'Sem histórico disponível', state: 'attention' }],
      guidance: ['Se alguém passou este endereço para a entrega de uma compra “de segurança”, não continue.'],
    }
  }
  // Declara a constante/variável own e atribui a ela o resultado da expressão desta linha.
  const own = addressesFor(viewerId).some((x) => x.id === a.id)
  // Declara a constante/variável e e atribui a ela o resultado da expressão desta linha.
  const e = intel.entity(destinationEntityId(a.id))
  // Verifica a condição antes de executar o bloco seguinte.
  if (e && e.incidentIds.length > 0 && !own) {
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return {
      kind: 'destination',
      level: 'RED',
      query: addressLine(a),
      title: 'Este endereço aparece em relatos de clientes',
      summary: 'Ele foi indicado como destino de entrega em compras que clientes relataram como golpe.',
      facts: [{ label: 'Endereço', value: `${addressLine(a)} · ${a.district}, ${a.city}` }, ...reportFacts(e)],
      signals: [
        { label: 'Destino citado em relatos', state: 'risk' },
        ...(a.kind === 'pickup' ? [{ label: 'Ponto de retirada: a mercadoria sai com quem buscar', state: 'risk' as const }] : []),
      ],
      guidance: ['Não envie compras para este endereço a pedido de terceiros.', BASE_GUIDANCE],
    }
  }
  // Verifica a condição antes de executar o bloco seguinte.
  if (own) {
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return {
      kind: 'destination',
      level: 'GREEN',
      query: addressLine(a),
      title: 'Endereço cadastrado por você',
      summary: `É o seu endereço “${a.label}”.`,
      facts: [{ label: 'Endereço', value: `${addressLine(a)} · ${a.district}, ${a.city}` }],
      signals: [{ label: 'Endereço da sua conta', state: 'ok' }],
      guidance: ['Se foi outra pessoa que pediu para usar este endereço, confirme por um canal seu.'],
    }
  }
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return {
    kind: 'destination',
    level: 'YELLOW',
    query: addressLine(a),
    title: a.kind === 'pickup' ? 'É um ponto de retirada' : 'Endereço de outra pessoa',
    summary: a.kind === 'pickup' ? 'A mercadoria fica disponível para quem buscar. Confirme se foi você quem escolheu este ponto.' : 'Este endereço não está na sua conta.',
    facts: [{ label: 'Endereço', value: `${addressLine(a)} · ${a.district}, ${a.city}` }],
    signals: [{ label: a.kind === 'pickup' ? 'Ponto de retirada' : 'Fora dos seus endereços', state: 'attention' }],
    guidance: ['Se o endereço veio de uma ligação ou mensagem, não continue.'],
  }
}

// a função checkStore. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function checkStore(q: string, intel: IntelSnapshot, now: string): CheckResult {
  // Declara a constante/variável t e atribui a ela o resultado da expressão desta linha.
  const t = strip(q)
  // Declara a constante/variável s e atribui a ela o resultado da expressão desta linha.
  const s = t.length >= 3 ? sellers.find((x) => strip(x.name).includes(t) || t.includes(strip(x.name))) : undefined
  // Verifica a condição antes de executar o bloco seguinte.
  if (s) return sellerResult('store', s.name, s, intel, now)
  // Declara a constante/variável m e atribui a ela o resultado da expressão desta linha.
  const m = t.length >= 3 ? merchants.find((x) => strip(x.name).includes(t) || t.includes(strip(x.name))) : undefined
  // Verifica a condição antes de executar o bloco seguinte.
  if (m) return checkLink(m.domain, intel)
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return {
    kind: 'store',
    level: 'YELLOW',
    query: q,
    title: 'Loja não encontrada no cadastro',
    summary: 'Não conhecemos uma loja ou vendedor com esse nome.',
    facts: [{ label: 'Consultado', value: q }],
    signals: [{ label: 'Sem cadastro', state: 'attention' }],
    guidance: ['Peça o CNPJ e confira. Prefira pagar pelo checkout de uma loja conhecida.'],
  }
}

// a função checkKey. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function checkKey(q: string, intel: IntelSnapshot, now: string): CheckResult {
  // Declara a constante/variável v e atribui a ela o resultado da expressão desta linha.
  const v = q.trim()
  // Declara a constante/variável note e atribui a ela o resultado da expressão desta linha.
  const note = 'Chaves de pagamento são simuladas nesta demonstração; nenhuma consulta ou pagamento real é feito.'
  // Verifica a condição antes de executar o bloco seguinte.
  if (v.includes('@')) {
    // Declara a constante/variável host e atribui a ela o resultado da expressão desta linha.
    const host = normalizeDomain(v.split('@')[1] ?? '')
    // Declara a constante/variável r e atribui a ela o resultado da expressão desta linha.
    const r = checkLink(host, intel)
    // Verifica a condição antes de executar o bloco seguinte.
    if (r.level === 'GREEN') return { ...r, kind: 'key', query: v, title: 'Chave ligada a um domínio oficial', guidance: [...r.guidance, note] }
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return {
      ...r,
      kind: 'key',
      query: v,
      title: r.level === 'RED' ? 'Esta chave usa um domínio citado em relatos' : 'Chave de e-mail sem histórico',
      guidance: [...r.guidance, note],
    }
  }
  // Declara a constante/variável d e atribui a ela o resultado da expressão desta linha.
  const d = onlyDigits(v)
  // Verifica a condição antes de executar o bloco seguinte.
  if (d.length === 14) return { ...checkCnpj(d, intel, now), kind: 'key', guidance: ['Confira se o nome do recebedor é o da loja.', note] }
  // Verifica a condição antes de executar o bloco seguinte.
  if (d.length >= 10 && d.length <= 11 && (d.length === 10 || d[2] === '9')) return { ...checkPhone(d, intel), kind: 'key', guidance: ['Confira o nome do recebedor antes de confirmar.', BASE_GUIDANCE, note] }
  // Declara a constante/variável random e atribui a ela o resultado da expressão desta linha.
  const random = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i.test(v)
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return {
    kind: 'key',
    level: 'YELLOW',
    query: v,
    title: random ? 'Chave aleatória: ela não mostra quem recebe' : d.length === 11 ? 'Chave de pessoa física' : 'Não reconhecemos esta chave',
    summary: random ? 'Antes de confirmar, o app do seu banco mostra o nome do recebedor. Compare com quem você espera pagar.' : 'Confira o nome do recebedor antes de confirmar.',
    facts: [{ label: 'Consultado', value: v }],
    signals: [{ label: 'Recebedor não identificado nesta consulta', state: 'attention' }],
    guidance: ['Se o recebedor for uma pessoa e não a loja, pare.', BASE_GUIDANCE, note],
  }
}
export function runCheck(kind: CheckKind, input: string, intel: IntelSnapshot, now: string, viewerId: string): CheckResult | undefined {
  // Verifica a condição antes de executar o bloco seguinte.
  if (!input.trim()) return undefined
  // Inicia uma seleção de fluxo baseada no valor da expressão.
  switch (kind) {
    // Define um caso possível para o switch.
    case 'link':
      // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
      return checkLink(input, intel)
    // Define um caso possível para o switch.
    case 'cnpj':
      // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
      return checkCnpj(input, intel, now)
    // Define um caso possível para o switch.
    case 'phone':
      // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
      return checkPhone(input, intel)
    // Define um caso possível para o switch.
    case 'destination':
      // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
      return checkDestination(input, intel, viewerId)
    // Define um caso possível para o switch.
    case 'store':
      // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
      return checkStore(input, intel, now)
    // Define um caso possível para o switch.
    case 'key':
      // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
      return checkKey(input, intel, now)
  }
}

// um tipo/interface TypeScript. Esta parte serve para tipagem em desenvolvimento e não vira lógica JavaScript em runtime.
interface Cue {
  id: string
  re: RegExp
  label: string
  explain: string
}

// a constante/variável scamTypes e atribui a ela o resultado da expressão desta linha.
const scamTypes: { id: string; label: string; re: RegExp; explain: string }[] = [
  { id: 'central', label: 'Falsa central de atendimento', re: /central de (seguran[çc]a|atendimento)|setor de fraude|funcion[áa]ri[oa] do banco|compra suspeita|n[ãa]o reconhecida/i, explain: 'Alguém se apresenta como o banco ou a loja e conduz você a “resolver” um problema.' },
  { id: 'link', label: 'Link falso de validação', re: /(clique|acesse|entre) (no|neste|nesse)? ?link|validar|regularizar|atualizar (seus )?dados|evitar (o )?bloqueio/i, explain: 'Um link imita um site oficial para capturar dados ou induzir um pagamento.' },
  { id: 'premio', label: 'Falso prêmio ou sorteio', re: /pr[êe]mio|sorteado|voc[êe] ganhou|resgat(e|ar)/i, explain: 'Promete algo de valor e pede um pagamento ou uma compra para liberar.' },
  { id: 'parente', label: 'Falso parente ou “número novo”', re: /n[úu]mero novo|troquei de n[úu]mero|(m[ãa]e|pai|filh[oa]),? (me )?(ajuda|preciso)/i, explain: 'Alguém finge ser um conhecido com número novo e pede dinheiro com urgência.' },
  { id: 'entrega', label: 'Falsa taxa de entrega', re: /taxa de (entrega|libera[çc][ãa]o)|encomenda (retida|parada)|correio/i, explain: 'Cobra uma taxa inexistente para liberar uma entrega.' },
  { id: 'vaga', label: 'Falsa vaga ou renda extra', re: /renda extra|vaga (de|para)|tarefas? (pagas|remuneradas)|ganhe por dia/i, explain: 'Oferece ganho fácil e depois pede um pagamento para “liberar” o valor.' },
]

// a constante/variável cues e atribui a ela o resultado da expressão desta linha.
const cues: Cue[] = [
  { id: 'procedure', re: /procedimento de seguran[çc]a|cancelar (a )?(opera[çc][ãa]o|compra)|compra (de|para) (teste|seguran[çc]a)/i, label: 'Compra apresentada como procedimento', explain: 'Nenhum banco pede que você compre algo para cancelar outra compra.' },
  { id: 'refund', re: /estorn|ser[áa] devolvid|reembols|dinheiro volta/i, label: 'Promessa de devolução do valor', explain: 'A promessa de estorno serve para tirar o medo de pagar.' },
  { id: 'secrecy', re: /n[ãa]o (conte|fale|comente)|sigilo|ningu[ée]m (pode|precisa) saber|diga que (a compra )?[ée] sua|responda que/i, label: 'Pedido para esconder a orientação', explain: 'Pedir segredo é para impedir que alguém alerte você.' },
  { id: 'urgency', re: /urgente|imediatamente|agora mesmo|em at[ée] \d+ ?min|[úu]ltima chance|hoje ainda/i, label: 'Pressão de tempo', explain: 'A pressa impede que você confira.' },
  { id: 'pickup', re: /ponto de retirada|use (este|esse) endere[çc]o|entregar (em|no)|retirada em/i, label: 'Endereço de entrega indicado por terceiro', explain: 'A mercadoria vai para quem indicou o endereço.' },
  { id: 'payment', re: /\bpix\b|transfer(e|ir|ência)|boleto|pagamento de|deposit/i, label: 'Pedido de pagamento', explain: 'Confirme por conta própria para quem vai o dinheiro.' },
  { id: 'code', re: /c[óo]digo (que chegou|de verifica[çc][ãa]o|por sms)|senha|token/i, label: 'Pedido de código ou senha', explain: 'Códigos e senhas são só seus. Ninguém legítimo pede.' },
  { id: 'remote', re: /instal(e|ar) (o )?(app|aplicativo)|acesso remoto|compartilh(e|ar) (a )?tela/i, label: 'Pedido para instalar app ou compartilhar tela', explain: 'Dá controle do seu aparelho a outra pessoa.' },
]
export interface MessageFinding {
  level: Traffic
  types: { label: string; explain: string }[]
  cues: { label: string; explain: string }[]
  entities: { kind: 'phone' | 'domain' | 'destination'; value: string; reported: number }[]
  guidance: string[]
}
export function analyzeMessage(text: string, intel: IntelSnapshot): MessageFinding | undefined {
  // Verifica a condição antes de executar o bloco seguinte.
  if (!text.trim()) return undefined
  // Declara a constante/variável types e atribui a ela o resultado da expressão desta linha.
  const types = scamTypes.filter((t) => t.re.test(text)).map((t) => ({ label: t.label, explain: t.explain }))
  // Declara a constante/variável found e atribui a ela o resultado da expressão desta linha.
  const found = cues.filter((c) => c.re.test(text)).map((c) => ({ label: c.label, explain: c.explain }))
  // Declara a constante/variável entities e atribui a ela o resultado da expressão desta linha.
  const entities: MessageFinding['entities'] = []
  // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
  for (const m of text.match(/\(?\b\d{2}\)?\s?9?\d{4,5}-?\d{4}\b/g) ?? []) {
    // Declara a constante/variável d e atribui a ela o resultado da expressão desta linha.
    const d = normalizePhone(m)
    // Verifica a condição antes de executar o bloco seguinte.
    if (d.length < 10) continue
    // Declara a constante/variável e e atribui a ela o resultado da expressão desta linha.
    const e = intel.entity(phoneEntityId(d))
    entities.push({ kind: 'phone', value: formatPhone(d), reported: e?.incidentIds.length ?? 0 })
  }
  // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
  for (const m of text.match(/\b[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:example|com\.br|com|net|org|online|site|info)\b/gi) ?? []) {
    // Declara a constante/variável host e atribui a ela o resultado da expressão desta linha.
    const host = normalizeDomain(m)
    // Verifica a condição antes de executar o bloco seguinte.
    if (host === 'aureon.example' || merchants.some((x) => x.domain === host)) continue
    // Declara a constante/variável e e atribui a ela o resultado da expressão desta linha.
    const e = intel.entity(domainEntityId(host))
    entities.push({ kind: 'domain', value: host, reported: e?.incidentIds.length ?? 0 })
  }
  // Declara a constante/variável a e atribui a ela o resultado da expressão desta linha.
  const a = matchAddressText(text)
  // Verifica a condição antes de executar o bloco seguinte.
  if (a) entities.push({ kind: 'destination', value: addressLine(a), reported: intel.entity(destinationEntityId(a.id))?.incidentIds.length ?? 0 })

  // Declara a constante/variável reported e atribui a ela o resultado da expressão desta linha.
  const reported = entities.some((e) => e.reported > 0)
  // Declara a constante/variável level e atribui a ela o resultado da expressão desta linha.
  const level: Traffic = reported || found.length >= 3 || (types.length > 0 && found.length >= 2) ? 'RED' : found.length > 0 || types.length > 0 ? 'YELLOW' : 'GREEN'
  // Declara a constante/variável guidance e atribui a ela o resultado da expressão desta linha.
  const guidance =
    level === 'RED'
      ? ['Não siga as instruções da mensagem.', 'Fale com o banco ou a loja por um canal que você mesmo procurou.', 'Se já pagou, registre em “Fui vítima”.']
      : level === 'YELLOW'
        ? ['Confirme a informação por conta própria antes de pagar.', 'Se houver pressa ou pedido de segredo, pare.']
        : ['Não encontramos elementos conhecidos. Isso não garante que a mensagem seja segura: na dúvida, confira pelo canal oficial.']
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return { level, types, cues: found, entities, guidance }
}
