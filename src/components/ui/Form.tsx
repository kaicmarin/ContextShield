import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { Check } from 'lucide-react'
import { cx } from '../../utils/format'

// a constante/variável control e atribui a ela o resultado da expressão desta linha.
const control =
  'w-full rounded-lg border border-line-strong bg-paper px-3 text-[14px] text-ink-900 placeholder:text-subtle transition-colors hover:border-ink-600/50 focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/20 disabled:bg-canvas'
export function Field({
  label,
  hint,
  error,
  children,
  htmlFor,
  optional,
}: {
  label: string
  hint?: string
  error?: string
  children: ReactNode
  htmlFor: string
  optional?: boolean
}) {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <div>
      
      <label htmlFor={htmlFor} className="mb-1.5 flex items-baseline justify-between text-[13px] font-medium text-ink-800">
        {label}
        {optional && <span className="text-[12px] font-normal text-subtle">opcional</span>}
      
      </label>
      {children}
      {error ? (
        
        <p className="mt-1.5 text-[12px] text-risk-ink" role="alert">
          {error}
        
        </p>
      ) : (
        hint && <p className="mt-1.5 text-[12px] text-subtle">{hint}</p>
      )}
    
    </div>
  )
}

export function Input({ className, invalid, ...rest }: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return <input className={cx(control, 'h-10', invalid && 'border-risk', className)} aria-invalid={invalid || undefined} {...rest} />
}

export function Select({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    
    <select className={cx(control, 'h-10 appearance-none bg-[length:16px] bg-[right_10px_center] bg-no-repeat pr-9', className)} style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235F6B78' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")" }} {...rest}>
      {children}
    
    </select>
  )
}

export function Textarea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cx(control, 'min-h-[120px] py-2.5 leading-relaxed', className)} {...rest} />
}

export function ChoiceCard({
  name,
  value,
  checked,
  onChange,
  title,
  description,
  icon,
  aside,
  tone = 'default',
}: {
  name: string
  value: string
  checked: boolean
  onChange: (value: string) => void
  title: ReactNode
  description?: ReactNode
  icon?: ReactNode
  aside?: ReactNode
  tone?: 'default' | 'store'
}) {
  const id = useId()
  return (
    <label
      htmlFor={id}
      className={cx(
        'group flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors',
        checked
          ? tone === 'store'
            ? 'border-nexa-char bg-white ring-1 ring-nexa-char'
            : 'border-signal bg-signal-soft/50 ring-1 ring-signal'
          : 'border-line bg-paper hover:border-line-strong',
      )}
    >
      
      <input id={id} type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} className="peer sr-only" />
      <span
        className={cx(
          'mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-signal peer-focus-visible:ring-offset-2',
          checked ? (tone === 'store' ? 'border-nexa-char bg-nexa-char' : 'border-signal bg-signal') : 'border-line-strong bg-white',
        )}
        aria-hidden
      >
        {checked && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
      
      </span>
      {icon && <span className="mt-0.5 shrink-0 text-muted">{icon}</span>}
      
      <span className="min-w-0 flex-1">
        
        <span className="block text-[14px] font-medium text-ink-900">{title}</span>
        {description && <span className="mt-0.5 block text-[13px] leading-snug text-muted">{description}</span>}
      
      </span>
      {aside && <span className="shrink-0 text-[13px] text-ink-800">{aside}</span>}
    
    </label>
  )
}

export function Checkbox({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode }) {
  const id = useId()
  return (
    
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-[14px] leading-snug text-ink-800">
      
      <input id={id} type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span
        className={cx(
          'mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded border-2 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-signal peer-focus-visible:ring-offset-2',
          checked ? 'border-ink-900 bg-ink-900 text-white' : 'border-line-strong bg-white',
        )}
        aria-hidden
      >
        {checked && <Check className="h-3 w-3" strokeWidth={3} />}
      
      </span>
      
      <span>{children}</span>
    
    </label>
  )
}
