import { ARCHIPELAGOS, MILESTONES } from '../data/islands'
import type { Lang } from '../data/types'
import { pick } from '../lib/i18n'

/** Bảng Hoàng Sa – Trường Sa: đơn vị hành chính và các mốc sử liệu */
export default function IslandsPanel({ lang, year, onYear, onClose }: { lang: Lang; year: number; onYear: (y: number) => void; onClose: () => void }) {
  const vi = lang === 'vi'
  return (
    <aside className="panel glass right-3 top-[68px] w-[min(360px,calc(100vw-24px))]">
      <div className="h-1.5 rounded-t-[14px] bg-[#86301f]" />
      <div className="flex items-start justify-between gap-2 p-4 pb-2">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-[.16em] text-ink/55">{vi ? 'Chủ quyền biển đảo' : 'Island sovereignty'}</div>
          <h3 className="font-serif text-[22px] leading-tight">{vi ? 'Hoàng Sa – Trường Sa' : 'Hoàng Sa & Trường Sa'}</h3>
        </div>
        <button className="btn-mini" onClick={onClose} aria-label={vi ? 'Đóng' : 'Close'}>
          ✕
        </button>
      </div>
      <div className="grid gap-1.5 px-4 pb-2">
        {ARCHIPELAGOS.map((a) => (
          <div key={a.id} className="rounded-lg bg-[#86301f]/[.07] px-3 py-2 text-[12.5px] leading-snug">
            <b className="text-[13.5px]">{pick(lang, a.name)}</b>
            <span className="block text-ink/70">{pick(lang, a.admin)}</span>
          </div>
        ))}
      </div>
      <div className="px-4 pt-1 text-[11px] uppercase tracking-[.16em] text-ink/55">{vi ? 'Các mốc sử liệu' : 'Milestones'}</div>
      <ol className="max-h-[46vh] overflow-y-auto px-3 pb-3 pt-1">
        {MILESTONES.map((m, i) => (
          <li key={i}>
            <button className={`ms-row ${year >= m.year ? 'past' : ''}`} onClick={() => onYear(m.year)}>
              <span className="ms-year">{m.year}</span>
              <span className="min-w-0 flex-1 text-[12.8px] leading-snug">
                {pick(lang, m.text)}
                {m.src && (
                  <span className="mt-0.5 block text-[11px] text-ink/45" lang="zh-Hant">
                    {m.src}
                  </span>
                )}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </aside>
  )
}
