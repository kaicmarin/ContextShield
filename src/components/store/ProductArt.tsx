import type { ReactNode } from 'react'
import type { Product, ProductKind } from '../../types/domain'
import { cx } from '../../utils/format'

// um tipo/interface TypeScript. Esta parte serve para tipagem em desenvolvimento e não vira lógica JavaScript em runtime.
type Finish = Product['finish']

// um tipo/interface TypeScript. Esta parte serve para tipagem em desenvolvimento e não vira lógica JavaScript em runtime.
interface Palette {
  body: string
  dark: string
  accent: string
  bg: string
  floor: string
}

// a constante/variável palettes e atribui a ela o resultado da expressão desta linha.
const palettes: Record<Finish, Palette> = {
  graphite: { body: '#2B3036', dark: '#16191D', accent: '#8A95A1', bg: '#E8E9EA', floor: '#D9DBDD' },
  silver: { body: '#CDD2D8', dark: '#8E969F', accent: '#5F6B78', bg: '#EEF0F2', floor: '#DEE2E6' },
  sand: { body: '#DCCDBA', dark: '#A8927A', accent: '#6B5A48', bg: '#F3EEE7', floor: '#E6DDD1' },
  midnight: { body: '#1F2C3C', dark: '#0E1622', accent: '#7188A8', bg: '#E5E9EF', floor: '#D5DBE3' },
  white: { body: '#F8F7F4', dark: '#CFCBC4', accent: '#8A8278', bg: '#EDEBE7', floor: '#DEDBD5' },
  sage: { body: '#AEBCA8', dark: '#6F8069', accent: '#3F4A3B', bg: '#ECF0EA', floor: '#DCE3D9' },
  clay: { body: '#BC7B58', dark: '#83503A', accent: '#4A2E22', bg: '#F4ECE6', floor: '#E8DBD1' },
}

// a constante/variável SCREEN e atribui a ela o resultado da expressão desta linha.
const SCREEN = '#11151A'
// a constante/variável GLASS e atribui a ela o resultado da expressão desta linha.
const GLASS = '#2A3440'
export function ProductArt({ product, className, size = 'md', pose = 0, bare }: { product: Product; className?: string; size?: 'sm' | 'md' | 'lg'; pose?: 0 | 1 | 2; bare?: boolean }) {
  // Declara a constante/variável p e atribui a ela o resultado da expressão desta linha.
  const p = palettes[product.finish]
  // Declara a constante/variável transform e atribui a ela o resultado da expressão desta linha.
  const transform = pose === 1 ? 'rotate(-7deg) scale(0.9)' : pose === 2 ? 'scale(1.35) translate(6%, 6%)' : 'none'
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    <div
      className={cx('relative flex aspect-square items-center justify-center overflow-hidden', size === 'sm' ? 'rounded-lg' : 'rounded-xl', className)}
      style={bare ? undefined : { backgroundColor: p.bg }}
      role="img"
      aria-label={product.name}
    >
      {!bare && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%]" style={{ backgroundColor: p.floor, opacity: 0.55 }} aria-hidden />}
      
      <div className="relative w-[74%] transition-transform duration-500" style={{ transform }} aria-hidden>
        
        <svg viewBox="0 0 240 240" className="w-full">
          
          <ellipse cx="120" cy="214" rx="78" ry="7" fill="#0A0D10" opacity=".10" />
          {art(product.kind, p)}
        
        </svg>
      
      </div>
    
    </div>
  )
}

function art(kind: ProductKind, c: Palette): ReactNode {
  switch (kind) {
    case 'notebook':
      return (
        
        <g>
          
          <rect x="44" y="52" width="152" height="104" rx="7" fill={c.dark} />
          
          <rect x="51" y="59" width="138" height="90" rx="2" fill={SCREEN} />
          
          <rect x="60" y="70" width="46" height="6" rx="2" fill="#fff" opacity=".14" />
          
          <rect x="60" y="82" width="88" height="3" rx="1.5" fill="#fff" opacity=".09" />
          
          <rect x="60" y="90" width="70" height="3" rx="1.5" fill="#fff" opacity=".07" />
          
          <path d="M22 160h196l-10 13a9 9 0 0 1-7 3H39a9 9 0 0 1-7-3z" fill={c.body} />
          
          <rect x="22" y="158" width="196" height="4" rx="2" fill={c.accent} opacity=".5" />
          
          <rect x="102" y="164" width="36" height="4" rx="2" fill={c.dark} opacity=".35" />
        
        </g>
      )
    case 'phone':
      return (
        
        <g>
          
          <rect x="78" y="22" width="84" height="178" rx="20" fill={c.body} />
          
          <rect x="84" y="28" width="72" height="166" rx="15" fill={SCREEN} />
          
          <rect x="108" y="34" width="24" height="6" rx="3" fill="#000" />
          
          <rect x="94" y="60" width="44" height="5" rx="2" fill="#fff" opacity=".14" />
          
          <rect x="94" y="72" width="30" height="4" rx="2" fill="#fff" opacity=".08" />
          
          <rect x="161" y="70" width="3" height="26" rx="1.5" fill={c.dark} />
        
        </g>
      )
    case 'tablet':
      return (
        
        <g>
          
          <rect x="50" y="30" width="140" height="176" rx="14" fill={c.body} />
          
          <rect x="57" y="37" width="126" height="162" rx="8" fill={SCREEN} />
          
          <rect x="68" y="52" width="60" height="6" rx="2" fill="#fff" opacity=".14" />
          
          <rect x="68" y="66" width="96" height="40" rx="4" fill="#fff" opacity=".06" />
          
          <circle cx="120" cy="33.5" r="1.6" fill={c.dark} />
        
        </g>
      )
    case 'headset':
      return (
        
        <g>
          
          <path d="M58 132c0-56 28-92 62-92s62 36 62 92" stroke={c.dark} strokeWidth="13" fill="none" strokeLinecap="round" />
          
          <path d="M92 44h56" stroke={c.accent} strokeWidth="5" strokeLinecap="round" opacity=".7" />
          
          <rect x="36" y="118" width="42" height="72" rx="18" fill={c.body} />
          
          <rect x="162" y="118" width="42" height="72" rx="18" fill={c.body} />
          
          <rect x="44" y="128" width="26" height="52" rx="11" fill={c.dark} opacity=".35" />
          
          <rect x="170" y="128" width="26" height="52" rx="11" fill={c.dark} opacity=".35" />
        
        </g>
      )
    case 'earbuds':
      return (
        
        <g>
          
          <rect x="62" y="104" width="116" height="86" rx="36" fill={c.body} stroke={c.dark} strokeOpacity=".4" strokeWidth="2" />
          
          <path d="M64 140h112" stroke={c.dark} strokeOpacity=".35" strokeWidth="2" />
          
          <circle cx="120" cy="164" r="3.5" fill={c.accent} />
          
          <path d="M84 50c14-7 30 2 30 18v30" stroke={c.body} strokeWidth="17" strokeLinecap="round" />
          
          <path d="M156 50c-14-7-30 2-30 18v30" stroke={c.body} strokeWidth="17" strokeLinecap="round" opacity=".9" />
          
          <circle cx="84" cy="50" r="10" fill={c.dark} />
          
          <circle cx="156" cy="50" r="10" fill={c.dark} />
        
        </g>
      )
    case 'speaker':
      return (
        
        <g>
          
          <rect x="72" y="28" width="96" height="178" rx="48" fill={c.body} />
          
          <rect x="80" y="44" width="80" height="146" rx="40" fill={c.dark} opacity=".85" />
          {Array.from({ length: 9 }).map((_, r) =>
            Array.from({ length: 4 }).map((__, col) => <circle key={`${r}-${col}`} cx={98 + col * 15} cy={64 + r * 14} r="2.2" fill={c.bg} opacity=".45" />),
          )}
        
        </g>
      )
    case 'watch':
      return (
        
        <g>
          
          <rect x="94" y="24" width="52" height="50" rx="12" fill={c.dark} />
          
          <rect x="94" y="166" width="52" height="50" rx="12" fill={c.dark} />
          
          <rect x="72" y="62" width="96" height="116" rx="30" fill={c.body} />
          
          <rect x="81" y="71" width="78" height="98" rx="22" fill={SCREEN} />
          
          <circle cx="120" cy="120" r="24" fill="none" stroke={c.accent} strokeWidth="4" strokeDasharray="100 52" strokeLinecap="round" />
          
          <rect x="167" y="108" width="6" height="22" rx="3" fill={c.dark} />
        
        </g>
      )
    case 'monitor':
      return (
        
        <g>
          
          <rect x="22" y="36" width="196" height="118" rx="7" fill={c.dark} />
          
          <rect x="29" y="43" width="182" height="104" rx="2" fill={SCREEN} />
          
          <rect x="40" y="56" width="70" height="7" rx="2" fill="#fff" opacity=".12" />
          
          <rect x="40" y="70" width="150" height="56" rx="3" fill="#fff" opacity=".05" />
          
          <path d="M108 156h24l6 30h-36z" fill={c.body} />
          
          <rect x="80" y="184" width="80" height="9" rx="4" fill={c.body} />
        
        </g>
      )
    case 'keyboard':
      return (
        
        <g>
          
          <rect x="14" y="82" width="212" height="84" rx="12" fill={c.body} />
          {Array.from({ length: 4 }).map((_, r) =>
            Array.from({ length: 12 }).map((__, col) => (
              
              <rect key={`${r}-${col}`} x={24 + col * 16.6} y={92 + r * 17} width="13.6" height="12.5" rx="2.5" fill={r === 3 && col > 3 && col < 8 ? c.accent : c.dark} opacity={r === 3 && col > 3 && col < 8 ? 0.6 : 0.85} />
            )),
          )}
        
        </g>
      )
    case 'mouse':
      return (
        
        <g>
          
          <path d="M120 30c34 0 54 30 54 76v44c0 36-24 62-54 62s-54-26-54-62v-44c0-46 20-76 54-76z" fill={c.body} />
          
          <path d="M120 34v62" stroke={c.dark} strokeOpacity=".45" strokeWidth="2.5" />
          
          <rect x="114" y="54" width="12" height="24" rx="6" fill={c.dark} />
        
        </g>
      )
    case 'console':
      return (
        
        <g>
          
          <rect x="82" y="26" width="76" height="180" rx="12" fill={c.body} />
          
          <rect x="116" y="26" width="8" height="180" fill={c.dark} />
          
          <rect x="108" y="180" width="24" height="4" rx="2" fill={c.accent} />
          
          <rect x="82" y="26" width="34" height="180" rx="12" fill="#fff" opacity=".06" />
        
        </g>
      )
    case 'controller':
      return (
        
        <g>
          
          <path d="M70 76h100c28 0 42 28 47 64 3 28-8 44-24 44-12 0-21-10-28-24H75c-7 14-16 24-28 24-16 0-27-16-24-44 5-36 19-64 47-64z" fill={c.body} />
          
          <circle cx="84" cy="118" r="14" fill={c.dark} opacity=".8" />
          
          <circle cx="160" cy="106" r="6" fill={c.dark} />
          
          <circle cx="176" cy="122" r="6" fill={c.dark} />
          
          <circle cx="144" cy="122" r="6" fill={c.dark} />
          
          <circle cx="160" cy="138" r="6" fill={c.dark} />
        
        </g>
      )
    case 'camera':
      return (
        
        <g>
          
          <rect x="64" y="40" width="112" height="140" rx="36" fill={c.body} />
          
          <circle cx="120" cy="96" r="32" fill={c.dark} />
          
          <circle cx="120" cy="96" r="18" fill={GLASS} />
          
          <circle cx="112" cy="88" r="5" fill="#8FA3B3" />
          
          <rect x="104" y="180" width="32" height="18" fill={c.dark} opacity=".6" />
          
          <rect x="80" y="196" width="80" height="12" rx="6" fill={c.body} />
        
        </g>
      )
    case 'mirrorless':
      return (
        
        <g>
          
          <rect x="30" y="78" width="180" height="104" rx="12" fill={c.body} />
          
          <rect x="44" y="64" width="52" height="20" rx="5" fill={c.body} />
          
          <rect x="30" y="78" width="180" height="26" rx="12" fill={c.dark} opacity=".25" />
          
          <circle cx="132" cy="132" r="42" fill={c.dark} />
          
          <circle cx="132" cy="132" r="30" fill={GLASS} />
          
          <circle cx="132" cy="132" r="16" fill="#1A222B" />
          
          <circle cx="124" cy="124" r="5" fill="#8FA3B3" />
          
          <rect x="176" y="68" width="18" height="10" rx="3" fill={c.accent} />
        
        </g>
      )
    case 'airfryer':
      return (
        
        <g>
          
          <path d="M66 50h108l14 150H52z" fill={c.body} />
          
          <rect x="74" y="60" width="92" height="36" rx="10" fill={SCREEN} />
          
          <circle cx="120" cy="78" r="9" fill="none" stroke={c.accent} strokeWidth="3" />
          
          <path d="M60 116h120" stroke={c.dark} strokeOpacity=".35" strokeWidth="2" />
          
          <rect x="98" y="136" width="44" height="12" rx="6" fill={c.dark} />
        
        </g>
      )
    case 'espresso':
      return (
        
        <g>
          
          <rect x="60" y="30" width="120" height="44" rx="10" fill={c.body} />
          
          <rect x="60" y="66" width="36" height="136" rx="6" fill={c.body} />
          
          <rect x="60" y="190" width="120" height="16" rx="6" fill={c.dark} />
          
          <rect x="112" y="74" width="30" height="14" rx="3" fill={c.dark} />
          
          <rect x="121" y="88" width="12" height="10" fill={c.dark} opacity=".7" />
          
          <path d="M112 150h32v26a10 10 0 0 1-10 10h-12a10 10 0 0 1-10-10z" fill="#fff" />
          
          <circle cx="160" cy="52" r="7" fill={c.accent} />
        
        </g>
      )
    case 'robot':
      return (
        
        <g>
          
          <ellipse cx="120" cy="140" rx="92" ry="44" fill={c.dark} opacity=".35" />
          
          <ellipse cx="120" cy="130" rx="92" ry="44" fill={c.body} />
          
          <ellipse cx="120" cy="124" rx="34" ry="14" fill={c.dark} opacity=".6" />
          
          <circle cx="120" cy="124" r="5" fill={c.accent} />
          
          <path d="M44 138a92 44 0 0 0 152 0" stroke={c.dark} strokeOpacity=".3" strokeWidth="3" fill="none" />
        
        </g>
      )
    case 'chair':
      return (
        
        <g>
          
          <rect x="74" y="26" width="92" height="104" rx="22" fill={c.body} />
          
          <rect x="84" y="36" width="72" height="84" rx="16" fill={c.dark} opacity=".25" />
          
          <rect x="66" y="132" width="108" height="24" rx="10" fill={c.body} />
          
          <rect x="116" y="156" width="8" height="30" fill={c.dark} />
          
          <path d="M72 204l48-18 48 18" stroke={c.dark} strokeWidth="7" strokeLinecap="round" fill="none" />
          
          <circle cx="72" cy="206" r="5" fill={c.dark} />
          
          <circle cx="168" cy="206" r="5" fill={c.dark} />
        
        </g>
      )
    case 'lamp':
      return (
        
        <g>
          
          <ellipse cx="120" cy="200" rx="40" ry="8" fill={c.body} />
          
          <path d="M120 198V120l-34-46" stroke={c.dark} strokeWidth="7" strokeLinecap="round" fill="none" />
          
          <path d="M60 60l44-20 22 34-44 22z" fill={c.body} />
          
          <path d="M82 96l44-22" stroke="#FFF4D6" strokeWidth="5" strokeLinecap="round" opacity=".9" />
          
          <circle cx="120" cy="120" r="6" fill={c.accent} />
        
        </g>
      )
    case 'drill':
      return (
        
        <g>
          
          <path d="M40 72h118a22 22 0 0 1 22 22v4a22 22 0 0 1-22 22H40z" fill={c.body} />
          
          <rect x="180" y="88" width="30" height="16" rx="3" fill={c.dark} />
          
          <rect x="208" y="92" width="22" height="8" rx="2" fill="#9AA3AB" />
          
          <path d="M84 120h40l-8 64H92z" fill={c.dark} />
          
          <rect x="80" y="178" width="52" height="30" rx="6" fill={c.body} />
          
          <rect x="116" y="124" width="10" height="20" rx="3" fill={c.accent} />
        
        </g>
      )
    case 'toolkit':
      return (
        
        <g>
          
          <rect x="34" y="92" width="172" height="104" rx="10" fill={c.body} />
          
          <path d="M92 92V70a8 8 0 0 1 8-8h40a8 8 0 0 1 8 8v22" stroke={c.dark} strokeWidth="9" fill="none" />
          
          <rect x="34" y="122" width="172" height="8" fill={c.dark} opacity=".35" />
          
          <rect x="108" y="116" width="24" height="20" rx="3" fill={c.accent} />
        
        </g>
      )
    case 'powerbank':
      return (
        
        <g>
          
          <rect x="72" y="36" width="96" height="168" rx="18" fill={c.body} />
          
          <rect x="72" y="36" width="96" height="168" rx="18" fill="none" stroke={c.dark} strokeOpacity=".3" strokeWidth="2" />
          {[0, 1, 2, 3].map((i) => (
            
            <circle key={i} cx={102 + i * 12} cy="172" r="3" fill={i < 3 ? c.accent : c.dark} opacity={i < 3 ? 1 : 0.3} />
          ))}
          
          <rect x="106" y="36" width="28" height="6" rx="2" fill={c.dark} />
        
        </g>
      )
    case 'backpack':
      return (
        
        <g>
          
          <path d="M92 50a28 28 0 0 1 56 0" stroke={c.dark} strokeWidth="8" fill="none" />
          
          <rect x="60" y="54" width="120" height="152" rx="34" fill={c.body} />
          
          <rect x="78" y="126" width="84" height="62" rx="14" fill={c.dark} opacity=".25" />
          
          <path d="M84 140h72" stroke={c.dark} strokeOpacity=".5" strokeWidth="3" strokeLinecap="round" />
          
          <rect x="112" y="78" width="16" height="6" rx="3" fill={c.accent} />
        
        </g>
      )
  }
}
