import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthFromRequest, removeAuthCookie } from "@/lib/auth";
import { corsResponse, errorResponse, handleCors } from "@/lib/api-helpers";

export async function OPTIONS() {
  return handleCors();
}

// ── GET /api/auth/me ────────────────────────────────────
// Returns the authenticated user's profile.
// Auth: Cookie or Bearer token.

export async function GET(request: NextRequest) {
  const session = await getAuthFromRequest(request);
  if (!session) {
    return corsResponse({ user: null, ok: false }, 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      username: true,
      email: true,
      avatar: true,
      createdAt: true,
    },
  });

  return corsResponse({ ok: true, user });
}

// ── PATCH /api/auth/me ──────────────────────────────────
// Update username.
// Body: { username: "NewName" }
// Auth: Cookie or Bearer token.

export async function PATCH(request: NextRequest) {
  const session = await getAuthFromRequest(request);
  if (!session) return errorResponse("Authentication required", 401);

  try {
    const { username } = await request.json();

    if (!username || typeof username !== "string") {
      return errorResponse("username is required", 400);
    }
    if (username.length < 3) {
      return errorResponse("Username must be at least 3 characters", 400);
    }
    if (username.length > 20) {
      return errorResponse("Username must be at most 20 characters", 400);
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return errorResponse(
        "Username can only contain letters, numbers, and underscores",
        400,
      );
    }

    // Check uniqueness
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing && existing.id !== session.userId) {
      return errorResponse("Username already taken", 409);
    }

    const user = await prisma.user.update({
      where: { id: session.userId },
      data: { username },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        createdAt: true,
      },
    });

    return corsResponse({ ok: true, user });
  } catch (err) {
    console.error("PATCH /api/auth/me error:", err);
    return errorResponse("Failed to update profile", 500);
  }
}

// ── DELETE /api/auth/me ─────────────────────────────────
// Permanently deletes the account and all game saves.
// Auth: Cookie or Bearer token.

export async function DELETE(request: NextRequest) {
  const session = await getAuthFromRequest(request);
  if (!session) return errorResponse("Authentication required", 401);

  try {
    await prisma.user.delete({ where: { id: session.userId } });
    await removeAuthCookie();

    return corsResponse({ ok: true, deleted: true });
  } catch (err) {
    console.error("DELETE /api/auth/me error:", err);
    return errorResponse("Failed to delete account", 500);
  }
}
