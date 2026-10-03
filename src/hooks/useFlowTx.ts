import { useSearchParams } from 'react-router-dom'
import { useDemo } from '../context/DemoContext'
export function useFlowTx() {
  const [params] = useSearchParams()
  const { getTx, activeTx } = useDemo()
  // Declara a constante/variável id e atribui a ela o resultado da expressão desta linha.
  const id = params.get('tx') ?? undefined
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return id ? getTx(id) : activeTx
}
