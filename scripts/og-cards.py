#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Regenerate the Open Graph share cards.

Outputs public/og/nasvitlo.png (the site card) and public/og/cases/<slug>.png
(one per decision page). Run from the repo root:

    python3 scripts/og-cards.py

Needs Pillow (`pip install Pillow`). Brand faces (Charis SIL Bold, Fira Sans
Medium/Bold) are fetched from the google/fonts repo into .fonts-cache/ on
first run — the site itself loads them via next/font, which only ships woff2,
unusable for Pillow.

When a case's display title changes in src/content/summaries/<slug>.ts,
update CASES below and re-run. Titles are Ukrainian by design: one card per
case serves both locales.
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os, subprocess, textwrap

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FDIR = os.path.join(ROOT, ".fonts-cache")
FONTS = {
    "CharisSIL-Bold.ttf": "https://raw.githubusercontent.com/google/fonts/main/ofl/charissil/CharisSIL-Bold.ttf",
    "FiraSans-Medium.ttf": "https://raw.githubusercontent.com/google/fonts/main/ofl/firasans/FiraSans-Medium.ttf",
    "FiraSans-Bold.ttf": "https://raw.githubusercontent.com/google/fonts/main/ofl/firasans/FiraSans-Bold.ttf",
}
os.makedirs(FDIR, exist_ok=True)
for name, url in FONTS.items():
    path = os.path.join(FDIR, name)
    if not os.path.exists(path):
        print("fetching", name)
        subprocess.run(["curl", "-sL", "-o", path, url], check=True)

S = 2
W, H = 1200 * S, 630 * S
NIGHT = (20, 18, 15)
EMBER = (51, 19, 17)
CREAM = (244, 241, 234)
GOLD = (217, 171, 94)
MUTED = (203, 189, 184)
FAINT = (150, 138, 133)

CASES = [
    ("icj-cerd-icsft", "Україна проти Російської Федерації",
     "Міжнародний суд ООН · рішення 31 січня 2024",
     "4 порушення двох конвенцій — ICSFT і CERD"),
    ("icj-genocide", "Україна проти РФ: 32 держави-інтервенти",
     "Міжнародний суд ООН · рішення 2 лютого 2024",
     "Юрисдикцію за Конвенцією про геноцид підтверджено"),
    ("oschadbank", "Ощадбанк проти Російської Федерації",
     "Постійна палата третейського суду · 26 листопада 2018",
     "$1,1 млрд за експропріацію в Криму"),
    ("dtek-krymenergo", "ДТЕК Крименерго проти РФ",
     "Постійна палата третейського суду · 1 листопада 2023",
     "$207,8 млн + відсотки за кримську енергомережу"),
    ("icc-ukraine", "Ситуація в Україні",
     "Міжнародний кримінальний суд · ICC-01/22",
     "6 ордерів на арешт — одна вертикаль влади"),
    ("echr-ukraine-netherlands", "Україна і Нідерланди проти Росії",
     "ЄСПЛ, Велика палата · 9 липня 2025",
     "Системні порушення від Донбасу-2014 до вторгнення"),
    ("finland-torden", "Фінляндія проти Яна Петровського",
     "Окружний суд Гельсінкі · 14 березня 2025",
     "Довічне за воєнні злочини — універсальна юрисдикція"),
    ("hague-mh17", "Справа MH17: вирок у Гаазі",
     "Окружний суд Гааги · 17 листопада 2022",
     "Три довічні вироки за 298 загиблих"),
]

def font(name, size):
    return ImageFont.truetype(os.path.join(FDIR, name), size)

charis = font("CharisSIL-Bold.ttf", 84 * S)
charis_s = font("CharisSIL-Bold.ttf", 64 * S)
fira_b = font("FiraSans-Bold.ttf", 26 * S)
fira_m = font("FiraSans-Medium.ttf", 30 * S)
wordmark = font("CharisSIL-Bold.ttf", 40 * S)

def ground():
    img = Image.new("RGB", (W, H), NIGHT)
    glow = Image.new("L", (W, H), 0)
    gd = ImageDraw.Draw(glow)
    gd.ellipse([-500 * S, -500 * S, 900 * S, 300 * S], fill=110)
    glow = glow.filter(ImageFilter.GaussianBlur(120 * S))
    return Image.composite(Image.new("RGB", (W, H), EMBER), img, glow)

def lamp(img, cx):
    cone = Image.new("L", (W, H), 0)
    lg = ImageDraw.Draw(cone)
    lg.polygon([(cx - 14 * S, 92 * S), (cx + 14 * S, 92 * S),
                (cx + 95 * S, 260 * S), (cx - 95 * S, 260 * S)], fill=40)
    cone = cone.filter(ImageFilter.GaussianBlur(24 * S))
    img = Image.composite(Image.new("RGB", (W, H), (233, 213, 163)), img, cone)
    d = ImageDraw.Draw(img)
    d.line([(cx, 0), (cx, 56 * S)], fill=(90, 78, 66), width=2 * S)
    d.polygon([(cx - 36 * S, 88 * S), (cx + 36 * S, 88 * S),
               (cx + 17 * S, 56 * S), (cx - 17 * S, 56 * S)],
              fill=(212, 197, 165), outline=(160, 143, 112))
    d.ellipse([cx - 8 * S, 84 * S, cx + 8 * S, 100 * S], fill=(248, 240, 216))
    return img

def footer(d, X):
    d.line([(X, H - 120 * S), (W - 84 * S, H - 120 * S)], fill=(138, 110, 75), width=2 * S)
    d.text((X, H - 98 * S), "насвітло", font=wordmark, fill=CREAM)
    tail = "рішення міжнародних судів щодо агресії проти України"
    tw = d.textlength(tail, font=fira_b)
    d.text((W - 84 * S - tw, H - 88 * S), tail, font=fira_b, fill=FAINT)

def case_card(slug, title, eyebrow, kicker):
    img = lamp(ground(), W - 150 * S)
    d = ImageDraw.Draw(img)
    X, maxw = 84 * S, W - 84 * S - 260 * S
    d.text((X, 90 * S), eyebrow.upper(), font=fira_b, fill=GOLD)
    # Largest face that fits in two lines; three lines drop to the small face
    # so the kicker never crowds the footer rule.
    f, lines = charis, None
    for wc in (14, 16, 18, 20, 22, 24):
        cand = textwrap.wrap(title, width=wc)
        if len(cand) <= 2 and all(d.textlength(l, font=f) <= maxw for l in cand):
            lines = cand
            break
    if lines is None:
        f = charis_s
        for wc in (18, 20, 22, 24, 26, 28):
            cand = textwrap.wrap(title, width=wc)
            if len(cand) <= 3 and all(d.textlength(l, font=f) <= maxw for l in cand):
                lines = cand
                break
        lines = lines or textwrap.wrap(title, width=26)[:3]
    y, lh = 168 * S, int(f.size * 1.08)
    for l in lines:
        d.text((X, y), l, font=f, fill=CREAM)
        y += lh
    d.text((X, y + 26 * S), kicker, font=fira_m, fill=MUTED)
    footer(d, X)
    out = os.path.join(ROOT, "public/og/cases", f"{slug}.png")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    img.resize((1200, 630), Image.LANCZOS).save(out, optimize=True)
    print("wrote", out)

def site_card():
    img = Image.new("RGB", (W, H), NIGHT)
    glow = Image.new("L", (W, H), 0)
    gd = ImageDraw.Draw(glow)
    gd.ellipse([W // 2 - 700 * S, -420 * S, W // 2 + 700 * S, 260 * S], fill=110)
    glow = glow.filter(ImageFilter.GaussianBlur(120 * S))
    img = Image.composite(Image.new("RGB", (W, H), EMBER), img, glow)
    d = ImageDraw.Draw(img)
    cx, top = W // 2, 92 * S
    cone = Image.new("L", (W, H), 0)
    lg = ImageDraw.Draw(cone)
    lg.polygon([(cx - 26 * S, top + 58 * S), (cx + 26 * S, top + 58 * S),
                (cx + 190 * S, 400 * S), (cx - 190 * S, 400 * S)], fill=42)
    lg.ellipse([cx - 120 * S, top + 30 * S, cx + 120 * S, top + 160 * S], fill=70)
    cone = cone.filter(ImageFilter.GaussianBlur(38 * S))
    img = Image.composite(Image.new("RGB", (W, H), (233, 213, 163)), img, cone)
    d = ImageDraw.Draw(img)
    d.line([(cx, 0), (cx, top)], fill=(90, 78, 66), width=3 * S)
    d.polygon([(cx - 64 * S, top + 52 * S), (cx + 64 * S, top + 52 * S),
               (cx + 30 * S, top), (cx - 30 * S, top)],
              fill=(212, 197, 165), outline=(160, 143, 112))
    d.ellipse([cx - 13 * S, top + 46 * S, cx + 13 * S, top + 72 * S], fill=(248, 240, 216))
    big = font("CharisSIL-Bold.ttf", 132 * S)
    label = font("FiraSans-Bold.ttf", 22 * S)
    sub = font("FiraSans-Medium.ttf", 34 * S)
    micro = font("FiraSans-Medium.ttf", 17 * S)

    def centered(y, text, f, fill, ls=0):
        y *= S
        ls *= S
        if ls:
            widths = [d.textlength(ch, font=f) + ls for ch in text]
            x = (W - sum(widths) + ls) / 2
            for ch, w in zip(text, widths):
                d.text((x, y), ch, font=f, fill=fill)
                x += w
        else:
            d.text(((W - d.textlength(text, font=f)) / 2, y), text, font=f, fill=fill)

    centered(236, "ПРОЄКТ ФАКУЛЬТЕТУ ПРАВА УКУ", label, GOLD, ls=6)
    centered(282, "насвітло", big, CREAM)
    centered(462, "Рішення міжнародних судів щодо агресії проти України", sub, MUTED)
    d.line([(W // 2 - 260 * S, 545 * S), (W // 2 + 260 * S, 545 * S)], fill=(138, 110, 75), width=2 * S)
    centered(560, "N A S V I T L O  ·  I N T E R N A T I O N A L  C O U R T  D E C I S I O N S", micro, FAINT)
    out = os.path.join(ROOT, "public/og/nasvitlo.png")
    img.resize((1200, 630), Image.LANCZOS).save(out, optimize=True)
    print("wrote", out)

if __name__ == "__main__":
    site_card()
    for c in CASES:
        case_card(*c)
