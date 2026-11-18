# Tier list des events

- `index.html` : la page publique où chacun fait et valide sa tier list
- `admin.html` : la page admin (mot de passe) avec la tier list moyenne, le classement et les votes
- `apps-script.gs` : le petit backend (Google Sheets + Apps Script) qui stocke les votes

## Brancher le backend (une seule fois, ~5 min)

1. Crée une Google Sheet vide (sheets.new), nomme-la « Tier list events ».
2. Menu **Extensions → Apps Script**. Efface le code et colle le contenu de `apps-script.gs`.
3. Remplace `CHANGE_MOI` par ton mot de passe admin. Enregistre (💾).
4. **Déployer → Nouveau déploiement** → type **Application Web** :
   - Exécuter en tant que : **Moi**
   - Qui a accès : **Tout le monde**
   - Déployer, autorise l'accès à ton compte, puis copie l'**URL de l'application Web** (finit par `/exec`).
5. Colle cette URL dans `config.js` à la ligne `const API_URL = "";`, puis commit/push.

Les votes arrivent aussi en clair dans les onglets « Votes events » et « Votes assos » de la Google Sheet (créés automatiquement au premier vote).

## Pages

- Events : `index.html` (ou `?l=events`), Assos : `index.html?l=assos`
- Admin : `admin.html`, avec un onglet par liste

> Si tu modifies le script plus tard : Déployer → Gérer les déploiements → ✏️ → Version : Nouvelle version (l'URL reste la même).

## Modifier les listes

Tout est dans `config.js` (`LISTS`). Pour ajouter une nouvelle tier list, ajoute une entrée dans `LISTS` de `config.js` **et** dans `LISTS` de `apps-script.gs` (puis redéploie une nouvelle version du script).
