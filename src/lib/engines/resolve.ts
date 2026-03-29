import { getCoreByKey } from "./core-map";
import { getPrompt } from "../prompt-bank";

/**
 * Given a core engine key and tier, resolve the prompt template.
 * Generates candidate keys and tries each against the prompt bank.
 */
export function resolveCorePrompt(
  coreKey: string,
  tier: string
): { prompt: string; resolvedKey: string } | { error: string } {
  const def = getCoreByKey(coreKey);
  if (!def) {
    return { error: `Unknown core engine: "${coreKey}"` };
  }

  // Build candidate keys from the engine's prompts config
  const candidates: string[] = [];

  // 1. Direct key from config for this tier
  if (def.prompts[tier]) {
    candidates.push(def.prompts[tier]);
  }

  // 2. Fallback pattern: core/{coreKey}.{tier}
  candidates.push(`core/${coreKey}.${tier}`);

  // 3. Fallback to "basic" tier if not already
  if (tier !== "basic" && def.prompts["basic"]) {
    candidates.push(def.prompts["basic"]);
  }

  for (const key of candidates) {
    const prompt = getPrompt(key);
    if (prompt) {
      return { prompt, resolvedKey: key };
    }
  }

  return {
    error: `No prompt found for engine "${coreKey}" tier "${tier}". Tried: ${candidates.join(", ")}`,
  };
}
