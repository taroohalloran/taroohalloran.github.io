/* =========================================================
   TARO SITE ROUTER + UI (V2)
   - Hash router (#home, #films, #about, #contact, #film/<slug>)
   - PNG nav button assets from /assets/ui/
   - Films grid uses poster stills; hover zoom + blur; overlay logo+meta
   - Hover grain is CLIPPED to the element only (no big circle/box)
   - Home-only side stacks (never on other pages)
   - Film detail: three types (youtube+gallery, slideshow, youtube)
   - Lightbox, crossfade slideshow, film burn transitions
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
   - type: "youtube+gallery" | "slideshow" | "youtube"
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
    type: "youtube+gallery",
    youtube: "https://www.youtube.com/embed/atS2CL-sMSs",
    gallery: [
      "assets/films/humanzee/gallery-1.jpg",
      "assets/films/humanzee/gallery-2.jpg",
      "assets/films/humanzee/gallery-3.jpg",
      "assets/films/humanzee/gallery-4.jpg",
      "assets/films/humanzee/gallery-5.jpg",
    ],
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
    type: "youtube+gallery",
    youtube: "https://www.youtube.com/embed/6H2bz3OdPy8",
    gallery: [
      "assets/films/rendezvous/gallery-1.jpg",
      "assets/films/rendezvous/gallery-2.jpg",
      "assets/films/rendezvous/gallery-3.jpg",
      "assets/films/rendezvous/gallery-4.jpg",
      "assets/films/rendezvous/gallery-5.jpg",
    ],
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
    type: "slideshow",
    slides: [
      "assets/films/uap/slide-1.jpg",
      "assets/films/uap/slide-2.jpg",
      "assets/films/uap/slide-3.jpg",
      "assets/films/uap/slide-4.jpg",
      "assets/films/uap/slide-5.jpg",
    ],
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
    type: "slideshow",
    slides: [
      "assets/films/dragons/slide-1.jpg",
      "assets/films/dragons/slide-2.jpg",
      "assets/films/dragons/slide-3.jpg",
      "assets/films/dragons/slide-4.jpg",
      "assets/films/dragons/slide-5.jpg",
    ],
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
    type: "youtube",
    youtube: "https://www.youtube.com/embed/zg2Qe_hOSyE",
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
    <p><strong>Taro O'Halloran</strong> is a writer/director/producer based in Massachusetts, working in horror and genre with a handmade, grindhouse-forward sensibility.</p>
    <p>Replace this with your bio copy.</p>
  `,
};

const CONTACT = {
  body: `<p>For inquiries:</p>`,
  items: [
    { label: "Email", value: "YOUR_EMAIL@DOMAIN.COM", href: "mailto:YOUR_EMAIL@DOMAIN.COM" },
    { label: "Instagram", value: "@YOUR_HANDLE", href: "https://instagram.com/YOUR_HANDLE" },
    { label: "IMDb", value: "Taro O\u2019Halloran", href: "https://www.imdb.com/" },
  ],
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

  const btn = img.closest(".navBtn");
  if (btn) btn.classList.toggle("is-active", selected);
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
   FILM BURN TRANSITION
------------------------------ */
function filmBurn(cb) {
  const overlay = $("#burnOverlay");
  if (!overlay) { cb(); return; }

  overlay.style.display = "block";
  overlay.style.opacity = "0";
  overlay.style.transition = "opacity 130ms ease-in";

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.style.opacity = "1";
      setTimeout(() => {
        cb();
        overlay.style.transition = "opacity 220ms ease-out";
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            overlay.style.opacity = "0";
            setTimeout(() => { overlay.style.display = "none"; }, 220);
          });
        });
      }, 130);
    });
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
  stopSlideshow();

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
  stopSlideshow();
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
    bg.className = "filmStill filmGrade";
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
    meta.textContent = `${f.year} \u2022 ${f.minutes} min. \u2022 ${f.genres}`;

    overlay.appendChild(logo);
    overlay.appendChild(meta);

    card.appendChild(bg);
    card.appendChild(overlay);

    card.addEventListener("click", () => go(`#film/${f.slug}`));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        go(`#film/${f.slug}`);
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
  stopSlideshow();
  syncNavImages();

  if (aboutImg) aboutImg.src = ABOUT.photo;
  if (aboutBody) aboutBody.innerHTML = ABOUT.body;
}

function renderContact() {
  setBodyRouteClass("contact");
  showOnly("contact");
  clearHomeSides();
  stopSlideshow();
  syncNavImages();

  if (contactBody) contactBody.innerHTML = CONTACT.body;

  if (contactLinks) {
    contactLinks.innerHTML = "";
    (CONTACT.items || []).forEach((item) => {
      const a = document.createElement("a");
      a.className = "contactBadge";
      a.href = item.href;
      a.target = "_blank";
      a.rel = "noreferrer";

      const label = document.createElement("span");
      label.className = "badgeLabel";
      label.textContent = item.label;

      const value = document.createElement("span");
      value.className = "badgeValue";
      value.textContent = item.value;

      a.appendChild(label);
      a.appendChild(value);
      contactLinks.appendChild(a);
    });
  }
}

/* -----------------------------
   SLIDESHOW
------------------------------ */
let slideshowInterval = null;
let slideshowIndex = 0;

function stopSlideshow() {
  if (slideshowInterval) {
    clearInterval(slideshowInterval);
    slideshowInterval = null;
  }
}

function buildSlideshow(slides, filmTitle) {
  const container = document.createElement("div");
  container.className = "filmSlideshow";

  const slidesWrap = document.createElement("div");
  slidesWrap.className = "slidesWrap";

  slides.forEach((src, i) => {
    const img = document.createElement("img");
    img.className = "slideImg filmGrade" + (i === 0 ? " is-active" : "");
    img.alt = `${filmTitle} slide ${i + 1}`;
    img.loading = i === 0 ? "eager" : "lazy";
    hideOnError(img);
    img.src = src;
    slidesWrap.appendChild(img);
  });

  const prevBtn = document.createElement("button");
  prevBtn.className = "slideArrow slideArrow-prev";
  prevBtn.type = "button";
  prevBtn.setAttribute("aria-label", "Previous slide");
  prevBtn.innerHTML = "&#8249;";

  const nextBtn = document.createElement("button");
  nextBtn.className = "slideArrow slideArrow-next";
  nextBtn.type = "button";
  nextBtn.setAttribute("aria-label", "Next slide");
  nextBtn.innerHTML = "&#8250;";

  container.appendChild(slidesWrap);
  container.appendChild(prevBtn);
  container.appendChild(nextBtn);

  slideshowIndex = 0;
  stopSlideshow();

  function goToSlide(idx) {
    const imgs = Array.from(slidesWrap.querySelectorAll(".slideImg")).filter(
      (img) => img.style.display !== "none"
    );
    if (imgs.length === 0) return;
    idx = ((idx % imgs.length) + imgs.length) % imgs.length;
    slideshowIndex = idx;
    imgs.forEach((img, i) => img.classList.toggle("is-active", i === idx));
  }

  prevBtn.addEventListener("click", () => goToSlide(slideshowIndex - 1));
  nextBtn.addEventListener("click", () => goToSlide(slideshowIndex + 1));

  slideshowInterval = setInterval(() => goToSlide(slideshowIndex + 1), 4000);

  return container;
}

/* -----------------------------
   LIGHTBOX
------------------------------ */
let lbPaths = [];
let lbIndex = 0;
let lbTitle = "";

function openLightbox(paths, idx, title) {
  lbPaths = paths;
  lbIndex = idx;
  lbTitle = title;
  updateLightbox();
  const lb = $("#lightbox");
  if (lb) {
    lb.hidden = false;
    lb.focus();
  }
}

function closeLightbox() {
  const lb = $("#lightbox");
  if (lb) lb.hidden = true;
}

function updateLightbox() {
  const img = $("#lbImg");
  if (!img) return;
  img.src = lbPaths[lbIndex] || "";
  img.alt = `${lbTitle} still ${lbIndex + 1}`;
  const counter = $("#lbCounter");
  if (counter) counter.textContent = `${lbIndex + 1} / ${lbPaths.length}`;
}

function wireLightbox() {
  const lb = $("#lightbox");
  if (!lb) return;

  $("#lbClose").addEventListener("click", closeLightbox);

  $("#lbPrev").addEventListener("click", () => {
    lbIndex = (lbIndex - 1 + lbPaths.length) % lbPaths.length;
    updateLightbox();
  });

  $("#lbNext").addEventListener("click", () => {
    lbIndex = (lbIndex + 1) % lbPaths.length;
    updateLightbox();
  });

  lb.addEventListener("click", (e) => {
    if (e.target === lb) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") {
      lbIndex = (lbIndex - 1 + lbPaths.length) % lbPaths.length;
      updateLightbox();
    }
    if (e.key === "ArrowRight") {
      lbIndex = (lbIndex + 1) % lbPaths.length;
      updateLightbox();
    }
  });
}

/* -----------------------------
   HELPERS
------------------------------ */
function formatFilmMeta(f) {
  return `${f.year} \u00b7 ${f.minutes} min. \u00b7 ${f.genres}`;
}

function hideOnError(img) {
  img.onerror = () => { img.style.display = "none"; };
}

/* -----------------------------
   FILM DETAIL -- BUILDERS
------------------------------ */
function buildYoutubeEmbed(src) {
  const wrap = document.createElement("div");
  wrap.className = "filmEmbedWrap";
  const iframe = document.createElement("iframe");
  iframe.className = "filmEmbed";
  iframe.src = src;
  iframe.title = "Film embed";
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
  iframe.allowFullscreen = true;
  iframe.loading = "lazy";
  wrap.appendChild(iframe);
  return wrap;
}

function buildGalleryRow(paths, title) {
  if (!paths || paths.length === 0) return null;
  const row = document.createElement("div");
  row.className = "filmGalleryRow";

  paths.forEach((src, i) => {
    const img = document.createElement("img");
    img.className = "filmGalleryThumb filmGrade";
    img.alt = `${title} still ${i + 1}`;
    img.loading = "lazy";
    hideOnError(img);
    img.src = src;
    img.addEventListener("click", () => openLightbox(paths, i, title));
    row.appendChild(img);
  });

  return row;
}

/* -----------------------------
   FILM DETAIL
------------------------------ */
function renderFilm(slug) {
  setBodyRouteClass("film");
  showOnly("film");
  clearHomeSides();
  stopSlideshow();
  syncNavImages();

  const f = FILMS.find((x) => x.slug === slug);
  if (!f) return renderError(`Film not found: ${slug}`);

  const page = $("#filmPage");
  if (!page) return;
  page.innerHTML = "";

  const sleeve = document.createElement("div");
  sleeve.className = "vhsSleeve";

  // Media at top
  if (f.type === "youtube" || f.type === "youtube+gallery") {
    sleeve.appendChild(buildYoutubeEmbed(f.youtube));
  } else if (f.type === "slideshow") {
    sleeve.appendChild(buildSlideshow(f.slides || [], f.title));
  }

  // Info: title, meta, description
  const info = document.createElement("div");
  info.className = "vhsInfo";

  const titleEl = document.createElement("h1");
  titleEl.className = "vhsTitle";
  titleEl.textContent = f.title;
  info.appendChild(titleEl);

  const meta = document.createElement("div");
  meta.className = "vhsMeta";
  meta.textContent = formatFilmMeta(f);
  info.appendChild(meta);

  const desc = document.createElement("p");
  desc.className = "vhsDesc";
  desc.textContent = f.desc || "";
  info.appendChild(desc);

  sleeve.appendChild(info);

  // Gallery row (youtube+gallery only)
  if (f.type === "youtube+gallery") {
    const gallery = buildGalleryRow(f.gallery || [], f.title);
    if (gallery) sleeve.appendChild(gallery);
  }

  page.appendChild(sleeve);
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
  filmBurn(() => { location.hash = hash; });
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
  wireLightbox();
  window.addEventListener("hashchange", () => {
    renderFromRoute();
    syncNavImages();
  });

  renderFromRoute();
  syncNavImages();
}

document.addEventListener("DOMContentLoaded", init);
