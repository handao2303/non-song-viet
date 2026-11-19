// Tiền xử lý dữ liệu địa lý → public/data/*
// Nguồn: geoBoundaries (VNM ADM1, CC-BY 4.0), Natural Earth (rivers 10m, countries 50m qua world-atlas)
import fs from 'node:fs'
import path from 'node:path'
import { topology } from 'topojson-server'
import * as topo from 'topojson-client'

const root = path.resolve(import.meta.dirname, '..')
const raw = (f) => JSON.parse(fs.readFileSync(path.join(root, 'scripts/raw', f), 'utf8'))
const out = path.join(root, 'public/data')
fs.mkdirSync(out, { recursive: true })

const slug = (s) =>
  s
    .trim()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

// d3-geo cần vòng ngoài theo chiều kim đồng hồ (ngược RFC 7946)
const signed = (r) => r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + (p[0] * q[1] - q[0] * p[1]) }, 0) / 2
const fixPoly = (poly) => poly.map((ring, i) => { const ccw = signed(ring) > 0; return (i === 0) === ccw ? [...ring].reverse() : ring })
const rewind = (g) => g.type === 'Polygon' ? { ...g, coordinates: fixPoly(g.coordinates) } : { ...g, coordinates: g.coordinates.map(fixPoly) }
const round = (c) => (typeof c[0] === 'number' ? [+c[0].toFixed(4), +c[1].toFixed(4)] : c.map(round))

// 1. Tỉnh thành (63 tỉnh trước sáp nhập 2025 + Côn Đảo tách riêng)
const vn = raw('vn.geojson')
const NAME_FIX = { 'Ho Chi Minh': 'TP. Hồ Chí Minh', 'Bà Rịa–Vũng Tàu': 'Bà Rịa – Vũng Tàu' }
const provinces = {
  type: 'FeatureCollection',
  features: vn.features.map((f) => {
    const raw = f.properties.shapeName.trim()
    const name = NAME_FIX[raw] ?? raw
    return {
      type: 'Feature',
      id: slug(raw),
      properties: { id: slug(raw), name },
      geometry: rewind({ ...f.geometry, coordinates: round(f.geometry.coordinates) }),
    }
  }),
}
const t = topology({ provinces }, 1e5)
fs.writeFileSync(path.join(out, 'vn.topo.json'), JSON.stringify(t))
console.log('provinces', provinces.features.map((f) => f.id).join(' '))

// 2. Nước láng giềng
const world = JSON.parse(fs.readFileSync(path.join(root, 'node_modules/world-atlas/countries-50m.json'), 'utf8'))
const KEEP = { 156: 'china', 418: 'laos', 116: 'cambodia', 764: 'thailand', 104: 'myanmar', 158: 'taiwan', 608: 'philippines', 458: 'malaysia', 360: 'indonesia', 96: 'brunei', 356: 'india', 50: 'bangladesh' }
const countries = topo.feature(world, world.objects.countries)
const neighbors = {
  type: 'FeatureCollection',
  features: countries.features
    .filter((f) => KEEP[+f.id])
    .map((f) => ({ type: 'Feature', properties: { id: KEEP[+f.id] }, geometry: { ...f.geometry, coordinates: round(f.geometry.coordinates) } })),
}
fs.writeFileSync(path.join(out, 'neighbors.geojson'), JSON.stringify(neighbors))

// 3. Sông ngòi trong khung Đông Dương
const BBOX = [99, 7.5, 113, 25.5]
const inBox = ([x, y]) => x >= BBOX[0] && x <= BBOX[2] && y >= BBOX[1] && y <= BBOX[3]
const rivers = raw('rivers.geojson')
const lines = []
for (const f of rivers.features) {
  if (!f.geometry) continue
  const parts = f.geometry.type === 'LineString' ? [f.geometry.coordinates] : f.geometry.coordinates
  const kept = parts.filter((p) => p.some(inBox))
  if (!kept.length) continue
  lines.push({
    type: 'Feature',
    properties: { name: f.properties.name_vi || f.properties.name || '', rank: f.properties.scalerank ?? 9 },
    geometry: { type: 'MultiLineString', coordinates: round(kept) },
  })
}
fs.writeFileSync(path.join(out, 'rivers.geojson'), JSON.stringify({ type: 'FeatureCollection', features: lines }))
console.log('rivers', lines.length)
for (const f of ['vn.topo.json', 'neighbors.geojson', 'rivers.geojson'])
  console.log(f, (fs.statSync(path.join(out, f)).size / 1024).toFixed(0) + 'KB')
