# PropertyMatch — application de référence

PropertyMatch est une plateforme pédagogique fictive de recherche de locations. Elle sert de résultat final stable pour construire douze leçons progressives consacrées à Next.js, TypeScript et Tailwind CSS.

Toutes les annonces et disponibilités sont fictives. L’application fonctionne sans compte, paiement, serveur métier, API externe ni base de données.

## Technologies

- Next.js 16 avec App Router ;
- React 19 ;
- TypeScript strict ;
- Tailwind CSS 4 et CSS global ;
- données TypeScript locales ;
- `localStorage` pour les favoris ;
- tests avec le module `node:test` de Node.js.

## Installation et lancement

Prérequis : une version récente de Node.js et npm.

```bash
cd reference-apps/propertymatch
npm install
npm run dev -- --port 3100
```

Ouvrir ensuite [http://localhost:3100](http://localhost:3100).

## Structure principale

```text
app/                 Pages, layout, styles et routes App Router
components/          Interface, recherche, cartes, fiches et favoris
data/properties.ts   Catalogue local des 15 locations fictives
lib/                 Filtrage, tri, matching, favoris et navigation
public/properties/   Images locales utilisées par next/image
tests/               Tests des parcours et fonctions critiques
types/               Types métier partagés
docs/                Cartographie pédagogique de l’application finale
```

## Fonctionnalités

- accueil responsive avec formulaire de recherche ;
- recherche par ville et préférences de budget, chambres et balcon ;
- paramètres d’URL validés et partageables ;
- quatre tris stables ;
- score de compatibilité local et explicable ;
- quinze fiches dynamiques avec métadonnées ;
- retour vers les résultats avec conservation des critères ;
- favoris persistants uniquement dans le navigateur ;
- page Favoris et états vides ;
- page 404 dédiée ;
- navigation clavier, focus visible et lien d’évitement ;
- mises en page pour mobile, tablette et ordinateur.

## Données fictives

Les quinze logements sont définis dans `data/properties.ts`. Ils n’ont aucune adresse personnelle, agence ou propriétaire réel. Les prix sont des loyers mensuels de démonstration. Les indicateurs de l’accueil sont calculés depuis ce catalogue.

## Matching

La ville est un filtre strict. Le budget maximal, le nombre minimal de chambres et le balcon sont des préférences facultatives qui se partagent équitablement 100 points :

- budget respecté : tous les points ; dépassement inférieur ou égal à 10 % : moitié ; sinon zéro ;
- chambres demandées atteintes : tous les points ; une chambre manquante : moitié ; sinon zéro ;
- balcon demandé et présent : tous les points ; sinon zéro.

Sans préférence active, aucun faux score n’est affiché. Le calcul pur et déterministe se trouve dans `lib/matching.ts`.

## Favoris

Les favoris utilisent uniquement la clé versionnée `propertymatch:favorites:v1` de `localStorage`. Sa valeur est un tableau ordonné de slugs uniques, par exemple :

```json
["lumineux-bastille", "maison-cauderan"]
```

Les valeurs invalides, doublons et slugs inconnus sont supprimés. Aucune annonce complète n’est enregistrée ou transmise.

## Vérifications

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm audit
git diff --check
```

Si Turbopack ne peut pas ouvrir son port interne dans un environnement restreint :

```bash
./node_modules/.bin/next build --webpack
```

## Préparation au déploiement Vercel

Le projet est autonome et compatible avec un déploiement Next.js standard : importer le dépôt dans Vercel, choisir `reference-apps/propertymatch` comme dossier racine et conserver les commandes npm par défaut. Aucune variable d’environnement n’est requise.

Cette procédure est uniquement documentaire : aucun déploiement n’est effectué depuis ce projet de référence.
