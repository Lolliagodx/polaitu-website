(function () {
  'use strict';
  var mediaCards = new Set();
  var mediaStates = new WeakMap();
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  function syncVideo(state) {
    var video = state.video;
    if (!video) return;
    if (state.wantsPlay && state.inView && !document.hidden) {
      if (!video.getAttribute('src')) video.src = state.source;
      if (video.paused) video.play().catch(function () {
        if (state.video === video) state.card.classList.remove('is-playing');
      });
    } else {
      video.pause();
      state.card.classList.remove('is-playing');
      // A paused hover preview must not keep a download/connection open offscreen.
      if (video.getAttribute('src')) {
        if (video._readyFrame && video.cancelVideoFrameCallback) video.cancelVideoFrameCallback(video._readyFrame);
        video._readyFrame = null; video.classList.remove('is-frame-ready');
        video.removeAttribute('src'); video.load();
      }
    }
    state.card.setAttribute('aria-pressed', String(state.wantsPlay && state.inView && !document.hidden));
  }
  var mediaObserver = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var state = mediaStates.get(entry.target);
      state.inView = entry.isIntersecting;
      if (!state.inView) state.wantsPlay = false;
      syncVideo(state);
    });
  }, { threshold: 0.01 }) : null;
  function prepareCard(card) {
    var state = mediaStates.get(card);
    if (state) return state;
    var image = card.querySelector('img');
    state = { card: card, imageTemplate: image.cloneNode(), wantsPlay: false,
      inView: !mediaObserver, layers: [], revision: 0, suppressClickUntil: 0 };
    image.remove();
    mediaStates.set(card, state); mediaCards.add(state);
    card.setAttribute('role', 'button'); card.tabIndex = 0;
    card.setAttribute('aria-pressed', 'false');
    card.addEventListener('pointerenter', function (event) {
      if (event.pointerType !== 'mouse') return;
      state.wantsPlay = true; syncVideo(state);
    });
    card.addEventListener('pointerleave', function (event) {
      if (event.pointerType !== 'mouse') return;
      state.wantsPlay = false; syncVideo(state);
    });
    card.addEventListener('click', function (event) {
      if (event.target.closest('a') || performance.now() < state.suppressClickUntil) return;
      // A mouse click keeps the hover preview running; touch and keyboard toggle it.
      var mouseClick = event.pointerType === 'mouse' || (!event.pointerType && window.matchMedia('(hover: hover) and (pointer: fine)').matches);
      state.wantsPlay = event.detail && mouseClick ? true : !state.wantsPlay;
      syncVideo(state);
    });
    card.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault(); state.wantsPlay = !state.wantsPlay; syncVideo(state);
    });
    card.addEventListener('blur', function () { state.wantsPlay = false; syncVideo(state); });
    if (mediaObserver) mediaObserver.observe(card);
    return state;
  }
  function setInlineVideo(card, source, poster, title) {
    var state = prepareCard(card);
    var revision = ++state.revision;
    // During rapid clicks retain a fully visible layer, not a still-loading cover.
    var previous = state.layers.slice().reverse().find(function (layer) {
      return layer.classList.contains('is-current') && Number(getComputedStyle(layer).opacity) > .99;
    }) || state.layers[0];
    if (previous && card.classList.contains('is-playing')) previous.classList.add('is-outgoing-playing');
    function release(layer) {
      var oldVideo = layer.querySelector('video');
      if (oldVideo) { oldVideo.pause(); oldVideo.removeAttribute('src'); oldVideo.load(); }
      layer.remove();
    }
    // Only the outgoing and incoming media layers may exist during a crossfade.
    if (state.fadeTimer) clearTimeout(state.fadeTimer);
    state.layers.filter(function (layer) { return layer !== previous; }).forEach(release);
    state.layers = previous ? [previous] : [];
    if (state.video) {
      state.video.pause();
      if (state.video._readyFrame) state.video.cancelVideoFrameCallback(state.video._readyFrame);
    }
    var layer = document.createElement('span'); layer.className = 'smm-media-layer';
    var image = state.imageTemplate.cloneNode();
    image.src = poster; image.alt = 'Кадр из работы ' + title;
    if (previous) image.loading = 'eager';
    layer.appendChild(image); card.appendChild(layer); state.layers.push(layer);
    state.video = null; state.source = source; state.wantsPlay = false;
    card.classList.remove('is-playing');
    card.setAttribute('aria-label', 'Воспроизвести ролик: ' + title);
    card.setAttribute('aria-pressed', 'false');
    if (source) {
      var video = document.createElement('video');
      video.className = 'smm-inline-video';
      video.setAttribute('aria-hidden', 'true');
      video.muted = true; video.defaultMuted = true; video.loop = true; video.playsInline = true;
      video.setAttribute('muted', ''); video.setAttribute('playsinline', ''); video.preload = 'none';
      function showFrame() {
        if (state.video !== video || video.readyState < 2) return;
        if (video.requestVideoFrameCallback) {
          if (video._readyFrame) video.cancelVideoFrameCallback(video._readyFrame);
          video._readyFrame = video.requestVideoFrameCallback(function () {
            if (state.video === video && state.wantsPlay) {
              video.classList.add('is-frame-ready'); card.classList.add('is-playing');
            }
            video._readyFrame = null;
          });
        } else video.classList.add('is-frame-ready');
      }
      video.addEventListener('playing', function () {
        if (state.video !== video) return;
        if (!state.wantsPlay || !state.inView || document.hidden) { syncVideo(state); return; }
        if (!video.requestVideoFrameCallback) card.classList.add('is-playing');
        showFrame();
      });
      video.addEventListener('error', function () {
        if (state.video !== video) return;
        state.wantsPlay = false; card.classList.remove('is-playing'); card.setAttribute('aria-pressed', 'false');
      });
      video.poster = poster; layer.appendChild(video); state.video = video;
    }
    function reveal() {
      if (revision !== state.revision) return;
      requestAnimationFrame(function () {
        if (revision !== state.revision) return;
        layer.classList.add('is-current');
        state.fadeTimer = setTimeout(function () {
          if (revision !== state.revision) return;
          state.layers.filter(function (old) { return old !== layer; }).forEach(release);
          state.layers = [layer];
        }, reducedMotion.matches ? 0 : 480);
      });
    }
    if (!previous || reducedMotion.matches) { layer.classList.add('is-current'); reveal(); }
    else if (image.decode) image.decode().then(reveal, reveal);
    else if (image.complete) reveal();
    else { image.addEventListener('load', reveal, { once: true }); image.addEventListener('error', reveal, { once: true }); }
    if (card.matches(':hover') && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      state.wantsPlay = true; syncVideo(state);
    }
  }
  document.addEventListener('visibilitychange', function () { mediaCards.forEach(syncVideo); });
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
    var initialized = false;
    var buttons = [];
    if (entry.slides.length > 1) {
      controls.setAttribute('role', 'group');
      controls.setAttribute('aria-label', 'Слайды кейса');
    }
    function show(index) {
      var next = (index + entry.slides.length) % entry.slides.length;
      if (initialized && next === current) return;
      current = next;
      var slide = entry.slides[current];
      root.querySelector('[data-case-title]').innerHTML = slide.titleHTML || entry.titleHTML;
      root.querySelector('[data-case-logo]').src = slide.logo || entry.logo;
      root.querySelector('[data-case-goal]').innerHTML = slide.goalHTML || entry.goalHTML;
      poster.dataset.videoSource = slide.video || '';
      poster.dataset.sourceUrl = slide.sourceUrl || '';
      poster.dataset.previewTitle = (slide.titleHTML || entry.titleHTML).replace(/<br\s*\/?\s*>/gi, ' ').replace(/<[^>]*>/g, '') + (slide.videoTitle ? ' — ' + slide.videoTitle : '');
      poster.setAttribute('aria-label', poster.dataset.previewTitle);
      setInlineVideo(poster, slide.video, slide.poster, poster.dataset.previewTitle);
      var sourceLink = root.querySelector('[data-case-source]');
      if (!sourceLink) { sourceLink = document.createElement('a'); sourceLink.dataset.caseSource = ''; sourceLink.className = 'smm-case__source'; sourceLink.target = '_blank'; sourceLink.rel = 'noopener noreferrer'; poster.appendChild(sourceLink); }
      sourceLink.hidden = !slide.sourceUrl;
      if (slide.sourceUrl) { sourceLink.href = slide.sourceUrl; sourceLink.textContent = 'Оригинал ролика в VK ↗'; } else sourceLink.removeAttribute('href');
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
      if (initialized && !reducedMotion.matches) {
        root.querySelectorAll('[data-case-title],[data-case-goal],.smm-case__metrics').forEach(function (element) {
          if (element._slideAnimation) element._slideAnimation.cancel();
          if (element.animate) element._slideAnimation = element.animate([
            { opacity: 0 }, { opacity: 1 }
          ], { duration: 360, easing: 'ease-out' });
        });
      }
      initialized = true;
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
        mediaStates.get(poster).suppressClickUntil = performance.now() + 500;
        show(current + (dx < 0 ? 1 : -1));
      }
    });
    poster.addEventListener('pointercancel', function () { touchStart = null; });
    show(0);
    // Reserve the tallest title/intro at the current width, including after fonts load.
    // A longer brand name must never move the video frame or the slide controls.
    function reserveHeadingSpace() {
      ['heading', 'goal'].forEach(function (part) {
        var original = root.querySelector('.smm-case__' + part);
        var probe = original.cloneNode(true);
        probe.removeAttribute('id'); probe.setAttribute('aria-hidden', 'true'); probe.inert = true;
        probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;top:0;left:0;width:' + root.clientWidth + 'px;';
        probe.querySelectorAll('[id]').forEach(function (element) { element.removeAttribute('id'); });
        root.appendChild(probe);
        var height = 0;
        entry.slides.forEach(function (slide) {
          if (part === 'heading') probe.querySelector('[data-case-title]').innerHTML = slide.titleHTML || entry.titleHTML;
          else probe.innerHTML = slide.goalHTML || entry.goalHTML;
          height = Math.max(height, probe.getBoundingClientRect().height);
        });
        probe.remove(); original.style.minHeight = Math.ceil(height) + 'px';
      });
    }
    reserveHeadingSpace();
    if (document.fonts) document.fonts.ready.then(reserveHeadingSpace);
    if ('ResizeObserver' in window) {
      var previousWidth = root.clientWidth;
      new ResizeObserver(function () {
        if (root.clientWidth !== previousWidth) { previousWidth = root.clientWidth; reserveHeadingSpace(); }
      }).observe(root);
    } else window.addEventListener('resize', reserveHeadingSpace);
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
