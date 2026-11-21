import { useEffect, useMemo, useRef, useState } from 'react'
import type { Layers } from './MapView'
import type { HistEvent, Lang } from '../data/types'
import { PERIODS } from '../data/periods'
import { EVENTS } from '../data/events'
import { CAPITALS } from '../data/capitals'
import { STORIES } from '../data/stories'
import { fmtSpan, fmtYear, fold } from '../lib/time'
import { pick, tr } from '../lib/i18n'

export interface SearchHit {
  kind: 'period' | 'event' | 'place' | 'province' | 'story'
  label: string
  sub: string
  year?: number
  coord?: [number, number]
  event?: HistEvent
  story?: string
}

interface Props {
  lang: Lang
  layers: Layers
  provinces: { id: string; name: string; center: [number, number] }[]
  onLang: (l: Lang) => void
  onLayers: (l: Layers) => void
  onPick: (h: SearchHit) => void
  onTour: () => void
  onHelp: () => void
  onStories: () => void
  onCompare: () => void
  comparing: boolean
}

export default function Header({ lang, layers, provinces, onLang, onLayers, onPick, onTour, onHelp, onStories, onCompare, comparing }: Props) {
  const [menu, setMenu] = useState(false)
  const [q, setQ] = useState('')
  const [focus, setFocus] = useState(false)
  const [sel, setSel] = useState(0)
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        input.current?.focus()
      }
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [])

  const index = useMemo<SearchHit[]>(() => {
    const out: SearchHit[] = []
    for (const p of PERIODS)
      out.push({ kind: 'period', label: pick(lang, p.name), sub: `${fmtSpan(p.start, p.end, lang)}${p.founder ? ' · ' + pick(lang, p.founder) : ''}${p.rulers ? ' ' + p.rulers.join(' ') : ''}`, year: p.start })
    for (const e of EVENTS) out.push({ kind: 'event', label: pick(lang, e.title), sub: `${fmtYear(e.year, lang, true)} · ${pick(lang, e.desc)}`, year: e.year, coord: e.coord, event: e })
    for (const c of CAPITALS) out.push({ kind: 'place', label: pick(lang, c.name), sub: c.spans.map(([a, b]) => fmtSpan(a, b, lang)).join(', '), year: c.spans[0][0], coord: c.coord })
    for (const st of STORIES)
      out.push({ kind: 'story', label: pick(lang, st.title), sub: `${st.kind === 'battle' ? '⚔' : '👤'} ${pick(lang, st.sub)}`, year: st.year, story: st.id })
    for (const p of provinces) out.push({ kind: 'province', label: p.name, sub: tr(lang, 'province'), coord: p.center })
    return out
  }, [lang, provinces])

  const hits = useMemo(() => {
    const s = fold(q.trim())
    if (!s) return []
    const words = s.split(/\s+/)
    return index
      .map((h) => {
        const L = fold(h.label)
        const S = fold(h.sub)
        if (!words.every((w) => L.includes(w) || S.includes(w))) return null
        const score = (L.startsWith(s) ? 0 : L.includes(s) ? 1 : 2) + (h.kind === 'period' ? -0.5 : h.kind === 'story' ? -0.3 : 0)
        return { h, score }
      })
      .filter(Boolean)
      .sort((a, b) => a!.score - b!.score)
      .slice(0, 9)
      .map((x) => x!.h)
  }, [q, index])

  const choose = (h: SearchHit) => {
    onPick(h)
    setQ('')
    input.current?.blur()
  }

  const KIND: Record<SearchHit['kind'], string> = { period: tr(lang, 'period'), event: tr(lang, 'event'), place: tr(lang, 'place'), province: tr(lang, 'province'), story: lang === 'vi' ? 'Câu chuyện' : 'Story' }

  return (
    <header className="pointer-events-none absolute inset-x-3 top-3 z-30 flex items-center gap-2">
      <div className="glass pointer-events-auto flex h-11 items-center gap-2.5 rounded-xl px-3.5">
        <span className="logo" aria-hidden></span>
        <div className="leading-none">
          <h1 className="font-serif text-[17px] font-semibold tracking-tight">{tr(lang, 'appName')}</h1>
          <p className="mt-0.5 hidden text-[10.5px] text-ink/55 sm:block">{tr(lang, 'tagline')}</p>
        </div>
      </div>

      <div className="pointer-events-auto relative ml-auto w-[min(360px,40vw)] max-sm:hidden">
        <input
          ref={input}
          className="search glass"
          placeholder={`${tr(lang, 'search')}  ⌘K`}
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            setSel(0)
          }}
          onFocus={() => setFocus(true)}
          onBlur={() => setTimeout(() => setFocus(false), 150)}
          onKeyDown={(e) => {
            e.stopPropagation()
            if (e.key === 'ArrowDown') setSel((s) => Math.min(s + 1, hits.length - 1))
            else if (e.key === 'ArrowUp') setSel((s) => Math.max(s - 1, 0))
            else if (e.key === 'Enter' && hits[sel]) choose(hits[sel])
            else if (e.key === 'Escape') input.current?.blur()
          }}
        />
        {focus && q && (
          <div className="glass absolute inset-x-0 top-12 overflow-hidden rounded-xl py-1">
            {hits.length === 0 && <div className="px-3 py-2 text-[13px] text-ink/55">{tr(lang, 'noResult')}</div>}
            {hits.map((h, i) => (
              <button key={i} className={`search-hit ${i === sel ? 'sel' : ''}`} onMouseEnter={() => setSel(i)} onClick={() => choose(h)}>
                <span className={`kind kind-${h.kind}`}>{KIND[h.kind]}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{h.label}</span>
                  <span className="block truncate text-[11.5px] text-ink/55">{h.sub}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <button className="glass pointer-events-auto h-11 rounded-xl px-3 text-[13px] font-medium hover:bg-white/60 max-sm:ml-auto" onClick={onTour} title={tr(lang, 'nanTien')}>
        🧭 <span className="max-lg:hidden">{tr(lang, "nanTien")}</span>
      </button>

      <button className="glass pointer-events-auto h-11 rounded-xl px-3 text-[13px] font-medium hover:bg-white/60" onClick={onStories} title={lang === 'vi' ? 'Trận đánh & nhân vật' : 'Battles & people'}>
        ⚔ <span className="max-lg:hidden">{lang === 'vi' ? 'Trận đánh · Nhân vật' : 'Battles · People'}</span>
      </button>

      <button
        className={`glass pointer-events-auto h-11 rounded-xl px-3 text-[13px] font-medium hover:bg-white/60 max-sm:hidden ${comparing ? 'ring-2 ring-[#9c3a26]' : ''}`}
        onClick={onCompare}
        aria-pressed={comparing}
        title={lang === 'vi' ? 'So sánh hai năm' : 'Compare two years'}
      >
        ◧ <span className="max-xl:hidden">{lang === 'vi' ? 'So sánh' : 'Compare'}</span>
      </button>

      <div className="pointer-events-auto relative">
        <button className="glass h-11 rounded-xl px-3 text-[13px] font-medium hover:bg-white/60" onClick={() => setMenu(!menu)} aria-expanded={menu}>
          ◫ <span className="max-lg:hidden">{tr(lang, "layers")}</span>
        </button>
        {menu && (
          <div className="glass absolute right-0 top-12 w-60 rounded-xl p-2">
            {(Object.keys(layers) as (keyof Layers)[]).map((k) => (
              <label key={k} className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13.5px] hover:bg-ink/5">
                <input type="checkbox" className="accent-[#9c3a26]" checked={layers[k]} onChange={(e) => onLayers({ ...layers, [k]: e.target.checked })} />
                {tr(lang, k)}
              </label>
            ))}
          </div>
        )}
      </div>

      <button className="glass pointer-events-auto h-11 w-11 rounded-xl text-[15px] font-semibold hover:bg-white/60" onClick={onHelp} aria-label={lang === 'vi' ? 'Hướng dẫn' : 'Help'} title={lang === 'vi' ? 'Hướng dẫn' : 'Help'}>
        ?
      </button>

      <div className="glass pointer-events-auto flex h-11 items-center rounded-xl p-1 text-[12.5px] font-semibold">
        {(['vi', 'en'] as Lang[]).map((l) => (
          <button key={l} onClick={() => onLang(l)} className={`h-9 rounded-lg px-2.5 uppercase ${lang === l ? 'bg-ink text-paper' : 'text-ink/60 hover:text-ink'}`}>
            {l}
          </button>
        ))}
      </div>
    </header>
  )
}
