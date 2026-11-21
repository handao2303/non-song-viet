#!/usr/bin/env bash
# Tải nguyên văn Đại Nam thực lục (Tiền biên + Chính biên kỷ I–VI) từ zh.wikisource vào scripts/raw/dntl
set -e
cd "$(dirname "$0")/raw/dntl"
UA="non-song-viet/1.0"
for k in 前編 正編第一紀 正編第二紀 正編第三紀 正編第四紀 正編第五紀 正編第六紀; do
  curl -sA "$UA" --get "https://zh.wikisource.org/w/api.php" --data-urlencode "action=query" --data-urlencode "list=allpages" \
    --data-urlencode "apprefix=大南寔錄/大南寔錄${k}/" --data-urlencode "aplimit=500" --data-urlencode "format=json" |
    python3 -c "import sys,json;print('\n'.join(x['title'] for x in json.load(sys.stdin)['query']['allpages'] if '卷' in x['title']))" |
    while read -r t; do
      f="$(echo "$t" | sed 's#大南寔錄/大南寔錄##; s#/#_#g').txt"
      [ -s "$f" ] && continue
      curl -sA "$UA" --get "https://zh.wikisource.org/w/index.php" --data-urlencode "title=$t" --data-urlencode "action=raw" -o "$f"
      sleep 0.3
    done
done
