# Cartographie de l’application finale PropertyMatch

Ce document relie le résultat final aux douze leçons qui seront dérivées de l’application. Chaque étape doit partir de l’état réellement obtenu à l’étape précédente, avec de petits changements vérifiables.

## Fonctionnalités et fichiers responsables

| Fonctionnalité | Fichiers principaux | Dépendances |
|---|---|---|
| Structure globale et métadonnées | `app/layout.tsx`, `app/page.tsx` | App Router, composants serveur |
| Design, responsive et accessibilité | `app/globals.css`, `components/Header.tsx`, `components/Footer.tsx`, `components/Logo.tsx` | Structure globale |
| Catalogue des locations | `data/properties.ts`, `types/property.ts` | Types TypeScript |
| Accueil et indicateurs | `components/Hero.tsx`, `components/StatsStrip.tsx`, `components/FeaturedProperties.tsx` | Catalogue, cartes, recherche |
| Formulaire de recherche | `components/SearchForm.tsx`, `types/search.ts` | Paramètres HTML GET |
| Validation des URL | `lib/search.ts` | Types de recherche, villes autorisées |
| Filtrage et tris | `lib/search.ts`, `components/SearchSummary.tsx`, `app/biens/page.tsx` | URL validée, catalogue |
| Cartes immobilières | `components/PropertyCard.tsx`, `lib/formatters.ts` | Catalogue, images, favoris |
| Matching explicable | `lib/matching.ts`, `components/CompatibilityDetails.tsx` | Préférences validées |
| Fiches dynamiques | `app/biens/[slug]/page.tsx`, `components/PropertyDetail.tsx`, `components/PropertyFacts.tsx`, `lib/properties.ts` | Slugs, matching, navigation |
| Navigation et erreurs | `lib/property-navigation.ts`, `app/biens/[slug]/not-found.tsx` | URL de provenance |
| Favoris locaux | `lib/favorites.ts`, `components/FavoritesProvider.tsx`, `components/FavoriteButton.tsx`, `components/FavoritesGrid.tsx`, `app/favoris/page.tsx` | Slugs officiels, `localStorage` |

## Ordre pédagogique recommandé en 12 leçons

1. **Comprendre et structurer le projet** — créer l’App Router, le layout, la page et les premières métadonnées.
2. **Construire l’identité visuelle** — variables de couleurs, typographie, header, footer et lien d’évitement.
3. **Modéliser les logements** — écrire les types puis un petit catalogue local, avant de parvenir aux quinze entrées finales.
4. **Composer l’accueil** — hero, image locale avec `next/image`, indicateurs calculés et premières cartes.
5. **Créer un formulaire accessible** — labels, contrôles HTML, méthode GET et paramètres lisibles dans l’URL.
6. **Valider les paramètres** — nombres sûrs, villes autorisées, valeurs par défaut et signalement des erreurs.
7. **Filtrer et trier les résultats** — fonctions pures, tri stable, critères actifs et état vide.
8. **Calculer un matching transparent** — partage des points, seuils, libellés et explications par critère.
9. **Créer les fiches dynamiques** — slug, recherche locale, `notFound()`, métadonnées et informations détaillées.
10. **Conserver le contexte de navigation** — liens de fiches, filtres, tri, retour exact et provenance Favoris.
11. **Ajouter des favoris locaux** — validation du stockage, bouton accessible, persistance et synchronisation React.
12. **Finaliser la qualité** — responsive, clavier, états d’erreur, tests critiques, build et documentation.

## Points difficiles pour un débutant

- distinguer composant serveur et composant client ;
- comprendre que l’URL est une entrée non fiable à valider ;
- conserver un tri stable sans modifier le tableau d’origine ;
- répartir équitablement un score lorsque certaines préférences sont absentes ;
- manipuler les paramètres asynchrones de Next.js 16 ;
- éviter une divergence d’hydratation avec `localStorage` ;
- partager l’état des favoris sans rendre toute l’application cliente ;
- préserver les paramètres de recherche lors des navigations ;
- relier HTML sémantique, focus clavier et mise en page responsive.

## Captures pédagogiques à réaliser

| Étape | Capture attendue |
|---|---|
| 1 | Arborescence minimale et page Next.js vide structurée |
| 2 | Header desktop puis menu mobile avec focus visible |
| 3 | Extrait du catalogue typé et erreur TypeScript guidée |
| 4 | Accueil final aux formats 1440 px et 390 px |
| 5 | Formulaire puis URL générée après soumission |
| 6 | Message affiché avec plusieurs paramètres invalides |
| 7 | Résultats filtrés, tri changé et critères réinitialisés |
| 8 | Carte avec explication « Pourquoi ce score ? » ouverte |
| 9 | Fiche complète et page « Logement introuvable » |
| 10 | Aller-retour fiche/résultats avec URL inchangée |
| 11 | Cœur inactif, cœur actif, page Favoris puis état vide |
| 12 | Série desktop, tablette et mobile sans débordement |

Les captures doivent provenir d’états réellement exécutés, utiliser exclusivement les données fictives et ne pas anticiper une fonctionnalité avant sa leçon.

## Vérifications manuelles attendues

- parcourir accueil, résultats, fiche, favoris et 404 uniquement au clavier ;
- soumettre les quatre champs du formulaire puis relire les paramètres d’URL ;
- essayer une ville, des nombres, un balcon et un tri invalides ;
- comparer le score d’une carte avec celui de sa fiche ;
- ouvrir et fermer l’explication du score avec Entrée et Espace ;
- vérifier le retour exact vers les résultats puis vers les favoris ;
- ajouter, actualiser et retirer un favori ;
- contrôler les états vides de recherche et de favoris ;
- vérifier l’absence de défilement horizontal à 390, 768, 1024 et 1440 px ;
- confirmer que toutes les images chargent et conservent leurs proportions ;
- exécuter TypeScript, ESLint, tests, build, audit npm et `git diff --check`.
