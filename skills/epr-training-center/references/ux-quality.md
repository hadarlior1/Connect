# UX quality bar (before handing the site over)

These are the things a world-class review found in the first version and that the template now
does. Check them on every new training center — content changes can break them.

## First impression
- Welcome screen with **one concrete promise** in very large type, the presenter, four stats
  (chapters · steps · minutes · certificate), one primary button ("התחילו") and "continue where you
  left off" for returning visitors. The minutes stat must agree with the promise (round the course
  total once; per-chapter rounding overstates it).
- EPR logo in the header, brand colors as tokens, a footer with EPR — it must read as an EPR product,
  not as the client system's tool.
- Share preview: `og:title`, `og:description`, a 1200×630 `og.jpg`, `meta description`.

## The lesson screen
- The screenshot dominates: full width, zoomed onto the highlight; a "כל המסך" toggle shows it whole.
- Subtitles show only the current sentence in a dark strip; full transcript folded below.
- Screenshot + subtitles + tip/warning end above the player bar at 1265×665, 1366×768, 1920×1080 and
  on a 375px phone; no horizontal scroll (`scrollWidth - innerWidth === 0`).
- One navigation per level: sidebar on wide screens, chapter circles only where there is no sidebar;
  no duplicate prev/next arrows on the image.

## Player and interaction
- Speed 0.75–1.5×, captions on/off, replay, sound, auto-advance; Space pauses; arrows follow the
  reading direction (Hebrew: ← is next).
- Touch targets ≥32px (≥40px on phones); on phones the player bar is fixed at the bottom with the
  safe-area inset and fits 390px without clipping.
- SVG icons only (no emoji as icons), visible focus rings, skip link, `prefers-reduced-motion`.

## Learning value
- A 2–3 question check after each chapter with an explanation per answer, and a printable
  certificate at the end.
- Deep link per step (`#/5.3`) so support can send "watch this step".
- Help button; support contacts only when real ones were provided.

## International
- he/en switch flips `dir`, all UI strings and content; English labels with the Hebrew screen label
  in parentheses; English narration or the browser's English voice until it exists.

Measure, don't guess: a Playwright script that opens the built site (`npx vite preview`) at those
sizes, prints `scrollWidth - innerWidth` and the bottom of the subtitles vs the top of the player,
and saves screenshots to look at.
