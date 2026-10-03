import type { Assessment } from '../../types/domain'
import { BANDS } from '../../services/riskModel'
import { riskMeta } from '../../services/labels'
import { cx } from '../../utils/format'

// a constante/variável bandCls e atribui a ela o resultado da expressão desta linha.
const bandCls: Record<string, string> = { LOW: 'bg-ok/70', MEDIUM: 'bg-warn/70', HIGH: 'bg-risk/75', CRITICAL: 'bg-critical' }
export function RiskMeter({ initial, final, dark }: { initial?: Assessment; final: Assessment; dark?: boolean }) {
  // Declara a constante/variável moved e atribui a ela o resultado da expressão desta linha.
  const moved = !!initial && initial.score !== final.score
  // Declara a constante/variável left e atribui a ela o resultado da expressão desta linha.
  const left = initial ? Math.min(initial.score, final.score) : final.score
  // Declara a constante/variável width e atribui a ela o resultado da expressão desta linha.
  const width = initial ? Math.abs(final.score - initial.score) : 0
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <div>
      
      <div className="relative pt-7">
        {moved && <span className={cx('absolute top-[34px] h-[2px]', dark ? 'bg-white/60' : 'bg-ink-900/60')} style={{ left: `${left}%`, width: `${width}%` }} aria-hidden />}
        
        <div className="flex h-2 gap-[2px] overflow-hidden rounded-full" aria-hidden>
          {BANDS.map((b) => (
            
            <span key={b.band} className={cx(bandCls[b.band], 'h-full')} style={{ width: `${b.max - b.min + 1}%` }} />
          ))}
        
        </div>
        {moved && initial && <Marker value={initial.score} label="Inicial" hollow dark={dark} />}
        
        <Marker value={final.score} label={moved ? 'Final' : 'Score'} dark={dark} />
      
      </div>
      
      <div className={cx('relative mt-2 h-3 font-mono text-[10px]', dark ? 'text-white/40' : 'text-subtle')} aria-hidden>
        {[0, 30, 55, 80, 100].map((v) => (
          
          <span key={v} className="absolute -translate-x-1/2" style={{ left: `${v}%` }}>
            {v}
          
          </span>
        ))}
      
      </div>
      
      <p className="sr-only">
        {initial && moved ? `Score inicial ${initial.score} (${riskMeta[initial.level].label}), ` : ''}score {final.score} ({riskMeta[final.level].label}).
      
      </p>
    
    </div>
  )
}

function Marker({ value, label, hollow, dark }: { value: number; label: string; hollow?: boolean; dark?: boolean }) {
  return (
    
    <span className="absolute top-0 flex -translate-x-1/2 flex-col items-center" style={{ left: `${Math.max(3, Math.min(97, value))}%` }} aria-hidden>
      
      <span className={cx('whitespace-nowrap font-mono text-[11px] font-medium', dark ? 'text-white' : 'text-ink-900')}>
        {label} {value}
      
      </span>
      
      <span className={cx('mt-1 h-3.5 w-3.5 rounded-full border-2', hollow ? (dark ? 'border-white bg-ink-900' : 'border-ink-900 bg-paper') : dark ? 'border-ink-900 bg-white' : 'border-paper bg-ink-900 shadow')} />
    
    </span>
  )
}
