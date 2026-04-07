(() => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('mainNav');
  const navLinks = Array.from(document.querySelectorAll('.nav-link[data-tab]'));
  const panels = Array.from(document.querySelectorAll('.tab-panel[data-panel]'));
  const jumpButtons = Array.from(document.querySelectorAll('.tab-jump[data-target]'));

  const openTab = (name) => {
    navLinks.forEach((link) => link.classList.toggle('is-active', link.dataset.tab === name));
    panels.forEach((panel) => {
      const active = panel.dataset.panel === name;
      panel.classList.toggle('is-active', active);
      panel.hidden = !active;
    });
    if (nav) nav.classList.remove('open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  navLinks.forEach((link) => link.addEventListener('click', () => openTab(link.dataset.tab)));
  jumpButtons.forEach((btn) => btn.addEventListener('click', () => openTab(btn.dataset.target)));

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
    });
  }

  const brand = document.querySelector('.brand');
  if (brand) brand.addEventListener('click', (e) => { e.preventDefault(); openTab('home'); });
  panels.forEach((p) => { p.hidden = !p.classList.contains('is-active'); });



  const projectCards = document.querySelectorAll('.project-accordion-card');
  if (projectCards.length) {
    projectCards.forEach((card) => {
      const btn = card.querySelector('.project-toggle');
      const content = card.querySelector('.project-content');
      if (!btn || !content) return;

      if (card.classList.contains('is-open')) {
        content.style.maxHeight = content.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      } else {
        content.style.maxHeight = '0px';
        btn.setAttribute('aria-expanded', 'false');
      }

      btn.addEventListener('click', () => {
        const wasOpen = card.classList.contains('is-open');

        projectCards.forEach((c) => {
          c.classList.remove('is-open');
          const b = c.querySelector('.project-toggle');
          const ct = c.querySelector('.project-content');
          if (b) b.setAttribute('aria-expanded', 'false');
          if (ct) ct.style.maxHeight = '0px';
        });

        if (!wasOpen) {
          card.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    });

    window.addEventListener('resize', () => {
      projectCards.forEach((card) => {
        if (card.classList.contains('is-open')) {
          const content = card.querySelector('.project-content');
          if (content) content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    });
  }

  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w = 0, h = 0, raf = null;
  const particles = [];

  const makeParticles = () => {
    particles.length = 0;
    const count = Math.max(22, Math.min(60, Math.floor((w * h) / 22000)));
    for (let i = 0; i < count; i++) {
      particles.push({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.7 + 0.7, s: Math.random() * 0.28 + 0.08, a: Math.random() * 0.35 + 0.08, d: (Math.random() - 0.5) * 0.16 });
    }
  };

  const resize = () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    makeParticles();
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      ctx.beginPath();
      ctx.fillStyle = `rgba(170,225,255,${p.a})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      p.y -= p.s;
      p.x += p.d;
      if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
    }
    raf = requestAnimationFrame(draw);
  };

  resize();
  window.addEventListener('resize', resize);
  if (!reduce) draw();
  else {
    particles.forEach((p) => { ctx.beginPath(); ctx.fillStyle = `rgba(170,225,255,${Math.min(p.a,0.18)})`; ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill(); });
  }
  window.addEventListener('beforeunload', () => { if (raf) cancelAnimationFrame(raf); });
})();
