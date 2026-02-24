const $ = s => document.querySelector(s);

const SITE = {
  home: {
    hero: "assets/stills/home-center.jpg",
    left: ["assets/stills/home-left-1.jpg","assets/stills/home-left-2.jpg"],
    right:["assets/stills/home-right-1.jpg","assets/stills/home-right-2.jpg"]
  },
  about:{ photo:"assets/stills/about.jpg", bio:"Your bio goes here." },
  contact:{
    body:"Contact:",
    links:[
      {label:"Email", value:"you@email.com", href:"mailto:you@email.com"},
      {label:"Instagram", value:"@you", href:"https://instagram.com/you"}
    ]
  },
  films:[
    {id:"humanzee", title:"Humanzee", year:"2024", runtime:"23 min", genres:"Horror / Drama", tile:"assets/stills/humanzee.jpg", hero:"assets/stills/humanzee.jpg", logo:"assets/films/humanzee/humanzee-logo.png", desc:""},
    {id:"rendezvous", title:"Rendezvous", year:"2023", runtime:"16 min", genres:"Crime / Comedy", tile:"assets/stills/rendezvous.jpg", hero:"assets/stills/rendezvous.jpg", logo:"assets/films/rendezvous/rendezvous-logo.png", desc:""},
    {id:"uap", title:"UAP", year:"2022", runtime:"12 min", genres:"Comedy / Drama / Sci-Fi", tile:"assets/stills/uap.jpg", hero:"assets/stills/uap.jpg", logo:"assets/films/uap/uap-logo.png", desc:""},
    {id:"dragons", title:"Do Dragons Sleep in Fictitious Caves?", year:"2022", runtime:"4 min", genres:"Horror / Drama", tile:"assets/stills/dragons.jpg", hero:"assets/stills/dragons.jpg", logo:"assets/films/dragons/do-dragons-sleep-in-fictitious-caves-logo.png", desc:""},
    {id:"aspens", title:"The Whispers of the Aspens", year:"2022", runtime:"1 min", genres:"Horror", tile:"assets/stills/aspens.jpg", hero:"assets/stills/aspens.jpg", logo:"assets/films/aspens/the-whispers-of-the-aspens-logo.png", desc:""}
  ]
};

const views = {
  home: $("#view-home"),
  films: $("#view-films"),
  about: $("#view-about"),
  contact: $("#view-contact"),
  film: $("#view-film"),
  error: $("#view-error")
};

function show(route){
  Object.values(views).forEach(v=>{
    v.classList.remove("is-active");
    v.hidden = true;
  });
  if(views[route]){
    views[route].hidden=false;
    views[route].classList.add("is-active");
  }
}

function navigate(hash){
  history.pushState(null,"",hash);
  handleRoute();
}

function handleRoute(){
  const h = (location.hash||"#home").replace("#","");
  if(h==="home"){ document.body.classList.add("route-home"); show("home"); return; }
  document.body.classList.remove("route-home");

  if(h==="films"){ show("films"); return; }
  if(h==="about"){ show("about"); return; }
  if(h==="contact"){ show("contact"); return; }

  if(h.startsWith("film/")){
    const id = h.split("/")[1];
    const f = SITE.films.find(x=>x.id===id);
    if(!f){ show("error"); return; }
    $("#filmHeroImg").src = f.hero;
    $("#filmTitle").textContent = f.title;
    $("#filmMeta").textContent = `${f.year} — ${f.runtime} — ${f.genres}`;
    $("#filmDesc").textContent = f.desc || "";
    show("film");
    return;
  }

  show("home");
}

function renderHome(){
  $("#homeHero").src = SITE.home.hero;
}

function renderFilms(){
  const grid = $("#filmsGrid");
  grid.innerHTML="";
  SITE.films.forEach(f=>{
    const d=document.createElement("div");
    d.className="tile";
    d.innerHTML=`
      <img class="tileImg" src="${f.tile}">
      <div class="tileInfo">
        <img class="tileLogo" src="${f.logo}">
        <div class="tileTitle">${f.title}</div>
        <div class="tileMeta">${f.year} • ${f.runtime} • ${f.genres}</div>
      </div>
    `;
    d.onclick=()=>navigate(`#film/${f.id}`);
    grid.appendChild(d);
  });
}

function renderAbout(){
  $("#aboutImg").src = SITE.about.photo;
  $("#aboutBody").textContent = SITE.about.bio;
}

function renderContact(){
  $("#contactBody").textContent = SITE.contact.body;
  const wrap=$("#contactLinks");
  wrap.innerHTML="";
  SITE.contact.links.forEach(l=>{
    const a=document.createElement("a");
    a.href=l.href;
    a.textContent=`${l.label}: ${l.value}`;
    a.target="_blank";
    wrap.appendChild(a);
  });
}

document.addEventListener("click",e=>{
  const tab=e.target.closest(".tab");
  if(tab) navigate(`#${tab.dataset.route}`);
  if(e.target.closest("#homeLink")) navigate("#home");
});

renderHome();
renderFilms();
renderAbout();
renderContact();

if(!location.hash) location.hash="#home";
handleRoute();
window.addEventListener("popstate", handleRoute);
