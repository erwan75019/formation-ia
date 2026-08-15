"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// ======================================================
// TYPES
// ======================================================

type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

type LessonQuiz = {
  lessonId: string;
  number: string;
  title: string;
  description: string;
  questions: Question[];
};

// ======================================================
// CONFIGURATION
// ======================================================

const PASS_SCORE = 70;

// ======================================================
// QCM
// ======================================================

const quizzes: Record<string, LessonQuiz> = {
  // ====================================================
  // LEÇON 01
  // ====================================================

  "01": {
    lessonId: "web-01-fonctionnement",
    number: "01",
    title: "Comment fonctionne un site web ?",
    description:
      "Vérifiez que vous maîtrisez navigateur, URL, requête, serveur, frontend et backend.",

    questions: [
      {
        id: 1,
        question:
          "Quel est le rôle principal d'un navigateur comme Safari ou Chrome ?",
        options: [
          "Stocker toutes les bases de données du site",
          "Afficher et permettre d'utiliser des sites web",
          "Créer automatiquement le backend",
          "Remplacer le serveur",
        ],
        correctAnswer: 1,
        explanation:
          "Le navigateur permet notamment d'ouvrir, afficher et utiliser les interfaces web.",
      },

      {
        id: 2,
        question:
          "Qu'est-ce qu'une URL ?",
        options: [
          "Une adresse permettant d'identifier une ressource sur le Web",
          "Un langage de programmation",
          "Une base de données",
          "Un composant React",
        ],
        correctAnswer: 0,
        explanation:
          "Une URL correspond à l'adresse d'une ressource sur le Web.",
      },

      {
        id: 3,
        question:
          "Lorsque le navigateur demande des informations à un serveur, il envoie...",
        options: [
          "Une balise",
          "Une requête",
          "Un composant",
          "Un build",
        ],
        correctAnswer: 1,
        explanation:
          "Une requête est une demande envoyée à un serveur.",
      },

      {
        id: 4,
        question:
          "Quel élément reçoit une requête et peut préparer une réponse ?",
        options: [
          "Le serveur",
          "Le bouton",
          "Le CSS",
          "L'écran",
        ],
        correctAnswer: 0,
        explanation:
          "Le serveur reçoit les demandes et peut effectuer un traitement avant de renvoyer une réponse.",
      },

      {
        id: 5,
        question:
          "Dans notre séparation simplifiée, lequel appartient principalement au frontend de PropertyMatch AI ?",
        options: [
          "Le calcul du score des logements",
          "L'accès aux données",
          "Le formulaire de recherche visible",
          "Le traitement des données sur le serveur",
        ],
        correctAnswer: 2,
        explanation:
          "Le formulaire est une partie visible et manipulée par l'utilisateur.",
      },

      {
        id: 6,
        question:
          "Dans notre modèle simplifié, lequel correspond principalement au backend ?",
        options: [
          "Le titre PropertyMatch AI",
          "Le bouton Rechercher visible",
          "La carte d'un logement",
          "Le traitement des critères et des données",
        ],
        correctAnswer: 3,
        explanation:
          "Le backend s'occupe principalement de la logique et des données derrière l'interface.",
      },

      {
        id: 7,
        question:
          "Quel ordre représente le mieux l'ouverture d'un site ?",
        options: [
          "Serveur → URL → navigateur → requête",
          "URL → requête → serveur → réponse → navigateur",
          "Backend → CSS → URL → HTML",
          "Réponse → serveur → requête → navigateur",
        ],
        correctAnswer: 1,
        explanation:
          "L'utilisateur utilise une URL, le navigateur envoie une requête, le serveur répond puis le navigateur exploite cette réponse.",
      },

      {
        id: 8,
        question:
          "Pourquoi apprend-on frontend et backend avant de construire PropertyMatch ?",
        options: [
          "Pour comprendre le rôle des différentes parties de l'application",
          "Uniquement pour choisir les couleurs",
          "Pour supprimer le navigateur",
          "Pour ne plus utiliser de serveur",
        ],
        correctAnswer: 0,
        explanation:
          "Cette séparation aide à comprendre où se trouvent l'interface, la logique et les données.",
      },
    ],
  },

  // ====================================================
  // LEÇON 02
  // ====================================================

  "02": {
    lessonId: "web-02-interface",
    number: "02",
    title: "Construire l'interface de PropertyMatch AI",
    description:
      "Vérifiez votre compréhension de HTML, CSS, des balises et de la structure d'une page.",

    questions: [
      {
        id: 1,
        question:
          "Quel est le rôle principal de HTML ?",
        options: [
          "Structurer le contenu d'une page",
          "Héberger le site",
          "Calculer automatiquement un score immobilier",
          "Créer une base de données",
        ],
        correctAnswer: 0,
        explanation:
          "HTML décrit principalement la structure et le contenu de la page.",
      },

      {
        id: 2,
        question:
          "Quel est le rôle principal de CSS ?",
        options: [
          "Gérer les utilisateurs",
          "Contrôler l'apparence de la page",
          "Créer les URL",
          "Stocker les logements",
        ],
        correctAnswer: 1,
        explanation:
          "CSS permet de contrôler couleurs, tailles, espacements, dispositions et autres aspects visuels.",
      },

      {
        id: 3,
        question:
          "Quelle balise convient le mieux au titre principal « PropertyMatch AI » ?",
        options: [
          "<button>",
          "<input>",
          "<h1>",
          "<img>",
        ],
        correctAnswer: 2,
        explanation:
          "<h1> représente généralement le titre principal de la page.",
      },

      {
        id: 4,
        question:
          "Quel élément utiliser pour permettre à l'utilisateur de saisir une ville ?",
        options: [
          "<input />",
          "<h1>",
          "<p>",
          "<footer>",
        ],
        correctAnswer: 0,
        explanation:
          "Un input permet à l'utilisateur de saisir une valeur.",
      },

      {
        id: 5,
        question:
          "Quel élément correspond le mieux à l'action « Rechercher » ?",
        options: [
          "<p>",
          "<button>",
          "<h1>",
          "<title>",
        ],
        correctAnswer: 1,
        explanation:
          "Un bouton représente une action que l'utilisateur peut déclencher.",
      },

      {
        id: 6,
        question:
          "Dans PropertyMatch, quel élément appartient à la structure de la page ?",
        options: [
          "Le formulaire de recherche",
          "Uniquement la couleur du fond",
          "Uniquement l'arrondi des cartes",
          "Uniquement la taille des marges",
        ],
        correctAnswer: 0,
        explanation:
          "Le formulaire fait partie du contenu et de la structure de l'interface.",
      },

      {
        id: 7,
        question:
          "Quelle phrase résume le mieux HTML et CSS ?",
        options: [
          "HTML = données, CSS = serveur",
          "HTML = structure, CSS = apparence",
          "HTML = backend, CSS = base de données",
          "HTML = hébergement, CSS = URL",
        ],
        correctAnswer: 1,
        explanation:
          "C'est la distinction fondamentale à retenir à ce stade.",
      },

      {
        id: 8,
        question:
          "Pourquoi organiser une page en zones logiques ?",
        options: [
          "Pour aider l'utilisateur à comprendre l'interface",
          "Pour empêcher le navigateur de fonctionner",
          "Pour supprimer HTML",
          "Pour rendre toutes les pages identiques",
        ],
        correctAnswer: 0,
        explanation:
          "Une structure logique rend l'interface plus claire et plus facile à utiliser.",
      },
    ],
  },

  // ====================================================
  // LEÇON 03
  // ====================================================

  "03": {
    lessonId: "web-03-design",
    number: "03",
    title: "Créer un design professionnel",
    description:
      "Vérifiez votre maîtrise de la hiérarchie, de l'espacement, de la cohérence et du responsive.",

    questions: [
      {
        id: 1,
        question:
          "À quoi sert principalement la hiérarchie visuelle ?",
        options: [
          "À indiquer quels éléments sont les plus importants",
          "À stocker des données",
          "À créer un serveur",
          "À remplacer HTML",
        ],
        correctAnswer: 0,
        explanation:
          "La hiérarchie visuelle guide l'attention de l'utilisateur.",
      },

      {
        id: 2,
        question:
          "Pourquoi utilise-t-on des espacements entre les blocs ?",
        options: [
          "Pour rendre les groupes d'informations plus lisibles",
          "Pour augmenter le prix du serveur",
          "Pour créer une URL",
          "Pour stocker les utilisateurs",
        ],
        correctAnswer: 0,
        explanation:
          "Les espacements séparent visuellement les groupes et améliorent la lecture.",
      },

      {
        id: 3,
        question:
          "Que signifie avoir une interface cohérente ?",
        options: [
          "Changer complètement chaque bouton",
          "Utiliser des règles visuelles similaires pour les éléments similaires",
          "Mettre tous les textes à la même taille",
          "Supprimer les cartes",
        ],
        correctAnswer: 1,
        explanation:
          "La cohérence permet à l'utilisateur de reconnaître plus facilement les mêmes types d'éléments.",
      },

      {
        id: 4,
        question:
          "Qu'est-ce qu'une interface responsive ?",
        options: [
          "Une interface qui répond à un email",
          "Une interface qui s'adapte aux tailles d'écran",
          "Une interface uniquement pour ordinateur",
          "Une interface sans CSS",
        ],
        correctAnswer: 1,
        explanation:
          "Responsive signifie que la disposition peut s'adapter selon la largeur disponible.",
      },

      {
        id: 5,
        question:
          "PropertyMatch affiche 3 cartes côte à côte sur ordinateur. Sur un petit téléphone, quelle solution est généralement plus adaptée ?",
        options: [
          "Conserver obligatoirement les 3 colonnes",
          "Afficher les cartes sur une seule colonne",
          "Supprimer les logements",
          "Désactiver le téléphone",
        ],
        correctAnswer: 1,
        explanation:
          "Une colonne offre généralement davantage d'espace aux cartes sur un petit écran.",
      },

      {
        id: 6,
        question:
          "Qu'est-ce qu'un breakpoint ?",
        options: [
          "Un mot de passe",
          "Une largeur à partir de laquelle la disposition peut changer",
          "Une base de données",
          "Un type de serveur",
        ],
        correctAnswer: 1,
        explanation:
          "Les breakpoints permettent d'appliquer des dispositions différentes selon la taille de l'écran.",
      },

      {
        id: 7,
        question:
          "À quoi sert Tailwind CSS dans notre projet ?",
        options: [
          "À appliquer des règles CSS à travers des classes",
          "À remplacer React par Python",
          "À créer une base de données",
          "À acheter un domaine",
        ],
        correctAnswer: 0,
        explanation:
          "Tailwind fournit des classes utilitaires permettant de construire rapidement le style d'une interface.",
      },

      {
        id: 8,
        question:
          "Un bon design sert uniquement à rendre le site joli.",
        options: [
          "Vrai",
          "Faux",
        ],
        correctAnswer: 1,
        explanation:
          "Le design sert aussi à guider l'utilisateur, améliorer la compréhension et faciliter l'utilisation.",
      },
    ],
  },

  // ====================================================
  // LEÇON 04
  // ====================================================

  "04": {
    lessonId: "web-04-interactions",
    number: "04",
    title: "Ajouter des interactions",
    description:
      "Vérifiez JavaScript, événements, état, React et useState.",

    questions: [
      {
        id: 1,
        question:
          "Pourquoi ajoute-t-on JavaScript à une interface web ?",
        options: [
          "Pour ajouter du comportement et des interactions",
          "Uniquement pour changer la police",
          "Pour remplacer Internet",
          "Pour acheter un domaine",
        ],
        correctAnswer: 0,
        explanation:
          "JavaScript permet notamment de réagir aux actions de l'utilisateur et de modifier l'interface.",
      },

      {
        id: 2,
        question:
          "Qu'est-ce qu'un événement ?",
        options: [
          "Une valeur stockée définitivement",
          "Une action détectée par l'interface",
          "Un serveur",
          "Une balise HTML",
        ],
        correctAnswer: 1,
        explanation:
          "Un clic, une saisie ou une sélection sont des exemples d'événements.",
      },

      {
        id: 3,
        question:
          "Dans PropertyMatch, lequel est un exemple d'état ?",
        options: [
          "Le budget actuellement sélectionné",
          "Le nom du langage HTML",
          "L'adresse physique du serveur",
          "Le mot frontend",
        ],
        correctAnswer: 0,
        explanation:
          "Le budget peut changer pendant l'utilisation de l'application : il peut donc être représenté comme un état.",
      },

      {
        id: 4,
        question:
          "Que permet useState dans React ?",
        options: [
          "Créer un domaine",
          "Gérer une valeur qui peut changer",
          "Créer automatiquement un serveur",
          "Écrire du CSS uniquement",
        ],
        correctAnswer: 1,
        explanation:
          "useState permet à un composant de conserver et modifier une valeur.",
      },

      {
        id: 5,
        question:
          "Dans ce code : const [budget, setBudget] = useState(2300), quelle est la valeur initiale ?",
        options: [
          "budget",
          "setBudget",
          "2300",
          "const",
        ],
        correctAnswer: 2,
        explanation:
          "2300 est la valeur passée à useState au moment de l'initialisation.",
      },

      {
        id: 6,
        question:
          "Dans ce même code, à quoi sert setBudget ?",
        options: [
          "À modifier la valeur du budget",
          "À supprimer React",
          "À créer une route",
          "À publier le site",
        ],
        correctAnswer: 0,
        explanation:
          "setBudget est la fonction utilisée pour demander une modification de l'état budget.",
      },

      {
        id: 7,
        question:
          "Cliquer sur le bouton « Rechercher » est...",
        options: [
          "Un état",
          "Un événement",
          "Une URL",
          "Un composant",
        ],
        correctAnswer: 1,
        explanation:
          "Le clic est une action utilisateur détectable par l'interface.",
      },

      {
        id: 8,
        question:
          "Si le budget change, PropertyMatch peut recalculer les logements affichés. Cela illustre...",
        options: [
          "Une interface interactive",
          "Un fichier totalement statique",
          "Un domaine",
          "Un hébergement",
        ],
        correctAnswer: 0,
        explanation:
          "L'interface réagit à une valeur modifiée et met à jour le résultat.",
      },
    ],
  },

  // ====================================================
  // LEÇON 05
  // ====================================================

  "05": {
    lessonId: "web-05-nextjs",
    number: "05",
    title: "Comprendre les pages et composants",
    description:
      "Vérifiez votre compréhension de React, composants, props, routes et Next.js.",

    questions: [
      {
        id: 1,
        question:
          "Qu'est-ce qu'un composant React ?",
        options: [
          "Un bloc d'interface réutilisable",
          "Une adresse Internet",
          "Un serveur physique",
          "Un fichier de données obligatoire",
        ],
        correctAnswer: 0,
        explanation:
          "Un composant représente une partie de l'interface que l'on peut organiser et réutiliser.",
      },

      {
        id: 2,
        question:
          "Pourquoi créer un composant PropertyCard ?",
        options: [
          "Pour éviter de recopier le code d'une carte pour chaque logement",
          "Pour supprimer toutes les pages",
          "Pour remplacer Internet",
          "Pour créer un domaine",
        ],
        correctAnswer: 0,
        explanation:
          "Le même composant peut être utilisé pour plusieurs logements avec des données différentes.",
      },

      {
        id: 3,
        question:
          "Que sont les props ?",
        options: [
          "Des informations transmises à un composant",
          "Des URL obligatoires",
          "Des serveurs",
          "Des fichiers CSS",
        ],
        correctAnswer: 0,
        explanation:
          "Les props permettent de fournir des informations à un composant.",
      },

      {
        id: 4,
        question:
          "Dans PropertyCard, title et price peuvent être...",
        options: [
          "Des props",
          "Des domaines",
          "Des navigateurs",
          "Des hébergeurs",
        ],
        correctAnswer: 0,
        explanation:
          "Chaque carte peut recevoir son titre et son prix via des props.",
      },

      {
        id: 5,
        question:
          "Qu'est-ce qu'une route ?",
        options: [
          "Une adresse correspondant à une partie de l'application",
          "Une couleur CSS",
          "Un type de bouton",
          "Une variable uniquement",
        ],
        correctAnswer: 0,
        explanation:
          "Par exemple /recherche et /favoris peuvent correspondre à deux routes.",
      },

      {
        id: 6,
        question:
          "Dans Next.js App Router, quel fichier représente généralement une page ?",
        options: [
          "page.tsx",
          "database.jpg",
          "server.png",
          "style.exe",
        ],
        correctAnswer: 0,
        explanation:
          "Dans l'App Router de Next.js, page.tsx définit l'interface d'une route.",
      },

      {
        id: 7,
        question:
          "Next.js est...",
        options: [
          "Un framework basé sur React",
          "Une base de données",
          "Un navigateur",
          "Un langage qui remplace JavaScript",
        ],
        correctAnswer: 0,
        explanation:
          "Next.js fournit une structure et des fonctionnalités supplémentaires autour de React.",
      },

      {
        id: 8,
        question:
          "Quelle architecture est la plus logique ?",
        options: [
          "Une seule page de 20 000 lignes pour tout le site",
          "Des pages et plusieurs composants spécialisés",
          "Une copie complète du code pour chaque logement",
          "Aucun composant",
        ],
        correctAnswer: 1,
        explanation:
          "Découper l'application facilite la réutilisation, la compréhension et la maintenance.",
      },
    ],
  },

  // ====================================================
  // LEÇON 06
  // ====================================================

  "06": {
    lessonId: "web-06-propertymatch",
    number: "06",
    title: "Construire PropertyMatch AI",
    description:
      "Vérifiez votre compréhension du pipeline complet : critères, données, filtrage, scoring et résultats.",

    questions: [
      {
        id: 1,
        question:
          "Quelle est la première information dont PropertyMatch a besoin pour personnaliser sa recherche ?",
        options: [
          "Les critères de l'utilisateur",
          "La couleur de son ordinateur",
          "Le nom de son navigateur uniquement",
          "Le nom du serveur",
        ],
        correctAnswer: 0,
        explanation:
          "Budget, chambres, quartiers et autres préférences constituent les critères de recherche.",
      },

      {
        id: 2,
        question:
          "À quoi correspond le dataset de logements ?",
        options: [
          "À l'ensemble des données immobilières disponibles pour l'application",
          "Au bouton Rechercher",
          "À la couleur du site",
          "À l'URL du navigateur",
        ],
        correctAnswer: 0,
        explanation:
          "Le dataset contient les logements et leurs caractéristiques.",
      },

      {
        id: 3,
        question:
          "À quoi sert le filtrage ?",
        options: [
          "À sélectionner les données selon certaines conditions",
          "À modifier le domaine",
          "À installer Chrome",
          "À créer une couleur",
        ],
        correctAnswer: 0,
        explanation:
          "Le filtrage permet par exemple d'écarter les logements trop chers.",
      },

      {
        id: 4,
        question:
          "À quoi sert un score de compatibilité ?",
        options: [
          "À mesurer à quel point un logement correspond aux critères",
          "À mesurer la vitesse du Wi-Fi uniquement",
          "À choisir une police",
          "À créer une URL",
        ],
        correctAnswer: 0,
        explanation:
          "Le score synthétise plusieurs critères afin d'aider au classement.",
      },

      {
        id: 5,
        question:
          "Après le calcul des scores, quelle étape est logique ?",
        options: [
          "Classer les logements selon leur compatibilité",
          "Supprimer toutes les données",
          "Fermer le navigateur",
          "Supprimer le formulaire",
        ],
        correctAnswer: 0,
        explanation:
          "Le score peut être utilisé pour classer les résultats du meilleur au moins bon.",
      },

      {
        id: 6,
        question:
          "Si un appartement dépasse le budget maximal, PropertyMatch peut...",
        options: [
          "Le pénaliser ou l'écarter selon les règles choisies",
          "Obligatoirement lui donner 100 %",
          "Supprimer React",
          "Changer automatiquement de domaine",
        ],
        correctAnswer: 0,
        explanation:
          "La logique de filtrage ou de scoring détermine comment ce critère influence le résultat.",
      },

      {
        id: 7,
        question:
          "Quel pipeline est le plus cohérent ?",
        options: [
          "Critères → analyse des logements → scoring → classement → affichage",
          "Affichage → domaine → CSS → navigateur → critères",
          "Score → suppression des données → URL",
          "HTML → hébergement → clavier → score",
        ],
        correctAnswer: 0,
        explanation:
          "Les critères sont d'abord récupérés, puis les données sont analysées et les résultats produits.",
      },

      {
        id: 8,
        question:
          "Pourquoi la leçon 06 est-elle importante ?",
        options: [
          "Elle assemble plusieurs notions précédentes dans une application fonctionnelle",
          "Elle sert uniquement à choisir une couleur",
          "Elle supprime toutes les leçons précédentes",
          "Elle apprend uniquement à écrire une URL",
        ],
        correctAnswer: 0,
        explanation:
          "C'est le moment où interface, état, données et logique commencent à fonctionner ensemble.",
      },
    ],
  },

  // ====================================================
  // LEÇON 07
  // ====================================================

  "07": {
    lessonId: "web-07-publication",
    number: "07",
    title: "Publier son site sur Internet",
    description:
      "Vérifiez localhost, build, hébergement, production, déploiement et domaine.",

    questions: [
      {
        id: 1,
        question:
          "Que représente localhost ?",
        options: [
          "Votre propre machine",
          "Obligatoirement un serveur situé aux États-Unis",
          "Un langage de programmation",
          "Une base de données",
        ],
        correctAnswer: 0,
        explanation:
          "localhost permet de désigner la machine locale sur laquelle l'application fonctionne.",
      },

      {
        id: 2,
        question:
          "Si PropertyMatch fonctionne uniquement sur localhost, un ami situé ailleurs peut-il normalement ouvrir directement cette adresse sur son téléphone ?",
        options: [
          "Oui, toujours",
          "Non",
        ],
        correctAnswer: 1,
        explanation:
          "localhost désigne la machine locale de la personne qui utilise l'adresse.",
      },

      {
        id: 3,
        question:
          "À quoi sert le build de production ?",
        options: [
          "À préparer l'application pour son exécution en production",
          "À acheter un appartement",
          "À créer un clavier",
          "À supprimer React",
        ],
        correctAnswer: 0,
        explanation:
          "Le build prépare une version de l'application destinée à l'environnement de production.",
      },

      {
        id: 4,
        question:
          "Qu'est-ce que l'hébergement ?",
        options: [
          "L'infrastructure permettant d'exécuter et rendre accessible l'application",
          "Un bouton HTML",
          "Une variable JavaScript",
          "Une couleur CSS",
        ],
        correctAnswer: 0,
        explanation:
          "L'hébergement fournit l'environnement dans lequel l'application peut fonctionner en ligne.",
      },

      {
        id: 5,
        question:
          "Que signifie déployer une application ?",
        options: [
          "Mettre une version de l'application à disposition dans un environnement cible",
          "Éteindre définitivement le projet",
          "Créer uniquement un titre HTML",
          "Supprimer le serveur",
        ],
        correctAnswer: 0,
        explanation:
          "Le déploiement permet notamment de rendre une version du projet disponible en production.",
      },

      {
        id: 6,
        question:
          "Qu'est-ce que la production ?",
        options: [
          "L'environnement réellement utilisé par les utilisateurs",
          "Uniquement VS Code",
          "Un type de balise",
          "Une variable React",
        ],
        correctAnswer: 0,
        explanation:
          "La production correspond à l'environnement de la version réellement utilisée.",
      },

      {
        id: 7,
        question:
          "Qu'est-ce qu'un nom de domaine ?",
        options: [
          "Un nom permettant d'accéder plus facilement à un site",
          "Un composant React",
          "Un état useState",
          "Un fichier CSS",
        ],
        correctAnswer: 0,
        explanation:
          "Un domaine est un nom comme propertymatch.ai utilisé pour accéder à un service sur Internet.",
      },

      {
        id: 8,
        question:
          "Quel ordre est le plus cohérent avant la publication ?",
        options: [
          "Vérification locale → build → hébergement/déploiement → URL publique",
          "URL publique → suppression du projet → HTML",
          "Domaine → suppression du code → localhost",
          "CSS → clavier → URL → React",
        ],
        correctAnswer: 0,
        explanation:
          "On vérifie d'abord le projet, on prépare la version de production puis on la déploie.",
      },
    ],
  },
};

// ======================================================
// PAGE
// ======================================================

export default function WebQuizPage() {
  const params = useParams();

  const lessonSlug =
    typeof params.lesson === "string"
      ? params.lesson
      : "";

  const quiz = quizzes[lessonSlug];

  if (!quiz) {
    return (
      <main className="min-h-screen bg-[#f5f7fb] px-6 py-10 text-slate-900">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-xs font-semibold tracking-[0.18em] text-slate-400">
              QCM
            </p>

            <h1 className="mt-4 text-3xl font-bold">
              QCM introuvable
            </h1>

            <Link
              href="/formation/python"
              className="mt-6 inline-block rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white"
            >
              ← Retour au module
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return <Quiz quiz={quiz} />;
}

// ======================================================
// QUIZ
// ======================================================

function Quiz({
  quiz,
}: {
  quiz: LessonQuiz;
}) {
  const [answers, setAnswers] =
    useState<Record<number, number>>({});

  const [submitted, setSubmitted] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [saveError, setSaveError] =
    useState("");

  // ====================================================
  // SCORE
  // ====================================================

  const correctAnswers = useMemo(() => {
    return quiz.questions.filter(
      (question) =>
        answers[question.id] ===
        question.correctAnswer
    ).length;
  }, [answers, quiz.questions]);

  const score = useMemo(() => {
    return Math.round(
      (correctAnswers /
        quiz.questions.length) *
        100
    );
  }, [
    correctAnswers,
    quiz.questions.length,
  ]);

  const passed =
    score >= PASS_SCORE;

  const allAnswered =
    quiz.questions.every(
      (question) =>
        answers[question.id] !==
        undefined
    );

  // ====================================================
  // CHOIX
  // ====================================================

  function selectAnswer(
    questionId: number,
    optionIndex: number
  ) {
    if (submitted) {
      return;
    }

    setAnswers((current) => ({
      ...current,
      [questionId]: optionIndex,
    }));
  }

  // ====================================================
  // VALIDATION
  // ====================================================

  async function submitQuiz() {
    if (!allAnswered || saving) {
      return;
    }

    setSubmitted(true);
    setSaveError("");

    if (!passed) {
      return;
    }

    await saveProgress();
  }

  // ====================================================
  // SUPABASE
  // ====================================================

  async function saveProgress() {
    setSaving(true);
    setSaveError("");

    try {
      const supabase =
        createClient();

      const {
        data: { user },
        error: userError,
      } =
        await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        throw new Error(
          "Vous devez être connecté pour enregistrer votre progression."
        );
      }

      // On vérifie d'abord si une ligne existe déjà.
      const {
        data: existingProgress,
        error: existingError,
      } = await supabase
        .from("lesson_progress")
        .select(
          "id, score, completed"
        )
        .eq("user_id", user.id)
        .eq(
          "lesson_id",
          quiz.lessonId
        )
        .maybeSingle();

      if (existingError) {
        throw existingError;
      }

      // Si la leçon existe déjà, on garde le meilleur score.
      if (existingProgress) {
        const previousScore =
          existingProgress.score ??
          0;

        const bestScore =
          Math.max(
            previousScore,
            score
          );

        const {
          error: updateError,
        } = await supabase
          .from("lesson_progress")
          .update({
            score: bestScore,
            completed: true,
          })
          .eq(
            "id",
            existingProgress.id
          );

        if (updateError) {
          throw updateError;
        }
      } else {
        const {
          error: insertError,
        } = await supabase
          .from("lesson_progress")
          .insert({
            user_id: user.id,
            lesson_id:
              quiz.lessonId,
            score,
            completed: true,
          });

        if (insertError) {
          throw insertError;
        }
      }

      setSaved(true);
    } catch (error) {
      console.error(
        "Erreur sauvegarde progression :",
        error
      );

      setSaveError(
        error instanceof Error
          ? error.message
          : "Impossible d'enregistrer votre progression."
      );
    } finally {
      setSaving(false);
    }
  }

  // ====================================================
  // RECOMMENCER
  // ====================================================

  function restartQuiz() {
    setAnswers({});
    setSubmitted(false);
    setSaved(false);
    setSaveError("");
  }

  // ====================================================
  // NEXT
  // ====================================================

  const lessonNumber =
    Number(quiz.number);

  const nextNumber =
    String(
      lessonNumber + 1
    ).padStart(2, "0");

  const isLastLesson =
    lessonNumber === 7;

  // ====================================================
  // UI
  // ====================================================

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-5xl">
        {/* ================================================
            TOP
        ================================================= */}

        <div className="flex items-center justify-between gap-4">
          <Link
            href={`/formation/python/${quiz.number}/exercice`}
            className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            ← Retour à l&apos;atelier
          </Link>

          <span className="rounded-full bg-white px-4 py-2 text-sm shadow-sm">
            QCM · Leçon {quiz.number}
          </span>
        </div>

        {/* ================================================
            HEADER
        ================================================= */}

        <section className="mt-8 overflow-hidden rounded-[30px] bg-slate-950 p-8 text-white shadow-xl md:p-10">
          <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
            VALIDATION
          </p>

          <h1 className="mt-4 max-w-3xl text-3xl font-bold md:text-4xl">
            {quiz.title}
          </h1>

          <p className="mt-4 max-w-3xl leading-7 text-slate-400">
            {quiz.description}
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <HeaderStat
              label="Questions"
              value={String(
                quiz.questions.length
              )}
            />

            <HeaderStat
              label="Validation"
              value={`${PASS_SCORE}%`}
            />

            <HeaderStat
              label="Répondu"
              value={`${Object.keys(answers).length}/${quiz.questions.length}`}
            />
          </div>
        </section>

        {/* ================================================
            QUESTIONS
        ================================================= */}

        <div className="mt-7 space-y-5">
          {quiz.questions.map(
            (question, index) => {
              const selectedAnswer =
                answers[question.id];

              const isCorrect =
                selectedAnswer ===
                question.correctAnswer;

              return (
                <QuestionCard
                  key={question.id}
                  number={index + 1}
                  question={question}
                  selectedAnswer={
                    selectedAnswer
                  }
                  submitted={
                    submitted
                  }
                  isCorrect={
                    isCorrect
                  }
                  onSelect={(
                    optionIndex
                  ) =>
                    selectAnswer(
                      question.id,
                      optionIndex
                    )
                  }
                />
              );
            }
          )}
        </div>

        {/* ================================================
            SUBMIT
        ================================================= */}

        {!submitted && (
          <section className="mt-7 rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
            {!allAnswered && (
              <p className="mb-4 text-center text-sm text-slate-500">
                Répondez aux{" "}
                {quiz.questions.length} questions
                avant de valider.
              </p>
            )}

            <button
              type="button"
              onClick={submitQuiz}
              disabled={
                !allAnswered ||
                saving
              }
              className="w-full rounded-2xl bg-slate-950 px-6 py-5 text-lg font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            >
              {saving
                ? "Enregistrement..."
                : allAnswered
                  ? "Valider mes réponses →"
                  : `${Object.keys(answers).length}/${quiz.questions.length} réponses`}
            </button>
          </section>
        )}

        {/* ================================================
            RESULT
        ================================================= */}

        {submitted && (
          <ResultPanel
            score={score}
            correctAnswers={
              correctAnswers
            }
            total={
              quiz.questions.length
            }
            passed={passed}
          />
        )}

        {/* ================================================
            ECHEC
        ================================================= */}

        {submitted &&
          !passed && (
            <section className="mt-6 rounded-[26px] border border-slate-200 bg-white p-7 shadow-sm">
              <p className="text-xs font-semibold tracking-[0.18em] text-slate-400">
                PAS ENCORE VALIDÉ
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                Il faut obtenir au moins{" "}
                {PASS_SCORE}%.
              </h2>

              <p className="mt-3 leading-7 text-slate-500">
                Regardez les corrections ci-dessus,
                identifiez les notions qui posent
                problème puis recommencez le QCM.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={
                    restartQuiz
                  }
                  className="rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white"
                >
                  Recommencer le QCM
                </button>

                <Link
                  href={`/formation/python/${quiz.number}`}
                  className="rounded-2xl border border-slate-200 px-6 py-4 font-semibold"
                >
                  Revoir le cours
                </Link>
              </div>
            </section>
          )}

        {/* ================================================
            SAVE ERROR
        ================================================= */}

        {saveError && (
          <section className="mt-6 rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="font-bold">
              Le QCM est réussi, mais la
              progression n&apos;a pas pu être
              enregistrée.
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {saveError}
            </p>

            <button
              type="button"
              onClick={
                saveProgress
              }
              disabled={saving}
              className="mt-5 rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white disabled:opacity-50"
            >
              {saving
                ? "Nouvelle tentative..."
                : "Réessayer l'enregistrement"}
            </button>
          </section>
        )}

        {/* ================================================
            SUCCESS
        ================================================= */}

        {submitted &&
          passed &&
          saved && (
            <section className="mt-6 overflow-hidden rounded-[28px] bg-slate-950 p-8 text-white shadow-xl">
              <p className="text-xs font-semibold tracking-[0.18em] text-slate-500">
                LEÇON VALIDÉE
              </p>

              <div className="mt-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl text-slate-950">
                ✓
              </div>

              <h2 className="mt-5 text-3xl font-bold">
                Leçon {quiz.number} terminée.
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-slate-400">
                Votre résultat a été enregistré.
                {isLastLesson
                  ? " Vous avez terminé les 7 leçons du module."
                  : " La leçon suivante est maintenant accessible."}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                {!isLastLesson ? (
                  <Link
                    href={`/formation/python/${nextNumber}`}
                    className="rounded-2xl bg-white px-6 py-4 font-semibold text-slate-950"
                  >
                    Leçon {nextNumber} →
                  </Link>
                ) : (
                  <Link
                    href="/formation/python"
                    className="rounded-2xl bg-white px-6 py-4 font-semibold text-slate-950"
                  >
                    Voir le module terminé →
                  </Link>
                )}

                <Link
                  href="/formation/python"
                  className="rounded-2xl border border-slate-700 px-6 py-4 font-semibold text-white"
                >
                  Retour au module
                </Link>
              </div>
            </section>
          )}
      </div>
    </main>
  );
}

// ======================================================
// QUESTION
// ======================================================

function QuestionCard({
  number,
  question,
  selectedAnswer,
  submitted,
  isCorrect,
  onSelect,
}: {
  number: number;
  question: Question;
  selectedAnswer:
    | number
    | undefined;
  submitted: boolean;
  isCorrect: boolean;
  onSelect: (
    optionIndex: number
  ) => void;
}) {
  return (
    <section className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm md:p-7">
      <div className="flex gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white">
          {String(number).padStart(
            2,
            "0"
          )}
        </span>

        <div className="flex-1">
          <h2 className="text-lg font-bold leading-7">
            {question.question}
          </h2>

          <div className="mt-5 space-y-3">
            {question.options.map(
              (
                option,
                optionIndex
              ) => {
                const selected =
                  selectedAnswer ===
                  optionIndex;

                const correct =
                  question.correctAnswer ===
                  optionIndex;

                let style =
                  "border-slate-200 bg-white hover:border-slate-400";

                if (
                  !submitted &&
                  selected
                ) {
                  style =
                    "border-slate-950 bg-slate-950 text-white";
                }

                if (
                  submitted &&
                  correct
                ) {
                  style =
                    "border-slate-950 bg-slate-950 text-white";
                }

                if (
                  submitted &&
                  selected &&
                  !correct
                ) {
                  style =
                    "border-slate-300 bg-slate-100 text-slate-500";
                }

                return (
                  <button
                    key={
                      optionIndex
                    }
                    type="button"
                    disabled={
                      submitted
                    }
                    onClick={() =>
                      onSelect(
                        optionIndex
                      )
                    }
                    className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${style}`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                        selected ||
                        (submitted &&
                          correct)
                          ? "bg-white/10"
                          : "bg-slate-100"
                      }`}
                    >
                      {String.fromCharCode(
                        65 +
                          optionIndex
                      )}
                    </span>

                    <span className="text-sm font-medium leading-6">
                      {option}
                    </span>

                    {submitted &&
                      correct && (
                        <span className="ml-auto font-bold">
                          ✓
                        </span>
                      )}

                    {submitted &&
                      selected &&
                      !correct && (
                        <span className="ml-auto font-bold">
                          ×
                        </span>
                      )}
                  </button>
                );
              }
            )}
          </div>

          {submitted && (
            <div className="mt-5 rounded-2xl bg-slate-50 p-5">
              <p className="text-xs font-semibold tracking-[0.14em] text-slate-400">
                {isCorrect
                  ? "BONNE RÉPONSE"
                  : "CORRECTION"}
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {
                  question.explanation
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ======================================================
// RESULT
// ======================================================

function ResultPanel({
  score,
  correctAnswers,
  total,
  passed,
}: {
  score: number;
  correctAnswers: number;
  total: number;
  passed: boolean;
}) {
  return (
    <section className="mt-7 overflow-hidden rounded-[28px] bg-slate-950 p-8 text-white shadow-xl">
      <p className="text-xs font-semibold tracking-[0.18em] text-slate-500">
        VOTRE RÉSULTAT
      </p>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-6xl font-bold">
            {score}
            <span className="text-2xl text-slate-500">
              %
            </span>
          </p>

          <p className="mt-3 font-semibold text-slate-300">
            {correctAnswers}/{total} bonnes
            réponses
          </p>
        </div>

        <div
          className={`rounded-2xl px-5 py-3 font-bold ${
            passed
              ? "bg-white text-slate-950"
              : "bg-slate-800 text-white"
          }`}
        >
          {passed
            ? "✓ Validé"
            : "À revoir"}
        </div>
      </div>

      <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-white transition-all"
          style={{
            width: `${score}%`,
          }}
        />
      </div>

      <p className="mt-5 text-sm leading-6 text-slate-400">
        Score minimum pour valider :{" "}
        {PASS_SCORE}%.
      </p>
    </section>
  );
}

// ======================================================
// HEADER STAT
// ======================================================

function HeaderStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-900 p-4">
      <p className="text-xs text-slate-500">
        {label.toUpperCase()}
      </p>

      <p className="mt-2 text-xl font-bold">
        {value}
      </p>
    </div>
  );
}