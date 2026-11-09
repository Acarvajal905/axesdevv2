# Axes Dev — Landing page

Landing page de **Axes Dev**, un estudio de desarrollo de software.
Es una página única (one-page) donde el contenido se va construyendo a medida que el usuario hace scroll.

No hay build, no hay dependencias ni framework. Solo HTML, CSS y JavaScript vanilla, más tres tipografías de Google Fonts (Syne, JetBrains Mono e Inter).

```
index.html       Marcado de la página, solo clases (los SVG de las ilustraciones van inline)
css/styles.css   Tokens (colores, tipografía, layout), componentes y una sección por bloque de la página;
                 el @media (max-width: 768px) del final es la versión móvil
js/main.js       Cursor, typewriter, menú móvil, loop de SVG y scroll engine
assets/          favicon.svg, og-image.png (vista previa al compartir) y la captura del caso OncePro
robots.txt       Permite indexar todo y apunta al sitemap
sitemap.xml      Una sola URL (es one-page)
```

## Cómo verlo

Abre `index.html` en el navegador (doble clic) o sírvelo en local:

```bash
python3 -m http.server 8000
# luego abre http://localhost:8000/
```

Se necesita conexión a internet solo para cargar las fuentes.

## Estructura de la página

| # | Sección | Qué hace |
|---|---------|----------|
| 01 | Hero | Parallax con grid de fondo, texto que se escribe solo y ticker del stack tecnológico |
| 02 | Problema | Planteamiento del dolor del cliente |
| 03 | Lo que construimos | Track horizontal con 4 slides animados: desarrollo web, optimización, UX/UI y consultoría IT |
| 04 | Diferencial | 3 slides con indicadores y barra de progreso |
| 05 | Metodología | 5 fases (brief, propuesta, desarrollo, revisión, deploy) con un ícono SVG animado por fase |
| — | Caso | Caso de estudio OncePro, con captura anotada y flechas que se dibujan. **Deshabilitada por ahora**: está dentro de un `<template>` en `index.html` (ver el comentario ahí para activarla) |
| 06 | Equipo | Tres líderes (desarrollo, producto, infraestructura) con icono, nombre y cita |
| — | Contacto | CTA grande para escribir por WhatsApp |
| — | Footer | Logo y copyright (el año lo pone el JS) |

## Detalles de implementación

- Cursor personalizado (punto + anillo) que sigue al mouse.
- Barra de progreso vertical fija a la izquierda.
- Todas las animaciones se disparan desde un único handler de `scroll` (`onScroll`), sin librerías.
- Los gráficos de "Lo que construimos" son SVG inline animados con SMIL (`<animate>` con `begin` en tiempos fijos).
  Cada uno se reproduce en loop mientras su slide es el más visible y queda pausado en su frame inicial cuando no lo es:
  el controlador `svcAnim` maneja el time container de cada SVG con `setCurrentTime`, `pauseAnimations` y `unpauseAnimations`,
  mantiene el estado final 2 s, hace un fundido corto y reinicia.
- `css/styles.css` se carga en el `<head>`; `js/main.js` al final del `<body>`, por eso no necesita esperar a `DOMContentLoaded`.
- Colores, tipografías y el margen lateral son variables en `:root` (`--green`, `--font-mono`, `--gutter`…). Las variantes `--x-rgb`
  sirven para `rgba(var(--green-rgb), 0.3)`, también dentro de los SVG inline.
- Nomenclatura `bloque__elemento`, `bloque--modificador` y estados `.is-*` / `.active`. El JS solo cambia clases de estado;
  los únicos estilos inline son los valores continuos del scroll (transform, width, height, opacity).
- Los ids (`s-svc-outer`, `micon1`, `dd2`…) son los ganchos del JS; las clases son las de estilo.
- Versión móvil (≤768px) según la página "Wireframes UI - Mobile" del Figma: un `@media` al final de `css/styles.css` convierte las secciones
  sticky en flujo vertical, apila las 4 cards de "Lo que construimos", muestra "Por qué axes" y "Cómo trabajamos" como listas,
  pone la captura del caso arriba y agrega un menú hamburguesa. En móvil `onScroll` delega en `onScrollMobile`, que solo marca
  secciones visibles y reproduce en loop la card más centrada.

## Assets

La captura del caso OncePro se carga desde `assets/oncepro.png`. Si el archivo no existe, la página muestra un placeholder con el logo en su lugar, así que nada se rompe. Para usar la captura real, cópiala a esa ruta.

## SEO

Todo el SEO on-page está en `index.html`:

- `<title>` y `meta description` con las frases objetivo (desarrollo de páginas web, programación a medida, software a medida, axesdev).
- `canonical`, `robots`, `theme-color`, favicon, Open Graph y Twitter Card con `assets/og-image.png` (1200×630).
- Los tres botones "Hablemos" (nav, menú móvil y hero) y el CTA de contacto abren WhatsApp (`https://wa.me/573229401530`)
  con un mensaje precargado; el número también va en el JSON-LD.
- Datos estructurados JSON-LD (schema.org): `Organization` con `alternateName` (axesdev, axes.dev, Axes), equipo y los 4 servicios,
  más `WebSite` y `WebPage`. Se validan en https://validator.schema.org/ y en la prueba de resultados enriquecidos de Google.
- HTML semántico: `<main>`, una `<section>` por bloque, un solo `h1` (visible para buscadores y lectores de pantalla detrás del
  typewriter), `h2` por sección y `h3` para servicios, diferenciales, fases y miembros del equipo. Las ilustraciones llevan
  `aria-label`; los iconos decorativos, `aria-hidden`.

La URL del sitio (`https://axes.dev/`) está repetida en `canonical`, `og:url`, `twitter:image`, el JSON-LD, `robots.txt` y
`sitemap.xml`. Si el dominio final es otro, buscar y reemplazar en esos archivos.

Lo que no se resuelve desde el código y hace falta para posicionar:

1. Publicar en el dominio definitivo con HTTPS.
2. Dar de alta el sitio en Google Search Console, enviar `sitemap.xml` y pedir indexación de la URL.
3. Perfil de Google Business (si aplica una ciudad) y enlaces desde otros sitios: esto es lo que mueve las búsquedas
   genéricas como "desarrollo de páginas web"; las de marca (axesdev, axes dev) se logran con lo anterior.
4. Contenido nuevo con el tiempo: casos, artículos. Una one-page sola compite poco en términos genéricos.

## Pendientes

- El botón "Ver proyecto" del caso de éxito apunta a `#` (la sección está deshabilitada).
- Activar la sección de casos de éxito cuando esté lista y agregar la captura real de OncePro en `assets/`.
- Confirmar el dominio definitivo y reemplazar `https://axes.dev/` donde corresponda.
- Reemplazar `assets/favicon.svg` y `assets/og-image.png` por versiones con el logo real (son placeholders generados).

## Estado

Propuesta de diseño y comportamiento; todavía no es la versión final de producción.
