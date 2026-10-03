import type { Product } from '../types/domain'
import { getCategory, products } from '../mocks/products'
import { getSeller } from '../mocks/sellers'
export type SortKey = 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'discount'
export const sortOptions: { id: SortKey; label: string }[] = [
  { id: 'relevance', label: 'Mais relevantes' },
  { id: 'price-asc', label: 'Menor preço' },
  { id: 'price-desc', label: 'Maior preço' },
  { id: 'rating', label: 'Mais bem avaliados' },
  { id: 'discount', label: 'Maior desconto' },
]
export const priceRanges: { id: string; label: string; min: number; max: number }[] = [
  { id: 'ate-500', label: 'Até R$ 500', min: 0, max: 500 },
  { id: '500-1500', label: 'R$ 500 a R$ 1.500', min: 500, max: 1500 },
  { id: '1500-3500', label: 'R$ 1.500 a R$ 3.500', min: 1500, max: 3500 },
  { id: 'acima-3500', label: 'Acima de R$ 3.500', min: 3500, max: Infinity },
]
export interface CatalogFilters {
  q?: string
  category?: string
  seller?: string
  price?: string
  rating?: number
  sort: SortKey
}

// a constante/variável norm e atribui a ela o resultado da expressão desta linha.
const norm = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

// a função relevance. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function relevance(p: Product, terms: string[]): number {
  // Verifica a condição antes de executar o bloco seguinte.
  if (terms.length === 0) return p.reviewCount * p.rating
  // Declara a constante/variável name e atribui a ela o resultado da expressão desta linha.
  const name = norm(p.name)
  // Declara a constante/variável hay e atribui a ela o resultado da expressão desta linha.
  const hay = norm([p.name, p.line, p.description, getCategory(p.categorySlug)?.name ?? '', getSeller(p.sellerId)?.name ?? ''].join(' '))
  // Declara a constante/variável score e atribui a ela o resultado da expressão desta linha.
  let score = 0
  // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
  for (const t of terms) {
    // Verifica a condição antes de executar o bloco seguinte.
    if (name.includes(t)) score += 10
    // Caso a condição anterior não seja atendida, executa o caminho alternativo.
    else if (hay.includes(t)) score += 3
  }
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return score * 1_000_000 + p.reviewCount
}
export function filterProducts(f: CatalogFilters): Product[] {
  // Declara a constante/variável terms e atribui a ela o resultado da expressão desta linha.
  const terms = f.q ? norm(f.q).split(/\s+/).filter((t) => t.length > 1) : []
  // Declara a constante/variável range e atribui a ela o resultado da expressão desta linha.
  const range = priceRanges.find((r) => r.id === f.price)
  // Declara a constante/variável list e atribui a ela o resultado da expressão desta linha.
  const list = products.filter((p) => {
    // Verifica a condição antes de executar o bloco seguinte.
    if (f.category && p.categorySlug !== f.category) return false
    // Verifica a condição antes de executar o bloco seguinte.
    if (f.seller && p.sellerId !== f.seller) return false
    // Verifica a condição antes de executar o bloco seguinte.
    if (range && (p.price < range.min || p.price >= range.max)) return false
    // Verifica a condição antes de executar o bloco seguinte.
    if (f.rating && p.rating < f.rating) return false
    // Verifica a condição antes de executar o bloco seguinte.
    if (terms.length > 0) {
      // Declara a constante/variável hay e atribui a ela o resultado da expressão desta linha.
      const hay = norm([p.name, p.line, p.description, getCategory(p.categorySlug)?.name ?? '', getSeller(p.sellerId)?.name ?? ''].join(' '))
      // Verifica a condição antes de executar o bloco seguinte.
      if (!terms.every((t) => hay.includes(t))) return false
    }
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return true
  })
  // Declara a constante/variável off e atribui a ela o resultado da expressão desta linha.
  const off = (p: Product) => (p.oldPrice ? 1 - p.price / p.oldPrice : 0)
  // Inicia uma seleção de fluxo baseada no valor da expressão.
  switch (f.sort) {
    // Define um caso possível para o switch.
    case 'price-asc':
      // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
      return list.sort((a, b) => a.price - b.price)
    // Define um caso possível para o switch.
    case 'price-desc':
      // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
      return list.sort((a, b) => b.price - a.price)
    // Define um caso possível para o switch.
    case 'rating':
      // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
      return list.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    // Define um caso possível para o switch.
    case 'discount':
      // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
      return list.sort((a, b) => off(b) - off(a))
    default:
      // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
      return list.sort((a, b) => relevance(b, terms) - relevance(a, terms))
  }
}
