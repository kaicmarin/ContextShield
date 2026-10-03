import { X } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import { cx } from '../../utils/format'

// a constante/variável bar e atribui a ela o resultado da expressão desta linha.
const bar: Record<string, string> = { info: 'bg-signal', ok: 'bg-ok', warn: 'bg-warn' }
export function ToastViewport() {
  const { toasts, dismissToast } = useToast()
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <div className="pointer-events-none fixed right-4 top-4 z-[90] flex w-[min(360px,calc(100%-2rem))] flex-col gap-2" aria-live="polite">
      {toasts.map((t) => (
        
        <div key={t.id} className="pointer-events-auto flex animate-rise overflow-hidden rounded-xl border border-line bg-paper shadow-lift">
          
          <span className={cx('w-1 shrink-0', bar[t.tone])} aria-hidden />
          
          <div className="min-w-0 flex-1 px-4 py-3">
            
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-subtle">{t.title}</p>
            
            <p className="mt-0.5 text-[14px] text-ink-900">{t.body}</p>
          
          </div>
          
          <button type="button" onClick={() => dismissToast(t.id)} className="m-2 self-start rounded p-1 text-subtle hover:bg-canvas hover:text-ink-900" aria-label="Fechar aviso">
            
            <X className="h-3.5 w-3.5" />
          
          </button>
        
        </div>
      ))}
    
    </div>
  )
}
