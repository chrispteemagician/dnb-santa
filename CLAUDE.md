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

DnB Santa's message maker is free for everyone, no sign-in, no lock icon, no
"Villager+ only" banner. Fill in the form, get your message — that's it.

**Audit note (2026-07-13):** this repo previously hard-gated the entire form
behind Patreon sign-in — a "Sign in with Patreon" wall, then a 🔒 "Villager
Access Required" screen for anyone signed in but not a paying patron. The
gate was purely client-side UI: `netlify/functions/generate-message.js` never
checked `isPro`/`patron_status` at all, so the enforcement didn't actually
protect anything, it just turned away genuine visitors. Removed both blocking
screens; `formSection` now shows unconditionally and `updateUI()` no longer
hides it behind `patreonSession`.

**What Patreon sign-in is for now:** nothing gates on it. Signing in with
Patreon only shows your Village tier badge (Villager/Elder/Founder) next to
your name in the header if you're already a supporter — a nice-to-have, not
a requirement. `patreon-auth.js` and `signInWithPatreon()` are unchanged;
only the UI that used to block access on their result was removed. There is
no hosted public page or persistent record this app produces per user (no
gallery, no member profile page) — the "Good News Network" is a splash/intro
concept, not a stored public board — so there was never a genuine bucket-2
infrastructure perk to keep gated here.

**The ask:** one honest, low-key honesty-box message shown once, under the
result (audio player + script) after Santa's already done the job — free to
use, tell a mate if it helped, one-off
[buy me a coffee](https://buymeacoffee.com/chrispteemagician) if you want to
say thanks, [Patreon](https://patreon.com/feelfamous) if you want to be a
regular. Hidden automatically if `patreonSession.isPro` is true (already a
supporter — no need to ask again). Not a gate. Not gamified.

This same pattern is rolling out across the rest of the -oid ecosystem —
check other repos' CLAUDE.md for the shared version before assuming this
file is the only place it applies.

---

## Known Issues / Notes

- `child-safety-report.js` and the floating shield tab are unrelated to the
  Patreon gate — a genuine safety feature, left untouched.
- God Mode (logo-tap + passcode) is an admin/debug unlock, not a customer
  paywall — left untouched.
- All Patreon links point to `https://patreon.com/feelfamous` (the wider
  FeelFamous Village campaign, not a dnbsanta-specific one) — unchanged,
  pricing unchanged (£4.95 Villager / £14.95 Founder).
