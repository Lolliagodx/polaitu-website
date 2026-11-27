(function () {
  'use strict';
  // Key out only the flat #101010 matte, preserving the original icon colours.
  var svgNS = 'http://www.w3.org/2000/svg';
  var iconFilters = document.createElementNS(svgNS, 'svg');
  iconFilters.setAttribute('width', '0'); iconFilters.setAttribute('height', '0');
  iconFilters.setAttribute('aria-hidden', 'true'); iconFilters.style.position = 'absolute';
  var alphaTable = Array.from({length:256}, function (_, i) { return i === 16 ? '0' : '1'; }).join(' ');
  var channelMasks = ['R','G','B'].map(function (channel,index) {
    var row = [0,0,0,0,0]; row[index] = 1;
    return '<feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 ' + row.join(' ') + '" result="channel' + channel + '"/>' +
      '<feComponentTransfer in="channel' + channel + '" result="not' + channel + '"><feFuncA type="discrete" tableValues="' + alphaTable + '"/></feComponentTransfer>';
  }).join('');
  iconFilters.innerHTML = '<defs><filter id="polaituContactMatte" color-interpolation-filters="sRGB">' + channelMasks +
    '<feComposite in="notR" in2="notG" operator="arithmetic" k2="1" k3="1" result="rg"/>' +
    '<feComposite in="rg" in2="notB" operator="arithmetic" k2="1" k3="1" result="keep"/>' +
    '<feComposite in="SourceGraphic" in2="keep" operator="in"/></filter></defs>';
  document.body.appendChild(iconFilters);
  var header = document.querySelector('.site-header');
  function syncHeaderBacking() { if (header) header.classList.toggle('site-header--scrolled', window.scrollY > 10); }
  syncHeaderBacking();
  window.addEventListener('scroll', syncHeaderBacking, { passive:true });
  window.addEventListener('pageshow', syncHeaderBacking);
  var nav = document.getElementById('mobileNav');
  var burger = document.getElementById('burgerBtn');
  var closeButton = document.getElementById('mobileNavClose');
  var savedScroll = null;
  var inertBefore = [];
  var lastPopup = null;
  var dropdowns = [
    [document.getElementById('improveMenuBtn'), document.getElementById('improveDropdown'), 'improve-dropdown--active'],
    [document.getElementById('contactsMenuBtn'), document.getElementById('contactsDropdown'), 'contacts-dropdown--active']
  ].filter(function (pair) { return pair[0] && pair[1]; });
  function closeDropdowns(focus) {
    dropdowns.forEach(function (pair) {
      if (focus && pair[1].classList.contains(pair[2])) pair[0].focus();
      pair[1].classList.remove(pair[2]);
    });
  }
  dropdowns.forEach(function (pair) {
    var trigger = pair[0], panel = pair[1];
    trigger.setAttribute('role', 'button');
    trigger.setAttribute('aria-controls', panel.id);
    trigger.setAttribute('aria-haspopup', 'true');
    function sync() {
      var open = panel.classList.contains(pair[2]);
      trigger.setAttribute('aria-expanded', String(open));
      panel.setAttribute('aria-hidden', String(!open));
      panel.inert = !open;
    }
    new MutationObserver(sync).observe(panel, { attributes: true, attributeFilter: ['class'] });
    sync();
    trigger.addEventListener('click', function () {
      dropdowns.forEach(function (other) { if (other !== pair) other[1].classList.remove(other[2]); });
    });
    trigger.addEventListener('keydown', function (event) {
      if (event.key === ' ') { event.preventDefault(); trigger.click(); }
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        if (!panel.classList.contains(pair[2])) trigger.click();
        sync();
        var links = panel.querySelectorAll('a[href]');
        if (links.length) links[event.key === 'ArrowUp' ? links.length - 1 : 0].focus();
      }
    });
  });
  function closeNav(restoreFocus) {
    if (!nav || !nav.classList.contains('mobile-nav--active')) return;
    nav.classList.remove('mobile-nav--active'); nav.inert = true;
    document.body.classList.remove('site-nav-open');
    inertBefore.forEach(function (entry) { entry[0].inert = entry[1]; }); inertBefore = [];
    nav.setAttribute('aria-hidden', 'true'); burger.setAttribute('aria-expanded', 'false');
    if (savedScroll) { document.body.style.overflow = savedScroll[0]; document.documentElement.style.overflow = savedScroll[1]; savedScroll = null; }
    if (restoreFocus !== false) burger.focus({ preventScroll: true });
  }
  if (nav && burger && closeButton) {
    nav.inert = true; nav.setAttribute('aria-hidden', 'true');
    nav.setAttribute('role', 'dialog'); nav.setAttribute('aria-modal', 'true');
    burger.setAttribute('aria-controls', nav.id); burger.setAttribute('aria-expanded', 'false');
    burger.addEventListener('click', function () {
      if (nav.classList.contains('mobile-nav--active')) { closeNav(); return; }
      savedScroll = [document.body.style.overflow, document.documentElement.style.overflow];
      document.body.style.overflow = 'hidden'; document.documentElement.style.overflow = 'hidden';
      nav.inert = false; nav.setAttribute('aria-hidden', 'false'); nav.classList.add('mobile-nav--active');
      document.body.classList.add('site-nav-open');
      inertBefore = Array.prototype.map.call(document.querySelectorAll('.page > :not(#mobileNav)'), function (element) { var previous = element.inert; element.inert = true; return [element,previous]; });
      burger.setAttribute('aria-expanded', 'true');
      requestAnimationFrame(function () { if (nav.classList.contains('mobile-nav--active')) closeButton.focus({ preventScroll: true }); });
    });
    closeButton.addEventListener('click', function () { closeNav(); });
    nav.addEventListener('click', function (event) { if (event.target === nav) closeNav(); });
    var cta = document.getElementById('mobileNavCta');
    if (cta) cta.addEventListener('click', function () { closeNav(false); var trigger = document.querySelector('[data-popup-target="calcPopup"]'); if (trigger) trigger.click(); });
    var audit = document.getElementById('mobileNavAuditCta');
    if (audit) audit.addEventListener('click', function (event) { event.preventDefault(); closeNav(false); location.href = './polaitu-checklist.html'; });
    nav.querySelectorAll('a[href]').forEach(function (link) { link.addEventListener('click', function () { closeNav(false); }); });
  }
  document.addEventListener('keydown', function (event) {
    if (nav && nav.classList.contains('mobile-nav--active')) {
      if (event.key === 'Escape') { event.preventDefault(); closeNav(); return; }
      if (event.key === 'Tab') {
        var items = Array.prototype.filter.call(nav.querySelectorAll('a[href],button'), function (el) { return el.getClientRects().length && !el.disabled; });
        var first = items[0], last = items[items.length - 1];
        if (!nav.contains(document.activeElement)) { event.preventDefault(); (event.shiftKey ? last : first).focus(); }
        else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    } else if (event.key === 'Escape') {
      if (lastPopup && !document.fullscreenElement && lastPopup.panel.classList.contains(lastPopup.base + '--active')) {
        var closer = lastPopup.panel.querySelector('[class*="__close"]');
        if (closer) { closer.click(); if (lastPopup.trigger.getClientRects().length) lastPopup.trigger.focus({preventScroll:true}); }
      } else closeDropdowns(true);
    }
  });
  window.addEventListener('resize', function () { if (innerWidth >= 1318) closeNav(false); }, { passive: true });

  document.querySelectorAll('.company-faq-question').forEach(function (question, index) {
    var answer = question.nextElementSibling;
    if (!answer) return;
    answer.id = answer.id || 'companyFaqAnswer' + (index + 1);
    question.setAttribute('role', 'button'); question.tabIndex = 0;
    question.setAttribute('aria-controls', answer.id);
    function sync() { var open = question.classList.contains('open'); question.setAttribute('aria-expanded', String(open)); answer.setAttribute('aria-hidden', String(!open)); answer.inert = !open; }
    new MutationObserver(sync).observe(question, { attributes:true, attributeFilter:['class'] }); sync();
    question.addEventListener('keydown', function (event) { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); question.click(); } });
  });

  // Keep hidden case media and PDF documents off the critical loading path.
  function hydrate(scope) {
    var videos = new Set();
    scope.querySelectorAll('source[data-deferred-src]').forEach(function (source) { source.src = source.dataset.deferredSrc; source.removeAttribute('data-deferred-src'); if (source.parentElement.tagName === 'VIDEO') videos.add(source.parentElement); });
    scope.querySelectorAll('iframe[data-deferred-src]').forEach(function (frame) { frame.src = frame.dataset.deferredSrc; frame.removeAttribute('data-deferred-src'); });
    videos.forEach(function (video) { video.load(); });
  }
  document.addEventListener('click', function (event) {
    var trigger = event.target.closest('[data-popup-target]');
    if (trigger) { var popup = document.getElementById(trigger.dataset.popupTarget); if (popup) { hydrate(popup); lastPopup = {panel:popup,trigger:trigger,base:popup.classList[0]}; } }
  }, true);
  if ('IntersectionObserver' in window) {
    var loader = new IntersectionObserver(function (entries) { entries.forEach(function (entry) { if (entry.isIntersecting) { hydrate(entry.target); loader.unobserve(entry.target); } }); }, { rootMargin: '250px' });
    document.querySelectorAll('video[data-deferred-video]').forEach(function (video) { loader.observe(video); });
    var playback = new IntersectionObserver(function (entries) { entries.forEach(function (entry) { var video = entry.target; video.dataset.siteInView = String(entry.isIntersecting); if (entry.isIntersecting && !document.hidden) video.play().catch(function () {}); else video.pause(); }); });
    var videos = document.querySelectorAll('video[autoplay]:not(.smm-inline-video):not([data-smm-hero-video])');
    videos.forEach(function (video) { playback.observe(video); });
    document.addEventListener('visibilitychange', function () { videos.forEach(function (video) { if (!document.hidden && video.dataset.siteInView === 'true') video.play().catch(function () {}); else video.pause(); }); });
  } else document.querySelectorAll('video[data-deferred-video]').forEach(hydrate);
})();
