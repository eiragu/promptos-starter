/**
 * Check if an environment variable is set to a truthy value.
 * Truthy values: "1", "true", "on", "yes" (case-insensitive).
 */
export function envOn(key: string): boolean {
  const val = process.env[key];
  if (!val) return false;
  return ["1", "true", "on", "yes"].includes(val.trim().toLowerCase());
}
