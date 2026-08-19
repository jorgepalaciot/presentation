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
    //
    // Deliberately scroll-position based rather than an
    // IntersectionObserver with a dynamic rootMargin: that approach
    // measured header height before layout/fonts had fully settled,
    // which could mark the header "scrolled" immediately on load —
    // the header would then show the solid theme color instead of
    // blending with the hero. Comparing the hero's actual bottom edge
    // against the header height on every scroll tick is simpler and
    // always correct, regardless of load timing.
    var header = document.querySelector(".site-header");
    var hero = document.querySelector(".hero");

    if (header && hero && document.body.getAttribute("data-has-hero") === "true") {
      var updateHeaderScrollState = function () {
        var headerHeight = header.getBoundingClientRect().height;
        var heroBottom = hero.getBoundingClientRect().bottom;
        header.classList.toggle("is-scrolled", heroBottom <= headerHeight);
      };
      updateHeaderScrollState();
      window.addEventListener("scroll", updateHeaderScrollState, { passive: true });
      window.addEventListener("resize", updateHeaderScrollState);
    }

    // ---- Mobile nav (hamburger) ----
    var navToggle = document.querySelector("[data-nav-toggle]");
    var mobileNav = document.getElementById("mobileNav");

    if (navToggle && mobileNav) {
      var closeMobileNav = function () {
        mobileNav.hidden = true;
        navToggle.setAttribute("aria-expanded", "false");
      };
      var openMobileNav = function () {
        mobileNav.hidden = false;
        navToggle.setAttribute("aria-expanded", "true");
      };

      navToggle.addEventListener("click", function () {
        var isOpen = navToggle.getAttribute("aria-expanded") === "true";
        if (isOpen) closeMobileNav(); else openMobileNav();
      });

      mobileNav.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", closeMobileNav);
      });

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeMobileNav();
      });

      document.addEventListener("click", function (e) {
        if (!mobileNav.hidden && !mobileNav.contains(e.target) && !navToggle.contains(e.target)) {
          closeMobileNav();
        }
      });

      window.addEventListener("resize", function () {
        if (window.innerWidth > 720) closeMobileNav();
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

// ---- WhatsApp floating button (site-wide, language-aware) ----
(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", function () {
    var lang = document.documentElement.lang === "es" ? "es" : "en";
    var msg = lang === "es"
      ? "Hola Jorge, vi tu web y me gustaría conversar contigo."
      : "Hi Jorge, I saw your website and would like to get in touch.";

    var a = document.createElement("a");
    a.href = "https://wa.me/51912000480?text=" + encodeURIComponent(msg);
    a.className = "whatsapp-float";
    a.target = "_blank";
    a.rel = "noopener";
    a.setAttribute("aria-label", lang === "es" ? "Escríbeme por WhatsApp" : "Message me on WhatsApp");
    a.innerHTML = '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.386.697 4.607 1.902 6.481L4 29l7.72-1.86A11.93 11.93 0 0 0 16.001 27C22.629 27 28 21.627 28 15S22.629 3 16.001 3zm0 21.818a9.77 9.77 0 0 1-4.98-1.363l-.357-.213-4.582 1.104 1.127-4.462-.233-.366A9.77 9.77 0 0 1 6.182 15c0-5.42 4.4-9.818 9.82-9.818 5.42 0 9.818 4.398 9.818 9.818 0 5.42-4.398 9.818-9.819 9.818zm5.386-7.35c-.295-.148-1.746-.862-2.017-.96-.271-.099-.469-.148-.666.148-.198.296-.766.96-.94 1.157-.173.198-.346.222-.641.074-.295-.148-1.246-.459-2.373-1.463-.877-.782-1.469-1.748-1.641-2.043-.173-.296-.019-.456.13-.603.133-.132.296-.346.444-.518.148-.173.198-.296.296-.494.099-.198.05-.37-.025-.518-.074-.148-.666-1.605-.913-2.198-.24-.578-.485-.5-.666-.51l-.567-.01c-.198 0-.518.074-.79.37-.271.297-1.037 1.014-1.037 2.472s1.062 2.867 1.21 3.065c.148.198 2.088 3.19 5.06 4.472.707.305 1.259.487 1.689.623.71.226 1.356.194 1.867.118.57-.085 1.746-.714 1.993-1.403.247-.69.247-1.28.173-1.403-.074-.123-.271-.198-.567-.346z"/></svg>';

    document.body.appendChild(a);
  });
})();
