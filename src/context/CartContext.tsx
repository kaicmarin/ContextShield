import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Product } from '../types/domain'
import { getProductById, shippingFor } from '../mocks/products'
export interface CartLine {
  product: Product
  quantity: number
}

// um tipo/interface TypeScript. Esta parte serve para tipagem em desenvolvimento e não vira lógica JavaScript em runtime.
interface StoredLine {
  productId: string
  quantity: number
}

// um tipo/interface TypeScript. Esta parte serve para tipagem em desenvolvimento e não vira lógica JavaScript em runtime.
interface CartValue {
  lines: CartLine[]
  itemCount: number
  subtotal: number
  shipping: number
  total: number
  lastAdded: Product | null
  addItem: (productId: string, quantity?: number) => void
  // Atualiza o estado associado ao setter desta variável; o React agenda uma nova renderização quando necessário.
  setQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  replaceWith: (productId: string, quantity?: number) => void
  clear: () => void
  dismissLastAdded: () => void
}

// O contexto CartContext, usado para compartilhar dados entre componentes sem passar props manualmente.
const CartContext = createContext<CartValue | null>(null)
// a constante/variável KEY e atribui a ela o resultado da expressão desta linha.
const KEY = 'contextshield-cart'

// a função load. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function load(): StoredLine[] {
  // Inicia um bloco protegido para operações que podem lançar erro.
  try {
    // Declara a constante/variável raw e atribui a ela o resultado da expressão desta linha.
    const raw = window.localStorage.getItem(KEY)
    // Declara a constante/variável parsed e atribui a ela o resultado da expressão desta linha.
    const parsed = raw ? (JSON.parse(raw) as StoredLine[]) : []
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return Array.isArray(parsed) ? parsed.filter((l) => getProductById(l.productId) && l.quantity > 0) : []
  } catch {
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return []
  }
}
export function CartProvider({ children }: { children: ReactNode }) {
  const [stored, setStored] = useState<StoredLine[]>(load)
  const [lastAddedId, setLastAddedId] = useState<string | null>(null)

  // Executa o hook useEffect, conectando esta parte do componente ao mecanismo correspondente do React.
  useEffect(() => {
    // Inicia um bloco protegido para operações que podem lançar erro.
    try {
      window.localStorage.setItem(KEY, JSON.stringify(stored))
    } catch {}
  }, [stored])

  // Guarda em addItem uma função memorizada para manter a mesma referência enquanto as dependências não mudarem.
  const addItem = useCallback((productId: string, quantity = 1) => {
    // Declara a constante/variável product e atribui a ela o resultado da expressão desta linha.
    const product = getProductById(productId)
    // Verifica a condição antes de executar o bloco seguinte.
    if (!product) return
    // Atualiza o estado associado ao setter desta variável; o React agenda uma nova renderização quando necessário.
    setStored((prev) => {
      // Declara a constante/variável found e atribui a ela o resultado da expressão desta linha.
      const found = prev.find((l) => l.productId === productId)
      // Verifica a condição antes de executar o bloco seguinte.
      if (found) {
        // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
        return prev.map((l) =>
          l.productId === productId ? { ...l, quantity: Math.min(product.stock, l.quantity + quantity) } : l,
        )
      }
      // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
      return [...prev, { productId, quantity: Math.min(product.stock, quantity) }]
    })
    // Atualiza o estado associado ao setter desta variável; o React agenda uma nova renderização quando necessário.
    setLastAddedId(productId)
  }, [])

  // Guarda em setQuantity uma função memorizada para manter a mesma referência enquanto as dependências não mudarem.
  const setQuantity = useCallback((productId: string, quantity: number) => {
    // Declara a constante/variável product e atribui a ela o resultado da expressão desta linha.
    const product = getProductById(productId)
    // Verifica a condição antes de executar o bloco seguinte.
    if (!product) return
    // Atualiza o estado associado ao setter desta variável; o React agenda uma nova renderização quando necessário.
    setStored((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.productId !== productId)
        : prev.map((l) => (l.productId === productId ? { ...l, quantity: Math.min(product.stock, quantity) } : l)),
    )
  }, [])

  // Guarda em removeItem uma função memorizada para manter a mesma referência enquanto as dependências não mudarem.
  const removeItem = useCallback((productId: string) => {
    // Atualiza o estado associado ao setter desta variável; o React agenda uma nova renderização quando necessário.
    setStored((prev) => prev.filter((l) => l.productId !== productId))
  }, [])

  // Guarda em replaceWith uma função memorizada para manter a mesma referência enquanto as dependências não mudarem.
  const replaceWith = useCallback((productId: string, quantity = 1) => {
    // Atualiza o estado associado ao setter desta variável; o React agenda uma nova renderização quando necessário.
    setStored([{ productId, quantity }])
    // Atualiza o estado associado ao setter desta variável; o React agenda uma nova renderização quando necessário.
    setLastAddedId(null)
  }, [])

  // Guarda em clear uma função memorizada para manter a mesma referência enquanto as dependências não mudarem.
  const clear = useCallback(() => setStored([]), [])
  // Guarda em dismissLastAdded uma função memorizada para manter a mesma referência enquanto as dependências não mudarem.
  const dismissLastAdded = useCallback(() => setLastAddedId(null), [])

  // Guarda em lines um valor memorizado para evitar recalcular a expressão quando as dependências não mudarem.
  const lines = useMemo<CartLine[]>(
    () =>
      stored.flatMap((l) => {
        // Declara a constante/variável product e atribui a ela o resultado da expressão desta linha.
        const product = getProductById(l.productId)
        // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
        return product ? [{ product, quantity: l.quantity }] : []
      }),
    [stored],
  )
  // Guarda em subtotal um valor memorizado para evitar recalcular a expressão quando as dependências não mudarem.
  const subtotal = useMemo(() => lines.reduce((s, l) => s + l.product.price * l.quantity, 0), [lines])
  // Declara a constante/variável shipping e atribui a ela o resultado da expressão desta linha.
  const shipping = shippingFor(subtotal)
  // Declara a constante/variável itemCount e atribui a ela o resultado da expressão desta linha.
  const itemCount = lines.reduce((s, l) => s + l.quantity, 0)
  // Declara a constante/variável lastAdded e atribui a ela o resultado da expressão desta linha.
  const lastAdded = lastAddedId ? getProductById(lastAddedId) ?? null : null

  // Guarda em value um valor memorizado para evitar recalcular a expressão quando as dependências não mudarem.
  const value = useMemo<CartValue>(
    () => ({
      lines,
      itemCount,
      subtotal,
      shipping,
      total: subtotal + shipping,
      lastAdded,
      addItem,
      setQuantity,
      removeItem,
      replaceWith,
      clear,
      dismissLastAdded,
    }),
    [lines, itemCount, subtotal, shipping, lastAdded, addItem, setQuantity, removeItem, replaceWith, clear, dismissLastAdded],
  )

  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
export function useCart(): CartValue {
  // Declara a constante/variável ctx e atribui a ela o resultado da expressão desta linha.
  const ctx = useContext(CartContext)
  // Verifica a condição antes de executar o bloco seguinte.
  if (!ctx) throw new Error('useCart deve ser usado dentro de CartProvider')
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return ctx
}
