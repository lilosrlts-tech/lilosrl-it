import { NextResponse } from "next/server";
import { getImpostazioniSito } from "@/lib/impostazioni";

export const dynamic = "force-dynamic";

/** GET pubblico — lettura veloce impostazioni sito (nessuna cache). */
export async function GET() {
  try {
    const data = await getImpostazioniSito();
    return NextResponse.json(
      { data },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Errore interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
