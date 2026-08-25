/* ============================================
   NET Player — Landing Page Scripts
   Vanilla JS — No dependencies
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initScrollReveal();
  initFaqAccordion();
  initSmarterCarousel();
  initLangSwitch();
  initSmoothScroll();
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
    if (width >= 992) return 5;
    if (width >= 768) return 3;
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
      const gap = parseFloat(gridStyle.gap) || 16;
      
      const translateAmount = currentIndex * (cardWidth + gap);
      grid.style.transform = `translateX(-${translateAmount}px)`;
    }

    // Dynamic selection: Make the first visible card in viewport active
    cards.forEach(c => c.classList.remove('active'));
    if (cards[currentIndex]) {
      cards[currentIndex].classList.add('active');
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
