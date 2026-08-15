import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AutomationPractice from "@/components/formation/AutomationPractice";

// ======================================================
// LEÇONS DU MODULE 05
// ======================================================

const lessons = [
  {
    slug: "01",
    id: "automation-01-logic",
    number: "01",
    title: "Comprendre une automatisation",
    duration: "15 min",
    description:
      "Comprenez comment transformer une tâche répétitive en une suite d'étapes simples, logiques et contrôlables.",
  },
  {
    slug: "02",
    id: "automation-02-tri",
    number: "02",
    title: "Trier automatiquement des demandes",
    duration: "20 min",
    description:
      "Apprenez à organiser automatiquement des demandes selon leur nature, leur priorité et l'action à effectuer.",
  },
  {
    slug: "03",
    id: "automation-03-extraction",
    number: "03",
    title: "Extraire les informations importantes",
    duration: "20 min",
    description:
      "Transformez des emails et messages en informations structurées directement utilisables dans votre workflow.",
  },
  {
    slug: "04",
    id: "automation-04-email",
    number: "04",
    title: "Préparer des réponses avec l'IA",
    duration: "22 min",
    description:
      "Utilisez l'IA pour préparer des réponses professionnelles tout en conservant le contrôle avant l'envoi.",
  },
  {
    slug: "05",
    id: "automation-05-control",
    number: "05",
    title: "Garder le contrôle avant d'agir",
    duration: "18 min",
    description:
      "Apprenez à décider ce qui peut être automatisé et ce qui doit obligatoirement rester sous validation humaine.",
  },
  {
    slug: "06",
    id: "automation-06-workflow",
    number: "06",
    title: "Construire un workflow complet",
    duration: "25 min",
    description:
      "Assemblez les différentes briques pour construire un véritable processus automatisé de bout en bout.",
  },
  {
    slug: "07",
    id: "automation-07-project",
    number: "07",
    title: "Projet · Construire votre assistant de travail",
    duration: "35 min",
    description:
      "Concevez un assistant capable de traiter une vraie tâche répétitive que vous pourriez utiliser au quotidien.",
  },
];

// ======================================================
// PAGE
// ======================================================

export default async function AutomationLessonPage({
  params,
}: {
  params: Promise<{
    lesson: string;
  }>;
}) {
  const { lesson: lessonSlug } = await params;

  const lesson = lessons.find(
    (item) => item.slug === lessonSlug
  );

  if (!lesson) {
    notFound();
  }

  // ======================================================
  // SUPABASE
  // ======================================================

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const {
    data: progressData,
    error: progressError,
  } = await supabase
    .from("lesson_progress")
    .select("lesson_id, completed, score")
    .eq("user_id", user.id);

  if (progressError) {
    console.error(
      "Erreur récupération progression :",
      progressError
    );
  }

  const completedIds = new Set(
    progressData
      ?.filter((item) => item.completed)
      .map((item) => item.lesson_id) ?? []
  );

  // ======================================================
  // ACCÈS À LA LEÇON
  // ======================================================

  const currentIndex = lessons.findIndex(
    (item) => item.id === lesson.id
  );

  const previousLesson =
    currentIndex > 0
      ? lessons[currentIndex - 1]
      : null;

  const allowed =
    currentIndex === 0 ||
    previousLesson === null ||
    completedIds.has(previousLesson.id);

  if (!allowed) {
    redirect("/formation/automatisation");
  }

  const nextLesson =
    currentIndex < lessons.length - 1
      ? lessons[currentIndex + 1]
      : null;

  const lessonCompleted =
    completedIds.has(lesson.id);

  const lessonProgress =
    progressData?.find(
      (item) =>
        item.lesson_id === lesson.id
    );

  const lessonScore =
    lessonProgress?.score ?? null;

  const content = getLessonContent(
    lesson.slug
  );

  // ======================================================
  // UI
  // ======================================================

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-6 py-8 text-slate-900">

      <div className="mx-auto max-w-6xl">

        {/* ==================================================
            TOP
        ================================================== */}

        <div className="flex items-center justify-between">

          <Link
            href="/formation/automatisation"
            className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            ← Retour au module
          </Link>

          <span className="rounded-full bg-white px-4 py-2 text-sm shadow-sm">
            Leçon {lesson.number} / {lessons.length}
          </span>

        </div>

        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="mt-10">

          <div className="flex flex-wrap items-center gap-3">

            <p className="text-sm font-semibold tracking-[0.2em] text-slate-400">
              LEÇON {lesson.number}
            </p>

            {lessonCompleted && (
              <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
                ✓ Terminée
              </span>
            )}

            {lessonCompleted &&
              lessonScore !== null && (
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm">
                  QCM : {lessonScore}%
                </span>
              )}

          </div>

          <h1 className="mt-4 max-w-4xl text-4xl font-bold md:text-5xl">
            {lesson.title}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-500">
            {lesson.description}
          </p>

        </header>

        {/* ==================================================
            VIDEO
        ================================================== */}

        <section className="mt-8 overflow-hidden rounded-[30px] bg-slate-950 shadow-xl">

          <div className="flex aspect-video items-center justify-center">

            <button
              type="button"
              className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-2xl text-slate-950 shadow-xl transition hover:scale-105"
            >
              ▶
            </button>

          </div>

          <div className="border-t border-slate-800 px-6 py-4">

            <div className="flex items-center justify-between text-sm">

              <span className="text-slate-400">
                {lesson.title}
              </span>

              <span className="font-medium text-white">
                {lesson.duration}
              </span>

            </div>

          </div>

        </section>

        {/* ==================================================
            CONTENU + COACH
        ================================================== */}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">

          {/* ==================================================
              COLONNE PRINCIPALE
          ================================================== */}

          <div className="space-y-6">

            {/* ================================================
                À RETENIR
            ================================================ */}

            <section className="rounded-[26px] border border-slate-200 bg-white p-8 shadow-sm">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                À RETENIR
              </p>

              <h2 className="mt-4 text-2xl font-bold">
                {content.heading}
              </h2>

              <p className="mt-4 leading-7 text-slate-500">
                {content.introduction}
              </p>

              <div className="mt-8 space-y-4">

                {content.points.map(
                  (point, index) => (
                    <div
                      key={point.title}
                      className="rounded-2xl bg-slate-50 p-5"
                    >

                      <div className="flex items-start gap-4">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-xs font-bold shadow-sm">
                          {String(
                            index + 1
                          ).padStart(2, "0")}
                        </div>

                        <div>

                          <h3 className="font-semibold">
                            {point.title}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-slate-500">
                            {point.text}
                          </p>

                        </div>

                      </div>

                    </div>
                  )
                )}

              </div>

            </section>

            {/* ================================================
                MÉTHODE
            ================================================ */}

            <section className="rounded-[26px] border border-slate-200 bg-white p-8 shadow-sm">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                MÉTHODE
              </p>

              <h2 className="mt-4 text-2xl font-bold">
                {content.methodTitle}
              </h2>

              <p className="mt-4 leading-7 text-slate-500">
                {content.methodIntroduction}
              </p>

              <div className="mt-7 space-y-3">

                {content.methodSteps.map(
                  (step, index) => (
                    <div
                      key={step}
                      className="flex items-start gap-4 rounded-2xl border border-slate-200 p-5"
                    >

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white">
                        {index + 1}
                      </div>

                      <p className="pt-1 text-sm font-medium leading-6 text-slate-600">
                        {step}
                      </p>

                    </div>
                  )
                )}

              </div>

            </section>

            {/* ================================================
                ATELIER PRATIQUE
            ================================================ */}

            <AutomationPractice
              lesson={
                lesson.slug as
                  | "01"
                  | "02"
                  | "03"
                  | "04"
                  | "05"
                  | "06"
                  | "07"
              }
              lessonId={lesson.id}
              nextHref={
                nextLesson
                  ? `/formation/automatisation/${nextLesson.slug}`
                  : "/formation/automatisation"
              }
              alreadyCompleted={lessonCompleted}
              previousScore={lessonScore}
            />

            {/* ================================================
                PRINCIPE CLÉ
            ================================================ */}

            <section className="rounded-[26px] bg-slate-950 p-8 text-white shadow-xl">

              <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                PRINCIPE CLÉ
              </p>

              <h2 className="mt-4 text-2xl font-bold">
                {content.principleTitle}
              </h2>

              <p className="mt-4 leading-7 text-slate-400">
                {content.principleText}
              </p>

              <div className="mt-6 rounded-2xl bg-slate-900 p-5">

                <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-slate-300">
                  {content.example}
                </pre>

              </div>

            </section>

            {/* ================================================
                VALIDATION
            ================================================ */}

            <section className="rounded-[26px] border border-slate-200 bg-white p-8 shadow-sm">

              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                    VALIDATION
                  </p>

                  <h2 className="mt-3 text-2xl font-bold">
                    Vérifiez votre compréhension
                  </h2>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                    Répondez au QCM pour valider cette leçon.
                    Vous devez obtenir au minimum 70 %.
                  </p>

                  <div className="mt-4 inline-flex rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
                    Score minimum : 70 %
                  </div>

                </div>

                <Link
                  href={`/formation/automatisation/${lesson.slug}/exercice`}
                  className="shrink-0 rounded-2xl bg-slate-950 px-6 py-4 text-center font-semibold text-white transition hover:scale-[1.02]"
                >
                  {lessonCompleted
                    ? "Refaire le quiz →"
                    : "Faire le quiz →"}
                </Link>

              </div>

            </section>

            {/* ================================================
                NAVIGATION APRÈS VALIDATION
            ================================================ */}

            {lessonCompleted && (
              <section className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <p className="font-bold">
                      ✓ Leçon validée
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Votre progression a été enregistrée.
                    </p>

                  </div>

                  {nextLesson ? (
                    <Link
                      href={`/formation/automatisation/${nextLesson.slug}`}
                      className="rounded-2xl bg-slate-950 px-6 py-4 text-center font-semibold text-white"
                    >
                      Leçon suivante →
                    </Link>
                  ) : (
                    <Link
                      href="/formation/automatisation"
                      className="rounded-2xl bg-slate-950 px-6 py-4 text-center font-semibold text-white"
                    >
                      Terminer le module →
                    </Link>
                  )}

                </div>

              </section>
            )}

          </div>

          {/* ==================================================
              COACH IA
          ================================================== */}

          <aside className="h-fit rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-8">

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                ✦
              </div>

              <div>

                <p className="font-bold">
                  Coach IA
                </p>

                <p className="text-xs text-slate-400">
                  Leçon {lesson.number}
                </p>

              </div>

            </div>

            <div className="mt-6 rounded-2xl bg-slate-100 p-4 text-sm leading-6 text-slate-600">
              Une notion n’est pas claire ?
              Posez une question ou demandez
              un exemple supplémentaire.
            </div>

            <textarea
              className="mt-4 min-h-32 w-full resize-none rounded-2xl border border-slate-200 p-4 text-sm outline-none transition focus:border-slate-950"
              placeholder="Posez votre question..."
            />

            <button
              type="button"
              className="mt-3 w-full rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:scale-[1.01]"
            >
              Envoyer
            </button>

            <p className="mt-3 text-center text-xs text-slate-400">
              Le Coach IA sera activé prochainement.
            </p>

          </aside>

        </div>

      </div>

    </main>
  );
}

// ======================================================
// CONTENU DES 7 LEÇONS
// ======================================================

function getLessonContent(slug: string) {
  const contents = {
    "01": {
      heading:
        "Une automatisation transforme une tâche répétitive en processus.",

      introduction:
        "L'objectif n'est pas de laisser une machine tout faire. Il s'agit d'identifier une tâche que vous répétez souvent, de la découper en étapes simples puis de décider lesquelles peuvent être exécutées automatiquement.",

      points: [
        {
          title: "Le déclencheur",
          text:
            "C'est l'événement qui démarre le processus : un email arrive, un formulaire est rempli, un fichier est ajouté ou une date est atteinte.",
        },
        {
          title: "La décision",
          text:
            "Le système analyse la situation et applique une règle pour savoir ce qu'il doit faire ensuite.",
        },
        {
          title: "L'action",
          text:
            "Une fois la décision prise, le workflow produit quelque chose : classement, brouillon, tâche, notification ou autre résultat.",
        },
        {
          title: "Le contrôle",
          text:
            "Lorsque le système hésite ou qu'une action présente un risque, une personne doit pouvoir reprendre la main.",
        },
      ],

      methodTitle:
        "Pensez toujours en quatre questions",

      methodIntroduction:
        "Avant de choisir un outil, décrivez votre automatisation avec des mots simples.",

      methodSteps: [
        "Qu'est-ce qui démarre mon automatisation ?",
        "Quelle décision le système doit-il prendre ?",
        "Quelle action doit-il préparer ou effectuer ?",
        "Que doit-il faire lorsqu'il n'est pas suffisamment sûr ?",
      ],

      principleTitle:
        "Automatiser ne signifie pas supprimer l'humain",

      principleText:
        "Une bonne automatisation sait exactement ce qu'elle peut faire et à quel moment elle doit demander de l'aide.",

      example: `EMAIL REÇU
↓
Identifier la demande
↓
Choisir une action
↓
Cas clair → préparer l'action
Cas incertain → validation humaine`,
    },

    "02": {
      heading:
        "Le tri automatique transforme une boîte de réception en file de travail.",

      introduction:
        "Une boîte mail contient des demandes très différentes. Avant de répondre, il faut savoir ce que chaque message représente et quelle priorité lui donner.",

      points: [
        {
          title: "Catégoriser",
          text:
            "Regroupez les messages selon leur fonction : facturation, commercial, support, rendez-vous ou information.",
        },
        {
          title: "Prioriser",
          text:
            "Une demande bloquante ou financière n'a pas la même urgence qu'une newsletter.",
        },
        {
          title: "Définir une action",
          text:
            "Une catégorie devient vraiment utile lorsqu'elle détermine ce que le workflow doit faire ensuite.",
        },
        {
          title: "Prévoir les cas inconnus",
          text:
            "Un message ambigu ne doit pas être forcé dans une catégorie au hasard.",
        },
      ],

      methodTitle:
        "Classez selon l'action à effectuer",

      methodIntroduction:
        "Ne créez pas des catégories uniquement pour ranger. Chaque catégorie doit aider le système à prendre la prochaine décision.",

      methodSteps: [
        "Lire la demande et identifier son objectif principal.",
        "Choisir une catégorie utile au traitement.",
        "Déterminer la priorité selon les conséquences.",
        "Envoyer les cas ambigus vers une vérification humaine.",
      ],

      principleTitle:
        "Une règle de tri doit pouvoir être expliquée",

      principleText:
        "Si vous ne pouvez pas expliquer clairement pourquoi un message appartient à une catégorie, la règle est probablement trop vague.",

      example: `SI le message parle d'un paiement en double
→ catégorie : problème de paiement
→ priorité : haute
→ action : vérification

SI le message est une newsletter
→ catégorie : information
→ priorité : faible`,
    },

    "03": {
      heading:
        "L'extraction transforme du texte en informations exploitables.",

      introduction:
        "Un email est facile à lire pour une personne mais difficile à réutiliser automatiquement. L'extraction consiste à isoler les informations dont le workflow a réellement besoin.",

      points: [
        {
          title: "Identifier les champs",
          text:
            "Déterminez les données nécessaires : nom, montant, référence, date, problème ou autre information utile.",
        },
        {
          title: "Structurer",
          text:
            "Chaque information doit être placée dans un champ clairement identifié.",
        },
        {
          title: "Reconnaître les absences",
          text:
            "Une donnée qui n'apparaît pas dans le message doit être signalée comme manquante.",
        },
        {
          title: "Ne jamais inventer",
          text:
            "Un workflow fiable distingue toujours une information certaine d'une supposition.",
        },
      ],

      methodTitle:
        "Passez du message à une fiche structurée",

      methodIntroduction:
        "Lisez d'abord le message comme une personne, puis transformez uniquement les faits utiles en données.",

      methodSteps: [
        "Définir les informations dont la suite du workflow a besoin.",
        "Chercher chaque information dans le message.",
        "Remplir uniquement les champs confirmés.",
        "Marquer explicitement les informations manquantes.",
      ],

      principleTitle:
        "Une donnée absente vaut mieux qu'une donnée inventée",

      principleText:
        "Dans une automatisation réelle, une information inventée peut provoquer une mauvaise décision. Le système doit savoir dire qu'il ne sait pas.",

      example: `MESSAGE :
"J'ai été débité deux fois de 89 €.
Commande CMD-4821."

↓

montant = 89 €
commande = CMD-4821
problème = double paiement
identité complète = non fournie`,
    },

    "04": {
      heading:
        "L'IA peut préparer une réponse sans avoir le droit de l'envoyer.",

      introduction:
        "Générer du texte et effectuer une action sont deux choses différentes. L'IA peut faire gagner beaucoup de temps en préparant un brouillon tandis que l'utilisateur conserve la décision finale.",

      points: [
        {
          title: "Comprendre la demande",
          text:
            "Avant de rédiger, le système doit identifier précisément ce que la personne demande.",
        },
        {
          title: "Utiliser uniquement les faits",
          text:
            "La réponse doit être construite à partir des informations réellement disponibles.",
        },
        {
          title: "Préparer le brouillon",
          text:
            "L'IA produit une réponse claire et professionnelle qui peut ensuite être relue.",
        },
        {
          title: "Valider avant l'envoi",
          text:
            "Une personne peut approuver, modifier ou refuser le brouillon avant qu'il quitte le système.",
        },
      ],

      methodTitle:
        "Séparez toujours génération et action",

      methodIntroduction:
        "Cette séparation permet de profiter de la vitesse de l'IA sans lui donner automatiquement le pouvoir d'agir.",

      methodSteps: [
        "Comprendre la demande du client.",
        "Extraire les faits autorisés.",
        "Générer un brouillon à partir de ces faits.",
        "Vérifier le contenu avant tout envoi réel.",
      ],

      principleTitle:
        "Brouillon automatique ne veut pas dire envoi automatique",

      principleText:
        "Plus un message a de conséquences pour un client ou une entreprise, plus la validation avant envoi devient importante.",

      example: `EMAIL CLIENT
↓
Analyse
↓
Informations utiles
↓
Brouillon IA
↓
Vérification humaine
↓
Approuver / Modifier / Refuser`,
    },

    "05": {
      heading:
        "Le niveau d'automatisation doit dépendre du risque.",

      introduction:
        "Classer un email, envoyer un message et effectuer un remboursement n'ont pas les mêmes conséquences. Un workflow sérieux adapte donc son niveau d'autonomie à chaque action.",

      points: [
        {
          title: "Faible risque",
          text:
            "Classer, résumer ou préparer une suggestion peut souvent être automatisé.",
        },
        {
          title: "Risque moyen",
          text:
            "Créer ou modifier des informations importantes peut nécessiter une vérification.",
        },
        {
          title: "Risque élevé",
          text:
            "Paiements, suppressions définitives et engagements importants doivent être fortement contrôlés.",
        },
        {
          title: "Traçabilité",
          text:
            "Il doit être possible de savoir ce que le système a proposé et ce qui a réellement été exécuté.",
        },
      ],

      methodTitle:
        "Posez trois questions avant d'automatiser une action",

      methodIntroduction:
        "Ces trois questions permettent de décider rapidement si une validation humaine est nécessaire.",

      methodSteps: [
        "Que se passe-t-il si le système se trompe ?",
        "L'action peut-elle être facilement annulée ?",
        "L'action engage-t-elle de l'argent, des données sensibles ou une personne ?",
      ],

      principleTitle:
        "Plus les conséquences augmentent, plus le contrôle augmente",

      principleText:
        "L'objectif n'est pas d'automatiser le maximum. L'objectif est d'automatiser ce qui peut l'être sans perdre la maîtrise du processus.",

      example: `CLASSER UN EMAIL
→ automatique possible

PRÉPARER UN BROUILLON
→ automatique + vérification possible

REMBOURSER 500 €
→ validation humaine obligatoire`,
    },

    "06": {
      heading:
        "Un workflow complet est une chaîne de petites étapes simples.",

      introduction:
        "La puissance d'un système ne vient pas forcément d'une étape complexe. Elle vient surtout de la manière dont plusieurs étapes simples travaillent ensemble.",

      points: [
        {
          title: "Entrée",
          text:
            "Le workflow reçoit un événement : email, formulaire, fichier ou autre donnée.",
        },
        {
          title: "Compréhension",
          text:
            "Le système classe la demande et extrait les informations importantes.",
        },
        {
          title: "Décision",
          text:
            "Des règles déterminent l'action à préparer selon la situation.",
        },
        {
          title: "Sortie",
          text:
            "Le workflow produit un résultat et conserve une validation humaine lorsque nécessaire.",
        },
      ],

      methodTitle:
        "Construisez votre workflow comme une chaîne",

      methodIntroduction:
        "Chaque étape doit recevoir quelque chose de clair et produire quelque chose d'utile pour l'étape suivante.",

      methodSteps: [
        "Définir l'événement qui démarre le workflow.",
        "Classer et structurer les informations reçues.",
        "Appliquer les règles de décision.",
        "Produire l'action ou demander une validation.",
        "Prévoir les erreurs et conserver un historique.",
      ],

      principleTitle:
        "Chaque étape doit avoir une responsabilité claire",

      principleText:
        "Lorsque toutes les responsabilités sont mélangées, le workflow devient difficile à comprendre et à corriger.",

      example: `RÉCEPTION
↓
TRI
↓
EXTRACTION
↓
DÉCISION
↓
IA
↓
CONTRÔLE
↓
ACTION
↓
HISTORIQUE`,
    },

    "07": {
      heading:
        "Votre projet final doit résoudre une vraie tâche répétitive.",

      introduction:
        "Vous allez maintenant réunir tout le module dans un seul projet. L'objectif n'est pas de construire quelque chose de spectaculaire, mais quelque chose qu'une personne pourrait réellement utiliser.",

      points: [
        {
          title: "Un utilisateur réel",
          text:
            "Choisissez une personne ou un métier qui rencontre régulièrement le problème.",
        },
        {
          title: "Un problème précis",
          text:
            "Le projet doit réduire une tâche répétitive clairement identifiable.",
        },
        {
          title: "Un workflow complet",
          text:
            "Votre assistant doit recevoir, comprendre, décider et produire un résultat.",
        },
        {
          title: "Un système contrôlable",
          text:
            "Les erreurs, informations manquantes et actions sensibles doivent être prévues.",
        },
      ],

      methodTitle:
        "Construisez d'abord la valeur, puis la technologie",

      methodIntroduction:
        "Un bon projet commence par le problème de l'utilisateur. Les outils viennent seulement ensuite.",

      methodSteps: [
        "Choisir l'utilisateur et la tâche répétitive.",
        "Définir l'entrée du système.",
        "Définir ce que l'assistant doit comprendre et extraire.",
        "Définir les actions qu'il peut préparer.",
        "Ajouter les contrôles et validations humaines.",
        "Expliquer le gain concret obtenu.",
      ],

      principleTitle:
        "Un assistant utile vaut mieux qu'une démonstration compliquée",

      principleText:
        "Votre projet est réussi lorsqu'il permet réellement de gagner du temps, réduire les erreurs ou mieux organiser le travail.",

      example: `PROBLÈME
→ trop de demandes répétitives

ASSISTANT
→ reçoit
→ classe
→ extrait
→ prépare
→ demande validation si nécessaire

RÉSULTAT
→ moins de travail manuel
→ traitement plus rapide
→ contrôle conservé`,
    },
  };

  return (
    contents[
      slug as keyof typeof contents
    ] ?? contents["01"]
  );
}