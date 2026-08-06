import Link from "next/link";

const GOLD = "#D4AF37";
const STAFF_IMAGE = "/images/lilo-staff-accoglienza-trieste.webp";
const STAFF_IMAGE_WIDTH = 1024;
const STAFF_IMAGE_HEIGHT = 682;

const PUNTI = [
  "Assistenza personalizzata al desk",
  "Pratiche veloci e chiare, senza clausole nascoste",
  "Supporto diretto prima, durante e dopo il noleggio",
] as const;

/** Blocco staff / accoglienza — stile twin della promo Autolavaggio. */
export function StaffAccoglienzaSection() {
  return (
    <section
      className="border-y border-slate-200 bg-gradient-to-br from-white via-slate-50/80 to-brand-50/30 py-16 sm:py-20"
      aria-labelledby="staff-accoglienza-heading"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-2 lg:gap-14">
        <div className="relative order-2 lg:order-1">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 ring-1 ring-slate-100">
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={STAFF_IMAGE}
                alt="Staff del desk di accoglienza LILO Autonoleggio a Trieste in Viale Campi Elisi 38/b"
                title="Team LILO Autonoleggio Trieste"
                width={STAFF_IMAGE_WIDTH}
                height={STAFF_IMAGE_HEIGHT}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-center"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent"
                aria-hidden="true"
              />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
                  LILO Autonoleggio
                </p>
                <p className="mt-1 text-sm font-medium text-white">
                  Viale Campi Elisi 38/B — Trieste
                </p>
              </div>
            </div>
          </div>
          <div
            className="pointer-events-none absolute -left-3 -top-3 hidden h-24 w-24 rounded-full border-2 border-[#D4AF37]/30 sm:block"
            aria-hidden="true"
          />
        </div>

        <div className="order-1 lg:order-2">
          <p
            className="text-xs font-semibold uppercase tracking-[0.2em] sm:text-sm"
            style={{ color: GOLD }}
          >
            Perché sceglierci
          </p>
          <h2
            id="staff-accoglienza-heading"
            className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            Un&apos;accoglienza umana e un&apos;assistenza su misura
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            Da noi non interagisci con un bot o un terminale automatico: il nostro team ti
            accoglie in sede a Trieste per consigliarti il veicolo perfetto per le tue esigenze
            e fornirti un&apos;assistenza chiara e senza sorprese.
          </p>

          <ul className="mt-6 space-y-3">
            {PUNTI.map((item) => (
              <li key={item} className="flex items-start gap-3 text-slate-700">
                <span
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-600"
                  aria-hidden="true"
                />
                <span className="text-sm font-medium leading-relaxed sm:text-base">{item}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/contatti"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            Vieni in sede a Trieste
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
