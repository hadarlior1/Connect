"""Turn the raw screen recordings into short, silent 1280x720 step clips.

Usage:  python scripts/build-clips.py [--only 3.3,3.4]
Raw recordings live outside the repo (RAW below). For each step this blurs private fields
(the ID number, install paths, tracking links) on every frame, crops to the window, speeds up
waiting, and centres the result on the same wallpaper the still screens use. Writes
public/clips/<id>.mp4 plus a poster public/screens/<id>.jpg (a late frame of the clip).
Requires: pip install pillow imageio-ffmpeg
"""

import argparse
import pathlib
import subprocess
import sys

import imageio_ffmpeg

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from importlib import import_module

screens = import_module("build-screens")

ROOT = pathlib.Path(__file__).resolve().parent.parent
RAW = ROOT.parent / "סרטוני וידאו"
CLIPS = ROOT / "public" / "clips"
POSTERS = ROOT / "public" / "screens"
WALL = ROOT / "private" / "wallpaper.png"
FF = imageio_ffmpeg.get_ffmpeg_exe()
W, H = 1280, 720

# id: source, start s, end s, speed, crop (x, y, w, h) or None, blur boxes (x, y, w, h) in source
# pixels, and the largest size (w, h) the clip may take on the 1280x720 canvas.
SPECS = {
    "1.2": ("1.mp4", 7, 55, 4, None, [], (1150, 600)),
    "2.1": ("2.mp4", 0, 6.4, 1, None, [], (900, 620)),
    "2.3": ("4.mp4", 0, 77, 5, None, [(40, 148, 668, 28)], (1000, 640)),
    "3.1": ("3.mp4", 0, 6.5, 1, None, [], (900, 620)),
    "3.2": ("5.mp4", 0, 153.5, 8, None, [], (1000, 650)),
    # ID number field: blurred on every frame (the window never moves in these recordings)
    "3.3": ("6.mp4", 0, 7, 1, (203, 45, 482, 728), [(252, 328, 386, 102)], (1000, 650)),
    "3.4": ("6.mp4", 7, 27, 2, (203, 45, 482, 728), [(252, 328, 386, 102)], (1000, 650)),
    "3.5": ("7.mp4", 85.3, 96.7, 1, (10, 78, 362, 220), [(86, 183, 212, 19), (30, 201, 268, 23)], (900, 560)),
    "3.6": ("8.mp4", 30, 43, 1, (278, 132, 482, 740), [(330, 462, 382, 50)], (1000, 650)),
}


def run(args: list[str]) -> None:
    subprocess.run([FF, "-v", "error", "-y", *args], check=True)


def build(sid: str) -> None:
    src, start, end, speed, crop, blurs, (mw, mh) = SPECS[sid]
    chain = [f"[0:v]trim={start}:{end},setpts=(PTS-STARTPTS)/{speed}[v0]"]
    cur = "v0"
    for i, (x, y, w, h) in enumerate(blurs):
        chain.append(f"[{cur}]split[a{i}][b{i}]")
        # pixelate to a few blocks, then soften: nothing of the original text survives
        chain.append(f"[b{i}]crop={w}:{h}:{x}:{y},scale={max(2, w // 24)}:{max(2, h // 24)}:flags=area,scale={w}:{h}:flags=bilinear,boxblur={min(8, h // 4)}:3[z{i}]")
        chain.append(f"[a{i}][z{i}]overlay={x}:{y}[c{i}]")
        cur = f"c{i}"
    if crop:
        x, y, w, h = crop
        chain.append(f"[{cur}]crop={w}:{h}:{x}:{y}[cr]")
        cur = "cr"
    chain.append(f"[{cur}]scale=w={mw}:h={mh}:force_original_aspect_ratio=decrease:flags=lanczos,scale=trunc(iw/2)*2:trunc(ih/2)*2[s]")
    chain.append("[1:v][s]overlay=(W-w)/2:(H-h)/2:shortest=1,fps=30,format=yuv420p[out]")
    out = CLIPS / f"{sid}.mp4"
    run([
        "-i", str(RAW / src), "-loop", "1", "-i", str(WALL),
        "-filter_complex", ";".join(chain), "-map", "[out]", "-an",
        "-c:v", "libx264", "-preset", "slow", "-crf", "26", "-movflags", "+faststart", str(out),
    ])
    # Poster: a frame near the end, also used to size the stage and place the ring.
    run(["-sseof", "-0.4", "-i", str(out), "-frames:v", "1", "-q:v", "3", str(POSTERS / f"{sid}.jpg")])
    print(f"{sid}: {out.stat().st_size // 1024} KB")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", default="")
    only = {s for s in ap.parse_args().only.split(",") if s}
    CLIPS.mkdir(parents=True, exist_ok=True)
    POSTERS.mkdir(parents=True, exist_ok=True)
    screens.wallpaper().save(WALL)
    for sid in SPECS:
        if not only or sid in only:
            build(sid)


if __name__ == "__main__":
    main()
