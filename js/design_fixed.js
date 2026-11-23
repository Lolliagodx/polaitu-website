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

    // Milli Popup Logic
    (function () {
      var milliCard = document.querySelector(".design-project-milli");
      var popup = document.getElementById("milliPopup");
      var overlay = document.getElementById("milliPopupOverlay");
      var closeBtn = document.getElementById("milliPopupClose");
      
      if (!milliCard || !popup) return;

      function openPopup() {
        popup.classList.add("milli-popup--active");
        document.body.style.overflow = "hidden"; // Prevent background scrolling
      }

      function closePopup() {
        popup.classList.remove("milli-popup--active");
        document.body.style.overflow = "";
      }

      milliCard.addEventListener("click", openPopup);
      closeBtn.addEventListener("click", closePopup);
      overlay.addEventListener("click", closePopup);
    })();