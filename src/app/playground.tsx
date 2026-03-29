"use client";

import { useState, useEffect } from "react";

/* ---------- types ---------- */

interface RegistryEngine {
  key: string;
  label: string;
  labelCN: string;
  description: string;
  tiers: string[];
}

interface RegistryModule {
  id: string;
  label: string;
  labelCN: string;
  category: string;
}

interface RegistryProvider {
  key: string;
  label: string;
  type: string;
}

type ToolOption = { type: "engine"; key: string; tier: string; label: string } | { type: "module"; id: string; label: string };

/* ---------- component ---------- */

export default function Playground() {
  const [tools, setTools] = useState<ToolOption[]>([]);
  const [providers, setProviders] = useState<RegistryProvider[]>([]);
  const [selectedTool, setSelectedTool] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [userInput, setUserInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Fetch registry on mount
  useEffect(() => {
    fetch("/api/registry")
      .then((r) => r.json())
      .then((data) => {
        if (!data.ok) return;

        const toolOpts: ToolOption[] = [];

        // Add engines
        for (const e of data.engines as RegistryEngine[]) {
          for (const tier of e.tiers) {
            toolOpts.push({
              type: "engine",
              key: e.key,
              tier,
              label: `${e.label} (${e.labelCN})`,
            });
          }
        }

        // Add modules
        for (const m of data.modules as RegistryModule[]) {
          toolOpts.push({
            type: "module",
            id: m.id,
            label: `${m.label} (${m.labelCN})`,
          });
        }

        setTools(toolOpts);
        if (toolOpts.length > 0) {
          setSelectedTool("0");
        }

        setProviders(data.providers as RegistryProvider[]);
        if (data.providers.length > 0) {
          setSelectedProvider((data.providers as RegistryProvider[])[0].key);
        }
      })
      .catch(() => {});
  }, []);

  async function handleGenerate() {
    if (!userInput.trim()) return;
    const idx = parseInt(selectedTool, 10);
    const tool = tools[idx];
    if (!tool) return;

    setLoading(true);
    setError("");
    setOutput("");

    try {
      let url: string;
      let body: Record<string, string>;

      if (tool.type === "engine") {
        url = "/api/core/run";
        body = {
          coreKey: tool.key,
          tier: tool.tier,
          userInput: userInput.trim(),
          engineType: selectedProvider,
        };
      } else {
        url = "/api/run";
        body = {
          moduleId: tool.id,
          userInput: userInput.trim(),
          engineType: selectedProvider,
        };
      }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.ok) {
        setOutput(data.output ?? data.text ?? "");
      } else {
        setError(data.error || "Unknown error");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <h1 className="text-xl font-semibold text-slate-800">Promptos</h1>
          </div>
          <span className="text-sm text-slate-500">AI Content Generation Playground</span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* Left: Input */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Input</h2>

            {/* Tool selector */}
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Engine / Module
            </label>
            <select
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedTool}
              onChange={(e) => setSelectedTool(e.target.value)}
            >
              {tools.map((t, i) => (
                <option key={i} value={i}>
                  {t.label}
                </option>
              ))}
            </select>

            {/* Provider selector */}
            <label className="block text-sm font-medium text-slate-600 mb-1">
              LLM Provider
            </label>
            <select
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
            >
              {providers.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.label}
                </option>
              ))}
            </select>

            {/* User input */}
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Your Input
            </label>
            <textarea
              className="w-full flex-1 min-h-[200px] border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe your goal, task, or topic..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />

            {/* Generate button */}
            <button
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              onClick={handleGenerate}
              disabled={loading || !userInput.trim()}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Generating...
                </>
              ) : (
                "Generate"
              )}
            </button>
          </div>

          {/* Right: Output */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Output</h2>
              {output && (
                <button
                  onClick={handleCopy}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              )}
            </div>

            <div className="flex-1 min-h-[200px] overflow-auto">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              {loading && !output && (
                <div className="flex items-center justify-center h-full text-slate-400">
                  <div className="text-center">
                    <svg
                      className="animate-spin h-8 w-8 mx-auto mb-3 text-blue-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <p className="text-sm">Generating content...</p>
                  </div>
                </div>
              )}

              {!loading && !output && !error && (
                <div className="flex items-center justify-center h-full text-slate-400">
                  <p className="text-sm">
                    Select an engine or module, enter your input, and click Generate.
                  </p>
                </div>
              )}

              {output && (
                <div className="prose prose-sm prose-slate max-w-none whitespace-pre-wrap text-sm text-slate-800 leading-relaxed">
                  {output}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-4">
        <div className="max-w-7xl mx-auto text-center text-sm text-slate-500">
          Powered by Promptos &middot; Built by Eira &middot;{" "}
          <a
            href="https://fuyouai.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700"
          >
            Try FuYouAI for 80+ modules
          </a>
        </div>
      </footer>
    </div>
  );
}
