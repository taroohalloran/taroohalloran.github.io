// app.js — full file

const $ = (s) => document.querySelector(s);

const SITE = {
  home: {
    hero: "assets/stills/home-center.jpg",
    left: ["assets/stills/home-left-1.jpg", "assets/stills/home-left-2.jpg"],
    right: ["assets/stills/home-right-1.jpg", "assets/stills/home-right-2.jpg"]
  },
  about: { photo: "assets/stills/about-photo.jpg", bio: "Write your bio here." },
  contact: {
    body: "For inquiries:",
    links: [
      { label: "Email", value: "YOUR_EMAIL@DOMAIN.COM", href: "mailto:YOUR_EMAIL@DOMAIN.COM" },
      { label: "Instagram", value: "@YOUR_HANDLE", href: "https://instagram.com/YOUR_HANDLE" }
    ]
  },
  films: [
    { id:"humanzee", title:"Humanzee", year:"2024", runtime:"23 min.", genres:"Horror / Drama", tile:"assets/stills/tile-humanzee.jpg", hero:"assets/stills/tile-humanzee.jpg", logo:"assets/films/humanzee/humanzee-logo.png", desc:"", actions:[] },
    { id:"rendezvous", title:"Rendezvous", year:"2023", runtime:"16 min.", genres:"Crime / Comedy", tile:"assets/stills/tile-rendezvous.jpg", hero:"assets/stills/tile-rendezvous.jpg", logo:"assets/films/rendezvous/rendezvous-logo.png", desc:"", actions:[] },
    { id:"uap", title:"UAP", year:"2022", runtime:"12 min.", genres:"Comedy / Drama / Sci-Fi", tile:"assets/stills/tile-uap.jpg", hero:"assets/stills/tile-uap.jpg", logo:"assets/films/uap/uap-logo.png", desc:"", actions:[] },
    { id:"dragons", title:"Do Dragons Sleep in Fictitious Caves?", year:"2022", runtime:"4 min.", genres:"Horror / Drama", tile:"assets/stills/tile-dragons.jpg", hero:"assets/stills/tile-dragons.jpg", logo:"assets/films/dragons/do-dragons-sleep-in-fictitious-caves-logo.png", desc:"", actions:[] },
    { id:"aspens", title:"The Whispers of the Aspens", year:"2022", runtime:"1 min.", genres:"Horror", tile:"assets/stills/tile-aspens.jpg", hero:"assets/stills/tile-aspens.jpg", logo:"assets/films/aspens/the-whispers-of-the-aspens-logo.png", desc:"", actions:[] }
  ]
};

const viewHome=$("#view-home"), viewFilms=$("#view-films"), viewAbout=$("#view-about"), viewContact=$("#view-contact"), viewFilm=$("#view-film");
const homeHero=$("#homeHero"), leftStack=$("#homeLeftStack"), rightStack=$("#homeRightStack"), filmsGrid=$("#filmsGrid");
let currentRoute="home", flickerTimer=null;

function setHeaderState(route){ document.body.classList.toggle("route-home", route==="home"); }

function showOnly(viewEl){
  [viewHome,viewFilms,viewAbout,viewContact,viewFilm].forEach(v=>{
    if(!v) return;
    v.hidden = v!==viewEl;
    v.classList.toggle("is-active", v===viewEl);
  });
}

function triggerFlicker(){
  if(flickerTimer) clearTimeout(flickerTimer);
  document.body.classList.remove("fx-flicker");
  void document.body.offsetHeight; // force reflow
  document.body.classList.add("fx-flicker");
  flickerTimer=setTimeout(()=>document.body.classList.remove("fx-flicker"),240);
}

async function transitionTo(route){
  if(route===currentRoute) return;
  triggerFlicker();
  currentRoute=route;
  if(route==="home"){ setHeaderState("home"); showOnly(viewHome); }
  else if(route==="films"){ setHeaderState("films"); showOnly(viewFilms); }
}

function navigate(hash){ history.pushState(null,"",hash); handleRoute(); }

function handleRoute(){
  const h=(location.hash||"#home").replace("#","");
  if(!h||h==="home") return transitionTo("home");
  if(h==="films") return transitionTo("films");
}

function makeSideTile(src){
  const d=document.createElement("div");
  d.className="sideTile";
  d.innerHTML=`<img src="${src}" alt="">`;
  return d;
}

function renderHome(){
  homeHero.src=SITE.home.hero;
  leftStack.innerHTML=""; rightStack.innerHTML="";
  SITE.home.left.forEach(s=>leftStack.appendChild(makeSideTile(s)));
  SITE.home.right.forEach(s=>rightStack.appendChild(makeSideTile(s)));
}

function renderFilms(){
  filmsGrid.innerHTML="";
  SITE.films.slice(0,5).forEach(f=>{
    const t=document.createElement("div");
    t.className="tile";
    t.innerHTML=`<img class="tileImg" src="${f.tile}"><div class="tileInfo"><img class="tileLogo" src="${f.logo}" alt=""></div>`;
    t.onclick=()=>navigate(`#film/${f.id}`);
    filmsGrid.appendChild(t);
  });
}

function init(){
  renderHome(); renderFilms();
  document.addEventListener("click",(e)=>{
    const tab=e.target.closest(".tab");
    if(tab){ e.preventDefault(); navigate(`#${tab.dataset.route}`); }
    const home=e.target.closest("#homeLink");
    if(home){ e.preventDefault(); navigate("#home"); }
  });
  if(!location.hash) history.replaceState(null,"","#home");
  setHeaderState("home"); showOnly(viewHome); handleRoute();
  window.addEventListener("popstate", handleRoute);
}

init();
