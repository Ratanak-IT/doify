import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API;

const PROVIDER_CONFIG: Record<
  string,
  { tokenUrl: string; userUrl: string; clientId: string; clientSecret: string }
> = {
  google: {
    tokenUrl: "https://oauth2.googleapis.com/token",
    userUrl: "https://www.googleapis.com/oauth2/v2/userinfo",
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  },
  github: {
    tokenUrl: "https://github.com/login/oauth/access_token",
    userUrl: "https://api.github.com/user",
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  },
  facebook: {
    tokenUrl: "https://graph.facebook.com/v18.0/oauth/access_token",
    userUrl: "https://graph.facebook.com/me?fields=id,name,email,picture",
    clientId: process.env.FACEBOOK_CLIENT_ID!,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
  },
};

function setCookieHeader(name: string, value: string) {
  return `${name}=${encodeURIComponent(value)}; Path=/; SameSite=Lax; Max-Age=86400`;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const appUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

  if (error || !code) {
    return NextResponse.redirect(`${appUrl}/login?error=oauth_cancelled`);
  }

  const config = PROVIDER_CONFIG[provider];
  if (!config) {
    return NextResponse.redirect(`${appUrl}/login?error=unknown_provider`);
  }

  try {
    // ── Step 1: Exchange code for provider access token ──────────────────
    const redirectUri = `${appUrl}/api/auth/callback/${provider}`;

    const tokenParams = new URLSearchParams({
      code,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    });

    const tokenRes = await fetch(config.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: tokenParams.toString(),
    });

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      // console.error(`[oauth/${provider}] No access token:`, tokenData);
      return NextResponse.redirect(
        `${appUrl}/login?error=token_exchange_failed`,
      );
    }

    // ── Step 2: Fetch user profile from provider ──────────────────────────
    const userRes = await fetch(config.userUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const providerUser = await userRes.json();

    let resolvedEmail: string | null = providerUser.email ?? null;

    // GitHub may hide email — fetch separately
    if (provider === "github" && !resolvedEmail) {
      const emailRes = await fetch("https://api.github.com/user/emails", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const emails: { email: string; primary: boolean; verified: boolean }[] =
        await emailRes.json();
      resolvedEmail =
        emails.find((e) => e.primary && e.verified)?.email ??
        emails[0]?.email ??
        null;
    }

    if (!resolvedEmail) {
      return NextResponse.redirect(`${appUrl}/login?error=no_email`);
    }

    const name: string =
      providerUser.name ??
      providerUser.login ??
      providerUser.username ??
      "User";

    // Normalize avatar across providers
    const avatar: string | null =
      providerUser.avatar_url ?? // GitHub
      providerUser.picture?.data?.url ?? // Facebook
      providerUser.picture ?? // Google (string)
      null;

    // ── Step 3: Send to backend ───────────────────────────────────────────
    const backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/social-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: resolvedEmail, name, avatar, provider }),
    });

    // ✅ Read JSON only ONCE
    const raw = await backendRes.json();
    // console.log(`[oauth/${provider}] Backend response:`, JSON.stringify(raw));

    if (!backendRes.ok) {
      // console.error(`[oauth/${provider}] Backend rejected:`, raw);
      return NextResponse.redirect(`${appUrl}/login?error=backend_rejected`);
    }

    // Backend returns: { success, message, data: { accessToken, refreshToken, user } }
    const payload = raw?.data;

    if (!payload?.accessToken) {
      // console.error(`[oauth/${provider}] No accessToken in payload:`, payload);
      return NextResponse.redirect(`${appUrl}/login?error=backend_rejected`);
    }

    const token: string = payload.accessToken;
    const refreshToken: string = payload.refreshToken ?? "";
    const u = payload.user ?? {};

    const user = {
      id: u.id ?? "",
      name: u.fullName ?? u.name ?? name,
      email: u.email ?? resolvedEmail,
      avatar: u.profilePhoto ?? avatar ?? "",
    };

    console.log(`[oauth/${provider}] Login success:`, user.email);

    const response = NextResponse.redirect(`${appUrl}/dashboard`);

    response.headers.append("Set-Cookie", setCookieHeader("token", token));
    response.headers.append(
      "Set-Cookie",
      setCookieHeader("user", JSON.stringify(user)),
    );
    if (refreshToken) {
      response.headers.append(
        "Set-Cookie",
        setCookieHeader("refreshToken", refreshToken),
      );
    }

    return response;
  } catch (err) {
    // console.error(`[oauth/${provider}] Unexpected error:`, err);
    return NextResponse.redirect(`${appUrl}/login?error=server_error`);
  }
}
