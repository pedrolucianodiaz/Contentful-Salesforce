import { useState } from 'react'
import { Routes, Route, NavLink, Navigate, useParams } from 'react-router-dom'
import { sections } from './content.js'
import { useInstallPrompt } from './useInstallPrompt.js'
import VideoHero from './VideoHero.jsx'

const ICON = `${import.meta.env.BASE_URL}icons/icon-192.png`
const DISMISS_KEY = 'pwa-install-dismissed'
const DISMISS_DAYS = 7

// Banner-popup con instrucciones de instalación. Solo se muestra en iPhone.
function InstallBanner({ isIos, installed }) {
  const [dismissed, setDismissed] = useState(() => {
    try {
      const t = localStorage.getItem(DISMISS_KEY)
      return !!t && Date.now() - Number(t) < DISMISS_DAYS * 86400000
    } catch {
      return false
    }
  })

  if (!isIos || installed || dismissed) return null

  const close = () => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()))
    } catch {
      /* ignorar */
    }
    setDismissed(true)
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 px-3 pt-3"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.75rem)' }}
    >
      <div className="mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl">
        <img src={ICON} alt="" className="h-12 w-12 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1 text-sm">
          <p className="font-semibold text-slate-900">Instalá Contentful Pocket Studio</p>
          <p className="text-slate-600">
            En Safari: tocá <b>Compartir</b> ⬆️ y luego <b>“Agregar a inicio”</b>.
          </p>
        </div>
        <button
          onClick={close}
          aria-label="Cerrar"
          className="shrink-0 rounded-md px-2 py-1 text-lg leading-none text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

function navClass({ isActive }) {
  return [
    'block rounded-lg px-3 py-2 text-sm transition',
    isActive
      ? 'bg-blue-50 font-semibold text-blue-800'
      : 'text-slate-700 hover:bg-slate-100',
  ].join(' ')
}

// Portada: video hero a pantalla completa + tarjetas de contenido.
function HomeLanding() {
  return (
    <>
      <VideoHero />
      <section id="contenido" className="mx-auto max-w-3xl px-6 py-14">
        <h2 className="text-2xl font-bold text-blue-800">Contenido de la guía</h2>
        <p className="mt-2 text-slate-600">Elegí un tema para empezar.</p>
        <ul className="mt-6 grid gap-3">
          {sections.map((s) => (
            <li key={s.slug}>
              <NavLink
                to={`/seccion/${s.slug}`}
                className="block rounded-xl border border-slate-200 bg-white p-4 font-semibold text-blue-700 shadow-sm transition hover:border-blue-300 hover:shadow-md"
              >
                {s.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

// Layout con barra lateral para las páginas de sección.
function GuideLayout() {
  const { slug } = useParams()
  const section = sections.find((s) => s.slug === slug)
  if (!section) return <Navigate to="/" replace />

  return (
    <div className="flex flex-col md:flex-row">
      <nav className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-white p-3 md:min-h-[calc(100vh-56px)] md:w-64 md:flex-col md:border-b-0 md:border-r">
        <NavLink to="/" className="block rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100">
          ← Inicio
        </NavLink>
        {sections.map((s) => (
          <NavLink key={s.slug} to={`/seccion/${s.slug}`} className={navClass}>
            {s.title}
          </NavLink>
        ))}
      </nav>

      <main className="flex-1 p-6 md:p-10">
        <article className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-blue-800">{section.title}</h1>
          <div className="mt-4 space-y-4">
            {section.body.map((p, i) => (
              <p key={i} className="leading-relaxed text-slate-700">
                {p}
              </p>
            ))}
          </div>
        </article>
      </main>
    </div>
  )
}

export default function App() {
  const install = useInstallPrompt()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-blue-800 px-5 py-3.5 shadow">
        <NavLink to="/" className="text-lg font-bold text-white hover:opacity-90">
          📘 Contentful Pocket Studio
        </NavLink>
      </header>

      <Routes>
        <Route path="/" element={<HomeLanding />} />
        <Route path="/seccion/:slug" element={<GuideLayout />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <InstallBanner {...install} />
    </div>
  )
}
