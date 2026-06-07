import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth';
import { errorResponse, handleCors } from '@/lib/api-helpers';
import { corsResponse } from '@/lib/api-helpers';

export async function OPTIONS() {
  return handleCors();
}

/**
 * POST /api/game/save
 * Saves game state for the authenticated user.
 *
 * Body (JSON):
 *   slot       (number, default 0)   — save slot 0-9
 *   name       (string, optional)    — display name for the save
 *   data       (string, required)    — JSON-encoded game state
 *   playTime   (number, optional)    — total playtime in seconds
 *   version    (string, optional)    — game version that created this save
 *
 * Auth: Bearer <token> or cookie
 *
 * Usage from ZayForge (Love2D):
 *   local json = require("libs.dkjson")
 *   local http = require("libs.luasocket")
 *   local body = json.encode({
 *     slot = 0,
 *     name = "World 1",
 *     data = json.encode(gameState),
 *     playTime = totalSeconds
 *   })
 *   local resp, status = http.request({
 *     url = "https://zayforge.xyz/api/game/save",
 *     method = "POST",
 *     headers = {
 *       ["Content-Type"] = "application/json",
 *       ["Authorization"] = "Bearer " .. token
 *     },
 *     source = ltn12.source.string(body)
 *   })
 */
export async function POST(request: NextRequest) {
  const session = await getAuthFromRequest(request);
  if (!session) {
    return errorResponse('Authentication required', 401);
  }

  try {
    const body = await request.json();
    const {
      slot = 0,
      name = 'Save',
      data,
      playTime = 0,
      version = '1.0',
    } = body;

    if (!data) {
      return errorResponse('"data" field is required', 400);
    }

    if (slot < 0 || slot > 9) {
      return errorResponse('Slot must be between 0 and 9', 400);
    }

    // Upsert: create or update the save in this slot
    const save = await prisma.gameSave.upsert({
      where: {
        userId_slot: {
          userId: session.userId,
          slot,
        },
      },
      create: {
        userId: session.userId,
        slot,
        name,
        data,
        version,
        playTime,
      },
      update: {
        name,
        data,
        version,
        playTime,
      },
    });

    return corsResponse({
      ok: true,
      save: {
        id: save.id,
        slot: save.slot,
        name: save.name,
        version: save.version,
        playTime: save.playTime,
        updatedAt: save.updatedAt,
      },
    });
  } catch (err) {
    console.error('Game save error:', err);
    return errorResponse('Failed to save game data', 500);
  }
}
