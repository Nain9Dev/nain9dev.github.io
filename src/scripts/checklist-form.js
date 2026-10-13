import { message, isEnglish } from './locale.js';

// Submission feedback for the MailerLite checklist form.
document.addEventListener('astro:page-load', () => {
  const form = document.querySelector('.form-container .ml-block-form');
  if (form && !form.dataset.feedbackBound) {
    form.dataset.feedbackBound = 'true';
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const feedback = form.querySelector('.form-feedback');
      const actionUrl = form.getAttribute('action');

      if (btn) {
        btn.textContent = message('formSending');
        btn.style.opacity = '0.7';
        btn.disabled = true;
      }

      if (feedback) {
        feedback.style.display = 'none';
      }

      const formData = new FormData(form);

      fetch(actionUrl, {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
      })
      .then(() => {
        if (btn) {
          btn.textContent = message('formSent');
          btn.style.background = '#4ade80';
        }
        if (feedback) {
          feedback.style.display = 'block';
          feedback.style.color = '#15803d';
          feedback.style.backgroundColor = '#dcfce7';
          feedback.textContent = message('formInbox');
        }
        if (window.ml_webform_success) {
          window.ml_webform_success();
        }
      })
      .catch(() => {
        if (btn) {
          btn.textContent = message('formDownload');
          btn.style.opacity = '1';
          btn.disabled = false;
        }
        if (feedback) {
          feedback.style.display = 'block';
          feedback.style.color = '#b91c1c';
          feedback.style.backgroundColor = '#fee2e2';
          feedback.textContent = message('formError');
        }
      });
    });
  }
});

// UTM field, A/B variant tracking and ad-blocker fallback for the checklist page.
document.addEventListener('astro:page-load', () => {
  // Populate dynamic UTM field
  const utmContentField = document.getElementById('utm-content-field');
  if (!utmContentField) return;
  if (utmContentField) utmContentField.value = window.location.pathname;

  // --- A/B Testing Logic ---
  const urlParams = new URLSearchParams(window.location.search);
  const variant = urlParams.get('variant') || 'a';

  if (variant === 'b') {
    const ctaTitle = document.querySelector('.form-container h3');
    if (ctaTitle) ctaTitle.textContent = message('formFreeChecklist');

    // Track variant impression
    if (window.plausible) {
      window.plausible('AB_Test_View', { props: { variant: 'B_Obtener' } });
    }
  } else {
    if (window.plausible) {
      window.plausible('AB_Test_View', { props: { variant: 'A_Descargar' } });
    }
  }
  // --------------------------

  // Global callback triggered by MailerLite upon successful submission
  window.ml_webform_success = function() {
    if (window.plausible) {
      window.plausible('Lead_Magnet_Download', { props: { source: 'checklist', variant: variant } });
    }
    // Redirect to thank-you page if not handled natively by provider
    window.location.href = isEnglish() ? '/en/resources/gracias/' : '/recursos/gracias/';
  };

  // Ad-blocker detection fallback for embedded form
  setTimeout(() => {
    const mlForm = document.querySelector('.ml-subscribe-form');
    // If container is missing or collapsed (zero height)
    if (!mlForm || mlForm.clientHeight === 0 || window.getComputedStyle(mlForm).display === 'none') {
      const fallback = document.getElementById('mailerlite-fallback');
      if (fallback) fallback.style.display = 'block';
    }
  }, 3500);
});
