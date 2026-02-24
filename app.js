/* =========================================================
   TARO SITE — stable hash router + PNG tab states + hover grain per-element
   ========================================================= */

const $ = (sel) => document.querySelector(sel);

const views = {
  home: $("#view-home"),
  films: $("#view-films"),
  about: $("#view-about"),
  contact: $("#view-contact"),
  film: $("#view-film"),
  error: $("#view-error"),
};

const homeHero = $("#homeHero");
const homeLeftStack = $("#homeLeftStack");
const homeRightStack = $("#homeRightStack");

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

const homeLink = $("#homeLink");

const tabs = [
  { key: "films", btn: $("#tab-films"), img: $("#tabImg-films") },
  { key: "about", btn: $("#tab-about"), img: $("#tabImg-about") },
  { key: "contact", btn: $("#tab-contact"), img: $("#tabImg-contact") },
];

/* ====== BUTTON ASSET PATHS (MATCH YOUR GITHUB /assets/ui/ EXACTLY) ====== */
const TAB_ASSETS = {
  films: {
    notselected: {
      standard: "assets/ui/films-button-notselected-standard.png",
      hover: "assets/ui/films-button-notselected-hover.png",
    },
    selected: {
      standard: "assets/ui/films-button-selected-standard.png",
      hover: "assets/ui/films-button-selected-hover.png",
    },
  },
  about: {
    notselected: {
      standard: "assets/ui/about-button-notselected-standard.png",
      hover: "assets/ui/about-button-notselected-hover.png",
    },
    selected: {
      standard: "assets/ui/about-button-selected-standard.png",
      hover: "assets/ui/about-button-selected-hover.png",
    },
  },
  contact: {
    notselected: {
      standard: "assets/ui/contact-button-notselected-standard.png",
      hover: "assets/ui/contact-button-notselected-hover.png",
    },
    selected: {
      standard: "assets/ui/contact-button-selected-standard.png",
      hover: "assets/ui/contact-button-selected-hover.png",
    },
  },
};

/* ====== Content ====== */
const FILMS = [
  {
    slug: "humanzee",
    title: "Humanzee",
    year: "2024",
    runtime: "23 min.",
    genre: "Horror/Drama",
    logo: "assets/films/humanzee/logo-humanzee.png",
    hero: "assets/films/humanzee/hero.jpg",
    desc: "",
    links: [],
  },
  {
    slug: "rendezvous",
    title: "Rendezvous",
    year: "2023",
    runtime: "16 min.",
    genre: "Crime/Comedy",
    logo: "assets/films/rendezvous/logo-rendezvous.png",
    hero: "assets/films/rendezvous/hero.jpg",
    desc: "",
    links: [],
  },
  {
    slug: "uap",
    title: "UAP",
    year: "2022",
    runtime: "12 min.",
    genre: "Comedy/Drama/Sci Fi",
    logo: "assets/films/uap/logo-uap.png",
    hero: "assets/films/uap/hero.jpg",
    desc: "",
    links: [],
  },
  {
    slug: "do-dragons-sleep-in-fictitious-caves",
    title: "Do Dragons Sleep in Fictitious Caves?",
    year: "2022",
    runtime: "4 min.",
    genre: "Horror/Drama",
    logo: "assets/films/do-dragons-sleep-in-fictitious-caves/logo-do-dragons-sleep-in-fictitious-caves.png",
    hero: "assets/films/do-dragons-sleep-in-fictitious-caves/hero.jpg",
    desc: "",
    links: [],
  },
  {
    slug: "the-whispers-of-the-aspens",
    title: "The Whispers of the Aspens",
    year: "2022",
    runtime: "1 min.",
    genre: "Horror",
    logo: "assets/films/the-whispers-of-the-aspens/logo-the-whispers-of-the-aspens.png",
    hero: "assets/films/the-whispers-of-the-aspens/hero.jpg",
    desc: "",
    links: [],
  },
];

const HOME = {
  hero: "assets/home/home-hero.jpg",
  left: [
    "assets/home/side-left-1.jpg",
    "assets/home/side-left-2.jpg",
  ],
  right: [
    "assets/home/side-right-1.jpg",
    "assets/home/side-right-2.jpg",
  ],
};

const ABOUT = {
  photo: "assets/about/taro.jpg",
  bodyHtml: `
    <p><b>Taro O’Halloran</b> is a writer/director/producer based in Massachusetts, working in horror and genre with a handmade, grindhouse-forward sensibility.</p>
    <p>Replace this with your bio copy.</p>
  `,
};

const CONTACT = {
  bodyHtml: `
    <div style="font-size:15px; line-height:1.7;">
      <p><b>Contact</b></p>
      <p>Email: <span id="contactEmail">you@email.com</span></p>
    </div>
  `,
  linksHtml: `
    <div style="margin-top:10px; display:flex; gap:14px; flex-wrap:wrap;">
      <a href="#" target="_blank" rel="noreferrer">Instagram</a>
      <a href="#" target="_blank" rel="noreferrer">YouTube</a>
      <a href="#" target="_blank" rel="noreferrer">IMDb</a>
    </div>
  `,
};

/* ====== Router ====== */
function parseHash() {
  const raw = (location.hash || "#home").replace(/^#/, "");
  if (!raw || raw === "/") return { route: "home" };

  const parts = raw.split("/").filter(Boolean);
  if (parts[0] === "film" && parts[1]) return { route: "film", slug: parts[1] };

  return { route: parts[0] };
}

function setHash(route) {
  location.hash = route === "home" ? "#home" : `#${route}`;
}

function setFilmHash(slug) {
  location.hash = `#film/${slug}`;
}

function showView(which) {
  Object.entries(views).forEach(([k, el]) => {
    if (!el) return;
    const active = (k === which);

    if (active) {
      el.hidden = false;
      requestAnimationFrame(() => el.classList.add("is-active"));
    } else {
      el.classList.remove("is-active");
      setTimeout(() => { el.hidden = true; }, 220);
    }
  });
}

function applyRouteClasses(route) {
  document.body.classList.remove(
    "route-home","route-films","route-about","route-contact","route-film","route-error"
  );
  document.body.classList.add(`route-${route}`);

  if (route === "home") document.body.classList.remove("header-compact");
  else document.body.classList.add("header-compact");
}

/* ====== TAB STATE ====== */
function tabIsSelected(tabKey, currentRoute) {
  if (currentRoute === "film") return tabKey === "films";
  return tabKey === currentRoute;
}

function tabSrc(tabKey, selected, hovered) {
  const group = TAB_ASSETS[tabKey];
  if (!group) return "";
  const selKey = selected ? "selected" : "notselected";
  const hovKey = hovered ? "hover" : "standard";
  return group[selKey][hovKey];
}

let lastHover = { key: null, on: false };

function refreshTabs(opts = null) {
  if (opts && "hoverKey" in opts) lastHover = { key: opts.hoverKey, on: opts.hoverOn };

  const { route } = parseHash();
  tabs.forEach(({ key, img }) => {
    if (!img) return;
    const selected = tabIsSelected(key, route);
    const hovered = (lastHover.on && lastHover.key === key);
    img.src = tabSrc(key, selected, hovered);
  });
}

function wireTabs() {
  tabs.forEach(({ key, btn, img }) => {
    if (!btn || !img) return;

    // Click routing
    btn.addEventListener("click", () => setHash(key));

    // Hover swapping
    btn.addEventListener("mouseenter", () => refreshTabs({ hoverKey: key, hoverOn: true }));
    btn.addEventListener("mouseleave", () => refreshTabs({ hoverKey: key, hoverOn: false }));

    // Preload all assets for this tab
    const a = TAB_ASSETS[key];
    if (a) {
      [
        a.notselected.standard,
        a.notselected.hover,
        a.selected.standard,
        a.selected.hover,
      ].forEach((src) => {
        const im = new Image();
        im.src = src;
      });
    }
  });
}

/* ====== HOME ====== */
function renderHome() {
  if (homeHero) homeHero.src = HOME.hero;

  if (homeLeftStack) {
    homeLeftStack.innerHTML = "";
    HOME.left.forEach((src) => {
      const wrap = document.createElement("div");
      wrap.className = "sideThumb";
      const im = document.createElement("img");
      im.src = src;
      im.alt = "";
      wrap.appendChild(im);
      homeLeftStack.appendChild(wrap);
    });
  }

  if (homeRightStack) {
    homeRightStack.innerHTML = "";
    HOME.right.forEach((src) => {
      const wrap = document.createElement("div");
      wrap.className = "sideThumb";
      const im = document.createElement("img");
      im.src = src;
      im.alt = "";
      wrap.appendChild(im);
      homeRightStack.appendChild(wrap);
    });
  }
}

/* ====== FILMS ====== */
function renderFilms() {
  if (!filmsGrid) return;
  filmsGrid.innerHTML = "";

  FILMS.forEach((f) => {
    const tile = document.createElement("div");
    tile.className = "filmTile grainHover";
    tile.dataset.slug = f.slug;

    const bg = document.createElement("div");
    bg.className = "filmBg";
    tile.appendChild(bg);

    const logoWrap = document.createElement("div");
    logoWrap.className = "filmLogo";
    const logo = document.createElement("img");
    logo.src = f.logo;
    logo.alt = `${f.title} logo`;
    logoWrap.appendChild(logo);
    tile.appendChild(logoWrap);

    const info = document.createElement("div");
    info.className = "filmInfo";
    const infoText = document.createElement("div");
    infoText.className = "filmInfoText";
    infoText.innerHTML = `${f.year} · ${f.runtime} · ${f.genre}`;
    info.appendChild(infoText);
    tile.appendChild(info);

    tile.addEventListener("click", () => setFilmHash(f.slug));
    filmsGrid.appendChild(tile);
  });
}

/* ====== ABOUT / CONTACT ====== */
function renderAbout() {
  if (aboutImg) aboutImg.src = ABOUT.photo;
  if (aboutBody) aboutBody.innerHTML = ABOUT.bodyHtml;
}

function renderContact() {
  if (contactBody) contactBody.innerHTML = CONTACT.bodyHtml;
  if (contactLinks) contactLinks.innerHTML = CONTACT.linksHtml;
}

/* ====== FILM DETAIL ====== */
function renderFilmDetail(slug) {
  const f = FILMS.find(x => x.slug === slug);
  if (!f) return showError(`Film not found: ${slug}`);

  if (filmHeroImg) filmHeroImg.src = f.hero || "";
  if (filmTitle) filmTitle.textContent = f.title;
  if (filmMeta) filmMeta.textContent = `${f.year} · ${f.runtime} · ${f.genre}`;
  if (filmDesc) filmDesc.textContent = f.desc || "";

  if (filmActions) {
    filmActions.innerHTML = "";
    if (Array.isArray(f.links) && f.links.length) {
      const wrap = document.createElement("div");
      wrap.style.display = "flex";
      wrap.style.gap = "12px";
      wrap.style.flexWrap = "wrap";
      wrap.style.marginTop = "10px";

      f.links.forEach((l) => {
        const a = document.createElement("a");
        a.href = l.href;
        a.target = "_blank";
        a.rel = "noreferrer";
        a.textContent = l.label;
        a.style.color = "var(--red)";
        a.style.textDecoration = "none";
        a.addEventListener("mouseenter", () => (a.style.textDecoration = "underline"));
        a.addEventListener("mouseleave", () => (a.style.textDecoration = "none"));
        wrap.appendChild(a);
      });

      filmActions.appendChild(wrap);
    }
  }
}

function showError(msg) {
  const el = $("#errorText");
  if (el) el.textContent = msg;
  applyRouteClasses("error");
  refreshTabs();
  showView("error");
}

/* ====== MAIN ROUTE HANDLER ====== */
function handleRoute() {
  const parsed = parseHash();
  const route = parsed.route || "home";

  const allowed = new Set(["home","films","about","contact","film"]);
  const safeRoute = allowed.has(route) ? route : "home";

  applyRouteClasses(safeRoute);
  refreshTabs();

  if (safeRoute === "home") {
    renderHome();
    showView("home");
    return;
  }

  if (safeRoute === "films") {
    renderFilms();
    showView("films");
    return;
  }

  if (safeRoute === "about") {
    renderAbout();
    showView("about");
    return;
  }

  if (safeRoute === "contact") {
    renderContact();
    showView("contact");
    return;
  }

  if (safeRoute === "film") {
    renderFilmDetail(parsed.slug);
    showView("film");
    return;
  }
}

/* ====== INIT ====== */
function init() {
  // Home link always works
  if (homeLink) homeLink.addEventListener("click", () => setHash("home"));

  // Wire tabs before routing
  wireTabs();

  // Set tab images immediately (prevents blank)
  refreshTabs();

  // Route updates
  window.addEventListener("hashchange", handleRoute);

  // First load
  handleRoute();
}

init();
