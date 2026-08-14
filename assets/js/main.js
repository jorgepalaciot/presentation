/**
 * Site scripts: config injection, theme toggle, reveal-on-scroll, year.
 */
(function () {
  "use strict";

  var THEME_KEY = "jpt-theme";
  var root = document.documentElement;
  var S = window.SITE || {};

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

  function applyConfig() {
    var name = S.name || "";
    var email = S.email || "";
    var linkedin = S.linkedin || "#";
    var photo = S.photo || "";
    var photoSquare = S.photoSquare || "";
    var lang = (document.documentElement.lang || "en").toLowerCase();
    var isES = lang.indexOf("es") === 0;

    document.querySelectorAll("[data-site-name]").forEach(function (el) {
      el.textContent = name;
    });

    document.querySelectorAll("[data-site-email]").forEach(function (el) {
      if (el.tagName === "A") {
        el.href = "mailto:" + email;
      } else {
        el.textContent = email;
      }
    });

    document.querySelectorAll("[data-site-linkedin]").forEach(function (el) {
      if (el.tagName === "A") el.href = linkedin;
    });

    document.querySelectorAll("[data-site-photo]").forEach(function (el) {
      if (el.tagName === "IMG" && photo) el.src = photo;
    });

    document.querySelectorAll("[data-site-photo-square]").forEach(function (el) {
      if (el.tagName === "IMG" && photoSquare) el.src = photoSquare;
    });

    var titleEl = document.querySelector("title");
    if (titleEl && name) {
      var suffix = isES ? (S.titleSuffixES || "") : (S.titleSuffixEN || "");
      titleEl.textContent = suffix ? name + " — " + suffix : name;
    }

    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  applyStoredTheme();

  document.addEventListener("DOMContentLoaded", function () {
    applyConfig();

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