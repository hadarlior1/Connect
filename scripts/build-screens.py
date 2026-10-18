"""Compose one 1280x720 screen per step from the screenshots in the EprConnect guide PDF.

Usage:  python scripts/build-screens.py
Source images are extracted from the PDF into private/pdf/ (gitignored). Writes
public/screens/<id>.jpg and prints each step's highlight (percent of the screen) as JSON,
ready to paste into src/content/lessons.ts.
Requires: pip install pillow
"""

import json
import pathlib

from PIL import Image, ImageDraw, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "private" / "pdf"
# "raw:" sources are the screen recordings folder next to the repo; "frame:" are stills
# pulled from those recordings into private/frames (they show the ID number — always blur).
PREFIX = {"raw:": ROOT.parent / "סרטוני וידאו", "frame:": ROOT / "private" / "frames"}
OUT = ROOT / "public" / "screens"
W, H = 1280, 720
PAD = 0.6  # highlight margin, percent

# id: (source, kind, crop box or None, highlight box in source pixels or None, blur boxes)
#   kind "full": a whole-browser screenshot, fitted to the width on a dark backdrop
#   kind "window": an app window, centred on a light wallpaper with a shadow
#   kind "desktop": desktop icons, enlarged on the wallpaper
#   kind "brand": the EprConnect artwork with the EPR logo
SPECS = {
    "0.1": ("p1_img1.jpeg", "brand", None, None, []),
    "1.1": ("p4_img1.png", "full", None, (72, 33, 700, 65), []),
    "1.3": ("p5_img2.png", "full", (1300, 0, 1917, 377), (1732, 205, 1905, 236), []),
    "1.4": ("p5_img3.png", "full", None, (1670, 509, 1778, 543), []),
    "2.2": ("p6_img1.png", "window", None, (99, 431, 177, 457), []),
    "2.4": ("p6_img4.png", "window", None, (96, 425, 175, 450), []),
    "2.5": ("raw:האיקון הישן לעומת החדש.png", "desktop", None, (85, 58, 190, 158), []),
    "3.7": ("raw:9.png", "window", None, (28, 132, 298, 212), []),
    "4.1": ("frame:8_a.png", "window", (278, 132, 760, 872), (330, 598, 709, 686), [(328, 460, 714, 514)]),
    "4.2": ("p1_img1.jpeg", "brand", None, None, []),
}
# Steps 1.2, 2.1, 2.3 and 3.1-3.6 are video clips (scripts/build-clips.py writes their posters).


def src_path(name: str) -> pathlib.Path:
    for p, base in PREFIX.items():
        if name.startswith(p):
            return base / name[len(p):]
    return SRC / name


def gradient(top: tuple, bottom: tuple) -> Image.Image:
    g = Image.new("RGB", (1, H))
    for y in range(H):
        t = y / (H - 1)
        g.putpixel((0, y), tuple(round(a + (b - a) * t) for a, b in zip(top, bottom)))
    return g.resize((W, H))


def wallpaper() -> Image.Image:
    """Soft brand-tinted desktop wallpaper."""
    bg = gradient((233, 236, 251), (214, 222, 245))
    glow = Image.new("RGB", (W, H), (0, 0, 0))
    d = ImageDraw.Draw(glow)
    d.ellipse((-200, 380, 520, 1000), fill=(70, 60, 180))
    d.ellipse((860, -260, 1500, 360), fill=(194, 56, 158))
    glow = glow.filter(ImageFilter.GaussianBlur(160))
    return Image.blend(bg, Image.composite(glow, bg, glow.convert("L")), 0.18)


def paste_with_shadow(canvas: Image.Image, img: Image.Image, x: int, y: int) -> None:
    shadow = Image.new("RGBA", (img.width + 80, img.height + 80), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle((40, 52, img.width + 40, img.height + 52), 12, fill=(20, 24, 60, 90))
    shadow = shadow.filter(ImageFilter.GaussianBlur(18))
    canvas.paste(shadow, (x - 40, y - 40), shadow)
    canvas.paste(img, (x, y))


def compose(src: str, kind: str, crop, blurs):
    img = Image.open(src_path(src)).convert("RGB")
    if src == "p5_img2.png":
        # capture artefact (a black preview box) under the Edge menu
        ImageDraw.Draw(img).rectangle((1515, 205, 1721, 377), fill=(43, 43, 43))
    for box in blurs:
        # pixelate, then blur: the original text cannot be recovered
        part = img.crop(box)
        part = part.resize((max(1, part.width // 24), max(1, part.height // 24)), Image.BOX).resize(part.size, Image.BILINEAR)
        img.paste(part.filter(ImageFilter.GaussianBlur(6)), box[:2])
    if crop:
        img = img.crop(crop)
    if kind == "brand":
        canvas = Image.new("RGB", (W, H), img.getpixel((8, 8)))
        art = img.crop((60, 160, 1100, 1340)).resize((610, 692), Image.LANCZOS)
        feather = Image.new("L", art.size, 0)
        ImageDraw.Draw(feather).rectangle((40, 40, art.width - 40, art.height - 40), fill=255)
        canvas.paste(art, (70, 14), feather.filter(ImageFilter.GaussianBlur(30)))
        logo = Image.open(ROOT / "public" / "brand" / "epr-logo.png").convert("RGBA")
        logo = logo.crop(logo.getchannel("A").getbbox())
        logo = logo.resize((440, round(logo.height * 440 / logo.width)), Image.LANCZOS)
        card = Image.new("RGB", (logo.width + 60, logo.height + 60), (255, 255, 255))
        card.paste(logo, (30, 30), logo)
        mask = Image.new("L", card.size, 0)
        ImageDraw.Draw(mask).rounded_rectangle((0, 0, card.width, card.height), 28, fill=255)
        canvas.paste(card, (W - card.width - 120, (H - card.height) // 2), mask)
        return canvas, None
    if kind == "full":
        canvas = Image.new("RGB", (W, H), (32, 32, 32))
        s = min(W / img.width, H / img.height)
        fitted = img.resize((round(img.width * s), round(img.height * s)), Image.LANCZOS)
        x, y = (W - fitted.width) // 2, 0
        canvas.paste(fitted, (x, y))
        return canvas, (s, x, y)
    canvas = wallpaper()
    if kind == "desktop":
        s = min(3.0, 1000 / img.width, 600 / img.height)
    else:
        s = min(600 / img.height, 1000 / img.width)
    scaled = img.resize((round(img.width * s), round(img.height * s)), Image.LANCZOS)
    x, y = (W - scaled.width) // 2, (H - scaled.height) // 2
    paste_with_shadow(canvas, scaled, x, y)
    return canvas, (s, x, y)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    highlights = {}
    for sid, (src, kind, crop, hl, blurs) in SPECS.items():
        canvas, geo = compose(src, kind, crop, blurs)
        canvas.save(OUT / f"{sid}.jpg", quality=82, optimize=True, progressive=True)
        if hl and geo:
            s, ox, oy = geo
            cx, cy = (crop[0], crop[1]) if crop else (0, 0)
            x0 = (ox + (hl[0] - cx) * s) / W * 100 - PAD
            y0 = (oy + (hl[1] - cy) * s) / H * 100 - PAD
            x1 = (ox + (hl[2] - cx) * s) / W * 100 + PAD
            y1 = (oy + (hl[3] - cy) * s) / H * 100 + PAD
            x0, y0, x1, y1 = max(0, x0), max(0, y0), min(100, x1), min(100, y1)
            highlights[sid] = {k: round(v, 1) for k, v in zip("xywh", (x0, y0, x1 - x0, y1 - y0))}
    print(json.dumps(highlights, ensure_ascii=False))


if __name__ == "__main__":
    main()
