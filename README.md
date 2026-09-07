# Guía de Contentful

Sitio educativo (PWA) que explica **qué es Contentful** y **cómo generar contenido**, pensado como material de aprendizaje. Hecho con **React + Vite** e instalable en el celular.

## 🎯 Objetivo

Guía interactiva y práctica sobre Contentful:

- Qué es Contentful y para qué sirve (headless CMS).
- Conceptos clave: Spaces, Environments, Content Types, Entries y Assets.
- Cómo modelar y generar contenido paso a paso.
- Cómo consumir ese contenido desde una app (Content Delivery API / GraphQL).

## 🛠️ Stack

- **Frontend:** React + Vite
- **Estilos:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Ruteo:** react-router-dom (`HashRouter`, para funcionar sin config extra en GitHub Pages)
- **PWA:** `vite-plugin-pwa` (instalable en el celular)
- **Hosting:** GitHub Pages (`gh-pages`)

> **Nota sobre Next.js:** Next.js *incluye* React (no son cosas separadas) y también puede
> publicarse en GitHub Pages, pero solo en modo estático (`output: 'export'`) y con config
> extra (`basePath`, `.nojekyll`, imágenes sin optimizar). Para esta guía, React + Vite es
> más simple. Tailwind funciona igual en ambos, así que el estilo no depende de esa elección.

## 🚀 Desarrollo

```bash
npm install        # instalar dependencias
npm run dev        # servidor de desarrollo (http://localhost:5173)
npm run build      # build de producción en /dist
npm run preview    # previsualizar el build
```

## 📁 Estructura

```
Contentful-Salesforce/
├── public/
│   ├── favicon.svg
│   └── icons/                # icon-192.png, icon-512.png (PWA)
├── scripts/
│   └── generate-icons.mjs    # regenera los íconos PNG sin dependencias
├── src/
│   ├── main.jsx              # punto de entrada + router
│   ├── App.jsx               # layout, navegación y páginas
│   ├── content.js            # contenido de la guía (secciones)
│   └── index.css             # @import "tailwindcss";
├── vite.config.js            # config de Vite + PWA (ojo con `base`)
├── index.html
└── package.json
```

El contenido de la guía vive en `src/content.js`: cada sección es un objeto con
`slug`, `title` y `body`. Para agregar un tema nuevo, sumá una entrada al array.

## 📱 Desplegar en GitHub Pages

Sí, se puede: GitHub Pages sirve estático sobre HTTPS, que es lo que la PWA necesita
para instalarse en el móvil.

1. Creá el repo en GitHub (idealmente con el nombre `Contentful-Salesforce`, que es el
   que usa `base` en `vite.config.js`; si le ponés otro nombre, actualizá `REPO_NAME` ahí).
2. Subí el proyecto:
   ```bash
   git init && git add -A && git commit -m "Guía de Contentful inicial"
   git branch -M main
   git remote add origin https://github.com/<usuario>/Contentful-Salesforce.git
   git push -u origin main
   ```
3. Publicá:
   ```bash
   npm run deploy    # build + push de /dist a la rama gh-pages
   ```
4. En GitHub → Settings → Pages, elegí la rama `gh-pages`. El sitio quedará en
   `https://<usuario>.github.io/Contentful-Salesforce/`.

## 🖼️ Íconos

Los íconos PNG son placeholders sólidos generados por `scripts/generate-icons.mjs`.
Cuando tengas un logo, reemplazá `public/icons/icon-192.png` y `icon-512.png`
(o regeneralos con `node scripts/generate-icons.mjs`).

## 🗺️ Próximos pasos

- [x] Scaffolding React + Vite + PWA
- [x] Estructura de secciones y navegación
- [ ] Ampliar el contenido de la guía
- [ ] Reemplazar los íconos placeholder por un logo real
- [ ] (Opcional) Conectar con la API de Contentful para traer contenido real
- [ ] Deploy a GitHub Pages

## 📚 Recursos

- [Documentación oficial de Contentful](https://www.contentful.com/developers/docs/)
- [Content Delivery API](https://www.contentful.com/developers/docs/references/content-delivery-api/)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
