import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "zayforge-jwt-secret-change-in-production-2026",
);

const COOKIE_NAME = "zayforge_token";

export interface JWTPayload {
  userId: string;
  username: string;
  email: string;
  avatar: string | null;
}

// ── Token signing / verification ──────────────────────────────

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

// ── Cookie helpers (web client only) ──────────────────────────

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function removeAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// ── Auth extraction (works with both cookie AND Bearer token) ─

/**
 * Extract JWT payload from a Request.
 * Checks, in order:
 *   1. `Authorization: Bearer <token>` header  (launcher / game / API clients)
 *   2. `zayforge_token` cookie                 (web browser)
 */
export async function getAuthFromRequest(
  request: NextRequest,
): Promise<JWTPayload | null> {
  // 1. Bearer token
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    return verifyToken(token);
  }

  // 2. Cookie
  const cookieToken = request.cookies.get(COOKIE_NAME)?.value;
  if (cookieToken) {
    return verifyToken(cookieToken);
  }

  return null;
}

/**
 * Extract JWT from cookies only (used by server-side page renders).
 */
export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Extract JWT from cookies or Authorization header (route handlers).
 */
export async function getAuthFromHeaders(
  request: NextRequest,
): Promise<JWTPayload | null> {
  return getAuthFromRequest(request);
}
