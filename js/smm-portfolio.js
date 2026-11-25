(function () {
  'use strict';
  var cases = window.POLAITU_SMM_CASES || [];
  cases.forEach(function (entry) {
    var root = document.querySelector('[data-smm-case="' + entry.id + '"]');
    if (!root || !entry.slides || !entry.slides.length) return;
    var controls = root.querySelector('[data-case-controls]');
    var poster = root.querySelector('[data-case-poster]');
    var current = 0;
    var buttons = [];
    if (entry.slides.length > 1) {
      controls.setAttribute('role', 'group');
      controls.setAttribute('aria-label', 'Слайды кейса');
    }
    function show(index) {
      current = (index + entry.slides.length) % entry.slides.length;
      var slide = entry.slides[current];
      root.querySelector('[data-case-title]').innerHTML = slide.titleHTML || entry.titleHTML;
      root.querySelector('[data-case-logo]').src = slide.logo || entry.logo;
      root.querySelector('[data-case-goal]').innerHTML = slide.goalHTML || entry.goalHTML;
      poster.querySelector('img').src = slide.poster;
      poster.dataset.smmPreview = slide.poster;
      poster.dataset.videoSource = slide.video || '';
      poster.dataset.sourceUrl = slide.sourceUrl || '';
      poster.dataset.previewTitle = (slide.titleHTML || entry.titleHTML).replace(/<br\s*\/?\s*>/gi, ' ').replace(/<[^>]*>/g, '') + (slide.videoTitle ? ' — ' + slide.videoTitle : '');
      poster.setAttribute('aria-label', 'Смотреть видео: ' + poster.dataset.previewTitle);
      poster.querySelector('img').alt = 'Кадр из работы ' + poster.dataset.previewTitle;
      root.querySelector('[data-case-views]').textContent = slide.views;
      root.querySelector('[data-case-metric-label]').textContent = slide.metricLabel;
      root.querySelector('[data-case-metric-value]').textContent = slide.metricValue;
      var comments = root.querySelector('[data-case-comments]');
      comments.replaceChildren();
      (slide.comments || []).forEach(function (src) {
        var image = document.createElement('img');
        image.className = 'smm-case__comment'; image.src = src; image.alt = 'Комментарий зрителя к работе'; image.loading = 'lazy';
        comments.appendChild(image);
      });
      comments.hidden = !(slide.comments || []).length;
      buttons.forEach(function (button, i) { button.setAttribute('aria-pressed', String(i === current)); });
    }
    if (entry.slides.length > 1) entry.slides.forEach(function (slide, index) {
      var button = document.createElement('button');
      button.type = 'button'; button.className = 'smm-case__dot';
      button.setAttribute('aria-label', 'Слайд ' + (index + 1) + ' из ' + entry.slides.length);
      button.addEventListener('click', function () { show(index); button.focus({ preventScroll: true }); });
      controls.appendChild(button); buttons.push(button);
    });
    root.addEventListener('keydown', function (event) {
      if (entry.slides.length < 2) return;
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault(); show(current + (event.key === 'ArrowRight' ? 1 : -1));
    });
    var touchStart = null;
    if (entry.slides.length > 1) poster.style.touchAction = 'pan-y';
    poster.addEventListener('pointerdown', function (event) { if (entry.slides.length > 1) touchStart = { x: event.clientX, y: event.clientY }; });
    poster.addEventListener('pointerup', function (event) {
      if (!touchStart) return;
      var dx = event.clientX - touchStart.x, dy = event.clientY - touchStart.y; touchStart = null;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
        poster.dataset.skipPreview = 'true'; show(current + (dx < 0 ? 1 : -1));
        setTimeout(function () { delete poster.dataset.skipPreview; }, 400);
      }
    });
    poster.addEventListener('pointercancel', function () { touchStart = null; });
    show(0);
  });
  var dialog = document.getElementById('smmPreview');
  if (dialog) {
    var image = dialog.querySelector('[data-smm-preview-image]');
    var video = dialog.querySelector('[data-smm-preview-video]');
    var title = dialog.querySelector('[data-smm-preview-title]');
    var sourceLink = dialog.querySelector('[data-smm-preview-source]');
    var status = dialog.querySelector('[data-smm-preview-status]');
    var previousOverflow = '';
    document.querySelectorAll('[data-smm-preview]').forEach(function (button) {
      button.addEventListener('click', function () {
        if (button.dataset.skipPreview) { delete button.dataset.skipPreview; return; }
        image.src = button.dataset.smmPreview; image.alt = button.dataset.previewTitle;
        title.textContent = button.dataset.previewTitle;
        var source = button.dataset.videoSource;
        sourceLink.hidden = !button.dataset.sourceUrl;
        if (button.dataset.sourceUrl) sourceLink.href = button.dataset.sourceUrl;
        else sourceLink.removeAttribute('href');
        status.hidden = true;
        image.hidden = Boolean(source); video.hidden = !source;
        if (source) { video.src = source; video.poster = button.dataset.smmPreview; }
        previousOverflow = document.documentElement.style.overflow;
        document.documentElement.style.overflow = 'hidden'; dialog.showModal();
        if (source) video.play().catch(function () {
          if (video.error || !dialog.open) return;
          status.textContent = 'Нажмите ▶ в плеере, чтобы запустить видео.';
          status.hidden = false;
        });
      });
    });
    video.addEventListener('error', function () {
      if (!video.getAttribute('src')) return;
      image.hidden = false; video.hidden = true;
      status.textContent = 'Не удалось загрузить видео. Попробуйте открыть его ещё раз.';
      status.hidden = false;
    });
    video.addEventListener('playing', function () { status.hidden = true; });
    dialog.querySelector('[data-smm-preview-close]').addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('click', function (event) { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('close', function () { video.pause(); video.removeAttribute('src'); video.load(); document.documentElement.style.overflow = previousOverflow; });
  }
  var contact = document.getElementById('smmContactForm');
  if (contact) contact.addEventListener('submit', function (event) {
    var submit = document.querySelector('[form="smmContactForm"]');
    if (submit && submit.disabled) { event.preventDefault(); event.stopImmediatePropagation(); }
  }, true);
  var hero = document.querySelector('[data-smm-hero-video]');
  if (hero) {
    hero.addEventListener('error', function () { hero.classList.add('is-unavailable'); });
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) hero.pause();
    else if ('IntersectionObserver' in window) new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) hero.play().catch(function () {}); else hero.pause();
    }).observe(hero);
  }
})();
