(function () {
  'use strict';

  var hero = document.querySelector('[data-ai-hero-video]');
  if (hero) {
    function revealHero() { hero.classList.add('is-playing'); }
    hero.addEventListener('playing', revealHero);
    hero.addEventListener('error', function () { hero.classList.add('is-unavailable'); });
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      hero.pause();
      hero.classList.add('is-static');
    } else if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting && !document.body.classList.contains('ai-case-open')) hero.play().then(revealHero).catch(function () {});
        else hero.pause();
      }, { threshold: 0.01 }).observe(hero);
    } else hero.play().then(revealHero).catch(function () {});
  }

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
