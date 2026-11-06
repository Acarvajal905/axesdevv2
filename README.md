# Axes Dev — Wireframe Concepto A: "El Build"

Wireframe interactivo de la landing page de **Axes Dev**, un estudio de desarrollo de software.
Es una página única (one-page) donde todo el contenido se va "construyendo" a medida que el usuario hace scroll: ese es el concepto del build.

Todo vive en un solo archivo, [`Axes.html`](Axes.html). No hay build, no hay dependencias ni framework. Solo HTML, CSS y JavaScript vanilla, más tres tipografías de Google Fonts (Syne, JetBrains Mono e Inter).

## Cómo verlo

Abre `Axes.html` en el navegador (doble clic) o sírvelo en local:

```bash
python3 -m http.server 8000
# luego abre http://localhost:8000/Axes.html
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
| 06 | Caso | Caso de estudio OncePro, con captura anotada y flechas que se dibujan |
| — | Contacto | CTA grande para escribir por WhatsApp |
| — | Footer | Logo y versión del wireframe |

## Detalles de implementación

- Cursor personalizado (punto + anillo) que sigue al mouse.
- Barra de progreso vertical fija a la izquierda.
- Todas las animaciones se disparan desde un único handler de `scroll` (`onScroll`), sin librerías.
- Los gráficos de cada slide son SVG inline que se dibujan con la posición del scroll.
- Los estilos están en el `<style>` del `<head>` y el JavaScript en el `<script>` al final del archivo.

## Assets

La captura del caso OncePro se carga desde `assets/oncepro.png`. Si el archivo no existe, la página muestra un placeholder con el logo en su lugar, así que nada se rompe. Para usar la captura real, cópiala a esa ruta.

## Pendientes

- El CTA "Escribir por WhatsApp" apunta a `#`. Falta el enlace real (`https://wa.me/...`).
- Agregar la captura real de OncePro en `assets/`.

## Estado

Wireframe v1.0, Concepto A. Es una propuesta de diseño y comportamiento, no la versión final de producción.
