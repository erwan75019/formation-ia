import Link from "next/link";

export default function AbonnementAnnulePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f6f8] px-6 py-16 text-slate-950">

      <div className="w-full max-w-xl">

        {/* LOGO */}

        <Link
          href="/"
          className="mx-auto flex w-fit items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white">
            AI
          </div>

          <div>
            <p className="font-bold">
              AI Academy
            </p>

            <p className="text-xs text-slate-400">
              Abonnement
            </p>
          </div>
        </Link>

        {/* CARD */}

        <div className="mt-10 rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-xl md:p-10">

          {/* ICON */}

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl">
            ←
          </div>

          <p className="mt-7 text-sm font-semibold tracking-[0.18em] text-slate-400">
            PAIEMENT ANNULÉ
          </p>

          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            Aucun paiement n’a été effectué.
          </h1>

          <p className="mx-auto mt-5 max-w-md leading-7 text-slate-500">
            Vous avez quitté la page de paiement avant de finaliser
            votre abonnement. Votre carte n’a pas été débitée et
            aucun abonnement n’a été activé.
          </p>

          {/* INFO */}

          <div className="mt-8 rounded-2xl bg-[#f5f6f8] p-5 text-left">

            <p className="text-sm font-semibold">
              Vous pouvez continuer quand vous le souhaitez.
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Retournez aux tarifs pour choisir votre parcours,
              ou revenez à votre espace si vous souhaitez continuer
              plus tard.
            </p>

          </div>

          {/* BUTTONS */}

          <div className="mt-8 flex flex-col gap-3">

            <Link
              href="/tarifs"
              className="rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white transition hover:scale-[1.01]"
            >
              Revenir aux offres →
            </Link>

            <Link
              href="/dashboard"
              className="rounded-2xl border border-slate-200 bg-white px-6 py-4 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Retour au dashboard
            </Link>

          </div>

        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Vous ne serez jamais facturé tant que le paiement Stripe
          n’a pas été confirmé.
        </p>

      </div>

    </main>
  );
}