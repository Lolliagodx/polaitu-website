const fs = require('fs');
const path = require('path');

const files = ['index.html', 'company.html', 'video.html', 'smm.html'];
const popupHTML = 

    <!-- CALC POPUP -->
    <div class="calc-popup" id="calcPopup">
      <div class="calc-popup__overlay" id="calcPopupOverlay"></div>
      <div class="calc-popup__content">
        <button class="calc-popup__close" id="calcPopupClose" aria-label="Закрыть">&times;</button>
        <div class="calc-popup__inner"></div>
      </div>
    </div>
  </div>;

const popupJS = 
    // Generic Popup Logic
    (function () {
      var popupTriggers = document.querySelectorAll("[data-popup-target]");

      popupTriggers.forEach(function (trigger) {
        trigger.addEventListener("click", function () {
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
;

for (let file of files) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');

    // 1. Update button
    content = content.replace(/<button class="project-btn" type="button">/g, '<button class="project-btn" type="button" data-popup-target="calcPopup">');

    // 2. Add popup HTML
    if (!content.includes('id="calcPopup"')) {
        content = content.replace(/<\/div>\s*<script>/g, popupHTML + '\n\n  <script>');
    }

    // 3. Add generic popup JS if missing
    if (!content.includes('Generic Popup Logic')) {
        content = content.replace(/<\/body>/, popupJS + '\n</body>');
    }

    fs.writeFileSync(file, content);
    console.log('Fixed ' + file);
}
