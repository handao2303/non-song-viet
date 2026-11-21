/**
 * Tên gọi hành chính qua các thời kỳ.
 * Theo Toàn thư, Đại Nam nhất thống chí, Lịch triều hiến chương loại chí và các văn bản hành chính hiện đại.
 * Mốc năm là năm đặt tên / lập đơn vị (gần đúng với thời Bắc thuộc).
 */
import type { T } from './types'
import { provinceRegion } from './territory'

export interface AdminName {
  from: number
  name: string
  unit: T
}

const u = (vi: string, en: string): T => ({ vi, en })
const N = (from: number, name: string, vi: string, en: string): AdminName => ({ from, name, unit: u(vi, en) })

/** Theo vùng lịch sử (dùng khi tỉnh không có mục riêng) */
const REGION: Record<string, AdminName[]> = {
  core: [
    N(-700, 'Văn Lang', 'nước của các vua Hùng', 'realm of the Hùng kings'),
    N(-257, 'Âu Lạc', 'nước của An Dương Vương', 'kingdom of An Dương Vương'),
    N(-111, 'Giao Chỉ', 'quận thời Hán', 'Han commandery'),
    N(203, 'Giao Châu', 'châu thời Đông Hán – Ngô', 'Later Han / Wu province'),
    N(679, 'An Nam đô hộ phủ', 'phủ đô hộ thời Đường', 'Tang protectorate'),
    N(866, 'Tĩnh Hải quân', 'trấn thời Đường', 'Tang military circuit'),
    N(968, 'Đại Cồ Việt', 'quốc hiệu thời Đinh – Tiền Lê', 'Đinh–Lê state name'),
    N(1054, 'Đại Việt', 'quốc hiệu', 'state name'),
    N(1466, 'thừa tuyên', 'Lê Thánh Tông chia 12 đạo thừa tuyên', '12 provinces of Lê Thánh Tông'),
    N(1802, 'Bắc Thành', 'tổng trấn Bắc Thành (Gia Long)', 'Northern Citadel region'),
    N(1831, 'các tỉnh Bắc Kỳ', 'Minh Mạng lập tỉnh', 'Minh Mạng’s provinces'),
    N(1884, 'Tonkin — Bắc Kỳ', 'xứ bảo hộ của Pháp', 'French protectorate'),
    N(1945, 'Bắc Bộ', 'Việt Nam Dân chủ Cộng hoà', 'Democratic Republic of Vietnam'),
  ],
  caobang: [
    N(-111, 'Giao Chỉ', 'quận thời Hán (vùng biên)', 'Han commandery (frontier)'),
    N(1010, 'châu Quảng Nguyên', 'thời Lý', 'Lý-era district'),
    N(1499, 'Cao Bằng', 'thừa tuyên (trấn) Cao Bằng', 'Cao Bằng province'),
    N(1527, 'Cao Bằng (họ Mạc)', 'nơi họ Mạc giữ đến 1677', 'Mạc stronghold to 1677'),
    N(1831, 'tỉnh Cao Bằng', 'thời Minh Mạng', 'Minh Mạng province'),
  ],
  thanhnghe: [
    N(-111, 'Cửu Chân', 'quận thời Hán', 'Han commandery'),
    N(607, 'Ái Châu · Hoan Châu', 'châu thời Tùy – Đường', 'Sui–Tang prefectures'),
    N(1029, 'Thanh Hoá · Nghệ An', 'phủ / châu thời Lý', 'Lý prefectures'),
    N(1466, 'thừa tuyên Thanh Hoa · Nghệ An', 'thời Lê Thánh Tông', 'Lê provinces'),
    N(1831, 'tỉnh Thanh Hoá · Nghệ An · Hà Tĩnh', 'thời Minh Mạng', 'Minh Mạng provinces'),
    N(1884, 'Annam — Trung Kỳ', 'xứ bảo hộ của Pháp', 'French protectorate'),
  ],
  taybac: [
    N(1432, 'Gia Hưng · Quy Hoá', 'trấn thời Lê sau khi dẹp Đèo Cát Hãn', 'Lê frontier provinces'),
    N(1831, 'Hưng Hoá', 'tỉnh thời Minh Mạng', 'Minh Mạng province'),
    N(1909, 'Sơn La · Lai Châu', 'tỉnh thời Pháp', 'French-era provinces'),
    N(1955, 'Khu tự trị Thái – Mèo', 'khu tự trị (1955–1975)', 'autonomous region'),
  ],
  qbinh: [
    N(1069, 'Bố Chính · Địa Lý · Ma Linh', 'ba châu nhận từ Chiêm Thành', 'districts ceded by Champa'),
    N(1075, 'Tân Bình · Lâm Bình', 'đổi tên thời Lý', 'renamed under the Lý'),
    N(1604, 'Quảng Bình', 'Nguyễn Hoàng đổi phủ Tân Bình', 'renamed by Nguyễn Hoàng'),
    N(1831, 'tỉnh Quảng Bình', 'thời Minh Mạng', 'Minh Mạng province'),
  ],
  qtri: [
    N(1069, 'châu Ma Linh', 'nhận từ Chiêm Thành', 'ceded by Champa'),
    N(1306, 'châu Thuận', 'sính lễ Huyền Trân', 'dowry of Huyền Trân'),
    N(1801, 'dinh Quảng Trị', 'thời Gia Long', 'Gia Long garrison'),
    N(1831, 'tỉnh Quảng Trị', 'thời Minh Mạng', 'Minh Mạng province'),
  ],
  qnam: [
    N(192, 'Lâm Ấp — Champa', 'đất Chăm Pa (Amaravati)', 'Cham Amaravati'),
    N(1402, 'Thăng Hoa', 'lộ thời Hồ (Chiêm Động)', 'Hồ-era circuit'),
    N(1471, 'thừa tuyên Quảng Nam', 'Lê Thánh Tông lập', 'created by Lê Thánh Tông'),
    N(1602, 'dinh Quảng Nam', 'thời chúa Nguyễn', 'Nguyễn lords’ garrison'),
    N(1831, 'tỉnh Quảng Nam', 'thời Minh Mạng', 'Minh Mạng province'),
  ],
  qngai: [
    N(192, 'Champa', 'đất Chăm Pa', 'Cham land'),
    N(1402, 'Tư Nghĩa', 'lộ thời Hồ (Cổ Lũy)', 'Hồ-era circuit'),
    N(1471, 'phủ Tư Nghĩa', 'thuộc thừa tuyên Quảng Nam', 'part of Quảng Nam'),
    N(1832, 'tỉnh Quảng Ngãi', 'thời Minh Mạng', 'Minh Mạng province'),
  ],
  bdinh: [
    N(1000, 'Vijaya (Đồ Bàn)', 'kinh đô Chăm Pa', 'Cham capital'),
    N(1471, 'phủ Hoài Nhơn', 'thuộc thừa tuyên Quảng Nam', 'part of Quảng Nam'),
    N(1776, 'Hoàng Đế thành', 'kinh đô Nguyễn Nhạc (Tây Sơn)', 'Tây Sơn capital'),
    N(1799, 'Bình Định', 'Nguyễn Ánh đổi tên', 'renamed by Nguyễn Ánh'),
  ],
  pyen: [N(1611, 'phủ Phú Yên', 'Nguyễn Hoàng lập', 'founded by Nguyễn Hoàng'), N(1831, 'tỉnh Phú Yên', 'thời Minh Mạng', 'Minh Mạng province')],
  khoa: [N(800, 'Kauthara', 'đất Chăm Pa (tháp Po Nagar)', 'Cham Kauthara'), N(1653, 'dinh Thái Khang', 'thời chúa Nguyễn', 'Nguyễn garrison'), N(1803, 'Khánh Hoà', 'đổi tên thời Gia Long', 'renamed under Gia Long'), N(1832, 'tỉnh Khánh Hoà', 'thời Minh Mạng', 'Minh Mạng province')],
  nthuan: [N(800, 'Panduranga', 'đất Chăm Pa', 'Cham Panduranga'), N(1693, 'trấn Thuận Thành', 'tự trị dưới chúa Nguyễn', 'autonomous under the Nguyễn'), N(1697, 'phủ Bình Thuận', 'thời chúa Nguyễn', 'Nguyễn prefecture'), N(1832, 'tỉnh Bình Thuận', 'thời Minh Mạng', 'Minh Mạng province')],
  highlands: [N(1898, 'các tỉnh Tây Nguyên', 'Pháp lập Kon Tum, Đắk Lắk, Lâm Viên', 'French highland provinces'), N(1950, 'Hoàng triều Cương thổ', 'lãnh địa của Bảo Đại (1950–1955)', 'Bảo Đại’s crown domain')],
  gdinh: [N(1698, 'phủ Gia Định', 'Nguyễn Hữu Cảnh lập', 'founded by Nguyễn Hữu Cảnh'), N(1808, 'Gia Định thành', 'tổng trấn thời Gia Long', 'Gia Long’s southern governorate'), N(1832, 'Nam Kỳ lục tỉnh', 'thời Minh Mạng', 'the six southern provinces'), N(1862, 'Cochinchine — Nam Kỳ', 'thuộc địa Pháp', 'French colony')],
  tanan: [N(1756, 'Tầm Bôn · Lôi Lạp', 'đất Chân Lạp dâng chúa Nguyễn', 'ceded by Cambodia'), N(1832, 'tỉnh Gia Định · Định Tường', 'thời Minh Mạng', 'Minh Mạng provinces'), N(1862, 'Nam Kỳ', 'thuộc địa Pháp', 'French colony')],
  longho: [N(1732, 'dinh Long Hồ', 'thời chúa Nguyễn', 'Nguyễn garrison'), N(1832, 'tỉnh Vĩnh Long', 'thời Minh Mạng', 'Minh Mạng province'), N(1867, 'Nam Kỳ', 'thuộc địa Pháp', 'French colony')],
  hatien: [N(1708, 'trấn Hà Tiên', 'Mạc Cửu dâng chúa Nguyễn', 'submitted by Mạc Cửu'), N(1832, 'tỉnh Hà Tiên', 'thời Minh Mạng', 'Minh Mạng province'), N(1867, 'Nam Kỳ', 'thuộc địa Pháp', 'French colony')],
  tamphong: [N(1757, 'Tầm Phong Long · Ba Thắc · Trà Vang', 'đất Chân Lạp nhập Đàng Trong', 'Cambodian lands joined Đàng Trong'), N(1832, 'tỉnh An Giang', 'thời Minh Mạng', 'Minh Mạng province'), N(1867, 'Nam Kỳ', 'thuộc địa Pháp', 'French colony')],
  tayninh: [N(1836, 'phủ Tây Ninh', 'thời Minh Mạng', 'Minh Mạng prefecture'), N(1867, 'Nam Kỳ', 'thuộc địa Pháp', 'French colony')],
  hue: [],
}

/** Riêng một số tỉnh, thành tiêu biểu */
const PROVINCE: Record<string, AdminName[]> = {
  'ha-noi': [
    N(-257, 'Cổ Loa', 'kinh đô Âu Lạc', 'capital of Âu Lạc'),
    N(-111, 'Long Biên', 'huyện thuộc quận Giao Chỉ', 'county of Jiaozhi'),
    N(545, 'thành Long Biên', 'Lý Nam Đế dựng thành ở cửa sông Tô Lịch', 'Lý Nam Đế’s citadel'),
    N(607, 'Tống Bình', 'quận / huyện thời Tùy – Đường', 'Sui–Tang county'),
    N(866, 'Đại La', 'Cao Biền xây La Thành', 'Gao Pian’s citadel'),
    N(1010, 'Thăng Long 昇龍', 'kinh đô nhà Lý, Trần', 'Lý & Trần capital'),
    N(1397, 'Đông Đô', 'nhà Hồ đổi tên', 'renamed by the Hồ'),
    N(1408, 'Đông Quan', 'thời thuộc Minh', 'Ming occupation'),
    N(1430, 'Đông Kinh', 'Lê Lợi đổi tên', 'renamed by Lê Lợi'),
    N(1805, 'Thăng Long 昇隆', 'Gia Long đổi chữ “Long”, lỵ sở Bắc Thành', 'new character; seat of the Northern Citadel'),
    N(1831, 'Hà Nội', 'tỉnh Hà Nội (Minh Mạng)', 'Minh Mạng province'),
    N(1888, 'thành phố Hà Nội', 'nhượng địa Pháp; từ 1902 thủ phủ Đông Dương', 'French concession; capital of Indochina from 1902'),
    N(1945, 'Thủ đô Hà Nội', 'Việt Nam Dân chủ Cộng hoà', 'capital of the DRV'),
    N(2008, 'Hà Nội mở rộng', 'sáp nhập Hà Tây', 'merged with Hà Tây'),
  ],
  'ho-chi-minh': [
    N(1623, 'Prey Nokor — Bến Nghé', 'trạm thu thuế của chúa Nguyễn trên đất Chân Lạp', 'Nguyễn customs post'),
    N(1698, 'dinh Phiên Trấn', 'huyện Tân Bình, phủ Gia Định', 'Tân Bình, Gia Định'),
    N(1790, 'thành Gia Định (Bát Quái)', 'Nguyễn Ánh xây', 'built by Nguyễn Ánh'),
    N(1832, 'tỉnh Phiên An', 'thời Minh Mạng; 1836 đổi là Gia Định', 'renamed Gia Định in 1836'),
    N(1862, 'Saigon', 'thủ phủ Nam Kỳ thuộc Pháp', 'capital of French Cochinchina'),
    N(1931, 'Saigon – Chợ Lớn', 'hợp nhất hai thành phố', 'twin cities merged'),
    N(1955, 'Đô thành Sài Gòn', 'thủ đô Việt Nam Cộng hoà', 'capital of the Republic of Vietnam'),
    N(1976, 'Thành phố Hồ Chí Minh', 'đổi tên sau thống nhất', 'renamed after reunification'),
    N(2025, 'TP. Hồ Chí Minh mở rộng', 'hợp nhất Bình Dương, Bà Rịa – Vũng Tàu', 'merged with Bình Dương & Bà Rịa–Vũng Tàu'),
  ],
  'thua-thien-hue': [
    N(192, 'Champa', 'đất Chăm Pa (châu Ô, châu Lý)', 'Cham land'),
    N(1306, 'Thuận Châu · Hoá Châu', 'sính lễ Huyền Trân', 'dowry of Huyền Trân'),
    N(1466, 'Thuận Hoá', 'thừa tuyên thời Lê', 'Lê province'),
    N(1558, 'trấn Thuận Hoá', 'Nguyễn Hoàng vào trấn thủ', 'Nguyễn Hoàng’s fief'),
    N(1687, 'Phú Xuân', 'thủ phủ Đàng Trong', 'seat of the Nguyễn lords'),
    N(1788, 'Phú Xuân', 'kinh đô Quang Trung', 'Quang Trung’s capital'),
    N(1802, 'Kinh đô Huế', 'kinh đô nhà Nguyễn; 1822 lập phủ Thừa Thiên', 'Nguyễn capital; Thừa Thiên prefecture 1822'),
    N(1976, 'Bình Trị Thiên', 'hợp nhất ba tỉnh', 'merged province'),
    N(1989, 'Thừa Thiên Huế', 'tách tỉnh', 're-created'),
    N(2025, 'Thành phố Huế', 'trực thuộc trung ương', 'centrally governed city'),
  ],
  'da-nang': [
    N(192, 'Champa (Amaravati)', 'đất Chăm Pa', 'Cham land'),
    N(1471, 'Quảng Nam', 'thừa tuyên thời Lê', 'Lê province'),
    N(1858, 'Tourane — cửa Hàn', 'Pháp nổ súng xâm lược', 'French attack'),
    N(1888, 'Tourane', 'nhượng địa Pháp', 'French concession'),
    N(1997, 'Thành phố Đà Nẵng', 'trực thuộc trung ương', 'centrally governed city'),
  ],
  'thanh-hoa': [
    N(-111, 'Cửu Chân', 'quận thời Hán', 'Han commandery'),
    N(607, 'Ái Châu', 'châu thời Tùy – Đường', 'Sui–Tang prefecture'),
    N(1029, 'Thanh Hoá', 'phủ thời Lý', 'Lý prefecture'),
    N(1397, 'Tây Đô', 'kinh đô nhà Hồ (thành Tây Đô)', 'Hồ capital'),
    N(1466, 'thừa tuyên Thanh Hoa', 'thời Lê Thánh Tông', 'Lê province'),
    N(1841, 'tỉnh Thanh Hoá', 'Thiệu Trị đổi chữ “Hoa” thành “Hoá”', 'renamed under Thiệu Trị'),
  ],
  'nghe-an': [
    N(-111, 'Cửu Chân', 'quận thời Hán', 'Han commandery'),
    N(627, 'Hoan Châu', 'châu thời Đường', 'Tang prefecture'),
    N(1030, 'Nghệ An', 'châu thời Lý', 'Lý prefecture'),
    N(1466, 'thừa tuyên Nghệ An', 'thời Lê Thánh Tông', 'Lê province'),
    N(1831, 'tỉnh Nghệ An', 'thời Minh Mạng', 'Minh Mạng province'),
  ],
  'ninh-binh': [N(968, 'Hoa Lư', 'kinh đô Đinh – Tiền Lê', 'Đinh–Lê capital'), N(1010, 'phủ Trường Yên', 'thời Lý – Trần', 'Lý–Trần prefecture'), N(1831, 'tỉnh Ninh Bình', 'thời Minh Mạng', 'Minh Mạng province')],
  'nam-dinh': [N(1262, 'Thiên Trường', 'phủ — nơi ở của Thái thượng hoàng nhà Trần', 'Trần retired emperors’ seat'), N(1466, 'Sơn Nam', 'thừa tuyên thời Lê', 'Lê province'), N(1832, 'tỉnh Nam Định', 'thời Minh Mạng', 'Minh Mạng province')],
  'bac-ninh': [N(-111, 'Luy Lâu', 'trị sở quận Giao Chỉ', 'seat of Jiaozhi'), N(1010, 'Cổ Pháp', 'quê nhà Lý', 'home of the Lý'), N(1466, 'Kinh Bắc', 'thừa tuyên thời Lê', 'Lê province'), N(1831, 'tỉnh Bắc Ninh', 'thời Minh Mạng', 'Minh Mạng province')],
  'quang-ninh': [N(1149, 'Vân Đồn', 'thương cảng thời Lý', 'Lý-era trading port'), N(1466, 'An Bang', 'thừa tuyên thời Lê', 'Lê province'), N(1836, 'Quảng Yên', 'tỉnh thời Minh Mạng', 'Minh Mạng province'), N(1963, 'Quảng Ninh', 'hợp nhất Hải Ninh và khu Hồng Quảng', 'merged province')],
  'lang-son': [N(1010, 'châu Lạng', 'thời Lý', 'Lý district'), N(1466, 'Lạng Sơn', 'thừa tuyên thời Lê', 'Lê province'), N(1831, 'tỉnh Lạng Sơn', 'thời Minh Mạng', 'Minh Mạng province')],
  'binh-dinh': [
    N(1000, 'Vijaya (Đồ Bàn)', 'kinh đô Chăm Pa', 'Cham capital'),
    N(1471, 'phủ Hoài Nhơn', 'thời Lê', 'Lê prefecture'),
    N(1776, 'Hoàng Đế thành', 'kinh đô Nguyễn Nhạc', 'Tây Sơn capital'),
    N(1799, 'Bình Định', 'Nguyễn Ánh đổi tên', 'renamed by Nguyễn Ánh'),
    N(1832, 'tỉnh Bình Định', 'thời Minh Mạng', 'Minh Mạng province'),
  ],
  'dong-nai': [N(1698, 'dinh Trấn Biên', 'huyện Phước Long, phủ Gia Định', 'Phước Long, Gia Định'), N(1808, 'trấn Biên Hoà', 'thời Gia Long', 'Gia Long garrison'), N(1832, 'tỉnh Biên Hoà', 'thời Minh Mạng', 'Minh Mạng province'), N(1976, 'Đồng Nai', 'hợp nhất Biên Hoà, Long Khánh, Tuy', 'merged province')],
  'an-giang': [N(1757, 'đạo Châu Đốc', 'Nguyễn Cư Trinh lập', 'set up by Nguyễn Cư Trinh'), N(1832, 'tỉnh An Giang', 'thời Minh Mạng', 'Minh Mạng province'), N(1867, 'Nam Kỳ', 'thuộc địa Pháp', 'French colony')],
}

export function adminNames(provinceId: string): AdminName[] {
  return PROVINCE[provinceId] ?? REGION[provinceRegion(provinceId) ?? ''] ?? []
}

/** Tên đang dùng ở năm y */
export function adminAt(list: AdminName[], y: number) {
  let cur: AdminName | undefined
  for (const a of list) if (a.from <= y) cur = a
  return cur
}
