// ============================================================================
// ARQUIVO: contextshield/tailwind.config.js
// Este arquivo pertence ao projeto ContextShield.
// Os comentários foram adicionados para explicar a estrutura e a finalidade
// das partes do código. A lógica, os valores e as instruções originais foram mantidos.
// ============================================================================
/** @type {import('tailwindcss').Config} */
// Exporta este valor como exportação padrão do módulo, permitindo importá-lo sem chaves.
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        display: ['"Instrument Sans"', 'Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      colors: {
        // ContextShield core
        ink: {
          950: '#06101B',
          900: '#0A1928',
          800: '#112437',
          700: '#1B3349',
          600: '#2A4661',
        },
        canvas: '#F4F5F3',
        paper: '#FFFFFF',
        line: '#E2E5E8',
        'line-strong': '#CBD2D8',
        muted: '#5F6B78',
        subtle: '#8A95A1',
        signal: { DEFAULT: '#2F63F6', soft: '#ECF1FE', ink: '#1C45C2' },
        trace: { DEFAULT: '#0B9AAE', soft: '#E4F5F7', ink: '#07707F' },
        ok: { DEFAULT: '#1D8055', soft: '#E7F4ED', ink: '#135C3C' },
        warn: { DEFAULT: '#B26F12', soft: '#FCF2E1', ink: '#80500C' },
        risk: { DEFAULT: '#C03A28', soft: '#FBECE9', ink: '#8E2A1C' },
        critical: { DEFAULT: '#8F1A2A', soft: '#F8E6E9' },
        // NEXA store
        nexa: { sand: '#F3EFE9', stone: '#E7E1D8', char: '#161616', clay: '#9A5B3C' },
        // Aureon issuer
        aureon: { deep: '#0E2233', mist: '#EEF2F4', brass: '#A88A5A' },
      },
      boxShadow: {
        lift: '0 1px 0 rgba(10,25,40,0.04), 0 12px 32px -18px rgba(10,25,40,0.28)',
        panel: '0 1px 2px rgba(10,25,40,0.05)',
        pop: '0 24px 60px -24px rgba(6,16,27,0.45)',
      },
      fontSize: {
        display: ['3.5rem', { lineHeight: '1.02', letterSpacing: '-0.035em', fontWeight: '600' }],
        h1: ['2.25rem', { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '600' }],
        h2: ['1.625rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '600' }],
        h3: ['1.1875rem', { lineHeight: '1.35', letterSpacing: '-0.01em', fontWeight: '600' }],
        micro: ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.08em' }],
      },
      maxWidth: {
        stage: '1240px',
        ops: '1480px',
        read: '640px',
      },
      keyframes: {
        rise: { from: { opacity: '0', transform: 'translateY(6px)' }, to: { opacity: '1', transform: 'none' } },
        fade: { from: { opacity: '0' }, to: { opacity: '1' } },
        slidein: { from: { transform: 'translateX(100%)' }, to: { transform: 'none' } },
        scan: { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(100%)' } },
        breathe: { '0%,100%': { opacity: '0.35' }, '50%': { opacity: '1' } },
      },
      animation: {
        rise: 'rise 360ms ease-out both',
        fade: 'fade 240ms ease-out both',
        slidein: 'slidein 280ms cubic-bezier(.2,.8,.2,1) both',
        scan: 'scan 1.6s ease-in-out infinite',
        breathe: 'breathe 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
