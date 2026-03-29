import { NextResponse } from "next/server";

export type ErrorCategory =
  | "UPSTREAM_AUTH"
  | "UPSTREAM_TIMEOUT"
  | "UPSTREAM_NETWORK"
  | "JSON_PARSE"
  | "INTERNAL";

function categorize(err: unknown): { category: ErrorCategory; message: string } {
  if (err instanceof SyntaxError) {
    return { category: "JSON_PARSE", message: err.message };
  }

  const msg = err instanceof Error ? err.message : String(err);
  const lower = msg.toLowerCase();

  if (lower.includes("401") || lower.includes("unauthorized") || lower.includes("invalid api key")) {
    return { category: "UPSTREAM_AUTH", message: msg };
  }
  if (lower.includes("timeout") || lower.includes("timed out")) {
    return { category: "UPSTREAM_TIMEOUT", message: msg };
  }
  if (lower.includes("econnrefused") || lower.includes("fetch failed") || lower.includes("network")) {
    return { category: "UPSTREAM_NETWORK", message: msg };
  }

  return { category: "INTERNAL", message: msg };
}

/**
 * Wraps an API route handler with structured error handling.
 */
export function withRouteError(
  handler: (req: Request) => Promise<NextResponse>
): (req: Request) => Promise<NextResponse> {
  return async (req: Request) => {
    try {
      return await handler(req);
    } catch (err) {
      const { category, message } = categorize(err);
      const status =
        category === "UPSTREAM_AUTH"
          ? 401
          : category === "UPSTREAM_TIMEOUT"
          ? 504
          : category === "UPSTREAM_NETWORK"
          ? 502
          : category === "JSON_PARSE"
          ? 400
          : 500;

      return NextResponse.json(
        { ok: false, error: message, category },
        { status }
      );
    }
  };
}
