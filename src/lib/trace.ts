import { geoContains } from 'd3-geo'
import type { GeoData } from './geo'
import { MAX_YEAR, MIN_YEAR, provinceHistory } from './geo'
import { neighborPolity } from '../data/territory'

export interface TraceResult {
  kind: 'province' | 'neighbor' | 'sea'
  id: string | null
  name: string | null
  segments: { polity: string | null; from: number; to: number }[]
}

const NEIGHBOR_NAMES: Record<string, { vi: string; en: string }> = {
  china: { vi: 'Trung Quốc (ngày nay)', en: 'China (today)' },
  laos: { vi: 'Lào (ngày nay)', en: 'Laos (today)' },
  cambodia: { vi: 'Campuchia (ngày nay)', en: 'Cambodia (today)' },
  thailand: { vi: 'Thái Lan (ngày nay)', en: 'Thailand (today)' },
}

export function traceAt(geo: GeoData, p: [number, number], lang: 'vi' | 'en'): TraceResult {
  const prov = geo.provinces.features.find((f) => geoContains(f, p))
  if (prov) return { kind: 'province', id: prov.properties.id, name: prov.properties.name, segments: provinceHistory(prov.properties.id) }
  const nb = geo.neighbors.features.find((f) => NEIGHBOR_NAMES[f.properties.id] && geoContains(f, p))
  if (nb) {
    const id = nb.properties.id
    const segments: TraceResult['segments'] = []
    for (let y = MIN_YEAR; y <= MAX_YEAR; y++) {
      if (y === 0) continue
      const pol = neighborPolity(id, y)
      const last = segments[segments.length - 1]
      if (last && last.polity === pol) last.to = y
      else segments.push({ polity: pol, from: y, to: y })
    }
    return { kind: 'neighbor', id, name: NEIGHBOR_NAMES[id][lang], segments }
  }
  return { kind: 'sea', id: null, name: null, segments: [] }
}
