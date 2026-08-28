/* ============================================
   NET Player — Landing Page Scripts
   Vanilla JS — No dependencies
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initScrollReveal();
  initFaqAccordion();
  initSmarterCarousel();
  initAppsCarousel();
  initLangSwitch();
  initSmoothScroll();
  initTrialModal();
  initSupportModal();
});

/* ---------- 0. Sticky Header on Scroll ---------- */
function initStickyHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const scrollThreshold = 50;

  window.addEventListener('scroll', () => {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ---------- 0.5. Mobile Navigation Drawer ---------- */
function initMobileNav() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const drawer = document.getElementById('mobile-nav-drawer');
  const backdrop = document.getElementById('mobile-nav-backdrop');
  const closeBtn = document.getElementById('mobile-nav-close');
  if (!hamburgerBtn || !drawer || !backdrop) return;

  function openMenu() {
    drawer.classList.add('active');
    backdrop.classList.add('active');
    drawer.setAttribute('aria-hidden', 'false');
    backdrop.setAttribute('aria-hidden', 'false');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('modal-open');
  }

  function closeMenu() {
    drawer.classList.remove('active');
    backdrop.classList.remove('active');
    drawer.setAttribute('aria-hidden', 'true');
    backdrop.setAttribute('aria-hidden', 'true');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('modal-open');
  }

  hamburgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (drawer.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }

  backdrop.addEventListener('click', closeMenu);

  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeMenu();
    }
  });

  // Close menu on link / CTA click
  const navItems = drawer.querySelectorAll('.mobile-nav-item, .mobile-cta-btn, .mobile-support-btn');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      closeMenu();
    });
  });
}

/* ---------- 1. Scroll Reveal (IntersectionObserver) ---------- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach((el) => observer.observe(el));
}

/* ---------- 2. FAQ Accordion ---------- */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach((item) => {
    const btn = item.querySelector('.faq-question');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      items.forEach((i) => i.classList.remove('open'));

      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
}

/* ---------- 3. Device Cards Carousel ---------- */
function initSmarterCarousel() {
  const container = document.querySelector('.smarter-carousel-container');
  if (!container) return;

  const grid = container.querySelector('.smarter-devices-grid');
  const cards = container.querySelectorAll('.device-card');
  const dotsContainer = container.querySelector('.smarter-carousel-dots');
  
  let cardsPerPage = getCardsPerPage();
  let maxIndex = cards.length - cardsPerPage;
  let currentIndex = 0;
  let autoplayInterval;

  function getCardsPerPage() {
    const width = window.innerWidth;
    if (width >= 1100) return 6;
    if (width >= 850) return 5;
    if (width >= 680) return 4;
    if (width >= 520) return 3;
    return 2;
  }

  function renderDots() {
    dotsContainer.innerHTML = '';
    cardsPerPage = getCardsPerPage();
    maxIndex = Math.max(0, cards.length - cardsPerPage);
    
    const steps = maxIndex + 1;
    for (let i = 0; i < steps; i++) {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      if (i === currentIndex) dot.classList.add('active');
      dot.setAttribute('data-index', i);
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => {
        goToIndex(i);
        stopAutoplay();
        startAutoplay();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function goToIndex(index) {
    cardsPerPage = getCardsPerPage();
    maxIndex = Math.max(0, cards.length - cardsPerPage);
    
    currentIndex = Math.min(Math.max(0, index), maxIndex);
    
    if (cards.length > 0) {
      const cardWidth = cards[0].getBoundingClientRect().width;
      const gridStyle = window.getComputedStyle(grid);
      const gap = parseFloat(gridStyle.gap) || 24;
      
      const translateAmount = currentIndex * (cardWidth + gap);
      grid.style.transform = `translateX(-${translateAmount}px)`;
    }

    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function startAutoplay() {
    autoplayInterval = setInterval(() => {
      cardsPerPage = getCardsPerPage();
      maxIndex = Math.max(0, cards.length - cardsPerPage);
      
      let nextIndex = currentIndex + 1;
      if (nextIndex > maxIndex) {
        nextIndex = 0;
      }
      goToIndex(nextIndex);
    }, 4000);
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  cards.forEach(card => {
    card.addEventListener('click', () => {
      if (card.classList.contains('disabled')) return;
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

  window.addEventListener('resize', () => {
    const oldCardsPerPage = cardsPerPage;
    cardsPerPage = getCardsPerPage();
    if (cardsPerPage !== oldCardsPerPage) {
      currentIndex = 0;
      renderDots();
      goToIndex(0);
    } else {
      goToIndex(currentIndex);
    }
  });

  renderDots();
  goToIndex(0);
  startAutoplay();
}

/* ---------- 3.5. Apps Parceiros Carousel ---------- */
function initAppsCarousel() {
  const container = document.querySelector('.apps-carousel-container');
  if (!container) return;

  const viewport = container.querySelector('.apps-carousel-viewport');
  const track = container.querySelector('.apps-carousel-track');
  const cards = container.querySelectorAll('.apps-carousel-card');
  const dotsContainer = container.querySelector('.apps-carousel-dots');
  if (!track || !cards.length) return;

  let cardsPerPage = getCardsPerPage();
  let maxIndex = Math.max(0, cards.length - cardsPerPage);
  let currentIndex = 0;
  let autoplayInterval;

  function getCardsPerPage() {
    const width = window.innerWidth;
    if (width >= 1100) return 6;
    if (width >= 850) return 5;
    if (width >= 680) return 4;
    if (width >= 520) return 3;
    return 2;
  }

  function renderDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    cardsPerPage = getCardsPerPage();
    maxIndex = Math.max(0, cards.length - cardsPerPage);

    const steps = maxIndex + 1;
    for (let i = 0; i < steps; i++) {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      if (i === currentIndex) dot.classList.add('active');
      dot.setAttribute('data-index', i);
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => {
        goToIndex(i);
        stopAutoplay();
        startAutoplay();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function goToIndex(index) {
    cardsPerPage = getCardsPerPage();
    maxIndex = Math.max(0, cards.length - cardsPerPage);

    currentIndex = Math.min(Math.max(0, index), maxIndex);

    if (cards.length > 0) {
      const cardWidth = cards[0].getBoundingClientRect().width;
      const trackStyle = window.getComputedStyle(track);
      const gap = parseFloat(trackStyle.gap) || 24;

      const translateAmount = currentIndex * (cardWidth + gap);
      track.style.transform = `translateX(-${translateAmount}px)`;
    }

    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.carousel-dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(() => {
      cardsPerPage = getCardsPerPage();
      maxIndex = Math.max(0, cards.length - cardsPerPage);

      let nextIndex = currentIndex + 1;
      if (nextIndex > maxIndex) {
        nextIndex = 0;
      }
      goToIndex(nextIndex);
    }, 3500);
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
    }
  }

  container.addEventListener('mouseenter', stopAutoplay);
  container.addEventListener('mouseleave', startAutoplay);

  // Click on card selects/scrolls to it
  cards.forEach((card, i) => {
    card.addEventListener('click', () => {
      goToIndex(i);
      stopAutoplay();
      startAutoplay();
    });
  });

  window.addEventListener('resize', () => {
    const oldCardsPerPage = cardsPerPage;
    cardsPerPage = getCardsPerPage();
    if (cardsPerPage !== oldCardsPerPage) {
      currentIndex = 0;
      renderDots();
      goToIndex(0);
    } else {
      goToIndex(currentIndex);
    }
  });

  renderDots();
  goToIndex(0);
  startAutoplay();
}

/* ---------- 4. Language Switcher (visual) ---------- */
function initLangSwitch() {
  const buttons = document.querySelectorAll('.lang-switch button');
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

/* ---------- 5. Smooth Scroll for anchor links ---------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ---------- 6. Free Trial Modal ---------- */
function initTrialModal() {
  const modal = document.getElementById('trial-modal');
  if (!modal) return;

  const closeBtn = modal.querySelector('.modal-close');
  const form = document.getElementById('trial-form');
  const triggers = document.querySelectorAll('.btn-trigger-trial');
  const phoneInput = document.getElementById('trial-whatsapp');

  // Open modal functions
  function openModal() {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    
    // Focus the first input
    const firstInput = modal.querySelector('input');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 150);
    }
  }

  // Close modal functions
  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');

    // Reset view after modal fade animation completes
    setTimeout(() => {
      const formEl = modal.querySelector('#trial-form');
      const successView = modal.querySelector('#trial-success');
      const headerView = modal.querySelector('.modal-header');
      const dividerView = modal.querySelector('.modal-divider');

      if (formEl) {
        formEl.reset();
        formEl.style.display = 'flex';
      }
      if (headerView) headerView.style.display = 'block';
      if (dividerView) dividerView.style.display = 'block';
      if (successView) successView.style.display = 'none';

      const submitBtn = modal.querySelector('.modal-submit-btn');
      if (submitBtn) {
        submitBtn.disabled = false;
        const submitBtnText = submitBtn.querySelector('span');
        if (submitBtnText) submitBtnText.textContent = 'Solicitar teste grátis';
      }
    }, 400);
  }

  // Add click events to triggers
  triggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  // Close with close button
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Close clicking outside the card
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close with ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Brazilian WhatsApp Masking
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
      if (value.length > 11) value = value.slice(0, 11);
      
      // Mask logic
      if (value.length > 6) {
        e.target.value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
      } else if (value.length > 2) {
        e.target.value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
      } else if (value.length > 0) {
        e.target.value = `(${value}`;
      } else {
        e.target.value = '';
      }
    });
  }

  // Submit Logic
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('trial-name').value.trim();
      const whatsapp = document.getElementById('trial-whatsapp').value.trim();

      const submitBtn = form.querySelector('.modal-submit-btn');
      const submitBtnText = submitBtn.querySelector('span');
      
      submitBtn.disabled = true;
      if (submitBtnText) submitBtnText.textContent = 'ENVIANDO...';

      // Send Email notification to contato@netplayer.com.br via FormSubmit API
      fetch("https://formsubmit.co/ajax/contato@netplayer.com.br", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          _subject: `Novo Pedido de Teste Grátis: ${name}`,
          _template: "table",
          "Nome": name,
          "WhatsApp": whatsapp,
          "Origem": window.location.pathname.includes('links') ? 'Instagram Bio (netplayer.com.br/links)' : 'Website Principal (netplayer.com.br)'
        })
      }).catch(err => console.log('FormSubmit notification error:', err));

      // Show Success View inside Modal
      setTimeout(() => {
        const headerView = modal.querySelector('.modal-header');
        const dividerView = modal.querySelector('.modal-divider');
        const successView = modal.querySelector('#trial-success');

        if (form) form.style.display = 'none';
        if (headerView) headerView.style.display = 'none';
        if (dividerView) dividerView.style.display = 'none';
        if (successView) successView.style.display = 'block';
      }, 600);
    });
  }
}

/* ---------- 7. Custom Support Modal ---------- */
function initSupportModal() {
  const modal = document.getElementById('support-modal');
  if (!modal) return;

  const triggers = document.querySelectorAll('.btn-trigger-support');
  const closeBtn = modal.querySelector('.modal-close');

  function openModal() {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}
