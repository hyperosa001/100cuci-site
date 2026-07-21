import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/site-url";

export async function GET(request: Request) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const siteUrl = getSiteUrl(request);

  if (!clientId) {
    return NextResponse.json(
      { error: "Server missing GITHUB_OAUTH_CLIENT_ID" },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);
  const provider = searchParams.get("provider") ?? "github";

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${siteUrl}/api/callback`,
    scope: "repo",
  });

  const githubUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;

  const html = `<!DOCTYPE html>
<html lang="zh">
<head><meta charset="utf-8" /><title>100CUCI Admin Login</title></head>
<body>
<script>
  (function () {
    var provider = ${JSON.stringify(provider)};
    var githubUrl = ${JSON.stringify(githubUrl)};
    var siteOrigin = ${JSON.stringify(siteUrl)};
    if (window.opener) {
      window.opener.postMessage("authorizing:" + provider, siteOrigin);
    }
    window.location.replace(githubUrl);
  })();
</script>
<p>正在跳转到 GitHub…</p>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
