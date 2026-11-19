import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import * as maplibregl from 'maplibre-gl'
import type { GeoJSONSource, Map as MLMap, StyleSpecification, MapMouseEvent } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url'
import type { GeoData } from '../lib/geo'
import { shapesToGeoJSON, territoryAt } from '../lib/geo'
import { neighborPolity, recentGain } from '../data/territory'
import { POLITIES } from '../data/polities'
import { capitalsAt } from '../data/capitals'
import { CAT_META, eventsNear } from '../data/events'
import type { HistEvent, Lang } from '../data/types'
import { pick } from '../lib/i18n'

export interface Layers {
  territories: boolean
  capitals: boolean
  events: boolean
  rivers: boolean
  relief: boolean
  modern: boolean
}

export interface FlyTarget {
  center: [number, number]
  zoom?: number
  key: number
}

interface Props {
  geo: GeoData
  year: number
  lang: Lang
  layers: Layers
  trace: [number, number] | null
  fly: FlyTarget | null
  activeEvent: string | null
  focusPolity: string | null
  onTrace: (p: [number, number]) => void
  onEvent: (e: HistEvent) => void
}

// Worker được Vite đóng gói thành asset riêng (cần cho bản build production)
maplibregl.setWorkerUrl(workerUrl)

const PAPER = '#efe7d3'
const SEA = '#c7d6d4'
const INK = '#3b3226'

const NEIGHBOR_ANCHORS: Record<string, [number, number]> = {
  china: [109.6, 23.9],
  laos: [102.6, 19.6],
  cambodia: [104.9, 12.8],
  thailand: [100.9, 15.6],
}

const STATIC_LABELS: { id: string; coord: [number, number]; vi: string; en: string; cls: string }[] = [
  { id: 'bien-dong', coord: [111.2, 13.2], vi: 'Biển Đông', en: 'East Sea', cls: 'sea' },
  { id: 'vinh-bac-bo', coord: [107.6, 20.2], vi: 'Vịnh Bắc Bộ', en: 'Gulf of Tonkin', cls: 'sea-sm' },
  { id: 'vinh-thai-lan', coord: [102.6, 10.4], vi: 'Vịnh Thái Lan', en: 'Gulf of Thailand', cls: 'sea-sm' },
  { id: 'hoang-sa', coord: [112.0, 16.6], vi: 'Q.đ. Hoàng Sa', en: 'Hoàng Sa (Paracel) Is.', cls: 'island' },
  { id: 'truong-sa', coord: [114.2, 10.0], vi: 'Q.đ. Trường Sa', en: 'Trường Sa (Spratly) Is.', cls: 'island' },
  { id: 'song-hong', coord: [105.25, 21.75], vi: 'S. Hồng', en: 'Red R.', cls: 'river' },
  { id: 'mekong', coord: [105.75, 11.2], vi: 'S. Mê Kông', en: 'Mekong', cls: 'river' },
  { id: 'truong-son', coord: [106.9, 15.0], vi: 'Dãy Trường Sơn', en: 'Annamite Range', cls: 'mountain' },
  { id: 'hoanh-son', coord: [106.15, 18.02], vi: 'Hoành Sơn', en: 'Hoành Sơn', cls: 'mountain' },
]

const style: StyleSpecification = {
  version: 8,
  sources: {
    neighbors: { type: 'geojson', data: { type: 'FeatureCollection', features: [] } },
    polities: { type: 'geojson', data: { type: 'FeatureCollection', features: [] } },
    borders: { type: 'geojson', data: { type: 'FeatureCollection', features: [] } },
    gained: { type: 'geojson', data: { type: 'FeatureCollection', features: [] } },
    provinces: { type: 'geojson', data: { type: 'FeatureCollection', features: [] } },
    rivers: { type: 'geojson', data: { type: 'FeatureCollection', features: [] } },
    line17: {
      type: 'geojson',
      data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [[106.56, 16.98], [106.75, 17.0], [106.92, 17.02], [107.11, 17.0]] } },
    },
    dem: {
      type: 'raster-dem',
      tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
      encoding: 'terrarium',
      tileSize: 256,
      maxzoom: 11,
      attribution: 'Terrain: Mapzen / AWS Terrain Tiles (SRTM, GMTED2010)',
    },
  },
  layers: [
    { id: 'sea', type: 'background', paint: { 'background-color': SEA } },
    { id: 'land-vn', type: 'fill', source: 'provinces', paint: { 'fill-color': PAPER } },
    { id: 'neighbors-fill', type: 'fill', source: 'neighbors', paint: { 'fill-color': PAPER, 'fill-opacity': 1 } },
    { id: 'neighbors-tint', type: 'fill', source: 'neighbors', paint: { 'fill-color': '#000', 'fill-opacity': 0 } },
    {
      id: 'polity-fill',
      type: 'fill',
      source: 'polities',
      paint: {
        'fill-color': ['get', 'color'],
        'fill-opacity': ['match', ['get', 'kind'], 'culture', 0.32, 'neighbor', 0.5, 'chinese', 0.5, 0.66],
        'fill-opacity-transition': { duration: 300 },
      },
    },
    {
      id: 'hillshade',
      type: 'hillshade',
      source: 'dem',
      paint: {
        'hillshade-exaggeration': 0.38,
        'hillshade-shadow-color': '#4a3b28',
        'hillshade-highlight-color': '#fffaf0',
        'hillshade-accent-color': '#5a4a33',
      },
    },
    { id: 'rivers', type: 'line', source: 'rivers', paint: { 'line-color': '#5f8fa3', 'line-width': ['interpolate', ['linear'], ['zoom'], 4, 0.6, 8, 1.8], 'line-opacity': 0.85 } },
    { id: 'provinces-line', type: 'line', source: 'provinces', paint: { 'line-color': INK, 'line-width': 0.4, 'line-opacity': 0.35, 'line-dasharray': [2, 2] } },
    { id: 'neighbors-line', type: 'line', source: 'neighbors', paint: { 'line-color': INK, 'line-width': 0.7, 'line-opacity': 0.4 } },
    { id: 'vn-coast', type: 'line', source: 'polities', paint: { 'line-color': INK, 'line-width': 0.5, 'line-opacity': 0.25 } },
    { id: 'gained-fill', type: 'fill', source: 'gained', paint: { 'fill-color': '#2e9d6f', 'fill-opacity': 0.28 } },
    { id: 'gained-glow', type: 'line', source: 'gained', paint: { 'line-color': '#2e9d6f', 'line-width': 7, 'line-opacity': 0.35, 'line-blur': 4 } },
    { id: 'gained-line', type: 'line', source: 'gained', paint: { 'line-color': '#1d7a52', 'line-width': 1.6, 'line-dasharray': [2, 1] } },
    { id: 'borders-halo', type: 'line', source: 'borders', paint: { 'line-color': '#fff8e8', 'line-width': 4, 'line-opacity': 0.6, 'line-blur': 1 } },
    { id: 'borders', type: 'line', source: 'borders', paint: { 'line-color': '#5a2a1a', 'line-width': 1.4, 'line-opacity': 0.85 } },
    { id: 'line17', type: 'line', source: 'line17', layout: { visibility: 'none' }, paint: { 'line-color': '#7a1010', 'line-width': 2.2, 'line-dasharray': [2, 1.2] } },
  ],
}

/** Chạy thay đổi style an toàn: nếu style chưa sẵn sàng thì thử lại sau 60ms (không chờ ảnh địa hình) */
function safely(fn: () => void, tries = 40) {
  try {
    fn()
  } catch (e) {
    if (tries > 0) setTimeout(() => safely(fn, tries - 1), 60)
    else console.warn(e)
  }
}

type MarkerItem = { id: string; coord: [number, number]; node: React.ReactNode; z?: number }

export default function MapView({ geo, year, lang, layers, trace, fly, activeEvent, focusPolity, onTrace, onEvent }: Props) {
  const box = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MLMap | null>(null)
  const [readyMap, setReadyMap] = useState<MLMap | null>(null)
  const [zoom, setZoom] = useState(5)
  // eslint-disable-next-line react-hooks/refs
  const ready = readyMap !== null && readyMap === mapRef.current
  const markers = useRef(new Map<string, maplibregl.Marker>())
  const [slots, setSlots] = useState<Record<string, HTMLElement>>({})
  const onTraceRef = useRef(onTrace)
  onTraceRef.current = onTrace

  // Khởi tạo bản đồ
  useEffect(() => {
    const narrow = window.innerWidth < 768
    const map = new maplibregl.Map({
      container: box.current!,
      style: structuredClone(style), // mỗi map một bản style riêng
      center: narrow ? [106.4, 15.8] : [106.6, 15.9],
      zoom: narrow ? 4.2 : 4.9,
      minZoom: 3.5,
      maxZoom: 11,
      maxBounds: [[88, -2], [128, 33]],
      attributionControl: false,
      dragRotate: false,
      pitchWithRotate: false,
    })
    map.touchZoomRotate.disableRotation()
    if (window.innerWidth >= 900) map.setPadding({ left: 380, top: 60, bottom: 150, right: 0 })
    else map.setPadding({ left: 0, top: 60, bottom: 140, right: 0 })
    map.addControl(new maplibregl.AttributionControl({ compact: true, customAttribution: 'geoBoundaries · Natural Earth' }), 'bottom-right')
    map.addControl(new maplibregl.ScaleControl({ maxWidth: 110, unit: 'metric' }), 'bottom-right')
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')
    // Không đợi 'load' (chờ cả ảnh địa hình) — dữ liệu vector có sẵn ngay khi style nạp xong
    map.once('style.load', () => {
      if (mapRef.current !== map) return // StrictMode: map cũ đã bị huỷ
      ;(map.getSource('provinces') as GeoJSONSource).setData(geo.provinces)
      ;(map.getSource('neighbors') as GeoJSONSource).setData(geo.neighbors)
      ;(map.getSource('rivers') as GeoJSONSource).setData(geo.rivers)
      setReadyMap(map)
    })
    map.on('zoom', () => setZoom(map.getZoom()))
    map.on('click', (e: MapMouseEvent) => onTraceRef.current([e.lngLat.lng, e.lngLat.lat]))
    map.getCanvas().style.cursor = 'crosshair'
    mapRef.current = map
    if (import.meta.env.DEV) {
      map.once('style.load', () => (document.body.dataset.styleAt = String(Math.round(performance.now()))))
      map.on('sourcedata', (e) => {
        if (e.sourceId === 'polities' && e.isSourceLoaded && !document.body.dataset.polAt) document.body.dataset.polAt = String(Math.round(performance.now()))
      })
      map.once('idle', () => (document.body.dataset.idleAt = String(Math.round(performance.now()))))
    }
    return () => {
      setReadyMap(null)
      for (const m of markers.current.values()) m.remove()
      setSlots({})
      map.remove()
      mapRef.current = null
      markers.current.clear()
    }
  }, [geo])

  const terr = useMemo(() => territoryAt(geo, year), [geo, year])

  // Cập nhật lãnh thổ theo năm
  useEffect(() => {
    const map = mapRef.current
    if (!map || !ready || !map.getSource('polities')) return
    safely(() => {
    ;(map.getSource('polities') as GeoJSONSource).setData(shapesToGeoJSON(terr.shapes))
    ;(map.getSource('borders') as GeoJSONSource).setData({ type: 'Feature', properties: {}, geometry: terr.borders })
    ;(map.getSource('gained') as GeoJSONSource).setData({ type: 'FeatureCollection', features: geo.provinces.features.filter((f) => recentGain(f.properties.id, year)) })
    const match: unknown[] = ['match', ['get', 'id']]
    const op: unknown[] = ['match', ['get', 'id']]
    for (const id of Object.keys(NEIGHBOR_ANCHORS).concat('taiwan')) {
      const p = neighborPolity(id, year)
      match.push(id, p ? POLITIES[p].color : PAPER)
      op.push(id, p ? 0.38 : 0)
    }
    match.push(PAPER)
    op.push(0)
    map.setPaintProperty('neighbors-tint', 'fill-color', match as never)
    map.setPaintProperty('neighbors-tint', 'fill-opacity', op as never)
    map.setLayoutProperty('line17', 'visibility', year >= 1954 && year <= 1975 ? 'visible' : 'none')
    })
  }, [terr, ready, year, geo])

  // Bật / tắt lớp
  useEffect(() => {
    const map = mapRef.current
    if (!map || !ready) return
    const vis = (id: string, on: boolean) => map.setLayoutProperty(id, 'visibility', on ? 'visible' : 'none')
    safely(() => {
    vis('polity-fill', layers.territories)
    vis('borders', layers.territories)
    vis('borders-halo', layers.territories)
    vis('neighbors-tint', layers.territories)
    for (const id of ['gained-fill', 'gained-glow', 'gained-line']) vis(id, layers.territories)
    vis('rivers', layers.rivers)
    vis('hillshade', layers.relief)
    vis('provinces-line', layers.modern)
    })
  }, [layers, ready])

  // Làm nổi một thế lực khi rê chuột vào chú thích
  useEffect(() => {
    const map = mapRef.current
    if (!map || !ready) return
    safely(() => {
      const base = ['match', ['get', 'kind'], 'culture', 0.32, 'neighbor', 0.5, 'chinese', 0.5, 0.66]
      map.setPaintProperty('polity-fill', 'fill-opacity', (focusPolity ? ['case', ['==', ['get', 'polity'], focusPolity], 0.88, 0.1] : base) as never)
    })
  }, [focusPolity, ready])

  // Bay tới vị trí
  useEffect(() => {
    if (fly && mapRef.current) mapRef.current.flyTo({ center: fly.center, zoom: fly.zoom ?? Math.max(mapRef.current.getZoom(), 6.2), duration: 1400, essential: true })
  }, [fly])

  // ——— Nhãn & điểm HTML ———
  const items: MarkerItem[] = []
  const anchored = new Set(Object.keys(NEIGHBOR_ANCHORS).map((id) => neighborPolity(id, year)))
  if (layers.territories) {
    for (const s of terr.shapes) {
      const p = POLITIES[s.polity]
      // chính thể đã có nhãn ở phía nước láng giềng → không lặp lại
      if (anchored.has(s.polity) || s.area < 2500) continue
      const big = s.area > 60000
      items.push({
        id: `pl-${s.polity}`,
        coord: s.label,
        z: 1,
        node: (
          <div className={`polity-label ${big ? 'big' : ''} ${p.kind}`} style={{ ['--c' as string]: p.color }}>
            <span className="pl-name">{pick(lang, p.name(year))}</span>
            {p.kind !== 'culture' && p.kind !== 'neighbor' && <span className="pl-dyn">{pick(lang, p.dynasty)}</span>}
          </div>
        ),
      })
    }
    for (const [id, c] of Object.entries(NEIGHBOR_ANCHORS)) {
      const pid = neighborPolity(id, year)
      if (!pid) continue
      const p = POLITIES[pid]
      items.push({
        id: `nb-${id}`,
        coord: c,
        z: 1,
        node: (
          <div className="polity-label neighbor-anchor" style={{ ['--c' as string]: p.color }}>
            <span className="pl-name">{pick(lang, p.name(year))}</span>
          </div>
        ),
      })
    }
  }
  for (const l of STATIC_LABELS) {
    if (l.cls === 'river' && !layers.rivers) continue
    if (l.cls === 'mountain' && zoom < 5.4) continue
    items.push({ id: `st-${l.id}`, coord: l.coord, z: 0, node: <div className={`static-label ${l.cls}`}>{l[lang]}</div> })
  }
  if (layers.capitals) {
    for (const c of capitalsAt(year)) {
      if (c.minor && zoom < 6.2) continue
      const p = POLITIES[c.polity]
      items.push({
        id: `cap-${c.id}`,
        coord: c.coord,
        z: 3,
        node: (
          <div className={`capital ${c.seat ? 'seat' : ''}`} style={{ ['--c' as string]: p.color }} title={pick(lang, c.note)}>
            <span className="cap-dot" />
            <span className="cap-name">{pick(lang, c.name)}</span>
          </div>
        ),
      })
    }
  }
  if (layers.events) {
    for (const e of eventsNear(year)) {
      const m = CAT_META[e.cat]
      const fresh = year - e.year <= 2 || (e.endYear && year <= e.endYear)
      items.push({
        id: `ev-${e.id}`,
        coord: e.coord,
        z: activeEvent === e.id ? 6 : 4,
        node: (
          <button
            className={`event-pin ${fresh ? 'fresh' : 'fading'} ${activeEvent === e.id ? 'active' : ''}`}
            style={{ ['--c' as string]: m.color }}
            onClick={(ev) => {
              ev.stopPropagation()
              onEvent(e)
            }}
          >
            <span className="ev-icon">{m.icon}</span>
            {(activeEvent === e.id || zoom > 6.3 || fresh) && <span className="ev-title">{pick(lang, e.title)}</span>}
          </button>
        ),
      })
    }
  }
  if (trace) {
    items.push({ id: 'trace', coord: trace, z: 8, node: <div className="trace-pin" /> })
  }

  const sig = items.map((i) => `${i.id}@${i.coord.join(',')}`).join('|')
  useEffect(() => {
    const map = mapRef.current
    if (!map || !ready) return
    const want = new Set(items.map((i) => i.id))
    let changed = false
    for (const [id, m] of markers.current) {
      if (!want.has(id)) {
        m.remove()
        markers.current.delete(id)
        changed = true
      }
    }
    for (const it of items) {
      const m = markers.current.get(it.id)
      if (m) {
        m.setLngLat(it.coord)
        m.getElement().style.zIndex = String(it.z ?? 0)
      } else {
        const el = document.createElement('div')
        el.className = 'mk'
        el.style.zIndex = String(it.z ?? 0)
        const mk = new maplibregl.Marker({ element: el, anchor: it.id === 'trace' ? 'bottom' : 'center' }).setLngLat(it.coord).addTo(map)
        markers.current.set(it.id, mk)
        changed = true
      }
    }
    if (changed) {
      const next: Record<string, HTMLElement> = {}
      for (const [id, m] of markers.current) next[id] = m.getElement()
      setSlots(next)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sig, ready])

  return (
    <div className="absolute inset-0">
      <div ref={box} className="h-full w-full" />
      {items.map((it) => (slots[it.id] ? createPortal(it.node, slots[it.id], it.id) : null))}
    </div>
  )
}
