/* Andy Kim — personal site: small progressive enhancements, no dependencies. */
(function () {
  "use strict";

  // Current year in the footer
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile menu toggle
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("mobileMenu");
  if (toggle && menu) {
    var closeMenu = function () {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    };
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }

  // Reveal sections on scroll (respects reduced-motion via CSS fallback)
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var targets = document.querySelectorAll(".section, .hero__inner");
  if (reduce || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }
  targets.forEach(function (el) { el.classList.add("reveal"); });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  targets.forEach(function (el) { io.observe(el); });
})();

/* Race detail modal: slidable photo album + note + stats */
(function () {
  "use strict";

  var modal = document.getElementById("raceModal");
  if (!modal || typeof modal.showModal !== "function") return;

  // Per-race album photos + note. Add more filenames to a photos array for a
  // multi-photo album; leave note empty to show the placeholder prompt.
  var RACE_DETAILS = {
    "golden-gate-2024": { photos: ["assets/races/golden-gate-half-2024.jpg"], note: "" },
    "lake-tahoe-2025":  { photos: ["assets/races/lake-tahoe-marathon-2025.jpg"], note: "" },
    "napa-2026":        { photos: ["assets/races/napa-valley-marathon-2026.jpg"], note: "" },
    "berkeley-2026":    { photos: ["assets/races/berkeley-half-2026.jpg"], note: "" }
  };

  var titleEl = document.getElementById("rmTitle");
  var albumEl = document.getElementById("rmAlbum");
  var noteEl = document.getElementById("rmNote");
  var statsEl = document.getElementById("rmStats");
  var closeBtn = document.getElementById("rmClose");
  var lastFocus = null;

  function esc(s) { return String(s).replace(/"/g, "&quot;"); }

  function slideHTML(src, alt) {
    return '<figure class="album__slide race__photo race__photo--empty">' +
      '<img src="' + esc(src) + '" alt="' + esc(alt) + '" ' +
      "onload=\"this.closest('.race__photo').classList.remove('race__photo--empty')\" " +
      "onerror=\"this.closest('.race__photo').classList.add('race__photo--empty'); this.remove();\" />" +
      "</figure>";
  }

  function buildAlbum(photos, name) {
    if (!photos || !photos.length) photos = [""];
    var slides = photos.map(function (src) { return slideHTML(src, name + " photo"); }).join("");
    var controls = "";
    if (photos.length > 1) {
      var dots = photos.map(function (_, i) {
        return '<button class="album__dot" data-i="' + i + '" aria-label="Photo ' + (i + 1) + '"' +
          (i === 0 ? ' aria-current="true"' : "") + "></button>";
      }).join("");
      controls =
        '<div class="album__controls">' +
        '<button type="button" class="album__nav album__prev" aria-label="Previous photo">&lsaquo;</button>' +
        '<div class="album__dots">' + dots + "</div>" +
        '<button type="button" class="album__nav album__next" aria-label="Next photo">&rsaquo;</button>' +
        "</div>";
    }
    albumEl.innerHTML =
      '<p class="rmodal__h">Photos</p>' +
      '<div class="album" data-index="0"><div class="album__viewport"><div class="album__track">' +
      slides + "</div></div>" + controls + "</div>";
    wireAlbum();
  }

  function wireAlbum() {
    var album = albumEl.querySelector(".album");
    if (!album) return;
    var track = album.querySelector(".album__track");
    var slides = album.querySelectorAll(".album__slide");
    var dots = album.querySelectorAll(".album__dot");
    var n = slides.length;
    function go(i) {
      i = (i + n) % n;
      album.dataset.index = i;
      track.style.transform = "translateX(" + (-i * 100) + "%)";
      dots.forEach(function (d, di) { d.setAttribute("aria-current", di === i ? "true" : "false"); });
    }
    var prev = album.querySelector(".album__prev");
    var next = album.querySelector(".album__next");
    if (prev) prev.addEventListener("click", function () { go(+album.dataset.index - 1); });
    if (next) next.addEventListener("click", function () { go(+album.dataset.index + 1); });
    dots.forEach(function (d) { d.addEventListener("click", function () { go(+d.dataset.i); }); });
  }

  function openRace(card) {
    var id = card.getAttribute("data-race");
    var details = RACE_DETAILS[id] || {};
    var nameEl = card.querySelector(".race__name");
    var name = nameEl ? nameEl.textContent.trim() : "Race";
    titleEl.textContent = name;

    buildAlbum(details.photos, name);

    if (details.note && details.note.trim()) {
      var paras = details.note.trim().split(/\n\n+/).map(function (p) { return "<p>" + p + "</p>"; }).join("");
      noteEl.innerHTML = '<p class="rmodal__h">How it went</p>' + paras;
    } else {
      noteEl.innerHTML = '<p class="rmodal__h">How it went</p>' +
        '<p class="rmodal__placeholder">Race notes coming soon &mdash; how it went, how I felt, and what I\u2019d do differently.</p>';
    }

    statsEl.innerHTML = '<p class="rmodal__h">Stats</p>';
    var dl = card.querySelector(".race__stats");
    if (dl) statsEl.appendChild(dl.cloneNode(true));
    var results = card.getAttribute("data-results");
    if (results) {
      var a = document.createElement("a");
      a.className = "rmodal__results";
      a.href = results;
      a.target = "_blank";
      a.rel = "noopener";
      a.innerHTML = "View official results &rarr;";
      statsEl.appendChild(a);
    }

    lastFocus = card;
    modal.showModal();
    closeBtn.focus();
  }

  function closeModal() {
    modal.close();
  }

  document.querySelectorAll(".race[data-race]").forEach(function (card) {
    card.addEventListener("click", function () { openRace(card); });
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openRace(card); }
    });
  });

  closeBtn.addEventListener("click", closeModal);
  // Click on the backdrop (the dialog element itself, outside its content) closes it.
  modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
  modal.addEventListener("close", function () { if (lastFocus) lastFocus.focus(); });
})();
