import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getProviders } from "./config";

/* ---------- types ---------- */

export type EngineType = string;

export type RunLLMInput = {
  engineType: EngineType;
  prompt: string;
  temperature?: number;
};

export type RunLLMOutput =
  | { ok: true; engineType: string; text: string }
  | { ok: false; engineType: string; error: string };

/* ---------- main ---------- */

export async function runLLM(input: RunLLMInput): Promise<RunLLMOutput> {
  const providers = getProviders();
  const cfg = providers[input.engineType];

  if (!cfg) {
    return {
      ok: false,
      engineType: input.engineType,
      error: `Unknown provider: "${input.engineType}". Available: ${Object.keys(providers).join(", ")}`,
    };
  }

  const apiKey = process.env[cfg.envKey];
  if (!apiKey) {
    return {
      ok: false,
      engineType: input.engineType,
      error: `Missing environment variable ${cfg.envKey}`,
    };
  }

  try {
    if (cfg.type === "openai-compatible") {
      return await runOpenAICompatible(cfg, apiKey, input);
    } else if (cfg.type === "google-genai") {
      return await runGoogleGenAI(cfg, apiKey, input);
    } else if (cfg.type === "anthropic") {
      return await runAnthropic(cfg, apiKey, input);
    } else {
      return {
        ok: false,
        engineType: input.engineType,
        error: `Unsupported provider type: "${cfg.type}"`,
      };
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, engineType: input.engineType, error: message };
  }
}

/* ---------- adapters ---------- */

async function runOpenAICompatible(
  cfg: { baseURL?: string; model: string },
  apiKey: string,
  input: RunLLMInput
): Promise<RunLLMOutput> {
  const client = new OpenAI({
    apiKey,
    baseURL: cfg.baseURL ? `${cfg.baseURL}/v1` : undefined,
  });

  const res = await client.chat.completions.create({
    model: cfg.model,
    messages: [{ role: "user", content: input.prompt }],
    temperature: input.temperature ?? 0.7,
  });

  const text = res.choices?.[0]?.message?.content ?? "";
  return { ok: true, engineType: input.engineType, text };
}

async function runAnthropic(
  cfg: { model: string },
  apiKey: string,
  input: RunLLMInput
): Promise<RunLLMOutput> {
  const client = new Anthropic({ apiKey });

  const res = await client.messages.create({
    model: cfg.model,
    max_tokens: 4096,
    messages: [{ role: "user", content: input.prompt }],
    temperature: input.temperature ?? 0.7,
  });

  const text = res.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");
  return { ok: true, engineType: input.engineType, text };
}

async function runGoogleGenAI(
  cfg: { model: string },
  apiKey: string,
  input: RunLLMInput
): Promise<RunLLMOutput> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: cfg.model });

  const result = await model.generateContent(input.prompt);
  const text = result.response.text();
  return { ok: true, engineType: input.engineType, text };
}
