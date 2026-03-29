import { NextResponse } from "next/server";
import { withRouteError } from "@/lib/middleware/error-handler";
import { checkAuth } from "@/lib/middleware/auth";
import { resolveModulePrompt } from "@/lib/modules/resolve";
import { buildPrompt } from "@/lib/prompt-builder";
import { runLLM } from "@/lib/provider";
import { getConfig } from "@/lib/config";

export const POST = withRouteError(async (req: Request) => {
  const authError = checkAuth(req);
  if (authError) return authError;

  const body = await req.json();
  const { moduleId, userInput } = body;
  const engineType = body.engineType ?? getConfig().defaultProvider;

  if (!moduleId || !userInput) {
    return NextResponse.json(
      { ok: false, error: "Missing required fields: moduleId, userInput" },
      { status: 400 }
    );
  }

  const resolved = resolveModulePrompt(moduleId);
  if ("error" in resolved) {
    return NextResponse.json({ ok: false, error: resolved.error }, { status: 404 });
  }

  const finalPrompt = buildPrompt(resolved.prompt, userInput);
  const result = await runLLM({ engineType, prompt: finalPrompt });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error, meta: { moduleId, engineType } },
      { status: 502 }
    );
  }

  const requestId = crypto.randomUUID().slice(0, 8);

  return NextResponse.json({
    ok: true,
    output: result.text,
    text: result.text,
    content: result.text,
    modelOutput: result.text,
    meta: { requestId, moduleId, engineType },
  });
});
