import { getEngines } from "../config";
import { getPrompt, getAllPromptKeys } from "../prompt-bank";

let _validated = false;
let _errors: string[] = [];

/**
 * Validate that every prompt key referenced in engines.json exists
 * in the prompt bank. Runs once, caches result.
 */
export function validateEngines(): { ok: boolean; errors: string[] } {
  if (_validated) return { ok: _errors.length === 0, errors: _errors };

  const engines = getEngines();
  const errors: string[] = [];

  for (const [engineKey, engine] of Object.entries(engines)) {
    for (const [tier, promptKey] of Object.entries(engine.prompts)) {
      const prompt = getPrompt(promptKey);
      if (!prompt) {
        errors.push(
          `Engine "${engineKey}" tier "${tier}" references prompt "${promptKey}" which was not found. Available: ${getAllPromptKeys().join(", ")}`
        );
      }
    }
  }

  _errors = errors;
  _validated = true;
  return { ok: errors.length === 0, errors };
}
