// ===== FIX 1: Proper GSAP/ScrollTrigger Loading =====
// Wait for DOM to be ready before initializing GSAP
document.addEventListener('DOMContentLoaded', function() {
    initGSAPFeatures();
});

function initGSAPFeatures() {
    // Check if GSAP and ScrollTrigger are available
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger not loaded - using fallback');
        // Fallback: reveal everything instantly
        document.querySelectorAll('.hero-copy h1 .split-word span').forEach(s => {
            s.style.transform = 'translateY(0)';
            s.style.opacity = '1';
        });
        document.querySelectorAll('.eyebrow, .hero-copy p, .hero-actions, .hero-trust, .hero-showcase').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        // Show all staggered items
        document.querySelectorAll('.equipment-grid .equipment-card, .service-showcase-grid .service-showcase, .works-grid .work-card').forEach(el => {
            el.style.opacity = '1';
        });
        return;
    }

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // --- Hero Entrance Animation ---
    gsap.to('.hero-copy h1 .split-word span', {
        y: '0%',
        duration: 0.9,
        stagger: 0.045,
        ease: 'power4.out'
    });
    gsap.fromTo('.eyebrow', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .7, delay: .1, ease: 'power2.out' });
    gsap.fromTo('.hero-copy p, .hero-actions, .hero-trust', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .8, delay: .55, stagger: .1, ease: 'power2.out' });
    gsap.fromTo('.hero-showcase', { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 1, delay: .3, ease: 'power3.out' });

    // --- FIX 2: Optimized ScrollTrigger Staggered Entrances ---
    // Instead of ScrollTrigger.batch (which can cause reflows), use individual triggers
    const staggerGroups = [
        '.equipment-grid .equipment-card',
        '.service-showcase-grid .service-showcase',
        '.works-grid .work-card',
        '.process-timeline-horizontal .process-step-h',
        '.sector-grid .sector',
        '.about-points > div',
        '.stats-grid .stat'
    ];

    staggerGroups.forEach(selector => {
        const items = document.querySelectorAll(selector);
        if (!items.length) return;
        
        // Set initial state
        gsap.set(items, { opacity: 0, y: 30 });
        
        // Create individual scroll triggers for better performance
        items.forEach((item, index) => {
            gsap.to(item, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                delay: index * 0.08,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 88%',
                    once: true,
                    invalidateOnRefresh: false
                }
            });
        });
    });

    // --- Section Headers Animation ---
    document.querySelectorAll('.section-head, .section-head.light').forEach(head => {
        gsap.fromTo(head, { opacity: 0, y: 24 }, {
            opacity: 1, y: 0, duration: .8, ease: 'power2.out',
            scrollTrigger: { 
                trigger: head, 
                start: 'top 90%', 
                once: true,
                invalidateOnRefresh: false
            }
        });
    });

    // Refresh ScrollTrigger after animations are set
    ScrollTrigger.refresh();
}

// ===== EXISTING CODE (with performance optimizations) =====
const header = document.querySelector('.site-header');
const backTop = document.querySelector('.back-top');
const cursorGlow = document.querySelector('.cursor-glow');
const navToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.main-nav');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 30);
  backTop.classList.toggle('show', window.scrollY > 500);
});

navToggle?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('mobile-open');
  navToggle.setAttribute('aria-expanded', open);
});

document.querySelectorAll('.main-nav a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('mobile-open'));
});

backTop?.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

// ===== FIX 3: Optimized Cursor Glow Performance =====
if (window.matchMedia('(pointer:fine)').matches) {
  let rafId = null;
  let targetX = 0, targetY = 0;
  
  window.addEventListener('mousemove', e => {
    targetX = e.clientX;
    targetY = e.clientY;
    if (!rafId) {
      rafId = requestAnimationFrame(updateCursorGlow);
    }
  });
  
  function updateCursorGlow() {
    cursorGlow.style.opacity = '1';
    cursorGlow.style.left = `${targetX}px`;
    cursorGlow.style.top = `${targetY}px`;
    rafId = null;
  }
}

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {threshold:0.12});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== FIX 4: Optimized Counter Animation =====
const counters = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count);
    const start = performance.now();
    const duration = 1300;
    
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1-p, 3);
      const current = Math.floor(target * eased);
      el.textContent = current.toLocaleString();
      if (p < 1) {
        requestAnimationFrame(tick);
      }
    }
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, {threshold:0.7});
counters.forEach(c => counterObserver.observe(c));

const tabs = document.querySelectorAll('.solution-tab');
const panels = document.querySelectorAll('.panel-content');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const key = tab.dataset.solution;
    tabs.forEach(t => t.classList.toggle('active', t === tab));
    panels.forEach(p => p.classList.toggle('active', p.dataset.panel === key));
  });
});

const sections = [...document.querySelectorAll('main section[id]')];
const navItems = [...document.querySelectorAll('.main-nav a')];
const activeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
    }
  });
}, {rootMargin:'-35% 0px -55% 0px'});
sections.forEach(s => activeObserver.observe(s));

document.getElementById('quoteForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const service = document.getElementById('service').value;
  const details = document.getElementById('details').value.trim();

  const message = [
    'CNE Zone — New Project Request',
    '',
    `Name: ${name}`,
    `Phone: ${phone}`,
    email ? `Email: ${email}` : '',
    `Service: ${service}`,
    details ? `Details: ${details}` : ''
  ].filter(Boolean).join('\n');

  window.open(`https://wa.me/923008005682?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
});

document.getElementById('year').textContent = new Date().getFullYear();

// Small premium tilt effect on project cards (desktop only).
if (window.matchMedia('(pointer:fine)').matches) {
  document.querySelectorAll('.work-card').forEach(card => {
    let rafId = null;
    card.addEventListener('mousemove', e => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        card.style.transform = `perspective(900px) rotateX(${y * -2}deg) rotateY(${x * 2}deg) translateY(-5px)`;
        rafId = null;
      });
    });
    card.addEventListener('mouseleave', () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      card.style.transform = '';
    });
  });
}

// ===== 8D DEPTH — mouse-tracked 3D tilt for hero equipment panel & service cards =====
if (window.matchMedia('(pointer:fine)').matches) {
  const tiltTargets = [
    { el: document.querySelector('.equipment-panel'), maxTilt: 6, lift: -6 },
    ...Array.from(document.querySelectorAll('.service-showcase')).map(el => ({ el, maxTilt: 4, lift: -7 })),
    ...Array.from(document.querySelectorAll('.equipment-card')).map(el => ({ el, maxTilt: 8, lift: -4 }))
  ].filter(t => t.el);

  tiltTargets.forEach(({ el, maxTilt, lift }) => {
    let rafId = null;
    el.addEventListener('mousemove', e => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        el.style.transform = `perspective(1000px) rotateX(${y * -maxTilt}deg) rotateY(${x * maxTilt}deg) translateY(${lift}px) translateZ(10px)`;
        rafId = null;
      });
    });
    el.addEventListener('mouseleave', () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      el.style.transform = '';
    });
  });

  // Hero backdrop parallax layer follows cursor at very low intensity for depth
  const heroBackdrop = document.querySelector('.hero-backdrop');
  const heroSection = document.querySelector('.hero-corporate');
  if (heroBackdrop && heroSection) {
    let rafId = null;
    heroSection.addEventListener('mousemove', e => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const r = heroSection.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        heroBackdrop.style.transform = `translate3d(${x * -18}px, ${y * -14}px, 0)`;
        rafId = null;
      });
    });
    heroSection.addEventListener('mouseleave', () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      heroBackdrop.style.transform = '';
    });
  }
}

// ---- Preloader ----
const preloader = document.getElementById('preloader');
const preloaderFill = document.querySelector('.preloader-fill');
let loadProgress = 0;
const loadTimer = setInterval(() => {
  loadProgress = Math.min(loadProgress + Math.random() * 18, 92);
  if (preloaderFill) preloaderFill.style.width = loadProgress + '%';
}, 120);

window.addEventListener('load', () => {
  clearInterval(loadTimer);
  if (preloaderFill) preloaderFill.style.width = '100%';
  setTimeout(() => {
    preloader?.classList.add('done');
    document.body.classList.add('loaded');
    // GSAP features will be initialized by DOMContentLoaded handler
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      initGSAPFeatures();
    }
  }, 350);
});

// Safety net in case 'load' never fires cleanly
setTimeout(() => {
  if (preloader && !preloader.classList.contains('done')) {
    clearInterval(loadTimer);
    preloader.classList.add('done');
    document.body.classList.add('loaded');
  }
}, 3500);

// ---- Custom magnetic cursor ----
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
if (window.matchMedia('(pointer:fine)').matches && cursorDot && cursorRing) {
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
  let rafId = null;
  
  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
    if (!rafId) {
      rafId = requestAnimationFrame(trackRing);
    }
  });
  
  function trackRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    rafId = requestAnimationFrame(trackRing);
  }

  document.addEventListener('mousedown', () => cursorRing.classList.add('pressed'));
  document.addEventListener('mouseup', () => cursorRing.classList.remove('pressed'));

  const hoverables = 'a, button, input, textarea, select, .service-showcase, .work-card, .equipment-card, .sector, .solution-tab';
  document.querySelectorAll(hoverables).forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
  });
}

// ---- Scroll progress bar ----
const scrollProgress = document.getElementById('scrollProgress');
function updateScrollProgress() {
  if (!scrollProgress) return;
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  scrollProgress.style.width = scrolled + '%';
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });

// ---- Magnetic pull for primary interactive elements ----
if (window.matchMedia('(pointer:fine)').matches) {
  const magnets = document.querySelectorAll('.btn-primary, .btn-ghost, .nav-cta, .whatsapp-float, .back-top');
  magnets.forEach(el => {
    el.classList.add('magnetic');
    let rafId = null;
    el.addEventListener('mousemove', e => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.22}px, ${y * 0.35}px)`;
        rafId = null;
      });
    });
    el.addEventListener('mouseleave', () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      el.style.transform = '';
    });
  });
}

// ---- Split-text hero headline reveal (runs once preloader finishes) ----
function splitHeroText() {
  const h1 = document.querySelector('.hero-copy h1');
  if (!h1 || h1.dataset.split) return;
  h1.dataset.split = 'true';
  const walk = (node) => {
    [...node.childNodes].forEach(child => {
      if (child.nodeType === 3 && child.textContent.trim()) {
        const words = child.textContent.split(' ');
        const frag = document.createDocumentFragment();
        words.forEach((w, i) => {
          const outer = document.createElement('span');
          outer.className = 'split-word';
          const inner = document.createElement('span');
          inner.textContent = w;
          outer.appendChild(inner);
          frag.appendChild(outer);
          if (i < words.length - 1) frag.appendChild(document.createTextNode(' '));
        });
        child.replaceWith(frag);
      } else if (child.nodeType === 1) {
        walk(child);
      }
    });
  };
  walk(h1);
}
splitHeroText();

// ---- Marquee: duplicate footer tagline for a seamless infinite scroll ----
const marqueeHost = document.querySelector('.equipment-panel-foot span:last-child');
if (marqueeHost) {
  const text = marqueeHost.textContent.trim();
  marqueeHost.innerHTML = `<span class="marquee-track">${text}&nbsp;&nbsp;&nbsp;${text}&nbsp;&nbsp;&nbsp;</span>`;
}

console.log('🚀 CNE Zone - Professional Security & Networking');
console.log('💬 WhatsApp: +92 300 8005682');
console.log('📍 Islamabad, Pakistan');
