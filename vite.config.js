import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// IMPORTANTE para GitHub Pages:
// `base` debe coincidir con el nombre del repositorio, p. ej. '/Contentful-Salesforce/'.
// En desarrollo local usamos '/'. Ajustá REPO_NAME si el repo se llama distinto.
const REPO_NAME = 'Contentful-Salesforce'

// Usamos `command` (build vs serve) porque es más confiable que NODE_ENV.
export default defineConfig(({ command }) => {
  const base = command === 'build' ? `/${REPO_NAME}/` : '/'
  return {
  base,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // Permite probar la instalación de la PWA también con `npm run dev`.
      devOptions: { enabled: true },
      includeAssets: ['favicon.svg', 'icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: 'Contentful Pocket Studio',
        short_name: 'Pocket Studio',
        description: 'Guía de aprendizaje sobre Contentful: qué es y cómo generar contenido.',
        theme_color: '#0a3ea1',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: base,
        scope: base,
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  }
})
