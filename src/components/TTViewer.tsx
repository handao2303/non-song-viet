import { useEffect } from 'react'
import passages from '../data/toanthu-passages.json'
import { TT, volName, volUrl } from '../data/toanthu'
import { EVENTS } from '../data/events'
import type { Lang } from '../data/types'
import { canChi, fmtYear } from '../lib/time'
import { pick } from '../lib/i18n'

const P = passages as Record<string, string>

/** Khung đọc nguyên văn Toàn thư ngay trong app (không cần mở trang ngoài) */
export default function TTViewer({ id, lang, onClose }: { id: string; lang: Lang; onClose: () => void }) {
  const c = TT[id]
  const ev = EVENTS.find((e) => e.id === id)
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [onClose])
  if (!c || !ev) return null

  const text = P[id] ?? c.quote
  const q = c.quote.replace(/…$/, '')
  const i = text.indexOf(q)
  const vi = lang === 'vi'

  return (
    <div className="guide-backdrop" onClick={onClose}>
      <div className="tt-viewer glass" role="dialog" aria-modal="true" aria-labelledby="tt-title" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-[.14em] text-[#86301f]">
              📜 {vi ? 'Đại Việt sử ký toàn thư' : 'Đại Việt sử ký toàn thư'} · {volName(c.vol, lang)}
            </div>
            <h3 id="tt-title" className="mt-1 font-serif text-[22px] leading-tight">
              {pick(lang, ev.title)}
            </h3>
            <div className="text-[12.5px] text-ink/60">
              {fmtYear(ev.year, lang, true)} · {vi ? 'năm' : 'year'} {canChi(ev.year)}
            </div>
          </div>
          <button className="btn-mini shrink-0" onClick={onClose} aria-label={vi ? 'Đóng' : 'Close'} autoFocus>
            ✕
          </button>
        </div>

        <blockquote className="tt-passage" lang="zh-Hant">
          {i >= 0 ? (
            <>
              {text.slice(0, i)}
              <mark>{q}</mark>
              {text.slice(i + q.length)}
            </>
          ) : (
            text
          )}
        </blockquote>

        <div className="rounded-lg bg-ink/[.04] px-3 py-2 text-[13px] leading-relaxed text-ink/80">
          <b>{vi ? 'Đại ý: ' : 'Summary: '}</b>
          {pick(lang, ev.desc)}
          {c.note && <span className="mt-1 block italic text-ink/65">{pick(lang, c.note)}</span>}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[12px] text-ink/55">
          <span>{vi ? 'Nguyên văn chữ Hán, bản Nội các quan bản (1697).' : 'Original Classical Chinese, 1697 imperial edition.'}</span>
          <a className="guide-btn ghost inline-flex items-center" href={volUrl(c.vol)} target="_blank" rel="noreferrer">
            {vi ? 'Đọc cả quyển trên Wikisource' : 'Read the volume on Wikisource'} ↗
          </a>
        </div>
      </div>
    </div>
  )
}
