import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cx } from '../../utils/format'
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  side,
  width = 'max-w-md',
}: {
  open: boolean
  onClose: () => void
  title: ReactNode
  children: ReactNode
  footer?: ReactNode
  side?: boolean
  width?: string
}) {
  // Declara a constante/variável titleId e atribui a ela o resultado da expressão desta linha.
  const titleId = useId()
  // Declara a constante/variável panelRef e atribui a ela o resultado da expressão desta linha.
  const panelRef = useRef<HTMLDivElement>(null)
  // Declara a constante/variável closeRef e atribui a ela o resultado da expressão desta linha.
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  // Executa o hook useEffect, conectando esta parte do componente ao mecanismo correspondente do React.
  useEffect(() => {
    // Verifica a condição antes de executar o bloco seguinte.
    if (!open) return
    // Declara a constante/variável previous e atribui a ela o resultado da expressão desta linha.
    const previous = document.activeElement as HTMLElement | null
    // Declara a constante/variável onKey e atribui a ela o resultado da expressão desta linha.
    const onKey = (e: KeyboardEvent) => {
      // Verifica a condição antes de executar o bloco seguinte.
      if (e.key === 'Escape') closeRef.current()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      previous?.focus?.()
    }
  }, [open])

  if (!open) return null

  return createPortal(
    
    <div className="fixed inset-0 z-[80]">
      
      <div className="absolute inset-0 animate-fade bg-ink-950/40 backdrop-blur-[2px]" onClick={onClose} aria-hidden />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cx(
          'absolute flex flex-col bg-paper shadow-pop focus:outline-none',
          side
            ? 'inset-y-0 right-0 w-full max-w-[420px] animate-slidein'
            : cx('left-1/2 top-1/2 max-h-[88vh] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 animate-rise rounded-2xl', width),
        )}
      >
        
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
          
          <h2 id={titleId} className="font-display text-[16px] font-semibold text-ink-900">
            {title}
          
          </h2>
          
          <button type="button" onClick={onClose} className="rounded-md p-1.5 text-muted hover:bg-canvas hover:text-ink-900" aria-label="Fechar">
            
            <X className="h-4 w-4" />
          
          </button>
        
        </div>
        
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-line px-5 py-4">{footer}</div>}
      
      </div>
    
    </div>,
    document.body,
  )
}
