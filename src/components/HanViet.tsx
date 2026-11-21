import { useEffect, useMemo, useState } from 'react'
import type { Lang } from '../data/types'

/** g: chữ → [âm chính, âm khác, nghĩa (Thiều Chửu)] · p: mã đoạn → âm từng ký tự */
type HV = { g: Record<string, [string, string[], string]>; p: Record<string, (string | null)[]> }
let cache: Promise<HV> | null = null
const loadHV = () => (cache ??= import('../data/hanviet.json').then((m) => m.default as unknown as HV))

const PUNCT: Record<string, string> = { '，': ',', '、': ',', '。': '.', '：': ':', '；': ';', '！': '!', '？': '?', '「': '“', '」': '”', '『': '‘', '』': '’', '（': '(', '）': ')', '…': '…' }
const END = new Set(['。', '！', '？', '「', '：'])

/**
 * Đoạn nguyên văn chữ Hán + phiên âm Hán Việt:
 * rê chuột / chạm vào chữ để xem âm và nghĩa, dòng phiên âm đầy đủ bên dưới.
 */
export default function HanVietText({ pid, text, mark, lang }: { pid: string; text: string; mark?: [number, number]; lang: Lang }) {
  const [hv, setHv] = useState<HV | null>(null)
  const [hover, setHover] = useState<number | null>(null)
  const [pinned, setPinned] = useState<number | null>(null)
  const [ruby, setRuby] = useState(false)
  useEffect(() => {
    let live = true
    loadHV().then((d) => live && setHv(d))
    return () => {
      live = false
    }
  }, [])
  useEffect(() => setPinned(null), [pid])

  const rd = hv?.p[pid]
  const cur = hover ?? pinned
  const inMark = (i: number) => !!mark && i >= mark[0] && i < mark[0] + mark[1]

  // Dòng phiên âm: viết hoa đầu câu, đổi dấu câu
  const phien = useMemo(() => {
    if (!rd) return null
    const out: { i: number; s: string; sep: string }[] = []
    let cap = true
    for (let i = 0; i < text.length; i++) {
      const ch = text[i]
      const r = rd[i]
      if (r) {
        out.push({ i, s: cap ? r[0].toUpperCase() + r.slice(1) : r, sep: '' })
        cap = false
      } else if (PUNCT[ch] !== undefined || /\s/.test(ch)) {
        if (out.length) out[out.length - 1].sep += PUNCT[ch] ?? ''
        if (END.has(ch)) cap = true
      } else if (/[㐀-鿿豈-﫿\u{20000}-\u{3134f}]/u.test(ch)) {
        out.push({ i, s: '□', sep: '' })
      }
    }
    return out
  }, [rd, text])

  const info = cur !== null && hv ? hv.g[text[cur]] : null
  const vi = lang === 'vi'

  return (
    <div className="hv">
      <div className="hv-tools">
        <span>{vi ? 'Rê chuột hoặc chạm vào chữ để xem âm & nghĩa' : 'Hover or tap a character for its reading & meaning'}</span>
        <button className={`hv-toggle ${ruby ? 'on' : ''}`} onClick={() => setRuby(!ruby)} disabled={!rd} aria-pressed={ruby}>
          {vi ? 'Âm trên chữ' : 'Readings above'}
        </button>
      </div>
      <blockquote className={`tt-passage ${ruby ? 'ruby' : ''}`} lang="zh-Hant" onMouseLeave={() => setHover(null)}>
        {[...text].map((ch, i) => {
          const r = rd?.[i]
          const cls = `${inMark(i) ? 'mk' : ''} ${cur === i ? 'cur' : ''}`
          if (!r) return <span key={i} className={cls}>{ch}</span>
          return ruby ? (
            <ruby key={i} className={`hv-c ${cls}`} onMouseEnter={() => setHover(i)} onClick={() => setPinned(pinned === i ? null : i)}>
              {ch}
              <rt lang="vi">{r}</rt>
            </ruby>
          ) : (
            <span key={i} className={`hv-c ${cls}`} onMouseEnter={() => setHover(i)} onClick={() => setPinned(pinned === i ? null : i)}>
              {ch}
            </span>
          )
        })}
      </blockquote>

      <div className="hv-info" aria-live="polite">
        {info && cur !== null ? (
          <>
            <span className="hv-big" lang="zh-Hant">{text[cur]}</span>
            <span className="min-w-0">
              <b>{rd?.[cur]}</b>
              {info[1].length > 0 && <small> · {vi ? 'âm khác' : 'also'}: {info[1].join(', ')}</small>}
              <span className="block text-[12.5px] leading-snug text-ink/75">{info[2] || '—'}</span>
            </span>
          </>
        ) : (
          <span className="text-ink/50">{rd ? (vi ? 'Chọn một chữ trong đoạn trên.' : 'Pick a character above.') : vi ? 'Đang tải từ điển…' : 'Loading dictionary…'}</span>
        )}
      </div>

      {phien && (
        <div className="hv-phien" lang="vi">
          <div className="hv-label">{vi ? 'Phiên âm Hán Việt' : 'Sino-Vietnamese reading'}</div>
          <p>
            {phien.map((w) => (
              <span key={w.i}>
                <span className={`${inMark(w.i) ? 'mk' : ''} ${cur === w.i ? 'cur' : ''}`} onMouseEnter={() => setHover(w.i)}>
                  {w.s}
                </span>
                {w.sep}{' '}
              </span>
            ))}
          </p>
          <div className="hv-src">
            {vi
              ? 'Âm và nghĩa theo Hán Việt tự điển của Thiều Chửu; chữ đa âm được chọn theo từ ghép, có thể còn sai ở tên riêng.'
              : 'Readings & glosses from Thiều Chửu’s Hán Việt dictionary; polyphonic characters chosen by compound, proper names may be off.'}
          </div>
        </div>
      )}
    </div>
  )
}
