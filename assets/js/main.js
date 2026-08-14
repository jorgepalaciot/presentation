/**
 * Jorge Palacio Tello — site scripts
 * Theme toggle (persisted). Header transparency over full-bleed hero
 * (pages with body[data-has-hero="true"]). Reveal-on-scroll.
 */

(function () {
  "use strict";

  var THEME_KEY = "jpt-theme"; // "light" | "dark"
  var root = document.documentElement;

  function applyStoredTheme() {
    var stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") {
      root.setAttribute("data-theme", stored);
    }
  }

  function currentEffectiveTheme() {
    var stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function toggleTheme() {
    var next = currentEffectiveTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem(THEME_KEY, next);
  }

  applyStoredTheme();

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.querySelector("[data-theme-toggle]");
    if (btn) btn.addEventListener("click", toggleTheme);

    // ---- Reveal on scroll ----
    var targets = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && targets.length) {
      var revealIo = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealIo.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
      );
      targets.forEach(function (el) { revealIo.observe(el); });
    } else {
      targets.forEach(function (el) { el.classList.add("is-visible"); });
    }

    // ---- Transparent header over full-bleed hero ----
    // Only runs on pages that declare <body data-has-hero="true">.
    // The header is transparent + light text while the hero is behind
    // it, and switches to the normal solid/theme-following style the
    // moment the hero has fully scrolled under it.
    var header = document.querySelector(".site-header");
    var hero = document.querySelector(".hero");

    if (header && hero && document.body.getAttribute("data-has-hero") === "true" && "IntersectionObserver" in window) {
      var setHeaderState = function () {
        var headerHeight = header.getBoundingClientRect().height;
        var heroIo = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              header.classList.toggle("is-scrolled", !entry.isIntersecting);
            });
          },
          { rootMargin: "-" + Math.ceil(headerHeight) + "px 0px 0px 0px", threshold: 0 }
        );
        heroIo.observe(hero);
        return heroIo;
      };

      var currentObserver = setHeaderState();

      // Re-measure on resize (header height can change at narrow widths)
      var resizeTimer;
      window.addEventListener("resize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          currentObserver.disconnect();
          currentObserver = setHeaderState();
        }, 200);
      });
    }
  });
})();

