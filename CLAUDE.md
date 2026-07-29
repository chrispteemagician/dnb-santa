# DnB Santa — CLAUDE.md
*For Trinity. Read this first.*

---

## What DnB Santa Is

Free personalised voice-message maker. Father Christmas who grew up on drum &
bass, jungle and rave music from the 90s and 2000s. Parent/user fills in a
name, age, occasion, wish/message and language — DnB Santa writes a short
spoken script (Gemini) and records it as audio (ElevenLabs TTS) in 30+
languages. One occasion, "Good Deed Celebration", doubles as a Good News
Network shoutout — celebrating someone's kind act instead of a wish.

Part of the FeelFamous ecosystem. Live at dnbsanta.com.

**Three themes:** Christmas (traditional), Rave (MC energy), GlowGadgets
(tech-Santa) — same character, different tone, user-selectable.

---

## Stack

- **Static HTML** — single page, no framework, no build step
- **Netlify** — hosting + serverless `/netlify/functions/`
- **Gemini 2.5 Flash** — writes the spoken script
- **ElevenLabs** — text-to-speech, voice ID `3C4ilKOJAsjhzHnyXYtH`
- **Patreon** — optional sign-in only, see philosophy section below
- **Resend** — child-safety report email alerts (`child-safety-report.js`)

---

## File Map

```
/
├── CLAUDE.md               ← you are here
├── index.html              ← entire app: form, themes, God Mode, child-safety shield
├── llms.txt / robots.txt / sitemap.xml
└── netlify/functions/
    ├── generate-message.js     ← Gemini script + ElevenLabs TTS, no auth check
    ├── patreon-auth.js         ← Patreon OAuth token exchange + tier lookup (badge only)
    └── child-safety-report.js  ← Resend alert to glowgadgets@gmail.com
```

---

## Free-to-use philosophy (Chris, 2026-07-13 — read before adding any gate)

The core tool is free for everyone, no sign-in, no lock icon, no "Villager+
only" banner. Don't gate the tool itself behind Patreon.

**History (don't re-add):** this repo previously hard-gated the entire form
behind Patreon sign-in ("Sign in with Patreon" wall + 🔒 "Villager Access
Required" screen) even though `generate-message.js` never checked
`isPro`/`patron_status` server-side — the gate was pure client-side UI
blocking genuine visitors for nothing. Removed; `formSection` now shows
unconditionally. No genuine bucket-2 hosted-page perk exists in this app (no
gallery, no member profile page — "Good News Network" is a splash concept,
not a stored public board), so nothing is currently gated. Signing in with
Patreon only shows a tier badge, never blocks anything.

**The ask, when there is one:** one honest, low-key line after the task
completes — free to use, tell a mate if it helped, buy-me-a-coffee if you
want to say thanks (one-off, `buymeacoffee.com/chrispteemagician`), Patreon
if you want to be a regular (`patreon.com/feelfamous`). Not a gate. Not
gamified. Hidden automatically once `patreonSession.isPro` is true.

Full doctrine + mechanical pattern: DocBrain `tech/free-to-use-degate-skill.md`.

---

## Known Issues / Notes

- `child-safety-report.js` and the floating shield tab are unrelated to the
  Patreon gate — a genuine safety feature, left untouched.
- God Mode (logo-tap + passcode) is an admin/debug unlock, not a customer
  paywall — left untouched.
- All Patreon links point to `https://patreon.com/feelfamous` (the wider
  FeelFamous Village campaign, not a dnbsanta-specific one) — unchanged,
  pricing unchanged (£4.95 Villager / £14.95 Founder).
