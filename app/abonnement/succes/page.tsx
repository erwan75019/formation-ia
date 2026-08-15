import Link from "next/link";

export default function AbonnementSuccesPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f6f8] px-6 py-16 text-slate-950">
      <div className="w-full max-w-xl rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-xl md:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700">
          ✓
        </div>

        <p className="mt-7 text-sm font-semibold tracking-[0.18em] text-emerald-600">
          PAIEMENT CONFIRMÉ
        </p>

        <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
          Merci pour votre abonnement.
        </h1>

        <p className="mx-auto mt-5 max-w-md leading-7 text-slate-500">
          Votre paiement a bien été pris en compte. Vous pouvez maintenant
          retourner à votre espace de formation.
        </p>

        <Link
          href="/dashboard"
          className="mt-8 inline-flex rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white transition hover:scale-[1.01]"
        >
          Accéder au dashboard →
        </Link>
      </div>
    </main>
  );
}
