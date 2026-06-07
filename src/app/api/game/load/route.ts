import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth';
import { corsResponse, errorResponse, handleCors } from '@/lib/api-helpers';

export async function OPTIONS() {
  return handleCors();
}

/**
 * GET /api/game/load
 * Loads game saves for the authenticated user.
 *
 * Query params:
 *   slot (number, optional) — load a specific slot. Omit to get all saves.
 *
 * Auth: Bearer <token> or cookie
 *
 * Response:
 *   { ok: true, saves: [ { slot, name, data, playTime, version, updatedAt } ] }
 *
 * Usage from ZayForge (Love2D):
 *   local json = require("libs.dkjson")
 *   local http = require("libs.luasocket")
 *   local resp, status = http.request({
 *     url = "https://zayforge.xyz/api/game/load?slot=0",
 *     headers = { ["Authorization"] = "Bearer " .. token }
 *   })
 *   if status == 200 then
 *     local result = json.decode(resp)
 *     if result.ok and #result.saves > 0 then
 *       gameState = json.decode(result.saves[1].data)
 *     end
 *   end
 */
export async function GET(request: NextRequest) {
  const session = await getAuthFromRequest(request);
  if (!session) {
    return errorResponse('Authentication required', 401);
  }

  const { searchParams } = new URL(request.url);
  const slotParam = searchParams.get('slot');

  try {
    const where: Record<string, unknown> = { userId: session.userId };

    if (slotParam !== null) {
      const slot = parseInt(slotParam, 10);
      if (isNaN(slot) || slot < 0 || slot > 9) {
        return errorResponse('Invalid slot. Must be 0-9.', 400);
      }
      where.slot = slot;
    }

    const saves = await prisma.gameSave.findMany({
      where,
      orderBy: { slot: 'asc' },
      select: {
        id: true,
        slot: true,
        name: true,
        data: true,
        version: true,
        playTime: true,
        updatedAt: true,
      },
    });

    return corsResponse({
      ok: true,
      saves,
    });
  } catch (err) {
    console.error('Game load error:', err);
    return errorResponse('Failed to load game data', 500);
  }
}
