import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

// ID del video de YouTube a usar como fondo.
const YT_ID = 'TNE9OAXP4R0'

// Parámetros para que se comporte como video de fondo: autoplay, silenciado,
// en loop, sin controles y en línea (necesario para iPhone).
const YT_SRC =
  `https://www.youtube-nocookie.com/embed/${YT_ID}` +
  `?autoplay=1&mute=1&loop=1&playlist=${YT_ID}` +
  `&controls=0&showinfo=0&modestbranding=1&rel=0` +
  `&playsinline=1&disablekb=1&fs=0&iv_load_policy=3`

export default function VideoHero() {
  const ref = useRef(null)

  // Progreso del scroll dentro del hero: 0 al entrar, 1 cuando termina de salir.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // El video hace zoom mientras scrolleás; el texto sube y se desvanece.
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.3])
  const videoOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0])
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -60])

  return (
    // Sección alta para que haya "recorrido" de scroll sobre el que animar.
    <section ref={ref} className="relative h-[180vh]">
      {/* El contenido queda fijo (pinneado) mientras la sección scrollea. */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {/* Video de fondo, escalado para cubrir toda la pantalla (16:9). */}
        <motion.div style={{ scale, opacity: videoOpacity }} className="absolute inset-0">
          <iframe
            title="Video de fondo"
            src={YT_SRC}
            allow="autoplay; encrypted-media; picture-in-picture"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2"
          />
        </motion.div>

        {/* Capa oscura para que el texto se lea bien sobre el video. */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

        {/* Texto del hero. */}
        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="relative flex h-full flex-col items-center justify-center px-6 text-center text-white"
        >
          <h1 className="text-4xl font-extrabold drop-shadow-lg sm:text-6xl">
            Contentful Pocket Studio
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/90 drop-shadow sm:text-xl">
            Aprendé qué es Contentful y cómo generar contenido, en una guía práctica.
          </p>
          <a
            href="#contenido"
            className="mt-8 rounded-full bg-white/95 px-6 py-3 font-semibold text-blue-800 shadow-lg transition hover:bg-white"
          >
            Explorar la guía ↓
          </a>
        </motion.div>
      </div>
    </section>
  )
}
