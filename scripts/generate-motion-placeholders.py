#!/usr/bin/env python3
"""
Generate the animated GIF demo asset and the video poster still.

The site's media pipeline handles image / video / gif differently, so the demo
content needs a real file of each kind to exercise all three paths. The GIF is
written here directly (GIF89a + LZW); the matching .webm is recorded by
scripts/record-demo-video.mjs.

Run: python3 scripts/generate-motion-placeholders.py
"""
import math
import os
import struct
import zlib

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "media", "motion")
FFMPEG = "/opt/pw-browsers/ffmpeg-1011/ffmpeg-linux"

W, H = 960, 540

BG = (20, 20, 20)
INK = (242, 239, 232)
ACCENT = (198, 70, 43)


def frame_pixels(t: float):
    """One frame as a row-major list of (r,g,b). `t` runs 0..1 over the loop."""
    rows = []
    cx, cy = W / 2, H / 2
    # Two counter-rotating rings plus a sweeping bar — a type-in-motion sketch.
    a1 = t * math.tau
    bar_x = cx + math.cos(a1) * W * 0.22
    for y in range(H):
        row = []
        for x in range(W):
            dx, dy = x - cx, y - cy
            d = math.hypot(dx, dy)
            px = BG
            if abs(d - H * 0.30) < 10:
                px = INK
            if abs(d - H * 0.42) < 4:
                px = INK
            ang = (math.atan2(dy, dx) - a1) % math.tau
            if abs(d - H * 0.42) < 12 and ang < 0.9:
                px = ACCENT
            if abs(x - bar_x) < 9 and abs(dy) < H * 0.16:
                px = ACCENT
            row.append(px)
        rows.append(row)
    return rows


def png_bytes(rows) -> bytes:
    raw = b"".join(b"\x00" + b"".join(bytes(p) for p in row) for row in rows)

    def chunk(tag: bytes, data: bytes) -> bytes:
        return (
            struct.pack(">I", len(data))
            + tag
            + data
            + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
        )

    return (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", struct.pack(">IIBBBBB", W, H, 8, 2, 0, 0, 0))
        + chunk(b"IDAT", zlib.compress(raw, 6))
        + chunk(b"IEND", b"")
    )


# --------------------------------------------------------------------------- #
# GIF89a                                                                       #
# --------------------------------------------------------------------------- #

def lzw_encode(indices: bytes, min_code_size: int) -> bytes:
    """Standard GIF LZW: variable-width codes, table reset on overflow."""
    clear = 1 << min_code_size
    end = clear + 1
    table = {bytes([i]): i for i in range(clear)}
    next_code = end + 1
    code_size = min_code_size + 1

    out = bytearray()
    bitbuf = 0
    bitcount = 0

    def emit(code: int) -> None:
        nonlocal bitbuf, bitcount
        bitbuf |= code << bitcount
        bitcount += code_size
        while bitcount >= 8:
            out.append(bitbuf & 0xFF)
            bitbuf >>= 8
            bitcount -= 8

    emit(clear)
    buf = b""
    for byte in indices:
        nxt = buf + bytes([byte])
        if nxt in table:
            buf = nxt
            continue
        emit(table[buf])
        table[nxt] = next_code
        next_code += 1
        if next_code > (1 << code_size):
            if code_size < 12:
                code_size += 1
            else:
                emit(clear)
                table = {bytes([i]): i for i in range(clear)}
                next_code = end + 1
                code_size = min_code_size + 1
        buf = bytes([byte])
    if buf:
        emit(table[buf])
    emit(end)
    if bitcount:
        out.append(bitbuf & 0xFF)

    # Sub-blocks of at most 255 bytes.
    blocks = bytearray()
    for i in range(0, len(out), 255):
        part = out[i:i + 255]
        blocks.append(len(part))
        blocks.extend(part)
    blocks.append(0)
    return bytes(blocks)


def write_gif(path: str, frames, palette, w: int, h: int, delay_cs: int) -> None:
    """frames: list of bytes, each w*h palette indices. palette: list of (r,g,b)."""
    size = 1
    while (1 << size) < len(palette):
        size += 1
    entries = list(palette) + [(0, 0, 0)] * ((1 << size) - len(palette))

    out = bytearray(b"GIF89a")
    out += struct.pack("<HHBBB", w, h, 0xF0 | (size - 1), 0, 0)
    for r, g, b in entries:
        out += bytes((r, g, b))
    out += b"\x21\xFF\x0BNETSCAPE2.0\x03\x01\x00\x00\x00"  # loop forever

    min_code_size = max(2, size)
    for data in frames:
        out += b"\x21\xF9\x04\x04" + struct.pack("<H", delay_cs) + b"\x00\x00"
        out += b"\x2C" + struct.pack("<HHHHB", 0, 0, w, h, 0)
        out += bytes([min_code_size]) + lzw_encode(data, min_code_size)
    out += b"\x3B"
    with open(path, "wb") as fh:
        fh.write(bytes(out))


def main() -> None:
    os.makedirs(OUT, exist_ok=True)

    # A still poster, so a video reserves its layout space before it loads.
    with open(os.path.join(OUT, "reel-poster.png"), "wb") as fh:
        fh.write(png_bytes(frame_pixels(0.0)))
    print("wrote reel-poster.png")

    gw, gh, gframes = 480, 270, 24
    palette = [BG, INK, ACCENT]
    frames = []
    for f in range(gframes):
        t = f / gframes
        a1 = t * math.tau
        cx, cy = gw / 2, gh / 2
        bar_x = cx + math.cos(a1) * gw * 0.22
        data = bytearray(gw * gh)
        for y in range(gh):
            base = y * gw
            dy = y - cy
            for x in range(gw):
                dx = x - cx
                d = math.hypot(dx, dy)
                idx = 0
                if abs(d - gh * 0.30) < 5:
                    idx = 1
                ang = (math.atan2(dy, dx) - a1) % math.tau
                if abs(d - gh * 0.42) < 6 and ang < 0.9:
                    idx = 2
                if abs(x - bar_x) < 5 and abs(dy) < gh * 0.16:
                    idx = 2
                data[base + x] = idx
        frames.append(bytes(data))
    gif = os.path.join(OUT, "loop.gif")
    write_gif(gif, frames, palette, gw, gh, 100 // 12)
    print("wrote", gif, os.path.getsize(gif) // 1024, "KB")


if __name__ == "__main__":
    main()
