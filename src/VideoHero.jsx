import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Player from '@vimeo/player'

// Videos de Vimeo. El 1º arranca en 0:35; cuando termina, se carga el 2º en loop.
const VIDEO_1 = 470215251
const VIDEO_2 = 360367957
const START_1 = 35 // segundos

// Sizing 16:9 para cubrir cualquier pantalla (portrait o landscape) sin bordes.
const COVER = {
  width: 'max(177.78vh, 100vw)',
  height: 'max(56.25vw, 100vh)',
}

// Monta un reproductor de Vimeo (silenciado, sin controles) que arranca en 0:35
// y encadena el segundo video al terminar. Se reutiliza para el video nítido y
// para la copia difuminada del resplandor ambiental.
function VimeoScene({ className = '', style }) {
  const mountRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    const player = new Player(mountRef.current, {
      id: VIDEO_1,
      autoplay: true,
      muted: true,
      controls: false,
      loop: false,
      playsinline: true,
      responsive: false,
    })

    player.ready().then(() => {
      if (!cancelled) player.setCurrentTime(START_1).catch(() => {})
    })

    const onEnded = async () => {
      try {
        await player.loadVideo(VIDEO_2)
        await player.setMuted(true)
        await player.setLoop(true)
        await player.play()
      } catch {
        /* ignorar */
      }
    }
    player.on('ended', onEnded)

    return () => {
      cancelled = true
      player.off('ended', onEnded)
      player.destroy().catch(() => {})
    }
  }, [])

  // El iframe que crea el SDK se fuerza a llenar el contenedor.
  return (
    <div
      ref={mountRef}
      style={style}
      className={`[&>iframe]:absolute [&>iframe]:inset-0 [&>iframe]:h-full [&>iframe]:w-full ${className}`}
    />
  )
}

// Resplandor ambiental (estilo Ambilight): copia del mismo video, ampliada y
// muy difuminada, detrás de todo. El blur lo resuelve la GPU → sin trabas.
function AmbientGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <VimeoScene
        className="absolute left-1/2 top-1/2"
        style={{
          ...COVER,
          transform: 'translate(-50%, -50%) scale(1.25)',
          filter: 'blur(70px) saturate(1.5)',
          opacity: 0.75,
          willChange: 'filter, transform',
        }}
      />
    </div>
  )
}

// Video nítido que cubre su contenedor.
function VideoCover() {
  return (
    <VimeoScene
      className="pointer-events-none absolute left-1/2 top-1/2"
      style={{ ...COVER, transform: 'translate(-50%, -50%) scale(1.02)' }}
    />
  )
}

export default function VideoHero() {
  const ref = useRef(null)

  // Desactivamos el resplandor si el usuario pidió menos animación (accesibilidad
  // y ahorro de recursos en equipos modestos).
  const [ambient, setAmbient] = useState(true)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setAmbient(!mq.matches)
    apply()
    mq.addEventListener?.('change', apply)
    return () => mq.removeEventListener?.('change', apply)
  }, [])

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // El video empieza chico (cuadradito) y crece hasta llenar la pantalla.
  const scale = useTransform(scrollYProgress, [0, 1], [0.4, 1.15])
  const radius = useTransform(scrollYProgress, [0, 0.9], ['32px', '0px'])
  const textOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0])
  const textY = useTransform(scrollYProgress, [0, 0.35], [0, -40])
  // El resplandor se atenúa cuando el video ya llena la pantalla.
  const glowOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0])

  return (
    <section ref={ref} className="relative h-[220vh]">
      {/* Contenido fijo (pinneado) mientras la sección scrollea. Fondo negro. */}
      <div className="sticky top-0 grid h-screen w-full place-items-center overflow-hidden bg-black">
        {/* Capa de resplandor ambiental detrás de todo. */}
        {ambient && (
          <motion.div style={{ opacity: glowOpacity }} className="absolute inset-0">
            <AmbientGlow />
          </motion.div>
        )}

        {/* Marco del video: crece de chico a pantalla completa. */}
        <motion.div
          style={{ scale, borderRadius: radius }}
          className="relative h-full w-full overflow-hidden bg-black shadow-2xl"
        >
          <VideoCover />
        </motion.div>

        {/* Texto encima, se desvanece al crecer el video. */}
        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center text-white"
        >
          <h1 className="text-4xl font-extrabold drop-shadow-lg sm:text-6xl">
            Contentful Pocket Studio
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/90 drop-shadow sm:text-xl">
            Aprendé qué es Contentful y cómo generar contenido.
          </p>
          <a
            href="#contenido"
            className="pointer-events-auto mt-8 rounded-full bg-white/95 px-6 py-3 font-semibold text-blue-800 shadow-lg transition hover:bg-white"
          >
            Explorar la guía ↓
          </a>
        </motion.div>
      </div>
    </section>
  )
}
