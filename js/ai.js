(function () {
  'use strict';
  var contact = document.getElementById('aiContactForm');
  if (contact) contact.addEventListener('submit', function (event) {
    var submit = document.querySelector('[form="aiContactForm"]');
    if (submit && submit.disabled) { event.preventDefault(); event.stopImmediatePropagation(); }
  }, true);
})();
