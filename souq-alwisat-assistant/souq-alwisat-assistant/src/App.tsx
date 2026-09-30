import { useEffect, useRef, useState } from 'react'
import { T } from './i18n'
import { ICONS } from './icons'
import InstallPrompt from './InstallPrompt'

type L = 'ar' | 'en'
const WA = 'https://api.whatsapp.com/send/?phone=96891705789&text&type=phone_number&app_absent=0'
const IG = 'https://www.instagram.com/souq_alwisat'
const MAP = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('نزوى الصقرية مجلس الغنتق')
const SLIDES = ['/slides/1.jpg', '/slides/2.jpg', '/slides/3.jpg', '/slides/4.jpg']
const CARDS: { h?: string; i: number; l: string; a?: string; r?: string; ltr?: boolean; clock?: boolean }[] = [
  { h: MAP, i: 0, l: 'l1', a: 'a1' },
  { h: WA, i: 1, l: 'l2', r: '+968 91705789', ltr: true },
  { h: 'mailto:souq.alwisat101@gmail.com', i: 2, l: 'l3', r: 'souq.alwisat101@gmail.com' },
  { i: 3, l: 'l4', a: 'a4', clock: true },
]
const initLang = (): L => { try { return localStorage.getItem('lang') === 'en' ? 'en' : 'ar' } catch { return 'ar' } }

export default function App() {
  const [lang, setLang] = useState<L>(initLang)
  const [k, setK] = useState(0)
  const x0 = useRef<number | null>(null)
  const t = (key: string) => T[lang][key] ?? key

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    try { localStorage.setItem('lang', lang) } catch { /* ignore */ }
  }, [lang])

  useEffect(() => {
    const id = setInterval(() => setK(x => (x + 1) % SLIDES.length), 4500)
    return () => clearInterval(id)
  }, [k])

  useEffect(() => {
    const io = new IntersectionObserver(r => r.forEach((e, i) => {
      if (e.isIntersecting) { setTimeout(() => e.target.classList.add('in'), i * 110); io.unobserve(e.target) }
    }), { threshold: 0.15 })
    document.querySelectorAll('.c,.sb').forEach(e => io.observe(e))
    return () => io.disconnect()
  }, [])

  const go = (n: number) => setK((n + SLIDES.length) % SLIDES.length)

  return (
    <>
      <header>
        <div className="brand">
          <img src="/logo.png" alt="Souq Alwisat" />
          <div><span>{t('name')}</span><small>Souq Alwisat</small></div>
        </div>
        <button id="lang" type="button" onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}>{t('btn')}</button>
      </header>
      <main>
        <div className="hero">
          <div>
            <h1><span>{t('h1a')}</span> <span style={{ color: 'inherit' }}>{t('h1b')}</span></h1>
            <p className="sub">{t('sub')}</p>
            <div className="search"><input placeholder={t('ph')} /><button type="button">{t('go')}</button></div>
            <div className="chips">{['c1', 'c2', 'c3', 'c4'].map(c => <span key={c}>{t(c)}</span>)}</div>
          </div>
          <div className="car"
            onTouchStart={e => { x0.current = e.touches[0].clientX }}
            onTouchEnd={e => {
              if (x0.current == null) return
              const d = e.changedTouches[0].clientX - x0.current
              if (Math.abs(d) > 40) go(k + (d < 0 ? 1 : -1))
              x0.current = null
            }}>
            {SLIDES.map((s, i) => <div key={s} className={'sl' + (i === k ? ' on' : '')}><img src={s} alt="" /></div>)}
            <div className="dots">{SLIDES.map((s, i) => <i key={s} className={i === k ? 'on' : ''} onClick={() => go(i)} />)}</div>
          </div>
        </div>

        <section id="contact">
          <h2>{t('t')}</h2>
          <p>{t('ts')}</p>
          <div className="grid">
            {CARDS.map(c => {
              const inner = (<>
                <div className={'ic' + (c.clock ? ' clock' : '')} dangerouslySetInnerHTML={{ __html: ICONS[c.i] }} />
                <div><b>{t(c.l)}</b><span dir={c.ltr ? 'ltr' : undefined}>{c.a ? t(c.a) : c.r}</span></div>
              </>)
              return c.h
                ? <a key={c.l} className="c" href={c.h} target={c.h.startsWith('http') ? '_blank' : undefined} rel="noopener">{inner}</a>
                : <div key={c.l} className="c">{inner}</div>
            })}
          </div>
          <div className="soc">
            <a className="sb w" href={WA} target="_blank" rel="noopener">
              <span style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: ICONS[4] }} />
              <div><span>{t('wa')}</span><small>+968 9170 5789</small></div>
            </a>
            <a className="sb i" href={IG} target="_blank" rel="noopener">
              <span style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: ICONS[5] }} />
              <div><span>{t('ig')}</span><small>@souq_alwisat</small></div>
            </a>
          </div>
        </section>
      </main>
      <footer>{t('ft')}</footer>
      <InstallPrompt lang={lang} />
    </>
  )
}
