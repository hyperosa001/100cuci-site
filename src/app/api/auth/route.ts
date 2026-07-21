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

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${siteUrl}/api/callback`,
    scope: "repo",
  });

  return NextResponse.redirect(`https://github.com/login/oauth/authorize?${params}`);
}
