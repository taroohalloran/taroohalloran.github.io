// app.js — FULL FILE (matches your index.html exactly)

const $ = (s) => document.querySelector(s);

const SITE = {
  home: {
    hero: "assets/stills/home-center.jpg",
    left: ["assets/stills/home-left-1.jpg", "assets/stills/home-left-2.jpg"],
    right: ["assets/stills/home-right-1.jpg", "assets/stills/home-right-2.jpg"]
  },

  about: {
    photo: "assets/stills/about-photo.jpg",
    bio: "Write your bio here."
  },

  contact: {
    body: "For inquiries:",
    links: [
      { label: "Email", value: "YOUR_EMAIL@DOMAIN.COM", href: "mailto:YOUR_EMAIL@DOMAIN.COM" },
      { label: "Instagram", value: "@YOUR_HANDLE", href: "https://instagram.com/YOUR_HANDLE" }
    ]
  },

  films: [
    {
      id: "humanzee",
      title: "Humanzee",
      year: "2024",
      runtime: "23 min.",
      genres: "Horror/Drama",
      tile: "assets/stills/tile-humanzee.jpg",
      hero: "assets/stills/tile-humanzee.jpg",
      logo: "assets/films/humanzee/humanzee-logo.png",
      desc: "",
      actions: []
    },
    {
      id: "rendezvous",
      title: "Rendezvous",
      year: "2023",
      runtime: "16 min.",
      genres: "Crime/Comedy",
      tile: "assets/stills/tile-rendezvous.jpg",
      hero: "assets/stills/tile-rendezvous.jpg",
      logo: "assets/films/rendezvous/rendezvous-logo.png",
      desc: "",
      actions: []
    },
    {
      id: "uap",
      title: "UAP",
      year: "2022",
      runtime: "12 min.",
      genres: "Comedy/Drama/Sci-Fi",
      tile: "assets/stills/tile-uap.jpg",
      hero: "assets/stills/tile-uap.jpg",
      logo: "assets/films/uap/uap-logo.png",
      desc: "",
      actions: []
    },
    {
      id: "dragons",
      title: "Do Dragons Sleep in Fictitious Caves?",
      year: "2022",
      runtime: "4 min.",
      genres: "Horror/Drama",
      tile: "assets/stills/tile-dragons.jpg",
      hero: "assets/stills/tile-dragons.jpg",
      logo: "assets/films/dragons/do-dragons-sleep-in-fictitious-caves-logo.png",
      desc: "",
      actions: []
    },
    {
      id: "aspens",
      title: "The Whispers of the Aspens",
      year: "2022",
      runtime: "1 min.",
      genres: "Horror",
      tile: "assets/stills/tile-aspens.jpg",
      hero: "assets/stills/tile-aspens.jpg",
      logo: "assets/films/aspens/the-whispers-of-the-aspens-logo.png",
      desc: "",
      actions: []
    }
  ]
};

// ===== DOM refs =====
const viewHome = $("#view-home");
const viewFilms = $("#view-films");
const viewAbout = $("#view-about");
const viewContact = $("#view-contact");
const viewFilm = $("#view-film");
const viewError = $("#view-error");

const homeHero = $("#homeHero");
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

function showOnly(viewEl) {
  const all = [viewHome, viewFilms, viewAbout, viewContact, viewFilm, viewError].filter(Boolean);
  all.forEach(v => {
    v.hidden = v !== viewEl;
    v.classList.toggle("is-active", v === viewEl);
  });
}

// ===== ROUTE CLASS (drives vignette/header animation) =====
function setRouteClass(route){
  document.body.classList.remove("route-home","route-films","route-about","route-contact","route-film");
  if(route === "home") document.body.classList.add("route-home");
  else if(route === "films") document.body.classList.add("route-films");
  else if(route === "about") document.body.classList.add("route-about");
  else if(route === "contact") document.body.classList.add("route-contact");
  else if(route.startsWith("film/")) document.body.classList.add("route-film");
}

// ===== PNG TAB BUTTONS (4-state) =====
function tabSrc(base, selected, hover){
  const sel = selected ? "selected" : "notselected";
  const hov = hover ? "hover" : "standard";
  return `${base}-${sel}-${hov}.png`;
}

function setTabImage(btn, hover=false){
  const img = btn.querySelector("img.tabImg");
  if(!img) return;
  const base = img.dataset.base;
  if(!base) return;
  const selected = btn.getAttribute("aria-current") === "page";
  img.src = tabSrc(base, selected, hover);
}

function syncAllTabImages(){
  document.querySelectorAll(".tabImgBtn").forEach(btn => setTabImage(btn, false));
}

function preloadTabImages(){
  const bases = [...new Set(
    Array.from(document.querySelectorAll("img.tabImg"))
      .map(i => i.dataset.base)
      .filter(Boolean)
  )];

  const states = [
    ["notselected","standard"],
    ["notselected","hover"],
    ["selected","standard"],
    ["selected","hover"],
  ];

  bases.forEach(base=>{
    states.forEach(([sel, hov])=>{
      const im = new Image();
      im.src = `${base}-${sel}-${hov}.png`;
    });
  });
}

function setTabs(route){
  document.querySelectorAll(".tabImgBtn").forEach(btn=>{
    const active = btn.dataset.route === route;
    btn.setAttribute("aria-current", active ? "page" : "false");
  });

  // home & film pages: none selected
  if(route === "home" || route.startsWith("film/")){
    document.querySelectorAll(".tabImgBtn").forEach(btn=>btn.setAttribute("aria-current","false"));
  }

  syncAllTabImages();
}

// ===== NAVIGATION =====
function navigate(hash){
  history.pushState(null, "", hash);
  handleRoute();
}

// ===== RENDER HOME SIDE STACKS =====
function makeSideTile(src){
  const d = document.createElement("div");
  d.className = "sideTile";
  d.innerHTML = `<img src="${src}" alt="">`;
  return d;
}

function renderHome(){
  if(homeHero) homeHero.src = SITE.home.hero;

  if(leftStack) leftStack.innerHTML = "";
  if(rightStack) rightStack.innerHTML = "";

  (SITE.home.left || []).forEach(src => leftStack && leftStack.appendChild(makeSideTile(src)));
  (SITE.home.right || []).forEach(src => rightStack && rightStack.appendChild(makeSideTile(src)));
}

// ===== FILMS GRID =====
function renderFilms(){
  if(!filmsGrid) return;
  filmsGrid.innerHTML = "";

  SITE.films.slice(0,5).forEach(f=>{
    const tile = document.createElement("div");
    tile.className = "tile grainHover"; // <- per-element hover grain
    tile.dataset.film = f.id;

    tile.innerHTML = `
      <img class="tileImg" src="${f.tile}" alt="">
      <div class="tileInfo">
        ${f.logo ? `<img class="tileLogo" src="${f.logo}" alt="">` : ""}
        <div class="tileMeta">${f.year} • ${f.runtime} • ${f.genres}</div>
      </div>
    `;

    tile.addEventListener("click", () => navigate(`#film/${f.id}`));
    filmsGrid.appendChild(tile);
  });
}

// ===== ABOUT / CONTACT =====
function renderAbout(){
  if(aboutImg) aboutImg.src = SITE.about.photo;
  if(aboutBody) aboutBody.textContent = SITE.about.bio;
}

function renderContact(){
  if(contactBody) contactBody.textContent = SITE.contact.body;
  if(!contactLinks) return;

  contactLinks.innerHTML = "";
  (SITE.contact.links || []).forEach(l=>{
    const a = document.createElement("a");
    a.href = l.href;
    a.textContent = `${l.label}: ${l.value}`;
    a.className = "grainHoverLink";
    a.style.display = "block";
    a.style.marginTop = "10px";
    if(!l.href.startsWith("mailto:")){
      a.target = "_blank";
      a.rel = "noreferrer";
    }
    contactLinks.appendChild(a);
  });
}

// ===== FILM DETAIL =====
function renderFilmPage(f){
  if(filmHeroImg) filmHeroImg.src = f.hero || f.tile;
  if(filmTitle) filmTitle.textContent = f.title;
  if(filmMeta) filmMeta.textContent = `${f.year} — ${f.runtime} — ${f.genres}`;
  if(filmDesc) filmDesc.textContent = f.desc || "";

  if(!filmActions) return;
  filmActions.innerHTML = "";
  (f.actions || []).forEach(a=>{
    const el = document.createElement("a");
    el.href = a.href;
    el.textContent = a.label;
    el.className = "grainHoverLink";
    el.style.display = "inline-block";
    el.style.marginTop = "12px";
    el.style.marginRight = "10px";
    if(!a.href.startsWith("mailto:") && !a.href.startsWith("#")){
      el.target = "_blank";
      el.rel = "noreferrer";
    }
    filmActions.appendChild(el);
  });
}

// ===== ROUTER =====
function handleRoute(){
  const h = (location.hash || "#home").replace("#","");
  const route = h || "home";

  setRouteClass(route);
  setTabs(route);

  if(route === "home"){
    showOnly(viewHome);
    return;
  }
  if(route === "films"){
    showOnly(viewFilms);
    return;
  }
  if(route === "about"){
    showOnly(viewAbout);
    return;
  }
  if(route === "contact"){
    showOnly(viewContact);
    return;
  }

  if(route.startsWith("film/")){
    const id = route.split("/")[1];
    const film = SITE.films.find(f => f.id === id);
    if(!film){
      if(errorText) errorText.textContent = `Film not found: ${id}`;
      showOnly(viewError);
      return;
    }
    renderFilmPage(film);
    showOnly(viewFilm);
    return;
  }

  showOnly(viewHome);
}

// ===== EVENTS =====
function bindEvents(){
  // PNG tab hover swap + keyboard focus
  document.querySelectorAll(".tabImgBtn").forEach(btn=>{
    btn.addEventListener("mouseenter", ()=>setTabImage(btn,true));
    btn.addEventListener("mouseleave", ()=>setTabImage(btn,false));
    btn.addEventListener("focus", ()=>setTabImage(btn,true));
    btn.addEventListener("blur", ()=>setTabImage(btn,false));
  });

  // delegated click: tabs + homeLink
  document.addEventListener("click",(e)=>{
    const tab = e.target.closest(".tabImgBtn");
    if(tab){
      e.preventDefault();
      navigate(`#${tab.dataset.route}`);
      return;
    }

    const home = e.target.closest("#homeLink");
    if(home){
      e.preventDefault();
      navigate("#home");
      return;
    }
  });

  window.addEventListener("popstate", handleRoute);
}

// ===== INIT =====
function init(){
  // if any tab <img> has no src yet, set default so it appears immediately
  document.querySelectorAll("img.tabImg").forEach(img=>{
    if(!img.getAttribute("src")){
      const base = img.dataset.base;
      if(base) img.src = `${base}-notselected-standard.png`;
    }
  });

  preloadTabImages();
  syncAllTabImages();

  renderHome();
  renderFilms();
  renderAbout();
  renderContact();

  bindEvents();

  if(!location.hash) history.replaceState(null,"","#home");
  handleRoute();
}

document.addEventListener("DOMContentLoaded", init);
