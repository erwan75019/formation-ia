# Checkpoints visuels des neuf leçons LaunchCraft

Ce document prépare la dérivation pédagogique de l’application de référence. Il ne constitue pas encore le contenu des leçons AI Academy et ne remplace pas de vraies captures. Chaque visuel devra provenir du checkpoint cumulatif réellement exécutable correspondant, jamais de l’application finale utilisée trop tôt.

Les ressources sont rangées dans `public/formation/launchcraft/lesson-01` à `public/formation/launchcraft/lesson-09`. Un nom suit la forme `description-viewport.png` ou `description-viewport.webp`. Chaque usage fournit un texte alternatif décrivant le résultat observable et une légende expliquant ce que l’étudiant doit vérifier.

## Méthode de production

Pour chaque leçon :

1. matérialiser un checkpoint autonome issu du checkpoint précédent ;
2. exécuter TypeScript, ESLint, les tests et le build avant toute capture ;
3. capturer l’état de départ avant modification ;
4. capturer uniquement les étapes réellement construites dans la leçon ;
5. utiliser 1440 × 1000 pour l’ordinateur et 390 × 844 pour le mobile lorsque pertinent ;
6. capturer VS Code avec l’Explorateur ouvert sur le fichier réellement modifié ;
7. recadrer sans masquer l’URL, le nom de fichier ou l’élément à vérifier ;
8. convertir les captures en WebP optimisé tout en conservant un texte lisible.

Les schémas conceptuels doivent être des SVG déterministes. Les captures d’interface doivent être produites depuis LaunchCraft dans le navigateur.

## 01 — Structure de l’application et interface initiale

- **Fichiers concernés :** `app/layout.tsx`, `app/page.tsx`, `app/(app)/layout.tsx`, `app/globals.css`, `components/AppShell.tsx`, `components/Sidebar.tsx`, `components/MobileHeader.tsx`.
- **Fonctionnalités introduites :** App Router, layout global, redirection vers `/dashboard`, structure de navigation responsive et palette LaunchCraft.
- **Captures nécessaires :** projet Next.js avant personnalisation ; arborescence annotée dans VS Code ; shell vide après ajout de la sidebar ; résultat desktop ; menu mobile ouvert.
- **Résultat visible attendu :** une application sombre navigable dont la zone principale est prête à recevoir les pages métier.
- **Vérifications manuelles :** `/` redirige vers `/dashboard`, tous les liens sont accessibles au clavier, aucun débordement à 390, 768, 1024 et 1440 px.

## 02 — Base de données et schéma explicatif

- **Fichiers concernés :** future migration du projet Supabase LaunchCraft, `types/launchcraft.ts`, documentation du schéma et futur client Supabase serveur.
- **Fonctionnalités introduites :** projet Supabase séparé, tables profils/projets/objectifs/tâches, relations, contraintes et RLS initiale.
- **Captures nécessaires :** état local avant connexion ; schéma SVG exact des quatre tables ; migration ouverte dans VS Code ; tables réellement créées dans le projet de développement.
- **Résultat visible attendu :** interface inchangée, mais modèle de données vérifié et prêt pour l’authentification.
- **Vérifications manuelles :** migration reproductible, clés étrangères valides, RLS activée et aucune table AI Academy utilisée.

## 03 — Inscription et connexion

- **Fichiers concernés :** `app/(auth)/connexion/page.tsx`, `app/(auth)/inscription/page.tsx`, `app/(auth)/layout.tsx`, `components/DemoAuthForm.tsx` puis futurs formulaires réels, actions serveur et middleware/proxy.
- **Fonctionnalités introduites :** remplacement des formulaires de démonstration par Supabase Auth, session serveur, déconnexion et protection des routes.
- **Captures nécessaires :** formulaire de démonstration initial ; formulaire raccordé ; erreur de saisie ; session ouverte sur desktop ; navigation mobile authentifiée ; fichiers d’authentification dans VS Code.
- **Résultat visible attendu :** un utilisateur peut créer son compte, se connecter et atteindre son espace protégé.
- **Vérifications manuelles :** redirections avec et sans session, erreurs accessibles, aucun identifiant utilisateur accepté depuis le navigateur.

## 04 — Création et gestion des projets

- **Fichiers concernés :** `app/(app)/projets/page.tsx`, `app/(app)/projets/nouveau/page.tsx`, `app/(app)/projets/[slug]/page.tsx`, `components/ProjectCard.tsx`, `components/ProjectForm.tsx`, futures actions serveur et validateurs.
- **Fonctionnalités introduites :** liste réelle, création, modification et suppression sécurisées des projets.
- **Captures nécessaires :** cartes locales de départ ; formulaire relié ; validation incorrecte ; projet nouvellement créé ; fiche desktop et mobile ; action serveur dans VS Code.
- **Résultat visible attendu :** le projet créé apparaît immédiatement dans la liste et sa fiche est consultable.
- **Vérifications manuelles :** états vide/erreur/chargement, validation des champs, propriété utilisateur contrôlée côté serveur.

## 05 — Objectifs

- **Fichiers concernés :** `app/(app)/projets/[slug]/page.tsx`, futurs composants d’objectif, actions serveur et validateurs associés.
- **Fonctionnalités introduites :** création, modification, validation et suppression des objectifs d’un projet.
- **Captures nécessaires :** fiche sans objectif ; formulaire d’ajout ; objectif créé ; objectif terminé ; état mobile ; composant et action dans VS Code.
- **Résultat visible attendu :** la fiche regroupe des objectifs réels appartenant exclusivement au projet courant.
- **Vérifications manuelles :** changement d’état immédiat, relation projet/objectif validée et accès croisé entre utilisateurs refusé.

## 06 — Tâches

- **Fichiers concernés :** `app/(app)/taches/page.tsx`, `app/(app)/projets/[slug]/page.tsx`, `components/StatusBadge.tsx`, `components/UpcomingTasks.tsx`, futurs formulaire, actions et validation de tâches.
- **Fonctionnalités introduites :** tâches, statut, priorité, échéance, rattachement facultatif à un objectif et calcul des retards.
- **Captures nécessaires :** liste locale initiale ; formulaire de tâche ; filtres ou groupes de statut ; tâche en retard ; fiche projet mise à jour ; rendu mobile ; logique métier dans VS Code.
- **Résultat visible attendu :** les tâches peuvent être gérées depuis la vue globale et depuis leur projet.
- **Vérifications manuelles :** dates cohérentes, badges textuels, progression issue des tâches et aucune statistique codée en dur.

## 07 — Dashboard

- **Fichiers concernés :** `app/(app)/dashboard/page.tsx`, `components/StatCard.tsx`, `components/ProgressChart.tsx`, `components/ProgressBar.tsx`, `components/UpcomingTasks.tsx`, `lib/metrics.ts` puis requêtes serveur.
- **Fonctionnalités introduites :** statistiques réelles, progression moyenne, échéances et graphique calculés depuis les données Supabase.
- **Captures nécessaires :** dashboard local de départ ; requêtes ouvertes dans VS Code ; première carte alimentée ; graphique terminé ; dashboard desktop complet ; empilement mobile.
- **Résultat visible attendu :** chaque indicateur reflète les projets et tâches du compte connecté.
- **Vérifications manuelles :** recalcul après mutation, zéro donnée, retard et moyenne contrôlés par des cas connus.

## 08 — Calendrier

- **Fichiers concernés :** `app/(app)/calendrier/page.tsx`, `components/Calendar.tsx`, fonctions de groupement et requêtes des échéances.
- **Fonctionnalités introduites :** planning mensuel et liste des prochaines actions dérivés des tâches réelles.
- **Captures nécessaires :** calendrier local initial ; groupement d’une date dans VS Code ; mois avec échéances ; jour sélectionné ; état sans tâche ; vue mobile.
- **Résultat visible attendu :** les échéances apparaissent au bon jour et renvoient vers leur projet.
- **Vérifications manuelles :** changement de mois, dates limites, navigation clavier et cohérence calendrier/liste des tâches.

## 09 — Sécurité et application finale responsive

- **Fichiers concernés :** politiques RLS finales, proxy, actions serveur, `app/(app)/parametres/page.tsx`, composants de navigation et styles responsive.
- **Fonctionnalités introduites :** profil, contrôle final de l’isolation, états d’erreur/chargement, accessibilité et responsive complet.
- **Captures nécessaires :** test RLS refusé ; réglages du profil ; audit clavier ; dashboard final 1440 px ; pages projets et calendrier à 390 px ; arborescence finale dans VS Code.
- **Résultat visible attendu :** LaunchCraft V1 est complet, cohérent sur ordinateur et mobile, sans IA ni paiement.
- **Vérifications manuelles :** deux comptes ne voient jamais les mêmes données, focus visible, un `h1` par page, aucun débordement, tests/lint/typecheck/build réussis.

## Registre des captures

Lors de leur création, chaque capture devra être ajoutée à un registre avec : chemin public, checkpoint source, URL capturée, viewport, texte alternatif, légende, date de capture et résultat des vérifications du checkpoint. Une ressource sans provenance complète ne devra pas être intégrée à une leçon.

## Audit d’intégration dans les neuf leçons

| Leçon | Résultat principal | Routes à capturer | Desktop | Mobile utile | Insertion dans le cours |
| --- | --- | --- | --- | --- | --- |
| 01 | shell, sidebar et navigation initiale | `/dashboard` | dashboard initial | menu mobile ouvert | après le header, puis avant le QCM |
| 02 | modèle `profiles → projects → objectives → tasks` | `/database-schema.svg` | schéma SVG | non nécessaire | conserver le schéma existant dans le bloc résultat, sans doublon |
| 03 | inscription, connexion et route protégée | `/inscription`, `/connexion`, `/dashboard` | inscription et connexion | connexion | après le header, puis avant le QCM |
| 04 | CRUD des projets | `/projets`, `/projets/nouveau`, `/projets/[id]` | liste, création, fiche | fiche projet | après le header, puis avant le QCM |
| 05 | objectifs et progression calculée | `/projets/[id]` | objectifs et progression | fiche avec objectifs | après le header, puis avant le QCM |
| 06 | tâches, priorités, statuts et échéances | `/projets/[id]`, `/taches` | gestion des tâches | filtres et liste | après le header, puis avant le QCM |
| 07 | dashboard alimenté par les données du compte | `/dashboard` | dashboard complet | empilement des statistiques | après le header, puis avant le QCM |
| 08 | calendrier et sélection d’un jour | `/calendrier` | mois complet | jour sélectionné | après le header, puis avant le QCM |
| 09 | LaunchCraft final sécurisé et responsive | `/dashboard`, `/projets`, `/calendrier`, `/parametres` | synthèse finale | navigation finale | après le header, puis avant le QCM final |

Le composant partagé `LessonVisualPreview` matérialise ces deux emplacements. Une leçon ne doit l’utiliser que lorsqu’une capture du checkpoint exact existe réellement.

## Registre — captures produites le 28 août 2026

| Chemin public | Checkpoint | Route locale | Viewport | Vérification |
| --- | --- | --- | --- | --- |
| `/formation/launchcraft/lesson-03/inscription-desktop.png` | 03 | `http://localhost:3200/inscription` | 1440 × 900 | rendu public réel, champs vides, aucune donnée personnelle |
| `/formation/launchcraft/lesson-03/connexion-desktop.png` | 03 | `http://localhost:3200/connexion` | 1440 × 900 | rendu public réel, champs vides, aucune donnée personnelle |
| `/formation/launchcraft/lesson-03/connexion-mobile.png` | 03 | `http://localhost:3200/connexion` | viewport CSS 390 × 844, densité 2 | formulaire réel après défilement, sans débordement horizontal |

Les textes alternatifs et légendes de ces trois ressources sont définis dans `LaunchCraftLessonThree.tsx`, au plus près de leur usage pédagogique.

## Captures bloquées volontairement

Les captures des leçons 01 et 04 à 09 nécessitent une session dans un projet Supabase LaunchCraft séparé et un jeu de démonstration. La configuration locale n’est pas présente : aucune capture authentifiée n’a donc été fabriquée.

Jeu de démonstration neutre à préparer avant la prochaine campagne :

- un compte de formation sans identité personnelle ;
- quatre projets fictifs, dont « Lancement de la formation AI Mastery » ;
- au moins trois objectifs, avec états atteint et à atteindre ;
- des tâches à faire, en cours et terminées, avec trois priorités ;
- une tâche en retard et plusieurs échéances futures réparties sur le mois capturé ;
- un profil générique destiné uniquement aux captures.

Après création autorisée de ces données, chaque checkpoint devra être rejoué puis vérifié avant capture. Les vues finales ne doivent jamais être utilisées pour illustrer prématurément un checkpoint antérieur.
