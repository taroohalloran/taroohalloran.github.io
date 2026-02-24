/* =========================================================
   TARO SITE ROUTER + UI (FULL)
   - fixes broken pages
   - uses PNG nav button assets from assets/ui/
   - hover grain stays clipped to element (no square boxes)
========================================================= */

const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

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
  }
};

/* If any of these filenames differ, they must match exactly. */
const FILMS = [
  {
    slug: "humanzee",
    title: "HUMANZEE",
    year: "2024",
    minutes: "23",
    genres: "Horror/Drama",
    logo: "assets/films/humanzee-logo.png",
    hero: "assets/films/humanzee-hero.jpg",
    desc: "Replace this with your Humanzee description.",
    links: [
      // { label: "Watch", href: "#" },
    ],
    feature: true
  },
  {
    slug: "rendezvous",
    title: "RENDEZVOUS",
    year: "2023",
    minutes: "16",
    genres: "Crime/Comedy",
    logo: "assets/films/rendezvous-logo.png",
    hero: "assets/films/rendezvous-hero.jpg",
    desc: "Replace this with your Rendezvous description.",
    links: []
  },
  {
    slug: "uap",
    title: "Do Dragons Sleep in Fictitious Caves?",
    year: "2022",
    minutes: "4",
    genres: "Horror/Drama",
    logo: "assets/films/uap-logo.png",
    hero: "assets/films/uap-hero.jpg",
    desc: "Replace this with your description.",
    links: []
  },
  {
    slug: "whispers",
    title: "The Whispers of the Aspens",
    year: "2022",
    minutes: "1",
    genres: "Horror",
    logo: "assets/films/the-whispers-of-the-aspens-logo.png",
    hero: "assets/films/the-whispers-of-the-aspens-hero.jpg",
    desc: "Replace this with your description.",
    links: []
  }
];

/* Home images (placeholders; safe if missing) */
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

/* Nav buttons */
const navButtons = $$(".navBtn");
const navImgs = $$(".navBtnImg");

/* -----------------------------
   PRELOAD (avoids “nothing shows” feel)
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

function syncNavImages(activeRoute) {
  ["films", "about", "contact"].forEach(key => {
    const isSelected = (activeRoute === key);
    setNavImage(key, { selected: isSelected, hovered: false });
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
   ROUTING
   Uses hash routes: #home, #films, #about, #contact, #film/<slug>
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
function renderHome() {
  setBodyRouteClass("home");
  showOnly("home");

  // hero
  if (homeHeroImg) homeHeroImg.src = HOME.hero;

  // side stacks (only build once)
  if (leftStack && leftStack.childElementCount === 0) {
    HOME.left.forEach(src => leftStack.appendChild(makeSideBox(src)));
  }
  if (rightStack && rightStack.childElementCount === 0) {
    HOME.right.forEach(src => rightStack.appendChild(makeSideBox(src)));
  }

  // nav state (no tab "selected" on home)
  ["films","about","contact"].forEach(key => setNavImage(key, { selected:false, hovered:false }));
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

function renderFilms() {
  setBodyRouteClass("films");
  showOnly("films");
  syncNavImages("films");

  if (!filmsGrid) return;
  filmsGrid.innerHTML = "";

  const sorted = [...FILMS].sort((a,b) => (b.feature ? 1 : 0) - (a.feature ? 1 : 0));

  sorted.forEach(f => {
    const card = document.createElement("article");
    card.className = "filmCard grainHover" + (f.feature ? " is-feature" : "");
    card.dataset.slug = f.slug;
    card.tabIndex = 0;
    card.setAttribute("role","button");
    card.setAttribute("aria-label", `${f.title}`);

    const inner = document.createElement("div");
    inner.className = "filmInner";

    const logo = document.createElement("img");
    logo.className = "filmLogo";
    logo.src = f.logo;
    logo.alt = `${f.title} logo`;

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

function renderAbout() {
  setBodyRouteClass("about");
  showOnly("about");
  syncNavImages("about");

  if (aboutImg) aboutImg.src = ABOUT.photo;
  if (aboutBody) aboutBody.innerHTML = ABOUT.body;
}

function renderContact() {
  setBodyRouteClass("contact");
  showOnly("contact");
  syncNavImages("contact");

  if (contactBody) contactBody.innerHTML = CONTACT.body;

  if (contactLinks) {
    contactLinks.innerHTML = "";
    CONTACT.links.forEach(l => {
      const a = document.createElement("a");
      a.href = l.href;
      a.textContent = l.label;
      a.target = "_blank";
      a.rel = "noreferrer";
      a.style.display = "inline-block";
      a.style.marginRight = "14px";
      a.style.color = "rgba(255,255,255,0.85)";
      contactLinks.appendChild(a);
    });
  }
}

function renderFilm(slug) {
  setBodyRouteClass("film");
  showOnly("film");
  // keep nav in a sane state: films selected when in film detail
  syncNavImages("films");

  const f = FILMS.find(x => x.slug === slug);
  if (!f) {
    renderError(`Film not found: ${slug}`);
    return;
  }

  if (filmHeroImg) filmHeroImg.src = f.hero;
  if (filmTitle) filmTitle.textContent = f.title;
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
      a.style.display = "inline-block";
      a.style.marginRight = "12px";
      a.style.padding = "10px 14px";
      a.style.border = "1px solid rgba(255,255,255,0.25)";
      a.style.borderRadius = "999px";
      a.style.color = "rgba(255,255,255,0.85)";
      a.style.textDecoration = "none";
      filmActions.appendChild(a);
    });
  }
}

function renderError(msg) {
  setBodyRouteClass("error");
  showOnly("error");
  if (errorText) errorText.textContent = msg || "Something went wrong.";
  // nav state: none selected
  ["films","about","contact"].forEach(key => setNavImage(key, { selected:false, hovered:false }));
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
  // Name logo returns home
  const homeLink = $("#homeLink");
  if (homeLink) homeLink.addEventListener("click", () => go("#home"));

  // Route buttons
  navButtons.forEach(btn => {
    const route = btn.getAttribute("data-route");
    btn.addEventListener("click", () => go(`#${route}`));
  });

  // Hover swapping for button assets (selected/notselected + hover)
  navButtons.forEach(btn => {
    const route = btn.getAttribute("data-route"); // films/about/contact
    btn.addEventListener("pointerenter", () => {
      const current = parseRoute();
      const active = (current.page === "film") ? "films" : current.page;
      const selected = (active === route);
      setNavImage(route, { selected, hovered: true });
    });
    btn.addEventListener("pointerleave", () => {
      const current = parseRoute();
      const active = (current.page === "film") ? "films" : current.page;
      const selected = (active === route);
      setNavImage(route, { selected, hovered: false });
    });
  });

  // Ensure images exist immediately (prevents “still nothing”)
  // default home: all not-selected standard
  ["films","about","contact"].forEach(k => setNavImage(k, { selected:false, hovered:false }));
}

/* -----------------------------
   ROUTE DISPATCH
------------------------------ */
function renderFromRoute() {
  const r = parseRoute();

  // This prevents “buttons disappear / page dead” regressions:
  // Always keep nav images in sync after view render.
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
  window.addEventListener("hashchange", renderFromRoute);
  renderFromRoute();
}

document.addEventListener("DOMContentLoaded", init);
