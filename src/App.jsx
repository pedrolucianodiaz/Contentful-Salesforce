import { Routes, Route, NavLink, Navigate, useParams } from 'react-router-dom'
import { sections } from './content.js'

// Clases reutilizables para los links del menú lateral.
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
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="bg-blue-800 px-5 py-3.5 shadow">
        <NavLink to="/" className="text-lg font-bold text-white hover:opacity-90">
          📘 Contentful Pocket Studio
        </NavLink>
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
    </div>
  )
}
