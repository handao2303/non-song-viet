import type { Capital } from './types'

const t = (vi: string, en: string) => ({ vi, en })

export const CAPITALS: Capital[] = [
  { id: 'phongchau', name: t('Phong Châu', 'Phong Châu'), coord: [105.39, 21.33], polity: 'vanlang', spans: [[-700, -258]] },
  { id: 'coloa', name: t('Cổ Loa', 'Cổ Loa'), coord: [105.873, 21.115], polity: 'aulac', spans: [[-257, -208], [939, 967]] },
  { id: 'luylau', name: t('Luy Lâu', 'Luy Lâu'), coord: [106.07, 21.04], polity: 'chinese', spans: [[-110, 39], [43, 225]], seat: true },
  { id: 'melinh', name: t('Mê Linh', 'Mê Linh'), coord: [105.72, 21.18], polity: 'trung', spans: [[40, 42]] },
  { id: 'longbien', name: t('Long Biên', 'Long Biên'), coord: [105.89, 21.05], polity: 'chinese', spans: [[226, 540], [541, 602]], seat: true },
  { id: 'tongbinh', name: t('Tống Bình · Đại La', 'Songping · Đại La'), coord: [105.84, 21.03], polity: 'chinese', spans: [[603, 938]], seat: true },
  { id: 'hoalu', name: t('Hoa Lư', 'Hoa Lư'), coord: [105.905, 20.285], polity: 'dinh', spans: [[968, 1009]] },
  { id: 'thanglong', name: t('Thăng Long', 'Thăng Long'), coord: [105.84, 21.035], polity: 'ly', spans: [[1010, 1399], [1428, 1788]], note: t('Đông Đô (1397), Đông Kinh (1430)', 'Also Đông Đô, Đông Kinh') },
  { id: 'dongquan', name: t('Đông Quan', 'Đông Quan'), coord: [105.84, 21.035], polity: 'minh', spans: [[1407, 1427]], seat: true },
  { id: 'nghean-hautran', name: t('Hành tại Nghệ An', 'Nghệ An court'), coord: [105.68, 18.68], polity: 'hautran', spans: [[1407, 1413]], note: t('Giản Định, Trùng Quang kháng Minh', 'Later Trần resistance base')  },
  { id: 'taydo', name: t('Tây Đô', 'Tây Đô'), coord: [105.605, 20.076], polity: 'ho', spans: [[1400, 1406]], note: t('Thành nhà Hồ — Di sản thế giới UNESCO', 'Citadel of the Hồ — UNESCO World Heritage') },
  { id: 'yentruong', name: t('Yên Trường (Tây Kinh)', 'Yên Trường'), coord: [105.58, 19.98], polity: 'letrinh', spans: [[1546, 1592]] },
  { id: 'caobang', name: t('Cao Bằng (họ Mạc)', 'Cao Bằng (Mạc)'), coord: [106.25, 22.67], polity: 'mac', spans: [[1593, 1677]] },
  { id: 'aitu', name: t('Ái Tử', 'Ái Tử'), coord: [107.15, 16.78], polity: 'nguyenlord', spans: [[1600, 1625]] },
  { id: 'phuxuan', name: t('Phú Xuân (Huế)', 'Phú Xuân (Huế)'), coord: [107.58, 16.47], polity: 'nguyenlord', spans: [[1626, 1774], [1786, 1801], [1802, 1945]], note: t('Kim Long 1636, Phú Xuân 1687; kinh đô triều Nguyễn 1802–1945', 'Nguyễn imperial capital 1802–1945') },
  { id: 'hoangde', name: t('Thành Hoàng Đế (Quy Nhơn)', 'Hoàng Đế Citadel (Quy Nhơn)'), coord: [109.06, 13.9], polity: 'tayson', spans: [[1776, 1793]] },
  { id: 'giadinh', name: t('Gia Định', 'Gia Định'), coord: [106.7, 10.78], polity: 'nguyenanh', spans: [[1788, 1801]] },
  { id: 'saigon', name: t('Sài Gòn', 'Saigon'), coord: [106.7, 10.78], polity: 'cochin', spans: [[1862, 1944]], note: t('Thủ phủ Nam Kỳ; thủ đô Đông Dương 1887–1902', 'Capital of Cochinchina; of Indochina 1887–1902') },
  { id: 'hanoi-fr', name: t('Hà Nội', 'Hanoi'), coord: [105.85, 21.03], polity: 'tonkin', spans: [[1902, 1944]], note: t('Thủ đô Liên bang Đông Dương', 'Capital of French Indochina'), seat: true },
  { id: 'hanoi', name: t('Hà Nội', 'Hanoi'), coord: [105.835, 21.037], polity: 'vndcch', spans: [[1945, 1946], [1954, 2026]] },
  { id: 'atk', name: t('ATK Định Hoá', 'Định Hóa base'), coord: [105.63, 21.9], polity: 'vndcch', spans: [[1947, 1953]] },
  { id: 'saigon-vnch', name: t('Sài Gòn', 'Saigon'), coord: [106.7, 10.78], polity: 'vnch', spans: [[1954, 1975]] },
  // Chăm Pa
  { id: 'simhapura', name: t('Simhapura (Trà Kiệu)', 'Simhapura (Trà Kiệu)'), coord: [108.24, 15.83], polity: 'champa', spans: [[400, 757]] },
  { id: 'virapura', name: t('Virapura', 'Virapura'), coord: [108.95, 11.6], polity: 'champa', spans: [[758, 859]] },
  { id: 'indrapura', name: t('Indrapura (Đồng Dương)', 'Indrapura (Đồng Dương)'), coord: [108.25, 15.69], polity: 'champa', spans: [[875, 999]] },
  { id: 'vijaya', name: t('Vijaya (Đồ Bàn)', 'Vijaya'), coord: [109.11, 13.89], polity: 'champa', spans: [[1000, 1470]] },
  { id: 'panduranga', name: t('Panduranga (Phan Rang)', 'Panduranga'), coord: [108.99, 11.57], polity: 'champa', spans: [[1471, 1692]] },
  { id: 'myson', name: t('Thánh địa Mỹ Sơn', 'Mỹ Sơn sanctuary'), coord: [108.12, 15.77], polity: 'champa', spans: [[400, 1470]], note: t('Di sản thế giới UNESCO', 'UNESCO World Heritage'), minor: true },
  // Phù Nam – Chân Lạp
  { id: 'oceo', name: t('Óc Eo', 'Óc Eo'), coord: [105.15, 10.25], polity: 'funan', spans: [[50, 549]], note: t('Thương cảng quốc tế của Phù Nam', 'Funan’s international port') },
  { id: 'preynokor', name: t('Prey Nokor', 'Prey Nokor'), coord: [106.68, 10.76], polity: 'chenla', spans: [[1623, 1697]], note: t('Đồn thu thuế của chúa Nguyễn từ 1623', 'Nguyễn customs post from 1623'), minor: true },
  { id: 'hatien', name: t('Hà Tiên', 'Hà Tiên'), coord: [104.49, 10.38], polity: 'nguyenlord', spans: [[1708, 1771]], note: t('Trấn của họ Mạc (Mạc Cửu, Mạc Thiên Tứ)', 'Seat of the Mạc lords of Hà Tiên') },
]

export const capitalsAt = (y: number) => CAPITALS.filter((c) => c.spans.some(([a, b]) => y >= a && y <= b))
