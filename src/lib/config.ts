import fs from "fs";
import path from "path";

/* ---------- types ---------- */

export interface PromptosConfig {
  name: string;
  description: string;
  defaultProvider: string;
  defaultTier: string;
  features: {
    playground: boolean;
    registry: boolean;
    coreEngines: boolean;
    modules: boolean;
  };
}

export interface ProviderConfig {
  label: string;
  type: "openai-compatible" | "google-genai" | "anthropic";
  baseURL?: string;
  model: string;
  envKey: string;
}

export interface EngineConfig {
  label: string;
  labelCN: string;
  description: string;
  prompts: Record<string, string>;
}

export interface ModuleConfig {
  id: string;
  label: string;
  labelCN: string;
  category: string;
  prompt: string;
}

/* ---------- cache ---------- */

let _config: PromptosConfig | null = null;
let _providers: Record<string, ProviderConfig> | null = null;
let _engines: Record<string, EngineConfig> | null = null;
let _modules: ModuleConfig[] | null = null;

function root() {
  return process.cwd();
}

function readJSON<T>(relPath: string): T {
  const fullPath = path.join(root(), relPath);
  const raw = fs.readFileSync(fullPath, "utf-8");
  return JSON.parse(raw) as T;
}

/* ---------- public ---------- */

export function getConfig(): PromptosConfig {
  if (!_config) _config = readJSON<PromptosConfig>("promptos.config.json");
  return _config;
}

export function getProviders(): Record<string, ProviderConfig> {
  if (!_providers)
    _providers = readJSON<Record<string, ProviderConfig>>("config/providers.json");
  return _providers;
}

export function getEngines(): Record<string, EngineConfig> {
  if (!_engines)
    _engines = readJSON<Record<string, EngineConfig>>("config/engines.json");
  return _engines;
}

export function getModules(): ModuleConfig[] {
  if (!_modules) _modules = readJSON<ModuleConfig[]>("config/modules.json");
  return _modules;
}
