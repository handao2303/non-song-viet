import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { geoCentroid } from 'd3-geo'
import MapView, { type FlyTarget, type Layers } from './components/MapView'
import Timeline from './components/Timeline'
import Header, { type SearchHit } from './components/Header'
import { PeriodPanel, TracePanel } from './components/Panels'
import NowCard from './components/NowCard'
import Guide, { guideSeen } from './components/Guide'
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
  const { year, lang, trace } = url
  const [layers, setLayers] = useState<Layers>({ territories: true, capitals: true, events: true, rivers: true, relief: true, modern: false })
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [fly, setFly] = useState<FlyTarget | null>(null)
  const [activeEvent, setActiveEvent] = useState<string | null>(null)
  const [focusPolity, setFocusPolity] = useState<string | null>(null)
  const [guide, setGuide] = useState(() => !guideSeen())
  const tourTimer = useRef<number | null>(null)

  useEffect(() => {
    loadGeo().then(setGeo).catch((e) => setErr(String(e)))
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
      else if (e.key === 'Escape') setUrl((s) => ({ ...s, trace: null }))
      else return
      e.preventDefault()
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [year, setYear, setUrl])

  const onEvent = useCallback(
    (e: HistEvent) => {
      setActiveEvent(e.id)
      setYear(e.year)
      setFly({ center: e.coord, zoom: e.zoom, key: Date.now() })
    },
    [setYear],
  )

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
      <div className="grid h-full place-items-center">
        <div className="text-center">
          <div className="logo mx-auto mb-3 h-14 w-14 animate-pulse text-3xl"></div>
          <div className="font-serif text-lg">{tr(lang, 'appName')}</div>
        </div>
      </div>
    )

  return (
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
        onTrace={(p) => setUrl((s) => ({ ...s, trace: p }))}
        onEvent={(e) => {
          stopTour()
          onEvent(e)
        }}
      />
      <Header
        lang={lang}
        layers={layers}
        provinces={provinceList}
        onLang={(l) => setUrl((s) => ({ ...s, lang: l }))}
        onLayers={setLayers}
        onPick={onPick}
        onTour={startTour}
        onHelp={() => setGuide(true)}
      />
      <PeriodPanel
        year={year}
        lang={lang}
        shapes={terr.shapes}
        activeEvent={activeEvent}
        focusPolity={focusPolity}
        onFocusPolity={setFocusPolity}
        onEvent={(e) => {
          stopTour()
          onEvent(e)
        }}
        onYear={(y) => {
          stopTour()
          setYear(y)
        }}
      />
      {trace && traceRes && traceRes.kind !== 'sea' && (
        <TracePanel result={traceRes} coord={trace} year={year} lang={lang} onYear={setYear} onClose={() => setUrl((s) => ({ ...s, trace: null }))} />
      )}
      <NowCard year={year} lang={lang} provinceIds={geo.ids} names={geo.names} />
      {!trace && (
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
      {guide && <Guide lang={lang} onClose={() => setGuide(false)} onTour={startTour} />}
    </main>
  )
}
