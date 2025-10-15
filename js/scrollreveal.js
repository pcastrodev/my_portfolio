(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    document.querySelectorAll('[data-sr]').forEach(el => el.style.opacity = 1);
    return;
  }

  const EFFECTS = {
    'fade-up':    'translate3d(0, 24px, 0)',
    'fade-down':  'translate3d(0, -24px, 0)',
    'fade-left':  'translate3d(24px, 0, 0)',
    'fade-right': 'translate3d(-24px, 0, 0)',
    'zoom-in':    'scale(.96)',
    'fade':       'none'
  };

  function setupInitial(el) {
    const effect = el.getAttribute('data-sr') || 'fade-up';
    const duration = parseInt(el.getAttribute('data-sr-duration') || '700', 10);
    const easing = el.getAttribute('data-sr-ease') || 'cubic-bezier(0.16, 1, 0.3, 1)';
    const distance = el.getAttribute('data-sr-distance');
    const transformStart = distance
      ? effect.startsWith('fade-')
        ? `translate3d(${effect.includes('left') ? distance : effect.includes('right') ? `-${distance}` : '0'}, ${effect.includes('up') ? distance : effect.includes('down') ? `-${distance}` : '0'}, 0)`
        : EFFECTS[effect] || 'none'
      : EFFECTS[effect] || 'none';

    el.style.willChange = 'opacity, transform';
    el.style.opacity = '0';
    el.style.transform = transformStart;
    el.style.transition = `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`;
  }

  function reveal(el, delay = 0) {
    el.style.transitionDelay = `${delay}ms`;
    el.style.opacity = '1';
    el.style.transform = 'none';
    el.setAttribute('data-sr-revealed', 'true');
  }

  function initSingles() {
    const singles = Array.from(document.querySelectorAll('[data-sr]:not([data-sr-stagger] [data-sr])'));
    singles.forEach(setupInitial);

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const once = (el.getAttribute('data-sr-once') ?? 'true') !== 'false';
        const delay = parseInt(el.getAttribute('data-sr-delay') || '0', 10);
        reveal(el, delay);
        if (once) obs.unobserve(el);
      });
    }, { threshold: 0.12 });

    singles.forEach(el => io.observe(el));
  }

  function initStaggers() {
    const groups = document.querySelectorAll('[data-sr-stagger]');
    groups.forEach(group => {
      const children = group.querySelectorAll(':scope [data-sr]');
      const baseDelay = parseInt(group.getAttribute('data-sr-stagger') || '80', 10);
      children.forEach(setupInitial);

      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          children.forEach((el, i) => {
            const childExtra = parseInt(el.getAttribute('data-sr-delay') || '0', 10);
            reveal(el, i * baseDelay + childExtra);
          });
          const once = (group.getAttribute('data-sr-once') ?? 'true') !== 'false';
          if (once) obs.unobserve(entry.target);
        });
      }, { threshold: 0.12 });

      io.observe(group);
    });
  }

  function boot() {
    initSingles();
    initStaggers();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.__srRefresh = () => {
    document.querySelectorAll('[data-sr][data-sr-revealed="true"]').forEach(el => {
      el.removeAttribute('data-sr-revealed');
      setupInitial(el);
    });
    boot();
  };
})();
