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
})();

// Dropdown toggle
(function () {
  var btn = document.getElementById("improveMenuBtn");
  var dropdown = document.getElementById("improveDropdown");
  if (!btn || !dropdown) return;

  btn.addEventListener("click", function (e) {
    e.preventDefault();
    dropdown.classList.toggle("improve-dropdown--active");
  });

  // Close when clicking outside
  document.addEventListener("click", function (e) {
    if (!btn.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove("improve-dropdown--active");
    }
  });
})();

// Contacts Dropdown toggle
(function () {
  var btn = document.getElementById("contactsMenuBtn");
  var dropdown = document.getElementById("contactsDropdown");
  if (!btn || !dropdown) return;

  btn.addEventListener("click", function (e) {
    e.preventDefault();
    dropdown.classList.toggle("contacts-dropdown--active");
  });

  document.addEventListener("click", function (e) {
    if (!btn.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove("contacts-dropdown--active");
    }
  });
})();

// 3D Tilt effect for glass cards
(function () {
  var cards = document.querySelectorAll(".fifth-block__glass-card");
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
    });

    card.addEventListener("mouseleave", function () {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
      card.style.removeProperty('--glare-x');
    });
  });
})();

// Mobile double-tap preview for homepage cards
(function () {
  var wrappers = document.querySelectorAll('.next-block > [class$="-wrapper"][href]');
  if (!wrappers.length) return;

  var touchLikeMedia = window.matchMedia('(hover: none), (pointer: coarse)');
  var activeWrapper = null;

  function clearActiveWrapper() {
    if (!activeWrapper) return;
    activeWrapper.classList.remove('next-block__preview-active');
    activeWrapper = null;
  }

  function setActiveWrapper(wrapper) {
    if (activeWrapper === wrapper) return;
    clearActiveWrapper();
    wrapper.classList.add('next-block__preview-active');
    activeWrapper = wrapper;
  }

  wrappers.forEach(function (wrapper) {
    wrapper.addEventListener('click', function (e) {
      if (!touchLikeMedia.matches) return;

      if (activeWrapper !== wrapper) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setActiveWrapper(wrapper);
        return;
      }
    }, true);
  });

  document.addEventListener('click', function (e) {
    if (!touchLikeMedia.matches) return;
    if (e.target.closest('.next-block > [class$="-wrapper"]')) return;
    clearActiveWrapper();
  });

  window.addEventListener('resize', function () {
    if (!touchLikeMedia.matches) {
      clearActiveWrapper();
    }
  });
})();

function capitalizeFirstLetter(text) {
  return (text || "").replace(/([A-Za-zА-Яа-яЁё])/, function (match) {
    return match.toUpperCase();
  });
}

// Inline Quiz Logic
(function () {
  var startBtn = document.getElementById("startInlineQuizBtn");
  var introState = document.getElementById("quizIntroState");
  var step1State = document.getElementById("quizStep1State");
  var step2State = document.getElementById("quizStep2State");
  var step3State = document.getElementById("quizStep3State");
  var step4VideoState = document.getElementById("quizStep4VideoState");
  var step5VideoState = document.getElementById("quizStep5VideoState");
  var step4DesignState = document.getElementById("quizStep4DesignState");
  var step5DesignState = document.getElementById("quizStep5DesignState");
  var step4SMMState = document.getElementById("quizStep4SMMState");
  var step5SMMState = document.getElementById("quizStep5SMMState");

  var step1Prev = document.getElementById("quizStep1Prev");
  var step1Next = document.getElementById("quizStep1Next");

  var step2Prev = document.getElementById("quizStep2Prev");
  var step2Next = document.getElementById("quizStep2Next");

  var step3Prev = document.getElementById("quizStep3Prev");
  var step3Next = document.getElementById("quizStep3Next");

  var step4VideoPrev = document.getElementById("quizStep4VideoPrev");
  var step4VideoNext = document.getElementById("quizStep4VideoNext");

  var step5VideoPrev = document.getElementById("quizStep5VideoPrev");
  var step5VideoNext = document.getElementById("quizStep5VideoNext");

  var step4DesignPrev = document.getElementById("quizStep4DesignPrev");
  var step4DesignNext = document.getElementById("quizStep4DesignNext");

  var step5DesignPrev = document.getElementById("quizStep5DesignPrev");
  var step5DesignNext = document.getElementById("quizStep5DesignNext");

  var step4SMMPrev = document.getElementById("quizStep4SMMPrev");
  var step4SMMNext = document.getElementById("quizStep4SMMNext");

  var step5SMMPrev = document.getElementById("quizStep5SMMPrev");
  var step5SMMNext = document.getElementById("quizStep5SMMNext");
  var quizOptionLabels = document.querySelectorAll(".inline-quiz__option-label");

  quizOptionLabels.forEach(function (label) {
    label.textContent = capitalizeFirstLetter(label.textContent);
  });

  if (startBtn && introState && step1State) {
    startBtn.addEventListener("click", function (e) {
      e.preventDefault();
      introState.classList.remove("active");
      step1State.classList.add("active");
      var thirdBlock = document.querySelector('.third-video-block');
      if (thirdBlock) thirdBlock.classList.add('quiz-started');
    });
  }

  if (step1Prev) {
    step1Prev.addEventListener("click", function () {
      step1State.classList.remove("active");
      introState.classList.add("active");
      var thirdBlock = document.querySelector('.third-video-block');
      if (thirdBlock) thirdBlock.classList.remove('quiz-started');
    });
  }

  if (step1Next) {
    step1Next.addEventListener("click", function () {
      if (!document.querySelector('input[name="inline_quiz_q1"]:checked')) return;
      step1State.classList.remove("active");
      if (step2State) step2State.classList.add("active");
    });
  }

  if (step2Prev) {
    step2Prev.addEventListener("click", function () {
      step2State.classList.remove("active");
      step1State.classList.add("active");
    });
  }

  if (step2Next) {
    step2Next.addEventListener("click", function () {
      if (!document.querySelector('input[name="inline_quiz_q2"]:checked')) return;
      step2State.classList.remove("active");
      if (step3State) step3State.classList.add("active");
    });
  }

  if (step3Prev) {
    step3Prev.addEventListener("click", function () {
      step3State.classList.remove("active");
      step2State.classList.add("active");
    });
  }

  if (step3Next) {
    step3Next.addEventListener("click", function () {
      if (!document.querySelector('input[name="inline_quiz_q3"]:checked')) return;
      var selectedQ1 = document.querySelector('input[name="inline_quiz_q1"]:checked');
      step3State.classList.remove("active");

      if (selectedQ1 && selectedQ1.value === "dontknow") {
        var dontKnowState = document.getElementById("quizFinalDontKnowState");
        if (dontKnowState) dontKnowState.classList.add("active");
      } else if (selectedQ1 && selectedQ1.value === "video") {
        if (step4VideoState) step4VideoState.classList.add("active");
      } else if (selectedQ1 && selectedQ1.value === "design") {
        if (step4DesignState) step4DesignState.classList.add("active");
      } else if (selectedQ1 && selectedQ1.value === "smm") {
        if (step4SMMState) step4SMMState.classList.add("active");
      } else {
        var normalFinalState = document.getElementById("quizFinalNormalState");
        if (normalFinalState) normalFinalState.classList.add("active");
      }
    });
  }

  if (step4VideoPrev) {
    step4VideoPrev.addEventListener("click", function () {
      step4VideoState.classList.remove("active");
      step3State.classList.add("active");
    });
  }

  if (step4VideoNext) {
    step4VideoNext.addEventListener("click", function () {
      if (!document.querySelector('input[name="inline_quiz_q4_video"]:checked')) return;
      step4VideoState.classList.remove("active");
      if (step5VideoState) step5VideoState.classList.add("active");
    });
  }

  if (step5VideoPrev) {
    step5VideoPrev.addEventListener("click", function () {
      step5VideoState.classList.remove("active");
      if (step4VideoState) step4VideoState.classList.add("active");
    });
  }

  if (step5VideoNext) {
    step5VideoNext.addEventListener("click", function () {
      if (!document.querySelector('input[name="inline_quiz_q5_video"]:checked')) return;
      step5VideoState.classList.remove("active");
      var normalFinalState = document.getElementById("quizFinalNormalState");
      if (normalFinalState) normalFinalState.classList.add("active");
    });
  }

  if (step4DesignPrev) {
    step4DesignPrev.addEventListener("click", function () {
      step4DesignState.classList.remove("active");
      step3State.classList.add("active");
    });
  }

  if (step4DesignNext) {
    step4DesignNext.addEventListener("click", function () {
      if (!document.querySelector('input[name="inline_quiz_q4_design"]:checked')) return;
      step4DesignState.classList.remove("active");
      if (step5DesignState) step5DesignState.classList.add("active");
    });
  }

  if (step5DesignPrev) {
    step5DesignPrev.addEventListener("click", function () {
      step5DesignState.classList.remove("active");
      if (step4DesignState) step4DesignState.classList.add("active");
    });
  }

  if (step5DesignNext) {
    step5DesignNext.addEventListener("click", function () {
      if (!document.querySelector('input[name="inline_quiz_q5_design"]:checked')) return;
      step5DesignState.classList.remove("active");
      var normalFinalState = document.getElementById("quizFinalNormalState");
      if (normalFinalState) normalFinalState.classList.add("active");
    });
  }

  if (step4SMMPrev) {
    step4SMMPrev.addEventListener("click", function () {
      step4SMMState.classList.remove("active");
      step3State.classList.add("active");
    });
  }

  if (step4SMMNext) {
    step4SMMNext.addEventListener("click", function () {
      if (!document.querySelector('input[name="inline_quiz_q4_smm"]:checked')) return;
      step4SMMState.classList.remove("active");
      if (step5SMMState) step5SMMState.classList.add("active");
    });
  }

  if (step5SMMPrev) {
    step5SMMPrev.addEventListener("click", function () {
      step5SMMState.classList.remove("active");
      if (step4SMMState) step4SMMState.classList.add("active");
    });
  }

  if (step5SMMNext) {
    step5SMMNext.addEventListener("click", function () {
      if (!document.querySelector('input[name="inline_quiz_q5_smm"]:checked')) return;
      step5SMMState.classList.remove("active");
      var normalFinalState = document.getElementById("quizFinalNormalState");
      if (normalFinalState) normalFinalState.classList.add("active");
    });
  }

  var radios = document.querySelectorAll('.inline-quiz__option input[type="radio"]');
  radios.forEach(function (radio) {
    radio.addEventListener("change", function () {
      // Remove active class from all
      document.querySelectorAll('.inline-quiz__option .inline-quiz__radio-custom').forEach(function (r) {
        r.classList.remove('inline-quiz__radio-custom--active');
      });
      // Add to current
      if (this.checked) {
        this.nextElementSibling.classList.add('inline-quiz__radio-custom--active');
      }
    });
  });
})();

// Video Synchronization
(function () {
  var v1 = document.getElementById("mainVideo1");
  var v2 = document.getElementById("mainVideo2");
  if (!v1 || !v2) return;

  v1.addEventListener('timeupdate', function () {
    if (v2.readyState >= 3) {
      if (Math.abs(v1.currentTime - v2.currentTime) > 0.1) {
        v2.currentTime = v1.currentTime;
      }
      if (v2.paused && !v1.paused) v2.play();
    }
  });
  v2.addEventListener('timeupdate', function () {
    if (v1.readyState >= 3) {
      if (Math.abs(v2.currentTime - v1.currentTime) > 0.1) {
        v1.currentTime = v2.currentTime;
      }
      if (v1.paused && !v2.paused) v1.play();
    }
  });
})();

// AJAX form submit for Formspree
(function () {
  var forms = document.querySelectorAll('form[action*="formspree.io"]:not([data-project-form])');
  if (!forms.length) return;

  function normalizeText(text) {
    return (text || '').replace(/\s+/g, ' ').trim();
  }

  function appendQuizAnswers(formData) {
    var quizAnswers = document.querySelectorAll('input[name^="inline_quiz_"]:checked');
    var summary = [];

    quizAnswers.forEach(function (input, index) {
      var option = input.closest('.inline-quiz__option');
      var optionLabel = option ? option.querySelector('.inline-quiz__option-label') : null;
      var state = input.closest('.third-video-block__state');
      var title = state ? state.querySelector('.inline-quiz__title') : null;
      var questionText = normalizeText(title ? title.textContent : input.name);
      var answerText = capitalizeFirstLetter(normalizeText(optionLabel ? optionLabel.textContent : input.value));
      var readableAnswer = questionText + ': ' + answerText;

      formData.append('quiz_answer_' + (index + 1), readableAnswer);
      summary.push(readableAnswer);
    });

    if (summary.length) {
      formData.append('quiz_summary', summary.join(' | '));
    }
  }

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

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((value || '').trim());
  }

  var invalidPhoneMessage = '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043a\u043e\u0440\u0440\u0435\u043a\u0442\u043d\u044b\u0439 \u043d\u043e\u043c\u0435\u0440 \u0442\u0435\u043b\u0435\u0444\u043e\u043d\u0430. \u041d\u0430\u043f\u0440\u0438\u043c\u0435\u0440: +7 (999) 123-45-67.';
  var invalidEmailMessage = 'Введите корректный e-mail. Например: name@example.com.';

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
    var emailInput = form.querySelector('input[name="email"]');
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

    if (emailInput) {
      emailInput.setAttribute('inputmode', 'email');
      emailInput.setAttribute('autocomplete', 'email');
      emailInput.setAttribute('title', 'Введите корректный e-mail');
      emailInput.addEventListener('blur', function () {
        if (!emailInput.value.trim()) return;
        if (!isValidEmail(emailInput.value)) {
          showStatus(status, invalidEmailMessage, true);
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

      if (emailInput && emailInput.value.trim() && !isValidEmail(emailInput.value)) {
        showStatus(status, invalidEmailMessage, true);
        emailInput.focus();
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

      if (form.hasAttribute('data-include-quiz')) {
        appendQuizAnswers(formData);
      }

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
