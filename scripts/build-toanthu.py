"""Trích đoạn nguyên văn Toàn thư quanh mỗi câu dẫn → src/data/toanthu-passages.json
Nguồn: scripts/raw/toanthu (wikitext từ zh.wikisource.org/wiki/大越史記全書, phạm vi công cộng)."""
import json, os, re, glob
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, 'scripts/raw/toanthu')
FILE = {}
for i in range(1, 6): FILE['NK%d' % i] = '%02d' % (i + 1)
for i in range(1, 20): FILE['BK%d' % i] = '%02d' % (i + 6)
for i in range(1, 6): FILE['TB%d' % i] = '%02d' % (i + 25)

def clean(t):
    t = re.sub(r'\{\{annotate\|[^{}]*\}\}', '', t)
    t = re.sub(r'<sub>.*?</sub>|<small>|</small>|<br\s*/?>', '', t)
    t = re.sub(r'-\{([^}]*)\}-', r'\1', t)
    t = re.sub(r'\{\{[^{}]*\}\}', '', t)
    t = re.sub(r"'''|==+|\[\[[^\]|]*\||\]\]|\[\[", '', t)
    t = re.sub(r'\s+', ' ', t)
    return t

texts = {}
for f in glob.glob(os.path.join(RAW, '*.txt')):
    texts[os.path.basename(f)[:2]] = clean(open(f, encoding='utf-8').read())

# đọc TT (vol, quote) từ toanthu.ts
src = open(os.path.join(ROOT, 'src/data/toanthu.ts'), encoding='utf-8').read()
pairs = re.findall(r"^\s+(\w+): \{ vol: '(\w+)', quote: '([^']+)'", src, re.M)
out, miss = {}, []
for key, vol, quote in pairs:
    t = texts[FILE[vol]]
    q = quote.rstrip('…')
    i = t.find(q)
    if i < 0:
        miss.append(key); continue
    # mở rộng ra 2 câu trước và ~3 câu sau, tối đa ~320 ký tự
    a = i
    for _ in range(2):
        j = t.rfind('。', 0, a - 1)
        if j < 0 or i - j > 160: break
        a = j + 1
    b = i + len(q)
    for _ in range(3):
        j = t.find('。', b + 1)
        if j < 0 or j - i > 300: break
        b = j + 1
    out[key] = t[a:b].strip()
json.dump(out, open(os.path.join(ROOT, 'src/data/toanthu-passages.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
print('ok', len(out), 'miss', miss)
