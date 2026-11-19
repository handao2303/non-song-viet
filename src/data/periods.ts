import type { Period } from './types'

const t = (vi: string, en: string) => ({ vi, en })

/** Các thời kỳ chính của dòng lịch sử Việt (dải màu trên timeline) */
export const PERIODS: Period[] = [
  {
    id: 'vanlang', polity: 'vanlang', start: -700, end: -258,
    name: t('Văn Lang', 'Văn Lang'), title: t('Văn Lang', 'Văn Lang'), founder: t('Hùng Vương', 'Hùng Kings'),
    capital: t('Phong Châu (Phú Thọ)', 'Phong Châu (Phú Thọ)'),
    summary: t(
      'Nhà nước sơ khai của người Lạc Việt trên lưu vực sông Hồng, sông Mã, sông Cả, gắn với văn hoá Đông Sơn và trống đồng. Truyền thuyết kể 18 đời Hùng Vương, chia nước làm 15 bộ.',
      'Early Lạc Việt state on the Red, Mã and Cả rivers, tied to the Đông Sơn bronze-drum culture. Legend tells of 18 Hùng kings and 15 tribal provinces.',
    ),
  },
  {
    id: 'aulac', polity: 'aulac', start: -257, end: -180,
    name: t('Âu Lạc', 'Âu Lạc'), title: t('Âu Lạc', 'Âu Lạc'), founder: t('An Dương Vương (Thục Phán)', 'An Dương Vương (Thục Phán)'),
    capital: t('Cổ Loa (Đông Anh, Hà Nội)', 'Cổ Loa (Hà Nội)'),
    summary: t(
      'Thục Phán hợp nhất Âu Việt và Lạc Việt, xây thành Cổ Loa hình xoáy ốc — toà thành cổ lớn nhất Đông Nam Á. Truyền thuyết nỏ thần Kim Quy và Mỵ Châu – Trọng Thuỷ.',
      'Thục Phán united the Âu Việt and Lạc Việt and built the spiral citadel of Cổ Loa — the largest ancient fortress in Southeast Asia. Home of the legend of the magic crossbow.',
    ),
  },
  {
    id: 'bt1', polity: 'chinese', start: -179, end: 39,
    name: t('Bắc thuộc lần I', 'First Chinese domination'), founder: t('Triệu Đà → nhà Hán', 'Zhao Tuo → Han'),
    capital: t('Luy Lâu (Thuận Thành, Bắc Ninh)', 'Luy Lâu (Bắc Ninh)'),
    summary: t(
      'Triệu Đà thôn tính Âu Lạc, sáp nhập vào Nam Việt; năm 111 TCN nhà Hán diệt Nam Việt, chia đất Việt thành ba quận Giao Chỉ, Cửu Chân, Nhật Nam.',
      'Zhao Tuo annexed Âu Lạc into Nanyue; in 111 BCE the Han conquered Nanyue and split the land into Jiaozhi, Jiuzhen and Rinan commanderies.',
    ),
  },
  {
    id: 'trung', polity: 'trung', start: 40, end: 42,
    name: t('Trưng Vương', 'Trưng Sisters'), founder: t('Trưng Trắc, Trưng Nhị', 'Trưng Trắc & Trưng Nhị'),
    capital: t('Mê Linh', 'Mê Linh'),
    summary: t(
      'Hai Bà Trưng khởi nghĩa ở Hát Môn, chiếm 65 thành trì, xưng vương đóng đô ở Mê Linh. Năm 43, Mã Viện đem quân Hán đàn áp, Hai Bà tuẫn tiết trên sông Hát.',
      'The Trưng sisters rose at Hát Môn, took 65 citadels and ruled from Mê Linh. In 43 CE Han general Ma Yuan crushed the revolt.',
    ),
  },
  {
    id: 'bt2', polity: 'chinese', start: 43, end: 543,
    name: t('Bắc thuộc lần II', 'Second Chinese domination'), founder: t('Đông Hán → Ngô → Tấn → Nam triều', 'Han → Wu → Jin → Southern dynasties'),
    capital: t('Luy Lâu → Long Biên', 'Luy Lâu → Long Biên'),
    summary: t(
      'Năm thế kỷ đô hộ xen kẽ các cuộc khởi nghĩa (Bà Triệu 248). Phía nam, Khu Liên lập nước Lâm Ấp (192) — tiền thân Chăm Pa; ở châu thổ Mê Kông, Phù Nam hưng thịnh với cảng Óc Eo.',
      'Five centuries of rule punctuated by revolts (Lady Triệu, 248). To the south Khu Liên founded Lâm Ấp (192), forerunner of Champa; Funan flourished in the Mekong delta around the port of Óc Eo.',
    ),
  },
  {
    id: 'vanxuan', polity: 'vanxuan', start: 544, end: 602,
    name: t('Nhà Tiền Lý · Vạn Xuân', 'Early Lý · Vạn Xuân'), title: t('Vạn Xuân', 'Vạn Xuân'), founder: t('Lý Nam Đế (Lý Bí)', 'Lý Nam Đế (Lý Bí)'),
    capital: t('Long Biên', 'Long Biên'),
    summary: t(
      'Lý Bí đánh đuổi quân Lương, xưng Nam Việt Đế, đặt quốc hiệu Vạn Xuân. Triệu Quang Phục kháng chiến ở đầm Dạ Trạch; năm 602 nhà Tùy chiếm lại.',
      'Lý Bí expelled the Liang, proclaimed himself emperor of Vạn Xuân. Triệu Quang Phục fought on from Dạ Trạch marsh until the Sui reconquest in 602.',
    ),
  },
  {
    id: 'bt3', polity: 'chinese', start: 603, end: 904,
    name: t('Bắc thuộc lần III', 'Third Chinese domination'), founder: t('Tùy → Đường', 'Sui → Tang'),
    capital: t('Tống Bình → Đại La', 'Songping → Đại La'),
    summary: t(
      'Nhà Đường lập An Nam đô hộ phủ (679). Khởi nghĩa Mai Thúc Loan (722), Phùng Hưng (791). Cao Biền xây thành Đại La (866) — nền móng Thăng Long sau này.',
      'The Tang created the Protectorate of Annam (679). Revolts of Mai Thúc Loan (722) and Phùng Hưng (791). Gao Pian built Đại La (866), the foundation of later Thăng Long.',
    ),
  },
  {
    id: 'tuchu', polity: 'tuchu', start: 905, end: 938,
    name: t('Thời tự chủ (Khúc – Dương)', 'Autonomy (Khúc & Dương)'), founder: t('Khúc Thừa Dụ', 'Khúc Thừa Dụ'),
    capital: t('Đại La', 'Đại La'),
    summary: t(
      'Nhân nhà Đường suy yếu, Khúc Thừa Dụ tự xưng Tiết độ sứ, mở ra thời tự chủ. Dương Đình Nghệ đánh lui Nam Hán (931).',
      'As the Tang collapsed, Khúc Thừa Dụ seized the governorship, opening an era of self-rule. Dương Đình Nghệ repelled the Southern Han in 931.',
    ),
  },
  {
    id: 'ngo', polity: 'ngo', start: 939, end: 965,
    name: t('Nhà Ngô', 'Ngô dynasty'), founder: t('Ngô Quyền', 'Ngô Quyền'), capital: t('Cổ Loa', 'Cổ Loa'),
    summary: t(
      'Sau chiến thắng Bạch Đằng 938, Ngô Quyền xưng vương, đóng đô ở Cổ Loa — chấm dứt hơn nghìn năm Bắc thuộc.',
      'After the victory on the Bạch Đằng river in 938, Ngô Quyền became king at Cổ Loa, ending a millennium of Chinese rule.',
    ),
    rulers: ['Ngô Quyền', 'Dương Tam Kha', 'Ngô Xương Văn'],
  },
  {
    id: 'suquan', polity: 'suquan', start: 966, end: 967,
    name: t('Loạn 12 sứ quân', 'Anarchy of the 12 Warlords'), summary: t('Đất nước chia cắt giữa các sứ quân cát cứ.', 'The country fractured among rival warlords.'),
  },
  {
    id: 'dinh', polity: 'dinh', start: 968, end: 979,
    name: t('Nhà Đinh', 'Đinh dynasty'), title: t('Đại Cồ Việt', 'Đại Cồ Việt'), founder: t('Đinh Tiên Hoàng (Đinh Bộ Lĩnh)', 'Đinh Bộ Lĩnh'), capital: t('Hoa Lư (Ninh Bình)', 'Hoa Lư'),
    summary: t('Đinh Bộ Lĩnh dẹp loạn 12 sứ quân, lên ngôi Hoàng đế, đặt quốc hiệu Đại Cồ Việt, niên hiệu Thái Bình.', 'Đinh Bộ Lĩnh unified the warlords, became emperor and named the country Đại Cồ Việt.'),
  },
  {
    id: 'tienle', polity: 'tienle', start: 980, end: 1008,
    name: t('Nhà Tiền Lê', 'Early Lê dynasty'), title: t('Đại Cồ Việt', 'Đại Cồ Việt'), founder: t('Lê Đại Hành (Lê Hoàn)', 'Lê Hoàn'), capital: t('Hoa Lư', 'Hoa Lư'),
    summary: t('Lê Hoàn phá quân Tống (981) và tấn công Chiêm Thành (982), củng cố nền độc lập.', 'Lê Hoàn defeated the Song (981) and sacked the Cham capital (982).'),
  },
  {
    id: 'ly', polity: 'ly', start: 1009, end: 1224,
    name: t('Nhà Lý', 'Lý dynasty'), title: t('Đại Cồ Việt → Đại Việt (1054)', 'Đại Việt (from 1054)'), founder: t('Lý Thái Tổ (Lý Công Uẩn)', 'Lý Thái Tổ'), capital: t('Thăng Long', 'Thăng Long'),
    summary: t(
      'Dời đô ra Thăng Long (1010), dựng Văn Miếu (1070), mở khoa thi đầu tiên (1075). Lý Thường Kiệt phá Tống trên sông Như Nguyệt (1077). Mở cõi đến Quảng Trị (1069).',
      'Moved the capital to Thăng Long (1010), built the Temple of Literature (1070), held the first exams (1075). Lý Thường Kiệt defeated the Song at Như Nguyệt (1077). Expanded to Quảng Trị (1069).',
    ),
    rulers: ['Lý Thái Tổ', 'Lý Thái Tông', 'Lý Thánh Tông', 'Lý Nhân Tông', 'Lý Thần Tông', 'Lý Anh Tông', 'Lý Cao Tông', 'Lý Huệ Tông', 'Lý Chiêu Hoàng'],
  },
  {
    id: 'tran', polity: 'tran', start: 1225, end: 1399,
    name: t('Nhà Trần', 'Trần dynasty'), title: t('Đại Việt', 'Đại Việt'), founder: t('Trần Thái Tông', 'Trần Thái Tông'), capital: t('Thăng Long', 'Thăng Long'),
    summary: t(
      'Ba lần đánh bại quân Nguyên – Mông (1258, 1285, 1288) với Trần Hưng Đạo. Thiền phái Trúc Lâm, chữ Nôm phát triển. Nhận châu Ô, châu Lý (1306).',
      'Defeated the Mongol–Yuan three times (1258, 1285, 1288) under Trần Hưng Đạo. Trúc Lâm Zen and Nôm script flourished. Gained Ô and Lý (1306).',
    ),
    rulers: ['Trần Thái Tông', 'Trần Thánh Tông', 'Trần Nhân Tông', 'Trần Anh Tông', 'Trần Minh Tông', 'Trần Hiến Tông', 'Trần Dụ Tông', 'Trần Nghệ Tông', 'Trần Duệ Tông', 'Trần Phế Đế', 'Trần Thuận Tông', 'Trần Thiếu Đế'],
  },
  {
    id: 'ho', polity: 'ho', start: 1400, end: 1406,
    name: t('Nhà Hồ', 'Hồ dynasty'), title: t('Đại Ngu', 'Đại Ngu'), founder: t('Hồ Quý Ly', 'Hồ Quý Ly'), capital: t('Tây Đô (Thanh Hoá)', 'Tây Đô (Thanh Hóa)'),
    summary: t('Hồ Quý Ly cải cách tiền giấy, hạn điền, xây thành Tây Đô. Nhận đất Chiêm Động, Cổ Lũy (1402). Thất bại trước quân Minh 1407.', 'Hồ Quý Ly introduced paper money and land reform, built the stone citadel of Tây Đô; fell to the Ming in 1407.'),
  },
  {
    id: 'minh', polity: 'minh', start: 1407, end: 1427,
    name: t('Minh thuộc', 'Ming occupation'), capital: t('Đông Quan', 'Đông Quan'),
    summary: t('Nhà Minh lập quận Giao Chỉ. Nhà Hậu Trần kháng chiến (1407–1414); khởi nghĩa Lam Sơn của Lê Lợi bùng nổ năm 1418.', 'Ming made Đại Việt the province of Jiaozhi. Later Trần resistance (1407–14) and Lê Lợi’s Lam Sơn uprising from 1418.'),
  },
  {
    id: 'leso', polity: 'leso', start: 1428, end: 1526,
    name: t('Nhà Hậu Lê (Lê sơ)', 'Later Lê (early)'), title: t('Đại Việt', 'Đại Việt'), founder: t('Lê Thái Tổ (Lê Lợi)', 'Lê Lợi'), capital: t('Đông Kinh (Thăng Long)', 'Đông Kinh (Thăng Long)'),
    summary: t(
      'Bình Ngô đại cáo (1428). Lê Thánh Tông ban Luật Hồng Đức, vẽ bản đồ Hồng Đức, đánh chiếm Vijaya (1471), mở cõi đến đèo Cù Mông.',
      'Proclamation of Victory over the Ming (1428). Lê Thánh Tông issued the Hồng Đức code, mapped the realm and took Vijaya (1471).',
    ),
    rulers: ['Lê Thái Tổ', 'Lê Thái Tông', 'Lê Nhân Tông', 'Lê Thánh Tông', 'Lê Hiến Tông', 'Lê Túc Tông', 'Lê Uy Mục', 'Lê Tương Dực', 'Lê Chiêu Tông', 'Lê Cung Hoàng'],
  },
  {
    id: 'mac', polity: 'mac', start: 1527, end: 1592,
    name: t('Nam – Bắc triều (Mạc – Lê)', 'Northern & Southern Courts'), founder: t('Mạc Thái Tổ (Mạc Đăng Dung)', 'Mạc Đăng Dung'), capital: t('Thăng Long · Tây Kinh (Thanh Hoá)', 'Thăng Long · Thanh Hóa'),
    summary: t('Mạc Đăng Dung lập nhà Mạc (1527). Nguyễn Kim phò Lê ở Thanh Hoá (1533) — chiến tranh Nam – Bắc triều kéo dài đến khi Trịnh Tùng chiếm lại Thăng Long (1592). Họ Mạc giữ Cao Bằng đến 1677.', 'Mạc Đăng Dung seized the throne (1527); the Lê were restored in Thanh Hóa (1533). War raged until Trịnh Tùng retook Thăng Long (1592); the Mạc held Cao Bằng until 1677.'),
  },
  {
    id: 'trinhnguyen', polity: 'letrinh', start: 1593, end: 1772,
    name: t('Trịnh – Nguyễn phân tranh', 'Trịnh–Nguyễn division'), founder: t('Lê trung hưng · chúa Trịnh · chúa Nguyễn', 'Restored Lê · Trịnh & Nguyễn lords'), capital: t('Thăng Long · Phú Xuân', 'Thăng Long · Phú Xuân'),
    summary: t(
      'Đất nước chia đôi ở sông Gianh: Đàng Ngoài (chúa Trịnh) – Đàng Trong (chúa Nguyễn), bảy lần giao tranh (1627–1672). Chúa Nguyễn mở cõi đến tận Hà Tiên và Cà Mau (1757). Hội An, Phố Hiến buôn bán với phương Tây.',
      'The realm split at the Gianh river between the Trịnh (north) and Nguyễn (south) lords, who fought seven wars (1627–72). The Nguyễn pushed south to Hà Tiên and Cà Mau (1757). Hội An and Phố Hiến traded with Europe.',
    ),
  },
  {
    id: 'tayson', polity: 'tayson', start: 1773, end: 1801,
    name: t('Nhà Tây Sơn', 'Tây Sơn dynasty'), founder: t('Nguyễn Nhạc · Nguyễn Huệ (Quang Trung) · Nguyễn Lữ', 'Nguyễn Nhạc, Nguyễn Huệ (Quang Trung), Nguyễn Lữ'), capital: t('Quy Nhơn · Phú Xuân', 'Quy Nhơn · Phú Xuân'),
    summary: t(
      'Khởi nghĩa Tây Sơn (1771) lật đổ chúa Nguyễn, chúa Trịnh; Nguyễn Huệ phá quân Xiêm ở Rạch Gầm – Xoài Mút (1785), đại phá 29 vạn quân Thanh (Tết Kỷ Dậu 1789). Nguyễn Ánh từ Gia Định phản công, thống nhất năm 1802.',
      'The Tây Sơn rising (1771) toppled both lords; Nguyễn Huệ crushed Siam at Rạch Gầm (1785) and the Qing at Đống Đa (1789). Nguyễn Ánh struck back from Gia Định and reunified the country in 1802.',
    ),
  },
  {
    id: 'nguyen', polity: 'nguyen', start: 1802, end: 1883,
    name: t('Nhà Nguyễn (độc lập)', 'Nguyễn dynasty (independent)'), title: t('Việt Nam (1804) → Đại Nam (1839)', 'Việt Nam (1804) → Đại Nam (1839)'), founder: t('Gia Long (Nguyễn Ánh)', 'Gia Long'), capital: t('Phú Xuân (Huế)', 'Huế'),
    summary: t(
      'Lãnh thổ trải dài từ Ải Nam Quan đến Mũi Cà Mau, quốc hiệu Việt Nam (1804) rồi Đại Nam (1839). Minh Mạng cải cách hành chính, lập 31 tỉnh. Pháp nổ súng ở Đà Nẵng (1858), chiếm Nam Kỳ (1862–1867).',
      'The first state to span from the Chinese border to Cà Mau, named Việt Nam (1804) then Đại Nam (1839). Minh Mạng created 31 provinces. France attacked Đà Nẵng (1858) and took Cochinchina (1862–67).',
    ),
    rulers: ['Gia Long', 'Minh Mạng', 'Thiệu Trị', 'Tự Đức', 'Dục Đức', 'Hiệp Hòa', 'Kiến Phúc'],
  },
  {
    id: 'phap', polity: 'annam', start: 1884, end: 1944,
    name: t('Pháp thuộc', 'French colonial era'), title: t('Liên bang Đông Dương', 'French Indochina'), capital: t('Huế (triều Nguyễn) · Hà Nội (Toàn quyền)', 'Huế (court) · Hanoi (Governor-General)'),
    summary: t(
      'Hoà ước Giáp Thân (1884) đặt Bắc Kỳ, Trung Kỳ dưới chế độ bảo hộ, Nam Kỳ là thuộc địa. Phong trào Cần Vương, Đông Du, Duy Tân; Đảng Cộng sản Việt Nam ra đời (1930).',
      'The Patenôtre treaty (1884) made Tonkin and Annam protectorates beside the colony of Cochinchina. Resistance from Cần Vương to the founding of the Communist Party (1930).',
    ),
    rulers: ['Hàm Nghi', 'Đồng Khánh', 'Thành Thái', 'Duy Tân', 'Khải Định', 'Bảo Đại'],
  },
  {
    id: 'vndcch', polity: 'vndcch', start: 1945, end: 1953,
    name: t('Việt Nam Dân chủ Cộng hoà · kháng chiến chống Pháp', 'DR Vietnam · war against France'), founder: t('Hồ Chí Minh', 'Hồ Chí Minh'), capital: t('Hà Nội · ATK Việt Bắc', 'Hanoi · Việt Bắc base'),
    summary: t('Cách mạng tháng Tám, Tuyên ngôn độc lập 2/9/1945. Toàn quốc kháng chiến (1946) đến chiến thắng Điện Biên Phủ (1954).', 'August Revolution and declaration of independence (2 Sep 1945); nationwide resistance from 1946 to Điện Biên Phủ (1954).'),
  },
  {
    id: 'chiacat', polity: 'vnch', start: 1954, end: 1975,
    name: t('Hai miền Nam – Bắc', 'Divided Vietnam'), capital: t('Hà Nội · Sài Gòn', 'Hanoi · Saigon'),
    summary: t('Hiệp định Genève chia đôi đất nước ở vĩ tuyến 17 (sông Bến Hải). Chiến tranh Việt Nam kết thúc ngày 30/4/1975.', 'The Geneva Accords divided the country at the 17th parallel (Bến Hải river). The Vietnam War ended on 30 April 1975.'),
  },
  {
    id: 'chxhcn', polity: 'chxhcn', start: 1976, end: 2026,
    name: t('CHXHCN Việt Nam', 'Socialist Republic of Vietnam'), capital: t('Hà Nội', 'Hanoi'),
    summary: t('Thống nhất đất nước (1976). Đổi Mới (1986), gia nhập ASEAN (1995), WTO (2007). Năm 2025 sắp xếp lại còn 34 tỉnh, thành phố.', 'Reunified in 1976. Đổi Mới reforms (1986), ASEAN (1995), WTO (2007). In 2025 the provinces were merged into 34.'),
  },
]

export const periodAt = (y: number) => PERIODS.find((p) => y >= p.start && y <= p.end) ?? PERIODS[0]
