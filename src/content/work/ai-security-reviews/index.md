---
title: Old Vulnerability, New Threat
publishDate: 2026-05-19 00:00:00
img: ./hero.png
img_alt: A frontier coding model scanning legacy and core open-source codebases for old vulnerabilities, paired with a triaged report of severity-weighted findings
description: Anthropic's Mythos and the Project Glasswing release surfaced vulnerabilities that have been sitting in core projects for decades — and made every one of them readable at machine speed. A perspective on the new shape of the threat, and on the calibration the disclosure work still needs.
tags:
  - Security
  - AI Agents
  - Claude Code
  - Frontier Models
  - Vulnerability Research

draft: false
---

A lot of what I've been writing here has been about AI coding agents on the production side of work — [modernizing aging stacks](/work/legacy-code-migration/), backfilling tests against legacy systems nobody on the current team understands end to end, running scoped security audits inside the broader migration engagements. The center of those pieces was always the agent doing work the team had been postponing for years, on code the team owns. This one is about the same class of models pointed in the opposite direction — at codebases they don't own, looking for ways to break them.

### The scary part, plainly

The trigger is Anthropic's [Mythos Preview](https://red.anthropic.com/2026/mythos-preview/), released through a restricted distribution program they're calling Project Glasswing — only to "critical industry partners and open source developers," not general availability. The model is positioned as the next step after Claude Opus 4.7, and the public-facing demos sit squarely on the offensive side: zero-day discovery in open-source code, exploit development against memory corruption bugs, reverse engineering of closed-source binaries, chained exploitation of n-days that have been known and unpatched for years.

The published numbers from the announcement are the part worth pausing on. 181 successful exploits landed against Firefox's JavaScript engine in a single experimental run, where Opus 4.7 managed two over hundreds of attempts. Full control-flow hijack on ten separate, fully patched OSS-Fuzz targets. An autonomous 20-gadget ROP chain across multiple packets against FreeBSD NFS, executed end to end by the model with no human in the loop. More than 99% of the vulnerabilities Anthropic disclosed in the post were still unpatched at the time of publication.

The cautious reading of that isn't "AI is coming for our codebases" in the hype sense. The cautious reading is that a single model, given a target codebase and a harness, is now landing working remote-code-execution exploits against production software faster than the patch cycle of the affected projects can keep up with. The defensive side hasn't changed shape. The offensive side has compressed by roughly an order of magnitude. The capability exists. The model exists. The distribution is restricted today, and that restriction is doing real work — but the underlying capability is going to keep showing up in the next generation of models from every lab that can train them, and at some point the restriction stops holding.

### How it actually breaks things

What the model is doing in that loop isn't magic, and being precise about it is what makes the threat readable instead of vague. The work breaks down into stages that have always existed in vulnerability research — they used to take a senior person a week or two each, and a senior person who could do all of them at high quality was rare.

- **Read the whole codebase.** End to end, in a single sustained pass. Build a working mental model of what calls what, where the trust boundaries are, which paths attacker-controlled data crosses on its way into privileged code.
- **Pattern-match against known bug classes.** Stack overflows, type confusion, deserialization gadgets, missing bounds checks, integer narrowing, race conditions, broken auth — every bug class the model has read about across years of public vulnerability research, recognized in unfamiliar code by structural similarity. This is where the training data matters most: the model isn't inventing bug classes, it's recognizing instances of patterns it has seen elsewhere.
- **Hypothesize reachability.** A bug only matters if attacker input can actually reach it. The model traces the call graph backwards from the vulnerable code, working out which entry points expose it and which inputs trigger the vulnerable path. Most candidate bugs die here. The ones that survive are the practically exploitable ones.
- **Confirm by running it.** The model writes a proof-of-concept, compiles it in a scratch environment, and runs it. The output is a working exploit or a refuted hypothesis. There's no speculation step in between — the loop produces evidence either way.
- **Chain.** Most consequential exploits aren't single bugs. They're sequences — a memory disclosure into a memory write into a control-flow hijack, or a logic flaw producing an authentication bypass that unlocks an RCE elsewhere. The model can hold the chain together end to end in a way that used to be a specific kind of senior-researcher skill.

The historical asymmetry of vulnerability research was that doing all five of those well required someone with deep familiarity with the codebase, the patience to read through hundreds of files at a stretch, and enough exploitation experience to tell practically reachable findings from theoretical ones. The number of people in the world who could do all three at high quality was small, and most of them worked at vendors with budgets to match. Frontier coding models compress that into hours instead of weeks, and the pool of people who can run them is much, much larger than the pool of people who could do the work by hand.

That's the part that matters. The bugs themselves are the same. The economics of finding them just changed.

### Old bugs, new read rate

The vulnerabilities Mythos surfaced weren't created by Mythos. They were already there.

A 27-year-old OpenBSD TCP implementation flaw. A 16-year-old FFmpeg codec bug. A FreeBSD NFS RCE whose structure mirrors a bug class Kerberos patched in 2007. Most of these aren't new defects. They're old defects that finally got read end to end by something fast enough to turn the reading into a working exploit. Most teams couldn't afford the work to find them in any sustained way. Most of the CVEs that ended up in the public record were the ones somebody happened to stumble across, plus the ones a paid red team had budget to go looking for. The long tail has always been enormous — bugs sitting in code nobody had time to audit, on projects nobody got around to.

What changes with a frontier coding model in that loop isn't the bugs. It's the read rate. The long tail is now in scope for anyone with API access to a sufficiently capable model.

### Hardening engineering with AI

The flip side of the same capability is worth stating plainly. The model that can find bugs in your code can find them before someone else does, if you run it on your own. The right way to read [Cloudflare's Mythos writeup](https://blog.cloudflare.com/cyber-frontier-models/) is as a security engineering pattern, not a research disclosure. They didn't just report findings from pointing Mythos at more than fifty of their own repositories — runtime, edge data path, protocol stack, control plane, internal OSS contributions. They described the harness around the model that turned a frontier coding model into a continuous hardening tool. Recon, hunt, validate, dedupe — these aren't novelty pipeline names. They're the stages a defender needs in order to run this kind of capability against their own code at scale, repeatedly, and end up with output that engineering can act on rather than a pile of raw findings.

What that gives a defender, in practice:

- **Pre-emptive surface scans.** Point the model at the parts of the codebase that matter most — auth, parsing, network code, anything that touches attacker-controlled input — on a schedule, not just before a release. The point isn't to find every bug. It's to make sure the obvious ones get found on your side of the disclosure timeline.
- **Reachability-aware CVE triage.** Cross-reference the dependency tree against advisory databases, but with the model reading the call graph to decide which CVEs are actually reachable from a real entry point. The output is a much shorter, much more actionable list than `npm audit` or its equivalent produces on its own.
- **Hardening review on every PR.** Wire an agent into the review process that checks each change against the patterns the team has decided it doesn't want — sloppy JWT verification, unsafe deserialization, missing input validation, broken error handling that leaks state. The agent leaves structured comments at the fidelity a senior reviewer would, on every PR, without the bottleneck of waiting for one to free up.
- **Continuous fuzz-and-explain on the surfaces nobody had time to cover.** The OSS-Fuzz hit rate Mythos reported against patched targets is achievable on your own code too, with your own corpus, against your own targets. Work that used to require a dedicated security engineer with weeks of focus moves closer to a recurring background job.

The asymmetry is still there. A defender has to fix every reachable bug; an attacker only needs one. But the read-rate change applies to both sides, and the side that integrates it into engineering practice first ends up with a meaningful lead. Cloudflare's writeup is the worked example of that pattern for a vendor large enough to staff the harness in-house. For everyone else, the same shape of work runs at smaller scale — a scoped harness, fewer parallel agents, a tighter checklist — but the engineering pattern is the same.

The part of this that doesn't get talked about much is the unglamorous prerequisite. Fast, structured feedback the agent can actually read — type checker, linter, test runner all runnable from the command line with predictable exit codes. Documented patterns and conventions the agent can defer to. A test seam over the legacy surface so the model has something concrete to validate against. Guardrails on the parts that matter, so a wrong move surfaces at compile time rather than in production. All of that overlaps heavily with the production-side [legacy migration work](/work/legacy-code-migration/) I've been writing about — the codebase that's set up for AI agents to read is also the codebase that's set up for AI agents to defend, and that isn't a coincidence.

### Indian IT, specifically

All of that defensive picture assumes a codebase set up to be defended — fast feedback, documented patterns, a test seam, the prerequisites the section above lists. Most of the codebases I get pulled into in practice don't have any of those, and the structural reasons are worth being explicit about, because they shape where this threat lands hardest.

Most of my client engagements are with teams in or operating out of India, and the closer I look at the new threat surface from that vantage, the more concerned I get. None of this is to soften the threat picture above — if anything, the opposite.

The industry I work in has a few well-known structural problems that map badly onto a Mythos-class capability. A meaningful share of the systems running real business and government workloads here were built between 2010 and 2018 and have been maintained on a shoestring since. The collective default has been "if it isn't broken, don't fix it" — which is changing, but slowly, and mostly on teams that have already had a near miss. Frameworks are end of life. Dependency trees haven't been audited in years. Patch cadence is reactive. The teams that built these systems have mostly rotated out, and the teams that maintain them have a thin mental model of how the system actually works.

That stack profile is exactly what a model like Mythos eats for breakfast. A frontier coding model with broad pattern recognition across years of public vulnerability research, pointed at a Laravel 5 service or an AngularJS admin portal or a Java 8 monolith, will find things — and not the speculative kind. It will find specific, reachable, exploitable variants of bug classes the security community has been writing about for over a decade. The economics of attacking those systems just shifted, and the systems themselves didn't get any better defended in the meantime.

The exposure is much broader than business software. Government services, public institutions, health systems, banks, the back ends of consumer apps people use every day, plus a long tail of education and e-governance platforms — most of it built and operated by services firms on the same incentive structure, most of it carrying the same kind of debt. The pipeline from "someone runs a frontier-model security harness against this" to "a breach affecting a few million citizens" is short, and what stands between those two endpoints isn't particularly robust.

The cultural piece is harder to write about without sounding preachy. The honest version is that there's an education gap. Most of the engineers building and maintaining these systems came up in an environment where exploitation was somebody else's problem, where security was a separate function tacked on at the end if it was done at all, and where "how things actually get hacked" wasn't part of standard training. That's beginning to shift, but not at the rate of change happening on the attacker's side now that frontier models are in play.

Then there's the business side, which is where I find the conversation hardest to have. It's genuinely difficult to convince a buyer that an eight-year-old CMS running fine needs a security ramp-up — that the cost of doing the work now is a fraction of the cost of someone exploiting it later and the company finding out about it through the press. The incentive structure rewards keeping the lights on. Vendors compete on price, security is the first line item to get cut, and the systems that come out the other side reflect that. The pattern has been written about for years. The variable that's changed is the cost of attacking, and once that drops the cost of doing nothing stops being theoretical.

The version of this I want to push for is responsibility tied to construction. If you build a system, you carry responsibility for keeping it reasonably secure for the lifetime anyone is using it, and the business buying that system has to be willing to pay for that work. Both sides of that have to move. Buyers have to start treating security as a budgeted, ongoing line item with real allocation, the way they treat hosting or compliance. Vendors have to stop racing each other to the bottom on price while knowing security will be the first thing to absorb the cuts. None of that is new advice. What is new is that the threat finally has the kind of teeth that should change the conversation.

### The work in front of us

The same model that makes the threat acute is also part of the answer, for teams willing to put the work in. Most of what I'd be telling clients in India right now isn't new advice — the AI-driven version just compresses the timelines.

- **Modernization mapped to exposure.** Pointed at a legacy codebase, a frontier coding model will read it, surface the highest-risk surfaces, and rank what's safe to deprecate first. That's a modernization roadmap built around actual reachable risk rather than the usual mix of vendor pitches and gut feel. For a team sitting on a Laravel 5 monolith with three years of unmerged Dependabot PRs, this is the difference between an indefinite rewrite project and a six-month plan to retire the riskiest parts first while the rest keeps running.
- **A real view of the supply chain.** Not "what's in `package.json`" but the resolved dependency tree, every transitive, with reachability traced through to actual call sites. Most teams I've worked with don't have this. Nobody can say with confidence which CVEs in the tree are actually exploitable on a code path the application uses, and the result is either over-patching with broken builds or under-patching with breaches. The model handles that triage in hours.
- **Discipline on what goes in.** Fewer dependencies. Pinned versions. Vetted intake on anything new — the model can read a candidate library and tell you whether its history reads "well maintained" or "abandoned with a CVE backlog and a stale advisory thread." That's diligence work that used to take a senior developer half a day per dependency. It now takes minutes per package.
- **Incident response you've actually run.** Most teams I've seen have an IR document in a wiki somewhere and have never simulated it. The same model that finds the vulnerabilities can walk a team through a fresh incident — what indicators to look for in logs, what to preserve before a reboot, who to notify, what the regulatory disclosure window looks like in the relevant jurisdiction. The point isn't to replace a security function. It's to make sure a four-person team that doesn't have one can move sensibly when the call comes in.

None of that is a single team's project. The larger move has to happen at industry scale — in the conversations between buyers and vendors about what reasonable security looks like as a budgeted, ongoing line item rather than a one-time pentest at the end of a build. The earlier that conversation gets started in earnest here, the better positioned the systems people actually depend on are when the first serious wave of frontier-model-driven attacks lands. The window for getting in front of this is real but not large, and the cost of doing nothing now is no longer theoretical.

### The disclosure side

All of that assumes you're running the model on code you own. The other side of running it carefully is what happens when it's pointed at code you don't.

The security industry isn't always good at restraint here. Vendor blog posts after a discovery often read like everything was on fire, and the noise gets noisier when an AI capability lands on top of it. Two things tend to get blurred:

- **Severity isn't uniform.** "Mythos found vulnerabilities in every major operating system" is technically true and also conceals most of what matters. Not every CVE is remote code execution. Plenty of findings are local-only, require an already-authenticated session, depend on a configuration that's rare in practice, or only matter on an end-of-life platform with a tiny remaining user base. The Mythos writeup itself includes a secondary agent that filters by severity. The announcement headlines tend not to.
- **Long-running open-source projects have always lived with this.** A maintainer team of three or four people on a critical core project is making triage decisions every week about what to look at next. They aren't ignoring the long tail because they don't know it's there. They're prioritizing what gets fixed against the time they actually have. The reasonable version of an AI-assisted disclosure recognizes that — a tuned report, scoped to what's actually exploitable, against a roadmap the maintainers can act on. The unreasonable version dumps fifty findings on a four-person team and expects gratitude.

None of that argues against running these models. It argues for pairing the kind of harness Cloudflare built around the model with calibration on the human side — coordinated disclosure, severity-weighted reporting, an honest read on where the maintainer team's attention actually is. Mythos and the scaffolding around it are loud because the underlying capability is real. The work after that, on the disclosure side, is mostly social, and the model doesn't help with that part at all.

...