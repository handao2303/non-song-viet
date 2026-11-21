/**
 * Quần đảo Hoàng Sa và Trường Sa.
 * Toạ độ đảo gần đúng. Mốc sử liệu theo các văn bản Việt Nam:
 * Toản tập Thiên Nam tứ chí lộ đồ thư (1686), Phủ biên tạp lục (Lê Quý Đôn, 1776),
 * Đại Nam thực lục chính biên (Gia Long, Minh Mạng), Đại Nam nhất thống chí, và văn bản hành chính thời Pháp – hiện đại.
 */
import type { T } from './types'

const t = (vi: string, en: string): T => ({ vi, en })

export interface Island {
  id: string
  group: 'hs' | 'ts'
  name: T
  coord: [number, number]
}

export const ISLANDS: Island[] = (
  [
    ['phulam', 'hs', 'Đảo Phú Lâm', 'Phú Lâm (Woody) I.', 112.335, 16.835],
    ['linhcon', 'hs', 'Đảo Linh Côn', 'Linh Côn (Lincoln) I.', 112.73, 16.67],
    ['cay', 'hs', 'Đảo Cây', 'Cây (Tree) I.', 112.27, 16.98],
    ['hoangsa', 'hs', 'Đảo Hoàng Sa', 'Hoàng Sa (Pattle) I.', 111.6, 16.53],
    ['huunhat', 'hs', 'Đảo Hữu Nhật', 'Hữu Nhật (Robert) I.', 111.56, 16.5],
    ['quanganh', 'hs', 'Đảo Quang Ảnh', 'Quang Ảnh (Money) I.', 111.59, 16.45],
    ['quanghoa', 'hs', 'Đảo Quang Hoà', 'Quang Hòa (Duncan) I.', 111.71, 16.45],
    ['duymong', 'hs', 'Đảo Duy Mộng', 'Duy Mộng (Drummond) I.', 111.74, 16.46],
    ['triton', 'hs', 'Đảo Tri Tôn', 'Tri Tôn (Triton) I.', 111.2, 15.78],
    ['bachquy', 'hs', 'Bãi Bạch Quy', 'Bạch Quy (Passu Keah)', 111.75, 16.05],
    ['songtutay', 'ts', 'Đảo Song Tử Tây', 'Song Tử Tây (Southwest Cay)', 114.33, 11.43],
    ['songtudong', 'ts', 'Đảo Song Tử Đông', 'Song Tử Đông (Northeast Cay)', 114.36, 11.46],
    ['thitu', 'ts', 'Đảo Thị Tứ', 'Thị Tứ (Thitu) I.', 114.28, 11.05],
    ['loaita', 'ts', 'Đảo Loại Ta', 'Loại Ta (Loaita) I.', 114.42, 10.68],
    ['babinh', 'ts', 'Đảo Ba Bình', 'Ba Bình (Itu Aba) I.', 114.37, 10.38],
    ['sonca', 'ts', 'Đảo Sơn Ca', 'Sơn Ca (Sand Cay)', 114.48, 10.38],
    ['namyet', 'ts', 'Đảo Nam Yết', 'Nam Yết (Namyit) I.', 114.36, 10.18],
    ['sinhton', 'ts', 'Đảo Sinh Tồn', 'Sinh Tồn (Sin Cowe) I.', 114.33, 9.88],
    ['gacma', 'ts', 'Đá Gạc Ma', 'Gạc Ma (Johnson South) Reef', 114.28, 9.71],
    ['datay', 'ts', 'Đảo Đá Tây', 'Đá Tây (West Reef)', 112.25, 8.85],
    ['truongsalon', 'ts', 'Đảo Trường Sa Lớn', 'Trường Sa (Spratly) I.', 111.92, 8.64],
    ['anbang', 'ts', 'Đảo An Bang', 'An Bang (Amboyna Cay)', 112.92, 7.89],
  ] as const
).map(([id, group, vi, en, lng, lat]) => ({ id, group, name: { vi, en }, coord: [lng, lat] as [number, number] }))

export interface Milestone {
  year: number
  text: T
  /** nguồn sử liệu */
  src?: string
}

export interface Archipelago {
  id: 'hs' | 'ts'
  name: T
  admin: T
  label: [number, number]
  box: [number, number][]
}

export const ARCHIPELAGOS: Archipelago[] = [
  {
    id: 'hs',
    name: t('Quần đảo Hoàng Sa', 'Hoàng Sa (Paracel) Islands'),
    admin: t('Đặc khu Hoàng Sa, TP. Đà Nẵng', 'Hoàng Sa special zone, Đà Nẵng'),
    label: [112.05, 17.25],
    box: [[110.9, 15.6], [113.0, 15.6], [113.0, 17.2], [110.9, 17.2], [110.9, 15.6]],
  },
  {
    id: 'ts',
    name: t('Quần đảo Trường Sa', 'Trường Sa (Spratly) Islands'),
    admin: t('Đặc khu Trường Sa, tỉnh Khánh Hoà', 'Trường Sa special zone, Khánh Hòa'),
    label: [113.4, 11.95],
    box: [[111.5, 7.4], [115.6, 7.4], [115.6, 11.7], [111.5, 11.7], [111.5, 7.4]],
  },
]

export const MILESTONES: Milestone[] = [
  { year: 1686, text: t('Toản tập Thiên Nam tứ chí lộ đồ thư của Đỗ Bá vẽ “Bãi Cát Vàng” ngoài khơi phủ Quảng Nghĩa, ghi chúa Nguyễn hằng năm sai thuyền ra lấy hàng hoá từ tàu đắm.', 'Đỗ Bá’s atlas marks the “Golden Sandbanks” off Quảng Nghĩa, noting that the Nguyễn lords sent boats each year to salvage cargo.'), src: '纂集天南四至路圖書' },
  { year: 1754, text: t('Thực lục tiền biên chép: dân đội Hoàng Sa ở Quảng Ngãi đi thuyền ra đảo Hoàng Sa gặp bão, dạt vào Quỳnh Châu; Tổng đốc nhà Thanh cấp cho hậu hĩnh rồi đưa về.', 'The Prequel records that Hoàng Sa Company men from Quảng Ngãi, blown to Hainan by a storm, were generously sent home by the Qing governor.'), src: '大南寔錄前編 卷10' },
  { year: 1776, text: t('Lê Quý Đôn chép trong Phủ biên tạp lục: Đội Hoàng Sa gồm 70 suất người xã An Vĩnh, tháng Giêng ra đảo, tháng Tám trở về; có thêm đội Bắc Hải ra các đảo phía nam.', 'Lê Quý Đôn’s Phủ biên tạp lục: the 70-man Hoàng Sa Company from An Vĩnh sailed out each first month and returned in the eighth; a Bắc Hải Company worked the southern islands.'), src: '撫邊雜錄' },
  { year: 1815, text: t('Gia Long sai đội Hoàng Sa do Phạm Quang Ảnh chỉ huy ra Hoàng Sa thăm dò đường biển.', 'Gia Long sent the Hoàng Sa Company under Phạm Quang Ảnh to survey the sea routes.'), src: '大南寔錄正編第一紀 卷50' },
  { year: 1816, text: t('Gia Long sai thuỷ quân cùng đội Hoàng Sa đi thuyền ra Hoàng Sa xem xét, đo đạc thuỷ trình.', 'Gia Long sent the navy and the Hoàng Sa Company to survey the islands and their sea routes.'), src: '大南寔錄正編第一紀 卷52' },
  { year: 1835, text: t('Minh Mạng cho dựng miếu, lập bia đá trên đảo Hoàng Sa.', 'Minh Mạng had a temple and a stone stele built on Hoàng Sa.'), src: '大南寔錄正編第二紀 卷154' },
  { year: 1836, text: t('Suất đội thuỷ quân Phạm Hữu Nhật đem binh thuyền ra Hoàng Sa cắm mốc gỗ, khảo sát và vẽ bản đồ các đảo.', 'Naval captain Phạm Hữu Nhật took ships to Hoàng Sa, planted wooden markers and charted the islands.'), src: '大南寔錄正編第二紀 卷165' },
  { year: 1838, text: t('Công bộ viên ngoại lang Đỗ Mậu Thưởng đi Hoàng Sa về, dâng bản đồ, được khen là khảo sát kỹ hơn các lần trước.', 'Đỗ Mậu Thưởng returned from Hoàng Sa with maps more detailed than earlier missions.'), src: '大南寔錄正編第二紀 卷194' },
  { year: 1838, text: t('An Nam đại quốc hoạ đồ (Taberd) ghi rõ “Paracel seu Cát Vàng” trong lãnh hải An Nam.', 'Taberd’s map of Annam labels “Paracel seu Cát Vàng” within Annamese waters.') },
  { year: 1932, text: t('Chính quyền Pháp đặt Hoàng Sa thành đơn vị hành chính thuộc tỉnh Thừa Thiên; năm 1933 sáp nhập Trường Sa vào tỉnh Bà Rịa.', 'French Indochina made Hoàng Sa part of Thừa Thiên province, and in 1933 attached Trường Sa to Bà Rịa.') },
  { year: 1951, text: t('Tại Hội nghị San Francisco, Thủ tướng Trần Văn Hữu tuyên bố chủ quyền của Việt Nam đối với Hoàng Sa và Trường Sa, không có ý kiến phản đối.', 'At the San Francisco conference Prime Minister Trần Văn Hữu affirmed Vietnamese sovereignty over both archipelagos without objection.') },
  { year: 1956, text: t('Trung Quốc chiếm nhóm đảo phía đông quần đảo Hoàng Sa.', 'China occupied the eastern group of the Hoàng Sa islands.') },
  { year: 1974, text: t('Hải chiến Hoàng Sa (19/1): 74 quân nhân Việt Nam Cộng hoà hi sinh; Trung Quốc chiếm toàn bộ quần đảo.', 'Battle of the Paracels (19 Jan): 74 South Vietnamese sailors died and China seized the whole archipelago.') },
  { year: 1975, text: t('Tháng 4/1975, Hải quân nhân dân Việt Nam tiếp quản các đảo ở Trường Sa, bắt đầu từ Song Tử Tây.', 'In April 1975 the Vietnamese navy took over the Trường Sa islands, starting with Song Tử Tây.') },
  { year: 1982, text: t('Thành lập huyện đảo Hoàng Sa (Quảng Nam – Đà Nẵng) và huyện đảo Trường Sa (Đồng Nai, sau thuộc Phú Khánh — Khánh Hoà).', 'The island districts of Hoàng Sa and Trường Sa were created.') },
  { year: 1988, text: t('Sự kiện Gạc Ma (14/3): 64 chiến sĩ hải quân Việt Nam hi sinh khi bảo vệ chủ quyền.', 'Gạc Ma (14 Mar): 64 Vietnamese sailors died defending the reef.') },
  { year: 2025, text: t('Bỏ cấp huyện: Hoàng Sa thành đặc khu thuộc TP. Đà Nẵng, Trường Sa thành đặc khu thuộc tỉnh Khánh Hoà.', 'With districts abolished, Hoàng Sa became a special zone of Đà Nẵng and Trường Sa a special zone of Khánh Hòa.') },
]
