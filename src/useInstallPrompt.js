import { useEffect, useState } from 'react'

// En Android, Chrome gestiona la instalación de forma nativa (menú → "Instalar
// aplicación" y su propio aviso), así que NO capturamos `beforeinstallprompt`
// ni mostramos botón propio. En iPhone no existe esa opción automática, por eso
// mostramos una ayuda propia. Este hook solo detecta la plataforma y si la app
// ya está instalada.
export function useInstallPrompt() {
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    const onInstalled = () => setInstalled(true)
    window.addEventListener('appinstalled', onInstalled)

    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    if (standalone) setInstalled(true)

    return () => window.removeEventListener('appinstalled', onInstalled)
  }, [])

  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent)
  return { isIos, installed }
}
