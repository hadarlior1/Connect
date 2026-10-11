"""Find where each step starts in a batched HeyGen video, by listening to it.

  python scripts/find-cuts.py <n>       # reads private/videos/batch-<n>.mp4 and docs/heygen-batches.json

HeyGen's pause between paragraphs is barely longer than between sentences, so cutting by silence
alone mis-cuts. This transcribes the video (faster-whisper, Hebrew or English), finds the first words
of every step in order, and cuts in the quietest moment just before them. It writes
private/videos/batch-<n>-cuts.json, which split-batch.py then uses instead of its own estimate,
and prints each step's first words as heard so a person can check them.

Requires: pip install faster-whisper imageio-ffmpeg numpy
"""

import json
import pathlib
import re
import subprocess
import sys
import tempfile
import wave

import imageio_ffmpeg
import numpy as np
from faster_whisper import WhisperModel

ROOT = pathlib.Path(__file__).resolve().parent.parent
LETTERS = r"[^א-תA-Za-z0-9 ]"


def norm(t: str) -> str:
    return re.sub(LETTERS, "", t)


def similar(a: str, b: str) -> bool:
    # Speech recognition misspells Hebrew: accept a shared start or end of the word.
    return a == b or (len(a) > 2 and len(b) > 2 and a[:3] == b[:3]) or (len(a) > 3 and a[-3:] == b[-3:])


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    n = int(sys.argv[1])
    batch = next(b for b in json.loads((ROOT / "docs/heygen-batches.json").read_text(encoding="utf-8")) if b["n"] == n)
    video = ROOT / "private" / "videos" / f"batch-{n}.mp4"
    wav = pathlib.Path(tempfile.gettempdir()) / f"batch-{n}.wav"
    subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(), "-v", "error", "-y", "-i", str(video), "-ac", "1", "-ar", "16000", str(wav)], check=True)
    wf = wave.open(str(wav))
    pcm = np.frombuffer(wf.readframes(wf.getnframes()), np.int16).astype(np.float32)
    lang = "en" if not re.search(r"[א-ת]", batch["steps"][0]["script"]) else "he"
    # Pass the samples, not the path (some PyAV versions reject faster-whisper's open() call).
    segs, _ = WhisperModel("small", device="cpu", compute_type="int8").transcribe(pcm / 32768, language=lang, word_timestamps=True)
    words = [(w.start, w.word.strip()) for s in segs for w in s.words]

    # Loudness every 10 ms, to cut in the quietest moment before a step's first word.
    rms = np.array([np.sqrt(np.mean(pcm[i : i + 480] ** 2)) for i in range(0, len(pcm) - 480, 160)])
    cuts, start = [], 0
    for st in batch["steps"][1:]:
        first = norm(st["script"]).split()[:5]
        best = (-1, start)
        for i in range(start, len(words)):
            cand = [norm(w[1]) for w in words[i : i + 5]]
            score = sum(similar(a, b) for a, b in zip(first, cand))
            if score > best[0]:
                best = (score, i)
        score, i = best
        start = i + 1
        t = words[i][0]
        lo, hi = max(0, int((t - 0.9) * 100)), int((t + 0.02) * 100)
        j = lo + int(np.argmin(rms[lo:hi]))
        cut = round(j / 100 + 0.015, 2)
        db = 20 * np.log10(rms[j] / 32768 + 1e-9)
        cuts.append(cut)
        flag = "" if score >= 3 and db < -45 else "   ← check by ear"
        print(f"{st['id']}: cut {cut:7.2f}s  match {score}/5  {db:5.1f} dB  heard: {' '.join(w[1] for w in words[i:i + 4])}{flag}")

    out = ROOT / "private" / "videos" / f"batch-{n}-cuts.json"
    out.write_text(json.dumps(cuts))
    print(f"cuts → {out}  (next: python scripts/split-batch.py {n})")


if __name__ == "__main__":
    main()
