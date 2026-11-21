/**
 * "Câu chuyện" phát trên bản đồ: diễn biến trận đánh và hành trình cuộc đời nhân vật.
 * Toạ độ là vị trí gần đúng của địa danh lịch sử; đường mũi tên là sơ đồ hướng tiến quân,
 * không phải lộ trình khảo sát chính xác.
 * Niên đại trước 1789 theo Đại Việt sử ký toàn thư (ngày âm lịch quy đổi theo các nghiên cứu phổ biến).
 */
import type { T } from './types'

export type LngLat = [number, number]
export type Side = 'vn' | 'foe'

export interface Arrow {
  side: Side
  path: LngLat[]
  /** rút lui → nét đứt */
  retreat?: boolean
  /** thuỷ quân */
  navy?: boolean
  /** phòng tuyến (không có đầu mũi tên) */
  line?: boolean
}

export type MarkIcon = 'win' | 'fall' | 'camp' | 'stake' | 'city' | 'star'

export interface Mark {
  coord: LngLat
  label: T
  icon: MarkIcon
}

export interface Step {
  date: T
  title: T
  text: T
  /** năm hiển thị trên bản đồ khi tới bước này */
  year?: number
  view?: { center: LngLat; zoom: number }
  arrows?: Arrow[]
  marks?: Mark[]
}

export interface Story {
  id: string
  kind: 'battle' | 'life'
  /** sự kiện gắn với câu chuyện */
  event?: string
  title: T
  sub: T
  year: number
  view: { center: LngLat; zoom: number }
  sides?: { vn: T; foe: T }
  /** ảnh đại diện nhân vật: một chữ Hán / ký hiệu */
  glyph?: string
  life?: [number, number]
  steps: Step[]
}

const t = (vi: string, en: string): T => ({ vi, en })
const A = (side: Side, path: LngLat[], o: Partial<Arrow> = {}): Arrow => ({ side, path, ...o })
const M = (coord: LngLat, icon: MarkIcon, vi: string, en: string): Mark => ({ coord, icon, label: { vi, en } })

// Một số đoạn sông / đường dùng lại
const BACH_DANG: LngLat[] = [[106.93, 20.73], [106.86, 20.79], [106.82, 20.86], [106.79, 20.92], [106.74, 20.97], [106.67, 21.02]]
const LANG_SON_ROAD: LngLat[] = [[106.76, 21.96], [106.74, 21.85], [106.6, 21.67], [106.42, 21.47], [106.25, 21.32]]

/* ═══════════════════════ TRẬN ĐÁNH ═══════════════════════ */

const battles: Story[] = [
  {
    id: 'bachdang938',
    kind: 'battle',
    event: 'bachdang938',
    title: t('Chiến thắng Bạch Đằng 938', 'Battle of Bạch Đằng, 938'),
    sub: t('Ngô Quyền phá thuỷ quân Nam Hán', 'Ngô Quyền destroys the Southern Han fleet'),
    year: 938,
    view: { center: [106.4, 20.9], zoom: 8 },
    sides: { vn: t('Quân Ngô Quyền', 'Ngô Quyền'), foe: t('Nam Hán (Lưu Hoằng Tháo)', 'Southern Han (Liu Hongcao)') },
    steps: [
      {
        date: t('Mùa xuân 938', 'Spring 938'),
        title: t('Ngô Quyền ra Đại La', 'Ngô Quyền marches on Đại La'),
        text: t('Kiều Công Tiễn giết Dương Đình Nghệ rồi cầu viện Nam Hán. Ngô Quyền, con rể họ Dương, từ Ái Châu (Thanh Hoá) kéo quân ra giết Công Tiễn.', 'Kiều Công Tiễn murdered Dương Đình Nghệ and called in the Southern Han. Ngô Quyền, Dương’s son-in-law, marched from Ái Châu (Thanh Hóa) and killed him.'),
        view: { center: [105.9, 20.5], zoom: 7.2 },
        arrows: [A('vn', [[105.78, 19.8], [105.9, 20.25], [105.92, 20.6], [105.85, 21.02]])],
        marks: [M([105.85, 21.03], 'city', 'Đại La', 'Đại La'), M([105.78, 19.8], 'camp', 'Ái Châu', 'Ái Châu')],
      },
      {
        date: t('Cuối năm 938', 'Late 938'),
        title: t('Thuỷ quân Nam Hán vượt biển', 'The Han fleet sails in'),
        text: t('Vua Nam Hán Lưu Cung sai con là Hoằng Tháo đem thuỷ quân sang, còn mình đóng quân ở Hải Môn làm thanh viện.', 'The Han ruler Liu Yan sent his son Hongcao with the fleet and waited at Haimen in support.'),
        view: { center: [107.3, 21.1], zoom: 7.4 },
        arrows: [A('foe', [[108.9, 21.45], [108.2, 21.3], [107.6, 21.05], [107.1, 20.82], [106.95, 20.74]], { navy: true })],
      },
      {
        date: t('Cuối năm 938', 'Late 938'),
        title: t('Cắm cọc ở cửa sông', 'Stakes in the estuary'),
        text: t('Ngô Quyền cho đóng cọc lớn đầu bịt sắt nhọn ở cửa Bạch Đằng. Nước triều lên thì ngập cọc, không ai nhìn thấy.', 'Ngô Quyền had great iron-tipped stakes driven into the Bạch Đằng mouth, hidden under the high tide.'),
        view: { center: [106.8, 20.88], zoom: 10 },
        arrows: [A('vn', [[105.85, 21.03], [106.2, 21.0], [106.55, 20.98], [106.74, 20.95]])],
        marks: [M([106.83, 20.85], 'stake', 'Bãi cọc', 'Stake field')],
      },
      {
        date: t('Triều lên', 'High tide'),
        title: t('Nhử địch vào trận', 'Luring the fleet in'),
        text: t('Thuyền nhẹ ra khiêu chiến rồi giả thua chạy. Hoằng Tháo đuổi theo, đưa cả đoàn thuyền lớn vượt qua bãi cọc vào sâu trong sông.', 'Light boats challenged the enemy and feigned flight. Hongcao gave chase, taking his warships past the hidden stakes.'),
        view: { center: [106.8, 20.88], zoom: 10.2 },
        arrows: [
          A('foe', BACH_DANG.slice(0, 5), { navy: true }),
          A('vn', [[106.88, 20.77], [106.82, 20.86], [106.77, 20.94]], { navy: true, retreat: true }),
        ],
      },
      {
        date: t('Triều rút', 'Ebb tide'),
        title: t('Phản công — thuyền địch vỡ trên cọc', 'Counter-attack on the stakes'),
        text: t('Nước triều rút, quân Ngô Quyền đổ ra đánh từ hai bờ. Thuyền giặc quay đầu chạy, vướng cọc thủng vỡ. Hoằng Tháo tử trận, Lưu Cung thu quân về nước.', 'As the tide fell, Ngô Quyền’s men struck from both banks. The fleeing ships were holed on the stakes; Hongcao died and Liu Yan withdrew.'),
        view: { center: [106.8, 20.87], zoom: 10.2 },
        arrows: [
          A('vn', [[106.7, 20.84], [106.78, 20.86], [106.82, 20.86]]),
          A('vn', [[106.9, 20.93], [106.85, 20.89], [106.82, 20.87]]),
          A('vn', [[106.76, 20.95], [106.8, 20.9]], { navy: true }),
          A('foe', [[106.79, 20.92], [106.83, 20.85], [106.9, 20.76]], { navy: true, retreat: true }),
        ],
        marks: [M([106.84, 20.84], 'fall', 'Hoằng Tháo tử trận', 'Hongcao killed')],
      },
      {
        date: t('Mùa xuân 939', 'Spring 939'),
        title: t('Ngô Quyền xưng vương', 'Ngô Quyền proclaims himself king'),
        text: t('Ngô Quyền lên ngôi vương, đóng đô ở Cổ Loa — chấm dứt hơn một nghìn năm Bắc thuộc.', 'Ngô Quyền took the throne at Cổ Loa, ending over a thousand years of Chinese rule.'),
        year: 939,
        view: { center: [106.2, 21.0], zoom: 8 },
        marks: [M([105.873, 21.115], 'star', 'Cổ Loa', 'Cổ Loa')],
      },
    ],
  },
  {
    id: 'nhunguyet',
    kind: 'battle',
    event: 'nhunguyet',
    title: t('Phòng tuyến Như Nguyệt', 'The Như Nguyệt line'),
    sub: t('Lý Thường Kiệt đánh Tống 1075–1077', 'Lý Thường Kiệt against the Song, 1075–77'),
    year: 1076,
    view: { center: [107.2, 21.8], zoom: 6.8 },
    sides: { vn: t('Đại Việt (Lý Thường Kiệt)', 'Đại Việt (Lý Thường Kiệt)'), foe: t('Nhà Tống (Quách Quỳ, Triệu Tiết)', 'Song (Guo Kui, Zhao Xie)') },
    steps: [
      {
        date: t('Cuối 1075 – đầu 1076', 'Late 1075 – early 1076'),
        title: t('“Tiên phát chế nhân”', 'Strike first'),
        text: t('Biết Tống chuẩn bị xâm lược, Lý Thường Kiệt đem thuỷ quân đánh Khâm Châu, Liêm Châu; Tông Đản đem bộ binh lên vây Ung Châu. Sau hơn 40 ngày, thành Ung Châu bị hạ, kho tàng hậu cần của Tống bị phá.', 'Knowing the Song were preparing to invade, Lý Thường Kiệt sent a fleet against Qinzhou and Lianzhou while Tông Đản besieged Yongzhou, which fell after some forty days.'),
        year: 1075,
        view: { center: [107.8, 22.2], zoom: 6.8 },
        arrows: [
          A('vn', [[107.97, 21.53], [108.3, 21.75], [108.62, 21.95]], { navy: true }),
          A('vn', [[108.1, 21.5], [108.7, 21.5], [109.2, 21.66]], { navy: true }),
          A('vn', [[106.76, 21.85], [107.2, 22.3], [107.8, 22.65], [108.32, 22.82]]),
        ],
        marks: [M([108.32, 22.82], 'win', 'Ung Châu thất thủ', 'Yongzhou falls'), M([108.62, 21.95], 'win', 'Khâm Châu', 'Qinzhou'), M([109.2, 21.66], 'win', 'Liêm Châu', 'Lianzhou')],
      },
      {
        date: t('Năm 1076', '1076'),
        title: t('Đắp phòng tuyến sông Như Nguyệt', 'Fortifying the Như Nguyệt'),
        text: t('Rút quân về, Lý Thường Kiệt cho đắp luỹ, đóng cọc dọc bờ nam sông Như Nguyệt (sông Cầu) — chặn con đường từ Lạng Sơn xuống Thăng Long.', 'Back home, he built ramparts and palisades along the south bank of the Như Nguyệt (Cầu) river, barring the road from Lạng Sơn to Thăng Long.'),
        year: 1076,
        view: { center: [106.1, 21.25], zoom: 9.2 },
        arrows: [A('vn', [[105.9, 21.31], [105.97, 21.26], [106.04, 21.22], [106.12, 21.19], [106.22, 21.17]], { line: true })],
        marks: [M([106.04, 21.21], 'camp', 'Như Nguyệt', 'Như Nguyệt'), M([105.85, 21.03], 'city', 'Thăng Long', 'Thăng Long')],
      },
      {
        date: t('Cuối 1076', 'Late 1076'),
        title: t('Quân Tống tràn xuống', 'The Song invade'),
        text: t('Quách Quỳ, Triệu Tiết đem đại quân qua ải Quyết Lý, Chi Lăng, tới bờ bắc Như Nguyệt. Thuỷ quân Tống của Dương Tùng Tiên bị Lý Kế Nguyên chặn đánh ngoài biển, không vào được để hợp sức.', 'Guo Kui and Zhao Xie marched through the Quyết Lý and Chi Lăng passes to the north bank. The Song fleet was held off at sea by Lý Kế Nguyên and never joined them.'),
        view: { center: [106.8, 21.55], zoom: 7.4 },
        arrows: [
          A('foe', [[108.3, 22.8], [107.4, 22.4], ...LANG_SON_ROAD.slice(0, 3), [106.3, 21.42], [106.06, 21.27]]),
          A('foe', [[109.1, 21.6], [108.4, 21.35], [107.75, 21.18]], { navy: true }),
          A('vn', [[107.05, 20.88], [107.4, 21.05], [107.7, 21.15]], { navy: true }),
        ],
        marks: [M([107.75, 21.17], 'win', 'Lý Kế Nguyên chặn thuỷ quân', 'Song fleet blocked')],
      },
      {
        date: t('Đầu 1077', 'Early 1077'),
        title: t('Vượt sông bất thành', 'Failed crossings'),
        text: t('Quân Tống nhiều lần bắc cầu phao vượt sông đều bị đánh bật. Tương truyền giữa đêm, từ đền bên sông vang lên bài thơ “Nam quốc sơn hà Nam đế cư…”.', 'Repeated Song attempts to bridge the river were thrown back. Legend says the poem “The southern land is ruled by the southern emperor” rang out from a riverside shrine at night.'),
        view: { center: [106.08, 21.24], zoom: 10 },
        arrows: [
          A('foe', [[106.03, 21.3], [106.04, 21.24]]),
          A('foe', [[106.14, 21.25], [106.14, 21.2]]),
          A('vn', [[106.05, 21.17], [106.04, 21.23], [106.03, 21.29]]),
        ],
        marks: [M([106.04, 21.21], 'win', 'Như Nguyệt', 'Như Nguyệt')],
      },
      {
        date: t('Tháng 3/1077', 'March 1077'),
        title: t('Giảng hoà, Tống rút quân', 'Peace, and the Song withdraw'),
        text: t('Quân Tống chết vì chiến trận và dịch bệnh quá nửa. Lý Thường Kiệt chủ động giảng hoà, Quách Quỳ vội rút về nước.', 'With over half their men lost to battle and disease, the Song accepted Lý Thường Kiệt’s offer of peace and withdrew.'),
        year: 1077,
        view: { center: [106.8, 21.6], zoom: 7.3 },
        arrows: [A('foe', [[106.06, 21.29], [106.3, 21.45], [106.6, 21.67], [106.76, 21.96], [107.3, 22.3]], { retreat: true })],
      },
    ],
  },
  {
    id: 'bachdang1288',
    kind: 'battle',
    event: 'bachdang1288',
    title: t('Bạch Đằng 1288', 'Bạch Đằng, 1288'),
    sub: t('Trần Hưng Đạo đánh tan quân Nguyên lần thứ ba', 'Trần Hưng Đạo crushes the third Mongol invasion'),
    year: 1288,
    view: { center: [106.7, 21.3], zoom: 7.6 },
    sides: { vn: t('Đại Việt (Trần Hưng Đạo)', 'Đại Việt (Trần Hưng Đạo)'), foe: t('Nguyên (Thoát Hoan, Ô Mã Nhi)', 'Yuan (Toghon, Omar)') },
    steps: [
      {
        date: t('Cuối 1287', 'Late 1287'),
        title: t('Quân Nguyên kéo sang', 'The Yuan arrive'),
        text: t('Thoát Hoan đem bộ binh qua Lạng Sơn; Ô Mã Nhi đem thuỷ quân theo đường biển vào sông Bạch Đằng. Hai cánh hội nhau ở Vạn Kiếp.', 'Toghon led the army through Lạng Sơn while Omar brought the fleet up the Bạch Đằng; they met at Vạn Kiếp.'),
        year: 1287,
        view: { center: [106.9, 21.3], zoom: 7.6 },
        arrows: [
          A('foe', [...LANG_SON_ROAD.slice(0, 4), [106.38, 21.12]]),
          A('foe', [[108.3, 21.35], [107.6, 21.1], [107.05, 20.82], ...BACH_DANG.slice(1), [106.5, 21.07], [106.39, 21.1]], { navy: true }),
        ],
        marks: [M([106.38, 21.1], 'camp', 'Vạn Kiếp', 'Vạn Kiếp')],
      },
      {
        date: t('Tháng 12/1287', 'Dec 1287'),
        title: t('Vân Đồn — đoàn thuyền lương bị đánh chìm', 'Vân Đồn — the grain fleet sunk'),
        text: t('Trần Khánh Dư chặn đánh đoàn thuyền lương của Trương Văn Hổ ở Vân Đồn. Mất lương thực, quân Nguyên lâm vào cảnh đói.', 'Trần Khánh Dư ambushed Zhang Wenhu’s grain convoy off Vân Đồn; without supplies the Yuan army began to starve.'),
        view: { center: [107.2, 21.1], zoom: 8.4 },
        arrows: [
          A('foe', [[108.2, 21.35], [107.7, 21.15], [107.45, 21.07]], { navy: true }),
          A('vn', [[107.2, 20.9], [107.35, 21.0], [107.43, 21.05]], { navy: true }),
        ],
        marks: [M([107.45, 21.05], 'win', 'Vân Đồn', 'Vân Đồn')],
      },
      {
        date: t('Đầu 1288', 'Early 1288'),
        title: t('Cắm cọc trên sông Bạch Đằng', 'Stakes in the Bạch Đằng'),
        text: t('Quân Nguyên vào Thăng Long trống rỗng, đói kém, quyết định rút. Trần Hưng Đạo cho đóng cọc ở sông Bạch Đằng, phục binh hai bờ, chờ thuỷ quân địch rút qua.', 'Finding Thăng Long empty and short of food, the Yuan decided to retreat. Trần Hưng Đạo planted stakes in the Bạch Đằng and set ambushes on both banks.'),
        year: 1288,
        view: { center: [106.65, 21.0], zoom: 8.8 },
        arrows: [A('foe', [[106.38, 21.1], [106.1, 21.06], [105.86, 21.04]])],
        marks: [M([106.8, 20.9], 'stake', 'Bãi cọc', 'Stake field'), M([105.85, 21.03], 'city', 'Thăng Long', 'Thăng Long')],
      },
      {
        date: t('8 tháng 3 Mậu Tý (9/4/1288)', '9 April 1288'),
        title: t('Trận Bạch Đằng', 'Battle of Bạch Đằng'),
        text: t('Đoàn thuyền Ô Mã Nhi rút xuống Bạch Đằng lúc triều lên. Quân Trần khiêu chiến, đợi nước rút thì đánh ập vào; thuyền giặc mắc cọc vỡ chìm. Ô Mã Nhi, Phàn Tiếp bị bắt sống.', 'Omar’s fleet came down the Bạch Đằng on the high tide. The Trần held it until the ebb, then attacked; the ships broke on the stakes and Omar and Fan Jie were taken alive.'),
        view: { center: [106.8, 20.9], zoom: 10 },
        arrows: [
          A('foe', [[106.39, 21.1], [106.55, 21.06], ...BACH_DANG.slice(1).reverse().slice(0, 4)], { navy: true, retreat: true }),
          A('vn', [[106.7, 20.85], [106.79, 20.89]]),
          A('vn', [[106.92, 20.97], [106.83, 20.9]]),
          A('vn', [[106.95, 20.75], [106.86, 20.81]], { navy: true }),
        ],
        marks: [M([106.82, 20.88], 'win', 'Bắt sống Ô Mã Nhi', 'Omar captured')],
      },
      {
        date: t('Tháng 4/1288', 'April 1288'),
        title: t('Thoát Hoan tháo chạy', 'Toghon flees'),
        text: t('Cánh bộ binh của Thoát Hoan rút qua Nội Bàng, Lạng Sơn, bị chặn đánh liên tiếp, chạy thoát về Tư Minh. Đây là lần cuối nhà Nguyên xâm lược Đại Việt.', 'Toghon’s army retreated through Nội Bàng and Lạng Sơn under constant attack and escaped to Siming. The Yuan never invaded again.'),
        view: { center: [106.6, 21.55], zoom: 7.8 },
        arrows: [
          A('foe', [[106.38, 21.12], [106.45, 21.35], [106.6, 21.67], [106.76, 21.96], [107.0, 22.25]], { retreat: true }),
          A('vn', [[106.25, 21.5], [106.5, 21.6]]),
        ],
      },
    ],
  },
  {
    id: 'chilang1427',
    kind: 'battle',
    event: 'chilang1427',
    title: t('Chi Lăng – Xương Giang 1427', 'Chi Lăng – Xương Giang, 1427'),
    sub: t('Nghĩa quân Lam Sơn diệt viện binh nhà Minh', 'Lam Sơn destroys the Ming relief armies'),
    year: 1427,
    view: { center: [105.8, 21.9], zoom: 6.9 },
    sides: { vn: t('Nghĩa quân Lam Sơn', 'Lam Sơn army'), foe: t('Nhà Minh (Liễu Thăng, Mộc Thạnh)', 'Ming (Liu Sheng, Mu Sheng)') },
    steps: [
      {
        date: t('Tháng 9 Đinh Mùi (10/1427)', 'October 1427'),
        title: t('Hai đạo viện binh', 'Two relief armies'),
        text: t('Để cứu Vương Thông đang bị vây ở Đông Quan, nhà Minh sai Liễu Thăng đem khoảng 10 vạn quân qua cửa Pha Lũy (Lạng Sơn), Mộc Thạnh đem 5 vạn quân từ Vân Nam theo đường Lê Hoa.', 'To relieve Wang Tong, besieged in Đông Quan, the Ming sent Liu Sheng with about 100,000 men via the Pha Lũy pass and Mu Sheng with 50,000 from Yunnan via Lê Hoa.'),
        view: { center: [105.5, 21.8], zoom: 6.9 },
        arrows: [
          A('foe', [[107.1, 22.35], [106.76, 21.98], [106.73, 21.86]]),
          A('foe', [[103.6, 22.95], [103.97, 22.5], [104.3, 22.2]]),
        ],
        marks: [M([105.85, 21.03], 'camp', 'Đông Quan (Vương Thông bị vây)', 'Đông Quan (Wang Tong besieged)')],
      },
      {
        date: t('20 tháng 9 Đinh Mùi (10/10/1427)', '10 October 1427'),
        title: t('Liễu Thăng tử trận ở Chi Lăng', 'Liu Sheng killed at Chi Lăng'),
        text: t('Nghĩa quân bỏ ải nhử địch. Liễu Thăng khinh suất đem quân tiên phong vào ải Chi Lăng, sa vào phục binh, bị chém ở núi Mã Yên.', 'The defenders yielded the passes. Liu Sheng rashly led his vanguard into the Chi Lăng gorge, ran into the ambush and was cut down at Mount Mã Yên.'),
        view: { center: [106.6, 21.7], zoom: 9.4 },
        arrows: [
          A('foe', [[106.74, 21.88], [106.66, 21.76], [106.59, 21.68]]),
          A('vn', [[106.47, 21.7], [106.57, 21.68]]),
          A('vn', [[106.72, 21.62], [106.61, 21.66]]),
        ],
        marks: [M([106.58, 21.67], 'fall', 'Liễu Thăng tử trận', 'Liu Sheng killed')],
      },
      {
        date: t('Cuối tháng 9', 'Late October'),
        title: t('Cần Trạm, Phố Cát', 'Cần Trạm and Phố Cát'),
        text: t('Lương Minh lên thay, bị giết ở Cần Trạm; thượng thư Lý Khánh tự vẫn. Tàn quân do Thôi Tụ, Hoàng Phúc chỉ huy cố tiến về thành Xương Giang.', 'Liang Ming, who took over, was killed at Cần Trạm and Minister Li Qing took his own life. Cui Ju and Huang Fu pressed on toward Xương Giang.'),
        view: { center: [106.35, 21.45], zoom: 8.6 },
        arrows: [
          A('foe', [[106.58, 21.65], [106.42, 21.5], [106.28, 21.4], [106.21, 21.31]]),
          A('vn', [[106.1, 21.5], [106.27, 21.43]]),
        ],
        marks: [M([106.27, 21.42], 'fall', 'Lương Minh tử trận', 'Liang Ming killed')],
      },
      {
        date: t('Tháng 10 Đinh Mùi (11/1427)', 'November 1427'),
        title: t('Vây diệt ở Xương Giang', 'Annihilation at Xương Giang'),
        text: t('Thành Xương Giang đã bị nghĩa quân hạ từ trước. Quân Minh đến nơi không có chỗ dựa, bị vây chặt trên cánh đồng, tan vỡ hoàn toàn; Thôi Tụ, Hoàng Phúc bị bắt sống.', 'Xương Giang had already fallen to the rebels. The Ming column, caught in the open, was surrounded and destroyed; Cui Ju and Huang Fu were captured.'),
        view: { center: [106.2, 21.3], zoom: 9.6 },
        arrows: [
          A('vn', [[106.05, 21.36], [106.18, 21.3]]),
          A('vn', [[106.34, 21.26], [106.22, 21.29]]),
          A('vn', [[106.18, 21.18], [106.2, 21.27]]),
        ],
        marks: [M([106.2, 21.29], 'win', 'Xương Giang', 'Xương Giang')],
      },
      {
        date: t('Tháng 10–11/1427', 'Nov 1427'),
        title: t('Mộc Thạnh tháo chạy', 'Mu Sheng flees'),
        text: t('Nghe tin Liễu Thăng chết, Mộc Thạnh hoảng sợ rút chạy; quân Lam Sơn của Phạm Văn Xảo, Trịnh Khả đuổi đánh ở Lê Hoa.', 'Hearing of Liu Sheng’s death, Mu Sheng panicked and fled, pursued at Lê Hoa by Phạm Văn Xảo and Trịnh Khả.'),
        view: { center: [104.2, 22.4], zoom: 7.8 },
        arrows: [
          A('foe', [[104.3, 22.2], [103.97, 22.5], [103.6, 22.95]], { retreat: true }),
          A('vn', [[104.6, 21.9], [104.25, 22.25]]),
        ],
      },
      {
        date: t('Tháng 12/1427', 'December 1427'),
        title: t('Hội thề Đông Quan', 'The Đông Quan oath'),
        text: t('Vương Thông xin hàng, cùng Lê Lợi hội thề ở phía nam thành Đông Quan rồi rút quân về nước. Đầu năm 1428, Nguyễn Trãi soạn Bình Ngô đại cáo.', 'Wang Tong surrendered, swore peace with Lê Lợi south of Đông Quan and marched home. Early in 1428 Nguyễn Trãi wrote the Proclamation of Victory.'),
        view: { center: [106.0, 21.4], zoom: 7.6 },
        arrows: [A('foe', [[105.85, 21.04], [106.2, 21.3], ...LANG_SON_ROAD.slice(0, 3).reverse()], { retreat: true })],
        marks: [M([105.85, 21.03], 'star', 'Đông Quan', 'Đông Quan')],
      },
    ],
  },
  {
    id: 'dongda',
    kind: 'battle',
    event: 'dongda',
    title: t('Ngọc Hồi – Đống Đa 1789', 'Ngọc Hồi – Đống Đa, 1789'),
    sub: t('Quang Trung thần tốc ra Bắc, phá 29 vạn quân Thanh', 'Quang Trung’s lightning march against the Qing'),
    year: 1789,
    view: { center: [106.2, 19.0], zoom: 6.2 },
    sides: { vn: t('Tây Sơn (Quang Trung)', 'Tây Sơn (Quang Trung)'), foe: t('Nhà Thanh (Tôn Sĩ Nghị)', 'Qing (Sun Shiyi)') },
    steps: [
      {
        date: t('25 tháng 11 Mậu Thân (22/12/1788)', '22 December 1788'),
        title: t('Lên ngôi và xuất quân', 'Crowned, then on the march'),
        text: t('Nghe tin quân Thanh chiếm Thăng Long, Nguyễn Huệ lên ngôi hoàng đế ở núi Bân (Phú Xuân), lấy niên hiệu Quang Trung, rồi lập tức tiến quân ra Bắc, dừng ở Nghệ An tuyển thêm quân.', 'When the Qing seized Thăng Long, Nguyễn Huệ was crowned at Mount Bân outside Phú Xuân as Emperor Quang Trung and marched north at once, raising more troops in Nghệ An.'),
        year: 1788,
        view: { center: [106.4, 18.4], zoom: 6.3 },
        arrows: [A('vn', [[107.58, 16.47], [107.0, 17.2], [106.4, 18.0], [105.68, 18.68], [105.78, 19.8], [105.9, 20.15]])],
        marks: [M([107.58, 16.47], 'star', 'Phú Xuân', 'Phú Xuân'), M([105.68, 18.68], 'camp', 'Nghệ An', 'Nghệ An')],
      },
      {
        date: t('Cuối tháng Chạp', 'Late in the 12th month'),
        title: t('Khao quân ở Tam Điệp', 'Feast at Tam Điệp'),
        text: t('Ở Tam Điệp, vua cho quân ăn Tết trước, hẹn đến mùng 7 sẽ vào Thăng Long mở tiệc mừng. Đại quân chia làm năm đạo.', 'At Tam Điệp he had the army celebrate Tết early, promising a victory feast in Thăng Long by the 7th day, and split his forces into five columns.'),
        year: 1789,
        view: { center: [105.9, 20.6], zoom: 8.2 },
        marks: [M([105.9, 20.15], 'camp', 'Tam Điệp', 'Tam Điệp'), M([105.85, 21.03], 'city', 'Thăng Long (quân Thanh)', 'Thăng Long (Qing)')],
      },
      {
        date: t('Đêm mùng 3 Tết Kỷ Dậu', 'Night of the 3rd day of Tết'),
        title: t('Hạ đồn Hà Hồi', 'Hà Hồi falls'),
        text: t('Chủ lực vượt sông Gián Khẩu, quét sạch các đồn tiền tiêu, đêm mùng 3 bí mật vây đồn Hà Hồi. Quân Thanh trong đồn hoảng sợ xin hàng.', 'The main force crossed at Gián Khẩu, swept away the outposts and on the night of the 3rd silently surrounded Hà Hồi, whose garrison surrendered.'),
        view: { center: [105.9, 20.6], zoom: 8.6 },
        arrows: [A('vn', [[105.9, 20.15], [105.93, 20.28], [105.92, 20.5], [105.9, 20.73], [105.88, 20.85]])],
        marks: [M([105.88, 20.86], 'win', 'Hà Hồi', 'Hà Hồi')],
      },
      {
        date: t('Rạng sáng mùng 5 Tết (30/1/1789)', 'Dawn, 30 January 1789'),
        title: t('Ngọc Hồi và Đống Đa', 'Ngọc Hồi and Đống Đa'),
        text: t('Quân Tây Sơn che ván gỗ bọc rơm ướt, có voi chiến yểm trợ, đánh thẳng vào đồn Ngọc Hồi; Đề đốc Hứa Thế Hanh tử trận. Cùng lúc, cánh của Đô đốc Long đánh úp đồn Khương Thượng (Đống Đa), Sầm Nghi Đống thắt cổ tự tử.', 'Behind straw-wrapped wooden shields and war elephants the Tây Sơn stormed Ngọc Hồi, killing Xu Shiheng. At the same time Admiral Long’s column took Khương Thượng (Đống Đa), where Cen Yidong hanged himself.'),
        view: { center: [105.84, 20.95], zoom: 10.4 },
        arrows: [
          A('vn', [[105.88, 20.86], [105.86, 20.9], [105.845, 20.92]]),
          A('vn', [[105.72, 20.85], [105.76, 20.93], [105.81, 20.99], [105.823, 21.01]]),
          A('vn', [[105.78, 20.82], [105.8, 20.88], [105.82, 20.91]]),
        ],
        marks: [M([105.84, 20.92], 'win', 'Ngọc Hồi', 'Ngọc Hồi'), M([105.825, 21.01], 'win', 'Đống Đa', 'Đống Đa')],
      },
      {
        date: t('Trưa mùng 5 Tết', 'Noon, 5th day of Tết'),
        title: t('Vào Thăng Long', 'Into Thăng Long'),
        text: t('Trưa mùng 5, vua Quang Trung tiến vào Thăng Long. Tôn Sĩ Nghị bỏ cả ấn tín chạy qua cầu phao sông Hồng; cầu đứt, quân Thanh chết đuối rất nhiều. Tàn quân chạy về Lạng Sơn, bị cánh Đô đốc Lộc chặn đánh ở Phượng Nhãn.', 'By noon Quang Trung entered Thăng Long. Sun Shiyi fled across the pontoon bridge over the Red River, leaving his seal behind; the bridge broke and many drowned. The survivors ran for Lạng Sơn, harried by Admiral Lộc’s column.'),
        view: { center: [106.2, 21.35], zoom: 8.2 },
        arrows: [
          A('vn', [[105.845, 20.93], [105.85, 21.02]]),
          A('foe', [[105.86, 21.04], [105.95, 21.1], [106.2, 21.3], [106.42, 21.47], [106.6, 21.67], [106.76, 21.96]], { retreat: true }),
          A('vn', [[106.1, 21.15], [106.33, 21.3]]),
        ],
        marks: [M([105.85, 21.03], 'star', 'Thăng Long', 'Thăng Long'), M([106.35, 21.3], 'win', 'Phượng Nhãn', 'Phượng Nhãn')],
      },
    ],
  },
  {
    id: 'dienbienphu',
    kind: 'battle',
    event: 'dienbienphu',
    title: t('Chiến dịch Điện Biên Phủ 1954', 'Điện Biên Phủ, 1954'),
    sub: t('56 ngày đêm, ba đợt tấn công', '56 days and nights, three assaults'),
    year: 1954,
    view: { center: [103.03, 21.39], zoom: 11.4 },
    sides: { vn: t('Quân đội nhân dân Việt Nam', 'People’s Army of Vietnam'), foe: t('Quân viễn chinh Pháp', 'French Union forces') },
    steps: [
      {
        date: t('20/11/1953', '20 Nov 1953'),
        title: t('Pháp nhảy dù xuống lòng chảo', 'French paratroopers land'),
        text: t('Navarre cho quân nhảy dù xuống cánh đồng Mường Thanh, xây dựng tập đoàn cứ điểm gồm 49 cứ điểm chia làm ba phân khu, có hai sân bay.', 'Navarre dropped paratroopers into the Mường Thanh valley and built a fortress of 49 strongpoints in three sectors with two airstrips.'),
        year: 1953,
        view: { center: [103.03, 21.39], zoom: 11.2 },
        arrows: [A('foe', [[103.25, 21.6], [103.1, 21.47], [103.02, 21.4]])],
        marks: [
          M([103.017, 21.385], 'camp', 'Trung tâm Mường Thanh', 'Mường Thanh centre'),
          M([103.007, 21.4], 'city', 'Sân bay', 'Airstrip'),
          M([103.012, 21.325], 'camp', 'Hồng Cúm', 'Isabelle'),
        ],
      },
      {
        date: t('26/1/1954', '26 Jan 1954'),
        title: t('“Đánh chắc, tiến chắc”', '“Steady attack, steady advance”'),
        text: t('Tại sở chỉ huy Mường Phăng, Đại tướng Võ Nguyên Giáp quyết định hoãn trận tấn công, chuyển sang phương châm đánh chắc tiến chắc; kéo pháo ra, đào trận địa vững chắc.', 'At the Mường Phăng command post General Võ Nguyên Giáp called off the planned rapid assault in favour of a methodical siege, hauling the guns back to dug-in positions.'),
        view: { center: [103.07, 21.42], zoom: 10.6 },
        arrows: [A('vn', [[103.42, 21.59], [103.25, 21.5], [103.12, 21.46]])],
        marks: [M([103.12, 21.46], 'star', 'Sở chỉ huy Mường Phăng', 'Mường Phăng HQ')],
      },
      {
        date: t('13 – 17/3/1954', '13 – 17 Mar 1954'),
        title: t('Đợt 1: Him Lam, Độc Lập, Bản Kéo', 'Phase 1: Béatrice, Gabrielle, Anne-Marie'),
        text: t('Chiều 13/3 nổ súng tiêu diệt Him Lam; đêm 14 rạng 15/3 hạ đồi Độc Lập; ngày 17/3 cứ điểm Bản Kéo đầu hàng. Phân khu Bắc bị xoá sổ, sân bay bị uy hiếp.', 'On 13 March Him Lam was overrun, Độc Lập fell on the night of 14–15 March and Bản Kéo surrendered on the 17th. The northern sector was gone and the airstrip under fire.'),
        year: 1954,
        view: { center: [103.02, 21.405], zoom: 11.8 },
        arrows: [
          A('vn', [[103.07, 21.43], [103.05, 21.415], [103.036, 21.404]]),
          A('vn', [[103.03, 21.47], [103.015, 21.445], [103.012, 21.434]]),
          A('vn', [[102.96, 21.43], [102.985, 21.412], [102.996, 21.405]]),
        ],
        marks: [M([103.035, 21.403], 'win', 'Him Lam', 'Béatrice'), M([103.012, 21.432], 'win', 'Độc Lập', 'Gabrielle'), M([102.995, 21.405], 'win', 'Bản Kéo', 'Anne-Marie')],
      },
      {
        date: t('30/3 – 30/4/1954', '30 Mar – 30 Apr 1954'),
        title: t('Đợt 2: các cao điểm phía đông', 'Phase 2: the eastern hills'),
        text: t('Đánh chiếm các đồi phía đông D, E, C1 và giành giật từng tấc đất ở đồi A1. Hệ thống giao thông hào siết chặt vòng vây, khống chế sân bay, cắt đường tiếp tế bằng máy bay.', 'The eastern hills D, E and C1 were taken and A1 fought over yard by yard. Trenches tightened the ring and shut the airstrip, cutting the air bridge.'),
        view: { center: [103.025, 21.388], zoom: 12.4 },
        arrows: [
          A('vn', [[103.07, 21.4], [103.045, 21.394], [103.034, 21.392]]),
          A('vn', [[103.07, 21.385], [103.045, 21.387], [103.031, 21.388]]),
          A('vn', [[103.065, 21.37], [103.04, 21.378], [103.028, 21.383]]),
        ],
        marks: [M([103.033, 21.392], 'win', 'Đồi D, E', 'Dominique, Éliane'), M([103.03, 21.388], 'win', 'C1', 'Éliane 1'), M([103.027, 21.382], 'camp', 'A1', 'Éliane 2')],
      },
      {
        date: t('1 – 7/5/1954', '1 – 7 May 1954'),
        title: t('Đợt 3: tổng công kích', 'Phase 3: the final assault'),
        text: t('Đêm 6/5, khối bộc phá gần 1 tấn nổ tung đồi A1. Chiều 7/5, bộ đội tiến vào hầm chỉ huy, bắt sống tướng De Castries cùng toàn bộ Bộ tham mưu. Quân ở Hồng Cúm tháo chạy cũng bị bắt.', 'On the night of 6 May a mine of nearly a tonne blew open A1. On the afternoon of 7 May troops entered the command bunker and captured General de Castries and his staff; the Isabelle garrison was caught trying to break out.'),
        view: { center: [103.02, 21.37], zoom: 11.6 },
        arrows: [
          A('vn', [[103.028, 21.383], [103.022, 21.385], [103.018, 21.385]]),
          A('vn', [[102.99, 21.37], [103.008, 21.38], [103.015, 21.384]]),
          A('vn', [[103.01, 21.41], [103.014, 21.395], [103.016, 21.387]]),
          A('foe', [[103.012, 21.325], [103.0, 21.3], [102.98, 21.28]], { retreat: true }),
        ],
        marks: [M([103.017, 21.385], 'win', 'Bắt sống De Castries', 'De Castries captured')],
      },
      {
        date: t('21/7/1954', '21 Jul 1954'),
        title: t('Hiệp định Genève', 'The Geneva Accords'),
        text: t('Ngày 8/5 Hội nghị Genève bàn về Đông Dương khai mạc. Hiệp định ký ngày 21/7/1954 chấm dứt chiến tranh, tạm thời chia đôi đất nước ở vĩ tuyến 17.', 'The Geneva conference on Indochina opened the next day; the accords of 21 July 1954 ended the war and temporarily divided the country at the 17th parallel.'),
        view: { center: [106.2, 17.6], zoom: 5.6 },
        marks: [M([106.9, 17.0], 'star', 'Vĩ tuyến 17', '17th parallel')],
      },
    ],
  },
]

/* ═══════════════════════ NHÂN VẬT ═══════════════════════ */

type Stop = [year: number, lng: number, lat: number, vi: string, en: string, dvi: string, den: string]

function life(id: string, glyph: string, span: [number, number], vi: string, en: string, svi: string, sen: string, stops: Stop[]): Story {
  const steps: Step[] = stops.map(([year, lng, lat, tvi, ten, dvi, den], i) => ({
    year,
    date: { vi: year < 0 ? `${-year} TCN` : String(year), en: year < 0 ? `${-year} BCE` : String(year) },
    title: { vi: tvi, en: ten },
    text: { vi: dvi, en: den },
    view: { center: [lng, lat], zoom: 7.4 },
    arrows: i > 0 ? [{ side: 'vn', path: [[stops[i - 1][1], stops[i - 1][2]], [lng, lat]] }] : [],
    marks: [{ coord: [lng, lat], icon: i === stops.length - 1 ? 'star' : 'city', label: { vi: tvi, en: ten } }],
  }))
  return { id, kind: 'life', glyph, life: span, title: { vi, en }, sub: { vi: svi, en: sen }, year: stops[0][0], view: steps[0].view!, steps }
}

const people: Story[] = [
  life('p-trung', '徵', [14, 43], 'Hai Bà Trưng', 'The Trưng Sisters', 'Trưng Trắc, Trưng Nhị — nữ vương đầu tiên', 'Trưng Trắc & Trưng Nhị — the first queens', [
    [14, 105.72, 21.18, 'Mê Linh', 'Mê Linh', 'Hai chị em sinh ra trong gia đình Lạc tướng huyện Mê Linh.', 'Born to the family of a Lạc lord at Mê Linh.'],
    [40, 105.57, 21.13, 'Khởi nghĩa ở Hát Môn', 'Rising at Hát Môn', 'Thái thú Tô Định giết chồng Trưng Trắc là Thi Sách; hai bà phất cờ khởi nghĩa.', 'After governor Su Ding killed her husband Thi Sách, Trưng Trắc raised revolt.'],
    [40, 106.07, 21.04, 'Chiếm Luy Lâu', 'Taking Luy Lâu', 'Tô Định bỏ chạy; 65 thành ở Lĩnh Nam theo về.', 'Su Ding fled; 65 citadels across Lĩnh Nam joined them.'],
    [40, 105.72, 21.18, 'Xưng vương ở Mê Linh', 'Queen at Mê Linh', 'Trưng Trắc lên ngôi vua, đóng đô ở Mê Linh.', 'Trưng Trắc was proclaimed queen, ruling from Mê Linh.'],
    [42, 106.03, 21.12, 'Trận Lãng Bạc', 'Battle of Lãng Bạc', 'Mã Viện đem quân Hán sang; hai bà giao chiến ở Lãng Bạc rồi lui về Cấm Khê.', 'Ma Yuan’s Han army arrived; the queens fought at Lãng Bạc, then fell back.'],
    [43, 105.55, 21.22, 'Cấm Khê', 'Cấm Khê', 'Thế cô, hai bà hi sinh ở Cấm Khê (theo Toàn thư: năm Quý Mão, 43).', 'Outnumbered, the sisters died at Cấm Khê in 43.'],
  ]),
  life('p-batrieu', '趙', [226, 248], 'Bà Triệu', 'Lady Triệu', 'Triệu Thị Trinh — “cưỡi cơn gió mạnh”', 'Triệu Thị Trinh — “ride the storm”', [
    [226, 105.62, 19.62, 'Quê ở Cửu Chân', 'Born in Cửu Chân', 'Sinh ở huyện Quân Yên, quận Cửu Chân (Thanh Hoá).', 'Born in Quân Yên, Cửu Chân (Thanh Hóa).'],
    [248, 105.6, 19.68, 'Khởi nghĩa núi Nưa', 'Rising at Mount Nưa', 'Cùng anh là Triệu Quốc Đạt dựng cờ chống quân Ngô.', 'With her brother Triệu Quốc Đạt she rose against the Wu.'],
    [248, 105.85, 19.95, 'Núi Tùng', 'Mount Tùng', 'Lục Dận đem quân đàn áp; bà hi sinh ở núi Tùng (Hậu Lộc) năm 23 tuổi.', 'Crushed by Lu Yin, she died at Mount Tùng aged 23.'],
  ]),
  life('p-ngoquyen', '吳', [898, 944], 'Ngô Quyền', 'Ngô Quyền', 'Người mở đầu thời tự chủ', 'Founder of independent rule', [
    [898, 105.48, 21.15, 'Đường Lâm', 'Đường Lâm', 'Sinh ở Đường Lâm (Sơn Tây), con nhà hào trưởng.', 'Born at Đường Lâm (Sơn Tây) to a local chief.'],
    [931, 105.78, 19.8, 'Trấn giữ Ái Châu', 'Governor of Ái Châu', 'Làm tướng, con rể của Dương Đình Nghệ, được giao giữ Ái Châu.', 'General and son-in-law of Dương Đình Nghệ, entrusted with Ái Châu.'],
    [938, 105.85, 21.03, 'Giết Kiều Công Tiễn', 'Kills Kiều Công Tiễn', 'Ra Đại La trừng trị kẻ giết Dương Đình Nghệ.', 'Avenged Dương Đình Nghệ at Đại La.'],
    [938, 106.82, 20.87, 'Bạch Đằng', 'Bạch Đằng', 'Phá tan thuỷ quân Nam Hán bằng trận địa cọc.', 'Destroyed the Southern Han fleet with the stake trap.'],
    [939, 105.873, 21.115, 'Xưng vương ở Cổ Loa', 'King at Cổ Loa', 'Đóng đô ở Cổ Loa, đặt trăm quan; mất năm 944.', 'Ruled from Cổ Loa until his death in 944.'],
  ]),
  life('p-lythaito', '李', [974, 1028], 'Lý Thái Tổ', 'Lý Thái Tổ', 'Lý Công Uẩn — người dời đô ra Thăng Long', 'Lý Công Uẩn — who moved the capital to Thăng Long', [
    [974, 105.97, 21.12, 'Cổ Pháp', 'Cổ Pháp', 'Sinh ở châu Cổ Pháp (Bắc Ninh), lớn lên trong chùa.', 'Born at Cổ Pháp (Bắc Ninh) and raised in a pagoda.'],
    [1005, 105.905, 20.285, 'Điện tiền chỉ huy sứ ở Hoa Lư', 'Palace commander at Hoa Lư', 'Làm quan võ dưới triều Tiền Lê.', 'A palace guard commander under the Early Lê.'],
    [1009, 105.905, 20.285, 'Lên ngôi', 'Takes the throne', 'Được triều thần tôn lên ngôi, mở đầu nhà Lý.', 'Chosen by the court, founding the Lý dynasty.'],
    [1010, 105.84, 21.035, 'Dời đô ra Thăng Long', 'Moves to Thăng Long', 'Ban Chiếu dời đô, chọn thành Đại La, đổi tên Thăng Long.', 'Issued the Edict on moving the capital to Đại La, renamed Thăng Long.'],
    [1028, 105.84, 21.035, 'Mất ở Thăng Long', 'Dies at Thăng Long', 'Ở ngôi 19 năm, táng ở Thọ Lăng (Bắc Ninh).', 'Reigned 19 years; buried at Thọ Lăng.'],
  ]),
  life('p-lythuongkiet', '傑', [1019, 1105], 'Lý Thường Kiệt', 'Lý Thường Kiệt', 'Danh tướng nhà Lý', 'The great Lý general', [
    [1019, 105.84, 21.035, 'Thăng Long', 'Thăng Long', 'Tên thật Ngô Tuấn, sinh ở kinh thành Thăng Long.', 'Born Ngô Tuấn in Thăng Long.'],
    [1069, 109.11, 13.89, 'Đánh Chiêm Thành', 'Campaign against Champa', 'Theo vua Lý Thánh Tông đánh Chiêm, bắt vua Chế Củ.', 'With Lý Thánh Tông he took Vijaya and captured King Rudravarman.'],
    [1075, 108.32, 22.82, 'Ung Châu', 'Yongzhou', 'Chủ động đánh sang đất Tống, hạ thành Ung Châu.', 'Struck first into Song territory and took Yongzhou.'],
    [1077, 106.04, 21.21, 'Như Nguyệt', 'Như Nguyệt', 'Giữ phòng tuyến sông Như Nguyệt, buộc quân Tống rút.', 'Held the Như Nguyệt line until the Song withdrew.'],
    [1105, 105.84, 21.035, 'Mất', 'Death', 'Mất năm 1105, được truy phong Việt quốc công.', 'Died in 1105, honoured as Duke of Việt.'],
  ]),
  life('p-tranhungdao', '陳', [1228, 1300], 'Trần Hưng Đạo', 'Trần Hưng Đạo', 'Trần Quốc Tuấn — ba lần đánh Mông – Nguyên', 'Trần Quốc Tuấn — victor over the Mongols', [
    [1228, 106.17, 20.45, 'Tức Mặc', 'Tức Mặc', 'Con An Sinh vương Trần Liễu, sinh ở Tức Mặc (Nam Định).', 'Son of Prince Trần Liễu, born at Tức Mặc (Nam Định).'],
    [1284, 106.38, 21.1, 'Hịch tướng sĩ', 'Proclamation to the officers', 'Duyệt quân ở Đông Bộ Đầu, soạn Hịch tướng sĩ; đóng đại bản doanh ở Vạn Kiếp.', 'Reviewed the army and issued his famous Proclamation; headquarters at Vạn Kiếp.'],
    [1285, 105.95, 20.9, 'Chương Dương, Hàm Tử', 'Chương Dương & Hàm Tử', 'Phản công đánh bại quân Nguyên lần thứ hai.', 'Counter-attacked and defeated the second invasion.'],
    [1288, 106.82, 20.88, 'Bạch Đằng', 'Bạch Đằng', 'Trận cọc Bạch Đằng, bắt sống Ô Mã Nhi.', 'The stake trap; Omar captured.'],
    [1300, 106.38, 21.1, 'Mất ở Vạn Kiếp', 'Dies at Vạn Kiếp', 'Mất ở phủ đệ Vạn Kiếp, được thờ là Đức Thánh Trần.', 'Died at Vạn Kiếp, venerated as Saint Trần.'],
  ]),
  life('p-leloi', '黎', [1385, 1433], 'Lê Lợi', 'Lê Lợi', 'Lê Thái Tổ — người lãnh đạo khởi nghĩa Lam Sơn', 'Lê Thái Tổ — leader of the Lam Sơn rising', [
    [1385, 105.4, 19.93, 'Lam Sơn', 'Lam Sơn', 'Sinh ở Lam Sơn (Thanh Hoá), nhà hào trưởng.', 'Born to a landed family at Lam Sơn (Thanh Hóa).'],
    [1418, 105.4, 19.93, 'Dựng cờ khởi nghĩa', 'Raises the banner', 'Xưng Bình Định vương, khởi nghĩa chống Minh.', 'Proclaimed himself Pacifying King and rose against the Ming.'],
    [1424, 105.25, 19.05, 'Tiến vào Nghệ An', 'Into Nghệ An', 'Theo kế của Nguyễn Chích, chuyển vào Nghệ An xây căn cứ.', 'On Nguyễn Chích’s advice moved south to build a base in Nghệ An.'],
    [1427, 106.58, 21.67, 'Chi Lăng – Xương Giang', 'Chi Lăng – Xương Giang', 'Tiêu diệt viện binh Liễu Thăng, buộc Vương Thông xin hàng.', 'Destroyed Liu Sheng’s relief army; Wang Tong surrendered.'],
    [1428, 105.84, 21.035, 'Lên ngôi ở Đông Kinh', 'Crowned at Đông Kinh', 'Lên ngôi hoàng đế, đặt quốc hiệu Đại Việt, mở đầu nhà Hậu Lê.', 'Crowned emperor of Đại Việt, founding the Later Lê.'],
    [1433, 105.4, 19.93, 'Vĩnh Lăng', 'Vĩnh Lăng', 'Mất năm 1433, táng ở Vĩnh Lăng, Lam Sơn.', 'Died 1433, buried at Vĩnh Lăng in Lam Sơn.'],
  ]),
  life('p-nguyentrai', '廌', [1380, 1442], 'Nguyễn Trãi', 'Nguyễn Trãi', 'Nhà chính trị, nhà văn — tác giả Bình Ngô đại cáo', 'Statesman and poet — author of the Proclamation of Victory', [
    [1380, 105.84, 21.035, 'Thăng Long', 'Thăng Long', 'Con Nguyễn Phi Khanh, cháu ngoại Trần Nguyên Đán.', 'Son of Nguyễn Phi Khanh, grandson of Trần Nguyên Đán.'],
    [1400, 105.6, 20.08, 'Đỗ Thái học sinh', 'Passes the exam', 'Đỗ Thái học sinh khoa thi đầu tiên của nhà Hồ.', 'Passed the first examination of the Hồ dynasty.'],
    [1407, 106.76, 21.98, 'Tiễn cha ở ải Nam Quan', 'Farewell at the border', 'Cha bị quân Minh bắt giải sang Trung Quốc; ông nghe lời cha quay về lo việc nước.', 'His father was taken to China by the Ming; he turned back to serve his country.'],
    [1420, 105.4, 19.93, 'Theo Lê Lợi', 'Joins Lê Lợi', 'Dâng Bình Ngô sách, trở thành mưu sĩ của nghĩa quân.', 'Presented his strategy and became the rebels’ chief adviser.'],
    [1428, 105.84, 21.035, 'Bình Ngô đại cáo', 'Proclamation of Victory', 'Thay vua soạn bài cáo tuyên bố độc lập.', 'Wrote the proclamation of independence for the emperor.'],
    [1442, 106.15, 21.1, 'Vụ án Lệ Chi Viên', 'The Lệ Chi Viên case', 'Bị khép tội giết vua Lê Thái Tông, cả nhà bị hại; năm 1464 được Lê Thánh Tông minh oan.', 'Executed with his family over the death of Lê Thái Tông; cleared by Lê Thánh Tông in 1464.'],
  ]),
  life('p-quangtrung', '惠', [1753, 1792], 'Quang Trung', 'Quang Trung', 'Nguyễn Huệ — vị tướng chưa thua trận nào', 'Nguyễn Huệ — the undefeated general', [
    [1753, 108.9, 13.95, 'Tây Sơn', 'Tây Sơn', 'Sinh ở ấp Kiên Mỹ, Tây Sơn (Bình Định).', 'Born at Kiên Mỹ, Tây Sơn (Bình Định).'],
    [1771, 108.9, 13.95, 'Khởi nghĩa Tây Sơn', 'The Tây Sơn rising', 'Cùng anh em Nguyễn Nhạc, Nguyễn Lữ dựng cờ khởi nghĩa.', 'Rose with his brothers Nhạc and Lữ.'],
    [1785, 106.2, 10.33, 'Rạch Gầm – Xoài Mút', 'Rạch Gầm – Xoài Mút', 'Đánh tan quân Xiêm trên sông Tiền.', 'Annihilated the Siamese on the Tiền river.'],
    [1786, 105.84, 21.035, 'Ra Bắc diệt Trịnh', 'Ends the Trịnh', 'Lấy danh nghĩa “phù Lê diệt Trịnh”, tiến ra Thăng Long.', 'Marched on Thăng Long under the banner “support the Lê, destroy the Trịnh”.'],
    [1788, 107.58, 16.47, 'Lên ngôi ở Phú Xuân', 'Crowned at Phú Xuân', 'Lên ngôi hoàng đế, niên hiệu Quang Trung.', 'Crowned emperor as Quang Trung.'],
    [1789, 105.825, 21.01, 'Ngọc Hồi – Đống Đa', 'Ngọc Hồi – Đống Đa', 'Đại phá quân Thanh dịp Tết Kỷ Dậu.', 'Routed the Qing at Tết 1789.'],
    [1792, 107.58, 16.47, 'Mất ở Phú Xuân', 'Dies at Phú Xuân', 'Đột ngột qua đời năm 39 tuổi.', 'Died suddenly aged 39.'],
  ]),
  life('p-gialong', '映', [1762, 1820], 'Gia Long', 'Gia Long', 'Nguyễn Ánh — người lập nhà Nguyễn', 'Nguyễn Ánh — founder of the Nguyễn dynasty', [
    [1762, 107.58, 16.47, 'Phú Xuân', 'Phú Xuân', 'Cháu chúa Nguyễn Phúc Khoát, sinh ở Phú Xuân.', 'Grandson of Lord Nguyễn Phúc Khoát, born at Phú Xuân.'],
    [1777, 106.7, 10.78, 'Chạy vào Gia Định', 'Flight to Gia Định', 'Tây Sơn diệt gần hết họ Nguyễn; ông thoát được, tụ quân ở Gia Định.', 'Surviving the Tây Sơn purge, he rallied followers at Gia Định.'],
    [1785, 100.5, 13.75, 'Nương nhờ Xiêm', 'Exile in Siam', 'Thua trận, sang nương nhờ vua Xiêm ở Bangkok.', 'Defeated, he took refuge with the Siamese king in Bangkok.'],
    [1788, 106.7, 10.78, 'Lấy lại Gia Định', 'Retakes Gia Định', 'Trở về chiếm lại Gia Định, xây thành Bát Quái.', 'Returned, retook Gia Định and built the octagonal citadel.'],
    [1801, 107.58, 16.47, 'Chiếm Phú Xuân', 'Takes Phú Xuân', 'Đánh lấy kinh đô Phú Xuân của Tây Sơn.', 'Captured the Tây Sơn capital.'],
    [1802, 105.84, 21.035, 'Thống nhất', 'Unification', 'Lên ngôi, niên hiệu Gia Long; ra Bắc lấy Thăng Long, thống nhất đất nước.', 'Crowned as Gia Long and took Thăng Long, unifying the country.'],
    [1820, 107.58, 16.47, 'Mất ở Huế', 'Dies at Huế', 'Mất năm 1820, táng ở Thiên Thọ lăng.', 'Died 1820, buried at Thiên Thọ.'],
  ]),
  life('p-hochiminh', '胡', [1890, 1969], 'Hồ Chí Minh', 'Hồ Chí Minh', 'Người đọc Tuyên ngôn độc lập', 'Author of the Declaration of Independence', [
    [1890, 105.53, 18.72, 'Kim Liên', 'Kim Liên', 'Tên khai sinh Nguyễn Sinh Cung, sinh ở Nam Đàn (Nghệ An).', 'Born Nguyễn Sinh Cung at Nam Đàn (Nghệ An).'],
    [1911, 106.707, 10.768, 'Rời Bến Nhà Rồng', 'Leaves from Nhà Rồng wharf', 'Lên tàu Amiral Latouche-Tréville ra đi tìm đường cứu nước.', 'Sailed abroad aboard the Amiral Latouche-Tréville.'],
    [1941, 106.04, 22.98, 'Về Pác Bó', 'Return at Pác Bó', 'Sau 30 năm trở về nước, lập Mặt trận Việt Minh.', 'Back after 30 years, he founded the Việt Minh.'],
    [1945, 105.835, 21.037, 'Ba Đình', 'Ba Đình', 'Ngày 2/9 đọc Tuyên ngôn độc lập.', 'Read the Declaration of Independence on 2 September.'],
    [1947, 105.6, 21.85, 'ATK Định Hoá', 'Resistance base', 'Lãnh đạo kháng chiến từ chiến khu Việt Bắc.', 'Led the resistance from the Việt Bắc base.'],
    [1969, 105.835, 21.037, 'Mất ở Hà Nội', 'Dies in Hà Nội', 'Mất ngày 2/9/1969.', 'Died on 2 September 1969.'],
  ]),
  life('p-vonguyengiap', '甲', [1911, 2013], 'Võ Nguyên Giáp', 'Võ Nguyên Giáp', 'Đại tướng đầu tiên', 'Vietnam’s first general', [
    [1911, 106.65, 17.25, 'Lộc Thuỷ', 'Lộc Thủy', 'Sinh ở An Xá, Lệ Thuỷ (Quảng Bình).', 'Born at An Xá, Lệ Thủy (Quảng Bình).'],
    [1944, 105.98, 22.6, 'Rừng Trần Hưng Đạo', 'The Trần Hưng Đạo forest', 'Thành lập Đội Việt Nam Tuyên truyền Giải phóng quân với 34 chiến sĩ.', 'Founded the 34-strong Propaganda Unit for National Liberation.'],
    [1954, 103.12, 21.46, 'Điện Biên Phủ', 'Điện Biên Phủ', 'Tổng chỉ huy chiến dịch Điện Biên Phủ.', 'Commanded the Điện Biên Phủ campaign.'],
    [1975, 106.695, 10.777, 'Đại thắng mùa Xuân', 'Spring victory', 'Bộ trưởng Quốc phòng trong Tổng tiến công mùa Xuân 1975.', 'Defence minister during the 1975 Spring Offensive.'],
    [2013, 106.47, 17.73, 'Vũng Chùa', 'Vũng Chùa', 'Mất ngày 4/10/2013 ở tuổi 102, an táng ở Vũng Chùa – Đảo Yến.', 'Died aged 102; buried at Vũng Chùa.'],
  ]),
  life('p-lynamde', '賁', [503, 548], 'Lý Nam Đế', 'Lý Nam Đế', 'Lý Bí — người lập nước Vạn Xuân', 'Lý Bí — founder of Vạn Xuân', [
    [503, 105.47, 21.13, 'Quê Thái Bình', 'Born in Thái Bình', 'Sinh ở huyện Thái Bình, Giao Châu (vùng Sơn Tây ngày nay, theo nhiều thuyết), dòng dõi hào trưởng.', 'Born to a local chief’s family in Thái Bình county, Giao Châu (around today’s Sơn Tây).'],
    [541, 105.89, 21.05, 'Khởi nghĩa, đuổi Tiêu Tư', 'Rising against Xiao Zi', 'Liên kết hào kiệt các châu nổi dậy; thứ sử Tiêu Tư bỏ thành Long Biên chạy về Quảng Châu.', 'Allied with local leaders and rose up; governor Xiao Zi fled Long Biên for Guangzhou.'],
    [544, 105.836, 21.048, 'Xưng Nam Việt Đế', 'Emperor of Nam Việt', 'Lên ngôi hoàng đế, đặt quốc hiệu Vạn Xuân, dựng chùa Khai Quốc (nay là chùa Trấn Quốc).', 'Proclaimed emperor of Vạn Xuân and founded Khai Quốc pagoda (today Trấn Quốc).'],
    [545, 105.35, 21.32, 'Chống quân Lương', 'Against the Liang', 'Trần Bá Tiên đem quân Lương sang; Lý Nam Đế thua ở Chu Diên, Gia Ninh, lui về Tân Xương.', 'Chen Baxian’s Liang army defeated him at Chu Diên and Gia Ninh; he fell back to Tân Xương.'],
    [548, 105.25, 21.3, 'Động Khuất Lão', 'Khuất Lão cave', 'Giao binh quyền cho Triệu Quang Phục, rồi mất ở động Khuất Lão (Phú Thọ).', 'He handed command to Triệu Quang Phục and died at Khuất Lão (Phú Thọ).'],
  ]),
  life('p-dinhbolinh', '丁', [924, 979], 'Đinh Bộ Lĩnh', 'Đinh Bộ Lĩnh', 'Đinh Tiên Hoàng — dẹp loạn 12 sứ quân', 'Đinh Tiên Hoàng — ended the Twelve Warlords', [
    [924, 105.905, 20.285, 'Hoa Lư', 'Hoa Lư', 'Sinh ở động Hoa Lư; thuở nhỏ chăn trâu, lấy bông lau làm cờ tập trận.', 'Born at Hoa Lư; as a buffalo boy he drilled playmates with reed-flower banners.'],
    [951, 106.33, 20.45, 'Theo sứ quân Trần Lãm', 'Joins Trần Lãm', 'Cùng con là Đinh Liễn đến nương nhờ sứ quân Trần Lãm ở Bố Hải Khẩu (Thái Bình).', 'Joined the warlord Trần Lãm at Bố Hải Khẩu (Thái Bình).'],
    [967, 105.85, 21.03, 'Dẹp 12 sứ quân', 'Ends the warlords', 'Lần lượt đánh dẹp các sứ quân, được tôn là Vạn Thắng Vương.', 'Defeated the warlords one by one and was hailed as King of Ten Thousand Victories.'],
    [968, 105.905, 20.285, 'Lên ngôi ở Hoa Lư', 'Crowned at Hoa Lư', 'Xưng Đại Thắng Minh Hoàng Đế, đặt quốc hiệu Đại Cồ Việt, đóng đô ở Hoa Lư.', 'Crowned emperor of Đại Cồ Việt with Hoa Lư as capital.'],
    [979, 105.905, 20.285, 'Mất', 'Death', 'Bị Đỗ Thích ám hại cùng con trưởng Đinh Liễn.', 'Assassinated by Đỗ Thích together with his son Đinh Liễn.'],
  ]),
  life('p-lehoan', '桓', [941, 1005], 'Lê Hoàn', 'Lê Hoàn', 'Lê Đại Hành — phá Tống, bình Chiêm', 'Lê Đại Hành — beat the Song, struck Champa', [
    [941, 105.5, 19.9, 'Ái Châu', 'Ái Châu', 'Người Ái Châu (Thanh Hoá) theo Toàn thư; mồ côi sớm, được quan sát họ Lê nuôi dạy.', 'From Ái Châu (Thanh Hóa) per the Toàn thư; orphaned and raised by an official named Lê.'],
    [971, 105.905, 20.285, 'Thập đạo tướng quân', 'Commander of the Ten Circuits', 'Được Đinh Tiên Hoàng giao chỉ huy toàn quân ở Hoa Lư.', 'Put in command of the whole army by Đinh Tiên Hoàng.'],
    [980, 105.905, 20.285, 'Lên ngôi', 'Takes the throne', 'Quân Tống sắp sang, triều thần và Thái hậu Dương Vân Nga trao áo long cổn, mở đầu nhà Tiền Lê.', 'With the Song approaching, the court and Empress Dowager Dương Vân Nga made him emperor.'],
    [981, 106.6, 21.66, 'Phá Tống', 'Defeats the Song', 'Đánh tan quân Tống ở Chi Lăng và trên sông Bạch Đằng, chém tướng Hầu Nhân Bảo.', 'Routed the Song at Chi Lăng and on the Bạch Đằng, killing Hou Renbao.'],
    [982, 108.25, 15.69, 'Đánh Chiêm Thành', 'Strikes Champa', 'Phá kinh đô Indrapura (Quảng Nam) của Chiêm Thành.', 'Sacked the Cham capital of Indrapura (Quảng Nam).'],
    [1005, 105.905, 20.285, 'Mất ở Hoa Lư', 'Dies at Hoa Lư', 'Mất ở điện Trường Xuân, ở ngôi 24 năm.', 'Died after 24 years on the throne.'],
  ]),
  life('p-lethanhtong', '灝', [1442, 1497], 'Lê Thánh Tông', 'Lê Thánh Tông', 'Vua Hồng Đức — mở rộng bờ cõi, định luật pháp', 'The Hồng Đức emperor — law-giver and conqueror', [
    [1442, 105.84, 21.035, 'Sinh ở Thăng Long', 'Born in Thăng Long', 'Con thứ tư vua Lê Thái Tông và bà Ngô Thị Ngọc Dao, sinh ở chùa Huy Văn.', 'Fourth son of Lê Thái Tông and Ngô Thị Ngọc Dao, born at Huy Văn temple.'],
    [1460, 105.84, 21.035, 'Lên ngôi', 'Takes the throne', 'Được các đại thần đón lên ngôi sau khi dẹp loạn Nghi Dân.', 'Placed on the throne after ministers overthrew the usurper Nghi Dân.'],
    [1466, 105.84, 21.035, 'Định 12 đạo thừa tuyên', 'Twelve provinces', 'Cải cách hành chính, chia cả nước thành các đạo thừa tuyên; năm 1490 vẽ bản đồ Hồng Đức.', 'Reorganised the realm into provinces; the Hồng Đức atlas followed in 1490.'],
    [1471, 109.11, 13.89, 'Hạ thành Vijaya', 'Takes Vijaya', 'Thân chinh đánh Chiêm Thành, lập thừa tuyên Quảng Nam.', 'Led the campaign against Champa and created Quảng Nam province.'],
    [1483, 105.84, 21.035, 'Luật Hồng Đức', 'The Hồng Đức Code', 'Ban hành Quốc triều hình luật, bảo vệ quyền lợi phụ nữ và người yếu thế.', 'Promulgated the national penal code, notable for protecting women’s rights.'],
    [1497, 105.4, 19.93, 'Chiêu Lăng', 'Chiêu Lăng', 'Mất năm 1497, táng ở Chiêu Lăng, Lam Sơn.', 'Died 1497, buried at Chiêu Lăng in Lam Sơn.'],
  ]),
  life('p-nguyenhoang', '潢', [1525, 1613], 'Nguyễn Hoàng', 'Nguyễn Hoàng', 'Chúa Tiên — mở nghiệp Đàng Trong', 'Lord Tiên — founder of the southern realm', [
    [1525, 105.85, 20.03, 'Gia Miêu', 'Gia Miêu', 'Con Nguyễn Kim, sinh ở Gia Miêu (Hà Trung, Thanh Hoá).', 'Son of Nguyễn Kim, born at Gia Miêu (Thanh Hóa).'],
    [1558, 107.15, 16.78, 'Vào trấn Thuận Hoá', 'Governor of Thuận Hóa', 'Theo lời khuyên “Hoành Sơn nhất đái”, xin vào trấn thủ Thuận Hoá, đóng dinh ở Ái Tử.', 'Following the oracle of the Hoành Sơn range, he took the Thuận Hóa post, based at Ái Tử.'],
    [1593, 105.84, 21.035, 'Ra Bắc đánh Mạc', 'Fights the Mạc', 'Ra Thăng Long giúp Trịnh Tùng đánh dư đảng họ Mạc.', 'Went north to help Trịnh Tùng against the remaining Mạc.'],
    [1600, 107.15, 16.78, 'Trở về Thuận Hoá', 'Back to Thuận Hóa', 'Đốt doanh trại, theo đường biển về Nam — từ đây Đàng Trong tách riêng.', 'Burned his camp and slipped back south by sea — the start of a separate realm.'],
    [1611, 109.3, 13.1, 'Lập phủ Phú Yên', 'Founds Phú Yên', 'Sai Văn Phong lấy đất đến đèo Cả, lập phủ Phú Yên.', 'Sent Văn Phong to take the land to the Cả pass, creating Phú Yên.'],
    [1613, 107.15, 16.78, 'Mất', 'Death', 'Mất năm 1613, thọ 89 tuổi; dặn con giữ vững đất Thuận Quảng.', 'Died aged 89, urging his son to hold Thuận–Quảng.'],
  ]),
  life('p-phanboichau', '珠', [1867, 1940], 'Phan Bội Châu', 'Phan Bội Châu', 'Nhà yêu nước, khởi xướng phong trào Đông Du', 'Patriot who launched the Đông Du movement', [
    [1867, 105.5, 18.7, 'Nam Đàn', 'Nam Đàn', 'Sinh ở huyện Nam Đàn (Nghệ An), nổi tiếng hay chữ từ nhỏ.', 'Born in Nam Đàn (Nghệ An), a precocious scholar.'],
    [1904, 108.3, 15.75, 'Lập Duy Tân hội', 'Founds the Duy Tân Society', 'Cùng Nguyễn Hàm, Kỳ Ngoại hầu Cường Để lập hội ở Quảng Nam, chủ trương giành độc lập.', 'With Nguyễn Hàm and Prince Cường Để he founded a society for independence in Quảng Nam.'],
    [1905, 106.68, 20.86, 'Xuất dương — Đông Du', 'Abroad — Đông Du', 'Bí mật xuất dương sang Nhật, kêu gọi thanh niên sang học (phong trào Đông Du).', 'Left secretly for Japan and called young Vietnamese to study there.'],
    [1912, 113.26, 23.13, 'Việt Nam Quang phục hội', 'Restoration League', 'Ở Quảng Châu lập Việt Nam Quang phục hội, chủ trương lập nước dân chủ.', 'Founded the Vietnam Restoration League in Guangzhou.'],
    [1925, 121.47, 31.23, 'Bị bắt ở Thượng Hải', 'Arrested in Shanghai', 'Mật thám Pháp bắt cóc ở Thượng Hải, đưa về nước xử án; dư luận phản đối mạnh.', 'Kidnapped by French agents in Shanghai and tried at home amid public outcry.'],
    [1940, 107.59, 16.45, 'Bến Ngự, Huế', 'Bến Ngự, Huế', 'Bị giam lỏng ở Bến Ngự (Huế) đến khi mất năm 1940.', 'Kept under house arrest at Bến Ngự until his death in 1940.'],
  ]),
]

people.sort((a, b) => a.life![0] - b.life![0])

export const STORIES: Story[] = [...battles, ...people]
export const BATTLES = battles
export const PEOPLE = people
export const storyByEvent = (eventId: string) => battles.find((s) => s.event === eventId)
