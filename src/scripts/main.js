// Main Application Script — Soulful Stories
import { initGallery } from './gallery.js';
import { initServices } from './services.js';
import { initContact } from './contact.js';
import { TESTIMONIALS_DATA, JOURNAL_DATA, INSTAGRAM_FEED } from './data.js';

let lastJournalTrigger = null;

document.addEventListener('DOMContentLoaded', () => {
  initGallery();
  initServices();
  initContact();

  initHeaderScroll();
  initMobileDrawer();
  initCustomCursor();
  initTestimonials();
  initJournal();
  initInstagramGrid();
  initScrollReveals();
  initAmbientSound();
});

/* ==========================================================================
   Header Scroll & Theme Observer
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  const heroSection = document.getElementById('hero');
  const approachSection = document.getElementById('approach');

  if (!header) return;

  function updateHeader() {
    const scrollY = window.scrollY;

    const heroBottom = heroSection ? heroSection.offsetTop + heroSection.offsetHeight : 600;
    if (scrollY < heroBottom - 90) {
      header.classList.add('is-transparent-hero');
    } else {
      header.classList.remove('is-transparent-hero');
    }

    if (scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }

    if (approachSection) {
      const approachTop = approachSection.offsetTop - 70;
      const approachBottom = approachSection.offsetTop + approachSection.offsetHeight - 70;
      if (scrollY >= approachTop && scrollY <= approachBottom) {
        header.classList.add('on-dark');
        header.classList.add('is-transparent-hero');
      } else if (scrollY >= heroBottom - 90) {
        header.classList.remove('on-dark');
      }
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
}

/* ==========================================================================
   Mobile Menu Drawer (Accessible)
   ========================================================================== */
function initMobileDrawer() {
  const trigger = document.getElementById('mobileMenuTrigger');
  const drawer = document.getElementById('mobileNavDrawer');
  const closeBtn = document.getElementById('closeMobileNav');
  const drawerLinks = drawer?.querySelectorAll('.mobile-nav-link');

  if (!trigger || !drawer) return;

  function openDrawer() {
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    trigger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    closeBtn?.focus();
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    trigger.focus();
  }

  trigger.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);

  drawerLinks?.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   Custom Editorial Cursor (Desktop Only)
   ========================================================================== */
function initCustomCursor() {
  const cursorDot = document.querySelector('.custom-cursor');
  const cursorFollower = document.querySelector('.custom-cursor-follower');

  if (!cursorDot || !cursorFollower || window.matchMedia('(pointer: coarse)').matches) {
    return;
  }

  let mouseX = -100;
  let mouseY = -100;
  let followerX = -100;
  let followerY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  }, { passive: true });

  function renderCursor() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;

    cursorFollower.style.left = `${followerX}px`;
    cursorFollower.style.top = `${followerY}px`;

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  const interactives = document.querySelectorAll('a, button, .story-card, .service-row, .insta-card, .journal-card');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorFollower.classList.add('is-hovering');
      if (el.classList.contains('story-card')) {
        cursorFollower.textContent = 'VIEW';
      } else if (el.classList.contains('service-row')) {
        cursorFollower.textContent = 'INQUIRE';
      } else if (el.classList.contains('insta-card')) {
        cursorFollower.textContent = 'INSTA';
      } else {
        cursorFollower.textContent = '';
      }
    });

    el.addEventListener('mouseleave', () => {
      cursorFollower.classList.remove('is-hovering');
      cursorFollower.textContent = '';
    });
  });
}

/* ==========================================================================
   Testimonials Slider
   ========================================================================== */
function initTestimonials() {
  const slider = document.querySelector('.testimonials-slider');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');

  if (!slider) return;

  slider.innerHTML = '';
  TESTIMONIALS_DATA.forEach((item, idx) => {
    const slide = document.createElement('div');
    slide.className = `testimonial-slide ${idx === 0 ? 'is-active' : ''}`;
    slide.setAttribute('role', 'tabpanel');
    slide.setAttribute('aria-label', `Testimonial ${idx + 1} of ${TESTIMONIALS_DATA.length}`);
    slide.innerHTML = `
      <blockquote class="testimonial-text">“${item.quote}”</blockquote>
      <div class="testimonial-author">${item.names}</div>
      <div class="testimonial-location">${item.location} · ${item.story}</div>
    `;
    slider.appendChild(slide);
  });

  const slides = slider.querySelectorAll('.testimonial-slide');
  let currentIndex = 0;

  function showSlide(index) {
    slides.forEach((s, i) => {
      s.classList.toggle('is-active', i === index);
    });
  }

  prevBtn?.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
  });

  nextBtn?.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  });
}

/* ==========================================================================
   Journal Articles & Reading View
   ========================================================================== */
function initJournal() {
  const grid = document.querySelector('.journal-grid');
  if (!grid) return;

  grid.innerHTML = '';
  JOURNAL_DATA.forEach(article => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'journal-card reveal-on-scroll is-revealed';
    card.setAttribute('aria-label', `Read article: ${article.title}`);
    card.style.textAlign = 'left';
    card.style.background = 'none';
    card.style.border = 'none';

    card.innerHTML = `
      <div class="journal-img-wrap">
        <img src="${article.image}" alt="${article.title}" loading="lazy" />
      </div>
      <div class="journal-meta">
        <span>${article.category}</span>
        <span>·</span>
        <span>${article.date}</span>
        <span>·</span>
        <span>${article.readTime}</span>
      </div>
      <h3 class="journal-title">${article.title}</h3>
      <p class="journal-excerpt">${article.excerpt}</p>
    `;

    card.addEventListener('click', () => {
      lastJournalTrigger = card;
      openJournalArticle(article);
    });

    grid.appendChild(card);
  });
}

function openJournalArticle(article) {
  const lightboxDialog = document.getElementById('storyLightbox');
  const lightboxContent = document.getElementById('lightboxDynamicContent');
  if (!lightboxDialog || !lightboxContent) return;

  lightboxContent.innerHTML = `
    <div class="lightbox-header" style="max-width: 820px; margin: 0 auto;">
      <span class="eyebrow eyebrow-dark">${article.category} · ${article.date} · ${article.readTime}</span>
      <h2 class="lightbox-title" id="lightboxTitle" style="font-size: clamp(2rem, 4vw, 3.25rem); margin-top: 1rem; font-weight: 300;">
        ${article.title}
      </h2>
      <div style="margin: 2.5rem 0; aspect-ratio: 16/9; overflow: hidden; background: #1a1817;">
        <img src="${article.image}" alt="${article.title}" style="width: 100%; height: 100%; object-fit: cover;" />
      </div>
      <div class="journal-full-body" style="font-size: 1.15rem; line-height: 1.85; color: rgba(255,255,255,0.88); font-weight: 350;">
        <p style="margin-bottom: 2rem; color: rgba(255,255,255,0.95); font-size: 1.25rem; line-height: 1.6;">${article.excerpt}</p>
        <p style="margin-bottom: 2rem;">${article.content}</p>
        <p style="font-family: var(--font-serif); font-style: italic; color: rgba(255,255,255,0.6); margin-top: 3rem;">
          — Soulful Stories Journal Archive · Odisha, India
        </p>
      </div>
    </div>
  `;

  lightboxDialog.setAttribute('aria-modal', 'true');
  lightboxDialog.setAttribute('aria-labelledby', 'lightboxTitle');
  lightboxDialog.showModal();
  document.body.style.overflow = 'hidden';

  const closeBtn = document.getElementById('closeLightboxBtn');
  closeBtn?.focus();
}

/* ==========================================================================
   Instagram Grid (From Our Lens)
   ========================================================================== */
function initInstagramGrid() {
  const grid = document.querySelector('.instagram-grid');
  if (!grid) return;

  grid.innerHTML = '';
  INSTAGRAM_FEED.forEach(item => {
    const link = document.createElement('a');
    link.href = item.link;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'insta-card reveal-on-scroll is-revealed';
    link.setAttribute('aria-label', `View Instagram post: ${item.title}`);

    link.innerHTML = `
      <img src="${item.image}" alt="${item.title}" loading="lazy" />
      <div class="insta-card-overlay">
        <span class="insta-badge-type">${item.type}</span>
        <div class="insta-likes">♥ ${item.likes}</div>
      </div>
    `;

    grid.appendChild(link);
  });
}

/* ==========================================================================
   Intersection Observer (Scroll Reveal)
   ========================================================================== */
function initScrollReveals() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

/* ==========================================================================
   Ambient Audio Experience (Web Audio API Synthesized Indian Tanpura Drone)
   ========================================================================== */
function initAmbientSound() {
  const toggleBtn = document.getElementById('audioToggleBtn');
  if (!toggleBtn) return;

  let audioCtx = null;
  let isPlaying = false;
  let oscillators = [];
  let masterGain = null;

  function startAmbientChords() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    if (!audioCtx) {
      audioCtx = new AudioContext();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.045, audioCtx.currentTime + 2.5);
    masterGain.connect(audioCtx.destination);

    // Warm meditative harmonic frequencies (D modal Indian drone: D3, A3, D4, F#4)
    const freqs = [146.83, 220.00, 293.66, 369.99];

    oscillators = freqs.map((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.detune.setValueAtTime((i - 1.5) * 4, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.28 / freqs.length, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
      return osc;
    });

    isPlaying = true;
    toggleBtn.classList.add('is-playing');
    toggleBtn.setAttribute('aria-label', 'Mute ambient soundscape');
    toggleBtn.querySelector('.audio-label').textContent = 'SOUND ON';
  }

  function stopAmbientChords() {
    if (masterGain && audioCtx) {
      masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);
      setTimeout(() => {
        oscillators.forEach(osc => {
          try { osc.stop(); } catch(e) {}
        });
        oscillators = [];
        isPlaying = false;
        toggleBtn.classList.remove('is-playing');
        toggleBtn.setAttribute('aria-label', 'Play ambient soundscape (Tanpura drone)');
        toggleBtn.querySelector('.audio-label').textContent = 'SOUND OFF';
      }, 1200);
    }
  }

  toggleBtn.addEventListener('click', () => {
    if (!isPlaying) {
      startAmbientChords();
    } else {
      stopAmbientChords();
    }
  });
}
