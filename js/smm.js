// Generic Popup Logic
    (function () {
      var popupTriggers = document.querySelectorAll("[data-popup-target]");

      popupTriggers.forEach(function (trigger) {
        trigger.addEventListener("click", function (e) {
          if (typeof e.preventDefault === "function") {
            e.preventDefault();
          }
          var targetId = this.getAttribute("data-popup-target");
          var popup = document.getElementById(targetId);
          if (!popup) return;

          var baseClass = popup.classList[0]; // e.g. "milli-popup" or "starface-popup"

          // Open popup
          popup.classList.add(baseClass + "--active");
          document.body.style.overflow = "hidden";
          document.documentElement.style.overflow = "hidden";

          var closeBtn = popup.querySelector("." + baseClass + "__close");
          var overlay = popup.querySelector("." + baseClass + "__overlay");

          function closePopup() {
            popup.classList.remove(baseClass + "--active");
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";

            if (closeBtn) closeBtn.removeEventListener("click", closePopup);
            if (overlay) overlay.removeEventListener("click", closePopup);
          }

          if (closeBtn) closeBtn.addEventListener("click", closePopup);
          if (overlay) overlay.addEventListener("click", closePopup);
        });
      });
    })();

    // Header scroll effect
    (function () {
      var header = document.querySelector(".site-header");
      if (!header) return;
      window.addEventListener("scroll", function () {
        if (window.scrollY > 10) {
          header.classList.add("site-header--scrolled");
        } else {
          header.classList.remove("site-header--scrolled");
        }
      });
      // Initial check
      if (window.scrollY > 10) {
        header.classList.add("site-header--scrolled");
      }
    })();

    // Dropdown toggles
    (function () {
      var improveBtn = document.getElementById("improveMenuBtn");
      var improveDropdown = document.getElementById("improveDropdown");

      var contactsBtn = document.getElementById("contactsMenuBtn");
      var contactsDropdown = document.getElementById("contactsDropdown");

      if (improveBtn && improveDropdown) {
        improveBtn.addEventListener("click", function (e) {
          e.preventDefault();
          improveDropdown.classList.toggle("improve-dropdown--active");
        });
      }

      if (contactsBtn && contactsDropdown) {
        contactsBtn.addEventListener("click", function (e) {
          e.preventDefault();
          contactsDropdown.classList.toggle("contacts-dropdown--active");
        });
      }

      // Close when clicking outside
      document.addEventListener("click", function (e) {
        if (improveBtn && improveDropdown && !improveBtn.contains(e.target) && !improveDropdown.contains(e.target)) {
          improveDropdown.classList.remove("improve-dropdown--active");
        }
        if (contactsBtn && contactsDropdown && !contactsBtn.contains(e.target) && !contactsDropdown.contains(e.target)) {
          contactsDropdown.classList.remove("contacts-dropdown--active");
        }
      });
    })();

    // 3D Tilt effect for SMM cards
    (function () {
      var cards = document.querySelectorAll(".smm-stat-card, .smm-bottom-card");
      if (!cards.length) return;

      cards.forEach(function (card) {
        card.addEventListener("mousemove", function (e) {
          var rect = card.getBoundingClientRect();
          var x = e.clientX - rect.left;
          var y = e.clientY - rect.top;

          var centerX = rect.width / 2;
          var centerY = rect.height / 2;

          // Max tilt angle
          var maxTilt = 15;

          var rotateX = ((y - centerY) / centerY) * -maxTilt;
          var rotateY = ((x - centerX) / centerX) * maxTilt;

          var glareX = Math.min(Math.max(x / rect.width, 0), 1);
          card.style.setProperty('--glare-x', glareX);

          card.style.transform = "perspective(1000px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) scale3d(1.02, 1.02, 1.02)";
          card.style.transition = "transform 0.1s ease";
        });

        card.addEventListener("mouseleave", function () {
          card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
          card.style.transition = "transform 0.4s ease";
          card.style.removeProperty('--glare-x');
        });
      });
    })();

    // AJAX form submit for Formspree
    (function () {
      var forms = document.querySelectorAll('form[action*="formspree.io"]');
      if (!forms.length) return;

      function sanitizePhoneValue(value) {
        return value
          .replace(/[^\d+\s()\-]/g, '')
          .replace(/(?!^)\+/g, '')
          .replace(/\s{2,}/g, ' ')
          .slice(0, 18);
      }

      function isValidPhone(value) {
        var digits = value.replace(/\D/g, '');
        if (digits.length === 11) {
          return /^[78]/.test(digits);
        }
        return digits.length === 10;
      }

      var invalidPhoneMessage = '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043a\u043e\u0440\u0440\u0435\u043a\u0442\u043d\u044b\u0439 \u043d\u043e\u043c\u0435\u0440 \u0442\u0435\u043b\u0435\u0444\u043e\u043d\u0430. \u041d\u0430\u043f\u0440\u0438\u043c\u0435\u0440: +7 (999) 123-45-67.';

      function normalizeStatusMessage(message) {
        if (!message) return message;
        if (
          message.indexOf('Р’РІРµРґРёС‚Рµ') !== -1 ||
          message.indexOf('Р вЂ™Р Р†') !== -1
        ) {
          return invalidPhoneMessage;
        }
        return message;
      }

      function showStatus(status, message, isError) {
        if (!status) return;
        status.textContent = normalizeStatusMessage(message);
        status.classList.add('is-visible');
        status.classList.toggle('is-error', !!isError);
      }

      function getSubmitButtons(form) {
        var buttons = Array.prototype.slice.call(
          form.querySelectorAll('button[type="submit"], input[type="submit"]')
        );

        if (form.id) {
          buttons = buttons.concat(Array.prototype.slice.call(
            document.querySelectorAll('[form="' + form.id + '"]')
          ));
        }

        return buttons.filter(function (button, index) {
          return buttons.indexOf(button) === index;
        });
      }

      function setButtonLoading(button, isLoading) {
        var label = button.querySelector('span') || button;

        if (!button.dataset.defaultLabel) {
          button.dataset.defaultLabel = label.textContent;
        }

        label.textContent = isLoading ? 'ОТПРАВЛЯЕМ...' : button.dataset.defaultLabel;
        button.disabled = isLoading;
      }

      forms.forEach(function (form) {
        form.setAttribute('novalidate', 'novalidate');

        var status = form.querySelector('[data-form-status]');
        var buttons = getSubmitButtons(form);
        var nameInput = form.querySelector('input[name="name"]');
        var phoneInput = form.querySelector('input[name="phone"]');
        var consentCheckbox = form.querySelector('input[name="privacy_consent"]');

        if (phoneInput) {
          phoneInput.setAttribute('inputmode', 'tel');
          phoneInput.setAttribute('autocomplete', 'tel');
          phoneInput.setAttribute('title', 'Введите корректный номер телефона');
          phoneInput.setAttribute('pattern', '[0-9\\+\\s\\(\\)\\-]*');
          phoneInput.addEventListener('input', function () {
            var sanitizedValue = sanitizePhoneValue(phoneInput.value);
            if (phoneInput.value !== sanitizedValue) {
              phoneInput.value = sanitizedValue;
            }
          });
          phoneInput.addEventListener('blur', function () {
            if (!phoneInput.value.trim()) return;
            if (!isValidPhone(phoneInput.value)) {
              showStatus(status, 'Введите корректный номер телефона. Например: +7 (999) 123-45-67.', true);
            }
          });
        }

        function hideStatus() {
          if (!status) return;
          status.textContent = '';
          status.classList.remove('is-visible', 'is-error');
        }

        form.addEventListener('input', hideStatus);

        form.addEventListener('submit', function (e) {
          e.preventDefault();
          hideStatus();

          if (nameInput && !nameInput.value.trim()) {
            if (status) {
              status.textContent = 'Заполните поле "Ваше имя".';
              status.classList.add('is-visible', 'is-error');
            }
            nameInput.focus();
            return;
          }

          if (phoneInput && !phoneInput.value.trim()) {
            if (status) {
              status.textContent = 'Заполните поле "Ваш номер телефона".';
              status.classList.add('is-visible', 'is-error');
            }
            phoneInput.focus();
            return;
          }

          if (phoneInput && phoneInput.value.trim() && !isValidPhone(phoneInput.value)) {
            showStatus(status, 'Р’РІРµРґРёС‚Рµ РєРѕСЂСЂРµРєС‚РЅС‹Р№ РЅРѕРјРµСЂ С‚РµР»РµС„РѕРЅР°. РќР°РїСЂРёРјРµСЂ: +7 (999) 123-45-67.', true);
            phoneInput.focus();
            return;
          }

          if (phoneInput && !isValidPhone(phoneInput.value)) {
            if (status) {
              status.textContent = 'Введите корректный номер телефона.';
              status.classList.add('is-visible', 'is-error');
            }
            phoneInput.focus();
            return;
          }

          if (consentCheckbox && !consentCheckbox.checked) {
            if (status) {
              status.textContent = 'Подтвердите согласие на обработку персональных данных.';
              status.classList.add('is-visible', 'is-error');
            }
            consentCheckbox.focus();
            return;
          }

          var formData = new FormData(form);

          buttons.forEach(function (button) {
            setButtonLoading(button, true);
          });

          fetch(form.action, {
            method: form.method || 'POST',
            body: formData,
            headers: {
              'Accept': 'application/json'
            }
          })
            .then(function (response) {
              if (!response.ok) {
                throw new Error('Form submit failed');
              }

              form.reset();

              if (status) {
                status.textContent = 'Заявка оформлена. Скоро с вами свяжемся.';
                status.classList.add('is-visible');
              }
            })
            .catch(function () {
              if (status) {
                status.textContent = 'Не удалось отправить заявку. Попробуйте еще раз.';
                status.classList.add('is-visible', 'is-error');
              }
            })
            .finally(function () {
              buttons.forEach(function (button) {
                setButtonLoading(button, false);
              });
            });
        });
      });
    })();
