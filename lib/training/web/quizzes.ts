import { webLessonCatalog } from "../catalog.ts";

export type WebLessonId = (typeof webLessonCatalog)[number]["id"];
export type WebQuizQuestion = { id: string; prompt: string; choices: readonly string[] };
export type WebQuiz = { lessonId: WebLessonId; title: string; questions: readonly WebQuizQuestion[] };

const questionsByLesson: Record<WebLessonId, readonly WebQuizQuestion[]> = {
  "web-01-projet-vscode": [
    { id: "editor", prompt: "Quel outil sert à ouvrir et modifier les fichiers du projet ?", choices: ["Le navigateur", "VS Code", "Vercel"] },
    { id: "reference", prompt: "Quel est le projet fil rouge du module ?", choices: ["PropertyMatch", "Une boutique réelle", "Un réseau social"] },
    { id: "terminal", prompt: "À quoi sert le terminal dans ce projet ?", choices: ["Dessiner le logo", "Stocker les logements", "Exécuter des commandes"] },
    { id: "files", prompt: "À quel moment les fichiers Next.js sont-ils créés ?", choices: ["Manuellement dans la leçon 1", "Par create-next-app dans la leçon 2", "Après la publication"] },
  ],
  "web-02-nextjs": [
    { id: "framework", prompt: "Quel framework est utilisé pour PropertyMatch ?", choices: ["Next.js", "Django", "Laravel"] },
    { id: "dev", prompt: "Quelle commande lance le serveur de développement ?", choices: ["git status", "node --version", "npm run dev"] },
    { id: "localhost", prompt: "Que désigne localhost ?", choices: ["Une base distante", "Le site exécuté sur votre ordinateur", "Un paiement"] },
    { id: "stop", prompt: "Comment arrêter le serveur de développement ?", choices: ["Avec Ctrl + C dans son terminal", "En supprimant package.json", "En fermant uniquement le navigateur"] },
  ],
  "web-03-structure": [
    { id: "main", prompt: "Quelle balise contient le contenu principal unique ?", choices: ["<footer>", "<nav>", "<main>"] },
    { id: "jsx", prompt: "Quel attribut JSX remplace class ?", choices: ["cssClass", "className", "styleName"] },
    { id: "semantic", prompt: "Pourquoi utiliser des balises sémantiques ?", choices: ["Pour décrire clairement le rôle des zones", "Pour cacher le contenu", "Pour supprimer React"] },
    { id: "design", prompt: "Pourquoi le rendu de la leçon 3 reste-t-il simple ?", choices: ["Next.js interdit les couleurs", "Le formulaire est déjà terminé", "Le design Tailwind appartient à la leçon 4"] },
  ],
  "web-04-tailwind": [
    { id: "responsive", prompt: "Que signifie une interface responsive ?", choices: ["Elle utilise une base", "Elle s’adapte aux tailles d’écran", "Elle est uniquement mobile"] },
    { id: "spacing", prompt: "Quelle classe Tailwind ajoute un espace intérieur ?", choices: ["mx-auto", "grid-cols-3", "p-5"] },
    { id: "breakpoint", prompt: "Que représente le préfixe md: ?", choices: ["Un breakpoint de largeur", "Une couleur", "Un fichier Markdown"] },
    { id: "grid", prompt: "Quelle classe organise les quatre champs en colonnes sur grand écran ?", choices: ["text-white", "lg:grid-cols-4", "rounded-lg"] },
  ],
  "web-05-donnees": [
    { id: "type", prompt: "Pourquoi définir un type Property ?", choices: ["Pour vérifier la forme des logements", "Pour publier sur Vercel", "Pour créer un mot de passe"] },
    { id: "array", prompt: "Quelle structure regroupe plusieurs logements ?", choices: ["Une chaîne", "Un tableau", "Une couleur"] },
    { id: "local", prompt: "Où sont stockées les données du module ?", choices: ["Chez Stripe", "Dans Supabase", "Dans des fichiers locaux typés"] },
    { id: "length", prompt: "Que renvoie properties.length avec trois logements ?", choices: ["Le nombre 3", "Le loyer total", "Le premier logement"] },
  ],
  "web-06-composants": [
    { id: "component", prompt: "Qu’est-ce qu’un composant React ?", choices: ["Une URL externe", "Une table SQL", "Un bloc d’interface réutilisable"] },
    { id: "export", prompt: "Que permet export default dans un fichier de composant ?", choices: ["De rendre le composant importable", "De publier le site", "De créer une base"] },
    { id: "responsibility", prompt: "Pourquoi séparer Header, Hero et Footer ?", choices: ["Pour changer les données", "Pour donner un rôle clair à chaque fichier", "Pour activer la recherche"] },
    { id: "result", prompt: "Que doit changer visuellement après ce découpage ?", choices: ["Tout le design", "Le nombre de logements", "Rien : le rendu reste identique"] },
  ],
  "web-07-cartes": [
    { id: "map", prompt: "Quelle méthode transforme les logements en cartes ?", choices: ["filter", "sort", "map"] },
    { id: "key", prompt: "Quelle propriété React identifie chaque carte dans une liste ?", choices: ["key", "label", "method"] },
    { id: "image", prompt: "Quel composant Next.js affiche les images locales optimisées ?", choices: ["Link", "Image", "Script"] },
    { id: "selection", prompt: "Que fait properties.slice(0, 3) ?", choices: ["Sélectionne les trois premiers sans modifier le tableau", "Supprime douze logements", "Crée trois cartes à lui seul"] },
  ],
  "web-08-recherche": [
    { id: "url", prompt: "Pourquoi conserver les filtres dans l’URL ?", choices: ["Pour les rendre partageables et relisibles", "Pour calculer du CSS", "Pour remplacer les données"] },
    { id: "validation", prompt: "Comment traiter un paramètre d’URL reçu ?", choices: ["Comme toujours valide", "L’exécuter", "Le valider avant usage"] },
    { id: "filter", prompt: "Quelle fonction garde uniquement les logements correspondants ?", choices: ["map", "filter", "join"] },
    { id: "get", prompt: "Que produit un formulaire utilisant la méthode GET ?", choices: ["Une écriture en base", "Un score aléatoire", "Des paramètres visibles dans l’URL"] },
  ],
  "web-09-matching": [
    { id: "pure", prompt: "Une fonction de score pédagogique doit être…", choices: ["Aléatoire", "Déterministe", "Secrète pour l’utilisateur"] },
    { id: "range", prompt: "Dans quelles bornes reste le score ?", choices: ["-100 à 1000", "1 à l’infini", "0 à 100"] },
    { id: "explain", prompt: "Pourquoi expliquer le score ?", choices: ["Pour rendre le résultat compréhensible", "Pour ajouter une animation", "Pour cacher la formule"] },
    { id: "empty", prompt: "Que faut-il afficher sans préférence active ?", choices: ["100 %", "Une erreur serveur", "Ajoutez des critères pour obtenir un score"] },
  ],
  "web-10-fiches": [
    { id: "route", prompt: "Quelle route représente une fiche dynamique ?", choices: ["/api/stripe", "/biens/[slug]", "/globals.css"] },
    { id: "slug", prompt: "À quoi sert le slug ?", choices: ["Identifier un logement dans l’URL", "Calculer le loyer", "Styliser le header"] },
    { id: "missing", prompt: "Que faire pour un slug inconnu ?", choices: ["Afficher un autre bien", "Valider la leçon", "Retourner une page introuvable"] },
    { id: "return", prompt: "Comment préserver les filtres lors du retour ?", choices: ["Avec les paramètres validés de l’URL", "Avec localStorage", "En recopiant la page"] },
  ],
  "web-11-favoris": [
    { id: "storage", prompt: "Où sont conservés les favoris du module ?", choices: ["Dans Stripe", "Dans une base distante", "Dans localStorage"] },
    { id: "content", prompt: "Que faut-il enregistrer pour un favori ?", choices: ["Toute la page HTML", "Le slug unique", "Le compte utilisateur"] },
    { id: "accessible", prompt: "Quel attribut expose l’état d’un bouton favori ?", choices: ["aria-pressed", "href", "alt"] },
    { id: "key", prompt: "Quelle clé versionnée stocke les favoris ?", choices: ["favorites", "propertymatch:favorites:v1", "user:favorites"] },
  ],
  "web-12-publication": [
    { id: "quality", prompt: "Que faut-il lancer avant publication ?", choices: ["Tests, TypeScript, lint et build", "Uniquement le navigateur", "Une migration distante"] },
    { id: "cli", prompt: "Quelle commande prépare une publication Vercel depuis le terminal ?", choices: ["git push", "npm database", "npx vercel"] },
    { id: "vercel", prompt: "Quel service est utilisé dans cette leçon pour publier ?", choices: ["Supabase", "Vercel", "Stripe"] },
    { id: "production", prompt: "Que faut-il faire après la publication ?", choices: ["Supprimer les tests", "Retester les parcours sur l’URL publique", "Ajouter un compte obligatoire"] },
  ],
};

export const webQuizzes: readonly WebQuiz[] = webLessonCatalog.map((lesson) => ({
  lessonId: lesson.id,
  title: lesson.title,
  questions: questionsByLesson[lesson.id],
}));

export function getWebQuiz(lessonId: unknown) {
  return webQuizzes.find((quiz) => quiz.lessonId === lessonId) ?? null;
}
