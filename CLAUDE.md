# Pine River Superfund Citizen Task Force — Website Rebuild

## Why this project exists

The Pine River Superfund Citizen Task Force (PRCATF) currently hosts its public
site on Squarespace. The ongoing subscription cost is the primary driver for
this project — we're replacing it with a self-hosted single-page application
(SPA) that costs little to nothing to run, while giving us full control over
design and content.

Current site (source of truth for content until migrated): https://www.pinerivercag.org/

## Organization background

PRCATF is a nonprofit formed in 1998 to advise the EPA on remediation of three
Superfund sites in Michigan's Pine River watershed, and to support restoration
of the river following historical chemical contamination. The org runs on
volunteer effort, so the new site needs to be cheap to host and easy for
non-technical volunteers to update.

## Design philosophy

**We are not cloning the Squarespace site's look.** Design freedom is explicit
here — the current site's visual design is not worth preserving. What must be
preserved is the *content* and *information architecture* (people need to find
the same things they find today). Recommended approach:

1. Design the new site's look, structure, and UX first, from a blank slate.
2. Only after the design is settled, scrub the existing Squarespace site
   (https://www.pinerivercag.org/) for actual content to migrate in.

## Content inventory to migrate

Pulled from the current site's nav structure — use this as the checklist when
scrubbing content, not as the new site's IA (the new IA can differ):

- **About**: About, Where We Work, By-Laws, News
- **Resources**: General Resources, Conference, Meeting Minutes and Reports,
  Timeline, Lessons, Public Partners, Private Stakeholders, College &
  University Partners, Glossary, Photos, Poetry Contest
- **Other**: Contact Us, Take Action, Facebook link
- Mailing list signup
- Contact info (email, phone, mailing address)

## Required features (beyond static content)

1. **Lightweight CMS** for a few specific editable areas — not a full admin
   suite. Needs to be basic but genuinely usable by non-technical volunteers:
   - News / blog posts
   - Events listing
   - Site-wide banner alerts (e.g. "Meeting postponed", "New report available")
2. **Mailing list signup form** — collects name/email for the org's mailing
   list.
3. **Donations** — basic support for accepting donations to the nonprofit
   (this is a 501-type nonprofit context; whatever provider is chosen should
   support that donation flow, not general e-commerce).

## Hosting / architecture decision

Target hosting is **Netlify** or **Supabase**, chosen based on whether a
database is actually needed:

- If the CMS content (news/events/banners) can be modeled as files or
  managed through a headless CMS with git-based content and rebuilt via
  Netlify (e.g. Netlify CMS/Decap, or a simple JSON/Markdown content
  collection), **Netlify alone** is sufficient — no database required, static
  SPA + Netlify Forms for mailing list submissions.
- If we want live editing without rebuilds/deploys (volunteers editing
  news/events/banners through a UI that updates immediately), we need a real
  database + auth, which points to **Supabase** (Postgres + auth + storage),
  with the SPA still likely deployed on Netlify or Vercel as the static
  frontend, talking to Supabase as the backend.
- Donations likely mean integrating a provider (e.g. Stripe, Donorbox, or a
  nonprofit-friendly donation processor) rather than building payment
  handling from scratch.

This decision (Netlify-only vs. Netlify+Supabase) should be finalized once the
CMS/editing UX requirements are concrete — favor the simpler Netlify-only
option unless live in-place editing is a hard requirement.

## Current state

This repository is currently empty (freshly scaffolded IDE project only). No
framework, hosting config, or content has been added yet.
