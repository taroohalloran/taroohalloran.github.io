const $ = (s) => document.querySelector(s);

const siteTitle = $("#siteTitle");
const siteSubtitle = $("#siteSubtitle");
const footerLine = $("#footerLine");

const stageImg = $("#stageImg");
const panelTitle = $("#panelTitle");
const panelMeta = $("#panelMeta");
const panelBody = $("#panelBody");
const panelActions = $("#panelActions");

const railLeft = $("#railLeft");
const railRight = $("#railRight");

const gallery = $("#gallery");
const galleryGrid = $("#galleryGrid");

const navButtons = Array.from(document.querySelectorAll(".nav-btn"));

let DATA = null;
let currentRoute = "films";

function setNav(route) {
  navButtons.forEach(btn => {
    const isActive = btn.dataset.route === route;
    btn.setAttribute("aria-current", isActive ? "page" : "false");
  });
}

function setHero(hero) {
  stageImg.src = hero.image || "";
  stageImg.alt = hero.title || "";
  panelTitle.textContent = hero.title || "";
  panelMeta.textContent = hero.meta || "";
  panelBody.textContent = hero.body || "";
  renderActions(hero.actions || []);
}

function renderActions(actions) {
  panelActions.innerHTML = "";
  actions.forEach(a => {
    const el = document.createElement("a");
    el.className = "action";
    el.href = a.href;

    // internal anchor or mailto stays same tab; external opens new tab
    const isMail = a.href.startsWith("mailto:");
    const isHash = a.href.startsWith("#");
    if (!isMail && !isHash) {
      el.target = "_blank";
      el.rel = "noreferrer";
    }

    el.textContent = a.label;
    panelActions.appendChild(el);
  });
}

function renderGallery(route) {
  const r = DATA.routes[route];
  const items = r?.gallery || [];

  // only show gallery on FILMS route
  if (route !== "films" || items.length === 0) {
    gallery.style.display = "none";
    galleryGrid.innerHTML = "";
    return;
  }

  gallery.style.display = "block";
  galleryGrid.innerHTML = "";

  items.forEach(it => {
    const cell = document.createElement("div");
    cell.className = "gal-item";
    cell.innerHTML = `<img src="${it.image}" alt="" loading="lazy">`;
    galleryGrid.appendChild(cell);
  });
}

function renderRoute(route) {
  const r = DATA.routes[route];
  if (!r) return;

  currentRoute = route;
  setNav(route);

  setHero(r.hero);
  renderGallery(route);

  // update hash for deep linking
  history.pushState(null, "", `#${route}`);
}

function makeThumb(item) {
  const d = document.createElement("div");
  d.className = "thumb";
  d.title = item.title || "";
  d.innerHTML = `<img src="${item.image}" alt="${item.title || "thumbnail"}" loading="lazy">`;

  d.addEventListener("click", () => {
    // 1) Jump to a route
    if (item.goRoute) {
      renderRoute(item.goRoute);
      return;
    }

    // 2) Use hero from a route (e.g. films)
    if (item.setHeroFromRoute) {
      const r = DATA.routes[item.setHeroFromRoute];
      if (r?.hero) {
        setNav(item.setHeroFromRoute);
        setHero(r.hero);
        renderGallery(item.setHeroFromRoute);
        history.pushState(null, "", `#${item.setHeroFromRoute}`);
      }
      return;
    }

    // 3) Custom hero (TLURA preview etc.)
    if (item.customHero) {
      setNav(currentRoute);
      setHero(item.customHero);
      // keep gallery state based on current route
      renderGallery(currentRoute);
      return;
    }
  });

  return d;
}

function renderRails() {
  railLeft.innerHTML = "";
  railRight.innerHTML = "";

  (DATA.rails?.left || []).forEach(it => railLeft.appendChild(makeThumb(it)));
  (DATA.rails?.right || []).forEach(it => railRight.appendChild(makeThumb(it)));
}

function parseHash() {
  const raw = (location.hash || "").replace("#", "").trim();
  if (!raw) return "films";
  if (DATA.routes[raw]) return raw;
  return "films";
}

async function init() {
  const res = await fetch("data/site.json", { cache: "no-store" });
  DATA = await res.json();

  siteTitle.textContent = DATA.site?.title || "Taro O’Halloran";
  siteSubtitle.textContent = DATA.site?.subtitle || "";
  footerLine.textContent = DATA.site?.footer || "";

  renderRails();

  // nav clicks
  navButtons.forEach(btn => {
    btn.addEventListener("click", () => renderRoute(btn.dataset.route));
  });

  // initial
  const route = parseHash();
  renderRoute(route);

  // back/forward
  window.addEventListener("popstate", () => {
    const r = parseHash();
    // popstate shouldn't push a new hash
    const routeObj = DATA.routes[r];
    if (!routeObj) return;
    currentRoute = r;
    setNav(r);
    setHero(routeObj.hero);
    renderGallery(r);
  });
}

init().catch(err => {
  panelTitle.textContent = "Error loading site";
  panelBody.textContent = String(err);
});
