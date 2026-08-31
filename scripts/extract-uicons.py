#!/usr/bin/env python3
"""
Generate inline SVG path data from the official Flaticon UIcons webfonts.

Flaticon UIcons (https://www.flaticon.com/uicons/interface-icons) is the ONLY
icon source in this project. Rather than shipping a ~300KB icon webfont, we
extract the outlines for exactly the icons in ICONS below straight out of the
licensed @flaticon/flaticon-uicons package and emit them as SVG path data.
Same icons, same source, a fraction of the bytes.

Run:  python3 scripts/extract-uicons.py
Out:  src/components/icons/paths.generated.ts
"""
import json, os, re, struct, zlib, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PKG = os.path.join(ROOT, "node_modules", "@flaticon", "flaticon-uicons")

# style key -> (css file, woff file glob prefix, class prefix)
STYLES = {
    "rs": ("css/regular/straight.css", "uicons-regular-straight", "fi-rs-"),
    "brands": ("css/brands/all.css", "uicons-brands", "fi-brands-"),
}

# Semantic name -> (style, uicons icon name)
# Keep this list as the single registry of icons used anywhere in the site.
ICONS = {
    # navigation & chrome
    "menu":            ("rs", "burger-menu"),
    "close":           ("rs", "cross"),
    "closeSmall":      ("rs", "cross-small"),
    "search":          ("rs", "search"),
    "filter":          ("rs", "filter"),
    "globe":           ("rs", "globe"),
    "chevronDown":     ("rs", "angle-small-down"),
    "chevronLeft":     ("rs", "angle-left"),
    "chevronRight":    ("rs", "angle-right"),
    # arrows
    "arrowRight":      ("rs", "arrow-right"),
    "arrowLeft":       ("rs", "arrow-left"),
    "arrowUpRight":    ("rs", "arrow-up-right"),
    "arrowSmallRight": ("rs", "arrow-small-right"),
    # actions
    "externalLink":    ("rs", "link-alt"),
    "share":           ("rs", "share"),
    "copy":            ("rs", "copy-alt"),
    "download":        ("rs", "download"),
    "check":           ("rs", "check"),
    "plus":            ("rs", "plus"),
    "minus":           ("rs", "minus-small"),
    "trash":           ("rs", "trash"),
    "edit":            ("rs", "edit"),
    "settings":        ("rs", "settings-sliders"),
    "signIn":          ("rs", "sign-in-alt"),
    "signOut":         ("rs", "sign-out-alt"),
    "lock":            ("rs", "lock"),
    "list":            ("rs", "list"),
    "dragHandle":      ("rs", "menu-dots-vertical"),
    # media
    "play":            ("rs", "play"),
    "pause":           ("rs", "pause"),
    "fullscreen":      ("rs", "expand"),
    "mute":            ("rs", "volume-mute"),
    "unmute":          ("rs", "volume"),
    "image":           ("rs", "picture"),
    # contact / meta
    "email":           ("rs", "envelope"),
    "phone":           ("rs", "phone-call"),
    "calendar":        ("rs", "calendar"),
    "clock":           ("rs", "clock"),
    "location":        ("rs", "marker"),
    "users":           ("rs", "users"),
    "user":            ("rs", "user-pen"),
    "browser":         ("rs", "browser"),
    "at":              ("rs", "at"),
    # typography tester
    "textSize":        ("rs", "text-size"),
    "lineWidth":       ("rs", "line-width"),
    "alignLeft":       ("rs", "align-left"),
    "alignCenter":     ("rs", "align-center"),
    "alignJustify":    ("rs", "align-justify"),
    "text":            ("rs", "text"),
    # theme toggle
    "sun":             ("rs", "sun"),
    "moon":            ("rs", "moon"),
    # social (brands)
    "instagram":       ("brands", "instagram"),
    "behance":         ("brands", "behance"),
    "linkedin":        ("brands", "linkedin"),
    "whatsapp":        ("brands", "whatsapp"),
    "telegram":        ("brands", "telegram"),
    "youtube":         ("brands", "youtube"),
    "x":               ("brands", "twitter-alt"),
    "dribbble":        ("brands", "dribbble"),
    "pinterest":       ("brands", "pinterest"),
}


def css_codepoints(css_path, prefix):
    css = open(css_path, encoding="utf-8").read()
    out = {}
    for m in re.finditer(r"\.%s([a-z0-9-]+):before\{content:\"\\([0-9a-fA-F]+)\"\}" % re.escape(prefix), css):
        out[m.group(1)] = int(m.group(2), 16)
    return out


def find_woff(prefix):
    d = os.path.join(PKG, "css")
    for f in sorted(os.listdir(d)):
        if f.startswith(prefix) and f.endswith(".woff"):
            return os.path.join(d, f)
    raise SystemExit("no woff for " + prefix)


def read_woff(path):
    """Decode a WOFF 1.0 container into {tag: decompressed bytes}."""
    d = open(path, "rb").read()
    if d[:4] != b"wOFF":
        raise SystemExit("not a woff: " + path)
    num_tables = struct.unpack(">H", d[12:14])[0]
    tables = {}
    for i in range(num_tables):
        o = 44 + i * 20
        tag = d[o:o + 4].decode("latin1")
        off, comp_len, orig_len = struct.unpack(">III", d[o + 4:o + 16])
        raw = d[off:off + comp_len]
        tables[tag] = zlib.decompress(raw) if comp_len < orig_len else raw
    return tables


def parse_cmap(data):
    n = struct.unpack(">H", data[2:4])[0]
    best = None
    for i in range(n):
        pid, eid, off = struct.unpack(">HHI", data[4 + i * 8:12 + i * 8])
        fmt = struct.unpack(">H", data[off:off + 2])[0]
        if fmt == 4:
            best = off
        elif fmt == 12 and best is None:
            best = off
    m = {}
    fmt = struct.unpack(">H", data[best:best + 2])[0]
    if fmt == 4:
        seg2 = struct.unpack(">H", data[best + 6:best + 8])[0]
        seg = seg2 // 2
        ends = struct.unpack(">%dH" % seg, data[best + 14:best + 14 + seg2])
        sp = best + 16 + seg2
        starts = struct.unpack(">%dH" % seg, data[sp:sp + seg2])
        dp = sp + seg2
        deltas = struct.unpack(">%dh" % seg, data[dp:dp + seg2])
        rp = dp + seg2
        ranges = struct.unpack(">%dH" % seg, data[rp:rp + seg2])
        for i in range(seg):
            for c in range(starts[i], min(ends[i], 0xFFFE) + 1):
                if ranges[i] == 0:
                    g = (c + deltas[i]) & 0xFFFF
                else:
                    gi = rp + i * 2 + ranges[i] + (c - starts[i]) * 2
                    if gi + 2 > len(data):
                        continue
                    g = struct.unpack(">H", data[gi:gi + 2])[0]
                    if g:
                        g = (g + deltas[i]) & 0xFFFF
                if g:
                    m[c] = g
    return m


def glyph_outline(glyf, loca, gid, depth=0):
    """Return list of contours; each contour is a list of (x, y, on_curve)."""
    if gid + 1 >= len(loca) or loca[gid] == loca[gid + 1]:
        return []
    d = glyf[loca[gid]:loca[gid + 1]]
    n_contours = struct.unpack(">h", d[0:2])[0]
    if n_contours < 0:
        # composite glyph
        if depth > 4:
            return []
        contours, p = [], 10
        while True:
            flags, gi = struct.unpack(">HH", d[p:p + 4])
            p += 4
            if flags & 1:  # ARG_1_AND_2_ARE_WORDS
                a1, a2 = struct.unpack(">hh", d[p:p + 4]); p += 4
            else:
                a1, a2 = struct.unpack(">bb", d[p:p + 2]); p += 2
            sa, sb, sc, sd = 1.0, 0.0, 0.0, 1.0
            if flags & 8:      # WE_HAVE_A_SCALE
                sa = sd = struct.unpack(">h", d[p:p + 2])[0] / 16384.0; p += 2
            elif flags & 0x40:  # X_AND_Y_SCALE
                sa = struct.unpack(">h", d[p:p + 2])[0] / 16384.0
                sd = struct.unpack(">h", d[p + 2:p + 4])[0] / 16384.0; p += 4
            elif flags & 0x80:  # TWO_BY_TWO
                sa, sb, sc, sd = [v / 16384.0 for v in struct.unpack(">hhhh", d[p:p + 8])]; p += 8
            dx, dy = (a1, a2) if flags & 2 else (0, 0)
            for c in glyph_outline(glyf, loca, gi, depth + 1):
                contours.append([(sa * x + sc * y + dx, sb * x + sd * y + dy, on) for x, y, on in c])
            if not flags & 0x20:  # MORE_COMPONENTS
                break
        return contours

    end_pts = struct.unpack(">%dH" % n_contours, d[10:10 + n_contours * 2])
    p = 10 + n_contours * 2
    ins_len = struct.unpack(">H", d[p:p + 2])[0]
    p += 2 + ins_len
    n_pts = end_pts[-1] + 1
    flags = []
    while len(flags) < n_pts:
        f = d[p]; p += 1
        flags.append(f)
        if f & 8:  # REPEAT
            r = d[p]; p += 1
            flags.extend([f] * r)
    flags = flags[:n_pts]

    def coords(short_bit, same_bit):
        vals, v = [], 0
        nonlocal p
        for f in flags:
            if f & short_bit:
                dv = d[p]; p += 1
                v += dv if f & same_bit else -dv
            elif not f & same_bit:
                v += struct.unpack(">h", d[p:p + 2])[0]; p += 2
            vals.append(v)
        return vals

    xs = coords(2, 16)
    ys = coords(4, 32)
    contours, start = [], 0
    for e in end_pts:
        contours.append([(xs[i], ys[i], bool(flags[i] & 1)) for i in range(start, e + 1)])
        start = e + 1
    return contours


def to_svg_path(contours, upem, size=24):
    """Quadratic TrueType contours -> SVG path, scaled into a `size` box, Y flipped."""
    s = size / upem

    def P(x, y):
        # UIcons draw within the em box; flip Y so the icon is upright in SVG space.
        return round(x * s, 3), round(size - y * s, 3)

    out = []
    for c in contours:
        if not c:
            continue
        # Rotate so the contour starts on an on-curve point.
        si = next((i for i, pt in enumerate(c) if pt[2]), None)
        if si is None:
            # All off-curve: synthesise a start at the midpoint of the last and first.
            mx = (c[-1][0] + c[0][0]) / 2
            my = (c[-1][1] + c[0][1]) / 2
            c = [(mx, my, True)] + c
            si = 0
        c = c[si:] + c[:si]
        x0, y0 = P(c[0][0], c[0][1])
        out.append("M%g %g" % (x0, y0))
        i, n = 1, len(c)
        while i <= n:
            cur = c[i % n]
            if cur[2]:
                x, y = P(cur[0], cur[1])
                out.append("L%g %g" % (x, y))
                i += 1
            else:
                nxt = c[(i + 1) % n]
                if nxt[2]:
                    ex, ey = nxt[0], nxt[1]
                    i += 2
                else:
                    ex, ey = (cur[0] + nxt[0]) / 2, (cur[1] + nxt[1]) / 2
                    i += 1
                cx, cy = P(cur[0], cur[1])
                px, py = P(ex, ey)
                out.append("Q%g %g %g %g" % (cx, cy, px, py))
        out.append("Z")
    return "".join(out)


def main():
    fonts = {}
    for key, (css_rel, woff_prefix, class_prefix) in STYLES.items():
        tables = read_woff(find_woff(woff_prefix))
        upem = struct.unpack(">H", tables["head"][18:20])[0]
        fmt = struct.unpack(">h", tables["head"][50:52])[0]
        loca_raw = tables["loca"]
        if fmt == 0:
            loca = [v * 2 for v in struct.unpack(">%dH" % (len(loca_raw) // 2), loca_raw)]
        else:
            loca = list(struct.unpack(">%dI" % (len(loca_raw) // 4), loca_raw))
        fonts[key] = {
            "cmap": parse_cmap(tables["cmap"]),
            "glyf": tables["glyf"],
            "loca": loca,
            "upem": upem,
            "cps": css_codepoints(os.path.join(PKG, css_rel), class_prefix),
        }

    paths, missing = {}, []
    for name, (style, icon) in sorted(ICONS.items()):
        f = fonts[style]
        cp = f["cps"].get(icon)
        if cp is None:
            missing.append("%s (%s/%s): no codepoint" % (name, style, icon))
            continue
        gid = f["cmap"].get(cp)
        if not gid:
            missing.append("%s (%s/%s): no glyph for U+%04X" % (name, style, icon, cp))
            continue
        d = to_svg_path(glyph_outline(f["glyf"], f["loca"], gid), f["upem"])
        if not d:
            missing.append("%s (%s/%s): empty outline" % (name, style, icon))
            continue
        paths[name] = d

    if missing:
        print("WARNING: could not extract:", file=sys.stderr)
        for m in missing:
            print("  -", m, file=sys.stderr)

    dest = os.path.join(ROOT, "src", "components", "icons", "paths.generated.ts")
    with open(dest, "w", encoding="utf-8") as fh:
        fh.write("// AUTO-GENERATED by scripts/extract-uicons.py — do not edit by hand.\n")
        fh.write("// Source: Flaticon UIcons Interface Icons (@flaticon/flaticon-uicons),\n")
        fh.write("// https://www.flaticon.com/uicons/interface-icons — the only icon source in this project.\n")
        fh.write("// Outlines extracted from the licensed webfont and inlined as 24x24 SVG paths.\n\n")
        fh.write("export const ICON_PATHS = {\n")
        for name in sorted(paths):
            style, icon = ICONS[name]
            fh.write("  /** uicons: %s %s */\n" % (style, icon))
            fh.write("  %s: %s,\n" % (name, json.dumps(paths[name])))
        fh.write("} as const;\n\n")
        fh.write("export type IconName = keyof typeof ICON_PATHS;\n")
    total = sum(len(v) for v in paths.values())
    print("extracted %d icons -> %s (%.1f KB of path data)" % (len(paths), dest, total / 1024))


if __name__ == "__main__":
    main()
