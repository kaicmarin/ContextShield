import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { cx } from '../../utils/format'

// um tipo/interface TypeScript. Esta parte serve para tipagem em desenvolvimento e não vira lógica JavaScript em runtime.
type Variant = 'primary' | 'signal' | 'secondary' | 'ghost' | 'danger' | 'store' | 'inverse'
// um tipo/interface TypeScript. Esta parte serve para tipagem em desenvolvimento e não vira lógica JavaScript em runtime.
type Size = 'sm' | 'md' | 'lg'

// um tipo/interface TypeScript. Esta parte serve para tipagem em desenvolvimento e não vira lógica JavaScript em runtime.
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  to?: string
  icon?: ReactNode
  iconRight?: ReactNode
  fullWidth?: boolean
  loading?: boolean
}

// a constante/variável variants e atribui a ela o resultado da expressão desta linha.
const variants: Record<Variant, string> = {
  primary: 'bg-ink-900 text-white hover:bg-ink-800 active:bg-ink-950',
  signal: 'bg-signal text-white hover:bg-signal-ink',
  secondary: 'bg-paper text-ink-900 border border-line-strong hover:border-ink-600 hover:bg-canvas',
  ghost: 'text-ink-800 hover:bg-ink-900/[0.05]',
  danger: 'bg-risk text-white hover:bg-risk-ink',
  store: 'bg-nexa-char text-white hover:bg-black',
  inverse: 'bg-white text-ink-900 hover:bg-white/90',
}

// a constante/variável sizes e atribui a ela o resultado da expressão desta linha.
const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-[13px] gap-1.5 rounded-md',
  md: 'h-10 px-4 text-sm gap-2 rounded-lg',
  lg: 'h-12 px-5 text-[15px] gap-2 rounded-lg',
}
export function Button({
  variant = 'primary',
  size = 'md',
  to,
  icon,
  iconRight,
  fullWidth,
  loading,
  className,
  children,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  // Declara a constante/variável classes e atribui a ela o resultado da expressão desta linha.
  const classes = cx(
    'inline-flex select-none items-center justify-center whitespace-nowrap font-medium transition-colors duration-150',
    'disabled:cursor-not-allowed disabled:opacity-50',
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
    className,
  )
  // Declara a constante/variável content e atribui a ela o resultado da expressão desta linha.
  const content = (
    <>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : icon}
      {children}
      {iconRight}
    </>
  )
  // Verifica a condição antes de executar o bloco seguinte.
  if (to && !disabled) {
    // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
    return (
      
      <Link to={to} className={classes}>
        {content}
      
      </Link>
    )
  }
  return (
    
    <button type={type} className={classes} disabled={disabled || loading} {...rest}>
      {content}
    
    </button>
  )
}
