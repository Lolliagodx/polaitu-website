(function () {
  'use strict';
  var preview = document.getElementById('aiPreview');
  if (!preview) return;
  var image = preview.querySelector('[data-ai-preview-image]');
  var title = preview.querySelector('[data-ai-preview-title]');
  var previousOverflow = '';
  var contact = document.getElementById('aiContactForm');
  if (contact) contact.addEventListener('submit', function (event) {
    var submit = document.querySelector('[form="aiContactForm"]');
    if (submit && submit.disabled) { event.preventDefault(); event.stopImmediatePropagation(); }
  }, true);
  document.querySelectorAll('[data-ai-preview]').forEach(function (button) {
    button.addEventListener('click', function () {
      image.src = button.getAttribute('data-ai-preview');
      image.alt = button.getAttribute('data-ai-title');
      title.textContent = button.getAttribute('data-ai-title');
      previousOverflow = document.documentElement.style.overflow;
      document.documentElement.style.overflow = 'hidden';
      preview.showModal();
    });
  });
  preview.querySelector('[data-ai-preview-close]').addEventListener('click', function () { preview.close(); });
  preview.addEventListener('click', function (event) { if (event.target === preview) preview.close(); });
  preview.addEventListener('close', function () { document.documentElement.style.overflow = previousOverflow; });
})();
