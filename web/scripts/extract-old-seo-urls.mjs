import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function locs(url) {
  const r = await fetch(url);
  const t = await r.text();
  return [...t.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

function pathOnly(u) {
  try {
    return new URL(u).pathname.replace(/\/$/, "") || "/";
  } catch {
    return u;
  }
}

const pages = await locs("https://www.lilosrl.it/page-sitemap.xml");
const posts = await locs("https://www.lilosrl.it/post-sitemap.xml");
const rentalPages = await locs("https://www.lilosrl.it/car_rental_page-sitemap.xml");
const rentalItems = await locs("https://www.lilosrl.it/car_rental_item-sitemap.xml");

console.log("PAGES", pages.length);
pages.forEach((u) => console.log(u));
console.log("\nPOSTS", posts.length);
posts.forEach((u) => console.log(u));
console.log("\nCAR_RENTAL_PAGE", rentalPages.length);
rentalPages.forEach((u) => console.log(u));
console.log("\nCAR_RENTAL_ITEM", rentalItems.length);
rentalItems.forEach((u) => console.log(u));

const out = {
  extractedAt: new Date().toISOString(),
  pages: pages.map(pathOnly),
  posts: posts.map(pathOnly),
  car_rental_pages: rentalPages.map(pathOnly),
  car_rental_items: rentalItems.map(pathOnly),
  car_rental_items_count: rentalItems.length,
};

writeFileSync(
  join(__dirname, "seo-old-urls-inventory.json"),
  JSON.stringify(out, null, 2),
  "utf8",
);
console.log("\nWrote seo-old-urls-inventory.json");
