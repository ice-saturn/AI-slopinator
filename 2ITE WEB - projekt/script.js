/**
 * SVĚT MELOUNŮ – script.js
 * Funkce: hamburger menu, scroll-reveal (Intersection Observer)
 */

'use strict';

/* ==========================================
   1. HAMBURGER MENU
   ========================================== */
(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobilni-menu');

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('active');

    hamburger.setAttribute('aria-expanded', isOpen.toString());
    mobileMenu.setAttribute('aria-hidden', (!isOpen).toString());
    hamburger.setAttribute('aria-label', isOpen ? 'Zavřít menu' : 'Otevřít menu');
  });

  // Zavřít menu kliknutím na odkaz
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      hamburger.setAttribute('aria-label', 'Otevřít menu');
    });
  });

  // Zavřít menu kliknutím mimo
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      if (mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        hamburger.setAttribute('aria-label', 'Otevřít menu');
      }
    }
  });
})();


/* ==========================================
   2. SCROLL-REVEAL pomocí Intersection Observer
   ========================================== */
(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');

  if (!elements.length) return;

  // Pokud prohlížeč nepodporuje IO, rovnou zobrazit
  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observerOptions = {
    root: null,           // viewport
    rootMargin: '0px',
    threshold: 0.12       // 12 % prvku musí být viditelné
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Kaskádové zpoždění pro sourozence (staggering)
        const siblings = Array.from(
          entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')
        );
        const idx = siblings.indexOf(entry.target);
        const delay = Math.min(idx * 80, 400); // max 400 ms prodleva

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        obs.unobserve(entry.target); // animovat jen jednou
      }
    });
  }, observerOptions);

  elements.forEach(el => observer.observe(el));
})();


/* ==========================================
   3. AKTIVNÍ NAV ODKAZ při scrollování
   ========================================== */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-links a, .nav-mobile a');

  if (!sections.length || !navLinks.length) return;

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.style.color = '#fff';
            link.style.background = 'var(--clr-green-md)';
          } else {
            link.style.color = '';
            link.style.background = '';
          }
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(sec => sectionObserver.observe(sec));
})();