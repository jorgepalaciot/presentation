/**
 * Jorge Palacio Tello — site scripts
 * Theme toggle (persisted). Language is handled by static pages
 * under /es/ and /en/ — this file manages the manual theme
 * override plus reveal-on-scroll.
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

    var targets = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && targets.length) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
      );
      targets.forEach(function (el) { io.observe(el); });
    } else {
      targets.forEach(function (el) { el.classList.add("is-visible"); });
    }
  });
})();
