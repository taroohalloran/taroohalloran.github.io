const $ = (s) => document.querySelector(s);

const homeLink = $("#homeLink");
const siteSubtitle = $("#siteSubtitle");
const footerLine = $("#footerLine");

const stageImg = $("#stageImg");
const panelTitle = $("#panelTitle");
const panelMeta = $("#panelMeta");
const panelBody = $("#panelBody");
const panelActions = $("#panelActions");

const galleryGrid = $("#galleryGrid");
const galleryScroll = $("#galleryScroll");

const railLeft = $("#railLeft");
const railRight = $("#railRight");
const navButtons = Array.from(document.querySelectorAll(".nav-btn"));

let DATA = null;

function setNavActive(route) {
  navButtons.forEach(btn => {
    const on = btn.dataset.route === route;
    btn.setAttribute("aria-current", on ? "page" : "false");
  });
}

function renderActions(actions = []) {
  panelActions.innerHTML = "";
  actions.forEach(a => {
    const el = document.createElement("a");
    el.className = "action";
    el.href = a.href;

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

function setHero(hero) {
  stageImg.src = hero.image || "";
  stageImg.alt = hero.title || "";
  panelTitle.textContent = hero.title || "";
  panelMeta.textContent = hero.meta || "";
  panelBody.textContent = hero.body || "";
  renderActions(hero.actions || []);
}

function renderGallery(items = []) {
  galleryGrid.innerHTML = "";
  items.forEach(it => {
    const cell = document.createElement("div");
    cell.className = "gal-item";
    cell.innerHTML = `<img src="${it.image}" alt="" loading="lazy">`;
    galleryGrid.appendChild(cell);
  });
  // reset scroll to top when route changes
  galleryScroll.scrollTop = 0;
}

function renderHome() {
  setNavActive(""); // none selected on home
  const h = DATA.home.hero;
  setHero(h);
  renderGallery(DATA.home.gallery || []);
  history.replaceState(null, "", "#home");
}

function initRails() {
  // Minimal placeholder rails: duplicate gallery items into rails if you want.
  // You can customize these later to swap hero content.
  railLeft.innerHTML = "";
  railRight.innerHTML = "";

  const items = (DATA.home.gallery || []).slice(0, 4);
  items.forEach((it, idx) => {
    const d = document.createElement("div");
    d.className = "thumb";
    d.title = `thumb ${idx+1}`;
    d.innerHTML = `<img src="${it.image}" alt="" loading="lazy">`;
    d.addEventListener("click", () => {
      // On click, swap hero image to the clicked still (keeps title/meta)
      stageImg.src = it.image;
    });
    (idx % 2 === 0 ? railLeft : railRight).appendChild(d);
  });
}

async function init() {
  const res = await fetch("data/site.json", { cache: "no-store" });
  DATA = await res.json();

  siteSubtitle.textContent = DATA.site?.subtitle || "";
  footerLine.textContent = DATA.site?.footer || "";

  initRails();

  // Name always returns home
  homeLink.addEventListener("click", renderHome);

  // Tabs for now just route hashes; you’ll expand to full routes later
  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const route = btn.dataset.route;
      setNavActive(route);
      // For now: just change the panel content so you can see the interaction
      panelTitle.textContent = route.toUpperCase();
      panelMeta.textContent = "";
      panelBody.textContent = "Hook this route to its data next.";
      panelActions.innerHTML = "";
      history.pushState(null, "", `#${route}`);
      galleryScroll.scrollTop = 0;
    });
  });

  // Start at home
  renderHome();
}

init().catch(err => {
  panelTitle.textContent = "Error";
  panelBody.textContent = String(err);
});
