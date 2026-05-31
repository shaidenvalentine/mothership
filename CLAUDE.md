# Mothership — Business & Partnership Context

> This file is the source of truth for *how the business works*. Any tooling, automations,
> admin-portal features, site copy, or commission math must align with what's below.
> (Product/design/tech specifics live in the memory notes + README; this is the deal layer.)

## What Mothership is
A luxury **3D-printed electric adventure van** company — the commercial face of Brandon
Buckley's patent-pending 3D-printed van production system. Two SKUs only, no bespoke builds.
Positioning: "The world's first 3D-printed luxury electric adventure van." Aesthetic: dark,
modern, Apple/Rivian restraint (aligned with elysium.house). Avoid van-life clichés.

## The three people (clean ownership boundaries)
- **Brandon Buckley** — Founder/CTO/Production (San Diego). Owns the patent, shop, build
  process, Materialogix supplier relationship, demo van, **customer contracts (legal
  counterparty) + deposit funds during builds**. Does all builds, QC, delivery, warranty,
  technical support, shop content.
- **Shaiden Valentine** — CEO/Brand & Sales (Bali + US). Owns the Mothership brand,
  mothershipvans.com + all code/content, @mothershipvehicles, the customer/lead list, marketing.
  Closes discovery calls.
- **Kial** — Head of Sales Ops (Bali). Owns the AI lead-qualification pipeline (OpenClaw + n8n)
  until Phase 2. Qualifies leads, books Shaiden's calendar with pre-call briefs, CRM hygiene,
  weekly pipeline reporting.

## Product & economics
| SKU | Wheelbase | Base price | Build cost |
|-----|-----------|-----------|-----------|
| Mothership 144 | 144" | $299,000 | ~$130,000 |
| Mothership 170 | 170" | $349,000 | ~$150,000 |
- Add-on menu: up to **$100K** optional bolt-ons per van (Brandon to finalize pricing).
- Blended target ASP **$350K**, target gross margin **~57%**, build time **4–6 weeks**.

## Sales flow
Lead (site form / IG DM / referral / influencer) → Kial's AI qualification → qualified leads
booked to Shaiden's calendar w/ pre-call brief → Shaiden discovery call (144 vs 170, add-ons,
timeline) → config finalized, **deposit collected** → Brandon contracts Materialogix for the
3D-printed interior → shop assembly/finish/QC/delivery → commissions paid per closed sale.

## Compensation — Phase 1 (three INDEPENDENT streams, % of sale price, tiers reset each calendar year)
1. **Closing commission — Shaiden**, per closed deal: vans 1–2 = **8%**, 3–5 = **10%**,
   6–9 = **12%**, 10+ = **15%**.
2. **Setting commission — Kial**, per closed deal *sourced through the pipeline*: 1–2 = **2%**,
   3–5 = **2.5%**, 6–9 = **3%**, 10+ = **3.5%**.
3. **Brand royalty — Shaiden**, flat **3%** of *every* Mothership-branded sale, regardless of
   who closed (compensates brand IP independently — do NOT assume "Shaiden closed" gates it).

## Phases
- **Phase 1 (≤5 vans, current):** no entity; contracts run through **Brandon's existing
  entity**; Shaiden + Kial paid as 1099 per sale; no capex; production via Materialogix; organic
  marketing only; best-efforts (no minimums/exclusivity); IP stays with original owners.
- **Phase 2 (trigger: 5 vans sold within 12 months):** joint entity (DE C-corp or CA LLC);
  brand IP contributed by Shaiden; patent licensed exclusively by Brandon; marketing budget
  unlocked; pre-agreed equity Brandon 45–55% / Shaiden 30–40% / Kial earn-in 5–15% / hire pool
  5–10%; 4-yr vest / 1-yr cliff; commissions continue from entity GM; **brand royalty converts
  to equity (no double-dip)**.
- **If trigger missed in 12 mo:** (A) Brandon buys out brand assets $75–150K, or (B) royalty
  tail 3–5% of revenue for 3–5 yrs if he keeps the branding, or (C) mutual 6-mo extension.

## Software / tooling design constraints
1. **Single source of truth for leads:** form → Kial's pipeline → CRM. Shaiden & Brandon read
   from it; neither writes directly.
2. **Contracts/deposits run through Brandon's entity in Phase 1** — any contract/invoice tooling
   uses his entity, NOT a Mothership entity (none exists yet).
3. **Commissions = 3 independent streams** (closing + setting + brand royalty), **tiers reset
   annually** by the van's closed-sequence number that calendar year.
4. **Brand royalty applies to all branded sales regardless of closer** — compute independently.
5. **Phase 1 is human-driven:** NO e-commerce checkout, NO automated deposit collection, NO
   customer-account/login system. Discovery call, close, and contract signing are all human.
6. **Configurator = configured spec + estimated price → routes to a discovery call.** It is NOT
   an order form.

## Open items / loose ends
- Sandy Vans lists Mothership (sandyvans.com) — remove once Brandon deal signed (Shaiden).
- Mothership #6 in production at Sandy Vans — transition out cleanly.
- "Mothership" trademark not yet filed — addressed at/before Phase 2.
- Customer-contract entity name (Brandon's existing entity) — confirm for legal copy.
- Final add-on menu + pricing — Brandon to provide.
