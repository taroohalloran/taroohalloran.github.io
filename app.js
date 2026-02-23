const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

const homeLink = $("#homeLink");
const siteSubtitle = $("#siteSubtitle");
const footerLine = $("#footerLine");

const railLeft = $("#railLeft");
const railRight = $("#railRight");

const views = $("#views");
const viewHome = $("#view-home");
const viewFilms = $("#view-films");
const viewAbout = $("#view-about");
const viewContact = $("#view-contact");

const navButtons = $$(".nav-btn");

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
  // On home, none highlighted
  if (route === "home") navButtons.forEach(btn => btn.setAttribute("aria-current", "false"));
}

function showView(route) {
  const all = [viewHome, viewFilms, viewAbout, viewContact];
  const target =
    route === "home" ? viewHome :
    route === "films" ? viewFilms :
    route === "about" ? viewAbout :
    viewContact;

  all.forEach(v => {
    const active = v === target;
    v.hidden = false; // keep in DOM for transitions
    v.classList.toggle("is-active", active);
  });

  // Hide non-active after transition ends to prevent tabbing into them
  window.setTimeout(() => {
    all.forEach(v => { if (!v.classList.contains("is-active")) v.hidden = true; });
  }, 280);
}

async function transitionTo(route) {
  if (route === currentRoute) return;

  const currentView = document.querySelector(`.view.is-active`);
  if (currentView) currentView.classList.add("is-fading-out");

  // Let fade-out start
  await new Promise(r => setTimeout(r, 140));

  currentRoute = route;
  setBodyRoute(route);
  setNav(route);

  // Swap active view
  if (currentView) currentView.classList.remove("is-active");
  if (currentView) currentView.classList.remove("is-fading-out");

  showView(route);
}

function renderRails() {
  railLeft.innerHTML = "";
  railRight.innerHTML = "";

  const makeThumb = (src) => {
    const d = document.createElement("div");
    d.className = "thumb";
    d.innerHTML = `<img src="${src}" alt="" loading="lazy">`;
    return d;
  };

  (DATA.rails?.left || []).forEach(src => railLeft.appendChild(makeThumb(src)));
  (DATA.rails?.right || []).forEach(src => railRight.appendChild(makeThumb(src)));
}

function renderHome() {
  homeStageImg.src = DATA.home.stageImage;
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
  const f = DATA.films.find(x => x.id === filmId) || DATA.films[0];
  currentFilmId = f.id;

  filmStageImg.src = f.stageImage || f.poster;
  filmStageImg.alt = f.title;

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

  // highlight selected
  $$(".filmCard").forEach(card => {
    card.setAttribute("aria-selected", card.dataset.filmId === f.id ? "true" : "false");
  });
}

function renderFilms() {
  filmList.innerHTML = "";
  DATA.films.forEach(f => {
    const card = document.createElement("div");
    card.className = "filmCard";
    card.dataset.filmId = f.id;
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-selected", "false");
    card.innerHTML = `
      <img src="${f.poster}" alt="" loading="lazy">
      <div>
        <div class="filmCardTitle">${escapeHtml(f.title).toUpperCase()}</div>
        <div class="filmCardMeta">${escapeHtml([f.year, f.meta].filter(Boolean).join(" — "))}</div>
      </div>
    `;
    const open = () => renderFilmDetail(f.id);
    card.addEventListener("click", open);
    card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") open(); });
    filmList.appendChild(card);
  });

  renderFilmDetail(currentFilmId || DATA.films[0]?.id);
}

function renderAbout() {
  aboutPhoto.src = DATA.about.photo;
  aboutMeta.textContent = DATA.about.meta || "";
  aboutBody.textContent = DATA.about.body || "";
}

function renderContact() {
  contactMeta.textContent = DATA.contact.meta || "";
  contactBody.textContent = DATA.contact.body || "";

  contactLinks.innerHTML = "";
  (DATA.contact.items || []).forEach(it => {
    const a = document.createElement("a");
    a.className = "contactLink";
    a.href = it.href;
    if (!it.href.startsWith("mailto:")) { a.target = "_blank"; a.rel = "noreferrer"; }
    a.innerHTML = `<span>${escapeHtml(it.label)}</span><span>${escapeHtml(it.value)}</span>`;
    contactLinks.appendChild(a);
  });
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function routeFromHash() {
  const raw = (location.hash || "").replace("#", "").trim();
  if (!raw) return "home";
  if (["home","films","about","contact"].includes(raw)) return raw;
  return "home";
}

async function init() {
  const res = await fetch("data/site.json", { cache: "no-store" });
  DATA = await res.json();

  siteSubtitle.textContent = DATA.site.subtitle || "";
  footerLine.textContent = DATA.site.footer || "";

  renderRails();
  renderHome();
  renderFilms();
  renderAbout();
  renderContact();

  // Home link
  homeLink.addEventListener("click", async () => {
    history.pushState(null, "", "#home");
    await transitionTo("home");
  });

  // Nav
  navButtons.forEach(btn => {
    btn.addEventListener("click", async () => {
      const route = btn.dataset.route;
      history.pushState(null, "", `#${route}`);
      await transitionTo(route);
    });
  });

  // Initial route
  const start = routeFromHash();
  currentRoute = start;
  setBodyRoute(start);
  setNav(start);
  showView(start);

  // Back/forward
  window.addEventListener("popstate", async () => {
    const r = routeFromHash();
    await transitionTo(r);
  });
}

init().catch(err => {
  console.error(err);
});
