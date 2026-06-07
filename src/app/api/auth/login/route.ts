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
    const { email, password } = body;

    if (!email || !password) {
      return errorResponse("Email and password are required", 400);
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return errorResponse("Invalid email or password", 401);
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return errorResponse("Invalid email or password", 401);
    }

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
      token, // <-- launcher stores this
    });
  } catch (err) {
    console.error("Login error:", err);
    return errorResponse("Internal server error. Check server logs.", 500);
  }
}
