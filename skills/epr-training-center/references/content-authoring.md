# Writing the content

## Schema (`src/content/lessons.ts`)

```ts
interface Highlight { x: number; y: number; w: number; h: number } // % of the screenshot, 0-100
interface Step {
  id: string;          // "<module>.<n>", e.g. "4.3" — also the file name of screen/mp3/video
  title: string;       // short heading, also in the menu
  script: string;      // what the presenter SAYS (also the subtitles)
  highlight?: Highlight;
  tip?: string;        // one-line tip under the subtitles
  warning?: string;    // rules, rejections, common errors
}
interface Module { id: string; title: string; icon: string; intro?: string; steps: Step[] }
```

- Module `0` is the welcome (one step, `0.1`). Ids are 0-based internally; learners see the chapter
  number (id "4.3" is shown as "5.3", and the link is `#/5.3`). Don't renumber files to "fix" this.
- The module `icon` field is legacy; the site draws icons from `MODULE_ICON` in `Icon.tsx` — map each
  module id to a fitting icon there.
- `intro` = the opening video's text for that chapter (2–3 sentences).

## Structure that worked

Supplier portal: 8 modules / 29 steps — 0 ברוכים הבאים · 1 כניסה · 2 שולחן העבודה · 3 the main list ·
4 the main action (a wizard, one step per screen) · 5 כללים ושגיאות נפוצות · 6 tracking · 7 ledger.
Pattern: **login → home → lists → main action → rules & errors → tracking → reports**. The rules
module (amount mismatches, duplicates, documents that aren't the user's) is the most valued part.

## Script style (they are read aloud — this matters more than anything)

- Spoken Hebrew, plural address ("לחצו", "בחרו", "תוכלו"); first person for the presenter.
  2–4 sentences, ~15–25 s (≈250–350 characters, 12–90 words — the tests enforce this range).
- Quote on-screen labels exactly: לחצו על "החלף רשות". Say where ("בתפריט הצד", "בראש הרשימה").
- End with the why or what happens next.
- No abbreviations that read badly: "מספר החברה או העוסק" (not ח.פ), "מס ערך מוסף" (not מע"מ),
  "שקלים" (not ₪). Exact system error messages in `warning` stay verbatim.
- No personal data, real company names or numbers.
- `0.1`: who the presenter is, what the system lets you do, that you can replay or skip anytime.
- Watch quotes inside strings: a `tip` in double quotes that contains מע"מ breaks the file — use
  single quotes or backticks.

## Corrections from a reviewer

Apply every correction, then tell the user per step what changed, which steps were removed or
renumbered (rename their screenshot/mp3 files with `git mv`), and which **recorded videos are now
outdated** — the voice is baked in. Park outdated videos in `private/videos/outdated/` (don't delete)
so the step falls back to narration until it is re-recorded. Regenerate narration only for changed
steps (`--only 2.1,4.3`).

## Quiz (`src/content/quiz.ts`)

```ts
interface QuizQuestion {
  source: string;                                   // step id the answer comes from
  he: { q: string; options: string[]; explain: string };
  en: { q: string; options: string[]; explain: string };
  answer: number;                                   // same index in he and en
}
export const quiz: Record<string, QuizQuestion[]>;  // module id → 2–3 questions (none for "0")
```
3 options, one correct, vary the correct index, `explain` = one sentence why. Only facts stated in
the scripts — never invent system behavior. Prefer the practical rules learners get wrong.

## English (`src/content/lessons.en.ts`)

Same ids and order; `intro`/`tip`/`warning` exactly where the Hebrew has them. Natural professional
English, plain (no idioms), 20–95 words. Name each on-screen label in English with the Hebrew label
in parentheses the first time in a step: "New Invoice" ("חשבונית חדשה"). Keep a glossary
(e.g. רשות = local authority, חשבונית עסקה = proforma invoice, כרטסת = account ledger). Verify ids
match with a one-line `npx tsx -e` check comparing both files.

## After editing content

1. `npm test`.
2. Narration for changed steps (`python scripts/build-narration.py --only …`, and `--lang en`).
3. Tell the user which videos must be re-recorded.
4. `npm run batches -- <ids>` prepares a completion video for exactly those steps.
