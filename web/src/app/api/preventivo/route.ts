import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { getImpostazioniSito } from "@/lib/impostazioni";
import { labelDestinazionePreventivo } from "@/lib/preventivo-fields";
import { parsePreventivo } from "@/lib/preventivo-schema";
import { sendPreventivoEmails } from "@/lib/preventivo-mail";
import { checkRateLimit, clientIpFromRequest } from "@/lib/rate-limit";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { logSupabaseError } from "@/lib/supabase";

function buildMessaggioCompleto(data: ReturnType<typeof parsePreventivo>): string {
  const parts = [
    `Km previsti: ${data.km_previsti} km`,
    `Destinazione: ${labelDestinazionePreventivo(data.destinazione)}`,
    data.messaggio?.trim() || null,
  ].filter(Boolean);
  return parts.join("\n");
}

export async function POST(request: NextRequest) {
  try {
    const ip = clientIpFromRequest(request);
    const limited = checkRateLimit(`preventivo:${ip}`, {
      limit: 8,
      windowMs: 15 * 60 * 1000,
    });
    if (!limited.ok) {
      return NextResponse.json(
        { error: "Troppe richieste. Riprova tra qualche minuto." },
        {
          status: 429,
          headers: { "Retry-After": String(limited.retryAfterSec) },
        },
      );
    }

    const body = await request.json();
    const data = parsePreventivo(body);

    if (data.website) {
      return NextResponse.json({
        data: { ok: true, message: "Richiesta ricevuta" },
      });
    }

    const impostazioni = await getImpostazioniSito();
    const teamEmail = impostazioni.email_preventivi || "info@lilosrl.it";
    const userAgent = request.headers.get("user-agent")?.slice(0, 300) ?? null;
    const messaggioCompleto = buildMessaggioCompleto(data);

    const supabase = createServerSupabaseClient();
    let saved = false;
    if (supabase) {
      const { error } = await supabase.from("richieste_preventivo").insert({
        veicolo_id: data.veicolo_id,
        veicolo_slug: data.veicolo_slug ?? null,
        veicolo_name: data.veicolo_name,
        nome: data.nome,
        email: data.email,
        telefono: data.telefono,
        data_ritiro: data.data_ritiro,
        data_riconsegna: data.data_riconsegna,
        messaggio: messaggioCompleto,
        accessori_json: data.accessori?.length ? data.accessori : null,
        source: "scheda-veicolo",
        user_agent: userAgent,
      });

      if (error) {
        logSupabaseError("preventivo.insert", error.message);
      } else {
        saved = true;
      }
    }

    const mail = await sendPreventivoEmails(
      { ...data, messaggio: messaggioCompleto },
      teamEmail,
    );

    console.info("[preventivo]", {
      veicolo: data.veicolo_name,
      slug: data.veicolo_slug,
      email: data.email,
      km: data.km_previsti,
      destinazione: data.destinazione,
      saved,
      mailSent: mail.sent,
      warning: mail.warning,
      received_at: new Date().toISOString(),
    });

    if (!saved && !mail.sent) {
      return NextResponse.json({
        data: {
          ok: true,
          mailSent: false,
          message:
            "Richiesta registrata. Ti contatteremo al più presto (configura Resend/Supabase in produzione).",
          warning: mail.warning,
        },
      });
    }

    return NextResponse.json({
      data: {
        ok: true,
        mailSent: mail.sent,
        message: mail.sent
          ? "Richiesta ricevuta. Ti abbiamo inviato una email di conferma."
          : "Richiesta salvata. L’email di conferma non è partita (dominio Resend da verificare).",
        warning: mail.warning ?? null,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Dati non validi", details: error.flatten() },
        { status: 422 },
      );
    }
    console.error("[preventivo]", error);
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}
