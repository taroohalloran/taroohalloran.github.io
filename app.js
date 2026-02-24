(() => {
  const $ = (s) => document.querySelector(s);

  // ---- Views (your existing structure) ----
  const viewHome = $("#view-home");
  const viewFilms = $("#view-films");
  const viewAbout = $("#view-about");
  const viewContact = $("#view-contact");
  const viewFilm = $("#view-film");     // optional
  const viewError = $("#view-error");   // optional

  function showOnly(viewEl) {
    const all = [viewHome, viewFilms, viewAbout, viewContact, viewFilm, viewError].filter(Boolean);
    all.forEach(v => {
      v.hidden = v !== viewEl;
      v.classList.toggle("is-active", v === viewEl);
    });
  }

  // ---- Route parsing ----
  function getRoute() {
    const h = (location.hash || "#home").replace("#", "").trim();
    return h || "home";
  }

  function setRouteClass(route) {
    document.body.classList.remove("route-home", "route-films", "route-about", "route-contact", "route-film");

    if (route === "home") document.body.classList.add("route-home");
    else if (route === "films") document.body.classList.add("route-films");
    else if (route === "about") document.body.classList.add("route-about");
    else if (route === "contact") document.body.classList.add("route-contact");
    else if (route.startsWith("film/")) document.body.classList.add("route-film");
  }

  // ---- Button image swapping (4 states) ----
  function tabSrc(base, selected, hover) {
    const sel = selected ? "selected" : "notselected";
    const hov = hover ? "hover" : "standard";
    return `${base}-${sel}-${hov}.png`;
  }

  function setTabImage(btn, hover = false) {
    const img = btn.querySelector("img.tabImg");
    if (!img) return;

    const base = img.dataset.base;
    if (!base) return;

    const selected = btn.getAttribute("aria-current") === "page";
    img.src = tabSrc(base, selected, hover);
  }

  function syncAllTabImages() {
    document.querySelectorAll(".tabImgBtn").forEach(btn => setTabImage(btn, false));
  }

  function preloadTabImages() {
    const imgs = Array.from(document.querySelectorAll("img.tabImg"));
    const bases = [...new Set(imgs.map(i => i.dataset.base).filter(Boolean))];

    const states = [
      ["notselected","standard"],
      ["notselected","hover"],
      ["selected","standard"],
      ["selected","hover"],
    ];

    bases.forEach(base => {
      states.forEach(([sel, hov]) => {
        const im = new Image();
        im.src = `${base}-${sel}-${hov}.png`;
      });
    });
  }

  function setTabs(route) {
    // highlight exact match (films/about/contact)
    document.querySelectorAll(".tabImgBtn").forEach(btn => {
      const active = btn.dataset.route === route;
      btn.setAttribute("aria-current", active ? "page" : "false");
    });

    // home + film detail pages: no tab active
    if (route === "home" || route.startsWith("film/")) {
      document.querySelectorAll(".tabImgBtn").forEach(btn => btn.setAttribute("aria-current","false"));
    }

    syncAllTabImages();
  }

  // ---- Navigation ----
  function navigate(hash) {
    if (!hash.startsWith("#")) hash = `#${hash}`;
    if (location.hash === hash) {
      handleRoute();
      return;
    }
    location.hash = hash;
  }

  function handleRoute() {
    const route = getRoute();
    setRouteClass(route);
    setTabs(route);

    if (route === "home") { showOnly(viewHome); return; }
    if (route === "films") { showOnly(viewFilms); return; }
    if (route === "about") { showOnly(viewAbout); return; }
    if (route === "contact") { showOnly(viewContact); return; }

    if (route.startsWith("film/") && viewFilm) {
      showOnly(viewFilm);
      return;
    }

    // fallback
    if (viewError) {
      showOnly(viewError);
    } else {
      showOnly(viewHome);
    }
  }

  // ---- Hover behavior for tabs (swap to hover assets) ----
  function bindTabHoverSwap() {
    document.querySelectorAll(".tabImgBtn").forEach(btn => {
      btn.addEventListener("mouseenter", () => setTabImage(btn, true));
      btn.addEventListener("mouseleave", () => setTabImage(btn, false));
      // keyboard focus support
      btn.addEventListener("focus", () => setTabImage(btn, true));
      btn.addEventListener("blur", () => setTabImage(btn, false));
    });
  }

  // ---- Click handling (event delegation = robust when clicking images) ----
  function bindClicks() {
    document.addEventListener("click", (e) => {
      const tabBtn = e.target.closest(".tabImgBtn");
      if (tabBtn) {
        e.preventDefault();
        navigate(`#${tabBtn.dataset.route}`);
        return;
      }

      const homeLink = e.target.closest("#homeLink");
      if (homeLink) {
        e.preventDefault();
        navigate("#home");
        return;
      }

      // allow film tiles to work if they are links like <a href="#film/humanzee">
      const hashLink = e.target.closest('a[href^="#"]');
      if (hashLink) {
        const href = hashLink.getAttribute("href");
        if (href) {
          e.preventDefault();
          navigate(href);
          return;
        }
      }
    });
  }

  // ---- Init ----
  function init() {
    // If the <img> has no src initially, set it to notselected-standard
    document.querySelectorAll(".tabImgBtn img.tabImg").forEach(img => {
      if (!img.getAttribute("src")) {
        const base = img.dataset.base;
        if (base) img.src = `${base}-notselected-standard.png`;
      }
    });

    preloadTabImages();
    syncAllTabImages();
    bindTabHoverSwap();
    bindClicks();

    if (!location.hash) history.replaceState(null, "", "#home");
    handleRoute();
    window.addEventListener("hashchange", handleRoute);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
