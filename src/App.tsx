import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { geoCentroid } from 'd3-geo'
import MapView, { type FlyTarget, type Layers } from './components/MapView'
import Timeline from './components/Timeline'
import Header, { type SearchHit } from './components/Header'
import { PeriodPanel, TracePanel } from './components/Panels'
import NowCard from './components/NowCard'
import Guide, { guideSeen } from './components/Guide'
import TTViewer from './components/TTViewer'
import { StoryPicker, StoryPlayer } from './components/Story'
import IslandsPanel from './components/Islands'
import CompareBar from './components/Compare'
import { PaperOverlay, PeriodStamp, Splash } from './components/Atmosphere'
import { STORIES } from './data/stories'
import type { Map as MLMap } from 'maplibre-gl'
import { areaSeries, loadGeo, territoryAt, type GeoData } from './lib/geo'
import { traceAt } from './lib/trace'
import { useUrlState } from './lib/url'
import { fracToYear, normYear, yearToFrac } from './lib/time'
import { EVENTS } from './data/events'
import { CHANGE_YEARS } from './data/territory'
import type { HistEvent } from './data/types'
import { tr } from './lib/i18n'

const STOPS = [...new Set([...CHANGE_YEARS, ...EVENTS.map((e) => e.year)])].sort((a, b) => a - b)
const TOUR = ['bochinh', 'huyentran', 'chiemdong', 'vijaya', 'phuyen', 'khanhhoa', 'binhthuan', 'giadinh', 'hatien', 'longho', 'nam1757', 'gialong']

export default function App() {
  const [geo, setGeo] = useState<GeoData | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [url, setUrl] = useUrlState()
  const { year, lang, trace, cmp } = url
  const [layers, setLayers] = useState<Layers>({ territories: true, capitals: true, events: true, rivers: true, relief: true, modern: false, islands: true })
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [fly, setFly] = useState<FlyTarget | null>(null)
  const [activeEvent, setActiveEvent] = useState<string | null>(null)
  const [focusPolity, setFocusPolity] = useState<string | null>(null)
  const [guide, setGuide] = useState(() => !guideSeen())
  const [ttOpen, setTtOpenRaw] = useState<{ id: string; src: 'tt' | 'dn' } | null>(null)
  const setTtOpen = useCallback((id: string, src: 'tt' | 'dn' = 'tt') => setTtOpenRaw({ id, src }), [])
  const closeTT = useCallback(() => setTtOpenRaw(null), [])
  const tourTimer = useRef<number | null>(null)
  const [picker, setPicker] = useState<'battle' | 'life' | null>(null)
  const [step, setStep] = useState(0)
  const [islands, setIslands] = useState(false)
  const [split, setSplit] = useState(0.5)
  const syncGroup = useRef(new Set<MLMap>()).current
  const story = useMemo(() => STORIES.find((s) => s.id === url.story) ?? null, [url.story])
  const storyState = useMemo(() => (story ? { s: story, step: Math.min(step, story.steps.length - 1) } : null), [story, step])

  const [minWait, setMinWait] = useState(true)
  useEffect(() => {
    loadGeo().then(setGeo).catch((e) => setErr(String(e)))
    const t = setTimeout(() => setMinWait(false), 2300) // đủ thời gian cho màn trống đồng
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = `${tr(lang, 'appName')} — ${tr(lang, 'tagline')}`
  }, [lang])

  const setYear = useCallback((y: number) => setUrl((s) => ({ ...s, year: normYear(y, y < s.year ? -1 : 1) })), [setUrl])
  const stopTour = () => {
    if (tourTimer.current) clearTimeout(tourTimer.current)
    tourTimer.current = null
  }

  // Phát: chạy đều theo thang thời gian (thời cổ nhanh, cận đại chậm)
  useEffect(() => {
    if (!playing) return
    let raf = 0
    let last = performance.now()
    let f = yearToFrac(year)
    const tick = (now: number) => {
      f += ((now - last) / 1000) * (speed / 90)
      last = now
      if (f >= 1) {
        setYear(2026)
        setPlaying(false)
        return
      }
      setYear(fracToYear(f))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, speed])

  // Phím tắt
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'SELECT') return
      if (e.key === ' ') setPlaying((p) => !p)
      else if (e.key === 'ArrowRight') setYear(year + (e.shiftKey ? 10 : 1))
      else if (e.key === 'ArrowLeft') setYear(year - (e.shiftKey ? 10 : 1))
      else if (e.key === 'PageDown' || e.key === ']') setYear(STOPS.find((s) => s > year) ?? year)
      else if (e.key === 'PageUp' || e.key === '[') setYear([...STOPS].reverse().find((s) => s < year) ?? year)
      else if (e.key === 'Escape') {
        if (!ttOpen) setUrl((s) => ({ ...s, trace: null }))
        setIslands(false)
      }
      else return
      e.preventDefault()
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [year, setYear, setUrl, ttOpen])

  const onEvent = useCallback(
    (e: HistEvent) => {
      setActiveEvent(e.id)
      setYear(e.year)
      setFly({ center: e.coord, zoom: e.zoom, key: Date.now() })
    },
    [setYear],
  )

  // Đi tới từng bước của câu chuyện
  useEffect(() => {
    if (!story) return
    const st = story.steps[Math.min(step, story.steps.length - 1)]
    setYear(st.year ?? story.year)
    const v = st.view ?? story.view
    const narrow = window.innerWidth < 768
    setFly({ center: v.center, zoom: v.zoom - (narrow ? 0.9 : 0) - (story.kind === 'life' ? 0.6 : 0), key: Date.now() })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story, step])

  const openStory = useCallback(
    (id: string) => {
      stopTour()
      setPlaying(false)
      setPicker(null)
      setStep(0)
      setUrl((s) => ({ ...s, story: id, trace: null, cmp: null }))
    },
    [setUrl],
  )
  const closeStory = useCallback(() => setUrl((s) => ({ ...s, story: null })), [setUrl])

  const startTour = () => {
    stopTour()
    setPlaying(false)
    let i = 0
    const step = () => {
      const e = EVENTS.find((x) => x.id === TOUR[i])!
      setActiveEvent(e.id)
      setYear(e.year)
      setFly({ center: e.coord, zoom: 6, key: Date.now() })
      i++
      if (i < TOUR.length) tourTimer.current = window.setTimeout(step, 3400)
      else
        tourTimer.current = window.setTimeout(() => {
          setFly({ center: [106.6, 15.9], zoom: 4.9, key: Date.now() })
          tourTimer.current = null
        }, 3400)
    }
    step()
  }

  const terr = useMemo(() => (geo ? territoryAt(geo, year) : null), [geo, year])
  const area = useMemo(() => (geo ? areaSeries(geo) : []), [geo])
  const traceRes = useMemo(() => (geo && trace ? traceAt(geo, trace, lang) : null), [geo, trace, lang])
  const provinceList = useMemo(
    () => (geo ? geo.provinces.features.map((f) => ({ id: f.properties.id, name: f.properties.name, center: geoCentroid(f) as [number, number] })) : []),
    [geo],
  )

  const onPick = (h: SearchHit) => {
    stopTour()
    if (h.story) return openStory(h.story)
    if (h.event) return onEvent(h.event)
    if (h.year !== undefined) setYear(h.year)
    if (h.coord) {
      setFly({ center: h.coord, key: Date.now() })
      if (h.kind === 'province' || h.kind === 'place') setUrl((s) => ({ ...s, trace: h.coord! }))
    }
  }

  if (err) return <div className="grid h-full place-items-center p-6 text-center">⚠ {err}</div>
  if (!geo || !terr)
    return (
      <>
        {null}
        <Splash leaving={false} lang={lang} />
      </>
    )

  return (
    <>
    <main className="relative h-full w-full overflow-hidden">
      <MapView
        geo={geo}
        year={year}
        lang={lang}
        layers={layers}
        trace={trace}
        fly={fly}
        activeEvent={activeEvent}
        focusPolity={focusPolity}
        story={storyState}
        syncGroup={syncGroup}
        onIslands={() => {
          setIslands(true)
          setUrl((s) => ({ ...s, trace: null }))
        }}
        onTrace={(p) => {
          setIslands(false)
          setUrl((s) => ({ ...s, trace: p }))
        }}
        onEvent={(e) => {
          stopTour()
          onEvent(e)
        }}
      />
      {cmp !== null && (
        <>
          <div className="absolute inset-0 z-[1]" style={{ clipPath: `inset(0 0 0 ${split * 100}%)` }}>
            <MapView
              geo={geo}
              year={cmp}
              lang={lang}
              layers={{ ...layers, events: false }}
              trace={null}
              fly={null}
              activeEvent={null}
              focusPolity={focusPolity}
              compare
              syncGroup={syncGroup}
              onTrace={(p) => setUrl((s) => ({ ...s, trace: p }))}
              onEvent={onEvent}
            />
          </div>
          <CompareBar
            split={split}
            onSplit={setSplit}
            left={year}
            right={cmp}
            lang={lang}
            onRight={(y) => setUrl((s) => ({ ...s, cmp: y }))}
            onClose={() => setUrl((s) => ({ ...s, cmp: null }))}
          />
        </>
      )}
      <PaperOverlay />
      <PeriodStamp year={year} lang={lang} quiet={cmp !== null} />
      <Header
        lang={lang}
        layers={layers}
        provinces={provinceList}
        onLang={(l) => setUrl((s) => ({ ...s, lang: l }))}
        onLayers={setLayers}
        onPick={onPick}
        onTour={startTour}
        onHelp={() => setGuide(true)}
        onStories={() => setPicker('battle')}
        comparing={cmp !== null}
        onCompare={() => {
          closeStory()
          setUrl((s) => ({ ...s, cmp: s.cmp === null ? (s.year < 1700 ? 1802 : 1069) : null }))
        }}
      />
      {!(story && window.innerWidth < 1100) && <PeriodPanel
        year={year}
        lang={lang}
        shapes={terr.shapes}
        activeEvent={activeEvent}
        focusPolity={focusPolity}
        onFocusPolity={setFocusPolity}
        onOpenTT={setTtOpen}
        onStory={openStory}
        onEvent={(e) => {
          stopTour()
          onEvent(e)
        }}
        onYear={(y) => {
          stopTour()
          setYear(y)
        }}
      />}
      {islands && !trace && <IslandsPanel lang={lang} year={year} onYear={setYear} onClose={() => setIslands(false)} />}
      {trace && traceRes && traceRes.kind !== 'sea' && (
        <TracePanel result={traceRes} coord={trace} year={year} lang={lang} onYear={setYear} onClose={() => setUrl((s) => ({ ...s, trace: null }))} />
      )}
      {!story && cmp === null && <NowCard year={year} lang={lang} provinceIds={geo.ids} names={geo.names} />}
      {story && storyState && <StoryPlayer story={story} step={storyState.step} lang={lang} onStep={setStep} onClose={closeStory} />}
      {!trace && !story && !islands && cmp === null && (
        <div className="hint glass max-xl:hidden">
          <span className="text-base">⌖</span> {tr(lang, 'traceHint')}
        </div>
      )}
      <div className="absolute inset-x-3 bottom-3 z-20">
        <Timeline
          year={year}
          lang={lang}
          area={area}
          playing={playing}
          speed={speed}
          onYear={(y) => {
            stopTour()
            setYear(y)
          }}
          onPlay={(p) => {
            stopTour()
            if (p && year >= 2026) setYear(-700)
            setPlaying(p)
          }}
          onSpeed={setSpeed}
        />
        <p className="mt-1.5 px-1 text-[10.5px] text-ink/50 max-sm:hidden">{tr(lang, 'disclaimer')}</p>
      </div>
      {ttOpen && <TTViewer id={ttOpen.id} src={ttOpen.src} lang={lang} onClose={closeTT} />}
      {picker && <StoryPicker lang={lang} initial={picker} onPick={openStory} onClose={() => setPicker(null)} />}
      {guide && !minWait && <Guide lang={lang} onClose={() => setGuide(false)} onTour={startTour} />}
    </main>
    <Splash leaving={!minWait} lang={lang} />
    </>
  )
}
