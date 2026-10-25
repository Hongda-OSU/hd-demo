# sparkles.gif: a tileable, twinkling sparkle texture on black, for mix-blend-mode: color-dodge.
# Black does nothing under color-dodge, so only the sparkles brighten what is beneath.
import math, random
from px import Img

SIZE, FRAMES = 128, 8
COLS = ['#ffffff', '#bff4ff', '#ffd1f0', '#fff0a8']

def frames():
    rng = random.Random(81)
    dots = [(rng.randrange(SIZE), rng.randrange(SIZE), rng.random(), rng.choice(COLS), rng.random() < .35)
            for _ in range(46)]
    out = []
    for f in range(FRAMES):
        im = Img(SIZE, SIZE, '#000000')
        def put(x, y, c): im.put(x % SIZE, y % SIZE, c)      # wrap, so the tile repeats seamlessly
        for x, y, phase, c, star in dots:
            b = math.sin(2 * math.pi * (f / FRAMES + phase))
            if b < .15:
                continue
            put(x, y, '#ffffff' if b > .6 else c)
            if b > .45:
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)): put(x + dx, y + dy, c)
            if star and b > .8:
                for dx, dy in ((2, 0), (-2, 0), (0, 2), (0, -2)): put(x + dx, y + dy, '#5a6a8a')
        out.append(im)
    return out
