// ==========================================================================
// Abdullah Al Zisan — Personal Website
// Nav scroll state, mobile menu, scroll-spy, hero constellation parallax,
// and the footer year.
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

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- footer year ---- */
  if (yearEl) {
    var y = new Date().getFullYear();
    yearEl.textContent = "© " + y + " Abdullah Al Zisan";
  }

  /* ---- nav background on scroll ---- */
  function onScroll() {
    if (window.scrollY > 40) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- mobile menu toggle ---- */
  function closeMenu() {
    navToggle.classList.remove("open");
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
  function toggleMenu() {
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
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ---- scroll-spy: highlight the nav link for the section in view ---- */
  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.getAttribute("id");
          links.forEach(function (link) {
            var match = link.getAttribute("href") === "#" + id;
            link.classList.toggle("active", match);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (section) {
      spy.observe(section);
    });
  }

  /* ---- subtle parallax tilt on the hero constellation (desktop only) ---- */
  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (mark && canHover && !reduceMotion) {
    var wrap = mark.closest(".mark-wrap");
    var rect;
    var raf = null;

    function updateRect() {
      rect = wrap.getBoundingClientRect();
    }
    updateRect();
    window.addEventListener("resize", updateRect);

    document.addEventListener("mousemove", function (e) {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        var relX = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
        var relY = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
        var rx = Math.max(-1, Math.min(1, relY)) * -6;
        var ry = Math.max(-1, Math.min(1, relX)) * 6;
        mark.style.transform =
          "perspective(700px) rotateX(" + rx + "deg) rotateY(" + ry + "deg)";
        raf = null;
      });
    });
  }
})();

