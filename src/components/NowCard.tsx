import { useMemo } from 'react'
import { POLITIES } from '../data/polities'
import { ANNEX_INFO, provincePolity, recentGain } from '../data/territory'
import type { Lang } from '../data/types'
import { canChi, fmtYear } from '../lib/time'
import { pick } from '../lib/i18n'

/** Thẻ "lúc này": quốc hiệu, triều đại, năm can chi, vùng đất vừa nhập */
export default function NowCard({ year, lang, provinceIds, names }: { year: number; lang: Lang; provinceIds: string[]; names: Record<string, string> }) {
  const main = provincePolity('ha-noi', year)
  const p = main ? POLITIES[main] : null

  // Vùng vừa mở cõi: gom theo năm, hiện tên tỉnh ngày nay + một dòng sử
  const gain = useMemo(() => {
    let y0 = -Infinity
    const hits: { id: string; region: string; year: number }[] = []
    for (const id of provinceIds) {
      const g = recentGain(id, year)
      if (!g) continue
      hits.push({ id, ...g })
      y0 = Math.max(y0, g.year)
    }
    const latest = hits.filter((h) => h.year === y0)
    if (!latest.length) return null
    // chú thích của vùng xa nhất về phía nam (mũi tiến của Nam tiến)
    const ORDER = ['taybac', 'qbinh', 'qtri', 'hue', 'qnam', 'qngai', 'bdinh', 'pyen', 'khoa', 'nthuan', 'gdinh', 'hatien', 'longho', 'tanan', 'tamphong', 'tayninh', 'highlands']
    const south = [...latest].sort((a, b) => ORDER.indexOf(b.region) - ORDER.indexOf(a.region))[0]
    const infos = [ANNEX_INFO[south.region as keyof typeof ANNEX_INFO]?.[lang]].filter(Boolean) as string[]
    return {
      year: y0,
      places: latest.map((h) => names[h.id]).filter((n) => n !== 'Côn Đảo').sort((a, b) => a.localeCompare(b, 'vi')),
      info: infos[0],
    }
  }, [provinceIds, names, year, lang])

  // Nam Kỳ / miền Nam có chính thể riêng → hiện thêm
  const south = provincePolity('ho-chi-minh', year)
  const second = south && south !== main && POLITIES[south].kind !== 'neighbor' && POLITIES[south].kind !== 'culture' ? POLITIES[south] : null
  const hue = provincePolity('thua-thien-hue', year)
  const mid = hue && hue !== main && hue !== south && POLITIES[hue].kind === 'viet' ? POLITIES[hue] : null

  if (!p) return null
  return (
    <div className="now-card" aria-live="polite">
      <div className="now-year">
        {fmtYear(year, lang, true)} <span>· {canChi(year)}</span>
      </div>
      <div className="now-states">
        {[p, mid, second].filter(Boolean).map((q) => (
          <span key={q!.id} className="now-state" style={{ ['--c' as string]: q!.color }}>
            <b>{pick(lang, q!.name(year))}</b>
            <em>{pick(lang, q!.dynasty)}</em>
          </span>
        ))}
      </div>
      {gain && (
        <div className="now-gain">
          <b>
            ⚑ {lang === 'vi' ? 'Mở cõi' : 'New land'} {fmtYear(gain.year, lang, true)}: {gain.places.join(', ')}
          </b>
          {gain.info && <span>{gain.info}</span>}
        </div>
      )}
    </div>
  )
}
