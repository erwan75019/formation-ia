"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useMemo,
  useState,
  type ReactNode,
} from "react";

// ======================================================
// TYPES
// ======================================================

type EvaluationCriterion = {
  name: string;
  score: number;
  maxScore: number;
  feedback: string;
};

type Evaluation = {
  score: number;
  verdict: string;
  summary: string;
  criteria: EvaluationCriterion[];
  strengths: string[];
  improvements: string[];
  advice: string;
};

type EvaluationRequestCriterion = {
  name: string;
  maxScore: number;
  description: string;
};

type EvaluationAnswers =
  Record<string, string>;

type LessonInfo = {
  id: string;
  number: string;
  title: string;
  qcmHref: string;
};

type OrderedItem = {
  id: string;
  label: string;
};

type CategoryChoice = {
  id: string;
  label: string;
  category: string;
};

type Property = {
  id: number;
  district: string;
  price: number;
  bedrooms: number;
  balcony: boolean;
};

// ======================================================
// LEÇONS
// ======================================================

const lessons: Record<string, LessonInfo> = {
  "01": {
    id: "web-01-fonctionnement",
    number: "01",
    title:
      "Comment fonctionne un site web ?",
    qcmHref:
      "/formation/python/01/qcm",
  },

  "02": {
    id: "web-02-interface",
    number: "02",
    title:
      "Construire l'interface de PropertyMatch AI",
    qcmHref:
      "/formation/python/02/qcm",
  },

  "03": {
    id: "web-03-design",
    number: "03",
    title:
      "Créer un design professionnel",
    qcmHref:
      "/formation/python/03/qcm",
  },

  "04": {
    id: "web-04-interactions",
    number: "04",
    title:
      "Ajouter des interactions",
    qcmHref:
      "/formation/python/04/qcm",
  },

  "05": {
    id: "web-05-nextjs",
    number: "05",
    title:
      "Comprendre les pages et composants",
    qcmHref:
      "/formation/python/05/qcm",
  },

  "06": {
    id: "web-06-propertymatch",
    number: "06",
    title:
      "Construire PropertyMatch AI",
    qcmHref:
      "/formation/python/06/qcm",
  },

  "07": {
    id: "web-07-publication",
    number: "07",
    title:
      "Publier son site sur Internet",
    qcmHref:
      "/formation/python/07/qcm",
  },
};

// ======================================================
// PAGE
// ======================================================

export default function WebExercisePage() {
  const params = useParams();

  const lessonSlug =
    typeof params.lesson ===
    "string"
      ? params.lesson
      : "";

  const lesson =
    lessons[lessonSlug];

  if (!lesson) {
    return (
      <main className="min-h-screen bg-[#f5f7fb] px-6 py-10 text-slate-900">

        <div className="mx-auto max-w-4xl">

          <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">

            <p className="text-xs font-semibold tracking-[0.18em] text-slate-400">
              ATELIER
            </p>

            <h1 className="mt-4 text-3xl font-bold">
              Atelier introuvable
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

  if (lessonSlug === "01") {
    return (
      <LessonOneExercise
        lesson={lesson}
      />
    );
  }

  if (lessonSlug === "02") {
    return (
      <LessonTwoExercise
        lesson={lesson}
      />
    );
  }

  if (lessonSlug === "03") {
    return (
      <LessonThreeExercise
        lesson={lesson}
      />
    );
  }

  if (lessonSlug === "04") {
    return (
      <LessonFourExercise
        lesson={lesson}
      />
    );
  }

  if (lessonSlug === "05") {
    return (
      <LessonFiveExercise
        lesson={lesson}
      />
    );
  }

  if (lessonSlug === "06") {
    return (
      <LessonSixExercise
        lesson={lesson}
      />
    );
  }

  return (
    <LessonSevenExercise
      lesson={lesson}
    />
  );
}

// ======================================================
// ÉVALUATION COMMUNE
// ======================================================

async function requestEvaluation({
  lesson,
  mission,
  answers,
  criteria,
  context,
}: {
  lesson: LessonInfo;
  mission: string;
  answers: EvaluationAnswers;
  criteria: EvaluationRequestCriterion[];
  context?: string;
}) {
  const response =
    await fetch(
      "/api/training/evaluate-practical",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          lessonId:
            lesson.id,

          title:
            lesson.title,

          mission,

          answers,

          criteria,

          context:
            context ?? "",
        }),
      }
    );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ??
        "Impossible d'évaluer l'atelier."
    );
  }

  return data as Evaluation;
}

// ======================================================
// LEÇON 01
// ======================================================

function LessonOneExercise({
  lesson,
}: {
  lesson: LessonInfo;
}) {
  const initialSteps: OrderedItem[] =
    [
      {
        id: "server",
        label:
          "Le serveur reçoit la demande",
      },
      {
        id: "display",
        label:
          "PropertyMatch AI apparaît dans le navigateur",
      },
      {
        id: "url",
        label:
          "L'utilisateur entre propertymatch.ai",
      },
      {
        id: "response",
        label:
          "Le serveur prépare et renvoie une réponse",
      },
      {
        id: "request",
        label:
          "Le navigateur envoie une requête",
      },
      {
        id: "browser",
        label:
          "Le navigateur reçoit les informations",
      },
    ];

  const correctOrder = [
    "url",
    "request",
    "server",
    "response",
    "browser",
    "display",
  ];

  const layerItems = [
    {
      id: "search-form",
      label:
        "Formulaire de recherche",
      expected:
        "frontend",
    },
    {
      id: "button",
      label:
        "Bouton Rechercher",
      expected:
        "frontend",
    },
    {
      id: "cards",
      label:
        "Cartes de logements",
      expected:
        "frontend",
    },
    {
      id: "filter",
      label:
        "Logique de filtrage",
      expected:
        "backend",
    },
    {
      id: "database",
      label:
        "Accès aux données",
      expected:
        "backend",
    },
    {
      id: "score",
      label:
        "Calcul du score",
      expected:
        "backend",
    },
  ];

  const [steps, setSteps] =
    useState(initialSteps);

  const [
    layers,
    setLayers,
  ] = useState<
    Record<string, string>
  >({});

  const [
    explanation,
    setExplanation,
  ] = useState("");

  const orderMatches =
    steps.filter(
      (item, index) =>
        item.id ===
        correctOrder[index]
    ).length;

  const layerMatches =
    layerItems.filter(
      (item) =>
        layers[item.id] ===
        item.expected
    ).length;

  const layersCompleted =
    layerItems.every(
      (item) =>
        Boolean(
          layers[item.id]
        )
    );

  function moveStep(
    index: number,
    direction: -1 | 1
  ) {
    const target =
      index + direction;

    if (
      target < 0 ||
      target >= steps.length
    ) {
      return;
    }

    const next = [...steps];

    [
      next[index],
      next[target],
    ] = [
      next[target],
      next[index],
    ];

    setSteps(next);
  }

  return (
    <PracticeShell
      lesson={lesson}
      title="Faites circuler une page web"
      description="Reconstituez le trajet d'une page puis distinguez frontend et backend."
      progress={
        calculateProgress([
          orderMatches === 6,
          layersCompleted,
          explanation.trim()
            .length >= 20,
        ])
      }
      answers={{
        "Ordre choisi":
          steps
            .map(
              (item) =>
                item.label
            )
            .join(" → "),

        "Ordre correct":
          `${orderMatches}/6`,

        "Frontend / Backend":
          JSON.stringify(
            layers
          ),

        "Classifications exactes":
          `${layerMatches}/6`,

        Explication:
          explanation,
      }}
      ready={
        layersCompleted &&
        explanation.trim()
          .length >= 20
      }
      mission="Reconstituer le parcours d'une page web, distinguer frontend et backend et expliquer le fonctionnement de PropertyMatch AI."
      criteria={[
        {
          name:
            "Parcours web",
          maxScore: 30,
          description:
            "Les différentes étapes d'une requête web sont correctement comprises.",
        },
        {
          name:
            "Frontend",
          maxScore: 20,
          description:
            "Les éléments visibles sont correctement identifiés.",
        },
        {
          name:
            "Backend",
          maxScore: 20,
          description:
            "Les traitements backend sont correctement identifiés.",
        },
        {
          name:
            "Explication",
          maxScore: 20,
          description:
            "Le fonctionnement est expliqué clairement.",
        },
        {
          name:
            "PropertyMatch",
          maxScore: 10,
          description:
            "Les notions sont reliées au projet.",
        },
      ]}
    >

      <ExerciseBlock
        number="01"
        title="Remettez le parcours dans le bon ordre"
        description="Utilisez les flèches pour reconstituer le fonctionnement."
      >

        <div className="space-y-3">

          {steps.map(
            (item, index) => (
              <OrderRow
                key={item.id}
                number={
                  index + 1
                }
                label={
                  item.label
                }
                first={
                  index === 0
                }
                last={
                  index ===
                  steps.length -
                    1
                }
                moveUp={() =>
                  moveStep(
                    index,
                    -1
                  )
                }
                moveDown={() =>
                  moveStep(
                    index,
                    1
                  )
                }
              />
            )
          )}

        </div>

        <ScoreIndicator
          label="Correspondance"
          value={`${orderMatches}/6 étapes correctement placées`}
        />

      </ExerciseBlock>

      <ExerciseBlock
        number="02"
        title="Frontend ou backend ?"
        description="Classez chaque élément de PropertyMatch AI."
      >

        <div className="space-y-3">

          {layerItems.map(
            (item) => (
              <ChoiceCard
                key={item.id}
                title={
                  item.label
                }
                choices={[
                  "frontend",
                  "backend",
                ]}
                labels={{
                  frontend:
                    "Frontend",
                  backend:
                    "Backend",
                }}
                selected={
                  layers[item.id]
                }
                onSelect={(
                  choice
                ) =>
                  setLayers(
                    (
                      current
                    ) => ({
                      ...current,
                      [item.id]:
                        choice,
                    })
                  )
                }
              />
            )
          )}

        </div>

        <ScoreIndicator
          label="Votre résultat"
          value={`${layerMatches}/6 classifications exactes`}
        />

      </ExerciseBlock>

      <TextExercise
        number="03"
        title="Expliquez le fonctionnement"
        description="Décrivez avec vos propres mots ce qui se passe lorsqu'un utilisateur ouvre PropertyMatch AI puis lance une recherche."
        value={explanation}
        onChange={
          setExplanation
        }
        placeholder="L'utilisateur ouvre le site dans son navigateur..."
      />

    </PracticeShell>
  );
}

// ======================================================
// LEÇON 02
// ======================================================

function LessonTwoExercise({
  lesson,
}: {
  lesson: LessonInfo;
}) {
  const structureItems = [
    {
      id: "h1",
      label:
        "Titre principal",
      expected: "h1",
    },
    {
      id: "paragraph",
      label:
        "Texte de présentation",
      expected: "p",
    },
    {
      id: "city",
      label:
        "Champ Ville",
      expected: "input",
    },
    {
      id: "budget",
      label:
        "Champ Budget",
      expected: "input",
    },
    {
      id: "search",
      label:
        "Bouton Rechercher",
      expected: "button",
    },
  ];

  const pageBlocks = [
    "Header",
    "Titre principal",
    "Formulaire",
    "Bouton Rechercher",
    "Résultats",
    "Cartes de logements",
  ];

  const [
    tags,
    setTags,
  ] = useState<
    Record<string, string>
  >({});

  const [
    selectedBlocks,
    setSelectedBlocks,
  ] = useState<string[]>([]);

  const [
    explanation,
    setExplanation,
  ] = useState("");

  const correctTags =
    structureItems.filter(
      (item) =>
        tags[item.id] ===
        item.expected
    ).length;

  const requiredBlocks =
    pageBlocks.length;

  function toggleBlock(
    block: string
  ) {
    setSelectedBlocks(
      (current) =>
        current.includes(
          block
        )
          ? current.filter(
              (item) =>
                item !== block
            )
          : [
              ...current,
              block,
            ]
    );
  }

  return (
    <PracticeShell
      lesson={lesson}
      title="Construisez la structure de PropertyMatch AI"
      description="Choisissez les balises adaptées puis composez la première structure de la page."
      progress={
        calculateProgress([
          Object.keys(tags)
            .length ===
            structureItems.length,

          selectedBlocks.length >=
            requiredBlocks,

          explanation.trim()
            .length >= 20,
        ])
      }
      ready={
        Object.keys(tags)
          .length ===
          structureItems.length &&
        selectedBlocks.length >=
          requiredBlocks &&
        explanation.trim()
          .length >= 20
      }
      mission="Construire la structure d'une interface web en choisissant les balises HTML adaptées et en organisant les blocs de PropertyMatch AI."
      answers={{
        Balises:
          JSON.stringify(tags),

        "Balises exactes":
          `${correctTags}/${structureItems.length}`,

        "Blocs sélectionnés":
          selectedBlocks.join(
            " | "
          ),

        Explication:
          explanation,
      }}
      criteria={[
        {
          name:
            "HTML",
          maxScore: 30,
          description:
            "Les balises sont utilisées selon leur rôle.",
        },
        {
          name:
            "Structure",
          maxScore: 25,
          description:
            "Les blocs indispensables de la page sont identifiés.",
        },
        {
          name:
            "Interface",
          maxScore: 20,
          description:
            "La structure répond au besoin utilisateur.",
        },
        {
          name:
            "Compréhension",
          maxScore: 15,
          description:
            "HTML et CSS sont correctement distingués.",
        },
        {
          name:
            "PropertyMatch",
          maxScore: 10,
          description:
            "Le travail est relié au projet.",
        },
      ]}
    >

      <ExerciseBlock
        number="01"
        title="Choisissez la bonne balise HTML"
        description="Chaque élément possède un rôle différent."
      >

        <div className="space-y-3">

          {structureItems.map(
            (item) => (
              <ChoiceCard
                key={item.id}
                title={
                  item.label
                }
                choices={[
                  "h1",
                  "p",
                  "input",
                  "button",
                ]}
                labels={{
                  h1: "<h1>",
                  p: "<p>",
                  input:
                    "<input />",
                  button:
                    "<button>",
                }}
                selected={
                  tags[item.id]
                }
                onSelect={(
                  choice
                ) =>
                  setTags(
                    (
                      current
                    ) => ({
                      ...current,
                      [item.id]:
                        choice,
                    })
                  )
                }
              />
            )
          )}

        </div>

        <ScoreIndicator
          label="Balises exactes"
          value={`${correctTags}/${structureItems.length}`}
        />

      </ExerciseBlock>

      <ExerciseBlock
        number="02"
        title="Composez votre page"
        description="Sélectionnez tous les blocs nécessaires à la première interface."
      >

        <div className="grid gap-3 sm:grid-cols-2">

          {pageBlocks.map(
            (block) => (
              <ToggleCard
                key={block}
                label={block}
                selected={
                  selectedBlocks.includes(
                    block
                  )
                }
                onClick={() =>
                  toggleBlock(
                    block
                  )
                }
              />
            )
          )}

        </div>

        <div className="mt-6 rounded-2xl bg-slate-950 p-5 text-white">

          <p className="text-xs font-semibold tracking-[0.14em] text-slate-500">
            STRUCTURE CONSTRUITE
          </p>

          <div className="mt-4 space-y-2">

            {selectedBlocks.map(
              (
                block,
                index
              ) => (
                <div
                  key={block}
                  className="rounded-xl bg-slate-900 px-4 py-3 text-sm"
                >
                  {String(
                    index + 1
                  ).padStart(
                    2,
                    "0"
                  )}
                  {" — "}
                  {block}
                </div>
              )
            )}

          </div>

        </div>

      </ExerciseBlock>

      <TextExercise
        number="03"
        title="HTML ou CSS ?"
        description="Expliquez simplement la différence entre HTML et CSS avec PropertyMatch comme exemple."
        value={explanation}
        onChange={
          setExplanation
        }
        placeholder="HTML sert à..., alors que CSS sert à..."
      />

    </PracticeShell>
  );
}

// ======================================================
// LEÇON 03
// ======================================================

function LessonThreeExercise({
  lesson,
}: {
  lesson: LessonInfo;
}) {
  const designProblems = [
    {
      id: "title",
      label:
        "Le titre principal est minuscule et ressemble au texte normal.",
      expected:
        "hiérarchie",
    },
    {
      id: "spacing",
      label:
        "Tous les blocs sont collés les uns aux autres.",
      expected:
        "espacement",
    },
    {
      id: "buttons",
      label:
        "Chaque bouton possède une forme différente.",
      expected:
        "cohérence",
    },
    {
      id: "mobile",
      label:
        "Les trois cartes restent côte à côte sur un petit téléphone.",
      expected:
        "responsive",
    },
  ];

  const [
    answers,
    setAnswers,
  ] = useState<
    Record<string, string>
  >({});

  const [
    desktopColumns,
    setDesktopColumns,
  ] = useState(3);

  const [
    mobileColumns,
    setMobileColumns,
  ] = useState(3);

  const [
    explanation,
    setExplanation,
  ] = useState("");

  const correct =
    designProblems.filter(
      (item) =>
        answers[item.id] ===
        item.expected
    ).length;

  const responsiveCorrect =
    desktopColumns === 3 &&
    mobileColumns === 1;

  return (
    <PracticeShell
      lesson={lesson}
      title="Transformez une interface en produit professionnel"
      description="Diagnostiquez les problèmes de design et rendez la grille responsive."
      progress={
        calculateProgress([
          Object.keys(answers)
            .length ===
            designProblems.length,

          responsiveCorrect,

          explanation.trim()
            .length >= 20,
        ])
      }
      ready={
        Object.keys(answers)
          .length ===
          designProblems.length &&
        explanation.trim()
          .length >= 20
      }
      mission="Analyser et améliorer le design de PropertyMatch AI en appliquant hiérarchie visuelle, cohérence, espacement et responsive."
      answers={{
        Diagnostic:
          JSON.stringify(
            answers
          ),

        "Diagnostics exacts":
          `${correct}/${designProblems.length}`,

        "Colonnes ordinateur":
          String(
            desktopColumns
          ),

        "Colonnes mobile":
          String(
            mobileColumns
          ),

        Explication:
          explanation,
      }}
      criteria={[
        {
          name:
            "Hiérarchie",
          maxScore: 20,
          description:
            "Les problèmes de priorité visuelle sont compris.",
        },
        {
          name:
            "Espacement",
          maxScore: 20,
          description:
            "Les règles d'espacement sont comprises.",
        },
        {
          name:
            "Cohérence",
          maxScore: 20,
          description:
            "Les composants suivent un système visuel commun.",
        },
        {
          name:
            "Responsive",
          maxScore: 25,
          description:
            "La disposition s'adapte correctement aux écrans.",
        },
        {
          name:
            "Explication",
          maxScore: 15,
          description:
            "Les décisions sont justifiées.",
        },
      ]}
    >

      <ExerciseBlock
        number="01"
        title="Diagnostiquez les problèmes"
        description="Associez chaque problème à la règle de design correspondante."
      >

        <div className="space-y-3">

          {designProblems.map(
            (item) => (
              <ChoiceCard
                key={item.id}
                title={
                  item.label
                }
                choices={[
                  "hiérarchie",
                  "espacement",
                  "cohérence",
                  "responsive",
                ]}
                labels={{
                  hiérarchie:
                    "Hiérarchie",
                  espacement:
                    "Espacement",
                  cohérence:
                    "Cohérence",
                  responsive:
                    "Responsive",
                }}
                selected={
                  answers[
                    item.id
                  ]
                }
                onSelect={(
                  value
                ) =>
                  setAnswers(
                    (
                      current
                    ) => ({
                      ...current,
                      [item.id]:
                        value,
                    })
                  )
                }
              />
            )
          )}

        </div>

        <ScoreIndicator
          label="Diagnostics exacts"
          value={`${correct}/${designProblems.length}`}
        />

      </ExerciseBlock>

      <ExerciseBlock
        number="02"
        title="Rendez la grille responsive"
        description="Choisissez combien de cartes PropertyMatch doivent être affichées par ligne."
      >

        <ResponsiveSelector
          label="Ordinateur"
          value={
            desktopColumns
          }
          onChange={
            setDesktopColumns
          }
        />

        <div className="mt-5">

          <ResponsiveSelector
            label="Téléphone"
            value={
              mobileColumns
            }
            onChange={
              setMobileColumns
            }
          />

        </div>

        <div className="mt-6 grid gap-3"
          style={{
            gridTemplateColumns:
              `repeat(${mobileColumns}, minmax(0, 1fr))`,
          }}
        >
          <FakePropertyCard title="Paris 16e" />
          <FakePropertyCard title="Paris 15e" />
          <FakePropertyCard title="Paris 17e" />
        </div>

      </ExerciseBlock>

      <TextExercise
        number="03"
        title="Justifiez votre design"
        description="Expliquez pourquoi une interface lisible et responsive est importante."
        value={explanation}
        onChange={
          setExplanation
        }
        placeholder="Une bonne hiérarchie permet..."
      />

    </PracticeShell>
  );
}

// ======================================================
// LEÇON 04
// ======================================================

function LessonFourExercise({
  lesson,
}: {
  lesson: LessonInfo;
}) {
  const properties: Property[] = [
    {
      id: 1,
      district:
        "Paris 16e",
      price: 2180,
      bedrooms: 2,
      balcony: true,
    },
    {
      id: 2,
      district:
        "Paris 15e",
      price: 1950,
      bedrooms: 1,
      balcony: true,
    },
    {
      id: 3,
      district:
        "Paris 17e",
      price: 2250,
      bedrooms: 2,
      balcony: false,
    },
    {
      id: 4,
      district:
        "Paris 16e",
      price: 2600,
      bedrooms: 3,
      balcony: true,
    },
  ];

  const [
    budget,
    setBudget,
  ] = useState(2300);

  const [
    bedrooms,
    setBedrooms,
  ] = useState(2);

  const [
    balconyOnly,
    setBalconyOnly,
  ] = useState(false);

  const [
    favoriteIds,
    setFavoriteIds,
  ] = useState<number[]>(
    []
  );

  const [
    explanation,
    setExplanation,
  ] = useState("");

  const filtered =
    properties.filter(
      (property) =>
        property.price <=
          budget &&
        property.bedrooms >=
          bedrooms &&
        (!balconyOnly ||
          property.balcony)
    );

  function toggleFavorite(
    id: number
  ) {
    setFavoriteIds(
      (current) =>
        current.includes(id)
          ? current.filter(
              (item) =>
                item !== id
            )
          : [...current, id]
    );
  }

  return (
    <PracticeShell
      lesson={lesson}
      title="Rendez PropertyMatch interactif"
      description="Modifiez l'état de l'interface et observez immédiatement les résultats."
      progress={
        calculateProgress([
          budget !== 2300 ||
            bedrooms !== 2 ||
            balconyOnly,

          favoriteIds.length >
            0,

          explanation.trim()
            .length >= 20,
        ])
      }
      ready={
        favoriteIds.length >
          0 &&
        explanation.trim()
          .length >= 20
      }
      mission="Manipuler l'état d'une interface, déclencher des interactions et comprendre comment PropertyMatch AI réagit aux critères utilisateur."
      answers={{
        Budget:
          String(budget),

        Chambres:
          String(bedrooms),

        Balcon:
          balconyOnly
            ? "Oui"
            : "Non",

        "Résultats":
          String(
            filtered.length
          ),

        Favoris:
          favoriteIds.join(
            ", "
          ),

        Explication:
          explanation,
      }}
      criteria={[
        {
          name:
            "État",
          maxScore: 25,
          description:
            "Les valeurs modifiables de l'interface sont comprises.",
        },
        {
          name:
            "Événements",
          maxScore: 20,
          description:
            "Les actions utilisateur sont reliées à des réactions.",
        },
        {
          name:
            "Filtrage",
          maxScore: 25,
          description:
            "Les critères influencent correctement les résultats.",
        },
        {
          name:
            "Favoris",
          maxScore: 15,
          description:
            "Une interaction d'ajout/retrait est utilisée.",
        },
        {
          name:
            "Explication",
          maxScore: 15,
          description:
            "L'état et les événements sont expliqués.",
        },
      ]}
    >

      <ExerciseBlock
        number="01"
        title="Modifiez l'état de la recherche"
        description="Chaque modification représente une valeur que l'interface doit mémoriser."
      >

        <div className="grid gap-4 md:grid-cols-3">

          <NumberControl
            label="Budget max"
            value={budget}
            suffix=" €"
            min={1500}
            max={3000}
            step={100}
            onChange={
              setBudget
            }
          />

          <NumberControl
            label="Chambres min"
            value={bedrooms}
            min={1}
            max={3}
            step={1}
            onChange={
              setBedrooms
            }
          />

          <button
            type="button"
            onClick={() =>
              setBalconyOnly(
                (current) =>
                  !current
              )
            }
            className={`rounded-2xl border p-5 text-left ${
              balconyOnly
                ? "border-slate-950 bg-slate-950 text-white"
                : "border-slate-200 bg-white"
            }`}
          >
            <p className="text-xs font-semibold opacity-60">
              BALCON
            </p>

            <p className="mt-2 font-bold">
              {balconyOnly
                ? "Obligatoire"
                : "Indifférent"}
            </p>
          </button>

        </div>

      </ExerciseBlock>

      <ExerciseBlock
        number="02"
        title="Observez les résultats"
        description="Le contenu change lorsque l'état de la recherche change."
      >

        <p className="mb-5 font-bold">
          {filtered.length} logement(s)
          compatible(s)
        </p>

        <div className="grid gap-4 md:grid-cols-2">

          {filtered.map(
            (property) => (
              <PropertyResultCard
                key={
                  property.id
                }
                property={
                  property
                }
                favorite={
                  favoriteIds.includes(
                    property.id
                  )
                }
                onFavorite={() =>
                  toggleFavorite(
                    property.id
                  )
                }
              />
            )
          )}

        </div>

        {filtered.length ===
          0 && (
          <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-500">
            Aucun logement ne respecte actuellement tous les critères.
          </div>
        )}

      </ExerciseBlock>

      <TextExercise
        number="03"
        title="État et événement"
        description="Expliquez la différence entre une valeur d'état et un événement utilisateur."
        value={explanation}
        onChange={
          setExplanation
        }
        placeholder="Le budget est un état car..., tandis que cliquer sur..."
      />

    </PracticeShell>
  );
}

// ======================================================
// LEÇON 05
// ======================================================

function LessonFiveExercise({
  lesson,
}: {
  lesson: LessonInfo;
}) {
  const architectureItems =
    [
      {
        id: "home",
        label:
          "Page d'accueil",
        expected:
          "page",
      },
      {
        id: "search",
        label:
          "Page de recherche",
        expected:
          "page",
      },
      {
        id: "favorites",
        label:
          "Page Favoris",
        expected:
          "page",
      },
      {
        id: "card",
        label:
          "Carte de logement",
        expected:
          "component",
      },
      {
        id: "form",
        label:
          "Formulaire de recherche",
        expected:
          "component",
      },
      {
        id: "header",
        label:
          "Header réutilisé",
        expected:
          "component",
      },
    ];

  const [
    architecture,
    setArchitecture,
  ] = useState<
    Record<string, string>
  >({});

  const [
    selectedProps,
    setSelectedProps,
  ] = useState<string[]>(
    []
  );

  const [
    explanation,
    setExplanation,
  ] = useState("");

  const possibleProps = [
    "title",
    "price",
    "district",
    "bedrooms",
    "balcony",
  ];

  const correctArchitecture =
    architectureItems.filter(
      (item) =>
        architecture[
          item.id
        ] ===
        item.expected
    ).length;

  function toggleProp(
    prop: string
  ) {
    setSelectedProps(
      (current) =>
        current.includes(
          prop
        )
          ? current.filter(
              (item) =>
                item !== prop
            )
          : [
              ...current,
              prop,
            ]
    );
  }

  return (
    <PracticeShell
      lesson={lesson}
      title="Organisez PropertyMatch comme une vraie application"
      description="Décidez ce qui doit devenir une page, un composant et quelles données sont transmises."
      progress={
        calculateProgress([
          Object.keys(
            architecture
          ).length ===
            architectureItems.length,

          selectedProps.length >=
            3,

          explanation.trim()
            .length >= 20,
        ])
      }
      ready={
        Object.keys(
          architecture
        ).length ===
          architectureItems.length &&
        selectedProps.length >=
          3 &&
        explanation.trim()
          .length >= 20
      }
      mission="Structurer une application Next.js en distinguant pages, composants et props pour PropertyMatch AI."
      answers={{
        Architecture:
          JSON.stringify(
            architecture
          ),

        "Architecture exacte":
          `${correctArchitecture}/${architectureItems.length}`,

        Props:
          selectedProps.join(
            ", "
          ),

        Explication:
          explanation,
      }}
      criteria={[
        {
          name:
            "Pages",
          maxScore: 20,
          description:
            "Les grandes routes sont correctement identifiées.",
        },
        {
          name:
            "Composants",
          maxScore: 25,
          description:
            "Les blocs réutilisables sont correctement isolés.",
        },
        {
          name:
            "Props",
          maxScore: 20,
          description:
            "Les données nécessaires au composant sont identifiées.",
        },
        {
          name:
            "Architecture",
          maxScore: 20,
          description:
            "L'organisation globale est cohérente.",
        },
        {
          name:
            "Explication",
          maxScore: 15,
          description:
            "Le choix pages/composants est justifié.",
        },
      ]}
    >

      <ExerciseBlock
        number="01"
        title="Page ou composant ?"
        description="Classez chaque partie de l'application."
      >

        <div className="space-y-3">

          {architectureItems.map(
            (item) => (
              <ChoiceCard
                key={item.id}
                title={
                  item.label
                }
                choices={[
                  "page",
                  "component",
                ]}
                labels={{
                  page:
                    "Page",
                  component:
                    "Composant",
                }}
                selected={
                  architecture[
                    item.id
                  ]
                }
                onSelect={(
                  choice
                ) =>
                  setArchitecture(
                    (
                      current
                    ) => ({
                      ...current,
                      [item.id]:
                        choice,
                    })
                  )
                }
              />
            )
          )}

        </div>

        <ScoreIndicator
          label="Architecture exacte"
          value={`${correctArchitecture}/${architectureItems.length}`}
        />

      </ExerciseBlock>

      <ExerciseBlock
        number="02"
        title="Quelles props pour PropertyCard ?"
        description="Choisissez les informations que la carte de logement pourrait recevoir."
      >

        <div className="grid gap-3 sm:grid-cols-2">

          {possibleProps.map(
            (prop) => (
              <ToggleCard
                key={prop}
                label={prop}
                selected={
                  selectedProps.includes(
                    prop
                  )
                }
                onClick={() =>
                  toggleProp(
                    prop
                  )
                }
              />
            )
          )}

        </div>

        <div className="mt-6 overflow-hidden rounded-2xl bg-slate-950 p-5">

          <pre className="overflow-x-auto text-sm leading-7 text-slate-300">
{`<PropertyCard
${selectedProps
  .map(
    (prop) =>
      `  ${prop}={...}`
  )
  .join("\n")}
/>`}
          </pre>

        </div>

      </ExerciseBlock>

      <TextExercise
        number="03"
        title="Pourquoi découper l'application ?"
        description="Expliquez pourquoi il vaut mieux utiliser plusieurs composants plutôt qu'un énorme fichier."
        value={explanation}
        onChange={
          setExplanation
        }
        placeholder="Un composant permet de..."
      />

    </PracticeShell>
  );
}

// ======================================================
// LEÇON 06
// ======================================================

function LessonSixExercise({
  lesson,
}: {
  lesson: LessonInfo;
}) {
  const properties: Property[] = [
    {
      id: 1,
      district:
        "Paris 16e",
      price: 2180,
      bedrooms: 2,
      balcony: true,
    },
    {
      id: 2,
      district:
        "Paris 15e",
      price: 2050,
      bedrooms: 2,
      balcony: false,
    },
    {
      id: 3,
      district:
        "Paris 17e",
      price: 2400,
      bedrooms: 3,
      balcony: true,
    },
    {
      id: 4,
      district:
        "Paris 14e",
      price: 1850,
      bedrooms: 2,
      balcony: true,
    },
  ];

  const [
    budget,
    setBudget,
  ] = useState(2300);

  const [
    bedrooms,
    setBedrooms,
  ] = useState(2);

  const [
    balcony,
    setBalcony,
  ] = useState(true);

  const [
    explanation,
    setExplanation,
  ] = useState("");

  const scored =
    useMemo(
      () =>
        properties
          .map(
            (property) => {
              let score = 0;

              if (
                property.price <=
                budget
              ) {
                score += 40;
              }

              if (
                property.bedrooms >=
                bedrooms
              ) {
                score += 30;
              }

              if (
                !balcony ||
                property.balcony
              ) {
                score += 20;
              }

              if (
                [
                  "Paris 15e",
                  "Paris 16e",
                  "Paris 17e",
                ].includes(
                  property.district
                )
              ) {
                score += 10;
              }

              return {
                ...property,
                score,
              };
            }
          )
          .sort(
            (a, b) =>
              b.score -
              a.score
          ),
      [
        properties,
        budget,
        bedrooms,
        balcony,
      ]
    );

  const best =
    scored[0];

  return (
    <PracticeShell
      lesson={lesson}
      title="Construisez le moteur de PropertyMatch AI"
      description="Configurez la recherche, observez le scoring et analysez pourquoi certains logements arrivent devant les autres."
      progress={
        calculateProgress([
          Boolean(best),
          scored.some(
            (item) =>
              item.score >= 80
          ),
          explanation.trim()
            .length >= 30,
        ])
      }
      ready={
        Boolean(best) &&
        explanation.trim()
          .length >= 30
      }
      mission="Assembler une recherche immobilière fonctionnelle, appliquer un scoring et expliquer le classement produit par PropertyMatch AI."
      answers={{
        Budget:
          String(budget),

        Chambres:
          String(bedrooms),

        Balcon:
          balcony
            ? "Obligatoire"
            : "Optionnel",

        Classement:
          JSON.stringify(
            scored
          ),

        "Meilleur logement":
          best
            ? `${best.district} — ${best.score}%`
            : "",

        Explication:
          explanation,
      }}
      criteria={[
        {
          name:
            "Critères",
          maxScore: 15,
          description:
            "La recherche est correctement configurée.",
        },
        {
          name:
            "Filtrage",
          maxScore: 20,
          description:
            "Les critères influencent les résultats.",
        },
        {
          name:
            "Scoring",
          maxScore: 25,
          description:
            "Le principe de score de compatibilité est compris.",
        },
        {
          name:
            "Classement",
          maxScore: 20,
          description:
            "Les résultats sont interprétés correctement.",
        },
        {
          name:
            "Explication",
          maxScore: 20,
          description:
            "Le fonctionnement global du prototype est expliqué.",
        },
      ]}
    >

      <ExerciseBlock
        number="01"
        title="Configurez la recherche"
        description="Définissez les besoins de votre utilisateur."
      >

        <div className="grid gap-4 md:grid-cols-3">

          <NumberControl
            label="Budget max"
            value={budget}
            suffix=" €"
            min={1500}
            max={3000}
            step={100}
            onChange={
              setBudget
            }
          />

          <NumberControl
            label="Chambres min"
            value={bedrooms}
            min={1}
            max={3}
            step={1}
            onChange={
              setBedrooms
            }
          />

          <button
            type="button"
            onClick={() =>
              setBalcony(
                (current) =>
                  !current
              )
            }
            className={`rounded-2xl border p-5 text-left ${
              balcony
                ? "border-slate-950 bg-slate-950 text-white"
                : "border-slate-200"
            }`}
          >
            <p className="text-xs opacity-60">
              BALCON
            </p>

            <p className="mt-2 font-bold">
              {balcony
                ? "Important"
                : "Optionnel"}
            </p>
          </button>

        </div>

      </ExerciseBlock>

      <ExerciseBlock
        number="02"
        title="Observez le scoring"
        description="PropertyMatch compare maintenant chaque logement avec votre recherche."
      >

        <div className="space-y-4">

          {scored.map(
            (property) => (
              <ScoredProperty
                key={
                  property.id
                }
                district={
                  property.district
                }
                price={
                  property.price
                }
                bedrooms={
                  property.bedrooms
                }
                balcony={
                  property.balcony
                }
                score={
                  property.score
                }
              />
            )
          )}

        </div>

      </ExerciseBlock>

      <TextExercise
        number="03"
        title="Expliquez le classement"
        description="Pourquoi le premier logement obtient-il un meilleur score ? Quelles règles influencent le résultat ?"
        value={explanation}
        onChange={
          setExplanation
        }
        placeholder="Le premier logement obtient un meilleur score car..."
        minimum={30}
      />

    </PracticeShell>
  );
}

// ======================================================
// LEÇON 07
// ======================================================

function LessonSevenExercise({
  lesson,
}: {
  lesson: LessonInfo;
}) {
  const initialSteps: OrderedItem[] =
    [
      {
        id: "deploy",
        label:
          "Déployer la version",
      },
      {
        id: "local",
        label:
          "Vérifier le projet en local",
      },
      {
        id: "url",
        label:
          "Obtenir l'URL publique",
      },
      {
        id: "build",
        label:
          "Créer le build de production",
      },
      {
        id: "host",
        label:
          "Envoyer le projet vers l'hébergement",
      },
    ];

  const correctOrder = [
    "local",
    "build",
    "host",
    "deploy",
    "url",
  ];

  const checks = [
    "Le projet compile sans erreur",
    "Les pages principales fonctionnent",
    "L'interface fonctionne sur mobile",
    "Aucune donnée sensible n'est affichée",
    "Le projet possède un nom clair",
  ];

  const [
    steps,
    setSteps,
  ] = useState(
    initialSteps
  );

  const [
    checklist,
    setChecklist,
  ] = useState<
    string[]
  >([]);

  const [
    explanation,
    setExplanation,
  ] = useState("");

  const orderMatches =
    steps.filter(
      (item, index) =>
        item.id ===
        correctOrder[index]
    ).length;

  function moveStep(
    index: number,
    direction: -1 | 1
  ) {
    const target =
      index + direction;

    if (
      target < 0 ||
      target >= steps.length
    ) {
      return;
    }

    const next = [...steps];

    [
      next[index],
      next[target],
    ] = [
      next[target],
      next[index],
    ];

    setSteps(next);
  }

  function toggleCheck(
    item: string
  ) {
    setChecklist(
      (current) =>
        current.includes(
          item
        )
          ? current.filter(
              (value) =>
                value !== item
            )
          : [
              ...current,
              item,
            ]
    );
  }

  return (
    <PracticeShell
      lesson={lesson}
      title="Préparez PropertyMatch pour sa mise en ligne"
      description="Reconstituez le trajet vers la production et effectuez la checklist avant publication."
      progress={
        calculateProgress([
          orderMatches ===
            correctOrder.length,

          checklist.length ===
            checks.length,

          explanation.trim()
            .length >= 20,
        ])
      }
      ready={
        checklist.length ===
          checks.length &&
        explanation.trim()
          .length >= 20
      }
      mission="Comprendre et préparer les étapes nécessaires pour passer d'une application locale à une application publique."
      answers={{
        "Ordre déploiement":
          steps
            .map(
              (item) =>
                item.label
            )
            .join(" → "),

        "Étapes exactes":
          `${orderMatches}/${correctOrder.length}`,

        Checklist:
          checklist.join(
            " | "
          ),

        Explication:
          explanation,
      }}
      criteria={[
        {
          name:
            "Local / production",
          maxScore: 20,
          description:
            "La différence entre environnement local et production est comprise.",
        },
        {
          name:
            "Build",
          maxScore: 20,
          description:
            "Le rôle du build est compris.",
        },
        {
          name:
            "Déploiement",
          maxScore: 25,
          description:
            "Les étapes sont placées dans un ordre cohérent.",
        },
        {
          name:
            "Vérifications",
          maxScore: 20,
          description:
            "Les contrôles avant publication sont compris.",
        },
        {
          name:
            "Explication",
          maxScore: 15,
          description:
            "Le trajet vers une URL publique est expliqué.",
        },
      ]}
    >

      <ExerciseBlock
        number="01"
        title="Remettez le déploiement dans l'ordre"
        description="Un site doit passer par plusieurs étapes avant d'être accessible publiquement."
      >

        <div className="space-y-3">

          {steps.map(
            (item, index) => (
              <OrderRow
                key={item.id}
                number={
                  index + 1
                }
                label={
                  item.label
                }
                first={
                  index === 0
                }
                last={
                  index ===
                  steps.length -
                    1
                }
                moveUp={() =>
                  moveStep(
                    index,
                    -1
                  )
                }
                moveDown={() =>
                  moveStep(
                    index,
                    1
                  )
                }
              />
            )
          )}

        </div>

        <ScoreIndicator
          label="Correspondance"
          value={`${orderMatches}/${correctOrder.length} étapes correctement placées`}
        />

      </ExerciseBlock>

      <ExerciseBlock
        number="02"
        title="Checklist avant publication"
        description="Validez chaque vérification lorsque vous comprenez pourquoi elle est nécessaire."
      >

        <div className="space-y-3">

          {checks.map(
            (item) => (
              <ToggleCard
                key={item}
                label={item}
                selected={
                  checklist.includes(
                    item
                  )
                }
                onClick={() =>
                  toggleCheck(
                    item
                  )
                }
              />
            )
          )}

        </div>

        <ScoreIndicator
          label="Préparation"
          value={`${checklist.length}/${checks.length} vérifications`}
        />

      </ExerciseBlock>

      <TextExercise
        number="03"
        title="Du localhost à Internet"
        description="Expliquez avec vos mots comment une application locale devient accessible depuis une URL publique."
        value={explanation}
        onChange={
          setExplanation
        }
        placeholder="D'abord le projet fonctionne sur localhost..."
      />

    </PracticeShell>
  );
}

// ======================================================
// PRACTICE SHELL
// ======================================================

function PracticeShell({
  lesson,
  title,
  description,
  progress,
  ready,
  mission,
  answers,
  criteria,
  children,
}: {
  lesson: LessonInfo;
  title: string;
  description: string;
  progress: number;
  ready: boolean;
  mission: string;
  answers: EvaluationAnswers;
  criteria: EvaluationRequestCriterion[];
  children: ReactNode;
}) {
  const [
    evaluation,
    setEvaluation,
  ] = useState<Evaluation | null>(
    null
  );

  const [
    evaluating,
    setEvaluating,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  async function evaluate() {
    if (!ready) {
      return;
    }

    setEvaluating(true);
    setError("");
    setEvaluation(null);

    try {
      const result =
        await requestEvaluation({
          lesson,
          mission,
          answers,
          criteria,

          context:
            "Le projet fil rouge est PropertyMatch AI, une application immobilière qui compare des logements avec les critères d'un utilisateur.",
        });

      setEvaluation(
        result
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible d'évaluer cet atelier."
      );
    } finally {
      setEvaluating(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-6 py-8 text-slate-900">

      <div className="mx-auto max-w-6xl">

        <div className="flex items-center justify-between gap-4">

          <Link
            href={`/formation/python/${lesson.number}`}
            className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            ← Retour à la leçon
          </Link>

          <span className="rounded-full bg-white px-4 py-2 text-sm shadow-sm">
            Atelier · Leçon{" "}
            {lesson.number}
          </span>

        </div>

        <section className="mt-8 overflow-hidden rounded-[30px] bg-slate-950 p-8 text-white shadow-xl md:p-10">

          <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
            ATELIER PRATIQUE
          </p>

          <h1 className="mt-4 text-3xl font-bold md:text-4xl">
            {title}
          </h1>

          <p className="mt-4 max-w-3xl leading-7 text-slate-400">
            {description}
          </p>

          <div className="mt-7">

            <div className="flex justify-between text-sm">

              <span className="text-slate-400">
                Atelier complété
              </span>

              <span>
                {progress}%
              </span>

            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">

              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{
                  width:
                    `${progress}%`,
                }}
              />

            </div>

          </div>

        </section>

        {children}

        <button
          type="button"
          disabled={
            !ready ||
            evaluating
          }
          onClick={
            evaluate
          }
          className="mt-7 w-full rounded-2xl bg-slate-950 px-6 py-5 text-lg font-semibold text-white disabled:bg-slate-200 disabled:text-slate-400"
        >
          {evaluating
            ? "Évaluation de votre atelier..."
            : ready
            ? "Évaluer mon atelier /100 →"
            : "Terminez les 3 étapes"}
        </button>

        {error && (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
            {error}
          </div>
        )}

        {evaluation && (
          <>
            <EvaluationPanel
              evaluation={
                evaluation
              }
            />

            <section className="mt-7 rounded-[28px] bg-slate-950 p-7 text-white">

              <p className="text-xs font-semibold tracking-[0.18em] text-slate-500">
                VALIDATION DE LA LEÇON
              </p>

              <h2 className="mt-4 text-2xl font-bold">
                Passez maintenant au QCM
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-slate-400">
                L&apos;atelier vérifie votre
                compréhension pratique. Le QCM
                reste la validation officielle
                qui débloque la leçon suivante.
              </p>

              <Link
                href={
                  lesson.qcmHref
                }
                className="mt-6 inline-block rounded-2xl bg-white px-6 py-4 font-semibold text-slate-950"
              >
                Commencer le QCM →
              </Link>

            </section>
          </>
        )}

      </div>

    </main>
  );
}

// ======================================================
// UI — EXERCISE BLOCK
// ======================================================

function ExerciseBlock({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-7 rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex gap-4">

        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white">
          {number}
        </span>

        <div>

          <h2 className="text-xl font-bold">
            {title}
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {description}
          </p>

        </div>

      </div>

      <div className="mt-6">
        {children}
      </div>

    </section>
  );
}

// ======================================================
// UI — ORDER
// ======================================================

function OrderRow({
  number,
  label,
  first,
  last,
  moveUp,
  moveDown,
}: {
  number: number;
  label: string;
  first: boolean;
  last: boolean;
  moveUp: () => void;
  moveDown: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4">

      <div className="flex items-center gap-4">

        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold">
          {String(
            number
          ).padStart(
            2,
            "0"
          )}
        </span>

        <p className="font-medium">
          {label}
        </p>

      </div>

      <div className="flex gap-2">

        <button
          type="button"
          onClick={
            moveUp
          }
          disabled={first}
          className="rounded-xl border border-slate-200 px-3 py-2 disabled:opacity-30"
        >
          ↑
        </button>

        <button
          type="button"
          onClick={
            moveDown
          }
          disabled={last}
          className="rounded-xl border border-slate-200 px-3 py-2 disabled:opacity-30"
        >
          ↓
        </button>

      </div>

    </div>
  );
}

// ======================================================
// UI — CHOICE
// ======================================================

function ChoiceCard({
  title,
  choices,
  labels,
  selected,
  onSelect,
}: {
  title: string;
  choices: string[];
  labels: Record<
    string,
    string
  >;
  selected?: string;
  onSelect: (
    value: string
  ) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">

      <p className="font-semibold">
        {title}
      </p>

      <div
        className={`mt-4 grid gap-2 ${
          choices.length === 2
            ? "sm:grid-cols-2"
            : choices.length === 4
            ? "sm:grid-cols-4"
            : "sm:grid-cols-3"
        }`}
      >

        {choices.map(
          (choice) => (
            <button
              key={
                choice
              }
              type="button"
              onClick={() =>
                onSelect(
                  choice
                )
              }
              className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                selected ===
                choice
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-200 hover:border-slate-400"
              }`}
            >
              {labels[
                choice
              ] ?? choice}
            </button>
          )
        )}

      </div>

    </div>
  );
}

// ======================================================
// UI — TOGGLE
// ======================================================

function ToggleCard({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-5 text-left transition ${
        selected
          ? "border-slate-950 bg-slate-950 text-white"
          : "border-slate-200 bg-white hover:border-slate-400"
      }`}
    >
      <span className="font-semibold">
        {selected
          ? "✓ "
          : ""}
        {label}
      </span>
    </button>
  );
}

// ======================================================
// UI — TEXT
// ======================================================

function TextExercise({
  number,
  title,
  description,
  value,
  onChange,
  placeholder,
  minimum = 20,
}: {
  number: string;
  title: string;
  description: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  placeholder: string;
  minimum?: number;
}) {
  return (
    <ExerciseBlock
      number={number}
      title={title}
      description={description}
    >

      <textarea
        value={value}
        onChange={(
          event
        ) =>
          onChange(
            event.target
              .value
          )
        }
        placeholder={
          placeholder
        }
        rows={8}
        className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-5 py-4 leading-7 outline-none transition focus:border-slate-950"
      />

      <p className="mt-3 text-xs text-slate-400">
        Minimum recommandé :
        {" "}
        {minimum} caractères.
      </p>

    </ExerciseBlock>
  );
}

// ======================================================
// UI — SCORE
// ======================================================

function ScoreIndicator({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="mt-5 rounded-2xl bg-slate-50 p-5">

      <p className="text-xs font-semibold tracking-[0.14em] text-slate-400">
        {label.toUpperCase()}
      </p>

      <p className="mt-2 font-bold">
        {value}
      </p>

    </div>
  );
}

// ======================================================
// RESPONSIVE
// ======================================================

function ResponsiveSelector({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (
    value: number
  ) => void;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5">

      <p className="font-bold">
        {label}
      </p>

      <div className="mt-4 grid grid-cols-3 gap-2">

        {[1, 2, 3].map(
          (columns) => (
            <button
              key={
                columns
              }
              type="button"
              onClick={() =>
                onChange(
                  columns
                )
              }
              className={`rounded-xl border px-4 py-3 font-semibold ${
                value ===
                columns
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-200 bg-white"
              }`}
            >
              {columns}
            </button>
          )
        )}

      </div>

    </div>
  );
}

function FakePropertyCard({
  title,
}: {
  title: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">

      <div className="h-20 rounded-xl bg-slate-100" />

      <p className="mt-3 font-bold">
        {title}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        Appartement
      </p>

    </div>
  );
}

// ======================================================
// NUMBER CONTROL
// ======================================================

function NumberControl({
  label,
  value,
  suffix = "",
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  suffix?: string;
  min: number;
  max: number;
  step: number;
  onChange: (
    value: number
  ) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">

      <p className="text-xs font-semibold text-slate-400">
        {label.toUpperCase()}
      </p>

      <p className="mt-2 text-xl font-bold">
        {value}
        {suffix}
      </p>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(
          event
        ) =>
          onChange(
            Number(
              event.target
                .value
            )
          )
        }
        className="mt-5 w-full"
      />

    </div>
  );
}

// ======================================================
// PROPERTY RESULTS
// ======================================================

function PropertyResultCard({
  property,
  favorite,
  onFavorite,
}: {
  property: Property;
  favorite: boolean;
  onFavorite: () => void;
}) {
  return (
    <div className="rounded-[22px] border border-slate-200 p-5">

      <div className="flex items-start justify-between gap-3">

        <div>

          <p className="font-bold">
            {property.district}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {property.bedrooms}
            {" chambre(s) · "}
            {property.balcony
              ? "Balcon"
              : "Sans balcon"}
          </p>

        </div>

        <button
          type="button"
          onClick={
            onFavorite
          }
          className={`rounded-xl px-3 py-2 ${
            favorite
              ? "bg-slate-950 text-white"
              : "bg-slate-100"
          }`}
        >
          {favorite
            ? "♥"
            : "♡"}
        </button>

      </div>

      <p className="mt-4 text-lg font-bold">
        {property.price} €
      </p>

    </div>
  );
}

function ScoredProperty({
  district,
  price,
  bedrooms,
  balcony,
  score,
}: {
  district: string;
  price: number;
  bedrooms: number;
  balcony: boolean;
  score: number;
}) {
  return (
    <div className="rounded-[22px] border border-slate-200 p-5">

      <div className="flex flex-wrap items-start justify-between gap-4">

        <div>

          <p className="font-bold">
            {district}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {price} € ·{" "}
            {bedrooms} chambre(s)
            {" · "}
            {balcony
              ? "Balcon"
              : "Sans balcon"}
          </p>

        </div>

        <div className="rounded-xl bg-slate-950 px-4 py-3 text-center text-white">

          <p className="text-xs text-slate-500">
            SCORE
          </p>

          <p className="mt-1 text-xl font-bold">
            {score}%
          </p>

        </div>

      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">

        <div
          className="h-full rounded-full bg-slate-950"
          style={{
            width:
              `${score}%`,
          }}
        />

      </div>

    </div>
  );
}

// ======================================================
// EVALUATION PANEL
// ======================================================

function EvaluationPanel({
  evaluation,
}: {
  evaluation: Evaluation;
}) {
  return (
    <section className="mt-7 overflow-hidden rounded-[28px] border border-slate-200 bg-white">

      <div className="bg-slate-950 p-7 text-white">

        <p className="text-xs font-semibold tracking-[0.18em] text-slate-500">
          ANALYSE DE VOTRE TRAVAIL
        </p>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-5">

          <div>

            <p className="text-6xl font-bold">
              {evaluation.score}

              <span className="text-2xl text-slate-500">
                /100
              </span>
            </p>

            <p className="mt-2 font-semibold text-slate-300">
              {evaluation.verdict}
            </p>

          </div>

          <div className="w-full max-w-xs">

            <div className="h-2 overflow-hidden rounded-full bg-slate-800">

              <div
                className="h-full rounded-full bg-white"
                style={{
                  width:
                    `${Math.max(
                      0,
                      Math.min(
                        100,
                        evaluation.score
                      )
                    )}%`,
                }}
              />

            </div>

          </div>

        </div>

        <p className="mt-5 max-w-3xl leading-7 text-slate-400">
          {evaluation.summary}
        </p>

      </div>

      <div className="space-y-4 p-6">

        {evaluation.criteria?.map(
          (criterion) => (
            <div
              key={
                criterion.name
              }
              className="rounded-2xl bg-slate-50 p-5"
            >

              <div className="flex justify-between gap-4">

                <p className="font-bold">
                  {criterion.name}
                </p>

                <p className="font-bold">
                  {criterion.score}/
                  {criterion.maxScore}
                </p>

              </div>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {criterion.feedback}
              </p>

            </div>
          )
        )}

        {evaluation.strengths?.length >
          0 && (
          <FeedbackList
            title="Points solides"
            items={
              evaluation.strengths
            }
            prefix="✓"
          />
        )}

        {evaluation.improvements?.length >
          0 && (
          <FeedbackList
            title="À améliorer"
            items={
              evaluation.improvements
            }
            prefix="→"
          />
        )}

        {evaluation.advice && (
          <div className="rounded-2xl bg-slate-950 p-5 text-white">

            <p className="font-bold">
              Conseil pour progresser
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {evaluation.advice}
            </p>

          </div>
        )}

      </div>

    </section>
  );
}

function FeedbackList({
  title,
  items,
  prefix,
}: {
  title: string;
  items: string[];
  prefix: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 p-5">

      <p className="font-bold">
        {title}
      </p>

      <div className="mt-3 space-y-2">

        {items.map(
          (item, index) => (
            <p
              key={
                `${item}-${index}`
              }
              className="text-sm leading-6 text-slate-600"
            >
              {prefix} {item}
            </p>
          )
        )}

      </div>

    </div>
  );
}

// ======================================================
// PROGRESS
// ======================================================

function calculateProgress(
  steps: boolean[]
) {
  const completed =
    steps.filter(Boolean)
      .length;

  return Math.round(
    (completed /
      steps.length) *
      100
  );
}