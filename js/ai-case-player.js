/* Case copy from the supplied native Figma document; source node IDs retained. */
window.POLAITU_AI_CASES = [
  {
    "file": "penguin.mp4",
    "previewTitle": "Видео обложка",
    "title": "Видео-обложка для онлайн-магазина",
    "format": "видео-обложка",
    "paragraphs": [
      "Задача: сделать видео для главной страницы интернет-магазина одежды, которое задаёт настроение бренда с первой секунды на сайте.",
      "Что сделали: сгенерировали ролик, в котором пингвин идёт к горе(актуальный на момент выкладки интернет-мем). Персонаж и окружение собраны в ИИ, ролик закольцован под фон обложки."
    ],
    "figma_title": "2001:355",
    "figma_description": "2001:708"
  },
  {
    "file": "papa-paver.mp4",
    "previewTitle": "Papa Paver",
    "title": "Тизер-анонс стримов “Papa Paver”",
    "format": "тизер-анонс",
    "paragraphs": [
      "Задача: анонсировать стримы так, чтобы зритель узнал о них заранее и пришёл в эфир.",
      "Что сделали: собрали тизер с ИИ-графикой и анимацией."
    ],
    "figma_title": "2001:352",
    "figma_description": "2001:709"
  },
  {
    "file": "winged-leopard.mp4",
    "previewTitle": "Миссия единство",
    "title": "Легенда о Крылатом Барсе \"Миссия - Единство\"",
    "format": "анимационный эпизод",
    "paragraphs": [
      "Данный проект представляет собой анимационный контент, созданный с помощью нейросетей для интеграции в постановку «Миссия-единство». Визуальный ряд основан на мифологии и легенде о Крылатом Барсе",
      "Использование генеративного ИИ позволило создать уникальный художественный стиль, сочетающий этнические мотивы с современной цифровой эстетикой. Мультик транслируется на панорамных экранах, создавая эффект полного погружения (иммерсивности) и усиливая драматургический эффект спектакля. Это пример того, как современные технологии работают на стыке театра, анимации и искусственного интеллекта."
    ],
    "figma_title": "2001:359",
    "figma_description": "2001:711"
  },
  {
    "file": "murrmelad.mp4",
    "previewTitle": "Муррмелад",
    "title": "Видео-экскурсия по детскому центру \"Муррмелад\"",
    "format": "видео-экскурсия",
    "paragraphs": [
      "Задача: показать родителям центр до первого визита: какие есть залы, где занимаются дети, как всё выглядит внутри.",
      "Что сделали: провели зрителя по центру с помощью ИИ-анимации"
    ],
    "figma_title": "2001:368",
    "figma_description": "2001:710"
  },
  {
    "file": "double-headed-eagle.mp4",
    "previewTitle": "Миссия единство",
    "title": "Легенда о Двуглавом Орле \"Миссия - Единство\"",
    "format": "анимационный эпизод",
    "paragraphs": [
      "Анимационный эпизод «Легенда о двуглавом орле» создан с помощью нейросетей для спектакля «Миссия-единство». Генеративный ИИ выступил основным инструментом производства: с его помощью создан визуальный ряд мультфильма — от генерации изображений до сборки анимации.",
      "Проект демонстрирует применение ИИ-инструментов в театральном производстве и показывает, как нейросети позволяют создавать анимационный контент для сценических постановок в сжатые сроки и с высоким визуальным качеством."
    ],
    "figma_title": "2001:362",
    "figma_description": "2001:712"
  },
  {
    "file": "mission.mp4",
    "previewTitle": "Миссия единство",
    "title": "Тизер к интерактивному спектаклю \"Миссия - Единство\"",
    "format": "тизер спектакля",
    "paragraphs": [
      "Тизер к спектаклю «Миссия-единство» создан с использованием хромакея: актёры постановки снимались на зелёном фоне, а окружающая среда и эффекты космической тематики были сгенерированы нейросетями. ИИ выступил инструментом постпродакшена — с его помощью созданы фоны, свечения, частицы и другие визуальные элементы.",
      "Проект демонстрирует, как генеративные технологии позволяют объединить живую игру актёров с цифровой средой и создать атмосферный промо-материал для театральной постановки."
    ],
    "figma_title": "2001:365",
    "figma_description": "2001:713"
  }
];
(function () {
  'use strict';
  var dialog = document.getElementById('aiCaseDialog');
  if (!dialog) return;
  var video = dialog.querySelector('video');
  var play = dialog.querySelector('[data-ai-case-play]');
  var close = dialog.querySelector('[data-ai-case-close]');
  var fullscreen = dialog.querySelector('[data-ai-case-fullscreen]');
  var previousFocus, previousBodyOverflow, previousRootOverflow;
  var fullscreenTimer;
  var fullscreenWasActive = false, lastFullscreenExit = -1000;
  function collapseInPage() {
    dialog.classList.remove('is-expanded');
    video.controls = false;
    fullscreen.setAttribute('aria-label', 'На весь экран');
    syncControls();
  }
  function expandInPage() {
    if (!dialog.open) return;
    dialog.classList.add('is-expanded');
    video.controls = true;
    fullscreen.setAttribute('aria-label', 'Свернуть видео');
    syncControls();
  }
  function syncControls() {
    var playing = !video.paused && !video.ended;
    var nativeScreen = !!document.fullscreenElement || !!video.webkitDisplayingFullscreen || dialog.classList.contains('is-expanded');
    play.hidden = playing || nativeScreen;
    video.parentElement.classList.toggle('is-playing', playing);
    fullscreen.hidden = nativeScreen;
  }
  function start() {
    video.defaultMuted = false; video.removeAttribute('muted'); video.muted = false;
    video.controls = false;
    video.play().then(syncControls).catch(syncControls);
  }
  function open(card) {
    clearPreview();
    var item = window.POLAITU_AI_CASES.find(function (entry) { return card.dataset.videoSource.endsWith(entry.file); });
    if (!item) return;
    previousFocus = card;
    previousBodyOverflow = document.body.style.overflow;
    previousRootOverflow = document.documentElement.style.overflow;
    dialog.querySelector('#aiCaseTitle').textContent = item.title;
    dialog.querySelector('#aiCaseFormat').textContent = 'формат: ' + item.format;
    var description = dialog.querySelector('#aiCaseDescription');
    description.replaceChildren();
    item.paragraphs.forEach(function (text) {
      var paragraph = document.createElement('p'); paragraph.textContent = text; description.appendChild(paragraph);
    });
    video.parentElement.style.setProperty('--ai-video-ratio', '1.7777777778');
    video.poster = card.querySelector('img').getAttribute('src');
    video.src = card.dataset.videoSource + '?v=20261126-audio';
    video.controls = false; video.defaultMuted = false; video.removeAttribute('muted'); video.muted = false; video.volume = 1;
    if (document.fullscreenElement) document.exitFullscreen().catch(function () {});
    document.querySelectorAll('video').forEach(function (other) { if (other !== video) other.pause(); });
    document.body.style.overflow = 'hidden'; document.documentElement.style.overflow = 'hidden';
    document.body.classList.add('ai-case-open');
    syncControls(); dialog.showModal();
    dialog.querySelector('.video-popup__content').scrollTop = 0;
    close.focus({ preventScroll: true });
  }
  var touchLike = window.matchMedia('(hover: none), (pointer: coarse)');
  var activePreview = null;
  function clearPreview() {
    if (activePreview) activePreview.classList.remove('is-preview-active');
    activePreview = null;
  }
  document.addEventListener('click', function (event) {
    if (!event.target.closest('.ai-project')) clearPreview();
  });
  window.addEventListener('resize', function () { if (!touchLike.matches) clearPreview(); });
  document.querySelectorAll('.ai-project[data-video-source]').forEach(function (card) {
    var item = window.POLAITU_AI_CASES.find(function (entry) { return card.dataset.videoSource.endsWith(entry.file); });
    card.setAttribute('role', 'button'); card.tabIndex = 0;
    card.setAttribute('aria-haspopup', 'dialog'); card.setAttribute('aria-controls', 'aiCaseDialog');
    card.setAttribute('aria-label', 'Открыть ролик: ' + (item ? item.title : card.dataset.aiTitle));
    var overlay = document.createElement('span'); overlay.className = 'ai-project__overlay'; overlay.setAttribute('aria-hidden', 'true');
    var caption = document.createElement('span'); caption.className = 'ai-project__caption';
    caption.textContent = item ? (item.previewTitle || item.title) : card.dataset.aiTitle;
    overlay.appendChild(caption); card.appendChild(overlay);
    card.addEventListener('click', function (event) {
      if ((event.pointerType === 'touch' || touchLike.matches) && activePreview !== card) {
        clearPreview(); activePreview = card; card.classList.add('is-preview-active'); return;
      }
      clearPreview(); open(card);
    });
    card.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(card); }
    });
  });
  close.addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('click', function (event) { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', function () {
    clearTimeout(fullscreenTimer); collapseInPage();
    video.pause(); video.removeAttribute('src'); video.load(); video.controls = false;
    document.body.style.overflow = previousBodyOverflow; document.documentElement.style.overflow = previousRootOverflow;
    document.body.classList.remove('ai-case-open');
    if (previousFocus) previousFocus.focus({ preventScroll: true });
    var hero = document.querySelector('[data-ai-hero-video]');
    if (hero && !document.hidden && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      var rect = hero.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) hero.play().catch(function () {});
    }
  });
  video.addEventListener('loadedmetadata', function () {
    if (video.videoWidth && video.videoHeight) video.parentElement.style.setProperty('--ai-video-ratio', video.videoWidth / video.videoHeight);
  });
  play.addEventListener('click', start);
  video.addEventListener('click', function (event) {
    if (video.controls) return;
    if (video.paused) start(); else video.pause();
  });
  ['play','pause','ended'].forEach(function (name) { video.addEventListener(name, syncControls); });
  fullscreen.addEventListener('click', function () {
    if (dialog.classList.contains('is-expanded')) { collapseInPage(); return; }
    if (document.fullscreenElement) { document.exitFullscreen().catch(function () {}); return; }
    if (video.paused) start();
    video.controls = true;
    // Embedded browsers can refuse native fullscreen; still fill their viewport.
    clearTimeout(fullscreenTimer);
    fullscreenTimer = setTimeout(function () {
      if (!document.fullscreenElement && !video.webkitDisplayingFullscreen) expandInPage();
    }, 400);
    if (video.requestFullscreen) {
      video.requestFullscreen().catch(expandInPage);
    } else if (video.webkitEnterFullscreen) {
      try { video.webkitEnterFullscreen(); } catch (error) { expandInPage(); }
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    } else expandInPage();
  });
  document.addEventListener('fullscreenchange', function () {
    var active = !!document.fullscreenElement;
    if (!active && fullscreenWasActive) lastFullscreenExit = performance.now();
    fullscreenWasActive = active;
    video.controls = !!document.fullscreenElement || dialog.classList.contains('is-expanded');
    syncControls();
  });
  video.addEventListener('webkitbeginfullscreen', function () { fullscreenWasActive = true; video.controls = true; syncControls(); });
  video.addEventListener('webkitendfullscreen', function () { fullscreenWasActive = false; lastFullscreenExit = performance.now(); video.controls = dialog.classList.contains('is-expanded'); syncControls(); });
  dialog.addEventListener('cancel', function (event) {
    if (fullscreenWasActive || performance.now() - lastFullscreenExit < 300) { event.preventDefault(); return; }
    if (dialog.classList.contains('is-expanded')) { event.preventDefault(); collapseInPage(); }
  });
  document.addEventListener('visibilitychange', function () { if (document.hidden) video.pause(); });
})();
