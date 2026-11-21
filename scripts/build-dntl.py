"""
Trích đoạn nguyên văn Đại Nam thực lục quanh mỗi câu dẫn trong src/data/thuclu.ts.
Đầu vào : scripts/raw/dntl/*.txt (wikitext tải từ zh.wikisource, mỗi quyển một tệp)
Đầu ra  : src/data/dntl-passages.json
"""
import json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, 'scripts', 'raw', 'dntl')
SRC = os.path.join(ROOT, 'src', 'data', 'thuclu.ts')

def clean(s):
    s = s.split('<onlyinclude>', 1)[-1]
    s = re.sub(r'<ref[^>]*>.*?</ref>', '', s, flags=re.S)
    s = re.sub(r'\{\{\*\|([^{}]*)\}\}', r'（\1）', s)  # chú thích nhỏ
    s = re.sub(r'\{\{[^{}]*\}\}', '', s)
    s = re.sub(r'\[\[[^\]|]*\|([^\]]*)\]\]', r'\1', s)
    s = re.sub(r'\[\[([^\]]*)\]\]', r'\1', s)
    s = re.sub(r'<[^>]+>', '', s)
    s = re.sub(r"'''?", '', s)
    s = re.sub(r'\s+', '', s)  # bản kỷ II–VI xuống dòng theo bản khắc
    return s.replace('“', '「').replace('”', '」')

def fname(part, vol):
    for pad in (3, 2, 1):
        f = os.path.join(RAW, f'{part}_卷{str(vol).zfill(pad)}.txt')
        if os.path.exists(f):
            return f
    raise FileNotFoundError(f'{part} 卷{vol}')

ENT = re.compile(r"^\s+(\w+): \{ part: '([^']+)', vol: (\d+), quote: '([^']+)'", re.M)
out, miss = {}, []
for eid, part, vol, quote in ENT.findall(open(SRC, encoding='utf8').read()):
    t = clean(open(fname(part, int(vol)), encoding='utf8').read())
    i = t.find(quote)
    if i < 0:
        miss.append(eid)
        continue
    # lùi 2 câu, tiến 3 câu (ngắt ở 。), tối đa ~320 chữ
    a = i
    for _ in range(2):
        j = t.rfind('。', 0, a - 1)
        if j < 0 or i - j > 200:
            break
        a = j + 1
    b = i + len(quote)
    for _ in range(3):
        j = t.find('。', b)
        if j < 0 or j - i > 260:
            break
        b = j + 1
    if a == i and b == i + len(quote):  # văn bản không chấm câu (kỷ V–VI): lấy cửa sổ ký tự
        a, b = max(0, i - 110), min(len(t), i + len(quote) + 170)
    out[eid] = t[max(a, i - 200):b]

json.dump(out, open(os.path.join(ROOT, 'src', 'data', 'dntl-passages.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=0)
print(f'{len(out)} đoạn; không tìm thấy: {miss}')
