import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/site-url";

function errorHtml(message: string) {
  return `<!DOCTYPE html>
<html lang="zh">
<head><meta charset="utf-8" /><title>100CUCI Admin 登录失败</title></head>
<body style="font-family:system-ui,sans-serif;padding:32px;line-height:1.6">
  <h1>GitHub 登录失败</h1>
  <p>${message}</p>
  <p><a href="/admin">返回后台</a></p>
</body>
</html>`;
}

function authHtml(message: string, siteOrigin: string) {
  const isError = message.includes(":error:");
  if (isError) {
    let detail = message;
    try {
      detail = JSON.parse(message.match(/:error:(.+)$/)?.[1] ?? "{}").message ?? message;
    } catch {
      /* keep raw message */
    }
    return errorHtml(String(detail));
  }

  return `<!DOCTYPE html>
<html lang="zh">
<head><meta charset="utf-8" /><title>100CUCI Admin</title></head>
<body>
<script>
  (function () {
    var msg = ${JSON.stringify(message)};
    var siteOrigin = ${JSON.stringify(siteOrigin)};
    if (window.opener) {
      window.opener.postMessage(msg, siteOrigin);
      window.close();
      return;
    }
    document.body.innerHTML = "<p>登录完成，请关闭此窗口并回到后台页面，点击 Login with GitHub。</p>";
  })();
</script>
<p>登录完成，正在关闭窗口…</p>
</body>
</html>`;
}

export async function GET(request: Request) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
  const siteUrl = getSiteUrl(request);

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return new NextResponse(
      authHtml(
        `authorization:github:error:${JSON.stringify({ message: error ?? "no_code" })}`,
        siteUrl,
      ),
      { headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  if (!clientId || !clientSecret) {
    return new NextResponse(
      authHtml(
        `authorization:github:error:${JSON.stringify({ message: "oauth_not_configured" })}`,
        siteUrl,
      ),
      { headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: `${siteUrl}/api/callback`,
    }),
  });

  const tokenData = (await tokenRes.json()) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };

  if (!tokenData.access_token) {
    return new NextResponse(
      authHtml(
        `authorization:github:error:${JSON.stringify({
          message: tokenData.error_description ?? tokenData.error ?? "token_failed",
        })}`,
        siteUrl,
      ),
      { headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  const payload = {
    token: tokenData.access_token,
    provider: "github",
  };

  return new NextResponse(
    authHtml(`authorization:github:success:${JSON.stringify(payload)}`, siteUrl),
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}
