---
title: Reducing Tech Debt with AI-Driven Development
publishDate: 2026-05-18 00:00:00
img: ./hero.png
img_alt: An aging backend stack being incrementally migrated onto current frameworks with AI coding agents handling the repetitive work
description: Cutting tech debt and shipping changes faster on aging systems. AI coding agents handle the slow parts — codebase reading, test backfill, language ports, root-cause triage — so migrations and bug fixes that used to take months land in days or weeks. Architecture decisions stay a human call.
tags:
  - Legacy Migration
  - AI Agents
  - Claude Code
  - Refactoring
  - Modernization

draft: false
---

A lot of the work I've been doing over the past year has been some version of the same conversation. A team has a system built between 2016 and 2020 that nobody currently on the team wrote, the framework or runtime is one or two major versions past end of life, the test coverage is thin, and every product decision now starts with "well, but it depends what the old system does." They don't want a full rewrite — that's expensive and the product team can't afford the freeze — but they also can't keep stacking features on a base they're nervous about.

I tend to get pulled in for the work in between. Some of it is straightforward refactoring; a lot of it is sitting with a codebase nobody fully understands anymore and turning it back into something the team can reason about. The shape of the work varies a lot — sometimes it's a version upgrade in place, sometimes it's a full port out of the original stack into a target language the team is better positioned to maintain going forward (most often Node, Python, Go, or Java in my case). The shift for me over the last year has been that AI coding agents are now genuinely useful for the slow, expensive parts of that work — the reading, the test backfill, the repetitive translation — which has changed the economics of a kind of project that used to be a hard sell to leadership.

### What I usually see

The stacks vary, but the pattern doesn't. A few recent shapes:

- A codebase that grew under sustained deadline pressure and never got cleaned up — tight coupling everywhere, the same business rule reimplemented in three or four slightly different places, no real separation between layers, and every non-trivial change radiating across half the files. The team has long since stopped trying to fix the root cause and just routes around the worst parts.
- An AngularJS 1.x admin portal that still runs core operations, with a thin layer of jQuery widgets glued to it.
- A Vue 2 SPA the team is nervous to upgrade because the original developer is gone and the build is held together with patched transitive deps.
- A React 16 dashboard built on class components and a sprawling Redux store, with side effects living in `componentDidMount` calls nobody traced.
- A Node 8 or 10 Express monolith on an EC2 box, where the route handlers read more like scripts than services and the business logic lives wherever the original author happened to drop it.
- A core PHP or Laravel 5.x service running a piece of internal workflow, where the team has decided the right move is to retire and rewrite it in something more current rather than upgrade it in place.
- A Python 2.7 Django service that quietly handles a piece of revenue-critical workflow, with Celery 3 workers nobody has touched since the original deploy.
- A Webpack 2 or 3 config that takes 90+ seconds to rebuild on a good day and that nobody is willing to edit.
- A dependency graph that's been sliding into disrepair for years — components pinned multiple majors behind current, several with severe CVEs sitting open in critical paths, and transitive deps stacked deep enough that nobody can confidently say what's actually shipping in production. Even the smallest utility module pulls in dependency hell, and Renovate or Dependabot PRs pile up unmerged because no one on the team can safely verify any of them.

The shared problem isn't really the framework version. It's that nobody on the current team has a complete mental model of what the system does, the tests don't cover the parts that matter, and the surrounding ecosystem has moved on, so even routine dependency updates have become risky.

### How I use AI agents in this work

I treat the agent as one of the tools I bring to a project, not the project itself. The places I've found it earns its keep:

- **Reading the codebase fast.** In the first week or two on a project, I'll spend a lot of time running the agent over the existing code to build up a description of what's there — which endpoints exist, which state is shared between which components, what's actually being called from where. That used to take me two or three weeks on a non-trivial codebase. It now takes a few days, with most of the time spent verifying the agent's summary instead of producing it from scratch.
- **Generating tests against the existing behavior.** This has been the biggest unlock for me. Before, getting a legacy system into a state where I could refactor it safely meant writing characterization tests by hand, slowly, until the team trusted them. Now I can have the agent draft a regression suite against the running system, then go through and tighten or drop the parts that don't matter. The team ends up with a real safety net before the migration starts.
- **Repetitive translation.** Once a pattern is set — "this is how an AngularJS controller maps to a React component, and here's how `$scope` gets translated to props plus a hook" — the agent applies the same pattern across the rest of the codebase consistently. I review the diffs, fix the cases the pattern doesn't fit, and the team gets a uniform style instead of the slightly-different-per-developer version you'd otherwise end up with.
- **Producing the documentation the project never had.** As a side effect of the work above, I end up generating the architecture notes, dependency maps, and runbook-level documentation that most teams haven't had time to write. That's a deliverable in itself on a lot of projects.

The places it doesn't carry me are the ones you'd expect: deciding what the new architecture should look like, drawing service or component boundaries, calling whether a legacy quirk is a bug or a contract, choosing what to deprecate. Those are still my call, worked out with the team.

### Custom agent workflows

Off-the-shelf agents handle the parts of the work that look the same across most projects — reading code, generating tests, repetitive translation. Where I get more leverage is in building small, task-specific agent flows wired to the team's actual standards, infrastructure, and review process.

Some of the shapes those have taken:

- **Security audit agents.** A scoped agent that walks the codebase against a checklist of concerns specific to the project — auth flows, input validation, secrets handling, dependency CVEs, common injection surfaces — and digests the findings into a structured report the team can triage, instead of a wall of file:line citations the way a raw scanner would produce.
- **Behavior review agents.** Custom flows that examine a single concern — every place a feature flag is read, every code path that mutates a particular table, every external API call that lacks a retry or timeout — across the whole codebase, and produce a report on edge cases, inconsistencies, and risks. Useful before a migration when the team needs to know exactly what they're about to change.
- **CI-integrated review agents.** Agents wired into the PR workflow that enforce the team's real conventions (not just lint rules), check for architectural drift, and flag patterns the team has decided they don't want anymore. The agent leaves structured comments the way a senior reviewer would, but consistently, on every PR, without the bottleneck of waiting for one human.
- **Observability-driven debugging.** An agent that pulls recent issue reports from Sentry (or whatever the team uses for error tracking and APM), correlates them with recent deployments, git history, and the codebase itself, and produces a triaged set of root-cause hypotheses with the relevant code references attached. The human picks up the investigation 80% of the way in, with the right files already on the table, instead of starting from a Sentry dashboard.
- **Standards enforcement runs.** Agents that periodically scan the codebase against the documented patterns and flag drift — places where someone wrote a one-off when a shared helper exists, or used a deprecated internal API, or shipped a service without the standard observability hooks. This earns its keep especially after a migration, when the new conventions are still fresh and easy to undermine.

The pattern across these is the same shape: a small agent with a tight scope, a clear definition of what "good" looks like for that team, and a structured output that plugs into whatever the team already uses (PR comments, issue trackers, Slack, dashboards). They cover the slow, manual sweep nobody on the team has time to do consistently.

### What the work usually looks like

Most of it falls into one of these shapes:

- **Backend framework upgrades.** NestJS 6/7 to current NestJS or a thinner Hono/Fastify replacement; Django 1.x to Django 5 or FastAPI; Spring Boot 1.x to 3; Express monoliths broken up into typed service modules; older Go services brought onto current Go with generics, structured logging, and a cleaner module layout.
- **Cross-stack ports.** A lot of the work isn't a version bump at all — a core PHP or Laravel 5.x service rewritten as a Node serverless API or a Go HTTP service; an older Ruby or Rails app ported across to Node or Go when the team no longer has Ruby people on hand; a heavyweight Java service consolidated into a leaner Go binary when the operational profile favors it; a Python 2 worker rewritten in Go for the runtime characteristics rather than upgraded to Python 3. The call usually comes down to where the team has hiring leverage and what the new system needs to look like at runtime, not which language was there originally.
- **Frontend framework upgrades.** AngularJS to React 19; Vue 2 to Vue 3 with the Composition API and Pinia; React class components plus Redux to hooks and TanStack Query.
- **Runtime moves.** Python 2.7 to 3.12 (the one a lot of teams kept postponing); Node 8/10/12 to Node 22 or Bun; Java 8 to Java 21; older Go (pre-generics) onto current Go.
- **Data and persistence layer.** Older Sequelize or TypeORM moved onto Drizzle or modern Prisma; raw `database/sql` Go services moved onto sqlc or a typed query layer; stored-procedure-heavy schemas refactored toward thin application logic plus proper migrations; Mongo collections that grew without schemas tightened up with validation.
- **Background jobs and async work.** Older Sidekiq, Celery 3, or Bull setups moved onto modern queue infrastructure — BullMQ on the Node side, Celery 5 on Python, Asynq on Go, or hosted options like Inngest or Trigger.dev — with retries, dead-letter queues, and observability the team can actually monitor.
- **API surface.** REST sprawl consolidated behind tRPC or a clean OpenAPI contract; older SOAP or hand-rolled JSON endpoints replaced with a proper gateway; hand-rolled Passport.js auth or DIY JWT moved onto Better Auth, Clerk, or a maintained Lucia-style setup.
- **Tooling and DX modernization.** ESLint legacy configs onto Biome or Oxlint; Jest setups onto Vitest; Webpack 2/3 with custom Babel chains to Vite or Turbopack; Python toolchains from pip + setuptools + black + flake8 onto uv + Ruff; Lerna monorepos to Turborepo or Bun workspaces; classic npm or Yarn to pnpm or Bun. The speed shift between the older tools and the new Rust-based generation (milliseconds where it used to be seconds, seconds where it used to be minutes) matters more than it sounds — it changes the rhythm of the dev loop for the team, and it gives AI agents the fast, structured feedback they depend on to be useful.
- **Platform moves.** Heroku and aging EC2 setups to Vercel, Cloudflare, or container platforms; cron-scheduled scripts to serverless functions; older Lambda runtimes onto modern ones with proper observability and CI.
- **Test backfill on its own.** Some projects are just "we want to modernize eventually, but our coverage is so thin we can't safely start." That work — an agent-assisted regression suite over the legacy system — is often the first project, and the migration follows later when the team is ready.

### Making the codebase AI-ready

Before the migration work itself starts, I usually spend a few days getting the codebase into shape for the agent. The team gets most of the benefit; the agent gets the rest.

- **Documented patterns and conventions.** A `CLAUDE.md` (or equivalent agent-readable doc) at the repo root that captures the conventions, where to find things, the code-generation rules, and which parts of the system shouldn't be touched without a human in the loop. Without this, every agent run starts cold and rediscovers the wheel.
- **Fast, structured feedback.** Type checker, linter, test runner all wired up to be runnable from the command line with predictable exit codes and parseable output. The agent reads tool output the way a human reads a stack trace — if it's noisy or slow, the resulting decisions get worse. This is a big part of why the modern Rust-based tooling (Biome, Oxlint, Ruff, uv) matters here: not the speed for its own sake, but the way it keeps the agent's loop tight.
- **Guardrails on the parts that matter.** Pre-commit hooks for the conventions that are non-negotiable; tests around the invariants that are easy to break; tighter type configs (TypeScript strict, mypy strict on critical modules) so wrong moves get caught at the compile step rather than in production.
- **A test seam over the legacy surface.** Characterization tests or recorded fixtures of the pre-migration behavior, so the agent has something concrete to validate translated code against rather than its own assumptions.
- **Clean module boundaries.** A small amount of upfront refactoring to surface the real boundaries before the agent starts working at scale, so the resulting diffs end up reviewable in small chunks instead of one massive PR.

### How I work through the project

A few things I've found matter more than they sound like they should:

- **Start somewhere the team can afford to be wrong.** A reporting dashboard or an internal admin tool is a better first piece than the checkout flow. It de-risks the approach and gives me concrete results to point at when we're sizing the bigger pieces of work.
- **Run new and old side by side as long as possible.** Strangler-fig at the route or feature-flag level, parallel API calls compared in CI, gradual cutover per surface. The operational cost is real, but the cutover stops being one scary day.
- **Review agent output the same way I'd review a junior engineer's PR.** Compiles isn't passes; passes isn't correct; correct isn't shippable. I keep the loops tight — small task, verify, commit — so the resulting diff is something the team can read and own after I move on.
- **Hand back something maintainable.** The goal isn't a clever migration; it's a codebase the team can keep working on without me. That shapes a lot of small decisions about style, framework idioms, and how heavily I lean on the agent for parts where the team's own conventions matter.

### Getting in touch

If your team has a stack that isn't ancient but is starting to feel that way, the first conversation is usually short — what the system does, what breaks if it stops, what "modernized" needs to mean for the people who'll own it after — and that's normally enough for both of us to know whether bringing me in is the right move.

---
