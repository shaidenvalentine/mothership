# Mothership

The most advanced website in the luxury adventure van industry — for the world's
first 3D-printed, fully-electric, patent-pending luxury van. Dark, minimal,
cinematic. Apple × Tesla × Polestar, built for off-grid vehicles.

**Status:** Phase 1 — Foundation. Static placeholder homepage, design system, layout
shell, route stubs, and typed content. No animation / 3D / configurator / API yet
(those land in Phases 2–5). See [`PROJECT_BRIEF.md`](./PROJECT_BRIEF.md) for the full
spec and roadmap.

## Tech stack

- **Framework:** Next.js 15 (App Router, RSC) + TypeScript (strict)
- **Styling:** Tailwind CSS v4 + shadcn/ui (Base UI primitives)
- **Design tokens:** OKLCH color, fluid clamp type scale, custom easing (CSS variables)
- **Fonts:** Fraunces (display) · Inter Tight (body) · JetBrains Mono — via `next/font`
- **Installed for later phases:** GSAP + Lenis (scroll), React Three Fiber + Drei +
  three (3D), React Hook Form + Zod (forms), Resend + React Email, PostHog +
  Vercel Analytics
- **Package manager:** pnpm

## Getting started

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Copy `.env.example` to `.env.local` and fill in keys as later phases need them
(none are required for Phase 1).

## Scripts

| Script           | Description                          |
| ---------------- | ------------------------------------ |
| `pnpm dev`       | Start the dev server (Turbopack)     |
| `pnpm build`     | Production build                     |
| `pnpm start`     | Serve the production build           |
| `pnpm lint`      | Run ESLint                           |
| `pnpm typecheck` | Type-check with `tsc --noEmit`       |

## Project structure

```
mothership/
├─ app/
│  ├─ layout.tsx              # Root layout: fonts, metadata, Nav/Footer, providers
│  ├─ page.tsx                # Homepage — composes the 9 sections
│  ├─ globals.css             # Design system: tokens, type scale, easing, theme
│  ├─ fonts.ts                # next/font config (Fraunces, Inter Tight, JetBrains Mono)
│  ├─ configure/              # Route stubs (full builds in later phases)
│  ├─ technology/
│  ├─ vans/  ├─ page.tsx  └─ [slug]/page.tsx
│  ├─ process/ ├─ about/ └─ contact/
├─ components/
│  ├─ nav/Nav.tsx             # Fixed nav, transparent → solid on scroll
│  ├─ footer/Footer.tsx       # 4 columns + newsletter
│  ├─ providers/LenisProvider.tsx   # Smooth-scroll stub (wired in Phase 2)
│  ├─ sections/               # The 9 homepage sections
│  ├─ placeholder/            # Media placeholder + route-stub helpers
│  └─ ui/button.tsx           # shadcn/ui Button
├─ content/                   # Typed content objects
│  ├─ features.ts  config-options.ts  vans.ts  site.ts
├─ types/                     # TypeScript interfaces for all content
├─ lib/utils.ts               # cn() helper
├─ .env.example
└─ PROJECT_BRIEF.md           # Source-of-truth spec
```

## Design system

All color, type, easing, and spacing tokens live in `app/globals.css` as CSS
variables and are exposed as Tailwind utilities (`bg-ms-black`, `text-ms-bone`,
`font-display`, `text-display-2xl`, `ease-expo-out`, …). Components use these
utilities only — no hard-coded hex.

## Roadmap

Phase 1 Foundation · Phase 2 Hero scroll · Phase 3 Feature reveals + numbers ·
Phase 4 Configurator · Phase 5 Lead capture + AI qualification · Phase 6 Supporting
pages + polish. Details in [`PROJECT_BRIEF.md`](./PROJECT_BRIEF.md).
