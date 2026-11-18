// URL du Web App Google Apps Script (voir apps-script.gs / README.md)
const API_URL = "";

const TIER_COLORS = ["#ff7f7f","#ffbf7f","#ffdf7f","#bfff7f","#7fbfff","#c49bff"];
const tiers = names => ["goat","excellent","bien","mid","nul","ru"].map((id,i)=>({id, name:names[i], color:TIER_COLORS[i]}));

// Chaque liste a son propre onglet sur le site et sa propre feuille dans la Google Sheet.
const LISTS = [
  {
    id: "events", tab: "Events", title: "TIER LIST DES EVENTS",
    sub: "Glisse chaque event dans son tier, puis valide ta tier list en bas.",
    poolTitle: "Events à classer",
    tiers: tiers(["GOAT","Excellent","Bien","Mid","Nul","J'préfère le RU"]),
    items: ["Préranks","Bienvenue","BCLG","Sainte B","Sainte C","Sainte D","SKZ","508","Croisière",
      "WTP","Wix promo maraine","Wix JP","Délivrance","Gala de Cluny","GUAI","Le CE","Micro UAI","Exances"]
  },
  {
    id: "assos", tab: "Assos", title: "TIER LIST DES ASSOS",
    sub: "Glisse chaque asso dans son tier, puis valide ta tier list en bas.",
    poolTitle: "Assos à classer",
    tiers: tiers(["GOAT","Excellent","Bien","Mid","Nul","France Travail"]),
    items: ["Pians","Comit's","HH","4H","Zoulou","FU","Estime","UAI","BFS","Gazole","ZC","DDP","ERS","DAP",
      "Gadzarbre","Grand-mère","DDC","Zi-Atrium","AE","CDF","GG","TQ","Zizag","Zi-spy","Zi-phot's","Boquette studio",
      "Boxon","AMJE","AMC","ELF","UE","Zi-forum"]
  }
];

// Liste affichée selon ?l=… dans l'URL (events par défaut)
const LIST = LISTS.find(l => l.id === new URLSearchParams(location.search).get("l")) || LISTS[0];
const TIERS = LIST.tiers;
const EVENTS = LIST.items;

// Onglets de navigation entre les listes
function renderTabs(el){
  LISTS.forEach(l=>{
    const a=document.createElement("a"); a.textContent=l.tab; a.href="?l="+l.id;
    if(l===LIST) a.className="on";
    el.append(a);
  });
}
