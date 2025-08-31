function read(name: string, fallback?: string) {
  const v = process.env[name];
  if (v && v.trim()) {
    return v.trim().endsWith("/") ? v.trim().slice(0, -1) : v.trim();
  }
  if (fallback) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[env] ${name} ausente. Usando fallback: ${fallback}`);
    }
    return fallback.endsWith("/") ? fallback.slice(0, -1) : fallback;
  }
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[env] ${name} não definido (verifique .env)`);
    return "";
  }
  throw new Error(`[env] Missing required env var: ${name}`);
}

export const API_BASE_URL = read("NEXT_PUBLIC_API_BASE_URL", "http://localhost:8080/v1");