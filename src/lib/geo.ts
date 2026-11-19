import { feature, merge, mesh } from 'topojson-client'
import type { Topology, GeometryCollection } from 'topojson-specification'
import type { Feature, FeatureCollection, MultiPolygon, Polygon, MultiLineString, Position } from 'geojson'
import { geoArea } from 'd3-geo'
import polylabel from 'polylabel'
import { provincePolity } from '../data/territory'
import { POLITIES, isVietRuled } from '../data/polities'

export interface GeoData {
  topo: Topology<{ provinces: GeometryCollection<{ id: string; name: string }> }>
  provinces: FeatureCollection<Polygon | MultiPolygon, { id: string; name: string }>
  neighbors: FeatureCollection<Polygon | MultiPolygon, { id: string }>
  rivers: FeatureCollection
  ids: string[]
  names: Record<string, string>
  areaKm2: Record<string, number>
}

const EARTH_R = 6371.0088

export async function loadGeo(): Promise<GeoData> {
  const base = import.meta.env.BASE_URL
  const [topo, neighbors, rivers] = await Promise.all([
    fetch(`${base}data/vn.topo.json`).then((r) => r.json()),
    fetch(`${base}data/neighbors.geojson`).then((r) => r.json()),
    fetch(`${base}data/rivers.geojson`).then((r) => r.json()),
  ])
  const provinces = feature(topo, topo.objects.provinces) as unknown as GeoData['provinces']
  const ids: string[] = []
  const names: Record<string, string> = {}
  const areaKm2: Record<string, number> = {}
  for (const f of provinces.features) {
    const id = f.properties.id
    ids.push(id)
    names[id] = f.properties.name
    areaKm2[id] = geoArea(f) * EARTH_R * EARTH_R
  }
  return { topo, provinces, neighbors, rivers, ids, names, areaKm2 }
}

export interface PolityShape {
  polity: string
  geometry: MultiPolygon
  /** điểm đặt nhãn (pole of inaccessibility của mảnh lớn nhất) */
  label: [number, number]
  area: number
}

const gid = (g: { properties?: unknown }) => (g.properties as { id: string }).id

const cache = new Map<string, { shapes: PolityShape[]; borders: MultiLineString }>()

/** Gộp tỉnh theo chính thể ở năm y → đa giác lãnh thổ + đường biên giữa các chính thể */
export function territoryAt(geo: GeoData, y: number) {
  const assign: Record<string, string | null> = {}
  for (const id of geo.ids) assign[id] = provincePolity(id, y)
  const sig = geo.ids.map((id) => assign[id] ?? '-').join('|')
  const hit = cache.get(sig)
  if (hit) return { ...hit, assign }

  const obj = geo.topo.objects.provinces
  const groups = new Map<string, typeof obj.geometries>()
  for (const g of obj.geometries) {
    const p = assign[gid(g)]
    if (!p) continue
    if (!groups.has(p)) groups.set(p, [])
    groups.get(p)!.push(g)
  }
  const shapes: PolityShape[] = []
  for (const [p, geoms] of groups) {
    const geometry = merge(geo.topo, geoms as never) as MultiPolygon
    const area = geoms.reduce((s, g) => s + geo.areaKm2[gid(g)], 0)
    shapes.push({ polity: p, geometry, area, label: labelPoint(geometry) })
  }
  const borders = mesh(geo.topo, obj, (a, b) => a !== b && assign[gid(a)] !== assign[gid(b)]) as MultiLineString
  const value = { shapes, borders }
  cache.set(sig, value)
  return { ...value, assign }
}

function ringArea(ring: Position[]) {
  let s = 0
  for (let i = 0, n = ring.length, j = n - 1; i < n; j = i++) s += (ring[j][0] - ring[i][0]) * (ring[j][1] + ring[i][1])
  return Math.abs(s / 2)
}

function labelPoint(mp: MultiPolygon): [number, number] {
  let best = mp.coordinates[0]
  let bestA = -1
  for (const poly of mp.coordinates) {
    const a = ringArea(poly[0])
    if (a > bestA) {
      bestA = a
      best = poly
    }
  }
  const p = polylabel(best as [number, number][][], 0.01)
  return [p[0], p[1]]
}

export function shapesToGeoJSON(shapes: PolityShape[]): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: shapes.map(
      (s): Feature => ({
        type: 'Feature',
        properties: { polity: s.polity, color: POLITIES[s.polity].color, kind: POLITIES[s.polity].kind },
        geometry: s.geometry,
      }),
    ),
  }
}

export const MIN_YEAR = -700
export const MAX_YEAR = 2026

/** Diện tích lãnh thổ do người Việt cai quản theo từng năm (km², theo ranh giới tỉnh hiện đại) */
export function areaSeries(geo: GeoData) {
  const out: { year: number; area: number }[] = []
  for (let y = MIN_YEAR; y <= MAX_YEAR; y++) {
    if (y === 0) continue
    let a = 0
    for (const id of geo.ids) if (isVietRuled(provincePolity(id, y))) a += geo.areaKm2[id]
    out.push({ year: y, area: a })
  }
  return out
}

/** Lịch sử chính thể của một tỉnh: các đoạn liên tục */
export function provinceHistory(pid: string) {
  const segs: { polity: string | null; from: number; to: number }[] = []
  for (let y = MIN_YEAR; y <= MAX_YEAR; y++) {
    if (y === 0) continue
    const p = provincePolity(pid, y)
    const last = segs[segs.length - 1]
    if (last && last.polity === p) last.to = y
    else segs.push({ polity: p, from: y, to: y })
  }
  return segs
}
