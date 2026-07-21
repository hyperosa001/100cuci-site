/** Resolve public site URL from env or incoming request (www vs apex). */
export function getSiteUrl(request?: Request): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (!request) return fromEnv ?? "http://localhost:3000";

  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
  const proto = request.headers.get("x-forwarded-proto") ?? "https";

  if (host) return `${proto}://${host}`.replace(/\/$/, "");
  return fromEnv ?? "http://localhost:3000";
}
