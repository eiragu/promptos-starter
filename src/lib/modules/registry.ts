import { getModules, type ModuleConfig } from "../config";

export function listModules(): ModuleConfig[] {
  return getModules();
}

export function getModuleById(id: string): ModuleConfig | undefined {
  return getModules().find((m) => m.id === id);
}
