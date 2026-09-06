import Link from "next/link";
import PricingPlanAction from "@/components/subscription/PricingPlanAction";
import { createClient } from "@/lib/supabase/server";
import {
  hasActiveSubscription,
  isPricingPlan,
} from "@/lib/subscription/pricing";

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
      "12 mois d’accès",
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
      "Tout Fondamentaux & Automatisation IA",
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
      "12 mois d’accès",
    ],
    featured: true,
  },
];

// ======================================================
// COMPARAISON
// ======================================================

const comparison = [
  {
    feature: "Découvrir ChatGPT",
    fondamentaux: true,
    complet: true,
  },
  {
    feature: "Maîtriser les prompts",
    fondamentaux: true,
    complet: true,
  },
  {
    feature: "ChatGPT au quotidien",
    fondamentaux: true,
    complet: true,
  },
  {
    feature: "Travailler avec ses fichiers grâce à l’IA",
    fondamentaux: true,
    complet: true,
  },
  {
    feature: "Automatiser son travail avec l’IA",
    fondamentaux: true,
    complet: true,
  },
  {
    feature: "Créer un site web de A à Z",
    fondamentaux: false,
    complet: true,
  },
  {
    feature: "Créer sa première application web",
    fondamentaux: false,
    complet: true,
  },
  {
    feature: "Créer et lancer un SaaS IA",
    fondamentaux: false,
    complet: true,
  },
  {
    feature: "Construire des agents IA",
    fondamentaux: false,
    complet: true,
  },
  {
    feature: "Connecter et automatiser ses outils",
    fondamentaux: false,
    complet: true,
  },
  {
    feature: "Construire des systèmes IA professionnels",
    fondamentaux: false,
    complet: true,
  },
  {
    feature: "Créer et lancer son produit IA",
    fondamentaux: false,
    complet: true,
  },
  {
    feature: "Certificat Fondamentaux & Automatisation IA",
    fondamentaux: true,
    complet: true,
  },
  {
    feature: "Certificat Applications & Systèmes IA",
    fondamentaux: false,
    complet: true,
  },
  {
    feature: "12 mois d’accès",
    fondamentaux: true,
    complet: true,
  },
];

// ======================================================
// FAQ
// ======================================================

const faq = [
  {
    question: "Comment fonctionne l’abonnement ?",
    answer:
      "Chaque parcours fonctionne avec un abonnement annuel. Une fois votre abonnement activé, vous disposez de 12 mois d’accès aux modules inclus dans votre offre.",
  },
  {
    question: "Le renouvellement est-il annuel ?",
    answer:
      "Oui. Votre accès est prévu pour une période de 12 mois. À l’issue de cette période, l’abonnement peut être renouvelé afin de conserver l’accès à votre formation.",
  },
  {
    question: "Le Parcours complet inclut-il les Fondamentaux ?",
    answer:
      "Oui. Le Parcours complet à 69,99 € par an donne accès à toute la formation, soit les modules 1 à 12. Vous n’avez donc pas besoin de souscrire séparément à l’offre Fondamentaux.",
  },
  {
    question:
      "Puis-je commencer par Fondamentaux puis passer au Parcours complet ?",
    answer:
      "Oui. Votre compte et votre progression sont conservés. Vous pourrez ensuite évoluer vers le Parcours complet pour accéder aux modules 1 à 12.",
  },
  {
    question:
      "Dois-je obligatoirement suivre les Fondamentaux avant le Parcours complet ?",
    answer:
      "Non. Vous pouvez choisir directement le Parcours complet et commencer par le module 1 avant d’avancer jusqu’au module 12.",
  },
  {
    question: "Puis-je progresser à mon rythme ?",
    answer:
      "Oui. Votre progression est enregistrée sur votre compte. Vous pouvez avancer à votre rythme pendant toute la durée de votre abonnement.",
  },
  {
    question: "Qu’est-ce que PropertyMatch AI ?",
    answer:
      "PropertyMatch AI est l’un des grands projets pratiques de la formation. Dans le module 6, vous construisez progressivement une véritable plateforme immobilière avec Next.js et React. Vous créez une page d’accueil premium, un système de recherche de logements selon plusieurs critères, un moteur de matching avec score de compatibilité, des cartes immobilières, des favoris, des fiches détaillées avec galerie de photos, une navigation complète, un formulaire de contact et une interface responsive. Le projet est réalisé étape par étape directement dans VS Code afin de vous apprendre à passer d’une idée à un véritable site web fonctionnel et présentable.",
  },
  {
    question: "PropertyMatch AI est-il seulement une maquette ?",
    answer:
      "Non. Vous ne construisez pas uniquement son apparence. Vous développez également les pages, les composants, les interactions, les favoris, le système de matching, les fiches immobilières, le responsive et la préparation à la mise en ligne.",
  },
  {
    question: "Comment fonctionnent les certificats ?",
    answer:
      "Le certificat Fondamentaux & Automatisation IA valide les modules 1 à 5. Le certificat Applications & Systèmes IA valide ensuite le parcours avancé jusqu’au projet final.",
  },
  {
    question: "Que se passe-t-il si mon abonnement expire ?",
    answer:
      "Lorsque votre période d’accès prend fin, les modules associés à votre abonnement ne sont plus accessibles tant que l’abonnement n’est pas renouvelé. Votre compte et votre progression peuvent cependant être conservés.",
  },
  {
    question: "Les paiements seront-ils sécurisés ?",
    answer:
      "Oui. Les paiements seront gérés par Stripe. AI Academy ne stockera pas directement vos informations bancaires.",
  },
];

// ======================================================
// PAGE
// ======================================================

export default async function PricingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("plan, subscription_status")
        .eq("id", user.id)
        .maybeSingle()
    : { data: null };

  const activePlan = isPricingPlan(profile?.plan) ? profile.plan : null;
  const subscriptionIsActive = hasActiveSubscription(
    profile?.subscription_status
  );

  return (
    <main className="min-h-screen bg-[#f5f6f8] text-slate-950">

      {/* ======================================================
          NAVBAR
      ====================================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link
            href="/"
            className="flex items-center gap-3"
          >

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

            <Link
              href="/#programme"
              className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
            >
              Programme
            </Link>

            <Link
              href="/tarifs"
              className="text-sm font-semibold text-slate-950"
            >
              Tarifs
            </Link>

            <Link
              href="#faq"
              className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
            >
              FAQ
            </Link>

          </nav>

          <div className="flex items-center gap-3">

            {user ? (
              <Link
                href="/dashboard"
                className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.02]"
              >
                Mon espace
              </Link>
            ) : (
              <>
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
              </>
            )}

          </div>

        </div>

      </header>

      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-6 pb-20 pt-20 text-center md:pb-24 md:pt-24">

          <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">

            <span className="h-2 w-2 rounded-full bg-emerald-500" />

            2 parcours disponibles

          </div>

          <h1 className="mx-auto mt-7 max-w-5xl text-5xl font-bold tracking-tight md:text-7xl">

            Choisissez jusqu’où

            <span className="text-slate-400">
              {" "}
              vous voulez aller.
            </span>

          </h1>

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-slate-500 md:text-xl">

            Maîtrisez les fondamentaux de l’IA et l’automatisation
            ou accédez directement à toute la formation pour construire
            des sites, applications, SaaS, agents et systèmes IA.

          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-semibold text-slate-600">

            <span>
              ✓ Accès pendant 12 mois
            </span>

            <span>
              ✓ Progression enregistrée
            </span>

            <span>
              ✓ Renouvellement annuel
            </span>

          </div>

        </div>

      </section>

      {/* ======================================================
          OFFRES
      ====================================================== */}

      <section id="offres" className="scroll-mt-20 bg-[#e9edf2]">

        <div className="mx-auto max-w-7xl px-6 py-24">

          <div className="grid items-stretch gap-7 lg:grid-cols-2">

            {plans.map((plan) => (

              <div
                key={plan.id}
                className={`relative flex h-full flex-col rounded-[34px] bg-[#020817] p-8 text-white ${
                  plan.featured
                    ? "border-2 border-slate-500 shadow-2xl"
                    : "border border-slate-800 shadow-xl"
                }`}
              >

                {/* BADGE */}

                <div className="h-[54px]">

                  {plan.featured && (

                    <span className="inline-flex rounded-full bg-white px-5 py-2.5 text-xs font-bold text-slate-950">
                      Recommandé
                    </span>

                  )}

                </div>

                {/* HEADER */}

                <div className="min-h-[230px]">

                  <p className="text-sm font-semibold text-slate-400">
                    {plan.label}
                  </p>

                  <h2 className="mt-4 max-w-xl text-4xl font-bold leading-tight tracking-tight md:text-5xl">
                    {plan.name}
                  </h2>

                  <p className="mt-5 max-w-xl text-base leading-7 text-slate-400">
                    {plan.description}
                  </p>

                </div>

                {/* PRIX */}

                <div className="mt-6 border-t border-slate-800 pt-7">

                  <p className="text-xs font-semibold tracking-[0.16em] text-slate-500">
                    ABONNEMENT ANNUEL
                  </p>

                  <div className="mt-3 flex items-end gap-3">

                    <p className="text-5xl font-bold tracking-tight">
                      {plan.price}
                    </p>

                    <p className="pb-1 text-base font-semibold text-slate-400">
                      {plan.period}
                    </p>

                  </div>

                  <p className="mt-3 text-sm font-semibold text-emerald-400">
                    12 mois d’accès
                  </p>

                </div>

                {/* ACCÈS */}

                <div className="mt-8 rounded-[22px] border border-slate-800 bg-[#111a2e] p-6">

                  <p className="text-xs font-semibold tracking-[0.1em] text-slate-400">
                    ACCÈS
                  </p>

                  <p className="mt-3 text-xl font-bold">
                    {plan.access}
                  </p>

                </div>

                {/* FEATURES */}

                <div className="mt-8 flex-1 space-y-5">

                  {plan.features.map((feature) => (

                    <div
                      key={feature}
                      className="flex items-start gap-4 text-sm"
                    >

                      <span className="mt-[1px] text-lg font-bold text-emerald-400">
                        ✓
                      </span>

                      <span className="leading-6 text-slate-300">
                        {feature}
                      </span>

                    </div>

                  ))}

                </div>

                {/* CTA */}

                <PricingPlanAction
                  plan={plan.id as "fondamentaux" | "complet"}
                  authenticated={Boolean(user)}
                  activePlan={activePlan}
                  hasActiveSubscription={subscriptionIsActive}
                  className={`mt-10 block rounded-2xl px-6 py-5 text-center text-base font-bold transition hover:scale-[1.01] ${
                    plan.featured
                      ? "bg-white text-slate-950"
                      : "border border-slate-700 bg-[#111a2e] text-white hover:bg-slate-800"
                  }`}
                  visitorLabel={plan.featured
                    ? "Choisir le Parcours complet →"
                    : "Choisir les Fondamentaux →"}
                />

              </div>

            ))}

          </div>

          <p className="mt-8 text-center text-sm font-medium text-slate-500">
            Abonnement annuel · 12 mois d’accès · Renouvellement annuel
          </p>

        </div>

      </section>

      {/* ======================================================
          COMPARAISON
      ====================================================== */}

      <section className="bg-[#f5f6f8]">

        <div className="mx-auto max-w-6xl px-6 py-24">

          <div className="max-w-3xl">

            <p className="text-sm font-semibold tracking-[0.2em] text-slate-400">
              COMPARAISON
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
              Comparez les deux parcours.
            </h2>

            <p className="mt-5 leading-7 text-slate-500">

              Fondamentaux donne accès aux modules 1 à 5.
              Le Parcours complet inclut toute la formation,
              des modules 1 à 12.

            </p>

          </div>

          <div className="mt-12 overflow-x-auto rounded-[28px] border border-slate-200 bg-white shadow-sm">

            <div className="min-w-[720px]">

              {/* HEADER */}

              <div className="grid grid-cols-[1.6fr_repeat(2,1fr)] border-b border-slate-200 bg-slate-950 text-white">

                <div className="p-5 font-semibold">
                  Module / compétence
                </div>

                <div className="p-5 text-center font-semibold">
                  Fondamentaux
                </div>

                <div className="p-5 text-center font-semibold">
                  Parcours complet
                </div>

              </div>

              {/* ROWS */}

              {comparison.map((row, index) => (

                <div
                  key={row.feature}
                  className={`grid grid-cols-[1.6fr_repeat(2,1fr)] ${
                    index !== comparison.length - 1
                      ? "border-b border-slate-200"
                      : ""
                  }`}
                >

                  <div className="p-5 text-sm font-medium">
                    {row.feature}
                  </div>

                  <ComparisonValue
                    value={row.fondamentaux}
                  />

                  <ComparisonValue
                    value={row.complet}
                  />

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>

      {/* ======================================================
          ACCÈS
      ====================================================== */}

      <section className="bg-slate-950 text-white">

        <div className="mx-auto max-w-7xl px-6 py-24">

          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">

            <div>

              <p className="text-sm font-semibold tracking-[0.2em] text-slate-500">
                VOTRE ABONNEMENT
              </p>

              <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
                Votre offre détermine les modules accessibles.
              </h2>

              <p className="mt-6 max-w-xl leading-8 text-slate-400">

                Votre progression reste enregistrée sur votre compte.
                Tant que votre abonnement est actif, vous pouvez revenir
                librement sur les modules inclus dans votre parcours.

              </p>

            </div>

            <div className="overflow-hidden rounded-[28px] border border-slate-800 bg-slate-900">

              <AccessRow
                plan="Fondamentaux & Automatisation IA"
                modules="Modules 01 → 05"
              />

              <AccessRow
                plan="Parcours complet"
                modules="Modules 01 → 12"
                last
              />

            </div>

          </div>

        </div>

      </section>

      {/* ======================================================
          MODULES
      ====================================================== */}

      <section
        className="bg-white"
        id="programme"
      >

        <div className="mx-auto max-w-7xl px-6 py-24">

          <div className="max-w-3xl">

            <p className="text-sm font-semibold tracking-[0.2em] text-slate-400">
              LES 12 MODULES
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
              De la découverte de ChatGPT au lancement de votre produit IA.
            </h2>

            <p className="mt-5 leading-7 text-slate-500">
              Le Parcours complet donne accès aux 12 modules pendant toute
              la durée de votre abonnement annuel.
            </p>

          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            <ModuleCard
              number="01"
              title="Découvrir ChatGPT"
              description="Comprendre l’interface, les usages et les bases d’une bonne interaction avec une IA."
            />

            <ModuleCard
              number="02"
              title="Maîtriser les prompts"
              description="Structurer des demandes claires, précises et réutilisables pour obtenir de meilleurs résultats."
            />

            <ModuleCard
              number="03"
              title="ChatGPT au quotidien"
              description="Utiliser l’IA pour le travail, les études, la recherche et l’organisation."
            />

            <ModuleCard
              number="04"
              title="Travailler avec ses fichiers grâce à l’IA"
              description="Analyser, résumer et exploiter des documents et des données avec l’intelligence artificielle."
            />

            <ModuleCard
              number="05"
              title="Automatiser son travail avec l’IA"
              description="Construire des workflows, traiter des demandes et contrôler des automatisations assistées par l’IA."
            />

            <ModuleCard
              number="06"
              title="Créer un site web de A à Z"
              description="Construire PropertyMatch AI, une plateforme immobilière complète avec recherche personnalisée, score de compatibilité, favoris, fiches détaillées, galerie de photos, design premium et responsive avant sa publication sur Internet."
            />

            <ModuleCard
              number="07"
              title="Créer sa première application web"
              description="Passer d’un site à une application avec logique métier, données, API et fonctionnalités interactives."
            />

            <ModuleCard
              number="08"
              title="Créer et lancer un SaaS IA"
              description="Construire un véritable produit avec comptes utilisateurs, fonctionnalités IA et logique SaaS."
            />

            <ModuleCard
              number="09"
              title="Construire des agents IA"
              description="Créer des systèmes capables de raisonner, choisir des outils et exécuter des actions."
            />

            <ModuleCard
              number="10"
              title="Connecter et automatiser ses outils"
              description="Faire communiquer applications, API et services pour créer des automatisations plus puissantes."
            />

            <ModuleCard
              number="11"
              title="Construire des systèmes IA professionnels"
              description="Assembler architecture, sécurité, données, IA et automatisation dans des systèmes robustes."
            />

            <ModuleCard
              number="12"
              title="Créer et lancer son produit IA"
              description="Concevoir, finaliser et publier un véritable produit IA en réunissant toutes les compétences du parcours."
            />

          </div>

        </div>

      </section>

      {/* ======================================================
          FAQ
      ====================================================== */}

      <section
        className="bg-[#eef1f5]"
        id="faq"
      >

        <div className="mx-auto max-w-5xl px-6 py-24">

          <div className="text-center">

            <p className="text-sm font-semibold tracking-[0.2em] text-slate-400">
              FAQ
            </p>

            <h2 className="mt-4 text-4xl font-bold">
              Questions sur les parcours
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-500">
              Retrouvez les réponses aux principales questions sur
              l’abonnement, l’accès et les projets réalisés pendant la formation.
            </p>

          </div>

          <div className="mt-12 space-y-4">

            {faq.map((item) => (

              <div
                key={item.question}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >

                <h3 className="font-bold">
                  {item.question}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-500">
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

      <section className="bg-[#f5f6f8]">

        <div className="mx-auto max-w-7xl px-6 py-24">

          <div className="rounded-[36px] bg-slate-950 px-8 py-16 text-center text-white shadow-2xl md:px-14">

            <p className="text-sm font-semibold tracking-[0.2em] text-slate-500">
              AI ACADEMY
            </p>

            <h2 className="mx-auto mt-4 max-w-4xl text-4xl font-bold md:text-5xl">
              Apprenez l’IA puis construisez de vrais produits.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-400">

              Commencez par les fondamentaux ou accédez directement
              aux 12 modules avec le Parcours complet.

            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

              <PricingPlanAction
                plan="complet"
                authenticated={Boolean(user)}
                activePlan={activePlan}
                hasActiveSubscription={subscriptionIsActive}
                className="rounded-2xl bg-white px-7 py-4 font-semibold text-slate-950 transition hover:scale-[1.02]"
                visitorLabel="Choisir le Parcours complet →"
              />

              <PricingPlanAction
                plan="fondamentaux"
                authenticated={Boolean(user)}
                activePlan={activePlan}
                hasActiveSubscription={subscriptionIsActive}
                className="rounded-2xl border border-slate-700 px-7 py-4 font-semibold transition hover:bg-slate-900"
                visitorLabel="Choisir les Fondamentaux"
              />

            </div>

          </div>

        </div>

      </section>

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <footer className="border-t border-slate-800 bg-slate-950 text-white">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-6 py-10 md:flex-row md:items-center">

          <Link
            href="/"
            className="flex items-center gap-3"
          >

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xs font-bold text-slate-950">
              AI
            </div>

            <div>

              <p className="font-bold">
                AI Academy
              </p>

              <p className="text-xs text-slate-500">
                De l’IA aux produits réels
              </p>

            </div>

          </Link>

          <div className="flex flex-wrap gap-6 text-sm text-slate-400">

            <Link
              href="/"
              className="transition hover:text-white"
            >
              Accueil
            </Link>

            <Link
              href="/#programme"
              className="transition hover:text-white"
            >
              Programme
            </Link>

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

          </div>

        </div>

      </footer>

    </main>
  );
}

// ======================================================
// COMPARISON VALUE
// ======================================================

function ComparisonValue({
  value,
}: {
  value: boolean;
}) {
  return (
    <div className="flex items-center justify-center p-5">

      {value ? (

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
          ✓
        </div>

      ) : (

        <span className="text-slate-300">
          —
        </span>

      )}

    </div>
  );
}

// ======================================================
// ACCESS ROW
// ======================================================

function AccessRow({
  plan,
  modules,
  last = false,
}: {
  plan: string;
  modules: string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-6 p-6 ${
        !last
          ? "border-b border-slate-800"
          : ""
      }`}
    >

      <div>

        <p className="font-bold">
          {plan}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Abonnement annuel
        </p>

      </div>

      <span className="rounded-xl bg-slate-800 px-4 py-3 text-sm font-semibold">
        {modules}
      </span>

    </div>
  );
}

// ======================================================
// MODULE CARD
// ======================================================

function ModuleCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white">
        {number}
      </div>

      <h3 className="mt-7 text-xl font-bold leading-7">
        {title}
      </h3>

      <p className="mt-4 text-sm leading-7 text-slate-500">
        {description}
      </p>

    </div>
  );
}
