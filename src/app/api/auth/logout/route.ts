import { removeAuthCookie } from "@/lib/auth";
import { corsResponse, handleCors } from "@/lib/api-helpers";

export async function OPTIONS() {
  return handleCors();
}

export async function POST() {
  await removeAuthCookie();
  return corsResponse({ ok: true, success: true });
}
