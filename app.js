/* =========================================================
   TARO SITE v2 (FULL)
   - hash routing only (#home/#films/#about/#contact/#film/<slug>)
   - PNG nav button assets from assets/ui/
   - hover grain stays clipped to hovered element (no boxes)
   - films grid restored (big left tile + 2x2 right)
========================================================= */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* -----------------------------
   ASSET PATHS (MUST MATCH FILENAMES EXACTLY)
------------------------------ */
const UI = {
  nav: {
    films: {
      ns: "assets/ui/films-button-notselected-standard.png",
      nh: "assets/ui/films-button-notselected-hover.png",
      ss: "assets/ui/films-button-selected-standard.png",
      sh: "assets/ui/films-button-selected-hover.png",
    },
    about: {
      ns: "assets/ui/about-button-notselected-standard.png",
      nh: "assets/ui/about-button-notselected-hover.png",
      ss: "assets/ui/about-button-selected-standard.png",
      sh: "assets/ui/about-button-selected-hover.png",
    },
    contact: {
      ns: "assets/ui/contact-button-notselected-standard.png",
      nh: "assets/ui/contact-button-notselected-hover.png",
      ss: "assets/ui/contact-button-selected-standard.png",
      sh: "assets/ui/contact-button-selected-hover.png",
    },
  }
};

/* -----------------------------
   DATA (update paths as needed)
------------------------------ */
const FILMS = [
  {
    slug: "humanzee",
    year: "2024",
    minutes: "23",
    genres: "Horror/Drama",
    logo: "assets/films/humanzee-logo.png",
    hero: "assets/films/humanzee-hero.jpg",
    desc: "Replace this with your Humanzee description.",
    links: [],
    feature: true
  },
  {
    slug: "rendezvous",
    year: "2023",
    minutes: "16",
    genres: "Crime/Comedy",
    logo: "assets/films/rendezvous-logo.png",
    hero: "assets/films/rendezvous-hero.jpg",
    desc: "Replace this with your Rendezvous description.",
    links: [],
    feature: false
  },
  {
    slug: "uap",
    year: "2022",
    minutes: "4",
    genres: "Horror/Drama",
    logo: "assets/films/uap-logo.png",
    hero: "assets/films/uap-hero.jpg",
    desc: "Replace this with your description.",
    links: [],
    feature: false
  },
  {
    slug: "whispers",
    year: "2022",
    minutes: "1",
    genres: "Horror",
    logo: "assets/films/the-whispers-of-the-aspens-logo.png",
    hero: "assets/films/the-whispers-of-the-aspens-hero.jpg",
    desc: "Replace this with your description.",
    links: [],
    feature: false
  }
];

const HOME = {
  hero: "assets/backgrounds/home-hero.jpg",
  left: [
    "assets/backgrounds/home-left-1.jpg",
    "assets/backgrounds/home-left-2.jpg"
  ],
  right: [
    "assets/backgrounds/home-right-1.jpg",
    "assets/backgrounds/home-right-2.jpg"
  ]
};

const ABOUT = {
  photo: "assets/branding/about-photo.jpg",
  body: `
    <p><strong>Taro O’Halloran</strong> is a writer/director/producer based in Massachusetts, working in horror and genre with a handmade, grindhouse-forward sensibility.</p>
    <p>Replace this with your bio copy.</p>
  `
};

const CONTACT = {
  body: `
    <p>Replace this with your contact copy.</p>
  `,
  links: [
    // { label: "Email", href: "mailto:you@example.com" },
    // { label: "Instagram", href: "https://instagram.com/..." },
  ]
};

/* -----------------------------
   DOM
------------------------------ */
const views = {
  home: $("#view-home"),
  films: $("#view-films"),
  about: $("#view-about"),
  contact: $("#view-contact"),
  film: $("#view-film"),
  error: $("#view-error"),
};

const homeHeroImg = $("#homeHero");
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

const errorText = $("#errorText");

/* nav */
const navButtons = $$(".navBtn");

/* -----------------------------
   PRELOAD (prevents “nothing shows” feel)
------------------------------ */
function preload(srcs = []) {
  srcs.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

preload([
  ...Object.values(UI.nav.films),
  ...Object.values(UI.nav.about),
  ...Object.values(UI.nav.contact),
]);

/* -----------------------------
   NAV IMAGE STATE
------------------------------ */
function setNavImage(key, { selected, hovered }) {
  const map = UI.nav[key];
  const img = $(`.navBtnImg[data-btn="${key}"]`);
  if (!img) return;

  if (selected && hovered) img.src = map.sh;
  else if (selected && !hovered) img.src = map.ss;
  else if (!selected && hovered) img.src = map.nh;
  else img.src = map.ns;
}

function activeNavKeyFromRoute(route) {
  // film detail counts as films selected
  if (route.page === "film") return "films";
  if (route.page === "films" || route.page === "about" || route.page === "contact") return route.page;
  return null; // home/error => none selected
}

function syncNavImages(route) {
  const active = activeNavKeyFromRoute(route);
  ["films","about","contact"].forEach(key => {
    setNavImage(key, { selected: active === key, hovered: false });
  });
}

/* -----------------------------
   VIEW SWITCHING
------------------------------ */
function showOnly(which) {
  Object.keys(views).forEach(k => {
    const v = views[k];
    if (!v) return;

    if (k === which) {
      v.hidden = false;
      v.classList.add("is-active");
    } else {
      v.hidden = true;
      v.classList.remove("is-active");
    }
  });
}

/* -----------------------------
   ROUTING (HASH ONLY)
   #home | #films | #about | #contact | #film/<slug>
------------------------------ */
function parseRoute() {
  const raw = (location.hash || "#home").replace(/^#/, "");
  const parts = raw.split("/").filter(Boolean);

  if (parts.length === 0) return { page: "home" };
  if (parts[0] === "home") return { page: "home" };
  if (parts[0] === "films") return { page: "films" };
  if (parts[0] === "about") return { page: "about" };
  if (parts[0] === "contact") return { page: "contact" };
  if (parts[0] === "film" && parts[1]) return { page: "film", slug: parts[1] };

  return { page: "error", message: `Unknown route: #${raw}` };
}

function setBodyRouteClass(page) {
  document.body.classList.remove("route-home","route-films","route-about","route-contact","route-film","route-error");
  document.body.classList.add(`route-${page}`);
}

/* -----------------------------
   RENDERERS
------------------------------ */
function makeSideBox(src) {
  const wrap = document.createElement("div");
  wrap.className = "sideBox";
  const img = document.createElement("img");
  img.alt = "";
  img.src = src;
  wrap.appendChild(img);
  return wrap;
}

function renderHome(route) {
  setBodyRouteClass("home");
  showOnly("home");
  syncNavImages(route);

  if (homeHeroImg) homeHeroImg.src = HOME.hero;

  if (leftStack && leftStack.childElementCount === 0) {
    HOME.left.forEach(src => leftStack.appendChild(makeSideBox(src)));
  }
  if (rightStack && rightStack.childElementCount === 0) {
    HOME.right.forEach(src => rightStack.appendChild(makeSideBox(src)));
  }
}

function renderFilms(route) {
  setBodyRouteClass("films");
  showOnly("films");
  syncNavImages(route);

  if (!filmsGrid) return;
  filmsGrid.innerHTML = "";

  // Keep your intended layout: feature first (big left tile)
  const sorted = [...FILMS].sort((a,b) => (b.feature === true) - (a.feature === true));

  sorted.forEach(f => {
    const card = document.createElement("article");
    card.className = "filmCard grainHover" + (f.feature ? " is-feature" : "");
    card.dataset.slug = f.slug;
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `${f.slug}`);

    const inner = document.createElement("div");
    inner.className = "filmInner";

    const logo = document.createElement("img");
    logo.className = "filmLogo";
    logo.src = f.logo;
    logo.alt = `${f.slug} logo`;

    inner.appendChild(logo);

    const meta = document.createElement("div");
    meta.className = "filmMetaLine";
    meta.textContent = `${f.year} • ${f.minutes} min. • ${f.genres}`;

    card.appendChild(inner);
    card.appendChild(meta);

    card.addEventListener("click", () => goToFilm(f.slug));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        goToFilm(f.slug);
      }
    });

    filmsGrid.appendChild(card);
  });
}

function renderAbout(route) {
  setBodyRouteClass("about");
  showOnly("about");
  syncNavImages(route);

  if (aboutImg) aboutImg.src = ABOUT.photo;
  if (aboutBody) aboutBody.innerHTML = ABOUT.body;
}

function renderContact(route) {
  setBodyRouteClass("contact");
  showOnly("contact");
  syncNavImages(route);

  if (contactBody) contactBody.innerHTML = CONTACT.body;

  if (contactLinks) {
    contactLinks.innerHTML = "";
    CONTACT.links.forEach(l => {
      const a = document.createElement("a");
      a.href = l.href;
      a.textContent = l.label;
      a.target = "_blank";
      a.rel = "noreferrer";
      contactLinks.appendChild(a);
    });
  }
}

function renderFilm(route) {
  setBodyRouteClass("film");
  showOnly("film");
  syncNavImages(route);

  const f = FILMS.find(x => x.slug === route.slug);
  if (!f) return renderError({ page: "error", message: `Film not found: ${route.slug}` });

  if (filmHeroImg) filmHeroImg.src = f.hero;
  if (filmTitle) filmTitle.textContent = f.slug.toUpperCase().replace(/-/g, " ");
  if (filmMeta) filmMeta.textContent = `${f.year} • ${f.minutes} min. • ${f.genres}`;
  if (filmDesc) filmDesc.textContent = f.desc || "";

  if (filmActions) {
    filmActions.innerHTML = "";
    (f.links || []).forEach(l => {
      const a = document.createElement("a");
      a.href = l.href;
      a.textContent = l.label;
      a.target = "_blank";
      a.rel = "noreferrer";
      filmActions.appendChild(a);
    });
  }
}

function renderError(route) {
  setBodyRouteClass("error");
  showOnly("error");
  syncNavImages(route);
  if (errorText) errorText.textContent = route.message || "Something went wrong.";
}

/* -----------------------------
   NAV / CLICK WIRES
------------------------------ */
function go(hash) {
  // Always hash routes. Never path routes.
  location.hash = hash;
}

function goToFilm(slug) {
  go(`#film/${slug}`);
}

function wireNav() {
  const homeLink = $("#homeLink");
  if (homeLink) homeLink.addEventListener("click", () => go("#home"));

  // clicks
  navButtons.forEach(btn => {
    const route = btn.getAttribute("data-route");
    btn.addEventListener("click", () => go(`#${route}`));
  });

  // hover swap images (selected/not + hover)
  navButtons.forEach(btn => {
    const key = btn.getAttribute("data-route");
    btn.addEventListener("pointerenter", () => {
      const r = parseRoute();
      const active = activeNavKeyFromRoute(r);
      setNavImage(key, { selected: active === key, hovered: true });
    });
    btn.addEventListener("pointerleave", () => {
      const r = parseRoute();
      const active = activeNavKeyFromRoute(r);
      setNavImage(key, { selected: active === key, hovered: false });
    });
  });

  // initial images
  ["films","about","contact"].forEach(k => setNavImage(k, { selected:false, hovered:false }));
}

/* -----------------------------
   DISPATCH
------------------------------ */
function renderFromRoute() {
  const r = parseRoute();

  if (r.page === "home") return renderHome(r);
  if (r.page === "films") return renderFilms(r);
  if (r.page === "about") return renderAbout(r);
  if (r.page === "contact") return renderContact(r);
  if (r.page === "film") return renderFilm(r);
  return renderError(r);
}

/* -----------------------------
   INIT
------------------------------ */
function init() {
  wireNav();
  window.addEventListener("hashchange", renderFromRoute);
  renderFromRoute();
}

document.addEventListener("DOMContentLoaded", init);
