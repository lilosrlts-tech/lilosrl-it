import type { ApiErrorBody } from "@/types/database";

export class ApiClientError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.details = details;
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const err = body as ApiErrorBody;
    throw new ApiClientError(
      err.error ?? "Errore nella richiesta",
      response.status,
      err.details
    );
  }

  return (body as { data: T }).data;
}

export async function apiGet<T>(url: string): Promise<T> {
  const response = await fetch(url, { credentials: "include" });
  return parseResponse<T>(response);
}

export async function apiPost<T>(url: string, body?: unknown): Promise<T> {
  const isFormData = body instanceof FormData;
  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: isFormData ? undefined : { "Content-Type": "application/json" },
    body: isFormData ? body : JSON.stringify(body ?? {}),
  });
  return parseResponse<T>(response);
}

export async function apiPatch<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseResponse<T>(response);
}

export async function apiDelete<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    method: "DELETE",
    credentials: "include",
  });
  return parseResponse<T>(response);
}
