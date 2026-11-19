# Non Sông Việt — Bản đồ lịch sử Việt Nam

Bản đồ tương tác lãnh thổ, triều đại, kinh đô và sự kiện Việt Nam từ **700 TCN → nay**.

## Tính năng

- **Dòng thời gian** thang phi tuyến (thời cổ nén, cận – hiện đại giãn), nút phát, tốc độ 0.5–4×
- **Lãnh thổ theo năm**: Văn Lang → Âu Lạc → Bắc thuộc → Ngô, Đinh, Tiền Lê, Lý, Trần, Hồ → Lê sơ → Mạc / Lê trung hưng → Trịnh – Nguyễn → Tây Sơn → Nguyễn → Pháp thuộc → hai miền → CHXHCN; cùng Chăm Pa, Phù Nam, Chân Lạp, Lan Xang, Xiêm, các triều Trung Hoa
- **Tra cứu một điểm** (bấm bất kỳ đâu): vùng đất ấy thuộc về ai qua từng thời kỳ + năm nhập vào Đại Việt
- **Biểu đồ diện tích** lãnh thổ người Việt cai quản theo thời gian
- **~95 sự kiện** có toạ độ, **~30 kinh đô / trị sở**, tìm kiếm không dấu (⌘K)
- **Hành trình Nam tiến**: tour tự động 1069 → 1802
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
```

## Dữ liệu

| File | Nội dung |
| --- | --- |
| `src/data/territory.ts` | Tỉnh → vùng lịch sử → năm nhập + chính thể cai quản theo năm |
| `src/data/polities.ts` | Chính thể, màu, quốc hiệu đổi theo năm |
| `src/data/periods.ts` | 24 thời kỳ: quốc hiệu, người sáng lập, kinh đô, tóm tắt, các đời vua |
| `src/data/events.ts` | Sự kiện song ngữ có toạ độ (thêm 1 dòng vào `rows` để thêm sự kiện) |
| `src/data/capitals.ts` | Kinh đô, trị sở đô hộ, kinh đô Chăm Pa, cảng thị |

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
- Sau 1789 (nhà Nguyễn, thời Pháp, hiện đại): theo mốc phổ thông, **chưa đối chiếu** với tài liệu gốc.

> Ranh giới là sơ đồ ước lượng dựng từ đơn vị tỉnh hiện đại, không phải bản đồ khảo sát.
> Một số mốc (năm nhập Tây Ninh, Tây Nguyên, phạm vi Tây Sơn – Nguyễn Ánh) đã được đơn giản hoá.
