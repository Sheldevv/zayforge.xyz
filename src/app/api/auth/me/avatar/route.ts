import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth';
import { corsResponse, errorResponse, handleCors } from '@/lib/api-helpers';

export async function OPTIONS() {
  return handleCors();
}

// ── POST /api/auth/me/avatar ────────────────────────────
// Upload a 16×16 PNG profile picture.
// Body: raw PNG bytes (Content-Type: image/png)
// Auth: Cookie or Bearer token.
//
// The avatar is stored as a base64 data-URL in the database.
// Max file size: 4 KB (a 16x16 PNG is typically ~300-800 bytes).

export async function POST(request: NextRequest) {
  const session = await getAuthFromRequest(request);
  if (!session) return errorResponse('Authentication required', 401);

  try {
    const buffer = Buffer.from(await request.arrayBuffer());

    // Validate size
    if (buffer.length === 0) return errorResponse('Empty file', 400);
    if (buffer.length > 4096) return errorResponse('Image too large (max 4 KB)', 400);

    // Validate PNG signature: 137 80 78 71 13 10 26 10
    const pngSig = [137, 80, 78, 71, 13, 10, 26, 10];
    for (let i = 0; i < 8; i++) {
      if (buffer[i] !== pngSig[i]) return errorResponse('File must be a valid PNG', 400);
    }

    // Read width/height from IHDR chunk (bytes 16-23)
    // PNG spec: after 8-byte sig, next is IHDR: 4-byte length, 4-byte "IHDR",
    //           4-byte width, 4-byte height
    const width  = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);

    if (width !== 16 || height !== 16) {
      return errorResponse(`Avatar must be exactly 16×16 pixels (got ${width}×${height})`, 400);
    }

    // Convert to base64 data-URL
    const base64 = buffer.toString('base64');
    const dataUrl = `data:image/png;base64,${base64}`;

    const user = await prisma.user.update({
      where: { id: session.userId },
      data: { avatar: dataUrl },
      select: { id: true, username: true, email: true, avatar: true, createdAt: true },
    });

    return corsResponse({ ok: true, user });
  } catch (err) {
    console.error('Avatar upload error:', err);
    return errorResponse('Failed to upload avatar', 500);
  }
}

// ── DELETE /api/auth/me/avatar ──────────────────────────
// Removes the profile picture.

export async function DELETE(request: NextRequest) {
  const session = await getAuthFromRequest(request);
  if (!session) return errorResponse('Authentication required', 401);

  try {
    const user = await prisma.user.update({
      where: { id: session.userId },
      data: { avatar: null },
      select: { id: true, username: true, email: true, avatar: true, createdAt: true },
    });

    return corsResponse({ ok: true, user });
  } catch (err) {
    console.error('Avatar delete error:', err);
    return errorResponse('Failed to remove avatar', 500);
  }
}
