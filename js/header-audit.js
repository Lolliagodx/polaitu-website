(function () {
  var iconBtn = document.querySelector(".site-header .icon-btn");
  var auditTab = document.querySelector(".site-header .header-audit-tab");
  var closeBtn = document.querySelector(".site-header .header-audit-tab__close");

  var HOVER_DURATION = 2000;
  var INDEX_AUTOSHOW_DURATION = 5000;

  if (!iconBtn || !auditTab || !closeBtn) {
    return;
  }

  var hideTimer = null;
  var animationFrame = null;

  function clearHideTimer() {
    if (hideTimer) {
      window.clearTimeout(hideTimer);
      hideTimer = null;
    }
  }

  function clearCountdownAnimation() {
    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
  }

  function startCountdown(duration) {
    clearCountdownAnimation();
    auditTab.style.setProperty(
      "--header-audit-duration",
      duration / 1000 + "s"
    );
    auditTab.classList.remove("header-audit-tab--counting");
    animationFrame = window.requestAnimationFrame(function () {
      auditTab.classList.add("header-audit-tab--counting");
      animationFrame = null;
    });
  }

  function showAuditTab(duration) {
    clearHideTimer();
    startCountdown(duration);
    auditTab.classList.add("header-audit-tab--visible");
  }

  function hideAuditTab() {
    clearHideTimer();
    clearCountdownAnimation();
    auditTab.classList.remove("header-audit-tab--counting");
    auditTab.classList.remove("header-audit-tab--visible");
  }

  function scheduleHide(duration) {
    clearHideTimer();
    hideTimer = window.setTimeout(function () {
      hideAuditTab();
    }, duration);
  }

  function handleFocusOut(event) {
    var nextTarget = event.relatedTarget;

    if (
      nextTarget &&
      (iconBtn.contains(nextTarget) || auditTab.contains(nextTarget))
    ) {
      return;
    }

    scheduleHide(HOVER_DURATION);
  }

  function handleMouseEnter() {
    showAuditTab(HOVER_DURATION);
  }

  function handleMouseLeave(event) {
    var relatedTarget = event.relatedTarget;

    if (
      relatedTarget &&
      (iconBtn.contains(relatedTarget) || auditTab.contains(relatedTarget))
    ) {
      return;
    }

    scheduleHide(HOVER_DURATION);
  }

  function isIndexPage() {
    var path = window.location.pathname.toLowerCase();
    return (
      path === "/" ||
      path.endsWith("/index.html") ||
      path.endsWith("\\index.html") ||
      path === "/index"
    );
  }

  iconBtn.addEventListener("mouseenter", handleMouseEnter);
  iconBtn.addEventListener("mouseleave", handleMouseLeave);
  iconBtn.addEventListener("click", function () {
    window.location.href = "./polaitu-checklist.html";
  });
  iconBtn.addEventListener("focusin", function () {
    showAuditTab(HOVER_DURATION);
  });
  iconBtn.addEventListener("focusout", handleFocusOut);

  auditTab.addEventListener("mouseenter", handleMouseEnter);
  auditTab.addEventListener("mouseleave", handleMouseLeave);
  auditTab.addEventListener("focusin", function () {
    showAuditTab(HOVER_DURATION);
  });
  auditTab.addEventListener("focusout", handleFocusOut);

  closeBtn.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();
    hideAuditTab();
  });

  if (isIndexPage()) {
    showAuditTab(INDEX_AUTOSHOW_DURATION);
    scheduleHide(INDEX_AUTOSHOW_DURATION);
  }
})();
