import { NextResponse } from "next/server";
import { getCoreDefinitions } from "@/lib/engines/core-map";
import { listModules } from "@/lib/modules/registry";
import { getProviders } from "@/lib/config";

export async function GET() {
  const engines = getCoreDefinitions().map((e) => ({
    key: e.key,
    label: e.label,
    labelCN: e.labelCN,
    description: e.description,
    tiers: Object.keys(e.prompts),
  }));

  const modules = listModules().map((m) => ({
    id: m.id,
    label: m.label,
    labelCN: m.labelCN,
    category: m.category,
  }));

  const providers = Object.entries(getProviders()).map(([key, p]) => ({
    key,
    label: p.label,
    type: p.type,
  }));

  return NextResponse.json({ ok: true, engines, modules, providers });
}
