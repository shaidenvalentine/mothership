MOTHERSHIP
Website Project Brief — Build Specification for Claude Code
Project: mothership.com — the most advanced website in the luxury van industry
Built by: Claude Code
Owner: Shaiden Valentine
Date: May 2026
Status: Ready to build — execute Phase 1 immediately

TL;DR for Claude Code
Build the most advanced website in the luxury adventure van industry. Tesla-grade configurator. Cinematic scroll-driven 3D van rotation. Dark, minimal, futuristic — Apple meets Tesla meets Polestar, but for off-grid vehicles.
The one-sentence positioning: The world's first 3D-printed, fully-electric, patent-pending luxury adventure van. Six-week builds. Cost basis nobody else can touch.
The one-line user journey: Scroll → marvel → configure → book a call.

Tech stack — fixed decisions
These are non-negotiable. Don't suggest alternatives; build to this stack.
Layer
Tech
Why
Framework
Next.js 15 (App Router)
RSC, image optimization, edge runtime
Language
TypeScript (strict)
Configurator state is complex; types prevent regressions
Styling
Tailwind CSS v4 + shadcn/ui
Speed of iteration + composable primitives
3D
React Three Fiber + Drei
Declarative 3D in React, huge ecosystem
Scroll animation
GSAP + ScrollTrigger + Lenis
Industry standard for cinematic scroll. Pin sections, scrub timelines.
Micro-animations
Motion (framer-motion v11+)
Component-level transitions, layout animations
Fonts
Display: PP Editorial New (or Söhne Breit). Body: Söhne or Inter Tight.
Editorial luxury feel — NOT generic Inter/Roboto.
CMS
None initially — content as TypeScript objects in /content. Migrate to Sanity if needed later.
Speed of build. Add CMS when content scales.
Forms
React Hook Form + Zod validation
Standard for typed forms
Booking
Cal.com embed (configurable, white-label)
Better white-label than Calendly
AI qualification
OpenAI Responses API via Next.js Route Handler, n8n webhook for CRM sync
Matches Shaiden's existing OpenClaw + n8n stack
Email
Resend + React Email
Modern, typed, beautiful templates
Analytics
PostHog + Vercel Analytics
Funnel analysis (config drop-off rates) + web vitals
Hosting
Vercel (Pro)
Edge cache, image optimization, preview deploys

Design system
Brand voice
Dark. Default to a near-black background (#0A0A0A, not pure #000). White type. Sparing accents.
Minimal. Apple-product-page minimal. Wide whitespace. One idea per scroll section.
Cinematic. Type animates in. Vans rotate. Light shifts. Nothing feels static.
Confident. Few words, large type, no marketing fluff. Specs and capabilities speak for themselves.
Editorial. Magazine layouts. Asymmetric grids. Captions in a refined sans. Big numbers as ornament.
Color tokens
Define as CSS variables in globals.css. Use OKLCH for perceptually uniform color.
:root {
  /* Base */
  --ms-black: oklch(0.08 0 0);            /* #0A0A0A — true page bg */
  --ms-obsidian: oklch(0.13 0 0);         /* #1A1A1A — card bg */
  --ms-graphite: oklch(0.22 0 0);         /* #2D2D2D — borders, separators */
  --ms-ash: oklch(0.45 0 0);              /* #6E6E6E — secondary text */
  --ms-fog: oklch(0.72 0 0);              /* #B0B0B0 — captions */
  --ms-bone: oklch(0.94 0.005 80);        /* #F0EEEA — primary text, warm */
  --ms-paper: oklch(0.98 0.005 80);       /* #F8F6F2 — surfaces */
 
  /* Accent — Mothership signature */
  --ms-ion: oklch(0.78 0.16 230);         /* cool electric blue — accent */
  --ms-ember: oklch(0.72 0.18 50);        /* warm copper — secondary accent */
 
  /* System */
  --ms-success: oklch(0.72 0.18 145);
  --ms-warning: oklch(0.78 0.18 75);
  --ms-danger: oklch(0.65 0.22 25);
}
Typography scale
Display font carries the brand. Body font carries the spec. Both must be installed.
/* Display: PP Editorial New (primary) or Söhne Breit (fallback) */
/* Body: Söhne or Inter Tight */
 
--font-display: 'PP Editorial New', 'Söhne Breit', serif;
--font-body: 'Söhne', 'Inter Tight', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', 'IBM Plex Mono', monospace;
 
/* Scale — modular ratio 1.333 */
--text-display-2xl: clamp(4.5rem, 10vw, 9rem);     /* hero */
--text-display-xl: clamp(3rem, 7vw, 6rem);          /* section heads */
--text-display-lg: clamp(2.25rem, 5vw, 4rem);       /* feature heads */
--text-display-md: clamp(1.75rem, 3vw, 2.5rem);
--text-body-lg: 1.25rem;
--text-body: 1rem;
--text-body-sm: 0.875rem;
--text-caption: 0.75rem;       /* uppercase, tracking-wider */
Motion principles
Easing: Default to custom easing — `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out). Never default ease-in-out — too soft for this brand.
Duration: Micro: 200ms. Page transitions: 600ms. Hero reveals: 1200ms. Scroll-scrubbed: tied to scroll progress, no fixed duration.
Stagger: 80–120ms between sibling animations. Hero text reveals stagger by word, not character.
Scroll: Lenis smooth scroll, lerp 0.08. Disable on mobile (use native).
Performance budget: 60fps minimum on M1 MacBook + iPhone 13. Test every interaction.

Site map
Route
Purpose
/
Homepage — hero scroll experience, feature reveals, CTA to configurator
/configure
Tesla-style configurator. Live 3D van + options panel + live price.
/configure/summary
Build summary → "Book a Call" CTA, qualifies via AI
/technology
Deep dive on the 3D-printed manufacturing process, patent positioning, robot arm
/vans
Past builds gallery (Mothership #3, #5, etc.) — proof of capability
/vans/[slug]
Individual van detail page (spec sheet, gallery, story)
/process
How a Mothership is built — 6-week timeline visualized
/about
Founder story (Brandon + Shaiden), San Diego shop, patent story
/journal
Long-form content / build logs. Optional Phase 3.
/contact
Direct contact form (lower funnel) + Cal.com embed

Homepage — section-by-section spec
This is the most important page. Build it to the spec below exactly. Every section is a pinned scroll moment with its own animation choreography.
Section 1: Hero — the 360° van rotation
The moment: Black screen. A single line of type fades in: "Your next home may not have an address." Beat. Type dissolves. A Mothership materializes from the void as you start to scroll. As you scroll, the van rotates 360°. At the midpoint of the rotation, the exterior dissolves to reveal the 3D-printed interior. Scroll continues — the interior view rotates, lighting shifts, and at full scroll completion, the camera pulls back and the headline appears: "Mothership. The world's first 3D-printed luxury electric van."
Implementation
Asset path A (preferred): Brandon exports the van as glTF/GLB. R3F loads it. We control camera position via scroll-driven Three.js camera animation. Exterior → interior reveal is achieved via opacity transition on the exterior shell mesh (or a clipping plane that sweeps across the model).
Asset path B (fallback): Image sequence — render 120 frames of the van rotating (every 3°) at 4K. Plus a separate 60-frame interior sequence. Use a canvas-based image sequence player synced to GSAP ScrollTrigger. This is what Apple does (see iPhone product pages).
Tech: Pin the section for 200vh of scroll. Use ScrollTrigger.scrub: 1 (smooth scrub) tied to the canvas frame index. Preload all frames before user reaches the section.
Performance: If image sequence, use WebP at 90% quality, lazy-decode, GPU-composited canvas. Target 8MB total payload for sequence.
Section 2: The opening claim
The moment: Three claims, one after the other, full-screen type, each staying for ~1 viewport of scroll.
"3D-printed. Patented manufacturing nobody else can replicate."
"Fully electric. Zero compromise, infinite range with the right infrastructure."
"Six weeks. From order to delivery. The industry takes a year."
Implementation
Pin section, scroll-scrubbed. Each claim slides up from below, holds, slides up and out. 
Word-by-word reveal — split text by space, stagger opacity + y-translate. 
Background subtly shifts color between claims (very dark blue → very dark warm → black).
Section 3: Cinematic feature reveals
The moment: A horizontal scroll-jacked sequence of the van's standout features. Each feature gets a full-screen panel with: a Higgsfield-generated cinematic loop of the feature in context, a one-line headline, a single key spec, and a "learn more" link.
Features to highlight (in order)
3D-printed interior architecture — "Geometry that wasn't possible before"
Fully integrated electric drivetrain — "Silent. Off-grid. Always ready."
Spark Core power system — "15+ kWh. Solar + dual alternator. Weeks off-grid."
Spa bathroom with incinerating toilet — "No dump stations. Ever."
Invisible induction kitchen — "Surface up. Surface down. Magic."
Spa shower with real tile + teak — "Five-star hotel, anywhere on Earth."
AWD + lifted suspension — "Drive past where the pavement ends."
Starlink + smart home control — "Work anywhere. Live everywhere."
Implementation
Each feature panel pins for 100vh, then horizontal-scrolls or vertical-scrolls to next. 
Higgsfield-generated 8-second loop video (WebM, ~2MB each) autoplays muted. 
Text animates in with 80ms word stagger after video has been visible 400ms.
Section 4: The technology section
The moment: Tron-style. Black background. A wireframe outline of the van. As you scroll, the 3D-printed interior pieces fly into place from offscreen — each labeled with what makes it impossible for competitors to replicate.
Callouts
Patent-pending interior architecture
Generative-design ribbing — strength without weight
Zero-fastener assembly — interior parts snap together
Modular layout — reconfigurable in under a day
$140K build cost — the math nobody else can hit
Section 5: The numbers
The moment: Massive type. Single-screen statement grid.
Layout: 2×2 grid of huge stats. Numbers animate from 0 → final on scroll-into-view.
6 weeks — average build time
$140K — build cost we hit (others hit $250K+)
15+ kWh — onboard energy storage
8 — seats in the lounge
Section 6: The configurator teaser
The moment: Half-screen split: left side, a Mothership shifts through 3 different interior palettes; right side, copy: "Design yours. Start with a palette." Big CTA: "Configure Your Mothership".
Section 7: Past builds
The moment: Horizontal-scroll gallery of Mothership #3, #5, and the new 3D-printed builds. Each card click → /vans/[slug]. Editorial layout, large images, minimal text.
Section 8: Founder section
The moment: Two large portrait photos side by side — Brandon in the San Diego shop, Shaiden in Bali. Two short blocks of copy under each. "Engineering: Brandon Buckley" / "Brand & Design: Shaiden Valentine."
Section 9: Final CTA
The moment: Black screen. One line: "Your next home may not have an address." Below it, two buttons: "Configure Your Mothership" / "Book a Call".
Footer
Minimal. Logo + 4 columns of links + IG/YouTube/TikTok.
Newsletter signup (Resend + double opt-in).
San Diego address. "Mothership © 2026".

Configurator — /configure
This is the most technically demanding page. Treat it like the centerpiece. Tesla quality bar.
Layout
70/30 split — left 70% = 3D van view. Right 30% = options panel.
Bottom bar (full width) = running price + "Continue to Summary" CTA.
Top bar = step progress (Exterior / Interior / Wheels / Features / Summary).
Mobile: stacked. 3D view top (50vh), options scrollable below. Sticky bottom price bar.
Configuration options
Step 1: Exterior color
Stealth Black (default)
Lunar White
Graphite Metallic
Dune (warm sand)
Custom (+$5,000) — opens custom inquiry
Step 2: Interior palette
Obsidian — black + dark teak + brushed steel
Bone — warm cream + light teak + bronze
Slate — gray + walnut + matte black
Ember — deep brown + cognac leather + brass
Step 3: Wheels
18" Forged AT (default)
17" Black Rhino All-Terrain (+$0)
20" Forged Sport (+$3,500) — not recommended for off-road
Step 4: Key features (add-ons)
Rooftop tent (+$8,500)
Lithium upgrade — 20 kWh (+$12,000)
Starlink Roam pre-installed (+$2,800)
Bull bar + winch (+$5,500)
Awning with LED (+$3,200)
Off-road light package (+$2,400)
Spa shower upgrade (+$4,200)
Incinerating toilet (default — no upcharge)
Live pricing
Base price: $295,000 (3D-printed Mothership)
Pricing displays: animated count-up on every selection change (300ms duration, expo-out easing).
Estimated delivery: "Reserve now → Delivery in 8 weeks" (configurable based on current queue).
3D view behavior
Default: orbit view, slow auto-rotate (0.2 rad/s). Pauses on user interaction.
Mouse/touch drag: orbit camera. Pinch: zoom. Two-finger drag: pan.
Exterior color: swap albedo texture on body mesh.
Interior palette: when user selects, camera animates inside the van. Cabin lights up. Interior textures swap based on palette.
Wheels: swap wheel mesh.
Features: visually appear on the van (rooftop tent mesh fades in, awning extends, etc.).
Summary page
Renders the configured van large on left.
Spec list on right with all selections.
Total price (large).
CTA: "Book a Call With Shaiden" → opens Cal.com modal.
Secondary CTA: "Save Build" → emails the config to user via Resend.

AI lead qualification — /api/qualify
When user submits the booking form, a Next.js Route Handler calls OpenAI Responses API to qualify the lead before it hits Shaiden's calendar.
Form fields collected
Name, email, phone
Build configuration (auto-populated from configurator state)
Timeline (when do you want delivery?)
Use case (full-time live in, weekend adventures, business, etc.)
Budget confirmation (yes/no on the configured price)
How did you hear about us
Qualification logic
Server-side, OpenAI scores the lead 1-10 against these criteria:
Budget alignment (must confirm at configured price level)
Timeline (qualified: 0-12 months; nurture: 12+ months)
Use case clarity (specific > vague)
Source quality (referral > IG > cold)
Routing
Score 8-10: Calendar instantly available. Cal.com modal opens with Shaiden's qualified-lead calendar.
Score 5-7: "Thanks — we'll review and reach out within 24h." Synced to n8n → CRM with "warm" tag.
Score 1-4: "Thanks — added to our list." Synced to n8n → CRM with "nurture" tag. Triggers 6-email Resend drip.
Integration
// app/api/qualify/route.ts
import OpenAI from 'openai';
import { qualifyLeadPrompt } from '@/lib/prompts';
 
export async function POST(req: Request) {
  const body = await req.json();
  const openai = new OpenAI();
  
  const response = await openai.responses.create({
    model: 'gpt-4o',
    input: qualifyLeadPrompt(body),
    response_format: { type: 'json_object' }
  });
  
  const { score, tag, reasoning } = JSON.parse(response.output_text);
  
  // Fire-and-forget webhook to n8n for CRM sync
  fetch(process.env.N8N_WEBHOOK_URL!, {
    method: 'POST',
    body: JSON.stringify({ ...body, score, tag, reasoning })
  });
  
  return Response.json({ qualified: score >= 8, score, tag });
}

Assets — what's needed and where it comes from
From Brandon
3D model of the van (preferred: glTF 2.0 / .glb, draco-compressed, < 25MB)
If no glTF: high-res render sequence (120 frames at 4K, 3° increments) of the van rotating
Interior render sequence (60 frames, interior camera orbit)
Hero render of the 3D-printed interior architecture (close-up details of the printed ribbing)
Photos of the robot arm and the San Diego shop
Portrait of Brandon for the founder section
Patent documentation (snippet or claim language we can show on /technology)
From Shaiden
Mothership #3, #5 build photos (already available)
Portrait for the founder section
Brand guidelines (logo files, type spec)
Customer testimonials (if any) from past builds
Generated via Higgsfield
Use Brandon's static renders as input → generate cinematic motion.
8-second feature loop videos (one per feature section — see Section 3 above)
Cinematic lifestyle b-roll: van driving through desert at dusk, parked in pine forest, on a cliffside at sunrise, in an urban warehouse
Interior detail shots: kitchen in use, bathroom steam, lounge at night with ambient lighting
Driving POV through landscapes
Time-lapse style content for the manufacturing process
Stock / licensed
Avoid stock photography entirely. If unavoidable, use Unsplash Plus + heavy color grading to match brand.

Performance budget
Metric
Target
Why
LCP
< 1.8s
Hero must feel instant
INP
< 100ms
Configurator must feel native
CLS
< 0.05
No layout shift, ever
Total page weight
< 8MB initial
Lazy-load 3D + sequences
Configurator FPS
60fps M1 / 30fps iPhone 13+
Drop-shadow on slow devices
Use next/image with priority for hero. Use next/dynamic with ssr: false for R3F components. Preload critical fonts. Defer analytics. Image sequences load on idle, not on initial paint.

Build phases — execute in this order
Don't try to build everything in one shot. Phase the work. Each phase ships something demonstrable.
Phase 1 — Foundation (Days 1-3)
Next.js 15 + TS + Tailwind v4 + shadcn/ui scaffolding
Design tokens (CSS variables for colors, type scale, spacing)
Font loading (display + body)
Layout shell: nav, footer, base page wrapper
Static homepage with all sections as placeholders (no animation yet)
Deploy to Vercel preview URL
Demo-able output: "Here's the skeleton — see the typography, the colors, the structure. Brandon, this is the bones."
Phase 2 — Hero scroll experience (Days 4-7)
Install Lenis, GSAP, ScrollTrigger
Implement the 360° rotation hero (use image sequence first; swap to R3F when glTF arrives)
Implement "the opening claim" section with word-by-word reveals
Demo-able output: "Here's what scrolling Mothership looks like. This is the moment that sells the brand before the buyer ever sees a spec."
Phase 3 — Feature reveals + numbers + final CTAs (Days 8-11)
Build all 8 feature panels with Higgsfield video loops
Tron-style technology section
Big numbers section with scroll-into-view counting
Configurator teaser + past builds gallery + founder section + final CTA
Demo-able output: Homepage complete and shippable. This is the version we can show Brandon.
Phase 4 — Configurator (Days 12-18)
R3F setup with glTF van model
Options panel with all configuration steps
Live price calculation with animated count
Exterior color swap (texture replacement)
Interior palette swap with camera move inside
Wheel swap
Feature add/remove (mesh visibility toggle)
Summary page
Demo-able output: "Brandon, this is the buying experience nobody else has."
Phase 5 — Lead capture + AI qualification (Days 19-22)
Booking form (React Hook Form + Zod)
OpenAI qualification route handler
n8n webhook integration
Cal.com embed integration
Resend transactional email templates (build summary, qualified, nurture)
Demo-able output: End-to-end funnel live. Submit a config → get qualified → book a call.
Phase 6 — Supporting pages + polish (Days 23-28)
/technology page (deep manufacturing story)
/vans + /vans/[slug] (past builds)
/process (6-week timeline visualization)
/about (founder story)
Performance audit + Lighthouse pass
Accessibility pass (keyboard nav, screen reader)
Final QA + cross-browser test

The Phase 1 prompt — copy/paste into Claude Code
This is your starting prompt. Open Claude Code in an empty directory, paste this, hit enter. Subsequent phases get their own prompts as you progress.
# Mothership Website — Phase 1: Foundation
 
## Context
You are building the most advanced website in the luxury adventure van
industry. The product is Mothership — the world's first 3D-printed,
fully-electric, patent-pending luxury van. The site competes with
Tesla, Polestar, and Apple product pages on craft. It is dark,
minimal, futuristic, editorial.
 
I have a complete project brief saved in PROJECT_BRIEF.md (paste it
into the repo before starting). Read it fully before you begin.
 
## Phase 1 scope — DO NOT exceed this scope in this run
 
1. Scaffold a Next.js 15 (App Router) project with TypeScript strict
   mode, Tailwind CSS v4, and shadcn/ui.
 
2. Install dependencies: gsap, @studio-freight/lenis, @react-three/fiber,
   @react-three/drei, three, motion, react-hook-form, zod, @hookform/resolvers,
   resend, react-email/components, posthog-js, @vercel/analytics.
 
3. Set up the design system in app/globals.css:
   - All color variables from the brief (use OKLCH)
   - Typography scale variables
   - Custom easing curves (--ease-expo-out, etc.)
 
4. Configure fonts via next/font/local (download PP Editorial New and
   Söhne if available; fall back to next/font/google with Fraunces +
   Inter Tight if not).
 
5. Build the layout shell:
   - components/nav/Nav.tsx — fixed top, transparent over hero,
     becomes solid on scroll. Logo left, links centered, CTA right.
   - components/footer/Footer.tsx — minimal, 4 columns + newsletter
   - app/layout.tsx — wraps everything, includes Lenis provider stub
 
6. Build a static homepage at app/page.tsx with ALL sections as
   placeholders (no animation yet). Each section should:
   - Use the correct typography
   - Have correct vertical rhythm (100vh per pinned section)
   - Use the correct color tokens
   - Show placeholder copy from the brief verbatim
 
7. Create the route stubs (empty pages) for: /configure, /technology,
   /vans, /process, /about, /contact. Each shows a placeholder.
 
8. Set up content as TypeScript objects in /content directory:
   - content/features.ts (the 8 features)
   - content/config-options.ts (configurator data)
   - content/vans.ts (past builds)
 
9. Add .env.example with all needed env vars (OPENAI_API_KEY,
   N8N_WEBHOOK_URL, RESEND_API_KEY, CAL_COM_LINK, etc.)
 
10. Initialize git, commit, and write a clean README.md with setup
    instructions, available scripts, and the project structure.
 
## Output expectations
- Strict TypeScript (no any, no // @ts-ignore)
- All Tailwind classes use the custom CSS variables, not hard-coded hex
- All components functional and exported correctly
- App must run cleanly with `pnpm dev` (use pnpm, not npm)
- Vercel deployment-ready
 
## Do not do in Phase 1
- Do not implement scroll animations (Phase 2)
- Do not implement the 3D van (Phase 2/4)
- Do not implement the configurator (Phase 4)
- Do not build the qualification API (Phase 5)
 
## When you're done
Print a summary of what you built, what's missing, and what I should
verify before we move to Phase 2.
 
Begin.

For Brandon — what this demonstrates
This brief itself is the artifact. When Shaiden sends this to Brandon, the message is: I've already done the work. I know exactly how to build the best website in this industry. I have the team (Claude Code) to execute. I have the design language locked. I have the funnel logic locked. I have the integration plan locked. Here's the receipt.
Then Phase 1 ships within 72 hours. That's the second receipt. The site goes from skeleton to homepage-shippable inside 11 days. The configurator ships by day 18. The full site is live by day 28. Brandon watches it happen in real time on a Vercel preview URL.
By the time the equity conversation happens, the answer to "what does Shaiden bring?" isn't a slide deck. It's a working website that's better than anything any other van builder has ever shipped.
That's the proof.
