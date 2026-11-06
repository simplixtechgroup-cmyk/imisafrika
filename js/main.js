/**
 * IMIS AFRIKA S.A.R.L. : comportements du site (JavaScript sans dépendance)
 * Charte v1.4. Chaque bloc est indépendant et ignoré si la page ne le contient pas.
 */
(function () {
  'use strict';
  var WA = 'https://wa.me/2290153932286?text=';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* 1. En-tête : ombre au défilement, apparition de la pilule d'action */
  var navbar = $('.navbar'), pill = $('.pill');
  function onScroll() {
    var y = window.scrollY || 0;
    if (navbar) navbar.classList.toggle('scrolled', y > 24);
    if (pill) pill.classList.toggle('show', y > 520);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* 2. Menu mobile */
  var burger = $('.burger'), drawer = $('.drawer');
  function closeDrawer() {
    if (!burger || !drawer) return;
    burger.classList.remove('on'); drawer.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false'); document.body.style.overflow = '';
  }
  if (burger && drawer) {
    burger.addEventListener('click', function () {
      var open = burger.classList.toggle('on');
      drawer.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    $$('a', drawer).forEach(function (a) { a.addEventListener('click', closeDrawer); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrawer(); });
    window.addEventListener('resize', function () { if (window.innerWidth > 1020) closeDrawer(); });
  }

  /* 3. Révélation douce au défilement */
  var rv = $$('.rv');
  if ('IntersectionObserver' in window && rv.length) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    rv.forEach(function (el) { io.observe(el); });
  } else { rv.forEach(function (el) { el.classList.add('in'); }); }

  /* 4. Portefeuille : filtres par catégorie et par axe, compteur, paramètres d'URL */
  var cards = $$('.card[data-type]');
  if (cards.length) {
    var tabs = $$('.tab[data-filter]'), axes = $$('.axes button[data-loc]');
    var counter = $('#properties-count'), empty = $('.empty');
    var state = { type: 'all', loc: 'all' };
    var apply = function () {
      var n = 0;
      cards.forEach(function (c) {
        var ok = (state.type === 'all' || c.dataset.type === state.type) && (state.loc === 'all' || c.dataset.loc === state.loc);
        c.classList.toggle('hide', !ok); if (ok) n++;
      });
      tabs.forEach(function (t) { t.classList.toggle('active', t.dataset.filter === state.type); });
      axes.forEach(function (a) { a.classList.toggle('on', a.dataset.loc === state.loc); });
      if (counter) counter.textContent = n;
      if (empty) empty.classList.toggle('show', n === 0);
    };
    tabs.forEach(function (t) { t.addEventListener('click', function () { state.type = t.dataset.filter; apply(); }); });
    axes.forEach(function (a) { a.addEventListener('click', function () { state.loc = state.loc === a.dataset.loc ? 'all' : a.dataset.loc; apply(); }); });
    var q = new URLSearchParams(window.location.search);
    if (q.get('type')) state.type = q.get('type');
    if (q.get('zone')) state.loc = q.get('zone');
    apply();
  }

  /* 5. Observatoire : filtre des articles */
  var arts = $$('[data-category]');
  if (arts.length) {
    var btns = $$('.tab[data-blog-filter]');
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var f = b.dataset.blogFilter;
        btns.forEach(function (x) { x.classList.toggle('active', x === b); });
        arts.forEach(function (a) { a.classList.toggle('hide', !(f === 'all' || a.dataset.category === f)); });
      });
    });
  }

  /* 6. Contact : message WhatsApp adapté au pôle choisi */
  var subject = $('#form-subject'), dyn = $('#dynamic-whatsapp-btn');
  var texts = {
    foncier: "je souhaite un audit juridique ou l'acquisition d'une parcelle titrée.",
    diaspora: "je réside à l'étranger et je souhaite mandater votre équipe pour la supervision de mes chantiers au Bénin.",
    communication: "je souhaite un accompagnement en marketing digital et en stratégie de marque pour mon entreprise.",
    fund: "je souhaite être accompagné pour préparer le dossier de financement de mon entreprise ou de mon projet (fund dressing).",
    formation: "je souhaite des informations sur vos formations en communication et marketing.",
    autre: "je souhaite un échange direct avec votre desk d'affaires."
  };
  if (subject && dyn) {
    subject.addEventListener('change', function () {
      dyn.href = WA + encodeURIComponent('Bonjour la Direction IMIS AFRIKA, ' + (texts[subject.value] || texts.autre));
    });
  }
  var form = $('#contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
      var label = subject ? subject.options[subject.selectedIndex].text : '';
      var msg = '*Demande via le site IMIS AFRIKA*\n\n' +
        '• *Demandeur :* ' + v('form-name') + '\n' +
        '• *WhatsApp :* ' + v('form-phone') + '\n' +
        '• *Projet :* ' + label + '\n' +
        '• *Précisions :* ' + (v('form-message') || 'Aucune');
      var url = WA + encodeURIComponent(msg), st = $('#form-status');
      var w = window.open(url, '_blank');
      if (w) { try { w.opener = null; } catch (err) {} if (st) st.textContent = 'WhatsApp s’ouvre dans un nouvel onglet : votre message est prérempli, il suffit de l’envoyer.'; }
      else { window.location.href = url; }
    });
  }
})();
