// Contact & Bespoke Inquiry Modal Handler

export function initContact() {
  const inquiryModal = document.getElementById('inquiryModal');
  const openInquiryBtns = document.querySelectorAll('.open-inquiry-trigger');
  const closeInquiryBtn = document.getElementById('closeInquiryBtn');
  const inquiryForm = document.getElementById('inquiryForm');
  const whatsappSendBtn = document.getElementById('whatsappSendBtn');
  const dateInput = document.getElementById('inquiryDate');

  if (dateInput) {
    dateInput.min = new Date().toISOString().split('T')[0];
  }

  // Open triggers
  openInquiryBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (inquiryModal) {
        inquiryModal.showModal();
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close triggers
  if (closeInquiryBtn && inquiryModal) {
    closeInquiryBtn.addEventListener('click', () => {
      inquiryModal.close();
      document.body.style.overflow = '';
    });

    inquiryModal.addEventListener('click', (e) => {
      if (e.target === inquiryModal) {
        inquiryModal.close();
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && inquiryModal.open) {
        inquiryModal.close();
        document.body.style.overflow = '';
      }
    });
  }

  // WhatsApp Direct Sync
  if (whatsappSendBtn) {
    whatsappSendBtn.addEventListener('click', (e) => {
      e.preventDefault();
      sendWhatsAppMessage();
    });
  }

  // Form Submit
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formCard = inquiryModal.querySelector('.modal-inquiry-card');
      if (formCard) {
        formCard.innerHTML = `
          <div style="text-align: center; padding: 3rem 1rem;">
            <span class="eyebrow" style="justify-content: center; margin-bottom: 1.5rem;">Commission Received</span>
            <h2 style="font-family: var(--font-serif); font-size: 2.5rem; margin-bottom: 1rem;">
              Thank You for Your Trust.
            </h2>
            <p style="color: var(--color-text-secondary); max-width: 480px; margin: 0 auto 2.5rem auto; line-height: 1.7;">
              Mithun Kumar and our creative production team review every wedding commission personally. We will be in touch within 24–48 hours with our bespoke availability and investment guide.
            </p>
            <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
              <button class="btn-editorial-primary" onclick="document.getElementById('inquiryModal').close(); location.reload();">
                RETURN TO JOURNAL
              </button>
            </div>
          </div>
        `;
      }
    });
  }
}

function sendWhatsAppMessage() {
  const name = document.getElementById('inquiryName')?.value || 'Guest';
  const phone = document.getElementById('inquiryPhone')?.value || '';
  const date = document.getElementById('inquiryDate')?.value || 'Upcoming Date';
  const location = document.getElementById('inquiryLocation')?.value || 'Odisha';
  const service = document.getElementById('inquiryService')?.value || 'Wedding Coverage';
  const notes = document.getElementById('inquiryNotes')?.value || '';

  const message = `Namaste Soulful Stories! 🕊️\n\nI would love to inquire about commissioning your photography & filmmaking for:\n• Couple / Name: ${name}\n• Service: ${service}\n• Date: ${date}\n• Location: ${location}\n• Phone: ${phone}\n\nNotes / Story:\n${notes}\n\nLooking forward to hearing from you!`;

  // Encoded URL for WhatsApp (target studio phone)
  const encoded = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/919437000000?text=${encoded}`;
  window.open(whatsappUrl, '_blank');
}
