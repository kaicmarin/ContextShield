// a constante/variável brl e atribui a ela o resultado da expressão desta linha.
const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
export function formatBRL(value: number): string {
  // Verifica a condição antes de executar o bloco seguinte.
  if (!Number.isFinite(value)) return 'R$ 0,00'
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return brl.format(value)
}

// a constante/variável months e atribui a ela o resultado da expressão desta linha.
const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

// a função parse. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function parse(iso: string): Date | null {
  // Declara a constante/variável d e atribui a ela o resultado da expressão desta linha.
  const d = new Date(iso)
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return Number.isNaN(d.getTime()) ? null : d
}

// a constante/variável pad e atribui a ela o resultado da expressão desta linha.
const pad = (n: number) => String(n).padStart(2, '0')
export function formatTime(iso: string, withSeconds = true): string {
  // Declara a constante/variável d e atribui a ela o resultado da expressão desta linha.
  const d = parse(iso)
  // Verifica a condição antes de executar o bloco seguinte.
  if (!d) return '—'
  // Declara a constante/variável base e atribui a ela o resultado da expressão desta linha.
  const base = `${pad(d.getHours())}:${pad(d.getMinutes())}`
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return withSeconds ? `${base}:${pad(d.getSeconds())}` : base
}
export function formatDate(iso: string): string {
  // Declara a constante/variável d e atribui a ela o resultado da expressão desta linha.
  const d = parse(iso)
  // Verifica a condição antes de executar o bloco seguinte.
  if (!d) return '—'
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return `${pad(d.getDate())} ${months[d.getMonth()]} ${d.getFullYear()}`
}
export function formatShortDate(iso: string): string {
  // Declara a constante/variável d e atribui a ela o resultado da expressão desta linha.
  const d = parse(iso)
  // Verifica a condição antes de executar o bloco seguinte.
  if (!d) return '—'
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return `${pad(d.getDate())} ${months[d.getMonth()]}`
}
export function formatDateTime(iso: string): string {
  // Declara a constante/variável d e atribui a ela o resultado da expressão desta linha.
  const d = parse(iso)
  // Verifica a condição antes de executar o bloco seguinte.
  if (!d) return '—'
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return `${formatShortDate(iso)}, ${formatTime(iso, false)}`
}
export function addSeconds(iso: string, seconds: number): string {
  // Declara a constante/variável d e atribui a ela o resultado da expressão desta linha.
  const d = parse(iso)
  // Verifica a condição antes de executar o bloco seguinte.
  if (!d) return iso
  d.setSeconds(d.getSeconds() + seconds)
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}
export function installmentText(price: number, installments: number): string {
  // Verifica a condição antes de executar o bloco seguinte.
  if (installments <= 1) return 'à vista'
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return `${installments}x de ${formatBRL(price / installments)} sem juros`
}
export function plural(count: number, singular: string, pluralForm: string): string {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return `${count} ${count === 1 ? singular : pluralForm}`
}
export function cx(...parts: Array<string | false | null | undefined>): string {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return parts.filter(Boolean).join(' ')
}
