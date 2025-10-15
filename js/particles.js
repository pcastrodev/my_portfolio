(function () {
  const CONFIG_PATH = './js/particles.json';
  const CONTAINER_ID = 'particles-js';

  function initParticles() {
    const container = document.getElementById(CONTAINER_ID);

    if (!container) {
      console.warn(`[particles] container #${CONTAINER_ID} não encontrado.`);
      return;
    }
    if (typeof window.particlesJS === 'undefined') {
      console.error('[particles] particles.min.js não carregado. Coloque-o em /vendor e importe no index.html antes deste arquivo.');
      return;
    }

    if (window.particlesJS.load) {
      window.particlesJS.load(CONTAINER_ID, CONFIG_PATH, function () {
        console.log('✨ Partículas carregadas a partir de', CONFIG_PATH);
      });
      return;
    }

    window.particlesJS(CONTAINER_ID, {
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
        events: {
          onhover: { enable: true, mode: 'repulse' },
          onclick: { enable: true, mode: 'push' },
          resize: true
        },
        modes: { repulse: { distance: 140, duration: 0.4 }, push: { particles_nb: 3 } }
      },
      retina_detect: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParticles);
  } else {
    initParticles();
  }

  window.__initParticles = initParticles;
})();
