# Tier lists (events + assos)

Site : https://thefrip29.github.io/tierlist-events/ · Admin : https://thefrip29.github.io/tierlist-events/admin.html

## Comment ça marche

- Sur la page, chacun classe les events et les assos puis clique **Valider mes tier lists** : le vote part directement dans Supabase. C'est anonyme (aucun nom), et si la personne revote, ça remplace son ancien vote.
- La page admin demande le code admin, vérifié par Supabase : tier list moyenne, classement, votes individuels (suppression possible), export CSV / JSON.
- Dans l'admin, « Gérer la liste » permet d'ajouter ou retirer des events / assos (stockés dans la table `items` de Supabase, voir `supabase-items.sql`).

## Mise en place Supabase (une seule fois)

1. Crée un projet sur https://supabase.com (connexion possible avec GitHub).
2. **SQL Editor → New query** : colle le contenu de `supabase.sql`, remplace `CHANGE_MOI` (dernière ligne) par ton code admin, puis **Run**.
3. **Project Settings → API** : copie l'URL du projet et la clé publique (*anon* / *publishable*) dans `config.js` (`SUPABASE_URL`, `SUPABASE_KEY`).

La clé publique est faite pour être visible : elle permet seulement d'appeler `submit_vote` et, avec le bon code, `admin_results` / `admin_delete`. Les tables ne sont pas lisibles directement.

Changer le code admin : relance seulement la dernière requête de `supabase.sql` avec le nouveau code.

## Fichiers

- `index.html` : page de vote
- `admin.html` : résultats
- `config.js` : listes, tiers, connexion Supabase
- `supabase.sql` : table et fonctions côté Supabase
- `.github/workflows/pages.yml` : publication sur GitHub Pages

## Modifier les listes

Depuis la page admin, bloc « Gérer la liste ». Les titres et les tiers restent dans `LISTS` de `config.js`.
