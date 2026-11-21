import { useEffect, useRef, useState } from 'react'
import { periodAt } from '../data/periods'
import { POLITIES } from '../data/polities'
import type { Lang } from '../data/types'
import { fmtSpan } from '../lib/time'
import { pick } from '../lib/i18n'

/* ───────────── Mặt trống đồng Đông Sơn (SVG) ───────────── */
export function Drum({ size = 260, className = '' }: { size?: number; className?: string }) {
  const rays = 14
  const birds = 18
  return (
    <svg viewBox="-100 -100 200 200" width={size} height={size} className={`drum ${className}`} aria-hidden>
      <defs>
        <radialGradient id="drum-bg" r="1">
          <stop offset="0" stopColor="#c9a25a" stopOpacity=".28" />
          <stop offset=".7" stopColor="#9c6b2e" stopOpacity=".16" />
          <stop offset="1" stopColor="#6b4a22" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle r="98" fill="url(#drum-bg)" />
      {/* các vành hoa văn */}
      <g fill="none" stroke="#8a5a24" className="drum-rings">
        <circle r="95" strokeWidth="1.4" />
        <circle r="90" strokeWidth="3" strokeDasharray="1.2 3" />
        <circle r="84" strokeWidth=".8" />
        <circle r="62" strokeWidth=".8" />
        <circle r="57" strokeWidth="4" strokeDasharray=".9 2.4" />
        <circle r="51" strokeWidth=".8" />
        <circle r="44" strokeWidth="2.4" strokeDasharray="5 3" />
        <circle r="38" strokeWidth=".8" />
        <circle r="31" strokeWidth=".8" />
      </g>
      {/* vành chim Lạc bay ngược chiều kim đồng hồ */}
      <g className="drum-birds">
        {Array.from({ length: birds }, (_, i) => (
          <g key={i} transform={`rotate(${(360 / birds) * i}) translate(0 -73)`}>
            <path d="M-9 0 C-4 -3 2 -3 6 -1 L13 -2.5 L7 0.6 C3 2.5 -3 2.6 -9 0 Z M-2 -1 L-6 -7 L1 -1.6 Z M0 1.5 L-3 6 L3 1.2 Z" fill="#8a5a24" />
          </g>
        ))}
      </g>
      {/* ngôi sao giữa */}
      <g className="drum-star">
        <circle r="10" fill="#8a5a24" />
        {Array.from({ length: rays }, (_, i) => (
          <path key={i} d="M0 -28 L3.2 -9 L-3.2 -9 Z" fill="#8a5a24" transform={`rotate(${(360 / rays) * i})`} />
        ))}
        {Array.from({ length: rays }, (_, i) => (
          <path key={`f${i}`} d="M0 -26 L1.6 -15 L-1.6 -15 Z" fill="#e8d7b0" opacity=".5" transform={`rotate(${(360 / rays) * i + 360 / rays / 2})`} />
        ))}
        <circle r="4" fill="#efe2c4" />
      </g>
    </svg>
  )
}

/* ───────────── Màn mở đầu ───────────── */
export function Splash({ leaving, lang }: { leaving: boolean; lang: Lang }) {
  const [gone, setGone] = useState(false)
  useEffect(() => {
    if (!leaving) return
    const id = setTimeout(() => setGone(true), 900)
    return () => clearTimeout(id)
  }, [leaving])
  if (gone) return null
  const vi = lang === 'vi'
  return (
    <div className={`splash ${leaving ? 'leaving' : ''}`} aria-busy={!leaving}>
      <div className="splash-inner">
        <Drum size={240} />
        <h1 className="splash-title">
          {[...(vi ? 'Non Sông Việt' : 'Vietnam Through Time')].map((c, i) => (
            <span key={i} style={{ animationDelay: `${0.35 + i * 0.045}s` }}>
              {c === ' ' ? ' ' : c}
            </span>
          ))}
        </h1>
        <p className="splash-sub">{vi ? 'Hơn 2.700 năm lãnh thổ, triều đại và sự kiện' : '2,700 years of land, dynasties and events'}</p>
        <p className="splash-load">{leaving ? (vi ? 'Mở bản đồ…' : 'Opening the map…') : vi ? 'Đang trải bản đồ…' : 'Unrolling the map…'}</p>
      </div>
    </div>
  )
}

/* ───────────── Dấu triện khi sang thời kỳ mới ───────────── */
const SEAL: Record<string, string> = {
  vanlang: '文郎', aulac: '甌雒', trieu: '趙', bt1: '北屬', trung: '徵', bt2: '北屬', vanxuan: '萬春', bt3: '北屬',
  tuchu: '曲', ngo: '吳', dinh: '丁', tienle: '黎', ly: '李', tran: '陳', ho: '胡', hautran: '後陳', minh: '明屬',
  leso: '黎', mac: '莫', trinhnguyen: '鄭阮', tayson: '西山', nguyen: '阮', phap: '法屬', vndcch: '越南',
  chiacat: '南北', chxhcn: '越南',
}

export function PeriodStamp({ year, lang, quiet }: { year: number; lang: Lang; quiet: boolean }) {
  const p = periodAt(year)
  const prev = useRef(p.id)
  const [show, setShow] = useState<{ id: string; k: number } | null>(null)
  useEffect(() => {
    if (prev.current === p.id) return
    prev.current = p.id
    if (quiet) return
    setShow({ id: p.id, k: Date.now() })
    const t = setTimeout(() => setShow(null), 2300)
    return () => clearTimeout(t)
  }, [p.id, quiet])
  if (!show) return null
  const per = periodAt(year)
  const seal = SEAL[show.id] ?? ''
  const color = POLITIES[per.polity]?.color ?? '#9c3a26'
  return (
    <div className="stamp" key={show.k} aria-hidden>
      <div className="stamp-seal" lang="zh-Hant" style={{ ['--n' as string]: seal.length }}>
        {seal.split('').map((c, i) => (
          <span key={i}>{c}</span>
        ))}
      </div>
      <div className="stamp-text">
        <b style={{ color }}>{pick(lang, per.name)}</b>
        <span>{fmtSpan(per.start, per.end, lang)}</span>
      </div>
    </div>
  )
}

/** Vân giấy dó + tối nhẹ ở viền */
export function PaperOverlay() {
  return <div className="paper-overlay" aria-hidden />
}
