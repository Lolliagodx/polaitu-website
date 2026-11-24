(function () {
  'use strict';
  if (!document.body.matches('.smm-page, .ai-page')) return;
  var hover = window.matchMedia('(hover: hover) and (pointer: fine)');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var resets = [];
  document.querySelectorAll('.smm-stat, .smm-review__quote, .ai-service, .ai-tool').forEach(function (card) {
    card.classList.add('site-motion-card');
    var rect = null, frame = 0, point = null;
    // Use the original perspective and shimmer, with a gentler angle for long reviews.
    var maxTilt = card.matches('.smm-review__quote') ? 5 : 12;
    function reset() {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0; rect = null; point = null;
      card.classList.remove('is-motion-active');
      ['--motion-x', '--motion-y', '--glare-x'].forEach(function (name) { card.style.removeProperty(name); });
    }
    function enabled(event) { return hover.matches && !reduced.matches && event.pointerType !== 'touch'; }
    card.addEventListener('pointerenter', function (event) {
      if (enabled(event)) rect = card.getBoundingClientRect();
    });
    card.addEventListener('pointermove', function (event) {
      if (!enabled(event)) return;
      if (!rect) rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      point = { x: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)), y: Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)) };
      if (frame) return;
      frame = window.requestAnimationFrame(function () {
        frame = 0;
        card.style.setProperty('--motion-x', ((point.y - .5) * -2 * maxTilt).toFixed(2) + 'deg');
        card.style.setProperty('--motion-y', ((point.x - .5) * 2 * maxTilt).toFixed(2) + 'deg');
        card.style.setProperty('--glare-x', point.x.toFixed(3));
        card.classList.add('is-motion-active');
      });
    }, { passive: true });
    card.addEventListener('pointerleave', reset);
    card.addEventListener('pointercancel', reset);
    resets.push(reset);
  });
  function resetAll() { resets.forEach(function (reset) { reset(); }); }
  [hover, reduced].forEach(function (query) {
    if (query.addEventListener) query.addEventListener('change', resetAll);
    else query.addListener(resetAll);
  });
  window.addEventListener('blur', resetAll);
  window.addEventListener('resize', resetAll, { passive: true });
  window.addEventListener('scroll', resetAll, { passive: true, capture: true });
  // Animate each decorative image independently, only while it is on screen.
  var decorations = document.querySelectorAll('.smm-decor, .ai-decor');
  if (decorations.length) {
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) { entry.target.classList.toggle('is-decor-visible', entry.isIntersecting); });
      });
      decorations.forEach(function (decoration) { observer.observe(decoration); });
    } else decorations.forEach(function (decoration) { decoration.classList.add('is-decor-visible'); });
    function pauseHiddenPage() { document.documentElement.classList.toggle('site-decor-paused', document.hidden); }
    document.addEventListener('visibilitychange', pauseHiddenPage);
    pauseHiddenPage();
  }
})();
