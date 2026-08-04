async function main() {
  const urls = [
    "https://www.lilosrl.it/flotta-noleggio/",
    "https://www.lilosrl.it/flotta-noleggio-2/",
    "https://www.lilosrl.it/prezzi/",
    "https://www.lilosrl.it/chi-siamo/",
    "https://www.lilosrl.it/offerta-del-mese/",
    "https://www.lilosrl.it/termini-e-condizioni/",
    "https://www.lilosrl.it/cookie-policy-ue/",
  ];

  for (const u of urls) {
    const r = await fetch(u);
    const t = await r.text();
    const title = (t.match(/<title[^>]*>([^<]+)<\/title>/i) || [])[1] || "";
    const re = /href="(https?:\/\/www\.lilosrl\.it[^"]+|\/[^"]+)"/g;
    const hrefs = [...t.matchAll(re)].map((m) => m[1]);
    const unique = [...new Set(hrefs)].filter((h) =>
      /\/car\/|flotta|noleggio|furgon|pulmin|\/auto|autolavag|contatt|prezz|chi-siamo|offerta|termini|cookie/i.test(
        h,
      ),
    );
    console.log("\n==", u, "status", r.status);
    console.log("title:", title.trim());
    unique.slice(0, 50).forEach((h) => console.log(" ", h));
  }
}

main();
