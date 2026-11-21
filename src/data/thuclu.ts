/**
 * Đối chiếu với Đại Nam thực lục (大南寔錄) — quốc sử triều Nguyễn, nguyên văn chữ Hán trên Wikisource:
 * https://zh.wikisource.org/wiki/大南寔錄
 * Tiền biên: các chúa Nguyễn (1558–1777); Chính biên: Gia Long → Đồng Khánh.
 * Dùng cho các sự kiện ở Đàng Trong (Toàn thư ít chép) và sau năm 1789 (Toàn thư dừng).
 */
import type { T } from './types'

export interface DNCite {
  /** phần sách: 前編 hoặc 正編第一紀…第六紀 */
  part: string
  vol: number
  quote: string
  note?: T
}

export const DN_URL = 'https://zh.wikisource.org/wiki/大南寔錄'
/** Thực lục chính biên kết thúc ở đời Đồng Khánh (1888) */
export const DN_END = 1888

const n = (vi: string, en: string): T => ({ vi, en })

// prettier-ignore
export const DN: Record<string, DNCite> = {
  nguyenhoang: { part: '前編', vol: 1, quote: '上初鎮順化' },
  nguyenhoang1600: { part: '前編', vol: 1, quote: '上遷自東都' },
  phuyen: { part: '前編', vol: 1, quote: '初置富安府' },
  gianh: { part: '前編', vol: 2, quote: '鄭梉欲舉兵南侵' },
  khanhhoa: { part: '前編', vol: 4, quote: '初置泰康營' },
  binhthuan: { part: '前編', vol: 7, quote: '改順城鎮為平順', note: n('Thực lục chép năm Quý Dậu (1693) đổi trấn Thuận Thành, năm Đinh Sửu (1697) lập phủ Bình Thuận.', 'The Veritable Records date the Thuận Thành change to 1693 and Bình Thuận prefecture to 1697.') },
  giadinh: { part: '前編', vol: 7, quote: '初置嘉定府' },
  hatien: { part: '前編', vol: 8, quote: '以鄚玖' },
  longho: { part: '前編', vol: 9, quote: '建龍湖營' },
  nam1757: { part: '前編', vol: 10, quote: '後江設朱篤道' },
  tayson: { part: '前編', vol: 11, quote: '西山賊阮文岳', note: n('Thực lục chép việc này vào năm Quý Tỵ (1773), khi Tây Sơn đánh chiếm phủ Quy Nhơn; năm 1771 là mốc dựng cờ theo cách tính thông dụng.', 'The Records place this in 1773, when the Tây Sơn took Quy Nhơn; 1771 is the usual date of the rising.') },
  phubac: { part: '正編第一紀', vol: 2, quote: '西賊阮文惠進逼富春', note: n('Thực lục (chép theo phía chúa Nguyễn, gọi Tây Sơn là “giặc”) ghi việc Nguyễn Huệ lấy Phú Xuân năm Bính Ngọ (1786), mở đường ra Bắc.', 'Written from the Nguyễn side (calling the Tây Sơn “rebels”), it records Nguyễn Huệ taking Phú Xuân in 1786, opening the way north.') },
  quangtrung: { part: '正編第一紀', vol: 3, quote: '西賊阮文惠自立爲帝' },
  dongda: { part: '正編第一紀', vol: 4, quote: '清兵與西賊阮文惠鏖戰於青池' },
  gialong: { part: '正編第一紀', vol: 17, quote: '建元嘉隆' },
  vietnam: { part: '正編第一紀', vol: 23, quote: '建國號曰越南' },
  hoangsa1816: { part: '正編第一紀', vol: 52, quote: '命水軍及黄沙隊乘船往黄沙探度水程' },
  dainam: { part: '正編第二紀', vol: 190, quote: '初定國號曰大南', note: n('Năm Mậu Tuất, Minh Mạng thứ 19 = 1838 (nhiều sách ghi 1839).', 'Year Mậu Tuất, Minh Mạng 19 = 1838 (often given as 1839).') },
  danang1858: { part: '正編第四紀', vol: 19, quote: '西洋兵船（十二艘）入沱㶞汛' },
  nhamtuat: { part: '正編第四紀', vol: 26, quote: '竟以嘉定定祥邊和三省之地許之' },
  mientay: { part: '正編第四紀', vol: 36, quote: '富人逼取永隆安河三省' },
  garnier: { part: '正編第四紀', vol: 49, quote: '富派安業攻陷河內省城' },
  giapthan: { part: '正編第五紀', vol: 4, quote: '來定新約' },
  canvuong: { part: '正編第五紀', vol: 8, quote: '通檄天下勤王' },
}

const PART_VI: Record<string, [string, string]> = {
  前編: ['Tiền biên', 'Prequel'],
  正編第一紀: ['Chính biên, kỷ I (Gia Long)', 'Main, part I (Gia Long)'],
  正編第二紀: ['Chính biên, kỷ II (Minh Mạng)', 'Main, part II (Minh Mạng)'],
  正編第三紀: ['Chính biên, kỷ III (Thiệu Trị)', 'Main, part III (Thiệu Trị)'],
  正編第四紀: ['Chính biên, kỷ IV (Tự Đức)', 'Main, part IV (Tự Đức)'],
  正編第五紀: ['Chính biên, kỷ V (1883–1885)', 'Main, part V (1883–85)'],
  正編第六紀: ['Chính biên, kỷ VI (Đồng Khánh)', 'Main, part VI (Đồng Khánh)'],
}

export function dnName(c: DNCite, lang: 'vi' | 'en') {
  const p = PART_VI[c.part]
  return lang === 'vi' ? `${p[0]}, quyển ${c.vol}` : `${p[1]}, vol. ${c.vol}`
}

/** số quyển trên Wikisource: kỷ II viết 3 chữ số, kỷ V 1 chữ số, còn lại 2 chữ số */
export function dnUrl(c: DNCite) {
  const pad = c.part === '正編第二紀' ? 3 : c.part === '正編第五紀' ? 1 : 2
  return `${DN_URL}/大南寔錄${c.part}/卷${String(c.vol).padStart(pad, '0')}`
}
