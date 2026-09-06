"use client";

import { useState } from "react";

export function CopyCodeBlock({ code, label, kind = "code" }: { code: string; label: string; kind?: "terminal" | "code" }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try { await navigator.clipboard.writeText(code); setCopied(true); window.setTimeout(() => setCopied(false), 1800); }
    catch { setCopied(false); }
  }
  const colors = kind === "terminal" ? "bg-[#07172c] text-emerald-100" : "bg-slate-950 text-blue-100";
  return <div className={`mt-5 overflow-hidden rounded-2xl ${colors}`}><div className="flex items-center justify-between gap-4 border-b border-white/15 px-4 py-3"><span className="text-xs font-semibold text-white/70">{kind === "terminal" ? "⌨ Commande terminal" : "{} Code du fichier"} · {label}</span><button type="button" onClick={copy} className="rounded-lg border border-white/40 px-3 py-2 text-xs font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">{copied ? "Copié ✓" : "Copier"}</button></div><pre className="overflow-x-auto p-5 text-sm leading-7"><code>{code}</code></pre></div>;
}

export function LessonChecklist({ items }: { items: readonly string[] }) {
  const [checked, setChecked] = useState<boolean[]>(items.map(() => false));
  const count = checked.filter(Boolean).length;
  return <section className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-6"><div className="flex items-center justify-between gap-4"><h2 className="text-xl font-bold text-emerald-950">12 · Vérification manuelle</h2><span className="text-sm font-bold text-emerald-800" aria-live="polite">{count} / {items.length}</span></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-emerald-100" aria-hidden="true"><div className="h-full bg-emerald-700 transition-[width] motion-reduce:transition-none" style={{ width: `${Math.round((count / items.length) * 100)}%` }} /></div><ul className="mt-5 space-y-3">{items.map((item, index) => <li key={item}><label className="flex cursor-pointer gap-3 rounded-xl bg-white p-4 text-emerald-950"><input type="checkbox" checked={checked[index]} onChange={() => setChecked((current) => current.map((value, currentIndex) => currentIndex === index ? !value : value))} className="mt-1 size-4" /><span>{item}</span></label></li>)}</ul><p className="mt-4 text-sm text-emerald-800">Ces cases servent uniquement de guide local et n’écrivent rien dans Supabase.</p></section>;
}
