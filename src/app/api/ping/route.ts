import { corsResponse, handleCors } from "@/lib/api-helpers";

export async function OPTIONS() {
  return handleCors();
}

/**
 * GET /api/ping
 * Health check + API index. Call on launcher/game startup.
 */
export async function GET() {
  return corsResponse({
    ok: true,
    ping: "pong",
    time: new Date().toISOString(),
    version: "1.0.0",
    name: "ZayForge API",
    endpoints: {
      ping: "GET    /api/ping",
      register:
        "POST   /api/auth/register       { username, email, password } → { user, token }",
      login:
        "POST   /api/auth/login          { email, password }          → { user, token }",
      me: "GET    /api/auth/me             [Auth]                       → { user }",
      meUpdate:
        "PATCH  /api/auth/me             [Auth] { username }          → { user }",
      meDelete:
        "DELETE /api/auth/me             [Auth]                       → { deleted }",
      logout: "POST   /api/auth/logout          (web cookie only)",
      avatar:
        "POST   /api/auth/me/avatar       [Auth] raw-png-body (16x16) → { user }",
      avatarDel:
        "DELETE /api/auth/me/avatar       [Auth]                       → { user }",
      save: "POST   /api/game/save            [Auth] { slot, name, data }  → { save }",
      load: "GET    /api/game/load            [Auth] ?slot=N               → { saves[] }",
      saveDel:
        "DELETE /api/game/saves           [Auth] ?slot=N               → { deleted }",
      downloads:
        "GET    /api/downloads            ?type=launcher|game|all      → releases",
    },
    docs: "/docs",
  });
}
