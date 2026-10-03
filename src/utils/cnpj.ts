// a constante/variável W1 e atribui a ela o resultado da expressão desta linha.
const W1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
// a constante/variável W2 e atribui a ela o resultado da expressão desta linha.
const W2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

// a função digit. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function digit(nums: number[], weights: number[]): number {
  // Declara a constante/variável r e atribui a ela o resultado da expressão desta linha.
  const r = nums.reduce((s, n, i) => s + n * weights[i], 0) % 11
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return r < 2 ? 0 : 11 - r
}
export function onlyDigits(v: string): string {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return v.replace(/\D/g, '')
}
export function formatCnpj(d14: string): string {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return `${d14.slice(0, 2)}.${d14.slice(2, 5)}.${d14.slice(5, 8)}/${d14.slice(8, 12)}-${d14.slice(12, 14)}`
}
export function cnpjFromBase(base12: string): string {
  // Declara a constante/variável nums e atribui a ela o resultado da expressão desta linha.
  const nums = onlyDigits(base12).split('').map(Number)
  // Declara a constante/variável d1 e atribui a ela o resultado da expressão desta linha.
  const d1 = digit(nums, W1)
  // Declara a constante/variável d2 e atribui a ela o resultado da expressão desta linha.
  const d2 = digit([...nums, d1], W2)
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return formatCnpj(`${nums.join('')}${d1}${d2}`)
}
export function isValidCnpj(value: string): boolean {
  // Declara a constante/variável d e atribui a ela o resultado da expressão desta linha.
  const d = onlyDigits(value)
  // Verifica a condição antes de executar o bloco seguinte.
  if (d.length !== 14 || /^(\d)\1+$/.test(d)) return false
  // Declara a constante/variável nums e atribui a ela o resultado da expressão desta linha.
  const nums = d.split('').map(Number)
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return digit(nums.slice(0, 12), W1) === nums[12] && digit(nums.slice(0, 13), W2) === nums[13]
}
