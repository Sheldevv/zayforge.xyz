import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth';
import { corsResponse, errorResponse, handleCors } from '@/lib/api-helpers';

export async function OPTIONS() {
  return handleCors();
}

// ── DELETE /api/game/saves ──────────────────────────────
// Delete a game save slot.
// Query: ?slot=N (required)
// Auth: Cookie or Bearer token.

export async function DELETE(request: NextRequest) {
  const session = await getAuthFromRequest(request);
  if (!session) return errorResponse('Authentication required', 401);

  const { searchParams } = new URL(request.url);
  const slotParam = searchParams.get('slot');

  if (slotParam === null) {
    return errorResponse('Query parameter "slot" is required', 400);
  }

  const slot = parseInt(slotParam, 10);
  if (isNaN(slot) || slot < 0 || slot > 9) {
    return errorResponse('Invalid slot. Must be 0-9.', 400);
  }

  try {
    await prisma.gameSave.deleteMany({
      where: { userId: session.userId, slot },
    });

    return corsResponse({ ok: true, deleted: true, slot });
  } catch (err) {
    console.error('Game save delete error:', err);
    return errorResponse('Failed to delete save', 500);
  }
}
