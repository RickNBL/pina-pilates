/*
 * Studio Pina Pilates — experiência interativa
 * JavaScript puro + Bootstrap. Efeitos editoriais de entrada e revelação
 * inspirados por referências de movimento do catálogo Originkit.dev.
 * Sem dependências de autenticação, APIs ou coleta de dados.
 */
(() => {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const whatsapp = (text) => `https://wa.me/5511976102680?text=${encodeURIComponent(text)}`;

  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Barra de leitura e cabeçalho compacto.
  const header = $('#siteHeader');
  const progressBar = $('#scrollProgress');
  let scrollTicking = false;
  function onScroll() {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      const top = window.scrollY || document.documentElement.scrollTop;
      header?.classList.toggle('scrolled', top > 32);
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      if (progressBar) progressBar.style.width = `${Math.min(100, top / max * 100)}%`;
      scrollTicking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  // Menu responsivo com Escape e estados acessíveis.
  const mobileToggle = $('#menuToggle');
  const mobileMenu = $('#mobileMenu');
  function setMobileMenu(open) {
    if (!mobileToggle || !mobileMenu) return;
    mobileMenu.classList.toggle('open', open);
    mobileToggle.setAttribute('aria-expanded', String(open));
    mobileToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    mobileToggle.querySelector('i').className = open ? 'bi bi-x-lg' : 'bi bi-list';
    mobileMenu.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('menu-open', open);
    if (open) mobileMenu.querySelector('a')?.focus();
  }
  mobileToggle?.addEventListener('click', () => setMobileMenu(mobileToggle.getAttribute('aria-expanded') !== 'true'));
  $$('.mobile-menu a').forEach(link => link.addEventListener('click', () => setMobileMenu(false)));
  window.addEventListener('resize', () => { if (window.innerWidth > 991) setMobileMenu(false); }, { passive: true });

  // Entrada progressiva no scroll: IntersectionObserver para performance.
  const reveals = $$('.reveal');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.095, rootMargin: '0px 0px -38px 0px' });
    reveals.forEach(el => revealObserver.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  // Fallback gracioso caso alguma fotografia externa esteja indisponível.
  $$('img[src^="http"]').forEach(image => {
    const useBrandFallback = () => {
      image.classList.add('photo-unavailable');
      image.src = 'assets/img/simbolo-pina.png';
      const galleryItem = image.closest('.gallery-item');
      if (galleryItem) galleryItem.dataset.image = 'assets/img/logo-pina.png';
    };
    image.addEventListener('error', useBrandFallback, { once: true });
    if (image.complete && image.naturalWidth === 0) useBrandFallback();
  });

  // Movimento magnético discreto em desktop (não altera navegação nem clique).
  if (!reduceMotion && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    $$('.magnetic').forEach(button => {
      button.addEventListener('pointermove', (event) => {
        const rect = button.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - .5) * 9;
        const y = ((event.clientY - rect.top) / rect.height - .5) * 9;
        button.style.transform = `translate(${x}px, ${y}px)`;
      });
      button.addEventListener('pointerleave', () => { button.style.transform = ''; });
    });
    const heroImage = $('.hero .hero-photo');
    heroImage?.closest('.hero-image-wrap')?.addEventListener('pointermove', (event) => {
      const box = event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - .5;
      const y = (event.clientY - box.top) / box.height - .5;
      heroImage.style.transform = `translate3d(${x * 12}px, ${y * 10}px, 0) scale(1.025)`;
    });
    heroImage?.closest('.hero-image-wrap')?.addEventListener('pointerleave', () => { heroImage.style.transform = ''; });
  }

  // Chat rápido pelo WhatsApp: opções que realmente abrem conversas.
  const waButton = $('#whatsappToggle');
  const waPanel = $('#whatsappPop');
  function toggleWhatsApp(force) {
    if (!waButton || !waPanel) return;
    const open = typeof force === 'boolean' ? force : !waPanel.classList.contains('open');
    waPanel.classList.toggle('open', open);
    waPanel.setAttribute('aria-hidden', String(!open));
    waButton.setAttribute('aria-expanded', String(open));
    waButton.setAttribute('aria-label', open ? 'Fechar opções de WhatsApp' : 'Abrir opções de WhatsApp');
    waButton.querySelector('i').className = open ? 'bi bi-x-lg' : 'bi bi-whatsapp';
  }
  waButton?.addEventListener('click', () => toggleWhatsApp());
  document.addEventListener('pointerdown', (event) => {
    if (waPanel?.classList.contains('open') && !event.target.closest('.whatsapp-fab-wrap')) toggleWhatsApp(false);
  });
  $$('.wa-option').forEach(link => link.addEventListener('click', () => toggleWhatsApp(false)));

  // Mini-guia de objetivos na home: resultado e mensagem mudam ao clicar.
  const goals = {
    postura: { title: 'Um corpo mais alinhado, uma vida mais leve.', text: 'Com movimentos conscientes e exercícios personalizados, você pode trabalhar sua percepção corporal e o alinhamento postural.', wa: 'Olá! Quero experimentar o pilates e trabalhar minha postura. Podemos conversar sobre a aula gratuita?' },
    forca: { title: 'Mais força para tudo o que faz parte do seu dia.', text: 'O Pilates combina estabilidade e fortalecimento do centro do corpo com movimentos progressivos, respeitando o seu ritmo.', wa: 'Olá! Quero experimentar o pilates com foco em força e estabilidade. Como agendo a aula gratuita?' },
    mobilidade: { title: 'Mais liberdade para se mover do seu jeito.', text: 'Uma prática que valoriza mobilidade, controle e flexibilidade para que cada movimento aconteça com mais naturalidade.', wa: 'Olá! Tenho interesse no pilates para trabalhar mobilidade e flexibilidade. Quero agendar uma aula gratuita.' },
    equilibrio: { title: 'Um convite para desacelerar e se reconectar.', text: 'Encontre um momento de presença e atenção à respiração, ao corpo e à qualidade dos seus movimentos.', wa: 'Olá! Busco mais equilíbrio e bem-estar com o pilates. Podemos conversar sobre a aula gratuita?' }
  };
  const goalTitle = $('#goalTitle');
  const goalText = $('#goalText');
  const goalLink = $('#goalLink');
  $$('.goal-pill').forEach(button => button.addEventListener('click', () => {
    const content = goals[button.dataset.goal];
    if (!content || !goalTitle || !goalText || !goalLink) return;
    $$('.goal-pill').forEach(other => {
      const selected = other === button;
      other.classList.toggle('is-selected', selected);
      other.setAttribute('aria-pressed', String(selected));
    });
    const card = $('#goalResult');
    card?.classList.add('goal-changing');
    goalTitle.textContent = content.title;
    goalText.textContent = content.text;
    goalLink.href = whatsapp(content.wa);
    setTimeout(() => card?.classList.remove('goal-changing'), 220);
  }));

  // Filtros das modalidades, com estado aria-pressed.
  $$('.filter-btn').forEach(button => button.addEventListener('click', () => {
    const selected = button.dataset.filter;
    $$('.filter-btn').forEach(other => {
      const active = other === button;
      other.classList.toggle('active', active);
      other.setAttribute('aria-pressed', String(active));
    });
    $$('.format-grid-item').forEach(item => {
      item.querySelector('.format-card')?.classList.remove('is-hidden');
      item.hidden = selected !== 'todos' && item.dataset.category !== selected;
    });
  }));

  // Galeria com setas e teclado.
  const items = $$('.gallery-item');
  const modal = $('#galleryLightbox');
  const modalImage = $('#lightboxImage');
  let imageIndex = 0;
  let lastFocused = null;
  function showImage(index) {
    if (!items.length || !modalImage) return;
    imageIndex = (index + items.length) % items.length;
    modalImage.src = items[imageIndex].dataset.image;
    modalImage.alt = items[imageIndex].querySelector('img')?.alt || 'Foto do Studio Pina Pilates';
  }
  function closeGallery() {
    if (!modal?.classList.contains('open')) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    lastFocused?.focus();
  }
  items.forEach((item, index) => item.addEventListener('click', () => {
    lastFocused = document.activeElement;
    showImage(index);
    modal?.classList.add('open');
    modal?.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    $('#lightboxClose')?.focus();
  }));
  $('#lightboxClose')?.addEventListener('click', closeGallery);
  $('#lightboxPrev')?.addEventListener('click', () => showImage(imageIndex - 1));
  $('#lightboxNext')?.addEventListener('click', () => showImage(imageIndex + 1));
  let swipeStartX = null;
  modal?.addEventListener('touchstart', event => {
    if (event.touches.length === 1) swipeStartX = event.touches[0].clientX;
  }, { passive: true });
  modal?.addEventListener('touchend', event => {
    if (swipeStartX === null || !event.changedTouches.length) return;
    const distance = event.changedTouches[0].clientX - swipeStartX;
    swipeStartX = null;
    if (Math.abs(distance) > 55) showImage(imageIndex + (distance < 0 ? 1 : -1));
  }, { passive: true });
  modal?.addEventListener('click', e => { if (e.target === modal) closeGallery(); });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeGallery(); toggleWhatsApp(false); setMobileMenu(false); }
    if (modal?.classList.contains('open')) {
      if (e.key === 'ArrowRight') showImage(imageIndex+1);
      if (e.key === 'ArrowLeft') showImage(imageIndex-1);
      // Keep focus inside the dialog while it is open.
      if (e.key === 'Tab') {
        const controls = $$('.gallery-lightbox button');
        if (!controls.length) return;
        const focusIndex = controls.indexOf(document.activeElement);
        e.preventDefault();
        controls[(focusIndex + (e.shiftKey ? controls.length-1 : 1)) % controls.length].focus();
      }
    }
  });

  // Experiência respiratória com duração real de 30s.
  const breathButton = $('#breathToggle');
  const breathOrb = $('#breathOrb');
  const breathStatus = $('#breathStatus');
  let breathTimer = null;
  let breathFinish = null;
  let breathStarted = 0;
  function stopBreath(done = false) {
    clearInterval(breathTimer);
    clearTimeout(breathFinish);
    breathTimer = null;
    breathFinish = null;
    breathOrb?.classList.remove('inhale','exhale');
    if (breathStatus) breathStatus.textContent = done ? 'Pausa concluída. Volte quando quiser.' : 'Uma pausa no seu ritmo';
    if (breathButton) breathButton.innerHTML = '<i class="bi bi-play-fill"></i> Começar pausa';
  }
  breathButton?.addEventListener('click', () => {
    if (breathTimer) { stopBreath(false); return; }
    breathStarted = Date.now();
    if (breathButton) breathButton.innerHTML = '<i class="bi bi-pause-fill"></i> Encerrar pausa';
    const tick = () => {
      const seconds = (Date.now() - breathStarted) / 1000;
      if (seconds >= 30) { stopBreath(true); return; }
      const inhale = Math.floor(seconds / 4) % 2 === 0;
      breathOrb?.classList.toggle('inhale', inhale);
      breathOrb?.classList.toggle('exhale', !inhale);
      if (breathOrb) breathOrb.textContent = inhale ? 'inspire' : 'solte';
      if (breathStatus) breathStatus.textContent = `${inhale ? 'Inspire com leveza' : 'Solte o ar devagar'} · ${Math.ceil(30-seconds)}s`;
    };
    tick();
    breathTimer = setInterval(tick, 200);
    breathFinish = setTimeout(() => stopBreath(true), 30_000);
  });

  // Navegação para âncoras com cabeçalho fixo.
  if (location.hash) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const target = document.getElementById(decodeURIComponent(location.hash.substring(1)));
        target?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      }, reduceMotion ? 50 : 180);
    }, { once:true });
  }
})();
