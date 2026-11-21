import { useEffect, useState } from 'react'
import type { Lang } from '../data/types'
import { normYear } from './time'

export interface UrlState {
  year: number
  trace: [number, number] | null
  lang: Lang
  /** năm so sánh (chế độ chia đôi màn hình) */
  cmp: number | null
  /** câu chuyện đang phát */
  story: string | null
}

function read(): UrlState {
  const q = new URLSearchParams(location.search)
  const y = Number(q.get('year'))
  const tr = q.get('trace')?.split(',').map(Number)
  return {
    year: Number.isFinite(y) && q.get('year') ? normYear(y) : 1069,
    trace: tr && tr.length === 2 && tr.every(Number.isFinite) ? [tr[0], tr[1]] : null,
    lang: q.get('lang') === 'en' ? 'en' : 'vi',
    cmp: q.get('cmp') && Number.isFinite(Number(q.get('cmp'))) ? normYear(Number(q.get('cmp'))) : null,
    story: q.get('story'),
  }
}

/** Trạng thái đồng bộ với URL (chia sẻ link đúng năm / điểm tra cứu) */
export function useUrlState() {
  const [state, setState] = useState<UrlState>(read)
  useEffect(() => {
    const id = setTimeout(() => {
      const q = new URLSearchParams()
      q.set('year', String(state.year))
      if (state.trace) q.set('trace', state.trace.map((n) => n.toFixed(3)).join(','))
      q.set('lang', state.lang)
      if (state.cmp !== null) q.set('cmp', String(state.cmp))
      if (state.story) q.set('story', state.story)
      history.replaceState(null, '', `${location.pathname}?${q}`)
    }, 150)
    return () => clearTimeout(id)
  }, [state])
  return [state, setState] as const
}
