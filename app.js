/* =========================================================
   TARO SITE ROUTER + UI (V2)
   - Hash router (#home, #films, #about, #contact, #film/<slug>)
   - PNG nav button assets from /assets/ui/
   - Films grid uses poster stills; hover zoom + blur; overlay logo+meta
   - Hover grain is CLIPPED to the element only (no big circle/box)
   - Home-only side stacks (never on other pages)
========================================================= */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* -----------------------------
   ASSET PATHS
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
  },
};

/* ---------------------------------------------------------
   FILMS DATA
   - UAP and "Do Dragons Sleep in Fictitious Caves?" are SEPARATE films.
   - Update still/hero filenames if yours differ.
--------------------------------------------------------- */
const FILMS = [
  {
    slug: "humanzee",
    title: "HUMANZEE",
    year: "2024",
    minutes: "23",
    genres: "Horror/Drama",
    logo: "assets/films/humanzee/humanzee-logo.png",
    still: "assets/films/humanzee/humanzee-still.jpg",
    hero: "assets/films/humanzee/humanzee-hero.jpg",
    desc: "Replace this with your Humanzee description.",
    links: [],
    feature: true,
  },

  {
    slug: "rendezvous",
    title: "RENDEZVOUS",
    year: "2023",
    minutes: "16",
    genres: "Crime/Comedy",
    logo: "assets/films/rendezvous/rendezvous-logo.png",
    still: "assets/films/rendezvous/rendezvous-still.jpg",
    hero: "assets/films/rendezvous/rendezvous-hero.jpg",
    desc: "Replace this with your Rendezvous description.",
    links: [],
  },

  {
    slug: "uap",
    title: "UAP",
    year: "2022",
    minutes: "12",
    genres: "Comedy/Drama/Sci Fi",
    logo: "assets/films/uap/uap-logo.png",
    still: "assets/films/uap/uap-still.jpg",
    hero: "assets/films/uap/uap-hero.jpg",
    desc: "Replace this with your UAP description.",
    links: [],
  },

  {
    slug: "do-dragons-sleep-in-fictitious-caves",
    title: "Do Dragons Sleep in Fictitious Caves?",
    year: "2022",
    minutes: "4",
    genres: "Horror/Drama",
    logo: "assets/films/dragons/do-dragons-sleep-in-fictitious-caves-logo.png",
    still: "assets/films/dragons/dragons-still.jpg",
    hero: "assets/films/dragons/dragons-hero.jpg",
    desc: "Replace this with your Do Dragons description.",
    links: [],
  },

  {
    slug: "whispers",
    title: "The Whispers of the Aspens",
    year: "2022",
    minutes: "1",
    genres: "Horror",
    logo: "assets/films/aspens/the-whispers-of-the-aspens-logo.png",
    still: "assets/films/aspens/aspens-still.jpg",
    hero: "assets/films/aspens/aspens-hero.jpg",
    desc: "Replace this with your Whispers description.",
    links: [],
  },
];

/* Home images (only shown on HOME) */
const HOME = {
  hero: "assets/backgrounds/bg.jpg",
  left: ["assets/backgrounds/home-left-1.jpg", "assets/backgrounds/home-left-2.jpg"],
  right: ["assets/backgrounds/home-right-1.jpg", "assets/backgrounds/home-right-2.jpg"],
};

const ABOUT = {
  photo: "assets/branding/about-photo.jpg",
  body: `
    <p><strong>Taro O’Halloran</strong> is a writer/director/producer based in Massachusetts, working in horror and genre with a handmade, grindhouse-forward sensibility.</p>
    <p>Replace this with your bio copy.</p>
  `,
};

const CONTACT = {
  body: `<p>Replace this with your contact copy.</p>`,
  links: [],
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

/* Nav buttons */
const navButtons = $$(".navBtn");

/* -----------------------------
   PRELOAD
------------------------------ */
function preload(srcs = []) {
  srcs.forEach((src) => {
    if (!src) return;
    const img = new Image();
    img.src = src;
  });
}

preload([
  ...Object.values(UI.nav.films),
  ...Object.values(UI.nav.about),
  ...Object.values(UI.nav.contact),
  ...FILMS.flatMap((f) => [f.logo, f.still, f.hero]),
  HOME.hero,
  ...HOME.left,
  ...HOME.right,
]);

/* -----------------------------
   NAV IMAGE STATE
------------------------------ */
function setNavImage(key, { selected, hovered }) {
  const map = UI.nav[key];
  const img = $(`.navBtnImg[data-btn="${key}"]`);
  if (!img || !map) return;

  if (selected && hovered) img.src = map.sh;
  else if (selected && !hovered) img.src = map.ss;
  else if (!selected && hovered) img.src = map.nh;
  else img.src = map.ns;
}

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

function currentActiveNavKey() {
  const r = parseRoute();
  if (r.page === "film") return "films";
  if (r.page === "films" || r.page === "about" || r.page === "contact") return r.page;
  return null;
}

function syncNavImages() {
  const active = currentActiveNavKey();
  ["films", "about", "contact"].forEach((key) => {
    setNavImage(key, { selected: active === key, hovered: false });
  });
}

/* -----------------------------
   VIEW SWITCHING
------------------------------ */
function showOnly(which) {
  Object.keys(views).forEach((k) => {
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

function setBodyRouteClass(page) {
  document.body.classList.remove(
    "route-home",
    "route-films",
    "route-about",
    "route-contact",
    "route-film",
    "route-error"
  );
  document.body.classList.add(`route-${page}`);
}

/* -----------------------------
   HOME (side stacks ONLY on home)
------------------------------ */
function clearHomeSides() {
  if (leftStack) leftStack.innerHTML = "";
  if (rightStack) rightStack.innerHTML = "";
}

function makeSideBox(src) {
  const wrap = document.createElement("div");
  wrap.className = "sideBox";
  const img = document.createElement("img");
  img.alt = "";
  img.src = src;
  wrap.appendChild(img);
  return wrap;
}

function renderHome() {
  setBodyRouteClass("home");
  showOnly("home");

  if (homeHeroImg) homeHeroImg.src = HOME.hero;

  // build sides on home only (safe to rebuild)
  clearHomeSides();
  if (leftStack) HOME.left.forEach((src) => leftStack.appendChild(makeSideBox(src)));
  if (rightStack) HOME.right.forEach((src) => rightStack.appendChild(makeSideBox(src)));

  // nav none selected on home
  ["films", "about", "contact"].forEach((key) => setNavImage(key, { selected: false, hovered: false }));
}

/* -----------------------------
   FILMS GRID (hover blur + overlay)
------------------------------ */
function renderFilms() {
  setBodyRouteClass("films");
  showOnly("films");
  clearHomeSides();
  syncNavImages();

  if (!filmsGrid) return;
  filmsGrid.innerHTML = "";

  const sorted = [...FILMS].sort((a, b) => (b.feature ? 1 : 0) - (a.feature ? 1 : 0));

  sorted.forEach((f) => {
    const card = document.createElement("article");
    card.className = "filmTile grainHover" + (f.feature ? " is-feature" : "");
    card.dataset.slug = f.slug;
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", f.title);

    // background still
    const bg = document.createElement("img");
    bg.className = "filmStill";
    bg.src = f.still;
    bg.alt = "";

    // overlay panel
    const overlay = document.createElement("div");
    overlay.className = "filmOverlay";

    const logo = document.createElement("img");
    logo.className = "filmLogo";
    logo.src = f.logo;
    logo.alt = `${f.title} logo`;

    const meta = document.createElement("div");
    meta.className = "filmMetaLine";
    meta.textContent = `${f.year} • ${f.minutes} min. • ${f.genres}`;

    overlay.appendChild(logo);
    overlay.appendChild(meta);

    card.appendChild(bg);
    card.appendChild(overlay);

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

/* -----------------------------
   ABOUT / CONTACT
------------------------------ */
function renderAbout() {
  setBodyRouteClass("about");
  showOnly("about");
  clearHomeSides();
  syncNavImages();

  if (aboutImg) aboutImg.src = ABOUT.photo;
  if (aboutBody) aboutBody.innerHTML = ABOUT.body;
}

function renderContact() {
  setBodyRouteClass("contact");
  showOnly("contact");
  clearHomeSides();
  syncNavImages();

  if (contactBody) contactBody.innerHTML = CONTACT.body;

  if (contactLinks) {
    contactLinks.innerHTML = "";
    CONTACT.links.forEach((l) => {
      const a = document.createElement("a");
      a.href = l.href;
      a.textContent = l.label;
      a.target = "_blank";
      a.rel = "noreferrer";
      contactLinks.appendChild(a);
    });
  }
}

/* -----------------------------
   FILM DETAIL
------------------------------ */
function renderFilm(slug) {
  setBodyRouteClass("film");
  showOnly("film");
  clearHomeSides();
  syncNavImages(); // films stays selected because route-film maps to films

  const f = FILMS.find((x) => x.slug === slug);
  if (!f) return renderError(`Film not found: ${slug}`);

  if (filmHeroImg) filmHeroImg.src = f.hero;
  if (filmTitle) filmTitle.textContent = f.title;
  if (filmMeta) filmMeta.textContent = `${f.year} • ${f.minutes} min. • ${f.genres}`;
  if (filmDesc) filmDesc.textContent = f.desc || "";

  if (filmActions) {
    filmActions.innerHTML = "";
    (f.links || []).forEach((l) => {
      const a = document.createElement("a");
      a.href = l.href;
      a.textContent = l.label;
      a.target = "_blank";
      a.rel = "noreferrer";
      filmActions.appendChild(a);
    });
  }
}

function renderError(msg) {
  setBodyRouteClass("error");
  showOnly("error");
  clearHomeSides();
  if (errorText) errorText.textContent = msg || "Something went wrong.";
  ["films", "about", "contact"].forEach((key) => setNavImage(key, { selected: false, hovered: false }));
}

/* -----------------------------
   NAV / CLICK WIRES
------------------------------ */
function go(hash) {
  location.hash = hash;
}

function goToFilm(slug) {
  go(`#film/${slug}`);
}

function wireNav() {
  const homeLink = $("#homeLink");
  if (homeLink) homeLink.addEventListener("click", () => go("#home"));

  navButtons.forEach((btn) => {
    const route = btn.getAttribute("data-route");
    btn.addEventListener("click", () => go(`#${route}`));
  });

  // Hover swapping for button assets (selected/notselected + hover)
  navButtons.forEach((btn) => {
    const route = btn.getAttribute("data-route"); // films/about/contact

    btn.addEventListener("pointerenter", () => {
      const active = currentActiveNavKey();
      const selected = active === route;
      setNavImage(route, { selected, hovered: true });
    });

    btn.addEventListener("pointerleave", () => {
      const active = currentActiveNavKey();
      const selected = active === route;
      setNavImage(route, { selected, hovered: false });
    });
  });

  // Ensure initial images exist immediately
  ["films", "about", "contact"].forEach((k) => setNavImage(k, { selected: false, hovered: false }));
}

/* -----------------------------
   ROUTE DISPATCH
------------------------------ */
function renderFromRoute() {
  const r = parseRoute();

  if (r.page === "home") return renderHome();
  if (r.page === "films") return renderFilms();
  if (r.page === "about") return renderAbout();
  if (r.page === "contact") return renderContact();
  if (r.page === "film") return renderFilm(r.slug);
  return renderError(r.message);
}

/* -----------------------------
   INIT
------------------------------ */
function init() {
  wireNav();
  window.addEventListener("hashchange", () => {
    renderFromRoute();
    syncNavImages();
  });

  renderFromRoute();
  syncNavImages();
}

document.addEventListener("DOMContentLoaded", init);
