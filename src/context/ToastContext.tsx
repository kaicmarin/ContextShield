import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

export interface Toast {
  id: string
  tone: 'info' | 'ok' | 'warn'
  title: string
  body: string
}

interface ToastValue {
  toasts: Toast[]
  pushToast: (t: Omit<Toast, 'id'>) => void
  dismissToast: (id: string) => void
}

const ToastContext = createContext<ToastValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const seq = useRef(0)
  const timers = useRef<number[]>([])

  useEffect(() => {
    return () => {
      for (const id of timers.current) window.clearTimeout(id)
    }
  }, [])

  const pushToast = useCallback((t: Omit<Toast, 'id'>) => {
    seq.current += 1
    const id = `toast-${seq.current}`
    setToasts((prev) => [...prev.slice(-3), { ...t, id }])
    const timer = window.setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 5200)
    timers.current.push(timer)
  }, [])

  const dismissToast = useCallback((id: string) => setToasts((prev) => prev.filter((x) => x.id !== id)), [])

  const value = useMemo(() => ({ toasts, pushToast, dismissToast }), [toasts, pushToast, dismissToast])
  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export function useToast(): ToastValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast deve ser usado dentro de ToastProvider')
  return ctx
}