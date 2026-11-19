import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { PERIODS } from '../data/periods'
import { POLITIES } from '../data/polities'
import { EVENTS, CAT_META } from '../data/events'
import type { Lang } from '../data/types'
import { canChi, fmtYear, fracToYear, normYear, yearToFrac } from '../lib/time'
import { pick, tr } from '../lib/i18n'

interface Props {
  year: number
  lang: Lang
  area: { year: number; area: number }[]
  playing: boolean
  speed: number
  onYear: (y: number) => void
  onPlay: (p: boolean) => void
  onSpeed: (s: number) => void
}

const TICKS = [-700, 1, 300, 600, 938, 1225, 1400, 1600, 1700, 1802, 1884, 1945, 1975, 2026]

export default function Timeline({ year, lang, area, playing, speed, onYear, onPlay, onSpeed }: Props) {
  const bar = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<number | null>(null)
  const dragging = useRef(false)

  const yearAt = useCallback((clientX: number) => {
    const r = bar.current!.getBoundingClientRect()
    return fracToYear((clientX - r.left) / r.width)
  }, [])

  useEffect(() => {
    const move = (e: PointerEvent) => dragging.current && onYear(yearAt(e.clientX))
    const up = () => (dragging.current = false)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
  }, [onYear, yearAt])

  // Đường diện tích lãnh thổ (sparkline)
  const areaPath = useMemo(() => {
    const max = Math.max(...area.map((a) => a.area))
    const pts: string[] = []
    let lastF = -1
    for (const a of area) {
      const f = yearToFrac(a.year)
      if (f - lastF < 0.0015 && a !== area[area.length - 1]) continue
      lastF = f
      pts.push(`${(f * 1000).toFixed(1)},${(40 - (a.area / max) * 36).toFixed(1)}`)
    }
    return `M0,40 L${pts.join(' L')} L1000,40 Z`
  }, [area])

  const cur = area.find((a) => a.year === year)
  const f = yearToFrac(year)

  return (
    <div className="timeline glass">
      <div className="flex items-center gap-2 sm:gap-3 px-3 pt-2.5">
        <button className="btn-round" onClick={() => onYear(normYear(year - 1, -1))} aria-label="−1">‹</button>
        <button className="btn-play" onClick={() => onPlay(!playing)} aria-label={playing ? tr(lang, 'pause') : tr(lang, 'play')}>
          {playing ? '❚❚' : '▶'}
        </button>
        <button className="btn-round" onClick={() => onYear(normYear(year + 1))} aria-label="+1">›</button>
        <select className="speed" value={speed} onChange={(e) => onSpeed(+e.target.value)} aria-label="speed">
          {[0.5, 1, 2, 4].map((s) => (
            <option key={s} value={s}>
              {s}×
            </option>
          ))}
        </select>
        <div className="flex-1 min-w-0">
          <YearInput year={year} lang={lang} onYear={onYear} />
        </div>
        {cur && (
          <div className="hidden md:block text-right leading-tight">
            <div className="text-[11px] uppercase tracking-wider text-ink/55">{tr(lang, 'area')}</div>
            <div className="font-serif text-lg tabular-nums">
              {Math.round(cur.area).toLocaleString(lang === 'vi' ? 'vi-VN' : 'en-US')} km²
            </div>
          </div>
        )}
      </div>

      <div
        ref={bar}
        className="relative mx-3 mt-2 mb-1 h-[74px] cursor-pointer select-none touch-none"
        onPointerDown={(e) => {
          dragging.current = true
          onYear(yearAt(e.clientX))
        }}
        onPointerMove={(e) => setHover(yearAt(e.clientX))}
        onPointerLeave={() => setHover(null)}
      >
        {/* sparkline diện tích */}
        <svg viewBox="0 0 1000 40" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-[34px] w-full">
          <defs>
            <linearGradient id="ag" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#b5452f" stopOpacity="0.5" />
              <stop offset="1" stopColor="#b5452f" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#ag)" stroke="#9c3a26" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>
        {/* sự kiện */}
        {EVENTS.map((e) => (
          <span
            key={e.id}
            className="absolute top-[34px] h-[6px] w-[2px] -translate-x-1/2 rounded-full"
            style={{ left: `${yearToFrac(e.year) * 100}%`, background: CAT_META[e.cat].color, opacity: 0.75 }}
          />
        ))}
        {/* dải thời kỳ */}
        <div className="absolute inset-x-0 top-[42px] h-[16px] overflow-hidden rounded-[4px] ring-1 ring-ink/15">
          {PERIODS.map((p) => {
            const a = yearToFrac(p.start)
            const b = yearToFrac(p.end + 1)
            const active = year >= p.start && year <= p.end
            return (
              <div
                key={p.id}
                title={`${pick(lang, p.name)} (${fmtYear(p.start, lang, true)}–${fmtYear(p.end, lang, true)})`}
                className="absolute inset-y-0 transition-[filter]"
                style={{
                  left: `${a * 100}%`,
                  width: `${(b - a) * 100}%`,
                  background: POLITIES[p.polity].color,
                  filter: active ? 'none' : 'saturate(.55) brightness(1.1)',
                  boxShadow: 'inset -1px 0 0 rgba(255,250,240,.6)',
                }}
              />
            )
          })}
        </div>
        {/* vạch năm */}
        {TICKS.map((t) => (
          <span key={t} className="tick" style={{ left: `${yearToFrac(t) * 100}%` }}>
            {t < 0 ? `${-t}${lang === 'vi' ? 'TCN' : 'BC'}` : t}
          </span>
        ))}
        {/* con trỏ */}
        <div className="cursor" style={{ left: `${f * 100}%` }}>
          <div className="cursor-line" />
          <div className="cursor-knob" />
        </div>
        {hover !== null && (
          <div className="hover-tip" style={{ left: `${yearToFrac(hover) * 100}%` }}>
            {fmtYear(hover, lang, true)}
          </div>
        )}
      </div>
      <div className="hidden lg:block px-3 pb-2 text-[11px] text-ink/50">{tr(lang, 'keys')}</div>
    </div>
  )
}

function YearInput({ year, lang, onYear }: { year: number; lang: Lang; onYear: (y: number) => void }) {
  const [editing, setEditing] = useState(false)
  const [v, setV] = useState('')
  if (editing)
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const n = parseInt(v.replace(/[^\d-]/g, ''), 10)
          const bce = /tcn|bc/i.test(v)
          if (Number.isFinite(n)) onYear(normYear(bce ? -Math.abs(n) : n))
          setEditing(false)
        }}
      >
        <input autoFocus className="year-input" value={v} onChange={(e) => setV(e.target.value)} onBlur={() => setEditing(false)} placeholder="1306, 257 TCN…" />
      </form>
    )
  return (
    <button
      className="year-display"
      onClick={() => {
        setV(String(year))
        setEditing(true)
      }}
      title={tr(lang, 'jump')}
    >
      {fmtYear(year, lang)}
      <span className="canchi">{canChi(year)}</span>
    </button>
  )
}
