# post-login — live design prototype

This directory is a **live prototype under construction**. The UI files here
(`index.html`, `styles.css`, `app.js`, and anything else) are being actively
edited by the designer. Expect incomplete screens, placeholder content, and
work-in-progress markup.

## Start the server

```bash
cd design-mockups/post-login
node serve.js
```

Then open <http://localhost:4174/>.

No dependencies, no install step — it uses only Node's built-in modules.

To use a different port:

```bash
PORT=5000 node serve.js
```

(On Windows PowerShell: `$env:PORT=5000; node serve.js`)

## What's in the prototype

Six post-login screens, review shell with variant switcher, screen rail,
Phone / Desktop / Compare modes, and a populated + zero-assigned Dashboard:

| # | Screen | Notes |
|---|---|---|
| 1 | Dashboard · Home | Continue + next step, assigned learning, deadlines/reminders |
| 2 | Explore | Search, level filters, roadmap cards, load more |
| 3 | Roadmap detail | Overview, milestones, step list, enrolment state |
| 4 | Learning step | Content blocks, video, checklist, read-only assessment |
| 5 | My learning | Enrolments with progress and last activity |
| 6 | Profile | Account, preferences, sign out |

Deep links: `?screen=explore|roadmap|step|learning|profile`, `?mode=phone|desktop|compare`,
`?variant=minimal|warm`, `?state=populated|empty`.

**Visual variants** (switcher in the rail):

- **Implemented** (`?variant=minimal`, default) — matches the shipped auth
  screens: cream canvas `#FFF8F0`, white cards, 2–2.5px ink `#1E1A3D` borders,
  hard zero-blur shadows, purple `#6C47FF` accents, heavy 900 headings.
- **Warm modern** (`?variant=warm`) — the same bold identity on warmer cream
  surfaces (`#F7F1E8` / `#FFFBF5`) with serif headings. The two differ only in
  surface warmth and heading typeface.

**Honesty labels** — `Proposed` marks design-only fields (next step, due dates)
that the mobile API does not return today. Assessments are read-only, video is
YouTube-only, SCORM opens on the web, and Journeys is excluded (feature flag off).

## Refresh shows the latest saved edits

The server reads every file from disk **on each HTTP request** and sends
`Cache-Control: no-store`. There is no in-memory cache, no ETag, and no
build step.

So the workflow is simply:

1. Edit `index.html` / `styles.css` / `app.js` and save.
2. Refresh the browser.
3. You see the change immediately.

If a change does not appear, confirm the file was actually saved and that you
are looking at the right URL — a hard refresh is not normally required.

## What it serves

- Static files from this directory only.
- `/` and any directory path serve that directory's `index.html`.
- Common web MIME types (HTML, CSS, JS, JSON, SVG, images, fonts, media) are
  mapped explicitly; unknown extensions fall back to
  `application/octet-stream`.
- `GET` and `HEAD` only; other methods return `405`.

## Safety notes

- Requests are resolved against this directory and rejected with `403` if they
  escape it (path traversal protection, including encoded `..` sequences).
- The server binds to `127.0.0.1` by default, so it is local-only. Set `HOST`
  if you deliberately need otherwise.
- This is a design tool, not a production server: no compression, no range
  requests, no TLS, no directory listing.

## Scope

This folder is separate from `landing-auth/` and from production app code.
Nothing here is shipped; it exists to review the post-login design.
