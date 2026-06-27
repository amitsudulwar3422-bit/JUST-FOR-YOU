/* ==========================================================================
   TO THE GIRL WHO BECAME MY PEACE — animation engine
   GSAP + ScrollTrigger powered. No external assets required.
   ========================================================================== */

if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined'){
  console.warn('[love-letter] GSAP or ScrollTrigger failed to load from the CDN — falling back to CSS-only reveal. Check your internet connection.');
} else {
  gsap.registerPlugin(ScrollTrigger);
}

/* -------------------------------------------------------------------------
   0. LENIS-STYLE SMOOTH SCROLL (lightweight, no external dep needed)
   ------------------------------------------------------------------------- */
(function smoothScrollLite(){
  // Respect reduced-motion users / avoid hijacking scroll on touch for now.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let current = window.scrollY;
  let target = window.scrollY;
  let ease = 0.085;
  let ticking = false;

  function onScroll(){
    target = window.scrollY;
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // We don't override native scroll (keeps accessibility/scrollbar intact);
  // instead we drive a CSS variable some elements can use for subtle parallax.
  function raf(){
    current += (target - current) * ease;
    document.documentElement.style.setProperty('--scroll-y', current.toFixed(2));
    ScrollTrigger.update();
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
})();

/* -------------------------------------------------------------------------
   1. AMBIENT PARTICLES (floating dust / light motes)
   ------------------------------------------------------------------------- */
function spawnParticles(){
  const layer = document.getElementById('particleLayer');
  if (!layer) return;
  const count = window.innerWidth < 700 ? 18 : 34;

  for (let i = 0; i < count; i++){
    const p = document.createElement('div');
    p.className = 'particle';
    const size = gsap.utils.random(2, 6);
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.left = gsap.utils.random(0, 100) + 'vw';
    p.style.top = gsap.utils.random(0, 100) + 'vh';
    layer.appendChild(p);

    gsap.set(p, { opacity: gsap.utils.random(0.15, 0.6) });

    gsap.to(p, {
      y: () => gsap.utils.random(-120, -260),
      x: () => gsap.utils.random(-40, 40),
      duration: () => gsap.utils.random(10, 22),
      repeat: -1,
      ease: 'sine.inOut',
      delay: gsap.utils.random(0, 8),
      onRepeat: () => {
        gsap.set(p, { top: '100vh', left: gsap.utils.random(0, 100) + 'vw' });
      }
    });

    gsap.to(p, {
      opacity: () => gsap.utils.random(0.1, 0.55),
      duration: () => gsap.utils.random(3, 6),
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }
}

/* -------------------------------------------------------------------------
   2. OCCASIONAL FLOATING BUTTERFLIES
   ------------------------------------------------------------------------- */
function butterflySVG(color){
  return `<svg viewBox="0 0 26 22" xmlns="http://www.w3.org/2000/svg">
    <g>
      <path d="M13 11 C9 2 0 1 1 8 C2 14 9 13 13 11Z" fill="${color}" opacity="0.85"/>
      <path d="M13 11 C17 2 26 1 25 8 C24 14 17 13 13 11Z" fill="${color}" opacity="0.85"/>
      <path d="M13 11 C10 16 4 17 6 20 C8 22 12 18 13 11Z" fill="${color}" opacity="0.65"/>
      <path d="M13 11 C16 16 22 17 20 20 C18 22 14 18 13 11Z" fill="${color}" opacity="0.65"/>
      <line x1="13" y1="6" x2="13" y2="16" stroke="#2c4a78" stroke-width="0.8"/>
    </g>
  </svg>`;
}

function spawnButterfly(layer){
  const b = document.createElement('div');
  b.className = 'butterfly';
  const colors = ['#8FAEDE', '#FFFFFF', '#5C84C4'];
  b.innerHTML = butterflySVG(colors[Math.floor(Math.random() * colors.length)]);
  layer.appendChild(b);

  const startX = gsap.utils.random(0, window.innerWidth);
  const startY = window.innerHeight + 40;
  gsap.set(b, { x: startX, y: startY, opacity: 0, rotate: 0 });

  const tl = gsap.timeline({
    onComplete: () => b.remove()
  });

  tl.to(b, { opacity: 0.85, duration: 1 })
    .to(b, {
      x: `+=${gsap.utils.random(-150, 150)}`,
      y: `-=${window.innerHeight * gsap.utils.random(0.6, 1.1)}`,
      rotate: gsap.utils.random(-15, 15),
      duration: gsap.utils.random(7, 12),
      ease: 'sine.inOut',
    }, 0)
    .to(b, { opacity: 0, duration: 1.2 }, '-=1.2');

  // wing flutter
  gsap.to(b.querySelector('svg'), {
    scaleX: 0.7,
    duration: 0.35,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });
}

function startButterflyLoop(){
  const layer = document.getElementById('butterflyLayer');
  if (!layer) return;
  function loop(){
    spawnButterfly(layer);
    gsap.delayedCall(gsap.utils.random(6, 14), loop);
  }
  gsap.delayedCall(3, loop);
}

/* -------------------------------------------------------------------------
   3. OPENING SEQUENCE: dark screen -> handwriting -> petals -> envelope
   ------------------------------------------------------------------------- */
function fallingPetal(container){
  const petal = document.createElement('div');
  petal.className = 'opening-petal';
  const size = gsap.utils.random(8, 16);
  petal.style.width = size + 'px';
  petal.style.height = size * 0.8 + 'px';
  petal.style.left = gsap.utils.random(0, 100) + 'vw';
  container.appendChild(petal);

  gsap.set(petal, { rotation: gsap.utils.random(0, 360) });
  gsap.to(petal, { opacity: gsap.utils.random(0.5, 0.9), duration: 0.6 });
  gsap.to(petal, {
    y: window.innerHeight + 60,
    x: `+=${gsap.utils.random(-80, 80)}`,
    rotation: `+=${gsap.utils.random(180, 540)}`,
    duration: gsap.utils.random(6, 11),
    ease: 'none',
    onComplete: () => petal.remove()
  });
  gsap.to(petal, {
    opacity: 0,
    duration: 1.5,
    delay: gsap.utils.random(4, 8)
  });
}

function initOpeningSequence(){
  const title = document.getElementById('openingTitle');
  const petalLayer = document.getElementById('openingPetals');
  const envelopeWrap = document.getElementById('envelopeWrap');
  const envelope = document.getElementById('envelope');
  const hint = document.getElementById('openingHint');
  const opening = document.getElementById('opening');

  let petalInterval = null;

  const tl = gsap.timeline({ delay: 0.3 });

  // Handwritten text slowly appears
  tl.to(title, {
    opacity: 1,
    filter: 'blur(0px)',
    duration: 2.2,
    ease: 'power2.out'
  });

  // After ~2s, petals begin falling
  tl.call(() => {
    petalInterval = setInterval(() => fallingPetal(petalLayer), 280);
  }, null, '+=0.3');

  // Envelope slowly appears
  tl.to(envelopeWrap, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 1.4,
    ease: 'power3.out'
  }, '+=1.2');

  tl.to(hint, { opacity: 1, duration: 0.8 }, '-=0.4');

  function openEnvelope(){
    if (envelope.classList.contains('is-open')) return;
    envelope.classList.add('is-open');
    gsap.to(hint, { opacity: 0, duration: 0.4 });

    const openTl = gsap.timeline({ delay: 0.5 });

    // letter slides out of the envelope
    openTl.to('#envelopeLetterPeek', {
      y: '-92%',
      duration: 1.3,
      ease: 'power3.out'
    });

    openTl.to(envelopeWrap, {
      scale: 1.06,
      duration: 0.5,
      ease: 'power1.inOut'
    }, '<');

    // fade out the whole opening overlay, reveal the site
    openTl.to(opening, {
      opacity: 0,
      duration: 1.2,
      ease: 'power2.inOut',
      onComplete: () => {
        if (petalInterval) clearInterval(petalInterval);
        opening.classList.add('is-hidden');
        document.body.style.overflow = '';
        revealLetterIntro();
      }
    }, '+=0.5');
  }

  envelope.addEventListener('click', openEnvelope);
  envelopeWrap.addEventListener('click', openEnvelope);

  // lock scroll until opened
  document.body.style.overflow = 'hidden';
}

function revealLetterIntro(){
  // small nudge animation for the very first diary paragraph once envelope opens
  const lead = document.querySelector('.letter-para--lead');
  if (lead){
    gsap.to(lead, { opacity: 1, y: 0, duration: 1.1, ease: 'power2.out' });
  }
}

/* -------------------------------------------------------------------------
   4. MUSIC TOGGLE
   ------------------------------------------------------------------------- */
function initMusicToggle(){
  const btn = document.getElementById('musicToggle');
  const audio = document.getElementById('bgMusic');
  const iconPlay = btn.querySelector('.icon-play');
  const iconPause = btn.querySelector('.icon-pause');
  let playing = false;

  btn.addEventListener('click', () => {
    if (!audio.src && !audio.querySelector('source')){
      // No music source has been added yet — gently let the user know via title.
      btn.setAttribute('title', 'Add a music file in the audio tag to enable sound');
    }
    playing = !playing;
    btn.classList.toggle('is-playing', playing);
    btn.setAttribute('aria-pressed', String(playing));
    iconPlay.style.display = playing ? 'none' : 'block';
    iconPause.style.display = playing ? 'block' : 'none';

    if (playing){
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  });
}

/* -------------------------------------------------------------------------
   5. SCROLL THREAD PROGRESS
   ------------------------------------------------------------------------- */
function initScrollThread(){
  const fill = document.getElementById('scrollThreadFill');
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    fill.style.width = pct + '%';
  }, { passive: true });
}

/* -------------------------------------------------------------------------
   6. LETTER PARAGRAPH REVEALS + GLOW PHRASES
   ------------------------------------------------------------------------- */
function initLetterReveals(){
  gsap.utils.toArray('.letter-para').forEach((para) => {
    if (para.classList.contains('letter-para--lead')) return; // handled by envelope open
    gsap.to(para, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: para,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  gsap.utils.toArray('.glow-phrase').forEach((el) => {
    gsap.fromTo(el, { textShadow: '0 0 0px rgba(143,174,222,0)' }, {
      textShadow: '0 0 18px rgba(143,174,222,0.55)',
      duration: 1.4,
      scrollTrigger: { trigger: el, start: 'top 80%' }
    });
  });

  gsap.utils.toArray('.handwritten-note').forEach((note) => {
    gsap.to(note, {
      opacity: 0.85,
      duration: 1,
      scrollTrigger: { trigger: note, start: 'top 90%' }
    });
  });
}

/* -------------------------------------------------------------------------
   7. POLAROID / PHOTO SCROLL REVEALS + HOVER SPARKLE
   ------------------------------------------------------------------------- */
function initPolaroidReveals(){
  gsap.utils.toArray('.polaroid-frame, .mw-item').forEach((card) => {
    const tilt = parseFloat(card.dataset.tilt || 0);
    gsap.fromTo(card,
      { opacity: 0, y: 50, rotate: tilt ? tilt * 1.6 : (card.classList.contains('mw-rot--1') ? -8 : 0) },
      {
        opacity: 1,
        y: 0,
        rotate: tilt || 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' }
      }
    );

    card.style.setProperty('--hover-rot', (tilt || 0) + 'deg');

    // sparkle on hover
    if (!card.querySelector('.sparkle-burst')){
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle-burst';
      sparkle.innerHTML = `<svg viewBox="0 0 26 26"><path d="M13 0 L15 11 L26 13 L15 15 L13 26 L11 15 L0 13 L11 11Z" fill="#fff"/></svg>`;
      card.appendChild(sparkle);
    }
    card.addEventListener('mouseenter', () => {
      const s = card.querySelector('.sparkle-burst');
      gsap.fromTo(s, { scale: 0.4, opacity: 0, rotate: 0 }, { scale: 1, opacity: 1, rotate: 90, duration: 0.5, ease: 'back.out(2)' });
    });
    card.addEventListener('mouseleave', () => {
      const s = card.querySelector('.sparkle-burst');
      gsap.to(s, { opacity: 0, duration: 0.3 });
    });
  });
}

/* -------------------------------------------------------------------------
   8. SWEET SECTION REVEAL
   ------------------------------------------------------------------------- */
function initSweetSection(){
  gsap.to('.sweet-heading', {
    opacity: 1, duration: 1,
    scrollTrigger: { trigger: '.sweet-heading', start: 'top 85%' }
  });
  gsap.utils.toArray('.sweet-item').forEach((item, i) => {
    gsap.to(item, {
      opacity: 1, y: 0, scale: 1,
      duration: 0.8,
      delay: i * 0.12,
      ease: 'back.out(1.6)',
      scrollTrigger: { trigger: item, start: 'top 90%', toggleActions: 'play none none none' }
    });
  });
}

/* -------------------------------------------------------------------------
   9. SHAYARI LINE-BY-LINE REVEAL
   ------------------------------------------------------------------------- */
function initShayariReveal(){
  gsap.to('.shayari-heading', {
    opacity: 1, duration: 1.2,
    scrollTrigger: { trigger: '.shayari-heading', start: 'top 80%' }
  });

  gsap.utils.toArray('.shayari-line').forEach((line, i) => {
    gsap.to(line, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.shayari-paper',
        start: 'top 60%',
      },
      delay: 0.5 + i * 0.55
    });
  });
}

/* -------------------------------------------------------------------------
   10. BOUQUET BLOOM SEQUENCE
   ------------------------------------------------------------------------- */
function sparklePop(container){
  const s = document.createElement('div');
  s.className = 'bouquet-sparkle';
  s.style.left = gsap.utils.random(20, 80) + '%';
  s.style.top = gsap.utils.random(15, 55) + '%';
  container.appendChild(s);
  gsap.timeline({ onComplete: () => s.remove() })
    .to(s, { opacity: 1, scale: 1.4, duration: 0.4, ease: 'power1.out' })
    .to(s, { opacity: 0, scale: 0.3, duration: 0.6 });
}

function flyingPetalAcrossScreen(container){
  const p = document.createElement('div');
  p.className = 'opening-petal';
  p.style.position = 'absolute';
  p.style.opacity = '0.8';
  const size = gsap.utils.random(8, 14);
  p.style.width = size + 'px';
  p.style.height = size * 0.8 + 'px';
  const fromLeft = Math.random() > 0.5;
  p.style.top = gsap.utils.random(10, 70) + '%';
  p.style.left = fromLeft ? '-5%' : '105%';
  container.appendChild(p);
  gsap.to(p, {
    x: fromLeft ? window.innerWidth * 0.8 : -window.innerWidth * 0.8,
    y: gsap.utils.random(-40, 60),
    rotation: gsap.utils.random(180, 480) * (fromLeft ? 1 : -1),
    duration: gsap.utils.random(3, 5),
    ease: 'power1.inOut',
    onComplete: () => p.remove()
  });
}

function initBouquetReveal(){
  const section = document.getElementById('bouquetSection');
  const darken = document.getElementById('bouquetDarken');
  const wrap = document.getElementById('bouquetWrap');
  const sparkles = document.getElementById('bouquetSparkles');
  const petals = document.getElementById('bouquetPetals');
  const tagline = document.getElementById('bouquetTagline');

  let triggered = false;

  ScrollTrigger.create({
    trigger: section,
    start: 'top 55%',
    onEnter: () => {
      if (triggered) return;
      triggered = true;

      const tl = gsap.timeline();

      // screen pauses & darkens slightly
      tl.to(darken, { opacity: 0.18, duration: 1, ease: 'power1.inOut' });

      // bouquet blooms from bottom center
      tl.to(wrap, {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 1.6,
        ease: 'elastic.out(1, 0.65)'
      }, '+=0.3');

      // individual rose "bloom" pop
      tl.from('.rose', {
        scale: 0.4,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: 'back.out(2.2)'
      }, '-=1.2');

      tl.to(tagline, { opacity: 1, duration: 1 }, '-=0.4');

      // darken fades back
      tl.to(darken, { opacity: 0, duration: 1.2 }, '-=0.2');

      // sparkles + flying petals, ongoing
      tl.call(() => {
        for (let i = 0; i < 10; i++){
          gsap.delayedCall(i * 0.18, () => sparklePop(sparkles));
        }
        for (let i = 0; i < 6; i++){
          gsap.delayedCall(i * 0.4, () => flyingPetalAcrossScreen(petals));
        }
        // keep a slow ambient trickle of sparkles while section is in view
        const trickle = setInterval(() => sparklePop(sparkles), 900);
        ScrollTrigger.create({
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          onLeave: () => clearInterval(trickle),
          onLeaveBack: () => clearInterval(trickle)
        });
      });
    },
    once: true
  });
}

/* -------------------------------------------------------------------------
   11. MEMORY WALL REVEAL
   ------------------------------------------------------------------------- */
function initMemoryWall(){
  gsap.to('.memory-wall-heading', {
    opacity: 1, duration: 1,
    scrollTrigger: { trigger: '.memory-wall-heading', start: 'top 85%' }
  });

  gsap.utils.toArray('.mw-deco').forEach((deco, i) => {
    gsap.fromTo(deco, { opacity: 0, scale: 0.5 }, {
      opacity: 0.85, scale: 1, duration: 1,
      delay: i * 0.2,
      scrollTrigger: { trigger: '.memory-wall-grid', start: 'top 80%' }
    });
  });

  gsap.to('.memory-note', {
    opacity: 0.8, duration: 1,
    scrollTrigger: { trigger: '.memory-note', start: 'top 90%' }
  });
}

/* -------------------------------------------------------------------------
   12. ENDING SEQUENCE
   ------------------------------------------------------------------------- */
function initEndingSequence(){
  const message = document.getElementById('endingMessage');
  const signoff = document.getElementById('endingSignoff');
  const heart = document.getElementById('endingHeart');

  ScrollTrigger.create({
    trigger: '#endingSection',
    start: 'top 60%',
    once: true,
    onEnter: () => {
      const tl = gsap.timeline();
      tl.to(message, { opacity: 1, duration: 2, ease: 'power2.out' });
      tl.to(signoff, { opacity: 1, duration: 1.4, ease: 'power2.out' }, '+=0.6');
      tl.to(heart, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)' }, '+=0.8');
      // single beat then fade
      tl.to(heart, { scale: 1.18, duration: 0.35, ease: 'power1.out' }, '+=0.1');
      tl.to(heart, { scale: 1, duration: 0.35, ease: 'power1.in' });
      tl.to(heart, { opacity: 0, duration: 1.6 }, '+=1');
    }
  });
}

/* -------------------------------------------------------------------------
   INIT
   ------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  function safeInit(name, fn){
    try {
      fn();
    } catch (err) {
      console.warn('[love-letter] ' + name + ' failed to initialize:', err);
    }
  }

  safeInit('spawnParticles', spawnParticles);
  safeInit('startButterflyLoop', startButterflyLoop);
  safeInit('initOpeningSequence', initOpeningSequence);
  safeInit('initMusicToggle', initMusicToggle);
  safeInit('initScrollThread', initScrollThread);
  safeInit('initLetterReveals', initLetterReveals);
  safeInit('initPolaroidReveals', initPolaroidReveals);
  safeInit('initSweetSection', initSweetSection);
  safeInit('initShayariReveal', initShayariReveal);
  safeInit('initBouquetReveal', initBouquetReveal);
  safeInit('initMemoryWall', initMemoryWall);
  safeInit('initEndingSequence', initEndingSequence);

  safeInit('musicToggleScrollDarkening', () => {
    // darken the floating music toggle once we scroll past the dreamy ice background
    ScrollTrigger.create({
      trigger: '#letterSection',
      start: 'top 20%',
      end: 'bottom bottom',
      onEnter: () => document.getElementById('musicToggle').classList.add('is-dark'),
      onLeaveBack: () => document.getElementById('musicToggle').classList.remove('is-dark')
    });

    ScrollTrigger.create({
      trigger: '#bouquetSection',
      start: 'top 30%',
      onEnter: () => document.getElementById('musicToggle').classList.remove('is-dark'),
      onLeaveBack: () => document.getElementById('musicToggle').classList.add('is-dark')
    });
  });
});
