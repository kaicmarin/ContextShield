import type { IntelEntity, Pattern } from '../types/domain'
import type { IntelSnapshot } from './intel'
export interface LaidOutNode {
  id: string
  kind: 'incident' | 'transaction' | IntelEntity['kind']
  label: string
  sub: string
  href: string
  x: number
  y: number
}
export interface LaidOutEdge {
  from: string
  to: string
  label: string
}

// a constante/variável COL e atribui a ela o resultado da expressão desta linha.
const COL = { incident: 130, entity: 420, tx: 720 }
// a constante/variável ROW e atribui a ela o resultado da expressão desta linha.
const ROW = 78
// a constante/variável TOP e atribui a ela o resultado da expressão desta linha.
const TOP = 56

// a função place. Ela encapsula a rotina definida no bloco abaixo e pode receber os parâmetros indicados.
function place(ids: string[], x: number): Map<string, { x: number; y: number }> {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return new Map(ids.map((id, i) => [id, { x, y: TOP + 40 + i * ROW }]))
}
export function layoutGraph(intel: IntelSnapshot, incidentNames: Map<string, string>): { nodes: LaidOutNode[]; edges: LaidOutEdge[] } {
  // Declara a constante/variável incidents e atribui a ela o resultado da expressão desta linha.
  const incidents = [...new Set(intel.entities.flatMap((e) => e.incidentIds))]
  // Declara a constante/variável txs e atribui a ela o resultado da expressão desta linha.
  const txs = [...new Set(intel.entities.flatMap((e) => e.txIds))]
  // Declara a constante/variável entities e atribui a ela o resultado da expressão desta linha.
  const entities = intel.entities.filter((e) => e.incidentIds.length > 0)
  // Declara a constante/variável posI e atribui a ela o resultado da expressão desta linha.
  const posI = place(incidents, COL.incident)
  // Declara a constante/variável posE e atribui a ela o resultado da expressão desta linha.
  const posE = place(entities.map((e) => e.id), COL.entity)
  // Declara a constante/variável posT e atribui a ela o resultado da expressão desta linha.
  const posT = place(txs, COL.tx)

  // Declara a constante/variável nodes e atribui a ela o resultado da expressão desta linha.
  const nodes: LaidOutNode[] = [
    ...incidents.map((id) => ({
      id,
      kind: 'incident' as const,
      label: id,
      sub: incidentNames.get(id) ?? 'Incidente',
      href: `/operations/incidents/${id}`,
      x: posI.get(id)!.x,
      y: posI.get(id)!.y,
    })),
    ...entities.map((e) => ({
      id: e.id,
      kind: e.kind,
      label: e.value,
      sub: e.sub,
      href: `/operations/intelligence/${e.id}`,
      x: posE.get(e.id)!.x,
      y: posE.get(e.id)!.y,
    })),
    ...txs.map((id) => ({
      id,
      kind: 'transaction' as const,
      label: id,
      sub: 'Transação observada',
      href: `/operations/transactions/${id}`,
      x: posT.get(id)!.x,
      y: posT.get(id)!.y,
    })),
  ]

  // Declara a constante/variável edges e atribui a ela o resultado da expressão desta linha.
  const edges: LaidOutEdge[] = []
  // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
  for (const e of entities) {
    // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
    for (const iid of e.incidentIds) edges.push({ from: iid, to: e.id, label: 'citado no relato' })
    // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
    for (const tid of e.txIds) edges.push({ from: e.id, to: tid, label: e.kind === 'destination' ? 'mesmo destino' : 'observado em' })
  }
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return { nodes, edges }
}
export function patternTitle(p: Pattern) {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return p.name
}
