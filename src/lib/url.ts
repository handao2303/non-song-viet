import { useEffect, useState } from 'react'
import type { Lang } from '../data/types'
import { normYear } from './time'

export interface UrlState {
  year: number
  trace: [number, number] | null
  lang: Lang
}

function read(): UrlState {
  const q = new URLSearchParams(location.search)
  const y = Number(q.get('year'))
  const tr = q.get('trace')?.split(',').map(Number)
  return {
    year: Number.isFinite(y) && q.get('year') ? normYear(y) : 1069,
    trace: tr && tr.length === 2 && tr.every(Number.isFinite) ? [tr[0], tr[1]] : null,
    lang: q.get('lang') === 'en' ? 'en' : 'vi',
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
      history.replaceState(null, '', `${location.pathname}?${q}`)
    }, 150)
    return () => clearTimeout(id)
  }, [state])
  return [state, setState] as const
}
