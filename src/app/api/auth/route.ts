import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  );

  if (!clientId) {
    return NextResponse.json(
      { error: "Server missing GITHUB_OAUTH_CLIENT_ID" },
      { status: 500 },
    );
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${siteUrl}/api/callback`,
    scope: "repo",
  });

  return NextResponse.redirect(`https://github.com/login/oauth/authorize?${params}`);
}
