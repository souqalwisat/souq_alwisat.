import { useEffect, useState } from 'react'

const S = {
  ar: { title: 'ثبّت مساعد سوق الوسط', sub: 'أضفه إلى شاشتك للوصول السريع', btn: 'تثبيت', later: 'لاحقاً',
    ios: 'اضغط زر المشاركة ⬆️ ثم اختر «إضافة إلى الشاشة الرئيسية»', safari: 'افتح هذا الرابط في متصفح Safari ثم ثبّت التطبيق' },
  en: { title: 'Install Souq Alwisat Assistant', sub: 'Add it to your home screen for quick access', btn: 'Install', later: 'Later',
    ios: 'Tap the Share button ⬆️ then choose "Add to Home Screen"', safari: 'Open this link in Safari, then install the app' },
}
type BIPEvent = Event & { prompt: () => Promise<void> }
const standalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || (navigator as unknown as { standalone?: boolean }).standalone === true
const dismissed = () => { try { return Date.now() - Number(localStorage.getItem('pwa_dismiss') || 0) < 7 * 864e5 } catch { return false } }

export default function InstallPrompt({ lang }: { lang: 'ar' | 'en' }) {
  const [evt, setEvt] = useState<BIPEvent | null>(null)
  const [ios, setIos] = useState<'safari' | 'inapp' | null>(null)
  const [show, setShow] = useState(false)
  const s = S[lang]

  useEffect(() => {
    if (standalone() || dismissed()) return
    const ua = navigator.userAgent
    const isIOS = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    if (isIOS) {
      const inApp = !/Safari\//.test(ua) || /FBAN|FBAV|Instagram|Snapchat|TikTok|Line\//.test(ua)
      setIos(inApp ? 'inapp' : 'safari')
      const id = setTimeout(() => setShow(true), 3500)
      return () => clearTimeout(id)
    }
    const onBip = (e: Event) => { e.preventDefault(); setEvt(e as BIPEvent); setTimeout(() => setShow(true), 2500) }
    const onInstalled = () => setShow(false)
    window.addEventListener('beforeinstallprompt', onBip)
    window.addEventListener('appinstalled', onInstalled)
    return () => { window.removeEventListener('beforeinstallprompt', onBip); window.removeEventListener('appinstalled', onInstalled) }
  }, [])

  if (!show) return null
  const close = () => { try { localStorage.setItem('pwa_dismiss', String(Date.now())) } catch { /* ignore */ } setShow(false) }
  const install = async () => { if (!evt) return; await evt.prompt(); setShow(false) }

  return (
    <div className="pwa" role="dialog">
      <img src="/logo.png" alt="" />
      <div style={{ flex: 1 }}>
        <b>{s.title}</b>
        <p>{ios ? (ios === 'inapp' ? s.safari : s.ios) : s.sub}</p>
      </div>
      {!ios && <button onClick={install}>{s.btn}</button>}
      <button className="ghost" onClick={close}>{ios ? 'OK' : s.later}</button>
    </div>
  )
}
