import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken, setAuthCookie } from "@/lib/auth";
import { corsResponse, errorResponse, handleCors } from "@/lib/api-helpers";

export async function OPTIONS() {
  return handleCors();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return errorResponse(
        "All fields are required (username, email, password)",
        400,
      );
    }

    if (username.length < 3) {
      return errorResponse("Username must be at least 3 characters", 400);
    }

    if (password.length < 6) {
      return errorResponse("Password must be at least 6 characters", 400);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return errorResponse("Invalid email address", 400);
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      const field = existingUser.email === email ? "email" : "username";
      return errorResponse(`A user with that ${field} already exists`, 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    const token = await signToken({
      userId: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    });

    // Set cookie for web clients
    await setAuthCookie(token);

    // Return user + token so launcher/game can store it
    return corsResponse({
      ok: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
      token, // <-- launcher stores this, sends as `Authorization: Bearer <token>`
    });
  } catch (err) {
    console.error("Register error:", err);
    return errorResponse("Internal server error. Check server logs.", 500);
  }
}
