import { useEffect, useMemo, useRef, useState } from 'react'
import { periodAt, PERIODS } from '../data/periods'
import { POLITIES } from '../data/polities'
import { CAT_META, EVENTS } from '../data/events'
import { ANNEX_INFO, provinceRegion } from '../data/territory'
import type { HistEvent, Lang } from '../data/types'
import type { PolityShape } from '../lib/geo'
import type { TraceResult } from '../lib/trace'
import { canChi, fmtSpan, fmtYear } from '../lib/time'
import { TT, TT_ABSENT, TT_END, volName, volUrl } from '../data/toanthu'
import { pick, tr } from '../lib/i18n'

/* ───────────── Thời kỳ hiện tại ───────────── */
export function PeriodPanel({
  year,
  lang,
  shapes,
  activeEvent,
  onEvent,
  onYear,
  focusPolity,
  onFocusPolity,
  onOpenTT,
}: {
  year: number
  lang: Lang
  shapes: PolityShape[]
  activeEvent: string | null
  onEvent: (e: HistEvent) => void
  onYear: (y: number) => void
  focusPolity: string | null
  onFocusPolity: (p: string | null) => void
  onOpenTT: (id: string) => void
}) {
  const p = periodAt(year)
  const [open, setOpen] = useState(() => window.innerWidth >= 768)
  const list = useMemo(() => EVENTS.filter((e) => e.year >= p.start && e.year <= p.end), [p])
  const listRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    listRef.current?.querySelector('.ev-row.active')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [activeEvent])
  const idx = PERIODS.indexOf(p)
  const powers = [...shapes].sort((a, b) => b.area - a.area)
  const color = POLITIES[p.polity].color

  return (
    <aside className="panel glass left-3 top-[68px] w-[min(372px,calc(100vw-24px))]">
      <div className="h-1.5 rounded-t-[14px]" style={{ background: color }} />
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-[.16em] text-ink/55">
              {tr(lang, 'period')} · {fmtSpan(p.start, p.end, lang)}
            </div>
            <h2 className="font-serif text-[26px] leading-tight text-ink">{pick(lang, p.name)}</h2>
          </div>
          <div className="flex shrink-0 gap-1 pt-1">
            <button className="btn-mini" disabled={idx <= 0} onClick={() => onYear(PERIODS[idx - 1].start)} aria-label="prev period">‹</button>
            <button className="btn-mini" disabled={idx >= PERIODS.length - 1} onClick={() => onYear(PERIODS[idx + 1].start)} aria-label="next period">›</button>
            <button className="btn-mini" onClick={() => setOpen(!open)} aria-label="toggle" aria-expanded={open}>{open ? '–' : '+'}</button>
          </div>
        </div>
        {open && (
          <>
            <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-[13px]">
              {p.title && (
                <>
                  <dt className="text-ink/55">{tr(lang, 'stateName')}</dt>
                  <dd className="font-medium">{pick(lang, p.title)}</dd>
                </>
              )}
              {p.founder && (
                <>
                  <dt className="text-ink/55">{tr(lang, 'founder')}</dt>
                  <dd>{pick(lang, p.founder)}</dd>
                </>
              )}
              {p.capital && (
                <>
                  <dt className="text-ink/55">{tr(lang, 'capital')}</dt>
                  <dd>{pick(lang, p.capital)}</dd>
                </>
              )}
            </dl>
            <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink/85">{pick(lang, p.summary)}</p>
            {p.tt && (
              <div className="tt-note">
                <span className="tt-badge">📜 {tr(lang, 'toanthu')} · {volName(p.tt.vol, lang)}</span>
                {pick(lang, p.tt.note)}
                <a className="tt-ext" href={volUrl(p.tt.vol)} target="_blank" rel="noreferrer">Wikisource ↗</a>
              </div>
            )}
            {p.rulers && (
              <details className="mt-2 text-[12.5px]">
                <summary className="cursor-pointer text-ink/60 hover:text-ink">
                  {tr(lang, 'rulers')} ({p.rulers.length})
                </summary>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {p.rulers.map((r) => (
                    <span key={r} className="chip">{r}</span>
                  ))}
                </div>
              </details>
            )}
          </>
        )}
      </div>

      {open && (
        <>
          <div className="border-t border-ink/10 px-4 py-2.5">
            <div className="mb-1.5 text-[11px] uppercase tracking-[.16em] text-ink/55">{tr(lang, 'onMap')}</div>
            <div className="flex flex-wrap gap-1.5">
              {powers.map((s) => (
                <button
                  key={s.polity}
                  className={`legend-chip ${focusPolity === s.polity ? 'on' : ''}`}
                  onMouseEnter={() => onFocusPolity(s.polity)}
                  onMouseLeave={() => onFocusPolity(null)}
                  onClick={() => onFocusPolity(focusPolity === s.polity ? null : s.polity)}
                  title={`${pick(lang, POLITIES[s.polity].dynasty)} · ≈ ${Math.round(s.area).toLocaleString(lang === 'vi' ? 'vi-VN' : 'en-US')} km²`}
                >
                  <i style={{ background: POLITIES[s.polity].color }} />
                  {pick(lang, POLITIES[s.polity].name(year))}
                  <small>{Math.round(s.area / 1000).toLocaleString()}k km²</small>
                </button>
              ))}
            </div>
          </div>
          <div className="border-t border-ink/10">
            <div className="px-4 pt-2.5 text-[11px] uppercase tracking-[.16em] text-ink/55">
              {tr(lang, 'eventsIn')} · {list.length}
            </div>
            <div ref={listRef} className="max-h-[30vh] overflow-y-auto px-2 pb-2 pt-1">
              {list.map((e) => {
                const active = activeEvent === e.id
                const past = e.year <= year
                return (
                  <div key={e.id}>
                  <button className={`ev-row ${active ? 'active' : ''} ${past ? '' : 'future'}`} onClick={() => onEvent(e)}>
                    <span className="ev-year">{fmtYear(e.year, lang, true)}</span>
                    <span className="ev-dot" style={{ background: CAT_META[e.cat].color }}>{CAT_META[e.cat].icon}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium leading-snug">{pick(lang, e.title)}</span>
                      {active && <span className="mt-0.5 block text-[12.5px] leading-snug text-ink/75">{pick(lang, e.desc)}</span>}
                    </span>
                    {TT[e.id] && <span className="tt-dot" title={tr(lang, 'toanthu')}>史</span>}
                  </button>
                  {active && <Cite id={e.id} year={e.year} lang={lang} onOpen={onOpenTT} />}
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </aside>
  )
}

/* ───────────── Trích dẫn Đại Việt sử ký toàn thư ───────────── */
function Cite({ id, year, lang, onOpen }: { id: string; year: number; lang: Lang; onOpen: (id: string) => void }) {
  const c = TT[id]
  if (c)
    return (
      <button className="tt-cite" onClick={() => onOpen(id)}>
        <span className="tt-badge">
          📜 {tr(lang, 'toanthu')} · {volName(c.vol, lang)} · {lang === 'vi' ? 'năm' : 'year'} {canChi(year)}
        </span>
        <span className="tt-quote" lang="zh-Hant">「{c.quote}」</span>
        {c.note && <span className="tt-sub">{pick(lang, c.note)}</span>}
        <span className="tt-more">{lang === 'vi' ? 'Đọc đoạn nguyên văn →' : 'Read the passage →'}</span>
      </button>
    )
  const why = TT_ABSENT[id]
  return (
    <div className="tt-cite absent">
      <span className="tt-badge">{year > TT_END ? tr(lang, 'afterTT') : tr(lang, 'notInTT')}</span>
      {why && year <= TT_END && <span className="tt-sub">{pick(lang, why)}</span>}
    </div>
  )
}

/* ───────────── Tra cứu một điểm ───────────── */
export function TracePanel({
  result,
  coord,
  year,
  lang,
  onYear,
  onClose,
}: {
  result: TraceResult
  coord: [number, number]
  year: number
  lang: Lang
  onYear: (y: number) => void
  onClose: () => void
}) {
  // Tách đoạn khi tên gọi đổi (Lâm Ấp → Hoàn Vương → Chiêm Thành, các triều Trung Hoa…)
  const rows = useMemo(() => {
    const out: { polity: string | null; from: number; to: number; label: string }[] = []
    for (const s of result.segments) {
      for (let y = s.from; y <= s.to; y++) {
        if (y === 0) continue
        const label = s.polity ? pick(lang, POLITIES[s.polity].name(y)) : tr(lang, 'unclaimed')
        const last = out[out.length - 1]
        if (last && last.polity === s.polity && last.label === label) last.to = y
        else out.push({ polity: s.polity, from: y, to: y, label })
      }
    }
    return out.reverse()
  }, [result, lang])

  const region = result.id ? provinceRegion(result.id) : undefined
  const annex = region ? ANNEX_INFO[region] : undefined

  return (
    <aside className="panel glass right-3 top-[68px] w-[min(330px,calc(100vw-24px))]">
      <div className="flex items-start justify-between gap-2 p-4 pb-2">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-[.16em] text-ink/55">{tr(lang, 'trace')}</div>
          <h3 className="font-serif text-[22px] leading-tight">{result.name ?? (lang === 'vi' ? 'Biển' : 'Sea')}</h3>
          <div className="text-[11.5px] tabular-nums text-ink/50">
            {coord[1].toFixed(3)}°N, {coord[0].toFixed(3)}°E
          </div>
        </div>
        <button className="btn-mini" onClick={onClose} aria-label={tr(lang, 'close')}>✕</button>
      </div>
      {annex && (
        <div className="mx-4 mb-2 rounded-lg bg-[#2e7d6b]/10 px-3 py-2 text-[12.5px] leading-snug text-[#1f5a4c]">
          ⚑ {tr(lang, 'gainedBy')}: {annex[lang]}
        </div>
      )}
      {rows.length === 0 ? (
        <p className="px-4 pb-4 text-[13px] text-ink/70">{tr(lang, 'traceHint')}</p>
      ) : (
        <ol className="max-h-[48vh] overflow-y-auto px-3 pb-3">
          {rows.map((r, i) => {
            const active = year >= r.from && year <= r.to
            return (
              <li key={i}>
                <button className={`trace-row ${active ? 'active' : ''}`} onClick={() => onYear(r.from)}>
                  <span className="trace-bar" style={{ background: r.polity ? POLITIES[r.polity].color : '#d9cfb9' }} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13.5px] font-medium leading-snug">{r.label}</span>
                    <span className="block text-[11.5px] text-ink/55">
                      {r.polity && POLITIES[r.polity].kind !== 'neighbor' && POLITIES[r.polity].kind !== 'culture' ? pick(lang, POLITIES[r.polity].dynasty) + ' · ' : ''}
                      {fmtSpan(r.from, r.to, lang)} · {r.to - r.from + (r.from < 0 && r.to > 0 ? 0 : 1)} {tr(lang, 'years')}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      )}
    </aside>
  )
}
