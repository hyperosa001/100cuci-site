import { NextResponse } from "next/server";

type AuthPayload = {
  token: string;
  provider: string;
};

function authHtml(message: string) {
  return `<!DOCTYPE html>
<html lang="zh">
<head><meta charset="utf-8" /><title>100CUCI Admin</title></head>
<body>
<script>
  (function () {
    var msg = ${JSON.stringify(message)};
    if (window.opener) {
      window.opener.postMessage(msg, "*");
    }
    window.close();
  })();
</script>
<p>登录完成，请关闭此窗口。</p>
</body>
</html>`;
}

export async function GET(request: Request) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  );

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return new NextResponse(
      authHtml(`authorization:github:error:${JSON.stringify({ message: error ?? "no_code" })}`),
      { headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  if (!clientId || !clientSecret) {
    return new NextResponse(
      authHtml(
        `authorization:github:error:${JSON.stringify({ message: "oauth_not_configured" })}`,
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
      ),
      { headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  const payload: AuthPayload = {
    token: tokenData.access_token,
    provider: "github",
  };

  return new NextResponse(
    authHtml(`authorization:github:success:${JSON.stringify(payload)}`),
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}
