import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

// ID del video de YouTube a usar como fondo.
const YT_ID = 'TNE9OAXP4R0'

// Parámetros de fondo: autoplay, silenciado, en loop, sin controles, en línea
// (iPhone) y sin subtítulos de YouTube.
const YT_SRC =
  `https://www.youtube-nocookie.com/embed/${YT_ID}` +
  `?autoplay=1&mute=1&loop=1&playlist=${YT_ID}` +
  `&controls=0&showinfo=0&modestbranding=1&rel=0` +
  `&playsinline=1&disablekb=1&fs=0&iv_load_policy=3&cc_load_policy=0`

// Video que cubre todo su contenedor. El `scale`/`translateY` extra recorta la
// franja inferior donde el video trae subtítulos quemados.
function VideoCover() {
  return (
    <iframe
      title="Video de fondo"
      src={YT_SRC}
      allow="autoplay; encrypted-media; picture-in-picture"
      className="pointer-events-none absolute left-1/2 top-1/2"
      style={{
        width: 'max(177.78vh, 100vw)',
        height: 'max(56.25vw, 100vh)',
        // -57% (en vez de -50%) sube el video; scale(1.3) hace zoom.
        // Juntos ocultan los subtítulos pegados del borde inferior.
        transform: 'translate(-50%, -57%) scale(1.3)',
      }}
    />
  )
}

export default function VideoHero() {
  const ref = useRef(null)

  // Progreso del scroll dentro del hero: 0 al entrar, 1 cuando termina de salir.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // El video empieza chico (cuadradito) y crece hasta llenar la pantalla.
  const scale = useTransform(scrollYProgress, [0, 1], [0.4, 1.15])
  const radius = useTransform(scrollYProgress, [0, 0.9], ['32px', '0px'])
  const shadow = useTransform(
    scrollYProgress,
    [0, 0.9],
    ['0 25px 60px rgba(0,0,0,.45)', '0 0 0 rgba(0,0,0,0)'],
  )
  // El texto se desvanece a medida que el video crece.
  const textOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0])
  const textY = useTransform(scrollYProgress, [0, 0.35], [0, -40])

  return (
    // Sección alta para tener "recorrido" de scroll sobre el que animar.
    <section ref={ref} className="relative h-[220vh]">
      {/* Contenido fijo (pinneado) mientras la sección scrollea. */}
      <div className="sticky top-0 grid h-screen w-full place-items-center overflow-hidden bg-slate-950">
        {/* Marco del video: crece de chico a pantalla completa. */}
        <motion.div
          style={{ scale, borderRadius: radius, boxShadow: shadow }}
          className="relative h-full w-full overflow-hidden bg-black"
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
