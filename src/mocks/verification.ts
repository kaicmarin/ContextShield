import type { VerificationAnswers } from '../types/domain'

// um tipo/interface TypeScript. Esta parte serve para tipagem em desenvolvimento e não vira lógica JavaScript em runtime.
type Key = keyof VerificationAnswers
export interface VerificationQuestion<K extends Key = Key> {
  key: K
  prompt: string
  help: string
  options: { id: VerificationAnswers[K]; label: string }[]
}
export const verificationQuestions: VerificationQuestion[] = [
  {
    key: 'origin',
    prompt: 'Você iniciou esta compra por conta própria?',
    help: 'Queremos entender como a compra começou.',
    options: [
      { id: 'self', label: 'Sim, fui eu que decidi comprar' },
      { id: 'asked', label: 'Não, alguém me pediu' },
    ],
  },
  {
    key: 'contact',
    prompt: 'Alguém entrou em contato com você antes desta compra?',
    help: 'Por exemplo, alguém dizendo ser do banco, da loja ou de uma transportadora.',
    options: [
      { id: 'no', label: 'Não' },
      { id: 'phone', label: 'Sim, por telefone' },
      { id: 'message', label: 'Sim, por mensagem' },
    ],
  },
  {
    key: 'address',
    prompt: 'Você reconhece o endereço de entrega?',
    help: '',
    options: [
      { id: 'mine', label: 'Sim, é meu ou de alguém que conheço' },
      { id: 'given', label: 'Me passaram este endereço' },
    ],
  },
]
export function parseAnswers(r: Record<string, string | undefined>): VerificationAnswers | undefined {
  // Declara a constante/variável origin e atribui a ela o resultado da expressão desta linha.
  const origin = r.origin === 'self' || r.origin === 'asked' ? r.origin : undefined
  // Declara a constante/variável contact e atribui a ela o resultado da expressão desta linha.
  const contact = r.contact === 'no' || r.contact === 'phone' || r.contact === 'message' ? r.contact : undefined
  // Declara a constante/variável address e atribui a ela o resultado da expressão desta linha.
  const address = r.address === 'mine' || r.address === 'given' ? r.address : undefined
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return origin && contact && address ? { origin, contact, address } : undefined
}
export function answerLabel(key: Key, id: string): string {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return verificationQuestions.find((q) => q.key === key)?.options.find((o) => o.id === id)?.label ?? '—'
}
