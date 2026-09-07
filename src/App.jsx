import { useState } from 'react'
import { Routes, Route, NavLink, Navigate, useParams } from 'react-router-dom'
import { sections } from './content.js'
import { useInstallPrompt } from './useInstallPrompt.js'

const ICON = `${import.meta.env.BASE_URL}icons/icon-192.png`
const DISMISS_KEY = 'pwa-install-dismissed'
const DISMISS_DAYS = 7

// Banner-popup que aparece abajo invitando a instalar la app.
function InstallBanner({ canInstall, isIos, installed, promptInstall }) {
  const [dismissed, setDismissed] = useState(() => {
    try {
      const t = localStorage.getItem(DISMISS_KEY)
      return !!t && Date.now() - Number(t) < DISMISS_DAYS * 86400000
    } catch {
      return false
    }
  })

  // No mostrar si ya está instalada, si el usuario lo cerró, o si el
  // navegador no permite instalar (ej. desktop sin soporte, iOS no-Safari).
  if (installed || dismissed) return null
  if (!canInstall && !isIos) return null

  const close = () => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()))
    } catch {
      /* ignorar */
    }
    setDismissed(true)
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-3">
      <div className="mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl">
        <img src={ICON} alt="" className="h-12 w-12 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1 text-sm">
          <p className="font-semibold text-slate-900">Instalá Contentful Pocket Studio</p>
          {isIos && !canInstall ? (
            <p className="text-slate-600">
              En Safari: tocá <b>Compartir</b> ⬆️ y luego <b>“Agregar a inicio”</b>.
            </p>
          ) : (
            <p className="text-slate-600">Accedé más rápido desde tu pantalla de inicio.</p>
          )}
        </div>
        {canInstall && (
          <button
            onClick={promptInstall}
            className="shrink-0 rounded-lg bg-blue-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            Instalar
          </button>
        )}
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

// Botón compacto en la barra superior (siempre disponible en Android).
function InstallButton({ canInstall, promptInstall }) {
  if (!canInstall) return null
  return (
    <button
      onClick={promptInstall}
      className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-blue-800 shadow transition hover:bg-blue-50"
    >
      ⬇️ Instalar app
    </button>
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

function Home() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold text-blue-800">Guía de Contentful</h1>
      <p className="mt-3 text-slate-600">
        Una guía práctica para aprender qué es Contentful y cómo generar contenido.
        Elegí un tema para empezar.
      </p>
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
    </div>
  )
}

function Section() {
  const { slug } = useParams()
  const section = sections.find((s) => s.slug === slug)
  if (!section) return <Navigate to="/" replace />
  return (
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
  )
}

export default function App() {
  const install = useInstallPrompt()

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="flex items-center justify-between bg-blue-800 px-5 py-3.5 shadow">
        <NavLink to="/" className="text-lg font-bold text-white hover:opacity-90">
          📘 Contentful Pocket Studio
        </NavLink>
        <InstallButton {...install} />
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        <nav className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-white p-3 md:w-64 md:flex-col md:border-b-0 md:border-r">
          {sections.map((s) => (
            <NavLink key={s.slug} to={`/seccion/${s.slug}`} className={navClass}>
              {s.title}
            </NavLink>
          ))}
        </nav>

        <main className="flex-1 p-6 md:p-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/seccion/:slug" element={<Section />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      <InstallBanner {...install} />
    </div>
  )
}
