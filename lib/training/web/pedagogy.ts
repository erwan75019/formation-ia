export const webLessonPedagogyStandard = [
  "objectif et résultat visible",
  "prérequis expliqués",
  "vocabulaire simple",
  "fichier et type de modification",
  "petits blocs de code progressifs",
  "explication des instructions nouvelles",
  "visuel utile avec alternative et légende",
  "ce que vous devez voir",
  "vérification guidée",
  "erreur fréquente, cause et correction",
  "mini-exercice",
  "récapitulatif",
  "QCM sécurisé",
] as const;

export type LessonVocabulary = {
  term: string;
  definition: string;
};

export type LessonFileInstruction = {
  path: string;
  action: "observer" | "conserver et ajouter" | "remplacer une zone précise";
  instruction: string;
};

export type LessonPedagogyVisual = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  placement: "before-steps" | "after-steps" | number;
};
