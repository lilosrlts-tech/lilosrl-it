import { createAdminClient, getStorageBucketName } from "@/lib/supabase/admin";

let bucketReady = false;

function isBucketMissingError(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("not found") ||
    m.includes("does not exist") ||
    m.includes("bucket not found") ||
    m.includes("invalid bucket")
  );
}

/**
 * Verifica che il bucket Storage esista.
 * Se "veicoli" è già presente su Supabase, salta la creazione.
 * Usa il client service_role (bypass RLS in scrittura).
 */
export async function ensureStorageBucket(): Promise<void> {
  if (bucketReady) return;

  const bucketName = getStorageBucketName();
  const supabase = createAdminClient();

  // 1) getBucket — verifica diretta
  const { data: bucketMeta, error: getError } = await supabase.storage.getBucket(bucketName);
  if (bucketMeta && !getError) {
    bucketReady = true;
    return;
  }

  // 2) listBuckets — fallback se getBucket non disponibile
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (!listError && buckets?.some((b) => b.name === bucketName)) {
    bucketReady = true;
    return;
  }

  // 3) probe — tenta list sul bucket (esiste ma listBuckets fallisce per permessi)
  const { error: probeError } = await supabase.storage.from(bucketName).list("", { limit: 1 });
  if (!probeError || !isBucketMissingError(probeError.message)) {
    bucketReady = true;
    return;
  }

  // 4) Bucket assente — crea solo ora
  const { error: createError } = await supabase.storage.createBucket(bucketName, {
    public: true,
    fileSizeLimit: 10 * 1024 * 1024,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  });

  if (createError && !createError.message.toLowerCase().includes("already exists")) {
    // Ultimo controllo: potrebbe esistere ma la create fallisce per policy
    const { error: retryProbe } = await supabase.storage.from(bucketName).list("", { limit: 1 });
    if (!retryProbe || !isBucketMissingError(retryProbe.message)) {
      bucketReady = true;
      return;
    }

    throw new Error(
      `Impossibile accedere al bucket "${bucketName}": ${createError.message}. ` +
        "Verifica in Supabase → Storage che il bucket 'veicoli' esista ed è pubblico.",
    );
  }

  bucketReady = true;
}

/** Reset cache (utile nei test). */
export function resetStorageBucketCache(): void {
  bucketReady = false;
}
