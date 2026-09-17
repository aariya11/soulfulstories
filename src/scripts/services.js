// Services Section & Floating Hover Preview
import { SERVICES_DATA } from './data.js';

let lastActiveServiceBtn = null;

export function initServices() {
  const servicesList = document.querySelector('.services-list');
  const hoverPreview = document.querySelector('.service-hover-preview');
  const previewImg = hoverPreview?.querySelector('img');

  if (!servicesList) return;

  // Render services rows as semantic buttons
  servicesList.innerHTML = '';
  SERVICES_DATA.forEach(service => {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'service-row';
    row.setAttribute('data-image', service.image);
    row.setAttribute('data-service', service.title);
    row.setAttribute('aria-label', `Inquire about ${service.title} (${service.tag})`);

    row.innerHTML = `
      <span class="service-num">${service.number}</span>
      <div class="service-heading-wrap">
        <h3 class="service-title">${service.title}</h3>
        <span class="service-tag">${service.tag}</span>
      </div>
      <p class="service-desc">${service.description}</p>
      <span class="service-arrow" aria-hidden="true">→</span>
    `;

    row.addEventListener('click', () => {
      lastActiveServiceBtn = row;
      openInquiryWithService(service.title);
    });

    servicesList.appendChild(row);
  });

  // Floating hover preview logic (desktop pointer only)
  if (!hoverPreview || !previewImg || window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;
  let isHovering = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function animatePreview() {
    if (isHovering) {
      currentX += (mouseX - currentX) * 0.12;
      currentY += (mouseY - currentY) * 0.12;
      hoverPreview.style.left = `${currentX}px`;
      hoverPreview.style.top = `${currentY}px`;
    }
    requestAnimationFrame(animatePreview);
  }
  requestAnimationFrame(animatePreview);

  const rows = servicesList.querySelectorAll('.service-row');
  rows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      const imgSrc = row.getAttribute('data-image');
      if (imgSrc) {
        previewImg.src = imgSrc;
        hoverPreview.classList.add('is-active');
        isHovering = true;
      }
    });

    row.addEventListener('mouseleave', () => {
      hoverPreview.classList.remove('is-active');
      isHovering = false;
    });
  });
}

export function openInquiryWithService(serviceTitle) {
  const inquiryModal = document.getElementById('inquiryModal');
  const serviceSelect = document.getElementById('inquiryService');
  if (inquiryModal) {
    if (serviceSelect) {
      for (let i = 0; i < serviceSelect.options.length; i++) {
        const optText = serviceSelect.options[i].text.toUpperCase();
        const searchTitle = serviceTitle.toUpperCase();
        if (optText.includes(searchTitle) || searchTitle.includes(optText)) {
          serviceSelect.selectedIndex = i;
          break;
        }
      }
    }
    inquiryModal.setAttribute('aria-modal', 'true');
    inquiryModal.setAttribute('aria-labelledby', 'inquiryHeading');
    inquiryModal.showModal();
    document.body.style.overflow = 'hidden';

    // Focus first input
    const firstInput = document.getElementById('inquiryName');
    firstInput?.focus();
  }
}
