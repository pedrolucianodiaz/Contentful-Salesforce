// Contenido de la guía. Cada sección es una entrada del menú y una página.
// Más adelante esto se puede reemplazar por datos traídos de la API de Contentful.

export const sections = [
  {
    slug: 'que-es',
    title: '¿Qué es Contentful?',
    body: [
      'Contentful es un CMS "headless" (sin cabeza): gestiona contenido y lo entrega por API, sin imponer cómo se ve.',
      'A diferencia de un CMS tradicional (como WordPress), Contentful no genera las páginas. Vos consumís el contenido desde donde quieras: una web en React, una app móvil, un cartel digital, etc.',
      'Ventaja principal: escribís el contenido una sola vez y lo reutilizás en muchos canales (omnicanal).',
    ],
  },
  {
    slug: 'conceptos',
    title: 'Conceptos clave',
    body: [
      'Space: el contenedor principal de un proyecto. Agrupa modelos, contenido y usuarios.',
      'Environment: variantes de un Space (por ejemplo "master", "staging") para probar cambios sin afectar producción.',
      'Content Type: la "plantilla" que define qué campos tiene un tipo de contenido (ej. un Artículo tiene título, cuerpo, imagen).',
      'Entry: una instancia concreta de un Content Type (ej. el artículo "Cómo empezar con Contentful").',
      'Asset: archivos multimedia (imágenes, PDFs, videos) que se referencian desde las Entries.',
    ],
  },
  {
    slug: 'modelar',
    title: 'Cómo modelar contenido',
    body: [
      '1. Entrá a app.contentful.com y creá un Space gratuito.',
      '2. Andá a "Content model" y creá un Content Type, por ejemplo "Artículo".',
      '3. Agregá campos: Título (Short text), Slug (Short text), Cuerpo (Rich text), Imagen (Media).',
      '4. Guardá el modelo. Ya podés empezar a cargar contenido.',
      'Consejo: pensá primero qué vas a mostrar y con qué campos, antes de crear el modelo.',
    ],
  },
  {
    slug: 'generar',
    title: 'Cómo generar contenido',
    body: [
      '1. Andá a la pestaña "Content" y hacé clic en "Add entry".',
      '2. Elegí el Content Type (ej. "Artículo").',
      '3. Completá los campos y subí las imágenes como Assets.',
      '4. Guardá como borrador (Draft) y, cuando esté listo, hacé "Publish".',
      'Solo el contenido publicado se sirve por la Content Delivery API (la API pública de lectura).',
    ],
  },
  {
    slug: 'consumir',
    title: 'Cómo consumir el contenido',
    body: [
      'Contentful entrega el contenido por API REST o GraphQL. Necesitás el Space ID y un Access Token (Settings > API keys).',
      'Ejemplo con REST (Content Delivery API):',
      'GET https://cdn.contentful.com/spaces/{SPACE_ID}/entries?access_token={TOKEN}&content_type=articulo',
      'Desde React se suele usar el SDK oficial: npm install contentful, y luego createClient({ space, accessToken }).',
      'Nunca pongas tokens de escritura en el frontend: usá solo el token de lectura (Content Delivery).',
    ],
  },
]
