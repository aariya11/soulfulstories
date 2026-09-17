// Gallery & Project Lightbox Module
import { STORIES_DATA } from './data.js';

let lastActiveTrigger = null;

export function initGallery() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryGrid = document.querySelector('.editorial-gallery-grid');
  const lightboxDialog = document.getElementById('storyLightbox');
  const lightboxCloseBtn = document.getElementById('closeLightboxBtn');

  if (!galleryGrid) return;

  // Render initial stories
  renderStories(STORIES_DATA, galleryGrid);

  // Filter Buttons & Keyboard Navigation
  const btnArray = Array.from(filterButtons);
  btnArray.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      setActiveFilter(btn, btnArray, galleryGrid);
    });

    // WAI-ARIA tab keyboard navigation
    btn.addEventListener('keydown', (e) => {
      let targetIndex = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        targetIndex = (idx + 1) % btnArray.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        targetIndex = (idx - 1 + btnArray.length) % btnArray.length;
      }

      if (targetIndex !== null) {
        btnArray[targetIndex].focus();
        setActiveFilter(btnArray[targetIndex], btnArray, galleryGrid);
      }
    });
  });

  // Lightbox Close Handling
  if (lightboxCloseBtn && lightboxDialog) {
    function closeLightbox() {
      lightboxDialog.close();
      document.body.style.overflow = '';
      if (lastActiveTrigger && typeof lastActiveTrigger.focus === 'function') {
        lastActiveTrigger.focus();
      }
    }

    lightboxCloseBtn.addEventListener('click', closeLightbox);

    lightboxDialog.addEventListener('click', (e) => {
      if (e.target === lightboxDialog) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxDialog.open) {
        closeLightbox();
      }
    });
  }
}

function setActiveFilter(activeBtn, allButtons, grid) {
  allButtons.forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
    b.setAttribute('tabindex', '-1');
  });

  activeBtn.classList.add('active');
  activeBtn.setAttribute('aria-selected', 'true');
  activeBtn.setAttribute('tabindex', '0');

  const filterKey = activeBtn.dataset.filter;
  if (filterKey === 'all') {
    renderStories(STORIES_DATA, grid);
  } else {
    const filtered = STORIES_DATA.filter(item => item.categoryKey === filterKey);
    renderStories(filtered, grid);
  }
}

function renderStories(stories, container) {
  container.innerHTML = '';

  stories.forEach((story, idx) => {
    const colClasses = ['story-col-7', 'story-col-5', 'story-col-5', 'story-col-7', 'story-col-6', 'story-col-6'];
    const colClass = colClasses[idx % colClasses.length];

    const card = document.createElement('button');
    card.type = 'button';
    card.className = `story-card ${colClass} reveal-on-scroll is-revealed`;
    card.setAttribute('data-id', story.id);
    card.setAttribute('aria-label', `View project ${story.title} — ${story.subtitle}`);

    card.innerHTML = `
      <div class="story-media-container ${story.aspect}">
        <span class="story-badge">${story.category}</span>
        <img 
          src="${story.coverThumb || story.coverImage}" 
          alt="${story.altText || (story.title + ' — ' + story.subtitle)}" 
          class="story-card-img"
          loading="lazy"
          width="800"
          height="1000"
        />
      </div>
      <div class="story-meta">
        <div>
          <h3 class="story-title">${story.title}</h3>
          <div class="story-category-tag">${story.subtitle}</div>
        </div>
        <div style="text-align: right;">
          <span class="story-location">${story.location}</span>
          <div class="caption-editorial" style="margin-top: 2px;">${story.year}</div>
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      lastActiveTrigger = card;
      openStoryLightbox(story);
    });

    container.appendChild(card);
  });
}

export function openStoryLightbox(story) {
  const lightboxDialog = document.getElementById('storyLightbox');
  const lightboxContent = document.getElementById('lightboxDynamicContent');
  if (!lightboxDialog || !lightboxContent) return;

  const galleryItemsHtml = story.gallery.map(item => `
    <div class="lightbox-gallery-item">
      <img src="${item.url}" alt="${item.alt || item.caption}" loading="lazy" />
      <div class="lightbox-caption">${item.caption}</div>
    </div>
  `).join('');

  lightboxContent.innerHTML = `
    <div class="lightbox-header">
      <span class="eyebrow eyebrow-dark">${story.category} · ${story.year}</span>
      <h2 class="lightbox-title" id="lightboxTitle">${story.title}</h2>
      <p style="font-family: var(--font-serif); font-size: 1.5rem; color: rgba(255,255,255,0.85); margin-bottom: 1.5rem;">
        ${story.subtitle}
      </p>
      <p class="lead-editorial" style="color: rgba(255,255,255,0.72); max-width: 720px; font-weight: 350;">
        ${story.synopsis}
      </p>

      <div class="lightbox-details-grid">
        <div>
          <strong style="color: #fff; display: block; margin-bottom: 4px;">Location</strong>
          <span style="color: rgba(255,255,255,0.65);">${story.location}</span>
        </div>
        <div>
          <strong style="color: #fff; display: block; margin-bottom: 4px;">Venue / Setting</strong>
          <span style="color: rgba(255,255,255,0.65);">${story.details?.venue || 'Heritage Sanctuary, Odisha'}</span>
        </div>
        <div>
          <strong style="color: #fff; display: block; margin-bottom: 4px;">Visual Palette</strong>
          <span style="color: rgba(255,255,255,0.65);">${story.details?.palette || story.details?.styling || 'Editorial Film Tones'}</span>
        </div>
      </div>

      ${story.details?.quote ? `
        <blockquote style="margin: 2.5rem 0; padding-left: 1.5rem; border-left: 2px solid rgba(255,255,255,0.3); font-family: var(--font-serif); font-style: italic; font-size: 1.35rem; color: rgba(255,255,255,0.92); line-height: 1.5;">
          “${story.details.quote}”
        </blockquote>
      ` : ''}

      <div class="lightbox-gallery-flow">
        ${galleryItemsHtml}
      </div>

      <div style="margin-top: 5rem; text-align: center; border-top: 1px solid rgba(255,255,255,0.15); padding-top: 3.5rem;">
        <h3 style="color: #fff; font-family: var(--font-serif); font-size: 2.2rem; margin-bottom: 1rem; font-weight: 300;">
          Inquire About Your Date
        </h3>
        <p style="color: rgba(255,255,255,0.65); margin-bottom: 2rem; max-width: 480px; margin-left: auto; margin-right: auto; font-size: 0.95rem;">
          Soulful Stories accepts a strictly limited number of commissions per season across Odisha and destination weddings worldwide.
        </p>
        <button type="button" class="btn-hero-primary open-inquiry-trigger" style="margin: 0 auto;">
          CHECK DATE AVAILABILITY →
        </button>
      </div>
    </div>
  `;

  // Attach inquiry trigger from within lightbox
  const inquiryBtn = lightboxContent.querySelector('.open-inquiry-trigger');
  if (inquiryBtn) {
    inquiryBtn.addEventListener('click', () => {
      lightboxDialog.close();
      const inquiryDialog = document.getElementById('inquiryModal');
      if (inquiryDialog) {
        inquiryDialog.showModal();
        document.body.style.overflow = 'hidden';
      }
    });
  }

  lightboxDialog.setAttribute('aria-modal', 'true');
  lightboxDialog.setAttribute('aria-labelledby', 'lightboxTitle');
  lightboxDialog.showModal();
  document.body.style.overflow = 'hidden';

  const closeBtn = document.getElementById('closeLightboxBtn');
  closeBtn?.focus();
}
