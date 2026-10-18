"""Render the whole training as one MP4 (1920x1080) for sending by mail or WhatsApp.

Usage:  python scripts/build-video.py [--out private/EprConnect-launch.mp4]
Each step = its screen (the clip for clip steps, else the still with the highlight ring drawn
on it) inside a branded frame: module and step title on top, the spoken script as a caption
below, and the step narration as the sound track. Frames are drawn by headless Edge/Chrome
(Chrome or Edge, for proper Hebrew text) in a temp folder, then joined with ffmpeg.
Requires: public/narration/*.mp3 (build-narration.py), public/clips (build-clips.py),
public/screens (build-screens.py), pip install pillow imageio-ffmpeg
"""

import argparse
import html
import json
import pathlib
import shutil
import subprocess
import tempfile

import imageio_ffmpeg
from PIL import Image, ImageDraw

ROOT = pathlib.Path(__file__).resolve().parent.parent
PUB = ROOT / "public"
FF = imageio_ffmpeg.get_ffmpeg_exe()
# Chrome first: on some machines headless Edge exits without writing the screenshot.
BROWSERS = [
    pathlib.Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe"),
    pathlib.Path(r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"),
    pathlib.Path(r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"),
]
W, H = 1920, 1080
SX, SY, SW, SH = 192, 100, 1536, 864  # where the 1280x720 screen sits in the frame
TAIL = 0.8  # silence after each step's narration, seconds

FRAME_HTML = """<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;600;800&display=swap" rel="stylesheet">
<style>
html,body{{margin:0;width:{W}px;height:{H}px;overflow:hidden;font-family:Heebo,Arial,sans-serif}}
body{{background:linear-gradient(135deg,#1b1a5c,#33318f 45%,#6d2f8f 80%,#c2389e)}}
.top{{position:absolute;top:0;right:0;left:0;height:{SY}px;display:flex;align-items:center;gap:22px;padding:0 {SX}px;color:#fff}}
.pill{{background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.3);border-radius:999px;padding:6px 18px;font-size:24px;font-weight:600;white-space:nowrap}}
.title{{font-size:40px;font-weight:800}}
.logo{{margin-inline-start:auto;height:52px;background:#fff;border-radius:12px;padding:6px 12px}}
.cap{{position:absolute;top:{CY}px;right:{SX}px;left:{SX}px;height:{CH}px;display:flex;align-items:center;justify-content:center;text-align:center;color:#fff;font-size:{FS}px;line-height:1.3}}
</style></head><body>
<div class="top"><span class="pill">{module}</span><span class="title">{title}</span><img class="logo" src="{logo}"></div>
<div class="cap">{caption}</div>
</body></html>"""


def browser() -> pathlib.Path:
    for b in BROWSERS:
        if b.exists():
            return b
    raise SystemExit("Chrome or Edge is required to draw the frames")


def load_steps() -> list[dict]:
    code = (
        "import { modules } from './src/content/lessons'; import { stepLabel } from './src/content/label';"
        "console.log(JSON.stringify(modules.flatMap(m => m.steps.map(s => ({ ...s, module: m.title, label: stepLabel(s.id) })))));"
    )
    out = subprocess.run(["npx", "tsx", "-e", code], cwd=ROOT, capture_output=True, text=True, encoding="utf-8", shell=True, check=True)
    return json.loads(out.stdout.strip().splitlines()[-1])


def duration(path: pathlib.Path) -> float:
    out = subprocess.run([FF, "-i", str(path)], capture_output=True, text=True, encoding="utf-8", errors="ignore").stderr
    h, m, s = out.split("Duration: ")[1].split(",")[0].split(":")
    return int(h) * 3600 + int(m) * 60 + float(s)


def draw_frame(step: dict, tmp: pathlib.Path, edge: pathlib.Path) -> pathlib.Path:
    caption = step["script"]
    fs = 30 if len(caption) < 230 else 27
    page = tmp / f"frame-{step['id']}.html"
    shutil.copy(PUB / "brand" / "epr-logo.png", tmp / "logo.png")
    page.write_text(
        FRAME_HTML.format(
            W=W, H=H, SX=SX, SY=SY, CY=SY + SH, CH=H - SY - SH, FS=fs, logo="logo.png",
            module=html.escape(f"{step['module']} · שלב {step['label']}"), title=html.escape(step["title"]),
            caption=html.escape(caption),
        ),
        encoding="utf-8",
    )
    png = tmp / f"frame-{step['id']}.png"
    subprocess.run(
        [str(edge), "--headless=new", f"--user-data-dir={tmp / 'profile'}", "--disable-gpu", "--hide-scrollbars", "--virtual-time-budget=4000",
         f"--window-size={W},{H}", f"--screenshot={png}", page.as_uri()],
        check=True, capture_output=True,
    )
    return png


def still_with_ring(step: dict, tmp: pathlib.Path) -> pathlib.Path:
    im = Image.open(PUB / "screens" / f"{step['id']}.jpg").convert("RGB")
    h = step.get("highlight")
    if h:
        w0, h0 = im.size
        box = (h["x"] / 100 * w0, h["y"] / 100 * h0, (h["x"] + h["w"]) / 100 * w0, (h["y"] + h["h"]) / 100 * h0)
        ImageDraw.Draw(im).rounded_rectangle(box, radius=10, outline=(194, 56, 158), width=5)
    out = tmp / f"still-{step['id']}.png"
    im.save(out)
    return out


def segment(step: dict, tmp: pathlib.Path, edge: pathlib.Path) -> pathlib.Path:
    voice = PUB / "narration" / f"{step['id']}.mp3"
    t = duration(voice) + TAIL
    frame = draw_frame(step, tmp, edge)
    if step.get("clip"):
        screen = ["-stream_loop", "-1", "-i", str(PUB / "clips" / f"{step['id']}.mp4")]
    else:
        screen = ["-loop", "1", "-i", str(still_with_ring(step, tmp))]
    out = tmp / f"seg-{step['id']}.mp4"
    subprocess.run(
        [FF, "-v", "error", "-y", "-loop", "1", "-i", str(frame), *screen, "-i", str(voice),
         "-filter_complex",
         f"[1:v]scale={SW}:{SH}:flags=lanczos[s];[0:v][s]overlay={SX}:{SY},fps=30,format=yuv420p,"
         f"fade=t=in:st=0:d=0.3,fade=t=out:st={t - 0.3:.2f}:d=0.3[v];[2:a]apad,atrim=0:{t:.2f},aresample=48000[a]",
         "-map", "[v]", "-map", "[a]", "-t", f"{t:.2f}",
         "-c:v", "libx264", "-preset", "medium", "-crf", "23", "-c:a", "aac", "-b:a", "128k", str(out)],
        check=True,
    )
    return out


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=str(ROOT / "private" / "EprConnect-launch.mp4"))
    args = ap.parse_args()
    edge = browser()
    steps = load_steps()
    with tempfile.TemporaryDirectory(ignore_cleanup_errors=True) as d:  # the browser may still hold its profile lock
        tmp = pathlib.Path(d)
        parts = []
        for s in steps:
            parts.append(segment(s, tmp, edge))
            print(f"{s['id']} ok")
        listing = tmp / "parts.txt"
        listing.write_text("".join(f"file '{p.as_posix()}'\n" for p in parts), encoding="utf-8")
        subprocess.run([FF, "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(listing),
                        "-c", "copy", "-movflags", "+faststart", args.out], check=True)
    print(f"{args.out}: {pathlib.Path(args.out).stat().st_size // 1024 // 1024} MB, {duration(pathlib.Path(args.out)):.0f} s")


if __name__ == "__main__":
    main()
