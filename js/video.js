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

          document.querySelectorAll(".video-project-card--preview-active").forEach(function (card) {
            card.classList.remove("video-project-card--preview-active");
          });

          var baseClass = popup.classList[0]; // e.g. "milli-popup" or "starface-popup"

          // Open popup
          popup.classList.add(baseClass + "--active");
          document.body.style.overflow = "hidden";
          document.documentElement.style.overflow = "hidden";

          var closeBtn = popup.querySelector("." + baseClass + "__close");
          var overlay = popup.querySelector("." + baseClass + "__overlay");

          function closePopup() {
            var popupVideos = popup.querySelectorAll("video");

            popupVideos.forEach(function (popupVideo) {
              popupVideo.pause();
            });

            var playButtons = popup.querySelectorAll(".video-popup__play-btn");
            var fullscreenButtons = popup.querySelectorAll(".video-popup__fullscreen-btn");

            playButtons.forEach(function (button) {
              button.classList.remove("video-popup__play-btn--hidden");
            });

            fullscreenButtons.forEach(function (button) {
              button.classList.remove("video-popup__fullscreen-btn--hidden");
            });

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

    // Mobile double-tap preview for video popup cards
    (function () {
      var cards = document.querySelectorAll('.video-project-card[data-popup-target]');
      if (!cards.length) return;

      var touchLikeMedia = window.matchMedia('(hover: none), (pointer: coarse)');
      var activeCard = null;

      function clearActiveCard() {
        if (!activeCard) return;
        activeCard.classList.remove('video-project-card--preview-active');
        activeCard = null;
      }

      function setActiveCard(card) {
        if (activeCard === card) return;
        clearActiveCard();
        card.classList.add('video-project-card--preview-active');
        activeCard = card;
      }

      cards.forEach(function (card) {
        card.addEventListener('click', function (event) {
          if (!touchLikeMedia.matches) return;

          if (activeCard !== card) {
            event.preventDefault();
            event.stopImmediatePropagation();
            setActiveCard(card);
          }
        }, true);
      });

      document.addEventListener('click', function (event) {
        if (!touchLikeMedia.matches) return;
        if (event.target.closest('.video-project-card[data-popup-target]')) return;
        clearActiveCard();
      });

      window.addEventListener('resize', function () {
        if (!touchLikeMedia.matches) {
          clearActiveCard();
        }
      });
    })();

    // Popup video controls
    (function () {
      var popupPlayers = document.querySelectorAll(".video-popup__player");
      if (!popupPlayers.length) return;

      popupPlayers.forEach(function (player) {
        var video = player.querySelector(".popup-video");
        var playBtn = player.querySelector(".video-popup__play-btn");
        var fullscreenBtn = player.querySelector(".video-popup__fullscreen-btn");

        if (!video || !playBtn || !fullscreenBtn) return;

        video.setAttribute("playsinline", "");
        video.preload = "metadata";

        function syncButtons() {
          var isPlaying = !video.paused && !video.ended && video.readyState > 2;

          playBtn.classList.toggle("video-popup__play-btn--hidden", isPlaying);
          fullscreenBtn.classList.toggle("video-popup__fullscreen-btn--hidden", !isPlaying);
        }

        function playVideo() {
          var playPromise = video.play();

          if (playPromise && typeof playPromise.then === "function") {
            playPromise
              .then(syncButtons)
              .catch(function () {
                syncButtons();
              });
            return;
          }

          syncButtons();
        }

        function pauseVideo() {
          video.pause();
          syncButtons();
        }

        function togglePlayback() {
          if (video.paused || video.ended) {
            playVideo();
          } else {
            pauseVideo();
          }
        }

        playBtn.addEventListener("click", function (event) {
          event.preventDefault();
          event.stopPropagation();
          playVideo();
        });

        video.addEventListener("click", function () {
          togglePlayback();
        });

        fullscreenBtn.addEventListener("click", function (event) {
          event.preventDefault();
          event.stopPropagation();

          if (video.requestFullscreen) {
            video.requestFullscreen();
          } else if (player.requestFullscreen) {
            player.requestFullscreen();
          }
        });

        video.addEventListener("play", syncButtons);
        video.addEventListener("pause", syncButtons);
        video.addEventListener("ended", function () {
          video.currentTime = 0;
          syncButtons();
        });

        syncButtons();
      });
    })();

    // Video load handler
    (function () {
      var block = document.querySelector(".video-block");
      var video = document.querySelector(".video-block__media");
      if (!block || !video) return;

      function setReady() {
        block.classList.add("video-block--ready");
      }

      function setPlaceholder() {
        block.classList.remove("video-block--ready");
      }

      video.addEventListener("loadeddata", setReady);
      video.addEventListener("canplay", setReady);
      video.addEventListener("error", setPlaceholder);
      setPlaceholder();
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
