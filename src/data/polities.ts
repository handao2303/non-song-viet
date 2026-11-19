import type { Polity, T } from './types'

const t = (vi: string, en: string): T => ({ vi, en })
const fixed = (vi: string, en: string) => () => t(vi, en)

/** Triều đại Trung Hoa theo năm (dùng cho nhãn phương Bắc) */
export function chinaDynasty(y: number): T {
  if (y < -221) return t('Sở · Bách Việt', 'Chu States · Hundred Yue')
  if (y < -206) return t('Tần', 'Qin')
  if (y < 220) return t('Hán', 'Han')
  if (y < 280) return t('Đông Ngô', 'Eastern Wu')
  if (y < 420) return t('Tấn', 'Jin')
  if (y < 479) return t('Lưu Tống', 'Liu Song')
  if (y < 502) return t('Nam Tề', 'Southern Qi')
  if (y < 557) return t('Lương', 'Liang')
  if (y < 589) return t('Trần (Nam triều)', 'Chen')
  if (y < 618) return t('Tùy', 'Sui')
  if (y < 907) return t('Đường', 'Tang')
  if (y < 960) return t('Ngũ Đại · Nam Hán', 'Five Dynasties · Southern Han')
  if (y < 1279) return t('Tống', 'Song')
  if (y < 1368) return t('Nguyên', 'Yuan')
  if (y < 1644) return t('Minh', 'Ming')
  if (y < 1912) return t('Thanh', 'Qing')
  if (y < 1949) return t('Trung Hoa Dân Quốc', 'Republic of China')
  return t('Trung Quốc', 'China')
}

/** Tên đơn vị hành chính đô hộ trên đất Việt */
export function chineseAdmin(y: number): T {
  if (y < -111) return t('Nam Việt', 'Nanyue')
  if (y < 203) return t('Giao Chỉ bộ', 'Jiaozhi Circuit')
  if (y < 679) return t('Giao Châu', 'Jiao Province')
  if (y < 757) return t('An Nam đô hộ phủ', 'Protectorate of Annam')
  if (y < 768) return t('Trấn Nam đô hộ phủ', 'Protectorate of Zhennan')
  if (y < 866) return t('An Nam đô hộ phủ', 'Protectorate of Annam')
  if (y < 1000) return t('Tĩnh Hải quân', 'Jinghai Circuit')
  return t('Quận Giao Chỉ (Minh)', 'Jiaozhi Province (Ming)')
}

export const POLITIES: Record<string, Polity> = {
  vanlang: { id: 'vanlang', kind: 'viet', color: '#c98a3d', dynasty: t('Hùng Vương', 'Hùng Kings'), name: fixed('Văn Lang', 'Văn Lang') },
  aulac: { id: 'aulac', kind: 'viet', color: '#c2723b', dynasty: t('An Dương Vương', 'An Dương Vương'), name: fixed('Âu Lạc', 'Âu Lạc') },
  nanyue: { id: 'nanyue', kind: 'chinese', color: '#8f7aa0', dynasty: t('nhà Triệu', 'Triệu dynasty'), name: fixed('Nam Việt', 'Nanyue') },
  chinese: { id: 'chinese', kind: 'chinese', color: '#8e8476', dynasty: t('Bắc thuộc', 'Chinese rule'), name: (y) => chineseAdmin(y) },
  trung: { id: 'trung', kind: 'viet', color: '#d1495b', dynasty: t('Trưng Vương', 'Trưng Sisters'), name: fixed('Lĩnh Nam', 'Lĩnh Nam') },
  vanxuan: { id: 'vanxuan', kind: 'viet', color: '#c8683b', dynasty: t('nhà Tiền Lý', 'Early Lý'), name: fixed('Vạn Xuân', 'Vạn Xuân') },
  tuchu: { id: 'tuchu', kind: 'viet', color: '#c99a3b', dynasty: t('họ Khúc · Dương', 'Khúc & Dương clans'), name: fixed('Tĩnh Hải quân (tự chủ)', 'Jinghai (autonomous)') },
  ngo: { id: 'ngo', kind: 'viet', color: '#d0883a', dynasty: t('nhà Ngô', 'Ngô dynasty'), name: fixed('Tĩnh Hải quân · nhà Ngô', 'Ngô Kingdom') },
  suquan: { id: 'suquan', kind: 'viet', color: '#bea36c', dynasty: t('Loạn 12 sứ quân', 'Twelve Warlords'), name: fixed('12 sứ quân', 'Twelve Warlords') },
  dinh: { id: 'dinh', kind: 'viet', color: '#c56f3a', dynasty: t('nhà Đinh', 'Đinh dynasty'), name: fixed('Đại Cồ Việt', 'Đại Cồ Việt') },
  tienle: { id: 'tienle', kind: 'viet', color: '#b8573a', dynasty: t('nhà Tiền Lê', 'Early Lê'), name: fixed('Đại Cồ Việt', 'Đại Cồ Việt') },
  ly: { id: 'ly', kind: 'viet', color: '#c9553d', dynasty: t('nhà Lý', 'Lý dynasty'), name: (y) => (y < 1054 ? t('Đại Cồ Việt', 'Đại Cồ Việt') : t('Đại Việt', 'Đại Việt')) },
  tran: { id: 'tran', kind: 'viet', color: '#a8403f', dynasty: t('nhà Trần', 'Trần dynasty'), name: fixed('Đại Việt', 'Đại Việt') },
  ho: { id: 'ho', kind: 'viet', color: '#7d6b9c', dynasty: t('nhà Hồ', 'Hồ dynasty'), name: fixed('Đại Ngu', 'Đại Ngu') },
  minh: { id: 'minh', kind: 'chinese', color: '#8a7f73', dynasty: t('Minh thuộc', 'Ming occupation'), name: fixed('Quận Giao Chỉ', 'Jiaozhi Province') },
  leso: { id: 'leso', kind: 'viet', color: '#c08a1e', dynasty: t('nhà Hậu Lê (Lê sơ)', 'Later Lê'), name: fixed('Đại Việt', 'Đại Việt') },
  mac: { id: 'mac', kind: 'viet', color: '#6f9478', dynasty: t('nhà Mạc', 'Mạc dynasty'), name: (y) => (y < 1593 ? t('Đại Việt · Bắc triều', 'Đại Việt · Northern Court') : t('Mạc · Cao Bằng', 'Mạc · Cao Bằng')) },
  letrinh: { id: 'letrinh', kind: 'viet', color: '#b98b2f', dynasty: t('Lê trung hưng · chúa Trịnh', 'Restored Lê · Trịnh lords'), name: (y) => (y < 1593 ? t('Đại Việt · Nam triều', 'Đại Việt · Southern Court') : t('Đàng Ngoài', 'Đàng Ngoài (Tonkin)')) },
  nguyenlord: { id: 'nguyenlord', kind: 'viet', color: '#3f8290', dynasty: t('chúa Nguyễn', 'Nguyễn lords'), name: fixed('Đàng Trong', 'Đàng Trong (Cochinchina)') },
  tayson: { id: 'tayson', kind: 'viet', color: '#c23b30', dynasty: t('nhà Tây Sơn', 'Tây Sơn dynasty'), name: fixed('Tây Sơn', 'Tây Sơn') },
  nguyenanh: { id: 'nguyenanh', kind: 'viet', color: '#2f6f80', dynasty: t('Nguyễn Ánh', 'Nguyễn Ánh'), name: fixed('Gia Định (Nguyễn Ánh)', 'Gia Định (Nguyễn Ánh)') },
  nguyen: { id: 'nguyen', kind: 'viet', color: '#d6a51c', dynasty: t('nhà Nguyễn', 'Nguyễn dynasty'), name: (y) => (y < 1804 ? t('Việt Nam', 'Việt Nam') : y < 1839 ? t('Việt Nam', 'Việt Nam') : t('Đại Nam', 'Đại Nam')) },
  cochin: { id: 'cochin', kind: 'colonial', color: '#5b6d92', dynasty: t('Pháp thuộc', 'French colony'), name: fixed('Nam Kỳ (thuộc địa Pháp)', 'Cochinchina (French colony)') },
  annam: { id: 'annam', kind: 'protectorate', color: '#c6a65a', dynasty: t('nhà Nguyễn · bảo hộ Pháp', 'Nguyễn under French protectorate'), name: fixed('Trung Kỳ (Annam)', 'Annam') },
  tonkin: { id: 'tonkin', kind: 'protectorate', color: '#8797b8', dynasty: t('Bảo hộ Pháp', 'French protectorate'), name: fixed('Bắc Kỳ (Tonkin)', 'Tonkin') },
  vndcch: { id: 'vndcch', kind: 'viet', color: '#c8302e', dynasty: t('Việt Nam Dân chủ Cộng hòa', 'Democratic Republic of Vietnam'), name: (y) => (y < 1954 ? t('Việt Nam DCCH', 'DR Vietnam') : t('Việt Nam DCCH · miền Bắc', 'North Vietnam')) },
  vnch: { id: 'vnch', kind: 'viet', color: '#e2b63a', dynasty: t('Việt Nam Cộng hòa', 'Republic of Vietnam'), name: (y) => (y < 1955 ? t('Quốc gia Việt Nam', 'State of Vietnam') : t('Việt Nam Cộng hòa', 'South Vietnam')) },
  cmn: { id: 'cmn', kind: 'viet', color: '#4b7fc2', dynasty: t('CH Miền Nam Việt Nam', 'Republic of South Vietnam'), name: fixed('CH Miền Nam VN', 'Rep. of South Vietnam') },
  chxhcn: { id: 'chxhcn', kind: 'viet', color: '#d33a35', dynasty: t('CHXHCN Việt Nam', 'Socialist Republic of Vietnam'), name: fixed('Việt Nam', 'Vietnam') },
  // Lân bang & văn hoá
  champa: {
    id: 'champa',
    kind: 'neighbor',
    color: '#6f9460',
    dynasty: t('Chăm Pa', 'Champa'),
    name: (y) => (y < 758 ? t('Lâm Ấp', 'Lâm Ấp (Linyi)') : y < 860 ? t('Hoàn Vương', 'Huanwang') : t('Chiêm Thành', 'Champa')),
  },
  funan: { id: 'funan', kind: 'neighbor', color: '#5d8f8c', dynasty: t('Phù Nam', 'Funan'), name: fixed('Phù Nam', 'Funan') },
  chenla: {
    id: 'chenla',
    kind: 'neighbor',
    color: '#8ea35c',
    dynasty: t('Chân Lạp · Khmer', 'Chenla · Khmer'),
    name: (y) => (y < 802 ? t('Chân Lạp', 'Chenla') : y < 1432 ? t('Đế quốc Khmer', 'Khmer Empire') : y < 1863 ? t('Chân Lạp', 'Cambodia') : y < 1953 ? t('Cao Miên (bảo hộ Pháp)', 'Cambodia (French)') : t('Campuchia', 'Cambodia')),
  },
  laos: {
    id: 'laos',
    kind: 'neighbor',
    color: '#a58c62',
    dynasty: t('Lào', 'Lao'),
    name: (y) => (y < 1353 ? t('Các mường Lào', 'Lao muang') : y < 1707 ? t('Lan Xang (Ai Lao)', 'Lan Xang') : y < 1893 ? t('Vạn Tượng · Luang Prabang', 'Vientiane · Luang Prabang') : y < 1953 ? t('Ai Lao (bảo hộ Pháp)', 'Laos (French)') : t('Lào', 'Laos')),
  },
  siam: {
    id: 'siam',
    kind: 'neighbor',
    color: '#b3956b',
    dynasty: t('Xiêm', 'Siam'),
    name: (y) => (y < 1238 ? t('Các tiểu quốc Môn', 'Mon kingdoms') : y < 1351 ? t('Sukhothai', 'Sukhothai') : y < 1767 ? t('Ayutthaya (Xiêm La)', 'Ayutthaya') : y < 1939 ? t('Xiêm', 'Siam') : t('Thái Lan', 'Thailand')),
  },
  tai: { id: 'tai', kind: 'culture', color: '#ae9a70', dynasty: t('Các mường Thái', 'Tai chiefdoms'), name: fixed('Mường Thái', 'Tai muang') },
  highlands: { id: 'highlands', kind: 'culture', color: '#a5946f', dynasty: t('Các tộc Tây Nguyên', 'Highland peoples'), name: fixed('Tây Nguyên', 'Central Highlands') },
  sahuynh: { id: 'sahuynh', kind: 'culture', color: '#bdac86', dynasty: t('Văn hoá Sa Huỳnh', 'Sa Huỳnh culture'), name: fixed('Sa Huỳnh', 'Sa Huỳnh') },
  china: { id: 'china', kind: 'neighbor', color: '#8e8476', dynasty: t('Trung Hoa', 'China'), name: (y) => chinaDynasty(y) },
  frIndo: { id: 'frIndo', kind: 'colonial', color: '#7b88a8', dynasty: t('Đông Dương thuộc Pháp', 'French Indochina'), name: fixed('Đông Dương thuộc Pháp', 'French Indochina') },
}

export const polity = (id: string) => POLITIES[id]
export const isVietRuled = (id: string | null) => {
  if (!id) return false
  const k = POLITIES[id].kind
  return k === 'viet' || k === 'protectorate'
}
