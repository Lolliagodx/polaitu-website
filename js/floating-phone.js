(function () {
  var PHONE_NUMBER = '+7 (843) 233-50-07';
  var PHONE_LINK = 'tel:+78432335007';
  var BUTTON_IMAGE = 'https://cdn.полайту.com/webvideo/КНОПКА ТЕЛЕФОН.png';
  var ROOT_ID = 'floatingPhoneWidget';
  var STYLE_ID = 'floatingPhoneWidgetStyles';

  if (document.getElementById(ROOT_ID)) return;

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      '.floating-phone-widget {',
      '  position: fixed;',
      '  right: 22px;',
      '  bottom: 58px;',
      '  z-index: 5200;',
      '  display: flex;',
      '  align-items: center;',
      '  gap: 14px;',
      '  pointer-events: none;',
      '}',
      '.floating-phone-widget__panel {',
      '  display: flex;',
      '  align-items: center;',
      '  gap: 10px;',
      '  min-height: 58px;',
      '  padding: 12px 18px;',
      '  border-radius: 18px;',
      '  background: rgba(10, 10, 10, 0.88);',
      '  border: 1px solid rgba(255, 168, 0, 0.28);',
      '  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.34);',
      '  backdrop-filter: blur(16px);',
      '  -webkit-backdrop-filter: blur(16px);',
      '  color: #ffffff;',
      '  opacity: 0;',
      '  visibility: hidden;',
      '  transform: translateX(18px) scale(0.96);',
      '  transform-origin: right center;',
      '  transition: opacity 0.26s ease, transform 0.26s ease, visibility 0.26s ease;',
      '  pointer-events: none;',
      '}',
      '.floating-phone-widget--open .floating-phone-widget__panel {',
      '  opacity: 1;',
      '  visibility: visible;',
      '  transform: translateX(0) scale(1);',
      '  pointer-events: auto;',
      '}',
      '.floating-phone-widget__panel-label {',
      '  display: block;',
      '  margin: 0 0 4px;',
      '  font-family: "Inter", "Segoe UI", sans-serif;',
      '  font-size: 11px;',
      '  line-height: 1.2;',
      '  letter-spacing: 0.08em;',
      '  text-transform: uppercase;',
      '  color: rgba(255, 255, 255, 0.56);',
      '}',
      '.floating-phone-widget__panel-link {',
      '  color: #ffffff;',
      '  text-decoration: none;',
      '  font-family: "Bounded", "Segoe UI", sans-serif;',
      '  font-size: 17px;',
      '  line-height: 1.2;',
      '  white-space: nowrap;',
      '}',
      '.floating-phone-widget__panel-link:hover {',
      '  color: #ffa800;',
      '}',
      '.floating-phone-widget__button {',
      '  pointer-events: auto;',
      '  position: relative;',
      '  display: inline-flex;',
      '  align-items: center;',
      '  justify-content: center;',
      '  width: 94px;',
      '  height: 94px;',
      '  padding: 0;',
      '  border: 0;',
      '  background: transparent;',
      '  cursor: pointer;',
      '  isolation: isolate;',
      '  animation: floating-phone-glow 6.2s ease-in-out infinite;',
      '}',
      '.floating-phone-widget__button::before {',
      '  content: "";',
      '  position: absolute;',
      '  inset: 10px;',
      '  border-radius: 50%;',
      '  background: radial-gradient(circle, rgba(255, 168, 0, 0.52) 0%, rgba(255, 168, 0, 0.18) 48%, rgba(255, 168, 0, 0) 76%);',
      '  opacity: 0;',
      '  transform: scale(0.9);',
      '  z-index: -1;',
      '  animation: floating-phone-pulse 6.2s ease-in-out infinite;',
      '}',
      '.floating-phone-widget__button:focus-visible {',
      '  outline: 2px solid rgba(255, 168, 0, 0.95);',
      '  outline-offset: 4px;',
      '}',
      '.floating-phone-widget__image {',
      '  width: 100%;',
      '  height: 100%;',
      '  display: block;',
      '  object-fit: contain;',
      '  filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.34));',
      '  transition: transform 0.25s ease, filter 0.25s ease;',
      '  animation: floating-phone-ring 6.2s ease-in-out infinite;',
      '}',
      '.floating-phone-widget__button:hover .floating-phone-widget__image,',
      '.floating-phone-widget__button:focus-visible .floating-phone-widget__image {',
      '  transform: scale(1.03);',
      '}',
      '.floating-phone-widget--ring-soft .floating-phone-widget__image {',
      '  animation-duration: 18s;',
      '}',
      '@keyframes floating-phone-pulse {',
      '  0%, 58%, 100% { opacity: 0; transform: scale(0.9); }',
      '  7% { opacity: 1; transform: scale(1.03); }',
      '  14% { opacity: 0.34; transform: scale(1.16); }',
      '  22% { opacity: 0; transform: scale(1.28); }',
      '  68% { opacity: 0.86; transform: scale(1.01); }',
      '  76% { opacity: 0.24; transform: scale(1.15); }',
      '  84% { opacity: 0; transform: scale(1.24); }',
      '}',
      '@keyframes floating-phone-glow {',
      '  0%, 58%, 100% { filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.34)); }',
      '  8% { filter: drop-shadow(0 0 0 rgba(255, 168, 0, 0)) drop-shadow(0 0 22px rgba(255, 168, 0, 0.48)); }',
      '  16% { filter: drop-shadow(0 0 0 rgba(255, 168, 0, 0)) drop-shadow(0 0 34px rgba(255, 168, 0, 0.28)); }',
      '  24% { filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.34)); }',
      '  69% { filter: drop-shadow(0 0 0 rgba(255, 168, 0, 0)) drop-shadow(0 0 18px rgba(255, 168, 0, 0.42)); }',
      '  78% { filter: drop-shadow(0 0 0 rgba(255, 168, 0, 0)) drop-shadow(0 0 30px rgba(255, 168, 0, 0.22)); }',
      '  86% { filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.34)); }',
      '}',
      '@keyframes floating-phone-ring {',
      '  0%, 6%, 24%, 58%, 67%, 86%, 100% { transform: translate3d(0, 0, 0) rotate(0deg) scale(1); }',
      '  8% { transform: translate3d(-1px, 0, 0) rotate(-5deg) scale(1.01); }',
      '  10% { transform: translate3d(2px, 0, 0) rotate(5deg) scale(1.01); }',
      '  12% { transform: translate3d(-2px, 0, 0) rotate(-4deg) scale(1.01); }',
      '  14% { transform: translate3d(2px, 0, 0) rotate(4deg) scale(1.01); }',
      '  16% { transform: translate3d(-1px, 0, 0) rotate(-3deg) scale(1); }',
      '  18% { transform: translate3d(1px, 0, 0) rotate(2deg) scale(1); }',
      '  69% { transform: translate3d(-1px, 0, 0) rotate(-4deg) scale(1.01); }',
      '  72% { transform: translate3d(2px, 0, 0) rotate(4deg) scale(1.01); }',
      '  75% { transform: translate3d(-2px, 0, 0) rotate(-3deg) scale(1.01); }',
      '  78% { transform: translate3d(1px, 0, 0) rotate(3deg) scale(1.01); }',
      '  81% { transform: translate3d(-1px, 0, 0) rotate(-2deg) scale(1); }',
      '}',
      '@media (max-width: 768px) {',
      '  .floating-phone-widget {',
      '    right: 16px;',
      '    bottom: 72px;',
      '    gap: 10px;',
      '  }',
      '  .floating-phone-widget__button {',
      '    width: 68px;',
      '    height: 68px;',
      '  }',
      '  .floating-phone-widget__panel {',
      '    min-height: 52px;',
      '    padding: 10px 14px;',
      '    border-radius: 16px;',
      '    max-width: calc(100vw - 108px);',
      '  }',
      '  .floating-phone-widget__panel-link {',
      '    font-size: 15px;',
      '  }',
      '}'
    ].join('');

    document.head.appendChild(style);
  }

  function buildWidget() {
    var root = document.createElement('div');
    root.id = ROOT_ID;
    root.className = 'floating-phone-widget';
    root.innerHTML = [
      '<div class="floating-phone-widget__panel" aria-hidden="true">',
      '  <div class="floating-phone-widget__panel-copy">',
      '    <span class="floating-phone-widget__panel-label">Телефон</span>',
      '    <a class="floating-phone-widget__panel-link" href="' + PHONE_LINK + '">' + PHONE_NUMBER + '</a>',
      '  </div>',
      '</div>',
      '<button class="floating-phone-widget__button" type="button" aria-expanded="false" aria-label="Показать номер телефона">',
      '  <img class="floating-phone-widget__image" src="' + BUTTON_IMAGE + '" alt="Кнопка телефона" />',
      '</button>'
    ].join('');

    var button = root.querySelector('.floating-phone-widget__button');
    var panel = root.querySelector('.floating-phone-widget__panel');
    var ringSoftened = false;

    function setOpen(nextValue) {
      root.classList.toggle('floating-phone-widget--open', nextValue);
      button.setAttribute('aria-expanded', nextValue ? 'true' : 'false');
      panel.setAttribute('aria-hidden', nextValue ? 'false' : 'true');
    }

    button.addEventListener('click', function (event) {
      event.stopPropagation();
      if (!ringSoftened) {
        ringSoftened = true;
        root.classList.add('floating-phone-widget--ring-soft');
      }
      setOpen(!root.classList.contains('floating-phone-widget--open'));
    });

    panel.addEventListener('click', function (event) {
      event.stopPropagation();
    });

    document.addEventListener('click', function (event) {
      if (!root.contains(event.target)) {
        setOpen(false);
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    });

    document.body.appendChild(root);
  }

  function init() {
    injectStyles();
    buildWidget();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
