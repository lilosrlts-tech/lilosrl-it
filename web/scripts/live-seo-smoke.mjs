/**
 * Smoke check live SEO / copy dopo deploy.
 * Uso: node scripts/live-seo-smoke.mjs
 */
const BASE = "https://www.lilosrl.it";

const pages = [
  "/",
  "/flotta",
  "/flotta/furgoni-grandi",
  "/flotta/furgoni-medi",
  "/flotta/ford-transit-l2h2",
  "/flotta/fiat-ducato-l1h1",
  "/flotta/citroen-jumper-l2h2",
  "/flotta/renault-master-l2h2",
  "/flotta/peugeot-boxer-l3h3",
  "/guide",
  "/noleggio-furgoni-trieste",
  "/chi-siamo",
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.webmanifest",
  "/icon",
];

function count(html, re) {
  return (html.match(re) || []).length;
}

async function headOrGet(path) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, { redirect: "manual" });
  const text = res.status < 400 && !path.match(/\.(xml|txt|webmanifest)$/) && path !== "/icon"
    ? await res.text()
    : path.match(/\.(xml|txt|webmanifest)$/)
      ? await res.text()
      : "";
  return { path, status: res.status, location: res.headers.get("location"), text };
}

const results = [];
for (const path of pages) {
  results.push(await headOrGet(path));
}

// redirects
for (const path of ["/noleggio-furgoni", "/noleggio-auto", "/questa-pagina-non-esiste-xyz"]) {
  const res = await fetch(`${BASE}${path}`, { redirect: "manual" });
  results.push({
    path,
    status: res.status,
    location: res.headers.get("location"),
    text: "",
  });
}

console.log("=== HTTP STATUS ===");
for (const r of results) {
  console.log(
    `${r.status} ${r.path}${r.location ? " -> " + r.location : ""}`,
  );
}

const contentPages = results.filter((r) => r.text && r.text.length > 100);
let foto = 0;
let unitaDisp = 0;
let veicoliDisp = 0;
let triDup = 0;
let modelliCat = 0;
let unitaFlotta = 0;
let canonHome = null;

for (const r of contentPages) {
  foto += count(r.text, /Foto in arrivo/gi);
  unitaDisp += count(r.text, /unit[aà]\s+disponibil/gi);
  veicoliDisp += count(r.text, /veicoli\s+disponibil/gi);
  triDup += count(r.text, /Trieste \(TS\),\s*Trieste/gi);
  modelliCat += count(r.text, /modelli in catalogo/gi);
  unitaFlotta += count(r.text, /unit[aà] in flotta/gi);
  if (r.path === "/") {
    const m = r.text.match(/rel="canonical"\s+href="([^"]+)"/i)
      || r.text.match(/href="([^"]+)"\s+rel="canonical"/i);
    canonHome = m?.[1] ?? null;
    const ld = [...r.text.matchAll(/application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)]
      .map((x) => x[1])
      .join("\n");
    console.log("\n=== HOME JSON-LD snippets ===");
    console.log("has AutoRental:", /AutoRental/.test(ld));
    console.log("has #autolavaggio:", /#autolavaggio/.test(ld));
    console.log("has oltre 50:", /oltre 50 mezzi/i.test(ld));
    console.log("has Foto in arrivo in LD:", /Foto in arrivo/i.test(ld));
  }
}

console.log("\n=== COPY SCAN ===");
console.log({ foto, unitaDisp, veicoliDisp, triDup, modelliCat, unitaFlotta, canonHome });

const home = contentPages.find((r) => r.path === "/");
if (home) {
  console.log("home has fleet identity:", /flotta reale di oltre 50 mezzi/i.test(home.text));
}

const flotta = contentPages.find((r) => r.path === "/flotta");
if (flotta) {
  console.log(
    "flotta address sample:",
    (flotta.text.match(/Viale Campi Elisi[^<]{0,80}/) || [])[0],
  );
}

process.exit(foto > 0 || triDup > 0 || veicoliDisp > 0 ? 1 : 0);
