import { NextResponse } from "next/server";

export async function POST() {
  // Désactivée jusqu'à son remplacement par la validation serveur centralisée.
  return NextResponse.json(
    { error: "Cette route de validation n’est plus disponible." },
    { status: 410 }
  );
}
