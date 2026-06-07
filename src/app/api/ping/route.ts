import { corsResponse, handleCors } from '@/lib/api-helpers';

export async function OPTIONS() {
  return handleCors();
}

/**
 * GET /api/ping
 * Simple health check — the launcher calls this on startup to verify connectivity.
 * Returns the server time and version info.
 */
export async function GET() {
  return corsResponse({
    ok: true,
    ping: 'pong',
    time: new Date().toISOString(),
    version: '1.0.0',
    name: 'ZayForge API',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register  { username, email, password } → { user, token }',
        login:    'POST /api/auth/login     { email, password }          → { user, token }',
        me:       'GET  /api/auth/me        [Authorization: Bearer <t>]  → { user }',
        logout:   'POST /api/auth/logout',
      },
      game: {
        save:     'POST /api/game/save      [Auth] { slot, name, data, playTime } → { save }',
        load:     'GET  /api/game/load      [Auth] ?slot=N                   → { saves[] }',
      },
      downloads: {
        all:      'GET  /api/downloads      ?type=launcher|game|all',
      },
    },
  });
}
