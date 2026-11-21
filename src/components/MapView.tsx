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
import type { Arrow, LngLat, MarkIcon, Story } from '../data/stories'
import { liveAt } from '../data/stories'
import { ISLANDS, ARCHIPELAGOS } from '../data/islands'
import Portrait from './Portrait'

export interface Layers {
  territories: boolean
  capitals: boolean
  events: boolean
  rivers: boolean
  relief: boolean
  modern: boolean
  islands: boolean
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
  story?: { s: Story; step: number } | null
  /** bản đồ phụ khi so sánh hai năm */
  compare?: boolean
  syncGroup?: Set<MLMap>
  onIslands?: () => void
  onStory?: (id: string) => void
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
    'story-lines': { type: 'geojson', data: { type: 'FeatureCollection', features: [] } },
    'story-heads': { type: 'geojson', data: { type: 'FeatureCollection', features: [] } },
    'story-dots': { type: 'geojson', data: { type: 'FeatureCollection', features: [] } },
    islands: { type: 'geojson', data: { type: 'FeatureCollection', features: [] } },
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
    { id: 'polity-hover-glow', type: 'line', source: 'polities', filter: ['==', ['get', 'polity'], ''], paint: { 'line-color': ['get', 'color'], 'line-width': 10, 'line-opacity': 0.35, 'line-blur': 6 } },
    { id: 'polity-hover', type: 'line', source: 'polities', filter: ['==', ['get', 'polity'], ''], paint: { 'line-color': '#fffaf0', 'line-width': 2.2, 'line-opacity': 0.95 } },
    { id: 'borders-halo', type: 'line', source: 'borders', paint: { 'line-color': '#fff8e8', 'line-width': 4, 'line-opacity': 0.6, 'line-blur': 1 } },
    { id: 'borders', type: 'line', source: 'borders', paint: { 'line-color': '#5a2a1a', 'line-width': 1.4, 'line-opacity': 0.85 } },
    { id: 'islands-box', type: 'line', source: 'islands', filter: ['==', ['get', 'k'], 'box'], paint: { 'line-color': '#86301f', 'line-width': 1.2, 'line-opacity': 0.55, 'line-dasharray': [3, 2] } },
    { id: 'islands-dot', type: 'circle', source: 'islands', filter: ['==', ['get', 'k'], 'isl'], paint: { 'circle-radius': ['interpolate', ['linear'], ['zoom'], 4, 1.6, 8, 4], 'circle-color': '#e9dcc0', 'circle-stroke-color': '#86301f', 'circle-stroke-width': 1 } },
    { id: 'story-casing', type: 'line', source: 'story-lines', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#fffaf0', 'line-width': ['case', ['get', 'cur'], 8, 5], 'line-opacity': ['case', ['get', 'cur'], 0.85, 0.4] } },
    { id: 'story-line', type: 'line', source: 'story-lines', filter: ['!', ['get', 'dash']], layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': ['get', 'color'], 'line-width': ['case', ['get', 'cur'], 4.2, 2.6], 'line-opacity': ['case', ['get', 'cur'], 0.95, 0.42] } },
    { id: 'story-dash', type: 'line', source: 'story-lines', filter: ['get', 'dash'], paint: { 'line-color': ['get', 'color'], 'line-width': ['case', ['get', 'cur'], 3.6, 2.4], 'line-opacity': ['case', ['get', 'cur'], 0.95, 0.42], 'line-dasharray': [1.6, 1.1] } },
    { id: 'story-dots', type: 'circle', source: 'story-dots', paint: { 'circle-radius': 4.2, 'circle-color': ['get', 'color'], 'circle-stroke-color': '#fffaf0', 'circle-stroke-width': 1.6, 'circle-opacity': ['get', 'o'], 'circle-stroke-opacity': ['get', 'o'] } },
    { id: 'story-head', type: 'fill', source: 'story-heads', paint: { 'fill-color': ['get', 'color'], 'fill-opacity': ['case', ['get', 'cur'], 0.95, 0.42] } },
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

const SIDE_COLOR = { vn: '#c0392b', foe: '#26364f', life: '#a8741a' }
const MARK_ICON: Record<MarkIcon, string> = { win: '⚑', fall: '✕', camp: '▲', stake: '⫶', city: '●', star: '★' }
let syncing = false

/** Cắt đường theo tỉ lệ độ dài (0–1), tính trên mặt phẳng gần đúng */
function slicePath(path: LngLat[], f: number): LngLat[] {
  if (f >= 1) return path
  const k = Math.cos((path[0][1] * Math.PI) / 180)
  const seg: number[] = []
  let total = 0
  for (let i = 1; i < path.length; i++) {
    const d = Math.hypot((path[i][0] - path[i - 1][0]) * k, path[i][1] - path[i - 1][1])
    seg.push(d)
    total += d
  }
  let want = total * f
  const out: LngLat[] = [path[0]]
  for (let i = 1; i < path.length; i++) {
    if (want >= seg[i - 1]) {
      out.push(path[i])
      want -= seg[i - 1]
    } else {
      const r = seg[i - 1] ? want / seg[i - 1] : 0
      out.push([path[i - 1][0] + (path[i][0] - path[i - 1][0]) * r, path[i - 1][1] + (path[i][1] - path[i - 1][1]) * r])
      break
    }
  }
  return out
}

/** Đầu mũi tên tam giác, dựng theo pixel màn hình để luôn cân đối */
function arrowHead(map: MLMap, path: LngLat[], px: number): LngLat[] | null {
  if (path.length < 2) return null
  const tip = map.project(path[path.length - 1])
  let prev = map.project(path[path.length - 2])
  for (let i = path.length - 2; i >= 0 && Math.hypot(tip.x - prev.x, tip.y - prev.y) < 2; i--) prev = map.project(path[i])
  const len = Math.hypot(tip.x - prev.x, tip.y - prev.y)
  if (len < 1) return null
  const dx = (tip.x - prev.x) / len
  const dy = (tip.y - prev.y) / len
  const bx = tip.x - dx * px * 0.55
  const by = tip.y - dy * px * 0.55
  const pts: [number, number][] = [
    [tip.x + dx * px * 0.45, tip.y + dy * px * 0.45],
    [bx - dy * px * 0.5, by + dx * px * 0.5],
    [bx + dy * px * 0.5, by - dx * px * 0.5],
  ]
  const ring = pts.map((p) => map.unproject(p)).map((l) => [l.lng, l.lat] as LngLat)
  return [...ring, ring[0]]
}

type MarkerItem = { id: string; coord: [number, number]; node: React.ReactNode; z?: number }

export default function MapView({ geo, year, lang, layers, trace, fly, activeEvent, focusPolity, story, compare, syncGroup, onIslands, onStory, onTrace, onEvent }: Props) {
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
  const tipRef = useRef<HTMLDivElement>(null)
  const yearRef = useRef(year)
  yearRef.current = year
  const langRef = useRef(lang)
  langRef.current = lang

  // Khởi tạo bản đồ
  useEffect(() => {
    const narrow = window.innerWidth < 768
    const map = new maplibregl.Map({
      container: box.current!,
      style: structuredClone(style), // mỗi map một bản style riêng
      center: narrow ? [106.4, 15.8] : [106.6, 15.9],
      zoom: narrow ? 4.2 : 4.9,
      minZoom: 3.5,
      maxZoom: 13,
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
      ;(map.getSource('islands') as GeoJSONSource).setData({
        type: 'FeatureCollection',
        features: [
          ...ARCHIPELAGOS.map((a) => ({ type: 'Feature' as const, properties: { k: 'box' }, geometry: { type: 'LineString' as const, coordinates: a.box } })),
          ...ISLANDS.map((i) => ({ type: 'Feature' as const, properties: { k: 'isl', id: i.id }, geometry: { type: 'Point' as const, coordinates: i.coord } })),
        ],
      })
      setReadyMap(map)
    })
    map.on('zoom', () => setZoom(map.getZoom()))
    // Rê chuột vào một vùng lãnh thổ: viền sáng + nhãn tên
    let hovered = ''
    map.on('mousemove', 'polity-fill', (e) => {
      const pid = e.features?.[0]?.properties?.polity as string | undefined
      const tip = tipRef.current
      if (!pid || !tip || !POLITIES[pid]) return
      if (pid !== hovered) {
        hovered = pid
        const f: never = ['==', ['get', 'polity'], pid] as never
        map.setFilter('polity-hover', f)
        map.setFilter('polity-hover-glow', f)
        const p = POLITIES[pid]
        const L = langRef.current
        const nm = pick(L, p.name(yearRef.current))
        const dy = p.kind === 'neighbor' || p.kind === 'culture' ? '' : pick(L, p.dynasty)
        tip.innerHTML = `<i style="background:${p.color}"></i><span><b></b><small></small></span>`
        tip.querySelector('b')!.textContent = nm
        tip.querySelector('small')!.textContent = dy
      }
      tip.style.display = 'flex'
      tip.style.left = `${e.point.x}px`
      tip.style.top = `${e.point.y}px`
    })
    map.on('mouseleave', 'polity-fill', () => {
      hovered = ''
      const none: never = ['==', ['get', 'polity'], ''] as never
      map.setFilter('polity-hover', none)
      map.setFilter('polity-hover-glow', none)
      if (tipRef.current) tipRef.current.style.display = 'none'
    })
    map.on('movestart', () => tipRef.current && (tipRef.current.style.display = 'none'))
    // Đồng bộ camera giữa hai bản đồ khi so sánh
    syncGroup?.add(map)
    map.on('move', () => {
      if (syncing || !syncGroup) return
      syncing = true
      for (const o of syncGroup) if (o !== map) o.jumpTo({ center: map.getCenter(), zoom: map.getZoom() })
      syncing = false
    })
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
    if (syncGroup) {
      const other = [...syncGroup].find((o) => o !== map)
      if (other) map.jumpTo({ center: other.getCenter(), zoom: other.getZoom() })
    }
    return () => {
      syncGroup?.delete(map)
      setReadyMap(null)
      for (const m of markers.current.values()) m.remove()
      setSlots({})
      map.remove()
      mapRef.current = null
      markers.current.clear()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    for (const id of ['gained-fill', 'gained-glow', 'gained-line']) vis(id, layers.territories && !compare)
    vis('rivers', layers.rivers)
    vis('hillshade', layers.relief)
    vis('provinces-line', layers.modern)
    vis('islands-box', layers.islands)
    vis('islands-dot', layers.islands)
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

  // Trận đánh / nhân vật tự hiện theo năm khi không mở câu chuyện nào
  const live = !story && !compare && layers.events ? liveAt(year) : null
  const liveKey = live ? live.battles.map((b) => `${b.s.id}:${b.step}`).join('|') : ''
  const spec = useMemo(() => {
    type C = { a: Arrow; color: string }
    if (story) {
      const { s, step } = story
      const col = (a: Arrow) => (s.kind === 'life' ? SIDE_COLOR.life : SIDE_COLOR[a.side])
      return {
        past: s.steps.slice(0, step).flatMap((x) => (x.arrows ?? []).map((a): C => ({ a, color: col(a) }))),
        cur: (s.steps[step]?.arrows ?? []).map((a): C => ({ a, color: col(a) })),
        head: 17,
      }
    }
    if (!liveKey) return null
    const past: C[] = []
    const cur: C[] = []
    for (const part of liveKey.split('|')) {
      const [id, st] = part.split(':')
      const b = live!.battles.find((x) => x.s.id === id)!.s
      const step = Number(st)
      b.steps.slice(0, step).forEach((x) => (x.arrows ?? []).forEach((a) => past.push({ a, color: SIDE_COLOR[a.side] })))
      ;(b.steps[step].arrows ?? []).forEach((a) => cur.push({ a, color: SIDE_COLOR[a.side] }))
    }
    return { past, cur, head: 12 }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story, liveKey])

  // Diễn biến trận đánh / hành trình: vẽ mũi tên chạy dần
  useEffect(() => {
    const map = mapRef.current
    if (!map || !ready) return
    const lines = map.getSource('story-lines') as GeoJSONSource | undefined
    const heads = map.getSource('story-heads') as GeoJSONSource | undefined
    const dots = map.getSource('story-dots') as GeoJSONSource | undefined
    if (!lines || !heads || !dots) return
    if (!spec) {
      safely(() => {
        lines.setData({ type: 'FeatureCollection', features: [] })
        heads.setData({ type: 'FeatureCollection', features: [] })
        dots.setData({ type: 'FeatureCollection', features: [] })
      })
      return
    }
    const past = spec.past.map((x) => x.a)
    const cur = spec.cur.map((x) => x.a)
    const colors = new Map<Arrow, string>([...spec.past, ...spec.cur].map((x) => [x.a, x.color]))
    const color = (a: Arrow) => colors.get(a) ?? SIDE_COLOR.vn
    let f = 0
    const draw = () => {
      const L: GeoJSON.Feature[] = []
      const H: GeoJSON.Feature[] = []
      const add = (a: Arrow, isCur: boolean, frac: number) => {
        const p = slicePath(a.path, frac)
        if (p.length < 2) return
        const props = { color: color(a), cur: isCur, dash: !!(a.retreat || a.line) }
        L.push({ type: 'Feature', properties: props, geometry: { type: 'LineString', coordinates: p } })
        if (!a.line) {
          const h = arrowHead(map, p, isCur ? spec.head : spec.head * 0.7)
          if (h) H.push({ type: 'Feature', properties: props, geometry: { type: 'Polygon', coordinates: [h] } })
        }
      }
      for (const a of past) add(a, false, 1)
      for (const a of cur) add(a, true, f)
      lines.setData({ type: 'FeatureCollection', features: L })
      heads.setData({ type: 'FeatureCollection', features: H })
    }
    let raf = 0
    let lastDots = 0
    const t0 = performance.now() + (story ? 500 : 0) // chờ camera bay tới
    // "quân" chạy liên tục dọc các mũi tên của bước hiện tại
    const moving = cur.filter((a) => !a.line)
    const drawDots = (now: number) => {
      const D: GeoJSON.Feature[] = []
      for (const a of moving) {
        const n = a.navy ? 2 : 3
        for (let k = 0; k < n; k++) {
          const ph = ((now - t0) / (a.retreat ? 2600 : 1900) + k / n) % 1
          const p = slicePath(a.path, ph * f)
          const fade = Math.min(1, ph * 6, (1 - ph) * 6)
          D.push({ type: 'Feature', properties: { color: color(a), o: f < 0.25 ? 0 : fade }, geometry: { type: 'Point', coordinates: p[p.length - 1] } })
        }
      }
      dots.setData({ type: 'FeatureCollection', features: D })
    }
    const tick = (now: number) => {
      const done = f >= 1
      f = Math.max(0, Math.min(1, (now - t0) / 1700))
      f = 1 - Math.pow(1 - f, 2.2)
      if (!done) safely(draw, 0)
      if (moving.length && now - lastDots > 33) {
        lastDots = now
        safely(() => drawDots(now), 0)
      }
      if (now - t0 < 1700 || moving.length) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    const onZoom = () => !raf || f >= 1 ? safely(draw, 0) : undefined
    map.on('zoom', onZoom)
    return () => {
      cancelAnimationFrame(raf)
      map.off('zoom', onZoom)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spec, ready])

  // Chừa chỗ cho bảng câu chuyện bên phải
  useEffect(() => {
    const map = mapRef.current
    if (!map || !ready || compare) return
    const wide = window.innerWidth >= 900
    map.setPadding({ left: wide ? 380 : 0, top: 60, bottom: wide ? 150 : 140, right: story && wide ? 400 : 0 })
  }, [story, ready, compare])

  // Bay tới vị trí
  useEffect(() => {
    if (fly && mapRef.current && ready) mapRef.current.flyTo({ center: fly.center, zoom: fly.zoom ?? Math.max(mapRef.current.getZoom(), 6.2), duration: 1400, essential: true })
  }, [fly, ready])

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
    if (l.cls === 'island' && layers.islands) continue
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
  if (story) {
    const { s: st, step } = story
    st.steps.slice(0, step + 1).forEach((x, si) =>
      (x.marks ?? []).forEach((m, mi) => {
        const isCur = si === step
        if (!isCur && st.kind === 'battle' && m.icon !== 'win' && m.icon !== 'fall' && m.icon !== 'star') return
        items.push({
          id: `sm-${si}-${mi}`,
          coord: m.coord,
          z: isCur ? 7 : 5,
          node: (
            <div className={`story-mark ${m.icon} ${isCur ? 'cur' : 'past'} ${st.kind}`}>
              {st.kind === 'life' && isCur ? <Portrait id={st.id} size={44} className="sm-portrait" /> : <span className="sm-ic">{MARK_ICON[m.icon]}</span>}
              {(isCur || zoom > 8) && <span className="sm-label">{pick(lang, m.label)}</span>}
            </div>
          ),
        })
      }),
    )
  }
  if (live) {
    for (const { s: b, step } of live.battles) {
      const st = b.steps[step]
      const m = st.marks?.find((x) => x.icon === 'win' || x.icon === 'fall' || x.icon === 'star') ?? st.marks?.[0]
      const at = m?.coord ?? st.arrows?.[0]?.path.at(-1) ?? b.view.center
      items.push({
        id: `lb-${b.id}`,
        coord: at,
        z: 7,
        node: (
          <button
            className="live-battle"
            onClick={(ev) => {
              ev.stopPropagation()
              onStory?.(b.id)
            }}
          >
            <span className="lb-ic">⚔</span>
            <span className="min-w-0">
              <b>{pick(lang, b.title)}</b>
              <small>{pick(lang, st.title)} · ▶ {lang === 'vi' ? 'xem diễn biến' : 'replay'}</small>
            </span>
          </button>
        ),
      })
    }
    for (const { s: p, step } of live.people) {
      const st = p.steps[step]
      const c = st.view?.center ?? p.view.center
      items.push({
        id: `lp-${p.id}`,
        coord: c,
        z: 6,
        node: (
          <button
            className="live-person"
            title={`${pick(lang, p.title)} — ${pick(lang, st.title)}`}
            onClick={(ev) => {
              ev.stopPropagation()
              onStory?.(p.id)
            }}
          >
            <Portrait id={p.id} size={zoom > 6.5 ? 48 : 38} />
            <span className="lp-name">{pick(lang, p.title)}</span>
            {zoom > 6.2 && <span className="lp-what">{pick(lang, st.title)}</span>}
          </button>
        ),
      })
    }
  }
  if (layers.islands && !compare) {
    for (const a of ARCHIPELAGOS) {
      items.push({
        id: `arch-${a.id}`,
        coord: a.label,
        z: 2,
        node: (
          <button
            className="arch-label"
            onClick={(ev) => {
              ev.stopPropagation()
              onIslands?.()
            }}
          >
            <b>{pick(lang, a.name)}</b>
            <span>{pick(lang, a.admin)}</span>
          </button>
        ),
      })
    }
    if (zoom >= 7.2)
      for (const i of ISLANDS)
        items.push({ id: `isl-${i.id}`, coord: i.coord, z: 1, node: <div className="isl-label">{pick(lang, i.name)}</div> })
  }
  if (layers.events && !story) {
    const shown = new Set(live?.battles.map((b) => b.s.event))
    for (const e of eventsNear(year)) {
      if (shown.has(e.id)) continue
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
    <div className="absolute inset-0 isolate">
      <div ref={box} className="h-full w-full" />
      <div ref={tipRef} className="map-tip" style={{ display: 'none' }} />
      {items.map((it) => (slots[it.id] ? createPortal(it.node, slots[it.id], it.id) : null))}
    </div>
  )
}
