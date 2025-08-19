const BASE =
  (import.meta as any).env?.VITE_API_BASE?.replace(/\/$/, "") ||
  "http://localhost:4000";

async function handle(res: Response) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

// GET /cars
export async function getCarsApi(signal?: AbortSignal) {
  const res = await fetch(`${BASE}/cars`, { signal, credentials: "omit" });
  return handle(res);
}

// POST /cars
export async function createCarApi(body: any) {
  const res = await fetch(`${BASE}/cars`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handle(res);
}

// PUT /cars/:id
export async function updateCarApi(id: string, body: any) {
  const res = await fetch(`${BASE}/cars/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handle(res);
}

// DELETE /cars/:id
export async function deleteCarApi(id: string) {
  const res = await fetch(`${BASE}/cars/${id}`, { method: "DELETE" });
  return handle(res);
}
