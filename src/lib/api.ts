const BASE_URL = process.env.API_BASE_URL;

class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export async function apiFetch(
  endpoint: string,
  options?: RequestInit & { authHeader?: string | null }
) {
  const { authHeader, headers: extraHeaders, ...rest } = options ?? {};

  const res = await fetch(`/api${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(authHeader ? { Authorization: authHeader } : {}),
      ...(extraHeaders as Record<string, string> | undefined),
    },
    ...rest,
  });

  const text = await res.text();
  const json = text ? JSON.parse(text) : {};

  if (!res.ok) {
    const message = json?.message || json?.error || json?.detail || "API Error";
    throw new ApiError(message, res.status, json);
  }

  return json?.data !== undefined ? json.data : json;
}

export function getAuth(req: Request): string | null {
  return req.headers.get("authorization");
}
