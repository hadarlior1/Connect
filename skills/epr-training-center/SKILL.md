---
name: epr-training-center
description: >-
  Build an interactive, international-grade e-learning "training center" website for any EPR system (or any web system) by cloning the proven portel-sifkim template: EPR-branded welcome screen with a big promise, screenshots zoomed onto a pulsing highlight, a talking presenter (HeyGen video or neural narration) with subtitles, chapter quizzes, a certificate, Hebrew/English, step links, phone layout, deployed to Cloudflare from GitHub. Use it whenever someone wants a guided tutorial, onboarding or training site, "מרכז הדרכה", "הדרכה אינטראקטיבית", "סרטון הדרכה", "אתר הדרכה" or a step-by-step walkthrough with an avatar — for suppliers, residents, employees or customers — even without naming the template, React or HeyGen. Also use it to add steps, screenshots, quiz questions, an English version or avatar videos (including recording many steps in one HeyGen video and cutting it) to an existing training center.
---

# EPR Training Center (מרכז הדרכה אינטראקטיבי)

This skill reproduces a training site that already exists and works:
**https://portel-sifkim.choreshchana.workers.dev** (source: **https://github.com/mimran2207-EPR/portel-sifkim**).
A visitor lands on a welcome screen with a promise ("תוך 10 דקות תגישו את החשבונית הראשונה שלכם"),
the presenter and the chapters; inside, each step shows a real screenshot zoomed onto the relevant
area, the presenter explains it with subtitles, a short quiz closes every chapter, and a certificate
closes the course. It works in Hebrew and English, on desktop and phone.

The whole point is *not to rebuild*. The engine (components, player, narration, subtitles, zoom,
quiz, certificate, i18n, tests, video scripts, deploy config) is generic. A new training center =
the same engine + new **content** (`src/content/lessons.ts`, `lessons.en.ts`, `quiz.ts`), new
**screenshots**, new **voice/videos**, and new **brand values** (`src/content/brand.ts`, the promise
strings in `src/lib/i18n.ts`). Spend your effort there.

Talk to the user in Hebrew (end users and the team are Hebrew speakers); keep code and commit
messages in English. Most users of this skill are not developers: explain in plain words, show
screenshots of results, and keep technical detail out of the conversation unless asked.

## The workflow

Work through these phases in order. Each ends with something the user can see — check in with them
at the end of each phase rather than racing to the end.

### 1. Set up the project from the template

1. Ask for: the system's name and URL, the audience (ספקים / תושבים / עובדים…), the new GitHub repo
   URL (the user creates an empty repo), and who the presenter is (a real person's avatar, or a
   neutral "digital assistant").
2. Clone the template, point `origin` to the new repo, install:
   ```bash
   git clone https://github.com/mimran2207-EPR/portel-sifkim.git <new-name>
   cd <new-name> && git remote set-url origin <new-repo-url>
   npm install
   ```
   Remove the old content (keep the folders): `public/screens/*.jpg`, `public/narration/*.mp3`
   (and `en/`), `public/avatar/<step>.mp4|webm` and `m<n>.*`, `docs/heygen-batches.*`.
3. Rebrand — `references/architecture.md` → "Branding checklist" (logo, colors, promise, presenter
   name, support contacts, storage-key prefix, Worker name).
4. `npm test` must pass before you continue (tests are generic; fix any that hard-code old text).

### 2. Map the system and write the content

Read `references/content-authoring.md` before writing a single script — schema and the spoken-style
rules that make it sound natural.

1. Walk the real system with the user (they log in themselves — see "Safety") and list the processes.
   Group them into 5–8 **modules**, each with 2–9 **steps** (one screen/action each), plus welcome
   module `0` with step `0.1`.
2. Collect the *rules and common errors* (what gets rejected and why) — their own module plus
   `warning` fields. Users value these most.
3. Write `lessons.ts`. Show the module/step outline first, then the scripts.
4. Offer a Word transcript for a product-manager review (hebrew-document-generator / docx skill).
   When corrections come back, apply them all, list per step what changed, and say which recorded
   videos are now outdated.
5. Write `quiz.ts` (2–3 questions per chapter, answers taken only from the scripts) and, for an
   international site, `lessons.en.ts`. Both are text-only tasks — good to hand to helper agents in
   parallel, each owning one new file.

### 3. Screenshots and highlights

Follow `references/screenshots.md`: capture each step's screen at one consistent window size, mask
real personal/business data first (`scripts/mask.js`), save `public/screens/<id>.jpg`, and measure the
highlight rectangle in percent. The site zooms onto that rectangle, so a precise highlight is what
makes a screenshot readable — check every one in the dev server.

### 4. Voice and presenter

Follow `references/narration-and-avatar.md`.
- Always generate MP3 narration first (free, all steps): `python scripts/build-narration.py`
  (and `--lang en --voice en-US-AndrewNeural` for English). The site is complete with it.
- For a filmed presenter, record **batches** in HeyGen (many steps per video, ≤5000 characters),
  then cut them with `scripts/find-cuts.py` (speech recognition) + `scripts/split-batch.py`. Never
  trust silence-only cuts — HeyGen's pauses between steps are as short as between sentences.
- Module opening videos (`m1`, `m2`…) play before the first step of each chapter.

### 5. Polish and verify

Before calling it done, look at it like a demanding user: screenshots at 1265×665, 1366×768,
1920×1080 and 375×812 (Playwright with the installed Chrome works well). Check that the screenshot,
subtitles and tip/warning sit above the player bar with no horizontal scroll, that the welcome screen
stats match the promise, and that English mode reads left-to-right. See `references/ux-quality.md`
for the checklist that took this template from 6.5/10 to "10/10".

### 6. Deploy

Follow `references/deploy.md` (GitHub → Cloudflare Workers Builds). After every change: tests, build,
commit, push, then confirm the new files are actually served before telling the user it's live.

## Safety and privacy (these came from real mistakes — keep them)

- **Repos may be public.** Never commit real screenshots, unmasked data, the presenter's original
  photo, HD video originals, support-contact numbers you weren't given, or notes about the live system.
  Those go in `private/` (gitignored). Never invent phone numbers or emails — leave `SUPPORT` empty
  and ask.
- **Never type credentials or verification codes** into any system. The user logs in; you continue
  after they say they're in.
- **Don't submit anything in a live system** ("שלח", "הגש", "אישור"). Screens up to the final
  confirmation are enough; ask the user to click if a screen behind a submit is needed.
- **HeyGen costs credits.** Paste the text and stop before anything that generates; the user clicks
  "Generate"/"Regenerate" themselves (automated clicks on it are blocked anyway). HeyGen's wizard
  changes — identify every button before clicking.
- **Presenter identity:** a real person's face introduces itself only with their own name.
- Spoken text avoids abbreviations that read badly: "מספר החברה או העוסק" (not ח.פ),
  "מס ערך מוסף" (not מע"מ). Exact system error messages in `warning` stay verbatim (they're shown,
  not spoken).

## Reference files

| File | Read it when |
|---|---|
| `references/architecture.md` | Setting up, rebranding, or changing any behavior of the site |
| `references/content-authoring.md` | Writing modules, steps, scripts, tips, warnings, quiz, English |
| `references/screenshots.md` | Capturing screens, masking data, placing highlights |
| `references/narration-and-avatar.md` | Narration MP3s, HeyGen batches, cutting, opening videos |
| `references/ux-quality.md` | Reviewing the site before handing it over |
| `references/deploy.md` | GitHub + Cloudflare setup and every deploy |
| `scripts/mask.js` | Paste into the live system's console before each screenshot |
