export const launchCraftQuizzes = [{
  lessonId: "api-01-intro",
  title: "Structurer l’application LaunchCraft",
  validation: "objective_quiz" as const,
  questions: [
    {
      question: "Quel fichier enveloppe toutes les pages de l’application avec la structure HTML globale ?",
      choices: ["components/Sidebar.tsx", "app/layout.tsx", "app/page.tsx"],
    },
    {
      question: "Pourquoi séparer AppShell, Sidebar et MobileHeader ?",
      choices: [
        "Pour obtenir automatiquement une base Supabase",
        "Pour publier l’application sans test",
        "Pour donner une responsabilité claire à chaque composant",
      ],
    },
    {
      question: "Quel résultat doit produire la route racine / dans cette première version ?",
      choices: [
        "Rediriger vers /dashboard",
        "Créer un compte utilisateur",
        "Enregistrer un projet en base",
      ],
    },
    {
      question: "À quoi sert le breakpoint md: utilisé dans les classes Tailwind ?",
      choices: [
        "À changer le contenu de la base de données",
        "À adapter l’interface à partir d’une largeur d’écran",
        "À rendre une clé secrète publique",
      ],
    },
  ],
}, {
  lessonId: "api-02-http",
  title: "Modéliser et sécuriser les données LaunchCraft",
  validation: "objective_quiz" as const,
  questions: [
    {
      question: "Pourquoi LaunchCraft utilise-t-il un projet Supabase séparé d’AI Academy ?",
      choices: [
        "Pour éviter d’écrire des types TypeScript",
        "Pour supprimer les contrôles d’accès",
        "Pour isoler totalement les comptes et données des deux applications",
      ],
    },
    {
      question: "Quel lien rattache un objectif au bon projet et au bon propriétaire ?",
      choices: [
        "La relation composée avec user_id et project_id",
        "La couleur du projet",
        "Le titre de l’objectif uniquement",
      ],
    },
    {
      question: "À quoi sert principalement la Row Level Security ?",
      choices: [
        "À dessiner le dashboard",
        "À limiter les lignes accessibles selon l’utilisateur authentifié",
        "À installer Next.js",
      ],
    },
    {
      question: "Pourquoi vérifier que due_date est postérieure ou égale à start_date ?",
      choices: [
        "Pour empêcher une période de projet incohérente",
        "Pour créer automatiquement un utilisateur",
        "Pour changer le statut en completed",
      ],
    },
  ],
}, {
  lessonId: "api-03-requests",
  title: "Authentifier et protéger LaunchCraft",
  validation: "objective_quiz" as const,
  questions: [
    {
      question: "Quelle méthode doit confirmer l’identité dans un composant serveur protégé ?",
      choices: ["Lire localStorage", "Appeler supabase.auth.getUser()", "Faire confiance à un paramètre d’URL"],
    },
    {
      question: "Quelle clé ne doit jamais être placée dans une variable NEXT_PUBLIC_ ?",
      choices: ["La clé publique publishable/anon", "L’URL publique du projet", "La clé service_role"],
    },
    {
      question: "Pourquoi le client Supabase serveur transmet-il les cookies avec getAll et setAll ?",
      choices: ["Pour conserver et rafraîchir la session entre les requêtes", "Pour désactiver RLS", "Pour stocker le mot de passe"],
    },
    {
      question: "Comment le profil LaunchCraft est-il créé après une inscription ?",
      choices: ["Le navigateur choisit directement son user_id", "Le trigger sécurisé de la migration insère le profil lié à auth.users", "La clé service_role est envoyée au formulaire"],
    },
  ],
}, {
  lessonId: "api-04-status",
  title: "Créer et gérer ses projets LaunchCraft",
  validation: "objective_quiz" as const,
  questions: [
    {
      question: "D’où doit provenir le user_id enregistré lors de la création d’un projet ?",
      choices: ["D’un champ caché du formulaire", "D’un paramètre d’URL", "De l’utilisateur vérifié côté serveur"],
    },
    {
      question: "Quels filtres doivent accompagner une modification ou une suppression ?",
      choices: ["id du projet et user_id authentifié", "titre et couleur du projet", "slug uniquement"],
    },
    {
      question: "Pourquoi utiliser une Server Action pour le formulaire de projet ?",
      choices: ["Pour désactiver automatiquement RLS", "Pour valider et muter les données côté serveur sans API publique inutile", "Pour envoyer les cookies au navigateur"],
    },
    {
      question: "Quel est le rôle de RLS si la requête filtre déjà avec user_id ?",
      choices: ["Remplacer la vérification de session", "Afficher les cartes de projet", "Ajouter une seconde barrière directement dans PostgreSQL"],
    },
  ],
}, {
  lessonId: "api-05-keys-env",
  title: "Créer et valider les objectifs d’un projet",
  validation: "objective_quiz" as const,
  questions: [
    {
      question: "Pourquoi vérifier le projet parent avant de créer un objectif ?",
      choices: ["Pour calculer une couleur", "Pour empêcher de rattacher l’objectif au projet d’un autre compte", "Pour désactiver RLS"],
    },
    {
      question: "D’où doit provenir le project_id utilisé par une Server Action d’objectif ?",
      choices: ["D’un argument lié côté serveur après vérification", "D’un champ modifiable nommé project_id", "Du localStorage"],
    },
    {
      question: "Comment calculer la progression lorsqu’un projet n’a aucun objectif ?",
      choices: ["Afficher 100 %", "Utiliser une valeur aléatoire", "Afficher 0 %"],
    },
    {
      question: "Quels filtres protègent la modification d’un objectif ?",
      choices: ["Son titre uniquement", "id, project_id attendu et user_id authentifié", "La date cible uniquement"],
    },
  ],
}, {
  lessonId: "api-06-ai-call",
  title: "Créer et piloter les tâches LaunchCraft",
  validation: "objective_quiz" as const,
  questions: [
    {
      question: "Que doit vérifier le serveur avant de rattacher une tâche à un objectif ?",
      choices: ["Seulement le titre", "Que l’objectif appartient au même projet et au même utilisateur", "Seulement la priorité"],
    },
    {
      question: "D’où provient le user_id enregistré sur une tâche ?",
      choices: ["De la session vérifiée côté serveur", "D’un champ caché", "Du localStorage"],
    },
    {
      question: "Quand une tâche est-elle en retard ?",
      choices: ["Dès qu’elle est créée", "Quand sa priorité est faible", "Quand elle n’est pas terminée et que son échéance est passée"],
    },
    {
      question: "Quels filtres protègent une mutation de tâche ?",
      choices: ["task.id, project_id attendu et user_id authentifié", "description uniquement", "objective_id uniquement"],
    },
  ],
}, {
  lessonId: "api-07-project",
  title: "Construire le dashboard réel de LaunchCraft",
  validation: "objective_quiz" as const,
  questions: [
    { question: "D’où doivent provenir les chiffres du dashboard ?", choices: ["De constantes écrites dans JSX", "Des lignes Supabase du compte connecté", "Du localStorage"] },
    { question: "Quelle progression afficher lorsqu’aucun objectif n’existe ?", choices: ["0 %", "50 %", "100 %"] },
    { question: "Quelles tâches entrent dans les prochaines échéances ?", choices: ["Toutes les tâches terminées", "Les tâches non terminées avec une date future, triées", "Les tâches sans date uniquement"] },
    { question: "Pourquoi exécuter trois lectures globales plutôt qu’une requête par projet ?", choices: ["Pour désactiver RLS", "Pour exposer user_id", "Pour éviter un enchaînement N+1 inutile"] },
  ],
}, {
  lessonId: "api-08-calendar",
  title: "Construire le calendrier sécurisé de LaunchCraft",
  validation: "objective_quiz" as const,
  questions: [
    { question: "Pourquoi conserver une échéance SQL sous la forme YYYY-MM-DD ?", choices: ["Pour rendre RLS inutile", "Pour préserver le jour civil sans décalage UTC", "Pour stocker une heure secrète"] },
    { question: "Que doit gérer le helper de navigation mensuelle ?", choices: ["La création d’un compte", "Le calcul du score QCM", "Le passage de décembre à janvier et de janvier à décembre"] },
    { question: "Comment isoler les données affichées dans le calendrier ?", choices: ["Filtrer projets, objectifs et tâches avec le user.id vérifié", "Accepter user_id depuis l’URL", "Masquer les titres avec CSS"] },
    { question: "Quand une échéance est-elle en retard ?", choices: ["Dès qu’elle possède une priorité", "Lorsqu’elle n’est pas terminée et précède aujourd’hui", "Uniquement lorsqu’elle est terminée"] },
  ],
}, {
  lessonId: "api-09-security",
  title: "Sécuriser et vérifier LaunchCraft de bout en bout",
  validation: "objective_quiz" as const,
  questions: [
    { question: "Quelle vérification protège réellement une page privée côté serveur ?", choices: ["Masquer son lien dans la sidebar", "Lire un booléen dans localStorage", "Confirmer la session avec supabase.auth.getUser()"] },
    { question: "Pourquoi conserver les filtres id et user_id même lorsque RLS est active ?", choices: ["Ils expriment la propriété attendue et RLS ajoute une seconde barrière", "Ils rendent service_role public", "Ils remplacent la validation des UUID"] },
    { question: "Quel test démontre le mieux l’isolation des comptes ?", choices: ["Changer uniquement la couleur d’une carte", "Faire créer une donnée à A puis tenter de la lire et muter avec B", "Tester deux fois avec le même compte"] },
    { question: "Que doit afficher l’application après une erreur Supabase interne ?", choices: ["L’objet d’erreur complet", "Les cookies de la requête", "Un message neutre et compréhensible sans détail sensible"] },
  ],
}] as const;

export const launchCraftLessonOneQuiz = launchCraftQuizzes[0];
export const launchCraftLessonTwoQuiz = launchCraftQuizzes[1];
export const launchCraftLessonThreeQuiz = launchCraftQuizzes[2];
export const launchCraftLessonFourQuiz = launchCraftQuizzes[3];
export const launchCraftLessonFiveQuiz = launchCraftQuizzes[4];
export const launchCraftLessonSixQuiz = launchCraftQuizzes[5];
export const launchCraftLessonSevenQuiz = launchCraftQuizzes[6];
export const launchCraftLessonEightQuiz = launchCraftQuizzes[7];
export const launchCraftLessonNineQuiz = launchCraftQuizzes[8];

export function getLaunchCraftQuiz(lessonId: unknown) {
  return launchCraftQuizzes.find((quiz) => quiz.lessonId === lessonId) ?? null;
}
