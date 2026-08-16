export default function ProjectValidationNotice({
  completed,
}: {
  completed: boolean;
}) {
  return (
    <section className="rounded-[26px] border border-slate-200 bg-white p-8 shadow-sm">
      <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
        VALIDATION DU PROJET
      </p>
      <h2 className="mt-3 text-2xl font-bold">
        {completed ? "Projet validé" : "Évaluation sécurisée"}
      </h2>
      <p className="mt-3 text-sm leading-6 text-slate-500">
        Ce projet est validé par l’évaluation sécurisée ci-dessus.
      </p>
      <a
        href="#evaluation-projet"
        className="mt-5 inline-block rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white transition hover:scale-[1.02]"
      >
        {completed ? "Refaire l’évaluation" : "Accéder à l’évaluation"}
      </a>
    </section>
  );
}
