(function () {
  'use strict';
  var dialog = document.querySelector('[data-project-request]');
  if (!dialog) return;
  var panel = dialog.querySelector('[role="dialog"]');
  var form = dialog.querySelector('[data-project-form]');
  var entry = dialog.querySelector('[data-request-entry]');
  var success = dialog.querySelector('[data-request-success]');
  var status = dialog.querySelector('[data-request-status]');
  var submit = form.querySelector('button[type="submit"]');
  var opener = null;
  var legalOpener = null;
  var pending = false;
  var scrollBefore = null;
  var validPhone = function (value) {
    var digits = value.replace(/\D/g, '');
    return digits.length === 10 || (digits.length === 11 && /^[78]/.test(digits));
  };
  function activeLegal() { return document.querySelector('.legal-popup--active'); }
  function lockScroll() {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }
  function open(trigger) {
    if (!dialog.hidden) return;
    opener = trigger;
    scrollBefore = [document.body.style.overflow, document.documentElement.style.overflow];
    entry.hidden = false;
    success.hidden = true;
    panel.setAttribute('aria-labelledby', 'projectRequestTitle');
    dialog.hidden = false;
    dialog.scrollTop = 0;
    lockScroll();
    panel.focus({ preventScroll: true });
  }
  function close() {
    if (dialog.hidden) return;
    dialog.hidden = true;
    document.body.style.overflow = scrollBefore ? scrollBefore[0] : '';
    document.documentElement.style.overflow = scrollBefore ? scrollBefore[1] : '';
    var focusTarget = opener && opener.getClientRects().length ? opener : document.getElementById('burgerBtn');
    if (focusTarget) focusTarget.focus({ preventScroll: true });
  }
  // Capture only this dialog's triggers; other existing popups keep their handlers.
  document.addEventListener('click', function (event) {
    var trigger = event.target.closest('[data-popup-target="calcPopup"]');
    if (!trigger) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    open(trigger);
  }, true);
  dialog.addEventListener('click', function (event) {
    if (event.target.closest('[data-request-close]')) close();
    if (event.target.closest('[data-popup-target="privacyPolicyPopup"], [data-popup-target="personalDataPopup"]')) {
      legalOpener = event.target.closest('a');
    }
    if (event.target.closest('[data-request-works]')) close();
  });
  document.addEventListener('keydown', function (event) {
    if (dialog.hidden) return;
    var legal = activeLegal();
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (legal) legal.querySelector('.legal-popup__close').click();
      else close();
      return;
    }
    if (event.key !== 'Tab') return;
    var scope = legal || panel;
    var items = Array.prototype.filter.call(scope.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), textarea, iframe, [tabindex="0"]'), function (item) {
      return item.getClientRects().length > 0 && item.type !== 'hidden';
    });
    var first = items[0];
    var last = items[items.length - 1];
    if (!first) { event.preventDefault(); scope.focus(); return; }
    if (!scope.contains(document.activeElement) || document.activeElement === panel) {
      event.preventDefault(); (event.shiftKey ? last : first).focus();
    } else if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  }, true);
  // Legacy legal popups reset scroll on close; preserve the underlying request dialog.
  document.querySelectorAll('.legal-popup').forEach(function (legal) {
    new MutationObserver(function () {
      if (dialog.hidden) return;
      lockScroll();
      if (legal.classList.contains('legal-popup--active')) {
        var button = legal.querySelector('.legal-popup__close');
        if (button) button.focus();
      } else if (legalOpener) {
        legalOpener.focus();
        legalOpener = null;
      }
    }).observe(legal, { attributes: true, attributeFilter: ['class'] });
  });
  function clearError() {
    status.textContent = '';
    form.querySelectorAll('[aria-invalid]').forEach(function (input) { input.removeAttribute('aria-invalid'); });
  }
  function fail(message, input) {
    status.textContent = message;
    if (input) { input.setAttribute('aria-invalid', 'true'); input.focus(); }
  }
  form.addEventListener('input', clearError);
  form.addEventListener('change', clearError);
  form.elements.phone.addEventListener('input', function () {
    this.value = this.value.replace(/[^\d+\s()\-]/g, '').replace(/(?!^)\+/g, '').slice(0, 18);
  });
  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    // A cached legacy page script may still attach its previous form handler.
    event.stopImmediatePropagation();
    if (pending) return;
    clearError();
    if (!form.elements.name.value.trim()) return fail('Заполните поле «Ваше имя».', form.elements.name);
    if (!validPhone(form.elements.phone.value)) return fail('Введите корректный номер телефона. Например: +7 (999) 123-45-67.', form.elements.phone);
    if (!form.elements.privacy_consent.checked) return fail('Подтвердите согласие на обработку персональных данных.', form.elements.privacy_consent);
    pending = true;
    submit.disabled = true;
    submit.textContent = 'ОТПРАВЛЯЕМ…';
    form.setAttribute('aria-busy', 'true');
    var controller = new AbortController();
    var timeout = setTimeout(function () { controller.abort(); }, 25000);
    try {
      var data = new FormData(form);
      data.set('page_url', window.location.href);
      var response = await fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' }, signal: controller.signal });
      if (!response.ok) throw new Error('Request failed');
      form.reset();
      if (!dialog.hidden) {
        entry.hidden = true;
        success.hidden = false;
        panel.setAttribute('aria-labelledby', 'projectRequestSuccessTitle');
        dialog.scrollTop = 0;
        dialog.querySelector('#projectRequestSuccessTitle').focus({ preventScroll: true });
      }
    } catch (error) {
      fail('Не удалось отправить заявку. Проверьте соединение и попробуйте ещё раз.');
    } finally {
      clearTimeout(timeout);
      pending = false;
      submit.disabled = false;
      submit.textContent = 'ОТПРАВИТЬ ЗАЯВКУ';
      form.removeAttribute('aria-busy');
    }
  });
})();
