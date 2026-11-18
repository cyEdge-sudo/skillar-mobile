# Skillar · Landing (Welcome) & Auth — UI mockups

Static, browser-viewable prototypes for review. **Mock data only — nothing is wired to a backend.**

## Run it

```powershell
node design-mockups/landing-auth/serve.js
```

Then open **http://localhost:4173** (or just double-click `index.html`).

## What's here

| File | Purpose |
|---|---|
| `index.html` | All 8 screens + review shell (variant switcher, screen index, compare mode) |
| `styles.css` | Review chrome + the three visual variants (CSS custom properties) |
| `app.js` | Navigation, compare rendering, mock interactions |
| `serve.js` | Tiny dependency-free static server |

## How to review

1. **Compare mode** (default): the same screen side by side in all three variants — warm modern learning, playful colorful, minimal neutral. Use `‹ ›` or the rail to move through all 8 screens.
2. **Clickthrough**: click a variant in the rail → drops into that variant's full phone flow (Phone / Desktop toggle in the top bar).
3. Arrow keys move between screens.

## Flow & assumptions

- **Welcome screen** (the "landing"): branded in-app screen shown before sign-in — value line "Keep learning moving", sign-in CTA, enterprise provisioning note.
- **Login** → on success the destination is **post-login (out of scope — next design round)**.
- **Email verification (OTP)** is an **alternate recovery path**, reached from the login link "Email not verified?". It is a one-time 6-digit email code (not MFA), TTL 5 min. Prototype-only screen.
- **Forgot password → reset link → new password → success**: forgot/reset mirrors what the app has today; the sent/reset/done screens are prototype-only continuations.
- **No signup anywhere** — admin-provisioned employee accounts.
- In the app today: **Login + Forgot Password only**. Backend has related OTP/reset capability, but exact route/contract matching is **not asserted** in this prototype.
- Fonts are review stand-ins; production uses the system font stack. Skillar purple `#6C47FF` is preserved in every variant (logo mark).

## Not in this round

Dashboard (continue + next step, assigned learning, deadlines & reminders) — **priority for the next design round**.
