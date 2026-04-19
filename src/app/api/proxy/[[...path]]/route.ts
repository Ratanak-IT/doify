import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API;

async function proxy(req: NextRequest, path: string) {
  const url = `${BASE_URL}/api/v1/${path}`;
  const authHeader = req.headers.get("authorization");

  const isFormData = req.headers
    .get("content-type")
    ?.includes("multipart/form-data");

  const headers: Record<string, string> = {};
  if (authHeader) headers["Authorization"] = authHeader;
  if (!isFormData) headers["Content-Type"] = "application/json";

  let body: BodyInit | null = null;
  if (req.method !== "GET" && req.method !== "HEAD") {
    if (isFormData) {
      body = await req.arrayBuffer();
    } else {
      const text = await req.text();
      if (text) body = text;
    }
  }

  const res = await fetch(url, { method: req.method, headers, body });
  const responseText = await res.text();

  if (!res.ok) {
    let errorData: unknown;
    try {
      errorData = JSON.parse(responseText);
    } catch {
      errorData = { message: responseText || "API Error" };
    }
    return NextResponse.json(errorData, { status: res.status });
  }

  if (!responseText) return new NextResponse(null, { status: res.status });

  try {
    return NextResponse.json(JSON.parse(responseText));
  } catch {
    return new NextResponse(responseText, {
      status: res.status,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

type Context = { params: Promise<{ path?: string[] | undefined }> };

export async function GET(req: NextRequest, context: Context) {
  const { path } = await context.params;
  const fullPath = (path ?? []).join("/");
  const qs = new URL(req.url).searchParams.toString();
  return proxy(req, qs ? `${fullPath}?${qs}` : fullPath);
}

export async function POST(req: NextRequest, context: Context) {
  const { path } = await context.params;
  return proxy(req, (path ?? []).join("/"));
}

export async function PUT(req: NextRequest, context: Context) {
  const { path } = await context.params;
  return proxy(req, (path ?? []).join("/"));
}

export async function PATCH(req: NextRequest, context: Context) {
  const { path } = await context.params;
  return proxy(req, (path ?? []).join("/"));
}

export async function DELETE(req: NextRequest, context: Context) {
  const { path } = await context.params;
  return proxy(req, (path ?? []).join("/"));
}