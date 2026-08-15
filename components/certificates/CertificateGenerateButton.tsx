"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type CertificateType = "fondamentaux" | "complet";

export default function CertificateGenerateButton({
  type,
}: {
  type: CertificateType;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generateCertificate() {
    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/certificat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type }),
      });

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;

        throw new Error(result?.error ?? "Impossible de générer le certificat.");
      }

      router.refresh();
    } catch (generationError) {
      setError(
        generationError instanceof Error
          ? generationError.message
          : "Impossible de générer le certificat."
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        disabled={pending}
        onClick={generateCertificate}
        className="rounded-xl bg-[#07172c] px-5 py-3 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "Génération…" : "Générer le certificat"}
      </button>

      {error && (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
