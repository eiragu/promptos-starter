import { getEngines, type EngineConfig } from "../config";

/* ---------- types ---------- */

export type CoreDefinition = EngineConfig & { key: string };

/* ---------- public ---------- */

export function getCoreDefinitions(): CoreDefinition[] {
  const engines = getEngines();
  return Object.entries(engines).map(([key, cfg]) => ({ key, ...cfg }));
}

export function getCoreByKey(key: string): CoreDefinition | undefined {
  const engines = getEngines();
  const cfg = engines[key];
  if (!cfg) return undefined;
  return { key, ...cfg };
}
