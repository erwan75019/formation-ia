import {
  getModule1QuizByLessonId,
  isModule1LessonId,
} from "@/lib/training/module1/quizzes";
import {
  planLessonIds,
  type FundamentalsLessonId,
} from "@/lib/training/catalog";

export type { FundamentalsLessonId } from "@/lib/training/catalog";

export type SecureQuizValidation = "objective_quiz" | "project_pending";

export type SecureQuiz = {
  lessonId: string;
  family: "prompts" | "quotidien" | "fichiers" | "automation";
  slug: string;
  title: string;
  validation: SecureQuizValidation;
  questions: readonly { question: string; choices: readonly string[] }[];
};

export const modules2To5Quizzes = {
  "prompts-01": {
    "lessonId": "prompts-01-structure",
    "family": "prompts",
    "slug": "01",
    "title": "La structure d’un bon prompt",
    "validation": "objective_quiz",
    "questions": [
      {
        "question": "Quels éléments rendent généralement un prompt plus précis ?",
        "choices": [
          "Objectif, contexte, contraintes et format",
          "Uniquement beaucoup de mots",
          "Un texte très compliqué",
          "Des majuscules partout"
        ]
      },
      {
        "question": "Quel élément indique ce que l’utilisateur cherche réellement à obtenir ?",
        "choices": [
          "Le contexte",
          "L’objectif",
          "La ponctuation",
          "La longueur du prompt"
        ]
      },
      {
        "question": "Pourquoi préciser des contraintes dans un prompt ?",
        "choices": [
          "Pour guider la réponse selon certaines limites ou règles",
          "Pour empêcher ChatGPT de répondre",
          "Pour rendre systématiquement la réponse plus longue",
          "Pour modifier le modèle utilisé"
        ]
      }
    ]
  },
  "prompts-02": {
    "lessonId": "prompts-02-role",
    "family": "prompts",
    "slug": "02",
    "title": "Attribuer un rôle à l’IA",
    "validation": "objective_quiz",
    "questions": [
      {
        "question": "Pourquoi peut-on attribuer un rôle à l’IA dans un prompt ?",
        "choices": [
          "Pour orienter la manière dont elle répond",
          "Pour changer son mot de passe",
          "Pour lui donner accès à Internet automatiquement",
          "Pour garantir qu’elle ne se trompera jamais"
        ]
      },
      {
        "question": "Quel exemple utilise correctement un rôle ?",
        "choices": [
          "Agis comme un professeur de Python et explique les fonctions à un débutant.",
          "Écris quelque chose.",
          "Réponds vite.",
          "Fais mieux."
        ]
      },
      {
        "question": "Un rôle doit-il forcément correspondre à une vraie profession ?",
        "choices": [
          "Oui, obligatoirement",
          "Non, il peut simplement définir une manière de répondre",
          "Oui, sinon ChatGPT refuse",
          "Seulement avec un abonnement payant"
        ]
      }
    ]
  },
  "prompts-03": {
    "lessonId": "prompts-03-templates",
    "family": "prompts",
    "slug": "03",
    "title": "Créer des prompts réutilisables",
    "validation": "objective_quiz",
    "questions": [
      {
        "question": "Quel est l’intérêt principal d’un template de prompt ?",
        "choices": [
          "Pouvoir réutiliser une structure efficace",
          "Éviter complètement de réfléchir",
          "Obtenir toujours exactement la même réponse",
          "Supprimer les limites de ChatGPT"
        ]
      },
      {
        "question": "Quel exemple ressemble le plus à un template réutilisable ?",
        "choices": [
          "Résume ce texte.",
          "Analyse [DOCUMENT] et produis un résumé de [LONGUEUR] destiné à [PUBLIC].",
          "Bonjour.",
          "Fais quelque chose avec ça."
        ]
      },
      {
        "question": "Dans un template, à quoi servent des éléments comme [SUJET] ou [PUBLIC] ?",
        "choices": [
          "À représenter des informations variables",
          "À lancer automatiquement du code",
          "À créer un compte utilisateur",
          "À chiffrer le prompt"
        ]
      }
    ]
  },
  "prompts-04": {
    "lessonId": "prompts-04-iteration",
    "family": "prompts",
    "slug": "04",
    "title": "Améliorer une réponse",
    "validation": "objective_quiz",
    "questions": [
      {
        "question": "Que signifie itérer avec ChatGPT ?",
        "choices": [
          "Améliorer progressivement la réponse avec de nouvelles instructions",
          "Créer un nouveau compte à chaque réponse",
          "Poser exactement la même question sans changement",
          "Supprimer automatiquement la conversation"
        ]
      },
      {
        "question": "Quelle instruction est un bon exemple d’itération ?",
        "choices": [
          "Réécris cette réponse en plus court et ajoute un exemple concret.",
          "Bonjour.",
          "Supprime tout.",
          "N’importe quoi."
        ]
      },
      {
        "question": "Pourquoi itérer plutôt que recommencer systématiquement une nouvelle conversation ?",
        "choices": [
          "Parce que l’IA peut utiliser le contexte déjà présent dans la conversation",
          "Parce que cela augmente la vitesse d’Internet",
          "Parce que ChatGPT interdit les nouvelles conversations",
          "Parce que le prompt devient automatiquement privé"
        ]
      }
    ]
  },
  "prompts-05": {
    "lessonId": "prompts-05-project",
    "family": "prompts",
    "slug": "05",
    "title": "Projet pratique",
    "validation": "project_pending",
    "questions": [
      {
        "question": "Vous voulez que ChatGPT prépare un plan d’apprentissage personnalisé. Quelle approche est la meilleure ?",
        "choices": [
          "Donner votre niveau, votre objectif, votre temps disponible et demander un format précis",
          "Écrire seulement : Apprends-moi quelque chose",
          "Donner uniquement votre prénom",
          "Demander une réponse sans contexte"
        ]
      },
      {
        "question": "Si la première réponse n’est pas assez détaillée, que devriez-vous faire ?",
        "choices": [
          "Demander une amélioration précise",
          "Abandonner immédiatement",
          "Créer obligatoirement un nouveau compte",
          "Considérer que ChatGPT ne peut pas faire mieux"
        ]
      },
      {
        "question": "Quelle combinaison correspond le mieux aux méthodes vues dans ce module ?",
        "choices": [
          "Objectif + contexte + rôle + contraintes + format + itération",
          "Prompt vague + aucune précision",
          "Uniquement un rôle",
          "Uniquement un format"
        ]
      }
    ]
  },
  "quotidien-01": {
    "lessonId": "quotidien-01-travail",
    "family": "quotidien",
    "slug": "01",
    "title": "Transformer une tâche en workflow IA",
    "validation": "objective_quiz",
    "questions": [
      {
        "question": "Vous recevez des notes de réunion désordonnées. Quelle première étape est la plus solide ?",
        "choices": [
          "Demander immédiatement un compte rendu final",
          "Classer d’abord les informations en décisions, actions, responsables, échéances et éléments inconnus",
          "Réécrire toutes les notes avec un ton plus professionnel",
          "Demander à l’IA de compléter les éléments qui manquent"
        ]
      },
      {
        "question": "Une tâche mentionne qu’un document doit être validé, mais aucun responsable n’est indiqué. Que doit faire le workflow ?",
        "choices": [
          "Choisir la personne la plus probable",
          "Supprimer cette information",
          "Indiquer que le responsable reste à définir",
          "Attribuer automatiquement la responsabilité au manager"
        ]
      },
      {
        "question": "Pourquoi ajouter une étape de contrôle après la génération du livrable ?",
        "choices": [
          "Pour rallonger le workflow",
          "Pour vérifier les éléments sensibles comme noms, dates, montants et échéances",
          "Pour obliger l’IA à réécrire tout le résultat",
          "Pour remplacer toutes les informations initiales"
        ]
      },
      {
        "question": "Quel workflow est le plus professionnel ?",
        "choices": [
          "Informations brutes → résultat final",
          "Informations brutes → classification → transformation → contrôle → livrable",
          "Informations brutes → reformulation → publication",
          "Informations brutes → résumé → suppression des détails"
        ]
      }
    ]
  },
  "quotidien-02": {
    "lessonId": "quotidien-02-etudes",
    "family": "quotidien",
    "slug": "02",
    "title": "Apprendre et travailler avec l’IA",
    "validation": "objective_quiz",
    "questions": [
      {
        "question": "Quelle approche développe le mieux une vraie compréhension ?",
        "choices": [
          "Lire plusieurs explications sans répondre à aucune question",
          "Demander une explication puis copier les exemples",
          "Recevoir une explication, répondre à des questions, résoudre un exercice puis analyser ses erreurs",
          "Demander directement la correction de chaque exercice"
        ]
      },
      {
        "question": "Vous réussissez facilement trois exercices consécutifs. Quelle suite est la plus pertinente ?",
        "choices": [
          "Recommencer exactement les mêmes exercices",
          "Augmenter progressivement la difficulté",
          "Arrêter immédiatement la séance",
          "Demander toutes les réponses du chapitre"
        ]
      },
      {
        "question": "Quel comportement de l’IA est le plus utile pendant un exercice ?",
        "choices": [
          "Donner immédiatement la solution complète",
          "Attendre la réponse de l’apprenant avant de corriger",
          "Ignorer les erreurs commises",
          "Changer de sujet dès qu’une erreur apparaît"
        ]
      },
      {
        "question": "Pourquoi utiliser les erreurs précédentes pour créer la révision finale ?",
        "choices": [
          "Parce qu’elles indiquent les points qui nécessitent encore du travail",
          "Parce qu’elles rendent la séance plus longue",
          "Parce que toutes les erreurs doivent être mémorisées",
          "Parce que l’IA ne peut pas créer de nouvelles questions"
        ]
      }
    ]
  },
  "quotidien-03": {
    "lessonId": "quotidien-03-recherche",
    "family": "quotidien",
    "slug": "03",
    "title": "Rechercher, analyser et vérifier",
    "validation": "objective_quiz",
    "questions": [
      {
        "question": "Vous comparez plusieurs ordinateurs. Lequel de ces critères doit être traité comme éliminatoire si le budget maximum est de 1 600 € ?",
        "choices": [
          "La couleur",
          "Le poids préféré",
          "Un prix de 1 850 €",
          "La taille du trackpad"
        ]
      },
      {
        "question": "Pourquoi faut-il vérifier la configuration exacte d’un modèle d’ordinateur ?",
        "choices": [
          "Parce qu’un même nom commercial peut correspondre à plusieurs configurations différentes",
          "Parce que tous les ordinateurs ont les mêmes composants",
          "Parce que le nom du modèle change chaque jour",
          "Parce que la configuration n’influence jamais le prix"
        ]
      },
      {
        "question": "Quelle information doit être revérifiée juste avant un achat ?",
        "choices": [
          "La définition de la RAM",
          "Le principe général d’un SSD",
          "Le prix et la disponibilité du produit",
          "Le rôle d’un processeur"
        ]
      },
      {
        "question": "Une recommandation finale est solide lorsqu’elle…",
        "choices": [
          "choisit automatiquement l’option la plus chère",
          "présente seulement le produit préféré par l’IA",
          "explique pourquoi une option respecte mieux les contraintes et priorités définies",
          "ignore les compromis entre les options"
        ]
      }
    ]
  },
  "quotidien-04": {
    "lessonId": "quotidien-04-documents",
    "family": "quotidien",
    "slug": "04",
    "title": "Exploiter des documents avec l’IA",
    "validation": "objective_quiz",
    "questions": [
      {
        "question": "Vous analysez un contrat. Quelle consigne réduit le mieux le risque d’ajouter des informations extérieures ?",
        "choices": [
          "Analyse uniquement le document fourni et signale toute information absente",
          "Complète les clauses qui semblent manquer",
          "Utilise tes connaissances générales pour compléter le contrat",
          "Imagine ce que le fournisseur voulait probablement dire"
        ]
      },
      {
        "question": "Pourquoi conserver la page ou la section associée à une information extraite ?",
        "choices": [
          "Pour rendre le tableau plus long",
          "Pour pouvoir retrouver et vérifier rapidement l’information dans le document",
          "Pour augmenter automatiquement la précision du modèle",
          "Pour éviter complètement toute erreur"
        ]
      },
      {
        "question": "Le contrat ne précise rien concernant des frais de résiliation anticipée. Quelle sortie est la plus correcte ?",
        "choices": [
          "Frais probablement inexistants",
          "Frais à estimer",
          "Information non trouvée dans le document",
          "Frais standards du secteur"
        ]
      },
      {
        "question": "Quel livrable est le plus adapté à une analyse documentaire orientée décision ?",
        "choices": [
          "Un long résumé narratif sans référence",
          "Un tableau avec information, page ou section et point d’attention",
          "Une copie complète du document",
          "Une liste de toutes les phrases du contrat"
        ]
      }
    ]
  },
  "quotidien-05": {
    "lessonId": "quotidien-05-mission",
    "family": "quotidien",
    "slug": "05",
    "title": "Projet · Construire un workflow IA",
    "validation": "project_pending",
    "questions": [
      {
        "question": "Votre directrice demande d’organiser un déplacement mais ne donne pas les dates exactes. Quelle doit être la première action ?",
        "choices": [
          "Chercher immédiatement les vols les moins chers",
          "Choisir des dates probables",
          "Identifier les informations manquantes avant de lancer la recherche",
          "Réserver un hôtel flexible"
        ]
      },
      {
        "question": "Pourquoi comparer le coût total du déplacement plutôt que seulement le billet d’avion ?",
        "choices": [
          "Parce qu’un billet moins cher peut entraîner d’autres coûts ou contraintes",
          "Parce que l’hôtel est toujours plus cher que le vol",
          "Parce que les transports locaux sont gratuits",
          "Parce que le billet d’avion n’a aucune importance"
        ]
      },
      {
        "question": "Quelle information concernant l’hôtel doit être évaluée par rapport au rendez-vous ?",
        "choices": [
          "La couleur de la réception",
          "Le temps de trajet réel",
          "La taille du logo de l’hôtel",
          "Le nombre de photos disponibles"
        ]
      },
      {
        "question": "Quel ordre représente le mieux le workflow final du module ?",
        "choices": [
          "Recherche → réservation → contraintes",
          "Cadrage → collecte → vérification → comparaison → recommandation → contrôle final",
          "Résultat final → recherche → vérification",
          "Prompt → résultat → publication immédiate"
        ]
      }
    ]
  },
  "fichiers-01": {
    "lessonId": "fichiers-01-comprendre",
    "family": "fichiers",
    "slug": "01",
    "title": "Faire comprendre un fichier à l’IA",
    "validation": "objective_quiz",
    "questions": [
      {
        "question": "Avant de demander à l’IA d’analyser un fichier que vous connaissez mal, quel est le meilleur premier réflexe ?",
        "choices": [
          "Lui demander d’abord d’expliquer ce que représente le fichier, ses lignes et ses colonnes",
          "Lui demander immédiatement de prendre une décision à votre place",
          "Supprimer les colonnes que vous ne comprenez pas",
          "Considérer automatiquement toutes les données comme correctes"
        ]
      },
      {
        "question": "Dans un fichier de dépenses où chaque ligne correspond à une opération, que peut représenter une colonne ?",
        "choices": [
          "Une information sur l’opération, comme sa date, sa catégorie ou son montant",
          "Obligatoirement un nouveau fichier",
          "Une réponse générée par l’IA",
          "Uniquement le nom de la personne qui a créé le document"
        ]
      },
      {
        "question": "Quelle demande est la plus utile pour commencer avec un fichier inconnu ?",
        "choices": [
          "Analyse.",
          "Dis-moi simplement ce que contient ce fichier, ce que représentent les lignes et colonnes, et signale les informations manquantes ou incohérentes.",
          "Trouve quelque chose d’intéressant.",
          "Dis-moi que tout est correct."
        ]
      },
      {
        "question": "L’IA remarque une case vide dans votre fichier. Que doit-elle faire ?",
        "choices": [
          "Inventer la valeur la plus probable",
          "Ignorer systématiquement la ligne",
          "Signaler l’information manquante sans inventer ce qu’elle ne connaît pas",
          "Remplacer automatiquement la valeur par zéro"
        ]
      }
    ]
  },
  "fichiers-02": {
    "lessonId": "fichiers-02-questions",
    "family": "fichiers",
    "slug": "02",
    "title": "Poser des questions à ses informations",
    "validation": "objective_quiz",
    "questions": [
      {
        "question": "Vous avez un fichier de dépenses. Quelle question est la plus exploitable ?",
        "choices": [
          "Analyse tout.",
          "Quelles sont mes trois catégories de dépenses les plus importantes ce mois-ci ? Donne le montant de chacune.",
          "Qu’en penses-tu ?",
          "Trouve des chiffres."
        ]
      },
      {
        "question": "L’IA affirme que vos dépenses de transport ont augmenté de 30 %. Quel bon réflexe devez-vous avoir ?",
        "choices": [
          "Partager immédiatement la conclusion",
          "Lui demander quels chiffres et quelles périodes elle a comparés",
          "Lui demander de rendre la phrase plus convaincante",
          "Considérer le pourcentage comme exact parce qu’il est précis"
        ]
      },
      {
        "question": "Vous ne savez pas encore quelles questions poser à un fichier. Que pouvez-vous demander à l’IA ?",
        "choices": [
          "De proposer plusieurs questions utiles à partir des informations réellement présentes",
          "D’inventer des informations supplémentaires",
          "De supprimer le fichier",
          "De choisir une conclusion au hasard"
        ]
      },
      {
        "question": "Après une première réponse de l’IA, pouvez-vous approfondir un point particulier ?",
        "choices": [
          "Non, une analyse doit toujours se faire en une seule demande",
          "Oui, vous pouvez poser des questions de suivi pour préciser ou vérifier un résultat",
          "Uniquement si le fichier contient moins de dix lignes",
          "Uniquement avec un fichier PDF"
        ]
      }
    ]
  },
  "fichiers-03": {
    "lessonId": "fichiers-03-organiser",
    "family": "fichiers",
    "slug": "03",
    "title": "Nettoyer et organiser ses informations",
    "validation": "objective_quiz",
    "questions": [
      {
        "question": "Votre fichier contient « 12/08/2026 », « 12 août 2026 » et « 2026-08-12 ». Quel traitement est pertinent ?",
        "choices": [
          "Mettre les dates dans un format cohérent",
          "Supprimer toutes les dates",
          "Transformer les dates en montants",
          "Inventer une nouvelle date pour chaque ligne"
        ]
      },
      {
        "question": "Deux lignes semblent identiques. Que faut-il faire avant d’en supprimer une ?",
        "choices": [
          "Vérifier qu’il s’agit réellement d’un doublon",
          "Toujours supprimer la deuxième",
          "Supprimer les deux",
          "Demander à l’IA d’en inventer une troisième"
        ]
      },
      {
        "question": "Une catégorie est vide dans une ligne. Quelle approche est la plus sûre ?",
        "choices": [
          "Demander à l’IA de l’inventer sans prévenir",
          "Identifier la valeur comme manquante et ne la compléter que si une règle ou une information fiable le permet",
          "Mettre automatiquement « Autre » dans tous les cas",
          "Supprimer toute la colonne"
        ]
      },
      {
        "question": "Pourquoi nettoyer un fichier avant de l’utiliser pour tirer des conclusions ?",
        "choices": [
          "Pour réduire le risque que des incohérences ou doublons faussent les résultats",
          "Uniquement pour changer son apparence",
          "Pour empêcher l’utilisateur de voir les données",
          "Parce que l’IA ne peut lire que des fichiers parfaits"
        ]
      }
    ]
  },
  "fichiers-04": {
    "lessonId": "fichiers-04-dashboard",
    "family": "fichiers",
    "slug": "04",
    "title": "Transformer un fichier en tableau de bord",
    "validation": "objective_quiz",
    "questions": [
      {
        "question": "Quel est le rôle principal d’un tableau de bord ?",
        "choices": [
          "Afficher toutes les données possibles sur une seule page",
          "Permettre de voir rapidement les informations les plus utiles",
          "Remplacer définitivement le fichier d’origine",
          "Ajouter le plus de graphiques possible"
        ]
      },
      {
        "question": "Vous créez un suivi de budget personnel. Quel élément serait pertinent à afficher en priorité ?",
        "choices": [
          "Les dépenses totales du mois",
          "Le nombre de lettres dans le nom du fichier",
          "La couleur préférée de l’utilisateur",
          "Le modèle d’ordinateur utilisé"
        ]
      },
      {
        "question": "Quand un graphique est-il réellement utile ?",
        "choices": [
          "Lorsqu’il aide à comprendre plus rapidement une évolution, une comparaison ou une répartition",
          "Toujours, même s’il ne montre rien d’utile",
          "Uniquement s’il contient beaucoup de couleurs",
          "Seulement dans une entreprise"
        ]
      },
      {
        "question": "Pourquoi prévoir qu’un tableau de bord puisse être actualisé ?",
        "choices": [
          "Pour pouvoir continuer à l’utiliser lorsque de nouvelles informations arrivent",
          "Pour rendre le fichier plus lourd",
          "Pour changer automatiquement son titre chaque jour",
          "Parce qu’un tableau de bord ne doit jamais conserver les anciennes données"
        ]
      }
    ]
  },
  "fichiers-05": {
    "lessonId": "fichiers-05-decisions",
    "family": "fichiers",
    "slug": "05",
    "title": "Faire ressortir ce qui mérite votre attention",
    "validation": "objective_quiz",
    "questions": [
      {
        "question": "L’IA remarque une forte hausse de vos dépenses ce mois-ci. Quelle est la meilleure réaction ?",
        "choices": [
          "Conclure immédiatement que votre budget est mal géré",
          "Identifier les opérations responsables de la hausse avant d’en tirer une conclusion",
          "Supprimer les dépenses les plus élevées du fichier",
          "Demander à l’IA d’ignorer cette hausse"
        ]
      },
      {
        "question": "Une valeur très différente des autres est-elle forcément une erreur ?",
        "choices": [
          "Oui, toujours",
          "Non, elle peut être réelle et liée à un événement exceptionnel",
          "Oui, si l’IA la trouve étrange",
          "Non, donc il ne faut jamais la vérifier"
        ]
      },
      {
        "question": "L’IA vous donne une recommandation à partir de votre fichier. Qui garde la décision finale ?",
        "choices": [
          "L’IA",
          "Le logiciel qui a créé le fichier",
          "Vous, car vous connaissez aussi le contexte que les données ne montrent pas forcément",
          "La première ligne du fichier"
        ]
      },
      {
        "question": "Quel comportement permet de mieux vérifier une conclusion de l’IA ?",
        "choices": [
          "Demander les données ou calculs qui soutiennent cette conclusion",
          "Demander une réponse plus longue",
          "Demander à l’IA d’être plus sûre d’elle",
          "Changer la couleur du graphique"
        ]
      }
    ]
  },
  "fichiers-06": {
    "lessonId": "fichiers-06-projet",
    "family": "fichiers",
    "slug": "06",
    "title": "Projet — Construire mon outil personnel",
    "validation": "project_pending",
    "questions": [
      {
        "question": "Quel est le meilleur sujet pour votre projet final ?",
        "choices": [
          "Un besoin réel que vous pourrez continuer à utiliser après la formation",
          "Le sujet qui contient le plus de termes techniques",
          "Un projet choisi au hasard",
          "Un projet obligatoirement professionnel"
        ]
      },
      {
        "question": "Avant de construire votre outil, que devez-vous définir ?",
        "choices": [
          "Ce que vous souhaitez suivre ou comprendre et les informations dont vous disposez",
          "Uniquement sa couleur",
          "Le plus grand nombre de graphiques possible",
          "Une conclusion avant même d’avoir regardé les informations"
        ]
      },
      {
        "question": "Si votre outil utilise l’IA pour produire une conclusion importante, que devez-vous prévoir ?",
        "choices": [
          "Une manière de vérifier les informations ou calculs utilisés",
          "Une règle interdisant toute vérification",
          "Une réponse automatique toujours positive",
          "La suppression du fichier d’origine"
        ]
      },
      {
        "question": "Qu’est-ce qui montre que votre projet est réellement réussi ?",
        "choices": [
          "Vous pouvez le comprendre, l’actualiser et l’utiliser pour un besoin réel",
          "Il contient beaucoup de code",
          "Il utilise le plus grand nombre possible de technologies",
          "Il est impossible à modifier"
        ]
      }
    ]
  },
  "automation-01": {
    "lessonId": "automation-01-logic",
    "family": "automation",
    "slug": "01",
    "title": "Comprendre une automatisation",
    "validation": "objective_quiz",
    "questions": [
      {
        "question": "Quel élément démarre normalement une automatisation ?",
        "choices": [
          "Le déclencheur",
          "Le résultat final",
          "Le bouton de validation",
          "La couleur de l'interface"
        ]
      },
      {
        "question": "Vous recevez un nouvel email client. Quelle étape doit venir avant l'action finale ?",
        "choices": [
          "Exécuter immédiatement une action",
          "Comprendre la demande et appliquer les règles prévues",
          "Supprimer l'email",
          "Inventer les informations manquantes"
        ]
      },
      {
        "question": "Que doit faire une bonne automatisation lorsqu'elle rencontre un cas qu'elle ne sait pas traiter correctement ?",
        "choices": [
          "Choisir une réponse au hasard",
          "Continuer automatiquement",
          "Prévoir une validation ou une intervention humaine",
          "Ignorer systématiquement la demande"
        ]
      },
      {
        "question": "Quelle chaîne représente le mieux une automatisation simple ?",
        "choices": [
          "Déclencheur → décision → action → contrôle",
          "Action → déclencheur → hasard",
          "Interface → logo → action",
          "Résultat → déclencheur → suppression"
        ]
      }
    ]
  },
  "automation-02": {
    "lessonId": "automation-02-tri",
    "family": "automation",
    "slug": "02",
    "title": "Trier automatiquement des demandes",
    "validation": "objective_quiz",
    "questions": [
      {
        "question": "Sur quoi doit reposer une règle de classement fiable ?",
        "choices": [
          "Des informations observables dans le message",
          "Une intuition du système",
          "Le nombre de lettres dans le prénom",
          "Une catégorie choisie au hasard"
        ]
      },
      {
        "question": "Un client signale qu'il a été débité deux fois. Quelle priorité est la plus logique ?",
        "choices": [
          "Faible",
          "Haute",
          "Aucune",
          "La même qu'une newsletter"
        ]
      },
      {
        "question": "Pourquoi créer des catégories comme Facturation, Commercial ou Support ?",
        "choices": [
          "Uniquement pour rendre la boîte mail plus jolie",
          "Pour déterminer plus facilement l'action à effectuer ensuite",
          "Pour modifier le contenu des emails",
          "Pour supprimer automatiquement tous les messages"
        ]
      },
      {
        "question": "Un message ne correspond clairement à aucune règle. Que doit faire le système ?",
        "choices": [
          "Le classer au hasard",
          "Le supprimer",
          "Le placer dans une catégorie de vérification manuelle",
          "Répondre automatiquement"
        ]
      }
    ]
  },
  "automation-03": {
    "lessonId": "automation-03-extraction",
    "family": "automation",
    "slug": "03",
    "title": "Extraire les informations importantes",
    "validation": "objective_quiz",
    "questions": [
      {
        "question": "Quel est le but principal d'une étape d'extraction ?",
        "choices": [
          "Transformer un texte en données structurées utiles",
          "Réécrire le message avec un meilleur style",
          "Inventer les informations absentes",
          "Supprimer le texte original"
        ]
      },
      {
        "question": "Le message dit : \"J'ai été débité deux fois de 89 €. Commande CMD-4821.\" Que peut-on extraire avec certitude ?",
        "choices": [
          "89 € et CMD-4821",
          "L'âge du client",
          "Son adresse",
          "Son moyen de paiement exact"
        ]
      },
      {
        "question": "Le nom complet du client n'apparaît pas dans le message. Que doit enregistrer le workflow ?",
        "choices": [
          "Un nom probable",
          "Le nom d'un autre client",
          "Information non fournie",
          "Un nom généré par l'IA"
        ]
      },
      {
        "question": "Pourquoi structurer les informations dans des champs comme montant, commande et problème ?",
        "choices": [
          "Pour pouvoir les réutiliser facilement dans les prochaines étapes",
          "Pour augmenter automatiquement le prix",
          "Pour supprimer le besoin de contrôle",
          "Pour rendre le message plus long"
        ]
      }
    ]
  },
  "automation-04": {
    "lessonId": "automation-04-email",
    "family": "automation",
    "slug": "04",
    "title": "Préparer des réponses avec l'IA",
    "validation": "objective_quiz",
    "questions": [
      {
        "question": "Pourquoi est-il utile de demander à l'IA de préparer un brouillon plutôt que d'envoyer directement le message ?",
        "choices": [
          "Pour pouvoir vérifier la réponse avant qu'elle ait un effet réel",
          "Parce que les brouillons sont toujours plus longs",
          "Pour empêcher l'utilisateur de lire le message",
          "Pour supprimer toutes les règles"
        ]
      },
      {
        "question": "Aucun remboursement n'a encore été décidé. Que doit dire le brouillon ?",
        "choices": [
          "Votre remboursement est déjà effectué",
          "Nous allons vérifier la situation",
          "Vous serez remboursé demain",
          "Le remboursement est garanti"
        ]
      },
      {
        "question": "Quelle information l'IA doit-elle utiliser pour rédiger une réponse ?",
        "choices": [
          "Les faits réellement disponibles",
          "Des informations inventées pour rendre la réponse plus complète",
          "Les données d'un autre client",
          "Des hypothèses présentées comme certaines"
        ]
      },
      {
        "question": "Quelle chaîne est la plus sûre pour traiter un email client ?",
        "choices": [
          "Email → réponse automatique immédiate",
          "Email → compréhension → brouillon → vérification → envoi",
          "Email → suppression",
          "Email → paiement automatique"
        ]
      }
    ]
  },
  "automation-05": {
    "lessonId": "automation-05-control",
    "family": "automation",
    "slug": "05",
    "title": "Garder le contrôle avant d'agir",
    "validation": "objective_quiz",
    "questions": [
      {
        "question": "Quelle action présente le risque le plus important ?",
        "choices": [
          "Classer un email",
          "Créer un résumé",
          "Déclencher un remboursement de 500 €",
          "Ajouter une étiquette interne"
        ]
      },
      {
        "question": "Quelle question aide le plus à décider si une validation humaine est nécessaire ?",
        "choices": [
          "Que se passe-t-il si le système se trompe ?",
          "Quelle est la couleur du bouton ?",
          "Combien de lignes contient le workflow ?",
          "Quel est le nom du modèle d'IA ?"
        ]
      },
      {
        "question": "Quelle action peut généralement être automatisée avec moins de risque ?",
        "choices": [
          "Supprimer définitivement un dossier client",
          "Déclencher un paiement",
          "Classer un email dans une catégorie",
          "Signer un contrat"
        ]
      },
      {
        "question": "Pourquoi conserver un historique des actions du workflow ?",
        "choices": [
          "Pour savoir ce qui a été proposé et réellement exécuté",
          "Pour augmenter automatiquement la vitesse de l'IA",
          "Pour remplacer toutes les validations humaines",
          "Pour masquer les erreurs"
        ]
      }
    ]
  },
  "automation-06": {
    "lessonId": "automation-06-workflow",
    "family": "automation",
    "slug": "06",
    "title": "Construire un workflow complet",
    "validation": "objective_quiz",
    "questions": [
      {
        "question": "Pourquoi découper un workflow en plusieurs étapes ?",
        "choices": [
          "Pour pouvoir comprendre et contrôler chaque transformation",
          "Pour rendre le système volontairement plus compliqué",
          "Pour cacher les erreurs",
          "Pour supprimer les règles"
        ]
      },
      {
        "question": "Quelle étape doit normalement venir avant la génération d'un brouillon ?",
        "choices": [
          "Comprendre ou structurer la demande",
          "Envoyer le message",
          "Supprimer l'entrée",
          "Clôturer le workflow"
        ]
      },
      {
        "question": "Quel workflow paraît le plus complet ?",
        "choices": [
          "Réception → tri → extraction → décision → contrôle → action → historique",
          "Réception → action aléatoire",
          "Email → suppression",
          "Réception → réponse immédiate sans analyse"
        ]
      },
      {
        "question": "Que doit prévoir un workflow lorsqu'une étape échoue ?",
        "choices": [
          "Une règle de gestion de l'erreur ou une reprise humaine",
          "Une réponse inventée",
          "La suppression automatique de toutes les données",
          "Aucune action particulière"
        ]
      }
    ]
  },
  "automation-07": {
    "lessonId": "automation-07-project",
    "family": "automation",
    "slug": "07",
    "title": "Projet · Construire votre assistant de travail",
    "validation": "project_pending",
    "questions": [
      {
        "question": "Quel est le meilleur point de départ pour construire votre assistant ?",
        "choices": [
          "Une tâche réelle et répétitive à améliorer",
          "Le modèle d'IA le plus compliqué",
          "Le design du bouton principal",
          "Une technologie choisie au hasard"
        ]
      },
      {
        "question": "Votre assistant reçoit une demande mais une information essentielle manque. Que doit-il faire ?",
        "choices": [
          "Inventer la donnée",
          "Continuer comme si elle existait",
          "Signaler l'information manquante ou demander une validation",
          "Supprimer automatiquement la demande"
        ]
      },
      {
        "question": "Quels types de situations faut-il tester avant de considérer le projet fiable ?",
        "choices": [
          "Uniquement un cas parfait",
          "Des cas normaux, ambigus et problématiques",
          "Uniquement les cas les plus faciles",
          "Seulement le design de l'interface"
        ]
      },
      {
        "question": "Quel résultat montre le mieux que votre assistant apporte une vraie valeur ?",
        "choices": [
          "Il utilise beaucoup de technologies",
          "Il permet de gagner du temps ou de réduire des erreurs sur une vraie tâche",
          "Il possède beaucoup de boutons",
          "Il produit toujours des textes très longs"
        ]
      }
    ]
  }
} as const satisfies Record<string, SecureQuiz>;

export function getModules2To5Quiz(family: string, slug: string) {
  return modules2To5Quizzes[`${family}-${slug}` as keyof typeof modules2To5Quizzes];
}

export const orderedFundamentalsLessonIds = planLessonIds.fondamentaux;

export function isFundamentalsLessonId(
  value: unknown
): value is FundamentalsLessonId {
  return (
    typeof value === "string" &&
    orderedFundamentalsLessonIds.includes(value as FundamentalsLessonId)
  );
}

export function getSecureQuizByLessonId(lessonId: FundamentalsLessonId) {
  if (isModule1LessonId(lessonId)) {
    const quiz = getModule1QuizByLessonId(lessonId);

    return quiz
      ? { ...quiz, validation: "objective_quiz" as const }
      : undefined;
  }

  return Object.values(modules2To5Quizzes).find(
    (quiz) => quiz.lessonId === lessonId
  );
}

export const orderedObjectiveQuizLessonIds =
  orderedFundamentalsLessonIds.filter(
    (lessonId) =>
      getSecureQuizByLessonId(lessonId)?.validation === "objective_quiz"
  );
