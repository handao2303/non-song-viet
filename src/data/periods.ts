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
    tt: { vol: 'NK1', note: t('Kỷ Hồng Bàng: Kinh Dương Vương lập nước năm Nhâm Tuất (2879 TCN); Hùng Vương đóng đô ở Phong Châu, đặt quốc hiệu Văn Lang, chia 15 bộ.', 'Hồng Bàng annals: Kinh Dương Vương founded the realm in 2879 BCE; the Hùng kings ruled Văn Lang from Phong Châu.') },
  },
  {
    id: 'aulac', polity: 'aulac', start: -257, end: -208,
    name: t('Âu Lạc', 'Âu Lạc'), title: t('Âu Lạc', 'Âu Lạc'), founder: t('An Dương Vương (Thục Phán)', 'An Dương Vương (Thục Phán)'),
    capital: t('Cổ Loa (Đông Anh, Hà Nội)', 'Cổ Loa (Hà Nội)'),
    summary: t(
      'Thục Phán hợp nhất Âu Việt và Lạc Việt, xây thành Cổ Loa hình xoáy ốc — toà thành cổ lớn nhất Đông Nam Á. Truyền thuyết nỏ thần Kim Quy và Mỵ Châu – Trọng Thuỷ.',
      'Thục Phán united the Âu Việt and Lạc Việt and built the spiral citadel of Cổ Loa — the largest ancient fortress in Southeast Asia. Home of the legend of the magic crossbow.',
    ),
    tt: { vol: 'NK1', note: t('“Thục kỷ”: An Dương Vương, khởi Giáp Thìn (257 TCN), chung Quý Tỵ (208 TCN), cộng 50 năm.', 'Thục annals: An Dương Vương, 257–208 BCE, 50 years.') },
  },
  {
    id: 'trieu', polity: 'nanyue', start: -207, end: -111,
    name: t('Nhà Triệu', 'Triệu dynasty'), title: t('Nam Việt', 'Nam Việt'), founder: t('Triệu Vũ Đế (Triệu Đà)', 'Triệu Vũ Đế (Zhao Tuo)'),
    capital: t('Phiên Ngung', 'Panyu'),
    summary: t(
      'Triệu Đà gộp Âu Lạc với Quế Lâm, Nam Hải lập nước Nam Việt, xưng đế ngang hàng với nhà Hán. Truyền 5 đời đến khi nhà Hán diệt (111 TCN). Từ Ngô Thì Sĩ (Việt sử tiêu án) trở đi, nhiều sử gia không coi nhà Triệu là chính thống mà xếp vào thời Bắc thuộc.',
      'Zhao Tuo merged Âu Lạc with Guilin and Nanhai into Nam Việt and styled himself emperor, rivalling the Han. Five rulers until the Han conquest of 111 BCE. From Ngô Thì Sĩ onward many historians reject this dynasty as legitimate and count it as Chinese rule.',
    ),
    rulers: ['Triệu Vũ Đế', 'Triệu Văn Vương', 'Triệu Minh Vương', 'Triệu Ai Vương', 'Triệu Thuật Dương Vương'],
    tt: { vol: 'NK2', note: t('“Triệu kỷ”: Toàn thư xếp vào chính thống — khởi Giáp Ngọ (207 TCN), chung Canh Ngọ (111 TCN), 5 đời, 97 năm.', 'The Toàn thư counts the Triệu as legitimate: 207–111 BCE, five reigns, 97 years.') },
  },
  {
    id: 'bt1', polity: 'chinese', start: -110, end: 39,
    name: t('Bắc thuộc lần I', 'First Chinese domination'), founder: t('nhà Hán', 'Han'),
    capital: t('Luy Lâu (Thuận Thành, Bắc Ninh)', 'Luy Lâu (Bắc Ninh)'),
    summary: t(
      'Năm 111 TCN nhà Hán diệt nhà Triệu, chia đất Việt thành các quận Giao Chỉ, Cửu Chân, Nhật Nam, trị sở ở Luy Lâu.',
      'In 111 BCE the Han destroyed the Triệu and split the land into Jiaozhi, Jiuzhen and Rinan commanderies, governed from Luy Lâu.',
    ),
    tt: { vol: 'NK3', note: t('“Thuộc Tây Hán kỷ” – “Thuộc Đông Hán kỷ”.', 'Annals of the Western and Eastern Han periods.') },
  },
  {
    id: 'trung', polity: 'trung', start: 40, end: 42,
    name: t('Trưng Vương', 'Trưng Sisters'), founder: t('Trưng Trắc, Trưng Nhị', 'Trưng Trắc & Trưng Nhị'),
    capital: t('Mê Linh', 'Mê Linh'),
    summary: t(
      'Hai Bà Trưng khởi nghĩa ở Hát Môn, chiếm 65 thành trì, xưng vương đóng đô ở Mê Linh. Năm 43, Mã Viện đem quân Hán đàn áp, Hai Bà tuẫn tiết trên sông Hát.',
      'The Trưng sisters rose at Hát Môn, took 65 citadels and ruled from Mê Linh. In 43 CE Han general Ma Yuan crushed the revolt.',
    ),
    tt: { vol: 'NK3', note: t('“Trưng Nữ Vương kỷ”: khởi Canh Tý (40), chung Nhâm Dần (42), cộng 3 năm.', 'Trưng Queens: 40–42, three years.') },
  },
  {
    id: 'bt2', polity: 'chinese', start: 43, end: 540,
    name: t('Bắc thuộc lần II', 'Second Chinese domination'), founder: t('Đông Hán → Ngô → Tấn → Nam triều', 'Han → Wu → Jin → Southern dynasties'),
    capital: t('Luy Lâu → Long Biên', 'Luy Lâu → Long Biên'),
    summary: t(
      'Năm thế kỷ đô hộ xen kẽ các cuộc khởi nghĩa (Bà Triệu 248). Toàn thư dành riêng “Sĩ Vương kỷ” cho Sĩ Nhiếp (187–226), người mở mang Nho học. Phía nam, nước Lâm Ấp — tiền thân Chăm Pa — hình thành; ở châu thổ Mê Kông, Phù Nam hưng thịnh với cảng Óc Eo.',
      'Five centuries of rule punctuated by revolts (Lady Triệu, 248). The Toàn thư gives a separate chapter to governor Sĩ Nhiếp (187–226). To the south Lâm Ấp, forerunner of Champa, arose; Funan flourished in the Mekong delta.',
    ),
    tt: { vol: 'NK3', note: t('Sĩ Vương kỷ: Đinh Mão → Bính Ngọ (187–226). Thuộc Ngô, Tấn, Tống, Tề, Lương: Đinh Mùi → Canh Thân (227–540).', 'Sĩ Vương 187–226; then Wu, Jin, Song, Qi, Liang rule 227–540.') },
  },
  {
    id: 'vanxuan', polity: 'vanxuan', start: 541, end: 602,
    name: t('Nhà Tiền Lý · Vạn Xuân', 'Early Lý · Vạn Xuân'), title: t('Vạn Xuân', 'Vạn Xuân'), founder: t('Lý Nam Đế (Lý Bí)', 'Lý Nam Đế (Lý Bí)'),
    capital: t('Long Biên', 'Long Biên'),
    summary: t(
      'Lý Bí đánh đuổi quân Lương, xưng Nam Việt Đế, đặt quốc hiệu Vạn Xuân. Triệu Quang Phục kháng chiến ở đầm Dạ Trạch; năm 602 nhà Tùy chiếm lại.',
      'Lý Bí expelled the Liang, proclaimed himself emperor of Vạn Xuân. Triệu Quang Phục fought on from Dạ Trạch marsh until the Sui reconquest in 602.',
    ),
    rulers: ['Lý Nam Đế (541–547)', 'Triệu Việt Vương (548–570)', 'Hậu Lý Nam Đế (571–602)'],
    tt: { vol: 'NK4', note: t('Tiền Nam Đế (Tân Dậu–Đinh Mão), Triệu Việt Vương (Mậu Thìn–Canh Dần), Hậu Nam Đế (Tân Mão–Nhâm Tuất): cộng 62 năm.', 'Lý Nam Đế 541–547, Triệu Việt Vương 548–570, Hậu Lý Nam Đế 571–602: 62 years.') },
  },
  {
    id: 'bt3', polity: 'chinese', start: 603, end: 906,
    name: t('Bắc thuộc lần III', 'Third Chinese domination'), founder: t('Tùy → Đường', 'Sui → Tang'),
    capital: t('Tống Bình → Đại La', 'Songping → Đại La'),
    summary: t(
      'Nhà Đường lập An Nam đô hộ phủ (679). Khởi nghĩa Mai Thúc Loan (722), Phùng Hưng (791). Cao Biền xây thành Đại La (866) — nền móng Thăng Long sau này.',
      'The Tang created the Protectorate of Annam (679). Revolts of Mai Thúc Loan (722) and Phùng Hưng (791). Gao Pian built Đại La (866), the foundation of later Thăng Long.',
    ),
    tt: { vol: 'NK5', note: t('“Thuộc Tuỳ Đường kỷ”, bắt đầu năm Quý Hợi (603).', 'Sui–Tang annals from 603.') },
  },
  {
    id: 'tuchu', polity: 'tuchu', start: 907, end: 938,
    name: t('Thời tự chủ (Khúc – Dương)', 'Autonomy (Khúc & Dương)'), founder: t('Khúc Hạo', 'Khúc Hạo'),
    capital: t('Đại La', 'Đại La'),
    summary: t(
      'Nhân nhà Đường sụp đổ, Khúc Hạo giữ châu trị, xưng Tiết độ sứ; con là Khúc Thừa Mỹ nối nghiệp. Dương Đình Nghệ đánh lui Nam Hán (931).',
      'As the Tang collapsed, Khúc Hạo held the provincial seat as governor, succeeded by Khúc Thừa Mỹ. Dương Đình Nghệ repelled the Southern Han in 931.',
    ),
    tt: { vol: 'NK5', note: t('Toàn thư không chép Khúc Thừa Dụ (Cương mục chép năm 906); chỉ ghi Khúc Hạo, Khúc Thừa Mỹ.', 'The Toàn thư names only Khúc Hạo and Khúc Thừa Mỹ; Khúc Thừa Dụ appears in the later Cương mục (906).') },
  },
  {
    id: 'ngo', polity: 'ngo', start: 939, end: 967,
    name: t('Nhà Ngô', 'Ngô dynasty'), founder: t('Ngô Quyền', 'Ngô Quyền'), capital: t('Cổ Loa', 'Cổ Loa'),
    summary: t(
      'Sau chiến thắng Bạch Đằng 938, Ngô Quyền xưng vương, đóng đô ở Cổ Loa — chấm dứt hơn nghìn năm Bắc thuộc.',
      'After the victory on the Bạch Đằng river in 938, Ngô Quyền became king at Cổ Loa, ending a millennium of Chinese rule.',
    ),
    rulers: ['Ngô Quyền', 'Dương Tam Kha', 'Ngô Xương Văn', 'Ngô Xương Xí'],
    tt: { vol: 'NK5', note: t('“Ngô sứ quân kỷ”: ba vua Ngô và Dương Tam Kha, khởi Kỷ Hợi (939), chung Đinh Mão (967) — gồm cả thời 12 sứ quân.', 'Ngô annals 939–967, including the Twelve Warlords.') },
  },
  {
    id: 'dinh', polity: 'dinh', start: 968, end: 980,
    name: t('Nhà Đinh', 'Đinh dynasty'), title: t('Đại Cồ Việt', 'Đại Cồ Việt'), founder: t('Đinh Tiên Hoàng (Đinh Bộ Lĩnh)', 'Đinh Bộ Lĩnh'), capital: t('Hoa Lư (Ninh Bình)', 'Hoa Lư'),
    summary: t('Đinh Bộ Lĩnh dẹp loạn 12 sứ quân, lên ngôi Hoàng đế, đặt quốc hiệu Đại Cồ Việt, niên hiệu Thái Bình.', 'Đinh Bộ Lĩnh unified the warlords, became emperor and named the country Đại Cồ Việt.'),
    rulers: ['Đinh Tiên Hoàng', 'Đinh Phế Đế'],
    tt: { vol: 'BK1', note: t('“Đinh kỷ”: hai vua, khởi Mậu Thìn (968), chung Canh Thìn (980).', 'Đinh annals: two rulers, 968–980.') },
  },
  {
    id: 'tienle', polity: 'tienle', start: 981, end: 1009,
    name: t('Nhà Tiền Lê', 'Early Lê dynasty'), title: t('Đại Cồ Việt', 'Đại Cồ Việt'), founder: t('Lê Đại Hành (Lê Hoàn)', 'Lê Hoàn'), capital: t('Hoa Lư', 'Hoa Lư'),
    summary: t('Lê Hoàn phá quân Tống (981) và tấn công Chiêm Thành (982), củng cố nền độc lập.', 'Lê Hoàn defeated the Song (981) and sacked the Cham capital (982).'),
    rulers: ['Lê Đại Hành', 'Lê Trung Tông', 'Lê Ngoạ Triều'],
    tt: { vol: 'BK1', note: t('“Lê kỷ”: ba vua, khởi Tân Tỵ (981), chung Kỷ Dậu (1009).', 'Early Lê annals: three rulers, 981–1009.') },
  },
  {
    id: 'ly', polity: 'ly', start: 1010, end: 1225,
    name: t('Nhà Lý', 'Lý dynasty'), title: t('Đại Cồ Việt → Đại Việt (1054)', 'Đại Việt (from 1054)'), founder: t('Lý Thái Tổ (Lý Công Uẩn)', 'Lý Thái Tổ'), capital: t('Thăng Long', 'Thăng Long'),
    summary: t(
      'Dời đô ra Thăng Long (1010), dựng Văn Miếu (1070), mở khoa thi đầu tiên (1075). Lý Thường Kiệt phá Tống trên sông Như Nguyệt (1076). Mở cõi đến Quảng Trị (1069).',
      'Moved the capital to Thăng Long (1010), built the Temple of Literature (1070), held the first exams (1075). Lý Thường Kiệt defeated the Song at Như Nguyệt (1076). Expanded to Quảng Trị (1069).',
    ),
    rulers: ['Lý Thái Tổ', 'Lý Thái Tông', 'Lý Thánh Tông', 'Lý Nhân Tông', 'Lý Thần Tông', 'Lý Anh Tông', 'Lý Cao Tông', 'Lý Huệ Tông', 'Lý Chiêu Hoàng'],
    tt: { vol: 'BK2', note: t('“Lý kỷ” (Bản kỷ quyển 2–4): khởi Canh Tuất năm Thuận Thiên thứ nhất (1010), chung Ất Dậu (1225).', 'Lý annals, 1010–1225.') },
  },
  {
    id: 'tran', polity: 'tran', start: 1226, end: 1399,
    name: t('Nhà Trần', 'Trần dynasty'), title: t('Đại Việt', 'Đại Việt'), founder: t('Trần Thái Tông', 'Trần Thái Tông'), capital: t('Thăng Long', 'Thăng Long'),
    summary: t(
      'Ba lần đánh bại quân Nguyên – Mông (1258, 1285, 1288) với Trần Hưng Đạo. Thiền phái Trúc Lâm, chữ Nôm phát triển. Nhận châu Ô, châu Lý (1306).',
      'Defeated the Mongol–Yuan three times (1258, 1285, 1288) under Trần Hưng Đạo. Trúc Lâm Zen and Nôm script flourished. Gained Ô and Lý (1306).',
    ),
    rulers: ['Trần Thái Tông', 'Trần Thánh Tông', 'Trần Nhân Tông', 'Trần Anh Tông', 'Trần Minh Tông', 'Trần Hiến Tông', 'Trần Dụ Tông', 'Trần Nghệ Tông', 'Trần Duệ Tông', 'Trần Phế Đế', 'Trần Thuận Tông', 'Trần Thiếu Đế'],
    tt: { vol: 'BK5', note: t('“Trần kỷ” (Bản kỷ quyển 5–8), tính từ Bính Tuất năm Kiến Trung thứ 2 (1226).', 'Trần annals from 1226.') },
  },
  {
    id: 'ho', polity: 'ho', start: 1400, end: 1406,
    name: t('Nhà Hồ', 'Hồ dynasty'), title: t('Đại Ngu', 'Đại Ngu'), founder: t('Hồ Quý Ly', 'Hồ Quý Ly'), capital: t('Tây Đô (Thanh Hoá)', 'Tây Đô (Thanh Hóa)'),
    summary: t('Hồ Quý Ly cải cách tiền giấy, hạn điền, xây thành Tây Đô. Nhận đất Chiêm Động, Cổ Lũy (1402). Thất bại trước quân Minh 1407.', 'Hồ Quý Ly introduced paper money and land reform, built the stone citadel of Tây Đô; fell to the Ming in 1407.'),
    tt: { vol: 'BK8', note: t('Toàn thư không lập kỷ riêng cho nhà Hồ — chỉ “phụ” vào cuối Trần kỷ, coi là tiếm ngôi.', 'The Toàn thư gives the Hồ no annals of their own, appending them to the Trần as usurpers.') },
  },
  {
    id: 'hautran', polity: 'hautran', start: 1407, end: 1413,
    name: t('Nhà Hậu Trần', 'Later Trần dynasty'), founder: t('Giản Định Đế (Trần Ngỗi)', 'Giản Định Đế'), capital: t('Nghệ An (hành tại)', 'Nghệ An (mobile court)'),
    summary: t('Quân Minh chiếm Đông Đô, lập quận Giao Chỉ. Giản Định Đế rồi Trùng Quang Đế (Trần Quý Khoáng) cùng Đặng Dung, Nguyễn Cảnh Dị kháng chiến ở Thanh – Nghệ – Thuận Hoá, thắng lớn ở Bô Cô (1408).', 'The Ming took the capital. Giản Định and then Trùng Quang (Trần Quý Khoáng), with Đặng Dung and Nguyễn Cảnh Dị, fought on from Thanh Hóa to Thuận Hóa, winning at Bô Cô (1408).'),
    rulers: ['Giản Định Đế', 'Trùng Quang Đế'],
    tt: { vol: 'BK9', note: t('“Hậu Trần kỷ”: Toàn thư coi là chính thống, Giản Định (Đinh Hợi 1407) và Trùng Quang (Kỷ Sửu 1409 – 1413).', 'The Toàn thư treats the Later Trần as legitimate, 1407–1413.') },
  },
  {
    id: 'minh', polity: 'minh', start: 1414, end: 1427,
    name: t('Thuộc Minh · Khởi nghĩa Lam Sơn', 'Ming rule · Lam Sơn uprising'), capital: t('Đông Quan', 'Đông Quan'),
    summary: t('Nhà Minh cai trị hà khắc. Năm 1418 Lê Lợi dựng cờ ở Lam Sơn; mười năm kháng chiến kết thúc bằng chiến thắng Chi Lăng – Xương Giang (1427).', 'Harsh Ming rule. Lê Lợi raised his banner at Lam Sơn in 1418; ten years of war ended at Chi Lăng – Xương Giang (1427).'),
    tt: { vol: 'BK10', note: t('“Thuộc Minh kỷ” (1414–1417); Lê kỷ được tính từ năm khởi nghĩa Mậu Tuất (1418).', 'Ming rule 1414–1417; the Lê annals begin with the 1418 uprising.') },
  },
  {
    id: 'leso', polity: 'leso', start: 1428, end: 1526,
    name: t('Nhà Hậu Lê (Lê sơ)', 'Later Lê (early)'), title: t('Đại Việt', 'Đại Việt'), founder: t('Lê Thái Tổ (Lê Lợi)', 'Lê Lợi'), capital: t('Đông Kinh (Thăng Long)', 'Đông Kinh (Thăng Long)'),
    summary: t(
      'Bình Ngô đại cáo (1428). Lê Thánh Tông ban Luật Hồng Đức, vẽ bản đồ Hồng Đức, đánh chiếm Vijaya (1471), mở cõi đến đèo Cù Mông.',
      'Proclamation of Victory over the Ming (1428). Lê Thánh Tông issued the Hồng Đức code, mapped the realm and took Vijaya (1471).',
    ),
    rulers: ['Lê Thái Tổ', 'Lê Thái Tông', 'Lê Nhân Tông', 'Lê Thánh Tông', 'Lê Hiến Tông', 'Lê Túc Tông', 'Lê Uy Mục', 'Lê Tương Dực', 'Lê Chiêu Tông', 'Lê Cung Hoàng'],
    tt: { vol: 'BK10', note: t('“Lê Hoàng triều kỷ” (Bản kỷ quyển 10–15).', 'Lê imperial annals (Basic Annals 10–15).') },
  },
  {
    id: 'mac', polity: 'mac', start: 1527, end: 1592,
    tt: { vol: 'BK16', note: t('Toàn thư đứng về phía nhà Lê, coi nhà Mạc là tiếm nghịch; Lê Trang Tông lên ngôi ở Ai Lao năm Quý Tỵ (1533), lấy lại Tây Đô năm 1543.', 'Written from the Lê side, treating the Mạc as usurpers; the Lê were restored in 1533 and retook Tây Đô in 1543.') },
    name: t('Nam – Bắc triều (Mạc – Lê)', 'Northern & Southern Courts'), founder: t('Mạc Thái Tổ (Mạc Đăng Dung)', 'Mạc Đăng Dung'), capital: t('Thăng Long · Tây Kinh (Thanh Hoá)', 'Thăng Long · Thanh Hóa'),
    summary: t('Mạc Đăng Dung lập nhà Mạc (1527). Nguyễn Kim phò Lê ở Thanh Hoá (1533) — chiến tranh Nam – Bắc triều kéo dài đến khi Trịnh Tùng chiếm lại Thăng Long (1592). Họ Mạc giữ Cao Bằng đến 1677.', 'Mạc Đăng Dung seized the throne (1527); the Lê were restored in Thanh Hóa (1533). War raged until Trịnh Tùng retook Thăng Long (1592); the Mạc held Cao Bằng until 1677.'),
  },
  {
    id: 'trinhnguyen', polity: 'letrinh', start: 1593, end: 1772,
    tt: { vol: 'BK18', note: t('Năm Canh Tý (1600) Nguyễn Hoàng “lặng lẽ về Thuận Hoá”; Toàn thư chép việc Đàng Ngoài, rất ít việc Đàng Trong.', 'In 1600 Nguyễn Hoàng slipped back south; the Toàn thư records the north and says little of the south.') },
    name: t('Trịnh – Nguyễn phân tranh', 'Trịnh–Nguyễn division'), founder: t('Lê trung hưng · chúa Trịnh · chúa Nguyễn', 'Restored Lê · Trịnh & Nguyễn lords'), capital: t('Thăng Long · Phú Xuân', 'Thăng Long · Phú Xuân'),
    summary: t(
      'Đất nước chia đôi ở sông Gianh: Đàng Ngoài (chúa Trịnh) – Đàng Trong (chúa Nguyễn), bảy lần giao tranh (1627–1672). Chúa Nguyễn mở cõi đến tận Hà Tiên và Cà Mau (1757). Hội An, Phố Hiến buôn bán với phương Tây.',
      'The realm split at the Gianh river between the Trịnh (north) and Nguyễn (south) lords, who fought seven wars (1627–72). The Nguyễn pushed south to Hà Tiên and Cà Mau (1757). Hội An and Phố Hiến traded with Europe.',
    ),
  },
  {
    id: 'tayson', polity: 'tayson', start: 1773, end: 1801,
    tt: { vol: 'TB5', note: t('Tục biên chép đến năm Kỷ Dậu (1789): Nguyễn Huệ lên ngôi ở Phú Xuân (1788), phá quân Thanh (1789). Sau 1789 không còn trong Toàn thư.', 'The Continuation ends in 1789 with Quang Trung’s coronation and his victory over the Qing.') },
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
