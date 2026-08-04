/**
 * Rate limit in-memory per IP (adatto a singolo nodo / serverless warm).
 * Su più istanze usare Redis/Upstash; qui è protezione base anti-spam.
 */

type Bucket = { timestamps: number[] };

const buckets = new Map<string, Bucket>();

export function checkRateLimit(
  key: string,
  opts: { limit: number; windowMs: number } = { limit: 8, windowMs: 15 * 60 * 1000 },
): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  const windowStart = now - opts.windowMs;
  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = { timestamps: [] };
    buckets.set(key, bucket);
  }
  bucket.timestamps = bucket.timestamps.filter((t) => t > windowStart);

  if (bucket.timestamps.length >= opts.limit) {
    const oldest = bucket.timestamps[0] ?? now;
    const retryAfterSec = Math.max(1, Math.ceil((oldest + opts.windowMs - now) / 1000));
    return { ok: false, retryAfterSec };
  }

  bucket.timestamps.push(now);

  // Evita crescita infinita della Map
  if (buckets.size > 5_000) {
    for (const [k, b] of buckets) {
      b.timestamps = b.timestamps.filter((t) => t > windowStart);
      if (b.timestamps.length === 0) buckets.delete(k);
    }
  }

  return { ok: true };
}

export function clientIpFromRequest(request: Request): string {
  const xf = request.headers.get("x-forwarded-for");
  if (xf) {
    const first = xf.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = request.headers.get("x-real-ip")?.trim();
  if (real) return real;
  return "unknown";
}
