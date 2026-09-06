"use client";

export default function WorkspaceError({ reset }: { error: Error; reset: () => void }) {
  return <main id="main-content" tabIndex={-1}><p className="eyebrow">ERREUR</p><h1>Impossible de charger votre espace</h1><section className="panel"><p>Vérifiez votre connexion puis réessayez. Vos données n’ont pas été modifiées.</p><button type="button" className="button primary" onClick={reset}>Réessayer</button></section></main>;
}
