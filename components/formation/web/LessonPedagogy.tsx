import Image from "next/image";
import type { ReactNode } from "react";
import type { LessonPedagogyVisual } from "@/lib/training/web/pedagogy";

export default function LessonPedagogyVisual({ src, alt, caption, width, height }: LessonPedagogyVisual) {
  return <figure className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-sm"><Image src={src} alt={alt} width={width} height={height} sizes="(max-width: 768px) 100vw, 960px" className="h-auto w-full rounded-2xl" /><figcaption className="px-3 pb-2 pt-4 text-sm leading-6 text-slate-600">{caption}</figcaption></figure>;
}

const tones = { navy: "border-slate-800 bg-slate-950 text-white", green: "border-emerald-200 bg-emerald-50 text-emerald-950", neutral: "border-slate-200 bg-white text-slate-950", warning: "mt-6 border-amber-200 bg-amber-50 text-amber-950" } as const;

export function LessonCallout({ title, tone, children }: { title: "Objectif concret" | "À retenir" | "Ce que vous devez voir" | "Vérification" | "Erreur fréquente"; tone: keyof typeof tones; children: ReactNode }) {
  return <section className={`rounded-3xl border p-6 ${tones[tone]}`}><h2 className="text-xl font-bold">{title}</h2><div className="mt-3 leading-7">{children}</div></section>;
}
