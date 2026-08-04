import { Resend } from "resend";
import { COMPANY } from "@/lib/constants";
import { labelDestinazionePreventivo } from "@/lib/preventivo-fields";
import type { PreventivoInput } from "@/lib/preventivo-schema";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDateIt(isoDate: string): string {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

function formatAccessori(data: PreventivoInput): string {
  if (!data.accessori?.length) return "—";
  return data.accessori
    .map(
      (a) =>
        `${a.nome} ×${a.quantita} (${a.prezzo_giornaliero.toFixed(2)} €/gg)`,
    )
    .join("; ");
}

function teamHtml(data: PreventivoInput, toTeam: string): string {
  const rows = [
    ["Veicolo", data.veicolo_name],
    ["Slug", data.veicolo_slug ?? "—"],
    ["Nome", data.nome],
    ["Email", data.email],
    ["Telefono", data.telefono],
    ["Km previsti", `${data.km_previsti} km`],
    ["Destinazione", labelDestinazionePreventivo(data.destinazione)],
    ["Ritiro", formatDateIt(data.data_ritiro)],
    ["Riconsegna", formatDateIt(data.data_riconsegna)],
    ["Accessori", formatAccessori(data)],
    ["Messaggio", data.messaggio?.trim() || "—"],
  ];

  const body = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:13px;">${escapeHtml(k)}</td><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-size:14px;font-weight:600;">${escapeHtml(String(v))}</td></tr>`,
    )
    .join("");

  return `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#f8fafc;padding:24px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
    <div style="background:#0f766e;color:#fff;padding:20px 24px;">
      <h1 style="margin:0;font-size:18px;">Nuova richiesta preventivo</h1>
      <p style="margin:6px 0 0;opacity:.9;font-size:13px;">${escapeHtml(COMPANY.name)} — sito web</p>
    </div>
    <table style="width:100%;border-collapse:collapse;">${body}</table>
    <p style="padding:16px 24px;color:#64748b;font-size:12px;margin:0;">Destinatario interno: ${escapeHtml(toTeam)}</p>
  </div></body></html>`;
}

function clienteHtml(data: PreventivoInput): string {
  return `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#f8fafc;padding:24px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
    <div style="background:#0f766e;color:#fff;padding:20px 24px;">
      <h1 style="margin:0;font-size:18px;">Richiesta ricevuta</h1>
      <p style="margin:6px 0 0;opacity:.9;font-size:13px;">${escapeHtml(COMPANY.name)}</p>
    </div>
    <div style="padding:24px;color:#0f172a;font-size:15px;line-height:1.6;">
      <p>Ciao <strong>${escapeHtml(data.nome)}</strong>,</p>
      <p>abbiamo ricevuto la tua richiesta di preventivo per <strong>${escapeHtml(data.veicolo_name)}</strong>.</p>
      <ul style="padding-left:18px;color:#334155;">
        <li>Km previsti: <strong>${escapeHtml(String(data.km_previsti))} km</strong></li>
        <li>Destinazione: <strong>${escapeHtml(labelDestinazionePreventivo(data.destinazione))}</strong></li>
        <li>Ritiro: <strong>${escapeHtml(formatDateIt(data.data_ritiro))}</strong></li>
        <li>Riconsegna: <strong>${escapeHtml(formatDateIt(data.data_riconsegna))}</strong></li>
        ${
          data.accessori?.length
            ? `<li>Accessori: <strong>${escapeHtml(formatAccessori(data))}</strong></li>`
            : ""
        }
      </ul>
      <p>Ti contatteremo al più presto al numero o all’email indicati.</p>
      <p style="margin-top:24px;">
        Sede: ${escapeHtml(COMPANY.streetAddress)}, ${escapeHtml(COMPANY.city)}<br/>
        Tel. <a href="tel:${COMPANY.phoneE164}" style="color:#0f766e;">${escapeHtml(COMPANY.phone)}</a><br/>
        <a href="https://www.lilosrl.it" style="color:#0f766e;">www.lilosrl.it</a>
      </p>
      <p style="color:#64748b;font-size:13px;">Se non hai inviato tu questa richiesta, puoi ignorare questa email.</p>
    </div>
  </div></body></html>`;
}

export async function sendPreventivoEmails(
  data: PreventivoInput,
  teamTo: string,
): Promise<{ sent: boolean; warning?: string }> {
  if (!isResendConfigured()) {
    return {
      sent: false,
      warning: "RESEND_API_KEY non configurata: email non inviate",
    };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    `${COMPANY.name} <onboarding@resend.dev>`;

  const subjectTeam = `Preventivo: ${data.veicolo_name} — ${data.nome}`;
  const subjectCliente = `Conferma richiesta preventivo — ${COMPANY.name}`;

  const [teamResult, clientResult] = await Promise.all([
    resend.emails.send({
      from,
      to: [teamTo],
      replyTo: data.email,
      subject: subjectTeam,
      html: teamHtml(data, teamTo),
    }),
    resend.emails.send({
      from,
      to: [data.email],
      subject: subjectCliente,
      html: clienteHtml(data),
    }),
  ]);

  const errors = [teamResult.error?.message, clientResult.error?.message].filter(
    Boolean,
  );
  if (errors.length) {
    console.warn("[preventivo:email]", errors.join(" | "));
    return { sent: false, warning: errors.join(" | ") };
  }

  return { sent: true };
}
