from px import *

def planet():                                   # square-1: ringed planet in a nebula
    rng = random.Random(51); im = Img(240, 240)
    vgrad(im, 0, 240, ramp('#05030d', '#0c0720', '#160d33', '#0c0720'), 1)
    for _ in range(9):                           # nebula clouds
        glow(im, rng.randrange(240), rng.randrange(240), rng.randint(30, 60), rng.choice(['#6b2fa0', '#2f4fa0', '#a02f7a']), .35)
    stars(im, 260, 240, rng, big=8)
    cx, cy, R = 118, 126, 58
    def ring(front):
        for y in range(cy - 30, cy + 31):
            for x in range(cx - 112, cx + 113):
                e = ((x - cx) / 108) ** 2 + ((y - cy + (x - cx) * .22) / 24) ** 2
                if .55 < e < 1 and not (.72 < e < .78):
                    in_front = (y - cy + (x - cx) * .22) > 0
                    behind_planet = (x - cx) ** 2 + (y - cy) ** 2 <= R * R
                    if front == in_front and (front or not behind_planet):
                        im.put(x, y, dither(ramp('#f2dcb0', '#c9a87e', '#8a6a52'), (e - .55) / .45, x, y))
    ring(False)
    bands = ramp('#f6c98a', '#e39a62', '#c4684e', '#8e3f4e', '#5a2a48')
    def pc(x, y):
        b = ((y - cy) / R + 1) / 2 + .06 * math.sin(x * .15 + y * .05)
        c = dither(bands, b, x, y)
        sh = (x - cx + 24) / (R * 1.4)                # terminator on the right
        if sh > .45 and bayer(x, y, min(1, (sh - .45) * 2.2)): c = hx('#1a0e24')
        return c
    disc(im, cx, cy, R, pc)
    ring(True)
    disc(im, 196, 52, 9, lambda x, y: '#b8c4d8' if x < 198 else '#5a6680')
    im.save('square-1', 5)

def lighthouse():                               # square-2: lighthouse on a cliff, beam over the sea
    rng = random.Random(61); im = Img(240, 240)
    vgrad(im, 0, 140, ramp('#060b22', '#0d1a40', '#1a2e5c', '#2b4470'), 1)
    stars(im, 150, 100, rng)
    disc(im, 190, 42, 10, lambda x, y: '#f2f0dc'); glow(im, 190, 42, 30, '#f2f0dc', .3)
    vgrad(im, 140, 240, ramp('#14284a', '#0c1a34', '#071022'), 1)
    for y in range(142, 240, 3):                 # wave lines and moon path
        for x in range(240):
            if rng.random() < .12: im.put(x, y, '#2a4a78')
        for x in range(180, 201):
            if rng.random() < .5 - (y - 140) / 260: im.put(x + rng.randint(-4, 4), y, '#e6e4c8')
    for y in range(10, 100):                     # beam from the lamp room
        for x in range(86, 240):
            if abs(y - 42 - (x - 86) * .08) < 2 + (x - 86) * .15 and bayer(x, y, .55 - (x - 86) / 420):
                o = im.p[y][x]; im.p[y][x] = tuple((a + b) // 2 for a, b in zip(o, hx('#fff2b0')))
    cliff = [(92 - 3 * math.sin(x * .2)) if x < 104 else (92 + (x - 104) ** 2 * .22 if x < 134 else 999) for x in range(240)]
    fill_below(im, cliff, None, None, lambda x, y, d: '#2f5a3c' if d < 3 else ('#1c2133' if bayer(x, y, .3) else '#141826'))
    base = int(cliff[78])
    for y in range(base - 46, base):
        w = 7 - (base - y) // 16
        for x in range(78 - w, 78 + w + 1):
            im.put(x, y, '#d9473a' if ((base - y) // 9) % 2 else '#f1ece0')
        im.put(78 + w, y, '#9a2f28' if ((base - y) // 9) % 2 else '#b8b2a4')
    rect(im, 72, base - 54, 84, base - 47, '#ffe08a'); rect(im, 70, base - 47, 86, base - 46, '#2a2a36')
    for x in range(71, 86): im.put(x, base - 55, '#2a2a36')
    for i in range(6): rect(im, 72 + i, base - 60 + i // 2, 84 - i, base - 60 + i // 2, '#c23a30')
    glow(im, 78, base - 50, 26, '#ffe08a', .5)
    rect(im, 92, base + 2, 100, base + 9, '#e8e2d4'); rect(im, 92, base, 100, base + 1, '#c23a30')
    rect(im, 95, base + 4, 97, base + 6, '#ffd36b')
    im.save('square-2', 5)

def jelly():                                    # square-3: jellyfish drifting through light rays
    rng = random.Random(71); im = Img(240, 240)
    vgrad(im, 0, 240, ramp('#5fd6d6', '#2a9cba', '#16648e', '#0c3462', '#061634'), 1)
    for k in range(5):                           # light rays
        x0 = 30 + k * 46
        for y in range(0, 200):
            for x in range(x0 + y // 4, x0 + y // 4 + 10):
                if bayer(x, y, .22 - y / 1100): o = im.p[y][x] if 0 <= x < 240 else None; o and im.put(x, y, tuple(min(255, v + 40) for v in o))
    def jellyfish(cx, cy, r, c1, c2):
        for t in range(-r + 2, r - 1, 3):        # tentacles
            for k in range(r * 3):
                x = cx + t + 2 * math.sin(k * .25 + t)
                im.put(x, cy + 2 + k, c2 if k % 4 else c1)
        glow(im, cx, cy - r / 2, r * 2.2, c1, .4)
        disc(im, cx, cy, r, lambda x, y: (None if y > cy + 1 else ('#ffffff' if (x - cx + r / 3) ** 2 + (y - cy + r / 2) ** 2 < r and y < cy - r / 2 else (c1 if y < cy - r / 3 or bayer(x, y, .5) else c2))))
        for x in range(cx - r, cx + r + 1, 2): im.put(x, cy + 1, c1)
    jellyfish(80, 70, 16, '#ff9ad6', '#c060c0')
    jellyfish(168, 118, 12, '#c8a0ff', '#7a5ad8')
    jellyfish(112, 160, 9, '#9af0ff', '#4aa8d8')
    for _ in range(26):                          # bubbles
        x, y, r = rng.randrange(240), rng.randrange(240), rng.choice([1, 1, 2, 3])
        for a in range(0, 360, 30):
            im.put(x + r * math.cos(math.radians(a)), y + r * math.sin(math.radians(a)), '#c8f6ff')
    for x in range(0, 240, rng.randint(5, 9)):   # seabed silhouettes
        h = rng.randint(10, 34)
        for k in range(h): im.put(x + 2 * math.sin(k * .3 + x), 239 - k, '#04102a'); im.put(x + 1 + 2 * math.sin(k * .3 + x), 239 - k, '#04102a')
    vgrad(im, 232, 240, ramp('#04102a', '#020a1c'), 1)
    im.save('square-3', 5)

if __name__ == '__main__':
    planet(); lighthouse(); jelly(); print('ok')
