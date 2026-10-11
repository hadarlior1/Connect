# Narration and the presenter

Playback per step (AvatarPanel): **chapter opening video** (first step of a chapter, if recorded)
→ **step video** (if recorded) → otherwise **MP3 narration** → browser-voice fallback. In English the
Hebrew videos are skipped and the English narration plays. So the site is complete with MP3s alone.

On Windows, call Python by its full path if `python` prints only "Python" (a broken Store alias),
e.g. `C:\Users\<user>\AppData\Local\Python\pythoncore-3.14-64\python.exe`.

## 1. MP3 narration (always — free)

```bash
pip install edge-tts
python scripts/build-narration.py                                  # Hebrew, all steps (he-IL-AvriNeural)
python scripts/build-narration.py --only 0.1,2.3                   # just these
python scripts/build-narration.py --lang en --voice en-US-AndrewNeural   # English → narration/en/
```
One voice for the whole site. The edge-tts service sometimes answers 403 and writes **empty files**
while the command still "succeeds" — check sizes afterwards and delete empty ones. Until all English
files exist, the site speaks English with the browser's voice (`EN_NARRATION` in videos.ts).

## 2. Lip stills

`public/avatar/fig-0/1/2.webp`: same pose, mouth closed / half / open, transparent, ~540×960 — swapped
by voice level during narration. Take frames from one presenter video (`cutout-video.py` removes the
black background). A clean full-body frame of the presenter also makes the welcome-screen cut-out.

## 3. HeyGen videos in batches (paid)

Recording one video per step is slow. Record **batches** instead and cut them:

1. `npm run batches` → `docs/heygen-batches.md`: videos of ≤4950 characters, steps separated by a
   blank line. `npm run batches -- 1.1 1.2 4.3` appends a completion batch with just those steps;
   `-- m1 m2 … m7` makes the chapter opening videos.
2. In HeyGen (same avatar, same voice as before, black background, Portrait) paste the batch text.
   Insert it with JavaScript — typing drops spaces in Hebrew:
   - plain textarea: set `.value` with the native setter and dispatch `input`, then type one space and
     Backspace so the app registers it;
   - the editor of an existing project (contenteditable): `focus()`, `execCommand('selectAll')`,
     `execCommand('insertText', false, TEXT)`, then click outside so "Regenerate" appears.
   If "Create new video" is locked (avatar verification), reuse a finished project with the same
   avatar and voice: open it, replace the script in its editor and let the user click **Regenerate**
   — each run is saved as a new version, and the user downloads that version.
   Stop before anything that generates; the user clicks it (credits). Re-check the voice — HeyGen can
   report "The selected voice is no longer available".
3. The user saves `private/videos/batch-<n>.mp4`.
4. Cut and process:
   ```bash
   pip install faster-whisper imageio-ffmpeg numpy opencv-python-headless
   python scripts/find-cuts.py <n>     # listens, prints each step's first words as heard + dB at the cut
   python scripts/split-batch.py <n>   # uses batch-<n>-cuts.json, writes public/avatar/<id>.mp4|webm
   node scripts/list-videos.mjs
   ```
   Lines marked "check by ear" (weak match or not quiet at the cut) deserve a listen; otherwise the
   cuts were exact in practice. Opening-video ids `m<n>` go through the same path.
5. Verify before publishing: transcribe each produced step video and compare it with its script
   (start, end, overall match) — this caught every wrong cut in testing. Then build, commit, push.

Changing a recorded script means re-recording that step (a completion batch is the quickest way).

## Presenter identity

Use the presenter's own avatar and name in `0.1` and on the label (`presenter`, `presenterRole` in
i18n.ts). Don't let one person's face introduce itself with another person's name.
