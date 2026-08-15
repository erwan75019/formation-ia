import Link from "next/link";

// ======================================================
// MODULES
// ======================================================

const modules = [
  {
    number: "01",
    title: "Découvrir ChatGPT",
    description:
      "Comprendre l’interface, les usages et les bases d’une bonne interaction avec une IA.",
  },
  {
    number: "02",
    title: "Maîtriser les prompts",
    description:
      "Structurer des demandes claires, précises et réutilisables pour obtenir de meilleurs résultats.",
  },
  {
    number: "03",
    title: "ChatGPT au quotidien",
    description:
      "Utiliser l’IA pour le travail, les études, la recherche et l’organisation.",
  },
  {
    number: "04",
    title: "Travailler avec ses fichiers grâce à l’IA",
    description:
      "Analyser, résumer et exploiter des documents et des données avec l’intelligence artificielle.",
  },
  {
    number: "05",
    title: "Automatiser son travail avec l’IA",
    description:
      "Construire des workflows, traiter des demandes et contrôler des automatisations assistées par l’IA.",
  },
  {
    number: "06",
    title: "Créer un site web de A à Z",
    description:
      "Construire PropertyMatch AI étape par étape puis publier un véritable site sur Internet.",
  },
  {
    number: "07",
    title: "Créer sa première application web",
    description:
      "Passer d’un site à une application avec logique métier, données, API et fonctionnalités interactives.",
  },
  {
    number: "08",
    title: "Créer et lancer un SaaS IA",
    description:
      "Ajouter comptes utilisateurs, base de données, fonctionnalités IA et logique de produit.",
  },
  {
    number: "09",
    title: "Construire des agents IA",
    description:
      "Créer des systèmes capables de raisonner, choisir des outils et exécuter des actions sous contrôle.",
  },
  {
    number: "10",
    title: "Connecter et automatiser ses outils",
    description:
      "Faire communiquer applications, API et services pour créer des automatisations plus puissantes.",
  },
  {
    number: "11",
    title: "Construire des systèmes IA professionnels",
    description:
      "Assembler architecture, sécurité, données, IA et automatisation dans des systèmes robustes.",
  },
  {
    number: "12",
    title: "Créer et lancer son produit IA",
    description:
      "Concevoir, finaliser et publier un véritable produit IA en réunissant toutes les compétences du parcours.",
  },
];

// ======================================================
// OFFRES
// ======================================================

const plans = [
  {
    id: "fondamentaux",
    name: "Fondamentaux & Automatisation IA",
    label: "Première étape",
    description:
      "Maîtrisez l’utilisation de l’IA au quotidien puis apprenez à construire vos premières automatisations.",
    access: "Modules 1 à 5",
    price: "19,99 €",
    period: "/ an",
    features: [
      "Découvrir et maîtriser ChatGPT",
      "Prompt engineering",
      "ChatGPT au quotidien",
      "Travail avec les fichiers",
      "Automatisations & workflows IA",
      "Exercices et évaluations",
      "Certificat Fondamentaux & Automatisation IA",
      "Accès pendant 1 an",
    ],
  },
  {
    id: "complet",
    name: "Parcours complet",
    label: "Formation complète",
    description:
      "Accédez à toute la formation, des fondamentaux jusqu’à la création de véritables sites, applications, SaaS, agents et systèmes IA.",
    access: "Modules 1 à 12",
    price: "69,99 €",
    period: "/ an",
    features: [
      "Tout le parcours Fondamentaux & Automatisation IA",
      "Créer et publier un vrai site web",
      "Projet PropertyMatch AI",
      "Créer sa première application web",
      "Créer et lancer un SaaS IA",
      "Construire des agents IA",
      "Connecter et automatiser ses outils",
      "Construire des systèmes IA professionnels",
      "Créer et lancer son produit IA",
      "Projet final complet",
      "Certificat Applications & Systèmes IA",
      "Accès pendant 1 an",
    ],
    featured: true,
  },
];

// ======================================================
// FAQ
// ======================================================

const faq = [
  {
    question: "Faut-il déjà savoir programmer ?",
    answer:
      "Non. La formation commence par l’utilisation de ChatGPT et l’automatisation, puis vous accompagne progressivement vers la création de sites, d’applications et de systèmes IA.",
  },
  {
    question: "Est-ce une formation uniquement sur ChatGPT ?",
    answer:
      "Non. ChatGPT constitue le point de départ. Vous apprenez ensuite à automatiser votre travail puis à construire de véritables sites, applications, SaaS et systèmes utilisant l’intelligence artificielle.",
  },
  {
    question: "Puis-je progresser à mon rythme ?",
    answer:
      "Oui. Votre progression est enregistrée dans votre compte. Vous disposez d’un an d’accès à partir de l’activation de votre parcours.",
  },
  {
    question: "Combien de temps ai-je accès à la formation ?",
    answer:
      "Chaque offre donne accès aux modules correspondants pendant 1 an. Vous pouvez apprendre à votre rythme pendant toute cette période.",
  },
  {
    question: "Puis-je renouveler mon accès après un an ?",
    answer:
      "Oui. Votre accès pourra être renouvelé pour une nouvelle période d’un an afin de continuer à consulter la formation et conserver l’accès aux modules de votre parcours.",
  },
  {
    question: "Y a-t-il des exercices et des projets ?",
    answer:
      "Oui. Les leçons combinent apprentissage, pratique, évaluations et projets. À partir du module 6, vous construisez notamment PropertyMatch AI jusqu’à sa publication sur Internet.",
  },
  {
    question: "Qu’est-ce que PropertyMatch AI ?",
    answer:
      "PropertyMatch AI est l’un des grands projets pratiques de la formation. Vous construisez progressivement une véritable plateforme immobilière avec Next.js et React : page d’accueil, recherche de logements, critères personnalisés, score de compatibilité, cartes immobilières, favoris, fiches détaillées, galerie de photos, navigation, formulaire de contact, design premium, responsive et préparation à la mise en ligne. Le projet est réalisé étape par étape directement dans VS Code afin de vous apprendre à passer d’une idée à un véritable site web fonctionnel.",
  },
  {
    question: "Est-ce que PropertyMatch AI est seulement une maquette ?",
    answer:
      "Non. PropertyMatch AI est un véritable projet web construit progressivement pendant la formation. Vous ne créez pas seulement son apparence : vous développez aussi ses pages, ses composants, ses interactions, ses favoris, son système de matching, ses fiches immobilières et son responsive.",
  },
  {
    question: "Comment fonctionnent les certificats ?",
    answer:
      "Le certificat Fondamentaux & Automatisation IA valide les modules 1 à 5. Le certificat Applications & Systèmes IA valide ensuite le parcours avancé et les compétences acquises jusqu’au projet final.",
  },
  {
    question: "Le Parcours complet inclut-il aussi les Fondamentaux ?",
    answer:
      "Oui. Le Parcours complet à 69,99 € par an donne accès à l’intégralité de la formation, soit les modules 1 à 12. Il n’est donc pas nécessaire de souscrire séparément à l’offre Fondamentaux.",
  },
];

// ======================================================
// PAGE
// ======================================================

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f5f6f8] text-slate-950">

      {/* ======================================================
          NAVBAR
      ====================================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white">
              AI
            </div>

            <div>
              <p className="font-bold">
                AI Academy
              </p>

              <p className="text-xs text-slate-400">
                De l’IA aux produits réels
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#programme"
              className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
            >
              Programme
            </a>

            <a
              href="#fonctionnement"
              className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
            >
              Formation
            </a>

            <Link
              href="/tarifs"
              className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
            >
              Tarifs
            </Link>

            <a
              href="#faq"
              className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
            >
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">

            <Link
              href="/connexion"
              className="hidden rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 sm:block"
            >
              Se connecter
            </Link>

            <Link
              href="/inscription"
              className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.02]"
            >
              Commencer
            </Link>

          </div>

        </div>
      </header>

      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="overflow-hidden bg-white">

        <div className="mx-auto max-w-7xl px-6 pb-24 pt-20 md:pb-32 md:pt-28">

          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">

            <div>

              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Formation IA progressive
              </div>

              <h1 className="mt-7 max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
                Apprenez l’IA. Puis construisez de

                <span className="text-slate-400">
                  {" "}
                  véritables produits avec elle.
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-500 md:text-xl">
                Commencez par maîtriser ChatGPT, les fichiers et
                l’automatisation. Puis construisez des sites,
                applications, SaaS et systèmes IA réellement utilisables.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">

                <Link
                  href="/inscription"
                  className="rounded-2xl bg-slate-950 px-7 py-4 text-center font-semibold text-white transition hover:scale-[1.02]"
                >
                  Commencer la formation →
                </Link>

                <a
                  href="#programme"
                  className="rounded-2xl border border-slate-200 bg-white px-7 py-4 text-center font-semibold transition hover:bg-slate-50"
                >
                  Voir le programme
                </a>

              </div>

              <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-slate-500">
                <span>✓ 12 modules</span>
                <span>✓ 74 leçons</span>
                <span>✓ Exercices & projets</span>
                <span>✓ Progression enregistrée</span>
              </div>

            </div>

            {/* MOCK DASHBOARD */}

            <div className="relative">

              <div className="absolute -inset-10 rounded-full bg-slate-100 blur-3xl" />

              <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-[#f5f7fb] p-4 shadow-2xl">

                <div className="rounded-[26px] bg-white p-5">

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white">
                        AI
                      </div>

                      <div>
                        <p className="text-sm font-bold">
                          AI Academy
                        </p>

                        <p className="text-xs text-slate-400">
                          Dashboard étudiant
                        </p>
                      </div>

                    </div>

                    <div className="h-9 w-9 rounded-full bg-slate-100" />

                  </div>

                  <div className="mt-6 rounded-[24px] bg-slate-950 p-6 text-white">

                    <p className="text-[10px] font-semibold tracking-[0.2em] text-slate-500">
                      MODULE ACTUEL
                    </p>

                    <h3 className="mt-3 text-2xl font-bold">
                      Créer un site web de A à Z
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Construisez PropertyMatch AI et publiez votre premier vrai site sur Internet.
                    </p>

                    <div className="mt-6">

                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Progression</span>
                        <span>71%</span>
                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                        <div className="h-full w-[71%] rounded-full bg-white" />
                      </div>

                    </div>

                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">

                    <MockStat
                      value="74"
                      label="Leçons"
                    />

                    <MockStat
                      value="12"
                      label="Modules"
                    />

                    <MockStat
                      value="90%"
                      label="Score"
                    />

                  </div>

                  <div className="mt-4 space-y-3">

                    <MockLesson
                      number="09"
                      title="Automatiser son travail avec l’IA"
                      done
                    />

                    <MockLesson
                      number="10"
                      title="Créer un site web de A à Z"
                    />

                    <MockLesson
                      number="11"
                      title="Créer sa première application web"
                      locked
                    />

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ======================================================
          FORMATION
      ====================================================== */}

      <section
        id="fonctionnement"
        className="border-y border-slate-200 bg-[#eef1f5]"
      >

        <div className="mx-auto max-w-7xl px-6 py-24">

          <div className="max-w-3xl">

            <p className="text-sm font-semibold tracking-[0.2em] text-slate-400">
              UNE FORMATION PROGRESSIVE
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
              Comprendre d’abord. Construire ensuite.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-500">
              Chaque nouvelle notion s’appuie sur les précédentes.
              Vous ne passez pas directement de ChatGPT à un agent complexe :
              vous construisez les compétences nécessaires étape par étape.
            </p>

          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

            <ValueCard
              number="01"
              title="Comprendre"
              description="Les concepts sont introduits avant leur utilisation."
            />

            <ValueCard
              number="02"
              title="Pratiquer"
              description="Chaque leçon se termine par une validation."
            />

            <ValueCard
              number="03"
              title="Assembler"
              description="Les mini-projets relient plusieurs notions."
            />

            <ValueCard
              number="04"
              title="Construire"
              description="Le projet final rassemble toute la formation."
            />

          </div>

        </div>

      </section>

      {/* ======================================================
          PROGRAMME
      ====================================================== */}

      <section
        id="programme"
        className="bg-[#f7f8fa]"
      >

        <div className="mx-auto max-w-7xl px-6 py-24">

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

            <div className="max-w-3xl">

              <p className="text-sm font-semibold tracking-[0.2em] text-slate-400">
                PROGRAMME
              </p>

              <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
                12 modules pour aller jusqu’au produit IA complet
              </h2>

            </div>

            <p className="max-w-md text-sm leading-6 text-slate-500">
              Le parcours commence sans prérequis techniques avancés puis évolue vers la création de sites, d’applications, de SaaS, d’agents et de systèmes IA professionnels.
            </p>

          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            {modules.map((module) => (

              <div
                key={module.number}
                className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
                  {module.number}
                </div>

                <h3 className="mt-5 text-xl font-bold">
                  {module.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {module.description}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* ======================================================
          TECH
      ====================================================== */}

      <section className="bg-slate-950 text-white">

        <div className="mx-auto max-w-7xl px-6 py-24">

          <p className="text-sm font-semibold tracking-[0.2em] text-slate-500">
            DU PROMPT AU PRODUIT
          </p>

          <h2 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight md:text-5xl">
            Apprenez à connecter les briques d’une application IA moderne
          </h2>

          <div className="mt-12 flex flex-wrap items-center gap-3">

            <DarkTag text="Site web" />
            <Arrow />
            <DarkTag text="Application" />
            <Arrow />
            <DarkTag text="API" />
            <Arrow />
            <DarkTag text="Données" />
            <Arrow />
            <DarkTag text="IA" />
            <Arrow />
            <DarkTag text="Agents" />
            <Arrow />
            <DarkTag text="Produit" />

          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">

            <DarkFeature
              title="Créer de vrais produits"
              description="Passer progressivement d’une idée à un site, une application puis un SaaS IA utilisable."
            />

            <DarkFeature
              title="Automatiser et connecter"
              description="Connecter des outils, des API et des systèmes tout en gardant le contrôle sur les actions de l’IA."
            />

            <DarkFeature
              title="Passer en production"
              description="Assembler les différentes briques du projet pour obtenir une application exploitable et prête à évoluer."
            />

          </div>

        </div>

      </section>

      {/* ======================================================
          OFFRES
      ====================================================== */}

      <section className="bg-[#e9edf2]">

        <div className="mx-auto max-w-7xl px-6 py-24">

          <div className="text-center">

            <p className="text-sm font-semibold tracking-[0.2em] text-slate-500">
              OFFRES
            </p>

            <h2 className="mt-4 text-4xl font-bold md:text-5xl">
              Deux façons de commencer
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-500">
              Commencez avec les fondamentaux ou accédez directement
              aux 12 modules avec le Parcours complet.
            </p>

            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400">
              Chaque abonnement donne accès à votre parcours pendant 1 an.
            </p>

          </div>

          <div className="mx-auto mt-12 grid max-w-5xl items-stretch gap-6 lg:grid-cols-2">

            {plans.map((plan) => (

              <div
                key={plan.id}
                className={`relative flex h-full flex-col rounded-[30px] bg-slate-950 p-7 text-white ${
                  plan.featured
                    ? "border-2 border-slate-600 shadow-2xl"
                    : "border border-slate-800 shadow-xl"
                }`}
              >

                {/* BADGE */}

                <div className="h-[52px]">

                  {plan.featured && (

                    <span className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-950">
                      Recommandé
                    </span>

                  )}

                </div>

                {/* HEADER */}

                <div className="min-h-[190px]">

                  <p className="text-sm font-semibold text-slate-400">
                    {plan.label}
                  </p>

                  <h3 className="mt-3 text-3xl font-bold leading-tight">
                    {plan.name}
                  </h3>

                  <p className="mt-4 text-sm leading-6 text-slate-400">
                    {plan.description}
                  </p>

                </div>

                {/* PRIX */}

                <div className="mt-4 border-t border-slate-800 pt-6">

                  <p className="text-xs font-semibold tracking-[0.14em] text-slate-500">
                    ABONNEMENT ANNUEL
                  </p>

                  <div className="mt-3 flex items-end gap-2">

                    <p className="text-4xl font-bold tracking-tight">
                      {plan.price}
                    </p>

                    <p className="pb-1 text-sm font-semibold text-slate-400">
                      {plan.period}
                    </p>

                  </div>

                  <p className="mt-2 text-xs font-semibold text-emerald-400">
                    12 mois d’accès
                  </p>

                </div>

                {/* ACCÈS */}

                <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">

                  <p className="text-xs font-semibold tracking-[0.08em] text-slate-400">
                    ACCÈS
                  </p>

                  <p className="mt-2 text-lg font-bold">
                    {plan.access}
                  </p>

                </div>

                {/* FEATURES */}

                <div className="mt-7 flex-1 space-y-4">

                  {plan.features.map((feature) => (

                    <div
                      key={feature}
                      className="flex items-start gap-3 text-sm"
                    >

                      <span className="mt-[1px] font-bold text-emerald-400">
                        ✓
                      </span>

                      <span className="leading-6 text-slate-300">
                        {feature}
                      </span>

                    </div>

                  ))}

                </div>

                {/* BUTTON */}

                <Link
                  href={`/inscription?plan=${plan.id}`}
                  className={`mt-8 block rounded-2xl px-6 py-4 text-center font-semibold transition hover:scale-[1.02] ${
                    plan.featured
                      ? "bg-white text-slate-950"
                      : "border border-slate-700 bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                >

                  {plan.featured
                    ? "Choisir le Parcours complet →"
                    : "Choisir les Fondamentaux →"}

                </Link>

              </div>

            ))}

          </div>

          <p className="mt-7 text-center text-sm text-slate-500">
            Accès pendant 12 mois · Renouvellement annuel
          </p>

          <div className="mt-5 text-center">

            <Link
              href="/tarifs"
              className="text-sm font-semibold text-slate-500 transition hover:text-slate-950"
            >
              Comparer les deux offres →
            </Link>

          </div>

        </div>

      </section>

      {/* ======================================================
          FAQ
      ====================================================== */}

      <section
        id="faq"
        className="bg-slate-900 text-white"
      >

        <div className="mx-auto max-w-5xl px-6 py-24">

          <div className="text-center">

            <p className="text-sm font-semibold tracking-[0.2em] text-slate-500">
              FAQ
            </p>

            <h2 className="mt-4 text-4xl font-bold">
              Questions fréquentes
            </h2>

          </div>

          <div className="mt-12 space-y-4">

            {faq.map((item) => (

              <div
                key={item.question}
                className="rounded-2xl border border-slate-700 bg-slate-800/70 p-6"
              >

                <h3 className="font-bold text-white">
                  {item.question}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {item.answer}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* ======================================================
          CTA
      ====================================================== */}

      <section className="bg-[#eef1f5]">

        <div className="mx-auto max-w-7xl px-6 py-24">

          <div className="overflow-hidden rounded-[36px] bg-slate-950 px-8 py-14 text-center text-white shadow-2xl md:px-14 md:py-20">

            <p className="text-sm font-semibold tracking-[0.2em] text-slate-500">
              COMMENCEZ MAINTENANT
            </p>

            <h2 className="mx-auto mt-4 max-w-4xl text-4xl font-bold md:text-6xl">
              Apprenez à utiliser l’IA.
              Puis apprenez à construire avec elle.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              Des fondamentaux jusqu’aux sites, SaaS, agents
              et applications IA complètes.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">

              <Link
                href="/inscription?plan=complet"
                className="rounded-2xl bg-white px-7 py-4 font-semibold text-slate-950 transition hover:scale-[1.02]"
              >
                Choisir le Parcours complet →
              </Link>

              <Link
                href="/tarifs"
                className="rounded-2xl border border-slate-700 px-7 py-4 font-semibold transition hover:bg-slate-900"
              >
                Voir les tarifs
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <footer className="border-t border-slate-800 bg-slate-950 text-white">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-6 py-10 md:flex-row md:items-center">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xs font-bold text-slate-950">
              AI
            </div>

            <div>

              <p className="font-bold">
                AI Academy
              </p>

              <p className="text-xs text-slate-500">
                Formation intelligence artificielle
              </p>

            </div>

          </div>

          <div className="flex flex-wrap gap-6 text-sm text-slate-400">

            <Link
              href="/tarifs"
              className="transition hover:text-white"
            >
              Tarifs
            </Link>

            <Link
              href="/connexion"
              className="transition hover:text-white"
            >
              Connexion
            </Link>

            <Link
              href="/inscription"
              className="transition hover:text-white"
            >
              Inscription
            </Link>

          </div>

        </div>

      </footer>

    </main>
  );
}

// ======================================================
// MOCK STAT
// ======================================================

function MockStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">

      <p className="text-lg font-bold">
        {value}
      </p>

      <p className="mt-1 text-[10px] text-slate-400">
        {label}
      </p>

    </div>
  );
}

// ======================================================
// MOCK LESSON
// ======================================================

function MockLesson({
  number,
  title,
  done = false,
  locked = false,
}: {
  number: string;
  title: string;
  done?: boolean;
  locked?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border p-3 ${
        locked
          ? "border-slate-100 opacity-50"
          : "border-slate-200"
      }`}
    >

      <div
        className={`flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-bold ${
          done
            ? "bg-emerald-100 text-emerald-700"
            : "bg-slate-100"
        }`}
      >
        {done
          ? "✓"
          : locked
          ? "🔒"
          : number}
      </div>

      <p className="text-xs font-semibold">
        {title}
      </p>

    </div>
  );
}

// ======================================================
// VALUE CARD
// ======================================================

function ValueCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">

      <p className="text-sm font-bold text-slate-300">
        {number}
      </p>

      <h3 className="mt-5 text-xl font-bold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        {description}
      </p>

    </div>
  );
}

// ======================================================
// DARK TAG
// ======================================================

function DarkTag({
  text,
}: {
  text: string;
}) {
  return (
    <span className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-semibold">
      {text}
    </span>
  );
}

// ======================================================
// ARROW
// ======================================================

function Arrow() {
  return (
    <span className="text-slate-600">
      →
    </span>
  );
}

// ======================================================
// DARK FEATURE
// ======================================================

function DarkFeature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[26px] border border-slate-800 bg-slate-900 p-6">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-bold text-slate-950">
        ✓
      </div>

      <h3 className="mt-5 text-xl font-bold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        {description}
      </p>

    </div>
  );
}