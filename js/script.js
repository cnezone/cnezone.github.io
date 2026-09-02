// ===== MOBILE MENU =====
const menu = document.getElementById('menu');
const nav = document.getElementById('navLinks');
if (menu) {
  menu.addEventListener('click', () => nav.classList.toggle('show'));
}
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => nav.classList.remove('show'));
});

// ===== REVEAL ON SCROLL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== YEAR =====
document.querySelectorAll('[data-year]').forEach(el => {
  el.textContent = new Date().getFullYear();
});

// ===== IMAGE FALLBACK (non-slideshow images) =====
document.querySelectorAll('img').forEach(img => {
  if (img.closest('.project-img')) return; // handled by initProjectSlideshows
  img.addEventListener('error', function () {
    this.style.visibility = 'hidden';
  });
});

// ===== PROJECT SLIDESHOWS (5 images per card, animated) =====
(function initProjectSlideshows() {
  document.querySelectorAll('.project-img').forEach((container, idx) => {
    const slides = Array.from(container.querySelectorAll('.slide'));
    const dots = Array.from(container.querySelectorAll('.slide-dots span'));
    if (!slides.length) return;

    let current = 0;
    let liveSlides = slides.slice();

    function showFallback() {
      const icon = container.dataset.fallbackIcon || 'fa-image';
      container.innerHTML = `<i class="fa-solid ${icon}"></i>`;
    }

    // Track broken images; if every slide in a card fails, show a fallback icon.
    let brokenCount = 0;
    slides.forEach(slide => {
      const img = slide.querySelector('img');
      img.addEventListener('error', () => {
        slide.dataset.broken = '1';
        brokenCount++;
        liveSlides = slides.filter(s => s.dataset.broken !== '1');
        if (brokenCount >= slides.length) showFallback();
      });
    });

    function advance() {
      if (!liveSlides.length) return;
      const currentSlide = slides[current];
      let next = current;
      for (let i = 0; i < slides.length; i++) {
        next = (next + 1) % slides.length;
        if (slides[next].dataset.broken !== '1') break;
      }
      if (next === current) return;
      currentSlide.classList.remove('active');
      dots[current] && dots[current].classList.remove('active');
      current = next;
      slides[current].classList.add('active');
      dots[current] && dots[current].classList.add('active');
    }

    // Stagger each card's rotation so they don't all flip in sync.
    setInterval(advance, 2600 + idx * 350);
  });
})();

// ===== STAT COUNTERS =====
function animateCounter(el, target, suffix, duration) {
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const val = Math.floor(p * target);
    el.textContent = suffix === '/7' ? val + '/7' : val + suffix;
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = suffix === '/7' ? target + '/7' : target + suffix;
  }
  requestAnimationFrame(step);
}
const statsGrid = document.getElementById('statsGrid');
if (statsGrid) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-lg').forEach((stat, i) => {
          const numberEl = stat.querySelector('.stat-number');
          const target = parseInt(stat.dataset.count);
          const suffix = stat.dataset.suffix || '+';
          numberEl.textContent = '0' + suffix;
          setTimeout(() => animateCounter(numberEl, target, suffix, 1600), i * 120);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  statsObserver.observe(statsGrid);
}

// ===== LIVE FEED TERMINAL TYPEWRITER =====
(function initFeed() {
  const feed = document.getElementById('liveFeed');
  if (!feed) return;

  const lines = [
    'CAM-14 NORTH GATE ............ <span class="ok">ONLINE</span>',
    'ACCESS GRANTED — J. KHAN ...... 09:41:02',
    'PERIMETER SENSOR 03 ........... <span class="ok">ARMED</span>',
    'NETWORK UPLINK ................ <span class="ok">STABLE</span>',
    'FIRE PANEL — ZONE B ........... <span class="ok">NORMAL</span>',
    'PATROL CHECK-IN — GATE 02 ..... LOGGED',
    'MOTION EVENT — LOADING BAY .... <span class="warn">REVIEW</span>',
    'BACKUP SNAPSHOT ............... <span class="ok">COMPLETE</span>',
    'VISITOR BADGE #4471 ........... ISSUED',
    'SYSTEM HEALTH CHECK ........... <span class="ok">PASSED</span>'
  ];

  let li = 0;
  const maxVisible = 7;

  function typeLine(text, el, cb) {
    let i = 0;
    const speed = 14;
    function tick() {
      el.innerHTML = text.slice(0, i) + '<span class="monitor-caret"></span>';
      i++;
      if (i <= text.length) {
        setTimeout(tick, speed);
      } else {
        el.innerHTML = text;
        cb();
      }
    }
    tick();
  }

  function addLine() {
    const raw = lines[li % lines.length];
    li++;
    const row = document.createElement('div');
    row.className = 'feed-line';
    row.style.opacity = '1';
    feed.appendChild(row);

    typeLine(raw, row, () => {
      while (feed.children.length > maxVisible) {
        feed.removeChild(feed.firstChild);
      }
      setTimeout(addLine, 900);
    });
  }

  addLine();
})();

// ===== MARQUEE (duplicate track for seamless loop) =====
(function initMarquee() {
  document.querySelectorAll('.marquee-track').forEach(track => {
    track.innerHTML += track.innerHTML;
  });
})();

// ===== CUSTOM CURSOR =====
const isFinePointer = window.matchMedia('(pointer: fine)').matches;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

(function initCursor() {
  if (!isFinePointer) return;
  const dot = document.createElement('div');
  dot.id = 'cursor-dot';
  const ring = document.createElement('div');
  ring.id = 'cursor-ring';
  document.body.append(dot, ring);

  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
  addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
  });
  (function loop() {
    rx += (mx - rx) * 0.2;
    ry += (my - ry) * 0.2;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  })();

  const targets = 'a, button, .btn, .badge-card, .fab, .nav-btn, input, select, textarea, .menu';
  document.addEventListener('mouseover', (e) => { if (e.target.closest(targets)) ring.classList.add('hover'); });
  document.addEventListener('mouseout', (e) => { if (e.target.closest(targets)) ring.classList.remove('hover'); });
})();

// ===== "ASK HNIS" ASSISTANT (client-side FAQ widget) =====
// Note: this runs entirely in the browser — it matches your question against
// a fixed set of answers below. It is not a live/connected AI model.
(function initAssistant() {
  const trigger = document.getElementById('aiAssistantBtn');
  if (!trigger) return;

  const qa = [
    {
      q: 'What services does HNIS provide?',
      a: 'We handle six areas in-house: CCTV & surveillance, access control & biometrics, structured networking, cyber & IT security, fire & life safety, and systems integration.'
    },
    {
      q: 'Which areas do you serve?',
      a: 'We operate across Pakistan and can scope multi-site deployments for organizations with more than one location.'
    },
    {
      q: 'Do you support systems after installation?',
      a: 'Yes — every install includes access to our 24/7 monitoring desk, plus optional ongoing maintenance and service agreements.'
    },
    {
      q: 'How long does a typical installation take?',
      a: 'It depends on scope. Most single-site CCTV or access-control projects complete in 1–3 weeks after the design is approved.'
    },
    {
      q: 'Can you integrate systems from different brands?',
      a: 'Yes. We design cross-platform integration so cameras, access control and alarms from different manufacturers report to one dashboard.'
    },
    {
      q: 'Do you provide free site surveys?',
      a: "Yes — request a site survey and we'll schedule a walkthrough, usually within 3–5 business days."
    },
    {
      q: 'How do I get a quote?',
      a: 'Fill out the contact form, or WhatsApp / call us directly at 0300 800 5682 with your building type and requirements.'
    }
  ];

  // Build panel once
  const panel = document.createElement('div');
  panel.className = 'assistant-panel';
  panel.innerHTML = `
    <div class="assistant-head">
      <i class="fa-solid fa-robot"></i>
      <div><strong>Ask HNIS</strong><span class="status">● Quick answers, no waiting</span></div>
      <button class="assistant-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="assistant-body" id="assistantBody">
      <div class="assistant-msg bot">Hi — I'm the HNIS quick-answer desk. Tap a question below, or type your own.</div>
      <div class="assistant-quick" id="assistantQuick"></div>
    </div>
    <div class="assistant-input-row">
      <input type="text" id="assistantInput" placeholder="Type a question...">
      <button id="assistantSend"><i class="fa-solid fa-paper-plane"></i></button>
    </div>
  `;
  document.body.appendChild(panel);

  const body = panel.querySelector('#assistantBody');
  const quick = panel.querySelector('#assistantQuick');
  const input = panel.querySelector('#assistantInput');
  const sendBtn = panel.querySelector('#assistantSend');
  const closeBtn = panel.querySelector('.assistant-close');

  qa.forEach(item => {
    const btn = document.createElement('button');
    btn.textContent = item.q;
    btn.addEventListener('click', () => ask(item.q));
    quick.appendChild(btn);
  });

  function addMsg(text, who) {
    const msg = document.createElement('div');
    msg.className = 'assistant-msg ' + who;
    msg.textContent = text;
    body.appendChild(msg);
    body.scrollTop = body.scrollHeight;
  }

  function findAnswer(text) {
    const t = text.toLowerCase();
    let best = null, bestScore = 0;
    qa.forEach(item => {
      const words = item.q.toLowerCase().split(/\W+/).filter(w => w.length > 3);
      let score = 0;
      words.forEach(w => { if (t.includes(w)) score++; });
      if (score > bestScore) { bestScore = score; best = item; }
    });
    return bestScore > 0 ? best.a : "I don't have a canned answer for that yet — please reach the ops desk at 0300 800 5682 or getinfo.hnis@gmail.com and a technician will get back to you.";
  }

  function ask(text) {
    addMsg(text, 'user');
    setTimeout(() => addMsg(findAnswer(text), 'bot'), 300);
  }

  sendBtn.addEventListener('click', () => {
    const val = input.value.trim();
    if (!val) return;
    ask(val);
    input.value = '';
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendBtn.click();
  });

  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    panel.classList.toggle('open');
  });
  closeBtn.addEventListener('click', () => panel.classList.remove('open'));
})();

// ===== MAGNETIC BUTTONS =====
(function initMagnetic() {
  if (!isFinePointer || prefersReducedMotion) return;
  document.querySelectorAll('.btn, .fab, .nav-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const mx = e.clientX - (r.left + r.width / 2);
      const my = e.clientY - (r.top + r.height / 2);
      btn.style.transform = `translate(${mx * 0.15}px, ${my * 0.2}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
})();
