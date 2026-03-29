import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

/**
 * Optional API key authentication.
 * If PROMPTOS_API_KEY is not set, auth is disabled (returns null).
 * If set, checks the Authorization header for a matching Bearer token.
 * Returns a NextResponse error if auth fails, or null if auth passes.
 */
export function checkAuth(req: Request): NextResponse | null {
  const expected = process.env.PROMPTOS_API_KEY;
  if (!expected) return null; // auth disabled

  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  if (!token) {
    return NextResponse.json(
      { ok: false, error: "Missing API key. Set Authorization: Bearer <key>" },
      { status: 401 }
    );
  }

  // Timing-safe comparison
  const a = Buffer.from(expected);
  const b = Buffer.from(token);

  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return NextResponse.json(
      { ok: false, error: "Invalid API key" },
      { status: 401 }
    );
  }

  return null; // auth passed
}
