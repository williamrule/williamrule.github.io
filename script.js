/* =========================================================
   William Rule — portfolio
   Vanilla JS. No dependencies, no storage APIs.
   - Footer year
   - Sticky header: compact after scroll (rAF-throttled)
   - Mobile navigation menu (accessible toggle)
   - Active-section highlighting in the nav
   - Figure lightbox with focus management
   ========================================================= */
(function () {
  "use strict";

  var body = document.body;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------------------------------------------------------
     Footer year
     --------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ---------------------------------------------------------
     References used by scroll + nav
     --------------------------------------------------------- */
  var header = document.getElementById("site-header");
  var nav = document.getElementById("primary-nav");
  var navToggle = document.getElementById("nav-toggle");

  // Map section id -> nav link, for active highlighting.
  var sectionIds = ["about", "projects", "experience", "education", "skills", "contact"];
  var linkById = {};
  var sections = [];

  if (nav) {
    var navLinks = nav.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < navLinks.length; i++) {
      var href = navLinks[i].getAttribute("href") || "";
      linkById[href.slice(1)] = navLinks[i];
    }
  }
  for (var s = 0; s < sectionIds.length; s++) {
    var sec = document.getElementById(sectionIds[s]);
    if (sec) sections.push(sec);
  }

  var activeId = null;

  function setActiveLink(id) {
    if (id === activeId) return;
    activeId = id;
    for (var key in linkById) {
      if (Object.prototype.hasOwnProperty.call(linkById, key)) {
        linkById[key].classList.toggle("is-current", key === id);
      }
    }
  }

  function updateActiveSection() {
    if (!sections.length) return;
    // The section whose top has passed a line ~35% down the viewport wins.
    var line = window.pageYOffset + window.innerHeight * 0.35;
    var currentId = sections[0].id;
    for (var k = 0; k < sections.length; k++) {
      var top = sections[k].getBoundingClientRect().top + window.pageYOffset;
      if (top <= line) currentId = sections[k].id;
    }
    // At the very bottom of the page, force the last section active.
    var scrollBottom = window.innerHeight + window.pageYOffset;
    var docHeight = document.documentElement.scrollHeight;
    if (scrollBottom >= docHeight - 2) {
      currentId = sections[sections.length - 1].id;
    }
    setActiveLink(currentId);
  }

  /* ---------------------------------------------------------
     Sticky header + active nav, throttled with rAF
     --------------------------------------------------------- */
  var ticking = false;

  function onScrollFrame() {
    if (header) {
      header.classList.toggle("is-scrolled", window.pageYOffset > 8);
    }
    updateActiveSection();
    ticking = false;
  }

  function requestScrollUpdate() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScrollFrame);
    }
  }

  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate);
  // Initial paint.
  onScrollFrame();

  /* ---------------------------------------------------------
     Mobile navigation menu
     --------------------------------------------------------- */
  function menuIsOpen() {
    return !!nav && nav.classList.contains("is-open");
  }

  function openMenu() {
    if (!nav || !navToggle) return;
    nav.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
    body.classList.add("menu-open");
  }

  function closeMenu() {
    if (!nav || !navToggle) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    // Only release the scroll lock if the lightbox isn't using it.
    if (!lightboxIsOpen()) body.classList.remove("menu-open");
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      if (menuIsOpen()) closeMenu();
      else openMenu();
    });

    // Close the menu when a link is chosen.
    var menuLinks = nav.querySelectorAll("a");
    for (var m = 0; m < menuLinks.length; m++) {
      menuLinks[m].addEventListener("click", closeMenu);
    }

    // Close on click outside the menu.
    document.addEventListener("click", function (e) {
      if (!menuIsOpen()) return;
      if (nav.contains(e.target) || navToggle.contains(e.target)) return;
      closeMenu();
    });

    // Close on Escape.
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menuIsOpen()) closeMenu();
    });

    // If the viewport grows past the mobile breakpoint, reset the menu.
    var desktopQuery = window.matchMedia("(min-width: 861px)");
    var onBreakpoint = function (e) {
      if (e.matches) closeMenu();
    };
    if (typeof desktopQuery.addEventListener === "function") {
      desktopQuery.addEventListener("change", onBreakpoint);
    } else if (typeof desktopQuery.addListener === "function") {
      desktopQuery.addListener(onBreakpoint); // older Safari
    }
  }

  /* ---------------------------------------------------------
     Lightbox for project figures
     --------------------------------------------------------- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");
  var lightboxCap = document.getElementById("lightbox-cap");
  var lightboxClose = document.getElementById("lightbox-close");
  var figureButtons = document.querySelectorAll(".figure");
  var lastFocused = null;

  function lightboxIsOpen() {
    return !!lightbox && lightbox.classList.contains("is-open");
  }

  function onLightboxKey(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      closeLightbox();
      return;
    }
    // Single focusable element inside the dialog: keep focus on Close.
    if (e.key === "Tab") {
      e.preventDefault();
      if (lightboxClose) lightboxClose.focus();
    }
  }

  function openLightbox(btn) {
    if (!lightbox || !lightboxImg) return;
    var full = btn.getAttribute("data-full");
    var caption = btn.getAttribute("data-caption") || "";
    var srcImg = btn.querySelector("img");

    lightboxImg.setAttribute("src", full);
    lightboxImg.setAttribute("alt", srcImg ? srcImg.getAttribute("alt") || "" : "");
    if (lightboxCap) lightboxCap.textContent = caption;

    lastFocused = btn;
    lightbox.hidden = false;
    body.classList.add("menu-open"); // reuse scroll lock

    // Next frame so the opacity/scale transition runs.
    window.requestAnimationFrame(function () {
      lightbox.classList.add("is-open");
    });

    window.setTimeout(function () {
      if (lightboxClose) lightboxClose.focus();
    }, reduceMotion.matches ? 0 : 60);

    document.addEventListener("keydown", onLightboxKey);
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    document.removeEventListener("keydown", onLightboxKey);

    var finish = function () {
      lightbox.hidden = true;
      if (lightboxImg) lightboxImg.setAttribute("src", "");
      if (!menuIsOpen()) body.classList.remove("menu-open");
      if (lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus();
      }
      lastFocused = null;
    };

    if (reduceMotion.matches) {
      finish();
    } else {
      window.setTimeout(finish, 220); // matches CSS transition
    }
  }

  for (var f = 0; f < figureButtons.length; f++) {
    (function (btn) {
      btn.addEventListener("click", function () {
        openLightbox(btn);
      });
    })(figureButtons[f]);
  }

  if (lightbox) {
    var closers = lightbox.querySelectorAll("[data-close]");
    for (var c = 0; c < closers.length; c++) {
      closers[c].addEventListener("click", closeLightbox);
    }
  }
})();
