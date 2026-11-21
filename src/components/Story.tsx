import { useEffect, useState } from 'react'
import { BATTLES, PEOPLE, type Story } from '../data/stories'
import type { Lang } from '../data/types'
import { fmtYear } from '../lib/time'
import { pick } from '../lib/i18n'

/* ───────────── Trình phát diễn biến / hành trình ───────────── */
export function StoryPlayer({
  story,
  step,
  lang,
  onStep,
  onClose,
}: {
  story: Story
  step: number
  lang: Lang
  onStep: (i: number) => void
  onClose: () => void
}) {
  const [auto, setAuto] = useState(false)
  const s = story.steps[step]
  const last = step >= story.steps.length - 1
  const vi = lang === 'vi'

  useEffect(() => {
    if (!auto) return
    if (last) {
      setAuto(false)
      return
    }
    const id = window.setTimeout(() => onStep(step + 1), 6500)
    return () => clearTimeout(id)
  }, [auto, step, last, onStep])

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return
      if (e.key === 'ArrowRight' && !last) onStep(step + 1)
      else if (e.key === 'ArrowLeft' && step > 0) onStep(step - 1)
      else if (e.key === 'Escape') onClose()
      else return
      e.preventDefault()
      e.stopImmediatePropagation()
    }
    window.addEventListener('keydown', k, true)
    return () => window.removeEventListener('keydown', k, true)
  }, [step, last, onStep, onClose])

  return (
    <section className="story-player glass" aria-live="polite">
      <div className="flex items-start gap-3">
        {story.kind === 'life' && <span className="sp-glyph" lang="zh-Hant">{story.glyph}</span>}
        <div className="min-w-0 flex-1">
          <div className="sp-kicker">
            {story.kind === 'battle' ? (vi ? '⚔ Diễn biến trận đánh' : '⚔ Battle replay') : vi ? '👤 Hành trình nhân vật' : '👤 A life on the map'} · {pick(lang, story.title)}
          </div>
          <div className="sp-date">{pick(lang, s.date)}</div>
          <h3 className="sp-title">{pick(lang, s.title)}</h3>
        </div>
        <button className="btn-mini shrink-0" onClick={onClose} aria-label={vi ? 'Đóng' : 'Close'}>
          ✕
        </button>
      </div>
      <p className="sp-text">{pick(lang, s.text)}</p>
      {story.sides && (
        <div className="sp-sides">
          <span>
            <i style={{ background: '#c0392b' }} /> {pick(lang, story.sides.vn)}
          </span>
          <span>
            <i style={{ background: '#26364f' }} /> {pick(lang, story.sides.foe)}
          </span>
          <span className="text-ink/50">
            <i className="dash" /> {vi ? 'rút lui / phòng tuyến' : 'retreat / defence line'}
          </span>
        </div>
      )}
      <div className="sp-controls">
        <button className="btn-round" disabled={step === 0} onClick={() => onStep(step - 1)} aria-label={vi ? 'Bước trước' : 'Previous'}>
          ‹
        </button>
        <button className="btn-play" onClick={() => (last ? (onStep(0), setAuto(true)) : setAuto(!auto))} aria-label={auto ? 'pause' : 'play'}>
          {auto ? '❚❚' : last ? '↺' : '▶'}
        </button>
        <button className="btn-round" disabled={last} onClick={() => onStep(step + 1)} aria-label={vi ? 'Bước sau' : 'Next'}>
          ›
        </button>
        <div className="sp-dots">
          {story.steps.map((x, i) => (
            <button key={i} className={`sp-dot ${i === step ? 'on' : i < step ? 'done' : ''}`} onClick={() => onStep(i)} title={pick(lang, x.title)} aria-label={pick(lang, x.title)} />
          ))}
        </div>
        <span className="sp-count">
          {step + 1}/{story.steps.length}
        </span>
      </div>
    </section>
  )
}

/* ───────────── Chọn câu chuyện ───────────── */
export function StoryPicker({ lang, initial, onPick, onClose }: { lang: Lang; initial: 'battle' | 'life'; onPick: (id: string) => void; onClose: () => void }) {
  const [tab, setTab] = useState(initial)
  const vi = lang === 'vi'
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [onClose])
  const list = tab === 'battle' ? BATTLES : PEOPLE
  return (
    <div className="guide-backdrop" onClick={onClose}>
      <div className="picker glass" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between gap-3">
          <div className="picker-tabs" role="tablist">
            <button role="tab" aria-selected={tab === 'battle'} className={tab === 'battle' ? 'on' : ''} onClick={() => setTab('battle')}>
              ⚔ {vi ? 'Trận đánh' : 'Battles'}
            </button>
            <button role="tab" aria-selected={tab === 'life'} className={tab === 'life' ? 'on' : ''} onClick={() => setTab('life')}>
              👤 {vi ? 'Nhân vật' : 'People'}
            </button>
          </div>
          <button className="btn-mini" onClick={onClose} aria-label={vi ? 'Đóng' : 'Close'} autoFocus>
            ✕
          </button>
        </div>
        <p className="mt-2 text-[12.5px] text-ink/60">
          {tab === 'battle'
            ? vi
              ? 'Chọn một trận để xem mũi tên tiến quân chạy trên bản đồ, theo từng mốc thời gian.'
              : 'Pick a battle to watch the armies move on the map, step by step.'
            : vi
              ? 'Chọn một nhân vật — bản đồ sẽ đi theo những nơi người ấy sống và hoạt động.'
              : 'Pick a person — the map follows the places of their life.'}
        </p>
        <div className="picker-grid">
          {list.map((s) => (
            <button key={s.id} className="picker-card" onClick={() => onPick(s.id)}>
              <span className={`pc-glyph ${s.kind}`} lang="zh-Hant">
                {s.kind === 'battle' ? '⚔' : s.glyph}
              </span>
              <span className="min-w-0">
                <b>{pick(lang, s.title)}</b>
                <span className="block text-[12px] leading-snug text-ink/65">{pick(lang, s.sub)}</span>
                <span className="block text-[11px] text-ink/45">
                  {s.life ? `${fmtYear(s.life[0], lang, true)} – ${fmtYear(s.life[1], lang, true)}` : fmtYear(s.year, lang, true)} · {s.steps.length} {vi ? 'chặng' : 'steps'}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
