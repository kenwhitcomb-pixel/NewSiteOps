/* Shared header/footer injection + active nav */
(function () {
  const headerTarget = document.getElementById('site-header');
  const footerTarget = document.getElementById('site-footer');

  function loadFragment(path, target) {
    return fetch(path, { cache: 'no-store' })
      .then(r => r.text())
      .then(html => { target.innerHTML = html; })
      .catch(() => {});
  }

  function setActiveNav() {
    const path = (location.pathname || '').split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-menu a[data-nav]').forEach(a => {
      const href = a.getAttribute('data-nav');
      if (href === path) a.classList.add('active');
      if (path === '' && href === 'index.html') a.classList.add('active');
    });
  }

  function enhanceMobileToggle() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.getElementById('primary-navigation');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('active');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  Promise.all([
    headerTarget ? loadFragment('partials/header.html', headerTarget) : Promise.resolve(),
    footerTarget ? loadFragment('partials/footer.html', footerTarget) : Promise.resolve()
  ]).then(() => {
    setActiveNav();
    enhanceMobileToggle();

    const s = document.createElement('script');
    s.src = 'script.js';
    s.defer = true;
    document.body.appendChild(s);
  });
})();
