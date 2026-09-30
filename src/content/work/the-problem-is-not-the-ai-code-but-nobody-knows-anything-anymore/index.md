---
title: The Problem is not the AI Code, but Nobody Knows Anything Anymore
publishDate: 2026-09-26 00:00:00
img: ./hero.webp
img_alt: A dark racing-green hi-fi faceplate in the site's lacquer-and-phosphor palette — brushed metal knobs, two cream VU meters, two lit phosphor-green LEDs, gold hardware — with every engraved label plate left blank.
description: On shipping faster than anyone can understand, teams that can't explain their own systems, and why maintenance is still the final boss.
tags:
  - AI Agents
  - Engineering Culture
  - Maintainability
  - Repost
draft: false
---

<aside class="repost-note">
  <p class="repost-label">Reposted from ssp.sh</p>
  <p>The other side of the same coin as the last repost. Writing code is cheap now, and the thing that used to force a team to understand its own system — having to build it line by line — went away with it. Simon names what is quietly missing on a lot of teams: the intent and architecture behind the code, and anyone left who can explain why anything is the way it is. Short, blunt, and worth sitting with.</p>
  <p class="repost-source">Originally published by <a href="https://www.ssp.sh/about/">Simon Späti</a> on <time datetime="2026-09-26">26 September 2026</time> as <a href="https://www.ssp.sh/brain/the-problem-is-not-the-ai-code-but-nobody-knows-anything-anymore/">The Problem is not the AI Code, but Nobody Knows Anything Anymore</a>. Reposted here in full and unchanged.</p>
</aside>

If we think [writing code is dead](https://www.ssp.sh/brain/is-writing-code-dead/), and AI is generating all codebases, I still think the bigger problem is people or full teams not knowing anything anymore about the system architecture or the intent behind why certain choices have been made.

A comment on a discussion I had:

> I think AI writes probably average code (depending on the task and size). So if your **code base was below average AI can easily improve it up to average**. At least that's what I've observed here.

To me, the problem is not the AI code, but that nobody knows anything, and everyone just asks Claude. **You end up with no plan whatsoever**.

## The Current State in Fast-Moving Startups

[This tweet](https://x.com/v0xium/status/2101526107128529120) summarizes the current state at fast-moving startups well, or larger companies where middle management is pushing AI hard:

> I am done with this shit. It is over. The state of engineering right now is horrible. It has been half a month since I started a new role at a big company. Nobody knows anything here. The specs, code, tests, PRDs, tickets, resolution of those tickets, reports, etc., everything is made by Claude Code.
>
> Nobody on my team likes this. They are being forced to ship as much as they can. I have heard multiple times from higher management that pushing code is not a bottleneck, so why are we slow? People are working 12 to 13 hours a day just to press enter. Nobody is reading anything. Humans in corporate are doing nothing on their own.
>
> Everyone, literally everyone, from an L1 to an L7 engineer here is doing the same thing. Talk to Claude. There is no sense of victory. Nobody is resolving bugs. In reality, nobody is thinking anymore. Everything is done by LLMs.
>
> It is so soul-sucking. I would not mind it, to be honest, if we were at least given the time to check out the code and see what is going where. But no, the goal is to just ship. No matter what happens.
>
> [Voxium](https://x.com/v0xium/status/2101526107128529120)

Matthew Mullins [says](https://substack.com/@msmullins/note/c-348162722?r=gl1qa&utm_source=notes-share-action&utm_medium=web) it well too:

> We currently have a problem with COBOL programmers leaving the workforce, but agent coding is going to bring that problem to every development language.

## A Product Manager Could Now Build Anything He Wants

One could say a good product manager could now build anything they want and find a market, make it look good, etc., as the good point by [Sean Behan](https://x.com/bseanvt/status/2104600724894044577):

> I've always admired **product people who can't code but can manage a team to get the software they want**. Knowing what you want has always been the hardest part.

But then again, if you can't code, you will essentially build a very bad foundation for a product that's very hard to maintain (although AI is getting better at that too, especially when you iterate often, but still, if you choose the wrong language or the wrong mental model, you have the wrong start from the get-go).

It still **helps to know the fundamentals, either way**: for programming and designing a product, and for a good PM who knows what is needed but also understands system and architecture design.

### What about other Fields, like Data Engineering?

Hoyt Emerson mentions that data engineering is different:

> I think Data people are different. We've had to know everything about the product/business from day 1. AI just removes friction for us now.
> [Tweet](https://x.com/HoytEmerson/status/2104571457191743943)

I think data people who grew up pre-AI had to know everything (or a lot, or involve domain experts) to figure it out, indeed. But AI makes this obsolete, or **seemingly obsolete**.

That's why people starting today, or me as well, if I start today prompting away in a new field, all of a sudden, that knowledge is missing.

## The Final Boss is Still Maintenance

Thinking in systems, or architectures, or having intent and design- all of them help to be a better software engineer. Nowadays, [Writing code by hand might be dead, but it certainly helps](https://www.ssp.sh/brain/is-writing-code-dead/), and [Having Taste (with AI)](https://www.ssp.sh/brain/having-taste-with-ai/) is more important than ever.

But the final boss is, and always will be, maintainability. The easier it is to generate a quick pipeline, app, or BI dashboard, the more you have to maintain. And if nobody knows a thing, that can get really hard.

## AI Can't Drive Itself

Yes, the AI can't prompt itself, right? Why [do we even need humans](https://x.com/dashnetr00t/status/2104598755341463795)? To me, it's a clear sign that humans are still needed to direct and orchestrate it. That's also why **intent, taste, design, and architecture** are all killer features in today's world.

But once these are absent, or even worse, fundamental, get lost, it's really dangerous. I read today that this is a self-inflicted problem, and if we still hired juniors, then the problem wouldn't be happening. But yeah, it's not as easy.

> **On Intent and Conviction**
>
> Harry Dry said it early on that:
>
> > [Will AI replace Humans](https://www.ssp.sh/brain/will-ai-replace-humans/#harry-dry)
> >
> > Big ideas are less about creativity and more about conviction. [..] So, what happened? ‘Sauce and other shit’ got incredibly cheap! [..] There is no AI prompt for conviction. Harry Dry
>
> I wrote more on [Is AI solving this?](https://www.ssp.sh/brain/writing-is-hard/#is-ai-solving-this) that writing is hard, and writing from the heart is something only humans can do.

---

Origin: the primagen video and Limitations of LLMs and AI
References: [What I Learned Writing with AI](https://www.ssp.sh/brain/what-i-learned-writing-with-ai/)
