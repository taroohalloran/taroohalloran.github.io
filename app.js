const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

function esc(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/**
 * GitHub Pages-safe: resolves correctly for both
 * - https://user.github.io/ (root)
 * - https://user.github.io/repo/ (project)
 */
async function fetchJson(relPath) {
  const url = new URL(relPath, window.location.href);
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`Fetch failed: ${url} → ${res.status} ${res.statusText}`);
  return res.json();
}

const homeLink = $("#homeLink");
const siteSubtitle = $("#siteSubtitle");
const footerLine = $("#footerLine");

const railLeft = $("#railLeft");
const railRight = $("#railRight");

const navButtons = $$(".nav-btn");

const viewHome = $("#view-home");
const viewFilms = $("#view-films");
const viewAbout = $("#view-about");
const viewContact = $("#view-contact");
const viewError = $("#view-error");
const errorBody = $("#errorBody");

const homeStageImg = $("#homeStageImg");
const homeMosaic = $("#homeMosaic");

const filmList = $("#filmList");
const filmStageImg = $("#filmStageImg");
const filmTitle = $("#filmTitle");
const filmMeta = $("#filmMeta");
const filmBody = $("#filmBody");
const filmActions = $("#filmActions");

const aboutPhoto = $("#aboutPhoto");
const aboutMeta = $("#aboutMeta");
const aboutBody = $("#aboutBody");

const contactMeta = $("#contactMeta");
const contactBody = $("#contactBody");
const contactLinks = $("#contactLinks");

let DATA = null;
let currentRoute = "home";
let currentFilmId = null;

function setBodyRoute(route) {
  document.body.classList.toggle("route-home", route === "home");
}

function setNav(route) {
  navButtons.forEach(btn => {
    const on = btn.dataset.route === route;
    btn.setAttribute("aria-current", on ? "page" : "false");
  });
  if (route === "home") navButtons.forEach(btn => btn.setAttribute("aria-current", "false"));
}

function showOnly(route) {
  const map = {
    home: viewHome,
    films: viewFilms,
    about: viewAbout,
    contact: viewContact,
    error: viewError
  };
  Object.entries(map).forEach(([key, el]) => {
    const active = key === route;
    el.hidden = !active;
    el.classList.toggle("is-active", active);
  });
}

async function transitionTo(route) {
  if (route === currentRoute) return;

  const current = document.querySelector(".view.is-active");
  if (current) current.classList.add("is-fading-out");

  await new Promise(r => setTimeout(r, 140));

  currentRoute = route;
  setBodyRoute(route);
  setNav(route);
  showOnly(route);

  setTimeout(() => {
    if (current) current.classList.remove("is-fading-out");
  }, 320);
}

function routeFromHash() {
  const raw = (location.hash || "").replace("#", "").trim();
  if (["home","films","about","contact"].includes(raw)) return raw;
  return "home";
}

function renderRails() {
  railLeft.innerHTML = "";
  railRight.innerHTML = "";

  const make = (src) => {
    const d = document.createElement("div");
    d.className = "thumb";
    d.innerHTML = `<img src="${src}" alt="" loading="lazy">`;
    return d;
  };

  (DATA.rails?.left || []).forEach(src => railLeft.appendChild(make(src)));
  (DATA.rails?.right || []).forEach(src => railRight.appendChild(make(src)));
}

function renderHome() {
  homeStageImg.src = DATA.home.stageImage || "";
  homeStageImg.alt = "";
  homeMosaic.innerHTML = "";

  (DATA.home.mosaic || []).forEach(src => {
    const cell = document.createElement("div");
    cell.className = "mosaic-item";
    cell.innerHTML = `<img src="${src}" alt="" loading="lazy">`;
    homeMosaic.appendChild(cell);
  });
}

function renderFilmDetail(filmId) {
  const f = (DATA.films || []).find(x => x.id === filmId) || (DATA.films || [])[0];
  if (!f) return;

  currentFilmId = f.id;
  filmStageImg.src = f.stageImage || f.poster || "";
  filmStageImg.alt = f.title || "";

  filmTitle.textContent = (f.title || "").toUpperCase();
  filmMeta.textContent = [f.year, f.meta].filter(Boolean).join(" — ");
  filmBody.textContent = f.body || "";

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

  $$(".filmCard").forEach(card => {
    card.setAttribute("aria-selected", card.dataset.filmId === f.id ? "true" : "false");
  });
}

function renderFilms() {
  filmList.innerHTML = "";

  (DATA.films || []).forEach(f => {
    const card = document.createElement("div");
    card.className = "filmCard";
    card.dataset.filmId = f.id;
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-selected", "false");
    card.innerHTML = `
      <img src="${f.poster || ""}" alt="" loading="lazy">
      <div>
        <div class="filmCardTitle">${esc(f.title).toUpperCase()}</div>
        <div class="filmCardMeta">${esc([f.year, f.meta].filter(Boolean).join(" — "))}</div>
      </div>
    `;
    const open = () => renderFilmDetail(f.id);
    card.addEventListener("click", open);
    card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") open(); });
    filmList.appendChild(card);
  });

  renderFilmDetail(currentFilmId || (DATA.films || [])[0]?.id);
}

function renderAbout() {
  aboutPhoto.src = DATA.about?.photo || "";
  aboutMeta.textContent = DATA.about?.meta || "";
  aboutBody.textContent = DATA.about?.body || "";
}

function renderContact() {
  contactMeta.textContent = DATA.contact?.meta || "";
  contactBody.textContent = DATA.contact?.body || "";

  contactLinks.innerHTML = "";
  (DATA.contact?.items || []).forEach(it => {
    const a = document.createElement("a");
    a.className = "contactLink";
    a.href = it.href || "#";
    if (!a.href.startsWith("mailto:")) { a.target = "_blank"; a.rel = "noreferrer"; }
    a.innerHTML = `<span>${esc(it.label)}</span><span>${esc(it.value)}</span>`;
    contactLinks.appendChild(a);
  });
}

async function init() {
  try {
    DATA = await fetchJson("data/site.json");
  } catch (err) {
    // show a readable error view (no silent failures)
    setBodyRoute("error");
    setNav("error");
    showOnly("error");
    errorBody.textContent =
      `Could not load data/site.json.\n\n` +
      String(err) + `\n\n` +
      `Fix:\n` +
      `• Ensure the repo contains: data/site.json (lowercase)\n` +
      `• Ensure GitHub Pages is deploying from main/(root)\n` +
      `• Ensure file/folder case matches exactly (data ≠ Data)\n`;
    return;
  }

  siteSubtitle.textContent = DATA.site?.subtitle || "";
  footerLine.textContent = DATA.site?.footer || "";

  renderRails();
  renderHome();
  renderFilms();
  renderAbout();
  renderContact();

  // name → home
  homeLink.addEventListener("click", async () => {
    history.pushState(null, "", "#home");
    await transitionTo("home");
  });

  // tabs
  navButtons.forEach(btn => {
    btn.addEventListener("click", async () => {
      const route = btn.dataset.route;
      history.pushState(null, "", `#${route}`);
      await transitionTo(route);
    });
  });

  // initial
  const start = routeFromHash();
  currentRoute = start;
  setBodyRoute(start);
  setNav(start);
  showOnly(start);

  window.addEventListener("popstate", async () => {
    await transitionTo(routeFromHash());
  });
}

init();
