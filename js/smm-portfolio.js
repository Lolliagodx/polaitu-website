(function () {
  'use strict';
  var observedVideos = new Set();
  var inView = new WeakSet();
  function syncVideo(video) {
    if (!video.hidden && !document.hidden && inView.has(video)) {
      if (!video.getAttribute('src') && video.dataset.inlineSource) video.src = video.dataset.inlineSource;
      video.play().catch(function () {});
    } else video.pause();
  }
  var mediaObserver = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) inView.add(entry.target); else inView.delete(entry.target);
      syncVideo(entry.target);
    });
  }, { threshold: 0.01 }) : null;
  function setInlineVideo(card, source, poster, title) {
    var image = card.querySelector('img');
    var video = card.querySelector('video');
    if (!source) {
      if (video) { video.pause(); video.removeAttribute('src'); video.load(); video.hidden = true; }
      image.hidden = false; return;
    }
    if (!video) {
      video = document.createElement('video');
      video.className = 'smm-inline-video';
      video.setAttribute('aria-hidden', 'true');
      video.autoplay = true; video.muted = true; video.defaultMuted = true; video.loop = true; video.playsInline = true;
      video.setAttribute('muted', ''); video.setAttribute('playsinline', ''); video.preload = 'none';
      function showFrame() {
        if (video.readyState < 2 || video.hidden) return;
        if (video.requestVideoFrameCallback) {
          if (video._readyFrame) video.cancelVideoFrameCallback(video._readyFrame);
          video._readyFrame = video.requestVideoFrameCallback(function () { video.classList.add('is-frame-ready'); video._readyFrame = null; });
        } else video.classList.add('is-frame-ready');
      }
      video.addEventListener('loadeddata', showFrame);
      video.addEventListener('playing', showFrame);
      video.addEventListener('error', function () { if (video.getAttribute('src')) { video.classList.remove('is-frame-ready'); video.hidden = true; image.hidden = false; } });
      card.appendChild(video); observedVideos.add(video);
      if (mediaObserver) mediaObserver.observe(video); else inView.add(video);
    }
    video.setAttribute('aria-label', title); video.poster = poster;
    video.hidden = false; image.hidden = false;
    if (video.dataset.inlineSource !== source) {
      if (video._readyFrame && video.cancelVideoFrameCallback) video.cancelVideoFrameCallback(video._readyFrame);
      video._readyFrame = null; video.classList.remove('is-frame-ready');
      video.pause(); video.removeAttribute('src'); video.load(); video.dataset.inlineSource = source;
    }
    syncVideo(video);
  }
  document.addEventListener('visibilitychange', function () { observedVideos.forEach(syncVideo); });
  document.querySelectorAll('.smm-gallery__item[data-video-source]').forEach(function (card) {
    setInlineVideo(card, card.dataset.videoSource, card.querySelector('img').getAttribute('src'), card.dataset.previewTitle);
  });
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
      poster.dataset.videoSource = slide.video || '';
      poster.dataset.sourceUrl = slide.sourceUrl || '';
      poster.dataset.previewTitle = (slide.titleHTML || entry.titleHTML).replace(/<br\s*\/?\s*>/gi, ' ').replace(/<[^>]*>/g, '') + (slide.videoTitle ? ' — ' + slide.videoTitle : '');
      poster.setAttribute('aria-label', poster.dataset.previewTitle);
      setInlineVideo(poster, slide.video, slide.poster, poster.dataset.previewTitle);
      var sourceLink = root.querySelector('[data-case-source]');
      if (!sourceLink) { sourceLink = document.createElement('a'); sourceLink.dataset.caseSource = ''; sourceLink.className = 'smm-case__source'; sourceLink.target = '_blank'; sourceLink.rel = 'noopener noreferrer'; poster.appendChild(sourceLink); }
      sourceLink.hidden = !slide.sourceUrl;
      if (slide.sourceUrl) { sourceLink.href = slide.sourceUrl; sourceLink.textContent = 'Оригинал ролика в VK ↗'; } else sourceLink.removeAttribute('href');
      poster.querySelector('img').alt = 'Кадр из работы ' + poster.dataset.previewTitle;
      root.querySelector('[data-case-views]').textContent = slide.views;
      root.querySelector('[data-case-metric-label]').textContent = slide.metricLabel;
      root.querySelector('[data-case-metric-value]').textContent = slide.metricValue;
      var comments = root.querySelector('[data-case-comments]');
      comments.replaceChildren();
      (slide.comments || []).forEach(function (src) {
        var image = document.createElement('img');
        image.className = 'smm-case__comment'; image.src = src; image.alt = 'Комментарий зрителя к работе'; image.loading = 'lazy';
        var wrapper = document.createElement('div'); wrapper.className = 'smm-comment'; wrapper.appendChild(image); comments.appendChild(wrapper);
      });
      comments.hidden = !(slide.comments || []).length;
      comments.dispatchEvent(new CustomEvent('smm:comments-changed', { bubbles: true }));
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
        show(current + (dx < 0 ? 1 : -1));
      }
    });
    poster.addEventListener('pointercancel', function () { touchStart = null; });
    show(0);
  });
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
