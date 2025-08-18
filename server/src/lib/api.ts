// src/lib/api.ts
const BASE = "/api";

async function handle(res: Response) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export async function getCarsApi(signal?: AbortSignal) {
  const res = await fetch(`${BASE}/cars`, { signal });
  return handle(res);
}
export async function createCarApi(body: any) {
  const res = await fetch(`${BASE}/cars`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handle(res);
}
export async function updateCarApi(id: string, body: any) {
  const res = await fetch(`${BASE}/cars/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handle(res);
}
export async function deleteCarApi(id: string) {
  const res = await fetch(`${BASE}/cars/${id}`, { method: "DELETE" });
  return handle(res);
}
