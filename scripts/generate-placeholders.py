#!/usr/bin/env python3
"""
Generate placeholder artwork for the demo content.

These are deliberately abstract editorial compositions in the site palette, not
grey boxes: they let the layout be judged at real density and are sized to the
aspect ratios the grid actually uses. Replace them by uploading real work from
/admin — nothing in the code references them by name outside content JSON.

Run: python3 scripts/generate-placeholders.py
"""
import hashlib
import math
import os
import random

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "media")

# Warm, print-leaning palette. Each entry is (background, ink, accent).
SCHEMES = [
    ("#EFEBE3", "#141414", "#C6462B"),
    ("#141414", "#F2EFE8", "#D9A441"),
    ("#1E2A32", "#EDE8DE", "#E2705A"),
    ("#E6E1D6", "#243027", "#7C6A4F"),
    ("#F2EFE8", "#2B2118", "#3E6B5A"),
    ("#2B2118", "#EFE7D8", "#C99B5E"),
    ("#DCD6C8", "#161616", "#9B3B2E"),
    ("#101820", "#E8E4DA", "#6C8EA0"),
]


def rng_for(seed: str) -> random.Random:
    return random.Random(int(hashlib.sha256(seed.encode()).hexdigest()[:12], 16))


def composition(seed: str, w: int, h: int, label: str = "") -> str:
    r = rng_for(seed)
    bg, ink, accent = SCHEMES[r.randrange(len(SCHEMES))]
    parts = [f'<rect width="{w}" height="{h}" fill="{bg}"/>']

    # Weighted so no single motif dominates a contact sheet of covers.
    style = r.choice(
        ["grid", "grid", "arcs", "arcs", "stack", "stack", "counter", "rules", "rules", "orbit"]
    )
    m = min(w, h)

    if style == "grid":
        cols, rows = r.choice([(3, 4), (4, 5), (5, 6), (6, 8)])
        cw, ch = w / cols, h / rows
        for i in range(cols):
            for j in range(rows):
                if r.random() < 0.34:
                    fill = accent if r.random() < 0.3 else ink
                    op = round(r.uniform(0.25, 1.0), 2)
                    parts.append(
                        f'<rect x="{i*cw:.1f}" y="{j*ch:.1f}" width="{cw:.1f}" height="{ch:.1f}" '
                        f'fill="{fill}" opacity="{op}"/>'
                    )

    elif style == "arcs":
        for i in range(r.randint(3, 6)):
            cx = r.uniform(0, w)
            cy = r.uniform(0, h)
            rad = r.uniform(m * 0.15, m * 0.62)
            fill = accent if r.random() < 0.35 else ink
            if r.random() < 0.5:
                parts.append(
                    f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{rad:.1f}" fill="none" '
                    f'stroke="{fill}" stroke-width="{r.uniform(1.5, 14):.1f}" opacity="0.85"/>'
                )
            else:
                a = r.choice([0, 90, 180, 270])
                parts.append(
                    f'<path d="M{cx:.1f} {cy:.1f} m {-rad:.1f} 0 a {rad:.1f} {rad:.1f} 0 0 1 '
                    f'{rad*2:.1f} 0 z" fill="{fill}" opacity="0.9" '
                    f'transform="rotate({a} {cx:.1f} {cy:.1f})"/>'
                )

    elif style == "stack":
        n = r.randint(4, 9)
        pad = m * 0.08
        bh = (h - pad * 2) / n
        for i in range(n):
            bw = r.uniform(w * 0.22, w * 0.92)
            x = pad if r.random() < 0.7 else w - pad - bw
            fill = accent if r.random() < 0.28 else ink
            parts.append(
                f'<rect x="{x:.1f}" y="{pad + i*bh:.1f}" width="{bw:.1f}" '
                f'height="{bh*r.uniform(0.35, 0.8):.1f}" fill="{fill}" '
                f'opacity="{r.uniform(0.45, 1.0):.2f}"/>'
            )

    elif style == "counter":
        # A large geometric "counter" shape, the way a type specimen crop reads.
        cx, cy = w * r.uniform(0.35, 0.65), h * r.uniform(0.35, 0.65)
        rad = m * r.uniform(0.3, 0.46)
        sw = rad * r.uniform(0.22, 0.42)
        parts.append(
            f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{rad:.1f}" fill="none" '
            f'stroke="{ink}" stroke-width="{sw:.1f}"/>'
        )
        parts.append(
            f'<rect x="{cx:.1f}" y="{cy - rad - sw/2:.1f}" width="{rad*1.5:.1f}" '
            f'height="{sw:.1f}" fill="{accent}"/>'
        )
        parts.append(
            f'<rect x="{cx - sw/2:.1f}" y="{cy:.1f}" width="{sw:.1f}" '
            f'height="{rad*1.4:.1f}" fill="{accent}"/>'
        )

    elif style == "rules":
        n = r.randint(14, 34)
        for i in range(n):
            y = h * (i + 0.5) / n
            lw = w * r.uniform(0.12, 0.95)
            x = 0 if r.random() < 0.6 else w - lw
            parts.append(
                f'<rect x="{x:.1f}" y="{y:.1f}" width="{lw:.1f}" '
                f'height="{h/n*r.uniform(0.1, 0.4):.1f}" '
                f'fill="{accent if r.random() < 0.15 else ink}" '
                f'opacity="{r.uniform(0.3, 0.95):.2f}"/>'
            )

    else:  # orbit
        cx, cy = w / 2, h / 2
        for i in range(r.randint(5, 10)):
            ang = r.uniform(0, math.tau)
            dist = r.uniform(0, m * 0.4)
            rad = r.uniform(m * 0.04, m * 0.2)
            parts.append(
                f'<circle cx="{cx + math.cos(ang)*dist:.1f}" cy="{cy + math.sin(ang)*dist:.1f}" '
                f'r="{rad:.1f}" fill="{accent if r.random() < 0.3 else ink}" '
                f'opacity="{r.uniform(0.3, 0.95):.2f}"/>'
            )

    if label:
        fs = max(11, int(m * 0.032))
        parts.append(
            f'<text x="{m*0.045:.0f}" y="{h - m*0.04:.0f}" fill="{ink}" opacity="0.55" '
            f'font-family="ui-sans-serif, system-ui, sans-serif" font-size="{fs}" '
            f'letter-spacing="{fs*0.14:.1f}">{label.upper()}</text>'
        )

    inner = "".join(parts)
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" '
        f'viewBox="0 0 {w} {h}" role="img"><title>{label or seed}</title>{inner}</svg>'
    )


def logo(seed: str, name: str) -> str:
    """A restrained wordmark-ish lockup for company logos."""
    r = rng_for(seed)
    w, h = 320, 120
    initials = "".join(p[0] for p in name.split()[:2]).upper() or "AB"
    ink = "#141414"
    shapes = {
        0: f'<circle cx="60" cy="60" r="30" fill="none" stroke="{ink}" stroke-width="6"/>',
        1: f'<rect x="32" y="32" width="56" height="56" fill="none" stroke="{ink}" stroke-width="6"/>',
        2: f'<path d="M32 88 L60 30 L88 88 Z" fill="none" stroke="{ink}" stroke-width="6"/>',
        3: f'<rect x="32" y="32" width="56" height="56" fill="{ink}"/>',
    }[r.randrange(4)]
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">'
        f'<title>{name}</title>{shapes}'
        f'<text x="108" y="74" fill="{ink}" font-family="ui-sans-serif, system-ui, sans-serif" '
        f'font-size="42" font-weight="600" letter-spacing="-1">{initials}</text></svg>'
    )


def write(rel: str, svg: str) -> None:
    dest = os.path.join(OUT, rel)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    with open(dest, "w", encoding="utf-8") as fh:
        fh.write(svg)


# (slug, number of inner images) for each demo project.
PROJECTS = [
    ("mizan-identity", 7),
    ("sard-typeface-campaign", 6),
    ("beirut-book-fair", 6),
    ("qamar-packaging", 5),
    ("nahda-editorial", 6),
    ("halaqa-social", 5),
    ("tariq-wayfinding", 5),
    ("aswat-motion", 4),
    ("madad-app", 5),
    ("khatt-poster-series", 6),
]

FONTS = [("sard", 5), ("mizan-kufi", 4), ("raqim-text", 4), ("nuqta-display", 4)]

COMPANIES = [
    ("shorouk-studio", "Shorouk Studio"),
    ("levant-agency", "Levant Agency"),
    ("qamar-foods", "Qamar Foods"),
    ("nahda-press", "Nahda Press"),
    ("aswat-media", "Aswat Media"),
    ("madad-tech", "Madad Tech"),
    ("beirut-book-fair-org", "Beirut Book Fair"),
    ("independent", "Independent"),
]

SERVICES = [
    "brand-identity", "logo-design", "arabic-typography", "font-design",
    "arabic-calligraphy", "art-direction", "motion-design", "editorial-design",
    "social-media-design", "packaging-design", "ui-ux",
]

WORKSHOPS = [
    "arabic-type-foundations", "identity-sprint", "calligraphy-to-type",
    "editorial-systems", "type-design-course", "brand-systems-course",
]


def main() -> None:
    count = 0
    for slug, n in PROJECTS:
        write(f"projects/{slug}/cover.svg", composition(f"{slug}-cover", 1600, 1200, slug.replace("-", " ")))
        count += 1
        for i in range(1, n + 1):
            ratio = [(1600, 1000), (1200, 1500), (1600, 900), (1400, 1400)][i % 4]
            write(f"projects/{slug}/{i:02d}.svg", composition(f"{slug}-{i}", *ratio))
            count += 1

    for slug, n in FONTS:
        write(f"fonts/{slug}/preview.svg", composition(f"font-{slug}", 1600, 1000, slug))
        count += 1
        for i in range(1, n + 1):
            write(f"fonts/{slug}/specimen-{i:02d}.svg", composition(f"font-{slug}-{i}", 1600, 1100))
            count += 1

    for slug, name in COMPANIES:
        write(f"companies/{slug}/logo.svg", logo(f"logo-{slug}", name))
        write(f"companies/{slug}/01.svg", composition(f"co-{slug}-1", 1600, 1000, name))
        write(f"companies/{slug}/02.svg", composition(f"co-{slug}-2", 1400, 1400))
        count += 3

    for slug in SERVICES:
        write(f"services/{slug}.svg", composition(f"svc-{slug}", 1200, 900, slug.replace("-", " ")))
        count += 1

    for slug in WORKSHOPS:
        write(f"workshops/{slug}/cover.svg", composition(f"ws-{slug}", 1600, 1000, slug.replace("-", " ")))
        write(f"workshops/{slug}/01.svg", composition(f"ws-{slug}-1", 1400, 1000))
        count += 2

    write("about/portrait.svg", composition("portrait", 1200, 1500, "portrait"))
    write("og/default.svg", composition("og-default", 1200, 630, "abdulmalek"))
    count += 2

    print(f"wrote {count} placeholder files to {OUT}")


if __name__ == "__main__":
    main()
