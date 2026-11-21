import { useId } from 'react'

/**
 * Chân dung minh hoạ (SVG, vẽ tay theo kiểu tranh dân gian) — không phải chân dung thật,
 * chỉ gợi đặc điểm trang phục từng thời: mũ trụ, mũ xung thiên, mũ cánh chuồn, áo giáp, áo kaki…
 */

type Hat = 'queen' | 'warrior-queen' | 'helmet' | 'crown' | 'official' | 'hcm' | 'general' | 'turban' | 'khanvan'
type Beard = 'none' | 'mustache' | 'short' | 'long' | 'goatee-white' | 'full'

interface Look {
  hat: Hat
  beard: Beard
  robe: string
  trim: string
  bg: string
  armor?: boolean
  female?: boolean
  skin?: string
  hair?: string
  pair?: boolean
}

export const LOOKS: Record<string, Look> = {
  'p-trung': { hat: 'queen', beard: 'none', robe: '#8b2e1f', trim: '#e0b04a', bg: '#f3d9c4', female: true, pair: true },
  'p-batrieu': { hat: 'warrior-queen', beard: 'none', robe: '#c9952b', trim: '#8b2e1f', bg: '#f5e3bd', female: true, armor: true },
  'p-ngoquyen': { hat: 'helmet', beard: 'short', robe: '#6e4a2a', trim: '#c9952b', bg: '#d9e4e6', armor: true },
  'p-lythaito': { hat: 'crown', beard: 'mustache', robe: '#d6a51c', trim: '#8b2e1f', bg: '#f6e7c1' },
  'p-lythuongkiet': { hat: 'helmet', beard: 'none', robe: '#7a3b2a', trim: '#d6a51c', bg: '#e8d6c9', armor: true },
  'p-tranhungdao': { hat: 'helmet', beard: 'long', robe: '#8a2d1e', trim: '#e0b04a', bg: '#e9d2c6', armor: true },
  'p-leloi': { hat: 'crown', beard: 'full', robe: '#d9a81e', trim: '#7a2a1a', bg: '#f1e2bd' },
  'p-nguyentrai': { hat: 'official', beard: 'long', robe: '#2e4a6b', trim: '#c9a24a', bg: '#d8e0ea' },
  'p-quangtrung': { hat: 'turban', beard: 'full', robe: '#a3261b', trim: '#e0b04a', bg: '#f0d3c8', armor: true },
  'p-gialong': { hat: 'khanvan', beard: 'goatee-white', robe: '#d6a51c', trim: '#2e4a6b', bg: '#efe2c2', hair: '#3a3530' },
  'p-hochiminh': { hat: 'hcm', beard: 'goatee-white', robe: '#b9a57a', trim: '#8e7c55', bg: '#e6e0cf', hair: '#d9d4cb' },
  'p-vonguyengiap': { hat: 'general', beard: 'none', robe: '#5d6b3f', trim: '#c0392b', bg: '#dfe3d3' },
}

const INK = '#2a1f18'

function Figure({ look, uid }: { look: Look; uid: string }) {
  const skin = look.skin ?? '#ecc7a0'
  const hair = look.hair ?? '#231a14'
  const f = look.female
  return (
    <g>
      {/* tóc dài phía sau (nữ) */}
      {f && <path d="M31 40 C28 62 30 78 36 86 L64 86 C70 78 72 62 69 40 Z" fill={hair} />}
      {/* thân, áo */}
      <path d="M12 102 C14 80 28 71 50 71 C72 71 86 80 88 102 Z" fill={look.robe} />
      {look.armor && (
        <>
          <path d="M12 102 C14 80 28 71 50 71 C72 71 86 80 88 102 Z" fill={`url(#${uid}-scale)`} opacity="0.55" />
          <ellipse cx="24" cy="82" rx="12" ry="8" fill={look.trim} opacity="0.9" transform="rotate(-25 24 82)" />
          <ellipse cx="76" cy="82" rx="12" ry="8" fill={look.trim} opacity="0.9" transform="rotate(25 76 82)" />
        </>
      )}
      {look.hat === 'hcm' || look.hat === 'general' ? (
        // áo cổ đứng / quân phục
        <>
          <path d="M40 70 L50 82 L60 70 L57 68 L50 76 L43 68 Z" fill={look.trim} />
          {look.hat === 'general' && (
            <>
              <rect x="30" y="74" width="9" height="5" rx="1" fill="#c0392b" transform="rotate(-18 34 76)" />
              <rect x="61" y="74" width="9" height="5" rx="1" fill="#c0392b" transform="rotate(18 66 76)" />
              <path d="M34.5 75.2 l.8 1.6 1.7.2 -1.3 1.1 .4 1.7 -1.6 -.9 -1.5 .9 .4 -1.7 -1.3 -1.1 1.7 -.2 Z" fill="#f3c623" transform="rotate(-18 34 76)" />
              <path d="M65.5 75.2 l.8 1.6 1.7.2 -1.3 1.1 .4 1.7 -1.6 -.9 -1.5 .9 .4 -1.7 -1.3 -1.1 1.7 -.2 Z" fill="#f3c623" transform="rotate(18 66 76)" />
            </>
          )}
          <circle cx="50" cy="88" r="1.4" fill={look.trim} />
          <circle cx="50" cy="95" r="1.4" fill={look.trim} />
        </>
      ) : (
        // cổ áo giao lĩnh
        <>
          <path d="M37 71 L50 90 L63 71 L59 70 L50 83 L41 70 Z" fill={look.trim} />
          <path d="M41 70 L50 83 L59 70" fill="none" stroke={INK} strokeOpacity=".25" strokeWidth=".8" />
        </>
      )}
      {/* cổ */}
      <path d="M44 58 L44 71 Q50 75 56 71 L56 58 Z" fill={skin} />
      <path d="M44 66 Q50 70 56 66" fill="none" stroke="#000" strokeOpacity=".08" strokeWidth="3" />
      {/* tóc phía sau đầu */}
      <ellipse cx="50" cy="38" rx="17.5" ry="16" fill={hair} />
      {/* tai */}
      <ellipse cx="33.5" cy="46" rx="3" ry="4.5" fill={skin} />
      <ellipse cx="66.5" cy="46" rx="3" ry="4.5" fill={skin} />
      {f && (
        <>
          <circle cx="33.5" cy="51.5" r="1.6" fill="#e0b04a" />
          <circle cx="66.5" cy="51.5" r="1.6" fill="#e0b04a" />
        </>
      )}
      {/* mặt */}
      <path d="M34.5 40 C34.5 28 65.5 28 65.5 40 L65 50 C64 60 57 66 50 66 C43 66 36 60 35 50 Z" fill={skin} />
      <ellipse cx="41" cy="53" rx="3.2" ry="2" fill="#d9846b" opacity={f ? 0.35 : 0.15} />
      <ellipse cx="59" cy="53" rx="3.2" ry="2" fill="#d9846b" opacity={f ? 0.35 : 0.15} />
      {/* mắt, mày, mũi, miệng */}
      <path d={f ? 'M39.5 42 Q43 40.5 46.5 42' : 'M38.5 41.5 Q43 39 47 41.2'} stroke={look.hat === 'hcm' ? '#8d867c' : INK} strokeWidth={f ? 0.9 : 1.6} fill="none" strokeLinecap="round" />
      <path d={f ? 'M53.5 42 Q57 40.5 60.5 42' : 'M53 41.2 Q57 39 61.5 41.5'} stroke={look.hat === 'hcm' ? '#8d867c' : INK} strokeWidth={f ? 0.9 : 1.6} fill="none" strokeLinecap="round" />
      <path d="M40.5 46 Q43 44.6 45.5 46 Q43 46.9 40.5 46 Z" fill={INK} />
      <path d="M54.5 46 Q57 44.6 59.5 46 Q57 46.9 54.5 46 Z" fill={INK} />
      {f && (
        <>
          <path d="M40 45.4 l-1 -.8" stroke={INK} strokeWidth=".6" />
          <path d="M60 45.4 l1 -.8" stroke={INK} strokeWidth=".6" />
        </>
      )}
      <path d="M50 47 Q48.3 52.5 49.6 53.4 Q51 53.8 52 53" fill="none" stroke="#b07a5a" strokeWidth=".9" strokeLinecap="round" />
      <path d={f ? 'M46.5 57.6 Q50 59.6 53.5 57.6 Q50 57 46.5 57.6 Z' : 'M46.5 57.8 Q50 59.2 53.5 57.8'} fill={f ? '#b8433a' : 'none'} stroke={f ? 'none' : '#8b4a3a'} strokeWidth="1" strokeLinecap="round" />
      {/* râu */}
      {look.beard === 'mustache' && <path d="M43.5 56.2 Q47 54 50 55.4 Q53 54 56.5 56.2 Q53 55.6 50 56.6 Q47 55.6 43.5 56.2 Z" fill={hair} />}
      {(look.beard === 'short' || look.beard === 'full') && (
        <>
          <path d="M43 56.2 Q47 53.8 50 55.2 Q53 53.8 57 56.2 Q53 55.8 50 56.6 Q47 55.8 43 56.2 Z" fill={hair} />
          <path
            d={look.beard === 'full' ? 'M35.5 50 Q37 66 50 71 Q63 66 64.5 50 Q61 60 55 60.5 Q50 62 45 60.5 Q39 60 35.5 50 Z' : 'M41 59.5 Q44 66.5 50 67.5 Q56 66.5 59 59.5 Q55 61.5 50 61.6 Q45 61.5 41 59.5 Z'}
            fill={hair}
          />
        </>
      )}
      {look.beard === 'long' && (
        <>
          <path d="M42.5 56.4 Q46 53.5 50 55.2 Q54 53.5 57.5 56.4 Q54 55.4 50 56.6 Q46 55.4 42.5 56.4 Z" fill={hair} />
          <path d="M45 60 Q46 74 50 82 Q54 74 55 60 Q52 61.5 50 61.4 Q48 61.5 45 60 Z" fill={hair} />
          <path d="M42.5 56.5 Q39.5 64 41 72" fill="none" stroke={hair} strokeWidth="1.1" strokeLinecap="round" />
          <path d="M57.5 56.5 Q60.5 64 59 72" fill="none" stroke={hair} strokeWidth="1.1" strokeLinecap="round" />
        </>
      )}
      {look.beard === 'goatee-white' && (
        <>
          <path d="M44 56.2 Q47 54.5 50 55.6 Q53 54.5 56 56.2 Q53 55.8 50 56.7 Q47 55.8 44 56.2 Z" fill={look.hat === 'hcm' ? '#e9e5dd' : hair} />
          <path d="M47 61 Q48 70 50 75 Q52 70 53 61 Q50 62.4 47 61 Z" fill={look.hat === 'hcm' ? '#ece8e1' : hair} />
        </>
      )}
      {/* mũ / tóc phía trước */}
      <Hat look={look} hair={hair} />
    </g>
  )
}

function Hat({ look, hair }: { look: Look; hair: string }) {
  switch (look.hat) {
    case 'queen':
      return (
        <g>
          <path d="M34 40 C33 27 67 27 66 40 C61 33 39 33 34 40 Z" fill={hair} />
          <ellipse cx="50" cy="22" rx="10" ry="7.5" fill={hair} />
          <path d="M34.5 36 C40 31 60 31 65.5 36 L65 39 C60 34.5 40 34.5 35 39 Z" fill="#b8352a" />
          <path d="M50 14 L52.5 20 L50 23 L47.5 20 Z" fill="#e0b04a" />
          <circle cx="50" cy="36.2" r="1.8" fill="#e0b04a" />
        </g>
      )
    case 'warrior-queen':
      return (
        <g>
          <path d="M34 40 C33 27 67 27 66 40 C61 33 39 33 34 40 Z" fill={hair} />
          <ellipse cx="50" cy="21" rx="9" ry="7" fill={hair} />
          <path d="M33.5 38 C36 26 64 26 66.5 38 L64 38.5 C58 33 42 33 36 38.5 Z" fill="#e0b04a" />
          <path d="M49 13 C47 7 52 4 55 2" stroke="#b8352a" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M45 38 L50 31 L55 38" fill="#b8352a" />
        </g>
      )
    case 'helmet':
      return (
        <g>
          <path d="M31.5 41 C31 22 69 22 68.5 41 L66 42 L34 42 Z" fill="#6f5a3c" />
          <path d="M31.5 41 C31 22 69 22 68.5 41" fill="none" stroke="#3b2e1e" strokeWidth=".8" />
          <path d="M40 26 C44 23 56 23 60 26" fill="none" stroke="#c9a45a" strokeWidth="1.2" />
          <rect x="30" y="38.5" width="40" height="4.5" rx="2" fill="#c9a45a" />
          <path d="M30.5 42 L30 55 Q32 57 34.5 55 L35 42 Z" fill="#6f5a3c" />
          <path d="M69.5 42 L70 55 Q68 57 65.5 55 L65 42 Z" fill="#6f5a3c" />
          <path d="M50 21 L50 13" stroke="#c9a45a" strokeWidth="2" />
          <path d="M50 14 C44 10 43 3 47 0 C49 5 53 5 55 1 C58 6 55 12 50 14 Z" fill="#c0392b" />
          <circle cx="50" cy="40.7" r="2" fill="#c0392b" />
        </g>
      )
    case 'crown':
      return (
        <g>
          <path d="M36 26 C34 16 40 10 42 8 C43 14 43 20 42 27 Z" fill="#d6a51c" stroke="#8a6512" strokeWidth=".6" />
          <path d="M64 26 C66 16 60 10 58 8 C57 14 57 20 58 27 Z" fill="#d6a51c" stroke="#8a6512" strokeWidth=".6" />
          <path d="M33 41 L35 26 C42 20 58 20 65 26 L67 41 Z" fill="#e3b630" stroke="#8a6512" strokeWidth=".7" />
          <rect x="32.5" y="37" width="35" height="5" rx="1.5" fill="#b8352a" />
          <circle cx="50" cy="30" r="2.6" fill="#b8352a" stroke="#fff3c4" strokeWidth=".6" />
          <circle cx="41" cy="31.5" r="1.4" fill="#2e7d6b" />
          <circle cx="59" cy="31.5" r="1.4" fill="#2e7d6b" />
          <path d="M38 39.5 h24" stroke="#f3d27a" strokeWidth=".8" strokeDasharray="1.5 1.5" />
        </g>
      )
    case 'official':
      return (
        <g>
          <ellipse cx="20" cy="33" rx="12" ry="3.2" fill="#1d1a17" transform="rotate(-6 20 33)" />
          <ellipse cx="80" cy="33" rx="12" ry="3.2" fill="#1d1a17" transform="rotate(6 80 33)" />
          <path d="M33.5 41 C33 25 67 25 66.5 41 Z" fill="#1d1a17" />
          <path d="M37 27 C41 18 59 18 63 27 Z" fill="#1d1a17" />
          <rect x="33" y="37.5" width="34" height="3.5" rx="1" fill="#3a332c" />
        </g>
      )
    case 'turban':
      return (
        <g>
          <path d="M32.5 41 C31 23 69 23 67.5 41 C62 35 38 35 32.5 41 Z" fill="#b8352a" />
          <path d="M33 37 C40 31 60 31 67 37" fill="none" stroke="#7a1f15" strokeWidth="1.2" />
          <path d="M34 33 C41 27 59 27 66 33" fill="none" stroke="#7a1f15" strokeWidth="1.2" />
          <path d="M66 36 C72 40 74 48 70 56" fill="none" stroke="#b8352a" strokeWidth="3" strokeLinecap="round" />
          <circle cx="50" cy="33" r="2.4" fill="#e0b04a" />
        </g>
      )
    case 'khanvan':
      // khăn vấn vàng của vua nhà Nguyễn
      return (
        <g>
          <path d="M31 42 C27 17 73 17 69 42 C62 37.5 38 37.5 31 42 Z" fill="#e3b630" stroke="#8a6512" strokeWidth=".7" />
          <path d="M32.5 38.5 C40 33 60 33 67.5 38.5" fill="none" stroke="#a87b14" strokeWidth="1.1" />
          <path d="M33 34.5 C41 29 59 29 67 34.5" fill="none" stroke="#a87b14" strokeWidth="1.1" />
          <path d="M35 30.5 C43 25 57 25 65 30.5" fill="none" stroke="#a87b14" strokeWidth="1.1" />
          <path d="M39 26 C45 22.5 55 22.5 61 26" fill="none" stroke="#a87b14" strokeWidth="1.1" />
          <path d="M46 41 L50 36 L54 41" fill="none" stroke="#a87b14" strokeWidth="1" />
        </g>
      )
    case 'hcm':
      return (
        <g>
          <path d="M33.5 42 C33 30 40 25 50 25 C60 25 67 30 66.5 42 C64 34 60 31 55 31 C50 30 44 31 40 33 C36 35 35 38 33.5 42 Z" fill="#d9d4cb" />
        </g>
      )
    case 'general':
      return (
        <g>
          <path d="M33.5 42 C32 28 40 23 51 23 C62 23 68 29 66.5 42 C65 35 62 31 57 30 C52 31 45 31 40 32.5 C36 34 34.5 38 33.5 42 Z" fill={hair} />
          <path d="M57 30 C54 32 50 33 46 33" fill="none" stroke="#000" strokeOpacity=".3" strokeWidth=".7" />
        </g>
      )
  }
}

export default function Portrait({ id, size = 46, className = '' }: { id: string; size?: number; className?: string }) {
  const uid = useId().replace(/:/g, '')
  const look = LOOKS[id]
  if (!look) return null
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={`portrait ${className}`} role="img" aria-hidden>
      <defs>
        <clipPath id={`${uid}-c`}>
          <circle cx="50" cy="50" r="50" />
        </clipPath>
        <radialGradient id={`${uid}-bg`} cx="50%" cy="38%" r="65%">
          <stop offset="0" stopColor="#fffaf0" />
          <stop offset="1" stopColor={look.bg} />
        </radialGradient>
        <pattern id={`${uid}-scale`} width="6" height="5" patternUnits="userSpaceOnUse">
          <path d="M0 5 Q3 0 6 5" fill="none" stroke="#000" strokeOpacity=".45" strokeWidth=".7" />
        </pattern>
      </defs>
      <g clipPath={`url(#${uid}-c)`}>
        <rect width="100" height="100" fill={`url(#${uid}-bg)`} />
        {/* hoạ tiết mặt trống đồng mờ */}
        <g opacity=".12" stroke={INK} fill="none" strokeWidth=".8">
          <circle cx="50" cy="50" r="46" />
          <circle cx="50" cy="50" r="40" strokeDasharray="2 3" />
        </g>
        {look.pair ? (
          <>
            <g transform="translate(-14 6) scale(.86)">
              <Figure look={{ ...look, robe: '#6f2418' }} uid={uid} />
            </g>
            <g transform="translate(21 8) scale(.86)">
              <Figure look={look} uid={uid} />
            </g>
          </>
        ) : (
          <g transform="translate(0 4)">
            <Figure look={look} uid={uid} />
          </g>
        )}
      </g>
      <circle cx="50" cy="50" r="48.6" fill="none" stroke={look.robe} strokeWidth="2.8" opacity=".85" />
    </svg>
  )
}
