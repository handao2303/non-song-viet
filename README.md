# Non Sông Việt — Bản đồ lịch sử Việt Nam

Bản đồ tương tác lãnh thổ, triều đại, kinh đô và sự kiện Việt Nam từ **700 TCN → nay**.

## Tính năng

- **Dòng thời gian** thang phi tuyến (thời cổ nén, cận – hiện đại giãn), nút phát, tốc độ 0.5–4×
- **Lãnh thổ theo năm**: Văn Lang → Âu Lạc → Bắc thuộc → Ngô, Đinh, Tiền Lê, Lý, Trần, Hồ → Lê sơ → Mạc / Lê trung hưng → Trịnh – Nguyễn → Tây Sơn → Nguyễn → Pháp thuộc → hai miền → CHXHCN; cùng Chăm Pa, Phù Nam, Chân Lạp, Lan Xang, Xiêm, các triều Trung Hoa
- **Tra cứu một điểm** (bấm bất kỳ đâu): vùng đất ấy thuộc về ai qua từng thời kỳ + năm nhập vào Đại Việt
- **Biểu đồ diện tích** lãnh thổ người Việt cai quản theo thời gian
- **~95 sự kiện** có toạ độ, **~30 kinh đô / trị sở**, tìm kiếm không dấu (⌘K)
- **Hành trình Nam tiến**: tour tự động 1069 → 1802
- **Diễn biến 12 trận đánh**: mũi tên tiến quân chạy trên bản đồ theo từng mốc — Bạch Đằng 938, Lê Hoàn phá Tống 981, Như Nguyệt 1076, Đông Bộ Đầu 1258, Chương Dương – Hàm Tử 1285, Bạch Đằng 1288, Chi Lăng – Xương Giang 1427, Rạch Gầm – Xoài Mút 1785, Ngọc Hồi – Đống Đa 1789, Biên giới 1950, Điện Biên Phủ 1954, Đại thắng mùa Xuân 1975
- **Hành trình nhân vật**: 18 nhân vật có chân dung minh hoạ (Hai Bà Trưng, Lý Nam Đế, Ngô Quyền, Đinh Bộ Lĩnh, Lê Hoàn, Trần Hưng Đạo, Lê Thánh Tông, Nguyễn Hoàng, Quang Trung, Phan Bội Châu, Hồ Chí Minh…)
- **Đọc nguyên văn có phiên âm Hán Việt**: rê chuột / chạm vào từng chữ để xem âm và nghĩa, bật "âm trên chữ", dòng phiên âm đầy đủ
- **Hoàng Sa – Trường Sa**: lớp quần đảo và các mốc sử liệu chủ quyền (1686 → 2025)
- **Tên gọi qua các thời**: bấm vào một tỉnh để xem Long Biên → Tống Bình → Đại La → Thăng Long → Hà Nội…
- **So sánh hai năm**: chia đôi màn hình, kéo vạch giữa, `?year=1069&cmp=1802`
- Song ngữ **Việt / Anh**, link chia sẻ: `?year=1306&trace=107.58,16.46&lang=vi`
- Phím tắt: `←/→` 1 năm · `Shift` 10 năm · `PgUp/PgDn` hoặc `[ ]` mốc thay đổi · `Space` phát · `Esc` đóng tra cứu

## Công nghệ

React 19 · TypeScript · Vite 8 · Tailwind CSS 4 · MapLibre GL 6 · TopoJSON · d3-geo · polylabel

## Chạy

```bash
npm install
npm run dev                  # chạy thử
npm run build                # xuất dist/ tĩnh (Vercel / Netlify / GitHub Pages)
node scripts/build-geo.mjs   # tạo lại public/data từ scripts/raw
python3 scripts/build-toanthu.py  # trích đoạn Toàn thư
python3 scripts/build-dntl.py     # trích đoạn Đại Nam thực lục
python3 scripts/build-hanviet.py  # phiên âm Hán Việt cho các đoạn trích
```

## Dữ liệu

| File | Nội dung |
| --- | --- |
| `src/data/territory.ts` | Tỉnh → vùng lịch sử → năm nhập + chính thể cai quản theo năm |
| `src/data/polities.ts` | Chính thể, màu, quốc hiệu đổi theo năm |
| `src/data/periods.ts` | 24 thời kỳ: quốc hiệu, người sáng lập, kinh đô, tóm tắt, các đời vua |
| `src/data/events.ts` | Sự kiện song ngữ có toạ độ (thêm 1 dòng vào `rows` để thêm sự kiện) |
| `src/data/capitals.ts` | Kinh đô, trị sở đô hộ, kinh đô Chăm Pa, cảng thị |
| `src/data/stories.ts` | Diễn biến trận đánh và hành trình nhân vật (các bước, mũi tên, mốc) |
| `src/data/islands.ts` | Đảo Hoàng Sa, Trường Sa và mốc sử liệu |
| `src/data/adminNames.ts` | Tên hành chính qua các thời theo tỉnh / vùng |
| `src/data/toanthu.ts`, `src/data/thuclu.ts` | Trích dẫn Toàn thư và Đại Nam thực lục cho từng sự kiện |

## Nguồn dữ liệu

**Bản đồ (tải trực tiếp, có giấy phép mở):**
- Ranh giới tỉnh: [geoBoundaries](https://www.geoboundaries.org/) VNM ADM1 (CC BY 4.0) — 63 tỉnh trước sáp nhập 2025
- Láng giềng, sông ngòi: [Natural Earth](https://www.naturalearthdata.com/) (public domain)
- Địa hình: AWS Terrain Tiles (SRTM, GMTED2010)

**Nội dung lịch sử — chuẩn: *Đại Việt sử ký toàn thư***
- Niên đại, thời kỳ, đời vua từ Hồng Bàng đến năm 1789 được đối chiếu với **nguyên văn chữ Hán** của Toàn thư
  (Ngoại kỷ 5 quyển, Bản kỷ 19 quyển, Tục biên 5 quyển) trên
  [Wikisource 大越史記全書](https://zh.wikisource.org/wiki/大越史記全書), bằng cách đổi năm can chi sang dương lịch.
- Mỗi sự kiện có trích quyển + một câu nguyên văn (`src/data/toanthu.ts`); app hiện trích dẫn khi bấm vào sự kiện.
- Theo cách chia kỷ của Toàn thư: Âu Lạc 257–208 TCN, **nhà Triệu được xếp vào chính thống** (207–111 TCN),
  Tiền Lý 541–602, Đinh 968–980, Tiền Lê 981–1009, Lý 1010–1225, Trần từ 1226, Hậu Trần 1407–1413…
- Sự kiện Toàn thư không chép (khảo cổ, việc Đàng Trong, Tây Sơn khởi nghĩa 1771…) được đánh dấu rõ "ngoài Toàn thư".
- Việc Đàng Trong (1558–1777) và **1789–1888** được đối chiếu với **nguyên văn *Đại Nam thực lục***
  (Tiền biên và Chính biên kỷ I–VI) trên [Wikisource 大南寔錄](https://zh.wikisource.org/wiki/大南寔錄)
  (`src/data/thuclu.ts`). Nhờ đó sửa năm quốc hiệu **Đại Nam thành 1838** (Mậu Tuất, Minh Mạng 19), ghi chú
  Thực lục chép Tây Sơn chiếm Quy Nhơn năm 1773.
- Sau 1888 (thời Pháp, hiện đại): theo mốc phổ thông và văn bản hành chính, không có sử triều Nguyễn để đối chiếu.

**Phiên âm Hán Việt:** âm và nghĩa theo *Hán Việt tự điển* của Thiều Chửu (1942, tác phẩm thuộc phạm vi công cộng;
bản số hoá từ [tu-dien-thieu-chuu](https://github.com/tranminhhuydn/tu-dien-thieu-chuu)), chữ dị thể tra qua
[Unihan](https://www.unicode.org/charts/unihan.html). Chữ đa âm được chọn theo từ ghép trong ví dụ của từ điển;
tên riêng có thể còn đọc sai.

> Ranh giới là sơ đồ ước lượng dựng từ đơn vị tỉnh hiện đại, không phải bản đồ khảo sát.
> Một số mốc (năm nhập Tây Ninh, Tây Nguyên, phạm vi Tây Sơn – Nguyễn Ánh) đã được đơn giản hoá.
