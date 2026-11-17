(function () {
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#site-nav");

  function closeNav(restoreFocus) {
    if (!nav || !nav.classList.contains("is-open")) return;
    const focusInside = nav.contains(document.activeElement);
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    if (restoreFocus || focusInside) navToggle.focus();
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      const open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav(true);
    });

    document.addEventListener("click", function (event) {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(event.target) || navToggle.contains(event.target)) return;
      closeNav(false);
    });
  }

  function focusHashTarget() {
    const id = location.hash.slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    const heading = target.matches("h1, h2, h3") ? target : target.querySelector("h1, h2, h3");
    if (!heading) return;

    // Wait until the fragment's own scroll has settled, then move focus
    // without scrolling again. Focusing immediately cancels that scroll.
    let last = null;
    let stableFrames = 0;
    const started = performance.now();
    function settle() {
      const y = window.scrollY;
      stableFrames = last !== null && Math.abs(y - last) < 0.5 ? stableFrames + 1 : 0;
      last = y;
      if (stableFrames >= 4 || performance.now() - started > 1200) {
        if (document.activeElement !== heading) heading.focus({ preventScroll: true });
        return;
      }
      window.requestAnimationFrame(settle);
    }
    window.requestAnimationFrame(settle);
  }

  window.addEventListener("hashchange", focusHashTarget);
  focusHashTarget();
})();
