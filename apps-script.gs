/**
 * Backend de la tier list — à coller dans Google Sheets > Extensions > Apps Script.
 * Voir README.md pour la mise en place (5 minutes).
 */

// ⚠️ Change ce mot de passe : c'est celui de la page admin.html
const ADMIN_KEY = "CHANGE_MOI";

const TIER_COLS = ["goat", "excellent", "bien", "mid", "nul", "ru"];
// Une feuille par tier list (doit correspondre aux "id" de LISTS dans config.js)
const LISTS = {
  events: { sheet: "Votes events", lastTier: "J'préfère le RU" },
  assos:  { sheet: "Votes assos",  lastTier: "France Travail" }
};
const JSON_COL = 9; // colonne I (aucun nom n'est stocké)

function sheet_(list) {
  const conf = LISTS[list];
  if (!conf) throw new Error("liste inconnue");
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(conf.sheet);
  if (!sh) {
    sh = ss.insertSheet(conf.sheet);
    sh.appendRow(["id", "date", "GOAT", "Excellent", "Bien", "Mid", "Nul", conf.lastTier, "json"]);
    sh.setFrozenRows(1);
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Réception d'une tier list (page publique)
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const list = String(body.list || "events");
    if (!LISTS[list]) return json_({ ok: false, error: "liste inconnue" });
    const id = String(body.id || "").slice(0, 64);
    if (!id) return json_({ ok: false, error: "id manquant" });

    const tiers = {};
    TIER_COLS.forEach(t => {
      const list = Array.isArray(body.tiers && body.tiers[t]) ? body.tiers[t] : [];
      tiers[t] = list.slice(0, 50).map(x => String(x).slice(0, 60));
    });

    const row = [id, new Date().toISOString(), ...TIER_COLS.map(t => tiers[t].join(", ")), JSON.stringify(tiers)];

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const sh = sheet_(list);
      const ids = sh.getLastRow() > 1 ? sh.getRange(2, 1, sh.getLastRow() - 1, 1).getValues().flat() : [];
      const idx = ids.indexOf(id);
      if (idx >= 0) sh.getRange(idx + 2, 1, 1, row.length).setValues([row]); // la personne renvoie : on remplace
      else sh.appendRow(row);
    } finally {
      lock.releaseLock();
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

// Lecture des résultats / suppression (page admin)
function doGet(e) {
  const p = e.parameter || {};
  if (p.key !== ADMIN_KEY) return json_({ ok: false, error: "unauthorized" });
  const list = p.list || "events";
  if (!LISTS[list]) return json_({ ok: false, error: "liste inconnue" });
  const sh = sheet_(list);

  if (p.action === "delete") {
    const ids = sh.getLastRow() > 1 ? sh.getRange(2, 1, sh.getLastRow() - 1, 1).getValues().flat() : [];
    const idx = ids.indexOf(p.id);
    if (idx >= 0) sh.deleteRow(idx + 2);
    return json_({ ok: true });
  }

  const values = sh.getDataRange().getValues().slice(1);
  const votes = values.filter(r => r[0]).map(r => ({
    id: r[0],
    date: r[1] instanceof Date ? r[1].toISOString() : r[1],
    tiers: JSON.parse(r[JSON_COL - 1] || "{}")
  }));
  return json_({ ok: true, votes });
}
