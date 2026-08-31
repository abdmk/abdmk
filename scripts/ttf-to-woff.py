#!/usr/bin/env python3
"""
Convert the Graphik Arabic TTFs into WOFF 1.0.

WOFF 1.0 is a plain sfnt with each table zlib-deflated, so it is self-compressing
(~1/3 the size of the raw TTF) and supported by every browser we target. We ship
WOFF + the original TTF as a fallback source in @font-face.

Run: python3 scripts/ttf-to-woff.py <src-dir> <dest-dir>
"""
import os, struct, sys, zlib


def ttf_to_woff(data: bytes) -> bytes:
    sfnt_version = data[0:4]
    num_tables = struct.unpack(">H", data[4:6])[0]
    entries = []
    for i in range(num_tables):
        o = 12 + i * 16
        tag = data[o:o + 4]
        checksum, offset, length = struct.unpack(">III", data[o + 4:o + 16])
        entries.append([tag, checksum, offset, length])
    entries.sort(key=lambda e: e[0])

    directory_size = 44 + num_tables * 20
    body = b""
    dir_entries = []
    for tag, checksum, offset, length in entries:
        raw = data[offset:offset + length]
        comp = zlib.compress(raw, 9)
        # Per spec, store uncompressed when deflate does not help.
        payload = comp if len(comp) < length else raw
        pad = (-len(body)) % 4
        body += b"\0" * pad
        dir_entries.append((tag, directory_size + len(body), len(payload), length, checksum))
        body += payload

    # The final table block must be padded too: OTS rejects a WOFF whose last
    # table would extend past EOF once its 4-byte padding is accounted for.
    body += b"\0" * ((-len(body)) % 4)

    total = directory_size + len(body)
    header = struct.pack(
        ">4sIIHHIHHIIII",
        b"wOFF", int.from_bytes(sfnt_version, "big"), total, num_tables, 0,
        len(data), 0, 0,   # uncompressed sfnt size, major/minor version
        0, 0, 0, 0,        # meta offset/length/origLength, priv offset
    ) + struct.pack(">I", 0)
    directory = b"".join(
        struct.pack(">4sIIII", tag, off, comp_len, orig_len, checksum)
        for tag, off, comp_len, orig_len, checksum in dir_entries
    )
    return header + directory + body


WEIGHTS = {
    "Extralight": 200, "Light": 300, "Arabic": 400, "Medium": 500, "Semibold": 600,
}


def main():
    src, dest = sys.argv[1], sys.argv[2]
    os.makedirs(dest, exist_ok=True)
    for f in sorted(os.listdir(src)):
        if not f.endswith(".ttf"):
            continue
        stem = f.split("-", 1)[-1].replace(".ttf", "")          # Graphik_ArabicMedium
        suffix = stem.replace("Graphik_Arabic", "") or "Arabic"  # Medium | Arabic
        weight = WEIGHTS.get(suffix, 400)
        out = "GraphikArabic-%d" % weight
        raw = open(os.path.join(src, f), "rb").read()
        woff = ttf_to_woff(raw)
        open(os.path.join(dest, out + ".woff"), "wb").write(woff)
        open(os.path.join(dest, out + ".ttf"), "wb").write(raw)
        print("%-28s -> %s.woff  %dK -> %dK" % (f, out, len(raw) // 1024, len(woff) // 1024))


if __name__ == "__main__":
    main()
