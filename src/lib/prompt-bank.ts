import fs from "fs";
import path from "path";

/* ---------- cache ---------- */

let _bank: Map<string, string> | null = null;

const PROMPTS_DIR = "config/prompts";

/* ---------- helpers ---------- */

function walkDir(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkDir(full));
    } else if (entry.name.endsWith(".md")) {
      files.push(full);
    }
  }
  return files;
}

function loadBank(): Map<string, string> {
  const base = path.join(process.cwd(), PROMPTS_DIR);
  const files = walkDir(base);
  const bank = new Map<string, string>();

  for (const file of files) {
    // Relative from prompts dir, strip .md, use forward slashes
    const rel = path.relative(base, file).replace(/\\/g, "/");
    const key = rel.replace(/\.md$/, "");
    bank.set(key, fs.readFileSync(file, "utf-8"));
  }

  return bank;
}

/* ---------- public ---------- */

export function getPrompt(key: string): string | undefined {
  if (!_bank) _bank = loadBank();
  return _bank.get(key);
}

export function getAllPromptKeys(): string[] {
  if (!_bank) _bank = loadBank();
  return Array.from(_bank.keys());
}
