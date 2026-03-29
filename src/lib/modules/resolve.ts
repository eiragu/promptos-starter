import { getModuleById } from "./registry";
import { getPrompt } from "../prompt-bank";

/**
 * Resolve a module ID to its prompt template string.
 */
export function resolveModulePrompt(
  moduleId: string
): { prompt: string; resolvedKey: string } | { error: string } {
  const mod = getModuleById(moduleId);
  if (!mod) {
    return { error: `Unknown module: "${moduleId}"` };
  }

  const prompt = getPrompt(mod.prompt);
  if (!prompt) {
    return { error: `Prompt not found for module "${moduleId}" (key: "${mod.prompt}")` };
  }

  return { prompt, resolvedKey: mod.prompt };
}
