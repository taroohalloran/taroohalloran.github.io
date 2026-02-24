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

/* ====== IMPORTANT: Your new button assets live here ======
   You said: "I put the pngs in the ui folder"
   So we use: assets/ui/<name>.png
*/
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
    links: [
      // { label: "Watch", href: "https://..." },
    ],
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

  // allow "#film/humanzee"
  const parts = raw.split("/").filter(Boolean);
  if (parts[0] === "film" && parts[1]) return { route: "film", slug: parts[1] };

  // allow "#home", "#films", ...
  return { route: parts[0] };
}

function setHash(route) {
  if (route === "home") location.hash = "#home";
  else location.hash = `#${route}`;
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
      requestAnimationFrame(() => {
        el.classList.add("is-active");
      });
    } else {
      el.classList.remove("is-active");
      // delay hide to let fade finish
      setTimeout(() => { el.hidden = true; }, 220);
    }
  });
}

function applyRouteClasses(route) {
  document.body.classList.remove("route-home","route-films","route-about","route-contact","route-film","route-error");
  document.body.classList.add(`route-${route}`);

  // Header compact on non-home
  if (route === "home") document.body.classList.remove("header-compact");
  else document.body.classList.add("header-compact");
}

/* ====== TAB PNG STATE MACHINE ======
   States depend on:
   - selected vs notselected (based on current route)
   - hover vs standard (based on pointer hover)
*/
function tabIsSelected(tabKey, currentRoute) {
  if (currentRoute === "film") return tabKey === "films"; // film detail counts as films selected
  return tabKey === currentRoute;
}

function tabSrc(tabKey, selected, hovered) {
  const group = TAB_ASSETS[tabKey];
  if (!group) return "";
  const selKey = selected ? "selected" : "notselected";
  const hovKey = hovered ? "hover" : "standard";
  return group[selKey][hovKey];
}

function wireTabs() {
  tabs.forEach(({ key, btn, img }) => {
    if (!btn || !img) return;

    // Click routing
    btn.addEventListener("click", () => setHash(key));

    // Hover swapping
    btn.addEventListener("mouseenter", () => refreshTabs({ hoverKey: key, hoverOn: true }));
    btn.addEventListener("mouseleave", () => refreshTabs({ hoverKey: key, hoverOn: false }));

    // Preload all assets so swapping never flashes
    const a = TAB_ASSETS[key];
    if (a) {
      [a.notselected.standard, a.notselected.hover, a.selected.standard, a.selected.hover]
        .forEach(src => { const im = new Image(); im.src = src; });
    }
  });
}

let lastHover = { key: null, on: false };

function refreshTabs(opts = null) {
  if (opts && "hoverKey" in opts) lastHover = { key: opts.hoverKey, on: opts.hoverOn };

  const { route } = parseHash();
  tabs.forEach(({ key, img }) => {
    const selected = tabIsSelected(key, route);
    const hovered = (lastHover.on && lastHover.key === key);
    img.src = tabSrc(key, selected, hovered);
  });
}

/* ====== HOME ====== */
function renderHome() {
  // hero
  homeHero.src = HOME.hero;

  // side stacks (only visible on home via CSS)
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

  homeRightStack.innerHTML = "";
  HOME.right.forEach((src) => {
    const wrap = document.createElement("div");
    wrap.className = "sideThumb";
    const im = document.createElement("img");
    im.src = src;
    im.alt = "";
    wrap.appendChild(im);
    homeRightStack.appendChild(wrap);
    homeRightStack.appendChild(wrap);
  });
}

/* ====== FILMS ====== */
function renderFilms() {
  filmsGrid.innerHTML = "";

  // newest to oldest is already ordered above
  FILMS.forEach((f) => {
    const tile = document.createElement("div");
    tile.className = "filmTile grainHover";
    tile.dataset.slug = f.slug;

    // background (optional: if you add posters later, set tile bg image)
    const bg = document.createElement("div");
    bg.className = "filmBg";
    // leave blank by default; you can set posters later:
    // bg.style.backgroundImage = `url("${f.hero}")`;
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
  aboutImg.src = ABOUT.photo;
  aboutBody.innerHTML = ABOUT.bodyHtml;
}

function renderContact() {
  contactBody.innerHTML = CONTACT.bodyHtml;
  contactLinks.innerHTML = CONTACT.linksHtml;
}

/* ====== FILM DETAIL ====== */
function renderFilmDetail(slug) {
  const f = FILMS.find(x => x.slug === slug);
  if (!f) {
    showError(`Film not found: ${slug}`);
    return;
  }

  filmHeroImg.src = f.hero || "";
  filmTitle.textContent = f.title;
  filmMeta.textContent = `${f.year} · ${f.runtime} · ${f.genre}`;
  filmDesc.textContent = f.desc || "";

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

function showError(msg) {
  $("#errorText").textContent = msg;
  applyRouteClasses("error");
  refreshTabs();
  showView("error");
}

/* ====== MAIN ROUTE HANDLER ====== */
function handleRoute() {
  const parsed = parseHash();
  const route = parsed.route || "home";

  // Keep home stable as default fallback
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
  // Home name click returns home
  homeLink.addEventListener("click", () => setHash("home"));

  // Tabs
  wireTabs();

  // Initial tab art (prevents blank images before first hover)
  refreshTabs();

  // Route updates
  window.addEventListener("hashchange", handleRoute);

  // First load
  handleRoute();
}

init();
