// app.js — full file (drop-in replacement)

const $ = (s) => document.querySelector(s);

/**
 * All data is embedded to avoid GitHub Pages path/JSON issues.
 * Paths are case-sensitive on GitHub Pages.
 *
 * Expected files (examples):
 * - assets/branding/taro-name.png
 * - assets/films/humanzee/humanzee-logo.png
 * - assets/films/rendezvous/rendezvous-logo.png
 * - assets/films/uap/uap-logo.png
 * - assets/films/dragons/do-dragons-sleep-in-fictitious-caves-logo.png
 * - assets/films/aspens/the-whispers-of-the-aspens-logo.png
 * - assets/stills/tile-*.jpg
 */
const SITE = {
  home: {
    hero: "assets/stills/home-center.jpg",
    left: ["assets/stills/home-left-1.jpg", "assets/stills/home-left-2.jpg"],
    right: ["assets/stills/home-right-1.jpg", "assets/stills/home-right-2.jpg"]
  },

  about: {
    photo: "assets/stills/about-photo.jpg",
    bio:
      "Write your bio here. Keep it factual and punchy. Director of HUMANZEE. Developing THE LIVING UNDEAD RETURN AGAIN."
  },

  contact: {
    body: "For inquiries:",
    links: [
      { label: "Email", value: "YOUR_EMAIL@DOMAIN.COM", href: "mailto:YOUR_EMAIL@DOMAIN.COM" },
      { label: "Instagram", value: "@YOUR_HANDLE", href: "https://instagram.com/YOUR_HANDLE" },
      { label: "IMDb", value: "Taro O’Halloran", href: "https://www.imdb.com/" }
    ]
  },

  // Order matters: this also controls how tiles are placed into the 5-tile grid.
  films: [
    {
      id: "humanzee",
      title: "Humanzee",
      year: "2024",
      runtime: "23 min.",
      genres: "Horror / Drama",
      tile: "assets/stills/tile-humanzee.jpg",
      hero: "assets/stills/tile-humanzee.jpg",
      logo: "assets/films/humanzee/humanzee-logo.png",
      desc: "Replace with a tight description of HUMANZEE.",
      actions: [{ label: "Watch", href: "https://www.youtube.com/watch?v=YOUR_LINK" }]
    },
    {
      id: "rendezvous",
      title: "Rendezvous",
      year: "2023",
      runtime: "16 min.",
      genres: "Crime / Comedy",
      tile: "assets/stills/tile-rendezvous.jpg",
      hero: "assets/stills/tile-rendezvous.jpg",
      logo: "assets/films/rendezvous/rendezvous-logo.png",
      desc: "Replace with a tight description of RENDEZVOUS.",
      actions: []
    },
    {
      id: "uap",
      title: "UAP",
      year: "2022",
      runtime: "12 min.",
      genres: "Comedy / Drama / Sci-Fi",
      tile: "assets/stills/tile-uap.jpg",
      hero: "assets/stills/tile-uap.jpg",
      logo: "assets/films/uap/uap-logo.png",
      desc: "Replace with a tight description of UAP.",
      actions: []
    },
    {
      id: "dragons",
      title: "Do Dragons Sleep in Fictitious Caves?",
      year: "2022",
      runtime: "4 min.",
      genres: "Horror / Drama",
      tile: "assets/stills/tile-dragons.jpg",
      hero: "assets/stills/tile-dragons.jpg",
      logo: "assets/films/dragons/do-dragons-sleep-in-fictitious-caves-logo.png",
      desc: "Replace with a tight description of DO DRAGONS SLEEP IN FICTITIOUS CAVES?.",
      actions: []
    },
    {
      id: "aspens",
      title: "The Whispers of the Aspens",
      year: "2022",
      runtime: "1 min.",
      genres: "Horror",
      tile: "assets/stills/tile-aspens.jpg",
      hero: "assets/stills/tile-aspens.jpg",
      logo: "assets/films/aspens/the-whispers-of-the-aspens-logo.png",
      desc: "Replace with a tight description of THE WHISPERS OF THE ASPENS.",
      actions: []
    }
  ]
};

// ===== DOM refs =====
const homeLink = $("#homeLink");

const viewHome = $("#view-home");
const viewFilms = $("#view-films");
const viewAbout = $("#view-about");
const viewContact = $("#view-contact");
const viewFilm = $("#view-film");
const viewError = $("#view-error");

const errorText = $("#errorText");

const homeHero = $("#homeHero");
const leftStack = $("#homeLeftStack");
const rightStack = $("#homeRightStack");

const filmsGrid = $("#filmsGrid");

const aboutImg = $("#aboutImg");
const aboutBody = $("#aboutBody");

const contactBody = $("#contactBody");
const contactLinks = $("#contactLinks");

const filmHeroImg = $("#filmHeroImg");
const filmTitle = $("#filmTitle");
const filmMeta = $("#filmMeta");
const filmDesc = $("#filmDesc");
const filmActions = $("#filmActions");

let currentRoute = "home";

// ===== helpers =====
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setHeaderState(route) {
  document.body.classList.toggle("route-home", route === "home");
}

function setTabs(route) {
  document.querySelectorAll(".tab").forEach(btn => {
    btn.setAttribute("aria-current", btn.dataset.route === route ? "page" : "false");
  });
  if (route === "home" || route.startsWith("film:")) {
    document.querySelectorAll(".tab").forEach(btn => btn.setAttribute("aria-current", "false"));
  }
}

function showOnly(viewEl) {
  const all = [viewHome, viewFilms, viewAbout, viewContact, viewFilm, viewError];
  all.forEach(v => {
    v.hidden = v !== viewEl;
    v.classList.toggle("is-active", v === viewEl);
  });
}

async function transitionTo(route) {
  if (route === currentRoute) return;

  const active = document.querySelector(".view.is-active");
  if (active) active.classList.add("is-fading-out");

  await new Promise(r => setTimeout(r, 160));

  currentRoute = route;

  if (route === "home") {
    setHeaderState("home");
    setTabs("home");
    showOnly(viewHome);
  } else if (route === "films") {
    setHeaderState("films");
    setTabs("films");
    showOnly(viewFilms);
  } else if (route === "about") {
    setHeaderState("about");
    setTabs("about");
    showOnly(viewAbout);
  } else if (route === "contact") {
    setHeaderState("contact");
    setTabs("contact");
    showOnly(viewContact);
  } else if (route.startsWith("film:")) {
    setHeaderState("film");
    setTabs("film");
    showOnly(viewFilm);
  } else {
    setHeaderState("error");
    setTabs("error");
    showOnly(viewError);
  }

  if (active) active.classList.remove("is-fading-out");
}

function navigate(hash) {
  history.pushState(null, "", hash);
  handleRoute();
}

function handleRoute() {
  const h = (location.hash || "#home").replace("#", "");

  if (!h || h === "home") return transitionTo("home");
  if (h === "films") return transitionTo("films");
  if (h === "about") return transitionTo("about");
  if (h === "contact") return transitionTo("contact");

  if (h.startsWith("film/")) {
    const id = h.split("/")[1];
    const film = SITE.films.find(f => f.id === id);
    if (!film) {
      errorText.textContent = `Film not found: ${id}`;
      return transitionTo("error");
    }
    renderFilmPage(film);
    return transitionTo(`film:${id}`);
  }

  return transitionTo("home");
}

// ===== renderers =====
function renderHome() {
  if (homeHero) homeHero.src = SITE.home.hero;

  if (leftStack) leftStack.innerHTML = "";
  if (rightStack) rightStack.innerHTML = "";

  const mkSide = (src) => {
    const d = document.createElement("div");
    d.className = "sideTile";
    d.innerHTML = `<img src="${src}" alt="">`;
    return d;
  };

  (SITE.home.left || []).forEach(src => leftStack && leftStack.appendChild(mkSide(src)));
  (SITE.home.right || []).forEach(src => rightStack && rightStack.appendChild(mkSide(src)));
}

function renderFilms() {
  if (!filmsGrid) return;
  filmsGrid.innerHTML = "";

  // Exactly 5 films expected for the grid composition.
  // If fewer exist, we silently fill with blanks; if more exist, we only show first 5.
  const films = [...(SITE.films || [])];

  while (films.length < 5) {
    films.push({
      id: `blank-${films.length}`,
      title: "",
      year: "",
      runtime: "",
      genres: "",
      tile: SITE.home.hero,
      logo: ""
    });
  }

  films.slice(0, 5).forEach(f => {
    const tile = document.createElement("div");
    tile.className = "tile";

    const titleOrLogo = f.logo
      ? `<img class="tileLogo" src="${f.logo}" alt="${escapeHtml(f.title)} logo">`
      : `<div class="tileTitle">${escapeHtml(f.title || "")}</div>`;

    tile.innerHTML = `
      <img class="tileImg" src="${f.tile}" alt="">
      <div class="tileInfo">
        ${titleOrLogo}
        <div class="tileMeta">${escapeHtml([f.year, f.runtime].filter(Boolean).join(", "))}</div>
        <div class="tileGenre">${escapeHtml(f.genres || "")}</div>
      </div>
    `;

    // Only clickable if it’s a real film id (not blank)
    const isBlank = String(f.id || "").startsWith("blank-") || !f.title;
    if (!isBlank) tile.addEventListener("click", () => navigate(`#film/${f.id}`));
    else {
      tile.style.opacity = "0.55";
      tile.style.cursor = "default";
    }

    filmsGrid.appendChild(tile);
  });
}

function renderAbout() {
  if (aboutImg) aboutImg.src = SITE.about.photo;
  if (aboutBody) aboutBody.textContent = SITE.about.bio;
}

function renderContact() {
  if (contactBody) contactBody.textContent = SITE.contact.body;
  if (!contactLinks) return;

  contactLinks.innerHTML = "";
  (SITE.contact.links || []).forEach(l => {
    const a = document.createElement("a");
    a.className = "contactLink";
    a.href = l.href;
    if (!l.href.startsWith("mailto:")) {
      a.target = "_blank";
      a.rel = "noreferrer";
    }
    a.innerHTML = `<span>${escapeHtml(l.label)}</span><span>${escapeHtml(l.value)}</span>`;
    contactLinks.appendChild(a);
  });
}

function renderFilmPage(f) {
  if (filmHeroImg) filmHeroImg.src = f.hero || f.tile;

  // title area: prefer logo image
  if (filmTitle) {
    filmTitle.innerHTML = f.logo
      ? `<img class="filmLogo" src="${f.logo}" alt="${escapeHtml(f.title)} logo">`
      : escapeHtml((f.title || "").toUpperCase());
  }

  if (filmMeta) {
    filmMeta.textContent = [f.year, f.runtime, f.genres].filter(Boolean).join(" — ");
  }

  if (filmDesc) filmDesc.textContent = f.desc || "";

  if (!filmActions) return;
  filmActions.innerHTML = "";

  (f.actions || []).forEach(a => {
    const el = document.createElement("a");
    el.className = "action";
    el.href = a.href;
    if (!a.href.startsWith("mailto:") && !a.href.startsWith("#")) {
      el.target = "_blank";
      el.rel = "noreferrer";
    }
    el.textContent = a.label;
    filmActions.appendChild(el);
  });
}

// ===== init =====
function init() {
  // Render all static content once
  renderHome();
  renderFilms();
  renderAbout();
  renderContact();

  // Event delegation: nav always works
  document.addEventListener("click", (e) => {
    const tab = e.target.closest(".tab");
    if (tab) {
      e.preventDefault();
      navigate(`#${tab.dataset.route}`);
      return;
    }

    const home = e.target.closest("#homeLink");
    if (home) {
      e.preventDefault();
      navigate("#home");
      return;
    }
  });

  // Default route
  if (!location.hash) history.replaceState(null, "", "#home");

  setHeaderState("home");
  setTabs("home");
  showOnly(viewHome);
  handleRoute();

  window.addEventListener("popstate", handleRoute);
}

init();
