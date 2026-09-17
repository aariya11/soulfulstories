// Contact & Bespoke Inquiry Modal Handler
let lastActiveInquiryTrigger = null;

export function initContact() {
  const inquiryModal = document.getElementById('inquiryModal');
  const openInquiryBtns = document.querySelectorAll('.open-inquiry-trigger');
  const closeInquiryBtn = document.getElementById('closeInquiryBtn');
  const inquiryForm = document.getElementById('inquiryForm');
  const whatsappSendBtn = document.getElementById('whatsappSendBtn');
  const dateInput = document.getElementById('inquiryDate');

  // Legal modals
  const privacyModal = document.getElementById('privacyModal');
  const closePrivacyBtn = document.getElementById('closePrivacyBtn');
  const openPrivacyLinks = document.querySelectorAll('.open-privacy-trigger');

  const termsModal = document.getElementById('termsModal');
  const closeTermsBtn = document.getElementById('closeTermsBtn');
  const openTermsLinks = document.querySelectorAll('.open-terms-trigger');

  // Minimum date = today
  if (dateInput) {
    dateInput.min = new Date().toISOString().split('T')[0];
  }

  // Open inquiry triggers
  openInquiryBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      lastActiveInquiryTrigger = btn;
      if (inquiryModal) {
        inquiryModal.setAttribute('aria-modal', 'true');
        inquiryModal.setAttribute('aria-labelledby', 'inquiryHeading');
        inquiryModal.showModal();
        document.body.style.overflow = 'hidden';
        const firstInput = document.getElementById('inquiryName');
        firstInput?.focus();
      }
    });
  });

  // Close inquiry triggers
  function closeInquiry() {
    if (inquiryModal && inquiryModal.open) {
      inquiryModal.close();
      document.body.style.overflow = '';
      if (lastActiveInquiryTrigger && typeof lastActiveInquiryTrigger.focus === 'function') {
        lastActiveInquiryTrigger.focus();
      }
    }
  }

  closeInquiryBtn?.addEventListener('click', closeInquiry);

  inquiryModal?.addEventListener('click', (e) => {
    if (e.target === inquiryModal) {
      closeInquiry();
    }
  });

  let returnToInquiryOnClose = false;

  // Privacy Modal Triggers
  openPrivacyLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (inquiryModal && inquiryModal.open) {
        returnToInquiryOnClose = true;
        inquiryModal.close();
      } else {
        returnToInquiryOnClose = false;
      }
      if (privacyModal) {
        privacyModal.setAttribute('aria-modal', 'true');
        privacyModal.showModal();
        document.body.style.overflow = 'hidden';
        closePrivacyBtn?.focus();
      }
    });
  });

  function closePrivacy() {
    if (privacyModal && privacyModal.open) {
      privacyModal.close();
      if (returnToInquiryOnClose && inquiryModal) {
        returnToInquiryOnClose = false;
        inquiryModal.showModal();
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  closePrivacyBtn?.addEventListener('click', closePrivacy);
  privacyModal?.addEventListener('click', (e) => {
    if (e.target === privacyModal) closePrivacy();
  });

  // Terms Modal Triggers
  openTermsLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (inquiryModal && inquiryModal.open) {
        returnToInquiryOnClose = true;
        inquiryModal.close();
      } else {
        returnToInquiryOnClose = false;
      }
      if (termsModal) {
        termsModal.setAttribute('aria-modal', 'true');
        termsModal.showModal();
        document.body.style.overflow = 'hidden';
        closeTermsBtn?.focus();
      }
    });
  });

  function closeTerms() {
    if (termsModal && termsModal.open) {
      termsModal.close();
      if (returnToInquiryOnClose && inquiryModal) {
        returnToInquiryOnClose = false;
        inquiryModal.showModal();
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  closeTermsBtn?.addEventListener('click', closeTerms);
  termsModal?.addEventListener('click', (e) => {
    if (e.target === termsModal) closeTerms();
  });

  // Global ESC key listener for modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (privacyModal?.open) closePrivacy();
      else if (termsModal?.open) closeTerms();
      else if (inquiryModal?.open) closeInquiry();
    }
  });

  // WhatsApp Quick Action
  if (whatsappSendBtn) {
    whatsappSendBtn.addEventListener('click', (e) => {
      e.preventDefault();
      sendWhatsAppMessage();
    });
  }

  // Inquiry Form Validation & Submission
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('inquiryName');
      const phoneInput = document.getElementById('inquiryPhone');
      const emailInput = document.getElementById('inquiryEmail');
      const dateInput = document.getElementById('inquiryDate');
      const locationInput = document.getElementById('inquiryLocation');

      let isValid = true;

      // Clear previous error states
      inquiryForm.querySelectorAll('.form-field').forEach(field => {
        field.classList.remove('has-error');
      });

      // Name validation
      if (!nameInput.value.trim()) {
        showFieldError(nameInput, 'Please enter your name or couple names.');
        isValid = false;
      }

      // Phone validation (at least 7 digits)
      const phoneClean = phoneInput.value.replace(/[^0-9]/g, '');
      if (!phoneClean || phoneClean.length < 7) {
        showFieldError(phoneInput, 'Please enter a valid phone or WhatsApp number.');
        isValid = false;
      }

      // Email validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailInput.value.trim())) {
        showFieldError(emailInput, 'Please enter a valid email address (e.g. name@domain.com).');
        isValid = false;
      }

      // Date validation
      if (!dateInput.value) {
        showFieldError(dateInput, 'Please select your celebration date or approximate date.');
        isValid = false;
      }

      // Location validation
      if (!locationInput.value.trim()) {
        showFieldError(locationInput, 'Please specify your celebration city or venue location.');
        isValid = false;
      }

      if (!isValid) {
        const firstError = inquiryForm.querySelector('.has-error input');
        firstError?.focus();
        return;
      }

      // Render calm, elegant success state
      const formCard = inquiryModal.querySelector('.modal-inquiry-card');
      if (formCard) {
        formCard.innerHTML = `
          <div style="text-align: center; padding: 3rem 1.5rem;">
            <span class="eyebrow" style="justify-content: center; margin-bottom: 1.5rem;">Commission Inquiry Received</span>
            <h2 style="font-family: var(--font-serif); font-size: 2.5rem; margin-bottom: 1.25rem; font-weight: 300;">
              Thank You for Your Trust
            </h2>
            <p style="color: var(--color-text-secondary); max-width: 500px; margin: 0 auto 2.5rem auto; line-height: 1.8; font-size: 0.95rem;">
              Mithun Kumar and our studio production team review every wedding commission personally. We will be in touch within 24–48 hours with our date availability and bespoke investment guide.
            </p>
            <button type="button" class="btn-editorial-primary" id="returnFromInquiryBtn" style="margin: 0 auto;">
              RETURN TO STORIES
            </button>
          </div>
        `;

        const returnBtn = document.getElementById('returnFromInquiryBtn');
        returnBtn?.addEventListener('click', () => {
          closeInquiry();
          location.reload();
        });
        returnBtn?.focus();
      }
    });
  }
}

function showFieldError(inputElement, message) {
  const fieldParent = inputElement.closest('.form-field');
  if (fieldParent) {
    fieldParent.classList.add('has-error');
    let errorMsg = fieldParent.querySelector('.form-error-msg');
    if (!errorMsg) {
      errorMsg = document.createElement('div');
      errorMsg.className = 'form-error-msg';
      fieldParent.appendChild(errorMsg);
    }
    errorMsg.textContent = message;
  }
}

function sendWhatsAppMessage() {
  const name = document.getElementById('inquiryName')?.value.trim() || 'Guest';
  const phone = document.getElementById('inquiryPhone')?.value.trim() || '';
  const date = document.getElementById('inquiryDate')?.value || 'Upcoming Date';
  const location = document.getElementById('inquiryLocation')?.value.trim() || 'Odisha';
  const service = document.getElementById('inquiryService')?.value || 'Wedding Coverage';
  const notes = document.getElementById('inquiryNotes')?.value.trim() || '';

  const message = `Namaste Soulful Stories! 🕊️\n\nI would love to inquire about commissioning your photography & filmmaking for:\n• Couple / Name: ${name}\n• Service: ${service}\n• Date: ${date}\n• Location: ${location}\n• Phone: ${phone}\n\nNotes / Story:\n${notes}\n\nLooking forward to connecting!`;

  const encoded = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/917788847489?text=${encoded}`;
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
}
