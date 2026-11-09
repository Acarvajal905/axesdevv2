/* Axes Dev — Lógica de index.html. Se carga al final del <body>, así que el DOM ya existe.

   Índice
     1. Helpers
     2. Cursor
     3. Typewriter del hero
     4. Nav móvil (hamburguesa)
     5. Loop de las ilustraciones SVG ("Lo que construimos")
     6. Scroll engine desktop (secciones sticky)
     7. Scroll móvil
     8. Eventos

   Convención: los estados van por clases (.active, .is-active, .is-past, .is-hl,
   .is-revealed…) definidas en css/styles.css. Solo los valores continuos del
   scroll (transform, width, height, opacity) se escriben inline. */


/* ── 1. HELPERS ─────────────────────────────────────────────── */
const $ = id => document.getElementById(id);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const clamp01 = v => Math.max(0, Math.min(1, v));
/* Avance 0..1 del scroll dentro de una sección sticky (su .sticky-outer) */
const progressIn = (outer, sy) => clamp01((sy - outer.offsetTop) / (outer.offsetHeight - window.innerHeight));

const mobileMQ = window.matchMedia('(max-width: 768px)');
const isMobile = () => mobileMQ.matches;


/* ── 2. CURSOR (punto + anillo que siguen al mouse) ─────────── */
const cursor = $('cursor');
const ring = $('cursor-ring');
document.addEventListener('mousemove', e => {
  cursor.style.left = ring.style.left = e.clientX + 'px';
  cursor.style.top = ring.style.top = e.clientY + 'px';
});


/* ── 3. TYPEWRITER ──────────────────────────────────────────── */
const typedEl = $('typed-text');
const phrases = ['Tu idea\nya tiene\nequipo.', 'Construimos\ndesde cero.', 'Sin plantillas.\nSin rodeos.'];
let phraseIndex = 0;

/* Primeros n caracteres de la frase; la última línea va en .hl (teal en móvil) */
function render(text, n) {
  const total = text.split('\n').length;
  return text.slice(0, n).split('\n')
    .map((line, i) => (i === total - 1 ? '<span class="hl">' + line + '</span>' : line))
    .join('<br>');
}
function type(text, cb) {
  let n = 0;
  const iv = setInterval(() => {
    n++; typedEl.innerHTML = render(text, n);
    if (n >= text.length) { clearInterval(iv); setTimeout(() => erase(text, cb), 2200); }
  }, 55);
}
function erase(text, cb) {
  let n = text.length;
  const iv = setInterval(() => {
    n--; typedEl.innerHTML = render(text, n);
    if (n <= 0) { clearInterval(iv); cb(); }
  }, 22);
}
function cycle() {
  type(phrases[phraseIndex], () => { phraseIndex = (phraseIndex + 1) % phrases.length; setTimeout(cycle, 300); });
}
cycle();


/* ── 4. NAV MÓVIL ───────────────────────────────────────────── */
const navEl = $('nav');
const burger = $('nav-burger');
const setMenu = open => { navEl.classList.toggle('open', open); burger.setAttribute('aria-expanded', String(open)); };
burger.addEventListener('click', () => setMenu(!navEl.classList.contains('open')));
$$('#nav-links a').forEach(a => a.addEventListener('click', () => setMenu(false)));


/* ── 5. LOOP DE LAS ILUSTRACIONES SVG ───────────────────────── */
/* Los 4 SVG usan <animate> SMIL con begin en tiempos fijos. Se controla el time
   container de cada uno: pausado en t=0 hasta que su slide está activo; ahí se
   reproduce y, al terminar el ciclo, se funde y vuelve a empezar (loop). */
const svcAnim = (() => {
  const HOLD = 2.0;   // s que se mantiene el estado final antes de reiniciar
  const FADE = 0.35;  // s del fundido; debe coincidir con la transition de .svc-svg
  const svgs = ['svg-web', 'svg-opt', 'svg-ux', 'svg-it'].map($);

  // Duración del ciclo de cada SVG = max(begin + dur) de sus <animate>
  const cycles = svgs.map(svg => {
    let end = 0;
    svg.querySelectorAll('animate, animateTransform').forEach(a => {
      end = Math.max(end, (parseFloat(a.getAttribute('begin')) || 0) + (parseFloat(a.getAttribute('dur')) || 0));
    });
    return end;
  });

  const pause = svg => { try { if (!svg.animationsPaused()) svg.pauseAnimations(); } catch (e) {} };
  const resume = svg => { try { if (svg.animationsPaused()) svg.unpauseAnimations(); } catch (e) {} };
  const seek0 = svg => { try { svg.setCurrentTime(0); } catch (e) {} };
  const reset = svg => { pause(svg); seek0(svg); svg.style.opacity = ''; };

  svgs.forEach(reset);

  let active = -1, timer = null;
  function play(i) {
    const svg = svgs[i];
    svg.style.opacity = '';
    seek0(svg);
    resume(svg);
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (active !== i) return;
      svg.style.opacity = '0';                                              // fundido de salida…
      timer = setTimeout(() => { if (active === i) play(i); }, FADE * 1000); // …y reinicia
    }, (cycles[i] + HOLD) * 1000);
  }

  return {
    /* i = índice del slide activo (0..3) o -1 para pausar todos */
    set(i) {
      if (i === active) return;
      active = i;
      clearTimeout(timer); timer = null;
      svgs.forEach((svg, k) => { if (k !== i) reset(svg); });
      if (i >= 0) play(i);
    }
  };
})();


/* ── 6. SCROLL ENGINE DESKTOP ───────────────────────────────── */
const ui = {
  progress: $('progress'),
  hero: { el: $('hero'), title: $('hero-title'), sub: $('hero-sub'), grid: $('grid-bg') },
  contact: { el: $('s-contacto'), bg: $('contact-bg') },
  prob: { outer: $('s-prob-outer'), words: $$('#s-problema .pw') },
  svc: { outer: $('s-svc-outer'), slides: $('svc-slides'), fill: $('svc-hprog'), counter: $('svc-counter') },
  diff: { outer: $('s-diff-outer'), fill: $('diff-prog'), slides: [1, 2, 3].map(i => $('dslide' + i)), dots: [1, 2, 3].map(i => $('dd' + i)) },
  met: {
    outer: $('s-met-outer'), vline: $('met-vline'),
    icons: [1, 2, 3, 4, 5].map(i => $('micon' + i)),
    steps: [1, 2, 3, 4, 5].map(i => $('mstep' + i)),
    dots: [1, 2, 3, 4, 5].map(i => $('mdot' + i)),
  },
  caso: { outer: $('s-caso-outer'), inner: $('s-caso') },
  stickies: $$('.sticky-inner'),
};

/* Hero: título, bajada y grid se desplazan a distinta velocidad */
function updateHero(sy) {
  const ratio = Math.min(sy / ui.hero.el.offsetHeight, 1);
  ui.hero.title.style.transform = `translateY(${ratio * 80}px)`;
  ui.hero.sub.style.transform = `translateY(${ratio * 50}px)`;
  ui.hero.grid.style.transform = `translateY(${ratio * 120}px)`;
}

/* Contacto: el fondo radial crece a medida que entra en pantalla */
function updateContact(vh) {
  const top = ui.contact.el.getBoundingClientRect().top;
  ui.contact.bg.style.transform = `scale(${1 + clamp01((vh - top) / vh) * 0.15})`;
}

/* Problema: cada frase aparece por turno; las .pw-hl se resaltan al final */
function updateProblema(sy) {
  const p = progressIn(ui.prob.outer, sy);
  ui.prob.words.forEach((word, i) => {
    const threshold = (i / ui.prob.words.length) * 0.75;
    const wp = clamp01((p - threshold) / 0.15);
    word.style.opacity = 0.08 + wp * 0.92;
    if (word.classList.contains('pw-hl')) word.classList.toggle('is-hl', wp > 0.85);
  });
}

/* Lo que construimos: track horizontal + loop del SVG del slide más visible */
function updateServicios(sy, vh) {
  const { outer, slides, fill, counter } = ui.svc;
  const total = 4;
  const p = progressIn(outer, sy);
  slides.style.transform = `translateX(-${p * (100 / total) * (total - 1)}%)`;
  fill.style.width = (p * 100) + '%';
  const active = Math.round(p * (total - 1));          // el track se mueve en tercios
  counter.textContent = `0${active + 1} / 0${total}`;
  const inView = sy + vh > outer.offsetTop && sy < outer.offsetTop + outer.offsetHeight;
  svcAnim.set(inView ? active : -1);
}

/* Por qué axes: tres slides, uno visible por tercio de scroll */
function updateDiferencial(sy) {
  const p = progressIn(ui.diff.outer, sy);
  ui.diff.fill.style.width = (p * 100) + '%';
  const current = p < 0.33 ? 1 : p < 0.66 ? 2 : 3;
  ui.diff.slides.forEach((slide, k) => {
    slide.classList.toggle('is-active', k + 1 === current);
    slide.classList.toggle('is-past', k + 1 < current);
  });
  ui.diff.dots.forEach((dot, k) => dot.classList.toggle('is-active', k + 1 === current));
}

/* Cómo trabajamos: fase activa por quinto de scroll; icono, paso y punto van juntos */
function updateMetodologia(sy) {
  const p = progressIn(ui.met.outer, sy);
  const current = Math.min(Math.floor(p * 5) + 1, 5);
  ui.met.vline.style.height = (p * 100) + '%';
  for (let k = 0; k < 5; k++) {
    const isActive = k + 1 === current, isPast = k + 1 < current;
    ui.met.icons[k].classList.toggle('is-active', isActive);
    ui.met.steps[k].classList.toggle('is-active', isActive);
    ui.met.steps[k].classList.toggle('is-past', isPast);
    ui.met.dots[k].classList.toggle('is-active', isActive);
    ui.met.dots[k].classList.toggle('is-past', isPast);
  }
}

/* Caso: info y captura al 5%; flechas y anotaciones al 30%. No se revierte al subir.
   (La sección está deshabilitada en index.html dentro de un <template>; si no existe, no hace nada.) */
function updateCaso(sy) {
  if (!ui.caso.outer) return;
  const p = progressIn(ui.caso.outer, sy);
  if (p > 0.05) ui.caso.inner.classList.add('is-revealed');
  if (p > 0.3) ui.caso.inner.classList.add('is-annotated');
}

/* Marca .active en la sección fijada o entrando; dispara las transiciones CSS (labels, equipo…) */
function updateStickies(vh) {
  ui.stickies.forEach(el => {
    const r = el.getBoundingClientRect();
    const isStuck = r.top <= 0 && r.bottom >= vh * 0.5;
    const isEntering = r.top >= 0 && r.top < vh * 0.6;
    el.classList.toggle('active', isStuck || isEntering);
  });
}

function onScroll() {
  if (isMobile()) { onScrollMobile(); return; }
  const sy = window.scrollY, vh = window.innerHeight;
  ui.progress.style.height = (sy / (document.body.scrollHeight - vh) * 100) + '%';
  updateHero(sy);
  updateContact(vh);
  updateProblema(sy);
  updateServicios(sy, vh);
  updateDiferencial(sy);
  updateMetodologia(sy);
  updateCaso(sy);
  updateStickies(vh);
}


/* ── 7. SCROLL MÓVIL ────────────────────────────────────────── */
/* Sin sticky ni scroll-driven: solo marca secciones visibles y reproduce
   (en loop) la card de "Lo que construimos" más centrada en pantalla. */
function onScrollMobile() {
  const vh = window.innerHeight;
  ui.stickies.forEach(el => {
    const r = el.getBoundingClientRect();
    el.classList.toggle('active', r.top < vh * 0.85 && r.bottom > 0);
  });
  let best = -1, bestDist = Infinity;
  $$('.svc-slide').forEach((slide, i) => {
    const r = slide.getBoundingClientRect();
    if (r.bottom < 0 || r.top > vh) return;
    const d = Math.abs((r.top + r.bottom) / 2 - vh / 2);
    if (d < bestDist) { bestDist = d; best = i; }
  });
  svcAnim.set(best);
}


/* ── 8. EVENTOS ─────────────────────────────────────────────── */
$('year').textContent = new Date().getFullYear();
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);
mobileMQ.addEventListener('change', () => { svcAnim.set(-1); onScroll(); });
onScroll();
