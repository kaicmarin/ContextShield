import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Laptop, Monitor, Smartphone, Tablet } from 'lucide-react'
import type { Device } from '../../types/domain'
import { useToast } from '../../context/ToastContext'
import { devicesFor } from '../../mocks/people'
import { SecTitle, useViewerData } from '../../components/security/SecurityParts'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/Feedback'
import { Modal } from '../../components/ui/Modal'
import { formatDate, formatDateTime } from '../../utils/format'

// a constante/variável icon e atribui a ela o resultado da expressão desta linha.
const icon = { laptop: Laptop, phone: Smartphone, desktop: Monitor, tablet: Tablet }
export function DevicesPage() {
  const { viewer, mine } = useViewerData()
  const { pushToast } = useToast()
  const [removed, setRemoved] = useState<string[]>([])
  const [confirm, setConfirm] = useState<Device | null>(null)
  // Declara a constante/variável list e atribui a ela o resultado da expressão desta linha.
  const list = devicesFor(viewer.id).filter((d) => !removed.includes(d.id))
  // Declara a constante/variável usedIn e atribui a ela o resultado da expressão desta linha.
  const usedIn = (d: Device) => mine.filter((t) => t.deviceId === d.id).length

  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <div>
      
      <SecTitle title="Dispositivos" description="Onde o seu cartão foi usado em compras online." />
      {list.length === 0 ? (
        
        <EmptyState title="Nenhum dispositivo" description="Os dispositivos usados em compras aparecem aqui." />
      ) : (
        
        <ul className="space-y-3">
          {list.map((d) => {
            const Icon = icon[d.kind]
            const n = usedIn(d)
            return (
              
              <li key={d.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-paper p-4">
                
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-aureon-mist text-aureon-deep">
                  
                  <Icon className="h-5 w-5" aria-hidden />
                
                </span>
                
                <div className="min-w-0 flex-1">
                  
                  <p className="flex flex-wrap items-center gap-2 font-medium">
                    {d.name}
                    {d.trusted ? (
                      
                      <Badge tone="ok" size="sm">
                        Conhecido
                      
                      </Badge>
                    ) : (
                      
                      <Badge tone="warn" size="sm">
                        Novo
                      
                      </Badge>
                    )}
                  
                  </p>
                  
                  <p className="text-[13px] text-muted">
                    {d.detail} · {d.location}
                  
                  </p>
                  
                  <p className="text-[12px] text-subtle">
                    {d.trusted ? `Desde ${formatDate(d.firstSeen)} · último uso ${formatDateTime(d.lastSeen)}` : `Primeiro uso ${formatDateTime(d.firstSeen)}`}
                    {n > 0 && ` · ${n} ${n === 1 ? 'compra' : 'compras'}`}
                  
                  </p>
                
                </div>
                {!d.trusted && (
                  
                  <Button size="sm" variant="secondary" onClick={() => setConfirm(d)}>
                    Não reconheço
                  
                  </Button>
                )}
              
              </li>
            )
          })}
        
        </ul>
      )}

      <Modal
        open={confirm !== null}
        onClose={() => setConfirm(null)}
        title="Remover dispositivo"
        footer={
          <>
            
            <Button variant="ghost" onClick={() => setConfirm(null)}>
              Cancelar
            
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (confirm) {
                  setRemoved((r) => [...r, confirm.id])
                  pushToast({ tone: 'ok', title: 'Dispositivo removido', body: `${confirm.name} não poderá mais usar o seu cartão.` })
                }
                setConfirm(null)
              }}
            >
              Remover acesso
            
            </Button>
          </>
        }
      >
        
        <p className="text-[14px] leading-relaxed text-ink-800">
          {confirm?.name} ({confirm?.detail}) deixará de ser aceito para compras com o seu cartão. Se alguém orientou você a usar este dispositivo, conte o que aconteceu em{' '}
          
          <Link to="/security/report" className="font-medium text-signal-ink hover:underline" onClick={() => setConfirm(null)}>
            Fui vítima
          
          </Link>
          .
        
        </p>
      
      </Modal>
    
    </div>
  )
}
