import type { ReactNode, ThHTMLAttributes, TdHTMLAttributes } from 'react'
import { useNavigate } from 'react-router-dom'
import { cx } from '../../utils/format'
export function Table({ children, minWidth = 880, className }: { children: ReactNode; minWidth?: number; className?: string }) {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <div className={cx('scrollbar-thin overflow-x-auto rounded-xl border border-line bg-paper', className)}>
      
      <table className="w-full border-collapse text-left text-[13px]" style={{ minWidth }}>
        {children}
      
      </table>
    
    </div>
  )
}

export function THead({ children }: { children: ReactNode }) {
  return (
    
    <thead className="border-b border-line bg-canvas/70">
      
      <tr>{children}</tr>
    
    </thead>
  )
}

export function Th({ children, className, ...rest }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    
    <th scope="col" className={cx('whitespace-nowrap px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-subtle', className)} {...rest}>
      {children}
    
    </th>
  )
}

export function Td({ children, className, ...rest }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    
    <td className={cx('whitespace-nowrap px-4 py-3 align-middle text-ink-900', className)} {...rest}>
      {children}
    
    </td>
  )
}

export function Tr({ children, to, highlight }: { children: ReactNode; to?: string; highlight?: boolean }) {
  const navigate = useNavigate()
  return (
    <tr
      onClick={
        to
          ? (e) => {
              if ((e.target as HTMLElement).closest('a,button')) return
              navigate(to)
            }
          : undefined
      }
      className={cx(
        'border-b border-line last:border-0 transition-colors',
        to && 'cursor-pointer hover:bg-signal-soft/40',
        highlight && 'bg-warn-soft/40',
      )}
    >
      {children}
    
    </tr>
  )
}
