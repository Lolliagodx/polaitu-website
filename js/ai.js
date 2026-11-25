(function () {
  'use strict';
  var cards = [];
  var cardStates = new WeakMap();

  function syncCard(state) {
    var video = state.video;
    if (state.wantsPlay && state.inView && !document.hidden) {
      if (!video.getAttribute('src')) video.src = state.source;
      video.play().catch(function () {
        state.wantsPlay = false;
        state.card.classList.remove('is-playing');
      });
    } else {
      video.pause();
      state.card.classList.remove('is-playing');
      video.classList.remove('is-frame-ready');
      if (video.getAttribute('src')) {
        video.removeAttribute('src');
        video.load();
      }
    }
    state.card.setAttribute('aria-pressed', String(state.wantsPlay && state.inView && !document.hidden));
  }

  var observer = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var state = cardStates.get(entry.target);
      if (!state) return;
      state.inView = entry.isIntersecting;
      if (!state.inView) state.wantsPlay = false;
      syncCard(state);
    });
  }, { threshold: 0.05 }) : null;

  document.querySelectorAll('.ai-project[data-video-source]').forEach(function (card) {
    var image = card.querySelector('.ai-project__image');
    var title = card.dataset.aiTitle || 'работа с нейросетями';
    var video = document.createElement('video');
    video.className = 'ai-project__video';
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'none';
    video.poster = image.getAttribute('src');
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('aria-hidden', 'true');
    image.insertAdjacentElement('afterend', video);

    var state = { card: card, video: video, source: card.dataset.videoSource, wantsPlay: false, inView: !observer };
    cardStates.set(card, state);
    cards.push(state);
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', 'Воспроизвести ролик: ' + title);
    card.setAttribute('aria-pressed', 'false');

    function revealFrame() {
      if (!state.wantsPlay || !state.inView || document.hidden) return;
      if (video.requestVideoFrameCallback) {
        video.requestVideoFrameCallback(function () {
          if (!state.wantsPlay) return;
          video.classList.add('is-frame-ready');
          card.classList.add('is-playing');
        });
      } else {
        video.classList.add('is-frame-ready');
        card.classList.add('is-playing');
      }
    }
    video.addEventListener('playing', revealFrame);
    video.addEventListener('error', function () {
      state.wantsPlay = false;
      syncCard(state);
    });
    card.addEventListener('pointerenter', function (event) {
      if (event.pointerType !== 'mouse') return;
      state.wantsPlay = true;
      syncCard(state);
    });
    card.addEventListener('pointerleave', function (event) {
      if (event.pointerType !== 'mouse') return;
      state.wantsPlay = false;
      syncCard(state);
    });
    card.addEventListener('click', function (event) {
      var mouseClick = event.pointerType === 'mouse' || (!event.pointerType && window.matchMedia('(hover: hover) and (pointer: fine)').matches);
      state.wantsPlay = event.detail && mouseClick ? true : !state.wantsPlay;
      syncCard(state);
    });
    card.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      state.wantsPlay = !state.wantsPlay;
      syncCard(state);
    });
    card.addEventListener('blur', function () {
      state.wantsPlay = false;
      syncCard(state);
    });
    if (observer) observer.observe(card);
  });

  document.addEventListener('visibilitychange', function () {
    cards.forEach(syncCard);
  });

  document.querySelectorAll('[data-before-after]').forEach(function (comparison) {
    var range = comparison.querySelector('.ai-before-after__range');
    if (!range) return;
    function update() {
      comparison.style.setProperty('--split', range.value + '%');
    }
    range.addEventListener('input', update);
    range.addEventListener('change', update);
    update();
  });

  var contact = document.getElementById('aiContactForm');
  if (contact) contact.addEventListener('submit', function (event) {
    var submit = document.querySelector('[form="aiContactForm"]');
    if (submit && submit.disabled) { event.preventDefault(); event.stopImmediatePropagation(); }
  }, true);
})();
