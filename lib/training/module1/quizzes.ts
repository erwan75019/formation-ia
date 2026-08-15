import { moduleLessonIds } from "@/lib/training/catalog";

export const module1LessonIds = moduleLessonIds[1];

export type Module1LessonId = (typeof module1LessonIds)[number];

type PublicQuestion = {
  question: string;
  choices: readonly string[];
};

type PublicQuiz = {
  lessonId: Module1LessonId;
  title: string;
  questions: readonly PublicQuestion[];
};

export const module1Quizzes = {
  "01": {
    lessonId: "chatgpt-01-intro",
    title: "Qu'est-ce que ChatGPT ?",
    questions: [
      {
        question: "Qu'est-ce que ChatGPT ?",
        choices: [
          "Un moteur de recherche classique",
          "Un assistant basé sur l'intelligence artificielle",
          "Un réseau social",
          "Un logiciel de montage vidéo",
        ],
      },
      {
        question: "ChatGPT peut-il parfois donner une réponse incorrecte ?",
        choices: [
          "Non, jamais",
          "Uniquement avec un compte gratuit",
          "Oui, il peut se tromper",
          "Uniquement lorsqu'on écrit en français",
        ],
      },
      {
        question: "Quelle utilisation correspond bien à ChatGPT ?",
        choices: [
          "Lui demander d'expliquer un concept",
          "Lui confier automatiquement toutes ses décisions importantes",
          "Considérer toutes ses réponses comme forcément vraies",
          "L'utiliser uniquement pour traduire des mots",
        ],
      },
    ],
  },
  "02": {
    lessonId: "chatgpt-02-interface",
    title: "Découvrir l'interface",
    questions: [
      {
        question: "Pourquoi créer une nouvelle conversation dans ChatGPT ?",
        choices: [
          "Pour changer son mot de passe",
          "Pour commencer un nouveau sujet dans un contexte séparé",
          "Pour supprimer son compte",
          "Pour rendre automatiquement ChatGPT plus intelligent",
        ],
      },
      {
        question: "À quoi sert principalement la zone de saisie ?",
        choices: [
          "À écrire vos demandes à ChatGPT",
          "À modifier votre adresse email",
          "À installer ChatGPT",
          "À consulter uniquement l'historique",
        ],
      },
      {
        question: "Pourquoi l'historique des conversations peut-il être utile ?",
        choices: [
          "Il augmente automatiquement la vitesse d'Internet",
          "Il permet de retrouver certaines conversations",
          "Il garantit que toutes les réponses sont exactes",
          "Il remplace votre mot de passe",
        ],
      },
    ],
  },
  "03": {
    lessonId: "chatgpt-03-prompt",
    title: "Écrire son premier prompt",
    questions: [
      {
        question:
          "Quel prompt permettra probablement d'obtenir la réponse la plus précise ?",
        choices: [
          "Fais-moi un programme.",
          "Crée un programme de sport.",
          "Crée un programme de musculation pour un débutant, 3 séances par semaine de 45 minutes, avec uniquement des haltères. Présente le résultat sous forme de tableau.",
          "Donne-moi des exercices.",
        ],
      },
      {
        question: "Qu'est-ce qu'un prompt ?",
        choices: [
          "Une instruction ou une demande envoyée à l'IA",
          "Le mot de passe de votre compte",
          "Une erreur produite par ChatGPT",
          "Un type d'abonnement",
        ],
      },
      {
        question: "Un bon prompt doit généralement être...",
        choices: [
          "Le plus vague possible",
          "Clair et suffisamment précis",
          "Obligatoirement très long",
          "Écrit uniquement en anglais",
        ],
      },
    ],
  },
  "04": {
    lessonId: "chatgpt-04-contexte",
    title: "Donner du contexte",
    questions: [
      {
        question: "Pourquoi donner du contexte à ChatGPT ?",
        choices: [
          "Pour rendre le prompt plus long",
          "Pour l'aider à mieux comprendre votre situation",
          "Pour garantir une réponse toujours vraie",
          "Pour changer l'interface",
        ],
      },
      {
        question: "Quel prompt fournit le meilleur contexte ?",
        choices: [
          "Explique Python.",
          "Parle-moi de programmation.",
          "Je débute totalement en programmation. Explique-moi les variables Python avec un exemple très simple.",
          "Python ?",
        ],
      },
      {
        question:
          "Quelle information peut être utile comme contexte pour demander un programme d'apprentissage ?",
        choices: [
          "Votre niveau actuel",
          "La couleur de votre téléphone",
          "Le niveau de batterie de votre ordinateur",
          "Aucune information",
        ],
      },
    ],
  },
  "05": {
    lessonId: "chatgpt-05-format",
    title: "Demander un format précis",
    questions: [
      {
        question: "Que signifie préciser le format attendu ?",
        choices: [
          "Choisir la couleur de ChatGPT",
          "Indiquer comment la réponse doit être présentée",
          "Changer son mot de passe",
          "Écrire obligatoirement 100 mots",
        ],
      },
      {
        question:
          "Quelle instruction demande explicitement un format particulier ?",
        choices: [
          "Explique-moi ce sujet.",
          "Parle-moi de ce sujet.",
          "Résume ce sujet.",
          "Présente les avantages et inconvénients dans un tableau à deux colonnes.",
        ],
      },
      {
        question:
          "Quel format peut être pratique pour obtenir une suite d'étapes à effectuer ?",
        choices: [
          "Une liste numérotée",
          "Une phrase sans ponctuation",
          "Un texte volontairement désorganisé",
          "Aucun format",
        ],
      },
    ],
  },
} as const satisfies Record<string, PublicQuiz>;

export function isModule1LessonId(value: unknown): value is Module1LessonId {
  return (
    typeof value === "string" &&
    module1LessonIds.includes(value as Module1LessonId)
  );
}

export function getModule1QuizByLessonId(lessonId: Module1LessonId) {
  return Object.values(module1Quizzes).find(
    (quiz) => quiz.lessonId === lessonId
  );
}
