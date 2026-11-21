import { useEffect, useRef, useState } from 'react'
import { periodAt } from '../data/periods'
import type { Lang } from '../data/types'
import { fmtYear, normYear } from '../lib/time'
import { pick } from '../lib/i18n'

const PRESETS = [-257, 40, 939, 1069, 1306, 1471, 1611, 1698, 1757, 1802, 1884, 1954, 1975]

/** Vạch chia đôi màn hình: trái = năm trên dòng thời gian, phải = năm so sánh */
export default function CompareBar({
  split,
  onSplit,
  left,
  right,
  lang,
  onRight,
  onClose,
}: {
  split: number
  onSplit: (f: number) => void
  left: number
  right: number
  lang: Lang
  onRight: (y: number) => void
  onClose: () => void
}) {
  const drag = useRef(false)
  const [edit, setEdit] = useState(false)
  const [v, setV] = useState('')
  useEffect(() => {
    const move = (e: PointerEvent) => drag.current && onSplit(Math.min(0.92, Math.max(0.08, e.clientX / window.innerWidth)))
    const up = () => (drag.current = false)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
  }, [onSplit])
  const vi = lang === 'vi'
  return (
    <>
      <div className="cmp-divider" style={{ left: `${split * 100}%` }}>
        <div
          className="cmp-handle"
          role="slider"
          aria-label={vi ? 'Kéo để so sánh' : 'Drag to compare'}
          aria-valuenow={Math.round(split * 100)}
          tabIndex={0}
          onPointerDown={(e) => {
            e.preventDefault()
            drag.current = true
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') onSplit(Math.max(0.08, split - 0.03))
            if (e.key === 'ArrowRight') onSplit(Math.min(0.92, split + 0.03))
          }}
        >
          ⟨⟩
        </div>
      </div>
      <div className="cmp-badge left" style={{ right: `calc(${(1 - split) * 100}% + 14px)` }}>
        <b>{fmtYear(left, lang, true)}</b>
        <span>{pick(lang, periodAt(left).name)}</span>
        <small>{vi ? 'theo dòng thời gian' : 'timeline year'}</small>
      </div>
      <div className="cmp-badge right" style={{ left: `calc(${split * 100}% + 14px)` }}>
        <div className="flex items-center gap-1">
          <button className="btn-mini" onClick={() => onRight(normYear(right - 1, -1))} aria-label="−1">‹</button>
          {edit ? (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const n = parseInt(v.replace(/[^\d-]/g, ''), 10)
                if (Number.isFinite(n)) onRight(normYear(/tcn|bc/i.test(v) ? -Math.abs(n) : n))
                setEdit(false)
              }}
            >
              <input autoFocus className="cmp-input" value={v} onChange={(e) => setV(e.target.value)} onBlur={() => setEdit(false)} />
            </form>
          ) : (
            <button
              className="cmp-year"
              onClick={() => {
                setV(String(right))
                setEdit(true)
              }}
              title={vi ? 'Nhập năm' : 'Type a year'}
            >
              {fmtYear(right, lang, true)}
            </button>
          )}
          <button className="btn-mini" onClick={() => onRight(normYear(right + 1))} aria-label="+1">›</button>
          <button className="btn-mini ml-1" onClick={onClose} aria-label={vi ? 'Tắt so sánh' : 'Exit compare'} title={vi ? 'Tắt so sánh' : 'Exit compare'}>✕</button>
        </div>
        <span>{pick(lang, periodAt(right).name)}</span>
        <select className="cmp-presets" value="" onChange={(e) => e.target.value && onRight(Number(e.target.value))} aria-label={vi ? 'Mốc nhanh' : 'Quick picks'}>
          <option value="">{vi ? 'Chọn mốc…' : 'Jump to…'}</option>
          {PRESETS.map((y) => (
            <option key={y} value={y}>
              {fmtYear(y, lang, true)} · {pick(lang, periodAt(y).name)}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}
