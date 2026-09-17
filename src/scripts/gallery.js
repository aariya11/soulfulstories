// Gallery & Project Lightbox Module
import { STORIES_DATA } from './data.js';

export function initGallery() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryGrid = document.querySelector('.editorial-gallery-grid');
  const lightboxDialog = document.getElementById('storyLightbox');
  const lightboxContent = document.getElementById('lightboxDynamicContent');
  const lightboxCloseBtn = document.getElementById('closeLightboxBtn');

  if (!galleryGrid) return;

  // Render initial stories
  renderStories(STORIES_DATA, galleryGrid);

  // Filter Buttons
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filterKey = btn.dataset.filter;

      if (filterKey === 'all') {
        renderStories(STORIES_DATA, galleryGrid);
      } else {
        const filtered = STORIES_DATA.filter(item => item.categoryKey === filterKey);
        renderStories(filtered, galleryGrid);
      }
    });
  });

  // Lightbox Close
  if (lightboxCloseBtn && lightboxDialog) {
    lightboxCloseBtn.addEventListener('click', () => {
      lightboxDialog.close();
      document.body.style.overflow = '';
    });

    lightboxDialog.addEventListener('click', (e) => {
      if (e.target === lightboxDialog) {
        lightboxDialog.close();
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxDialog.open) {
        lightboxDialog.close();
        document.body.style.overflow = '';
      }
    });
  }
}

function renderStories(stories, container) {
  container.innerHTML = '';

  stories.forEach((story, idx) => {
    // Determine asymmetric layout column span
    const colClasses = ['story-col-7', 'story-col-5', 'story-col-5', 'story-col-7', 'story-col-6', 'story-col-6'];
    const colClass = colClasses[idx % colClasses.length];

    const article = document.createElement('article');
    article.className = `story-card ${colClass} reveal-on-scroll is-revealed`;
    article.setAttribute('data-id', story.id);
    article.setAttribute('tabindex', '0');
    article.setAttribute('role', 'button');
    article.setAttribute('aria-label', `View project ${story.title} - ${story.subtitle}`);

    article.innerHTML = `
      <div class="story-media-container ${story.aspect}">
        <span class="story-badge">${story.category}</span>
        <img 
          src="${story.coverThumb || story.coverImage}" 
          data-src="${story.coverImage}"
          alt="${story.title} — ${story.subtitle}, Odisha" 
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

    article.addEventListener('click', () => openStoryLightbox(story));
    article.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openStoryLightbox(story);
      }
    });

    container.appendChild(article);
  });
}

export function openStoryLightbox(story) {
  const lightboxDialog = document.getElementById('storyLightbox');
  const lightboxContent = document.getElementById('lightboxDynamicContent');
  if (!lightboxDialog || !lightboxContent) return;

  const galleryItemsHtml = story.gallery.map(item => `
    <div class="lightbox-gallery-item">
      <img src="${item.url}" alt="${item.caption}" loading="lazy" />
      <div class="lightbox-caption">${item.caption}</div>
    </div>
  `).join('');

  lightboxContent.innerHTML = `
    <div class="lightbox-header">
      <span class="eyebrow eyebrow-dark">${story.category} — ${story.year}</span>
      <h2 class="lightbox-title">${story.title}</h2>
      <p class="statement-serif" style="font-size: 1.5rem; color: rgba(255,255,255,0.85); margin-bottom: 1.5rem;">
        ${story.subtitle}
      </p>
      <p class="lead-editorial" style="color: rgba(255,255,255,0.7); max-width: 720px;">
        ${story.synopsis}
      </p>

      <div class="lightbox-details-grid">
        <div>
          <strong style="color: #fff; display: block; margin-bottom: 4px;">Location</strong>
          <span style="color: rgba(255,255,255,0.6);">${story.location}</span>
        </div>
        <div>
          <strong style="color: #fff; display: block; margin-bottom: 4px;">Venue / Setting</strong>
          <span style="color: rgba(255,255,255,0.6);">${story.details?.venue || 'Private Sanctuary, Odisha'}</span>
        </div>
        <div>
          <strong style="color: #fff; display: block; margin-bottom: 4px;">Visual Direction</strong>
          <span style="color: rgba(255,255,255,0.6);">${story.details?.palette || story.details?.styling || 'Editorial Film Tones'}</span>
        </div>
      </div>

      ${story.details?.quote ? `
        <blockquote style="margin: 2.5rem 0; padding-left: 1.5rem; border-left: 2px solid rgba(255,255,255,0.3); font-family: var(--font-serif); font-style: italic; font-size: 1.35rem; color: rgba(255,255,255,0.9);">
          "${story.details.quote}"
        </blockquote>
      ` : ''}

      <div class="lightbox-gallery-flow">
        ${galleryItemsHtml}
      </div>

      <div style="margin-top: 5rem; text-align: center; border-top: 1px solid rgba(255,255,255,0.15); padding-top: 3.5rem;">
        <h3 style="color: #fff; font-family: var(--font-serif); font-size: 2.2rem; margin-bottom: 1rem;">
          Inquire About Your Date
        </h3>
        <p style="color: rgba(255,255,255,0.65); margin-bottom: 2rem;">
          Commission Soulful Stories for weddings, pre-weddings, or bespoke editorial projects.
        </p>
        <button class="btn-editorial-primary open-inquiry-trigger" style="background-color: #fff; color: #0c0b0a; border-color: #fff;">
          BEGIN YOUR STORY →
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

  lightboxDialog.showModal();
  document.body.style.overflow = 'hidden';
}
