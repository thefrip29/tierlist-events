// Supabase : Project Settings > API (URL du projet + clé publique "anon" / "publishable").
// Cette clé est faite pour être publique : elle ne peut qu'appeler les fonctions de supabase.sql.
const SUPABASE_URL = "https://letqxatefjzdjghyimze.supabase.co";
const SUPABASE_KEY = "sb_publishable_kNRcBbG-uvXquHzX2mYpUA_u3FJmEZS";

async function rpc(fn, args){
  const headers={"Content-Type":"application/json", apikey:SUPABASE_KEY};
  if(SUPABASE_KEY.startsWith("eyJ")) headers.Authorization="Bearer "+SUPABASE_KEY; // ancienne clé "anon"
  const res=await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`,{method:"POST",headers,body:JSON.stringify(args)});
  const text=await res.text(); const data=text?JSON.parse(text):null;
  if(!res.ok) throw new Error((data&&data.message)||("erreur "+res.status));
  return data;
}

const TIER_COLORS = ["#ff7f7f","#ffbf7f","#ffdf7f","#bfff7f","#7fbfff","#c49bff"];
const tiers = names => ["goat","excellent","bien","mid","nul","ru"].map((id,i)=>({id, name:names[i], color:TIER_COLORS[i]}));

// Les tier lists affichées sur la page (l'une sous l'autre)
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
      "Boxon","AMJE","AMC","ELF","UE","Zi-forum","Moquette","Baral"]
  }
];
