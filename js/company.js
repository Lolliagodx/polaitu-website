// Generic popup logic
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

      var baseClass = popup.classList[0];
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

  function syncHeaderState() {
    if (window.scrollY > 10) {
      header.classList.add("site-header--scrolled");
    } else {
      header.classList.remove("site-header--scrolled");
    }
  }

  window.addEventListener("scroll", syncHeaderState);
  syncHeaderState();
})();

// Shared dropdown logic
(function () {
  function initDropdown(buttonId, dropdownId, activeClass) {
    var button = document.getElementById(buttonId);
    var dropdown = document.getElementById(dropdownId);
    if (!button || !dropdown) return;

    button.addEventListener("click", function (event) {
      event.preventDefault();
      dropdown.classList.toggle(activeClass);
    });

    document.addEventListener("click", function (event) {
      if (!button.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.classList.remove(activeClass);
      }
    });
  }

  initDropdown("improveMenuBtn", "improveDropdown", "improve-dropdown--active");
  initDropdown("contactsMenuBtn", "contactsDropdown", "contacts-dropdown--active");
})();

// Desktop mascot toggle
(function () {
  var mascotImage = document.querySelector('[data-company-mascot-image="true"]');
  var toggleButton = document.querySelector('[data-company-mascot-toggle="true"]');
  if (!mascotImage || !toggleButton) return;

  var desktopMedia = window.matchMedia('(min-width: 769px)');
  var laitSrc = mascotImage.getAttribute('data-lait-src');
  var svetaSrc = mascotImage.getAttribute('data-sveta-src');
  var currentMascot = 'lait';
  var mascotMap = {
    lait: {
      text: 'Лайт',
      alt: 'Лайт',
      src: laitSrc,
      pressed: 'false'
    },
    sveta: {
      text: 'Света',
      alt: 'Света',
      src: svetaSrc,
      pressed: 'true'
    }
  };

  function syncMascotState() {
    var mascotState = mascotMap[currentMascot] || mascotMap.lait;
    mascotImage.src = mascotState.src;
    mascotImage.alt = mascotState.alt;
    toggleButton.textContent = mascotState.text;
    toggleButton.setAttribute('aria-pressed', mascotState.pressed);
  }

  toggleButton.addEventListener('click', function () {
    if (!desktopMedia.matches) return;
    currentMascot = currentMascot === 'lait' ? 'sveta' : 'lait';
    syncMascotState();
  });

  window.addEventListener('resize', function () {
    if (!desktopMedia.matches) return;
    syncMascotState();
  });

  syncMascotState();
})();

// Team slider auto-scroll + arrow buttons
(function () {
  var slider = document.querySelector(".company-team-slider");
  var btnPrev = document.querySelector(".company-team-arrow.prev");
  var btnNext = document.querySelector(".company-team-arrow.next");
  if (!slider) return;

  var mobileMedia = window.matchMedia("(max-width: 768px)");

  if (mobileMedia.matches) {
    var mobileSlide = slider.querySelector(".company-team-slide");
    var mobileGap = 12;
    var touchStartX = 0;
    var touchStartY = 0;
    var didSwipe = false;
    var suppressClickUntil = 0;

    slider.style.scrollBehavior = "smooth";
    slider.style.scrollSnapType = "x mandatory";
    slider.style.touchAction = "pan-x";

    function getMobileStep() {
      return (mobileSlide ? mobileSlide.offsetWidth : 260) + mobileGap;
    }

    slider.addEventListener("touchstart", function (event) {
      if (!event.touches || !event.touches.length) return;
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
      didSwipe = false;
    }, { passive: true });

    slider.addEventListener("touchmove", function (event) {
      if (!event.touches || !event.touches.length) return;

      var deltaX = event.touches[0].clientX - touchStartX;
      var deltaY = event.touches[0].clientY - touchStartY;

      if (Math.abs(deltaX) > 10 && Math.abs(deltaX) > Math.abs(deltaY)) {
        didSwipe = true;
      }
    }, { passive: true });

    slider.addEventListener("touchend", function () {
      if (!didSwipe) return;
      suppressClickUntil = Date.now() + 350;
    }, { passive: true });

    slider.addEventListener("click", function (event) {
      if (Date.now() > suppressClickUntil) return;
      event.preventDefault();
      event.stopPropagation();
    }, true);

    if (btnPrev) {
      btnPrev.addEventListener("click", function () {
        slider.scrollBy({ left: -getMobileStep(), behavior: "smooth" });
      });
    }

    if (btnNext) {
      btnNext.addEventListener("click", function () {
        slider.scrollBy({ left: getMobileStep(), behavior: "smooth" });
      });
    }

    return;
  }

  var originalSlides = Array.from(slider.children);
  if (!originalSlides.length) return;

  originalSlides.forEach(function (slide) {
    slider.appendChild(slide.cloneNode(true));
  });

  slider.style.scrollBehavior = "auto";
  slider.style.scrollSnapType = "none";

  var slideWidth = originalSlides[0].offsetWidth || 320;
  var gap = 9;
  var loopWidth = (slideWidth + gap) * originalSlides.length;
  var currentScrollLeft = slider.scrollLeft || 0;
  var autoScrollSpeed = 0.5;
  var isPaused = false;
  var isAnimatingClick = false;

  function measure() {
    slideWidth = originalSlides[0].offsetWidth || 320;
    loopWidth = (slideWidth + gap) * originalSlides.length;
  }

  function tick() {
    if (!isPaused && !isAnimatingClick) {
      currentScrollLeft += autoScrollSpeed;

      if (currentScrollLeft >= loopWidth) {
        currentScrollLeft -= loopWidth;
      }

      if (currentScrollLeft < 0) {
        currentScrollLeft += loopWidth;
      }

      slider.scrollLeft = currentScrollLeft;
    } else if (!isAnimatingClick) {
      currentScrollLeft = slider.scrollLeft;
    }

    requestAnimationFrame(tick);
  }

  function pause() {
    isPaused = true;
  }

  function resume() {
    isPaused = false;
  }

  function scrollBySlide(amount) {
    if (isAnimatingClick) return;

    isAnimatingClick = true;
    slider.style.scrollBehavior = "smooth";

    if (amount < 0 && slider.scrollLeft < Math.abs(amount) + 10) {
      slider.style.scrollBehavior = "auto";
      slider.scrollLeft += loopWidth;
      currentScrollLeft = slider.scrollLeft;
      void slider.offsetHeight;
      slider.style.scrollBehavior = "smooth";
    }

    slider.scrollBy({ left: amount, behavior: "smooth" });

    setTimeout(function () {
      slider.style.scrollBehavior = "auto";
      currentScrollLeft = slider.scrollLeft;
      isAnimatingClick = false;
    }, 450);
  }

  slider.addEventListener("mouseenter", pause);
  slider.addEventListener("mouseleave", resume);

  if (btnPrev && btnNext) {
    btnPrev.addEventListener("mouseenter", pause);
    btnPrev.addEventListener("mouseleave", resume);
    btnNext.addEventListener("mouseenter", pause);
    btnNext.addEventListener("mouseleave", resume);

    btnPrev.addEventListener("click", function () {
      scrollBySlide(-(slideWidth + gap));
    });

    btnNext.addEventListener("click", function () {
      scrollBySlide(slideWidth + gap);
    });
  }

  window.addEventListener("load", measure);
  window.addEventListener("resize", measure);

  measure();
  requestAnimationFrame(tick);
})();

// Mobile review sliders
(function () {
  if (window.innerWidth > 768) return;

  var containers = [
    { element: document.querySelector(".company-reviews-container"), direction: 1 },
    { element: document.querySelector(".company-reviews-container-2"), direction: -1 }
  ];

  var gap = 14;
  var speed = 0.03;

  containers.forEach(function (item) {
    if (!item.element) return;
    buildMobileReviewSlider(item.element, item.direction);
  });

  function buildMobileReviewSlider(container, direction) {
    if (container.dataset.mobileReviewsReady === "true") return;

    var originalCards = Array.from(container.children);
    if (!originalCards.length) return;

    container.dataset.mobileReviewsReady = "true";

    var track = document.createElement("div");
    track.className = "company-reviews-track";
    track.style.display = "flex";
    track.style.alignItems = "stretch";
    track.style.gap = gap + "px";
    track.style.width = "max-content";
    track.style.willChange = "transform";

    for (var copyIndex = 0; copyIndex < 4; copyIndex++) {
      originalCards.forEach(function (card) {
        track.appendChild(card.cloneNode(true));
      });
    }

    var setWidth = 0;
    var offset = 0;
    var previousTimestamp = 0;
    var isPaused = false;

    container.innerHTML = "";
    container.appendChild(track);

    function getFirstSetCards() {
      return Array.from(track.children).slice(0, originalCards.length);
    }

    function render() {
      track.style.transform = "translate3d(" + offset + "px, 0, 0)";
    }

    function normalizeOffset() {
      if (!setWidth) return;

      while (offset > 0) {
        offset -= setWidth;
      }

      while (offset <= -setWidth) {
        offset += setWidth;
      }
    }

    function measure() {
      var firstSetCards = getFirstSetCards();
      var nextWidth = 0;

      firstSetCards.forEach(function (card, index) {
        nextWidth += card.getBoundingClientRect().width;
        if (index < firstSetCards.length - 1) {
          nextWidth += gap;
        }
      });

      if (!nextWidth) return;

      var previousSetWidth = setWidth;
      setWidth = nextWidth;

      if (!previousSetWidth) {
        offset = direction > 0 ? -setWidth : 0;
      } else {
        offset = offset / previousSetWidth * setWidth;
        normalizeOffset();
      }

      render();
    }

    function setPaused(nextValue) {
      isPaused = nextValue;
      container.classList.toggle("company-reviews-container--paused", isPaused);
    }

    container.addEventListener("click", function (event) {
      if (!event.target.closest(".company-review-card")) return;
      setPaused(!isPaused);
    });

    window.addEventListener("resize", function () {
      measure();
      previousTimestamp = 0;
    });

    function animate(timestamp) {
      if (!previousTimestamp) {
        previousTimestamp = timestamp;
      }

      var delta = timestamp - previousTimestamp;
      previousTimestamp = timestamp;

      if (!isPaused && setWidth) {
        offset += direction * speed * delta;
        normalizeOffset();
        render();
      }

      requestAnimationFrame(animate);
    }

    measure();
    requestAnimationFrame(animate);
  }
})();

// Desktop review sliders
(function () {
  if (window.innerWidth <= 768) return;

  var container1 = document.querySelector(".company-reviews-container");
  var container2 = document.querySelector(".company-reviews-container-2");
  if (!container1 || !container2) return;

  var gap = 14;
  var speed = 0.5;

  var children1 = Array.from(container1.children);
  var children2 = Array.from(container2.children);
  if (!children1.length || !children2.length) return;

  for (var i = 0; i < 4; i++) {
    children1.forEach(function (child) {
      container1.appendChild(child.cloneNode(true));
    });
  }

  for (var j = 0; j < 4; j++) {
    children2.forEach(function (child) {
      container2.appendChild(child.cloneNode(true));
    });
  }

  var width1 = 0;
  var width2 = 0;
  var x1 = 0;
  var x2 = -277;
  var isHovered1 = false;
  var isHovered2 = false;

  function measureWidths() {
    width1 = 0;
    width2 = 0;

    children1.forEach(function (child) {
      width1 += child.offsetWidth + gap;
    });

    children2.forEach(function (child) {
      width2 += child.offsetWidth + gap;
    });

    x1 = -width1;
  }

  function animateReviews() {
    if (!isHovered1) {
      x1 += speed;
      if (x1 >= 0) x1 -= width1;
      container1.style.transform = "translateX(" + x1 + "px)";
    }

    if (!isHovered2) {
      x2 -= speed;
      if (x2 <= -width2) x2 += width2;
      container2.style.transform = "translateX(" + x2 + "px)";
    }

    requestAnimationFrame(animateReviews);
  }

  container1.addEventListener("mouseenter", function () {
    isHovered1 = true;
  });

  container1.addEventListener("mouseleave", function () {
    isHovered1 = false;
  });

  container2.addEventListener("mouseenter", function () {
    isHovered2 = true;
  });

  container2.addEventListener("mouseleave", function () {
    isHovered2 = false;
  });

  window.addEventListener("load", measureWidths);
  window.addEventListener("resize", measureWidths);

  measureWidths();
  requestAnimationFrame(animateReviews);
})();

// FAQ accordion logic
(function () {
  var faqQuestions = document.querySelectorAll(".company-faq-question");
  if (!faqQuestions.length) return;

  faqQuestions.forEach(function (question) {
    question.removeAttribute("onclick");

    question.addEventListener("click", function () {
      var wasOpen = this.classList.contains("open");

      faqQuestions.forEach(function (item) {
        item.classList.remove("open");
        if (item.nextElementSibling) {
          item.nextElementSibling.classList.remove("open");
        }
      });

      if (!wasOpen) {
        this.classList.add("open");
        if (this.nextElementSibling) {
          this.nextElementSibling.classList.add("open");
        }
      }
    });
  });
})();

// Cursor-tracked glass shimmer for review cards
(function () {
  var reviewCards = document.querySelectorAll(".company-review-card");

  reviewCards.forEach(function (card) {
    card.addEventListener("mousemove", function (event) {
      var rect = card.getBoundingClientRect();
      var x = event.clientX - rect.left;
      var glareX = Math.min(Math.max(x / rect.width, 0), 1);
      card.style.setProperty("--glare-x", glareX);
    });

    card.addEventListener("mouseleave", function () {
      card.style.removeProperty("--glare-x");
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

// BOGDAN SNAKE START: delete this whole IIFE to remove the easter egg logic
(function () {
  var popup = document.getElementById('bogdanSnakePopup');
  var slider = document.querySelector('.company-team-slider');
  if (!popup || !slider) return;

  var popupDialog = popup.querySelector('.bogdan-snake-popup__dialog');
  var closeButtons = popup.querySelectorAll('[data-bogdan-snake-close="true"]');
  var restartButton = popup.querySelector('[data-bogdan-snake-restart="true"]');
  var canvas = popup.querySelector('[data-bogdan-snake-canvas="true"]');
  var message = popup.querySelector('[data-bogdan-snake-message="true"]');
  var currentScoreNode = popup.querySelector('[data-bogdan-score="current"]');
  var bestScoreNode = popup.querySelector('[data-bogdan-score="best"]');
  if (!popupDialog || !canvas || !message || !restartButton) return;

  var context = canvas.getContext('2d');
  if (!context) return;

  var gridSize = 18;
  var snake = [];
  var food = null;
  var direction = 'right';
  var nextDirection = 'right';
  var loopHandle = null;
  var isPopupOpen = false;
  var isGameRunning = false;
  var score = 0;
  var bestScore = 0;
  var boardSize = 480;
  var cellSize = boardSize / gridSize;
  var lastTrigger = null;
  var touchStartX = 0;
  var touchStartY = 0;
  var storageKey = 'bogdanSnakeBestScore';

  function loadBestScore() {
    try {
      var savedScore = window.localStorage.getItem(storageKey);
      bestScore = savedScore ? Math.max(parseInt(savedScore, 10) || 0, 0) : 0;
    } catch (error) {
      bestScore = 0;
    }
    updateScoreUi();
  }

  function saveBestScore() {
    try {
      window.localStorage.setItem(storageKey, String(bestScore));
    } catch (error) {
      // Ignore storage failures to keep the game working everywhere.
    }
  }

  function updateScoreUi() {
    if (currentScoreNode) {
      currentScoreNode.textContent = String(score);
    }

    if (bestScoreNode) {
      bestScoreNode.textContent = String(bestScore);
    }
  }

  function showMessage(title, text) {
    var titleNode = message.querySelector('.bogdan-snake-popup__message-title');
    var textNode = message.querySelector('.bogdan-snake-popup__message-text');
    if (titleNode) {
      titleNode.textContent = title;
    }
    if (textNode) {
      textNode.textContent = text;
    }
    message.classList.remove('is-hidden');
  }

  function hideMessage() {
    message.classList.add('is-hidden');
  }

  function resizeCanvas() {
    var ratio = window.devicePixelRatio || 1;
    boardSize = Math.max(280, Math.floor(canvas.getBoundingClientRect().width || 480));
    cellSize = boardSize / gridSize;

    canvas.width = Math.floor(boardSize * ratio);
    canvas.height = Math.floor(boardSize * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    drawBoard();
  }

  function drawRoundedCell(x, y, fillStyle, shadowColor) {
    var inset = Math.max(2, cellSize * 0.08);
    var size = cellSize - inset * 2;
    var radius = Math.max(4, cellSize * 0.2);
    var px = x * cellSize + inset;
    var py = y * cellSize + inset;

    context.save();
    context.fillStyle = fillStyle;
    context.shadowBlur = shadowColor ? 16 : 0;
    context.shadowColor = shadowColor || 'transparent';
    context.beginPath();
    context.moveTo(px + radius, py);
    context.lineTo(px + size - radius, py);
    context.quadraticCurveTo(px + size, py, px + size, py + radius);
    context.lineTo(px + size, py + size - radius);
    context.quadraticCurveTo(px + size, py + size, px + size - radius, py + size);
    context.lineTo(px + radius, py + size);
    context.quadraticCurveTo(px, py + size, px, py + size - radius);
    context.lineTo(px, py + radius);
    context.quadraticCurveTo(px, py, px + radius, py);
    context.closePath();
    context.fill();
    context.restore();
  }

  function drawBoard() {
    context.clearRect(0, 0, boardSize, boardSize);

    context.fillStyle = '#0d0d0d';
    context.fillRect(0, 0, boardSize, boardSize);

    context.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    context.lineWidth = 1;

    for (var lineIndex = 1; lineIndex < gridSize; lineIndex++) {
      var offset = lineIndex * cellSize;
      context.beginPath();
      context.moveTo(offset, 0);
      context.lineTo(offset, boardSize);
      context.stroke();

      context.beginPath();
      context.moveTo(0, offset);
      context.lineTo(boardSize, offset);
      context.stroke();
    }

    if (food) {
      drawRoundedCell(food.x, food.y, '#ffa800', 'rgba(255, 168, 0, 0.75)');
    }

    snake.forEach(function (segment, index) {
      var fill = index === 0 ? '#ffd074' : '#ff9f1a';
      var glow = index === 0 ? 'rgba(255, 208, 116, 0.65)' : 'rgba(255, 159, 26, 0.28)';
      drawRoundedCell(segment.x, segment.y, fill, glow);
    });
  }

  function isOppositeDirection(first, second) {
    return (
      (first === 'up' && second === 'down') ||
      (first === 'down' && second === 'up') ||
      (first === 'left' && second === 'right') ||
      (first === 'right' && second === 'left')
    );
  }

  function queueDirection(nextValue) {
    if (!isPopupOpen) return;
    if (isOppositeDirection(direction, nextValue)) return;
    nextDirection = nextValue;
    hideMessage();
  }

  function getDirectionFromKeyboardEvent(event) {
    if (!event) return null;

    if (event.key === 'ArrowUp' || event.code === 'ArrowUp' || event.code === 'KeyW' || event.key === 'w' || event.key === 'W') {
      return 'up';
    }

    if (event.key === 'ArrowDown' || event.code === 'ArrowDown' || event.code === 'KeyS' || event.key === 's' || event.key === 'S') {
      return 'down';
    }

    if (event.key === 'ArrowLeft' || event.code === 'ArrowLeft' || event.code === 'KeyA' || event.key === 'a' || event.key === 'A') {
      return 'left';
    }

    if (event.key === 'ArrowRight' || event.code === 'ArrowRight' || event.code === 'KeyD' || event.key === 'd' || event.key === 'D') {
      return 'right';
    }

    return null;
  }

  function getRandomFreeCell() {
    var freeCell = null;

    while (!freeCell) {
      var candidate = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize)
      };

      var overlapsSnake = snake.some(function (segment) {
        return segment.x === candidate.x && segment.y === candidate.y;
      });

      if (!overlapsSnake) {
        freeCell = candidate;
      }
    }

    return freeCell;
  }

  function stopLoop() {
    isGameRunning = false;
    if (loopHandle) {
      clearTimeout(loopHandle);
      loopHandle = null;
    }
  }

  function getTickDelay() {
    return Math.max(78, 145 - score * 4);
  }

  function finishGame() {
    stopLoop();
    showMessage('Game Over', 'Press Restart and try to beat your best score.');
  }

  function stepGame() {
    direction = nextDirection;

    var head = snake[0];
    var nextHead = { x: head.x, y: head.y };

    if (direction === 'up') nextHead.y -= 1;
    if (direction === 'down') nextHead.y += 1;
    if (direction === 'left') nextHead.x -= 1;
    if (direction === 'right') nextHead.x += 1;

    var hitsWall =
      nextHead.x < 0 ||
      nextHead.y < 0 ||
      nextHead.x >= gridSize ||
      nextHead.y >= gridSize;

    var hitsSnake = snake.some(function (segment) {
      return segment.x === nextHead.x && segment.y === nextHead.y;
    });

    if (hitsWall || hitsSnake) {
      finishGame();
      return;
    }

    snake.unshift(nextHead);

    if (food && nextHead.x === food.x && nextHead.y === food.y) {
      score += 1;
      if (score > bestScore) {
        bestScore = score;
        saveBestScore();
      }
      updateScoreUi();
      food = getRandomFreeCell();
    } else {
      snake.pop();
    }

    drawBoard();
    scheduleNextTick();
  }

  function scheduleNextTick() {
    if (!isGameRunning) return;
    stopLoop();
    isGameRunning = true;
    loopHandle = window.setTimeout(stepGame, getTickDelay());
  }

  function resetGame() {
    stopLoop();
    snake = [
      { x: 6, y: 9 },
      { x: 5, y: 9 },
      { x: 4, y: 9 }
    ];
    direction = 'right';
    nextDirection = 'right';
    score = 0;
    updateScoreUi();
    food = getRandomFreeCell();
    resizeCanvas();
    showMessage('Snake is live', 'Desktop: arrows or WASD. Phone: swipe or tap the pad.');
    isGameRunning = true;
    loopHandle = window.setTimeout(stepGame, 420);
  }

  function openPopup(trigger) {
    lastTrigger = trigger || null;
    isPopupOpen = true;
    popup.classList.add('bogdan-snake-popup--active');
    popup.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    window.requestAnimationFrame(function () {
      resizeCanvas();
      resetGame();
      popupDialog.focus();
    });
  }

  function closePopup() {
    isPopupOpen = false;
    stopLoop();
    popup.classList.remove('bogdan-snake-popup--active');
    popup.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    showMessage('Tap Restart', 'Collect points and do not hit the wall.');

    if (lastTrigger && typeof lastTrigger.focus === 'function') {
      lastTrigger.focus();
    }
  }

  slider.addEventListener('click', function (event) {
    var trigger = event.target.closest('[data-bogdan-snake-trigger="true"]');
    if (!trigger) return;
    openPopup(trigger);
  });

  document.addEventListener('keydown', function (event) {
    var trigger = event.target.closest ? event.target.closest('[data-bogdan-snake-trigger="true"]') : null;

    if (!isPopupOpen && trigger && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      openPopup(trigger);
      return;
    }

    if (!isPopupOpen) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closePopup();
      return;
    }

    var keyboardDirection = getDirectionFromKeyboardEvent(event);
    if (keyboardDirection) {
      event.preventDefault();
      queueDirection(keyboardDirection);
    }
  });

  closeButtons.forEach(function (button) {
    button.addEventListener('click', closePopup);
  });

  restartButton.addEventListener('click', function () {
    resetGame();
  });

  canvas.addEventListener('touchstart', function (event) {
    if (!event.touches || !event.touches.length) return;
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
  }, { passive: true });

  canvas.addEventListener('touchend', function (event) {
    if (!event.changedTouches || !event.changedTouches.length) return;

    var deltaX = event.changedTouches[0].clientX - touchStartX;
    var deltaY = event.changedTouches[0].clientY - touchStartY;

    if (Math.abs(deltaX) < 24 && Math.abs(deltaY) < 24) {
      return;
    }

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      queueDirection(deltaX > 0 ? 'right' : 'left');
    } else {
      queueDirection(deltaY > 0 ? 'down' : 'up');
    }
  }, { passive: true });

  window.addEventListener('resize', function () {
    if (!isPopupOpen) return;
    resizeCanvas();
  });

  loadBestScore();
  showMessage('Tap Restart', 'Collect points and do not hit the wall.');
})();
// BOGDAN SNAKE END
