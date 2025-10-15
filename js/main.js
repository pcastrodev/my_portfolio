(function () {
  'use strict';
  const qs = (s, ctx = document) => ctx.querySelector(s);
  const qsa = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

  const header = qs('header');
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const burger = qs('.menu-hamburguer');
  const nav = qs('.nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      nav.classList.toggle('active');
    });
    qsa('.nav a').forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const target = qs(href);
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        }
        if (nav.classList.contains('active')) {
          burger.classList.remove('active');
          nav.classList.remove('active');
        }
      });
    });
  }

  qsa('a[data-scroll]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      e.preventDefault();
      const target = qs(href);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  const typedEl = qs('.typed-text');
  const roles = ['DevOps Engineer', 'Cloud & Automation', 'CI/CD & Docker', 'Linux & SRE'];
  let textIdx = 0, charIdx = 0, typing = true;
  const typeLoop = () => {
    if (!typedEl) return;
    const current = roles[textIdx];
    if (typing) {
      typedEl.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) { typing = false; setTimeout(typeLoop, 1500); return; }
      setTimeout(typeLoop, 70);
    } else {
      typedEl.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) { typing = true; textIdx = (textIdx + 1) % roles.length; setTimeout(typeLoop, 300); return; }
      setTimeout(typeLoop, 40);
    }
  };
  if (typedEl) setTimeout(typeLoop, 600);

  const revealEls = qsa('section, .skill-item, .service-box, form, footer, .cert-card');
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.15 });
  revealEls.forEach((el) => io.observe(el));

  function initSkills() {
    const buttons = qsa('.skill-category-btn');
    const items = qsa('.skill-item');
    const section = qs('#skills');
    const progresses = qsa('.skill-progress');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.getAttribute('data-category');
        items.forEach((it) => {
          const ok = cat === 'all' || it.getAttribute('data-category') === cat;
          it.style.display = ok ? 'flex' : 'none';
        });
      });
    });

    if (section) {
      const progObs = new IntersectionObserver((entries, obs) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          progresses.forEach((bar) => {
            const final = bar.style.width || bar.getAttribute('data-width') || '80%';
            bar.style.width = '0px';
            setTimeout(() => { bar.style.width = final; }, 120);
          });
          obs.unobserve(e.target);
        });
      }, { threshold: 0.4 });
      progObs.observe(section);
    }
  }
  initSkills();

  let light = qs('.light-effect');
  if (!light) { light = document.createElement('div'); light.className = 'light-effect'; document.body.appendChild(light); }
  let pending = false, lx = 0, ly = 0;
  const moveLight = () => { pending = false; light.style.transform = `translate(${lx - 10}px, ${ly - 10}px)`; };
  document.addEventListener('mousemove', (e) => { lx = e.clientX; ly = e.clientY; if (!pending) { pending = true; requestAnimationFrame(moveLight); } }, { passive: true });

  const particlesContainer = qs('#particles-js');
  if (particlesContainer && window.particlesJS) {
    window.particlesJS('particles-js', {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: '#00abf0' },
        shape: { type: 'circle' },
        opacity: { value: 0.6 },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: '#00abf0', opacity: 0.35, width: 1 },
        move: { enable: true, speed: 3, out_mode: 'out' }
      },
      interactivity: {
        detect_on: 'canvas',
        events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true },
        modes: { repulse: { distance: 140, duration: 0.4 }, push: { particles_nb: 3 } }
      },
      retina_detect: true
    });
  }

  (function initCertProgress(){
    const bars = document.querySelectorAll('.cert-progressbar');
    const io = new IntersectionObserver((entries, obs)=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting) return;
        const bar = entry.target;
        const fill = bar.querySelector('.cert-progressbar-fill');
        const pct = Math.max(0, Math.min(100, parseInt(bar.getAttribute('data-progress')||'0',10)));
        fill.style.width = pct + '%';
        const percentEl = bar.parentElement.querySelector('.cert-percent');
        if (percentEl) percentEl.textContent = pct + '%';
        const pill = bar.parentElement.querySelector('.cert-pill');
        if (pill && pct >= 100) { pill.textContent = 'Concluída'; pill.classList.remove('in-progress'); pill.classList.add('done'); }
        obs.unobserve(bar);
      });
    }, {threshold:.35});
    bars.forEach(b=>io.observe(b));
  })();
})();
