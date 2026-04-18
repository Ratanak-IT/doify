import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const backendUrl = process.env.NEXT_PUBLIC_API;

  if (!token) {
    return NextResponse.json({ error: "Token required" }, { status: 401 });
  }

  if (!backendUrl) {
    return NextResponse.json(
      { error: "Backend URL not configured" },
      { status: 500 }
    );
  }

  const backendStreamUrl = `${backendUrl}/api/v1/notifications/stream?token=${encodeURIComponent(token)}`;

  try {
    const response = await fetch(backendStreamUrl, {
      method: "GET",
      headers: {
        Accept: "text/event-stream",
        Connection: "keep-alive",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Backend error", status: response.status },
        { status: response.status }
      );
    }

    // Return the stream response with proper SSE headers
    return new NextResponse(response.body, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("[Notifications Stream Proxy] Error:", error);
    return NextResponse.json(
      { error: "Stream error", details: String(error) },
      { status: 500 }
    );
  }
}
