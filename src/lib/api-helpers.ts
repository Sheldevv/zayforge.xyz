import { NextResponse } from "next/server";

/**
 * CORS headers for launcher/game clients (Electron, Love2D, etc.)
 */
export function corsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

export function corsResponse(body: unknown, status = 200): NextResponse {
  return NextResponse.json(body, { status, headers: corsHeaders() });
}

export function errorResponse(message: string, status = 400): NextResponse {
  return corsResponse({ error: message, ok: false }, status);
}

export function okResponse(data: unknown): NextResponse {
  return corsResponse({ ...(data as object), ok: true });
}

/**
 * Handle CORS preflight
 */
export function handleCors(): NextResponse {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}
