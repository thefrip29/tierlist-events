// Compile tous les votes mergés (votes/*.json) en un seul results.json.
// Usage : node scripts/build-results.js <dossier de sortie>
const fs = require("fs");
const path = require("path");

const out = process.argv[2] || "_site";
const dir = "votes";
const TIERS = ["goat", "excellent", "bien", "mid", "nul", "ru"];
const votes = [];

if (fs.existsSync(dir)) {
  for (const file of fs.readdirSync(dir).filter(f => f.endsWith(".json")).sort()) {
    try {
      const v = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
      if (!v || typeof v.id !== "string" || typeof v.lists !== "object") throw new Error("format invalide");
      const lists = {};
      for (const [listId, tiers] of Object.entries(v.lists)) {
        lists[listId] = {};
        for (const t of TIERS) {
          lists[listId][t] = Array.isArray(tiers && tiers[t]) ? tiers[t].filter(x => typeof x === "string").slice(0, 100) : [];
        }
      }
      votes.push({ file, id: v.id.slice(0, 64), date: String(v.date || ""), lists });
    } catch (e) {
      console.warn(`Ignoré : ${file} (${e.message})`);
    }
  }
}

fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, "results.json"), JSON.stringify({ generated: new Date().toISOString(), votes }));
console.log(`${votes.length} vote(s) compilé(s) dans ${out}/results.json`);
