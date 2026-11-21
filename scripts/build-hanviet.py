"""
Phiên âm Hán Việt cho các đoạn nguyên văn (Toàn thư, Thực lục).

Nguồn âm & nghĩa: Hán Việt tự điển — Thiều Chửu (1942; tác giả mất 1954, tác phẩm thuộc
phạm vi công cộng), bản số hoá dataV4.json (github.com/tranminhhuydn/tu-dien-thieu-chuu).
Chữ dị thể tra qua Unihan (Unicode, giấy phép Unicode).

Chữ đa âm (行 hành/hàng, 長 trường/trưởng, 樂 nhạc/lạc…) được chọn theo từ ghép
xuất hiện trong ví dụ của chính từ điển Thiều Chửu, cộng thêm một bảng từ sử học nhỏ.

Đầu vào : scripts/raw/hanviet/dataV4.json, scripts/raw/hanviet/Unihan_*.txt,
          src/data/toanthu-passages.json, src/data/dntl-passages.json (nếu có)
Đầu ra  : src/data/hanviet.json  { g: {chữ: [âm chính, [âm khác], nghĩa]}, p: {id: [âm|null…]} }
"""
import json, re, os, collections

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, 'scripts', 'raw', 'hanviet')
DATA = os.path.join(ROOT, 'src', 'data')

def is_han(ch):
    o = ord(ch)
    return 0x3400 <= o <= 0x9FFF or 0xF900 <= o <= 0xFAFF or 0x20000 <= o <= 0x3134F

# ── Thiều Chửu ──
s = open(os.path.join(RAW, 'dataV4.json'), encoding='utf8').read()
entries = json.loads(s[s.index('['):].rstrip().rstrip(';'))
READ, MEAN = {}, {}
WORDS = collections.defaultdict(collections.Counter)
EX = re.compile(r'\{([^{}]+)\}\s*\[([^\[\]]+)\]')
for e in entries:
    ch = chr(int(e['unicode'], 16))
    rs = [r.strip().lower() for r in re.split(r'[,;]', e['am_han'] or '') if r.strip()]
    if not rs:
        continue
    READ[ch] = rs
    senses = [x.strip() for x in (e['nghia'] or '').split('\n') if x.strip()]
    first = re.sub(r'\s+', ' ', senses[0] if senses else '')
    first = re.sub(r'\s*\([^)]*\)', '', first)
    MEAN[ch] = first[:150].rstrip(' ,;:') + ('…' if len(first) > 150 else '')
    for m in EX.finditer(e['nghia'] or ''):
        syl = m.group(1).lower().replace(',', ' ').split()
        han = [c for c in m.group(2) if is_han(c)]
        if 2 <= len(han) <= 4 and len(syl) == len(han):
            WORDS[''.join(han)][' '.join(syl)] += 1

# Từ sử học hay gặp (bổ sung, ưu tiên cao)
EXTRA = {
    '大越': 'đại việt', '長安': 'trường an', '行遣': 'hành khiển', '朝廷': 'triều đình', '入朝': 'nhập triều',
    '來朝': 'lai triều', '朝貢': 'triều cống', '本朝': 'bản triều', '明朝': 'minh triều', '還朝': 'hoàn triều',
    '降表': 'hàng biểu', '投降': 'đầu hàng', '乞降': 'khất hàng', '請降': 'thỉnh hàng', '降附': 'hàng phụ',
    '長子': 'trưởng tử', '長史': 'trưởng sử', '行營': 'hành dinh', '樂府': 'nhạc phủ', '重興': 'trùng hưng',
    '重光': 'trùng quang', '大行': 'đại hành', '行軍': 'hành quân', '將軍': 'tướng quân', '大將': 'đại tướng',
    '將兵': 'tướng binh', '率': 'suất', '都護': 'đô hộ', '節度': 'tiết độ', '交趾': 'giao chỉ', '九真': 'cửu chân',
    '日南': 'nhật nam', '占城': 'chiêm thành', '真臘': 'chân lạp', '昇龍': 'thăng long', '東京': 'đông kinh',
    '富春': 'phú xuân', '嘉定': 'gia định', '黃沙': 'hoàng sa', '長沙': 'trường sa', '萬里長沙': 'vạn lý trường sa',
    '白藤': 'bạch đằng', '支稜': 'chi lăng', '如月': 'như nguyệt', '藍山': 'lam sơn', '阮': 'nguyễn',
    '王都': 'vương đô', '山': 'sơn', '将兵': 'tướng binh', '将佐': 'tướng tá', '將佐': 'tướng tá', '将士': 'tướng sĩ', '將士': 'tướng sĩ',
    '諸將': 'chư tướng', '諸将': 'chư tướng', '部將': 'bộ tướng', '部将': 'bộ tướng', '大将': 'đại tướng', '将軍': 'tướng quân', '將校': 'tướng hiệu',
    '號': 'hiệu', '朝': 'triều', '治': 'trị', '屬': 'thuộc', '差': 'sai', '傳': 'truyền', '國號': 'quốc hiệu',
    '掌奇': 'chưởng cơ', '該奇': 'cai cơ', '管奇': 'quản cơ', '降級': 'giáng cấp', '降三': 'giáng tam', '降四': 'giáng tứ',
    '降二': 'giáng nhị', '降一': 'giáng nhất', '朝賀': 'triều hạ', '今朝': 'kim triều', '明朝': 'minh triều', '名將': 'danh tướng', '主將': 'chủ tướng', '良將': 'lương tướng', '將帥': 'tướng soái', '敗': 'bại', '數': 'số', '分': 'phân', '少': 'thiểu', '中國': 'trung quốc', '乘': 'thừa', '傳': 'truyền',
}
for w, r in EXTRA.items():
    WORDS[w][r] += 1000

# ── Dị thể (Unihan) ──
VAR = collections.defaultdict(list)
for fn in ('Unihan_Variants.txt',):
    for l in open(os.path.join(RAW, fn), encoding='utf8'):
        if l.startswith('#') or '\t' not in l:
            continue
        c, k, v = l.rstrip('\n').split('\t')
        if k in ('kTraditionalVariant', 'kSemanticVariant', 'kZVariant', 'kSimplifiedVariant', 'kSpecializedSemanticVariant', 'kCompatibilityVariant'):
            for u in v.split():
                VAR[chr(int(c[2:], 16))].append(chr(int(u.split('<')[0][2:], 16)))
UVI = {}
for l in open(os.path.join(RAW, 'Unihan_Readings.txt'), encoding='utf8'):
    if '\tkVietnamese\t' in l:
        c, _, v = l.rstrip('\n').split('\t')
        UVI[chr(int(c[2:], 16))] = v.split()
MANUAL_VAR = {'勑': '敕', '髙': '高', '旣': '既', '卽': '即', '靑': '青', '淸': '清', '敎': '教', '徃': '往', '収': '收', '㨿': '據', '噐': '器', '凣': '凡', '冦': '寇', '㓂': '寇', '皷': '鼓', '邉': '邊', '塩': '鹽', '粮': '糧', '靣': '面', '輙': '輒', '朞': '期', '属': '屬', '纪': '紀', '骑': '騎', '营': '營', '单': '單', '随': '隨', '将': '將', '潜': '潛', '静': '靜'}

# Chữ tên riêng ít gặp, từ điển không có
MANUAL_READ = {'鄚': ('mạc', 'Họ Mạc (dòng Mạc Cửu ở Hà Tiên)'), '㶞': ('nẵng', 'Chữ Nôm trong địa danh Đà Nẵng (沱㶞)'),
               '梉': ('tráng', 'Tên chúa Trịnh Tráng (鄭梉)'), '禛': ('chân', 'Tên vua Chân Lạp Nặc Chân (匿禛)'),
               '璘': ('lân', 'Ánh sáng của ngọc'), '虅': ('đằng', 'Dị thể của 藤 — dây leo'), '煚': ('quýnh', 'Lửa sáng')}

def lookup(ch):
    """→ (âm chính, [âm khác], nghĩa, chữ tra được)"""
    if ch in MANUAL_READ:
        return MANUAL_READ[ch][0], [], MANUAL_READ[ch][1], ch
    for c in [ch, MANUAL_VAR.get(ch, '')] + VAR.get(ch, []):
        if c and c in READ:
            return READ[c][0], READ[c][1:], MEAN.get(c, ''), c
    if ch in UVI:
        return UVI[ch][0], UVI[ch][1:], '', ch
    return None

Y = {'lí': 'lý', 'lì': 'lỳ', 'lĩ': 'lỹ', 'kì': 'kỳ', 'kí': 'ký', 'kỉ': 'kỷ', 'kĩ': 'kỹ', 'kị': 'kỵ', 'mĩ': 'mỹ', 'mỉ': 'mỷ'}

def transcribe(text):
    return [Y.get(r, r) if r else r for r in _transcribe(text)]

def _transcribe(text):
    out = [None] * len(text)
    i = 0
    while i < len(text):
        if not is_han(text[i]):
            i += 1
            continue
        hit = False
        for L in (4, 3, 2):
            w = text[i:i + L]
            if len(w) == L and all(is_han(c) for c in w) and w in WORDS:
                syl = WORDS[w].most_common(1)[0][0].split()
                for k in range(L):
                    out[i + k] = syl[k]
                i += L
                hit = True
                break
        if hit:
            continue
        if text[i] in WORDS and len(text[i]) == 1:
            out[i] = WORDS[text[i]].most_common(1)[0][0]
        else:
            r = lookup(text[i])
            out[i] = r[0] if r else None
        i += 1
    return out

passages = {}
for fn, prefix in (('toanthu-passages.json', ''), ('dntl-passages.json', 'dntl:')):
    p = os.path.join(DATA, fn)
    if os.path.exists(p):
        for k, v in json.load(open(p, encoding='utf8')).items():
            passages[prefix + k] = v

G, P, miss = {}, {}, set()
for k, text in passages.items():
    rd = transcribe(text)
    P[k] = rd
    for ch, r in zip(text, rd):
        if not is_han(ch):
            continue
        lk = lookup(ch)
        if not lk:
            miss.add(ch)
            continue
        main, alt, mean, _ = lk
        G[ch] = [main, alt, mean]

json.dump({'g': G, 'p': P}, open(os.path.join(DATA, 'hanviet.json'), 'w', encoding='utf8'), ensure_ascii=False, separators=(',', ':'))
total = sum(1 for t in passages.values() for c in t if is_han(c))
print(f'{len(passages)} đoạn, {len(G)} chữ, thiếu {len(miss)}: {"".join(sorted(miss))} ({total} chữ Hán)')
