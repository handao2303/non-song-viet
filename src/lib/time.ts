import type { Lang } from '../data/types'
import { MIN_YEAR, MAX_YEAR } from './geo'

/**
 * Thang thời gian phi tuyến: thời cổ đại ít biến động được nén lại,
 * thời cận – hiện đại được giãn ra để dễ kéo.
 */
const STOPS: [year: number, frac: number][] = [
  [MIN_YEAR, 0],
  [0, 0.1],
  [938, 0.27],
  [1400, 0.43],
  [1800, 0.68],
  [1945, 0.84],
  [MAX_YEAR, 1],
]

export function yearToFrac(y: number) {
  for (let i = 1; i < STOPS.length; i++) {
    const [y0, f0] = STOPS[i - 1]
    const [y1, f1] = STOPS[i]
    if (y <= y1) return f0 + ((y - y0) / (y1 - y0)) * (f1 - f0)
  }
  return 1
}

export function fracToYear(f: number) {
  f = Math.min(1, Math.max(0, f))
  for (let i = 1; i < STOPS.length; i++) {
    const [y0, f0] = STOPS[i - 1]
    const [y1, f1] = STOPS[i]
    if (f <= f1) return normYear(Math.round(y0 + ((f - f0) / (f1 - f0)) * (y1 - y0)))
  }
  return MAX_YEAR
}

/** Không có năm 0 trong lịch Gregory */
export const normYear = (y: number, dir = 1) => {
  y = Math.min(MAX_YEAR, Math.max(MIN_YEAR, Math.round(y)))
  return y === 0 ? dir : y
}

export function fmtYear(y: number, lang: Lang, short = false) {
  if (y < 0) return lang === 'vi' ? `${-y} TCN` : `${-y} BCE`
  if (short) return String(y)
  return lang === 'vi' ? `năm ${y}` : `${y} CE`
}

export const fmtSpan = (a: number, b: number, lang: Lang) =>
  a === b ? fmtYear(a, lang, true) : `${fmtYear(a, lang, true)} – ${fmtYear(b, lang, true)}`

export const fold = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()

const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý']
const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi']

/** Năm can chi (Giáp Tý = năm 4); năm TCN theo cách tính thiên văn */
export function canChi(y: number) {
  const a = y > 0 ? y : y + 1
  return `${CAN[(((a - 4) % 10) + 10) % 10]} ${CHI[(((a - 4) % 12) + 12) % 12]}`
}
