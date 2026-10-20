/**
 * IMIS AFRIKA S.A.R.L. — CORE DYNAMIC ENGINE
 * Version: 2.0 (Production Modular)
 */

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================================
     1. GESTION DU HEADER STICKY & RÉDUCTION AU SCROLL
     ========================================================================= */
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }, { passive: true });


  /* =========================================================================
     2. MENU BURGER MOBILE & NAVIGATION DRAWER
     ========================================================================= */
  const burgerBtn = document.querySelector('.burger-btn');
  const mobileDrawer = document.querySelector('.mobile-drawer');

  if (burgerBtn && mobileDrawer) {
    burgerBtn.addEventListener('click', () => {
      const isOpen = burgerBtn.classList.toggle('is-active');
      mobileDrawer.classList.toggle('is-open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Fermer le menu lors du clic sur un lien
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burgerBtn.classList.remove('is-active');
        mobileDrawer.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }


  /* =========================================================================
     3. OPTIMISATION VIDÉO HERO (INTERSECTION OBSERVER)
     Met en pause la vidéo hors de l'écran pour économiser la data 4G & batterie
     ========================================================================= */
  const heroVideo = document.getElementById('hero-video-player');
  if (heroVideo && 'IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          heroVideo.play().catch(() => {});
        } else {
          heroVideo.pause();
        }
      });
    }, { threshold: 0.1 });
    videoObserver.observe(heroVideo);
  }


  /* =========================================================================
     4. FILTRAGE DYNAMIQUE DES ACTIFS IMMOBILIERS (Sur biens-terrains.html)
     ========================================================================= */
  const filterTabs = document.querySelectorAll('.tab-btn');
  const propertyCards = document.querySelectorAll('.property-card');
  const counterSpan = document.getElementById('properties-count');

  if (filterTabs.length > 0 && propertyCards.length > 0) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const category = tab.dataset.filter;
        let count = 0;

        propertyCards.forEach(card => {
          const cardType = card.dataset.type;
          if (category === 'all' || cardType === category) {
            card.style.display = 'flex';
            count++;
          } else {
            card.style.display = 'none';
          }
        });

        if (counterSpan) counterSpan.innerText = count;
      });
    });
  }


  /* =========================================================================
     5. GESTION DES MODALES INTERACTIVES (DOSSIER & VISITE)
     ========================================================================= */
  const modalOverlay = document.getElementById('modal-booking');
  const modalTriggers = document.querySelectorAll('[data-open-modal]');
  const modalCloses = document.querySelectorAll('[data-close-modal]');

  if (modalOverlay) {
    modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const propertyRef = trigger.dataset.ref || 'Général';
        const modalRefInput = document.getElementById('modal-property-ref');
        if (modalRefInput) modalRefInput.value = propertyRef;
        modalOverlay.classList.add('is-active');
      });
    });

    modalCloses.forEach(btn => {
      btn.addEventListener('click', () => modalOverlay.classList.remove('is-active'));
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove('is-active');
    });
  }


  /* =========================================================================
     6. ROUTEUR WHATSAPP DYNAMIQUE & SÉCURISÉ (Sur contact.html & widgets)
     ========================================================================= */
  const subjectSelect = document.getElementById('form-subject');
  const dynamicWhatsappBtn = document.getElementById('dynamic-whatsapp-btn');

  if (subjectSelect && dynamicWhatsappBtn) {
    subjectSelect.addEventListener('change', () => {
      const subject = subjectSelect.value;
      let text = "Bonjour la Direction IMIS AFRIKA, ";

      switch (subject) {
        case 'foncier':
          text += "je souhaite un audit juridique ou une acquisition de parcelle titrée.";
          break;
        case 'diaspora':
          text += "je réside à l'étranger et je souhaite mandater votre équipe pour la surveillance/gestion de mes chantiers au Bénin.";
          break;
        case 'communication':
          text += "je souhaite cadrer une stratégie de marque et une campagne de valorisation pour mon entreprise.";
          break;
        default:
          text += "je souhaite un échange direct avec votre desk d'affaires.";
      }

      dynamicWhatsappBtn.href = `https://wa.me/2290153932286?text=${encodeURIComponent(text)}`;
    });
  }

});

/**
 * Traitement du formulaire avec bascule automatique WhatsApp
 */
function handleContactSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('form-name')?.value || '';
  const phone = document.getElementById('form-phone')?.value || '';
  const subject = document.getElementById('form-subject')?.value || '';
  const message = document.getElementById('form-message')?.value || '';

  const formattedMsg = `*Transmission Brief Client — IMIS AFRIKA*\n\n` +
                       `• *Demandeur :* ${name}\n` +
                       `• *Téléphone :* ${phone}\n` +
                       `• *Pôle concerné :* ${subject}\n` +
                       `• *Précisions :* ${message || 'Aucune'}`;

  window.open(`https://wa.me/2290153932286?text=${encodeURIComponent(formattedMsg)}`, '_blank');
}
