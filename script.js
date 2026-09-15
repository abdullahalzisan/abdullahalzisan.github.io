// ==========================================================================
// Abdullah Al Zisan — Personal Website
// Navigation, mobile menu, scroll-spy, reveal animations,
// constellation parallax, and footer year.
// ==========================================================================

(function () {
  "use strict";

  var nav = document.getElementById("nav");
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  var links = navLinks ? navLinks.querySelectorAll("a") : [];
  var sections = document.querySelectorAll("main section[id]");
  var yearEl = document.getElementById("year");
  var mark = document.getElementById("constellation");

  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---- footer year ---- */
  if (yearEl) {
    yearEl.textContent = "© " + new Date().getFullYear() + " Abdullah Al Zisan";
  }

  /* ---- nav background on scroll ---- */
  function onScroll() {
    if (!nav) return;

    if (window.scrollY > 40) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- mobile menu ---- */
  function closeMenu() {
    if (navToggle) {
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }

    if (navLinks) {
      navLinks.classList.remove("open");
    }
  }

  function toggleMenu() {
    if (!navLinks || !navToggle) return;

    var isOpen = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  }

  if (navToggle) {
    navToggle.addEventListener("click", toggleMenu);
  }

  links.forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  /* ---- scroll-spy ---- */
  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          var id = entry.target.getAttribute("id");

          links.forEach(function (link) {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === "#" + id
            );
          });
        });
      },
      {
        rootMargin: "-45% 0px -50% 0px",
        threshold: 0
      }
    );

    sections.forEach(function (section) {
      spy.observe(section);
    });
  }

  /* ---- smooth entrance animations for content sections ---- */
  var revealTargets = document.querySelectorAll(
    "#about .about-text, " +
    "#about .portrait, " +
    "#focus .focus-row, " +
    "#identity .identity-inner > *, " +
    "#social .social-tile, " +
    "#projects .project-entry, " +
    "#vision .vision-inner > *, " +
    "#contact > *, " +
    "footer > *"
  );

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach(function (element) {
      element.classList.add("is-visible");
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealTargets.forEach(function (element) {
      element.classList.add("js-reveal");
      revealObserver.observe(element);
    });
  }

  /* ---- subtle parallax tilt on the hero constellation (desktop only) ---- */
  var canHover = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  if (mark && canHover && !reduceMotion) {
    var wrap = mark.closest(".mark-wrap");
    var rect = null;
    var raf = null;

    if (wrap) {
      function updateRect() {
        rect = wrap.getBoundingClientRect();
      }

      updateRect();
      window.addEventListener("resize", updateRect);

      document.addEventListener("mousemove", function (event) {
        if (raf || !rect) return;

        raf = requestAnimationFrame(function () {
          var relX =
            (event.clientX - (rect.left + rect.width / 2)) /
            Math.max(rect.width, 1);

          var relY =
            (event.clientY - (rect.top + rect.height / 2)) /
            Math.max(rect.height, 1);

          var rx = Math.max(-1, Math.min(1, relY)) * -5;
          var ry = Math.max(-1, Math.min(1, relX)) * 5;

          mark.style.transform =
            "perspective(700px) rotateX(" +
            rx +
            "deg) rotateY(" +
            ry +
            "deg)";

          raf = null;
        });
      });

      wrap.addEventListener("mouseleave", function () {
        mark.style.transform =
          "perspective(700px) rotateX(0deg) rotateY(0deg)";
      });
    }
  }
})();
