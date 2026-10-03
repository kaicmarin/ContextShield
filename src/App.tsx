import { BrowserRouter } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import { DemoProvider } from './context/DemoContext'
import { CartProvider } from './context/CartContext'
import { AppRoutes } from './routes'
import { ToastViewport } from './components/ui/ToastViewport'
import { DemoCenter } from './components/demo/DemoCenter'

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <DemoProvider>
          <CartProvider>
            <AppRoutes />
            <ToastViewport />
            <DemoCenter />
          </CartProvider>
        </DemoProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}