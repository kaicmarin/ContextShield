export const systemStages = [
  { slug: 'received', n: 46, label: 'Transaction received', group: 'Durante' },
  { slug: 'context', n: 47, label: 'Context analysis', group: 'Durante' },
  { slug: 'evidence', n: 48, label: 'Evidence collection', group: 'Durante' },
  { slug: 'decision', n: 49, label: 'Decision generated', group: 'Durante' },
  { slug: 'intervention', n: 50, label: 'Intervention triggered', group: 'Durante' },
  { slug: 'incident-received', n: 51, label: 'Incident received', group: 'Depois' },
  { slug: 'intelligence-updated', n: 52, label: 'Intelligence updated', group: 'Depois' },
  { slug: 'related-detected', n: 53, label: 'Related transaction detected', group: 'Depois' },
] as const
export type SystemStageSlug = (typeof systemStages)[number]['slug']
