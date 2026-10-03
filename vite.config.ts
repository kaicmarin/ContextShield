// ============================================================================
// ARQUIVO: contextshield/vite.config.ts
// Este arquivo pertence ao projeto ContextShield.
// Os comentários foram adicionados para explicar a estrutura e a finalidade
// das partes do código. A lógica, os valores e as instruções originais foram mantidos.
// ============================================================================
// Importa { defineConfig } a partir de dependência externa: vite (resolvida pelo Node/Vite a partir das dependências instaladas). O caminho é resolvido em relação a este arquivo.
import { defineConfig } from 'vite'
// Importa react a partir de dependência externa: @vitejs/plugin-react (resolvida pelo Node/Vite a partir das dependências instaladas). O caminho é resolvido em relação a este arquivo.
import react from '@vitejs/plugin-react'

// Exporta este valor como exportação padrão do módulo, permitindo importá-lo sem chaves.
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          icons: ['lucide-react'],
        },
      },
    },
  },
})
