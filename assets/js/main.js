/**
 * Jorge Palacio Tello — site scripts
 * Theme toggle (persisted). Header transparency over full-bleed hero
 * (pages with body[data-has-hero="true"]). Reveal-on-scroll.
 * Article pages: reading-progress bar + auto-generated table of contents.
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

    // ---- Article pages: reading progress + auto table of contents ----
    // Only runs where the markup exists (post pages). The TOC is built
    // from the article's real <h2> elements — never hardcoded — so it
    // can't drift out of sync with the actual (sometimes unfinished)
    // content.
    var article = document.querySelector("article.prose");
    var progressBar = document.getElementById("readingProgress");

    if (article && progressBar) {
      var updateProgress = function () {
        var rect = article.getBoundingClientRect();
        var total = rect.height - window.innerHeight;
        var scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 0));
        var pct = total > 0 ? (scrolled / total) * 100 : 0;
        progressBar.style.width = pct + "%";
      };
      window.addEventListener("scroll", updateProgress, { passive: true });
      window.addEventListener("resize", updateProgress);
      updateProgress();
    }

    var tocNav = document.getElementById("toc");

    if (article && tocNav) {
      var headings = article.querySelectorAll("h2");

      if (headings.length) {
        var usedIds = {};
        headings.forEach(function (h, i) {
          if (!h.id) {
            var slug = h.textContent
              .toLowerCase()
              .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
              .replace(/[^a-z0-9\s-]/g, "")
              .trim()
              .replace(/\s+/g, "-") || ("section-" + i);
            if (usedIds[slug]) slug += "-" + i;
            usedIds[slug] = true;
            h.id = slug;
          }
          var a = document.createElement("a");
          a.href = "#" + h.id;
          a.textContent = h.textContent;
          tocNav.appendChild(a);
        });

        if ("IntersectionObserver" in window) {
          var headingIo = new IntersectionObserver(
            function (entries) {
              entries.forEach(function (entry) {
                var link = tocNav.querySelector('a[href="#' + entry.target.id + '"]');
                if (link) link.classList.toggle("active", entry.isIntersecting);
              });
            },
            { rootMargin: "-20% 0px -70% 0px" }
          );
          headings.forEach(function (h) { headingIo.observe(h); });
        }
      } else {
        var railCard = tocNav.closest(".tick-card");
        if (railCard) railCard.style.display = "none";
      }
    }
  });
})();
