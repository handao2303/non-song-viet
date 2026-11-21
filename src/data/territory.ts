/**
 * Mô hình lãnh thổ theo năm.
 * Mỗi tỉnh (theo ranh giới 63 tỉnh trước 2025) được gán vào một "vùng lịch sử",
 * với năm nhập vào quốc gia Việt và chính thể cai quản ở mỗi thời điểm.
 * Đây là mô hình sơ lược để trực quan — không phải bản đồ khảo sát chính xác.
 */

type Region =
  | 'core' // đồng bằng & trung du Bắc Bộ, miền núi Đông Bắc
  | 'caobang'
  | 'thanhnghe' // Thanh – Nghệ – Tĩnh
  | 'taybac' // Tây Bắc
  | 'qbinh'
  | 'qtri'
  | 'hue'
  | 'qnam' // Đà Nẵng, Quảng Nam
  | 'qngai'
  | 'bdinh'
  | 'pyen'
  | 'khoa'
  | 'nthuan' // Ninh Thuận, Bình Thuận
  | 'highlands'
  | 'gdinh' // Biên Hoà – Gia Định 1698
  | 'tanan' // Long An, Tiền Giang 1756
  | 'longho' // Vĩnh Long, Bến Tre 1732
  | 'hatien' // Kiên Giang, Cà Mau 1708
  | 'tamphong' // An Giang, Đồng Tháp, Cần Thơ, Hậu Giang, Sóc Trăng, Trà Vinh, Bạc Liêu 1757
  | 'tayninh' // Tây Ninh, Bình Phước 1836

export const PROVINCE_REGION: Record<string, Region> = {
  'ha-noi': 'core', 'vinh-phuc': 'core', 'phu-tho': 'core', 'bac-ninh': 'core', 'bac-giang': 'core',
  'hai-duong': 'core', 'hai-phong': 'core', 'hung-yen': 'core', 'thai-binh': 'core', 'ha-nam': 'core',
  'nam-dinh': 'core', 'ninh-binh': 'core', 'quang-ninh': 'core', 'thai-nguyen': 'core', 'tuyen-quang': 'core',
  'yen-bai': 'core', 'hoa-binh': 'core', 'lang-son': 'core', 'bac-kan': 'core', 'ha-giang': 'core', 'lao-cai': 'core',
  'cao-bang': 'caobang',
  'thanh-hoa': 'thanhnghe', 'nghe-an': 'thanhnghe', 'ha-tinh': 'thanhnghe',
  'son-la': 'taybac', 'lai-chau': 'taybac', 'dien-bien': 'taybac',
  'quang-binh': 'qbinh', 'quang-tri': 'qtri', 'thua-thien-hue': 'hue',
  'da-nang': 'qnam', 'quang-nam': 'qnam', 'quang-ngai': 'qngai', 'binh-dinh': 'bdinh', 'phu-yen': 'pyen',
  'khanh-hoa': 'khoa', 'ninh-thuan': 'nthuan', 'binh-thuan': 'nthuan',
  'kon-tum': 'highlands', 'gia-lai': 'highlands', 'dak-lak': 'highlands', 'dak-nong': 'highlands', 'lam-dong': 'highlands',
  'dong-nai': 'gdinh', 'ba-ria-vung-tau': 'gdinh', 'ho-chi-minh': 'gdinh', 'binh-duong': 'gdinh', 'con-dao': 'gdinh',
  'long-an': 'tanan', 'tien-giang': 'tanan',
  'vinh-long': 'longho', 'ben-tre': 'longho',
  'kien-giang': 'hatien', 'ca-mau': 'hatien',
  'an-giang': 'tamphong', 'dong-thap': 'tamphong', 'can-tho': 'tamphong', 'hau-giang': 'tamphong',
  'soc-trang': 'tamphong', 'tra-vinh': 'tamphong', 'bac-lieu': 'tamphong',
  'tay-ninh': 'tayninh', 'binh-phuoc': 'tayninh',
}

/** Năm vùng chính thức nhập vào quốc gia Việt (lần cuối, ổn định) */
export const ANNEX: Record<Region, number> = {
  core: -9999, caobang: -9999, thanhnghe: -9999,
  taybac: 1432, qbinh: 1069, qtri: 1069, hue: 1306,
  qnam: 1471, qngai: 1471, bdinh: 1471, pyen: 1611, khoa: 1653, nthuan: 1693,
  highlands: 1898, gdinh: 1698, longho: 1732, hatien: 1708, tanan: 1756, tamphong: 1757, tayninh: 1836,
}

export const ANNEX_INFO: Partial<Record<Region, { vi: string; en: string }>> = {
  qbinh: { vi: 'Châu Bố Chính, Địa Lý, Ma Linh — Chế Củ dâng 1069', en: 'Bố Chính, Địa Lý, Ma Linh ceded by Rudravarman III, 1069' },
  qtri: { vi: 'Châu Ma Linh (1069) – châu Ô (1306)', en: 'Ma Linh (1069), Ô (1306)' },
  hue: { vi: 'Châu Ô, châu Lý — sính lễ cưới Huyền Trân, 1306', en: 'Ô & Lý districts — dowry of Princess Huyền Trân, 1306' },
  qnam: { vi: 'Chiêm Động (1402, mất 1407) · Lê Thánh Tông lấy lại 1471', en: 'Chiêm Động (1402, lost 1407) · retaken 1471' },
  qngai: { vi: 'Cổ Lũy (1402, mất 1407) · 1471', en: 'Cổ Lũy (1402, lost 1407) · 1471' },
  bdinh: { vi: 'Vijaya (Đồ Bàn) thất thủ — 1471', en: 'Fall of Vijaya — 1471' },
  pyen: { vi: 'Nguyễn Hoàng lập phủ Phú Yên — 1611', en: 'Phú Yên prefecture founded by Nguyễn Hoàng — 1611' },
  khoa: { vi: 'Dinh Thái Khang (Khánh Hoà) — 1653', en: 'Thái Khang garrison — 1653' },
  nthuan: { vi: 'Trấn Thuận Thành, phủ Bình Thuận — 1693–1697', en: 'Thuận Thành & Bình Thuận — 1693–97' },
  gdinh: { vi: 'Nguyễn Hữu Cảnh lập phủ Gia Định — 1698', en: 'Nguyễn Hữu Cảnh founds Gia Định — 1698' },
  hatien: { vi: 'Mạc Cửu dâng đất Hà Tiên — 1708', en: 'Mạc Cửu submits Hà Tiên — 1708' },
  longho: { vi: 'Dinh Long Hồ — 1732', en: 'Long Hồ garrison — 1732' },
  tanan: { vi: 'Tầm Bôn, Lôi Lạp — 1756', en: 'Tầm Bôn & Lôi Lạp — 1756' },
  tamphong: { vi: 'Tầm Phong Long, Ba Thắc, Trà Vang — 1757', en: 'Tầm Phong Long, Ba Thắc, Trà Vang — 1757' },
  tayninh: { vi: 'Đạo Tây Ninh thời Minh Mạng — 1836', en: 'Tây Ninh circuit under Minh Mạng — 1836' },
  taybac: { vi: 'Lê Lợi bình Đèo Cát Hãn, lập Gia Hưng – Quy Hoá — 1432', en: 'Lê Lợi subdues the Tai lords — 1432' },
  highlands: { vi: 'Pháp lập các tỉnh Tây Nguyên — 1898–1913', en: 'French create highland provinces — 1898–1913' },
}

const NORTH: Region[] = ['core', 'caobang', 'thanhnghe', 'taybac']
const SOUTHERN: Region[] = ['gdinh', 'tanan', 'longho', 'hatien', 'tamphong', 'tayninh']
const COCHIN_EAST: Region[] = ['gdinh', 'tanan', 'tayninh']

/** Chính thể ngoại bang trước khi vùng nhập vào Việt */
function foreign(r: Region, y: number): string | null {
  if (r === 'taybac') return 'tai'
  if (r === 'highlands') return 'highlands'
  if (SOUTHERN.includes(r)) {
    if (r === 'tayninh' && y >= 550) return 'chenla'
    if (y < 50) return null
    if (y < 550) return 'funan'
    return 'chenla'
  }
  // duyên hải miền Trung
  const nhatNam: Region[] = ['qbinh', 'qtri', 'hue', 'qnam']
  if (y < -111) return 'sahuynh'
  if (y < 192) return nhatNam.includes(r) ? 'chinese' : 'sahuynh'
  return 'champa'
}

/** Chính thể Việt (hoặc đô hộ) đang cai quản vùng r ở năm y — giả định vùng đã thuộc Việt */
function vietState(r: Region, y: number): string {
  const north = NORTH.includes(r)
  // Mốc theo cách chia kỷ của Đại Việt sử ký toàn thư
  if (y < -257) return 'vanlang'
  if (y < -207) return 'aulac' // An Dương Vương: Giáp Thìn → Quý Tỵ (257–208 TCN)
  if (y < -111) return 'nanyue' // Triệu kỷ: Giáp Ngọ → Canh Ngọ (207–111 TCN)
  if (y < 40) return 'chinese'
  if (y < 43) return 'trung'
  if (y < 541) return 'chinese'
  if (y < 603) return 'vanxuan' // Tiền Nam Đế, Triệu Việt Vương, Hậu Nam Đế: Tân Dậu → Nhâm Tuất (541–602)
  if (y < 907) return 'chinese'
  if (y < 939) return 'tuchu' // Khúc Hạo giữ châu trị năm 907
  if (y < 966) return 'ngo'
  if (y < 968) return 'suquan'
  if (y < 981) return 'dinh' // Đinh kỷ: Mậu Thìn → Canh Thìn (968–980)
  if (y < 1010) return 'tienle' // Lê kỷ: Tân Tỵ → Kỷ Dậu (981–1009)
  if (y < 1226) return 'ly' // Lý kỷ: Canh Tuất → Ất Dậu (1010–1225)
  if (y < 1400) return 'tran'
  if (y < 1407) return 'ho'
  // Hậu Trần (Giản Định, Trùng Quang) giữ vùng Thanh – Nghệ – Thuận Hoá đến 1413
  if (y < 1414 && (r === 'thanhnghe' || r === 'qbinh' || r === 'qtri' || r === 'hue')) return 'hautran'
  if (y < 1428) return 'minh'
  if (y < 1527) return 'leso'
  if (y < 1543) return 'mac'
  if (y < 1593) return r === 'core' || r === 'caobang' || r === 'taybac' ? 'mac' : 'letrinh'
  // Thế kỷ 17–18
  if (y < 1786) {
    if (r === 'caobang' && y < 1677) return 'mac'
    if (north) return 'letrinh'
    if (y < 1600) return 'letrinh'
    // Tây Sơn & Trịnh tràn vào Đàng Trong
    if ((r === 'qbinh' || r === 'qtri' || r === 'hue') && y >= 1775) return 'letrinh'
    if (r === 'bdinh' && y >= 1773) return 'tayson'
    if (!SOUTHERN.includes(r) && y >= 1775) return 'tayson'
    if (SOUTHERN.includes(r) && y >= 1777) return 'tayson'
    return 'nguyenlord'
  }
  if (y < 1802) {
    if (SOUTHERN.includes(r) && y >= 1788) return 'nguyenanh'
    if ((r === 'khoa' || r === 'nthuan') && y >= 1793) return 'nguyenanh'
    if ((r === 'pyen' || r === 'bdinh') && y >= 1799) return 'nguyenanh'
    if (!north && y >= 1801) return 'nguyenanh'
    return 'tayson'
  }
  if (y < 1945) {
    if (COCHIN_EAST.includes(r) && y >= 1862) return 'cochin'
    if (SOUTHERN.includes(r) && y >= 1867) return 'cochin'
    if (y >= 1884) return r === 'thanhnghe' || !north ? 'annam' : 'tonkin'
    return 'nguyen'
  }
  if (y < 1954) return 'vndcch'
  if (y < 1976) {
    if (north || r === 'qbinh') return 'vndcch'
    return y < 1975 ? 'vnch' : 'cmn'
  }
  return 'chxhcn'
}

export function regionPolity(r: Region, y: number): string | null {
  // Nhà Hồ chiếm Chiêm Động – Cổ Lũy 1402–1407
  if ((r === 'qnam' || r === 'qngai') && y >= 1402 && y < 1407) return 'ho'
  if (y < ANNEX[r]) return foreign(r, y)
  return vietState(r, y)
}

export function provincePolity(pid: string, y: number): string | null {
  const r = PROVINCE_REGION[pid]
  if (!r) return null
  return regionPolity(r, y)
}

export const provinceRegion = (pid: string) => PROVINCE_REGION[pid]

/** Nước láng giềng theo năm */
export function neighborPolity(id: string, y: number): string | null {
  switch (id) {
    case 'china':
    case 'taiwan':
      return id === 'taiwan' && y < 1683 ? null : 'china'
    case 'laos':
      return 'laos'
    case 'cambodia':
      return y < 50 ? null : y < 550 ? 'funan' : 'chenla'
    case 'thailand':
      return 'siam'
    default:
      return null
  }
}

/** Các mốc năm có thay đổi lãnh thổ (dùng để nhảy nhanh & tính lịch sử điểm) */
export const CHANGE_YEARS = [
  -700, -257, -207, -111, 40, 43, 50, 192, 541, 550, 603, 758, 802, 860, 907, 939, 966, 968, 981, 1010, 1054, 1069, 1226, 1306, 1400,
  1402, 1407, 1414, 1428, 1432, 1471, 1527, 1543, 1593, 1600, 1611, 1653, 1677, 1693, 1698, 1708, 1732, 1756, 1757, 1773, 1775, 1777,
  1786, 1788, 1793, 1799, 1801, 1802, 1804, 1836, 1838, 1862, 1867, 1884, 1898, 1945, 1954, 1955, 1975, 1976,
]

/** Vùng vừa nhập vào lãnh thổ trong vòng `win` năm gần đây (để tô sáng trên bản đồ) */
export function recentGain(pid: string, y: number, win = 8): { region: Region; year: number } | null {
  const r = PROVINCE_REGION[pid]
  if (!r) return null
  if ((r === 'qnam' || r === 'qngai') && y >= 1402 && y < 1402 + win && y < 1407) return { region: r, year: 1402 }
  const a = ANNEX[r]
  if (a > -9999 && y >= a && y < a + win) return { region: r, year: a }
  return null
}
