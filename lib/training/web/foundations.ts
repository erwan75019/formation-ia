import { webLessonCatalog } from "../catalog.ts";
import { lessonThreePageCode } from "./checkpoints.ts";
import { webLessonsFourToSix } from "./lessons456.ts";
import { webLessonsSevenToNine } from "./lessons789.ts";
import { webLessonsTenToTwelve } from "./lessons101112.ts";
import type { LessonPedagogyVisual } from "./pedagogy.ts";

export type WebFoundationLesson = {
  id: (typeof webLessonCatalog)[number]["id"];
  slug: string;
  number: string;
  title: string;
  build: string;
  visibleResult: string;
  installTools?: readonly { name: string; url: string; purpose: string }[];
  prerequisites: readonly string[];
  vocabulary: readonly { term: string; definition: string }[];
  steps: readonly {
    title: string;
    instruction: string;
    action?: "Créer" | "Ouvrir" | "Conserver" | "Ajouter" | "Remplacer entièrement";
    path?: string;
    commands?: readonly string[];
    download?: { url: string; label: string };
    code?: string;
    explanation?: readonly string[];
    expected: string;
    visual?: LessonPedagogyVisual;
  }[];
  checklist: readonly string[];
  errors: readonly { problem: string; cause: string; correction: string }[];
  exercise: readonly string[];
  summary: readonly string[];
};

const firstThreeWebFoundationLessons: readonly WebFoundationLesson[] = [
  {
    id: webLessonCatalog[0].id, slug: "01", number: "01", title: webLessonCatalog[0].title,
    build: "Préparer un espace de travail propre et comprendre les rôles différents d’AI Academy, de VS Code, des fichiers et du serveur local.",
    visibleResult: "Le dossier parent mes-projets est ouvert dans VS Code. Les principales zones de l’éditeur sont identifiées ; Node.js et npm affichent une version.",
    installTools: [
      { name: "Visual Studio Code", url: "https://code.visualstudio.com/download", purpose: "L’application utilisée pour écrire, enregistrer et organiser le code de PropertyMatch." },
      { name: "Node.js", url: "https://nodejs.org/en/download", purpose: "Le programme qui permet à l’ordinateur d’exécuter les outils JavaScript. npm est installé automatiquement avec Node.js." },
    ],
    prerequisites: ["Un ordinateur sous macOS ou Windows.", "AI Academy ouverte dans le navigateur pour lire les instructions.", "Aucune connaissance du terminal ou du code."],
    vocabulary: [
      { term: "Frontend", definition: "La partie visible et utilisable du site dans le navigateur." },
      { term: "Navigateur", definition: "L’application qui affiche un site, par exemple Chrome, Firefox ou Safari." },
      { term: "Serveur local", definition: "Un programme lancé sur votre ordinateur qui prépare PropertyMatch pour le navigateur." },
      { term: "Dossier", definition: "Un emplacement qui regroupe les fichiers d’un projet." },
      { term: "Fichier", definition: "Un document nommé qui contient du texte, du code ou une image." },
      { term: "Terminal", definition: "Une zone où vous écrivez une commande puis appuyez sur Entrée." },
      { term: "npm", definition: "L’outil installé avec Node.js qui télécharge les packages et lance le serveur de développement." },
      { term: "Package", definition: "Un ensemble de code prêt à être installé et utilisé par un projet." },
    ],
    steps: [
      { title: "Découvrir le projet final", instruction: "Observez les douze étapes puis l’aperçu final. PropertyMatch sera une application fictive de recherche de locations avec accueil, filtres, score explicable, fiches et favoris locaux. Ne recopiez encore aucun code.", action: "Conserver", path: "Cette page AI Academy dans le navigateur", expected: "Vous distinguez l’objectif final du résultat attendu aujourd’hui.", visual: { src: "/formation/site-web/lessons/01/project-roadmap.svg", alt: "Carte des douze leçons qui construisent progressivement PropertyMatch", caption: "Étape 1 — chaque bloc correspond à un résultat réellement ajouté au projet.", width: 1200, height: 620, placement: 1 } },
      { title: "Installer les outils selon votre ordinateur", instruction: "Sur macOS : ouvrez les deux liens officiels ci-dessus, téléchargez VS Code pour Mac et la version LTS de Node.js, ouvrez les fichiers téléchargés puis suivez les étapes affichées. Sur Windows : téléchargez VS Code pour Windows et l’installateur LTS de Node.js, ouvrez chaque installateur puis conservez les options recommandées. Après Node.js, fermez complètement VS Code et rouvrez-le avant de tester les commandes. Le navigateur affiche le site ; AI Academy donne les instructions mais ne crée pas votre projet automatiquement.", action: "Conserver", path: "Dossier Téléchargements de macOS ou Windows", expected: "VS Code s’ouvre et Node.js est installé ; aucun autre outil n’est requis à cette étape." },
      { title: "Créer seulement le dossier parent", instruction: "Sur macOS, ouvrez Finder ; sur Windows, ouvrez l’Explorateur de fichiers. Allez dans Documents, créez un nouveau dossier et nommez-le mes-projets. Ne créez pas propertymatch : create-next-app le fera à la leçon 2. La structure attendue est mes-projets/ puis aucun projet PropertyMatch pour le moment.", action: "Créer", path: "Documents/mes-projets", expected: "Le dossier mes-projets existe et ne contient pas encore propertymatch." },
      { title: "Ouvrir le dossier parent dans VS Code", instruction: "Ouvrez VS Code. Cliquez sur Fichier dans la barre de menus, choisissez Ouvrir le dossier…, sélectionnez Documents puis mes-projets et confirmez. Dans la barre d’activité à gauche, cliquez sur la première icône en forme de fichiers pour afficher l’Explorateur.", action: "Ouvrir", path: "Documents/mes-projets", explanation: ["1. Barre d’activité : colonne d’icônes tout à gauche ; elle change d’outil dans VS Code.", "2. Explorateur : panneau de gauche ; il montre les dossiers et fichiers ouverts dans VS Code, pas tout le contenu de Finder ou de l’Explorateur Windows.", "3. Dossier du projet : conteneur qui regroupera PropertyMatch ; un dossier n’est pas un fichier.", "4. Fichiers : éléments portant un nom et une extension ; vous les ouvrirez pour écrire du code.", "5. Onglets ouverts : ligne au-dessus de l’éditeur ; elle permet de passer d’un fichier ouvert à un autre.", "6. Zone d’édition : grande zone centrale ; elle montre le code, jamais le résultat visuel du site.", "7. Terminal intégré : panneau inférieur ; il reçoit des commandes, pas du code JSX ni une adresse web.", "8. Problèmes : onglet du panneau inférieur ; il signalera les erreurs détectées dans les fichiers.", "9. Extensions : icône de blocs dans la barre d’activité ; elle ajoute des outils à VS Code, pas des fonctionnalités au site.", "10. Recherche : icône de loupe à gauche ; elle recherche un texte dans les fichiers du projet.", "11. Barre d’état : bande tout en bas ; elle affiche des informations sur le fichier et le projet.", "12. Bouton du panneau : icône en bas à droite ou menu Affichage > Apparence > Panneau ; il ouvre et ferme notamment le terminal."], expected: "MES-PROJETS apparaît dans l’Explorateur et les douze zones du visuel sont repérées.", visual: { src: "/formation/site-web/lessons/01/vscode-anatomy.svg", alt: "VS Code annoté avec douze zones numérotées", caption: "Étape 4 — les numéros correspondent exactement aux explications ci-dessus.", width: 1200, height: 700, placement: 4 } },
      { title: "Vérifier Node.js et npm dans le terminal", instruction: "Cliquez sur Terminal dans la barre de menus puis Nouveau terminal. Dans le panneau inférieur, repérez la ligne qui se termine par un symbole comme % ou $. Ne recopiez jamais ce symbole : cliquez juste après, saisissez ou collez une commande, puis appuyez sur Entrée. Quand un numéro s’affiche puis qu’une nouvelle ligne avec % ou $ apparaît, la commande est terminée.", action: "Ouvrir", path: "VS Code > Terminal > Nouveau terminal", commands: ["node --version", "npm --version"], explanation: ["Une commande se saisit dans le terminal.", "Du code JSX se colle dans un fichier ouvert dans la zone d’édition.", "Une adresse comme http://localhost:3000 s’ouvre dans la barre d’adresse du navigateur.", "Pour copier, utilisez Cmd + C sur Mac ou Ctrl + C sur Windows ; pour coller, Cmd + V ou Ctrl + V.", "Pour enregistrer un fichier, utilisez Cmd + S sur Mac ou Ctrl + S sur Windows. Enregistrer ne publie rien sur Internet."], expected: "Les deux commandes affichent une version, puis le terminal présente une nouvelle invite.", visual: { src: "/formation/site-web/lessons/01/local-development-flow.svg", alt: "Schéma reliant fichiers, serveur local et navigateur", caption: "Étape 5 — terminal, code et adresse web ont chacun un emplacement différent.", width: 1200, height: 470, placement: 5 } },
      { title: "Distinguer AI Academy et PropertyMatch", instruction: "AI Academy reste dans le navigateur et vous guide. PropertyMatch est le dossier séparé ouvert dans VS Code. Plus tard, un autre onglet affichera localhost. Ne collez jamais le code dans AI Academy.", expected: "Vous savez où lire, écrire et observer le résultat.", visual: { src: "/formation/site-web/lessons/01/propertymatch-final.png", alt: "Aperçu final de PropertyMatch avec hero, recherche et logements", caption: "Objectif final des douze leçons — ce n’est pas le résultat actuel du dossier vide.", width: 1536, height: 1024, placement: 5 } },
    ],
    checklist: ["VS Code et la version LTS de Node.js sont installés.", "VS Code a été fermé puis rouvert après l’installation.", "Le dossier parent mes-projets est ouvert dans VS Code.", "Aucun dossier propertymatch n’existe encore.", "Le terminal intégré est visible.", "node --version et npm --version affichent une version."],
    errors: [
      { problem: "node ou npm : command not found", cause: "Node.js manque ou VS Code était ouvert pendant son installation.", correction: "Installez la version LTS de Node.js, fermez complètement VS Code, rouvrez-le et relancez les commandes." },
      { problem: "Des fichiers d’un autre projet apparaissent", cause: "Le mauvais dossier est ouvert.", correction: "Fichier > Fermer le dossier, puis ouvrez Documents/mes-projets." },
    ],
    exercise: ["Fermez le panneau Terminal.", "Rouvrez-le avec Terminal > Nouveau terminal.", "Relancez npm --version et identifiez le résultat."],
    summary: ["Installer VS Code et Node.js depuis leurs sites officiels.", "Ouvrir un dossier parent précis dans VS Code.", "Repérer les douze zones principales de VS Code.", "Exécuter une commande et reconnaître sa fin.", "Distinguer commande, code, adresse web, AI Academy et PropertyMatch."],
  },
  {
    id: webLessonCatalog[1].id, slug: "02", number: "02", title: webLessonCatalog[1].title,
    build: "Créer la structure technique complète avec create-next-app puis lancer la page Next.js sur votre ordinateur.",
    visibleResult: "La page de départ Next.js est visible sur http://localhost:3000 ; le terminal indique Ready et l’Explorateur contient app, public et package.json.",
    prerequisites: ["La leçon 1 est validée.", "Node.js et npm affichent une version.", "Le dossier parent mes-projets est ouvert et ne contient pas encore propertymatch."],
    vocabulary: [
      { term: "Next.js", definition: "Le framework React qui organise les pages et le serveur local." },
      { term: "TypeScript", definition: "JavaScript enrichi de vérifications qui signalent davantage d’erreurs avant l’exécution." },
      { term: "Tailwind", definition: "L’outil de classes CSS utilisé à partir de la leçon 4." },
      { term: "App Router", definition: "L’organisation Next.js où les routes se trouvent dans app." },
      { term: "Dépendance", definition: "Un paquet installé par npm et déclaré dans package.json." },
      { term: "localhost", definition: "Une adresse qui désigne votre ordinateur, pas un site publié." },
    ],
    steps: [
      { title: "Vérifier le dossier parent", instruction: "Le terminal doit être ouvert dans mes-projets. Sur macOS, pwd affiche le chemin courant. Sur Windows PowerShell, Get-Location fait la même chose. Le chemin doit se terminer par mes-projets. S’il se termine déjà par propertymatch, utilisez cd .. une seule fois. N’écrivez pas le symbole % ou $ affiché avant la commande.", action: "Ouvrir", path: "Documents/mes-projets", commands: ["pwd"], expected: "Le chemin se termine par mes-projets et aucun sous-dossier propertymatch n’existe." },
      { title: "Créer le projet avec les options officielles", instruction: "Copiez la commande avec le bouton, cliquez dans le terminal après l’invite, collez-la puis appuyez sur Entrée. create-next-app crée mes-projets/propertymatch. Si des questions supplémentaires apparaissent : TypeScript Oui, ESLint Oui, Tailwind Oui, src Non, App Router Oui, Turbopack Oui, alias personnalisé Non et npm.", action: "Créer", path: "Documents/mes-projets/propertymatch", commands: ["npx create-next-app@latest propertymatch --ts --eslint --tailwind --app --use-npm --import-alias \"@/*\""], explanation: ["npx télécharge et exécute un package ponctuellement.", "--ts active TypeScript.", "--eslint et --tailwind installent qualité et design.", "--app active l’App Router.", "--use-npm utilise npm, installé avec Node.js.", "La commande doit être lancée dans mes-projets : sinon propertymatch/propertymatch peut être créé."], expected: "Le terminal annonce une création réussie et la structure devient mes-projets/propertymatch/." },
      { title: "Ouvrir et reconnaître l’arborescence", instruction: "Fichier > Ouvrir le dossier…, puis choisissez le nouveau propertymatch. Ouvrez app et public dans l’Explorateur. Cliquez sur package.json, app/page.tsx et app/globals.css pour les observer sans les modifier.", action: "Ouvrir", path: "Documents/propertymatch", explanation: ["app contient les pages.", "public accueillera les images locales.", "package.json décrit commandes et dépendances.", "app/page.tsx est l’accueil.", "app/globals.css porte les styles globaux."], expected: "Les cinq éléments sont visibles, sans dossier propertymatch imbriqué.", visual: { src: "/formation/site-web/lessons/02/nextjs-tree.svg", alt: "Explorateur VS Code montrant app, public, package.json, page.tsx et globals.css", caption: "Étape 3 — l’arborescence minimale après create-next-app.", width: 1200, height: 680, placement: 3 } },
      { title: "Lancer le serveur local", instruction: "Ouvrez un terminal dans le projet. Vérifiez qu’il se termine par propertymatch, lancez la commande et gardez ce terminal ouvert.", action: "Conserver", path: "Documents/propertymatch", commands: ["npm run dev"], expected: "Le terminal affiche Ready et Local: http://localhost:3000.", visual: { src: "/formation/site-web/lessons/02/dev-server.svg", alt: "Terminal affichant npm run dev, Ready et localhost 3000", caption: "Étape 4 — le terminal reste occupé pendant le fonctionnement du serveur.", width: 1200, height: 500, placement: 4 } },
      { title: "Ouvrir, arrêter puis relancer localhost", instruction: "Saisissez http://localhost:3000 dans le navigateur. Dans le terminal, appuyez ensuite sur Ctrl + C : la page ne répond plus. Relancez npm run dev et actualisez.", action: "Conserver", path: "http://localhost:3000", commands: ["npm run dev"], expected: "La page Next.js initiale réapparaît après le redémarrage.", visual: { src: "/formation/site-web/lessons/02/nextjs-start-page.svg", alt: "Page de départ Next.js dans un navigateur sur localhost 3000", caption: "Étape 5 — checkpoint technique avant l’interface PropertyMatch.", width: 1200, height: 700, placement: 5 } },
    ],
    checklist: ["Le terminal courant est le nouveau propertymatch.", "app, public et package.json existent.", "page.tsx et globals.css s’ouvrent.", "npm run dev affiche localhost:3000.", "La page Next.js initiale apparaît.", "Ctrl + C arrête le serveur et npm run dev le relance."],
    errors: [
      { problem: "Un dossier propertymatch existe déjà", cause: "Le dossier vide de préparation existe ou la commande a déjà tourné.", correction: "Ne retirez le dossier que s’il est réellement vide. Sinon, conservez le travail et inspectez son contenu." },
      { problem: "Could not find a package.json", cause: "npm run dev est lancé dans le mauvais dossier.", correction: "Ouvrez propertymatch ou utilisez cd propertymatch, puis relancez." },
      { problem: "Port 3000 is in use", cause: "Un autre serveur utilise le port.", correction: "Retrouvez son terminal, arrêtez-le avec Ctrl + C, puis relancez npm run dev." },
      { problem: "Module not found", cause: "Les dépendances manquent.", correction: "Dans le dossier de package.json, lancez npm install puis npm run dev." },
    ],
    exercise: ["Arrêtez le serveur avec Ctrl + C.", "Rouvrez app/page.tsx depuis l’Explorateur.", "Relancez npm run dev et vérifiez localhost:3000."],
    summary: ["Créer un projet Next.js avec les bonnes options.", "Reconnaître ses fichiers principaux.", "Lancer, arrêter et relancer le serveur local.", "Distinguer localhost:3000 du port 3100 de la référence du formateur."],
  },
  {
    id: webLessonCatalog[2].id, slug: "03", number: "03", title: webLessonCatalog[2].title,
    build: "Remplacer la page Next.js initiale par toutes les zones sémantiques de PropertyMatch, sans appliquer le design premium.",
    visibleResult: "Une page simple affiche header, navigation, hero, quatre critères visuels, indicateurs honnêtes, emplacements futurs et footer.",
    prerequisites: ["La leçon 2 est validée.", "propertymatch est ouvert dans VS Code.", "npm run dev et http://localhost:3000 fonctionnent."],
    vocabulary: [
      { term: "HTML", definition: "Le langage de balises qui décrit la structure d’une page." },
      { term: "JSX", definition: "La syntaxe React qui permet d’écrire une structure proche du HTML dans TypeScript." },
      { term: "Composant React", definition: "Une fonction qui retourne une partie d’interface ; HomePage représente ici l’accueil entier." },
      { term: "Balise sémantique", definition: "Une balise qui décrit son rôle : header, nav, main, section, form ou footer." },
      { term: "Structure", definition: "L’ordre et le rôle des contenus, indépendamment de leur apparence." },
      { term: "Design", definition: "L’apparence visuelle que Tailwind ajoutera à la leçon 4." },
    ],
    steps: [
      { title: "Ouvrir le fichier d’accueil", instruction: "Dans l’Explorateur, ouvrez app puis page.tsx. Vérifiez le chemin dans l’onglet. Sélectionnez tout avec Ctrl + A ou Cmd + A. Ne modifiez aucun autre fichier.", action: "Ouvrir", path: "app/page.tsx", expected: "Le contenu initial de page.tsx est sélectionné.", visual: { src: "/formation/site-web/lessons/03/page-file.svg", alt: "Explorateur VS Code avec app page.tsx sélectionné", caption: "Étape 1 — contrôlez le chemin avant de remplacer le fichier.", width: 1200, height: 620, placement: 1 } },
      { title: "Remplacer entièrement le contenu", instruction: "Supprimez le contenu sélectionné, copiez le bloc complet, collez-le dans app/page.tsx puis sauvegardez avec Ctrl + S ou Cmd + S. Ne conservez aucun import de la page de départ.", action: "Remplacer entièrement", path: "app/page.tsx", code: lessonThreePageCode, explanation: ["HomePage est le composant de l’accueil.", "header et nav portent l’identité et les destinations.", "main contient le contenu principal unique.", "Le formulaire affiche quatre critères mais type=button empêche de simuler une recherche.", "Les sections annoncent honnêtement les fonctions futures.", "footer rappelle que les locations sont fictives."], expected: "Next.js recompile automatiquement après la sauvegarde." },
      { title: "Observer le checkpoint réel", instruction: "Revenez sur localhost:3000. Actualisez si nécessaire. Le rendu est volontairement simple : aucune classe Tailwind ne reproduit encore le design.", action: "Conserver", path: "app/page.tsx", expected: "Toutes les zones apparaissent sans photo, carte, score ni favori fonctionnel.", visual: { src: "/formation/site-web/lessons/03/structure-checkpoint.png", alt: "Rendu réel non stylé de PropertyMatch après remplacement de page.tsx", caption: "Étape 3 — structure complète ; le design reste volontairement reporté.", width: 1200, height: 760, placement: 3 } },
      { title: "Relire la structure et tester le clavier", instruction: "Repérez header, nav, main, section, form et footer dans le fichier. Dans le navigateur, utilisez Tab : liens et champs reçoivent le focus.", action: "Conserver", path: "app/page.tsx", explanation: ["Il n’existe qu’un main.", "Chaque section importante possède un titre relié.", "Chaque champ a un label relié par htmlFor et id.", "Aucun chiffre commercial invérifiable n’est affiché."], expected: "La structure est lisible et les contrôles sont accessibles au clavier." },
    ],
    checklist: ["page.tsx est entièrement remplacé et sauvegardé.", "Le terminal ne montre aucune erreur.", "Le header et les quatre liens apparaissent.", "Le hero et les quatre critères apparaissent.", "Les indicateurs restent honnêtes.", "Aucune fonctionnalité des leçons 4 à 12 n’est ajoutée.", "Tab atteint liens et champs."],
    errors: [
      { problem: "JSX expressions must have one parent element", cause: "Le fragment <>…</> manque ou est mal fermé.", correction: "Recopiez le bloc complet et vérifiez les premières et dernières lignes du return." },
      { problem: "Expected corresponding JSX closing tag", cause: "Une balise manque après une copie partielle.", correction: "Annulez puis recollez le code complet sans retirer de ligne." },
      { problem: "La page initiale reste visible", cause: "Mauvais fichier, sauvegarde absente ou serveur arrêté.", correction: "Vérifiez app/page.tsx, sauvegardez et confirmez npm run dev." },
      { problem: "La page paraît peu élégante", cause: "Cette leçon construit la structure, pas le design.", correction: "N’ajoutez pas de style improvisé : Tailwind arrive à la leçon 4." },
    ],
    exercise: ["Remplacez l’accroche « Votre recherche de location, simplement » par « Des critères clairs, des résultats compréhensibles ».", "Sauvegardez et observez la mise à jour.", "Ne modifiez ni les balises ni le bouton non fonctionnel."],
    summary: ["Ouvrir et remplacer entièrement un fichier précis.", "Lire une structure JSX sémantique.", "Relier un label à un contrôle.", "Séparer structure et design."],
  },
] as const;

export const webFoundationLessons: readonly WebFoundationLesson[] = [
  ...firstThreeWebFoundationLessons,
  ...webLessonsFourToSix,
  ...webLessonsSevenToNine,
  ...webLessonsTenToTwelve,
];

export function getWebFoundationLessonBySlug(slug: string) {
  return webFoundationLessons.find((lesson) => lesson.slug === slug) ?? null;
}
