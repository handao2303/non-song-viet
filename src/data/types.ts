export type Lang = 'vi' | 'en'
export type T = { vi: string; en: string }

export type PolityKind = 'viet' | 'chinese' | 'colonial' | 'protectorate' | 'neighbor' | 'culture'

export interface Polity {
  id: string
  kind: PolityKind
  color: string
  /** Tên hiển thị trên bản đồ, có thể đổi theo năm (quốc hiệu) */
  name: (year: number) => T
  /** Tên triều đại / chính thể (ngắn) */
  dynasty: T
}

export interface Period {
  id: string
  polity: string
  start: number
  end: number
  name: T
  /** Quốc hiệu */
  title?: T
  founder?: T
  capital?: T
  summary: T
  rulers?: string[]
  /** Ghi chú theo Đại Việt sử ký toàn thư */
  tt?: { vol: string; note: T }
}

export type EventCategory = 'battle' | 'politics' | 'territory' | 'culture' | 'disaster'

export interface HistEvent {
  id: string
  year: number
  /** năm kết thúc nếu là sự kiện kéo dài */
  endYear?: number
  coord: [number, number]
  cat: EventCategory
  title: T
  desc: T
  zoom?: number
}

export interface Capital {
  id: string
  name: T
  coord: [number, number]
  polity: string
  /** Khoảng năm làm kinh đô / trị sở (có thể nhiều khoảng) */
  spans: [number, number][]
  note?: T
  /** chỉ hiện khi phóng to */
  minor?: boolean
  /** trị sở của chính quyền đô hộ / phương Bắc */
  seat?: boolean
}
