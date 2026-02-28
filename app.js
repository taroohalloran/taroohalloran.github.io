/* =========================================================
   TARO SITE ROUTER + UI — V2.2
   - Hash router (#home, #films, #about, #contact, #film/<slug>)
   - PNG nav button assets from /assets/ui/
   - Fonts: EB Garamond + Cormorant Garamond (loaded via CSS)
   - Films grid: hover overlay on desktop, always-visible strip on mobile
   - Film detail: three types (youtube+gallery, slideshow, youtube)
   - Humanzee: laurels + press & publications sections
   - Letterboxd / Watch action buttons per film
   - Lightbox with focus trapping + touch/swipe
   - Slideshow with touch/swipe
   - Film burn transitions, loading state
   - About: press kit layout (bio, festival laurels, press)
   - Error: "REEL MISSING" page
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
   type: "youtube+gallery" | "slideshow" | "youtube"
   actions: array of { label, href, variant? }
     variant "lbd" = Letterboxd green style
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
    laurels: [
      { img: "assets/films/humanzee/laurels/laurel-01.png", href: "" },
      { img: "assets/films/humanzee/laurels/laurel-02.png", href: "" },
      { img: "assets/films/humanzee/laurels/laurel-03.png", href: "" },
      { img: "assets/films/humanzee/laurels/laurel-04.png", href: "" },
      { img: "assets/films/humanzee/laurels/laurel-05.png", href: "" },
      { img: "assets/films/humanzee/laurels/laurel-06.png", href: "" },
      { img: "assets/films/humanzee/laurels/laurel-07.png", href: "" },
      { img: "assets/films/humanzee/laurels/laurel-08.png", href: "" },
      { img: "assets/films/humanzee/laurels/laurel-09.png", href: "" },
      { img: "assets/films/humanzee/laurels/laurel-10.png", href: "" },
    ],
    press: [
      { type: "review", quote: "Replace this with a press quote.", source: "PUBLICATION NAME" },
      { type: "article", title: "Replace with article title.", source: "OUTLET NAME" },
      { type: "press-release", title: "Replace with press release title.", source: "SOURCE NAME" },
    ],
    letterboxd: "",
    actions: [
      { label: "WATCH", href: "https://www.youtube.com/watch?v=atS2CL-sMSs" },
      { label: "LOG IT ON LETTERBOXD", href: "https://letterboxd.com/", variant: "lbd" },
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
    letterboxd: "",
    actions: [
      { label: "WATCH", href: "https://www.youtube.com/watch?v=6H2bz3OdPy8" },
      { label: "LOG IT ON LETTERBOXD", href: "https://letterboxd.com/", variant: "lbd" },
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
    letterboxd: "",
    actions: [
      { label: "LOG IT ON LETTERBOXD", href: "https://letterboxd.com/", variant: "lbd" },
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
    actions: [],
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
    actions: [
      { label: "WATCH", href: "https://www.youtube.com/watch?v=zg2Qe_hOSyE" },
    ],
  },
];

/* Home images */
const HOME = {
  hero: "assets/backgrounds/bg.jpg",
  left: ["assets/backgrounds/home-left-1.jpg", "assets/backgrounds/home-left-2.jpg"],
  right: ["assets/backgrounds/home-right-1.jpg", "assets/backgrounds/home-right-2.jpg"],
  bottom: [
    "assets/backgrounds/home-bottom-1.jpg",
    "assets/backgrounds/home-bottom-2.jpg",
    "assets/backgrounds/home-bottom-3.jpg",
  ],
};

const ABOUT = {
  photo: "assets/branding/about-photo.jpg",
  bio: `
    <p><strong>Taro O'Halloran</strong> is a writer, director, and producer based in Massachusetts, working in horror and genre with a handmade, grindhouse-forward sensibility.</p>
    <p>Replace this with your bio copy.</p>
  `,
  festivalLaurels: [
    { img: "assets/branding/laurels/festival-01.png", href: "" },
    { img: "assets/branding/laurels/festival-02.png", href: "" },
    { img: "assets/branding/laurels/festival-03.png", href: "" },
    { img: "assets/branding/laurels/festival-04.png", href: "" },
    { img: "assets/branding/laurels/festival-05.png", href: "" },
    { img: "assets/branding/laurels/festival-06.png", href: "" },
    { img: "assets/branding/laurels/festival-07.png", href: "" },
    { img: "assets/branding/laurels/festival-08.png", href: "" },
    { img: "assets/branding/laurels/festival-09.png", href: "" },
    { img: "assets/branding/laurels/festival-10.png", href: "" },
  ],
  press: [
    { type: "review", quote: "Replace this with a press quote.", source: "PUBLICATION NAME" },
    { type: "article", title: "Replace with article title.", source: "OUTLET NAME" },
  ],
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
const homeBottomRow = $("#homeBottomRow");
const leftStack = $("#homeLeftStack");
const rightStack = $("#homeRightStack");
const filmsGrid = $("#filmsGrid");
const aboutWrap = $("#aboutWrap");
const contactBody = $("#contactBody");
const contactLinks = $("#contactLinks");
const errorSub = $("#errorSub");
const navButtons = $$(".navBtn");

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
   LOADING STATE
------------------------------ */
function initLoading() {
  const overlay = $("#loadingOverlay");
  if (!overlay) return;

  function done() {
    overlay.classList.add("is-done");
    setTimeout(() => { overlay.style.display = "none"; }, 700);
  }

  // Fade out after all DOM content + key images are ready
  if (document.readyState === "complete") {
    done();
  } else {
    window.addEventListener("load", done, { once: true });
    // Fallback — never block more than 3s
    setTimeout(done, 3000);
  }
}

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
   CROSSFADE TRANSITION — replaces film burn
   Fades main frame out (150ms), switches route, fades back in (200ms)
------------------------------ */
const FADE_OUT_MS = 150;
const FADE_IN_MS = 200;

function crossfade(cb) {
  const frame = document.querySelector(".frame");
  if (!frame) {
    console.warn("crossfade: .frame element not found, skipping transition");
    cb();
    return;
  }

  frame.style.transition = `opacity ${FADE_OUT_MS}ms ease`;
  frame.style.opacity = "0";

  setTimeout(() => {
    cb();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        frame.style.transition = `opacity ${FADE_IN_MS}ms ease`;
        frame.style.opacity = "1";
      });
    });
  }, FADE_OUT_MS);
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
    "route-home","route-films","route-about",
    "route-contact","route-film","route-error"
  );
  document.body.classList.add(`route-${page}`);
}

/* -----------------------------
   HOME
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

  // Bottom row of images partially hidden by vignette
  if (homeBottomRow) {
    homeBottomRow.innerHTML = "";
    HOME.bottom.forEach((src) => {
      const box = document.createElement("div");
      box.className = "homeBottomBox";
      const img = document.createElement("img");
      img.alt = "";
      img.src = src;
      hideOnError(img);
      box.appendChild(img);
      homeBottomRow.appendChild(box);
    });
  }

  clearHomeSides();
  if (leftStack) HOME.left.forEach((src) => leftStack.appendChild(makeSideBox(src)));
  if (rightStack) HOME.right.forEach((src) => rightStack.appendChild(makeSideBox(src)));

  ["films", "about", "contact"].forEach((key) => setNavImage(key, { selected: false, hovered: false }));
}

/* -----------------------------
   FILMS GRID
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

    const bg = document.createElement("img");
    bg.className = "filmStill";
    bg.src = f.still;
    bg.alt = "";

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

    // Mobile always-visible info strip
    const mobileInfo = document.createElement("div");
    mobileInfo.className = "filmMobileInfo";
    const mobileTitle = document.createElement("div");
    mobileTitle.className = "filmMobileTitle";
    mobileTitle.textContent = f.title;
    const mobileYear = document.createElement("div");
    mobileYear.className = "filmMobileYear";
    mobileYear.textContent = `${f.year} \u00b7 ${f.genres}`;
    mobileInfo.appendChild(mobileTitle);
    mobileInfo.appendChild(mobileYear);

    card.appendChild(bg);
    card.appendChild(overlay);
    card.appendChild(mobileInfo);

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
   ABOUT — PRESS KIT LAYOUT
------------------------------ */
function buildLaurelSlot({ img, href }) {
  const el = href ? document.createElement("a") : document.createElement("div");
  el.className = "laurelSlot";
  if (href) { el.href = href; el.target = "_blank"; el.rel = "noreferrer"; }
  const imgEl = document.createElement("img");
  imgEl.alt = "Festival laurel";
  hideOnError(imgEl);
  imgEl.src = img;
  el.appendChild(imgEl);
  return el;
}

function buildPressItem(item) {
  const wrap = document.createElement("div");
  wrap.className = "pressItem";
  if (item.type === "review") {
    const q = document.createElement("p");
    q.className = "pressItemQuote";
    q.textContent = `\u201c${item.quote}\u201d`;
    wrap.appendChild(q);
  } else {
    const t = document.createElement("p");
    t.className = "pressItemTitle";
    t.textContent = item.title;
    wrap.appendChild(t);
  }
  const src = document.createElement("p");
  src.className = "pressItemSource";
  src.textContent = item.source;
  wrap.appendChild(src);
  return wrap;
}

function renderAbout() {
  setBodyRouteClass("about");
  showOnly("about");
  clearHomeSides();
  stopSlideshow();
  syncNavImages();

  if (!aboutWrap) return;
  aboutWrap.innerHTML = "";

  const kit = document.createElement("div");
  kit.className = "aboutPressKit";

  // Left column: photo
  const photoCol = document.createElement("div");
  photoCol.className = "aboutPhotoCol";

  const photo = document.createElement("img");
  photo.className = "aboutPhoto filmGrade";
  photo.src = ABOUT.photo;
  photo.alt = "Taro O\u2019Halloran";
  hideOnError(photo);
  photoCol.appendChild(photo);

  // Right column: bio + festivals + press
  const rightCol = document.createElement("div");
  rightCol.className = "aboutRightCol";

  // Header
  const hdr = document.createElement("h2");
  hdr.className = "aboutHeader";
  hdr.textContent = "ABOUT THE FILMMAKER";
  rightCol.appendChild(hdr);

  // Bio
  const bio = document.createElement("div");
  bio.className = "aboutBio";
  bio.innerHTML = ABOUT.bio;
  rightCol.appendChild(bio);

  // Festival selections
  if (ABOUT.festivalLaurels && ABOUT.festivalLaurels.length > 0) {
    const festSection = document.createElement("div");
    festSection.className = "aboutFestSection";

    const festLabel = document.createElement("p");
    festLabel.className = "sectionLabel";
    festLabel.textContent = "FESTIVAL SELECTIONS";
    festSection.appendChild(festLabel);

    const laurelRow = document.createElement("div");
    laurelRow.className = "laurelRow";
    ABOUT.festivalLaurels.forEach((l) => laurelRow.appendChild(buildLaurelSlot(l)));
    festSection.appendChild(laurelRow);

    rightCol.appendChild(festSection);
  }

  // Press
  if (ABOUT.press && ABOUT.press.length > 0) {
    const pressSection = document.createElement("div");
    pressSection.className = "aboutPressSection";

    const pressLabel = document.createElement("p");
    pressLabel.className = "sectionLabel";
    pressLabel.textContent = "PRESS";
    pressSection.appendChild(pressLabel);

    const pressItems = document.createElement("div");
    pressItems.className = "pressItems";
    ABOUT.press.forEach((p) => pressItems.appendChild(buildPressItem(p)));
    pressSection.appendChild(pressItems);

    rightCol.appendChild(pressSection);
  }

  kit.appendChild(photoCol);
  kit.appendChild(rightCol);
  aboutWrap.appendChild(kit);
}

/* -----------------------------
   CONTACT
------------------------------ */
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

function buildSlideshow(slides, title) {
  const container = document.createElement("div");
  container.className = "filmSlideshow";

  const slidesWrap = document.createElement("div");
  slidesWrap.className = "slidesWrap";

  slides.forEach((src, i) => {
    const img = document.createElement("img");
    img.className = "slideImg filmGrade" + (i === 0 ? " is-active" : "");
    img.alt = `${title} slide ${i + 1}`;
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

  function getVisibleImgs() {
    return Array.from(slidesWrap.querySelectorAll(".slideImg")).filter(
      (img) => img.style.display !== "none"
    );
  }

  function goToSlide(idx) {
    const imgs = getVisibleImgs();
    if (imgs.length === 0) return;
    idx = ((idx % imgs.length) + imgs.length) % imgs.length;
    slideshowIndex = idx;
    imgs.forEach((img, i) => img.classList.toggle("is-active", i === idx));
  }

  prevBtn.addEventListener("click", () => goToSlide(slideshowIndex - 1));
  nextBtn.addEventListener("click", () => goToSlide(slideshowIndex + 1));

  slideshowInterval = setInterval(() => goToSlide(slideshowIndex + 1), 4000);

  // Touch/swipe support
  addSwipe(container, {
    onLeft: () => goToSlide(slideshowIndex + 1),
    onRight: () => goToSlide(slideshowIndex - 1),
  });

  return container;
}

/* -----------------------------
   LIGHTBOX — with focus trapping
------------------------------ */
let lbPaths = [];
let lbIndex = 0;
let lbTitle = "";
let lbPrevFocus = null;

const LB_FOCUSABLE = ["#lbClose", "#lbPrev", "#lbNext"];

function openLightbox(paths, idx, title) {
  lbPaths = paths;
  lbIndex = idx;
  lbTitle = title;
  lbPrevFocus = document.activeElement;
  updateLightbox();
  const lb = $("#lightbox");
  if (lb) {
    lb.hidden = false;
    $("#lbClose").focus();
  }
}

function closeLightbox() {
  const lb = $("#lightbox");
  if (lb) lb.hidden = true;
  if (lbPrevFocus) {
    try { lbPrevFocus.focus(); } catch (_) {}
    lbPrevFocus = null;
  }
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

  // Backdrop click
  lb.addEventListener("click", (e) => {
    if (e.target === lb) closeLightbox();
  });

  // Keyboard: Esc, arrows, Tab trap
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") { closeLightbox(); return; }
    if (e.key === "ArrowLeft") {
      lbIndex = (lbIndex - 1 + lbPaths.length) % lbPaths.length;
      updateLightbox();
      return;
    }
    if (e.key === "ArrowRight") {
      lbIndex = (lbIndex + 1) % lbPaths.length;
      updateLightbox();
      return;
    }
    // Tab focus trapping
    if (e.key === "Tab") {
      const focusable = LB_FOCUSABLE.map((sel) => $(sel)).filter(Boolean);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  });

  // Touch/swipe on lightbox image
  addSwipe(lb, {
    onLeft: () => { lbIndex = (lbIndex + 1) % lbPaths.length; updateLightbox(); },
    onRight: () => { lbIndex = (lbIndex - 1 + lbPaths.length) % lbPaths.length; updateLightbox(); },
  });
}

/* -----------------------------
   TOUCH / SWIPE HELPER
------------------------------ */
function addSwipe(el, { onLeft, onRight, threshold = 40 }) {
  let startX = null;
  el.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });
  el.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > threshold) {
      if (dx < 0) onLeft();
      else onRight();
    }
    startX = null;
  }, { passive: true });
}

/* -----------------------------
   FILM DETAIL — BUILDERS
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

function buildLaurelRow(laurels) {
  if (!laurels || laurels.length === 0) return null;
  const row = document.createElement("div");
  row.className = "filmLaurelRow";
  laurels.forEach(({ img, href }) => {
    const slot = href ? document.createElement("a") : document.createElement("div");
    slot.className = "filmLaurelSlot";
    if (href) { slot.href = href; slot.target = "_blank"; slot.rel = "noreferrer"; }
    const imgEl = document.createElement("img");
    imgEl.alt = "Festival laurel";
    hideOnError(imgEl);
    imgEl.src = img;
    slot.appendChild(imgEl);
    row.appendChild(slot);
  });
  return row;
}

function buildPressSection(pressItems) {
  if (!pressItems || pressItems.length === 0) return null;
  const section = document.createElement("div");
  section.className = "filmPressSection";

  const label = document.createElement("p");
  label.className = "filmPressLabel";
  label.textContent = "PRESS & PUBLICATIONS";
  section.appendChild(label);

  const items = document.createElement("div");
  items.className = "filmPressItems";
  pressItems.forEach((item) => {
    const wrap = document.createElement("div");
    wrap.className = "filmPressItem";
    if (item.type === "review") {
      const q = document.createElement("p");
      q.className = "filmPressQuote";
      q.textContent = `\u201c${item.quote}\u201d`;
      wrap.appendChild(q);
    } else {
      const t = document.createElement("p");
      t.className = "filmPressTitleText";
      t.textContent = item.title;
      wrap.appendChild(t);
    }
    const src = document.createElement("p");
    src.className = "filmPressSource";
    src.textContent = item.source;
    wrap.appendChild(src);
    items.appendChild(wrap);
  });
  section.appendChild(items);
  return section;
}

function buildActionButtons(actions) {
  if (!actions || actions.length === 0) return null;
  const row = document.createElement("div");
  row.className = "filmActions";
  actions.forEach(({ label, href, variant }) => {
    const a = document.createElement("a");
    a.className = "filmActionBtn" + (variant === "lbd" ? " is-lbd" : "");
    a.href = href;
    a.target = "_blank";
    a.rel = "noreferrer";
    a.textContent = label;
    row.appendChild(a);
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

  // Info block
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

  // Action buttons (Watch / Letterboxd)
  const actions = buildActionButtons(f.actions || []);
  if (actions) sleeve.appendChild(actions);

  // Humanzee laurels
  if (f.laurels && f.laurels.length > 0) {
    const lr = buildLaurelRow(f.laurels);
    if (lr) sleeve.appendChild(lr);
  }

  // Gallery row (youtube+gallery)
  if (f.type === "youtube+gallery") {
    const gallery = buildGalleryRow(f.gallery || [], f.title);
    if (gallery) sleeve.appendChild(gallery);
  }

  // Press & Publications
  if (f.press && f.press.length > 0) {
    const pressSection = buildPressSection(f.press);
    if (pressSection) sleeve.appendChild(pressSection);
  }

  page.appendChild(sleeve);
}

/* -----------------------------
   ERROR
------------------------------ */
function renderError(msg) {
  setBodyRouteClass("error");
  showOnly("error");
  clearHomeSides();
  if (errorSub && msg) errorSub.textContent = msg;
  ["films", "about", "contact"].forEach((key) => setNavImage(key, { selected: false, hovered: false }));
}

/* -----------------------------
   NAV / ROUTING
------------------------------ */
function go(hash) {
  crossfade(() => { location.hash = hash; });
}

function wireNav() {
  const homeLink = $("#homeLink");
  if (homeLink) homeLink.addEventListener("click", () => go("#home"));

  navButtons.forEach((btn) => {
    const route = btn.getAttribute("data-route");
    btn.addEventListener("click", () => go(`#${route}`));
  });

  navButtons.forEach((btn) => {
    const route = btn.getAttribute("data-route");
    btn.addEventListener("pointerenter", () => {
      setNavImage(route, { selected: currentActiveNavKey() === route, hovered: true });
    });
    btn.addEventListener("pointerleave", () => {
      setNavImage(route, { selected: currentActiveNavKey() === route, hovered: false });
    });
  });

  ["films", "about", "contact"].forEach((k) => setNavImage(k, { selected: false, hovered: false }));
}

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
  initLoading();
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
