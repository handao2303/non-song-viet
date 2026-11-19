/**
 * Đối chiếu với Đại Việt sử ký toàn thư (nguyên văn chữ Hán, bản Nội các quan bản 1697 + Tục biên),
 * văn bản trên Wikisource: https://zh.wikisource.org/wiki/大越史記全書
 * Mỗi mục: quyển + một câu nguyên văn ngắn làm bằng chứng.
 */

export type TTVol = string // NK1–NK5 (Ngoại kỷ), BK1–BK19 (Bản kỷ), TB1–TB5 (Tục biên)

export interface TTCite {
  vol: TTVol
  quote: string
  /** ghi chú khi năm Toàn thư khác cách tính thông thường */
  note?: { vi: string; en: string }
}

export const TT_URL = 'https://zh.wikisource.org/wiki/大越史記全書'

const VOL_PAGE: Record<string, string> = {
  NK: '外紀卷之',
  BK: '本紀卷之',
  TB: '續編卷之',
}
const CN = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九']

export function volUrl(vol: TTVol) {
  const kind = vol.slice(0, 2)
  const n = Number(vol.slice(2))
  return `${TT_URL}/${VOL_PAGE[kind]}${CN[n]}`
}

export function volName(vol: TTVol, lang: 'vi' | 'en') {
  const kind = vol.slice(0, 2)
  const n = vol.slice(2)
  const vi = { NK: 'Ngoại kỷ', BK: 'Bản kỷ', TB: 'Tục biên' }[kind]
  const en = { NK: 'Outer Annals', BK: 'Basic Annals', TB: 'Continuation' }[kind]
  return lang === 'vi' ? `${vi}, quyển ${n}` : `${en}, vol. ${n}`
}

const n = (vi: string, en: string) => ({ vi, en })

/** Sự kiện đã đối chiếu được với Toàn thư */
export const TT: Record<string, TTCite> = {
  tan: { vol: 'NK1', quote: '秦發諸道逋亡人、贄壻、賈人為兵，使校尉屠睢將樓船之士' },
  coloa: { vol: 'NK1', quote: '王既併文郎國，改國號曰甌貉國' },
  trieuda: { vol: 'NK1', quote: '王持七寸文犀入海去', note: n('Toàn thư: An Dương Vương trị vì từ Giáp Thìn đến Quý Tỵ, 50 năm', 'An Dương Vương reigned 257–208 BCE, 50 years') },
  han: { vol: 'NK2', quote: '我越已為路博德、楊僕所平矣' },
  hatmon: { vol: 'NK3', quote: '乃與其妹貳舉兵，攻陷州治' },
  langbac: { vol: 'NK3', quote: '至浪泊上與王戰', note: n('Năm Nhâm Dần (42); Hai Bà mất năm Quý Mão (43)', 'Year Nhâm Dần (42); the sisters died in 43') },
  batrieu: { vol: 'NK4', quote: '九真郡女趙嫗。聚眾攻掠郡縣' },
  lybi: { vol: 'NK4', quote: '自稱南越帝，即位建元，置百官，建國號曰萬春' },
  datrach: { vol: 'NK4', quote: '光復度不能支，乃退保夜澤' },
  tuy: { vol: 'NK4', quote: '右後南帝，起辛卯，終壬戌' },
  maihacde: { vol: 'NK5', quote: '賊帥梅叔鸞㨿州，稱黑帝' },
  phunghung: { vol: 'NK5', quote: '交州唐林人馮興起兵圍府' },
  khuc: { vol: 'NK5', quote: '交州人曲顥據州治，稱節度使', note: n('Toàn thư không chép Khúc Thừa Dụ; Khúc Hạo xuất hiện năm 907', 'The Toàn thư does not name Khúc Thừa Dụ; Khúc Hạo appears in 907') },
  duongdinhnghe: { vol: 'NK5', quote: '楊廷藝養假子三千人，圖恢復' },
  bachdang938: { vol: 'NK5', quote: '命弘操将舟師自白滕江入' },
  dinh: { vol: 'BK1', quote: '帝即位，建國號大瞿越' },
  chilang981: { vol: 'BK1', quote: '帝自將禦之，使士卒植樁捍江' },
  chiem982: { vol: 'BK1', quote: '帝親征占城，克之' },
  thienDo: { vol: 'BK2', quote: '况髙王故都大羅城，宅天地區域之中' },
  daiviet: { vol: 'BK2', quote: '建國號曰大越' },
  bochinh: { vol: 'BK3', quote: '制矩請以地哩、麻令、布政三州贖罪' },
  vanmieu: { vol: 'BK3', quote: '脩文廟，塑孔子、周公及四配像' },
  ungchau: { vol: 'BK3', quote: '常傑陷欽、廉等州，亶圍邕州' },
  nhunguyet: { vol: 'BK3', quote: '至如月江大破之', note: n('Toàn thư chép vào năm Bính Thìn (1076), kèm bài "Nam quốc sơn hà"', 'Recorded under 1076, with the poem "Nam quốc sơn hà"') },
  tran1225: { vol: 'BK4', quote: '在位二年，遂禪位于陳' },
  mongol1: { vol: 'BK5', quote: '進軍東步頭逆戰，大破之', note: n('Tháng Chạp năm Đinh Tỵ — tức đầu năm 1258 dương lịch', '12th lunar month of Đinh Tỵ — early 1258 CE') },
  mongol2: { vol: 'BK5', quote: '敗賊于京城、章陽等處' },
  bachdang1288: { vol: 'BK5', quote: '先是，王已植樁於白藤，覆叢草其上' },
  huyentran: { vol: 'BK6', quote: '下嫁玄珍公主于占城主制旻' },
  chebongnga: { vol: 'BK7', quote: '占城入㓂，由大安海門直犯京師' },
  haitrieu: { vol: 'BK8', quote: '大敗占城于海潮。獲其主制蓬莪' },
  taydo: { vol: 'BK8', quote: '相度清化府安孫洞，築城鑿池' },
  chiemdong: { vol: 'BK8', quote: '獻占洞之地' },
  minh1407: { vol: 'BK9', quote: '獲季犛於止止灘' },
  lamson: { vol: 'BK10', quote: '帝起兵於藍山' },
  chilang1427: { vol: 'BK10', quote: '明命安遠侯柳昇帥師來侵' },
  binhngo: { vol: 'BK10', quote: '帝既平吳，大告天下', note: n('Chép cuối năm Đinh Mùi (1427)', 'Recorded at the end of Đinh Mùi (1427)') },
  vijaya: { vol: 'BK12', quote: '帝進兵圍闍槃城' },
  mac1527: { vol: 'BK15', quote: '莫登庸自古齋入京，逼帝禪位' },
  nguyenkim: { vol: 'BK16', quote: '迎至哀牢國尊立之' },
  nguyenhoang: { vol: 'BK16', quote: '使將兵鎭守順化處以防東寇' },
  trinhtung: { vol: 'BK17', quote: '京城殿屋，蕭然一空' },
  nguyenhoang1600: { vol: 'BK18', quote: '遂大燒營寨，潛回順化' },
  gianh: { vol: 'BK18', quote: '差官齎勅諭順廣太保瑞郡公阮福源' },
  caobang: { vol: 'TB1', quote: '大舉討高平' },
  phubac: { vol: 'TB5', quote: '阮文岳遺其弟阮文惠攻順化' },
  quangtrung: { vol: 'TB5', quote: '阮文惠卽皇帝位于富春城，改元光中' },
  dongda: { vol: 'TB5', quote: '阮文惠與淸師戰于上福，淸師大敗' },
}

/** Sự kiện có trong phạm vi thời gian Toàn thư nhưng sách không chép (hoặc chép khác) */
export const TT_ABSENT: Record<string, { vi: string; en: string }> = {
  donson: n('Khảo cổ học, không có trong Toàn thư', 'Archaeology, not in the Toàn thư'),
  khulien: n('Toàn thư không chép năm lập nước Lâm Ấp', 'The Toàn thư does not date the founding of Lâm Ấp'),
  oceo: n('Khảo cổ học, không có trong Toàn thư', 'Archaeology, not in the Toàn thư'),
  daila: n('Toàn thư chỉ nhắc Cao Biền trong lời bàn, không ghi năm đắp thành', 'Mentioned only in commentary, no date given'),
  hongduc: n('Toàn thư không chép năm ban hành bộ luật; 1483 là niên đại do giới nghiên cứu ước định', 'The Toàn thư gives no promulgation date; 1483 is a scholarly estimate'),
  phuyen: n('Việc của Đàng Trong — Toàn thư (viết ở Đàng Ngoài) không chép; xem Đại Nam thực lục', 'Southern affair not recorded in the northern Toàn thư; see Đại Nam thực lục'),
  preynokor: n('Toàn thư không chép; xem Gia Định thành thông chí', 'Not recorded; see Gia Định thành thông chí'),
  hoian: n('Toàn thư không chép', 'Not recorded'),
  quocngu: n('Toàn thư không chép', 'Not recorded'),
  khanhhoa: n('Việc của Đàng Trong — xem Đại Nam thực lục', 'Southern affair — see Đại Nam thực lục'),
  binhthuan: n('Việc của Đàng Trong — xem Đại Nam thực lục', 'Southern affair — see Đại Nam thực lục'),
  giadinh: n('Việc của Đàng Trong — xem Đại Nam thực lục, Gia Định thành thông chí', 'Southern affair — see Đại Nam thực lục'),
  hatien: n('Việc của Đàng Trong — xem Đại Nam thực lục', 'Southern affair — see Đại Nam thực lục'),
  longho: n('Việc của Đàng Trong — xem Đại Nam thực lục', 'Southern affair — see Đại Nam thực lục'),
  nam1757: n('Việc của Đàng Trong — xem Đại Nam thực lục', 'Southern affair — see Đại Nam thực lục'),
  tayson: n('Tục biên chỉ nhắc Tây Sơn từ năm 1774', 'The Continuation first mentions the Tây Sơn in 1774'),
  rachgam: n('Toàn thư không chép', 'Not recorded'),
}

/** Năm cuối Toàn thư (kể cả Tục biên) còn ghi chép */
export const TT_END = 1789
