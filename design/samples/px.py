# Tiny pixel-art toolkit: dithered gradients, ridges, circles, PPM output.
import math, random
BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]
def hx(c): return tuple(int(c[i:i+2], 16) for i in (1, 3, 5))
def ramp(*cs): return [hx(c) for c in cs]
class Img:
    def __init__(s, w, h, fill='#000000'):
        s.w, s.h = w, h; s.p = [[hx(fill)] * w for _ in range(h)]
    def put(s, x, y, c):
        x, y = int(x), int(y)
        if 0 <= x < s.w and 0 <= y < s.h: s.p[y][x] = hx(c) if isinstance(c, str) else c
    def get(s, x, y): return s.p[int(y)][int(x)]
    def save(s, path, scale):
        import subprocess
        with open(path + '.ppm', 'wb') as f:
            f.write(f'P6 {s.w} {s.h} 255\n'.encode()); f.write(bytes(v for r in s.p for px in r for v in px))
        subprocess.run(['magick', path + '.ppm', '-filter', 'point', '-resize', f'{scale * 100}%', path + '.png'], check=True)
def dither(r, t, x, y):
    t = max(0.0, min(0.9999, t)) * (len(r) - 1); i, f = int(t), t - int(t)
    return r[i + 1] if f * 16 > BAYER[y % 4][x % 4] + 0.5 else r[i]
def bayer(x, y, t): return t * 16 > BAYER[y % 4][x % 4] + 0.5
def vgrad(im, y0, y1, r, power=1.0, x0=0, x1=None):
    for y in range(y0, y1):
        for x in range(x0, x1 if x1 is not None else im.w):
            im.p[y][x] = dither(r, ((y - y0) / max(1, y1 - y0)) ** power, x, y)
def stars(im, n, ymax, rng, cols=('#ffffff', '#cfe8ff', '#ffe3f1'), big=0):
    for _ in range(n):
        im.put(rng.randrange(im.w), rng.randrange(ymax), rng.choice(cols))
    for _ in range(big):
        x, y = rng.randrange(im.w), rng.randrange(ymax)
        for dx, dy in ((0, 0), (1, 0), (-1, 0), (0, 1), (0, -1)): im.put(x + dx, y + dy, '#ffffff' if dx == dy == 0 else '#9fb8ff')
def ridge(w, base, freqs, seed):
    r = random.Random(seed); ph = [r.random() * 6.28 for _ in freqs]
    return [base - sum(a * math.sin(x * f + p) for (f, a), p in zip(freqs, ph)) for x in range(w)]
def fill_below(im, tops, c, ymax=None, fn=None):
    for x in range(im.w):
        for y in range(max(0, int(tops[x])), ymax if ymax else im.h):
            im.put(x, y, fn(x, y, y - tops[x]) if fn else c)
def disc(im, cx, cy, r, colfn):
    for y in range(int(cy - r), int(cy + r) + 1):
        for x in range(int(cx - r), int(cx + r) + 1):
            if (x - cx) ** 2 + (y - cy) ** 2 <= r * r:
                c = colfn(x, y)
                if c: im.put(x, y, c)
def rect(im, x0, y0, x1, y1, c):
    for y in range(int(y0), int(y1) + 1):
        for x in range(int(x0), int(x1) + 1): im.put(x, y, c)
def glow(im, cx, cy, r, c, strength=0.6):
    cc = hx(c)
    for y in range(int(cy - r), int(cy + r) + 1):
        for x in range(int(cx - r), int(cx + r) + 1):
            d = math.hypot(x - cx, y - cy) / r
            if d < 1 and 0 <= x < im.w and 0 <= y < im.h and bayer(x, y, (1 - d) * strength):
                o = im.p[y][x]; im.p[y][x] = tuple((a + b) // 2 for a, b in zip(o, cc))
