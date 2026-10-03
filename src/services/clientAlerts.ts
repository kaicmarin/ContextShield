import type { Incident, Transaction } from '../types/domain'
import { getDevice } from '../mocks/people'
import { incidentStatusClient } from '../mocks/incidents'
import { formatBRL } from '../utils/format'
import { txTitle } from './present'
import type { Tone } from './labels'
export interface ClientAlert {
  id: string
  at: string
  tone: Tone
  title: string
  body: string
  to: string
  cta: string
  pending?: boolean
}
export function protectedByReport(inc: Incident, transactions: Transaction[]): Transaction | undefined {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return transactions
    .filter((t) => t.customerId !== inc.customerId && t.createdAt > inc.createdAt && (t.status === 'BLOCKED' || t.status === 'INTERVENTION' || t.status === 'CANCELLED'))
    .find((t) => t.assessments.some((a) => a.relations.some((r) => r.incidentIds.includes(inc.id))))
}
export function clientAlerts(customerId: string, transactions: Transaction[], incidents: Incident[]): ClientAlert[] {
  // Declara a constante/variável list e atribui a ela o resultado da expressão desta linha.
  const list: ClientAlert[] = []
  // Declara a constante/variável mine e atribui a ela o resultado da expressão desta linha.
  const mine = transactions.filter((t) => t.customerId === customerId)
  // Declara a constante/variável seenDevices e atribui a ela o resultado da expressão desta linha.
  const seenDevices = new Set<string>()

  // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
  for (const tx of [...mine].sort((a, b) => a.createdAt.localeCompare(b.createdAt))) {
    // Declara a constante/variável what e atribui a ela o resultado da expressão desta linha.
    const what = `${txTitle(tx)} · ${formatBRL(tx.amount)}`
    // Declara a constante/variável device e atribui a ela o resultado da expressão desta linha.
    const device = getDevice(tx.deviceId)
    // Verifica a condição antes de executar o bloco seguinte.
    if (device && !device.trusted && !seenDevices.has(device.id)) {
      seenDevices.add(device.id)
      list.push({ id: `al-dev-${device.id}`, at: tx.createdAt, tone: 'info', title: 'Novo dispositivo usado no cartão', body: `${device.name} · ${device.location}. Se não foi você, avise a gente.`, to: '/security/devices', cta: 'Ver dispositivos' })
    }
    // Inicia uma seleção de fluxo baseada no valor da expressão.
    switch (tx.status) {
      // Define um caso possível para o switch.
      case 'CONTEXT_REQUIRED':
        list.push({ id: `al-${tx.id}`, at: tx.updatedAt, tone: 'warn', title: 'Confirme uma compra', body: `${what} está aguardando a sua confirmação.`, to: `/security/verification/${tx.id}`, cta: 'Confirmar agora', pending: true })
        break
      // Define um caso possível para o switch.
      case 'INTERVENTION':
        list.push({ id: `al-${tx.id}`, at: tx.updatedAt, tone: 'risk', title: 'Compra pausada para a sua proteção', body: `${what}. Nada foi cobrado. Veja o que encontramos antes de decidir.`, to: `/security/verification/${tx.id}`, cta: 'Ver orientação', pending: true })
        break
      // Define um caso possível para o switch.
      case 'APPROVED_WITH_ALERT':
        list.push(
          tx.interventionChoice === 'continued'
            ? { id: `al-${tx.id}`, at: tx.updatedAt, tone: 'warn', title: 'Você confirmou uma compra depois do aviso', body: `${what}. Se alguém pediu esta compra, fale com a gente.`, to: `/security/transactions/${tx.id}`, cta: 'Ver compra' }
            : { id: `al-${tx.id}`, at: tx.updatedAt, tone: 'warn', title: 'Compra aprovada: foi você?', body: `${what}. Alguns detalhes são diferentes do seu costume.`, to: `/security/transactions/${tx.id}`, cta: 'Revisar compra' },
        )
        break
      // Define um caso possível para o switch.
      case 'BLOCKED':
        list.push({ id: `al-${tx.id}`, at: tx.updatedAt, tone: 'risk', title: 'Compra interrompida por segurança', body: `${what}. Nenhum valor foi cobrado.`, to: `/security/transactions/${tx.id}`, cta: 'Entender' })
        break
      // Define um caso possível para o switch.
      case 'CANCELLED':
        // Verifica a condição antes de executar o bloco seguinte.
        if (tx.assessments.length > 0) list.push({ id: `al-${tx.id}`, at: tx.updatedAt, tone: 'neutral', title: 'Compra não concluída', body: `${what}. Nenhum valor foi cobrado.`, to: `/security/transactions/${tx.id}`, cta: 'Ver detalhes' })
        break
    }
  }

  // Inicia um laço para repetir a lógica enquanto a condição do for for atendida.
  for (const inc of incidents.filter((i) => i.customerId === customerId)) {
    list.push({ id: `al-${inc.id}`, at: inc.createdAt, tone: 'trace', title: 'Relato registrado', body: `Protocolo ${inc.id} · ${incidentStatusClient[inc.status]}.`, to: `/security/incidents/${inc.id}`, cta: 'Acompanhar' })
    // Declara a constante/variável helped e atribui a ela o resultado da expressão desta linha.
    const helped = protectedByReport(inc, transactions)
    // Verifica a condição antes de executar o bloco seguinte.
    if (helped) {
      list.push({ id: `al-${inc.id}-helped`, at: helped.updatedAt, tone: 'trace', title: 'Seu relato ajudou a proteger outra pessoa', body: 'Uma compra com elementos parecidos com os que você relatou foi interrompida antes do pagamento.', to: `/security/incidents/${inc.id}`, cta: 'Ver acompanhamento' })
    }
  }

  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return list.sort((a, b) => b.at.localeCompare(a.at))
}
