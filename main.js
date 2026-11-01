/* =========================================================
   ALGORIZMA · main.js
   Complete version: all animations for all 8 sections.
   You don't need to edit anything in this file.
   ========================================================= */
(function () {
  'use strict';
  var root = document.documentElement;

  /* ---------- Footer year (updates itself) ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Top menu gets a background when you scroll ---------- */
  var nav = document.getElementById('nav');
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 40); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Phone menu open / close ---------- */
  var btn = document.querySelector('.menu-btn');
  var menu = document.getElementById('menu');
  function setMenu(open) {
    btn.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
  }
  btn.addEventListener('click', function () { setMenu(btn.getAttribute('aria-expanded') !== 'true'); });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Safety: if the animation library didn't load, show everything plainly ---------- */
  if (typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') {
    root.classList.remove('anim');
    return;
  }
  if (!root.classList.contains('anim')) return;
  window.ALG_READY = true;
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Prepare the "ink drawing" lines ---------- */
  function prepStroke(els) {
    els.forEach(function (el) {
      var len = el.getTotalLength();
      el.style.strokeDasharray = len;
      el.style.strokeDashoffset = len;
    });
  }
  var markParts  = gsap.utils.toArray('.hero-mark .d');
  var geoLines   = gsap.utils.toArray('.geo .c');
  var nicheLines = gsap.utils.toArray('.niche .n');
  prepStroke(markParts);
  prepStroke(geoLines);
  prepStroke(nicheLines);

  var DARK  = 'brightness(0.08) sepia(0.15) contrast(1.06)';
  var LIGHT = 'brightness(1) sepia(0.15) contrast(1.06)';

  gsap.set('.hero-mark .leg, .hero-mark .knob', { fillOpacity: 0 });
  gsap.set('.hero-mark .jewel', { scale: 0, transformOrigin: '50% 50%' });
  gsap.set(['.hero-mark', '.geo', '.niche'], { autoAlpha: 1 });
  gsap.set('.headline .line > span', { y: 0, yPercent: 105 });
  gsap.set('.eyebrow, .sub, .btns, .plaque', { y: 24 });
  gsap.set('.statue-img', { y: 30, filter: DARK });
  gsap.set('.motto-rule', { scaleX: 0 });

  /* ---------- Opening sequence (fast: headline readable in under 2 seconds) ---------- */
  var tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.1 });

  tl.to(geoLines,   { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', stagger: 0.06 }, 0)
    .to(markParts,  { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut', stagger: 0.08 }, 0.1)
    .to(nicheLines, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut', stagger: 0.1 }, 0.15)
    .to('.niche .axis, .niche .keystone', { autoAlpha: 1, duration: 0.8 }, 0.8)
    .to('.halo', { autoAlpha: 1, duration: 1.4, ease: 'power1.out' }, 0.3)

    // The statue emerges from shadow, then light sweeps across her
    .to('.statue-img', { autoAlpha: 1, y: 0, duration: 1.1, ease: 'power2.out' }, 0.3)
    .to('.statue-img', { filter: LIGHT, duration: 1.4, ease: 'power1.inOut' }, 0.5)
    .fromTo('.beam', { backgroundPosition: '100% 0%' }, { backgroundPosition: '0% 0%', duration: 1.6, ease: 'power2.inOut' }, 0.6)
    .to('.statue-fallback', { autoAlpha: 1, duration: 1 }, 0.4)

    // Words arrive while the light is still moving
    .to('.eyebrow', { autoAlpha: 1, y: 0, duration: 0.8 }, 0.35)
    .to('.headline .line > span', { yPercent: 0, duration: 1, stagger: 0.12, ease: 'power4.out' }, 0.45)
    .to('.hero-mark .leg, .hero-mark .knob', { fillOpacity: 1, duration: 0.6 }, 0.7)
    .to('.hero-mark .jewel', { scale: 1, duration: 0.5, ease: 'back.out(3)' }, 0.9)
    .to('.sub', { autoAlpha: 1, y: 0, duration: 0.9 }, 0.75)
    .to('.btns', { autoAlpha: 1, y: 0, duration: 0.9 }, 0.9)
    .to('.geo .dot, .geo .note', { autoAlpha: 1, duration: 0.8, stagger: 0.05 }, 1.0)
    .to('.plaque', { autoAlpha: 1, y: 0, duration: 0.9 }, 1.1)
    .to('.motto-rule', { autoAlpha: 1, scaleX: 1, duration: 1, ease: 'power2.inOut' }, 1.2)
    .add(startLoops, 1.5)
    .to('.scroll-cue', { autoAlpha: 1, duration: 0.8 }, 1.7);

  /* ---------- Repeating effects: rotating motto + light passing over the marble ---------- */
  function startLoops() {
    var items  = gsap.utils.toArray('.motto-item');
    var labels = gsap.utils.toArray('.motto-label');
    gsap.set(items, { autoAlpha: 0, filter: 'blur(8px)', y: 8 });
    gsap.set(labels, { autoAlpha: 0 });

    var motto = gsap.timeline({ repeat: -1 });
    items.forEach(function (item, i) {
      var label = labels[i];
      motto.to(item,  { autoAlpha: 1, filter: 'blur(0px)', y: 0, duration: 1.4, ease: 'power2.out' }, i === 0 ? undefined : '-=0.5')
           .to(label, { autoAlpha: 1, duration: 1 }, '<0.3')
           .to({}, { duration: 2.8 })
           .to(item,  { autoAlpha: 0, filter: 'blur(8px)', y: -8, duration: 1.1, ease: 'power2.in' })
           .to(label, { autoAlpha: 0, duration: 0.8 }, '<');
    });

    var sheen = gsap.timeline({ repeat: -1, repeatDelay: 7, delay: 4 });
    sheen.fromTo('.beam', { backgroundPosition: '100% 0%', opacity: 0.6 },
                          { backgroundPosition: '0% 0%', duration: 3, ease: 'power1.inOut' });

    // Pause when the top section is off screen (saves battery)
    ScrollTrigger.create({
      trigger: '.hero', start: 'top top', end: 'bottom top',
      onLeave:     function () { motto.pause();  sheen.pause(); },
      onEnterBack: function () { motto.resume(); sheen.resume(); }
    });
  }

  /* ---------- Depth effects while scrolling + statue follows the mouse ---------- */
  var mm = gsap.matchMedia();
  function heroScrub() { return { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }; }

  mm.add('(min-width: 861px)', function () {
    gsap.to('.geo',          { yPercent: 8,          ease: 'none', scrollTrigger: heroScrub() });
    gsap.to('.statue-stage', { y: -110, scale: 1.06, ease: 'none', scrollTrigger: heroScrub() });
    gsap.to('.niche',        { y: 40,                ease: 'none', scrollTrigger: heroScrub() });
    gsap.to('.hero-copy',    { y: 60,                ease: 'none', scrollTrigger: heroScrub() });
  });
  mm.add('(max-width: 860px)', function () {
    gsap.to('.geo',          { yPercent: 5,          ease: 'none', scrollTrigger: heroScrub() });
    gsap.to('.statue-stage', { y: -40, scale: 1.04,  ease: 'none', scrollTrigger: heroScrub() });
  });

  mm.add('(min-width: 861px) and (pointer: fine)', function () {
    var sx = gsap.quickTo('.statue-wrap', 'x', { duration: 1.4, ease: 'power3' });
    var sy = gsap.quickTo('.statue-wrap', 'y', { duration: 1.4, ease: 'power3' });
    var hx = gsap.quickTo('.halo', 'x', { duration: 1.8, ease: 'power3' });
    var hy = gsap.quickTo('.halo', 'y', { duration: 1.8, ease: 'power3' });
    function move(e) {
      var nx = e.clientX / window.innerWidth - 0.5;
      var ny = e.clientY / window.innerHeight - 0.5;
      sx(nx * 16); sy(ny * 10);
      hx(nx * -30); hy(ny * -18);
    }
    window.addEventListener('pointermove', move);
    return function () { window.removeEventListener('pointermove', move); };
  });

  /* ---------- Things that "switch on" when scrolled into view:
       gold lines under headings, the Method thread, the redaction bars, the funding bars ---------- */
  gsap.utils.toArray('.folio, [data-in]').forEach(function (el) {
    ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: function () { el.classList.add('in'); } });
  });

  /* ---------- Gentle fade-up for text and cards ---------- */
  ScrollTrigger.batch('[data-fade]', {
    start: 'top 88%', once: true,
    onEnter: function (batch) { gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.12, ease: 'power3.out' }); }
  });

  /* ---------- Numbers in "The Lost Record" count up once ---------- */
  gsap.utils.toArray('.count').forEach(function (el) {
    var end = parseFloat(el.dataset.to);
    var obj = { v: 0 };
    el.textContent = '0'; // without animations, the real number stays visible
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter: function () {
        gsap.to(obj, {
          v: end, duration: 1.8, ease: 'power2.out',
          onUpdate: function () { el.textContent = Math.round(obj.v).toLocaleString('en-US'); }
        });
      }
    });
  });
})();
