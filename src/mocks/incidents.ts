import type { IncidentChannel, IncidentStatus, IncidentType } from '../types/domain'
export const incidentTypeLabel: Record<IncidentType, string> = {
  guided: 'Outra pessoa me orientou a comprar',
  message: 'Recebi uma mensagem pedindo a compra',
  link: 'Recebi um link que levou à compra',
  impersonation: 'Alguém se passou pelo banco ou pela loja',
  unrecognized: 'Não reconheço esta compra',
  other: 'Outro motivo',
}
export const incidentTypeShort: Record<IncidentType, string> = {
  guided: 'Compra orientada',
  message: 'Mensagem com instruções',
  link: 'Link recebido',
  impersonation: 'Falsa central',
  unrecognized: 'Compra não reconhecida',
  other: 'Outro',
}
export const incidentTypeHint: Record<IncidentType, string> = {
  guided: 'Uma pessoa acompanhou você durante a compra, por telefone ou mensagem.',
  message: 'Você recebeu instruções por SMS, e-mail ou aplicativo de mensagens.',
  link: 'O caminho até a compra começou em um link que alguém enviou.',
  impersonation: 'A pessoa disse falar em nome da Aureon, da loja ou de outra empresa.',
  unrecognized: 'Você não fez esta compra e não sabe como ela aconteceu.',
  other: 'Nenhuma das opções descreve bem o que aconteceu.',
}
export const incidentChannelLabel: Record<IncidentChannel, string> = {
  phone: 'Ligação telefônica',
  whatsapp: 'Aplicativo de mensagens',
  sms: 'SMS',
  email: 'E-mail',
  social: 'Rede social',
  site: 'Site ou anúncio',
  none: 'Não houve contato',
}
export const incidentTypes: IncidentType[] = ['guided', 'message', 'link', 'impersonation', 'unrecognized', 'other']
export const incidentChannels: IncidentChannel[] = ['whatsapp', 'phone', 'sms', 'email', 'social', 'site', 'none']
export const incidentStatusLabel: Record<IncidentStatus, string> = {
  RECEIVED: 'Registrado',
  IN_REVIEW: 'Em análise',
  RELATED: 'Relacionado',
  CLOSED: 'Encerrado',
}
export const incidentStatusClient: Record<IncidentStatus, string> = {
  RECEIVED: 'Recebemos seu relato',
  IN_REVIEW: 'Uma pessoa da equipe está analisando',
  RELATED: 'Seu relato ajudou a proteger outras pessoas',
  CLOSED: 'Caso encerrado',
}
