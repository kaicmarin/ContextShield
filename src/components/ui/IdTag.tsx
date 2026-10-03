import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Copy } from 'lucide-react'
import { cx } from '../../utils/format'
export function IdTag({
  value,
  to,
  copy,
  tone = 'default',
  className,
}: {
  value: string
  to?: string
  copy?: boolean
  tone?: 'default' | 'trace' | 'dark'
  className?: string
}) {
  const [copied, setCopied] = useState(false)
  // Declara a constante/variável styles e atribui a ela o resultado da expressão desta linha.
  const styles = {
    default: 'bg-ink-900/[0.04] text-ink-800 border-line',
    trace: 'bg-trace-soft text-trace-ink border-trace/25',
    dark: 'bg-white/[0.06] text-white/85 border-white/10',
  }[tone]

  // Declara a constante/variável label e atribui a ela o resultado da expressão desta linha.
  const label = to ? (
    <Link to={to} className="hover:underline">
      {value}
    </Link>
  ) : (
    value
  )

  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <span className={cx('id-tag inline-flex max-w-full items-center gap-1.5 rounded-md border px-1.5 py-0.5', styles, className)}>
      
      <span className="truncate">{label}</span>
      {copy && (
        <button
          type="button"
          onClick={() => {
            void navigator.clipboard?.writeText(value).catch(() => undefined)
            setCopied(true)
            window.setTimeout(() => setCopied(false), 1400)
          }}
          className="shrink-0 rounded p-0.5 opacity-60 hover:opacity-100"
          aria-label={`Copiar ${value}`}
        >
          {copied ? <Check className="h-3 w-3" aria-hidden /> : <Copy className="h-3 w-3" aria-hidden />}
        
        </button>
      )}
    
    </span>
  )
}
