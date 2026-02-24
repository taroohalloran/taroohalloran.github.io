(() => {
  // ---------------- ROUTING ----------------
  function getRouteFromHash() {
    const raw = (location.hash || "#home").replace("#", "").trim();
    if (!raw) return "home";
    return raw;
  }

  function navigate(hash) {
    if (!hash.startsWith("#")) hash = `#${hash}`;
    if (location.hash === hash) {
      render(getRouteFromHash());
      return;
    }
    location.hash = hash;
  }

  // ---------------- TAB BUTTON IMAGES ----------------
  function tabSrc(base, selected, hover) {
    const sel = selected ? "selected" : "notselected";
    const hov = hover ? "hover" : "standard";
    return `${base}-${sel}-${hov}.png`;
  }

  function setTabImage(btn, hover = false) {
    const img = btn.querySelector("img");
    if (!img) return;

    const base = img.dataset.base;
    if (!base) return;

    const selected = btn.getAttribute("aria-current") === "page";
    img.src = tabSrc(base, selected, hover);
  }

  function syncAllTabImages() {
    document.querySelectorAll(".tabImgBtn").forEach((btn) => setTabImage(btn, false));
  }

  function preloadTabImages() {
    const bases = Array.from(document.querySelectorAll(".tabImg"))
      .map((img) => img.dataset.base)
      .filter(Boolean);

    const uniq = [...new Set(bases)];
    const states = [
      ["notselected", "standard"],
      ["notselected", "hover"],
      ["selected", "standard"],
      ["selected", "hover"],
    ];

    uniq.forEach((base) => {
      states.forEach(([sel, hov]) => {
        const i = new Image();
        i.src = `${base}-${sel}-${hov}.png`;
      });
    });
  }

  function setTabs(route) {
    document.querySelectorAll(".tabImgBtn").forEach((btn) => {
      const isActive = btn.dataset.route === route;
      btn.setAttribute("aria-current", isActive ? "page" : "false");
    });

    // No tab selected on home or film detail pages
    if (route === "home" || route.startsWith("film/")) {
      document.querySelectorAll(".tabImgBtn").forEach((btn) =>
        btn.setAttribute("aria-current", "false")
      );
    }

    syncAllTabImages();
  }

  // ---------------- HEADER STATE ----------------
  function setHeaderState(route) {
    document.body.classList.remove(
      "route-home",
      "route-films",
      "route-about",
      "route-contact",
      "route-film"
    );

    if (route === "home") document.body.classList.add("route-home");
    else if (route === "films") document.body.classList.add("route-films");
    else if (route === "about") document.body.classList.add("route-about");
    else if (route === "contact") document.body.classList.add("route-contact");
    else if (route.startsWith("film/")) document.body.classList.add("route-film");
  }

  // ---------------- PAGES ----------------
  function pageHome() {
    return `
      <section class="page pageHome" data-page="home">
        <div class="homeFrame">
          <!-- Your homepage image layout lives in HTML/CSS -->
        </div>
      </section>
    `;
  }

  function pageFilms() {
    return `
      <section class="page pageFilms" data-page="films">
        <div class="filmsGrid">
          <a class="filmCard" href="#film/humanzee">
            <img class="filmLogo filmLogo--humanzee" src="logos/Humanzee.png" alt="Humanzee" />
          </a>

          <a class="filmCard" href="#film/rendezvous">
            <img class="filmLogo" src="logos/Rendezvous.png" alt="Rendezvous" />
          </a>

          <a class="filmCard" href="#film/uap">
            <img class="filmLogo" src="logos/UAP.png" alt="UAP" />
          </a>

          <a class="filmCard" href="#film/do-dragons-sleep">
            <img class="filmLogo" src="logos/Do-Dragons-Sleep-in-Fictitious-Caves.png" alt="Do Dragons Sleep in Fictitious Caves?" />
          </a>

          <a class="filmCard" href="#film/whispers-of-the-aspens">
            <img class="filmLogo filmLogo--aspens" src="logos/The-Whispers-of-the-Aspens.png" alt="The Whispers of the Aspens" />
          </a>
        </div>
      </section>
    `;
  }

  function pageAbout() {
    return `
      <section class="page pageAbout" data-page="about">
        <div class="aboutWrap">
          <div class="aboutPhoto">
            <img src="about/taro.jpg" alt="Taro O’Halloran" />
          </div>
          <div class="aboutText">
            <h2>About</h2>
            <p>Replace this with your bio text.</p>
          </div>
        </div>
      </section>
    `;
  }

  function pageContact() {
    return `
      <section class="page pageContact" data-page="contact">
        <div class="contactWrap">
          <h2>Contact</h2>
          <p>Email: <a href="mailto:you@example.com">you@example.com</a></p>
          <p>Instagram: <a href="https://instagram.com/" target="_blank">@handle</a></p>
          <p>YouTube: <a href="https://youtube.com/" target="_blank">Channel</a></p>
        </div>
      </section>
    `;
  }

  function pageFilmDetail(slug) {
    const titleMap = {
      "humanzee": "Humanzee",
      "rendezvous": "Rendezvous",
      "uap": "UAP",
      "do-dragons-sleep": "Do Dragons Sleep in Fictitious Caves?",
      "whispers-of-the-aspens": "The Whispers of the Aspens",
    };
    const title = titleMap[slug] || "Film";

    return `
      <section class="page pageFilmDetail" data-page="film">
        <div class="filmDetailWrap">
          <h2>${title}</h2>
          <p>Film detail page content goes here.</p>
          <p><a href="#films">← Back to Films</a></p>
        </div>
      </section>
    `;
  }

  function resolvePage(route) {
    if (route === "home") return pageHome();
    if (route === "films") return pageFilms();
    if (route === "about") return pageAbout();
    if (route === "contact") return pageContact();
    if (route.startsWith("film/")) {
      const slug = route.split("/")[1] || "";
      return pageFilmDetail(slug);
    }
    return pageHome();
  }

  // ---------------- RENDER ----------------
  function render(route) {
    setHeaderState(route);
    setTabs(route);

    const app = document.getElementById("app");
    if (!app) return;

    app.classList.add("appFading");
    setTimeout(() => {
      app.innerHTML = resolvePage(route);
      bindInternalLinks(app);

      requestAnimationFrame(() => {
        app.classList.remove("appFading");
      });
    }, 120);
  }

  // ---------------- EVENTS ----------------
  function bindHeaderEvents(root = document) {
    const title = root.getElementById("siteTitle");
    if (title) {
      title.addEventListener("click", (e) => {
        e.preventDefault();
        navigate("#home");
      });
    }

    root.querySelectorAll(".tabImgBtn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        navigate(`#${btn.dataset.route}`);
      });

      btn.addEventListener("mouseenter", () => setTabImage(btn, true));
      btn.addEventListener("mouseleave", () => setTabImage(btn, false));
    });
  }

  function bindInternalLinks(scope = document) {
    scope.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        navigate(a.getAttribute("href"));
      });
    });
  }

  // ---------------- INIT ----------------
  function init() {
    preloadTabImages();
    syncAllTabImages();
    bindHeaderEvents(document);
    bindInternalLinks(document);

    window.addEventListener("hashchange", () => {
      render(getRouteFromHash());
    });

    render(getRouteFromHash());
  }

  document.addEventListener("DOMContentLoaded", init);
})();
