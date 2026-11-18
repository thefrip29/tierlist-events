# Tier lists (events + assos)

Site : https://thefrip29.github.io/tierlist-events/ · Admin : https://thefrip29.github.io/tierlist-events/admin.html

## Comment ça marche

1. Sur la page, chacun classe les events et les assos puis clique **Valider mes tier lists**.
2. GitHub s'ouvre avec un fichier `votes/xxxx.json` déjà rempli : la personne clique **Propose changes** puis **Create pull request** (il faut un compte GitHub).
3. Tu valides un vote en **mergeant** sa pull request (onglet *Pull requests* du dépôt). Tu refuses en la fermant.
4. À chaque merge, l'Action GitHub *Publier le site* compile tous les fichiers `votes/*.json` dans `results.json` et republie le site (~1 min).
5. La page admin (protégée par un code) lit `results.json` : tier list moyenne, classement, votes, export CSV / JSON, et le nombre de PR en attente.

Si une personne revote, seul son dernier vote compte (même identifiant aléatoire dans le fichier).
Pour retirer un vote déjà mergé : supprime son fichier dans `votes/`.

## Fichiers

- `index.html` : page de vote
- `admin.html` : résultats
- `config.js` : listes, tiers, dépôt, empreinte du code admin
- `votes/` : un fichier JSON par vote mergé
- `scripts/build-results.js` + `.github/workflows/pages.yml` : compilation et publication

## Changer le code admin

`ADMIN_HASH` dans `config.js` est l'empreinte SHA-256 du code (en majuscules). Pour en générer une :

```bash
node -e "console.log(require('crypto').createHash('sha256').update('MONCODE').digest('hex'))"
```

À noter : le dépôt est public, donc les fichiers de vote sont lisibles par tout le monde sur GitHub. Le code protège seulement la page admin.

## Modifier les listes

Tout est dans `LISTS` de `config.js`.
