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
    "berkeley-2026": {
      photos: ["assets/races/berkeley-half-2026.jpg"],
      note: "Finally PRed in the half... Honestly was not feeling too hot and was gonna pace Angela. First half mile it felt so great that I sent it. I was pushing it every mile but also having so much fun every mile. Great energy, glad I did this race as a Berkeley alum. GO BEARS!"
    },
    "napa-2026": {
      photos: ["assets/races/napa-valley-marathon-2026.jpg"],
      note: "HUGE PR! Stuck with the 3:30 pacers all the way through and had a huge kick at the end. Great photos as well."
    },
    "golden-gate-2025": {
      photos: ["assets/races/golden-gate-half-2025.jpg"],
      note: "Pacing Chloe, fun run!"
    },
    "lake-tahoe-2025": {
      photos: ["assets/races/lake-tahoe-marathon-2025.jpg"],
      note: "FIRST MARATHON! Proud I finished, 1st in age group, 24th overall. Beautiful view of Lake Tahoe."
    },
    "sf-hm-2025": {
      photos: ["assets/races/sf-half-marathon-2025.jpg"],
      note: "I was sick, the course was so windy and rainy, living hell."
    },
    "berkeley-10k-2024": {
      photos: ["assets/races/berkeley-10k-2024.jpg"],
      note: "Fun race with Vishal."
    },
    "golden-gate-2024": {
      photos: ["assets/races/golden-gate-half-2024.jpg"],
      note: "FIRST HALF MARATHON! Ran it alone, but super nice course with a great view of the GGB."
    },
    "lake-union-10k-2024": {
      photos: ["assets/races/lake-union-10k-2024.jpg"],
      note: "Good race with Randy! Bye bye Seattle, and thank you for getting me back into running."
    }
  };

  var titleEl = document.getElementById("rmTitle");
  var albumEl = document.getElementById("rmAlbum");
  var noteEl = document.getElementById("rmNote");
  var statsEl = document.getElementById("rmStats");
  var closeBtn = document.getElementById("rmClose");
  var lastFocus = null;

  // Album state (module-scoped so arrow keys can drive it)
  var trackEl = null, dotsEl = null, controlsEl = null, albumIndex = 0;

  function placeholderSlide() {
    var fig = document.createElement("figure");
    fig.className = "album__slide race__photo race__photo--empty";
    return fig;
  }

  function makeSlide(src, alt) {
    var fig = document.createElement("figure");
    fig.className = "album__slide race__photo race__photo--empty";
    var img = document.createElement("img");
    img.alt = alt;
    img.decoding = "async";
    img.addEventListener("load", function () { fig.classList.remove("race__photo--empty"); });
    // A photo that isn't there yet drops its own slide, so listing not-yet-added
    // filenames is harmless — only real photos show up in the album.
    img.addEventListener("error", function () { removeSlide(fig); });
    img.src = src;
    fig.appendChild(img);
    return fig;
  }

  function removeSlide(fig) {
    if (!trackEl || !fig.parentNode) return;
    trackEl.removeChild(fig);
    if (trackEl.children.length === 0) trackEl.appendChild(placeholderSlide());
    renderDots();
    showSlide(albumIndex);
  }

  function renderDots() {
    if (!dotsEl) return;
    var n = trackEl.children.length;
    dotsEl.innerHTML = "";
    for (var i = 0; i < n; i++) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "album__dot";
      b.setAttribute("aria-label", "Photo " + (i + 1));
      (function (idx) { b.addEventListener("click", function () { showSlide(idx); }); })(i);
      dotsEl.appendChild(b);
    }
    controlsEl.style.display = n > 1 ? "" : "none";
  }

  function showSlide(i) {
    var n = trackEl.children.length;
    if (n === 0) return;
    albumIndex = (i + n) % n;
    trackEl.style.transform = "translateX(" + (-albumIndex * 100) + "%)";
    var dots = dotsEl.children;
    for (var d = 0; d < dots.length; d++) {
      dots[d].setAttribute("aria-current", d === albumIndex ? "true" : "false");
    }
  }

  function buildAlbum(photos, name) {
    albumEl.innerHTML =
      '<p class="rmodal__h">Photos</p>' +
      '<div class="album"><div class="album__viewport"><div class="album__track"></div></div>' +
      '<div class="album__controls">' +
      '<button type="button" class="album__nav album__prev" aria-label="Previous photo">&lsaquo;</button>' +
      '<div class="album__dots"></div>' +
      '<button type="button" class="album__nav album__next" aria-label="Next photo">&rsaquo;</button>' +
      "</div></div>";
    trackEl = albumEl.querySelector(".album__track");
    dotsEl = albumEl.querySelector(".album__dots");
    controlsEl = albumEl.querySelector(".album__controls");
    albumIndex = 0;

    if (photos && photos.length) {
      photos.forEach(function (src) { trackEl.appendChild(makeSlide(src, name + " photo")); });
    } else {
      trackEl.appendChild(placeholderSlide());
    }
    albumEl.querySelector(".album__prev").addEventListener("click", function () { showSlide(albumIndex - 1); });
    albumEl.querySelector(".album__next").addEventListener("click", function () { showSlide(albumIndex + 1); });
    renderDots();
    showSlide(0);
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
  // Left/right arrow keys slide through the album when it has more than one photo.
  modal.addEventListener("keydown", function (e) {
    if (!trackEl || trackEl.children.length < 2) return;
    if (e.key === "ArrowRight") { e.preventDefault(); showSlide(albumIndex + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); showSlide(albumIndex - 1); }
  });
})();
