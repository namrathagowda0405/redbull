/**
 * RED BULL RACING EXPERIENCE 2026 — MASTER INTERACTION ENGINE
 * 100% Pure Vanilla JavaScript (RAF, Web Audio API, Canvas 2D, Magnetic Physics)
 * Zero External Frameworks
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeSwitcher();
  initNavbarScroll();
  initMobileMenu();
  initHeroStudioParticles();
  initUnifiedEnergyTrail();
  initHeroCarSpotlight();
  initMagneticButtons();
  initHighlightsModal();
  initDrinksDraggableCarousel();
  initAllDrinksModal();
  initExpandableEventCards();
  initFeaturedEventCountdown();
  initAthletesSlider();
  initGalleryLightbox();
  initGalleryParallax();
  initScrollParallax();
  initScrollReveals();
  initSmoothScrollLinks();
});

/* ==========================================================================
   1. RACE DAY (GOLDEN HOUR) ↔ NIGHT GRAND PRIX THEME SWITCHER
   ========================================================================== */
function initThemeSwitcher() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const label = document.getElementById('theme-label-text');
  const icon = document.getElementById('theme-icon');

  const savedTheme = localStorage.getItem('rbr_theme_2026');
  if (savedTheme === 'night') {
    document.body.classList.remove('theme-golden-hour');
    document.body.classList.add('theme-night-gp');
    if (label) label.textContent = 'Night Grand Prix';
    renderThemeIcon(true);
  }

  toggleBtn?.addEventListener('click', () => {
    const isNight = document.body.classList.toggle('theme-night-gp');
    document.body.classList.toggle('theme-golden-hour', !isNight);

    if (label) {
      label.textContent = isNight ? 'Night Grand Prix' : 'Golden Hour';
    }
    renderThemeIcon(isNight);
    localStorage.setItem('rbr_theme_2026', isNight ? 'night' : 'golden');
  });

  function renderThemeIcon(isNight) {
    if (!icon) return;
    if (isNight) {
      icon.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    } else {
      icon.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line></svg>`;
    }
  }
}

/* ==========================================================================
   2. NAVBAR SCROLL EFFECT & MOBILE MENU
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.querySelector('.paddock-navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 35) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-drawer');
  const links = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer) return;

  const toggle = () => {
    const active = drawer.classList.toggle('active');
    document.body.style.overflow = active ? 'hidden' : '';
  };

  toggleBtn.addEventListener('click', toggle);
  links.forEach(l => {
    l.addEventListener('click', () => {
      drawer.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* ==========================================================================
   3. UNIFIED RED BULL ENERGY TRAIL (CURSOR MOTION & PAGE SCROLL)
   ========================================================================== */
function initUnifiedEnergyTrail() {
  const container = document.getElementById('global-energy-trail');
  if (!container) return;

  const MAX_PARTICLES = 12;
  const palette = ['#FFD54F', '#FFD54F', '#FF8A00', '#FF8A00', '#FFFFFF'];

  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;
  let trailX = pointerX;
  let trailY = pointerY;
  let hasPointerMoved = false;

  let isMoving = false;
  let isScrolling = false;
  let moveTimeout = null;
  let scrollTimeout = null;
  let rafId = null;

  let moveAccumulator = 0;
  let scrollAccumulator = 0;
  let lastScrollY = window.scrollY;

  function spawnParticle(x, y) {
    while (container.childElementCount >= MAX_PARTICLES) {
      container.removeChild(container.firstElementChild);
    }

    const particle = document.createElement('span');
    particle.className = 'energy-trail-particle';

    // Particle size: 2–4px
    const size = Math.floor(Math.random() * 3) + 2;
    const color = palette[Math.floor(Math.random() * palette.length)];
    const initialOpacity = (Math.random() * 0.16 + 0.56).toFixed(2);

    // Lifetime: 0.6–0.8 seconds
    const duration = (Math.random() * 0.2 + 0.6).toFixed(2);

    // Subtle jitter around anchor point
    const jitterX = (Math.random() - 0.5) * 10;
    const jitterY = (Math.random() - 0.5) * 10;

    // Slight upward/outward drift before disappearing
    const dyEnd = -(Math.random() * 12 + 10).toFixed(1);
    const dxEnd = ((Math.random() - 0.5) * 14).toFixed(1);

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = color;
    particle.style.boxShadow = `0 0 ${size + 2}px ${color}`;
    particle.style.left = `${x + jitterX}px`;
    particle.style.top = `${y + jitterY}px`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.setProperty('--particle-initial-opacity', initialOpacity);
    particle.style.setProperty('--dx-end', `${dxEnd}px`);
    particle.style.setProperty('--dy-end', `${dyEnd}px`);

    particle.addEventListener('animationend', () => particle.remove(), { once: true });
    setTimeout(() => {
      if (particle.parentElement) particle.remove();
    }, 850);

    container.appendChild(particle);
  }

  function fadeOutAll() {
    Array.from(container.children).forEach(p => {
      p.style.transition = 'opacity 0.22s ease-out, transform 0.22s ease-out';
      p.style.opacity = '0';
      setTimeout(() => {
        if (p.parentElement) p.remove();
      }, 240);
    });
  }

  function updateLoop() {
    rafId = null;

    if (isMoving) {
      const dx = pointerX - trailX;
      const dy = pointerY - trailY;
      const dist = Math.hypot(dx, dy);

      trailX += dx * 0.38;
      trailY += dy * 0.38;

      moveAccumulator += dist;
      if (moveAccumulator >= 14) {
        moveAccumulator = 0;
        spawnParticle(trailX, trailY);
      }
    }

    if (isScrolling) {
      if (scrollAccumulator >= 16) {
        scrollAccumulator = 0;
        const originX = hasPointerMoved ? pointerX : window.innerWidth * (0.4 + Math.random() * 0.2);
        const originY = hasPointerMoved ? pointerY : window.innerHeight * (0.4 + Math.random() * 0.2);
        spawnParticle(originX, originY);
      }
    }

    if (isMoving || isScrolling) {
      rafId = requestAnimationFrame(updateLoop);
    }
  }

  function ensureLoopRunning() {
    if (!rafId) {
      rafId = requestAnimationFrame(updateLoop);
    }
  }

  // Mouse / Touch Motion
  window.addEventListener('mousemove', (e) => {
    pointerX = e.clientX;
    pointerY = e.clientY;
    if (!hasPointerMoved) {
      trailX = pointerX;
      trailY = pointerY;
      hasPointerMoved = true;
    }
    isMoving = true;

    clearTimeout(moveTimeout);
    moveTimeout = setTimeout(() => {
      isMoving = false;
      if (!isScrolling) fadeOutAll();
    }, 85);

    ensureLoopRunning();
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      pointerX = e.touches[0].clientX;
      pointerY = e.touches[0].clientY;
      if (!hasPointerMoved) {
        trailX = pointerX;
        trailY = pointerY;
        hasPointerMoved = true;
      }
      isMoving = true;
      clearTimeout(moveTimeout);
      moveTimeout = setTimeout(() => {
        isMoving = false;
        if (!isScrolling) fadeOutAll();
      }, 85);
      ensureLoopRunning();
    }
  }, { passive: true });

  // Page Scrolling
  window.addEventListener('scroll', () => {
    isScrolling = true;
    const currentScrollY = window.scrollY;
    const delta = Math.abs(currentScrollY - lastScrollY);
    lastScrollY = currentScrollY;
    scrollAccumulator += delta;

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
      if (!isMoving) fadeOutAll();
    }, 90);

    ensureLoopRunning();
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    isMoving = false;
    if (!isScrolling) fadeOutAll();
  });
}

/* ==========================================================================
   5. HERO STUDIO: SUBTLE FLOATING GOLDEN PARTICLES (BACKGROUND ONLY)
   ========================================================================== */
function initHeroStudioParticles() {
  const hero = document.getElementById('hero');
  const canvas = document.getElementById('hero-golden-particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
  let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

  window.addEventListener('resize', () => {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
    height = canvas.height = canvas.parentElement.clientHeight || window.innerHeight;
  });

  const particles = [];
  const count = 38;
  const goldenPalette = ['#FFD166', '#FFB800', '#FFA000', '#FFFFFF', 'rgba(255, 215, 100, 0.85)'];

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.6 + 0.8,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -(Math.random() * 0.5 + 0.25),
      alpha: Math.random() * 0.45 + 0.25,
      baseAlpha: Math.random() * 0.4 + 0.2,
      pulseSpeed: Math.random() * 0.025 + 0.01,
      color: goldenPalette[Math.floor(Math.random() * goldenPalette.length)],
      angle: Math.random() * Math.PI * 2,
      waverSpeed: Math.random() * 0.02 + 0.008
    });
  }

  let frame = 0;
  let isHeroVisible = true;

  if ('IntersectionObserver' in window && hero) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isHeroVisible = entry.isIntersecting;
      });
    }, { threshold: 0.05 });
    observer.observe(hero);
  }

  function renderParticles() {
    if (isHeroVisible) {
      ctx.clearRect(0, 0, width, height);
      frame++;

      particles.forEach(p => {
        p.angle += p.waverSpeed;
        p.x += p.vx + Math.sin(p.angle) * 0.3;
        p.y += p.vy;

        p.alpha = p.baseAlpha + Math.sin(frame * p.pulseSpeed) * 0.18;
        if (p.alpha < 0.08) p.alpha = 0.08;
        if (p.alpha > 0.85) p.alpha = 0.85;

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -15) {
          p.y = height + 15;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    }

    requestAnimationFrame(renderParticles);
  }

  renderParticles();
}

/* ==========================================================================
   6. MAGNETIC BUTTONS PHYSICS & SPEED-LINE
   ========================================================================== */
function initMagneticButtons() {
  const magneticButtons = document.querySelectorAll('[data-magnetic="true"]');

  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - btnCenterX) * 0.35;
      const deltaY = (e.clientY - btnCenterY) * 0.35;

      btn.style.transform = `translate(${deltaX.toFixed(1)}px, ${deltaY.toFixed(1)}px) scale(1.025)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* ==========================================================================
   7. HIGHLIGHTS VIDEO MODAL
   ========================================================================== */
function initHighlightsModal() {
  const openBtn = document.getElementById('btn-watch-highlights');
  const modal = document.getElementById('highlights-modal');
  const closeBtn = document.getElementById('highlights-modal-close');

  if (!openBtn || !modal) return;

  openBtn.addEventListener('click', () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  closeBtn?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });
}

/* ==========================================================================
   8. ENERGY DRINKS — HORIZONTAL DRAGGABLE COVERFLOW CAROUSEL (7 REAL PRODUCTS)
   ========================================================================== */
const EDITION_THEMES = {
  original: {
    color: '#003B8E',
    glow: 'rgba(0, 59, 142, 0.5)',
    bg: 'radial-gradient(circle at 50% 35%, rgba(0, 59, 142, 0.35) 0%, rgba(6, 17, 32, 0.98) 75%)'
  },
  sugarfree: {
    color: '#00A8E8',
    glow: 'rgba(0, 168, 232, 0.5)',
    bg: 'radial-gradient(circle at 50% 35%, rgba(0, 168, 232, 0.32) 0%, rgba(6, 17, 32, 0.98) 75%)'
  },
  zero: {
    color: '#718096',
    glow: 'rgba(113, 128, 150, 0.45)',
    bg: 'radial-gradient(circle at 50% 35%, rgba(113, 128, 150, 0.28) 0%, rgba(6, 17, 32, 0.98) 75%)'
  },
  pink: {
    color: '#E64980',
    glow: 'rgba(230, 73, 128, 0.5)',
    bg: 'radial-gradient(circle at 50% 35%, rgba(230, 73, 128, 0.32) 0%, rgba(6, 17, 32, 0.98) 75%)'
  },
  yellow: {
    color: '#FFB800',
    glow: 'rgba(255, 184, 0, 0.5)',
    bg: 'radial-gradient(circle at 50% 35%, rgba(255, 184, 0, 0.32) 0%, rgba(6, 17, 32, 0.98) 75%)'
  },
  red: {
    color: '#E10600',
    glow: 'rgba(225, 6, 0, 0.5)',
    bg: 'radial-gradient(circle at 50% 35%, rgba(225, 6, 0, 0.32) 0%, rgba(6, 17, 32, 0.98) 75%)'
  },
  green: {
    color: '#2ECC71',
    glow: 'rgba(46, 204, 113, 0.5)',
    bg: 'radial-gradient(circle at 50% 35%, rgba(46, 204, 113, 0.32) 0%, rgba(6, 17, 32, 0.98) 75%)'
  }
};

function initDrinksDraggableCarousel() {
  const section = document.getElementById('energy-drinks');
  const viewport = document.getElementById('drinks-viewport');
  const track = document.getElementById('drinks-carousel-track');
  const cards = document.querySelectorAll('.drink-item-card');
  const prevBtn = document.getElementById('drinks-nav-prev');
  const nextBtn = document.getElementById('drinks-nav-next');
  const dotsContainer = document.getElementById('drinks-dots-row');

  if (!track || !cards.length) return;

  let activeIndex = 0;
  const total = cards.length;

  // Build Dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = `drink-dot ${i === 0 ? 'active' : ''}`;
    dot.setAttribute('aria-label', `Go to drink ${i + 1}`);
    dot.addEventListener('click', () => centerCard(i));
    dotsContainer?.appendChild(dot);
  });

  const dots = dotsContainer?.querySelectorAll('.drink-dot');

  function updateAtmosphere(flavorKey) {
    const theme = EDITION_THEMES[flavorKey];
    if (!theme || !section) return;
    section.style.setProperty('--edition-color', theme.color);
    section.style.setProperty('--edition-glow', theme.glow);
    section.style.setProperty('--edition-bg', theme.bg);
  }

  function centerCard(index) {
    activeIndex = (index + total) % total;

    cards.forEach((card, idx) => {
      const isCenter = idx === activeIndex;
      card.classList.toggle('is-active', isCenter);

      if (isCenter) {
        card.style.transform = 'scale(1.2) translateZ(50px) rotateY(0deg)';
        card.style.opacity = '1';
        card.style.filter = 'saturate(1.15)';
        card.style.zIndex = '20';
      } else {
        const offset = idx - activeIndex;
        const rotY = offset < 0 ? -12 : 12;
        card.style.transform = `scale(0.8) rotateY(${rotY}deg)`;
        card.style.opacity = '0.55';
        card.style.filter = 'saturate(0.85)';
        card.style.zIndex = '5';
      }
    });

    dots?.forEach((d, idx) => d.classList.toggle('active', idx === activeIndex));

    // Calculate translation offset to place active card dead-center
    const activeCard = cards[activeIndex];
    const vpWidth = viewport.clientWidth;
    const cardWidth = activeCard.offsetWidth;
    const cardLeft = activeCard.offsetLeft;

    const targetOffset = vpWidth / 2 - (cardLeft + cardWidth / 2);
    track.style.transform = `translateX(${targetOffset}px)`;

    const flavor = activeCard.getAttribute('data-flavor');
    updateAtmosphere(flavor);
  }

  // Click card to center
  cards.forEach((card, idx) => {
    card.addEventListener('click', () => centerCard(idx));
  });

  prevBtn?.addEventListener('click', () => centerCard(activeIndex - 1));
  nextBtn?.addEventListener('click', () => centerCard(activeIndex + 1));

  // Drag / Swipe support
  let isDown = false;
  let startX = 0;

  viewport.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX;
  });

  viewport.addEventListener('mouseleave', () => { isDown = false; });
  viewport.addEventListener('mouseup', (e) => {
    if (!isDown) return;
    isDown = false;
    const endX = e.pageX;
    const diff = endX - startX;
    if (diff > 45) {
      centerCard(activeIndex - 1);
    } else if (diff < -45) {
      centerCard(activeIndex + 1);
    }
  });

  // Touch swipe
  let touchStartX = 0;
  viewport.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  viewport.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX;
    if (diff > 40) {
      centerCard(activeIndex - 1);
    } else if (diff < -40) {
      centerCard(activeIndex + 1);
    }
  });

  window.addEventListener('resize', () => centerCard(activeIndex));

  // Initialize center
  centerCard(0);
}

/* ==========================================================================
   9. COMPLETE ALL DRINKS MODAL
   ========================================================================== */
function initAllDrinksModal() {
  const openBtn = document.getElementById('btn-open-all-drinks');
  const modal = document.getElementById('all-drinks-modal');
  const closeBtn = document.getElementById('all-drinks-close-btn');

  if (!openBtn || !modal) return;

  const openModal = () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  openBtn.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });
}

/* ==========================================================================
   10. EVENTS — FEATURED LIVE COUNTDOWN TIMER & EXPANDABLE GLASS CARDS
   ========================================================================== */
function initFeaturedEventCountdown() {
  const daysEl = document.getElementById('event-days');
  const hoursEl = document.getElementById('event-hours');
  const minutesEl = document.getElementById('event-minutes');
  const secondsEl = document.getElementById('event-seconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  // Set Target: 18 days, 14 hours, 32 mins from load
  const now = new Date();
  const targetDate = new Date(now.getTime() + (18 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000) + (32 * 60 * 1000));

  function update() {
    const current = new Date().getTime();
    const distance = targetDate.getTime() - current;

    if (distance <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = d < 10 ? '0' + d : d;
    hoursEl.textContent = h < 10 ? '0' + h : h;
    minutesEl.textContent = m < 10 ? '0' + m : m;
    secondsEl.textContent = s < 10 ? '0' + s : s;
  }

  update();
  setInterval(update, 1000);
}

function initExpandableEventCards() {
  const cards = document.querySelectorAll('.glass-event-card');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const isExpanded = card.classList.contains('expanded');
      // Collapse others or toggle
      cards.forEach(c => c.classList.remove('expanded'));
      if (!isExpanded) {
        card.classList.add('expanded');
      }
    });
  });
}

/* ==========================================================================
   11. ATHLETES HORIZONTAL SNAP SLIDER
   ========================================================================== */
function initAthletesSlider() {
  const viewport = document.getElementById('athletes-viewport');
  const prev = document.getElementById('athlete-prev-btn');
  const next = document.getElementById('athlete-next-btn');

  if (viewport) {
    prev?.addEventListener('click', () => {
      viewport.scrollBy({ left: -302, behavior: 'smooth' });
    });

    next?.addEventListener('click', () => {
      viewport.scrollBy({ left: 302, behavior: 'smooth' });
    });

    // Smooth Drag-to-Scroll
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    viewport.addEventListener('mousedown', (e) => {
      isDown = true;
      viewport.classList.add('is-dragging');
      startX = e.pageX - viewport.offsetLeft;
      scrollLeft = viewport.scrollLeft;
    });

    viewport.addEventListener('mouseleave', () => {
      isDown = false;
      viewport.classList.remove('is-dragging');
    });

    viewport.addEventListener('mouseup', () => {
      isDown = false;
      viewport.classList.remove('is-dragging');
    });

    viewport.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - viewport.offsetLeft;
      const walk = (x - startX) * 1.5;
      viewport.scrollLeft = scrollLeft - walk;
    });
  }

  // Interactive Cursor Glow tracking on athlete cards
  const athleteCards = document.querySelectorAll('.athlete-portrait-card');
  athleteCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x.toFixed(1)}px`);
      card.style.setProperty('--mouse-y', `${y.toFixed(1)}px`);
    }, { passive: true });
  });
}

/* ==========================================================================
   12. GALLERY — PINTEREST MASONRY & LIGHTBOX
   ========================================================================== */
function initGalleryLightbox() {
  const items = document.querySelectorAll('.masonry-item');
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCategory = document.getElementById('lightbox-category');
  const lightboxLocation = document.getElementById('lightbox-location');
  const lightboxVideoIndicator = document.getElementById('lightbox-video-indicator');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  if (!lightbox || !items.length) return;

  let activeIndex = 0;
  const galleryData = [];

  items.forEach((item, idx) => {
    const src = item.getAttribute('data-src') || item.querySelector('img')?.src;
    const caption = item.getAttribute('data-caption') || item.querySelector('.masonry-title')?.textContent || '';
    const category = item.getAttribute('data-category') || item.querySelector('.masonry-tag')?.textContent || 'RED BULL MOMENT';
    const location = item.getAttribute('data-location') || item.querySelector('.masonry-location')?.textContent || '';
    const isVideo = item.getAttribute('data-video') === 'true';

    galleryData.push({ src, caption, category, location, isVideo });

    item.addEventListener('click', () => {
      openLightbox(idx);
    });
  });

  function openLightbox(index) {
    activeIndex = (index + galleryData.length) % galleryData.length;
    const item = galleryData[activeIndex];

    if (lightboxImg) lightboxImg.src = item.src;
    if (lightboxCaption) lightboxCaption.textContent = item.caption;
    if (lightboxCategory) lightboxCategory.textContent = item.category;
    if (lightboxLocation) {
      lightboxLocation.textContent = item.location.startsWith('📍') ? item.location : `📍 ${item.location}`;
      lightboxLocation.style.display = item.location ? 'block' : 'none';
    }
    if (lightboxVideoIndicator) {
      lightboxVideoIndicator.style.display = item.isVideo ? 'flex' : 'none';
    }

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn?.addEventListener('click', closeLightbox);
  prevBtn?.addEventListener('click', () => openLightbox(activeIndex - 1));
  nextBtn?.addEventListener('click', () => openLightbox(activeIndex + 1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') openLightbox(activeIndex - 1);
    if (e.key === 'ArrowRight') openLightbox(activeIndex + 1);
  });
}

function initGalleryParallax() {
  const gallery = document.getElementById('gallery');
  const parallaxItems = document.querySelectorAll('.masonry-item.tall, .masonry-item.wide');
  if (!gallery || !parallaxItems.length) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const rect = gallery.getBoundingClientRect();
        const winH = window.innerHeight;
        if (rect.top < winH && rect.bottom > 0) {
          const scrollProgress = (winH - rect.top) / (winH + rect.height);
          const offset = (scrollProgress - 0.5) * 28;
          parallaxItems.forEach((item, idx) => {
            const dir = idx % 2 === 0 ? 1 : -1;
            item.style.setProperty('--masonry-parallax', `${(offset * dir).toFixed(1)}px`);
          });
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ==========================================================================
   13. SMOOTH SCROLL PARALLAX & HERO LIGHTING PRESERVATION
   ========================================================================== */
function initScrollParallax() {
  const hero = document.getElementById('hero');
  const heroLayout = document.getElementById('hero-f1-layout');
  const scrollOverlay = document.getElementById('hero-scroll-overlay');
  const spotlight = document.getElementById('car-cinematic-spotlight');
  const carImg = document.getElementById('f1-car-image');

  let ticking = false;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroH = hero ? hero.offsetHeight : window.innerHeight;
    if (scrollY > heroH * 1.6) return;

    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollPct = Math.min(1, Math.max(0, scrollY / (heroH * 0.88)));

        // Reduce brightness by only 15-20% during scroll, never more
        // Dark overlay capped strictly at 18% max opacity (never exceeds 20%)
        if (scrollOverlay) {
          const overlayOpacity = Math.min(0.18, scrollPct * 0.18);
          scrollOverlay.style.opacity = overlayOpacity.toFixed(3);
        }

        // Hero layout keeps at least 85% opacity (never fading to black)
        if (heroLayout) {
          heroLayout.style.transform = `translateY(${(-scrollY * 0.05).toFixed(1)}px)`;
          heroLayout.style.opacity = `${Math.max(0.85, 1 - scrollPct * 0.15).toFixed(2)}`;
        }

        // RB21 Car brightness reduced by only 15-20% maximum during scroll, preserving all logos and carbon fiber
        if (carImg) {
          const scrollBrightness = Math.max(0.78, 0.94 - scrollPct * 0.16);
          carImg.style.filter = `contrast(1.18) saturate(1.18) brightness(${scrollBrightness.toFixed(2)}) drop-shadow(0 32px 64px rgba(0, 0, 0, 0.96))`;
        }

        // Spotlight stays fixed on the car while scrolling, remaining clearly illuminated (minimum 85% opacity)
        if (spotlight) {
          const spotlightOpacity = Math.max(0.85, 1 - scrollPct * 0.15);
          spotlight.style.opacity = spotlightOpacity.toFixed(2);
        }

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ==========================================================================
   14. SCROLL REVEALS (Intersection Observer — 0.8s Smooth Flow)
   ========================================================================== */
function initScrollReveals() {
  const elements = document.querySelectorAll('.reveal-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.08
  });

  elements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   15. SMOOTH SCROLL ANCHOR LINKS
   ========================================================================== */
function initSmoothScrollLinks() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/* ==========================================================================
   16. HERO CAR LOCKED CINEMATIC SPOTLIGHT (ORACLE RED BULL RACING)
   ========================================================================== */
function initHeroCarSpotlight() {
  const carWrap = document.getElementById('hero-car-wrap');
  const spotlight = document.getElementById('hero-car-cursor-spotlight');
  const darkOverlay = document.getElementById('hero-car-dark-overlay');
  if (!carWrap || !spotlight) return;

  // Center anchor on the RB21 car (nose & cockpit focal area: 46% from left, 48% from top)
  let centerX = carWrap.offsetWidth * 0.46;
  let centerY = carWrap.offsetHeight * 0.48;

  // Maximum subtle shift in any direction (40–60px strictly as requested)
  const MAX_SHIFT_X = 50;
  const MAX_SHIFT_Y = 38;

  let targetX = centerX;
  let targetY = centerY;
  let currentX = centerX;
  let currentY = centerY;
  let isHovered = false;
  let animId = null;

  function recalculateCenter() {
    centerX = carWrap.offsetWidth * 0.46;
    centerY = carWrap.offsetHeight * 0.48;
    if (!isHovered) {
      targetX = centerX;
      targetY = centerY;
      spotlight.style.left = `${centerX.toFixed(1)}px`;
      spotlight.style.top = `${centerY.toFixed(1)}px`;
      carWrap.style.setProperty('--spot-x', `${centerX.toFixed(1)}px`);
      carWrap.style.setProperty('--spot-y', `${centerY.toFixed(1)}px`);
      if (darkOverlay) {
        const maskVal = `radial-gradient(circle 175px at ${centerX.toFixed(1)}px ${centerY.toFixed(1)}px, transparent 0%, transparent 45px, rgba(0, 0, 0, 0.55) 115px, black 175px)`;
        darkOverlay.style.webkitMaskImage = maskVal;
        darkOverlay.style.maskImage = maskVal;
      }
    }
  }

  window.addEventListener('resize', recalculateCenter, { passive: true });

  // Apply initial position centered on the car
  const initX = centerX.toFixed(1);
  const initY = centerY.toFixed(1);
  spotlight.style.left = `${initX}px`;
  spotlight.style.top = `${initY}px`;
  carWrap.style.setProperty('--spot-x', `${initX}px`);
  carWrap.style.setProperty('--spot-y', `${initY}px`);

  if (darkOverlay) {
    const maskVal = `radial-gradient(circle 175px at ${initX}px ${initY}px, transparent 0%, transparent 45px, rgba(0, 0, 0, 0.55) 115px, black 175px)`;
    darkOverlay.style.webkitMaskImage = maskVal;
    darkOverlay.style.maskImage = maskVal;
  }

  function updatePosition() {
    // Smooth easing/lerp so the camera light tracks gently behind the cursor
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    const posX = currentX.toFixed(1);
    const posY = currentY.toFixed(1);

    spotlight.style.left = `${posX}px`;
    spotlight.style.top = `${posY}px`;
    carWrap.style.setProperty('--spot-x', `${posX}px`);
    carWrap.style.setProperty('--spot-y', `${posY}px`);

    if (darkOverlay) {
      const maskVal = `radial-gradient(circle 175px at ${posX}px ${posY}px, transparent 0%, transparent 45px, rgba(0, 0, 0, 0.55) 115px, black 175px)`;
      darkOverlay.style.webkitMaskImage = maskVal;
      darkOverlay.style.maskImage = maskVal;
    }

    // Continue animation if hovering or still returning toward target center
    if (isHovered || Math.abs(targetX - currentX) > 0.2 || Math.abs(targetY - currentY) > 0.2) {
      animId = requestAnimationFrame(updatePosition);
    } else {
      currentX = targetX;
      currentY = targetY;
      animId = null;
    }
  }

  function handlePointerMove(e) {
    const rect = carWrap.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate normalized offset from center [-1, 1]
    const halfWidth = Math.max(1, carWrap.offsetWidth * 0.5);
    const halfHeight = Math.max(1, carWrap.offsetHeight * 0.5);
    const normX = Math.max(-1, Math.min(1, (mouseX - centerX) / halfWidth));
    const normY = Math.max(-1, Math.min(1, (mouseY - centerY) / halfHeight));

    // Shift only slightly around the center (max 40–60px)
    targetX = centerX + normX * MAX_SHIFT_X;
    targetY = centerY + normY * MAX_SHIFT_Y;

    if (!animId) {
      animId = requestAnimationFrame(updatePosition);
    }
  }

  carWrap.addEventListener('mouseenter', (e) => {
    isHovered = true;
    spotlight.classList.add('is-active');
    handlePointerMove(e);
  });

  carWrap.addEventListener('mousemove', (e) => {
    if (!isHovered) {
      isHovered = true;
      spotlight.classList.add('is-active');
    }
    handlePointerMove(e);
  });

  carWrap.addEventListener('mouseleave', () => {
    isHovered = false;
    spotlight.classList.remove('is-active');
    // Smoothly returns to the exact center of the RB21
    targetX = centerX;
    targetY = centerY;
    if (!animId) {
      animId = requestAnimationFrame(updatePosition);
    }
  });
}
