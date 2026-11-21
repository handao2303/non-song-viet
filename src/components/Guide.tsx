import { useEffect } from 'react'
import type { Lang } from '../data/types'

const KEY = 'nsv-guide-seen'

export function guideSeen() {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

const STEPS: { icon: string; vi: [string, string]; en: [string, string] }[] = [
  { icon: '⟷', vi: ['Kéo dòng thời gian', 'Kéo thanh dưới cùng hoặc bấm ▶ để xem lãnh thổ đổi qua từng năm. Phím ← → để đi từng năm.'], en: ['Drag the timeline', 'Drag the bar at the bottom or press ▶ to watch borders change. Use ← → to step year by year.'] },
  { icon: '⌖', vi: ['Bấm vào bản đồ', 'Bấm bất kỳ đâu để xem vùng đất ấy thuộc về ai qua mọi thời kỳ.'], en: ['Click the map', 'Click anywhere to see who ruled that place across history.'] },
  { icon: '史', vi: ['Đọc sử gốc', 'Bấm một sự kiện để đọc nguyên văn Toàn thư hoặc Đại Nam thực lục, có phiên âm Hán Việt từng chữ.'], en: ['Read the source', 'Click an event to read the original Toàn thư or Đại Nam thực lục, with a Sino-Vietnamese reading for every character.'] },
  { icon: '⚔', vi: ['Xem trận đánh, nhân vật', 'Nút “Trận đánh · Nhân vật”: mũi tên tiến quân chạy trên bản đồ, hoặc đi theo cuộc đời Ngô Quyền, Trần Hưng Đạo, Quang Trung…'], en: ['Battles & people', 'Watch armies move on the map, or follow the lives of Ngô Quyền, Trần Hưng Đạo, Quang Trung…'] },
  { icon: '◧', vi: ['So sánh hai năm', 'Nút “So sánh”: kéo vạch giữa màn hình để đặt hai thời kỳ cạnh nhau, ví dụ 1069 và 1802.'], en: ['Compare two years', 'Drag the divider to put two eras side by side, e.g. 1069 and 1802.'] },
  { icon: '◐', vi: ['Đọc màu bản đồ', 'Mỗi màu là một thế lực. Rê chuột vào “Thế lực trên bản đồ” để làm nổi vùng ấy; vùng xanh nét đứt là đất vừa mở cõi.'], en: ['Read the colours', 'Each colour is a power. Hover “Powers on the map” to highlight one; green dashed areas are newly gained lands.'] },
]

export default function Guide({ lang, onClose, onTour }: { lang: Lang; onClose: () => void; onTour: () => void }) {
  const close = () => {
    try {
      localStorage.setItem(KEY, '1')
    } catch {
      /* trình duyệt chặn lưu trữ — bỏ qua */
    }
    onClose()
  }
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  })
  const vi = lang === 'vi'
  return (
    <div className="guide-backdrop" onClick={close}>
      <div className="guide glass" role="dialog" aria-modal="true" aria-labelledby="guide-title" onClick={(e) => e.stopPropagation()}>
        <span className="logo guide-logo" aria-hidden />
        <h2 id="guide-title" className="font-serif text-[26px] leading-tight">{vi ? 'Non Sông Việt' : 'Vietnam Through Time'}</h2>
        <p className="mt-1 text-[14px] text-ink/70">
          {vi ? 'Hơn 2.700 năm lãnh thổ, triều đại và sự kiện Việt Nam trên một tấm bản đồ — niên đại theo Đại Việt sử ký toàn thư.' : '2,700 years of Vietnamese territory, dynasties and events on one map — dates follow the Đại Việt sử ký toàn thư.'}
        </p>
        <ol className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {STEPS.map((s) => (
            <li key={s.icon} className="guide-step">
              <span className="guide-icon">{s.icon}</span>
              <span>
                <b>{s[lang][0]}</b>
                <span className="block text-[12.5px] leading-snug text-ink/70">{s[lang][1]}</span>
              </span>
            </li>
          ))}
        </ol>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            className="guide-btn ghost"
            onClick={() => {
              close()
              onTour()
            }}
          >
            🧭 {vi ? 'Xem Hành trình Nam tiến' : 'Watch the March South'}
          </button>
          <button className="guide-btn" onClick={close} autoFocus>
            {vi ? 'Bắt đầu khám phá' : 'Start exploring'} →
          </button>
        </div>
      </div>
    </div>
  )
}
