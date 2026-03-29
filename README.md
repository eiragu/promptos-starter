# Promptos Starter

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Feiragu%2Fpromptos-starter&env=DEEPSEEK_API_KEY&envDescription=Your%20LLM%20API%20Key&project-name=my-ai-app)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)

> **Deploy your own AI-powered content platform in 5 minutes.** No AI experience needed.

Promptos Starter is a ready-to-use template for building AI content generation apps. It comes with a **Task Breakdown Engine**, **4 built-in modules**, and a visual playground — all configurable through simple JSON and Markdown files.

**Zero coding required.** Edit a config file, write your prompts in Markdown, click deploy.

[English](#features) | [中文版本](#中文)

---

## Demo

```
You: "I want to build a SaaS product for small businesses"

Promptos (Task Breakdown Engine):
├── Phase 1: Market Research (Week 1-2)
│   ├── Identify target customer segments
│   ├── Analyze 5 competing products
│   └── Conduct 10 user interviews
├── Phase 2: MVP Definition (Week 3)
│   ├── Define core feature set (max 3 features)
│   ├── Create user flow diagrams
│   └── Write product spec
├── Phase 3: Development (Week 4-8)
│   ├── Set up tech stack
│   ├── Build authentication + core features
│   └── Deploy staging environment
└── Phase 4: Launch (Week 9-10)
    ├── Beta testing with 20 users
    ├── Iterate based on feedback
    └── Public launch + marketing
```

---

## Features

### 1 Core Engine + 4 Modules = Complete Workflow

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   📥 Input: "Build an online education platform"        │
│                                                         │
│   ┌─────────────────────────────────────────────┐       │
│   │  Task Breakdown Engine                      │       │
│   │  Decomposes any goal into actionable steps  │       │
│   └──────────────────┬──────────────────────────┘       │
│                      │                                  │
│          ┌───────────┼───────────┐                      │
│          ▼           ▼           ▼                      │
│   ┌───────────┐ ┌─────────┐ ┌──────────┐               │
│   │ PM / OKR  │ │  Deep   │ │  Tech    │               │
│   │ Planner   │ │Analysis │ │  Stack   │               │
│   └─────┬─────┘ └────┬────┘ └────┬─────┘               │
│         │            │           │                      │
│         ▼            ▼           ▼                      │
│   OKR + Timeline  Risk Report  Architecture             │
│                                                         │
│         └────────────┼───────────┘                      │
│                      ▼                                  │
│              ┌──────────────┐                           │
│              │Writing Master│                           │
│              │  Final Docs  │                           │
│              └──────────────┘                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

| Component | What It Does | Example Output |
|-----------|-------------|----------------|
| **Task Breakdown Engine** | Decomposes any complex goal into phases, tasks, and sub-tasks with dependencies | Project plan with 4 phases, 12 tasks |
| **PM / OKR Planner** | Creates OKRs, milestones, and execution timeline from a task list | Q1 OKR with 3 objectives, 9 key results |
| **Deep Analysis** | MECE analysis of any topic — risks, opportunities, tradeoffs | 5-dimension analysis with recommendations |
| **Tech Stack Advisor** | Recommends architecture and tech choices for your project | Stack comparison table + architecture diagram |
| **Writing Master** | Generates polished documents, reports, and content | Professional report with structure and formatting |

### Multi-LLM Support

Switch between AI providers by changing one line:

```env
# Use DeepSeek (default, cheapest)
DEEPSEEK_API_KEY=sk-xxx

# Or use Google Gemini
GEMINI_API_KEY=xxx

# Or use both — switch per request
```

Supports any **OpenAI-compatible API** (DeepSeek, Groq, Together, Ollama, etc.) + Google Gemini. Add a new provider in 30 seconds — just edit `config/providers.json`.

### Visual Playground

Every deployment includes a built-in playground UI:

- Select engine or module from dropdown
- Type your input
- See AI output in real-time
- Copy the API call as cURL

No Postman, no terminal. Test everything in your browser.

---

## Quick Start

### Option A: One-Click Deploy (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Feiragu%2Fpromptos-starter&env=DEEPSEEK_API_KEY&envDescription=Your%20LLM%20API%20Key&project-name=my-ai-app)

1. Click the button above
2. Enter your API key (get one from [DeepSeek](https://platform.deepseek.com/) — it's $0.14/million tokens)
3. Wait 60 seconds for deployment
4. Open your app and start using it

### Option B: Run Locally

```bash
# Clone
git clone https://github.com/eiragu/promptos-starter.git
cd promptos-starter

# Install
npm install

# Configure
cp .env.example .env.local
# Edit .env.local — add your API key

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — done.

---

## Customization

### Add a New Prompt Module (2 minutes, no coding)

**Step 1:** Create a Markdown file for your prompt template:

```markdown
<!-- config/prompts/modules/my-module.md -->
# Social Media Post Generator

You are an expert social media content creator.

## Task
Generate engaging social media posts based on the user's input.

## Requirements
- Platform-optimized (Twitter: 280 chars, LinkedIn: professional tone)
- Include 3 variations
- Suggest relevant hashtags

## Output Format
### Post 1 (Twitter)
...
### Post 2 (LinkedIn)
...
### Post 3 (Instagram)
...
```

**Step 2:** Register it in `config/modules.json`:

```json
{
  "id": "social_media",
  "label": "Social Media Generator",
  "labelCN": "社媒内容生成",
  "category": "marketing",
  "prompt": "modules/my-module"
}
```

**Step 3:** Done. Your new module is live — available in the playground and via API.

### Add a New LLM Provider (30 seconds)

Edit `config/providers.json`:

```json
{
  "groq": {
    "label": "Groq (Llama 3)",
    "type": "openai-compatible",
    "baseURL": "https://api.groq.com/openai/v1",
    "model": "llama-3.3-70b-versatile",
    "envKey": "GROQ_API_KEY"
  }
}
```

Add `GROQ_API_KEY=xxx` to your `.env.local`. That's it.

### Customize Existing Prompts

All prompts live in `config/prompts/` as Markdown files. Open any file, edit the text, save. Changes take effect immediately in development mode.

```
config/prompts/
├── core/
│   └── task-breakdown.basic.md    ← Edit the core engine prompt
└── modules/
    ├── writing-master.md          ← Edit any module prompt
    ├── deep-analysis.md
    ├── pm-okr.md
    └── tech-stack.md
```

---

## API Reference

### POST `/api/core/run` — Run Core Engine

```bash
curl -X POST https://your-app.vercel.app/api/core/run \
  -H "Content-Type: application/json" \
  -d '{
    "coreKey": "task_breakdown",
    "tier": "basic",
    "userInput": "Build a mobile fitness app",
    "engineType": "deepseek"
  }'
```

**Response:**

```json
{
  "ok": true,
  "output": "## Project Breakdown\n\n### Phase 1: Research...",
  "text": "## Project Breakdown\n\n### Phase 1: Research...",
  "content": "## Project Breakdown\n\n### Phase 1: Research...",
  "meta": {
    "requestId": "a1b2c3d4",
    "coreKey": "task_breakdown",
    "tier": "basic",
    "engineType": "deepseek"
  }
}
```

### POST `/api/run` — Run Any Module

```bash
curl -X POST https://your-app.vercel.app/api/run \
  -H "Content-Type: application/json" \
  -d '{
    "moduleId": "writing_master",
    "userInput": "Write a project proposal for an AI chatbot",
    "engineType": "deepseek"
  }'
```

### GET `/api/registry` — List Available Modules

```bash
curl https://your-app.vercel.app/api/registry
```

### GET `/api/ping` — Health Check

```bash
curl https://your-app.vercel.app/api/ping
# → { "ok": true, "timestamp": "2026-03-29T..." }
```

---

## Project Structure

```
promptos-starter/
├── promptos.config.json        ← Main config (start here)
├── config/
│   ├── providers.json          ← LLM providers (add/remove models)
│   ├── engines.json            ← Core engine definitions
│   ├── modules.json            ← Module registry (add your own!)
│   └── prompts/                ← All prompts as Markdown files
│       ├── core/
│       │   └── task-breakdown.basic.md
│       └── modules/
│           ├── writing-master.md
│           ├── deep-analysis.md
│           ├── pm-okr.md
│           └── tech-stack.md
├── src/
│   ├── app/
│   │   ├── page.tsx            ← Playground UI
│   │   └── api/                ← API routes (auto-configured)
│   └── lib/
│       ├── provider.ts         ← Multi-LLM unified interface
│       ├── engines/            ← Core engine logic
│       ├── modules/            ← Module resolution
│       └── middleware/         ← Error handling, auth, tracing
├── .env.example
├── package.json
└── README.md
```

**You only need to touch the `config/` folder.** Everything in `src/` works automatically.

---

## Comparison

| Feature | Promptos Starter | LangChain | Raw OpenAI SDK |
|---------|:---:|:---:|:---:|
| Time to deploy | 5 min | Hours | Hours |
| Coding required | No | Yes (Python) | Yes |
| Multi-LLM support | Built-in | Plugin-based | Manual |
| Visual playground | Included | No | No |
| Prompt management | Markdown files | Code | Code |
| One-click deploy | Vercel button | No | No |
| Production-ready | Yes | Depends | No |

---

## Full Architecture

Want to understand how Promptos works under the hood?

Check out the complete architecture documentation: **[Promptos Architecture](https://github.com/eiragu/promptos-architecture)** — covers the design decisions, patterns, and lessons learned from building a production AI platform with 80+ modules.

---

## Roadmap

- [x] Task Breakdown Engine (core)
- [x] 4 built-in modules (Writing, Analysis, PM/OKR, Tech Stack)
- [x] Multi-LLM support (DeepSeek, Gemini, OpenAI-compatible)
- [x] Visual Playground UI
- [x] One-click Vercel deploy
- [ ] Claude & GPT-4 native adapters
- [ ] Streaming output support
- [ ] Module marketplace (community prompts)
- [ ] Pro engine tier (deeper analysis, longer output)
- [ ] Plugin system (pre/post processing hooks)

---

## Who Built This

**[Eira](https://github.com/eiragu)** — 10 years in financial sales, now building AI products.

Promptos Starter is extracted from [FuYouAI](https://fuyouai.com), a production AI content generation platform with 80+ modules serving real users. This isn't a toy project — it's battle-tested code from a live product.

- **FuYouAI** — [fuyouai.com](https://fuyouai.com) (the full platform)
- **Architecture Docs** — [promptos-architecture](https://github.com/eiragu/promptos-architecture)
- **GitHub** — [@eiragu](https://github.com/eiragu)

---

## Support This Project

If Promptos Starter helps you build something, consider:

- Giving this repo a **Star** — it helps others discover the project
- **Sharing** your creation — tag me on Twitter/X or open a Discussion
- **Contributing** — prompt templates, bug fixes, translations are all welcome
- Checking out **[FuYouAI](https://fuyouai.com)** — the full platform with 80+ AI modules

---

## License

MIT — use it for anything, commercial or personal.

---

---

<a name="中文"></a>

# 中文版本

## Promptos Starter — 5 分钟部署你自己的 AI 内容平台

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Feiragu%2Fpromptos-starter&env=DEEPSEEK_API_KEY&envDescription=Your%20LLM%20API%20Key&project-name=my-ai-app)

> **不需要 AI 经验，不需要写代码。** 编辑配置文件，用 Markdown 写 Prompt，一键部署。

Promptos Starter 是一个开箱即用的 AI 内容生成应用模板。内置 **任务拆解引擎** + **4 个实用模块** + 可视化操作界面。所有定制都通过 JSON 和 Markdown 文件完成。

---

### 演示效果

```
你的输入: "我想做一个面向小企业的 SaaS 产品"

Promptos（任务拆解引擎）:
├── 第一阶段：市场调研（第 1-2 周）
│   ├── 确定目标客户群体
│   ├── 分析 5 个竞品
│   └── 进行 10 次用户访谈
├── 第二阶段：MVP 定义（第 3 周）
│   ├── 确定核心功能集（最多 3 个功能）
│   ├── 绘制用户流程图
│   └── 撰写产品规格文档
├── 第三阶段：开发（第 4-8 周）
│   ├── 搭建技术架构
│   ├── 开发认证 + 核心功能
│   └── 部署测试环境
└── 第四阶段：上线（第 9-10 周）
    ├── 20 人内测
    ├── 根据反馈迭代
    └── 正式发布 + 营销推广
```

---

### 包含什么

| 组件 | 功能 | 输出示例 |
|------|------|----------|
| **任务拆解引擎** | 将任何复杂目标分解为阶段、任务和子任务 | 4 个阶段、12 个任务的项目计划 |
| **项目规划 PM/OKR** | 基于任务列表生成 OKR、里程碑和执行时间线 | Q1 OKR：3 个目标、9 个关键结果 |
| **深度分析** | MECE 全面分析 — 风险、机会、权衡 | 5 维度分析 + 建议 |
| **技术架构顾问** | 为你的项目推荐架构和技术选型 | 技术栈对比表 + 架构图 |
| **写作大师** | 生成专业文档、报告和内容 | 结构化专业报告 |

---

### 快速开始

#### 方式一：一键部署（推荐）

1. 点击上方 **Deploy with Vercel** 按钮
2. 输入你的 API Key（[DeepSeek](https://platform.deepseek.com/) 注册即可获得，价格极低）
3. 等待 60 秒部署完成
4. 打开你的应用，开始使用

#### 方式二：本地运行

```bash
git clone https://github.com/eiragu/promptos-starter.git
cd promptos-starter
npm install
cp .env.example .env.local
# 编辑 .env.local，填入你的 API Key
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 即可。

---

### 定制你的应用

#### 添加新模块（2 分钟，不写代码）

1. 在 `config/prompts/modules/` 下创建一个 `.md` 文件，写入你的 Prompt 模板
2. 在 `config/modules.json` 中添加一行注册信息
3. 完成 — 新模块立即在界面和 API 中可用

#### 添加新的大模型（30 秒）

编辑 `config/providers.json`，添加一条记录。支持所有 OpenAI 兼容 API（DeepSeek、Groq、Together、Ollama 等）+ Google Gemini。

#### 修改现有 Prompt

所有 Prompt 都是 Markdown 文件，直接打开编辑即可。开发模式下修改立即生效。

---

### 这个项目的背景

Promptos Starter 不是一个实验项目。它的核心代码提取自 **[FuYouAI](https://fuyouai.com)**，一个拥有 80+ AI 模块的生产级内容生成平台。

我花了 3 个月从零构建了 FuYouAI，现在把核心引擎开源出来，让每个人都能用 5 分钟搭建自己的 AI 应用。

- 完整架构文档 → [promptos-architecture](https://github.com/eiragu/promptos-architecture)
- 完整产品体验 → [fuyouai.com](https://fuyouai.com)

---

### 关键词

`AI 应用模板` `Prompt 编排` `一键部署` `AI 内容生成` `任务拆解` `多大模型` `零代码 AI` `Next.js AI` `DeepSeek` `Gemini` `LLM 应用开发` `Prompt 管理`

---

### 作者

由 **[Eira](https://github.com/eiragu)** 构建 — 10 年金融销售经验，现在全职构建 AI 产品。

如果觉得有用，请给个 Star，这对我帮助很大。

---

_Star this repo if you find it helpful!_
