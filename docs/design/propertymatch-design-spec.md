# PropertyMatch — spécification de la page d’accueil

## 1. Référence et objectif

Référence visuelle officielle : `docs/design/propertymatch-homepage-reference.png`.

- Dimensions observées : **1536 × 1024 px**, ratio 3:2.
- Cible technique : Next.js, App Router, TypeScript et Tailwind CSS.
- Projet pédagogique : un site immobilier fictif construit avec des données locales typées.
- Hors périmètre du module 6 : Supabase, authentification réelle, base de données et promesses commerciales réelles.

La page finale doit reprendre fidèlement la composition, la densité et la hiérarchie de la référence, sans reproduire les affirmations invérifiables visibles dans la maquette. Les nombres comme « 10 000+ », « 25 000+ » et « 98 % » ne doivent pas être affichés dans l’application réelle sans source. Pendant la formation, les indicateurs sont calculés depuis le tableau local de logements ou portent explicitement la mention « démonstration ». Le libellé « Données sécurisées » devient par exemple « Données locales — aucune donnée envoyée » tant qu’aucun backend sécurisé n’existe.

## 2. Structure et dimensions générales

Ordre vertical de la page desktop observée :

1. header blanc, environ **74 px** de haut ;
2. hero paysage, environ **474 px** de haut ;
3. bande de statistiques, environ **80 px** de haut ;
4. section des meilleures correspondances, visible à partir d’environ **628 px** ;
5. grille de trois cartes sur la largeur disponible.

Conteneur de contenu recommandé :

- largeur maximale : `max-w-[1440px]` ;
- marges latérales desktop : 56 à 68 px ;
- tablette : 32 px ;
- mobile : 20 px ;
- largeur minimale prise en charge : 320 px ;
- aucun défilement horizontal.

Le fond général est blanc ou ivoire très léger. Les grandes zones ne doivent pas être enfermées dans une succession de cartes : la composition repose sur de larges surfaces, une hiérarchie nette et quelques panneaux fonctionnels.

## 3. Header et navigation

### Composition desktop

- logo PropertyMatch à gauche ;
- pictogramme de maison linéaire bleu marine avec accent vert ;
- mot-symbole `Property` bleu marine et `Match` vert ;
- navigation centrée : Accueil, Biens, Favoris, À propos ;
- action de compte à droite sous forme de bouton bleu marine ;
- élément actif souligné par un trait bleu marine de 2 px ;
- fond blanc avec fine bordure inférieure gris froid.

Dimensions recommandées :

- hauteur : 72–76 px ;
- logo : 30–34 px ;
- espace entre liens : 44–56 px ;
- bouton : environ 150 × 44 px ;
- rayon du bouton : 10–12 px.

Le bouton « Se connecter » est uniquement une navigation visuelle dans le module 6. Il ne doit pas simuler une authentification réussie. Il peut conduire à une page explicative locale ou rester désactivé avec un libellé pédagogique jusqu’au module consacré à l’authentification.

### Accessibilité

- `header` et `nav` sémantiques ;
- `aria-label="Navigation principale"` ;
- lien actif identifiable autrement que par la couleur ;
- focus clavier visible ;
- bouton du menu mobile avec `aria-expanded` et `aria-controls`.

## 4. Hero en deux parties

### Colonne gauche

La zone gauche occupe environ **53 %** de la largeur desktop. Elle utilise un fond bleu marine profond et contient :

- titre sur deux lignes, blanc, très lisible ;
- paragraphe court gris bleuté ;
- formulaire blanc ;
- ligne de réassurance discrète sous le formulaire.

Le titre cible reste proche de : « Trouvez le bien qui vous correspond vraiment ». Il mesure environ 48–54 px sur grand écran, avec une hauteur de ligne proche de 1,08 et une largeur maximale de 680 px.

### Colonne droite

- photographie immobilière lumineuse, cadrée en couverture ;
- point focal conservé sur le salon et les ouvertures ;
- `object-cover` et `object-center` ;
- image optimisée avec `next/image` ;
- texte alternatif descriptif, sans argument commercial.

### Séparation diagonale

La référence utilise une coupe oblique entre le fond marine et la photo. Implémentation recommandée : pseudo-élément ou `clip-path: polygon(...)` sur desktop. Sur mobile, la coupe est supprimée au profit d’un empilement simple afin de ne pas réduire la lisibilité.

## 5. Formulaire de recherche

### Structure

Le panneau blanc comprend quatre champs :

1. ville ;
2. budget maximum ;
3. nombre de chambres ;
4. balcon.

Puis un bouton « Rechercher » sur toute la largeur.

### Dimensions et style

- panneau : blanc, rayon 10–12 px, padding 18–20 px ;
- grille desktop : quatre colonnes ;
- labels : 13–14 px, graisse 600 ;
- contrôles : hauteur 44–48 px, bordure gris clair, rayon 8 px ;
- bouton : hauteur 50–52 px, fond vert profond, texte blanc ;
- espace vertical entre champs et bouton : 16 px ;
- ombre du panneau : légère, diffuse et non décorative.

Les icônes accompagnent le texte sans le remplacer. Chaque contrôle possède un label visible. Les champs utilisent des valeurs locales prédéfinies ; aucun formulaire ne transmet de donnée à un serveur pendant le module 6.

## 6. Palette de couleurs

Tokens recommandés, à ajuster après comparaison visuelle :

| Token | Valeur indicative | Usage |
|---|---|---|
| `navy-950` | `#06182F` | hero, bouton compte, texte principal |
| `navy-900` | `#0A203B` | surfaces secondaires sombres |
| `green-800` | `#07583F` | recherche, badge de score |
| `green-700` | `#0A6A4A` | hover et accent actif |
| `green-100` | `#DCEFE7` | états doux |
| `slate-700` | `#334155` | texte secondaire fort |
| `slate-500` | `#64748B` | descriptions |
| `slate-200` | `#E2E8F0` | bordures |
| `surface` | `#FFFFFF` | header, formulaire, cartes |
| `canvas` | `#FAFAF8` | fond général légèrement chaud |

Tous les couples texte/fond doivent viser WCAG AA. Le vert ne doit pas être l’unique indication d’un état réussi ou favori.

## 7. Typographie

- police sans sérif moderne, par exemple Inter ou Geist chargée avec `next/font` ;
- titre hero : 48–54 px desktop, 40 px tablette, 34–38 px mobile ;
- titre de section : 28–32 px desktop ;
- titre de carte : 17–19 px ;
- corps : 15–17 px ;
- microcopie : jamais sous 12 px ;
- graisse 700 pour titres, 600 pour actions, 400–500 pour texte courant ;
- hauteur de ligne généreuse pour les paragraphes, plus serrée pour les grands titres.

## 8. Espacements, bordures, ombres et rayons

Échelle recommandée : 4, 8, 12, 16, 20, 24, 32, 48, 64 px.

- bordures : 1 px, gris froid ;
- rayons contrôles : 8 px ;
- rayons boutons : 10–12 px ;
- rayons panneaux et cartes : 10–14 px ;
- ombre carte : `0 8px 24px rgb(15 23 42 / 0.08)` environ ;
- ombre hover : légèrement plus haute, sans déplacement excessif ;
- espacement entre cartes : 20–24 px ;
- marges verticales de section : 28–48 px selon viewport.

## 9. Bande de statistiques

La référence montre quatre indicateurs séparés par des traits verticaux :

- biens analysés ;
- utilisateurs satisfaits ;
- taux de pertinence ;
- confidentialité garantie.

Pour PropertyMatch pédagogique, utiliser uniquement des indicateurs honnêtes :

- nombre de biens de démonstration : `properties.length` ;
- nombre de critères actifs : valeur calculée depuis le formulaire ;
- meilleur score courant : calcul du moteur local, avec mention « score de démonstration » ;
- « Données locales — aucune donnée envoyée ».

Sur mobile, la bande devient une grille 2 × 2 ou une liste verticale. Les séparateurs deviennent des bordures horizontales adaptées.

## 10. Cartes immobilières

La section comporte :

- titre « Nos meilleures correspondances » ;
- sous-titre expliquant le classement ;
- lien « Voir tous les biens » ;
- trois cartes desktop.

Chaque carte contient :

- image ratio proche de 16:7 ou hauteur 200 px ;
- bouton favori circulaire en haut à droite ;
- badge de compatibilité superposé en bas à droite de l’image ;
- ville/arrondissement et prix sur la même ligne ;
- caractéristiques : chambres, balcon et surface ;
- lien vers une page détail.

Le composant doit accepter un objet typé et ne pas contenir de données immobilières codées directement dans son JSX.

## 11. Scores de compatibilité

Les scores affichés dans la référence (96 %, 92 %, 89 %) deviennent des résultats calculés localement depuis les critères de recherche et les propriétés.

Règles :

- fonction pure et testable ;
- score entre 0 et 100 ;
- pondérations documentées ;
- aucune affirmation que le score repose sur une IA réelle ;
- libellé conseillé : « 92 % compatible — démonstration » dans les explications ou l’aide ;
- tri décroissant stable après recherche.

## 12. Favoris

- bouton cœur utilisable au clavier ;
- état vide et état actif clairement distincts ;
- `aria-pressed` ;
- mise à jour immédiate de l’interface ;
- conservation possible dans `localStorage`, présentée comme stockage local au navigateur ;
- aucune synchronisation entre appareils tant qu’aucun backend n’existe.

## 13. Responsive tablette et mobile

### Tablette, 768–1023 px

- header compact, navigation réduite ou menu ;
- hero en grille 55/45 ou empilé selon l’espace ;
- formulaire en grille 2 × 2 ;
- statistiques en 2 × 2 ;
- cartes sur deux colonnes ;
- troisième carte sur la ligne suivante.

### Mobile, 320–767 px

- header de 64 px avec logo et bouton menu ;
- menu déroulant sous le header ;
- hero empilé : contenu marine puis image ;
- titre 34–38 px ;
- formulaire sur une seule colonne ;
- bouton de recherche pleine largeur ;
- statistiques 2 × 2 puis une colonne sous 380 px ;
- cartes sur une colonne ;
- aucune coupe diagonale ;
- zones interactives d’au moins 44 × 44 px ;
- aucune information disponible uniquement au survol.

## 14. Interactions et états

Interactions requises :

- navigation active ;
- ouverture/fermeture du menu mobile ;
- modification des quatre critères ;
- soumission du formulaire sans rechargement ;
- filtrage et classement local des propriétés ;
- état « aucun résultat » ;
- ajout/retrait d’un favori ;
- navigation vers une fiche ;
- lien de retour depuis la fiche ;
- feedback visuel de focus, hover, pressed et disabled.

États nécessaires :

- critères du formulaire ;
- liste initiale des propriétés ;
- résultats calculés ;
- recherche déjà lancée ou non ;
- favoris ;
- menu mobile ouvert/fermé ;
- propriété sélectionnée via la route dynamique.

## 15. Composants React nécessaires

```text
app/
  page.tsx
  biens/page.tsx
  biens/[id]/page.tsx
  favoris/page.tsx
components/
  Header.tsx
  Logo.tsx
  MobileMenu.tsx
  Hero.tsx
  SearchForm.tsx
  SearchField.tsx
  StatsBar.tsx
  StatItem.tsx
  PropertyGrid.tsx
  PropertyCard.tsx
  MatchBadge.tsx
  FavoriteButton.tsx
  EmptyResults.tsx
  Footer.tsx
data/
  properties.ts
lib/
  matching.ts
types/
  property.ts
```

Ne créer un composant que lorsqu’une responsabilité est claire ou répétée. Les quatre premières leçons peuvent conserver une structure dans `app/page.tsx` avant l’extraction progressive.

## 16. Données et types

Type minimal recommandé :

```ts
type Property = {
  id: string;
  title: string;
  city: string;
  district: string;
  monthlyPrice: number;
  bedrooms: number;
  hasBalcony: boolean;
  areaM2: number;
  imageSrc: string;
  imageAlt: string;
};

type SearchCriteria = {
  city: string;
  maximumBudget: number;
  minimumBedrooms: number;
  balconyRequired: boolean;
};

type PropertyMatch = {
  property: Property;
  score: number;
};
```

Les données restent dans un module TypeScript local. Les photos sont des assets autorisés placés dans `public/`. Aucun secret, appel distant obligatoire ou donnée personnelle n’est nécessaire.

## 17. Construction progressive en 12 leçons

| # | Lesson ID | Petit changement guidé | Résultat visible lié à la référence | Validation contrôlable |
|---:|---|---|---|---|
| 1 | `web-01-projet-vscode` | Découvrir l’application finale, son parcours et préparer VS Code. | Environnement compris et projet découpé sur papier. | QCM serveur sur le projet et les outils. |
| 2 | `web-02-nextjs` | Créer PropertyMatch avec Next.js, TypeScript, Tailwind et App Router. | Projet accessible sur localhost. | QCM serveur et contrôle manuel des commandes. |
| 3 | `web-03-structure` | Ajouter progressivement la structure sémantique de l’accueil. | Squelette complet, sans design final. | QCM serveur JSX et accessibilité. |
| 4 | `web-04-tailwind` | Reproduire progressivement la direction visuelle avec Tailwind. | Accueil responsive proche de la référence. | QCM serveur Tailwind et vérifications multi-écrans. |
| 5 | `web-05-donnees` | Créer les types et le catalogue local des locations. | Données cohérentes et vérifiées par TypeScript. | QCM serveur sur types, objets et tableaux. |
| 6 | `web-06-composants` | Extraire les composants React partagés. | Interface organisée en composants réutilisables. | QCM serveur sur composants et props. |
| 7 | `web-07-cartes` | Afficher les cartes à partir des données locales. | Grille responsive de logements. | QCM serveur sur listes, clés et images. |
| 8 | `web-08-recherche` | Ajouter recherche, filtres, tris et paramètres d’URL validés. | Page de résultats fonctionnelle et états vides. | QCM serveur sur URL et fonctions de filtrage. |
| 9 | `web-09-matching` | Calculer un score local déterministe et l’expliquer. | Cartes triées avec détail des points. | QCM serveur et tests de bornes du score. |
| 10 | `web-10-fiches` | Créer les fiches dynamiques et préserver le retour aux résultats. | Une carte ouvre la bonne fiche ou une 404. | QCM serveur sur slugs et routes dynamiques. |
| 11 | `web-11-favoris` | Ajouter les favoris accessibles et persistants dans le navigateur. | Cœurs synchronisés et page Favoris. | QCM serveur sur stockage local et accessibilité. |
| 12 | `web-12-publication` | Finaliser responsive, accessibilité et tests, puis publier avec la CLI Vercel sans Git ni GitHub. | Application stable, vérifiée et publiable. | QCM serveur et suite complète de contrôles qualité. |

## 18. Règles pédagogiques de réalisation

- Chaque leçon part de l’état produit par la précédente.
- Une leçon ajoute une notion principale et une réalisation visible.
- Les extraits modifient une petite zone ; aucun remplacement opaque d’un fichier complet.
- Chaque bloc nouveau est expliqué avant la vérification dans le navigateur.
- Les fonctions de matching et les données restent locales et déterministes.
- Les nombres affichés sont calculés ou explicitement fictifs/de démonstration.
- Les futurs sujets Supabase, authentification et base de données restent réservés aux modules suivants.
- Les `lesson_id` officiels `web-*` sont conservés sans changement.
