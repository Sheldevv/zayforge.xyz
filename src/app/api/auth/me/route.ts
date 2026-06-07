import { NextRequest } from "next/server";
import { getAuthFromRequest, setAuthCookie } from "@/lib/auth";
import { corsResponse, handleCors } from "@/lib/api-helpers";

export async function OPTIONS() {
  return handleCors();
}

/**
 * GET /api/auth/me
 * Returns current user if authenticated.
 * Accepts: Cookie OR Authorization: Bearer <token>
 *
 * Usage from Launcher (Electron):
 *   fetch('https://zayforge.xyz/api/auth/me', {
 *     headers: { 'Authorization': `Bearer ${storedToken}` }
 *   })
 *
 * Usage from ZayForge (Love2D / Lua):
 *   -- Using luasocket or similar HTTP library
 *   local headers = { Authorization = "Bearer " .. token }
 *   local body, status = http.request("https://zayforge.xyz/api/auth/me", headers)
 */
export async function GET(request: NextRequest) {
  const session = await getAuthFromRequest(request);

  if (!session) {
    return corsResponse({ user: null, ok: false }, 401);
  }

  return corsResponse({
    ok: true,
    user: {
      id: session.userId,
      username: session.username,
      email: session.email,
      avatar: session.avatar,
    },
  });
}
